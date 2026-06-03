import { useMemo } from "react";
import * as THREE from "three";
import { ROOM, ROOM_TV } from "./room-config";
import { getRoomTextures, ROOM_PALETTE } from "./room-materials";

const Box = ({
  args,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color,
  map,
  emissive,
  emissiveIntensity = 0,
  roughness = 0.82,
  metalness = 0.04,
  transparent,
  opacity,
  name,
}: {
  args: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  map?: THREE.Texture;
  emissive?: string;
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
  transparent?: boolean;
  opacity?: number;
  name?: string;
}) => (
  <mesh
    name={name}
    position={position}
    rotation={rotation}
    castShadow
    receiveShadow
  >
    <boxGeometry args={args} />
    <meshStandardMaterial
      map={map}
      color={color}
      emissive={emissive ?? "#000000"}
      emissiveIntensity={emissiveIntensity}
      roughness={roughness}
      metalness={metalness}
      transparent={transparent}
      opacity={opacity ?? 1}
    />
  </mesh>
);

const DeveloperRoom = () => {
  const textures = useMemo(() => getRoomTextures(), []);

  const w = ROOM.width;
  const d = ROOM.depth;
  const h = ROOM.height;

  return (
    <group>
      <mesh
        name="Floor"
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial
          map={textures.floor}
          color={ROOM_PALETTE.carpet}
          roughness={0.96}
          metalness={0.02}
        />
      </mesh>

      <mesh
        name="Rug"
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0.35, 0.01, 0.55]}
        receiveShadow
      >
        <planeGeometry args={[2.4, 1.65]} />
        <meshStandardMaterial
          map={textures.rug}
          color="#1e293b"
          roughness={0.98}
        />
      </mesh>

      <mesh
        name="Ceiling"
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, h, 0]}
        receiveShadow
      >
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial
          map={textures.ceiling}
          color={ROOM_PALETTE.ceiling}
          roughness={0.92}
        />
      </mesh>

      {/* Baseboards */}
      <Box
        name="Baseboard_Back"
        args={[w, 0.12, 0.08]}
        position={[0, 0.06, -d / 2 + 0.04]}
        color={ROOM_PALETTE.wallTrim}
        map={textures.wall}
        roughness={0.78}
      />
      <Box
        name="Baseboard_Front"
        args={[w, 0.12, 0.08]}
        position={[0, 0.06, d / 2 - 0.04]}
        color={ROOM_PALETTE.wallTrim}
        map={textures.wall}
        roughness={0.78}
      />
      <Box
        name="Baseboard_Left"
        args={[0.08, 0.12, d]}
        position={[-w / 2 + 0.04, 0.06, 0]}
        color={ROOM_PALETTE.wallTrim}
        map={textures.wall}
        roughness={0.78}
      />
      <Box
        name="Baseboard_Right"
        args={[0.08, 0.12, d]}
        position={[w / 2 - 0.04, 0.06, 0]}
        color={ROOM_PALETTE.wallTrim}
        map={textures.wall}
        roughness={0.78}
      />

      {/* Crown molding */}
      <Box
        name="Molding_Back"
        args={[w, 0.1, 0.06]}
        position={[0, h - 0.05, -d / 2 + 0.03]}
        color={ROOM_PALETTE.wallTrim}
        map={textures.wall}
        roughness={0.72}
      />
      <Box
        name="Molding_Front"
        args={[w, 0.1, 0.06]}
        position={[0, h - 0.05, d / 2 - 0.03]}
        color={ROOM_PALETTE.wallTrim}
        map={textures.wall}
        roughness={0.72}
      />

      {/* Walls */}
      <Box
        name="Wall_Back"
        args={[w, h, 0.14]}
        position={[0, h / 2, -d / 2]}
        color={ROOM_PALETTE.wall}
        map={textures.wall}
        roughness={0.88}
      />
      <Box
        name="Wall_Front"
        args={[w, h, 0.14]}
        position={[0, h / 2, d / 2]}
        color={ROOM_PALETTE.wall}
        map={textures.wall}
        roughness={0.88}
      />
      <Box
        name="Wall_Left"
        args={[0.14, h, d]}
        position={[-w / 2, h / 2, 0]}
        color={ROOM_PALETTE.wall}
        map={textures.wall}
        roughness={0.88}
      />
      <Box
        name="Wall_Right"
        args={[0.14, h, d]}
        position={[w / 2, h / 2, 0]}
        color={ROOM_PALETTE.wall}
        map={textures.wall}
        roughness={0.88}
      />

      {/* Window — back wall, left side */}
      <Box
        name="Window_Frame"
        args={[1.85, 1.35, 0.08]}
        position={[-2.65, 1.72, -d / 2 + 0.09]}
        color="#c4b5a0"
        map={textures.wall}
        roughness={0.7}
      />
      <Box
        name="Window_Glass"
        args={[1.55, 1.05, 0.02]}
        position={[-2.65, 1.72, -d / 2 + 0.13]}
        color={ROOM_PALETTE.glass}
        roughness={0.08}
        metalness={0.15}
        transparent
        opacity={0.32}
      />
      <Box
        name="Window_Sill"
        args={[1.95, 0.06, 0.14]}
        position={[-2.65, 1.02, -d / 2 + 0.1]}
        color={ROOM_PALETTE.wallTrim}
        map={textures.wall}
        roughness={0.75}
      />

      {/* Desk setup */}
      <Box
        name="Desk"
        args={[2.35, 0.78, 1.05]}
        position={[-2.05, 0.39, -2.35]}
        color={ROOM_PALETTE.woodDark}
        map={textures.woodDark}
        roughness={0.62}
        metalness={0.05}
      />
      <Box
        name="DeskLeg_L"
        args={[0.12, 0.62, 0.12]}
        position={[-2.78, 0.31, -1.95]}
        color={ROOM_PALETTE.metal}
        roughness={0.42}
        metalness={0.72}
      />
      <Box
        name="DeskLeg_R"
        args={[0.12, 0.62, 0.12]}
        position={[-1.32, 0.31, -1.95]}
        color={ROOM_PALETTE.metal}
        roughness={0.42}
        metalness={0.72}
      />
      <group position={[-2.05, 0.795, -1.68]} name="DeskKeyboard">
        <Box
          name="KeyboardBase"
          args={[0.52, 0.028, 0.2]}
          position={[0, 0, 0]}
          color="#1f2937"
          roughness={0.62}
          metalness={0.28}
        />
        <mesh
          name="KeyboardKeys"
          position={[0, 0.016, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          castShadow
          receiveShadow
        >
          <planeGeometry args={[0.48, 0.17]} />
          <meshStandardMaterial
            map={textures.keyboard}
            color="#ffffff"
            roughness={0.55}
            metalness={0.12}
          />
        </mesh>
        <Box
          name="KeyboardWristRest"
          args={[0.46, 0.012, 0.05]}
          position={[0, 0.008, 0.1]}
          color="#111827"
          roughness={0.88}
          metalness={0.05}
        />
        <Box
          name="KeyboardCable"
          args={[0.015, 0.012, 0.12]}
          position={[0.22, 0.006, -0.14]}
          color="#0f172a"
          roughness={0.75}
          metalness={0.15}
        />
      </group>

      <Box
        name="MonitorBezel"
        args={[0.95, 0.62, 0.08]}
        position={[-2.05, 0.86, -2.72]}
        color="#1f2428"
        roughness={0.55}
        metalness={0.35}
      />
      <Box
        name="MonitorScreen"
        args={[0.78, 0.48, 0.04]}
        position={[-2.05, 0.9, -2.66]}
        color="#020617"
        roughness={0.9}
        metalness={0.05}
      />
      <Box
        name="MonitorStand"
        args={[0.22, 0.14, 0.14]}
        position={[-2.05, 0.58, -2.58]}
        color="#2f343c"
        roughness={0.55}
        metalness={0.35}
      />
      <Box
        name="Mouse"
        args={[0.12, 0.04, 0.18]}
        position={[-1.52, 0.812, -1.68]}
        color="#2f343c"
        roughness={0.55}
        metalness={0.35}
      />
      <Box
        name="MousePad"
        args={[0.22, 0.008, 0.24]}
        position={[-1.52, 0.788, -1.68]}
        color="#1e293b"
        roughness={0.92}
        metalness={0.02}
      />

      {/* Office chair */}
      <Box
        name="Chair_Seat"
        args={[0.52, 0.08, 0.52]}
        position={[-2.05, 0.48, -1.55]}
        color="#1f2937"
        roughness={0.82}
        metalness={0.08}
      />
      <Box
        name="Chair_Back"
        args={[0.48, 0.55, 0.06]}
        position={[-2.05, 0.82, -1.78]}
        color="#1f2937"
        roughness={0.82}
        metalness={0.08}
      />
      <Box
        name="Chair_Pole"
        args={[0.05, 0.38, 0.05]}
        position={[-2.05, 0.28, -1.55]}
        color={ROOM_PALETTE.metal}
        roughness={0.42}
        metalness={0.72}
      />
      <Box
        name="Chair_Base"
        args={[0.48, 0.04, 0.48]}
        position={[-2.05, 0.08, -1.55]}
        color={ROOM_PALETTE.metal}
        roughness={0.42}
        metalness={0.72}
      />

      <Box
        name="ResumeTray"
        args={[1.45, 0.08, 0.95]}
        position={[-0.35, 0.74, -1.05]}
        color={ROOM_PALETTE.wood}
        map={textures.wood}
        roughness={0.68}
      />
      <Box
        name="ResumePaper"
        args={[0.52, 0.06, 0.72]}
        position={[-0.35, 0.8, -1.05]}
        color="#f8fafc"
        roughness={0.92}
      />

      <Box
        name="ProjectBoard"
        args={[1.65, 1.15, 0.08]}
        position={[2.85, 1.45, -2.42]}
        color="#f4efe6"
        roughness={0.88}
      />
      <Box
        name="BoardNote_1"
        args={[1.2, 0.08, 0.08]}
        position={[2.55, 1.72, -2.38]}
        color="#0f766e"
        roughness={0.88}
      />
      <Box
        name="BoardNote_2"
        args={[0.9, 0.08, 0.08]}
        position={[3.05, 1.52, -2.38]}
        color="#7c3aed"
        roughness={0.88}
      />
      <Box
        name="BoardNote_3"
        args={[0.75, 0.08, 0.08]}
        position={[2.95, 1.32, -2.38]}
        color="#0369a1"
        roughness={0.88}
      />

      <mesh name="Poster" position={[-3.55, 1.75, -2.35]} castShadow>
        <planeGeometry args={[0.72, 0.95]} />
        <meshStandardMaterial map={textures.poster} roughness={0.72} />
      </mesh>

      <Box
        name="Bookshelf"
        args={[1.35, 2.05, 0.22]}
        position={[-3.35, 1.02, 0.35]}
        color={ROOM_PALETTE.wood}
        map={textures.wood}
        roughness={0.68}
      />
      <Box
        name="Book_1"
        args={[0.08, 0.28, 0.16]}
        position={[-3.55, 1.55, 0.35]}
        color="#7f1d1d"
        roughness={0.85}
      />
      <Box
        name="Book_2"
        args={[0.1, 0.32, 0.16]}
        position={[-3.35, 1.57, 0.35]}
        color="#1e3a8a"
        roughness={0.85}
      />
      <Box
        name="Book_3"
        args={[0.07, 0.26, 0.16]}
        position={[-3.15, 1.54, 0.35]}
        color="#14532d"
        roughness={0.85}
      />
      <Box
        name="PlantPot"
        args={[0.95, 0.22, 0.95]}
        position={[-3.35, 2.18, 0.35]}
        color="#14532d"
        roughness={0.85}
      />
      <Box
        name="Plant"
        args={[0.28, 0.55, 0.22]}
        position={[-3.35, 1.55, 0.35]}
        color="#166534"
        roughness={0.85}
      />

      <Box
        name="LampPole"
        args={[0.16, 1.45, 0.16]}
        position={[3.55, 0.72, 1.85]}
        color={ROOM_PALETTE.metal}
        roughness={0.42}
        metalness={0.72}
      />
      <Box
        name="LampShade"
        args={[0.38, 0.22, 0.38]}
        position={[3.55, 1.52, 1.85]}
        color="#fef3c7"
        roughness={0.88}
        metalness={0}
        transparent
        opacity={0.92}
      />
      <mesh name="LampBulb" position={[3.55, 1.62, 1.85]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#fde68a"
          emissive="#f59e0b"
          emissiveIntensity={0.85}
          roughness={0.25}
        />
      </mesh>

      <Box
        name="RadioBody"
        args={[0.42, 0.22, 0.28]}
        position={[3.35, 0.92, 1.72]}
        color="#1c1917"
        roughness={0.7}
        metalness={0.12}
      />
      <Box
        name="RadioTop"
        args={[0.32, 0.1, 0.2]}
        position={[3.35, 1.05, 1.72]}
        color="#292524"
        roughness={0.7}
        metalness={0.12}
      />
      <Box
        name="RadioLed_R"
        args={[0.08, 0.06, 0.04]}
        position={[3.48, 1.02, 1.82]}
        color="#0f172a"
        emissive="#2563eb"
        emissiveIntensity={0.35}
        roughness={0.3}
        metalness={0.2}
      />
      <Box
        name="RadioLed_L"
        args={[0.08, 0.06, 0.04]}
        position={[3.22, 1.02, 1.82]}
        color="#0f172a"
        emissive="#15803d"
        emissiveIntensity={0.35}
        roughness={0.3}
        metalness={0.2}
      />

      <group name="Door" position={[0.35, 0, d / 2 - 0.1]}>
        <group name="DoorLeaf" position={[-0.48, 0, 0]}>
          <Box
            name="DoorSlab"
            args={[0.96, 2.24, 0.08]}
            position={[0.48, 1.18, 0]}
            color={ROOM_PALETTE.woodDark}
            map={textures.woodDark}
            roughness={0.58}
          />
          <Box
            name="DoorInnerShadow"
            args={[0.84, 2.08, 0.018]}
            position={[0.48, 1.18, -0.049]}
            color="#2a1d15"
            roughness={0.72}
          />
          <Box
            name="DoorRaisedCenter"
            args={[0.72, 1.84, 0.024]}
            position={[0.48, 1.22, -0.064]}
            color="#513927"
            map={textures.woodDark}
            roughness={0.58}
          />
          <Box
            name="DoorPanelTop"
            args={[0.5, 0.62, 0.03]}
            position={[0.48, 1.66, -0.088]}
            color="#352319"
            map={textures.woodDark}
            roughness={0.68}
          />
          <Box
            name="DoorPanelBottom"
            args={[0.5, 0.76, 0.03]}
            position={[0.48, 0.78, -0.088]}
            color="#352319"
            map={textures.woodDark}
            roughness={0.68}
          />
          <Box
            name="DoorPanelTopInset"
            args={[0.38, 0.5, 0.018]}
            position={[0.48, 1.66, -0.108]}
            color="#23160f"
            roughness={0.82}
          />
          <Box
            name="DoorPanelBottomInset"
            args={[0.38, 0.64, 0.018]}
            position={[0.48, 0.78, -0.108]}
            color="#23160f"
            roughness={0.82}
          />
          <mesh
            name="DoorKnobPlate"
            position={[0.82, 1.12, -0.125]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.085, 0.085, 0.018, 24]} />
            <meshStandardMaterial color="#b08d57" roughness={0.28} metalness={0.82} />
          </mesh>
          <mesh name="DoorKnob" position={[0.82, 1.12, -0.17]} castShadow>
            <sphereGeometry args={[0.07, 24, 16]} />
            <meshStandardMaterial color="#c9a45f" roughness={0.24} metalness={0.86} />
          </mesh>
        </group>
        <Box
          name="DoorJambLeft"
          args={[0.12, 2.42, 0.12]}
          position={[-0.6, 1.22, -0.01]}
          color={ROOM_PALETTE.wallTrim}
          map={textures.wall}
          roughness={0.72}
        />
        <Box
          name="DoorJambRight"
          args={[0.12, 2.42, 0.12]}
          position={[0.6, 1.22, -0.01]}
          color={ROOM_PALETTE.wallTrim}
          map={textures.wall}
          roughness={0.72}
        />
        <Box
          name="DoorHeader"
          args={[1.32, 0.14, 0.12]}
          position={[0, 2.45, -0.01]}
          color={ROOM_PALETTE.wallTrim}
          map={textures.wall}
          roughness={0.72}
        />
        <Box
          name="DoorThreshold"
          args={[1.2, 0.08, 0.18]}
          position={[0, 0.04, -0.04]}
          color={ROOM_PALETTE.wood}
          map={textures.wood}
          roughness={0.62}
        />
        <Box
          name="DoorHingeTop"
          args={[0.055, 0.26, 0.035]}
          position={[-0.5, 1.9, -0.12]}
          color="#9ca3af"
          roughness={0.3}
          metalness={0.82}
        />
        <Box
          name="DoorHingeBottom"
          args={[0.055, 0.26, 0.035]}
          position={[-0.5, 0.72, -0.12]}
          color="#9ca3af"
          roughness={0.3}
          metalness={0.82}
        />
      </group>

      <Box
        name="TVStand"
        args={[...ROOM_TV.standSize]}
        position={[...ROOM_TV.standCenter]}
        color="#1e293b"
        roughness={0.65}
        metalness={0.2}
      />
      <Box
        name="TVBezel"
        args={[ROOM_TV.bezelSize[0], ROOM_TV.bezelSize[1], 0.06]}
        position={[ROOM_TV.bezelCenter[0], ROOM_TV.bezelCenter[1], ROOM_TV.bezelCenter[2]]}
        color="#0f172a"
        roughness={0.45}
        metalness={0.35}
      />
      <Box
        name="TVScreen"
        args={[ROOM_TV.screenSize[0], ROOM_TV.screenSize[1], 0.02]}
        position={[ROOM_TV.screenCenter[0], ROOM_TV.screenCenter[1], ROOM_TV.screenCenter[2]]}
        color="#020617"
        roughness={0.9}
        metalness={0.05}
      />
      <Box
        name="LaptopBase"
        args={[0.48, 0.04, 0.34]}
        position={[1.15, 0.38, 1.45]}
        color="#374151"
        roughness={0.55}
        metalness={0.35}
      />
      <Box
        name="LaptopKeyboard"
        args={[0.44, 0.01, 0.28]}
        position={[1.15, 0.405, 1.45]}
        color="#1f2937"
        roughness={0.65}
        metalness={0.2}
      />
      <Box
        name="LaptopLid"
        args={[0.3, 0.18, 0.018]}
        position={[1.15, 0.52, 1.58]}
        color="#111827"
        roughness={0.45}
        metalness={0.4}
      />
      <Box
        name="LaptopScreen"
        args={[0.28, 0.16, 0.01]}
        position={[1.15, 0.52, 1.592]}
        color="#020617"
        roughness={0.9}
        metalness={0.05}
      />

      <Box
        name="SideTable"
        args={[0.48, 0.52, 0.48]}
        position={[0.95, 0.26, 0.15]}
        color="#1f2937"
        roughness={0.7}
      />
      <Box
        name="SideTableTop"
        args={[0.42, 0.08, 0.42]}
        position={[0.95, 0.56, 0.15]}
        color="#111827"
        roughness={0.65}
      />
      <Box
        name="SideLamp"
        args={[0.5, 0.55, 0.08]}
        position={[0.95, 0.82, 0.22]}
        color={ROOM_PALETTE.woodDark}
        map={textures.woodDark}
        roughness={0.62}
      />
    </group>
  );
};

export default DeveloperRoom;
