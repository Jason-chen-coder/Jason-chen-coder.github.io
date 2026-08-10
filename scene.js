import * as THREE from 'three';
import { EffectComposer } from './assets/vendor/three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from './assets/vendor/three/addons/postprocessing/OutputPass.js';
import { RenderPass } from './assets/vendor/three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './assets/vendor/three/addons/postprocessing/UnrealBloomPass.js';
import {
  alignChapterOffsets,
  CAMERA_POSES,
  getHeroTempleTargetOffset,
  getPerformanceProfile,
  getSceneDetailProfile,
  interpolateCamera,
  normalizeChapterScroll,
  snapCameraProgress,
} from './scene-model.js';

const canvas = document.querySelector('#scene-canvas');
const root = document.documentElement;
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let randomState = 0x4b414745;

function random() {
  randomState = (randomState * 1664525 + 1013904223) >>> 0;
  return randomState / 4294967296;
}

function range(min, max) {
  return min + (max - min) * random();
}

function pathElevation(z) {
  return THREE.MathUtils.clamp((22 - z) * 0.145, 0, 13.2);
}

function liftTerrainForStairFoundation(worldX, naturalWorldY, worldZ) {
  const lateralProgress = Math.min(1, Math.max(0, (Math.abs(worldX) - 3) / (8.5 - 3)));
  const frontProgress = Math.min(1, Math.max(0, (worldZ - 25) / (34 - 25)));
  const rearProgress = Math.min(1, Math.max(0, (-worldZ - 80) / (94 - 80)));
  const lateralSupport = 1 - lateralProgress * lateralProgress * (3 - 2 * lateralProgress);
  const frontSupport = 1 - frontProgress * frontProgress * (3 - 2 * frontProgress);
  const rearSupport = 1 - rearProgress * rearProgress * (3 - 2 * rearProgress);
  const support = lateralSupport * frontSupport * rearSupport;
  const targetBedY = pathElevation(worldZ) - 1.1;
  return naturalWorldY + Math.max(0, targetBedY - naturalWorldY) * support;
}

function terrainElevation(worldX, worldZ) {
  const localPlaneY = -30 - worldZ;
  const ridge = Math.max(0, Math.abs(worldX) - 5) * 0.13;
  const variation = Math.sin(worldX * 0.17) * 1.2 + Math.cos(localPlaneY * 0.11) * 1.4;
  const naturalWorldY = -2.3 + ridge + variation;
  const plateauDistanceX = Math.max(0, Math.abs(worldX) - 15);
  const plateauDistanceZ = Math.max(0, Math.abs(worldZ + 72) - 12);
  const plateauDistance = Math.hypot(plateauDistanceX, plateauDistanceZ);
  const plateauProgress = Math.min(1, plateauDistance / 16);
  const plateauFalloff = 1 - plateauProgress * plateauProgress * (3 - 2 * plateauProgress);
  const templePlateau = naturalWorldY + (12.55 - naturalWorldY) * plateauFalloff;
  return liftTerrainForStairFoundation(worldX, Math.max(naturalWorldY, templePlateau), worldZ);
}

function terrainMeshElevation(worldX, worldZ, terrainSegments) {
  const [widthSegments, heightSegments] = terrainSegments;
  const cellWidth = 120 / widthSegments;
  const cellDepth = 190 / heightSegments;
  const gridX = Math.min(widthSegments, Math.max(0, (worldX + 60) / cellWidth));
  const gridZ = Math.min(heightSegments, Math.max(0, (worldZ + 125) / cellDepth));
  const cellX = Math.min(widthSegments - 1, Math.floor(gridX));
  const cellZ = Math.min(heightSegments - 1, Math.floor(gridZ));
  const localX = gridX - cellX;
  const localZ = gridZ - cellZ;
  const x0 = -60 + cellX * cellWidth;
  const x1 = x0 + cellWidth;
  const z0 = -125 + cellZ * cellDepth;
  const z1 = z0 + cellDepth;
  const heightA = terrainElevation(x0, z0);
  const heightB = terrainElevation(x0, z1);
  const heightC = terrainElevation(x1, z1);
  const heightD = terrainElevation(x1, z0);
  if (localX + localZ <= 1) {
    return heightA + localX * (heightD - heightA) + localZ * (heightB - heightA);
  }
  return heightC + (1 - localX) * (heightB - heightC) + (1 - localZ) * (heightD - heightC);
}

function markFallback() {
  root.dataset.webgl = 'fallback';
  window.dispatchEvent(new CustomEvent('kage:webgl-fallback'));
}

function createExperience(targetCanvas) {
  let profile = getPerformanceProfile({
    width: window.innerWidth,
    devicePixelRatio: window.devicePixelRatio,
    hardwareConcurrency: navigator.hardwareConcurrency,
    reducedMotion: motionQuery.matches,
  });
  const detailProfile = getSceneDetailProfile(profile.detailTier);

  const renderer = new THREE.WebGLRenderer({
    canvas: targetCanvas,
    antialias: profile.tier === 'full',
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x111a22, 1);
  renderer.setPixelRatio(profile.dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.shadowMap.enabled = profile.tier === 'full';
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111a22);
  scene.fog = new THREE.FogExp2(0x263945, CAMERA_POSES[0].fogDensity);

  const camera = new THREE.PerspectiveCamera(43, window.innerWidth / window.innerHeight, 0.1, 240);
  const world = new THREE.Group();
  scene.add(world);

  const materials = createMaterials(detailProfile);
  addGround(world, materials, detailProfile);
  addStonePath(world, materials, detailProfile);
  addToriiSequence(world, materials, detailProfile);
  const warmLights = addLanternPath(world, materials, detailProfile);
  const paperWindows = addTemple(world, materials, warmLights, detailProfile);
  addForest(world, materials, profile.treeCount, detailProfile);
  addRuinsAndStones(world, materials);
  addMoon(world);
  addAtmosphericLight(scene);
  const fogLayers = addFogLayers(world);
  const rain = addRain(world, profile.rainCount);
  const leaves = addLeaves(world, profile.leafCount);
  const embers = addEmbers(world, profile.emberCount);
  const sceneStats = collectSceneStats(world, detailProfile.tier);
  targetCanvas.dataset.sceneStats = JSON.stringify(sceneStats);

  const renderPass = new RenderPass(scene, camera);
  let composer = null;
  let bloomPass = null;
  if (profile.bloom) {
    composer = new EffectComposer(renderer);
    composer.setPixelRatio(profile.dpr);
    composer.addPass(renderPass);
    bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.28, 0.52, 0.86);
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());
  }

  const pointer = new THREE.Vector2();
  const pointerTarget = new THREE.Vector2();
  const finePointer = window.matchMedia('(pointer: fine)');
  const chapterElements = [...document.querySelectorAll('[data-chapter-section]')];
  let chapterOffsets = measureChapterOffsets();
  let targetProgress = readScrollProgress();
  let currentProgress = targetProgress;
  let animationFrame = 0;
  let resizeFrame = 0;
  let lastTime = performance.now();
  let measuredTime = 0;
  let measuredFrames = 0;
  let runtimeDpr = profile.dpr;
  let disposed = false;
  let suspended = false;

  function measureChapterOffsets() {
    const offsets = chapterElements.map((section) => section.getBoundingClientRect().top + window.scrollY);
    return alignChapterOffsets(offsets, window.innerHeight);
  }

  function readScrollProgress() {
    return normalizeChapterScroll(window.scrollY, chapterOffsets);
  }

  function updateScrollTarget() {
    targetProgress = readScrollProgress();
    if (!profile.animate && !suspended) requestStaticRender();
  }

  function applyCamera(progress) {
    const composedProgress = profile.animate
      ? progress
      : snapCameraProgress(progress, CAMERA_POSES.length);
    const pose = interpolateCamera(composedProgress);
    pointer.lerp(pointerTarget, profile.animate ? 0.035 : 1);

    camera.position.set(...pose.position);
    camera.position.x += pointer.x * 0.42;
    camera.position.y += pointer.y * 0.24;
    camera.fov = pose.fov;
    camera.updateProjectionMatrix();

    const target = new THREE.Vector3(...pose.target);
    target.x += getHeroTempleTargetOffset(composedProgress, camera.aspect);
    target.x += pointer.x * 0.5;
    target.y += pointer.y * 0.18;
    camera.lookAt(target);

    scene.fog.density = pose.fogDensity;
    const paperIntensity = 1.35 + pose.warmth * 1.65;
    paperWindows.forEach((material) => { material.emissiveIntensity = paperIntensity; });
    warmLights.forEach((light) => {
      light.intensity = (
        light.userData.baseIntensity + pose.warmth * light.userData.warmthGain
      ) * light.userData.intensityScale;
    });
    if (bloomPass) bloomPass.strength = 0.2 + pose.warmth * 0.14;
  }

  function render(delta = 0) {
    if (composer) composer.render(delta);
    else renderer.render(scene, camera);
  }

  function animate(time) {
    if (disposed || suspended) {
      animationFrame = 0;
      return;
    }
    const delta = Math.min(0.05, Math.max(0.001, (time - lastTime) / 1000));
    lastTime = time;
    const damping = 1 - Math.exp(-delta * 6);
    currentProgress += (targetProgress - currentProgress) * damping;
    applyCamera(currentProgress);
    updateRain(rain, delta);
    updateLeaves(leaves, delta, time);
    updateEmbers(embers, delta, time);
    fogLayers.forEach((sprite, index) => {
      sprite.position.x += Math.sin(time * 0.00008 + index) * delta * 0.045;
    });
    render(delta);

    measuredTime += delta;
    measuredFrames += 1;
    if (measuredFrames >= 150) {
      const averageFrame = measuredTime / measuredFrames;
      if (averageFrame > 0.025 && runtimeDpr > 0.9) {
        runtimeDpr = Math.max(0.9, runtimeDpr - 0.15);
        renderer.setPixelRatio(runtimeDpr);
        composer?.setPixelRatio(runtimeDpr);
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        composer?.setSize(window.innerWidth, window.innerHeight);
      }
      measuredFrames = 0;
      measuredTime = 0;
    }

    if (disposed || suspended) animationFrame = 0;
    else animationFrame = requestAnimationFrame(animate);
  }

  function requestStaticRender() {
    if (disposed || suspended || animationFrame) return;
    animationFrame = requestAnimationFrame(() => {
      animationFrame = 0;
      currentProgress = targetProgress;
      applyCamera(currentProgress);
      render();
    });
  }

  function resize() {
    resizeFrame = 0;
    if (disposed || suspended) return;
    chapterOffsets = measureChapterOffsets();
    profile = getPerformanceProfile({
      width: window.innerWidth,
      devicePixelRatio: window.devicePixelRatio,
      hardwareConcurrency: navigator.hardwareConcurrency,
      reducedMotion: motionQuery.matches,
    });
    runtimeDpr = Math.min(runtimeDpr, profile.dpr);
    renderer.setPixelRatio(runtimeDpr);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    composer?.setPixelRatio(runtimeDpr);
    composer?.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    updateScrollTarget();
    if (!profile.animate) requestStaticRender();
  }

  function requestResize() {
    if (!disposed && !suspended && !resizeFrame) resizeFrame = requestAnimationFrame(resize);
  }

  function handleMotionChange() {
    window.location.reload();
  }

  function handleContextLost(event) {
    event.preventDefault();
    if (disposed || suspended) return;
    cancelAnimationFrame(animationFrame);
    cancelAnimationFrame(resizeFrame);
    animationFrame = 0;
    resizeFrame = 0;
    suspended = true;
    targetCanvas.dataset.sceneState = 'suspended';
    markFallback();
  }

  function handleContextRestored() {
    if (disposed || !suspended) return;
    suspended = false;
    root.dataset.webgl = 'ready';
    targetCanvas.dataset.sceneState = 'ready';
    renderer.setPixelRatio(runtimeDpr);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    composer?.setPixelRatio(runtimeDpr);
    composer?.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    chapterOffsets = measureChapterOffsets();
    targetProgress = readScrollProgress();
    currentProgress = targetProgress;
    lastTime = performance.now();
    applyCamera(currentProgress);
    if (profile.animate && !animationFrame) animationFrame = requestAnimationFrame(animate);
    else requestStaticRender();
  }

  window.addEventListener('scroll', updateScrollTarget, { passive: true });
  window.addEventListener('resize', requestResize, { passive: true });
  motionQuery.addEventListener?.('change', handleMotionChange);

  if (finePointer.matches && profile.animate) {
    window.addEventListener('pointermove', (event) => {
      pointerTarget.set(
        (event.clientX / window.innerWidth - 0.5) * 2,
        -(event.clientY / window.innerHeight - 0.5) * 2,
      );
    }, { passive: true });
  }

  targetCanvas.addEventListener('webglcontextlost', handleContextLost);
  targetCanvas.addEventListener('webglcontextrestored', handleContextRestored);

  window.addEventListener('pagehide', (event) => {
    cancelAnimationFrame(animationFrame);
    cancelAnimationFrame(resizeFrame);
    animationFrame = 0;
    resizeFrame = 0;
    if (event.persisted || disposed) return;
    disposed = true;
    motionQuery.removeEventListener?.('change', handleMotionChange);
    targetCanvas.removeEventListener('webglcontextlost', handleContextLost);
    targetCanvas.removeEventListener('webglcontextrestored', handleContextRestored);
    renderer.dispose();
    composer?.dispose();
  });

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted || disposed || suspended) return;
    lastTime = performance.now();
    chapterOffsets = measureChapterOffsets();
    updateScrollTarget();
    if (profile.animate && !animationFrame) animationFrame = requestAnimationFrame(animate);
    else requestStaticRender();
  });

  document.fonts?.ready.then(() => {
    if (disposed) return;
    chapterOffsets = measureChapterOffsets();
    updateScrollTarget();
  });

  applyCamera(currentProgress);
  render();
  root.dataset.webgl = 'ready';
  targetCanvas.dataset.sceneState = 'ready';
  if (profile.animate) animationFrame = requestAnimationFrame(animate);
  else requestStaticRender();
}

const UNIT_BOX_GEOMETRY = new THREE.BoxGeometry(1, 1, 1);

function createSeededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function createSurfaceTextureSet(baseColor, seed, size, { pattern, repeat }) {
  const textureNames = ['color', 'bump', 'roughness'];
  const canvases = textureNames.map(() => {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = size;
    textureCanvas.height = size;
    return textureCanvas;
  });
  const contexts = canvases.map((textureCanvas) => textureCanvas.getContext('2d'));
  const images = contexts.map((context) => context.createImageData(size, size));
  const seededRandom = createSeededRandom(seed);
  const red = (baseColor >> 16) & 255;
  const green = (baseColor >> 8) & 255;
  const blue = baseColor & 255;

  for (let pixel = 0; pixel < size * size; pixel += 1) {
    const x = pixel % size;
    const y = Math.floor(pixel / size);
    const grain = (seededRandom() - 0.5) * 20;
    let colorDetail = 0;
    let bumpDetail = 0;
    let roughnessDetail = 0;

    switch (pattern) {
      case 'stone': {
        const stoneGrain = Math.sin(x * 0.31) * Math.cos(y * 0.27)
          + Math.sin((x + y) * 0.083) * 0.7
          + Math.cos((x - y) * 0.047) * 0.5;
        colorDetail = stoneGrain * 5.5;
        bumpDetail = stoneGrain * 14;
        roughnessDetail = Math.abs(stoneGrain) * 4;
        break;
      }
      case 'timber': {
        const timberGrain = Math.sin(x * 0.22 + Math.sin(y * 0.028) * 2.7);
        const fineGrain = Math.sin(x * 0.61 + y * 0.012) * 0.34;
        colorDetail = timberGrain * 10 + fineGrain * 4;
        bumpDetail = timberGrain * 18 + fineGrain * 7;
        roughnessDetail = Math.abs(timberGrain) * 5;
        break;
      }
      case 'roof': {
        const rowHeight = Math.max(8, Math.floor(size / 11));
        const tileWidth = Math.max(10, Math.floor(size / 8));
        const tileRow = Math.floor(y / rowHeight);
        const stagger = tileRow % 2 ? tileWidth / 2 : 0;
        const localX = (x + stagger) % tileWidth;
        const localY = y % rowHeight;
        const seam = Math.min(localX, tileWidth - localX) < 1.5 || localY < 1.4;
        const tileColumn = Math.floor((x + stagger) / tileWidth);
        const tileTone = ((tileColumn * 13 + tileRow * 7) % 7 - 3) * 1.8;
        colorDetail = tileTone + (seam ? -22 : 2);
        bumpDetail = seam ? -34 : 7 + tileTone;
        roughnessDetail = seam ? 18 : -3;
        break;
      }
      default:
        throw new TypeError(`Unknown surface texture pattern: ${pattern}`);
    }

    const offset = pixel * 4;
    images[0].data[offset] = THREE.MathUtils.clamp(red + grain + colorDetail, 0, 255);
    images[0].data[offset + 1] = THREE.MathUtils.clamp(green + grain * 0.78 + colorDetail, 0, 255);
    images[0].data[offset + 2] = THREE.MathUtils.clamp(blue + grain * 0.62 + colorDetail, 0, 255);
    images[0].data[offset + 3] = 255;

    const bump = THREE.MathUtils.clamp(128 + grain * 1.8 + bumpDetail, 0, 255);
    images[1].data.fill(bump, offset, offset + 3);
    images[1].data[offset + 3] = 255;

    const roughness = THREE.MathUtils.clamp(214 - Math.abs(grain) * 0.55 + roughnessDetail, 0, 255);
    images[2].data.fill(roughness, offset, offset + 3);
    images[2].data[offset + 3] = 255;
  }

  const textures = {};
  contexts.forEach((context, index) => {
    context.putImageData(images[index], 0, 0);
    const texture = new THREE.CanvasTexture(canvases[index]);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat, repeat);
    if (index === 0) texture.colorSpace = THREE.SRGBColorSpace;
    textures[textureNames[index]] = texture;
  });
  return textures;
}

function createMaterials(detailProfile) {
  const stoneTextures = createSurfaceTextureSet(0x46514f, 0x51a7e, detailProfile.textureSize, { pattern: 'stone', repeat: 5.5 });
  const timberTextures = createSurfaceTextureSet(0x4a2920, 0x71b3e, detailProfile.textureSize, { pattern: 'timber', repeat: 3.5 });
  const roofTextures = createSurfaceTextureSet(0x34484f, 0x94c2d, detailProfile.textureSize, { pattern: 'roof', repeat: 6 });
  return {
    earth: new THREE.MeshStandardMaterial({ color: 0x18231f, roughness: 0.96, metalness: 0.02 }),
    moss: new THREE.MeshStandardMaterial({ color: 0x31483c, roughness: 0.94 }),
    stone: new THREE.MeshStandardMaterial({
      color: 0xf0f2ef,
      map: stoneTextures.color,
      bumpMap: stoneTextures.bump,
      bumpScale: 0.16,
      roughnessMap: stoneTextures.roughness,
      roughness: 0.68,
      metalness: 0.04,
    }),
    stoneDark: new THREE.MeshStandardMaterial({
      color: 0xcdd2cf,
      map: stoneTextures.color,
      bumpMap: stoneTextures.bump,
      bumpScale: 0.1,
      roughnessMap: stoneTextures.roughness,
      roughness: 0.82,
      metalness: 0.03,
    }),
    timber: new THREE.MeshStandardMaterial({
      color: 0xf0ebe7,
      map: timberTextures.color,
      bumpMap: timberTextures.bump,
      bumpScale: 0.1,
      roughnessMap: timberTextures.roughness,
      roughness: 0.72,
    }),
    timberDark: new THREE.MeshStandardMaterial({
      color: 0xc9c3be,
      map: timberTextures.color,
      bumpMap: timberTextures.bump,
      bumpScale: 0.07,
      roughnessMap: timberTextures.roughness,
      roughness: 0.8,
    }),
    vermilion: new THREE.MeshStandardMaterial({ color: 0x6f1e18, roughness: 0.66 }),
    roof: new THREE.MeshStandardMaterial({
      color: 0xe9edef,
      map: roofTextures.color,
      bumpMap: roofTextures.bump,
      bumpScale: 0.13,
      roughnessMap: roofTextures.roughness,
      roughness: 0.62,
      metalness: 0.04,
      side: THREE.DoubleSide,
    }),
    roofEdge: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: roofTextures.color,
      bumpMap: roofTextures.bump,
      bumpScale: 0.08,
      roughnessMap: roofTextures.roughness,
      roughness: 0.7,
      metalness: 0.04,
    }),
    foliage: new THREE.MeshStandardMaterial({ color: 0x29483f, roughness: 0.9 }),
    foliageCold: new THREE.MeshStandardMaterial({ color: 0x355a52, roughness: 0.92 }),
    lanternPaper: new THREE.MeshStandardMaterial({
      color: 0xe2b66f,
      emissive: 0xb45f23,
      emissiveIntensity: 2.45,
      roughness: 0.78,
    }),
    shojiPaper: new THREE.MeshStandardMaterial({
      color: 0xf0c98c,
      emissive: 0xb85d22,
      emissiveIntensity: 2,
      roughness: 0.88,
    }),
  };
}

function shadow(mesh, cast = true, receive = true) {
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  return mesh;
}

function setSemanticRole(object, semanticRole) {
  if (semanticRole) object.userData.semanticRole = semanticRole;
  return object;
}

function addBox(parent, size, position, material, rotation = [0, 0, 0], semanticRole = '') {
  const mesh = setSemanticRole(shadow(new THREE.Mesh(UNIT_BOX_GEOMETRY, material)), semanticRole);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...size);
  parent.add(mesh);
  return mesh;
}

function addInstanced(parent, geometry, material, transforms, semanticRole, cast = true, receive = true) {
  const mesh = setSemanticRole(
    shadow(new THREE.InstancedMesh(geometry, material, transforms.length), cast, receive),
    semanticRole,
  );
  const dummy = new THREE.Object3D();
  transforms.forEach((transform, index) => {
    dummy.position.set(...transform.position);
    dummy.rotation.set(...(transform.rotation ?? [0, 0, 0]));
    dummy.scale.set(...(transform.scale ?? [1, 1, 1]));
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
  parent.add(mesh);
  return mesh;
}

function addGround(parent, materials, detailProfile) {
  const [widthSegments, heightSegments] = detailProfile.terrainSegments;
  const groundPosition = [0, -1.2, -30];
  const geometry = new THREE.PlaneGeometry(120, 190, widthSegments, heightSegments);
  const positions = geometry.attributes.position;
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const localPlaneY = positions.getY(index);
    const worldZ = groundPosition[2] - localPlaneY;
    const liftedWorldY = terrainElevation(x, worldZ);
    positions.setZ(index, liftedWorldY - groundPosition[1]);
  }
  geometry.computeVertexNormals();
  const ground = setSemanticRole(shadow(new THREE.Mesh(geometry, materials.earth), false, true), 'terrain');
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(...groundPosition);
  parent.add(ground);

  const hillGeometry = new THREE.IcosahedronGeometry(12, detailProfile.hillDetail);
  const sightlineClearance = 20;
  for (let index = 0; index < 9; index += 1) {
    const hill = setSemanticRole(
      shadow(new THREE.Mesh(hillGeometry, index % 3 ? materials.earth : materials.moss), false, true),
      'terrain-hill',
    );
    const side = index % 2 ? -1 : 1;
    const lateralSeed = range(31, 52);
    const hillY = range(1, 10);
    const hillZ = range(-100, 22);
    const hillScale = [range(1.3, 2.8), range(0.8, 2.1), range(1.5, 3.2)];
    const hillRadius = 12 * Math.max(...hillScale);
    const hillX = Math.max(lateralSeed, sightlineClearance + hillRadius);
    hill.position.set(side * hillX, hillY, hillZ);
    hill.scale.set(...hillScale);
    hill.rotation.set(range(-0.2, 0.2), range(0, Math.PI), range(-0.18, 0.18));
    parent.add(hill);
  }
}

function createStepGeometry(variant) {
  const geometry = new THREE.BoxGeometry(1, 1, 1, variant === 1 ? 2 : 1, 1, variant === 2 ? 2 : 1);
  const positions = geometry.attributes.position;
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const z = positions.getZ(index);
    if (y > 0.45 && variant === 1 && x > 0.15) positions.setY(index, y - (z > 0 ? 0.1 : 0.035));
    if (y > 0.45 && variant === 2 && z < -0.15) positions.setY(index, y - (x < 0 ? 0.08 : 0.025));
  }
  geometry.computeVertexNormals();
  return geometry;
}

function createStairFoundationGeometry() {
  const stairCount = 39;
  const rise = 0.34;
  const run = 2.35;
  const treadDepth = 2.5;
  const treadHeight = 0.48;
  const width = 4.7;
  const clearance = 0.075;
  const frontZ = 22 + treadDepth / 2;
  const rearZ = 22 - (stairCount - 1) * run - treadDepth / 2;
  const frontTopY = -treadHeight / 2 - clearance - treadDepth / 2 * (rise / run);
  const rearTopY = frontTopY + (frontZ - rearZ) * (rise / run);
  const foundationThickness = 0.9;
  const frontBottomY = frontTopY - foundationThickness;
  const rearBottomY = rearTopY - foundationThickness;
  const halfWidth = width / 2;

  const frontBottomLeft = [-halfWidth, frontBottomY, frontZ];
  const frontBottomRight = [halfWidth, frontBottomY, frontZ];
  const frontTopRight = [halfWidth, frontTopY, frontZ];
  const frontTopLeft = [-halfWidth, frontTopY, frontZ];
  const rearBottomLeft = [-halfWidth, rearBottomY, rearZ];
  const rearBottomRight = [halfWidth, rearBottomY, rearZ];
  const rearTopRight = [halfWidth, rearTopY, rearZ];
  const rearTopLeft = [-halfWidth, rearTopY, rearZ];
  const faces = [
    [frontBottomLeft, frontBottomRight, frontTopRight, frontTopLeft],
    [rearBottomLeft, rearTopLeft, rearTopRight, rearBottomRight],
    [frontBottomLeft, frontTopLeft, rearTopLeft, rearBottomLeft],
    [frontBottomRight, rearBottomRight, rearTopRight, frontTopRight],
    [frontTopLeft, frontTopRight, rearTopRight, rearTopLeft],
    [frontBottomLeft, rearBottomLeft, rearBottomRight, frontBottomRight],
  ];
  const uvWorldScale = 5.5;
  const faceUvAxes = [[0, 1], [0, 1], [2, 1], [2, 1], [0, 2], [0, 2]];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(faces.flat(2), 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(
    faces.flatMap((face, faceIndex) => face.flatMap((vertex) => [
      vertex[faceUvAxes[faceIndex][0]] / uvWorldScale,
      vertex[faceUvAxes[faceIndex][1]] / uvWorldScale,
    ])),
    2,
  ));
  geometry.setIndex(faces.flatMap((face, index) => {
    const offset = index * face.length;
    return [offset, offset + 1, offset + 2, offset, offset + 2, offset + 3];
  }));
  geometry.computeVertexNormals();
  return geometry;
}

function addStonePath(parent, materials, detailProfile) {
  const stepTransforms = Array.from({ length: detailProfile.stairs.variants }, () => []);
  for (let index = 0; index < detailProfile.stairs.count; index += 1) {
    const z = 22 - index * 2.35;
    const y = index * 0.34;
    const width = 5.5 + Math.sin(index * 0.8) * 0.28;
    stepTransforms[index % detailProfile.stairs.variants].push({
      position: [Math.sin(index * 1.3) * 0.13, y, z],
      rotation: [0, Math.sin(index * 0.71) * 0.018, 0],
      scale: [width, 0.48, 2.5],
    });
  }
  stepTransforms.forEach((transforms, variant) => {
    addInstanced(parent, createStepGeometry(variant), materials.stone, transforms, 'stone-step', false, true);
  });

  const stairFoundation = setSemanticRole(
    shadow(new THREE.Mesh(createStairFoundationGeometry(), materials.stoneDark), false, true),
    'stair-foundation',
  );
  parent.add(stairFoundation);

  const mossTransforms = Array.from({ length: detailProfile.stairs.mossSeams }, (_, index) => {
    const stepIndex = Math.round(index * (detailProfile.stairs.count - 1) / Math.max(1, detailProfile.stairs.mossSeams - 1));
    const z = 22 - stepIndex * 2.35 + 0.58;
    return {
      position: [Math.sin(stepIndex * 1.3) * 0.13, stepIndex * 0.34 + 0.255, z],
      scale: [4.65, 0.045, 0.13],
    };
  });
  addInstanced(parent, UNIT_BOX_GEOMETRY, materials.moss, mossTransforms, 'stair-moss-seam', false, true);

  addBox(parent, [8, 1.1, 16], [0, 12.75, -70], materials.stoneDark, [0, 0, 0], 'temple-landing');
  addBox(parent, [9.4, 0.42, 4.6], [0, 12.45, -61.1], materials.stone, [0, 0, 0], 'stair-upper-landing');
  addBox(parent, [0.42, 0.58, 15.2], [-4.15, 12.95, -69.5], materials.stoneDark, [0, 0, 0], 'landing-edge');
  addBox(parent, [0.42, 0.58, 15.2], [4.15, 12.95, -69.5], materials.stoneDark, [0, 0, 0], 'landing-edge');
}

function addCurvedToriiBeam(parent, {
  width,
  y,
  lift,
  height,
  depth,
  segments,
  material,
  semanticRole,
}) {
  const segmentWidth = width / segments;
  const transforms = Array.from({ length: segments }, (_, index) => {
    const center = index - (segments - 1) / 2;
    const normalized = center / Math.max(1, (segments - 1) / 2);
    return {
      position: [center * segmentWidth, y + Math.abs(normalized) ** 2 * lift, 0],
      rotation: [0, 0, Math.sign(normalized) * Math.abs(normalized) * 0.052],
      scale: [segmentWidth + 0.14, height, depth],
    };
  });
  return addInstanced(parent, UNIT_BOX_GEOMETRY, material, transforms, semanticRole);
}

function createTorii(parent, x, y, z, scale, materials, detailProfile, geometries, isHero) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.scale.setScalar(scale);

  addInstanced(group, geometries.post, materials.vermilion, [
    { position: [-3.1, 3.4, 0], rotation: [0, 0, -0.028], scale: [1, 7.1, 1] },
    { position: [3.1, 3.4, 0], rotation: [0, 0, 0.028], scale: [1, 7.1, 1] },
  ], 'torii-post');
  const footingTransforms = [-1, 1].map((side) => {
    const worldPostX = x + side * 3.1 * scale;
    const groundY = terrainMeshElevation(worldPostX, z, detailProfile.terrainSegments);
    const footingTop = 0.43;
    const footingBottom = (groundY - 0.12 - y) / scale;
    return {
      position: [side * 3.1, (footingTop + footingBottom) / 2, 0],
      scale: [1, (footingTop - footingBottom) / 0.5, 1],
    };
  });
  addInstanced(
    group,
    geometries.base,
    materials.stoneDark,
    footingTransforms,
    isHero ? 'hero-torii-stone-footing' : 'torii-stone-base',
    false,
    true,
  );

  if (!isHero) {
    addCurvedToriiBeam(group, {
      width: 9.45,
      y: 7.32,
      lift: 0.38,
      height: 0.36,
      depth: 1.08,
      segments: detailProfile.torii.kasagiSegments,
      material: materials.roofEdge,
      semanticRole: 'torii-kasagi',
    });
    addBox(group, [8.25, 0.58, 0.92], [0, 6.68, 0], materials.vermilion, [0, 0, 0], 'torii-upper-beam');
    addBox(group, [5.7, 0.36, 0.62], [0, 5.82, 0], materials.vermilion, [0, 0, 0], 'torii-nuki');
    addBox(group, [1.25, 1.3, 0.22], [0, 6.05, 0.5], materials.timberDark, [0, 0, 0], 'torii-plaque');
    addBox(group, [0.74, 0.4, 0.78], [-2.65, 6.1, 0], materials.vermilion, [0, 0, -0.08], 'torii-wedge');
    addBox(group, [0.74, 0.4, 0.78], [2.65, 6.1, 0], materials.vermilion, [0, 0, 0.08], 'torii-wedge');
    parent.add(group);
    return;
  }

  const crownSegments = detailProfile.torii.kasagiSegments;
  addCurvedToriiBeam(group, {
    width: 10.35,
    y: 7.22,
    lift: 0.44,
    height: 0.34,
    depth: 1.12,
    segments: crownSegments,
    material: materials.vermilion,
    semanticRole: 'hero-torii-kasagi',
  });
  addCurvedToriiBeam(group, {
    width: 9.42,
    y: 6.84,
    lift: 0.26,
    height: 0.3,
    depth: 0.9,
    segments: crownSegments,
    material: materials.vermilion,
    semanticRole: 'hero-torii-shimaki',
  });
  addCurvedToriiBeam(group, {
    width: 10.72,
    y: 7.52,
    lift: 0.52,
    height: 0.14,
    depth: 1.2,
    segments: crownSegments,
    material: materials.timberDark,
    semanticRole: 'hero-torii-lacquer-cap',
  });
  addBox(group, [8.15, 0.32, 0.78], [0, 6.48, 0], materials.vermilion, [0, 0, 0], 'hero-torii-upper-beam');
  addBox(group, [5.85, 0.36, 0.62], [0, 5.68, 0], materials.vermilion, [0, 0, 0], 'hero-torii-nuki');
  addBox(group, [0.34, 0.92, 0.42], [0, 6.12, 0], materials.vermilion, [0, 0, 0], 'hero-torii-gakuzuka');
  addBox(group, [1.22, 0.82, 0.18], [0, 6.12, 0.5], materials.timberDark, [0, 0, 0], 'hero-torii-plaque');
  addInstanced(group, UNIT_BOX_GEOMETRY, materials.vermilion, [
    { position: [-2.66, 6.08, 0], rotation: [0, 0, -0.1], scale: [0.78, 0.38, 0.76] },
    { position: [2.66, 6.08, 0], rotation: [0, 0, 0.1], scale: [0.78, 0.38, 0.76] },
  ], 'hero-torii-wedge');
  addInstanced(group, geometries.band, materials.roofEdge, [
    { position: [-3.1, 0.52, 0], scale: [1.14, 0.22, 1.14] },
    { position: [3.1, 0.52, 0], scale: [1.14, 0.22, 1.14] },
  ], 'hero-torii-footing-band');
  addInstanced(group, geometries.band, materials.timberDark, [
    { position: [-3.1, 5.92, 0], scale: [0.98, 0.18, 0.98] },
    { position: [3.1, 5.92, 0], scale: [0.98, 0.18, 0.98] },
  ], 'hero-torii-post-collar');

  const includeHeroOrnaments = detailProfile.tier !== 'low';
  if (includeHeroOrnaments) {
    addInstanced(group, UNIT_BOX_GEOMETRY, materials.timberDark, [
      { position: [-3.1, 6.42, 0], scale: [1.12, 0.2, 0.92] },
      { position: [3.1, 6.42, 0], scale: [1.12, 0.2, 0.92] },
      { position: [-3.1, 6.66, 0], scale: [1.4, 0.16, 0.74] },
      { position: [3.1, 6.66, 0], scale: [1.4, 0.16, 0.74] },
    ], 'hero-torii-post-bracket');
    addInstanced(group, UNIT_BOX_GEOMETRY, materials.vermilion, [
      { position: [-3.78, 6.78, 0], rotation: [0, 0, -0.3], scale: [1.56, 0.17, 0.5] },
      { position: [3.78, 6.78, 0], rotation: [0, 0, 0.3], scale: [1.56, 0.17, 0.5] },
      { position: [-2.42, 6.5, 0], rotation: [0, 0, 0.25], scale: [1.38, 0.16, 0.46] },
      { position: [2.42, 6.5, 0], rotation: [0, 0, -0.25], scale: [1.38, 0.16, 0.46] },
    ], 'hero-torii-wing-support');
  }
  parent.add(group);
}

function addToriiSequence(parent, materials, detailProfile) {
  const geometries = {
    post: new THREE.CylinderGeometry(0.42, 0.55, 1, detailProfile.torii.postSides),
    base: new THREE.CylinderGeometry(0.74, 0.9, 0.5, detailProfile.torii.postSides),
    band: new THREE.CylinderGeometry(0.5, 0.54, 1, detailProfile.torii.postSides),
  };
  [5, 17, 29].slice(0, detailProfile.torii.count).forEach((stepIndex, index) => {
    const z = 22 - stepIndex * 2.35;
    createTorii(
      parent,
      Math.sin(index * 2.1) * 0.2,
      stepIndex * 0.34 + 0.3,
      z,
      1 - index * 0.04,
      materials,
      detailProfile,
      geometries,
      index === 0,
    );
  });
}

function addLanternPath(parent, materials, detailProfile) {
  const lanterns = [];
  const lights = [];
  let gateAccentOrigin = null;
  for (let index = 3; index < 37; index += 4) {
    const z = 22 - index * 2.35;
    const pathY = index * 0.34 + 0.2;
    const pathLightSide = index % 8 === 3 ? -1 : 1;
    [-1, 1].forEach((side) => {
      const x = side * (4.1 + Math.sin(index) * 0.18);
      const groundY = terrainMeshElevation(x, z, detailProfile.terrainSegments);
      const y = Math.max(pathY, groundY + 0.75);
      if (index === 3 && side === pathLightSide) gateAccentOrigin = { y, z };
      lanterns.push({ x, y, z, groundY });
      if (side === pathLightSide) {
        const light = new THREE.SpotLight(0xe59a45, 19.2, 11, 1.134, 0.18, 2);
        light.position.set(x, y + 2.35, z);
        light.target.position.set(0, index * 0.34 + 0.25, z);
        light.userData.lightRole = 'path';
        light.userData.baseIntensity = 19.2;
        light.userData.warmthGain = 4;
        light.userData.intensityScale = 1;
        light.castShadow = false;
        parent.add(light, light.target);
        lights.push(light);
      }
    });
  }

  const gateAccent = new THREE.SpotLight(0xe59a45, 42, 15, 0.7, 0.25, 2);
  gateAccent.position.set(0, gateAccentOrigin.y + 4.2, gateAccentOrigin.z + 0.8);
  gateAccent.target.position.set(0, 8, 10.25);
  gateAccent.userData.lightRole = 'gate-accent';
  gateAccent.userData.baseIntensity = 42;
  gateAccent.userData.warmthGain = 10;
  gateAccent.userData.intensityScale = 1;
  gateAccent.castShadow = false;
  parent.add(gateAccent, gateAccent.target);
  lights.push(gateAccent);

  const transformsFor = (height, scale) => lanterns.map(({ x, y, z }) => ({
    position: [x, y + height, z],
    scale,
  }));
  const footingTransforms = lanterns.map(({ x, y, z, groundY }) => {
    const footingTop = y + 0.375;
    const footingBottom = groundY - 0.12;
    return {
      position: [x, (footingTop + footingBottom) / 2, z],
      scale: [0.75, footingTop - footingBottom, 0.75],
    };
  });
  addInstanced(parent, UNIT_BOX_GEOMETRY, materials.stoneDark, footingTransforms, 'lantern-base');
  addInstanced(parent, UNIT_BOX_GEOMETRY, materials.stone, transformsFor(1.1, [0.28, 1.55, 0.28]), 'lantern-stem');
  addInstanced(parent, UNIT_BOX_GEOMETRY, materials.stoneDark, transformsFor(1.92, [0.9, 0.25, 0.9]), 'lantern-shoulder');
  addInstanced(parent, UNIT_BOX_GEOMETRY, materials.lanternPaper, transformsFor(2.34, [0.68, 0.68, 0.68]), 'lantern-paper', false, false);
  addInstanced(parent, UNIT_BOX_GEOMETRY, materials.stoneDark, transformsFor(2.79, [0.98, 0.2, 0.98]), 'lantern-eave');
  addInstanced(
    parent,
    new THREE.ConeGeometry(0.72, 0.42, detailProfile.lanterns.capSides),
    materials.stoneDark,
    lanterns.map(({ x, y, z }) => ({
      position: [x, y + 3.08, z],
      rotation: [0, Math.PI / detailProfile.lanterns.capSides, 0],
    })),
    'lantern-cap',
  );

  const verticalBars = lanterns.flatMap(({ x, y, z }) => (
    Array.from({ length: detailProfile.lanterns.frameBars }, (_, barIndex) => ({
      position: [
        x + (barIndex - (detailProfile.lanterns.frameBars - 1) / 2) * (0.48 / Math.max(1, detailProfile.lanterns.frameBars - 1)),
        y + 2.34,
        z + 0.365,
      ],
      scale: [0.045, 0.72, 0.045],
    }))
  ));
  addInstanced(parent, UNIT_BOX_GEOMETRY, materials.timberDark, verticalBars, 'lantern-grid');
  addInstanced(
    parent,
    UNIT_BOX_GEOMETRY,
    materials.timberDark,
    lanterns.map(({ x, y, z }) => ({ position: [x, y + 2.34, z + 0.368], scale: [0.72, 0.045, 0.045] })),
    'lantern-grid',
  );
  return lights;
}

function createCurvedRoofGeometry(segments) {
  const geometry = new THREE.PlaneGeometry(1, 1, segments, 4);
  geometry.rotateX(-Math.PI / 2);
  const positions = geometry.attributes.position;
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const z = positions.getZ(index);
    const ridge = (1 - Math.abs(z) * 2) * 0.34;
    const upturn = Math.abs(x * 2) ** 4 * 0.34;
    positions.setY(index, ridge + upturn);
  }
  geometry.computeVertexNormals();
  return geometry;
}

function createFasciaGeometry(segments) {
  const points = Array.from({ length: segments + 1 }, (_, index) => {
    const x = index / segments - 0.5;
    return new THREE.Vector3(x, Math.abs(x * 2) ** 4 * 0.34, 0);
  });
  return new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points),
    segments,
    0.026,
    4,
    false,
  );
}

function addTemple(parent, materials, warmLights, detailProfile) {
  const temple = new THREE.Group();
  temple.position.set(0, 12.7, -72);
  addBox(temple, [24, 1.1, 15], [0, 0.25, 0], materials.stoneDark, [0, 0, 0], 'temple-primary-base');
  addBox(temple, [20.5, 0.58, 12.6], [0, 1.02, 0.55], materials.stone, [0, 0, 0], 'temple-secondary-base');
  addBox(temple, [21.4, 0.42, 5.6], [0, 1.55, 4.5], materials.timberDark, [0, 0, 0], 'temple-veranda');
  addBox(temple, [18, 5.7, 10], [0, 4.25, 0], materials.timber, [0, 0, 0], 'temple-hall');
  addBox(temple, [8.8, 2.5, 5.4], [0, 8.65, 0], materials.timber, [0, 0, 0], 'temple-upper-hall');

  const panelX = Array.from(
    { length: detailProfile.temple.shojiPanels },
    (_, index) => (index - (detailProfile.temple.shojiPanels - 1) / 2) * 2.25,
  );
  addInstanced(
    temple,
    UNIT_BOX_GEOMETRY,
    materials.shojiPaper,
    panelX.map((x) => ({ position: [x, 4.15, 5.08], scale: [1.84, 3.48, 0.13] })),
    'temple-shoji-panel',
    false,
    false,
  );
  const verticalMullions = panelX.flatMap((x) => (
    Array.from({ length: detailProfile.temple.mullionsPerPanel }, (_, index) => ({
      position: [
        x - 0.72 + index * (1.44 / Math.max(1, detailProfile.temple.mullionsPerPanel - 1)),
        4.15,
        5.19,
      ],
      scale: [0.055, 3.52, 0.07],
    }))
  ));
  addInstanced(temple, UNIT_BOX_GEOMETRY, materials.timberDark, verticalMullions, 'temple-shoji-mullion');
  addInstanced(
    temple,
    UNIT_BOX_GEOMETRY,
    materials.timberDark,
    panelX.flatMap((x) => [3.55, 4.72].map((y) => ({
      position: [x, y, 5.195],
      scale: [1.88, 0.055, 0.07],
    }))),
    'temple-shoji-mullion',
  );

  const columnX = [-9.55, -6.35, -3.18, 0, 3.18, 6.35, 9.55];
  addInstanced(
    temple,
    UNIT_BOX_GEOMETRY,
    materials.timberDark,
    columnX.map((x) => ({ position: [x, 4.15, 5.42], scale: [0.52, 6.55, 0.52] })),
    'temple-veranda-post',
  );
  addBox(temple, [21.2, 0.42, 0.58], [0, 2.15, 5.42], materials.timberDark, [0, 0, 0], 'temple-crossbeam');
  addBox(temple, [21.8, 0.52, 0.66], [0, 6.78, 5.25], materials.timberDark, [0, 0, 0], 'temple-crossbeam');

  const railingX = Array.from(
    { length: detailProfile.temple.railingPosts },
    (_, index) => -9.75 + index * (19.5 / Math.max(1, detailProfile.temple.railingPosts - 1)),
  );
  addInstanced(
    temple,
    UNIT_BOX_GEOMETRY,
    materials.timberDark,
    railingX.map((x) => ({ position: [x, 2.38, 6.12], scale: [0.14, 1.3, 0.14] })),
    'temple-railing-post',
  );
  addBox(temple, [20.1, 0.14, 0.16], [0, 2.15, 6.12], materials.timberDark, [0, 0, 0], 'temple-railing');
  addBox(temple, [20.1, 0.14, 0.16], [0, 2.92, 6.12], materials.timberDark, [0, 0, 0], 'temple-railing');

  const bracketX = Array.from(
    { length: detailProfile.temple.bracketClusters },
    (_, index) => -9.2 + index * (18.4 / Math.max(1, detailProfile.temple.bracketClusters - 1)),
  );
  const bracketTransforms = bracketX.flatMap((x, index) => {
    const direction = index % 2 ? -1 : 1;
    return [
      { position: [x, 6.98, 5.35], scale: [1.15, 0.2, 0.46] },
      { position: [x, 6.62, 5.35], scale: [0.22, 0.65, 0.42] },
      { position: [x + direction * 0.22, 6.67, 5.35], rotation: [0, 0, direction * 0.48], scale: [0.17, 0.78, 0.3] },
    ];
  });
  addInstanced(temple, UNIT_BOX_GEOMETRY, materials.timberDark, bracketTransforms, 'temple-bracket');

  const rafterTransforms = Array.from({ length: detailProfile.temple.rafters }, (_, index) => {
    const x = -11.25 + index * (22.5 / Math.max(1, detailProfile.temple.rafters - 1));
    return {
      position: [x, 7.2 + Math.abs(x / 11.25) ** 4 * 0.28, 4.75],
      rotation: [0.11, 0, 0],
      scale: [0.12, 0.14, 4],
    };
  });
  addInstanced(temple, UNIT_BOX_GEOMETRY, materials.timberDark, rafterTransforms, 'temple-rafter');

  const roofGeometry = createCurvedRoofGeometry(detailProfile.temple.roofSegments);
  const mainRoof = setSemanticRole(shadow(new THREE.Mesh(roofGeometry, materials.roof)), 'temple-roof');
  mainRoof.position.set(0, 7.35, 0);
  mainRoof.scale.set(24.8, 1, 14.2);
  temple.add(mainRoof);
  const upperRoof = setSemanticRole(shadow(new THREE.Mesh(roofGeometry, materials.roof)), 'temple-roof');
  upperRoof.position.set(0, 10.02, 0);
  upperRoof.scale.set(14.2, 0.82, 7.4);
  temple.add(upperRoof);

  const fasciaGeometry = createFasciaGeometry(detailProfile.temple.roofSegments);
  [
    { position: [0, 7.36, 7.12], width: 24.8 },
    { position: [0, 7.36, -7.12], width: 24.8 },
    { position: [0, 10.02, 3.72], width: 14.2 },
    { position: [0, 10.02, -3.72], width: 14.2 },
  ].forEach(({ position, width }) => {
    const fascia = setSemanticRole(shadow(new THREE.Mesh(fasciaGeometry, materials.roofEdge)), 'temple-fascia');
    fascia.position.set(...position);
    fascia.scale.set(width, 1, 1);
    temple.add(fascia);
  });
  addBox(temple, [24.6, 0.22, 0.36], [0, 7.74, 0], materials.roofEdge, [0, 0, 0], 'temple-ridge');
  addBox(temple, [14.1, 0.2, 0.3], [0, 10.32, 0], materials.roofEdge, [0, 0, 0], 'temple-ridge');
  parent.add(temple);

  const exteriorKey = new THREE.SpotLight(0x7396ad, 420, 80, 0.62, 0.5, 1.2);
  exteriorKey.position.set(-12, 30, -54);
  exteriorKey.target.position.set(0, 20.5, -72);
  exteriorKey.userData.lightRole = 'temple-exterior';
  parent.add(exteriorKey, exteriorKey.target);

  for (const x of [-6.5, 0, 6.5]) {
    const light = new THREE.PointLight(0xe09a4a, 2.6, 17, 2);
    light.position.set(x, 17, -65.5);
    light.userData.lightRole = 'temple';
    light.userData.baseIntensity = 2.6;
    light.userData.warmthGain = 1.4;
    light.userData.intensityScale = 1;
    parent.add(light);
    warmLights.push(light);
  }
  return [materials.shojiPaper];
}

function addForest(parent, materials, count, detailProfile) {
  const trunkGeometry = new THREE.CylinderGeometry(0.18, 0.35, 5.8, detailProfile.trees.trunkSides);
  const crownGeometry = new THREE.IcosahedronGeometry(1, detailProfile.trees.crownDetail);
  const trees = Array.from({ length: count }, (_, index) => {
    const side = index % 2 ? -1 : 1;
    const z = range(-94, 30);
    const x = side * range(8.5, 38);
    const groundY = terrainMeshElevation(x, z, detailProfile.terrainSegments);
    return {
      archetype: index % detailProfile.trees.archetypes,
      x,
      y: groundY - 0.12,
      z,
      scale: range(0.7, 1.55),
      rotation: range(-Math.PI, Math.PI),
      lean: range(-0.035, 0.035),
    };
  });

  for (let archetype = 0; archetype < detailProfile.trees.archetypes; archetype += 1) {
    const archetypeTrees = trees.filter((tree) => tree.archetype === archetype);
    addInstanced(
      parent,
      trunkGeometry,
      materials.timberDark,
      archetypeTrees.map((tree) => ({
        position: [tree.x, tree.y + 2.9 * tree.scale, tree.z],
        rotation: [0, tree.rotation, tree.lean],
        scale: [tree.scale, tree.scale, tree.scale],
      })),
      'tree-trunk-' + (archetype + 1),
    );

    for (let layer = 0; layer < detailProfile.trees.crownLayers; layer += 1) {
      const taper = 1 - layer / (detailProfile.trees.crownLayers + 1);
      const crownMaterial = (archetype + layer) % 2 ? materials.foliageCold : materials.foliage;
      addInstanced(
        parent,
        crownGeometry,
        crownMaterial,
        archetypeTrees.map((tree, treeIndex) => {
          const direction = (treeIndex + archetype) % 2 ? -1 : 1;
          const branchOffset = direction * (0.45 + archetype * 0.18) * taper * tree.scale;
          const depthOffset = Math.sin(tree.rotation + layer * 1.7) * 0.42 * tree.scale;
          const radius = (2.75 - layer * 0.34) * tree.scale;
          return {
            position: [
              tree.x + branchOffset,
              tree.y + (5.4 + layer * 1.45) * tree.scale,
              tree.z + depthOffset,
            ],
            rotation: [0, tree.rotation + layer * 0.37, tree.lean * 2],
            scale: [
              radius * (1 + archetype * 0.09),
              (0.52 + taper * 0.18) * tree.scale,
              radius * (0.64 + archetype * 0.06),
            ],
          };
        }),
        'tree-crown-' + (archetype + 1),
        true,
        false,
      );
    }
  }
}

function addRuinsAndStones(parent, materials) {
  const stoneGeometry = new THREE.DodecahedronGeometry(1, 0);
  const stoneTransforms = [];
  const mossTransforms = [];
  for (let index = 0; index < 22; index += 1) {
    const side = index % 2 ? -1 : 1;
    const z = range(-88, 26);
    const transform = {
      position: [side * range(6.5, 17), pathElevation(z) + range(-0.7, 0.8), z],
      scale: [range(0.4, 1.7), range(0.35, 1.1), range(0.55, 2)],
      rotation: [range(0, 0.7), range(0, Math.PI), range(0, 0.5)],
    };
    (index % 4 ? stoneTransforms : mossTransforms).push(transform);
  }
  addInstanced(parent, stoneGeometry, materials.stone, stoneTransforms, 'path-stone', false, true);
  addInstanced(parent, stoneGeometry, materials.moss, mossTransforms, 'moss-stone', false, true);

  for (const z of [-18, -47]) {
    const y = pathElevation(z);
    addBox(parent, [7.2, 2.5, 0.6], [-9, y + 1.1, z], materials.stoneDark, [0, 0.12, 0.04], 'ruin-wall');
    addBox(parent, [0.7, 4.1, 0.7], [-12.2, y + 1.7, z], materials.stoneDark, [0, 0, 0.08], 'ruin-pier');
  }
}

function collectSceneStats(world, tier) {
  const geometries = new Set();
  const materials = new Set();
  const semanticRoles = {};
  let triangles = 0;
  let drawables = 0;

  world.traverse((object) => {
    const geometry = object.geometry;
    if (!geometry || !object.material) return;
    drawables += 1;
    geometries.add(geometry.uuid);
    const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
    objectMaterials.forEach((material) => materials.add(material.uuid));

    const instanceCount = object.isInstancedMesh ? object.count : 1;
    if (object.isMesh || object.isSprite) {
      const elementCount = geometry.index?.count ?? geometry.attributes.position?.count ?? 0;
      triangles += Math.floor(elementCount / 3) * instanceCount;
    }

    const semanticRole = object.userData.semanticRole;
    if (semanticRole) semanticRoles[semanticRole] = (semanticRoles[semanticRole] ?? 0) + instanceCount;
  });

  const budget = getSceneDetailProfile(tier).budget;
  const uniqueGeometries = geometries.size;
  const uniqueMaterials = materials.size;
  return {
    tier,
    triangles,
    drawables,
    uniqueGeometries,
    uniqueMaterials,
    semanticRoles,
    budget,
    withinBudget: (
      triangles >= budget.minTriangles
      && triangles <= budget.maxTriangles
      && drawables <= budget.maxDrawables
      && uniqueGeometries <= budget.maxGeometries
      && uniqueMaterials <= budget.maxMaterials
    ),
  };
}

function addMoon(parent) {
  const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xd53a2e, fog: false });
  const moon = setSemanticRole(new THREE.Mesh(new THREE.SphereGeometry(9.2, 48, 32), moonMaterial), 'moon');
  moon.position.set(-24, 29, -108);
  parent.add(moon);

  const moonGlow = new THREE.PointLight(0xbc342d, 10, 110, 1.2);
  moonGlow.position.copy(moon.position);
  parent.add(moonGlow);
}

function addAtmosphericLight(scene) {
  scene.add(new THREE.HemisphereLight(0x607c98, 0x2b3a34, 1.6));
  const moonKey = new THREE.DirectionalLight(0xa3bad1, 2.8);
  moonKey.position.set(-20, 32, 16);
  moonKey.castShadow = true;
  moonKey.shadow.mapSize.set(1024, 1024);
  moonKey.shadow.camera.left = -42;
  moonKey.shadow.camera.right = 42;
  moonKey.shadow.camera.top = 42;
  moonKey.shadow.camera.bottom = -42;
  scene.add(moonKey);

  const rim = new THREE.DirectionalLight(0x5d747d, 1.2);
  rim.position.set(24, 10, -60);
  scene.add(rim);
}

function createFogTexture() {
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 128;
  textureCanvas.height = 128;
  const context = textureCanvas.getContext('2d');
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(180, 198, 203, 0.34)');
  gradient.addColorStop(0.45, 'rgba(125, 145, 151, 0.15)');
  gradient.addColorStop(1, 'rgba(75, 90, 96, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function addFogLayers(parent) {
  const texture = createFogTexture();
  const materials = [
    { color: 0x728087, opacity: 0.07 },
    { color: 0x4c5d61, opacity: 0.095 },
    { color: 0x617278, opacity: 0.12 },
  ].map(({ color, opacity }) => new THREE.SpriteMaterial({
    map: texture,
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.NormalBlending,
  }));
  const sprites = [];
  for (let index = 0; index < 13; index += 1) {
    const sprite = setSemanticRole(new THREE.Sprite(materials[index % materials.length]), 'fog-layer');
    sprite.position.set(range(-28, 28), range(1.5, 15), range(-92, 24));
    sprite.scale.set(range(20, 42), range(7, 14), 1);
    parent.add(sprite);
    sprites.push(sprite);
  }
  return sprites;
}

function addRain(parent, count) {
  if (!count) return null;
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = range(-34, 34);
    positions[index * 3 + 1] = range(0, 35);
    positions[index * 3 + 2] = range(-96, 34);
    speeds[index] = range(12, 22);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0x9eb4c2,
    size: 0.045,
    transparent: true,
    opacity: 0.48,
    depthWrite: false,
  });
  const points = setSemanticRole(new THREE.Points(geometry, material), 'rain');
  points.userData.speeds = speeds;
  parent.add(points);
  return points;
}

function updateRain(rain, delta) {
  if (!rain) return;
  const positions = rain.geometry.attributes.position.array;
  const speeds = rain.userData.speeds;
  for (let index = 0; index < speeds.length; index += 1) {
    positions[index * 3] -= delta * 0.7;
    positions[index * 3 + 1] -= speeds[index] * delta;
    if (positions[index * 3 + 1] < -1) {
      positions[index * 3 + 1] = range(24, 36);
      positions[index * 3] = range(-34, 34);
    }
  }
  rain.geometry.attributes.position.needsUpdate = true;
}

function addLeaves(parent, count) {
  if (!count) return null;
  const geometry = new THREE.PlaneGeometry(0.18, 0.36);
  const material = new THREE.MeshBasicMaterial({
    color: 0x8f3026,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
  });
  const mesh = setSemanticRole(new THREE.InstancedMesh(geometry, material, count), 'drifting-leaf');
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.userData.items = Array.from({ length: count }, () => ({
    x: range(-22, 22),
    y: range(2, 25),
    z: range(-88, 20),
    speed: range(0.28, 0.72),
    drift: range(-0.35, 0.35),
    phase: range(0, Math.PI * 2),
    scale: range(0.7, 1.3),
  }));
  parent.add(mesh);
  updateLeaves(mesh, 0, 0);
  return mesh;
}

function updateLeaves(leaves, delta, time) {
  if (!leaves) return;
  const dummy = new THREE.Object3D();
  leaves.userData.items.forEach((item, index) => {
    item.y -= item.speed * delta;
    item.x += item.drift * delta + Math.sin(time * 0.00035 + item.phase) * delta * 0.2;
    if (item.y < pathElevation(item.z)) {
      item.y = range(17, 27);
      item.x = range(-22, 22);
      item.z = range(-88, 20);
    }
    dummy.position.set(item.x, item.y, item.z);
    dummy.rotation.set(time * 0.0004 + item.phase, time * 0.00023 + item.phase, item.phase);
    dummy.scale.setScalar(item.scale);
    dummy.updateMatrix();
    leaves.setMatrixAt(index, dummy.matrix);
  });
  leaves.instanceMatrix.needsUpdate = true;
}

function addEmbers(parent, count) {
  if (!count) return null;
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = range(-10, 10);
    positions[index * 3 + 1] = range(4, 18);
    positions[index * 3 + 2] = range(-78, -30);
    phases[index] = range(0, Math.PI * 2);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xe09843,
    size: 0.085,
    transparent: true,
    opacity: 0.76,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = setSemanticRole(new THREE.Points(geometry, material), 'ember');
  points.userData.phases = phases;
  parent.add(points);
  return points;
}

function updateEmbers(embers, delta, time) {
  if (!embers) return;
  const positions = embers.geometry.attributes.position.array;
  const phases = embers.userData.phases;
  for (let index = 0; index < phases.length; index += 1) {
    positions[index * 3] += Math.sin(time * 0.0008 + phases[index]) * delta * 0.26;
    positions[index * 3 + 1] += delta * 0.34;
    if (positions[index * 3 + 1] > 20) positions[index * 3 + 1] = range(3, 8);
  }
  embers.geometry.attributes.position.needsUpdate = true;
}

if (!canvas) {
  markFallback();
} else {
  try {
    createExperience(canvas);
  } catch (error) {
    console.error('Kage WebGL initialization failed.', error);
    markFallback();
  }
}
