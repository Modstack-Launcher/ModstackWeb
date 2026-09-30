import { useEffect, useRef, useState } from 'react';
import { SkinViewer, IdleAnimation, WalkingAnimation, RunningAnimation, FlyingAnimation } from 'skinview3d';
import { GridHelper, Color, LineBasicMaterial, Material } from 'three';
import { useStudioState } from '../../hooks/useStudioState';
import type { ModelType } from '../../types/studioTypes';

const DEFAULT_SKIN = 'https://mc-heads.net/skin/MHF_Steve';
const DEFAULT_SKIN_FALLBACKS = [
  'https://minotar.net/skin/MHF_Steve',
  'https://mineskin.eu/skin/MHF_Steve',
];

export default function StudioViewport({ onStatus }: { onStatus: (s: { fps: number; zoom: number }) => void }) {
  const { state, viewerRef, dispatch, applyPoseToViewer } = useStudioState();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<GridHelper | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const viewer = new SkinViewer({
      canvas: canvasRef.current,
      width: wrapRef.current?.clientWidth || 600,
      height: wrapRef.current?.clientHeight || 600,
      preserveDrawingBuffer: true,
    });
    viewerRef.current = viewer;

    const grid = new GridHelper(60, 60, 0x2596be, 0x2596be);
    grid.position.y = -16;
    const gmat = grid.material as LineBasicMaterial;
    gmat.transparent = true;
    gmat.opacity = 0.25;
    viewer.scene.add(grid);
    gridRef.current = grid;

    const loadDefaultSkin = async () => {
      try {
        const pendingValue = window.localStorage.getItem('modstack.studio.pendingSkin');
        if (pendingValue) {
          const pending = JSON.parse(pendingValue) as { skin?: string; model?: ModelType };
          if (pending.skin?.startsWith('data:image/png')) {
            const selectedModel = pending.model === 'slim' ? 'slim' : 'default';
            await viewer.loadSkin(pending.skin, { model: selectedModel });
            dispatch({ type: 'SET_SKIN', source: pending.skin, preview: pending.skin, model: selectedModel, detected: selectedModel });
            window.localStorage.removeItem('modstack.studio.pendingSkin');
            return;
          }
        }
      } catch {
        window.localStorage.removeItem('modstack.studio.pendingSkin');
      }

      const tryUrl = async (url: string): Promise<Blob> => {
        const res = await fetch(url, { mode: 'cors' });
        if (!res.ok) throw new Error(`${res.status}`);
        return res.blob();
      };
      for (const url of [DEFAULT_SKIN, ...DEFAULT_SKIN_FALLBACKS]) {
        try {
          const blob = await tryUrl(url);
          const objUrl = URL.createObjectURL(blob);
          try {
            await viewer.loadSkin(objUrl, { model: 'auto-detect' });
          } finally {
            URL.revokeObjectURL(objUrl);
          }
          const det = viewer.playerObject.skin.modelType as ModelType;
          dispatch({ type: 'SET_SKIN', source: url, preview: null, model: det, detected: det });
          return;
        } catch { /* try next provider */ }
      }
      setError('Could not load default skin. Upload one to begin.');
    };
    loadDefaultSkin();

    return () => {
      viewer.dispose();
      gridRef.current = null;
      // Only null the shared ref if it still points at the viewer we just disposed;
      // a later mount may have already swapped in a new viewer.
      if (viewerRef.current === viewer) viewerRef.current = null;
    };
  }, [viewerRef, dispatch]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => {
      const v = viewerRef.current;
      if (v && wrapRef.current) v.setSize(wrapRef.current.clientWidth, wrapRef.current.clientHeight);
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [viewerRef]);

  const { scene } = state;
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.background = scene.backgroundType === 'transparent' ? null : new Color(scene.solidColor);
  }, [scene.backgroundType, scene.solidColor, viewerRef]);

  useEffect(() => { const v = viewerRef.current; if (v) v.globalLight.intensity = scene.ambientIntensity; }, [scene.ambientIntensity, viewerRef]);
  useEffect(() => { const v = viewerRef.current; if (v) v.cameraLight.intensity = scene.shadows ? scene.cameraLightIntensity : 0; }, [scene.shadows, scene.cameraLightIntensity, viewerRef]);
  useEffect(() => { const v = viewerRef.current; if (v) v.fov = scene.fov; }, [scene.fov, viewerRef]);
  useEffect(() => { const v = viewerRef.current; if (v) v.zoom = scene.zoom; onStatus({ fps: 0, zoom: scene.zoom }); }, [scene.zoom, scene.fov, viewerRef, onStatus]);

  // Recreate grid floor when color changes
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const col = new Color(scene.gridColor).getHex();
    if (gridRef.current) {
      viewer.scene.remove(gridRef.current);
      gridRef.current.geometry.dispose();
      (gridRef.current.material as Material).dispose();
    }
    const grid = new GridHelper(60, 60, col, col);
    grid.position.y = -16;
    const gmat = grid.material as LineBasicMaterial;
    gmat.transparent = true;
    gmat.opacity = 0.25;
    grid.visible = scene.gridVisible;
    viewer.scene.add(grid);
    gridRef.current = grid;
  }, [scene.gridColor, scene.gridVisible, viewerRef]);

  // Pose application (only when no animation is active)
  useEffect(() => {
    if (state.animation !== 'none') return;
    applyPoseToViewer(state.pose);
  }, [state.pose, state.animation, applyPoseToViewer]);

  // Auto-detect model toggle: apply manual override
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    if (state.modelAuto) {
      viewer.playerObject.skin.modelType = state.detectedModel;
    } else {
      viewer.playerObject.skin.modelType = state.modelType;
    }
  }, [state.modelAuto, state.modelType, state.detectedModel, viewerRef]);

  // Animation sync
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    if (state.animation === 'none') {
      viewer.animation = null;
      applyPoseToViewer(state.pose);
    } else {
      const map = { idle: IdleAnimation, walking: WalkingAnimation, running: RunningAnimation, flying: FlyingAnimation };
      const Ctor = map[state.animation];
      viewer.animation = new Ctor();
      if (viewer.animation) viewer.animation.speed = state.animationSpeed;
    }
  }, [state.animation, state.animationSpeed, state.pose, viewerRef, applyPoseToViewer]);

  // FPS meter
  useEffect(() => {
    let raf = 0, last = performance.now(), frames = 0, acc = 0;
    const loop = (t: number) => {
      const dt = t - last; last = t; acc += dt; frames++;
      if (acc >= 500) {
        const fps = Math.round((frames * 1000) / acc);
        onStatus({ fps, zoom: state.scene.zoom });
        acc = 0; frames = 0;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [state.scene.zoom, onStatus]);

  return (
    <div className="studio-viewport" ref={wrapRef}>
      <div className="studio-canvas-wrap">
        <canvas ref={canvasRef} />
      </div>
      {error && (
        <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(15,25,40,0.9)', border: '1px solid rgba(255,150,150,0.4)', padding: '8px 14px', borderRadius: 8, fontSize: 12, color: '#ffb4b4' }}>
          {error}
        </div>
      )}
      {!state.skinSource && !error && (
        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', fontSize: 12, color: '#64748b' }}>
          Loading default skin…
        </div>
      )}
    </div>
  );
}
