import { drawLaptopScreen, drawMonitorScreen } from "./room-screen-content";
import ActiveScreen from "./ActiveScreen";
import { ROOM_TV } from "./room-config";
import TvVideoScreen from "./TvVideoScreen";

const tvVideoPosition: [number, number, number] = [
  ROOM_TV.center[0],
  ROOM_TV.center[1],
  ROOM_TV.center[2] + 0.035,
];

/** Live animated displays: TV, laptop, and desk monitor. */
const RoomActiveScreens = () => (
  <group name="ActiveScreens">
    <TvVideoScreen
      position={tvVideoPosition}
      size={ROOM_TV.activeScreenSize}
      emissive="#dbeafe"
      emissiveIntensity={0.35}
    />

    <ActiveScreen
      position={[1.15, 0.522, 1.628]}
      size={[0.26, 0.155]}
      canvasSize={[480, 270]}
      draw={drawLaptopScreen}
      emissive="#c4b5fd"
      emissiveIntensity={0.95}
    />

    <ActiveScreen
      position={[-2.05, 0.9, -2.628]}
      size={[0.72, 0.44]}
      canvasSize={[480, 294]}
      draw={drawMonitorScreen}
      emissive="#86efac"
      emissiveIntensity={0.9}
    />
  </group>
);

export default RoomActiveScreens;
