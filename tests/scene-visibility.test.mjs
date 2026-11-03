import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import * as THREE from '../assets/vendor/three/three.module.min.js';
import {
  applyDeviceAction,
  applyMappedTextures,
  createLaboratoryWorld,
  snapshotDeviceActions,
} from '../lab-world.js';
import {
  createContextLifecycle,
  createSceneLayoutInvalidation,
  getSceneActivationOffset,
  measureSceneStopMetrics,
} from '../scene.js';
import * as sceneRuntime from '../scene.js';
import {
  CAMERA_POSES,
  PROJECT_BAYS,
  SCENE_STOPS,
  buildSceneTimeline,
  evaluateSceneTimeline,
  interpolateCamera,
} from '../scene-model.js';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

function rolesIn(rootObject) {
  const roles = [];
  rootObject.traverse((object) => {
    if (object.userData.semanticRole) roles.push(object.userData.semanticRole);
  });
  return roles;
}

function byRole(rootObject, role) {
  let match = null;
  rootObject.traverse((object) => {
    if (!match && object.userData.semanticRole === role) match = object;
  });
  return match;
}

const PROJECT_FRAMING_VIEWS = Object.freeze([
  { stopId: 'alab', roles: ['alab-enclosure', 'alab-robot-arm', 'alab-analyzer'] },
  { stopId: 'primegen', roles: ['primegen-planning-console', 'primegen-instrument-row'] },
  { stopId: 'oxygen', roles: ['oxygen-rounded-shell'] },
  { stopId: 'cloud-remote', roles: ['cloud-remote-device-end', 'cloud-remote-consultation-end'] },
  { stopId: 'cloud-handheld', roles: ['cloud-handheld-station'] },
]);

const FRAMING_VIEWPORTS = Object.freeze([
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
]);

function unionRoleBounds(worldRoot, roles) {
  const bounds = new THREE.Box3();
  for (const role of roles) {
    const object = byRole(worldRoot, role);
    assert.ok(object, `missing framing object ${role}`);
    bounds.expandByObject(object, true);
  }
  assert.equal(bounds.isEmpty(), false, `framing bounds for ${roles.join(', ')} must be non-empty`);
  return bounds;
}

function projectBoxBounds(box, pose, viewport) {
  const camera = new THREE.PerspectiveCamera(pose.fov, viewport.width / viewport.height, 0.08, 90);
  camera.position.fromArray(pose.position);
  camera.up.set(0, 1, 0);
  camera.lookAt(new THREE.Vector3().fromArray(pose.target));
  camera.rotation.z = pose.roll;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);

  const projected = [];
  for (const x of [box.min.x, box.max.x]) {
    for (const y of [box.min.y, box.max.y]) {
      for (const z of [box.min.z, box.max.z]) {
        const point = new THREE.Vector3(x, y, z).project(camera);
        projected.push({ x: (point.x + 1) / 2, y: (1 - point.y) / 2 });
      }
    }
  }
  return {
    minX: Math.min(...projected.map(({ x }) => x)),
    maxX: Math.max(...projected.map(({ x }) => x)),
    minY: Math.min(...projected.map(({ y }) => y)),
    maxY: Math.max(...projected.map(({ y }) => y)),
  };
}

function formatProjectedBounds(bounds) {
  return `x=${bounds.minX.toFixed(3)}..${bounds.maxX.toFixed(3)}, y=${bounds.minY.toFixed(3)}..${bounds.maxY.toFixed(3)}`;
}

test('all five project equipment combinations fit the central viewport framing at four target sizes', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  world.root.updateMatrixWorld(true);
  const violations = [];
  const makeConfig = typeof sceneRuntime.responsiveConfigForViewport === 'function'
    ? sceneRuntime.responsiveConfigForViewport
    : (width) => ({ lateralScale: width <= 720 ? 0.7 : width <= 1024 ? 0.86 : 1 });

  for (const viewport of FRAMING_VIEWPORTS) {
    const responsiveConfig = makeConfig(viewport.width, viewport.height);
    for (const framingView of PROJECT_FRAMING_VIEWS) {
      const stopIndex = SCENE_STOPS.findIndex(({ id }) => id === framingView.stopId);
      const pose = interpolateCamera(stopIndex / (CAMERA_POSES.length - 1), CAMERA_POSES, responsiveConfig);
      const equipmentBounds = unionRoleBounds(world.root, framingView.roles);
      const equipmentCenter = equipmentBounds.getCenter(new THREE.Vector3()).toArray();
      for (const axis of [0, 2]) {
        if (framingView.stopId === 'cloud-handheld') continue;
        assert.ok(
          Math.abs(pose.target[axis] - equipmentCenter[axis]) <= 0.001,
          `${framingView.stopId} target axis ${axis} must remain on the real equipment center`,
        );
      }
      if (framingView.stopId !== 'cloud-handheld') {
        assert.ok(
          Math.abs(pose.position[0] - equipmentCenter[0]) <= 1e-6,
          `${framingView.stopId} camera must face the equipment center head-on`,
        );
      } else {
        assert.ok(
          Math.abs(pose.position[0] - equipmentCenter[0]) <= 1.6,
          'Cloud Handheld may use an off-center hero composition while preserving a level camera',
        );
      }
      assert.equal(pose.target[1], pose.position[1], `${framingView.stopId} target must stay at eye level`);
      assert.ok(pose.position[2] > equipmentBounds.max.z, `${framingView.stopId} camera must stay in front of the equipment`);
      assert.deepEqual(pose.forward, [0, 0, -1], `${framingView.stopId} must face straight down -Z`);
      const bounds = projectBoxBounds(equipmentBounds, pose, viewport);
      const maximumY = framingView.stopId === 'oxygen' ? 0.91 : 0.9;
      const withinFrame = bounds.minX >= 0.2
        && bounds.maxX <= 0.8
        && bounds.minY >= 0.1
        && bounds.maxY <= maximumY;
      if (!withinFrame) {
        violations.push(`${viewport.width}x${viewport.height} ${framingView.stopId}: ${formatProjectedBounds(bounds)}`);
      }
      if (viewport.width === 1440 && framingView.stopId === 'oxygen') {
        assert.ok(bounds.minY >= 0.1, 'the level Oxygen silhouette must retain its top inside the viewport');
        assert.ok(
          bounds.maxY <= 0.91,
          `the level Oxygen silhouette must retain its base inside the viewport: ${formatProjectedBounds(bounds)}`,
        );
      }
    }
  }

  world.dispose();
  assert.equal(
    violations.length,
    0,
    `responsiveConfigForViewport=${typeof sceneRuntime.responsiveConfigForViewport}; framing violations:\n${violations.join('\n')}`,
  );
});

test('Cloud remote and handheld stations occupy separate lanes with an unobstructed handheld sightline', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  world.root.updateMatrixWorld(true);
  const remoteBounds = unionRoleBounds(world.root, ['cloud-remote-device-end', 'cloud-remote-consultation-end']);
  const handheldBounds = unionRoleBounds(world.root, ['cloud-handheld-station']);
  const handheldPose = SCENE_STOPS.find(({ id }) => id === 'cloud-handheld').pose;

  assert.ok(
    handheldBounds.max.x < remoteBounds.min.x,
    `Cloud stations need separate X lanes: handheld max=${handheldBounds.max.x}, remote min=${remoteBounds.min.x}`,
  );
  const remoteCollider = {
    min: remoteBounds.min.toArray(),
    max: remoteBounds.max.toArray(),
  };
  const sightlineHitsRemote = (() => {
    const start = handheldPose.position;
    const end = handheldPose.target;
    let near = 0;
    let far = 1;
    for (let axis = 0; axis < 3; axis += 1) {
      const delta = end[axis] - start[axis];
      if (Math.abs(delta) < 1e-9) {
        if (start[axis] < remoteCollider.min[axis] || start[axis] > remoteCollider.max[axis]) return false;
        continue;
      }
      let axisNear = (remoteCollider.min[axis] - start[axis]) / delta;
      let axisFar = (remoteCollider.max[axis] - start[axis]) / delta;
      if (axisNear > axisFar) [axisNear, axisFar] = [axisFar, axisNear];
      near = Math.max(near, axisNear);
      far = Math.min(far, axisFar);
      if (near > far) return false;
    }
    return true;
  })();

  world.dispose();
  assert.equal(sightlineHitsRemote, false, 'Cloud remote equipment must not obstruct the handheld camera ray');
});

test('mobile Cloud Handheld camera keeps the hero probe at inspectable scale', () => {
  const world = createLaboratoryWorld({ detailTier: 'balanced' });
  world.root.updateMatrixWorld(true);
  const handheldBounds = unionRoleBounds(world.root, ['cloud-handheld-waisted-body', 'cloud-handheld-stand']);
  const stopIndex = SCENE_STOPS.findIndex(({ id }) => id === 'cloud-handheld');
  const viewport = { width: 390, height: 844 };
  const pose = interpolateCamera(
    stopIndex / (CAMERA_POSES.length - 1),
    CAMERA_POSES,
    sceneRuntime.responsiveConfigForViewport(viewport.width, viewport.height),
  );
  const bounds = projectBoxBounds(handheldBounds, pose, viewport);
  assert.ok(bounds.maxX - bounds.minX <= 0.62, `Handheld must stay fully readable: ${formatProjectedBounds(bounds)}`);
  assert.ok(bounds.maxX - bounds.minX >= 0.16, `Handheld must not read as an incidental prop: ${formatProjectedBounds(bounds)}`);
  world.dispose();
});

test('all four bays expose recognizable equipment roles at authored world-space sides', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  const roles = new Set(rolesIn(world.root));
  const required = [
    'alab-enclosure', 'alab-robot-arm', 'alab-robot-joint', 'alab-sample-carrier', 'alab-sample-rack', 'alab-analyzer',
    'primegen-planning-console', 'primegen-queue-indicator', 'primegen-instrument-row', 'primegen-sample-flow',
    'oxygen-rounded-shell', 'oxygen-dark-front-frame', 'oxygen-window-section', 'oxygen-high-back-seat', 'oxygen-door-handle',
    'oxygen-base-frame', 'oxygen-side-depth', 'oxygen-generator', 'oxygen-hose', 'oxygen-integrated-screen', 'oxygen-touch-console',
    'cloud-remote-equipment-body', 'cloud-remote-caster', 'cloud-remote-column', 'cloud-remote-control-console',
    'cloud-remote-device-end', 'cloud-remote-consultation-end', 'cloud-dual-monitor',
    'cloud-handheld-waisted-body', 'cloud-handheld-top-arc', 'cloud-handheld-bottom-arc', 'cloud-handheld-status-line',
    'cloud-handheld-side-button', 'cloud-handheld-stand', 'cloud-tablet',
  ];
  required.forEach((role) => assert.ok(roles.has(role), `missing recognizable role ${role}`));

  for (const [key, bay] of Object.entries(PROJECT_BAYS)) {
    const group = byRole(world.root, `${key === 'cloud' ? 'cloud-compound' : key}-bay`);
    assert.ok(group, `${key} bay group must exist`);
    assert.deepEqual(group.position.toArray(), bay.center);
  }
  assert.ok(byRole(world.root, 'alab-bay').position.x < 0);
  assert.ok(byRole(world.root, 'oxygen-bay').position.x < 0);
  assert.ok(byRole(world.root, 'primegen-bay').position.x > 0);
  assert.ok(byRole(world.root, 'cloud-compound-bay').position.x > 0);
  world.dispose();
});

test('five actions reset first, remain mutually exclusive and reproduce exact phase state', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  const actions = [
    'alab-transfer',
    'primegen-queue',
    'oxygen-status',
    'cloud-remote-sync',
    'cloud-handheld-frame',
  ];

  for (const id of actions) {
    applyDeviceAction(world.actionController, { id, phase: 0.625 });
    const first = snapshotDeviceActions(world.actionController);
    applyDeviceAction(world.actionController, { id, phase: 0.625 });
    const second = snapshotDeviceActions(world.actionController);
    assert.deepEqual(second, first);
    assert.equal(first.activeAction, id);
    assert.equal(first.actions.filter(({ active }) => active).length, 1);
    assert.equal(first.actions.find(({ id: candidate }) => candidate === id).phase, 0.625);
  }

  applyDeviceAction(world.actionController, null);
  const reset = snapshotDeviceActions(world.actionController);
  assert.equal(reset.activeAction, null);
  assert.ok(reset.actions.every(({ active, phase }) => !active && phase === 0));
  world.dispose();
});

test('approved textures map to their physical screens', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  const makeTexture = () => {
    const texture = new THREE.Texture({ width: 16, height: 16 });
    texture.generateMipmaps = false;
    texture.userData.gpuBytes = 1024;
    return texture;
  };
  const textures = new Map([
    ['physical-integrated-screen', makeTexture()],
    ['physical-control-console', makeTexture()],
    ['physical-dual-monitor-workstation', makeTexture()],
    ['semantic-foreground-phone-or-tablet', makeTexture()],
  ]);

  applyMappedTextures(world, textures);
  assert.equal(world.screens['physical-integrated-screen'].material.map, textures.get('physical-integrated-screen'));
  assert.equal(world.screens['physical-control-console'].material.map, textures.get('physical-control-console'));
  assert.equal(world.screens['physical-dual-monitor-workstation'].material.map, textures.get('physical-dual-monitor-workstation'));
  assert.equal(world.screens['semantic-foreground-phone-or-tablet'].material.map, textures.get('semantic-foreground-phone-or-tablet'));
  assert.equal('semantic-foreground-phone' in world.screens, false);
  world.dispose();
});

test('DOM measurements use every real selector and absolute document position', () => {
  const elements = new Map(SCENE_STOPS.map((stop, index) => [stop.selector, {
    getBoundingClientRect: () => ({ top: 100 + index * 900, height: 420 }),
  }]));
  const documentRef = { querySelector: (selector) => elements.get(selector) ?? null };
  const metrics = measureSceneStopMetrics(documentRef, 250);

  assert.deepEqual(metrics.map(({ id }) => id), SCENE_STOPS.map(({ id }) => id));
  assert.deepEqual(metrics.map(({ top }) => top), SCENE_STOPS.map((_, index) => 350 + index * 900));
  assert.ok(metrics.every(({ height }) => height === 420));
  assert.throws(() => measureSceneStopMetrics({ querySelector: () => null }, 0), /scene stop.*not found/i);
});

test('computed root scroll padding aligns hash landings with scene activation without changing measurement defaults', () => {
  const documentElement = {};
  const elements = new Map(SCENE_STOPS.map((stop, index) => [stop.selector, {
    getBoundingClientRect: () => ({ top: 100 + index * 900, height: 420 }),
  }]));
  const documentRef = {
    documentElement,
    querySelector: (selector) => elements.get(selector) ?? null,
  };
  const activationOffset = getSceneActivationOffset(
    documentRef,
    (element) => {
      assert.equal(element, documentElement);
      return { scrollPaddingTop: '113.5px' };
    },
  );

  assert.equal(activationOffset, 113.5);
  assert.equal(getSceneActivationOffset(documentRef, () => ({ scrollPaddingTop: 'normal' })), 0);
  assert.deepEqual(
    measureSceneStopMetrics(documentRef, 250).map(({ top }) => top),
    SCENE_STOPS.map((_, index) => 350 + index * 900),
    'the public measurement helper must keep its zero-offset default',
  );

  const metrics = measureSceneStopMetrics(documentRef, 250, activationOffset);
  assert.deepEqual(
    metrics.map(({ top }) => top),
    SCENE_STOPS.map((_, index) => 236.5 + index * 900),
  );
  const timeline = buildSceneTimeline(metrics, 900);
  metrics.forEach((metric) => {
    assert.equal(
      evaluateSceneTimeline(metric.top, timeline).activeStopId,
      metric.id,
      `the ${metric.id} hash landing must activate its matching camera stop`,
    );
  });
});

test('layout invalidation observes every stable stop and cleans locale, image-load and resize hooks', () => {
  class ListenerHub {
    constructor() {
      this.listeners = [];
    }

    addEventListener(type, listener, options) {
      this.listeners.push({ type, listener, options });
    }

    removeEventListener(type, listener, options) {
      this.listeners = this.listeners.filter((entry) => (
        entry.type !== type || entry.listener !== listener || entry.options !== options
      ));
    }

    emit(type, event = {}) {
      this.listeners.filter((entry) => entry.type === type).forEach(({ listener }) => listener(event));
    }

    listenerCount(type) {
      return this.listeners.filter((entry) => entry.type === type).length;
    }
  }

  class ResizeObserverStub {
    constructor(callback) {
      this.callback = callback;
      this.observed = [];
      this.disconnected = false;
    }

    observe(element) {
      this.observed.push(element);
    }

    disconnect() {
      this.disconnected = true;
    }
  }

  const documentRef = new ListenerHub();
  const windowRef = new ListenerHub();
  const body = { id: 'body' };
  const stopElements = SCENE_STOPS.map(({ id }) => ({ id }));
  documentRef.body = body;
  let invalidations = 0;
  const controller = createSceneLayoutInvalidation({
    documentRef,
    windowRef,
    elements: [body, ...stopElements, stopElements[4]],
    onInvalidate: () => { invalidations += 1; },
    ResizeObserverClass: ResizeObserverStub,
  });

  assert.equal(windowRef.listenerCount('portfolio:localechange'), 1);
  assert.equal(documentRef.listenerCount('load'), 1);
  assert.deepEqual(controller.resizeObserver.observed, [body, ...stopElements]);
  assert.equal(documentRef.listeners.find(({ type }) => type === 'load').options, true);

  documentRef.emit('load', { target: { tagName: 'DIV' } });
  assert.equal(invalidations, 0, 'non-image capture events do not invalidate layout');
  documentRef.emit('load', { target: { tagName: 'IMG' } });
  windowRef.emit('portfolio:localechange');
  controller.resizeObserver.callback();
  assert.equal(invalidations, 3);

  controller.dispose();
  assert.equal(controller.resizeObserver.disconnected, true);
  assert.equal(windowRef.listenerCount('portfolio:localechange'), 0);
  assert.equal(documentRef.listenerCount('load'), 0);
  documentRef.emit('load', { target: { tagName: 'IMG' } });
  windowRef.emit('portfolio:localechange');
  assert.equal(invalidations, 3);
});

test('context lifecycle falls back, restores the same runtime, and removes listeners on cleanup', () => {
  const canvas = new EventTarget();
  const calls = [];
  const lifecycle = createContextLifecycle({
    canvas,
    onFallback: (reason) => calls.push(`fallback:${reason}`),
    onRestore: () => calls.push('restore'),
  });
  lifecycle.start();

  const lost = new Event('webglcontextlost', { cancelable: true });
  canvas.dispatchEvent(lost);
  assert.equal(lost.defaultPrevented, true);
  assert.equal(lifecycle.state, 'context-lost');
  canvas.dispatchEvent(new Event('webglcontextrestored'));
  assert.equal(lifecycle.state, 'active');
  assert.deepEqual(calls, ['fallback:context-lost', 'restore']);

  lifecycle.stop();
  canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
  assert.deepEqual(calls, ['fallback:context-lost', 'restore']);
  assert.equal(lifecycle.state, 'stopped');
});

test('preserved laboratory runtime creates one scene, camera and world and wires deterministic lifecycle events', async () => {
  const scene = await read('scene.js');

  assert.equal((scene.match(/new THREE\.Scene\s*\(/g) ?? []).length, 1);
  assert.equal((scene.match(/new THREE\.PerspectiveCamera\s*\(/g) ?? []).length, 1);
  assert.equal((scene.match(/createLaboratoryWorld\s*\(/g) ?? []).length, 1);
  assert.match(scene, /buildSceneTimeline\(metrics, windowRef\.innerHeight\)/);
  assert.match(scene, /evaluateSceneTimeline\(windowRef\.scrollY, timeline/);
  assert.match(scene, /listen\(documentRef, 'scroll', requestRender/);
  assert.doesNotMatch(scene, /window\.addEventListener\('scroll'/);
  assert.match(scene, /pageshow/);
  assert.match(scene, /hashchange/);
  assert.match(scene, /orientationchange/);
  assert.match(scene, /webglcontextlost/);
  assert.match(scene, /webglcontextrestored/);
  assert.match(scene, /event\.persisted/);
  for (const datasetKey of [
    'worldId',
    'sceneState',
    'activeSceneStop',
    'activeAction',
    'progress',
    'cameraPosition',
    'cameraForward',
    'cameraTarget',
    'cameraRoll',
    'triangles',
    'drawables',
    'geometries',
    'materials',
    'transparentDrawables',
    'textureBytes',
    'semanticRoles',
    'budget',
    'withinBudget',
  ]) {
    assert.match(scene, new RegExp(`\\b${datasetKey}:`), `dataset ${datasetKey} must publish`);
  }
  assert.match(scene, /emitFallback\('initialization-failed'\)/);
  assert.match(scene, /cleanupCallbacks\.splice\(0\)\.forEach/);
  assert.match(scene, /world\.dispose\(\)/);
  assert.match(scene, /renderer\.dispose\(\)/);
});
