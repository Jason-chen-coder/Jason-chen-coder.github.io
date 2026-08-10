import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

async function loadSceneModel() {
  const source = await read('scene-model.js');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}

function requiredMatch(source, pattern, label) {
  const match = source.match(pattern);
  assert.ok(match, `${label} must remain explicit`);
  return match;
}

function optionalNumber(source, pattern) {
  const match = source.match(pattern);
  return match ? Number(match[1]) : null;
}

function smoothstep(edge0, edge1, value) {
  const progress = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return progress * progress * (3 - 2 * progress);
}

function surfaceContribution(point, light, normal) {
  const toLight = {
    x: light.x - point.x,
    y: light.y - point.y,
    z: light.z - point.z,
  };
  const distance = Math.hypot(toLight.x, toLight.y, toLight.z);
  if (distance >= light.cutoff) return 0;

  const lambert = Math.max(0, (
    toLight.x * normal.x + toLight.y * normal.y + toLight.z * normal.z
  ) / distance);
  const cutoffWindow = (1 - (distance / light.cutoff) ** 4) ** 2;
  let contribution = light.intensity * cutoffWindow * lambert
    / Math.max(distance ** light.decay, 0.01);

  if (light.target) {
    const toPoint = {
      x: point.x - light.x,
      y: point.y - light.y,
      z: point.z - light.z,
    };
    const direction = {
      x: light.target.x - light.x,
      y: light.target.y - light.y,
      z: light.target.z - light.z,
    };
    const directionLength = Math.hypot(direction.x, direction.y, direction.z);
    const angleCos = (
      toPoint.x * direction.x + toPoint.y * direction.y + toPoint.z * direction.z
    ) / (distance * directionLength);
    const coneCos = Math.cos(light.angle);
    const penumbraCos = Math.cos(light.angle * (1 - light.penumbra));
    contribution *= smoothstep(coneCos, penumbraCos, angleCos);
  }
  return contribution;
}

function longestDarkSpan(values, threshold, sampleStep, stairSpacing) {
  let current = 0;
  let longest = 0;
  for (const value of values) {
    current = value < threshold ? current + sampleStep * stairSpacing : 0;
    longest = Math.max(longest, current);
  }
  return longest;
}

test('lantern path directs local light across every stair row and the complete hero gate', async () => {
  const [scene, { CAMERA_POSES }] = await Promise.all([read('scene.js'), loadSceneModel()]);
  const lantern = scene.slice(scene.indexOf('function addLanternPath('), scene.indexOf('function createCurvedRoofGeometry('));
  const temple = scene.slice(scene.indexOf('function addTemple('), scene.indexOf('function addForest('));
  const applyCamera = scene.slice(scene.indexOf('  function applyCamera('), scene.indexOf('  function render('));
  assert.ok(lantern.length > 0 && temple.length > 0 && applyCamera.length > 0);

  const loop = requiredMatch(lantern, /for \(let index = (\d+); index < (\d+); index \+= (\d+)\)/, 'lantern index loop');
  const xFormula = requiredMatch(lantern, /side \* \((\d*\.?\d+) \+ Math\.sin\(index\) \* (\d*\.?\d+)\)/, 'lantern x formula');
  const yFormula = requiredMatch(lantern, /const pathY = index \* (\d*\.?\d+) \+ (\d*\.?\d+)/, 'lantern path y formula');
  requiredMatch(lantern, /const y = Math\.max\(pathY, groundY \+ (\d*\.?\d+)\)/, 'terrain-aware lantern y formula');
  const zFormula = requiredMatch(lantern, /const z = (\d*\.?\d+) - index \* (\d*\.?\d+)/, 'lantern z formula');
  const lightHeight = Number(requiredMatch(lantern, /\.position\.set\([^,]+, (?:y|gateAccentOrigin\.y) \+ (\d*\.?\d+), [^)]+\)/, 'path light height')[1]);
  const [startIndex, endIndex, indexStep] = loop.slice(1).map(Number);
  const [, xBase, xWave] = xFormula.map(Number);
  const [, ySlope, yBase] = yFormula.map(Number);
  const [, zBase, stairSpacing] = zFormula.map(Number);
  const lanternRows = [];
  for (let index = startIndex; index < endIndex; index += indexStep) lanternRows.push(index);

  const topWarmth = CAMERA_POSES[0].warmth;
  const maxWarmth = Math.max(...CAMERA_POSES.map((pose) => pose.warmth));
  const sideRule = lantern.match(/const pathLightSide = index % (\d+) === (\d+) \? (-?1) : (-?1)/);
  const everyRowCondition = /if \(side === pathLightSide\) \{/.test(lantern);
  const sparseSideCondition = lantern.match(/if \(side === pathLightSide && index % (\d+) === (\d+)\) \{/);
  const legacyCluster = lantern.match(/if \(index % (\d+) === (\d+)\) \{/);

  const pointMatch = lantern.match(
    /const light = new THREE\.PointLight\(0x[\da-f]+,\s*(\d*\.?\d+),\s*(\d*\.?\d+),\s*(\d*\.?\d+)\)/i,
  );
  const pointLights = [];
  if (pointMatch) {
    const pointStart = lantern.indexOf(pointMatch[0]);
    const pointEnd = lantern.indexOf('lights.push(light);', pointStart);
    const pointBlock = lantern.slice(pointStart, pointEnd);
    const [, initialIntensity, cutoff, decay] = pointMatch.map(Number);
    const base = optionalNumber(pointBlock, /light\.userData\.baseIntensity = (\d*\.?\d+)/) ?? initialIntensity;
    const gain = optionalNumber(pointBlock, /light\.userData\.warmthGain = (\d*\.?\d+)/) ?? 0;
    const negativeScale = optionalNumber(pointBlock, /side < 0 \? (\d*\.?\d+) : 1/) ?? 1;
    const intensity = base + topWarmth * gain;
    lanternRows.forEach((index) => {
      let sides = [];
      if (sideRule) {
        const [, modulo, remainder, matchedSide, otherSide] = sideRule.map(Number);
        sides = [index % modulo === remainder ? matchedSide : otherSide];
      } else if (legacyCluster && index % Number(legacyCluster[1]) === Number(legacyCluster[2])) {
        sides = [-1, 1];
      }
      sides.forEach((side) => pointLights.push({
        row: index,
        x: side * (xBase + Math.sin(index) * xWave),
        y: index * ySlope + yBase + lightHeight,
        z: zBase - index * stairSpacing,
        intensity: intensity * (side < 0 ? negativeScale : 1),
        cutoff,
        decay,
      }));
    });
  }

  const stairSpotMatch = lantern.match(
    /const light = new THREE\.SpotLight\(0x[\da-f]+,\s*(\d*\.?\d+),\s*(\d*\.?\d+),\s*(\d*\.?\d+),\s*(\d*\.?\d+),\s*(\d*\.?\d+)\)/i,
  );
  const stairSpots = [];
  if (stairSpotMatch && sideRule) {
    const spotStart = lantern.indexOf(stairSpotMatch[0]);
    const spotEnd = lantern.indexOf('lights.push(light);', spotStart);
    const spotBlock = lantern.slice(spotStart, spotEnd);
    const [, initialIntensity, cutoff, angle, penumbra, decay] = stairSpotMatch.map(Number);
    const base = optionalNumber(spotBlock, /light\.userData\.baseIntensity = (\d*\.?\d+)/) ?? initialIntensity;
    const gain = optionalNumber(spotBlock, /light\.userData\.warmthGain = (\d*\.?\d+)/) ?? 0;
    const intensity = base + topWarmth * gain;
    const [, modulo, remainder, matchedSide, otherSide] = sideRule.map(Number);
    lanternRows.forEach((index) => {
      if (!everyRowCondition && (
        !sparseSideCondition
        || index % Number(sparseSideCondition[1]) !== Number(sparseSideCondition[2])
      )) return;
      const side = index % modulo === remainder ? matchedSide : otherSide;
      const z = zBase - index * stairSpacing;
      stairSpots.push({
        row: index,
        x: side * (xBase + Math.sin(index) * xWave),
        y: index * ySlope + yBase + lightHeight,
        z,
        intensity,
        cutoff,
        decay,
        angle,
        penumbra,
        target: { x: 0, y: index * ySlope + 0.25, z },
      });
    });
  }

  const gateSpotMatch = lantern.match(
    /const gateAccent = new THREE\.SpotLight\(0x[\da-f]+,\s*(\d*\.?\d+),\s*(\d*\.?\d+),\s*(\d*\.?\d+),\s*(\d*\.?\d+),\s*(\d*\.?\d+)\)/i,
  );
  let gateAccent = null;
  if (gateSpotMatch) {
    const gateStart = lantern.indexOf(gateSpotMatch[0]);
    const gateEnd = lantern.indexOf('lights.push(gateAccent);', gateStart);
    const gateBlock = lantern.slice(gateStart, gateEnd);
    const origin = requiredMatch(
      gateBlock,
      /gateAccent\.position\.set\(0, gateAccentOrigin\.y \+ (\d*\.?\d+), gateAccentOrigin\.z \+ (\d*\.?\d+)\)/,
      'gate accent pooled origin',
    );
    const target = requiredMatch(gateBlock, /gateAccent\.target\.position\.set\((\d*\.?\d+),\s*(\d*\.?\d+),\s*(-?\d*\.?\d+)\)/, 'gate accent target');
    const [, initialIntensity, cutoff, angle, penumbra, decay] = gateSpotMatch.map(Number);
    const base = optionalNumber(gateBlock, /gateAccent\.userData\.baseIntensity = (\d*\.?\d+)/) ?? initialIntensity;
    const gain = optionalNumber(gateBlock, /gateAccent\.userData\.warmthGain = (\d*\.?\d+)/) ?? 0;
    gateAccent = {
      x: 0,
      y: startIndex * ySlope + yBase + Number(origin[1]),
      z: zBase - startIndex * stairSpacing + Number(origin[2]),
      intensity: base + topWarmth * gain,
      maxIntensity: base + maxWarmth * gain,
      cutoff,
      decay,
      angle,
      penumbra,
      target: { x: Number(target[1]), y: Number(target[2]), z: Number(target[3]) },
    };
  }

  const pathLights = [...pointLights, ...stairSpots, ...(gateAccent ? [gateAccent] : [])];
  const sampleStep = 0.25;
  const centerline = [];
  const terrainBleed = [];
  for (let step = 0; step <= 38; step += sampleStep) {
    const basePoint = { y: step * ySlope + 0.25, z: zBase - step * stairSpacing };
    centerline.push(pathLights.reduce(
      (sum, light) => sum + surfaceContribution({ x: 0, ...basePoint }, light, { x: 0, y: 1, z: 0 }),
      0,
    ));
    terrainBleed.push(pathLights.reduce(
      (sum, light) => sum + surfaceContribution({ x: 6.5, ...basePoint }, light, { x: 0, y: 1, z: 0 }),
      0,
    ));
  }
  const pathMean = centerline.reduce((sum, value) => sum + value, 0) / centerline.length;
  const pathPeak = Math.max(...centerline);
  const darkSpan = longestDarkSpan(centerline, 0.05, sampleStep, stairSpacing);
  const bleedPeak = Math.max(...terrainBleed);

  const heroAnchors = {
    postLeft: { point: { x: -3.1, y: 5.4, z: 10.25 }, minimum: 0.08, maximum: 0.25 },
    postRight: { point: { x: 3.1, y: 5.4, z: 10.25 }, minimum: 0.08, maximum: 0.25 },
    nuki: { point: { x: 0, y: 7.68, z: 10.25 }, minimum: 0.9, maximum: 1.25 },
    crown: { point: { x: 0, y: 9.52, z: 10.25 }, minimum: 0.55, maximum: 0.82 },
    crownLeft: { point: { x: -3, y: 9.52, z: 10.25 }, minimum: 0.4, maximum: 0.65 },
    crownRight: { point: { x: 3, y: 9.52, z: 10.25 }, minimum: 0.4, maximum: 0.65 },
  };
  const heroLight = Object.fromEntries(Object.entries(heroAnchors).map(([name, anchor]) => [
    name,
    pathLights.reduce(
      (sum, light) => sum + surfaceContribution(anchor.point, light, { x: 0, y: 0, z: 1 }),
      0,
    ),
  ]));

  const lanternPaper = Number(requiredMatch(
    scene,
    /lanternPaper: new THREE\.MeshStandardMaterial\(\{[\s\S]*?emissiveIntensity:\s*(\d*\.?\d+)/,
    'lantern paper emissive intensity',
  )[1]);
  const intensityScales = {
    stair: optionalNumber(lantern, /light\.userData\.intensityScale = (\d*\.?\d+)/),
    gate: optionalNumber(lantern, /gateAccent\.userData\.intensityScale = (\d*\.?\d+)/),
    temple: optionalNumber(temple, /light\.userData\.intensityScale = (\d*\.?\d+)/),
  };
  const templeBase = Number(requiredMatch(temple, /light\.userData\.baseIntensity = (\d*\.?\d+)/, 'temple base intensity')[1]);
  const templeGain = Number(requiredMatch(temple, /light\.userData\.warmthGain = (\d*\.?\d+)/, 'temple warmth gain')[1]);
  const exposure = Number(requiredMatch(scene, /toneMappingExposure\s*=\s*(\d*\.?\d+)/, 'tone mapping exposure')[1]);
  const bloom = requiredMatch(
    scene,
    /new UnrealBloomPass\(\s*new THREE\.Vector2\([^)]*\),\s*(\d*\.?\d+),\s*(\d*\.?\d+),\s*(\d*\.?\d+)\)/,
    'bloom parameters',
  ).slice(1).map(Number);

  const failures = [];
  if (pointLights.length) failures.push(`${pointLights.length} omnidirectional path lights still spill energy outside the authored surfaces`);
  if (!everyRowCondition) failures.push('stair spotlight creation still contains a sparse row filter');
  if (stairSpots.length !== lanternRows.length) failures.push(`${stairSpots.length}/${lanternRows.length} lantern rows receive a directed stair light`);
  if (new Set(stairSpots.map((light) => light.row)).size !== lanternRows.length) failures.push('directed stair lights do not cover every lantern row exactly once');
  if (!gateAccent) failures.push('hero gate lacks a pooled accent from the nearest lantern pair');
  if (pathLights.length !== 10) failures.push(`dynamic path-light count changed to ${pathLights.length}`);
  if (darkSpan > stairSpacing) failures.push(`Lambert-weighted dark span ${darkSpan.toFixed(2)} exceeds one stair ${stairSpacing.toFixed(2)}`);
  if (pathMean < 0.25 || pathMean > 0.38) failures.push(`stair-surface mean ${pathMean.toFixed(3)} must stay within 0.250-0.380`);
  if (pathPeak > 0.55) failures.push(`stair-surface peak ${pathPeak.toFixed(3)} exceeds 0.550`);
  if (bleedPeak > 0.01) failures.push(`terrain bleed ${bleedPeak.toFixed(3)} exceeds 0.010`);
  Object.entries(heroAnchors).forEach(([name, { minimum, maximum }]) => {
    const illumination = heroLight[name];
    if (illumination < minimum || illumination > maximum) {
      failures.push(`hero ${name} surface light ${illumination.toFixed(3)} must stay within ${minimum.toFixed(3)}-${maximum.toFixed(3)}`);
    }
  });
  if (!/light\.target\.position\.set\(0, index \* 0\.34 \+ 0\.25, z\)/.test(lantern)) failures.push('stair spots are not aimed at their matching stair centers');
  if (!/parent\.add\(\s*light,\s*light\.target\s*\)/.test(lantern)) failures.push('stair spotlight targets are not attached to the scene graph');
  if (!/gateAccent\.position\.set\(0, gateAccentOrigin\.y \+ 4\.2, gateAccentOrigin\.z \+ 0\.8\)/.test(lantern)) failures.push('gate accent is not pooled high and forward from the nearest lantern pair');
  if (!/parent\.add\(\s*gateAccent,\s*gateAccent\.target\s*\)/.test(lantern)) failures.push('gate accent target is not attached to the scene graph');
  if (/castShadow\s*=\s*true/.test(lantern)) failures.push('local path lights must not add shadow-map work');
  if (gateAccent && (gateAccent.intensity < 42 || gateAccent.intensity > 46 || gateAccent.maxIntensity > 52)) failures.push(`gate accent intensity ${gateAccent.intensity.toFixed(2)}-${gateAccent.maxIntensity.toFixed(2)} is unbounded`);
  if (gateAccent && (gateAccent.cutoff < 14.5 || gateAccent.cutoff > 15.5 || gateAccent.angle < 0.65 || gateAccent.angle > 0.72 || gateAccent.penumbra < 0.2 || gateAccent.penumbra > 0.3 || gateAccent.decay !== 2)) failures.push('gate accent cone no longer isolates the hero frame');
  if (templeBase !== 2.6 || templeGain !== 1.4) failures.push(`temple curve changed to ${templeBase} + warmth * ${templeGain}`);
  Object.entries(intensityScales).forEach(([role, scale]) => {
    if (!Number.isFinite(scale) || scale <= 0) failures.push(`${role} light lacks a finite positive intensityScale`);
  });
  if (lanternPaper !== 2.45) failures.push(`lantern paper emissive intensity changed to ${lanternPaper}`);
  if (!/light\.userData\.baseIntensity[\s\S]*light\.userData\.warmthGain/.test(applyCamera)) failures.push('camera warmth no longer uses per-light metadata');
  if (exposure !== 1.18) failures.push(`global exposure changed to ${exposure}`);
  if (JSON.stringify(bloom) !== JSON.stringify([0.28, 0.52, 0.86])) failures.push(`global bloom changed to ${bloom.join('/')}`);

  assert.deepEqual(failures, []);
});
