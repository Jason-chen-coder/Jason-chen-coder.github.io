import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const sourceUrl = new URL('../scene-model.js', import.meta.url);

async function loadSceneModel() {
  const source = await readFile(sourceUrl, 'utf8');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}

const STOP_IDS = [
  'top',
  'about',
  'alab',
  'primegen',
  'oxygen',
  'cloud-remote',
  'cloud-handheld',
  'craft',
  'experience',
  'contact',
];

function createMetrics({ spacing = 1000, height = 500 } = {}) {
  return STOP_IDS.map((id, index) => ({ id, top: index * spacing, height }));
}

test('scene exposes exactly ten ordered stable stops with unique DOM selectors', async () => {
  const model = await loadSceneModel();
  const { CAMERA_POSES, SCENE_STOPS } = model;

  assert.equal('SCENE_ACTION_IDS' in model, false);
  assert.deepEqual(SCENE_STOPS.map(({ id }) => id), STOP_IDS);
  assert.equal(CAMERA_POSES.length, STOP_IDS.length);
  assert.deepEqual(CAMERA_POSES, SCENE_STOPS.map(({ pose }) => pose));
  assert.equal(new Set(SCENE_STOPS.map(({ selector }) => selector)).size, STOP_IDS.length);
  assert.deepEqual(
    SCENE_STOPS.filter(({ id }) => id.startsWith('cloud')).map(({ id }) => id),
    ['cloud-remote', 'cloud-handheld'],
  );
  assert.ok(SCENE_STOPS.every(Object.isFrozen), 'stable stop definitions must not be mutable');
  assert.ok(CAMERA_POSES.every(Object.isFrozen), 'stable camera poses must not be mutable');
  const oxygenPose = SCENE_STOPS.find(({ id }) => id === 'oxygen').pose;
  assert.deepEqual(oxygenPose.position, [-5.8, 1.65, -2.4]);
  assert.deepEqual(oxygenPose.target, [-5.8, 1.65, -8.985]);
  SCENE_STOPS.forEach(({ pose }) => {
    assert.equal(pose.target[1], pose.position[1]);
    assert.deepEqual(pose.forward, [0, 0, -1]);
  });
});

test('timeline uses ordered DOM metrics and reserves a 35vh hold for every stop', async () => {
  const { buildSceneTimeline } = await loadSceneModel();
  const viewportHeight = 1000;
  const timeline = buildSceneTimeline(createMetrics(), viewportHeight);

  assert.equal(timeline.stops.length, STOP_IDS.length);
  assert.deepEqual(timeline.stops.map(({ id }) => id), STOP_IDS);
  for (const stop of timeline.stops) {
    assert.equal(stop.holdEnd - stop.holdStart, 350);
    assert.ok(stop.metricHeight >= stop.holdEnd - stop.holdStart);
  }

  for (let index = 1; index < timeline.stops.length; index += 1) {
    const previous = timeline.stops[index - 1];
    const current = timeline.stops[index];
    assert.ok(current.metricTop > previous.metricTop);
    assert.ok(current.holdStartProgress > previous.holdStartProgress);
    assert.ok(current.holdEndProgress > previous.holdEndProgress);
    assert.ok(current.poseProgress > previous.poseProgress);
  }
});

test('timeline rejects DOM metrics whose source order is invalid instead of sorting them', async () => {
  const { buildSceneTimeline } = await loadSceneModel();
  const outOfOrder = createMetrics();
  [outOfOrder[3].top, outOfOrder[4].top] = [outOfOrder[4].top, outOfOrder[3].top];

  assert.throws(
    () => buildSceneTimeline(outOfOrder, 1000),
    /strictly increasing/i,
  );
  assert.throws(
    () => buildSceneTimeline(createMetrics({ height: 348 }), 1000),
    /35vh/i,
  );
});

test('detail profiles use laboratory semantics and exact geometry ceilings', async () => {
  const { SCENE_DETAIL_PROFILES, getSceneDetailProfile } = await loadSceneModel();
  const expected = {
    high: { maxTriangles: 110000, maxDrawables: 180, maxGeometries: 48, maxMaterials: 20 },
    balanced: { maxTriangles: 65000, maxDrawables: 140, maxGeometries: 40, maxMaterials: 20 },
    low: { maxTriangles: 35000, maxDrawables: 110, maxGeometries: 32, maxMaterials: 20 },
  };

  for (const [tier, limits] of Object.entries(expected)) {
    const profile = getSceneDetailProfile(tier);
    assert.equal(profile, SCENE_DETAIL_PROFILES[tier]);
    assert.ok(profile.laboratory, `${tier} must expose laboratory detail controls`);
    assert.deepEqual(profile.budget, limits);
    assert.equal('minTriangles' in profile.budget, false);
    for (const gardenKey of ['temple', 'torii', 'trees', 'stairs', 'lanterns']) {
      assert.equal(gardenKey in profile, false, `${tier} must not retain ${gardenKey} controls`);
    }
  }
  assert.equal(getSceneDetailProfile('unknown'), SCENE_DETAIL_PROFILES.low);
});

test('performance profiles expose only generic rendering controls without garden counts', async () => {
  const { getPerformanceProfile } = await loadSceneModel();
  const profiles = [
    getPerformanceProfile({ width: 1440, hardwareConcurrency: 8 }),
    getPerformanceProfile({ width: 390, hardwareConcurrency: 8 }),
    getPerformanceProfile({ width: 1440, hardwareConcurrency: 8, reducedMotion: true }),
  ];

  for (const profile of profiles) {
    assert.deepEqual(
      Object.keys(profile).sort(),
      ['animate', 'detailTier', 'dpr', 'tier'],
    );
    for (const gardenField of ['bloom', 'rainCount', 'leafCount', 'emberCount', 'treeCount']) {
      assert.equal(gardenField in profile, false);
    }
  }
});

test('generic model helpers remain compatible for current scene consumers', async () => {
  const {
    CAMERA_POSES,
    clamp01,
    getPerformanceProfile,
    getSceneDetailProfile,
    interpolateCamera,
  } = await loadSceneModel();
  const poses = [
    {
      position: [0, 2, 10],
      forward: [0, 0, -1],
      target: [0, 2, 0],
      focusDistance: 10,
      fov: 40,
      roll: 0,
    },
    {
      position: [10, 6, -10],
      forward: [0, 0, -1],
      target: [10, 6, -20],
      focusDistance: 10,
      fov: 50,
      roll: 0,
    },
  ];

  assert.equal(clamp01(-1), 0);
  assert.equal(clamp01(2), 1);
  assert.deepEqual(interpolateCamera(-1, poses), poses[0]);
  assert.deepEqual(interpolateCamera(2, poses), poses[1]);
  assert.deepEqual(interpolateCamera(0.5, poses), {
    position: [5, 4, 0],
    forward: [0, 0, -1],
    target: [5, 4, -10],
    focusDistance: 10,
    fov: 45,
    roll: 0,
  });
  const advancingPositiveZ = poses.map((pose, index) => ({
    ...pose,
    position: [0, 2, index * 10],
    target: [0, 2, index * 10 - 10],
  }));
  assert.deepEqual(interpolateCamera(0, advancingPositiveZ).position, [0, 2, 0]);
  assert.deepEqual(interpolateCamera(0.5, advancingPositiveZ).position, [0, 2, 5]);
  assert.deepEqual(interpolateCamera(1, advancingPositiveZ).position, [0, 2, 10]);
  assert.deepEqual(interpolateCamera(0.5, CAMERA_POSES), interpolateCamera(0.5));
  assert.equal(getSceneDetailProfile('missing').tier, 'low');
  assert.equal(getPerformanceProfile({ reducedMotion: true }).animate, false);
});

test('camera interpolation fails fast on malformed geometry and lens metadata', async () => {
  const { interpolateCamera } = await loadSceneModel();
  const validPose = {
    position: [0, 1.65, 0],
    forward: [0, 0, -1],
    target: [0, 1.65, -6],
    focusDistance: 6,
    fov: 45,
    roll: 0,
  };
  const invalidCases = [
    {
      pose: { ...validPose, position: [0, 1.65] },
      error: { name: 'TypeError', message: 'camera pose 0 position must contain exactly three finite numbers' },
    },
    {
      pose: { ...validPose, position: [0, Infinity, 0] },
      error: { name: 'TypeError', message: 'camera pose 0 position must contain exactly three finite numbers' },
    },
    {
      pose: { ...validPose, forward: [0, -1] },
      error: { name: 'TypeError', message: 'camera pose 0 forward must contain exactly three finite numbers' },
    },
    {
      pose: { ...validPose, forward: [0, Number.NaN, -1] },
      error: { name: 'TypeError', message: 'camera pose 0 forward must contain exactly three finite numbers' },
    },
    {
      pose: { ...validPose, forward: [0, 0, 0] },
      error: { name: 'RangeError', message: 'camera pose 0 forward must be non-zero' },
    },
    {
      pose: { ...validPose, target: [0] },
      error: { name: 'TypeError', message: 'camera pose 0 target must contain exactly three finite numbers' },
    },
    {
      pose: { ...validPose, target: [0, Number.NaN, -6] },
      error: { name: 'TypeError', message: 'camera pose 0 target must contain exactly three finite numbers' },
    },
    {
      pose: { ...validPose, target: [...validPose.position] },
      error: { name: 'RangeError', message: 'camera pose 0 target must differ from position' },
    },
    {
      pose: { ...validPose, fov: Number.NaN },
      error: { name: 'TypeError', message: 'camera pose 0 fov must be finite' },
    },
    {
      pose: { ...validPose, fov: 0 },
      error: { name: 'RangeError', message: 'camera pose 0 fov must be between 0 and 180 degrees' },
    },
    {
      pose: { ...validPose, fov: 180 },
      error: { name: 'RangeError', message: 'camera pose 0 fov must be between 0 and 180 degrees' },
    },
    {
      pose: { ...validPose, roll: Number.POSITIVE_INFINITY },
      error: { name: 'TypeError', message: 'camera pose 0 roll must be finite' },
    },
  ];

  for (const { pose, error } of invalidCases) {
    assert.throws(() => interpolateCamera(0.5, [pose]), error);
  }
  assert.doesNotThrow(() => interpolateCamera(0.5));
});
