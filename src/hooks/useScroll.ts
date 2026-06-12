import { useState, useEffect } from "react";

const useScroll = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let animationFrame = 0;

    const handleScroll = () => {
      if (animationFrame) return;

      animationFrame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        animationFrame = 0;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrolled;
};

export { useScroll };
