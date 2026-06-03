import * as THREE from "three";

export const ROOM_PALETTE = {
  wood: "#6f4e37",
  woodDark: "#4a3426",
  wall: "#d8cbb8",
  wallTrim: "#b9a48d",
  ceiling: "#ebe2d4",
  carpet: "#3f4f63",
  metal: "#2a2f36",
  glass: "#94a3b8",
} as const;

type CanvasDrawFn = (ctx: CanvasRenderingContext2D, size: number) => void;

export const makeCanvasTexture = (
  draw: CanvasDrawFn,
  size = 256,
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
  texture.anisotropy = 4;
  return texture;
};

const noise = (ctx: CanvasRenderingContext2D, size: number, alpha: number) => {
  const image = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < image.data.length; i += 4) {
    const n = 128 + (Math.random() - 0.5) * 42;
    image.data[i] = n;
    image.data[i + 1] = n;
    image.data[i + 2] = n;
    image.data[i + 3] = alpha;
  }
  ctx.putImageData(image, 0, 0);
};

let textureCache: {
  floor?: THREE.CanvasTexture;
  rug?: THREE.CanvasTexture;
  wall?: THREE.CanvasTexture;
  ceiling?: THREE.CanvasTexture;
  wood?: THREE.CanvasTexture;
  woodDark?: THREE.CanvasTexture;
  poster?: THREE.CanvasTexture;
  keyboard?: THREE.CanvasTexture;
} | null = null;

export const getRoomTextures = () => {
  if (textureCache) return textureCache;

  const floor = makeCanvasTexture(
    (ctx, size) => {
      ctx.fillStyle = "#2f3a48";
      ctx.fillRect(0, 0, size, size);
      for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
          const fiber = (Math.sin(x * 0.42 + y * 0.18) + Math.cos(y * 0.31)) * 0.5;
          const shade = 38 + fiber * 14 + (Math.random() - 0.5) * 8;
          ctx.fillStyle = `rgb(${shade}, ${shade + 6}, ${shade + 12})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
      ctx.strokeStyle = "rgba(148, 163, 184, 0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i < size; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();
      }
    },
    256,
    [8, 6]
  );

  const rug = makeCanvasTexture(
    (ctx, size) => {
      ctx.fillStyle = "#1a2332";
      ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < 1200; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        ctx.fillStyle = `rgba(${80 + Math.random() * 40}, ${100 + Math.random() * 50}, ${130 + Math.random() * 40}, 0.35)`;
        ctx.fillRect(x, y, 1.5, 1.5);
      }
      ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
      ctx.lineWidth = 2;
      ctx.strokeRect(8, 8, size - 16, size - 16);
    },
    128,
    [2, 2]
  );

  const wall = makeCanvasTexture(
    (ctx, size) => {
      ctx.fillStyle = ROOM_PALETTE.wall;
      ctx.fillRect(0, 0, size, size);
      noise(ctx, size, 18);
      ctx.strokeStyle = "rgba(120, 100, 80, 0.06)";
      ctx.lineWidth = 1;
      for (let i = 0; i < size; i += 24) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
        ctx.stroke();
      }
    },
    256,
    [3, 2]
  );

  const ceiling = makeCanvasTexture(
    (ctx, size) => {
      ctx.fillStyle = ROOM_PALETTE.ceiling;
      ctx.fillRect(0, 0, size, size);
      noise(ctx, size, 12);
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      for (let i = 0; i < size; i += 48) {
        ctx.fillRect(i, 0, 24, size);
      }
    },
    256,
    [4, 4]
  );

  const wood = makeCanvasTexture(
    (ctx, size) => {
      ctx.fillStyle = ROOM_PALETTE.wood;
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = "rgba(40, 24, 12, 0.35)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 18; i++) {
        const y = (i / 18) * size + (Math.random() - 0.5) * 4;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= size; x += 8) {
          ctx.lineTo(x, y + Math.sin(x * 0.08 + i) * 2.5);
        }
        ctx.stroke();
      }
    },
    256,
    [2, 1]
  );

  const woodDark = makeCanvasTexture(
    (ctx, size) => {
      ctx.fillStyle = ROOM_PALETTE.woodDark;
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = "rgba(20, 12, 6, 0.45)";
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 14; i++) {
        const y = (i / 14) * size;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= size; x += 6) {
          ctx.lineTo(x, y + Math.sin(x * 0.06 + i * 0.7) * 2);
        }
        ctx.stroke();
      }
    },
    256,
    [2, 1]
  );

  const poster = makeCanvasTexture(
    (ctx, size) => {
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, "#134e4a");
      gradient.addColorStop(0.55, "#1e3a5f");
      gradient.addColorStop(1, "#4c1d95");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      noise(ctx, size, 22);
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 22px Georgia, serif";
      ctx.fillText("MARC", 18, 48);
      ctx.font = "13px Georgia, serif";
      ctx.fillText("FULL-STACK", 18, 72);
      ctx.fillStyle = "rgba(34, 197, 94, 0.85)";
      ctx.fillRect(18, 88, 80, 5);
    },
    128,
    [1, 1]
  );

  const keyboard = makeCanvasTexture((ctx, size) => {
    ctx.fillStyle = "#151a21";
    ctx.fillRect(0, 0, size, size);
    const cols = 15;
    const rows = 5;
    const keyW = size / cols;
    const keyH = size / (rows + 0.6);
    for (let row = 0; row < rows; row += 1) {
      const rowOffset = row * keyW * 0.22;
      for (let col = 0; col < cols; col += 1) {
        if (row === 4 && col > 10) continue;
        const x = col * keyW + rowOffset + 2;
        const y = row * keyH + 2;
        ctx.fillStyle = "#374151";
        ctx.fillRect(x, y, keyW - 4, keyH - 4);
        ctx.fillStyle = "#4b5563";
        ctx.fillRect(x + 1, y + 1, keyW - 6, keyH - 6);
      }
    }
    ctx.fillStyle = "#374151";
    ctx.fillRect(keyW * 2.8, size - keyH - 2, keyW * 7.2, keyH - 4);
    ctx.fillStyle = "#374151";
    ctx.fillRect(size - keyW * 2.2, keyH * 3 + 2, keyW * 1.8, keyH - 4);
  }, 256, [1, 1]);

  textureCache = { floor, rug, wall, ceiling, wood, woodDark, poster, keyboard };
  return textureCache;
};

type MaterialSpec = {
  color?: string;
  map?: THREE.Texture;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  transparent?: boolean;
  opacity?: number;
};

const matchSpec = (name: string): MaterialSpec | null => {
  const n = name.toLowerCase();

  const textures = getRoomTextures();

  if (n.includes("floor")) {
    return { color: ROOM_PALETTE.carpet, map: textures.floor, roughness: 0.96, metalness: 0.02 };
  }
  if (n.includes("rug")) {
    return { color: "#1e293b", map: textures.rug, roughness: 0.98, metalness: 0 };
  }
  if (n.includes("ceiling")) {
    return { color: ROOM_PALETTE.ceiling, map: textures.ceiling, roughness: 0.92, metalness: 0 };
  }
  if (n.includes("wall") || n.includes("baseboard") || n.includes("molding")) {
    const trim = n.includes("trim") || n.includes("baseboard") || n.includes("molding");
    return {
      color: trim ? ROOM_PALETTE.wallTrim : ROOM_PALETTE.wall,
      map: textures.wall,
      roughness: trim ? 0.78 : 0.88,
      metalness: 0,
    };
  }
  if (n.includes("window") && n.includes("glass")) {
    return {
      color: ROOM_PALETTE.glass,
      roughness: 0.08,
      metalness: 0.15,
      transparent: true,
      opacity: 0.35,
    };
  }
  if (n.includes("window")) {
    return { color: "#e8e0d4", map: textures.wall, roughness: 0.75, metalness: 0 };
  }
  if (n.includes("poster")) {
    return { map: textures.poster, roughness: 0.72, metalness: 0 };
  }
  if (n.includes("bookshelf") || n.includes("resume") && n.includes("tray")) {
    return { color: ROOM_PALETTE.wood, map: textures.wood, roughness: 0.68, metalness: 0.04 };
  }
  if (
    n.includes("desk") ||
    n.includes("door") ||
    n.includes("shelf") ||
    n.includes("table") ||
    n.includes("lamp") && !n.includes("bulb") ||
    n.includes("frame")
  ) {
    const dark = n.includes("dark") || n.includes("frame") || n.includes("door");
    return {
      color: dark ? ROOM_PALETTE.woodDark : ROOM_PALETTE.woodDark,
      map: textures.woodDark,
      roughness: 0.62,
      metalness: 0.05,
    };
  }
  if (n.includes("chair")) {
    return { color: "#1f2937", roughness: 0.82, metalness: 0.08 };
  }
  if (n.includes("leg") || n.includes("pole") || n.includes("metal")) {
    return { color: ROOM_PALETTE.metal, roughness: 0.42, metalness: 0.72 };
  }
  if (n.includes("monitor") && n.includes("screen")) {
    return { color: "#020617", roughness: 0.9, metalness: 0.05 };
  }
  if (n.includes("monitor") && n.includes("glow")) {
    return null;
  }
  if (n.includes("monitor") || n.includes("bezel") || n.includes("mouse")) {
    return { color: "#1f2428", roughness: 0.55, metalness: 0.35 };
  }
  if (n.includes("keyboard")) {
    if (n.includes("keys")) {
      return { color: "#ffffff", map: textures.keyboard, roughness: 0.55, metalness: 0.12 };
    }
    if (n.includes("wrist")) {
      return { color: "#111827", roughness: 0.88, metalness: 0.05 };
    }
    if (n.includes("cable")) {
      return { color: "#0f172a", roughness: 0.75, metalness: 0.15 };
    }
    return { color: "#1f2937", roughness: 0.62, metalness: 0.28 };
  }
  if (n.includes("mousepad")) {
    return { color: "#1e293b", roughness: 0.92, metalness: 0.02 };
  }
  if (n.includes("contact") && n.includes("screen")) {
    return { color: "#020617", roughness: 0.9, metalness: 0.05 };
  }
  if (n.includes("tv") && n.includes("screen")) {
    return { color: "#020617", roughness: 0.9, metalness: 0.05 };
  }
  if (n.includes("tv") && (n.includes("bezel") || n.includes("stand"))) {
    return { color: "#0f172a", roughness: 0.45, metalness: 0.35 };
  }
  if (n.includes("laptop") && n.includes("screen")) {
    return { color: "#020617", roughness: 0.9, metalness: 0.05 };
  }
  if (n.includes("laptop")) {
    return { color: "#374151", roughness: 0.55, metalness: n.includes("lid") ? 0.4 : 0.35 };
  }
  if (n.includes("github") && n.includes("screen")) {
    return { color: "#020617", roughness: 0.9, metalness: 0.05 };
  }
  if (n.includes("radio") && n.includes("led")) {
    return {
      color: "#0f172a",
      emissive: n.includes("_r") ? "#2563eb" : "#15803d",
      emissiveIntensity: 0.35,
      roughness: 0.3,
      metalness: 0.2,
    };
  }
  if (n.includes("radio")) {
    return { color: "#292524", roughness: 0.7, metalness: 0.12 };
  }
  if (n.includes("lamp") && n.includes("bulb")) {
    return { color: "#fde68a", emissive: "#f59e0b", emissiveIntensity: 0.85, roughness: 0.25, metalness: 0 };
  }
  if (n.includes("door") && n.includes("glass")) {
    return {
      color: ROOM_PALETTE.glass,
      emissive: "#64748b",
      emissiveIntensity: 0.08,
      transparent: true,
      opacity: 0.4,
      roughness: 0.12,
      metalness: 0.2,
    };
  }
  if (n.includes("plant")) {
    return { color: n.includes("pot") ? "#14532d" : "#166534", roughness: 0.85, metalness: 0 };
  }
  if (n.includes("paper")) {
    return { color: "#f8fafc", roughness: 0.92, metalness: 0 };
  }
  if (n.includes("board") || n.includes("note")) {
    return { color: "#f4efe6", roughness: 0.88, metalness: 0 };
  }

  return null;
};

export const applyRoomMaterials = (root: THREE.Object3D) => {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;

    const spec = matchSpec(mesh.name || "");
    if (!spec) return;

    const prev = mesh.material;
    const material = new THREE.MeshStandardMaterial({
      color: spec.color ?? "#ffffff",
      map: spec.map ?? null,
      roughness: spec.roughness ?? 0.82,
      metalness: spec.metalness ?? 0.04,
      emissive: spec.emissive ?? "#000000",
      emissiveIntensity: spec.emissiveIntensity ?? 0,
      transparent: spec.transparent ?? false,
      opacity: spec.opacity ?? 1,
    });

    mesh.material = material;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    if (Array.isArray(prev)) prev.forEach((m) => m.dispose());
    else if (prev) prev.dispose();
  });
};
