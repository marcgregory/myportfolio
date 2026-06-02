import path from "path";
import { pathToFileURL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

type VercelHandler = (
  request: IncomingMessage,
  response: ServerResponse,
) => Promise<void> | void;

function localApiPlugin(env: Record<string, string>): Plugin {
  const chatCvHandlerUrl = pathToFileURL(
    path.resolve(__dirname, "api", "chat-cv.js"),
  ).href;

  return {
    name: "local-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url ?? "/", "http://localhost").pathname;

        if (pathname !== "/api/chat-cv") {
          next();
          return;
        }

        try {
          process.env.OPENROUTER_API_KEY ||= env.OPENROUTER_API_KEY;
          process.env.OPENROUTER_MODEL ||= env.OPENROUTER_MODEL;
          process.env.GROQ_API_KEY ||= env.GROQ_API_KEY;
          process.env.GROQ_MODEL ||= env.GROQ_MODEL;

          const module = await import(`${chatCvHandlerUrl}?t=${Date.now()}`);
          const handler = module.default as VercelHandler;
          await handler(request, response);
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [localApiPlugin(env), react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
