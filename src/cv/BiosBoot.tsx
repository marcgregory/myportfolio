import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { biosLoadingResources, cvProfile } from "@/data/cv-content";

type BiosBootProps = {
  onStart: () => void;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const formatBiosDate = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();
  return `${month}/${day}/${year}`;
};

const BiosBoot = ({ onStart }: BiosBootProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [showStart, setShowStart] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const reducedMotion = useRef(prefersReducedMotion());

  useEffect(() => {
    const reduced = reducedMotion.current;
    const headerLines = [
      "",
      "Turno,",
      "Marc Gregory Inc.",
      "",
      `Released: ${cvProfile.updated}`,
      "",
      "MG BIOS (C)2026 Marc Gregory Inc.,",
      "MGP S13 2020-2026 Special UC131S",
      "",
      "MGP Showcase(tm) XX 113",
      "",
      "Checking RAM : 14000 OK",
      "",
      `LOADING RESOURCES (0/${biosLoadingResources.length})`,
    ];

    if (reduced) {
      setLines([
        ...headerLines.slice(0, -1),
        `LOADING RESOURCES (${biosLoadingResources.length}/${biosLoadingResources.length})`,
        ...biosLoadingResources.map(
          (name, index) =>
            `Loaded ${name} ... ${Math.min(37 + index * 4, 99)}%`,
        ),
        "",
        "Press DEL to enter SETUP , ESC to skip memory test",
        "",
        formatBiosDate(),
        "",
        "Marc Gregory Portfolio Showcase 2026",
        "",
        "Click start to begin",
      ]);
      setLoadingIndex(biosLoadingResources.length);
      setShowStart(true);
      return;
    }

    let cancelled = false;
    const timeline: string[] = [...headerLines.slice(0, -1)];

    const pushLine = (line: string) => {
      if (cancelled) return;
      timeline.push(line);
      setLines([...timeline]);
    };

    const run = async () => {
      for (const line of headerLines.slice(0, -1)) {
        pushLine(line);
        await new Promise((resolve) => window.setTimeout(resolve, 120));
      }

      for (let index = 0; index < biosLoadingResources.length; index += 1) {
        if (cancelled) return;
        const resource = biosLoadingResources[index];
        const progress = Math.min(37 + index * 4 + Math.floor(Math.random() * 3), 99);
        setLoadingIndex(index + 1);
        pushLine(
          `LOADING RESOURCES (${index + 1}/${biosLoadingResources.length})`,
        );
        pushLine(`Loaded ${resource} ... ${progress}%`);
        await new Promise((resolve) => window.setTimeout(resolve, 165));
      }

      pushLine("");
      pushLine("Press DEL to enter SETUP , ESC to skip memory test");
      pushLine("");
      pushLine(formatBiosDate());
      pushLine("");
      pushLine("Marc Gregory Portfolio Showcase 2026");
      pushLine("");
      pushLine("Click start to begin");
      setShowStart(true);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || reducedMotion.current) return;

    const lineElements =
      containerRef.current.querySelectorAll<HTMLElement>(".cv-bios-line");

    gsap.fromTo(
      lineElements,
      { opacity: 0, y: 4 },
      {
        opacity: 1,
        y: 0,
        duration: 0.18,
        stagger: 0.02,
        ease: "power1.out",
        overwrite: "auto",
      },
    );
  }, [lines, loadingIndex]);

  return (
    <div className="cv-bios">
      <div className="cv-bios-inner" ref={containerRef}>
        {lines.map((line, index) => (
          <div
            key={`${index}-${line}`}
            className="cv-bios-line is-visible"
            aria-hidden={line === ""}
          >
            {line || "\u00a0"}
          </div>
        ))}
        {!showStart && <span className="cv-bios-cursor" aria-hidden />}
        {showStart && (
          <button type="button" className="cv-bios-start" onClick={onStart}>
            START
          </button>
        )}
      </div>
    </div>
  );
};

export default BiosBoot;
