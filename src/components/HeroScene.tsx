import { lazy, Suspense, useEffect, useState } from "react";

const HeroSceneWebgl = lazy(() => import("./HeroSceneWebgl"));

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const useMobileScene = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(max-width: 767px)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return isMobile;
};

const requestIdle = (callback: () => void) => {
  if ("requestIdleCallback" in window) {
    const idleId = window.requestIdleCallback(callback, { timeout: 1400 });
    return () => window.cancelIdleCallback(idleId);
  }

  const timeoutId = globalThis.setTimeout(callback, 900);
  return () => globalThis.clearTimeout(timeoutId);
};

const HeroScene = () => {
  const isMobile = useMobileScene();
  const [isReducedMotion, setIsReducedMotion] = useState(prefersReducedMotion);
  const [canLoadWebgl, setCanLoadWebgl] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setIsReducedMotion(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isReducedMotion) {
      setCanLoadWebgl(false);
      return;
    }

    return requestIdle(() => setCanLoadWebgl(true));
  }, [isReducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="hero-scene-layer pointer-events-none absolute inset-0 z-[1] opacity-85"
    >
      {canLoadWebgl && (
        <Suspense fallback={null}>
          <HeroSceneWebgl isMobile={isMobile} />
        </Suspense>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_66%_44%,rgba(56,189,248,0.08),transparent_34%),radial-gradient(circle_at_58%_47%,rgba(124,58,237,0.09),transparent_42%)] dark:bg-[radial-gradient(circle_at_66%_44%,rgba(56,189,248,0.1),transparent_34%),radial-gradient(circle_at_58%_47%,rgba(124,58,237,0.11),transparent_42%)]" />
    </div>
  );
};

export default HeroScene;
