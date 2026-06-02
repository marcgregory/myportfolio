import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mergeInteractablesWithAnchors } from "./interactable-anchors";
import {
  InteractablesContext,
  type AnchorMap,
} from "./interactables-context";

export const InteractablesProvider = ({ children }: { children: ReactNode }) => {
  const [anchorMap, setAnchorMap] = useState<AnchorMap>({});

  const registerAnchors = useCallback((anchors: AnchorMap) => {
    setAnchorMap((current) => {
      const keys = Object.keys(anchors) as (keyof AnchorMap)[];
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
