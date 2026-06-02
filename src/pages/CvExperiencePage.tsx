import { useEffect, useState } from "react";
import BiosBoot from "@/cv/BiosBoot";
import RetroDesktop from "@/cv/RetroDesktop";
import { useGoHome } from "@/utils/useGoHome";
import "@/cv/cv-retro.css";

type CvPhase = "boot" | "desktop";

const CvExperiencePage = () => {
  const [phase, setPhase] = useState<CvPhase>("boot");

  const goHome = useGoHome();

  useEffect(() => {
    document.title = "Marc Gregory — CV Showcase";
    document.documentElement.classList.remove("dark");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (phase === "boot") {
        setPhase("desktop");
        return;
      }

      goHome();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goHome, phase]);

  return (
    <div className="cv-root min-h-screen">
      {phase === "boot" ? (
        <BiosBoot onStart={() => setPhase("desktop")} />
      ) : (
        <RetroDesktop onExit={goHome} />
      )}
    </div>
  );
};

export default CvExperiencePage;
