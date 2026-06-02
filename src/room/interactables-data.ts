import type { InteractableDef, InteractableId } from "./room-types";

export const interactables: InteractableDef[] = [
  {
    id: "monitor",
    label: "CRT Workstation",
    hint: "Press E — open workstation",
    position: [-2.05, 1.0, -1.9],
    radius: 2.35,
    action: "cv",
    focus: {
      position: [-1.45, 1.28, -1.75],
      lookAt: [-2.05, 0.92, -2.62],
    },
  },
  {
    id: "projects",
    label: "Project Board",
    hint: "Open project board app",
    position: [2.85, 1.35, -2.15],
    radius: 1.45,
    action: "projects",
    focus: {
      position: [1.55, 1.38, -1.35],
      lookAt: [2.85, 1.42, -2.38],
    },
  },
  {
    id: "radio",
    label: "Studio Radio",
    hint: "Open studio radio app",
    position: [3.35, 0.92, 1.72],
    radius: 1.15,
    action: "radio",
    focus: {
      position: [2.45, 1.12, 1.05],
      lookAt: [3.35, 0.95, 1.72],
    },
  },
  {
    id: "contact",
    label: "Contact Terminal",
    hint: "Open contact terminal app",
    position: [0.15, 1.32, -3.35],
    radius: 1.35,
    action: "contact",
    focus: {
      position: [0.15, 1.48, -2.05],
      lookAt: [0.15, 1.35, -3.38],
    },
  },
  {
    id: "github",
    label: "GitHub Rig",
    hint: "Open GitHub rig app",
    position: [1.15, 0.58, 1.45],
    radius: 1.1,
    action: "github",
    focus: {
      position: [0.35, 1.02, 0.55],
      lookAt: [1.15, 0.62, 1.45],
    },
  },
  {
    id: "exit",
    label: "Studio Door",
    hint: "Return to the portfolio homepage",
    position: [0, 1.1, 3.05],
    radius: 1.35,
    action: "exit",
    focus: {
      position: [0, 1.38, 1.85],
      lookAt: [0, 1.42, 3.02],
    },
  },
];

export const findInteractable = (id: InteractableId | null) =>
  interactables.find((item) => item.id === id) ?? null;
