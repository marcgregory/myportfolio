import { PointerLockControls, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { resolveCollisions } from "./room-colliders";
import { PLAYER, ROOM } from "./room-config";
import { setRoomCameraSnapshot } from "./room-camera-bridge";

type FirstPersonPlayerProps = {
  enabled: boolean;
  frozen: boolean;
  onInteractRequest: () => void;
};

const FirstPersonPlayer = ({
  enabled,
  frozen,
  onInteractRequest,
}: FirstPersonPlayerProps) => {
  const { camera } = useThree();
  const [, getKeys] = useKeyboardControls();
  const direction = useRef(new THREE.Vector3());
  const interactLatch = useRef(false);

  useEffect(() => {
    camera.position.set(...PLAYER.spawn);
    camera.rotation.order = "YXZ";
  }, [camera]);

  useFrame((_, delta) => {
    setRoomCameraSnapshot({
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
      yaw: camera.rotation.y,
    });

    if (!enabled || frozen) return;

    const { forward, backward, left, right, sprint, interact } = getKeys();
    const speed =
      PLAYER.speed * (sprint ? PLAYER.sprintMultiplier : 1) * delta;

    direction.current.set(0, 0, 0);
    if (forward) direction.current.z -= 1;
    if (backward) direction.current.z += 1;
    if (left) direction.current.x -= 1;
    if (right) direction.current.x += 1;

    if (direction.current.lengthSq() > 0) {
      direction.current.normalize();
      direction.current.applyEuler(new THREE.Euler(0, camera.rotation.y, 0));
      camera.position.addScaledVector(direction.current, speed);
    }

    const halfW = ROOM.width / 2 - PLAYER.boundsPadding;
    const halfD = ROOM.depth / 2 - PLAYER.boundsPadding;
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -halfW, halfW);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -halfD, halfD);
    camera.position.y = PLAYER.eyeHeight;

    camera.position.copy(resolveCollisions(camera.position));

    if (interact && !interactLatch.current) {
      interactLatch.current = true;
      onInteractRequest();
    }
    if (!interact) interactLatch.current = false;
  });

  return <PointerLockControls selector="#room-lock-target" />;
};

export default FirstPersonPlayer;
