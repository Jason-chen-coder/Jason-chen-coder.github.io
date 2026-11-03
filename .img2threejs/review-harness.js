import * as THREE from '../assets/vendor/three/three.module.min.js';
import { collectSceneStats, createLaboratoryWorld } from '../lab-world.js?img2threejs=12';
import { createLaboratoryReflectionEnvironment } from '../scene.js?img2threejs=12';

const REVIEW_SUBJECTS = Object.freeze({
  'alab': {
    rootRole: 'alab-bay',
    hideRoles: ['alab-floor-guide', 'alab-project-sign', 'alab-enclosure'],
  },
  'primegen': {
    rootRole: 'primegen-bay',
    hideRoles: ['primegen-floor-guide', 'primegen-project-sign', 'primegen-sample-flow'],
  },
  'oxygen': {
    rootRole: 'oxygen-bay',
    hideRoles: [
      'oxygen-floor-guide',
      'oxygen-project-sign',
      'oxygen-generator',
      'oxygen-hose',
      'oxygen-touch-console',
    ],
  },
  'cloud-remote': {
    rootRole: 'cloud-compound-bay',
    isolateRoles: ['cloud-remote-device-end', 'cloud-remote-consultation-end'],
    hideRoles: [
      'cloud-floor-guide',
      'cloud-ceiling-rail',
      'cloud-project-sign',
      'cloud-handheld-station',
      'cloud-remote-sync-line',
    ],
  },
  'cloud-handheld': {
    rootRole: 'cloud-handheld-station',
    hideRoles: ['cloud-tablet'],
  },
});

const REVIEW_VIEWS = Object.freeze({
  'front': new THREE.Vector3(0, 0.08, 1),
  'three-quarter': new THREE.Vector3(0.82, 0.28, 1),
  'side': new THREE.Vector3(1, 0.12, 0),
  'rear': new THREE.Vector3(0, 0.08, -1),
});

const params = new URLSearchParams(window.location.search);
const detailTier = ['high', 'balanced', 'low'].includes(params.get('tier'))
  ? params.get('tier')
  : 'high';
const modelId = Object.hasOwn(REVIEW_SUBJECTS, params.get('model'))
  ? params.get('model')
  : 'oxygen';
const viewId = Object.hasOwn(REVIEW_VIEWS, params.get('view'))
  ? params.get('view')
  : 'three-quarter';
const reviewMode = params.get('mode');
const diagnosticMode = reviewMode === 'diagnostic';
const grazingMode = reviewMode === 'grazing';
const tier1Mode = reviewMode === 'tier1';
const cleanBackgroundMode = diagnosticMode || tier1Mode;
const interactiveRequested = params.get('interactive') === '1';
const screenOffsetX = THREE.MathUtils.clamp(Number(params.get('screenX')) || 0, -120, 120);
const screenOffsetY = THREE.MathUtils.clamp(Number(params.get('screenY')) || 0, -120, 120);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = !cleanBackgroundMode;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.append(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(cleanBackgroundMode ? 0xffffff : grazingMode ? 0xe2e5e4 : 0xf2f3f2);
const reflectionEnvironment = createLaboratoryReflectionEnvironment(document);
scene.environment = reflectionEnvironment;
scene.environmentIntensity = 0.78;

const world = createLaboratoryWorld({ detailTier });
const subjectConfig = REVIEW_SUBJECTS[modelId];
const subject = world.root.getObjectByName(subjectConfig.rootRole);
if (!subject) throw new Error(`${subjectConfig.rootRole} is required for ${modelId} review`);
subject.removeFromParent();
subject.traverse((object) => {
  if (
    subjectConfig.isolateRoles
    && object !== subject
    && object.parent === subject
    && object.userData.semanticRole
    && !subjectConfig.isolateRoles.includes(object.userData.semanticRole)
  ) object.visible = false;
  if (subjectConfig.hideRoles.includes(object.userData.semanticRole)) object.visible = false;
});
subject.updateMatrixWorld(true);

function getVisibleBounds(root) {
  const visibleBounds = new THREE.Box3();
  root.updateMatrixWorld(true);
  root.traverseVisible((object) => {
    if (!(object.isMesh || object.isInstancedMesh)) return;
    visibleBounds.expandByObject(object, true);
  });
  return visibleBounds;
}

const initialBounds = getVisibleBounds(subject);
const initialCenter = initialBounds.getCenter(new THREE.Vector3());
subject.position.x -= initialCenter.x;
subject.position.y -= initialBounds.min.y;
subject.position.z -= initialCenter.z;
subject.updateMatrixWorld(true);

subject.traverseVisible((object) => {
  if (!object.isMesh) return;
  object.castShadow = true;
  object.receiveShadow = true;
  if (!diagnosticMode) return;
  const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
  objectMaterials.forEach((material) => {
    for (const key of [
      'map',
      'roughnessMap',
      'normalMap',
      'bumpMap',
      'displacementMap',
      'aoMap',
      'metalnessMap',
      'alphaMap',
    ]) material[key] = null;
    material.color?.set(0xbfc4c5);
    material.roughness = 0.86;
    material.metalness = 0;
    if ('transmission' in material) material.transmission = 0;
    if ('clearcoat' in material) material.clearcoat = 0;
    if ('sheen' in material) material.sheen = 0;
    material.opacity = 1;
    material.transparent = false;
    material.depthWrite = true;
    material.needsUpdate = true;
  });
});
scene.add(subject);

const bounds = getVisibleBounds(subject);
const target = bounds.getCenter(new THREE.Vector3());
const size = bounds.getSize(new THREE.Vector3());
const subjectRadius = Math.max(0.8, size.length() * 0.5);
const stats = collectSceneStats(subject, {
  detailTier,
  additionalTextures: [reflectionEnvironment],
});

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(Math.max(18, size.x * 3), Math.max(16, size.z * 3)),
  new THREE.MeshStandardMaterial({ color: 0xe8ebea, roughness: 0.92, metalness: 0 }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.02;
ground.receiveShadow = true;
ground.visible = !cleanBackgroundMode;
scene.add(ground);

const hemisphere = new THREE.HemisphereLight(0xffffff, 0x667177, grazingMode ? 0.4 : 1.05);
scene.add(hemisphere);

const key = new THREE.DirectionalLight(0xffffff, grazingMode ? 3.4 : 2.25);
key.position.set(-subjectRadius * 1.1, subjectRadius * 2.2, subjectRadius * 1.8);
key.target.position.copy(target);
key.castShadow = !cleanBackgroundMode;
key.shadow.mapSize.set(1024, 1024);
const shadowExtent = Math.max(4, subjectRadius * 1.5);
key.shadow.camera.left = -shadowExtent;
key.shadow.camera.right = shadowExtent;
key.shadow.camera.top = shadowExtent;
key.shadow.camera.bottom = -shadowExtent;
key.shadow.bias = -0.0008;
scene.add(key, key.target);

const rim = new THREE.DirectionalLight(0xb9e5e6, grazingMode ? 0.5 : 0.82);
rim.position.set(subjectRadius * 1.7, subjectRadius * 1.4, -subjectRadius * 1.3);
rim.target.position.copy(target);
scene.add(rim, rim.target);

const camera = new THREE.PerspectiveCamera(39, 1, 0.1, Math.max(40, subjectRadius * 12));
camera.up.set(0, 1, 0);
const spherical = new THREE.Spherical();

function cameraDistanceForViewport(aspect) {
  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
  const limitingFov = Math.min(verticalFov, horizontalFov);
  return subjectRadius / Math.sin(limitingFov / 2) * (grazingMode ? 0.96 : 1.12);
}

function applyCameraPosition() {
  camera.position.copy(target).add(new THREE.Vector3().setFromSpherical(spherical));
  camera.lookAt(target);
}

function resetCameraForViewport() {
  const aspect = window.innerWidth / Math.max(1, window.innerHeight);
  camera.fov = aspect < 0.8 ? 46 : 39;
  camera.aspect = aspect;
  camera.setViewOffset(
    window.innerWidth,
    window.innerHeight,
    -screenOffsetX,
    -screenOffsetY,
    window.innerWidth,
    window.innerHeight,
  );
  camera.updateProjectionMatrix();
  const offset = REVIEW_VIEWS[viewId].clone().normalize().multiplyScalar(cameraDistanceForViewport(aspect));
  spherical.setFromVector3(offset);
  applyCameraPosition();
}

function render() {
  renderer.render(scene, camera);
  window.__ready = true;
}

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  resetCameraForViewport();
  render();
}

window.__interactive = false;
let pointer = null;
renderer.domElement.addEventListener('pointerdown', (event) => {
  if (!interactiveRequested) return;
  window.__interactive = true;
  pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
  renderer.domElement.setPointerCapture(event.pointerId);
});
renderer.domElement.addEventListener('pointermove', (event) => {
  if (!window.__interactive || !pointer || event.pointerId !== pointer.id) return;
  spherical.theta -= (event.clientX - pointer.x) * 0.006;
  spherical.phi = THREE.MathUtils.clamp(
    spherical.phi + (event.clientY - pointer.y) * 0.004,
    0.32,
    Math.PI * 0.58,
  );
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  applyCameraPosition();
  render();
});
for (const eventName of ['pointerup', 'pointercancel']) {
  renderer.domElement.addEventListener(eventName, (event) => {
    if (pointer?.id === event.pointerId) pointer = null;
  });
}
renderer.domElement.addEventListener('wheel', (event) => {
  if (!interactiveRequested) return;
  window.__interactive = true;
  spherical.radius = THREE.MathUtils.clamp(
    spherical.radius + event.deltaY * 0.006,
    subjectRadius * 1.4,
    subjectRadius * 8,
  );
  applyCameraPosition();
  render();
}, { passive: true });
window.addEventListener('resize', resize);

resize();
document.title = `${modelId} model review`;
document.documentElement.dataset.sceneState = 'ready';
document.documentElement.dataset.model = modelId;
document.documentElement.dataset.view = viewId;
document.documentElement.dataset.detailTier = detailTier;
document.documentElement.dataset.reviewMode = diagnosticMode
  ? 'diagnostic'
  : tier1Mode
    ? 'tier1'
    : grazingMode
      ? 'grazing'
      : 'material';
document.documentElement.dataset.interactive = String(interactiveRequested);
document.documentElement.dataset.screenOffset = `${screenOffsetX},${screenOffsetY}`;
document.documentElement.dataset.sceneStats = JSON.stringify(stats);
document.documentElement.dataset.withinBudget = String(stats.withinBudget);
