import { Suspense } from "react";
import DeveloperRoom from "./DeveloperRoom";
import DeveloperRoomGlb from "./DeveloperRoomGlb";
import RoomGlbErrorBoundary from "./RoomGlbErrorBoundary";
import { useRoomModelAvailable } from "./useRoomModel";

/** Minimal floor while probing or loading studio.glb — avoids stacking two full rooms. */
const RoomLoadPlaceholder = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
    <planeGeometry args={[9.2, 7.4]} />
    <meshStandardMaterial color="#1e293b" roughness={0.95} />
  </mesh>
);

const DeveloperRoomScene = () => {
  const modelAvailable = useRoomModelAvailable();

  if (modelAvailable === null) {
    return <RoomLoadPlaceholder />;
  }

  if (modelAvailable === false) {
    return <DeveloperRoom />;
  }

  return (
    <RoomGlbErrorBoundary fallback={<DeveloperRoom />}>
      <Suspense fallback={<RoomLoadPlaceholder />}>
        <DeveloperRoomGlb />
      </Suspense>
    </RoomGlbErrorBoundary>
  );
};

export default DeveloperRoomScene;
