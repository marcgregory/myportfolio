import { useMemo } from "react";
import * as THREE from "three";
import { ROOM } from "./room-config";

const wood = "#6f4e37";
const woodDark = "#4a3426";
const wall = "#d8cbb8";
const wallTrim = "#b9a48d";
const ceiling = "#ebe2d4";
const carpet = "#3f4f63";
const metal = "#2a2f36";

const makeCanvasTexture = (
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
  size = 128,
  repeat: [number, number] = [1, 1]
) => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat[0], repeat[1]);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const Box = ({
  args,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color,
  emissive,
  emissiveIntensity = 0,
  map,
}: {
  args: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  map?: THREE.Texture;
}) => (
  <mesh position={position} rotation={rotation} castShadow receiveShadow>
    <boxGeometry args={args} />
    <meshStandardMaterial
      map={map}
      color={color}
      emissive={emissive ?? "#000000"}
      emissiveIntensity={emissiveIntensity}
      roughness={0.82}
      metalness={emissive ? 0.08 : 0.04}
    />
  </mesh>
);

const DeveloperRoom = () => {
  const floorRepeat = useMemo(
    () =>
      makeCanvasTexture((ctx, size) => {
        ctx.fillStyle = "#334155";
        ctx.fillRect(0, 0, size, size);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.18)";
        ctx.lineWidth = 2;
        for (let i = 0; i < size; i += 16) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, size);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(size, i);
          ctx.stroke();
        }
      }, 128, [6, 5]),
    []
  );

  const rugTexture = useMemo(
    () =>
      makeCanvasTexture((ctx, size) => {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(0, 0, size, size);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
        for (let i = 8; i < size; i += 14) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, size);
          ctx.stroke();
        }
      }, 96, [2, 2]),
    []
  );

  const posterTexture = useMemo(
    () =>
      makeCanvasTexture((ctx, size) => {
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, "#0f766e");
        gradient.addColorStop(1, "#7c3aed");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 18px Segoe UI, sans-serif";
        ctx.fillText("MARC", 16, 42);
        ctx.font = "12px Segoe UI, sans-serif";
        ctx.fillText("FULL-STACK", 16, 62);
        ctx.fillStyle = "rgba(51,255,102,0.9)";
        ctx.fillRect(16, 78, 72, 6);
      }, 128, [1, 1]),
    []
  );

  const w = ROOM.width;
  const d = ROOM.depth;
  const h = ROOM.height;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial map={floorRepeat} color={carpet} roughness={0.95} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.35, 0.01, 0.55]} receiveShadow>
        <planeGeometry args={[2.4, 1.65]} />
        <meshStandardMaterial map={rugTexture} color="#1e293b" roughness={0.98} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, h, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={ceiling} roughness={0.9} />
      </mesh>

      <Box args={[w, 0.12, 0.08]} position={[0, 0.06, -d / 2 + 0.04]} color={wallTrim} />
      <Box args={[w, h, 0.14]} position={[0, h / 2, -d / 2]} color={wall} />
      <Box args={[w, h, 0.14]} position={[0, h / 2, d / 2]} color={wallTrim} />
      <Box args={[0.14, h, d]} position={[-w / 2, h / 2, 0]} color={wall} />
      <Box args={[0.14, h, d]} position={[w / 2, h / 2, 0]} color={wall} />

      <Box args={[2.35, 0.78, 1.05]} position={[-2.05, 0.39, -2.35]} color={woodDark} />
      <Box args={[0.12, 0.62, 0.12]} position={[-2.78, 0.31, -1.95]} color={metal} />
      <Box args={[0.12, 0.62, 0.12]} position={[-1.32, 0.31, -1.95]} color={metal} />
      <Box args={[0.55, 0.06, 0.28]} position={[-2.05, 0.8, -1.72]} color="#1f2937" />

      <Box args={[0.95, 0.62, 0.08]} position={[-2.05, 0.86, -2.72]} color="#1f2428" />
      <Box
        args={[0.78, 0.48, 0.04]}
        position={[-2.05, 0.9, -2.66]}
        color="#0a140a"
        emissive="#33ff66"
        emissiveIntensity={0.85}
      />
      <mesh position={[-2.05, 0.9, -2.635]}>
        <planeGeometry args={[0.72, 0.44]} />
        <meshStandardMaterial
          color="#052e16"
          emissive="#22c55e"
          emissiveIntensity={0.15}
          transparent
          opacity={0.35}
        />
      </mesh>
      <Box args={[0.22, 0.14, 0.14]} position={[-2.05, 0.58, -2.58]} color="#2f343c" />

      <Box args={[1.45, 0.08, 0.95]} position={[-0.35, 0.74, -1.05]} color={wood} />
      <Box args={[0.52, 0.06, 0.72]} position={[-0.35, 0.8, -1.05]} color="#f8fafc" />

      <Box args={[1.65, 1.15, 0.08]} position={[2.85, 1.45, -2.42]} color="#f4efe6" />
      <Box args={[1.2, 0.08, 0.08]} position={[2.55, 1.72, -2.38]} color="#0f766e" />
      <Box args={[0.9, 0.08, 0.08]} position={[3.05, 1.52, -2.38]} color="#7c3aed" />
      <Box args={[0.75, 0.08, 0.08]} position={[2.95, 1.32, -2.38]} color="#0369a1" />

      <mesh position={[-3.55, 1.75, -2.35]} castShadow>
        <planeGeometry args={[0.72, 0.95]} />
        <meshStandardMaterial map={posterTexture} roughness={0.7} />
      </mesh>

      <Box args={[1.35, 2.05, 0.22]} position={[-3.35, 1.02, 0.35]} color={wood} />
      <Box args={[0.95, 0.22, 0.95]} position={[-3.35, 2.18, 0.35]} color="#14532d" />
      <Box args={[0.28, 0.55, 0.22]} position={[-3.35, 1.55, 0.35]} color="#422006" />

      <Box args={[0.16, 1.45, 0.16]} position={[3.55, 0.72, 1.85]} color={metal} />
      <mesh position={[3.55, 1.62, 1.85]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color="#fde68a"
          emissive="#fbbf24"
          emissiveIntensity={1.4}
          roughness={0.35}
        />
      </mesh>

      <Box args={[0.42, 0.22, 0.28]} position={[3.35, 0.92, 1.72]} color="#1c1917" />
      <Box args={[0.32, 0.1, 0.2]} position={[3.35, 1.05, 1.72]} color="#292524" />
      <Box
        args={[0.08, 0.06, 0.04]}
        position={[3.48, 1.02, 1.82]}
        color="#0f172a"
        emissive="#38bdf8"
        emissiveIntensity={0.55}
      />
      <Box
        args={[0.08, 0.06, 0.04]}
        position={[3.22, 1.02, 1.82]}
        color="#0f172a"
        emissive="#22c55e"
        emissiveIntensity={0.45}
      />

      <Box args={[2.1, 1.35, 0.1]} position={[0, 1.35, 3.02]} color={woodDark} />
      <mesh position={[0, 1.55, 3.08]}>
        <boxGeometry args={[0.55, 0.7, 0.06]} />
        <meshStandardMaterial
          color="#94a3b8"
          emissive="#38bdf8"
          emissiveIntensity={0.25}
          transparent
          opacity={0.55}
          roughness={0.2}
          metalness={0.35}
        />
      </mesh>

      <Box args={[2.4, 0.95, 0.12]} position={[0.15, 1.25, -3.48]} color="#1e293b" />
      <mesh position={[0.15, 1.35, -3.4]}>
        <planeGeometry args={[1.7, 0.55]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#38bdf8"
          emissiveIntensity={0.35}
        />
      </mesh>

      <Box args={[0.55, 0.42, 0.55]} position={[1.15, 0.21, 1.45]} color="#312e81" />
      <Box args={[0.38, 0.08, 0.38]} position={[1.15, 0.46, 1.45]} color="#111827" />
      <mesh position={[1.15, 0.52, 1.62]}>
        <planeGeometry args={[0.28, 0.16]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#a855f7"
          emissiveIntensity={0.5}
        />
      </mesh>

      <Box args={[0.48, 0.52, 0.48]} position={[0.95, 0.26, 0.15]} color="#1f2937" />
      <Box args={[0.42, 0.08, 0.42]} position={[0.95, 0.56, 0.15]} color="#111827" />
      <Box args={[0.5, 0.55, 0.08]} position={[0.95, 0.82, 0.22]} color={woodDark} />
    </group>
  );
};

export default DeveloperRoom;
