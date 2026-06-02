type RoomCameraSnapshot = {
  x: number;
  y: number;
  z: number;
  yaw: number;
};

type CameraListener = () => void;

let snapshot: RoomCameraSnapshot = { x: 0, y: 1.62, z: 2.35, yaw: 0 };
const listeners = new Set<CameraListener>();

export const setRoomCameraSnapshot = (next: RoomCameraSnapshot) => {
  snapshot = next;
  listeners.forEach((listener) => listener());
};

export const getRoomCameraSnapshot = () => snapshot;

export const subscribeRoomCamera = (listener: CameraListener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
