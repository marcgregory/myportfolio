/** Drop `studio.glb` from Blender into `public/room/` to replace procedural boxes. */
export const ROOM_GLB_PATH = "/room/studio.glb" as const;

/** Optional loop — add `ambient.mp3` to `public/room/` (falls back to procedural hum). */
export const ROOM_AMBIENT_PATH = "/room/ambient.mp3" as const;

export const ROOM_GLB_TRANSFORM = {
  position: [0, 0, 0] as [number, number, number],
  rotation: [0, 0, 0] as [number, number, number],
  scale: 1,
} as const;
