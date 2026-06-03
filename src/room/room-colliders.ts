import * as THREE from "three";

export type ColliderBox = {
  min: [number, number, number];
  max: [number, number, number];
};

export const PLAYER_RADIUS = 0.36;

/** XZ blocking volumes aligned with DeveloperRoom props */
export const roomColliders: ColliderBox[] = [
  { min: [-3.18, 0, -2.92], max: [-0.92, 1.25, -2.05] },
  { min: [-2.35, 0, -1.85], max: [-1.75, 0.95, -1.25] },
  { min: [-0.95, 0, -1.55], max: [0.25, 1.05, -0.55] },
  { min: [2.05, 0, -2.95], max: [3.68, 2.35, -1.62] },
  { min: [-4.08, 0, -0.25], max: [-2.62, 2.45, 1.08] },
  { min: [-1.12, 0, -3.58], max: [1.42, 2.35, -3.18] },
  { min: [0.88, 0, 1.22], max: [1.42, 0.58, 1.68] },
  { min: [3.15, 0, 1.35], max: [3.95, 1.85, 2.35] },
  { min: [2.95, 0, 1.45], max: [3.75, 1.15, 1.98] },
];

export const resolveCollisions = (position: THREE.Vector3) => {
  const resolved = position.clone();

  for (let iteration = 0; iteration < 4; iteration += 1) {
    for (const box of roomColliders) {
      const insideX =
        resolved.x > box.min[0] - PLAYER_RADIUS &&
        resolved.x < box.max[0] + PLAYER_RADIUS;
      const insideZ =
        resolved.z > box.min[2] - PLAYER_RADIUS &&
        resolved.z < box.max[2] + PLAYER_RADIUS;

      if (!insideX || !insideZ) continue;

      const toLeft = resolved.x - (box.min[0] - PLAYER_RADIUS);
      const toRight = box.max[0] + PLAYER_RADIUS - resolved.x;
      const toBack = resolved.z - (box.min[2] - PLAYER_RADIUS);
      const toFront = box.max[2] + PLAYER_RADIUS - resolved.z;
      const smallest = Math.min(toLeft, toRight, toBack, toFront);

      if (smallest === toLeft) resolved.x = box.min[0] - PLAYER_RADIUS;
      else if (smallest === toRight) resolved.x = box.max[0] + PLAYER_RADIUS;
      else if (smallest === toBack) resolved.z = box.min[2] - PLAYER_RADIUS;
      else resolved.z = box.max[2] + PLAYER_RADIUS;
    }
  }

  return resolved;
};
