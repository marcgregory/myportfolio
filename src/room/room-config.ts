export const ROOM = {
  width: 9.2,
  depth: 7.4,
  height: 3.05,
} as const;

export const PLAYER = {
  eyeHeight: 1.62,
  speed: 3.85,
  sprintMultiplier: 1.55,
  spawn: [0, 1.62, 2.35] as [number, number, number],
  boundsPadding: 0.42,
} as const;

/** Wall-mounted TV — 16:9 screen aligned with RoomActiveScreens + studio.glb. */
export const ROOM_TV = {
  center: [0.15, 1.62, -3.388] as [number, number, number],
  screenSize: [1.85, 1.04] as [number, number],
  activeScreenSize: [1.74, 0.98] as [number, number],
  bezelSize: [1.95, 1.16] as [number, number],
  bezelCenter: [0.15, 1.62, -3.418] as [number, number, number],
  screenCenter: [0.15, 1.62, -3.4] as [number, number, number],
  standSize: [2.55, 0.68, 0.12] as [number, number, number],
  standCenter: [0.15, 1.02, -3.48] as [number, number, number],
} as const;

export const keyboardMap = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "left", keys: ["KeyA", "ArrowLeft"] },
  { name: "right", keys: ["KeyD", "ArrowRight"] },
  { name: "sprint", keys: ["ShiftLeft", "ShiftRight"] },
  { name: "interact", keys: ["KeyE"] },
];

export type RoomControlName =
  | "forward"
  | "backward"
  | "left"
  | "right"
  | "sprint"
  | "interact";
