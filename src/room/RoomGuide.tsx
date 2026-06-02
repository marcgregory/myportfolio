import { interactables } from "./interactables-data";
import {
  getRoomCameraSnapshot,
  subscribeRoomCamera,
} from "./room-camera-bridge";
import type { InteractableId } from "./room-types";
import { useSyncExternalStore } from "react";

const GUIDE_IDS: InteractableId[] = [
  "monitor",
  "projects",
  "contact",
  "github",
  "radio",
  "exit",
];

const normalizeAngle = (angle: number) => {
  let value = angle;
  while (value > Math.PI) value -= Math.PI * 2;
  while (value < -Math.PI) value += Math.PI * 2;
  return value;
};

type GuideMarker = {
  id: InteractableId;
  label: string;
  left: number;
  top: number;
  rotation: number;
  distance: number;
  behind: boolean;
};

const computeMarkers = (): GuideMarker[] => {
  const camera = getRoomCameraSnapshot();

  return GUIDE_IDS.map((id) => {
    const item = interactables.find((entry) => entry.id === id);
    if (!item) return null;

    const dx = item.position[0] - camera.x;
    const dz = item.position[2] - camera.z;
    const distance = Math.hypot(dx, dz);
    const worldAngle = Math.atan2(dx, dz);
    const relative = normalizeAngle(worldAngle - camera.yaw);
    const behind = Math.abs(relative) > Math.PI * 0.55;
    const edgeRadius = behind ? 38 : 44;
    const left = 50 + Math.sin(relative) * edgeRadius;
    const top = 46 - Math.cos(relative) * edgeRadius;

    return {
      id,
      label: item.label,
      left,
      top,
      rotation: relative * (180 / Math.PI),
      distance,
      behind,
    };
  }).filter((marker): marker is GuideMarker => marker !== null);
};

type RoomGuideProps = {
  active: boolean;
  onDismiss: () => void;
};

const RoomGuide = ({ active, onDismiss }: RoomGuideProps) => {
  useSyncExternalStore(subscribeRoomCamera, getRoomCameraSnapshot, () =>
    getRoomCameraSnapshot()
  );

  if (!active) return null;

  const markers = computeMarkers()
    .filter((marker) => marker.distance > 0.85)
    .sort((a, b) => a.distance - b.distance);

  const nearest = markers[0];

  return (
    <div className="room-guide" aria-live="polite">
      <div className="room-guide__panel room-hud__panel">
        <p className="room-guide__kicker">Studio guide</p>
        <h3 className="room-guide__title">Where to go</h3>
        <p className="room-guide__lede">
          Follow the arrows, then press <kbd>E</kbd> at each station.
        </p>
        <ul className="room-guide__list">
          {markers.slice(0, 4).map((marker) => (
            <li
              key={marker.id}
              className={
                nearest?.id === marker.id ? "room-guide__list-item is-nearest" : "room-guide__list-item"
              }
            >
              <span className="room-guide__list-label">{marker.label}</span>
              <span className="room-guide__list-distance">
                {marker.distance.toFixed(1)}m
              </span>
            </li>
          ))}
        </ul>
        <button type="button" className="room-btn room-btn--ghost" onClick={onDismiss}>
          Got it
        </button>
      </div>

      {markers.map((marker) => (
        <div
          key={marker.id}
          className={`room-guide__arrow${marker.behind ? " room-guide__arrow--behind" : ""}${
            nearest?.id === marker.id ? " room-guide__arrow--nearest" : ""
          }`}
          style={{
            left: `${marker.left}%`,
            top: `${marker.top}%`,
            ["--arrow-rotate" as string]: `${marker.rotation}deg`,
          }}
        >
          <span className="room-guide__arrow-icon" aria-hidden>
            ↑
          </span>
          <span className="room-guide__arrow-label">{marker.label}</span>
        </div>
      ))}
    </div>
  );
};

export default RoomGuide;
