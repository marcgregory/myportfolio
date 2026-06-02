import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "./ui/button";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > 520);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <Button
      type="button"
      size="icon"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-24 right-4 z-[60] size-12 rounded-full border border-violet-200/20 bg-[#101735]/[0.86] text-white shadow-[0_14px_40px_rgba(0,0,0,0.34)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/50 hover:bg-violet-400/[0.18] hover:shadow-[0_0_34px_rgba(124,58,237,0.42)] sm:bottom-24 sm:right-6 sm:size-13 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp className="size-5" />
    </Button>
  );
};

export default ScrollToTop;
