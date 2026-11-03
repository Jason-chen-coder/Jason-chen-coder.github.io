import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import * as THREE from '../assets/vendor/three/three.module.min.js';
import { createLaboratoryWorld } from '../lab-world.js';
import { responsiveConfigForViewport } from '../scene.js';

const sourceUrl = new URL('../scene-model.js', import.meta.url);

async function loadSceneModel() {
  const source = await readFile(sourceUrl, 'utf8');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}

function distance(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function angleDegrees(a, b) {
  const dot = Math.max(-1, Math.min(1, a.reduce((sum, value, index) => sum + value * b[index], 0)));
  return Math.acos(dot) * 180 / Math.PI;
}

function segmentIntersectsExpandedAabb(start, end, collider, radius) {
  let near = 0;
  let far = 1;

  for (let axis = 0; axis < 3; axis += 1) {
    const minimum = collider.min[axis] - radius;
    const maximum = collider.max[axis] + radius;
    const delta = end[axis] - start[axis];
    if (Math.abs(delta) < 1e-9) {
      if (start[axis] < minimum || start[axis] > maximum) return false;
      continue;
    }

    let axisNear = (minimum - start[axis]) / delta;
    let axisFar = (maximum - start[axis]) / delta;
    if (axisNear > axisFar) [axisNear, axisFar] = [axisFar, axisNear];
    near = Math.max(near, axisNear);
    far = Math.min(far, axisFar);
    if (near > far) return false;
  }

  return true;
}

function objectByRole(root, role) {
  let result = null;
  root.traverse((object) => {
    if (!result && object.userData.semanticRole === role) result = object;
  });
  return result;
}

function assertFrontFacing(pose, label) {
  assert.ok(Math.abs(pose.position[0] - pose.target[0]) <= 1e-9, `${label} camera and target x`);
  assert.ok(Math.abs(pose.position[1] - pose.target[1]) <= 1e-9, `${label} camera and target y`);
  assert.ok(pose.target[2] < pose.position[2], `${label} target must be deeper on -Z`);
  assert.ok(Math.abs(pose.forward[0]) <= 1e-9, `${label} forward x`);
  assert.ok(Math.abs(pose.forward[1]) <= 1e-9, `${label} forward y`);
  assert.ok(Math.abs(pose.forward[2] + 1) <= 1e-9, `${label} forward z`);
}

test('timeline accepts CSS subpixel rounding up to 1px without shortening or overlapping holds', async () => {
  const { SCENE_STOPS, buildSceneTimeline } = await loadSceneModel();
  const viewportHeight = 844;
  const nominalHoldHeight = viewportHeight * 0.35;
  const cssRoundedHeight = 295.3984375;
  const metricsWithHeight = (height) => SCENE_STOPS.map((stop, index) => ({
    id: stop.id,
    top: index * 400,
    height,
  }));

  assert.ok(nominalHoldHeight > cssRoundedHeight);
  assert.ok(nominalHoldHeight - cssRoundedHeight <= 1);

  const timeline = buildSceneTimeline(metricsWithHeight(cssRoundedHeight), viewportHeight);
  timeline.stops.forEach((stop, index) => {
    assert.ok(Math.abs(stop.holdEnd - stop.holdStart - nominalHoldHeight) <= 1e-9);
    const next = timeline.stops[index + 1];
    if (next) assert.ok(stop.holdEnd < next.holdStart);
  });

  assert.doesNotThrow(() => buildSceneTimeline(metricsWithHeight(nominalHoldHeight - 1), viewportHeight));
  assert.throws(
    () => buildSceneTimeline(metricsWithHeight(nominalHoldHeight - 2), viewportHeight),
    /must provide at least a 35vh hold/,
  );
});

test('timeline activates native hash landings within the one-pixel DOM rounding tolerance', async () => {
  const { SCENE_STOPS, buildSceneTimeline, evaluateSceneTimeline } = await loadSceneModel();
  const viewportHeight = 844;
  const metrics = SCENE_STOPS.map((stop, index) => ({
    id: stop.id,
    top: index * 400 + 0.75,
    height: viewportHeight * 0.35,
  }));
  const timeline = buildSceneTimeline(metrics, viewportHeight);
  const target = timeline.stops[5];
  const previous = timeline.stops[4];

  assert.equal(target.metricTop - target.holdStart, 0.75);
  assert.equal(evaluateSceneTimeline(target.holdStart, timeline).activeStopId, target.id);
  assert.equal(evaluateSceneTimeline(target.holdStart - 2, timeline).activeStopId, null);
  assert.equal(evaluateSceneTimeline(target.holdStart, timeline, { reducedMotion: true }).activeStopId, target.id);
  assert.equal(evaluateSceneTimeline(target.holdStart - 2, timeline, { reducedMotion: true }).activeStopId, previous.id);
});

test('subpixel Cloud transitions are not swallowed by hash landing normalization', async () => {
  const { SCENE_STOPS, buildSceneTimeline, evaluateSceneTimeline } = await loadSceneModel();
  const viewportHeight = 844;
  const cssRoundedHeight = 295.3984375;
  const metrics = SCENE_STOPS.map((stop, index) => ({
    id: stop.id,
    top: index * 500 + 0.25,
    height: cssRoundedHeight,
  }));
  const remoteIndex = SCENE_STOPS.findIndex(({ id }) => id === 'cloud-remote');
  metrics[remoteIndex + 1].top = metrics[remoteIndex].top + cssRoundedHeight + 1;
  for (let index = remoteIndex + 2; index < metrics.length; index += 1) {
    metrics[index].top = metrics[index - 1].top + 500;
  }

  const timeline = buildSceneTimeline(metrics, viewportHeight);
  const remote = timeline.stops[remoteIndex];
  const handheld = timeline.stops[remoteIndex + 1];
  const transitionStart = evaluateSceneTimeline(remote.holdEnd + 0.0001, timeline);
  const transitionEnd = evaluateSceneTimeline(handheld.holdStart - 0.0001, timeline);

  assert.ok(handheld.holdStart > remote.holdEnd, 'the rounded CSS metrics must retain a transition interval');
  assert.equal(transitionStart.activeStopId, null);
  assert.equal(transitionEnd.activeStopId, null);
  assert.ok(distance(transitionStart.camera.position, remote.pose.position) < 0.01);
  assert.ok(distance(transitionEnd.camera.position, handheld.pose.position) < 0.01);
});

test('responsive timeline reuses one resolved pose sequence for holds, transitions and reduced motion', async () => {
  const {
    SCENE_STOPS,
    buildSceneTimeline,
    evaluateSceneTimeline,
    interpolateCamera,
  } = await loadSceneModel();
  const transitions = [
    ['about', 'alab'],
    ['primegen', 'oxygen'],
  ];

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 360, height: 800 },
  ]) {
    const responsiveConfig = responsiveConfigForViewport(viewport.width, viewport.height);
    const metrics = SCENE_STOPS.map((stop, index) => ({
      id: stop.id,
      top: index * viewport.height,
      height: viewport.height,
    }));
    const timeline = buildSceneTimeline(metrics, viewport.height);
    const resolvedPoses = SCENE_STOPS.map((_, index) => (
      interpolateCamera(index / (SCENE_STOPS.length - 1), undefined, responsiveConfig)
    ));
    const before = evaluateSceneTimeline(timeline.start - 1, timeline, { responsiveConfig });
    const after = evaluateSceneTimeline(timeline.end + 1, timeline, { responsiveConfig });
    const reducedBefore = evaluateSceneTimeline(timeline.start - 1, timeline, {
      responsiveConfig,
      reducedMotion: true,
    });
    const reducedAfter = evaluateSceneTimeline(timeline.end + 1, timeline, {
      responsiveConfig,
      reducedMotion: true,
    });

    assert.deepEqual(before.camera, resolvedPoses[0], `${viewport.width} before timeline`);
    assert.deepEqual(after.camera, resolvedPoses.at(-1), `${viewport.width} after timeline`);
    assert.deepEqual(reducedBefore.camera, resolvedPoses[0], `${viewport.width} reduced before timeline`);
    assert.deepEqual(reducedAfter.camera, resolvedPoses.at(-1), `${viewport.width} reduced after timeline`);

    for (const [startId, endId] of transitions) {
      const startIndex = SCENE_STOPS.findIndex(({ id }) => id === startId);
      const start = timeline.stops[startIndex];
      const end = timeline.stops[startIndex + 1];
      assert.equal(end.id, endId);

      const options = { responsiveConfig };
      const startHold = evaluateSceneTimeline(start.holdEnd, timeline, options);
      const endHold = evaluateSceneTimeline(end.holdStart, timeline, options);
      const reducedStart = evaluateSceneTimeline(start.holdEnd, timeline, {
        ...options,
        reducedMotion: true,
      });
      const reducedEnd = evaluateSceneTimeline(end.holdStart, timeline, {
        ...options,
        reducedMotion: true,
      });
      const transitionOffset = Math.min(0.01, (end.holdStart - start.holdEnd) / 1000);
      const transitionStart = evaluateSceneTimeline(start.holdEnd + transitionOffset, timeline, options);
      const transitionEnd = evaluateSceneTimeline(end.holdStart - transitionOffset, timeline, options);

      assert.deepEqual(startHold.camera, resolvedPoses[startIndex], `${viewport.width} ${startId} hold`);
      assert.deepEqual(endHold.camera, resolvedPoses[startIndex + 1], `${viewport.width} ${endId} hold`);
      assert.deepEqual(reducedStart.camera, resolvedPoses[startIndex], `${viewport.width} ${startId} reduced motion`);
      assert.deepEqual(reducedEnd.camera, resolvedPoses[startIndex + 1], `${viewport.width} ${endId} reduced motion`);
      assert.equal(transitionStart.activeStopId, null);
      assert.equal(transitionEnd.activeStopId, null);
      assert.ok(
        distance(transitionStart.camera.position, startHold.camera.position) < 0.001,
        `${viewport.width} ${startId}->${endId} transition first frame must not jump`,
      );
      assert.ok(
        distance(transitionEnd.camera.position, endHold.camera.position) < 0.001,
        `${viewport.width} ${startId}->${endId} transition last frame must stay continuous`,
      );
      assert.ok(
        transitionStart.camera.position[2] < startHold.camera.position[2],
        `${viewport.width} ${startId}->${endId} transition must immediately advance into the lab`,
      );
    }
  }
});

test('laboratory colliders tightly contain the real High-tier static equipment bounds', async () => {
  const { LAB_COLLIDERS } = await loadSceneModel();
  const world = createLaboratoryWorld({ detailTier: 'high' });
  world.root.updateMatrixWorld(true);
  const colliderById = new Map(LAB_COLLIDERS.map((collider) => [collider.id, collider]));
  const equipment = [
    ['alab-equipment', ['alab-enclosure', 'alab-robot-arm', 'alab-sample-carrier', 'alab-sample-rack', 'alab-analyzer']],
    ['primegen-equipment', ['primegen-planning-console', 'primegen-planning-screen', 'primegen-queue-row', 'primegen-instrument-row', 'primegen-sample-flow']],
    ['oxygen-chamber', ['oxygen-rounded-shell', 'oxygen-generator', 'oxygen-hose', 'oxygen-touch-console']],
    ['cloud-remote-equipment', ['cloud-remote-device-end', 'cloud-remote-consultation-end', 'cloud-remote-sync-line']],
    ['cloud-handheld-equipment', ['cloud-handheld-station']],
  ];
  const violations = [];

  for (const [colliderId, roles] of equipment) {
    const collider = colliderById.get(colliderId);
    assert.ok(collider, `missing collider ${colliderId}`);
    const actual = new THREE.Box3();
    for (const role of roles) {
      const object = objectByRole(world.root, role);
      assert.ok(object, `missing collider source role ${role}`);
      actual.expandByObject(object, true);
    }
    const actualMin = actual.min.toArray();
    const actualMax = actual.max.toArray();
    const lowerMargins = actualMin.map((value, axis) => value - collider.min[axis]);
    const upperMargins = collider.max.map((value, axis) => value - actualMax[axis]);
    const marginsAreTight = [...lowerMargins, ...upperMargins]
      .every((margin) => margin >= 0.05 - 1e-9 && margin <= 0.15 + 1e-9);
    if (!marginsAreTight) {
      violations.push(
        `${colliderId}: actual min=${actualMin.map((value) => value.toFixed(3)).join(',')} max=${actualMax.map((value) => value.toFixed(3)).join(',')}; collider min=${collider.min.join(',')} max=${collider.max.join(',')}`,
      );
    }
  }

  world.dispose();
  assert.equal(violations.length, 0, `collider bounds are not real-equipment-tight:\n${violations.join('\n')}`);
});

test('camera keeps advancing through a visibly extended laboratory', async () => {
  const { CAMERA_POSES } = await loadSceneModel();

  for (const pose of CAMERA_POSES) assertFrontFacing(pose, pose.stopId);
  for (let index = 1; index < CAMERA_POSES.length; index += 1) {
    assert.ok(
      CAMERA_POSES[index].position[2] < CAMERA_POSES[index - 1].position[2],
      `${CAMERA_POSES[index - 1].stopId} -> ${CAMERA_POSES[index].stopId} must continue deeper into the lab`,
    );
  }

  const routeDepth = CAMERA_POSES[0].position[2] - CAMERA_POSES.at(-1).position[2];
  assert.ok(routeDepth >= 45, `camera route must span at least 45m, received ${routeDepth.toFixed(2)}m`);

  const world = createLaboratoryWorld({ detailTier: 'high' });
  world.root.updateMatrixWorld(true);
  const floor = objectByRole(world.root, 'laboratory-floor');
  const leftWall = objectByRole(world.root, 'laboratory-left-shell');
  assert.ok(floor && leftWall, 'extended route requires a continuous physical shell');
  const floorDepth = new THREE.Box3().setFromObject(floor).getSize(new THREE.Vector3()).z;
  const wallDepth = new THREE.Box3().setFromObject(leftWall).getSize(new THREE.Vector3()).z;
  world.dispose();

  assert.ok(floorDepth >= 55, `laboratory floor must span at least 55m, received ${floorDepth.toFixed(2)}m`);
  assert.ok(wallDepth >= 55, `laboratory walls must span at least 55m, received ${wallDepth.toFixed(2)}m`);
});

test('authored camera route is continuous, fixed-height and deterministic at 0.01 progress samples', async () => {
  const { interpolateCamera } = await loadSceneModel();
  const samples = Array.from({ length: 101 }, (_, index) => interpolateCamera(index / 100));

  for (const sample of samples) {
    assert.equal(sample.position[1], 1.65);
    assert.equal(sample.target[1], sample.position[1]);
    assert.ok(Math.abs(sample.forward[1]) <= 1e-9, 'camera pitch must stay level');
    assert.equal(sample.roll, 0);
    assert.ok(sample.position[0] >= -5.8 && sample.position[0] <= 6.075, 'camera must stay inside the laboratory shell');
  }

  for (let index = 1; index < samples.length; index += 1) {
    assert.ok(distance(samples[index - 1].position, samples[index].position) <= 1.5 + 1e-9);
    assert.ok(angleDegrees(samples[index - 1].forward, samples[index].forward) <= 20 + 1e-9);
  }

  assert.deepEqual(interpolateCamera(0.537), interpolateCamera(0.537));
  const responsive = { lateralScale: 0.75 };
  assert.deepEqual(interpolateCamera(0.537, undefined, responsive), interpolateCamera(0.537, undefined, responsive));
  assert.equal(interpolateCamera(0.537, undefined, responsive).position[1], 1.65);
});

test('route advances to the far end and a 0.35m capsule sweep clears static lab colliders', async () => {
  const { CAMERA_POSES, LAB_COLLIDERS, interpolateCamera } = await loadSceneModel();
  assert.ok(LAB_COLLIDERS.length > 0, 'collision sweep requires authored static lab colliders');
  const colliderIds = new Set(LAB_COLLIDERS.map(({ id }) => id));
  for (const requiredId of [
    'alab-equipment',
    'primegen-equipment',
    'oxygen-chamber',
    'cloud-remote-equipment',
    'cloud-handheld-equipment',
  ]) {
    assert.ok(colliderIds.has(requiredId), `missing required collider ${requiredId}`);
  }
  assert.ok(LAB_COLLIDERS.some(({ max }) => max[0] < 0), 'left project bays need collision coverage');
  assert.ok(LAB_COLLIDERS.some(({ min }) => min[0] > 0), 'right project bays need collision coverage');

  const routeDepth = CAMERA_POSES[0].position[2] - CAMERA_POSES.at(-1).position[2];
  assert.ok(routeDepth >= 45);

  const samples = Array.from({ length: 101 }, (_, index) => interpolateCamera(index / 100).position);
  for (let index = 1; index < samples.length; index += 1) {
    for (const collider of LAB_COLLIDERS) {
      assert.equal(
        segmentIntersectsExpandedAabb(samples[index - 1], samples[index], collider, 0.35),
        false,
        `camera capsule intersects ${collider.id} between samples ${index - 1} and ${index}`,
      );
    }
  }
});

test('all four viewport routes preserve level deterministic clearance and professional FOV', async () => {
  const { LAB_COLLIDERS, SCENE_STOPS, interpolateCamera } = await loadSceneModel();
  const viewports = [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 390, height: 844 },
    { width: 360, height: 800 },
  ];

  for (const viewport of viewports) {
    const config = responsiveConfigForViewport(viewport.width, viewport.height);
    assert.deepEqual(config, responsiveConfigForViewport(viewport.width, viewport.height));
    const metrics = SCENE_STOPS.map((stop, index) => ({
      id: stop.id,
      top: index * viewport.height,
      height: viewport.height,
    }));
    const { buildSceneTimeline, evaluateSceneTimeline } = await loadSceneModel();
    const timeline = buildSceneTimeline(metrics, viewport.height);
    const samples = Array.from(
      { length: 101 },
      (_, index) => interpolateCamera(index / 100, undefined, config),
    );
    SCENE_STOPS.forEach((stop, stopIndex) => {
      const configuredPose = interpolateCamera(stopIndex / (SCENE_STOPS.length - 1), undefined, config);
      const normalHold = evaluateSceneTimeline(timeline.stops[stopIndex].holdStart, timeline, { responsiveConfig: config });
      const reducedHold = evaluateSceneTimeline(timeline.stops[stopIndex].holdStart, timeline, {
        responsiveConfig: config,
        reducedMotion: true,
      });
      assert.deepEqual(configuredPose.target, stop.pose.target, `${stop.id} target must remain fixed`);
      assertFrontFacing(configuredPose, `${viewport.width}x${viewport.height} ${stop.id} interpolated hold`);
      assertFrontFacing(normalHold.camera, `${viewport.width}x${viewport.height} ${stop.id} timeline hold`);
      assertFrontFacing(reducedHold.camera, `${viewport.width}x${viewport.height} ${stop.id} reduced hold`);
      assert.deepEqual(normalHold.camera, configuredPose, `${stop.id} normal hold shares resolved pose`);
      assert.deepEqual(reducedHold.camera, configuredPose, `${stop.id} reduced hold shares resolved pose`);
      assert.equal(configuredPose.position[0], stop.pose.position[0], `${stop.id} keeps its authored lane`);
      assert.equal(configuredPose.position[1], stop.pose.position[1], `${stop.id} keeps its authored camera height`);
      assert.ok(configuredPose.position[2] >= stop.pose.position[2], `${stop.id} may only dolly toward the entrance`);
    });

    for (const sample of samples) {
      assert.equal(sample.position[1], 1.65, `${viewport.width}x${viewport.height} camera height`);
      assert.equal(sample.target[1], sample.position[1], `${viewport.width}x${viewport.height} eye-level target`);
      assert.ok(Math.abs(sample.forward[1]) <= 1e-9, `${viewport.width}x${viewport.height} level pitch`);
      assert.equal(sample.roll, 0, `${viewport.width}x${viewport.height} camera roll`);
      assert.ok(sample.fov >= 35 && sample.fov <= 70, `${viewport.width}x${viewport.height} professional FOV`);
      const targetOffset = sample.target.map((value, axis) => value - sample.position[axis]);
      const focusDistance = Math.hypot(...targetOffset);
      assert.ok(Math.abs(focusDistance - sample.focusDistance) <= 1e-9);
      targetOffset.forEach((value, axis) => {
        assert.ok(Math.abs(value / focusDistance - sample.forward[axis]) <= 1e-9);
      });
    }

    for (let index = 1; index < samples.length; index += 1) {
      assert.ok(
        distance(samples[index - 1].position, samples[index].position) <= 1.5 + 1e-9,
        `${viewport.width}x${viewport.height} position jump at ${index - 1}-${index}`,
      );
      assert.ok(
        angleDegrees(samples[index - 1].forward, samples[index].forward) <= 20 + 1e-9,
        `${viewport.width}x${viewport.height} angle jump at ${index - 1}-${index}`,
      );
      for (const collider of LAB_COLLIDERS) {
        assert.equal(
          segmentIntersectsExpandedAabb(
            samples[index - 1].position,
            samples[index].position,
            collider,
            0.35,
          ),
          false,
          `${viewport.width}x${viewport.height} camera capsule intersects ${collider.id} at ${index - 1}-${index}`,
        );
      }
    }

    for (let index = 1; index < samples.length; index += 1) {
      assert.ok(
        samples[index].position[2] < samples[index - 1].position[2],
        `${viewport.width}x${viewport.height} route must keep advancing at sample ${index}`,
      );
    }
    assert.ok(samples[0].position[2] - samples.at(-1).position[2] >= 45);
  }
});
