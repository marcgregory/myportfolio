import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RetroWindowProps = {
  id: string;
  title: string;
  isActive: boolean;
  isMinimized: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onMove: (position: { x: number; y: number }) => void;
  children: ReactNode;
};

const RetroWindow = ({
  title,
  isActive,
  isMinimized,
  position,
  onClose,
  onMinimize,
  onFocus,
  onMove,
  children,
}: RetroWindowProps) => {
  const dragOffset = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!dragOffset.current) return;
      onMove({
        x: event.clientX - dragOffset.current.x,
        y: event.clientY - dragOffset.current.y,
      });
    };

    const handlePointerUp = () => {
      dragOffset.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [onMove]);

  const handleTitlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(max-width: 767px)").matches) return;
    onFocus();
    dragOffset.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
  };

  return (
    <section
      className={cn("cv-window", isActive && "is-active", isMinimized && "is-minimized")}
      style={{ left: position.x, top: position.y }}
      onPointerDown={onFocus}
      role="dialog"
      aria-label={title}
    >
      <div
        className="cv-window-titlebar"
        onPointerDown={handleTitlePointerDown}
      >
        <span className="cv-window-title">{title}</span>
        <div className="cv-window-controls">
          <button
            type="button"
            className="cv-window-btn"
            aria-label={`Minimize ${title}`}
            onClick={onMinimize}
          >
            _
          </button>
          <button
            type="button"
            className="cv-window-btn"
            aria-label={`Close ${title}`}
            onClick={onClose}
          >
            x
          </button>
        </div>
      </div>
      <div className="cv-window-body">{children}</div>
    </section>
  );
};

export default RetroWindow;
