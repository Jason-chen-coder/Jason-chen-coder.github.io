import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  collectSceneStats,
  createLaboratoryWorld,
} from '../lab-world.js';
import { CAMERA_POSES, SCENE_STOPS } from '../scene-model.js';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

function objectsByRole(rootObject) {
  const result = new Map();
  rootObject.traverse((object) => {
    const role = object.userData.semanticRole;
    if (!role) return;
    const list = result.get(role) ?? [];
    list.push(object);
    result.set(role, list);
  });
  return result;
}

function isInFront(pose, point) {
  const offset = point.map((value, index) => value - pose.position[index]);
  return offset.reduce((sum, value, index) => sum + value * pose.forward[index], 0) > 0;
}

test('one continuous world links entrance, shared aisle, control hub and continuation corridor', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  const roles = objectsByRole(world.root);

  assert.equal(world.root.children.filter(({ userData }) => userData.worldPart === 'continuous-building').length, 1);
  for (const role of [
    'entrance-sign',
    'shared-axis-floor-guide',
    'main-ceiling-rail',
    'control-hub-sign',
    'continuation-corridor-floor-guide',
    'continuation-ceiling-rail',
    'continuation-glass-corridor',
    'laboratory-end-sign',
  ]) {
    assert.ok(roles.has(role), `missing continuity role ${role}`);
  }

  const entranceSign = roles.get('entrance-sign');
  const endSign = roles.get('laboratory-end-sign');
  assert.equal(entranceSign.length, 1);
  assert.equal(endSign.length, 1);
  const entrancePosition = entranceSign[0].getWorldPosition(entranceSign[0].position.clone()).toArray();
  const endPosition = endSign[0].getWorldPosition(endSign[0].position.clone()).toArray();
  assert.equal(isInFront(CAMERA_POSES[0], entrancePosition), true);
  assert.equal(isInFront(CAMERA_POSES.at(-1), entrancePosition), false);
  assert.equal(isInFront(CAMERA_POSES.at(-1), endPosition), true);
  world.dispose();
});

test('every authored continuity anchor resolves and Cloud sub-stops share one compound bay', () => {
  const world = createLaboratoryWorld({ detailTier: 'balanced' });
  const roles = objectsByRole(world.root);

  for (const stop of SCENE_STOPS) {
    for (const anchorId of stop.anchorIds) {
      assert.ok(roles.has(anchorId), `${stop.id} anchor ${anchorId} must resolve in the world`);
    }
  }

  for (const role of ['cloud-floor-guide', 'cloud-ceiling-rail', 'cloud-project-sign']) {
    assert.equal(roles.get(role)?.length, 1, `${role} must be physically shared`);
  }
  const compound = roles.get('cloud-compound-bay')[0];
  const descendantRoles = objectsByRole(compound);
  assert.ok(descendantRoles.has('cloud-remote-device-end'));
  assert.ok(descendantRoles.has('cloud-remote-consultation-end'));
  assert.ok(descendantRoles.has('cloud-handheld-stand'));
  assert.ok(descendantRoles.has('cloud-tablet'));
  world.dispose();
});

test('glass stays below two visibility layers and twenty transparent drawables', () => {
  for (const detailTier of ['high', 'balanced', 'low']) {
    const world = createLaboratoryWorld({ detailTier });
    const stats = collectSceneStats(world.root, { detailTier });
    assert.ok(stats.transparentDrawables > 0);
    assert.ok(stats.transparentDrawables <= 20);
    assert.ok(stats.maxVisibilityLayers <= (detailTier === 'low' ? 1 : 2));
    world.dispose();
  }
});

test('runtime sources and filenames are fully migrated from the former environment', async () => {
  const runtimePaths = ['index.html', 'styles.css', 'i18n.js', 'script.js', 'scene.js', 'scene-model.js', 'lab-world.js', 'media-gallery.js'];
  const runtime = (await Promise.all(runtimePaths.map(read))).join('\n');
  const retired = /\b(?:kage|temple|torii|lantern|garden|moon|forest|ruin|rain|leaf|ember|shoji)\b/i;

  assert.doesNotMatch(runtime, retired);
  assert.doesNotMatch(runtime, /EffectComposer|RenderPass|OutputPass|UnrealBloomPass|postprocessing\//);
  await access(new URL('tests/lab-continuity-lighting.test.mjs', root));
  await assert.rejects(access(new URL('tests/lantern-path-lighting.test.mjs', root)));
});
