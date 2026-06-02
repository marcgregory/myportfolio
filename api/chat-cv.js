import { readFileSync, statSync } from "node:fs";
import path from "node:path";

const SYSTEM_PROMPT =
  "You are Marc Gregory’s portfolio assistant. Answer using only the provided CV context and portfolio project context. Prefer CV context first. If the CV does not contain the answer, use the portfolio project context. If the answer is not present in either source, say: ‘I don’t have that information in Marc’s CV or portfolio.’ Do not guess or invent anything.";

const FALLBACK_MODEL = "openrouter/free";
const SERVICE_FALLBACK =
  "I’m having trouble reaching Marc’s CV assistant right now. Please try again later.";
const NOT_FOUND_RESPONSE = "I don’t have that information in Marc’s CV or portfolio.";
const MAX_MESSAGE_LENGTH = 600;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 6;
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

async function callOpenRouter(question) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY");
  }

  const model = process.env.OPENROUTER_MODEL || FALLBACK_MODEL;
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "X-Title": "Marc Gregory Portfolio CV Chatbot",
    },
    body: JSON.stringify({
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
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenRouter failed with ${response.status}: ${details}`);
  }

  const payload = await response.json();
  return payload?.choices?.[0]?.message?.content?.trim();
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
        answer: "Please enter a question about Marc’s CV.",
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

    const answer = await callOpenRouter(message);

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
