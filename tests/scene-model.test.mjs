import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import * as THREE from '../assets/vendor/three/three.module.min.js';

const sourceUrl = new URL('../scene-model.js', import.meta.url);

async function loadSceneModel() {
  const source = await readFile(sourceUrl, 'utf8');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}

test('camera interpolation clamps progress and eases between authored poses', async () => {
  const { interpolateCamera } = await loadSceneModel();
  const poses = [
    { position: [0, 2, 10], target: [0, 1, 0], fov: 40 },
    { position: [10, 6, -10], target: [2, 3, -4], fov: 50 },
  ];

  assert.deepEqual(interpolateCamera(-1, poses), poses[0]);
  assert.deepEqual(interpolateCamera(2, poses), poses[1]);
  assert.deepEqual(interpolateCamera(0.5, poses), {
    position: [5, 4, 0],
    target: [1, 2, -2],
    fov: 45,
  });
});

test('portrait hero framing keeps the complete stair-end temple inside the viewport', async () => {
  const { CAMERA_POSES, getHeroTempleTargetOffset } = await loadSceneModel();
  assert.equal(typeof getHeroTempleTargetOffset, 'function', 'hero framing needs an aspect-aware target offset');

  const pose = CAMERA_POSES[0];
  const width = 390;
  const height = 844;
  const aspect = width / height;
  const camera = new THREE.PerspectiveCamera(pose.fov, aspect, 0.1, 240);
  camera.position.set(...pose.position);
  camera.lookAt(new THREE.Vector3(
    pose.target[0] + getHeroTempleTargetOffset(0, aspect),
    pose.target[1],
    pose.target[2],
  ));
  camera.updateMatrixWorld();

  const bounds = {
    x: [-12.4, 12.4],
    y: [12.4, 23.28],
    z: [-79.1, -64.9],
  };
  const projectedX = bounds.x.flatMap((x) => bounds.y.flatMap((y) => bounds.z.map((z) => {
    const ndc = new THREE.Vector3(x, y, z).project(camera);
    return (ndc.x + 1) * width / 2;
  })));

  assert.ok(Math.min(...projectedX) >= 32, 'the temple must clear the mobile left safe area');
  assert.ok(Math.max(...projectedX) <= width - 32, 'the complete temple and both roof tiers must clear the mobile right edge');
  assert.equal(getHeroTempleTargetOffset(0, 1440 / 900), 0, 'desktop framing must keep its authored composition');
  assert.equal(getHeroTempleTargetOffset(0.2, aspect), 0, 'the correction must end with the hero camera segment');
});

test('active chapter is stable at the beginning, boundaries and end', async () => {
  const { getActiveChapter } = await loadSceneModel();
  const chapters = ['top', 'about', 'work', 'craft', 'experience', 'contact'];

  assert.equal(getActiveChapter(-0.2, chapters), 'top');
  assert.equal(getActiveChapter(0.2, chapters), 'about');
  assert.equal(getActiveChapter(0.999, chapters), 'contact');
  assert.equal(getActiveChapter(2, chapters), 'contact');
});

test('camera progress follows measured chapter offsets instead of equal document fractions', async () => {
  const { alignChapterOffsets, normalizeChapterScroll, READING_LINE_RATIO } = await loadSceneModel();
  const offsets = [0, 800, 1900, 6200, 7800, 9000];

  assert.equal(READING_LINE_RATIO, 0.46);
  assert.deepEqual(alignChapterOffsets([0, 924, 1994], 720), [0, 592.8, 1662.8]);
  assert.equal(normalizeChapterScroll(0, offsets), 0);
  assert.equal(normalizeChapterScroll(1900, offsets), 0.4);
  assert.equal(normalizeChapterScroll(6200, offsets), 0.6);
  assert.equal(normalizeChapterScroll(9500, offsets), 1);

  const workMidpoint = normalizeChapterScroll((1900 + 6200) / 2, offsets);
  assert.ok(Math.abs(workMidpoint - 0.5) < 1e-9);

  const workQuarter = normalizeChapterScroll(1900 + (6200 - 1900) * 0.25, offsets);
  assert.ok(Math.abs(workQuarter - 0.45) < 1e-9, 'chapter normalization must stay linear before camera easing');
});

test('static camera poses change only at chapter boundaries', async () => {
  const { snapCameraProgress } = await loadSceneModel();

  assert.equal(snapCameraProgress(0, 6), 0);
  assert.equal(snapCameraProgress(0.199, 6), 0);
  assert.equal(snapCameraProgress(0.2, 6), 0.2);
  assert.equal(snapCameraProgress(0.599, 6), 0.4);
  assert.equal(snapCameraProgress(0.6, 6), 0.6);
  assert.equal(snapCameraProgress(0.999, 6), 0.8);
  assert.equal(snapCameraProgress(1, 6), 1);
});

test('contact camera remains outside the temple while framing its interior', async () => {
  const { CAMERA_POSES, interpolateCamera } = await loadSceneModel();
  const contact = CAMERA_POSES.at(-1);
  const minimumCameraZ = -58;

  for (let step = 0; step <= 20; step += 1) {
    const progress = 0.8 + (step / 20) * 0.2;
    const pose = interpolateCamera(progress, CAMERA_POSES);
    assert.ok(pose.position[2] >= minimumCameraZ, `contact path enters temple at progress ${progress.toFixed(2)}`);
  }

  assert.ok(Math.abs(contact.position[0]) >= 12, 'contact camera needs a clear oblique angle');
  assert.ok(contact.position[1] >= 18, 'contact camera needs a high exterior vantage point');
  assert.ok(contact.target[2] <= -70, 'contact camera must still look into the temple');
  assert.ok(contact.fov >= 48 && contact.fov <= 52, 'contact camera needs a wide establishing frame');
});

test('performance profile caps DPR and removes continuous effects for reduced motion', async () => {
  const { getPerformanceProfile } = await loadSceneModel();
  const desktop = getPerformanceProfile({ width: 1440, devicePixelRatio: 2, hardwareConcurrency: 10, reducedMotion: false });
  const mobile = getPerformanceProfile({ width: 390, devicePixelRatio: 3, hardwareConcurrency: 6, reducedMotion: false });
  const reduced = getPerformanceProfile({ width: 1440, devicePixelRatio: 2, hardwareConcurrency: 10, reducedMotion: true });

  assert.equal(desktop.dpr, 1.5);
  assert.equal(mobile.dpr, 1.2);
  assert.ok(mobile.rainCount < desktop.rainCount);
  assert.equal(reduced.animate, false);
  assert.equal(reduced.rainCount, 0);
  assert.equal(reduced.leafCount, 0);
  assert.equal(reduced.emberCount, 0);
});
