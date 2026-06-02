import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { ROOM_GLB_PATH, ROOM_GLB_TRANSFORM } from "@/constants/room-assets";
import { extractInteractableAnchors } from "./interactable-anchors";
import { useRegisterInteractableAnchors } from "./useInteractables";

const DeveloperRoomGlb = () => {
  const { scene } = useGLTF(ROOM_GLB_PATH);
  const registerAnchors = useRegisterInteractableAnchors();

  useEffect(() => {
    useGLTF.preload(ROOM_GLB_PATH);
  }, []);

  const room = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    registerAnchors(extractInteractableAnchors(room));
  }, [room, registerAnchors]);

  return (
    <primitive
      object={room}
      position={ROOM_GLB_TRANSFORM.position}
      rotation={ROOM_GLB_TRANSFORM.rotation}
      scale={ROOM_GLB_TRANSFORM.scale}
    />
  );
};

export default DeveloperRoomGlb;
