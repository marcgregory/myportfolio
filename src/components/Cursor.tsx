import { useEffect, useRef, useState } from "react";

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateHoverState = (isEnter: boolean) => {
      setIsHovering(isEnter);
    };

    // Add mouse move listener
    window.addEventListener("mousemove", updatePosition);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      "button, a, .card, .magnetic, .hover-lift, .tilt-hover, .scale-hover, .float-hover"
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => updateHoverState(true));
      el.addEventListener("mouseleave", () => updateHoverState(false));
    });

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", updatePosition);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", () => updateHoverState(true));
        el.removeEventListener("mouseleave", () => updateHoverState(false));
      });
    };
  }, []);

  return (
    <>
      {/* Cursor - main dot */}
      <div
        ref={cursorRef}
        className={`fixed left-[calc(${position.x}px+-12px)] top-[calc(${position.y}px+-12px)] w-2 h-2 ${
          isHovering
            ? "bg-primary/70 scale-5"
            : "bg-primary/70"
        } rounded-full pointer-none z-[9999] mix-blend-difference transition-transform duration-50`}
      />

      {/* Cursor follower - outer circle */}
      <div
        ref={followerRef}
        className={`fixed left-[calc(${position.x}px+-24px)] top-[calc(${position.y}px+-24px)] w-6 h-6 border border-primary/50 rounded-full pointer-none z-[9998] ${
          isHovering
            ? "scale-3"
            : "scale-1.5"
        } mix-blend-duration duration-100`}
      />
    </>
  );
};

export default Cursor;