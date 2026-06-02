const RoomLighting = () => (
  <>
    <ambientLight intensity={0.38} color="#fff7ed" />
    <hemisphereLight
      args={["#fef3c7", "#0f172a", 0.42]}
      position={[0, 4.2, 0]}
    />
    <directionalLight
      castShadow
      color="#fde68a"
      intensity={1.28}
      position={[2.5, 5.8, 2.2]}
      shadow-mapSize-width={1280}
      shadow-mapSize-height={1280}
      shadow-camera-near={0.5}
      shadow-camera-far={18}
      shadow-camera-left={-6}
      shadow-camera-right={6}
      shadow-camera-top={6}
      shadow-camera-bottom={-6}
    />
    <pointLight
      color="#86efac"
      intensity={1.65}
      distance={3.4}
      position={[-2.05, 1.95, -2.2]}
    />
    <pointLight
      color="#33ff66"
      intensity={2.45}
      distance={4.2}
      position={[-2.05, 1.35, -2.35]}
    />
    <pointLight
      color="#38bdf8"
      intensity={1.35}
      distance={5.2}
      position={[0.15, 1.85, -3.15]}
    />
    <pointLight
      color="#fbbf24"
      intensity={0.9}
      distance={3.6}
      position={[3.4, 2.2, 1.6]}
    />
    <pointLight
      color="#c4b5fd"
      intensity={0.55}
      distance={3.2}
      position={[1.15, 1.05, 1.45]}
    />
  </>
);

export default RoomLighting;
