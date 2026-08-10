import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

async function loadSceneModel() {
  const source = await read('scene-model.js');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}

function numberFrom(source, pattern, label) {
  const match = source.match(pattern);
  assert.ok(match, `${label} must be declared`);
  return Number(match[1]);
}

function ruleBody(source, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = [...source.matchAll(new RegExp(`${escaped}\\s*\\{(?<body>[^}]*)\\}`, 'gs'))];
  const rule = matches.find((match) => match.groups.body.includes('background:'));
  assert.ok(rule, `${selector} needs a background rule`);
  return rule.groups.body;
}

function rgbaStops(source) {
  return [...source.matchAll(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(\d*\.?\d+)\s*\)\s*(\d+)%/g)]
    .map((match) => ({ alpha: Number(match[1]), position: Number(match[2]) }));
}

function maxRgbaAlpha(source) {
  const alphas = [...source.matchAll(/rgba\([^)]*,\s*(\d*\.?\d+)\s*\)/g)].map((match) => Number(match[1]));
  assert.ok(alphas.length > 0, 'rule must contain rgba alpha values');
  return Math.max(...alphas);
}

test('camera fog preserves distant temple silhouettes', async () => {
  const { CAMERA_POSES } = await loadSceneModel();
  const transmission = (density, distance) => Math.exp(-((density * distance) ** 2));

  assert.deepEqual(CAMERA_POSES.map((pose) => pose.fogDensity), [0.009, 0.011, 0.01, 0.013, 0.011, 0.008]);
  CAMERA_POSES.forEach((pose, index) => {
    assert.ok(transmission(pose.fogDensity, 70) >= 0.4, `chapter ${index} must retain at least 40% at 70 units`);
  });
  assert.ok(transmission(CAMERA_POSES[0].fogDensity, 104) >= 0.4, 'top chapter must retain at least 40% at the temple');
});

test('temple exterior key reveals the hall and both roof tiers independently from window glow', async () => {
  const scene = await read('scene.js');
  const templeStart = scene.indexOf('function addTemple(');
  const forestStart = scene.indexOf('function addForest(');
  const temple = scene.slice(templeStart, forestStart);
  assert.ok(templeStart >= 0 && forestStart > templeStart, 'temple scene block must be available');

  const key = temple.match(
    /const exteriorKey = new THREE\.SpotLight\(0x([\da-f]+),\s*(\d*\.?\d+),\s*(\d*\.?\d+),\s*(\d*\.?\d+),\s*(\d*\.?\d+),\s*(\d*\.?\d+)\)/i,
  );
  assert.ok(key, 'the distant temple needs a dedicated exterior key instead of relying on glowing windows');

  const [, colorHex, intensity, distance, angle, penumbra, decay] = key;
  const color = Number.parseInt(colorHex, 16);
  const red = color >> 16;
  const green = (color >> 8) & 0xff;
  const blue = color & 0xff;
  assert.ok(blue > green && green > red, 'the exterior key must stay moonlit blue, separate from the warm interior');
  assert.ok(Number(intensity) >= 360 && Number(intensity) <= 520, 'the exterior key must survive the long hero sightline without flattening the scene');
  assert.ok(Number(distance) >= 60 && Number(distance) <= 90, 'the exterior key must cover the complete temple depth');
  assert.ok(Number(angle) >= 0.5 && Number(angle) <= 0.75, 'the key cone must cover the full hall and both roof tiers');
  assert.ok(Number(penumbra) >= 0.35 && Number(penumbra) <= 0.65, 'the exterior light edge must stay soft');
  assert.ok(Number(decay) >= 1.2 && Number(decay) <= 1.6, 'the exterior key must remain local to the temple');

  const position = temple.match(/exteriorKey\.position\.set\((-?\d*\.?\d+),\s*(-?\d*\.?\d+),\s*(-?\d*\.?\d+)\)/);
  const target = temple.match(/exteriorKey\.target\.position\.set\((-?\d*\.?\d+),\s*(-?\d*\.?\d+),\s*(-?\d*\.?\d+)\)/);
  assert.ok(position && target, 'the exterior key needs an explicit architectural position and target');
  assert.ok(Math.abs(Number(position[1])) >= 10 && Math.abs(Number(position[1])) <= 16, 'the key must rake across the facade from a close off-axis position');
  assert.ok(Number(position[2]) >= 28 && Number(position[2]) <= 34, 'the key must sit above both roof tiers');
  assert.ok(Number(position[3]) >= -58 && Number(position[3]) <= -50, 'the key must stay close enough to survive physical light decay');
  assert.ok(Number(target[2]) >= 18 && Number(target[2]) <= 21.5, 'the key must aim between the main hall and roof line');
  assert.ok(Number(target[3]) >= -74 && Number(target[3]) <= -70, 'the key must terminate at the stair-end temple');
  assert.match(temple, /exteriorKey\.userData\.lightRole = 'temple-exterior'/);
  assert.match(temple, /parent\.add\(exteriorKey, exteriorKey\.target\)/);
  assert.doesNotMatch(temple, /warmLights\.push\(exteriorKey\)/, 'the moonlit exterior key must not brighten with the windows');
});

test('renderer lighting reveals surfaces without relying on aggressive bloom', async () => {
  const [scene, { CAMERA_POSES }] = await Promise.all([read('scene.js'), loadSceneModel()]);
  const exposure = numberFrom(scene, /toneMappingExposure\s*=\s*(\d*\.?\d+)/, 'tone mapping exposure');
  assert.ok(exposure >= 1.05 && exposure <= 1.25);
  assert.match(scene, /setClearColor\(0x111a22,\s*1\)/);
  assert.match(scene, /scene\.background\s*=\s*new THREE\.Color\(0x111a22\)/);
  assert.match(scene, /new THREE\.FogExp2\(0x263945,/);

  const bloom = scene.match(/new UnrealBloomPass\(\s*new THREE\.Vector2\([^)]*\),\s*(\d*\.?\d+),\s*(\d*\.?\d+),\s*(\d*\.?\d+)\)/);
  assert.ok(bloom, 'bloom parameters must remain explicit');
  const [, bloomStrength, bloomRadius, bloomThreshold] = bloom.map(Number);
  assert.ok(bloomStrength <= 0.35);
  assert.ok(bloomRadius <= 0.6);
  assert.ok(bloomThreshold >= 0.7);

  const dynamicBloom = scene.match(/bloomPass\.strength\s*=\s*(\d*\.?\d+)\s*\+\s*pose\.warmth\s*\*\s*(\d*\.?\d+)/);
  assert.ok(dynamicBloom, 'dynamic bloom must remain bounded');
  const maxWarmth = Math.max(...CAMERA_POSES.map((pose) => pose.warmth));
  assert.ok(Number(dynamicBloom[1]) + maxWarmth * Number(dynamicBloom[2]) <= 0.35);

  for (const material of ['stone', 'roof']) {
    const body = scene.match(new RegExp(`${material}: new THREE\\.MeshStandardMaterial\\(\\{(?<body>[^}]*)\\}\\)`))?.groups?.body ?? '';
    const metalness = numberFrom(body, /metalness:\s*(\d*\.?\d+)/, `${material} metalness`);
    assert.ok(metalness <= 0.08, `${material} metalness must not swallow diffuse light`);
  }

  const hemisphere = numberFrom(scene, /new THREE\.HemisphereLight\([^,]+,\s*[^,]+,\s*(\d*\.?\d+)\)/, 'hemisphere intensity');
  assert.ok(hemisphere >= 1.35 && hemisphere <= 1.6);
  assert.doesNotMatch(scene, /new THREE\.AmbientLight/);
});

test('haze and chapter washes protect text without blacking out the environment', async () => {
  const css = await read('styles.css');
  const desktopHaze = ruleBody(css, '.scene-haze');
  assert.ok(maxRgbaAlpha(desktopHaze) <= 0.5, 'desktop haze and vignette layers must stay at or below 0.5');

  const mobileCss = css.slice(css.indexOf('@media (max-width: 720px)'));
  const mobileHaze = ruleBody(mobileCss, '.scene-haze');
  assert.ok(maxRgbaAlpha(mobileHaze) <= 0.5, 'mobile haze and vignette layers must stay at or below 0.5');

  for (const selector of ['.chapter-wash', '.hero .chapter-wash', '.work .chapter-wash', '.contact .chapter-wash']) {
    const body = ruleBody(css, selector);
    assert.ok(maxRgbaAlpha(body) <= 0.65, `${selector} must stay at or below 0.65`);
    const fadeStop = rgbaStops(body).find(({ alpha, position }) => alpha <= 0.08 && position >= 65 && position <= 72);
    assert.ok(fadeStop, `${selector} must fade close to transparent between 65% and 72%`);
  }
});
