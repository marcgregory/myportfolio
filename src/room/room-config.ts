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
