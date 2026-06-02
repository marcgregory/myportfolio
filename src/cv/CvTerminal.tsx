import { useRef, useState, type FormEvent } from "react";

const serviceFallback =
  "I am having trouble reaching Marc's CV assistant right now. Please try again later.";

const CvTerminal = () => {
  const [log, setLog] = useState<string[]>([
    "MG CV Terminal v1.0",
    "Type a question about Marc's experience, skills, or projects.",
    "",
  ]);
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const append = (line: string) => {
    setLog((current) => [...current, line]);
    window.requestAnimationFrame(() => {
      logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
    });
  };

  const submitQuestion = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isWaiting) return;

    append(`> ${trimmed}`);
    setInput("");
    setIsWaiting(true);

    try {
      const response = await fetch("/api/chat-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const payload = await response.json().catch(() => ({
        answer: serviceFallback,
        error: true,
      }));
      const answer =
        typeof payload.answer === "string" && payload.answer.trim()
          ? payload.answer.trim()
          : serviceFallback;
      append(answer);
      append("");
    } catch {
      append(serviceFallback);
      append("");
    } finally {
      setIsWaiting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitQuestion(input);
  };

  return (
    <div className="cv-terminal">
      <div className="cv-terminal-log" ref={logRef}>
        {log.map((line, index) => (
          <div key={`${index}-${line.slice(0, 24)}`}>{line || "\u00a0"}</div>
        ))}
        {isWaiting && <div>Reading CV...</div>}
      </div>
      <form className="cv-terminal-input-row" onSubmit={handleSubmit}>
        <span>{">"}</span>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about Marc's CV"
          maxLength={600}
          disabled={isWaiting}
          aria-label="Terminal input"
        />
      </form>
    </div>
  );
};

export default CvTerminal;
