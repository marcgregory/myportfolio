import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { distanceXZ } from "./interactable-anchors";
import {
  useFindInteractable,
  useInteractableDefs,
} from "./InteractablesContext";
import type { InteractableId } from "./room-types";

type RoomInteractablesProps = {
  activeId: InteractableId | null;
  onProximityChange: (id: InteractableId | null) => void;
};

const RoomInteractables = ({
  activeId,
  onProximityChange,
}: RoomInteractablesProps) => {
  const { camera } = useThree();
  const items = useInteractableDefs();
  const active = useFindInteractable(activeId);

  const playerPos = useRef(new THREE.Vector3());
  const targetVector = useRef(new THREE.Vector3());
  const forward = useRef(new THREE.Vector3());
  const toTarget = useRef(new THREE.Vector3());

  useFrame(() => {
    playerPos.current.copy(camera.position);
    camera.getWorldDirection(forward.current);

    let nearest: InteractableId | null = null;
    let nearestScore = Number.POSITIVE_INFINITY;

    for (const item of items) {
      targetVector.current.set(...item.position);
      const xz = distanceXZ(playerPos.current, targetVector.current);
      if (xz > item.radius) continue;

      toTarget.current
        .subVectors(targetVector.current, playerPos.current)
        .setY(0);
      const planarLen = toTarget.current.length();
      if (planarLen < 0.001) {
        toTarget.current.set(0, 0, -1);
      } else {
        toTarget.current.divideScalar(planarLen);
      }

      const facing =
        planarLen > 0.001
          ? forward.current.dot(toTarget.current)
          : 1;
      const score = xz - Math.max(0, facing) * 0.65;

      if (score < nearestScore) {
        nearest = item.id;
        nearestScore = score;
      }
    }

    onProximityChange(nearest);
  });

  return (
    <group>
      {items.map((item) => (
        <mesh key={item.id} position={item.position} visible={false}>
          <sphereGeometry args={[item.radius, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} />
          {activeId === item.id && active && (
            <Html
              center
              distanceFactor={8}
              className="room-interactable-label"
              style={{ pointerEvents: "none" }}
            >
              <div className="room-interactable-label__card">
                <span className="room-interactable-label__title">
                  {active.label}
                </span>
                <span className="room-interactable-label__hint">
                  {active.hint}
                </span>
              </div>
            </Html>
          )}
        </mesh>
      ))}
    </group>
  );
};

export default RoomInteractables;
