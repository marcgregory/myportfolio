import { createContext } from "react";
import type { InteractableDef, InteractableId } from "./room-types";
import type * as THREE from "three";

export type AnchorMap = Partial<Record<InteractableId, THREE.Vector3>>;

export type InteractablesContextValue = {
  items: InteractableDef[];
  registerAnchors: (anchors: AnchorMap) => void;
};

export const InteractablesContext =
  createContext<InteractablesContextValue | null>(null);
