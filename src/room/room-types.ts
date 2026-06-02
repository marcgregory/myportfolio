export type InteractableId =
  | "monitor"
  | "projects"
  | "radio"
  | "contact"
  | "github"
  | "exit";

export type InteractableDef = {
  id: InteractableId;
  label: string;
  hint: string;
  position: [number, number, number];
  radius: number;
  action: "cv" | "projects" | "radio" | "contact" | "github" | "exit";
  focus: {
    position: [number, number, number];
    lookAt: [number, number, number];
  };
};

export type RoomFocusState = {
  active: boolean;
  label: string;
};

/** In-room overlay apps (all interactables except the exit door). */
export type RoomMiniAppId = Exclude<InteractableId, "exit">;
