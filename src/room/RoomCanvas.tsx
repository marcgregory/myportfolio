import { KeyboardControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Suspense, useCallback, useRef, useState } from "react";
import DeveloperRoomScene from "./DeveloperRoomScene";
import FirstPersonPlayer from "./FirstPersonPlayer";
import { useInteractableDefs } from "./useInteractables";
import RoomInteractables from "./RoomInteractables";
import { useInteractableActions } from "./useInteractableActions";
import RoomLighting from "./RoomLighting";
import { keyboardMap, PLAYER } from "./room-config";
import type { InteractableId, RoomFocusState, RoomMiniAppId } from "./room-types";
import { useRoomFocus } from "./useRoomFocus";

type RoomCanvasProps = {
  isLocked: boolean;
  onExit: () => void;
  onMiniAppOpen: (id: RoomMiniAppId) => void;
  onNearbyChange: (id: InteractableId | null) => void;
  onFocusChange: (state: RoomFocusState) => void;
};

const RoomScene = ({
  isLocked,
  onExit,
  onMiniAppOpen,
  onNearbyChange,
  onFocusChange,
}: RoomCanvasProps) => {
  const { camera } = useThree();
  const [nearbyId, setNearbyId] = useState<InteractableId | null>(null);
  const lastNearby = useRef<InteractableId | null>(null);
  const runAction = useInteractableActions({ onExit, onMiniAppOpen });
  const interactableItems = useInteractableDefs();
  const getInteractable = useCallback(
    (id: InteractableId) =>
      interactableItems.find((item) => item.id === id) ?? null,
    [interactableItems],
  );
  const { isFrozen, focusInteractable } = useRoomFocus({
    camera,
    onFocusChange,
    getInteractable,
  });

  const handleProximityChange = useCallback(
    (id: InteractableId | null) => {
      if (lastNearby.current === id) return;
      lastNearby.current = id;
      setNearbyId(id);
      onNearbyChange(id);
    },
    [onNearbyChange]
  );

  const handleInteract = useCallback(() => {
    if (!nearbyId || isFrozen) return;

    const skipReturn = nearbyId === "exit";
    void focusInteractable(
      nearbyId,
      () => runAction(nearbyId),
      { skipReturn }
    );
  }, [focusInteractable, isFrozen, nearbyId, runAction]);

  return (
    <>
      <color attach="background" args={["#120f0d"]} />
      <fog attach="fog" args={["#1a1512", 4.5, 14]} />
      <RoomLighting />
      <DeveloperRoomScene />
      <RoomInteractables
        activeId={isFrozen ? null : nearbyId}
        onProximityChange={handleProximityChange}
      />
      <FirstPersonPlayer
        enabled={isLocked}
        frozen={isFrozen}
        onInteractRequest={handleInteract}
      />
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          intensity={0.55}
          luminanceThreshold={0.42}
          luminanceSmoothing={0.35}
          mipmapBlur
        />
        <Vignette eskil offset={0.18} darkness={0.62} />
      </EffectComposer>
    </>
  );
};

const RoomCanvas = ({
  isLocked,
  onExit,
  onMiniAppOpen,
  onNearbyChange,
  onFocusChange,
}: RoomCanvasProps) => (
  <KeyboardControls map={keyboardMap}>
    <Canvas
      shadows
      camera={{
        fov: 68,
        position: PLAYER.spawn,
        near: 0.08,
        far: 40,
      }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <RoomScene
          isLocked={isLocked}
          onExit={onExit}
          onMiniAppOpen={onMiniAppOpen}
          onNearbyChange={onNearbyChange}
          onFocusChange={onFocusChange}
        />
      </Suspense>
    </Canvas>
  </KeyboardControls>
);

export default RoomCanvas;
