import { useEffect, useState } from "react";

const bootLines = [
  "MARC_DEV_STUDIO v1.0",
  "Initializing WebGL renderer...",
  "Loading room geometry...",
  "Binding interactables...",
  "System ready.",
];

type RoomBootScreenProps = {
  onReady: () => void;
};

const RoomBootScreen = ({ onReady }: RoomBootScreenProps) => {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timers: number[] = [];

    bootLines.forEach((line, index) => {
      timers.push(
        window.setTimeout(() => {
          setVisibleLines((current) => [...current, line]);
        }, 220 + index * 260)
      );
    });

    timers.push(
      window.setTimeout(() => {
        setFadeOut(true);
      }, 220 + bootLines.length * 260 + 380)
    );

    timers.push(
      window.setTimeout(() => {
        onReady();
      }, 220 + bootLines.length * 260 + 900)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [onReady]);

  return (
    <div className={`room-boot${fadeOut ? " room-boot--fade" : ""}`}>
      <div className="room-boot__crt">
        <p className="room-boot__title">&gt; STUDIO_BOOT.SYS</p>
        <ul className="room-boot__log">
          {visibleLines.map((line) => (
            <li key={line}>&gt; {line}</li>
          ))}
        </ul>
        <span className="room-boot__cursor" aria-hidden />
      </div>
    </div>
  );
};

export default RoomBootScreen;
