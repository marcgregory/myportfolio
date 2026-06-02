import * as THREE from "three";
import { interactables } from "./interactables-data";
import type { InteractableDef, InteractableId } from "./room-types";

const ANCHOR_IDS: InteractableId[] = [
  "monitor",
  "projects",
  "radio",
  "contact",
  "github",
  "exit",
];

const normalizeAnchorName = (name: string): InteractableId | null => {
  const key = name.trim().toLowerCase();
  return ANCHOR_IDS.find((id) => id === key) ?? null;
};

/** Read empty/mesh anchors exported from Blender or `npm run export-room`. */
export const extractInteractableAnchors = (
  root: THREE.Object3D,
): Partial<Record<InteractableId, THREE.Vector3>> => {
  const found: Partial<Record<InteractableId, THREE.Vector3>> = {};
  const world = new THREE.Vector3();

  root.updateMatrixWorld(true);
  root.traverse((child) => {
    const id = normalizeAnchorName(child.name);
    if (!id || found[id]) return;
    child.getWorldPosition(world);
    found[id] = world.clone();
  });

  return found;
};

export const mergeInteractablesWithAnchors = (
  anchors: Partial<Record<InteractableId, THREE.Vector3>>,
): InteractableDef[] =>
  interactables.map((item) => {
    const anchor = anchors[item.id];
    if (!anchor) return item;

    const position: [number, number, number] = [
      anchor.x,
      anchor.y,
      anchor.z,
    ];

    const focusOffset = [
      item.focus.position[0] - item.position[0],
      item.focus.position[1] - item.position[1],
      item.focus.position[2] - item.position[2],
    ] as const;

    const lookOffset = [
      item.focus.lookAt[0] - item.position[0],
      item.focus.lookAt[1] - item.position[1],
      item.focus.lookAt[2] - item.position[2],
    ] as const;

    return {
      ...item,
      position,
      focus: {
        position: [
          position[0] + focusOffset[0],
          position[1] + focusOffset[1],
          position[2] + focusOffset[2],
        ],
        lookAt: [
          position[0] + lookOffset[0],
          position[1] + lookOffset[1],
          position[2] + lookOffset[2],
        ],
      },
    };
  });

/** Horizontal distance — eye height vs anchor height should not block CRT use. */
export const distanceXZ = (a: THREE.Vector3, b: THREE.Vector3) =>
  Math.hypot(a.x - b.x, a.z - b.z);
