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

const ACTIONS = new Map([
  ['alab', 'alab-transfer'],
  ['primegen', 'primegen-queue'],
  ['oxygen', 'oxygen-status'],
  ['cloud-remote', 'cloud-remote-sync'],
  ['cloud-handheld', 'cloud-handheld-frame'],
]);

function createMetrics(scale = 1) {
  return STOP_IDS.map((id, index) => ({ id, top: index * 1000 * scale, height: 500 * scale }));
}

test('project bay ownership and Cloud continuity anchors encode one shared laboratory', async () => {
  const { PROJECT_BAYS, SCENE_STOPS } = await loadSceneModel();

  assert.ok(PROJECT_BAYS.alab.center[0] < 0);
  assert.ok(PROJECT_BAYS.oxygen.center[0] < 0);
  assert.ok(PROJECT_BAYS.primegen.center[0] > 0);
  assert.ok(PROJECT_BAYS.cloud.center[0] > 0);

  const remote = SCENE_STOPS.find(({ id }) => id === 'cloud-remote');
  const handheld = SCENE_STOPS.find(({ id }) => id === 'cloud-handheld');
  assert.equal(remote.bayId, PROJECT_BAYS.cloud.id);
  assert.equal(handheld.bayId, PROJECT_BAYS.cloud.id);
  assert.deepEqual(remote.anchorIds, handheld.anchorIds);
  assert.equal(remote.anchorIds.length, 3);
  assert.deepEqual(remote.anchorIds, [
    'cloud-floor-guide',
    'cloud-ceiling-rail',
    'cloud-project-sign',
  ]);
});

test('normal holds activate one deterministic project action and transitions activate none', async () => {
  const { buildSceneTimeline, evaluateSceneTimeline } = await loadSceneModel();
  const timeline = buildSceneTimeline(createMetrics(), 1000);
  const observedActions = [];

  for (const stop of timeline.stops) {
    const scrollY = (stop.holdStart + stop.holdEnd) / 2;
    const first = evaluateSceneTimeline(scrollY, timeline, { reducedMotion: false });
    const second = evaluateSceneTimeline(scrollY, timeline, { reducedMotion: false });
    assert.deepEqual(first, second);
    assert.equal(first.activeStopId, stop.id);
    assert.deepEqual(first.camera, stop.pose);

    const expectedAction = ACTIONS.get(stop.id);
    if (expectedAction) {
      assert.deepEqual(first.action, { id: expectedAction, phase: 0.5 });
      observedActions.push(first.action.id);
    } else {
      assert.equal(first.action, null);
    }
  }

  assert.deepEqual(observedActions, [...ACTIONS.values()]);
  for (let index = 0; index < timeline.stops.length - 1; index += 1) {
    const current = timeline.stops[index];
    const next = timeline.stops[index + 1];
    const transitionY = (current.holdEnd + next.holdStart) / 2;
    const state = evaluateSceneTimeline(transitionY, timeline, { reducedMotion: false });
    assert.equal(state.activeStopId, null);
    assert.equal(state.action, null);
  }
});

test('reduced motion and remeasured timelines snap directly to all ten poses with actions disabled', async () => {
  const { buildSceneTimeline, evaluateSceneTimeline } = await loadSceneModel();
  const timelines = [
    buildSceneTimeline(createMetrics(), 1000),
    buildSceneTimeline(createMetrics(1.4), 1400),
  ];

  for (const timeline of timelines) {
    for (const stop of [...timeline.stops].reverse()) {
      const state = evaluateSceneTimeline(stop.metricTop, timeline, { reducedMotion: true });
      assert.equal(state.activeStopId, stop.id);
      assert.deepEqual(state.camera, stop.pose);
      assert.equal(state.action, null);
      assert.equal(state.snapped, true);
    }
  }
});
