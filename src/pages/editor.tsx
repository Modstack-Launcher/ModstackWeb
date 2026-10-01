import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Eraser, ExternalLink, Grid3X3, Hand, PaintBucket, Pencil, Pipette, Redo2, RotateCcw, Undo2, Upload, ZoomIn, ZoomOut } from "lucide-react";
import { SkinObject, SkinViewer } from "skinview3d";
import { BufferGeometry, Float32BufferAttribute, FrontSide, Group, LineBasicMaterial, LineSegments, Mesh, MOUSE, Raycaster, Vector2, Vector3 } from "three";
import { useLanguage } from "../i18n";
import iconImg from "../images/placeholder.png";
import titleImg from "../images/modstack-title.png";
import "../styles/editor.css";

type Tool = "pencil" | "eraser" | "picker" | "fill" | "move";
type Model = "default" | "slim";
type SkinPart = "all" | "head" | "body" | "rightArm" | "leftArm" | "rightLeg" | "leftLeg";
type BodyPart = Exclude<SkinPart, "all">;
type EditLayer = "base" | "outer";
type VisibleLayers = Record<EditLayer, boolean>;
const SIZE = 64;
const AUTOSAVE_KEY = "modstack.editor.skin.v2";
const STUDIO_KEY = "modstack.studio.pendingSkin";
const MAX_HISTORY = 40;
const GRID_SURFACE_INSET = 0.045;
const copyPixels = (data: ImageData) => new ImageData(new Uint8ClampedArray(data.data), data.width, data.height);

type HsvColor = { h: number; s: number; v: number };
type PixelBounds = { x: number; y: number; width: number; height: number };
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function hexToHsv(hex: string): HsvColor {
  const value = hex.replace("#", "");
  const red = parseInt(value.slice(0, 2), 16) / 255;
  const green = parseInt(value.slice(2, 4), 16) / 255;
  const blue = parseInt(value.slice(4, 6), 16) / 255;
  const max = Math.max(red, green, blue), min = Math.min(red, green, blue), delta = max - min;
  let hue = 0;
  if (delta) {
    if (max === red) hue = 60 * (((green - blue) / delta) % 6);
    else if (max === green) hue = 60 * ((blue - red) / delta + 2);
    else hue = 60 * ((red - green) / delta + 4);
  }
  return { h: (hue + 360) % 360, s: max ? delta / max : 0, v: max };
}

function hsvToHex({ h, s, v }: HsvColor) {
  const chroma = v * s;
  const section = h / 60;
  const x = chroma * (1 - Math.abs(section % 2 - 1));
  const [red, green, blue] = section < 1 ? [chroma, x, 0] : section < 2 ? [x, chroma, 0] : section < 3 ? [0, chroma, x] : section < 4 ? [0, x, chroma] : section < 5 ? [x, 0, chroma] : [chroma, 0, x];
  const offset = v - chroma;
  return "#" + [red, green, blue].map((channel) => Math.round((channel + offset) * 255).toString(16).padStart(2, "0")).join("");
}

function SkindexColorPicker({ value, onChange, hueLabel, toneLabel, hexLabel }: {
  value: string; onChange: (color: string) => void; hueLabel: string; toneLabel: string; hexLabel: string;
}) {
  const hsv = hexToHsv(value);
  const updateHue = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    onChange(hsvToHex({ ...hsv, h: (Math.atan2(y, x) * 180 / Math.PI + 450) % 360 }));
  };
  const updateTone = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const bounds = event.currentTarget.getBoundingClientRect();
    onChange(hsvToHex({ h: hsv.h, s: clamp((event.clientX - bounds.left) / bounds.width), v: 1 - clamp((event.clientY - bounds.top) / bounds.height) }));
  };
  const hueRadians = hsv.h * Math.PI / 180;
  const style = {
    "--picker-hue": `hsl(${hsv.h} 100% 50%)`,
    "--hue-x": `${50 + 42 * Math.sin(hueRadians)}%`,
    "--hue-y": `${50 - 42 * Math.cos(hueRadians)}%`,
    "--tone-x": `${hsv.s * 100}%`,
    "--tone-y": `${(1 - hsv.v) * 100}%`,
    "--picked-color": value,
  } as React.CSSProperties;
  return (
    <div className="skin-editor-color-picker" style={style}>
      <div className="skin-editor-hue-ring" role="slider" aria-label={hueLabel} aria-valuemin={0} aria-valuemax={360} aria-valuenow={Math.round(hsv.h)} tabIndex={0}
        onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); updateHue(event); }} onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) updateHue(event); }}>
        <i className="skin-editor-hue-marker" />
        <div className="skin-editor-tone-square" role="slider" aria-label={toneLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(hsv.v * 100)} tabIndex={0}
          onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); updateTone(event); }} onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) updateTone(event); }}>
          <i className="skin-editor-tone-marker" />
        </div>
      </div>
      <input key={value} className="skin-editor-color-value" defaultValue={value.toUpperCase()} aria-label={hexLabel} maxLength={7}
        onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }}
        onBlur={(event) => { const next = event.currentTarget.value.trim(); if (/^#[0-9a-f]{6}$/i.test(next)) onChange(next.toLowerCase()); else event.currentTarget.value = value.toUpperCase(); }} />
    </div>
  );
}

const labels = {
  en: { title: "Skin Editor", subtitle: "Create a Minecraft skin pixel by pixel", back: "Home", tools: "Tools", pencil: "Pencil", eraser: "Eraser", picker: "Color picker", fill: "Fill", color: "Color", history: "History", undo: "Undo", redo: "Redo", canvas: "Canvas", grid: "Grid", outer: "Outer layer", zoom: "Zoom", model: "Arm model", classic: "Classic", slim: "Slim", preview: "3D Preview", import: "Import PNG", download: "Download skin", reset: "New skin", saved: "Saved automatically", invalid: "Choose a 64×64 or 64×32 Minecraft skin PNG.", ready: "Your skin is ready!", readyText: "Download complete. Want to create a pose or render with this skin?", studio: "Open in Studio", dismiss: "Keep editing", confirmReset: "Replace the current skin with a new starter skin?", tip: "Paint directly on the character. Rotate it to edit the back.", parts: "Body parts", all: "Full skin", head: "Head", body: "Body", rightArm: "Right arm", leftArm: "Left arm", rightLeg: "Right leg", leftLeg: "Left leg", shortcuts: "Shortcuts", undoShortcut: "Ctrl + Z to undo", redoShortcut: "Ctrl + Y to redo", bodyLayer: "Body", outerLayer: "Outer layer", front: "Front", backView: "Back", rotate: "Rotate skin" },
  es: { title: "Editor de skins", subtitle: "Crea una skin de Minecraft píxel por píxel", back: "Inicio", tools: "Herramientas", pencil: "Lápiz", eraser: "Borrador", picker: "Cuentagotas", fill: "Relleno", color: "Color", history: "Historial", undo: "Deshacer", redo: "Rehacer", canvas: "Lienzo", grid: "Cuadrícula", outer: "Capa exterior", zoom: "Zoom", model: "Modelo de brazos", classic: "Clásico", slim: "Delgado", preview: "Vista 3D", import: "Importar PNG", download: "Descargar skin", reset: "Nueva skin", saved: "Guardado automático", invalid: "Elige una skin PNG de Minecraft de 64×64 o 64×32.", ready: "¡Tu skin está lista!", readyText: "La descarga terminó. ¿Quieres crear una pose o un render con esta skin?", studio: "Abrir en Studio", dismiss: "Seguir editando", confirmReset: "¿Reemplazar la skin actual por una nueva skin inicial?", tip: "Pinta directamente sobre el personaje. Gíralo para editar la espalda.", parts: "Partes del cuerpo", all: "Skin completa", head: "Cabeza", body: "Cuerpo", rightArm: "Brazo derecho", leftArm: "Brazo izquierdo", rightLeg: "Pierna derecha", leftLeg: "Pierna izquierda", shortcuts: "Atajos", undoShortcut: "Ctrl + Z para deshacer", redoShortcut: "Ctrl + Y para rehacer", bodyLayer: "Cuerpo", outerLayer: "Capa exterior", front: "Frente", backView: "Espalda", rotate: "Girar skin" },
  pt: { title: "Editor de skins", subtitle: "Crie uma skin do Minecraft pixel por pixel", back: "Início", tools: "Ferramentas", pencil: "Lápis", eraser: "Borracha", picker: "Conta-gotas", fill: "Preencher", color: "Cor", history: "Histórico", undo: "Desfazer", redo: "Refazer", canvas: "Tela", grid: "Grade", outer: "Camada externa", zoom: "Zoom", model: "Modelo dos braços", classic: "Clássico", slim: "Fino", preview: "Visualização 3D", import: "Importar PNG", download: "Baixar skin", reset: "Nova skin", saved: "Salvo automaticamente", invalid: "Escolha uma skin PNG do Minecraft de 64×64 ou 64×32.", ready: "Sua skin está pronta!", readyText: "O download terminou. Quer criar uma pose ou render com esta skin?", studio: "Abrir no Studio", dismiss: "Continuar editando", confirmReset: "Substituir a skin atual por uma nova skin inicial?", tip: "Pinte diretamente no personagem. Gire-o para editar as costas.", parts: "Partes do corpo", all: "Skin completa", head: "Cabeça", body: "Corpo", rightArm: "Braço direito", leftArm: "Braço esquerdo", rightLeg: "Perna direita", leftLeg: "Perna esquerda", shortcuts: "Atalhos", undoShortcut: "Ctrl + Z para desfazer", redoShortcut: "Ctrl + Y para refazer", bodyLayer: "Corpo", outerLayer: "Camada externa", front: "Frente", backView: "Costas", rotate: "Girar skin" },
} as const;

const pickerLabels = {
  en: { hue: "Hue", tone: "Saturation and brightness", hex: "Hex color" },
  es: { hue: "Tono", tone: "Saturación y brillo", hex: "Color hexadecimal" },
  pt: { hue: "Matiz", tone: "Saturação e brilho", hex: "Cor hexadecimal" },
} as const;

const importLabels = {
  en: { title: "Choose the arm model", description: "Which model does this PNG use?", cancel: "Cancel" },
  es: { title: "Elige el modelo de brazos", description: "¿Qué modelo usa este PNG?", cancel: "Cancelar" },
  pt: { title: "Escolha o modelo de braços", description: "Qual modelo este PNG usa?", cancel: "Cancelar" },
} as const;

function createBlankSkin(context: CanvasRenderingContext2D) {
  context.clearRect(0, 0, SIZE, SIZE);
}

function getPartBounds(part: BodyPart, layer: EditLayer, model: Model): PixelBounds {
  const armWidth = model === "slim" ? 14 : 16;
  const bounds: Record<EditLayer, Record<BodyPart, PixelBounds>> = {
    base: {
      head: { x: 0, y: 0, width: 32, height: 16 },
      body: { x: 16, y: 16, width: 24, height: 16 },
      rightArm: { x: 40, y: 16, width: armWidth, height: 16 },
      leftArm: { x: 32, y: 48, width: armWidth, height: 16 },
      rightLeg: { x: 0, y: 16, width: 16, height: 16 },
      leftLeg: { x: 16, y: 48, width: 16, height: 16 },
    },
    outer: {
      head: { x: 32, y: 0, width: 32, height: 16 },
      body: { x: 16, y: 32, width: 24, height: 16 },
      rightArm: { x: 40, y: 32, width: armWidth, height: 16 },
      leftArm: { x: 48, y: 48, width: armWidth, height: 16 },
      rightLeg: { x: 0, y: 32, width: 16, height: 16 },
      leftLeg: { x: 0, y: 48, width: 16, height: 16 },
    },
  };
  return bounds[layer][part];
}

function createPixelGridFaces(width: number, height: number, depth: number, xCells: number, yCells: number, zCells: number, scaleX: number, scaleY: number, scaleZ: number, color: number, opacity: number, renderOrder: number) {
  const result = new Group();
  result.name = "editor-pixel-grid";
  const halfWidth = width / 2, halfHeight = height / 2, halfDepth = depth / 2;
  // Keep the grid just behind the textured surface. Opaque pixels then hide
  // their lines while transparent pixels still reveal the editing grid.
  const insetX = GRID_SURFACE_INSET / Math.max(Math.abs(scaleX), 1e-6);
  const insetY = GRID_SURFACE_INSET / Math.max(Math.abs(scaleY), 1e-6);
  const insetZ = GRID_SURFACE_INSET / Math.max(Math.abs(scaleZ), 1e-6);
  type Axis = [number, number, number];
  const addFace = (center: Axis, uAxis: Axis, vAxis: Axis, normal: Axis, uLength: number, vLength: number, uCells: number, vCells: number) => {
    const points: number[] = [];
    const point = (u: number, v: number) => [center[0] + uAxis[0] * u + vAxis[0] * v, center[1] + uAxis[1] * u + vAxis[1] * v, center[2] + uAxis[2] * u + vAxis[2] * v] as Axis;
    for (let cell = 0; cell <= uCells; cell++) { const u = -uLength / 2 + uLength * cell / uCells; points.push(...point(u, -vLength / 2), ...point(u, vLength / 2)); }
    for (let cell = 0; cell <= vCells; cell++) { const v = -vLength / 2 + vLength * cell / vCells; points.push(...point(-uLength / 2, v), ...point(uLength / 2, v)); }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
    const material = new LineBasicMaterial({ color, transparent: true, opacity, depthTest: true, depthWrite: true, toneMapped: false });
    const lines = new LineSegments(geometry, material);
    const localNormal = new Vector3(...normal), worldNormal = new Vector3(), worldPosition = new Vector3(), cameraDirection = new Vector3();
    lines.userData.gridOpacity = opacity;
    lines.renderOrder = renderOrder; lines.frustumCulled = false;
    lines.onBeforeRender = (_renderer, _scene, camera) => {
      worldNormal.copy(localNormal).transformDirection(lines.matrixWorld);
      lines.getWorldPosition(worldPosition);
      cameraDirection.copy(camera.position).sub(worldPosition).normalize();
      material.opacity = worldNormal.dot(cameraDirection) > 0.012 ? lines.userData.gridOpacity as number : 0;
    };
    result.add(lines);
  };
  addFace([0, 0, halfDepth - insetZ], [1, 0, 0], [0, 1, 0], [0, 0, 1], width, height, xCells, yCells);
  addFace([0, 0, -halfDepth + insetZ], [-1, 0, 0], [0, 1, 0], [0, 0, -1], width, height, xCells, yCells);
  addFace([halfWidth - insetX, 0, 0], [0, 0, -1], [0, 1, 0], [1, 0, 0], depth, height, zCells, yCells);
  addFace([-halfWidth + insetX, 0, 0], [0, 0, 1], [0, 1, 0], [-1, 0, 0], depth, height, zCells, yCells);
  addFace([0, halfHeight - insetY, 0], [1, 0, 0], [0, 0, -1], [0, 1, 0], width, depth, xCells, zCells);
  addFace([0, -halfHeight + insetY, 0], [1, 0, 0], [0, 0, 1], [0, -1, 0], width, depth, xCells, zCells);
  return result;
}

function installPixelGrid(gridObject: SkinObject, model: Model) {
  const nodes = { head: gridObject.head, body: gridObject.body, rightArm: gridObject.rightArm, leftArm: gridObject.leftArm, rightLeg: gridObject.rightLeg, leftLeg: gridObject.leftLeg };
  const cells: Record<BodyPart, [number, number, number]> = {
    head: [8, 8, 8], body: [8, 12, 4], rightArm: [model === "slim" ? 3 : 4, 12, 4], leftArm: [model === "slim" ? 3 : 4, 12, 4], rightLeg: [4, 12, 4], leftLeg: [4, 12, 4],
  };
  (Object.entries(nodes) as Array<[BodyPart, (typeof nodes)[BodyPart]]>).forEach(([id, part]) => {
    [part.innerLayer, part.outerLayer].forEach((layer, layerIndex) => {
      if (!(layer instanceof Mesh)) return;
      const previous = layer.getObjectByName("editor-pixel-grid");
      if (previous) {
        previous.traverse((object) => {
          if (!(object instanceof LineSegments)) return;
          object.geometry.dispose();
          (object.material as LineBasicMaterial).dispose();
        });
        layer.remove(previous);
      }
      layer.geometry.computeBoundingBox();
      const bounds = layer.geometry.boundingBox;
      if (!bounds) return;
      const width = bounds.max.x - bounds.min.x, height = bounds.max.y - bounds.min.y, depth = bounds.max.z - bounds.min.z;
      const isOuter = layerIndex === 1;
      const lines = createPixelGridFaces(width, height, depth, ...cells[id], layer.scale.x, layer.scale.y, layer.scale.z, 0x566575, isOuter ? 0.82 : 0.76, isOuter ? 4 : 2);
      layer.add(lines);
      const materials = Array.isArray(layer.material) ? layer.material : [layer.material];
      materials.forEach((material) => {
        material.colorWrite = false; material.depthWrite = false; material.transparent = true; material.opacity = 0;
        material.alphaTest = 0; material.side = FrontSide; material.needsUpdate = true;
      });
      layer.renderOrder = isOuter ? 3 : 1;
    });
  });
}

function alignSkinParts(skin: SkinObject, model: Model) {
  skin.rightLeg.position.x = -2;
  skin.leftLeg.position.x = 2;
  skin.rightLeg.position.z = 0;
  skin.leftLeg.position.z = 0;

  skin.head.outerLayer.scale.setScalar(1);
  skin.body.outerLayer.scale.setScalar(1);
  [skin.rightArm.outerLayer, skin.leftArm.outerLayer].forEach((layer) => {
    layer.scale.set(model === "slim" ? 3.5 : 4.5, 12.5, 4.5);
  });
  skin.rightLeg.outerLayer.scale.setScalar(1);
  skin.leftLeg.outerLayer.scale.setScalar(1);

  skin.head.outerLayer.position.set(0, 4, 0);
  skin.body.outerLayer.position.set(0, 0, 0);
  skin.rightArm.outerLayer.position.set(0, 0, 0);
  skin.leftArm.outerLayer.position.set(0, 0, 0);
  skin.rightLeg.outerLayer.position.set(0, 0, 0);
  skin.leftLeg.outerLayer.position.set(0, 0, 0);
}

function DirectSkinViewer({ source, revision, model, layers, activeLayer, visibleParts, tool, zoom, grid, onPixel }: {
  source: HTMLCanvasElement | null; revision: number; model: Model; layers: VisibleLayers; activeLayer: EditLayer; visibleParts: Record<BodyPart, boolean>; tool: Tool; zoom: number; grid: boolean;
  onPixel: (x: number, y: number, part: BodyPart, start: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<SkinViewer | null>(null);
  const gridObjectRef = useRef<SkinObject | null>(null);
  const gridModelRef = useRef<Model | null>(null);
  const raycasterRef = useRef(new Raycaster());
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const viewer = new SkinViewer({ canvas, width: 520, height: 620, pixelRatio: "match-device" });
    viewer.background = null;
    viewer.zoom = 0.9;
    viewer.controls.enablePan = false;
    const gridObject = new SkinObject();
    gridObject.name = "editor-grid"; gridObject.position.y = 8;
    gridObject.setInnerLayerVisible(true); gridObject.setOuterLayerVisible(false);
    installPixelGrid(gridObject, "default");
    gridModelRef.current = "default";
    viewer.playerObject.add(gridObject); gridObjectRef.current = gridObject;
    viewerRef.current = viewer;
    const resize = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) viewer.setSize(rect.width, rect.height);
    });
    resize.observe(canvas);
    return () => { resize.disconnect(); viewer.dispose(); viewerRef.current = null; gridObjectRef.current = null; };
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !source || !revision) return;
    viewer.loadSkin(source, { model });
    const skin = viewer.playerObject.skin;
    [skin.head, skin.body, skin.rightArm, skin.leftArm, skin.rightLeg, skin.leftLeg].forEach((bodyPart) => {
      [bodyPart.innerLayer, bodyPart.outerLayer].forEach((layer) => layer.traverse((object) => {
        if (!(object instanceof Mesh)) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          material.transparent = true;
          material.alphaTest = 1e-5;
          material.depthTest = true;
          material.depthWrite = true;
          material.polygonOffset = true;
          material.polygonOffsetFactor = -2;
          material.polygonOffsetUnits = -2;
          material.needsUpdate = true;
        });
      }));
    });
  }, [model, revision, source]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.zoom = zoom;
    viewer.controls.enabled = true;
    const mouseButtons = viewer.controls.mouseButtons as unknown as { LEFT: number; RIGHT: number };
    mouseButtons.LEFT = tool === "move" ? MOUSE.ROTATE : -1;
    mouseButtons.RIGHT = MOUSE.ROTATE;
    const skin = viewer.playerObject.skin;
    skin.setInnerLayerVisible(layers.base);
    skin.setOuterLayerVisible(layers.outer);
    alignSkinParts(skin, model);
    const nodes = { head: skin.head, body: skin.body, rightArm: skin.rightArm, leftArm: skin.leftArm, rightLeg: skin.rightLeg, leftLeg: skin.leftLeg };
    (Object.entries(nodes) as Array<[BodyPart, (typeof nodes)[BodyPart]]>).forEach(([id, node]) => { node.visible = visibleParts[id]; });
    const gridObject = gridObjectRef.current;
    if (gridObject) {
      if (gridModelRef.current !== model) {
        gridObject.modelType = model;
        installPixelGrid(gridObject, model);
        gridModelRef.current = model;
      }
      gridObject.visible = grid && (layers.base || layers.outer);
      gridObject.setInnerLayerVisible(layers.base);
      gridObject.setOuterLayerVisible(layers.outer);
      alignSkinParts(gridObject, model);
      const gridNodes = { head: gridObject.head, body: gridObject.body, rightArm: gridObject.rightArm, leftArm: gridObject.leftArm, rightLeg: gridObject.rightLeg, leftLeg: gridObject.leftLeg };
      (Object.entries(gridNodes) as Array<[BodyPart, (typeof gridNodes)[BodyPart]]>).forEach(([id, node]) => {
        node.visible = visibleParts[id];
        node.innerLayer.traverse((object) => { if (object instanceof LineSegments) object.userData.gridOpacity = activeLayer === "outer" ? 0.32 : 0.82; });
        node.outerLayer.traverse((object) => { if (object instanceof LineSegments) object.userData.gridOpacity = 0.82; });
      });
    }
  }, [activeLayer, grid, layers, model, tool, visibleParts, zoom]);

  const locatePixel = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const viewer = viewerRef.current;
    if (!viewer) return null;
    const rect = event.currentTarget.getBoundingClientRect();
    const pointer = new Vector2(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycasterRef.current.setFromCamera(pointer, viewer.camera);
    if (!layers[activeLayer]) return null;
    const skin = viewer.playerObject.skin;
    const nodes = { head: skin.head, body: skin.body, rightArm: skin.rightArm, leftArm: skin.leftArm, rightLeg: skin.rightLeg, leftLeg: skin.leftLeg };
    const targets = (Object.entries(nodes) as Array<[BodyPart, (typeof nodes)[BodyPart]]>)
      .filter(([id]) => visibleParts[id])
      .map(([id, node]) => ({ id, object: activeLayer === "base" ? node.innerLayer : node.outerLayer }));
    const hit = raycasterRef.current.intersectObjects(targets.map(({ object }) => object), true)[0];
    if (!hit?.uv) return null;
    const target = targets.find(({ object }) => {
      let current: typeof hit.object | null = hit.object;
      while (current) { if (current === object) return true; current = current.parent; }
      return false;
    });
    if (!target) return null;
    return [Math.max(0, Math.min(63, Math.floor(hit.uv.x * 64))), Math.max(0, Math.min(63, Math.floor((1 - hit.uv.y) * 64))), target.id] as [number, number, BodyPart];
  };
  const pointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.button === 2 || tool === "move") return;
    event.preventDefault();
    const pixel = locatePixel(event); if (!pixel) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true; onPixel(pixel[0], pixel[1], pixel[2], true);
  };
  const pointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || tool === "move") return;
    const pixel = locatePixel(event); if (pixel) onPixel(pixel[0], pixel[1], pixel[2], false);
  };
  const pointerUp = () => { drawingRef.current = false; };

  return <canvas ref={canvasRef} className={`skin-editor-3d-canvas ${tool === "move" ? "moving" : "painting"}`} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onContextMenu={(event) => event.preventDefault()} />;
}

export default function EditorPage() {
  const { language } = useLanguage();
  const text = labels[language];
  const pickerText = pickerLabels[language];
  const importText = importLabels[language];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const undoRef = useRef<ImageData[]>([]);
  const redoRef = useRef<ImageData[]>([]);
  const [tool, setTool] = useState<Tool>("pencil");
  const [visibleParts, setVisibleParts] = useState<Record<BodyPart, boolean>>({ head: true, body: true, rightArm: true, leftArm: true, rightLeg: true, leftLeg: true });
  const [color, setColor] = useState("#2596be");
  const [zoom, setZoom] = useState(0.9);
  const [grid, setGrid] = useState(true);
  const [layers, setLayers] = useState<VisibleLayers>({ base: true, outer: false });
  const [activeLayer, setActiveLayer] = useState<EditLayer>("base");
  const [model, setModel] = useState<Model>("default");
  const [revision, setRevision] = useState(0);
  const [history, setHistory] = useState({ undo: 0, redo: 0 });
  const [error, setError] = useState("");
  const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);
  const [showImportModelPrompt, setShowImportModelPrompt] = useState(false);
  const [showStudioPrompt, setShowStudioPrompt] = useState(false);
  const context = () => canvasRef.current?.getContext("2d", { willReadFrequently: true }) ?? null;
  const syncHistory = () => setHistory({ undo: undoRef.current.length, redo: redoRef.current.length });

  const saveSnapshot = useCallback(() => {
    const ctx = context();
    if (!ctx) return;
    undoRef.current = [...undoRef.current, copyPixels(ctx.getImageData(0, 0, SIZE, SIZE))].slice(-MAX_HISTORY);
    redoRef.current = [];
    syncHistory();
  }, []);
  const markChanged = () => setRevision((value) => value + 1);

  useEffect(() => { document.title = text.title + " - Modstack"; }, [text.title]);
  useEffect(() => {
    const ctx = context();
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    const saved = window.localStorage.getItem(AUTOSAVE_KEY);
    if (!saved) { createBlankSkin(ctx); setRevision(1); return; }
    const image = new Image();
    image.onload = () => { ctx.clearRect(0, 0, SIZE, SIZE); ctx.drawImage(image, 0, 0, SIZE, SIZE); setRevision(1); };
    image.onerror = () => { createBlankSkin(ctx); setRevision(1); };
    image.src = saved;
  }, []);
  useEffect(() => {
    if (!revision || !canvasRef.current) return;
    const timeout = window.setTimeout(() => {
      const dataUrl = canvasRef.current?.toDataURL("image/png") ?? "";
      try { window.localStorage.setItem(AUTOSAVE_KEY, dataUrl); } catch { /* unavailable */ }
    }, 90);
    return () => window.clearTimeout(timeout);
  }, [revision]);

  const paintPixel = (x: number, y: number) => {
    const ctx = context(); if (!ctx) return;
    if (tool === "eraser") ctx.clearRect(x, y, 1, 1);
    else { ctx.fillStyle = color; ctx.fillRect(x, y, 1, 1); }
  };
  const pickColor = (x: number, y: number) => {
    const pixel = context()?.getImageData(x, y, 1, 1).data;
    if (!pixel || pixel[3] === 0) return;
    setColor("#" + [pixel[0], pixel[1], pixel[2]].map((value) => value.toString(16).padStart(2, "0")).join(""));
    setTool("pencil");
  };
  const fillArea = (startX: number, startY: number, part: BodyPart) => {
    const ctx = context(); if (!ctx) return;
    const image = ctx.getImageData(0, 0, SIZE, SIZE), data = image.data, start = (startY * SIZE + startX) * 4;
    const bounds = getPartBounds(part, activeLayer, model);
    const insidePart = (x: number, y: number) => x >= bounds.x && y >= bounds.y && x < bounds.x + bounds.width && y < bounds.y + bounds.height;
    const target = Array.from(data.slice(start, start + 4));
    const replacement = tool === "eraser" ? [0, 0, 0, 0] : [...color.match(/\w\w/g)!.map((part) => parseInt(part, 16)), 255];
    if (target.every((value, index) => value === replacement[index])) return;
    const matches = (x: number, y: number) => { const index = (y * SIZE + x) * 4; return target.every((value, offset) => data[index + offset] === value); };
    const stack: Array<[number, number]> = [[startX, startY]];
    while (stack.length) {
      const [x, y] = stack.pop()!;
      if (!insidePart(x, y) || !matches(x, y)) continue;
      const index = (y * SIZE + x) * 4; replacement.forEach((value, offset) => { data[index + offset] = value; });
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    ctx.putImageData(image, 0, 0);
  };
  const handle3DPixel = (x: number, y: number, part: BodyPart, start: boolean) => {
    if (tool === "picker") { if (start) pickColor(x, y); return; }
    if (start) saveSnapshot();
    if (tool === "fill") { if (start) { fillArea(x, y, part); markChanged(); } return; }
    if (tool === "pencil" || tool === "eraser") { paintPixel(x, y); markChanged(); }
  };
  const undo = () => {
    const ctx = context(), previous = undoRef.current.pop(); if (!ctx || !previous) return;
    redoRef.current.push(copyPixels(ctx.getImageData(0, 0, SIZE, SIZE))); ctx.putImageData(previous, 0, 0); syncHistory(); markChanged();
  };
  const redo = () => {
    const ctx = context(), next = redoRef.current.pop(); if (!ctx || !next) return;
    undoRef.current.push(copyPixels(ctx.getImageData(0, 0, SIZE, SIZE))); ctx.putImageData(next, 0, 0); syncHistory(); markChanged();
  };
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']")) return;
      if (event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo(); else undo();
      } else if (event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
  const importSkin = (file: File, importedModel: Model) => {
    setError(""); const image = new Image(), url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      if (!((image.width === 64 && image.height === 64) || (image.width === 64 && image.height === 32))) { setError(text.invalid); return; }
      const ctx = context(); if (!ctx) return;
      saveSnapshot(); setModel(importedModel); ctx.clearRect(0, 0, SIZE, SIZE); ctx.drawImage(image, 0, 0); markChanged();
    };
    image.onerror = () => { URL.revokeObjectURL(url); setError(text.invalid); }; image.src = url;
  };
  const chooseImportModel = (importedModel: Model) => {
    if (pendingImportFile) importSkin(pendingImportFile, importedModel);
    setPendingImportFile(null);
    setShowImportModelPrompt(false);
  };
  const download = () => {
    if (!canvasRef.current) return;
    const anchor = document.createElement("a"); anchor.download = "modstack-skin.png"; anchor.href = canvasRef.current.toDataURL("image/png"); anchor.click(); setShowStudioPrompt(true);
  };
  const openStudio = () => {
    const skin = canvasRef.current?.toDataURL("image/png");
    if (skin) window.localStorage.setItem(STUDIO_KEY, JSON.stringify({ skin, model }));
    window.location.href = "/studio";
  };
  const reset = () => {
    if (!window.confirm(text.confirmReset)) return;
    const ctx = context(); if (!ctx) return; saveSnapshot(); createBlankSkin(ctx); markChanged();
  };
  const tools: Array<{ id: Tool; icon: typeof Pencil; label: string }> = [
    { id: "pencil", icon: Pencil, label: text.pencil }, { id: "eraser", icon: Eraser, label: text.eraser },
    { id: "move", icon: Hand, label: language === "en" ? "Move / rotate" : "Mover / girar" },
    { id: "picker", icon: Pipette, label: text.picker }, { id: "fill", icon: PaintBucket, label: text.fill },
  ];
  const parts: Array<{ id: SkinPart; label: string; shape: string }> = [
    { id: "all", label: text.all, shape: "all" }, { id: "head", label: text.head, shape: "head" },
    { id: "body", label: text.body, shape: "body" }, { id: "rightArm", label: text.rightArm, shape: "arm" },
    { id: "leftArm", label: text.leftArm, shape: "arm" }, { id: "rightLeg", label: text.rightLeg, shape: "leg" },
    { id: "leftLeg", label: text.leftLeg, shape: "leg" },
  ];
  const allPartsVisible = Object.values(visibleParts).every(Boolean);
  const togglePart = (id: SkinPart) => {
    if (id === "all") {
      const next = !allPartsVisible;
      setVisibleParts({ head: next, body: next, rightArm: next, leftArm: next, rightLeg: next, leftLeg: next });
      return;
    }
    setVisibleParts((current) => ({ ...current, [id]: !current[id] }));
  };
  const isPartVisible = (id: SkinPart) => id === "all" ? allPartsVisible : visibleParts[id];
  const toggleLayer = (id: EditLayer) => {
    const nextVisible = !layers[id];
    const otherLayer: EditLayer = id === "base" ? "outer" : "base";
    setLayers((current) => ({ ...current, [id]: nextVisible }));
    if (nextVisible && (id === "outer" || !layers.outer)) setActiveLayer(id);
    else if (activeLayer === id && layers[otherLayer]) setActiveLayer(otherLayer);
  };
  return (
    <div className="skin-editor-root">
      <header className="skin-editor-header">
        <a href="/" className="skin-editor-brand"><img src={iconImg} alt="Modstack" /><img src={titleImg} alt="Modstack" /></a>
        <div className="skin-editor-heading"><strong>{text.title}</strong><span>{text.subtitle}</span></div>
        <a href="/" className="skin-editor-home">{text.back}</a>
      </header>
      <main className="skin-editor-workspace">
        <aside className="skin-editor-panel">
          <h2>{text.tools}</h2>
          <div className="skin-editor-tool-grid">
            {tools.map(({ id, icon: Icon, label }) => <button key={id} className={tool === id ? "active" : ""} onClick={() => setTool(id)} title={label}><Icon size={17} /><span>{label}</span></button>)}
          </div>
          <h2>{text.history}</h2>
          <div className="skin-editor-row"><button onClick={undo} disabled={!history.undo}><Undo2 size={16} />{text.undo}</button><button onClick={redo} disabled={!history.redo}><Redo2 size={16} />{text.redo}</button></div>
          <div className="skin-editor-shortcuts"><span>{text.undoShortcut}</span><span>{text.redoShortcut}</span></div>
          <h2>{text.canvas}</h2>
          <button className={grid ? "active wide" : "wide"} onClick={() => setGrid((value) => !value)}><Grid3X3 size={16} />{text.grid}</button>
          <div className="skin-editor-zoom"><span>{text.zoom}: {Math.round(zoom * 100)}%</span><div><button onClick={() => setZoom((value) => Math.max(0.55, value - 0.1))}><ZoomOut size={15} /></button><button onClick={() => setZoom((value) => Math.min(1.5, value + 0.1))}><ZoomIn size={15} /></button></div></div>
        </aside>
        <section className="skin-editor-canvas-area">
          <canvas ref={canvasRef} width={SIZE} height={SIZE} className="skin-editor-source-canvas" />
          <div className={`skin-editor-mannequin-wrap ${grid ? "with-grid" : ""}`}>
            <DirectSkinViewer source={canvasRef.current} revision={revision} model={model} layers={layers} activeLayer={activeLayer} visibleParts={visibleParts} tool={tool} zoom={zoom} grid={grid} onPixel={handle3DPixel} />
          </div>
          <span className="skin-editor-autosave">{text.saved}</span><p>{text.tip}</p>
        </section>
        <aside className="skin-editor-preview">
          <h2>{text.color}</h2>
          <SkindexColorPicker value={color} hueLabel={pickerText.hue} toneLabel={pickerText.tone} hexLabel={pickerText.hex} onChange={(nextColor) => { setColor(nextColor); setTool("pencil"); }} />
          <div className="skin-editor-layer-tabs"><button className={`${layers.base ? "active" : ""} ${activeLayer === "base" ? "editing" : ""}`} aria-pressed={layers.base} onClick={() => toggleLayer("base")}>{text.bodyLayer}</button><button className={`${layers.outer ? "active" : ""} ${activeLayer === "outer" ? "editing" : ""}`} aria-pressed={layers.outer} onClick={() => toggleLayer("outer")}>{text.outerLayer}</button></div>
          <h2>{text.parts}</h2>
          <div className="skin-editor-part-grid">
            {parts.map(({ id, label, shape }) => <button key={id} className={isPartVisible(id) ? "active" : "hidden"} aria-pressed={isPartVisible(id)} onClick={() => togglePart(id)} title={label}><i className={`skin-part-icon ${shape}`} /><span>{label}</span></button>)}
          </div>
          <span>{text.model}</span>
          <div className="skin-editor-model"><button className={model === "default" ? "active" : ""} onClick={() => setModel("default")}>{text.classic}</button><button className={model === "slim" ? "active" : ""} onClick={() => setModel("slim")}>{text.slim}</button></div>
          <input ref={fileRef} type="file" accept="image/png" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) { setPendingImportFile(file); setShowImportModelPrompt(true); } event.currentTarget.value = ""; }} />
          <button className="skin-editor-action secondary" onClick={() => fileRef.current?.click()}><Upload size={17} />{text.import}</button>
          <button className="skin-editor-action primary" onClick={download}><Download size={17} />{text.download}</button>
          <button className="skin-editor-action ghost" onClick={reset}><RotateCcw size={16} />{text.reset}</button>
          {error && <p className="skin-editor-error">{error}</p>}
        </aside>
      </main>
      {showImportModelPrompt && <div className="skin-editor-prompt" role="dialog" aria-modal="true" aria-labelledby="skin-import-model-title"><div><h2 id="skin-import-model-title">{importText.title}</h2><p>{importText.description}</p><div><button onClick={() => { setPendingImportFile(null); setShowImportModelPrompt(false); }}>{importText.cancel}</button><button onClick={() => chooseImportModel("default")}>{text.classic} (4px)</button><button className="primary" onClick={() => chooseImportModel("slim")}>{text.slim} (3px)</button></div></div></div>}
      {showStudioPrompt && <div className="skin-editor-prompt" role="dialog" aria-modal="true"><div><h2>{text.ready}</h2><p>{text.readyText}</p><div><button onClick={() => setShowStudioPrompt(false)}>{text.dismiss}</button><button className="primary" onClick={openStudio}>{text.studio}<ExternalLink size={16} /></button></div></div></div>}
    </div>
  );
}
