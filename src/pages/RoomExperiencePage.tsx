import RoomBootScreen from "@/room/RoomBootScreen";
import RoomCanvas from "@/room/RoomCanvas";
import { InteractablesProvider } from "@/room/InteractablesContext";
import { useFindInteractable } from "@/room/useInteractables";
import RoomGuide from "@/room/RoomGuide";
import RoomMiniApps from "@/room/RoomMiniApps";
import type { InteractableId, RoomFocusState, RoomMiniAppId } from "@/room/room-types";
import { stopRoomTvAudio } from "@/room/room-tv-audio";
import { startRoomAmbient, stopRoomAmbient } from "@/room/useRoomAmbient";
import { useCallback, useEffect, useState } from "react";
import { useGoHome } from "@/utils/useGoHome";
import "@/room/room-ui.css";

const useIsMobileRoom = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(max-width: 767px)").matches
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

const RoomExperiencePage = () => (
  <InteractablesProvider>
    <RoomExperiencePageContent />
  </InteractablesProvider>
);

const RoomExperiencePageContent = () => {
  const isMobile = useIsMobileRoom();
  const [booted, setBooted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [nearbyId, setNearbyId] = useState<InteractableId | null>(null);
  const [focusState, setFocusState] = useState<RoomFocusState>({
    active: false,
    label: "",
  });
  const [miniAppId, setMiniAppId] = useState<RoomMiniAppId | null>(null);
  const [guideActive, setGuideActive] = useState(false);

  const goHome = useGoHome();

  const exitRoom = useCallback(() => {
    stopRoomTvAudio();
    stopRoomAmbient();
    goHome();
  }, [goHome]);

  const closeMiniApp = useCallback(() => setMiniAppId(null), []);

  const enterStudio = useCallback(() => {
    void startRoomAmbient();
    document.querySelector<HTMLElement>("#room-lock-target")?.click();
  }, []);

  useEffect(() => {
    if (!isLocked) return;
    setGuideActive(true);
  }, [isLocked]);

  useEffect(() => {
    if (!guideActive || !nearbyId) return;
    setGuideActive(false);
  }, [guideActive, nearbyId]);

  useEffect(() => {
    if (!guideActive) return;
    const timer = window.setTimeout(() => setGuideActive(false), 45_000);
    return () => window.clearTimeout(timer);
  }, [guideActive]);

  useEffect(() => {
    if (!miniAppId) return;
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  }, [miniAppId]);

  useEffect(() => {
    document.title = "Marc Gregory — 3D Studio";
    document.documentElement.classList.add("dark");
    stopRoomTvAudio();

    const onLockChange = () => {
      const locked = document.pointerLockElement !== null;
      setIsLocked(locked);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (miniAppId) {
        if (miniAppId === "monitor") {
          exitRoom();
        } else {
          closeMiniApp();
        }
        return;
      }

      if (!document.pointerLockElement && !focusState.active) {
        exitRoom();
      }
    };

    document.addEventListener("pointerlockchange", onLockChange);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerlockchange", onLockChange);
      window.removeEventListener("keydown", onKeyDown);
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
      stopRoomTvAudio();
      stopRoomAmbient();
    };
  }, [closeMiniApp, exitRoom, focusState.active, miniAppId]);

  const nearby = useFindInteractable(nearbyId);

  if (isMobile) {
    return (
      <div className="room-root room-mobile-fallback">
        <div>
          <h1>Room is desktop-first</h1>
          <p>
            The walkable studio needs a keyboard and mouse. Open this page on a
            laptop or desktop to explore.
          </p>
          <div
            className="room-enter-card__actions"
            style={{ justifyContent: "center" }}
          >
            <button
              type="button"
              className="room-btn room-btn--ghost"
              onClick={goHome}
            >
              Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="room-root">
      {!booted && <RoomBootScreen onReady={() => setBooted(true)} />}

      {booted && (
        <div id="room-lock-target" className="room-canvas-wrap">
          <RoomCanvas
            isLocked={isLocked}
            onExit={exitRoom}
            onMiniAppOpen={setMiniAppId}
            onNearbyChange={setNearbyId}
            onFocusChange={setFocusState}
          />
        </div>
      )}

      {booted && (
        <div className="room-hud" aria-live="polite">
          <div className="room-hud__top room-hud__panel">
            <span className="room-chip">
              <span className="room-chip__dot" />
              Marc&apos;s Dev Studio
            </span>
            <div className="room-hud__actions">
              <button
                type="button"
                className="room-btn room-btn--ghost"
                onClick={exitRoom}
              >
                Exit
              </button>
            </div>
          </div>

          {focusState.active && !miniAppId && (
            <div className="room-hud__center room-hud__panel">
              <div className="room-focus-banner">
                <span className="room-focus-banner__label">Focusing</span>
                <strong>{focusState.label}</strong>
              </div>
            </div>
          )}

          {!isLocked && !focusState.active && !miniAppId && (
            <div className="room-hud__center room-hud__panel">
              <div className="room-enter-card">
                <h1>Walk into the studio</h1>
                <p>
                  Explore the room, follow the guide arrows, and press{" "}
                  <kbd>E</kbd> at each station.
                </p>
                <div className="room-enter-card__actions">
                  <button
                    type="button"
                    className="room-btn room-btn--primary"
                    onClick={enterStudio}
                  >
                    Enter room
                  </button>
                </div>
              </div>
            </div>
          )}

          {isLocked && guideActive && !miniAppId && (
            <RoomGuide active onDismiss={() => setGuideActive(false)} />
          )}

          {isLocked && !focusState.active && !miniAppId && (
            <div className="room-hud__bottom">
              <div className="room-prompt">
                {nearby ? (
                  <>
                    <span className="room-prompt__title">{nearby.label}</span>
                    <span className="room-prompt__hint">
                      Press <kbd>E</kbd> — {nearby.hint}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="room-prompt__title">Explore</span>
                    <span className="room-prompt__hint">
                      Walk up to an object to interact
                    </span>
                  </>
                )}
              </div>
              <div className="room-help">
                <kbd>W</kbd>
                <kbd>A</kbd>
                <kbd>S</kbd>
                <kbd>D</kbd> move · <kbd>Shift</kbd> sprint · <kbd>E</kbd> use ·{" "}
                <kbd>Esc</kbd> close app / unlock
              </div>
            </div>
          )}
        </div>
      )}

      <RoomMiniApps appId={miniAppId} onClose={closeMiniApp} onGoHome={exitRoom} />
    </div>
  );
};

export default RoomExperiencePage;
