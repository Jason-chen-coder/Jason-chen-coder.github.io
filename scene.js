import * as THREE from './assets/vendor/three/three.module.min.js';
import {
  SCENE_STOPS,
  buildSceneTimeline,
  evaluateSceneTimeline,
  getPerformanceProfile,
} from './scene-model.js';
import {
  LAB_WORLD_ID,
  applyDeviceAction,
  applyMappedTextures,
  collectSceneStats,
  createLaboratoryWorld,
  loadPublishedSceneTextures,
} from './lab-world.js';

const MANIFEST_URL = new URL('./assets/images/lab-media-manifest.json', import.meta.url);

export function getSceneActivationOffset(
  documentRef,
  getComputedStyleRef = globalThis.getComputedStyle,
) {
  const root = documentRef?.documentElement;
  if (!root || typeof getComputedStyleRef !== 'function') return 0;
  const offset = Number.parseFloat(getComputedStyleRef(root)?.scrollPaddingTop);
  return Number.isFinite(offset) && offset > 0 ? offset : 0;
}

export function measureSceneStopMetrics(documentRef, scrollY = 0, activationOffset = 0) {
  const stableOffset = Number.isFinite(activationOffset) && activationOffset > 0
    ? activationOffset
    : 0;
  return SCENE_STOPS.map(({ id, selector }) => {
    const element = documentRef.querySelector(selector);
    if (!element) throw new Error(`Scene stop ${id} was not found for selector ${selector}`);
    const rect = element.getBoundingClientRect();
    return { id, top: rect.top + scrollY - stableOffset, height: rect.height };
  });
}

export function createContextLifecycle({ canvas, onFallback, onRestore }) {
  let state = 'idle';
  let started = false;

  const onContextLost = (event) => {
    event.preventDefault();
    state = 'context-lost';
    onFallback?.('context-lost');
  };
  const onContextRestored = () => {
    state = 'active';
    onRestore?.();
  };

  return {
    get state() {
      return state;
    },
    start() {
      if (started) return;
      started = true;
      state = 'active';
      canvas.addEventListener('webglcontextlost', onContextLost);
      canvas.addEventListener('webglcontextrestored', onContextRestored);
    },
    stop() {
      if (!started) return;
      started = false;
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      state = 'stopped';
    },
  };
}

export function createSceneLayoutInvalidation({
  documentRef,
  windowRef,
  elements,
  onInvalidate,
  ResizeObserverClass = globalThis.ResizeObserver,
}) {
  const invalidate = typeof onInvalidate === 'function' ? onInvalidate : () => {};
  const onImageLoad = (event) => {
    if (event.target?.tagName === 'IMG') invalidate();
  };

  windowRef?.addEventListener('portfolio:localechange', invalidate);
  documentRef?.addEventListener('load', onImageLoad, true);

  const resizeObserver = typeof ResizeObserverClass === 'function'
    ? new ResizeObserverClass(invalidate)
    : null;
  if (resizeObserver) {
    [...new Set((elements ?? []).filter(Boolean))].forEach((element) => resizeObserver.observe(element));
  }

  let disposed = false;
  return {
    resizeObserver,
    dispose() {
      if (disposed) return;
      disposed = true;
      windowRef?.removeEventListener('portfolio:localechange', invalidate);
      documentRef?.removeEventListener('load', onImageLoad, true);
      resizeObserver?.disconnect();
    },
  };
}

function serializeVector(values) {
  return values.map((value) => Number(value).toFixed(4)).join(',');
}

function writeDatasets(elements, state, stats) {
  const values = {
    worldId: LAB_WORLD_ID,
    sceneState: state.sceneState,
    activeSceneStop: state.activeStopId ?? 'none',
    activeAction: state.action?.id ?? 'none',
    progress: state.progress.toFixed(6),
    cameraPosition: serializeVector(state.camera.position),
    cameraForward: serializeVector(state.camera.forward),
    cameraTarget: serializeVector(state.camera.target),
    cameraRoll: Number(state.camera.roll).toFixed(4),
    triangles: String(stats.triangles),
    drawables: String(stats.drawables),
    geometries: String(stats.geometries),
    materials: String(stats.materials),
    transparentDrawables: String(stats.transparentDrawables),
    textureBytes: String(stats.textureBytes),
    semanticRoles: JSON.stringify(stats.semanticRoles),
    budget: JSON.stringify(stats.budget),
    withinBudget: String(stats.withinBudget),
    sceneStats: JSON.stringify(stats),
  };
  elements.forEach((element) => {
    Object.assign(element.dataset, values);
  });
}

function createFallbackEmitter(root, canvas, windowRef) {
  return (reason) => {
    root.dataset.webgl = 'fallback';
    root.dataset.sceneState = reason;
    canvas.dataset.sceneState = reason;
    windowRef.dispatchEvent(new CustomEvent('lab:webgl-fallback', { detail: { reason } }));
  };
}

export function configureRendererShadows(renderer, detailTier) {
  const enabled = detailTier === 'high';
  renderer.shadowMap.enabled = enabled;
  if (enabled) renderer.shadowMap.type = THREE.PCFShadowMap;
}

export function createLaboratoryReflectionEnvironment(documentRef = document) {
  const facePalettes = [
    ['#dce5e6', '#6d7a7e', '#f7faf9'],
    ['#8a979b', '#273137', '#ccd5d6'],
    ['#f4f7f6', '#a6b0b2', '#ffffff'],
    ['#303a40', '#151c21', '#758286'],
    ['#dbe3e3', '#637074', '#f6f8f7'],
    ['#839095', '#242e34', '#c5cecf'],
  ];
  const faces = facePalettes.map(([base, horizon, practical]) => {
    const canvas = documentRef.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    context.fillStyle = base;
    context.fillRect(0, 0, 64, 64);
    context.fillStyle = horizon;
    context.fillRect(0, 30, 64, 34);
    context.fillStyle = practical;
    context.fillRect(7, 7, 50, 8);
    return canvas;
  });
  const environment = new THREE.CubeTexture(faces);
  environment.colorSpace = THREE.SRGBColorSpace;
  environment.userData.environmentRole = 'laboratory-studio-reflection';
  environment.userData.runtimeWidth = 64;
  environment.userData.runtimeHeight = 64;
  environment.userData.gpuBytes = 64 * 64 * 4 * 6;
  environment.needsUpdate = true;
  return environment;
}

function clampUnit(value) {
  return Math.min(1, Math.max(0, value));
}

export function responsiveConfigForViewport(width, height) {
  const safeWidth = Number.isFinite(width) && width > 0 ? width : 1440;
  const safeHeight = Number.isFinite(height) && height > 0 ? height : 900;
  const aspect = safeWidth / safeHeight;
  const compact = clampUnit((1.6 - aspect) / 0.27);
  const portrait = clampUnit((1 - aspect) / 0.55);
  const override = (wideFov, compactFov, portraitFov, compactDolly, portraitDolly) => ({
    fov: wideFov + compact * compactFov + portrait * portraitFov,
    dolly: compact * compactDolly + portrait * portraitDolly,
    dollyDirection: [0, 1],
  });

  return {
    lateralScale: 1,
    stopOverrides: {
      alab: override(49, 4, 17, 0, 4.5),
      primegen: override(44, 6, 5, 0, 10.3),
      oxygen: override(65, 0, -19, 0, 14.4),
      'cloud-remote': override(44, 4, -8, 0, 17.5),
      'cloud-handheld': override(43, 2, 15, 0, 5.5),
    },
  };
}

async function readMediaManifest(fetchRef) {
  const response = await fetchRef(MANIFEST_URL);
  if (!response.ok) throw new Error(`Laboratory media manifest returned ${response.status}`);
  return response.json();
}

export function bootstrapLaboratoryScene({
  documentRef = document,
  windowRef = window,
  navigatorRef = navigator,
  fetchRef = fetch,
} = {}) {
  const canvas = documentRef.querySelector('#scene-canvas');
  const root = documentRef.documentElement;
  if (!canvas || !root) return null;

  const emitFallback = createFallbackEmitter(root, canvas, windowRef);
  const motionQuery = windowRef.matchMedia('(prefers-reduced-motion: reduce)');
  const profile = getPerformanceProfile({
    width: windowRef.innerWidth,
    devicePixelRatio: windowRef.devicePixelRatio,
    hardwareConcurrency: navigatorRef.hardwareConcurrency,
    reducedMotion: motionQuery.matches,
  });

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: profile.detailTier === 'high',
      alpha: false,
      powerPreference: 'high-performance',
    });
  } catch (error) {
    console.error('Laboratory WebGL initialization failed.', error);
    emitFallback('initialization-failed');
    return null;
  }

  renderer.setClearColor(0x273036, 1);
  renderer.setPixelRatio(profile.dpr);
  renderer.setSize(windowRef.innerWidth, windowRef.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.16;
  configureRendererShadows(renderer, profile.detailTier);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2b3439);
  scene.fog = new THREE.Fog(0x2b3439, 24, 58);
  const reflectionEnvironment = createLaboratoryReflectionEnvironment(documentRef);
  scene.environment = reflectionEnvironment;
  scene.environmentIntensity = 0.78;
  const camera = new THREE.PerspectiveCamera(48, windowRef.innerWidth / windowRef.innerHeight, 0.08, 90);
  camera.up.set(0, 1, 0);
  const world = createLaboratoryWorld({ detailTier: profile.detailTier });
  scene.add(world.root);

  let timeline = null;
  let sceneStats = collectSceneStats(world.root, {
    detailTier: profile.detailTier,
    additionalTextures: [reflectionEnvironment],
  });
  let renderFrame = 0;
  let layoutDirty = true;
  let destroyed = false;
  let contextAvailable = true;
  const cleanupCallbacks = [];
  const datasetTargets = [root, canvas];

  function listen(target, type, listener, options) {
    target.addEventListener(type, listener, options);
    cleanupCallbacks.push(() => target.removeEventListener(type, listener, options));
  }

  function measureTimeline() {
    const activationOffset = getSceneActivationOffset(
      documentRef,
      windowRef.getComputedStyle?.bind(windowRef),
    );
    const metrics = measureSceneStopMetrics(documentRef, windowRef.scrollY, activationOffset);
    timeline = buildSceneTimeline(metrics, windowRef.innerHeight);
    layoutDirty = false;
  }

  function applyCamera(cameraState) {
    camera.position.fromArray(cameraState.position);
    camera.fov = cameraState.fov;
    camera.updateProjectionMatrix();
    camera.lookAt(new THREE.Vector3().fromArray(cameraState.target));
    camera.rotation.z = cameraState.roll;
  }

  function renderCurrentState() {
    renderFrame = 0;
    if (destroyed || !contextAvailable) return;
    if (layoutDirty || !timeline) measureTimeline();

    const state = evaluateSceneTimeline(windowRef.scrollY, timeline, {
      reducedMotion: motionQuery.matches,
      responsiveConfig: responsiveConfigForViewport(windowRef.innerWidth, windowRef.innerHeight),
    });
    applyCamera(state.camera);
    applyDeviceAction(world.actionController, state.action);
    renderer.render(scene, camera);
    sceneStats = collectSceneStats(world.root, {
      detailTier: profile.detailTier,
      additionalTextures: [reflectionEnvironment],
    });
    writeDatasets(datasetTargets, { ...state, sceneState: 'ready' }, sceneStats);
    root.dataset.webgl = 'ready';
  }

  function requestRender() {
    if (!renderFrame && !destroyed) renderFrame = windowRef.requestAnimationFrame(renderCurrentState);
  }

  function requestMeasureAndRender() {
    layoutDirty = true;
    requestRender();
  }

  function resizeRenderer() {
    const nextProfile = getPerformanceProfile({
      width: windowRef.innerWidth,
      devicePixelRatio: windowRef.devicePixelRatio,
      hardwareConcurrency: navigatorRef.hardwareConcurrency,
      reducedMotion: motionQuery.matches,
    });
    renderer.setPixelRatio(nextProfile.dpr);
    renderer.setSize(windowRef.innerWidth, windowRef.innerHeight, false);
    camera.aspect = windowRef.innerWidth / windowRef.innerHeight;
    camera.updateProjectionMatrix();
    requestMeasureAndRender();
  }

  const contextLifecycle = createContextLifecycle({
    canvas,
    onFallback: (reason) => {
      contextAvailable = false;
      emitFallback(reason);
    },
    onRestore: () => {
      contextAvailable = true;
      root.dataset.webgl = 'pending';
      resizeRenderer();
    },
  });
  contextLifecycle.start();

  listen(documentRef, 'scroll', requestRender, { passive: true });
  listen(windowRef, 'resize', resizeRenderer, { passive: true });
  listen(windowRef, 'hashchange', requestMeasureAndRender);
  listen(windowRef, 'orientationchange', resizeRenderer);
  listen(motionQuery, 'change', requestMeasureAndRender);
  listen(windowRef, 'pageshow', (event) => {
    if (event.persisted) requestMeasureAndRender();
  });

  const stopElements = SCENE_STOPS.map(({ selector }) => documentRef.querySelector(selector));
  const layoutInvalidation = createSceneLayoutInvalidation({
    documentRef,
    windowRef,
    elements: [documentRef.body, ...stopElements],
    onInvalidate: requestMeasureAndRender,
  });
  cleanupCallbacks.push(() => layoutInvalidation.dispose());

  function dispose() {
    if (destroyed) return;
    destroyed = true;
    if (renderFrame) windowRef.cancelAnimationFrame(renderFrame);
    renderFrame = 0;
    contextLifecycle.stop();
    cleanupCallbacks.splice(0).forEach((cleanup) => cleanup());
    world.dispose();
    reflectionEnvironment.dispose();
    scene.clear();
    renderer.dispose();
    root.dataset.sceneState = 'destroyed';
    canvas.dataset.sceneState = 'destroyed';
  }

  listen(windowRef, 'pagehide', (event) => {
    if (!event.persisted) dispose();
  });

  documentRef.fonts?.ready.then(() => {
    if (!destroyed) requestMeasureAndRender();
  });

  readMediaManifest(fetchRef)
    .then((manifest) => loadPublishedSceneTextures(manifest))
    .then((textures) => {
      if (destroyed) {
        textures.forEach((texture) => texture.dispose());
        return;
      }
      applyMappedTextures(world, textures);
      sceneStats = collectSceneStats(world.root, {
        detailTier: profile.detailTier,
        additionalTextures: [reflectionEnvironment],
      });
      requestRender();
    })
    .catch((error) => {
      console.warn('Laboratory screen media remained neutral.', error);
    });

  root.dataset.webgl = 'pending';
  root.dataset.worldId = LAB_WORLD_ID;
  canvas.dataset.worldId = LAB_WORLD_ID;
  requestMeasureAndRender();

  return {
    scene,
    camera,
    world,
    renderer,
    contextLifecycle,
    requestMeasureAndRender,
    dispose,
  };
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  bootstrapLaboratoryScene();
}
