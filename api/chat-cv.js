import { readFileSync, statSync } from "node:fs";
import path from "node:path";

const SYSTEM_PROMPT =
  "You are Marc Gregory's portfolio assistant. Answer using only the provided CV context and portfolio project context. Prefer CV context first. If the CV does not contain the answer, use the portfolio project context. If the answer is not present in either source, say: 'I don't have that information in Marc's CV or portfolio.' Do not guess or invent anything.";

const OPENROUTER_DEFAULT_MODEL = "qwen/qwen3-coder:free";
const GROQ_DEFAULT_MODEL = "llama-3.3-70b-versatile";
const SERVICE_FALLBACK =
  "I'm having trouble reaching Marc's CV assistant right now. Please try again later.";
const GRACEFUL_PROVIDER_FALLBACK =
  "The AI assistant is experiencing high traffic right now. Please try again shortly.";
const NOT_FOUND_RESPONSE = "I don't have that information in Marc's CV or portfolio.";
const MAX_MESSAGE_LENGTH = 600;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 6;
const PROVIDER_TIMEOUT_MS = 20_000;
const NON_FALLBACK_PROVIDER_STATUSES = new Set([400, 401, 403, 422]);
const rateLimitStore = new Map();

let cachedCvContext = null;
let cachedCvContextMtime = 0;
let cachedProjectContext = null;
let cachedProjectContextMtime = 0;

function getCvContext() {
  const cvPath = path.join(process.cwd(), "data", "marc-gregory-cv.md");
  const stats = statSync(cvPath);

  if (!cachedCvContext || stats.mtimeMs > cachedCvContextMtime) {
    cachedCvContext = readFileSync(cvPath, "utf8");
    cachedCvContextMtime = stats.mtimeMs;
  }

  return cachedCvContext;
}

function getProjectContext() {
  const projectsPath = path.join(process.cwd(), "data", "portfolio-projects.json");
  const stats = statSync(projectsPath);

  if (!cachedProjectContext || stats.mtimeMs > cachedProjectContextMtime) {
    const projects = JSON.parse(readFileSync(projectsPath, "utf8"));
    cachedProjectContext = JSON.stringify(
      projects.map(({ title, description, techStack, liveUrl, category }) => ({
        title,
        description,
        techStack,
        liveUrl,
        category,
      })),
      null,
      2,
    );
    cachedProjectContextMtime = stats.mtimeMs;
  }

  return cachedProjectContext;
}

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(payload));
}

function getClientId(request) {
  const forwardedFor = request.headers["x-forwarded-for"];
  const rawIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
  return rawIp?.split(",")[0]?.trim() || request.socket?.remoteAddress || "unknown";
}

function isRateLimited(clientId) {
  const now = Date.now();
  const current = rateLimitStore.get(clientId);

  if (!current || now > current.resetAt) {
    rateLimitStore.set(clientId, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function normalizeBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === "string") {
    return JSON.parse(body);
  }

  return body;
}

async function readBody(request) {
  if (request.body) {
    return normalizeBody(request.body);
  }

  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return normalizeBody(rawBody);
}

class ProviderError extends Error {
  constructor(provider, message, { status, fallbackEligible = false } = {}) {
    super(message);
    this.name = "ProviderError";
    this.provider = provider;
    this.status = status;
    this.fallbackEligible = fallbackEligible;
  }
}

function createChatRequestBody(model, question) {
  return {
    model,
    temperature: 0.2,
    max_tokens: 220,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `CV context:\n${getCvContext()}\n\nPortfolio project context:\n${getProjectContext()}\n\nVisitor question:\n${question}\n\nKeep the answer short, professional, and recruiter-friendly. Prefer CV context first. If the answer is not in the CV but exists in the portfolio project context, answer from the portfolio project context. If neither source contains the answer, reply exactly: ${NOT_FOUND_RESPONSE}`,
      },
    ],
  };
}

function isFallbackEligibleStatus(status) {
  if (!status || NON_FALLBACK_PROVIDER_STATUSES.has(status)) {
    return false;
  }

  return status === 408 || status === 429 || status >= 500;
}

function hasFallbackEligibleMessage(message) {
  const normalizedMessage = String(message).toLowerCase();
  return (
    normalizedMessage.includes("rate") ||
    normalizedMessage.includes("quota") ||
    normalizedMessage.includes("timeout") ||
    normalizedMessage.includes("temporar") ||
    normalizedMessage.includes("upstream")
  );
}

function shouldFallbackToGroq(error) {
  if (error?.fallbackEligible) {
    return true;
  }

  if (NON_FALLBACK_PROVIDER_STATUSES.has(error?.status)) {
    return false;
  }

  return hasFallbackEligibleMessage(error?.message);
}

function getProviderFailureLabel(error) {
  if (error?.status) {
    return error.status;
  }

  if (error?.message) {
    return error.message;
  }

  return "unknown error";
}

async function fetchProvider(provider, url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      const details = await response.text();
      const fallbackEligible =
        isFallbackEligibleStatus(response.status) ||
        (!NON_FALLBACK_PROVIDER_STATUSES.has(response.status) &&
          hasFallbackEligibleMessage(details));

      throw new ProviderError(
        provider,
        `${provider} failed with ${response.status}: ${details}`,
        {
          status: response.status,
          fallbackEligible,
        },
      );
    }

    const payload = await response.json();
    return payload?.choices?.[0]?.message?.content?.trim();
  } catch (error) {
    if (error instanceof ProviderError) {
      throw error;
    }

    const isTimeout = error?.name === "AbortError";
    throw new ProviderError(
      provider,
      `${provider} ${isTimeout ? "timeout" : "network failure"}`,
      {
        fallbackEligible: true,
      },
    );
  } finally {
    clearTimeout(timeout);
  }
}

async function callOpenRouter(question) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY");
  }

  const model = process.env.OPENROUTER_MODEL || OPENROUTER_DEFAULT_MODEL;
  return fetchProvider("OpenRouter", "https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "X-Title": "Marc Gregory Portfolio CV Chatbot",
    },
    body: JSON.stringify(createChatRequestBody(model, question)),
  });
}

async function callGroq(question) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const model = process.env.GROQ_MODEL || GROQ_DEFAULT_MODEL;
  return fetchProvider("Groq", "https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createChatRequestBody(model, question)),
  });
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, {
      answer: "Only POST requests are supported.",
      error: true,
    });
    return;
  }

  const clientId = getClientId(request);

  if (isRateLimited(clientId)) {
    sendJson(response, 429, {
      answer: "Please wait a moment before asking another question.",
      error: true,
    });
    return;
  }

  try {
    const body = await readBody(request);
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      sendJson(response, 400, {
        answer: "Please enter a question about Marc's CV.",
        error: true,
      });
      return;
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      sendJson(response, 400, {
        answer: "Please keep your question shorter.",
        error: true,
      });
      return;
    }

    let answer;

    try {
      answer = await callOpenRouter(message);
    } catch (error) {
      console.error(
        `[chat-cv] OpenRouter failed with ${getProviderFailureLabel(error)}`,
      );

      if (!shouldFallbackToGroq(error)) {
        throw error;
      }

      console.info("[chat-cv] Falling back to Groq");

      try {
        answer = await callGroq(message);
        console.info("[chat-cv] Groq success");
      } catch (fallbackError) {
        console.error("[chat-cv] Groq failed", fallbackError);
        console.info("[chat-cv] Returning graceful fallback response");
        sendJson(response, 200, {
          answer: GRACEFUL_PROVIDER_FALLBACK,
          error: false,
        });
        return;
      }
    }

    sendJson(response, 200, {
      answer: answer || NOT_FOUND_RESPONSE,
      error: false,
    });
  } catch (error) {
    console.error(error);
    sendJson(response, 500, {
      answer: SERVICE_FALLBACK,
      error: true,
    });
  }
}
