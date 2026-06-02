import { useEffect, useRef } from "react";
import * as THREE from "three";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const HeroScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion()) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 7);
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.zIndex = "0";
    renderer.domElement.style.pointerEvents = "none";
    container.appendChild(renderer.domElement);

    const pointer = new THREE.Vector2(0, 0);
    const particlesCount = isMobile ? 260 : 620;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const colorA = new THREE.Color("#8b5cf6");
    const colorB = new THREE.Color("#38bdf8");

    for (let i = 0; i < particlesCount; i += 1) {
      const i3 = i * 3;
      const radius = 2.35 + Math.random() * 3.65;
      const angle = Math.random() * Math.PI * 2;
      const depth = (Math.random() - 0.5) * 4.5;
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.sin(angle) * radius * 0.58;
      positions[i3 + 2] = depth;

      const color = colorA.clone().lerp(colorB, Math.random());
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        size: 0.028,
        sizeAttenuation: true,
        transparent: true,
        opacity: isMobile ? 0.48 : 0.66,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      })
    );
    scene.add(particles);

    const rings = new THREE.Group();
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: "#a78bfa",
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    [2.25, 3.05, 3.85].forEach((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.006, 12, 180),
        ringMaterial.clone()
      );
      ring.rotation.x = Math.PI * (0.58 + index * 0.05);
      ring.rotation.y = Math.PI * (0.1 + index * 0.08);
      ring.position.x = isMobile ? 0.2 : 0.9;
      ring.position.y = -0.05;
      rings.add(ring);
    });
    scene.add(rings);

    const lightNodeGeometry = new THREE.SphereGeometry(0.055, 16, 16);
    const lightNodeMaterial = new THREE.MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.85,
    });
    const lightNodes = [-1.5, -0.2, 1.7].map((x, index) => {
      const node = new THREE.Mesh(lightNodeGeometry, lightNodeMaterial.clone());
      node.position.set(x + 1.2, index === 1 ? -1.55 : 1.25 - index * 0.45, 0.4);
      scene.add(node);
      return node;
    });

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (isMobile) return;
      const rect = container.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = -(((event.clientY - rect.top) / rect.height - 0.5) * 2);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      particles.rotation.y = elapsed * 0.018 + pointer.x * 0.045;
      particles.rotation.x = pointer.y * 0.025;
      rings.rotation.z = elapsed * 0.026;
      rings.rotation.x = pointer.y * 0.025;
      rings.rotation.y = pointer.x * 0.045;

      lightNodes.forEach((node, index) => {
        node.scale.setScalar(1 + Math.sin(elapsed * 0.9 + index) * 0.18);
      });

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      particlesGeometry.dispose();
      (particles.material as THREE.Material).dispose();
      lightNodeGeometry.dispose();
      lightNodes.forEach((node) => (node.material as THREE.Material).dispose());
      rings.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-0 opacity-85 [mask-image:radial-gradient(circle_at_64%_46%,black_0%,black_50%,transparent_84%)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_64%_42%,rgba(124,58,237,0.26),transparent_34%),radial-gradient(circle_at_78%_50%,rgba(14,165,233,0.14),transparent_28%)] motion-reduce:block hidden" />
    </div>
  );
};

export default HeroScene;
