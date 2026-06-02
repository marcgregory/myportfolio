import { useEffect, useRef, useState } from "react";

type UseCountUpOptions = {
  duration?: number;
  delay?: number;
  enabled?: boolean;
  decimals?: number;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const useCountUp = (
  end: number,
  {
    duration = 1600,
    delay = 0,
    enabled = true,
    decimals = 0,
  }: UseCountUpOptions = {}
) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setCount(end);
      return;
    }

    if (!enabled) {
      setCount(end);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const startAnimation = () => {
          const startedAt = performance.now();

          const tick = (now: number) => {
            const elapsed = now - startedAt;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - (1 - progress) ** 3;
            const next =
              decimals > 0
                ? Number((eased * end).toFixed(decimals))
                : Math.round(eased * end);

            setCount(next);

            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(tick);
        };

        if (delay > 0) {
          window.setTimeout(startAnimation, delay);
        } else {
          startAnimation();
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [decimals, delay, duration, enabled, end]);

  return { count, ref };
};
