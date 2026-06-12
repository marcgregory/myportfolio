import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const makeRibbonCurve = (index: number, isMobile: boolean) => {
  const points: THREE.Vector3[] = [];
  const samples = isMobile ? 72 : 116;
  const arc = Math.PI * (1.35 + index * 0.18);
  const start = -arc * 0.52;
  const xOffset = isMobile ? 0.2 : 1.02;
  const radius = 2.18 + index * 0.46;
  const yTilt = 0.48 + index * 0.08;
  const zWave = 0.52 + index * 0.15;

  for (let i = 0; i < samples; i += 1) {
    const progress = i / (samples - 1);
    const angle = start + arc * progress;
    const lift = Math.sin(progress * Math.PI) * (0.18 + index * 0.05);
    const taper = Math.sin(progress * Math.PI);

    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius + xOffset - index * 0.14,
        Math.sin(angle) * radius * yTilt - 0.08 + lift,
        Math.sin(progress * Math.PI * 2 + index * 0.75) * zWave * taper -
          index * 0.2,
      ),
    );
  }

  return new THREE.CatmullRomCurve3(points);
};

const EnergyRibbon = ({
  color,
  accent,
  index,
  isMobile,
}: {
  color: string;
  accent: string;
  index: number;
  isMobile: boolean;
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const curve = makeRibbonCurve(index, isMobile);
    return new THREE.TubeGeometry(
      curve,
      isMobile ? 96 : 172,
      0.012 + index * 0.004,
      10,
      false,
    );
  }, [index, isMobile]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uAccent: { value: new THREE.Color(accent) },
      uOpacity: { value: isMobile ? 0.52 : 0.74 },
    }),
    [accent, color, isMobile],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value =
      clock.elapsedTime * (0.72 + index * 0.13);
  });

  return (
    <mesh geometry={geometry} renderOrder={4}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor;
          uniform vec3 uAccent;
          uniform float uOpacity;
          varying vec2 vUv;

          void main() {
            float pulse = sin(vUv.x * 22.0 - uTime * 2.1) * 0.5 + 0.5;
            float core = smoothstep(0.34, 1.0, pulse);
            float edgeFade = smoothstep(0.0, 0.16, vUv.x) * smoothstep(1.0, 0.72, vUv.x);
            vec3 color = mix(uColor, uAccent, core) * (1.2 + core * 2.1);
            float alpha = (0.18 + core * 0.8) * edgeFade * uOpacity;
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
};

const ParticleField = ({ isMobile }: { isMobile: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = isMobile ? 240 : 780;

  const { colors, positions } = useMemo(() => {
    const nextPositions = new Float32Array(particleCount * 3);
    const nextColors = new Float32Array(particleCount * 3);
    const colorA = new THREE.Color("#8b5cf6");
    const colorB = new THREE.Color("#38bdf8");
    const colorC = new THREE.Color("#ffffff");
    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.15 + Math.random() * 5.4;
      const zDepth = (Math.random() - 0.5) * 6.2;
      const verticalSpread = 0.48 + Math.random() * 0.28;

      nextPositions[i3] = Math.cos(angle) * radius + (isMobile ? 0.1 : 0.78);
      nextPositions[i3 + 1] =
        Math.sin(angle) * radius * verticalSpread + (Math.random() - 0.5) * 0.32;
      nextPositions[i3 + 2] = zDepth;

      color.copy(colorA).lerp(colorB, Math.random());
      if (Math.random() > 0.82) color.lerp(colorC, 0.48);
      nextColors[i3] = color.r;
      nextColors[i3 + 1] = color.g;
      nextColors[i3 + 2] = color.b;
    }

    return { colors: nextColors, positions: nextPositions };
  }, [isMobile, particleCount]);

  useFrame(({ clock, pointer }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.elapsedTime * 0.018 + pointer.x * 0.08;
    pointsRef.current.rotation.x = pointer.y * 0.035;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={isMobile ? 0.48 : 0.74}
        size={isMobile ? 0.032 : 0.026}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const EnergyNodes = ({ isMobile }: { isMobile: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = pointer.x * 0.07;
    groupRef.current.rotation.x = pointer.y * 0.04;

    groupRef.current.children.forEach((child, index) => {
      child.scale.setScalar(1 + Math.sin(clock.elapsedTime * 0.9 + index) * 0.18);
    });
  });

  return (
    <group ref={groupRef}>
      {[
        [-2.42, 0.98, 0.2],
        [0.24, -1.42, 0.45],
        [2.96, 0.76, -0.38],
      ].map(([x, y, z], index) => (
        <mesh key={`${x}-${y}-${z}`} position={[x, y, z]}>
          <sphereGeometry args={[isMobile ? 0.035 : 0.055, 18, 18]} />
          <meshBasicMaterial
            color={index === 1 ? "#38bdf8" : "#f5f0ff"}
            transparent
            opacity={0.9}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
};

const HeroWebglStage = ({ isMobile }: { isMobile: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer, camera }) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.18) * 0.025;
    groupRef.current.position.x = pointer.x * (isMobile ? 0.05 : 0.18);
    groupRef.current.position.y = pointer.y * (isMobile ? 0.035 : 0.12);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.22, 0.035);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.16, 0.035);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <fog attach="fog" args={["#050816", 4.2, 9.4]} />
      <group ref={groupRef} rotation={[0.05, -0.08, -0.22]}>
        <ParticleField isMobile={isMobile} />
        {[0, 1, 2, 3].slice(0, isMobile ? 2 : 4).map((index) => (
          <EnergyRibbon
            key={index}
            index={index}
            isMobile={isMobile}
            color={index % 2 ? "#38bdf8" : "#8b5cf6"}
            accent={index % 2 ? "#c084fc" : "#22d3ee"}
          />
        ))}
        <EnergyNodes isMobile={isMobile} />
      </group>
      {!isMobile && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            intensity={1.35}
            luminanceThreshold={0.16}
            luminanceSmoothing={0.42}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  );
};

const HeroSceneWebgl = ({ isMobile }: { isMobile: boolean }) => (
  <Canvas
    camera={{ fov: 48, position: [0, 0, 6.4], near: 0.1, far: 30 }}
    dpr={isMobile ? [1, 1.15] : [1, 1.75]}
    gl={{
      alpha: true,
      antialias: !isMobile,
      powerPreference: isMobile ? "low-power" : "high-performance",
    }}
    onCreated={({ gl }) => {
      gl.setClearColor("#050816", 0);
    }}
  >
    <HeroWebglStage isMobile={isMobile} />
  </Canvas>
);

export default HeroSceneWebgl;
