import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useViewport } from "@/hooks/useViewport";

interface ViewportMountProps {
  /** Function that returns the JSX to mount when in viewport */
  render: () => React.ReactNode;
  /** Fallback UI while loading */
  fallback?: React.ReactNode;
  /** Options for the IntersectionObserver */
  rootMargin?: string;
  threshold?: number;
}

/**
 * Component that mounts a lazy component when it enters the viewport.
 * Uses IntersectionObserver to detect visibility.
 */
export function ViewportMount({
  render,
  fallback = null,
  rootMargin = "200px",
  threshold = 0,
}: ViewportMountProps) {
  const [ref, inView] = useViewport<HTMLDivElement>({ rootMargin, threshold });
  const [shouldMount, setShouldMount] = useState(false);

  // Mount the component when it comes into view
  useEffect(() => {
    if (inView) {
      setShouldMount(true);
    }
  }, [inView]);

  // If we want to unmount when leaving viewport, we could do that here.
  // For now, we keep it mounted once it's in view (like lazy loading).
  // If you want to unmount, uncomment the following:
  // useEffect(() => {
  //   if (!inView) {
  //     setShouldMount(false);
  //   }
  // }, [inView]);

  return (
    <>
      <div ref={ref} style={{ minHeight: "1px" }} />
      {shouldMount && (
        <Suspense fallback={fallback}>
          {render()}
        </Suspense>
      )}
    </>
  );
}