import { AnimatePresence, motion } from "motion/react";
import {
  Bot,
  Loader,
  MessageCircle,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  isError?: boolean;
};

type CvChatWidgetProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi, I’m Marc’s AI assistant. Ask me about his skills, experience, projects, or background.",
};

const quickQuestions = [
  "What are Marc’s main skills?",
  "What projects has Marc built?",
  "What is Marc’s work experience?",
  "How can I contact Marc?",
];

const serviceFallback =
  "I’m having trouble reaching Marc’s CV assistant right now. Please try again later.";

const createMessageId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const renderInlineMarkdown = (text: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-extrabold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });

const renderMarkdownMessage = (content: string) => {
  const blocks = content
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, blockIndex) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const hasListItems = lines.some((line) => /^([-*•])\s+/.test(line));

    if (hasListItems) {
      const leadingParagraphLines: string[] = [];
      const listItems: string[][] = [];

      lines.forEach((line) => {
        if (/^([-*•])\s+/.test(line)) {
          listItems.push([line.replace(/^([-*•])\s+/, "")]);
          return;
        }

        const currentListItem = listItems.at(-1);

        if (currentListItem) {
          currentListItem.push(line);
        } else {
          leadingParagraphLines.push(line);
        }
      });

      return (
        <div key={`${block}-${blockIndex}`} className="my-2 first:mt-0 last:mb-0">
          {leadingParagraphLines.length > 0 && (
            <p className="mb-2">
              {leadingParagraphLines.map((line, lineIndex) => (
                <span key={`${line}-${lineIndex}`}>
                  {renderInlineMarkdown(line)}
                  {lineIndex < leadingParagraphLines.length - 1 && <br />}
                </span>
              ))}
            </p>
          )}
          <ul className="list-disc space-y-2 pl-5 marker:text-sky-200">
            {listItems.map((itemLines, lineIndex) => (
              <li key={`${itemLines.join("-")}-${lineIndex}`} className="pl-1">
                {itemLines.map((line, itemLineIndex) => (
                  <span key={`${line}-${itemLineIndex}`}>
                    {renderInlineMarkdown(line)}
                    {itemLineIndex < itemLines.length - 1 && <br />}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <p key={`${block}-${blockIndex}`} className="my-2 first:mt-0 last:mb-0">
        {lines.map((line, lineIndex) => (
          <span key={`${line}-${lineIndex}`}>
            {renderInlineMarkdown(line)}
            {lineIndex < lines.length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  });
};

const CvChatWidget = ({ isOpen, onClose, onOpen }: CvChatWidgetProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 220);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isWaiting]);

  const submitQuestion = async (question: string) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isWaiting) {
      return;
    }

    setInput("");
    setErrorMessage("");
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: createMessageId(),
        role: "user",
        content: trimmedQuestion,
      },
    ]);
    setIsWaiting(true);

    try {
      const response = await fetch("/api/chat-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmedQuestion }),
      });
      const payload = await response.json().catch(() => ({
        answer: serviceFallback,
        error: true,
      }));
      const answer =
        typeof payload.answer === "string" && payload.answer.trim()
          ? payload.answer.trim()
          : serviceFallback;

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createMessageId(),
          role: "assistant",
          content: answer,
          isError: !response.ok || Boolean(payload.error),
        },
      ]);

      if (!response.ok || payload.error) {
        setErrorMessage(answer);
      }
    } catch {
      setErrorMessage(serviceFallback);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createMessageId(),
          role: "assistant",
          content: serviceFallback,
          isError: true,
        },
      ]);
    } finally {
      setIsWaiting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitQuestion(input);
  };

  return (
    <div className="fixed bottom-6 right-4 z-50 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 22, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="glass-panel mb-4 flex h-[min(620px,calc(100vh-120px))] w-[min(390px,calc(100vw-40px))] flex-col overflow-hidden rounded-2xl shadow-[0_28px_90px_rgba(3,7,18,0.62)]"
            aria-label="Marc CV chat assistant"
          >
            <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-white/[0.04] px-4 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-400/15 text-violet-100 ring-1 ring-violet-200/20">
                  <Sparkles className="size-4" />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-black text-white">
                    Marc&apos;s AI CV Assistant
                  </h2>
                  <p className="text-xs font-medium text-sky-200/80">
                    Answers from Marc&apos;s CV and portfolio
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-violet-300/40 hover:bg-violet-400/15 hover:text-white focus-visible:ring-2 focus-visible:ring-violet-300"
                aria-label="Close chat"
              >
                <X className="size-4" />
              </button>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((message) => {
                const isAssistant = message.role === "assistant";

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      isAssistant ? "justify-start" : "justify-end"
                    )}
                  >
                    {isAssistant && (
                      <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-400/12 text-sky-200 ring-1 ring-sky-200/20">
                        <Bot className="size-4" />
                      </span>
                    )}
                    <div
                      className={cn(
                        "max-w-[82%] overflow-hidden rounded-2xl px-4 py-3 text-sm leading-6 break-words",
                        isAssistant
                          ? "rounded-tl-md border border-white/10 bg-white/[0.055] text-slate-200"
                          : "rounded-tr-md bg-gradient-to-br from-sky-500 via-violet-500 to-fuchsia-600 font-semibold text-white",
                        message.isError &&
                          "border-rose-300/30 bg-rose-500/10 text-rose-100"
                      )}
                    >
                      {isAssistant ? (
                        <div className="space-y-2 leading-6 text-slate-200 [&_strong]:text-white">
                          {renderMarkdownMessage(message.content)}
                        </div>
                      ) : (
                        message.content
                      )}
                    </div>
                    {!isAssistant && (
                      <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-400/15 text-violet-100 ring-1 ring-violet-200/20">
                        <User className="size-4" />
                      </span>
                    )}
                  </div>
                );
              })}

              {isWaiting && (
                <div className="flex gap-3">
                  <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-400/12 text-sky-200 ring-1 ring-sky-200/20">
                    <Bot className="size-4" />
                  </span>
                  <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-semibold text-slate-300">
                    <Loader className="size-4 animate-spin text-violet-200" />
                    Reading Marc&apos;s CV and portfolio
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-white/10 bg-slate-950/42 p-4">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    disabled={isWaiting}
                    onClick={() => void submitQuestion(question)}
                    className="shrink-0 cursor-pointer rounded-full border border-violet-200/15 bg-violet-400/10 px-3 py-2 text-xs font-bold text-violet-100 transition hover:border-sky-200/35 hover:bg-sky-400/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>

              {errorMessage && (
                <p className="mb-3 rounded-lg border border-rose-300/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold leading-5 text-rose-100">
                  {errorMessage}
                </p>
              )}

              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about Marc's CV"
                  maxLength={600}
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.05] px-4 text-sm font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-violet-300/50 focus:ring-2 focus:ring-violet-400/20"
                />
                <button
                  type="submit"
                  disabled={isWaiting || !input.trim()}
                  className="button-gradient flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  {isWaiting ? (
                    <Loader className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </button>
              </form>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={isOpen ? onClose : onOpen}
        whileHover={{ y: -3, scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        className="button-gradient ml-auto flex size-14 cursor-pointer items-center justify-center rounded-full text-white shadow-[0_18px_48px_rgba(124,58,237,0.46)] ring-1 ring-white/15 sm:size-16"
        aria-label={isOpen ? "Close CV chat" : "Open CV chat"}
      >
        {isOpen ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </motion.button>
    </div>
  );
};

export default CvChatWidget;
