import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { interactables } from "./interactables-data";
import { mergeInteractablesWithAnchors } from "./interactable-anchors";
import type { InteractableDef, InteractableId } from "./room-types";
import type * as THREE from "three";

type AnchorMap = Partial<Record<InteractableId, THREE.Vector3>>;

type InteractablesContextValue = {
  items: InteractableDef[];
  registerAnchors: (anchors: AnchorMap) => void;
};

const InteractablesContext = createContext<InteractablesContextValue | null>(
  null,
);

export const InteractablesProvider = ({ children }: { children: ReactNode }) => {
  const [anchorMap, setAnchorMap] = useState<AnchorMap>({});

  const registerAnchors = useCallback((anchors: AnchorMap) => {
    setAnchorMap((current) => {
      const keys = Object.keys(anchors) as InteractableId[];
      if (keys.length === 0) return current;
      const same =
        keys.length === Object.keys(current).length &&
        keys.every((key) => {
          const next = anchors[key];
          const prev = current[key];
          return (
            prev &&
            next &&
            prev.x === next.x &&
            prev.y === next.y &&
            prev.z === next.z
          );
        });
      return same ? current : { ...current, ...anchors };
    });
  }, []);

  const items = useMemo(
    () => mergeInteractablesWithAnchors(anchorMap),
    [anchorMap],
  );

  const value = useMemo(
    () => ({ items, registerAnchors }),
    [items, registerAnchors],
  );

  return (
    <InteractablesContext.Provider value={value}>
      {children}
    </InteractablesContext.Provider>
  );
};

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
