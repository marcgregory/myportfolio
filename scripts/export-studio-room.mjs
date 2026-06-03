/**
 * Generates public/room/studio.glb from the procedural DeveloperRoom layout.
 * Run: npm run export-room
 */
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "room");
const outPath = join(outDir, "studio.glb");

const ROOM = { width: 9.2, depth: 7.4, height: 3.05 };

const wood = "#6f4e37";
const woodDark = "#4a3426";
const wall = "#d8cbb8";
const wallTrim = "#b9a48d";
const ceiling = "#ebe2d4";
const carpet = "#3f4f63";
const metal = "#2a2f36";

function addBox(
  parent,
  args,
  position,
  color,
  { emissive, emissiveIntensity = 0, opacity, name } = {}
) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(...args),
    new THREE.MeshStandardMaterial({
      color,
      emissive: emissive ?? "#000000",
      emissiveIntensity,
      roughness: 0.82,
      metalness: emissive ? 0.08 : 0.04,
      transparent: opacity != null && opacity < 1,
      opacity: opacity ?? 1,
    })
  );
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (name) mesh.name = name;
  parent.add(mesh);
  return mesh;
}

function addPlane(parent, args, position, rotation, color, opts = {}) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(...args),
    new THREE.MeshStandardMaterial({
      color,
      emissive: opts.emissive ?? "#000000",
      emissiveIntensity: opts.emissiveIntensity ?? 0,
      roughness: opts.roughness ?? 0.9,
      metalness: opts.metalness ?? 0.04,
      transparent: opts.opacity != null && opts.opacity < 1,
      opacity: opts.opacity ?? 1,
    })
  );
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.receiveShadow = true;
  if (opts.name) mesh.name = opts.name;
  parent.add(mesh);
  return mesh;
}

function addCylinder(parent, args, position, rotation, color, { name, roughness = 0.3, metalness = 0.82 } = {}) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(...args),
    new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
    })
  );
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (name) mesh.name = name;
  parent.add(mesh);
  return mesh;
}

function addSphere(parent, args, position, color, { name, roughness = 0.24, metalness = 0.86 } = {}) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(...args),
    new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
    })
  );
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (name) mesh.name = name;
  parent.add(mesh);
  return mesh;
}

function addEmpty(parent, name, position) {
  const obj = new THREE.Object3D();
  obj.name = name;
  obj.position.set(...position);
  parent.add(obj);
  return obj;
}

function buildRoom() {
  const root = new THREE.Group();
  root.name = "PortfolioStudio";

  const { width: w, depth: d, height: h } = ROOM;

  addPlane(root, [w, d], [0, 0, 0], [-Math.PI / 2, 0, 0], carpet, { name: "Floor" });
  addPlane(root, [2.4, 1.65], [0.35, 0.01, 0.55], [-Math.PI / 2, 0, 0], "#1e293b", {
    name: "Rug",
  });
  addPlane(root, [w, d], [0, h, 0], [Math.PI / 2, 0, 0], ceiling, { name: "Ceiling" });

  addBox(root, [w, 0.12, 0.08], [0, 0.06, -d / 2 + 0.04], wallTrim, { name: "Baseboard_Back" });
  addBox(root, [w, 0.12, 0.08], [0, 0.06, d / 2 - 0.04], wallTrim, { name: "Baseboard_Front" });
  addBox(root, [0.08, 0.12, d], [-w / 2 + 0.04, 0.06, 0], wallTrim, { name: "Baseboard_Left" });
  addBox(root, [0.08, 0.12, d], [w / 2 - 0.04, 0.06, 0], wallTrim, { name: "Baseboard_Right" });
  addBox(root, [w, 0.1, 0.06], [0, h - 0.05, -d / 2 + 0.03], wallTrim, { name: "Molding_Back" });
  addBox(root, [w, 0.1, 0.06], [0, h - 0.05, d / 2 - 0.03], wallTrim, { name: "Molding_Front" });

  addBox(root, [w, h, 0.14], [0, h / 2, -d / 2], wall, { name: "Wall_Back" });
  addBox(root, [w, h, 0.14], [0, h / 2, d / 2], wall, { name: "Wall_Front" });
  addBox(root, [0.14, h, d], [-w / 2, h / 2, 0], wall, { name: "Wall_Left" });
  addBox(root, [0.14, h, d], [w / 2, h / 2, 0], wall, { name: "Wall_Right" });

  addBox(root, [1.85, 1.35, 0.08], [-2.65, 1.72, -d / 2 + 0.09], "#c4b5a0", { name: "Window_Frame" });
  addBox(root, [1.55, 1.05, 0.02], [-2.65, 1.72, -d / 2 + 0.13], "#94a3b8", {
    opacity: 0.32,
    name: "Window_Glass",
  });
  addBox(root, [1.95, 0.06, 0.14], [-2.65, 1.02, -d / 2 + 0.1], wallTrim, { name: "Window_Sill" });

  addBox(root, [2.35, 0.78, 1.05], [-2.05, 0.39, -2.35], woodDark, { name: "Desk" });
  addBox(root, [0.12, 0.62, 0.12], [-2.78, 0.31, -1.95], metal, { name: "DeskLeg_L" });
  addBox(root, [0.12, 0.62, 0.12], [-1.32, 0.31, -1.95], metal, { name: "DeskLeg_R" });
  addBox(root, [0.52, 0.028, 0.2], [-2.05, 0.795, -1.68], "#1f2937", { name: "KeyboardBase" });
  addPlane(root, [0.48, 0.17], [-2.05, 0.811, -1.68], [-Math.PI / 2, 0, 0], "#4b5563", {
    name: "KeyboardKeys",
    roughness: 0.55,
    metalness: 0.12,
  });
  addBox(root, [0.46, 0.012, 0.05], [-2.05, 0.803, -1.58], "#111827", {
    name: "KeyboardWristRest",
  });
  addBox(root, [0.015, 0.012, 0.12], [-1.83, 0.801, -1.82], "#0f172a", { name: "KeyboardCable" });
  addBox(root, [0.22, 0.008, 0.24], [-1.52, 0.788, -1.68], "#1e293b", { name: "MousePad" });
  addBox(root, [0.95, 0.62, 0.08], [-2.05, 0.86, -2.72], "#1f2428", { name: "MonitorBezel" });
  addBox(root, [0.78, 0.48, 0.04], [-2.05, 0.9, -2.66], "#020617", {
    name: "MonitorScreen",
  });
  addBox(root, [0.22, 0.14, 0.14], [-2.05, 0.58, -2.58], "#2f343c", { name: "MonitorStand" });
  addBox(root, [0.12, 0.04, 0.18], [-1.52, 0.812, -1.68], "#2f343c", { name: "Mouse" });

  addBox(root, [0.52, 0.08, 0.52], [-2.05, 0.48, -1.55], "#1f2937", { name: "Chair_Seat" });
  addBox(root, [0.48, 0.55, 0.06], [-2.05, 0.82, -1.78], "#1f2937", { name: "Chair_Back" });
  addBox(root, [0.05, 0.38, 0.05], [-2.05, 0.28, -1.55], metal, { name: "Chair_Pole" });
  addBox(root, [0.48, 0.04, 0.48], [-2.05, 0.08, -1.55], metal, { name: "Chair_Base" });

  addBox(root, [1.45, 0.08, 0.95], [-0.35, 0.74, -1.05], wood, { name: "ResumeTray" });
  addBox(root, [0.52, 0.06, 0.72], [-0.35, 0.8, -1.05], "#f8fafc", { name: "ResumePaper" });

  addBox(root, [1.65, 1.15, 0.08], [2.85, 1.45, -2.42], "#f4efe6", { name: "ProjectBoard" });
  addBox(root, [1.2, 0.08, 0.08], [2.55, 1.72, -2.38], "#0f766e", { name: "BoardNote_1" });
  addBox(root, [0.9, 0.08, 0.08], [3.05, 1.52, -2.38], "#7c3aed", { name: "BoardNote_2" });
  addBox(root, [0.75, 0.08, 0.08], [2.95, 1.32, -2.38], "#0369a1", { name: "BoardNote_3" });

  addPlane(root, [0.72, 0.95], [-3.55, 1.75, -2.35], [0, 0, 0], "#0f766e", {
    roughness: 0.7,
    name: "Poster",
  });

  addBox(root, [1.35, 2.05, 0.22], [-3.35, 1.02, 0.35], wood, { name: "Bookshelf" });
  addBox(root, [0.08, 0.28, 0.16], [-3.55, 1.55, 0.35], "#7f1d1d", { name: "Book_1" });
  addBox(root, [0.1, 0.32, 0.16], [-3.35, 1.57, 0.35], "#1e3a8a", { name: "Book_2" });
  addBox(root, [0.07, 0.26, 0.16], [-3.15, 1.54, 0.35], "#14532d", { name: "Book_3" });
  addBox(root, [0.95, 0.22, 0.95], [-3.35, 2.18, 0.35], "#14532d", { name: "PlantPot" });
  addBox(root, [0.28, 0.55, 0.22], [-3.35, 1.55, 0.35], "#166534", { name: "Plant" });

  addBox(root, [0.16, 1.45, 0.16], [3.55, 0.72, 1.85], metal, { name: "LampPole" });
  addBox(root, [0.38, 0.22, 0.38], [3.55, 1.52, 1.85], "#fef3c7", {
    opacity: 0.92,
    name: "LampShade",
  });
  const lampBulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 16),
    new THREE.MeshStandardMaterial({
      color: "#fde68a",
      emissive: "#f59e0b",
      emissiveIntensity: 0.85,
      roughness: 0.25,
    })
  );
  lampBulb.position.set(3.55, 1.62, 1.85);
  lampBulb.name = "LampBulb";
  root.add(lampBulb);

  addBox(root, [0.42, 0.22, 0.28], [3.35, 0.92, 1.72], "#1c1917", { name: "RadioBody" });
  addBox(root, [0.32, 0.1, 0.2], [3.35, 1.05, 1.72], "#292524", { name: "RadioTop" });
  addBox(root, [0.08, 0.06, 0.04], [3.48, 1.02, 1.82], "#0f172a", {
    emissive: "#2563eb",
    emissiveIntensity: 0.35,
    name: "RadioLed_R",
  });
  addBox(root, [0.08, 0.06, 0.04], [3.22, 1.02, 1.82], "#0f172a", {
    emissive: "#15803d",
    emissiveIntensity: 0.35,
    name: "RadioLed_L",
  });

  addBox(root, [0.96, 2.24, 0.08], [0.35, 1.18, d / 2 - 0.1], woodDark, { name: "DoorSlab" });
  addBox(root, [0.84, 2.08, 0.018], [0.35, 1.18, d / 2 - 0.149], "#2a1d15", { name: "DoorInnerShadow" });
  addBox(root, [0.72, 1.84, 0.024], [0.35, 1.22, d / 2 - 0.164], "#513927", {
    name: "DoorRaisedCenter",
  });
  addBox(root, [0.5, 0.62, 0.03], [0.35, 1.66, d / 2 - 0.188], "#352319", { name: "DoorPanelTop" });
  addBox(root, [0.5, 0.76, 0.03], [0.35, 0.78, d / 2 - 0.188], "#352319", { name: "DoorPanelBottom" });
  addBox(root, [0.38, 0.5, 0.018], [0.35, 1.66, d / 2 - 0.208], "#23160f", {
    name: "DoorPanelTopInset",
  });
  addBox(root, [0.38, 0.64, 0.018], [0.35, 0.78, d / 2 - 0.208], "#23160f", {
    name: "DoorPanelBottomInset",
  });
  addBox(root, [0.12, 2.42, 0.12], [-0.25, 1.22, d / 2 - 0.11], wallTrim, { name: "DoorJambLeft" });
  addBox(root, [0.12, 2.42, 0.12], [0.95, 1.22, d / 2 - 0.11], wallTrim, { name: "DoorJambRight" });
  addBox(root, [1.32, 0.14, 0.12], [0.35, 2.45, d / 2 - 0.11], wallTrim, { name: "DoorHeader" });
  addBox(root, [1.2, 0.08, 0.18], [0.35, 0.04, d / 2 - 0.14], wood, { name: "DoorThreshold" });
  addBox(root, [0.055, 0.26, 0.035], [-0.15, 1.9, d / 2 - 0.22], "#9ca3af", { name: "DoorHingeTop" });
  addBox(root, [0.055, 0.26, 0.035], [-0.15, 0.72, d / 2 - 0.22], "#9ca3af", { name: "DoorHingeBottom" });
  addCylinder(root, [0.085, 0.085, 0.018, 24], [0.69, 1.12, d / 2 - 0.225], [Math.PI / 2, 0, 0], "#b08d57", {
    name: "DoorKnobPlate",
  });
  addSphere(root, [0.07, 24, 16], [0.69, 1.12, d / 2 - 0.27], "#c9a45f", { name: "DoorKnob" });

  addBox(root, [2.55, 0.68, 0.12], [0.15, 1.02, -3.48], "#1e293b", { name: "TVStand" });
  addBox(root, [1.95, 1.16, 0.06], [0.15, 1.62, -3.418], "#0f172a", { name: "TVBezel" });
  addBox(root, [1.85, 1.04, 0.02], [0.15, 1.62, -3.4], "#020617", { name: "TVScreen" });

  addBox(root, [0.48, 0.04, 0.34], [1.15, 0.38, 1.45], "#374151", { name: "LaptopBase" });
  addBox(root, [0.44, 0.01, 0.28], [1.15, 0.405, 1.45], "#1f2937", { name: "LaptopKeyboard" });
  addBox(root, [0.3, 0.18, 0.018], [1.15, 0.52, 1.58], "#111827", { name: "LaptopLid" });
  addBox(root, [0.28, 0.16, 0.01], [1.15, 0.52, 1.592], "#020617", { name: "LaptopScreen" });

  addBox(root, [0.48, 0.52, 0.48], [0.95, 0.26, 0.15], "#1f2937", { name: "SideTable" });
  addBox(root, [0.42, 0.08, 0.42], [0.95, 0.56, 0.15], "#111827", { name: "SideTableTop" });
  addBox(root, [0.5, 0.55, 0.08], [0.95, 0.82, 0.22], woodDark, { name: "SideLamp" });

  const anchors = new THREE.Group();
  anchors.name = "Anchors";
  addEmpty(anchors, "monitor", [-2.05, 1.05, -2.55]);
  addEmpty(anchors, "projects", [2.85, 1.35, -2.15]);
  addEmpty(anchors, "resume", [-0.35, 0.72, -1.05]);
  addEmpty(anchors, "radio", [3.35, 0.92, 1.72]);
  addEmpty(anchors, "contact", [0.15, 1.32, -3.35]);
  addEmpty(anchors, "github", [1.15, 0.58, 1.45]);
  addEmpty(anchors, "exit", [0, 1.1, 3.05]);
  root.add(anchors);

  return root;
}

const scene = buildRoom();
const exporter = new GLTFExporter();

exporter.parse(
  scene,
  (result) => {
    mkdirSync(outDir, { recursive: true });
    const buffer = result instanceof ArrayBuffer ? result : result;
    writeFileSync(outPath, Buffer.from(buffer));
    console.log(`Wrote ${outPath} (${(buffer.byteLength / 1024).toFixed(1)} KB)`);
  },
  (error) => {
    console.error("GLTF export failed:", error);
    process.exit(1);
  },
  { binary: true }
);
