import { useContext } from "react";
import { InteractablesContext } from "./interactables-context";
import { interactables } from "./interactables-data";
import type { InteractableId } from "./room-types";

export const useInteractableDefs = () => {
  const ctx = useContext(InteractablesContext);
  return ctx?.items ?? interactables;
};

export const useRegisterInteractableAnchors = () => {
  const ctx = useContext(InteractablesContext);
  return ctx?.registerAnchors ?? (() => undefined);
};

export const useFindInteractable = (id: InteractableId | null) => {
  const items = useInteractableDefs();
  if (!id) return null;
  return items.find((item) => item.id === id) ?? null;
};
