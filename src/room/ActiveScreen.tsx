import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type ActiveScreenProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number];
  canvasSize?: [number, number];
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;
  emissive?: string;
  emissiveIntensity?: number;
};

const ActiveScreen = ({
  position,
  rotation = [0, 0, 0],
  size,
  canvasSize = [512, 288],
  draw,
  emissive = "#ffffff",
  emissiveIntensity = 0.85,
}: ActiveScreenProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvasSize[0];
    canvas.height = canvasSize[1];
    canvasRef.current = canvas;
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.minFilter = THREE.LinearFilter;
    map.magFilter = THREE.LinearFilter;
    return map;
  }, [canvasSize]);

  useFrame(({ clock }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    draw(ctx, canvas.width, canvas.height, clock.elapsedTime);
    texture.needsUpdate = true;
  });

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshStandardMaterial
        map={texture}
        emissiveMap={texture}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        roughness={0.35}
        metalness={0.05}
        toneMapped={false}
      />
    </mesh>
  );
};

export default ActiveScreen;
