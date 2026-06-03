const RoomLighting = () => (
  <>
    <ambientLight intensity={0.42} color="#fff7ed" />
    <hemisphereLight
      args={["#f0f4f8", "#3d3630", 0.52]}
      position={[0, 4.2, 0]}
    />

    {/* Window daylight */}
    <directionalLight
      castShadow
      color="#e0f2fe"
      intensity={1.75}
      position={[-4.5, 3.8, -1.5]}
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-near={0.5}
      shadow-camera-far={18}
      shadow-camera-left={-6}
      shadow-camera-right={6}
      shadow-camera-top={6}
      shadow-camera-bottom={-6}
      shadow-bias={-0.0002}
      shadow-normalBias={0.02}
    />

    {/* Soft fill from ceiling */}
    <directionalLight
      color="#fef9c3"
      intensity={0.42}
      position={[0, 5, 2]}
    />

    {/* General room fill */}
    <pointLight
      color="#fff7ed"
      intensity={0.85}
      distance={12}
      decay={2}
      position={[0, 2.6, 0]}
    />

    {/* Soft side fill away from the TV */}
    <pointLight
      color="#fff1d6"
      intensity={0.38}
      distance={6.5}
      decay={2}
      position={[-2.8, 2.25, 1.6]}
    />

    {/* Laptop screen spill */}
    <pointLight
      color="#a78bfa"
      intensity={0.45}
      distance={2.2}
      decay={2}
      position={[1.15, 0.65, 1.55]}
    />

    {/* Desk monitor screen spill */}
    <pointLight
      color="#86efac"
      intensity={0.75}
      distance={3.2}
      decay={2}
      position={[-2.05, 1.05, -2.35]}
    />

    {/* Floor lamp */}
    <pointLight
      color="#fcd34d"
      intensity={2.1}
      distance={5.5}
      decay={2}
      position={[3.55, 1.55, 1.85]}
    />
  </>
);

export default RoomLighting;
