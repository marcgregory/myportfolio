import { useRef } from "react";
import { interactables } from "./interactables-data";
import type { InteractableId, RoomMiniAppId } from "./room-types";

type InteractableActionHandlers = {
  onExit: () => void;
  onMiniAppOpen: (id: RoomMiniAppId) => void;
};

const miniAppActions = new Set<InteractableId>([
  "monitor",
  "projects",
  "radio",
  "contact",
  "github",
]);

export const useInteractableActions = ({
  onExit,
  onMiniAppOpen,
}: InteractableActionHandlers): ((id: InteractableId | null) => void) => {
  const lastActionAt = useRef(0);

  return (id) => {
    if (!id) return;
    const now = performance.now();
    if (now - lastActionAt.current < 450) return;
    lastActionAt.current = now;

    const target = interactables.find((item) => item.id === id);
    if (!target) return;

    if (target.action === "exit") {
      onExit();
      return;
    }

    if (miniAppActions.has(id)) {
      onMiniAppOpen(id as RoomMiniAppId);
    }
  };
};
