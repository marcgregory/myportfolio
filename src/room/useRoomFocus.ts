import gsap from "gsap";
import { useCallback, useRef, useState } from "react";
import * as THREE from "three";
import type { Camera } from "three";
import type { InteractableDef, InteractableId, RoomFocusState } from "./room-types";

type UseRoomFocusOptions = {
  camera: Camera;
  onFocusChange: (state: RoomFocusState) => void;
  getInteractable: (id: InteractableId) => InteractableDef | null | undefined;
};

export const useRoomFocus = ({
  camera,
  onFocusChange,
  getInteractable,
}: UseRoomFocusOptions) => {
  const [isFrozen, setIsFrozen] = useState(false);
  const isAnimating = useRef(false);
  const savedPosition = useRef<THREE.Vector3 | null>(null);

  const runCameraTween = useCallback(
    (
      targetPosition: THREE.Vector3,
      lookAt: THREE.Vector3,
      duration: number
    ) =>
      new Promise<void>((resolve) => {
        const startPosition = camera.position.clone();
        const endQuaternion = new THREE.Quaternion();
        const startQuaternion = camera.quaternion.clone();
        const tempCamera = new THREE.PerspectiveCamera();

        tempCamera.position.copy(targetPosition);
        tempCamera.lookAt(lookAt);
        endQuaternion.copy(tempCamera.quaternion);

        const proxy = { t: 0 };
        gsap.to(proxy, {
          t: 1,
          duration,
          ease: "power2.inOut",
          onUpdate: () => {
            camera.position.lerpVectors(startPosition, targetPosition, proxy.t);
            camera.quaternion.slerpQuaternions(
              startQuaternion,
              endQuaternion,
              proxy.t
            );
          },
          onComplete: resolve,
        });
      }),
    [camera]
  );

  const focusInteractable = useCallback(
    async (
      id: InteractableId,
      onComplete: () => void,
      options?: { skipReturn?: boolean }
    ) => {
      if (isAnimating.current) return;

      const item = getInteractable(id);
      if (!item) return;

      isAnimating.current = true;
      setIsFrozen(true);
      onFocusChange({ active: true, label: item.label });

      if (document.pointerLockElement) {
        document.exitPointerLock();
      }

      if (!savedPosition.current) {
        savedPosition.current = camera.position.clone();
      }

      const focusPosition = new THREE.Vector3(...item.focus.position);
      const focusLookAt = new THREE.Vector3(...item.focus.lookAt);

      await runCameraTween(focusPosition, focusLookAt, 0.82);
      await new Promise((resolve) => window.setTimeout(resolve, 280));

      onComplete();

      if (options?.skipReturn) {
        isAnimating.current = false;
        return;
      }

      await new Promise((resolve) => window.setTimeout(resolve, 220));

      const returnPosition = savedPosition.current.clone();
      await runCameraTween(returnPosition, focusLookAt, 0.72);

      savedPosition.current = null;
      isAnimating.current = false;
      setIsFrozen(false);
      onFocusChange({ active: false, label: "" });
    },
    [camera, getInteractable, onFocusChange, runCameraTween]
  );

  return { isFrozen, focusInteractable, isAnimating };
};
