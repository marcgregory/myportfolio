import { useEffect, useState, useRef } from "react";

/**
 * Hook that returns a ref and a boolean indicating if the element is in viewport.
 * Uses IntersectionObserver API.
 * @param options - IntersectionObserver options (rootMargin, threshold)
 * @returns [ref, inView]
 */
export function useViewport<T extends HTMLElement = HTMLElement>(
  options: { rootMargin?: string; threshold?: number } = {}
): [React.MutableRefObject<T | null>, boolean] {
  const { rootMargin = "0px", threshold = 0 } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { rootMargin, threshold });

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return [ref, inView];
}