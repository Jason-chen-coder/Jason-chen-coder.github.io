import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

function hexFrom(source, pattern, label) {
  const match = source.match(pattern);
  assert.ok(match, `${label} must be declared`);
  return Number.parseInt(match[1], 16);
}

function numberFrom(source, pattern, label) {
  const match = source.match(pattern);
  assert.ok(match, `${label} must be declared`);
  return Number(match[1]);
}

function channels(hex) {
  return [hex >> 16, (hex >> 8) & 0xff, hex & 0xff].map((channel) => channel / 255);
}

function srgbToLinear(channel) {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(channel) {
  return channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055;
}

function effectiveMappedColor(base, tint) {
  return channels(base).map((channel, index) => (
    linearToSrgb(srgbToLinear(channel) * srgbToLinear(channels(tint)[index]))
  ));
}

function perceivedLuminance(colorChannels) {
  return colorChannels[0] * 0.2126 + colorChannels[1] * 0.7152 + colorChannels[2] * 0.0722;
}

function materialBody(source, name) {
  const match = source.match(new RegExp(`${name}: new THREE\\.MeshStandardMaterial\\(\\{(?<body>[^}]*)\\}\\)`));
  assert.ok(match, `${name} material must be declared`);
  return match.groups.body;
}

function materialColor(source, name) {
  return hexFrom(materialBody(source, name), /color:\s*0x([\da-f]+)/i, `${name} color`);
}

function ruleBody(source, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = [...source.matchAll(new RegExp(`${escaped}\\s*\\{(?<body>[^}]*)\\}`, 'gs'))];
  const match = matches.find((candidate) => candidate.groups.body.includes('background:'));
  assert.ok(match, `${selector} must be declared`);
  return match.groups.body;
}

function listedRuleBody(source, selectors) {
  const pattern = selectors
    .map((selector) => selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('\\s*,\\s*');
  return source.match(new RegExp(`${pattern}\\s*\\{(?<body>[^}]*)\\}`, 's'))?.groups?.body ?? null;
}

function gradientStops(rule, direction) {
  const line = rule.split('\n').find((candidate) => candidate.includes(`linear-gradient(${direction}deg`));
  assert.ok(line, `${direction}deg gradient must be declared on one line`);
  return [...line.matchAll(/(?:rgba\([^)]*,\s*(\d*\.?\d+)\)|(transparent))\s*(\d+(?:\.\d+)?)%?/g)]
    .map((match) => ({ alpha: match[2] ? 0 : Number(match[1]), position: Number(match[3]) }));
}

function alphaAt(stops, position) {
  assert.ok(stops.length >= 2, 'gradient needs at least two opacity stops');
  if (position <= stops[0].position) return stops[0].alpha;
  for (let index = 1; index < stops.length; index += 1) {
    if (position <= stops[index].position) {
      const previous = stops[index - 1];
      const span = stops[index].position - previous.position;
      const progress = span === 0 ? 1 : (position - previous.position) / span;
      return previous.alpha + (stops[index].alpha - previous.alpha) * progress;
    }
  }
  return stops.at(-1).alpha;
}

function vignetteAlpha(rule, x, y, width, height) {
  const match = rule.match(/box-shadow:[^;]*?(\d+)px\s+rgba\([^)]*,\s*(\d*\.?\d+)\)/);
  assert.ok(match, 'vignette blur and alpha must be declared');
  const blur = Number(match[1]);
  const edgeDistance = Math.min(x * width, (1 - x) * width, y * height, (1 - y) * height);
  return Number(match[2]) * Math.max(0, 1 - edgeDistance / blur);
}

function combinedTransmission(hazeRule, chapterRules, { x, y, width, height }) {
  const horizontal = alphaAt(gradientStops(hazeRule, 90), x * 100);
  const vertical = alphaAt(gradientStops(hazeRule, 0), (1 - y) * 100);
  const vignette = vignetteAlpha(hazeRule, x, y, width, height);
  const wash = Math.max(...chapterRules.map((rule) => alphaAt(gradientStops(rule, 90), x * 100)));
  return (1 - horizontal) * (1 - vertical) * (1 - vignette) * (1 - wash);
}

test('mapped architectural materials preserve effective midtones and edge hierarchy', async () => {
  const scene = await read('scene.js');
  const textureBases = {
    stone: hexFrom(scene, /stoneTextures\s*=\s*createSurfaceTextureSet\(0x([\da-f]+)/i, 'stone texture base'),
    timber: hexFrom(scene, /timberTextures\s*=\s*createSurfaceTextureSet\(0x([\da-f]+)/i, 'timber texture base'),
    roof: hexFrom(scene, /roofTextures\s*=\s*createSurfaceTextureSet\(0x([\da-f]+)/i, 'roof texture base'),
  };
  const requirements = {
    stone: ['stone', 0.28],
    stoneDark: ['stone', 0.235],
    timber: ['timber', 0.16],
    timberDark: ['timber', 0.125],
    roof: ['roof', 0.235],
    roofEdge: ['roof', 0.26],
  };
  const effective = {};

  for (const [name, [texture, minimum]] of Object.entries(requirements)) {
    const tint = materialColor(scene, name);
    const tintChannels = channels(tint);
    effective[name] = perceivedLuminance(effectiveMappedColor(textureBases[texture], tint));
    assert.ok(effective[name] >= minimum, `${name} effective midtone ${effective[name].toFixed(3)} must be >= ${minimum}`);
    assert.ok(Math.min(...tintChannels) >= 0.72, `${name} tint must stay near-neutral so its map carries the material color`);
    assert.ok(Math.max(...tintChannels) - Math.min(...tintChannels) <= 0.08, `${name} tint channels must remain near-neutral`);
  }

  assert.ok(effective.roofEdge >= effective.roof * 1.06, 'roof edge must remain visibly brighter than the roof map');
});

test('terrain hills preserve a clear stair-to-temple sightline', async () => {
  const scene = await read('scene.js');
  const groundStart = scene.indexOf('function addGround(');
  const stepsStart = scene.indexOf('function createStepGeometry(');
  const ground = scene.slice(groundStart, stepsStart);
  assert.ok(groundStart >= 0 && stepsStart > groundStart, 'ground scene block must be available');

  assert.match(ground, /const lateralSeed = range\(31, 52\)/, 'hill placement must retain its deterministic lateral seed');
  assert.match(
    ground,
    /const hillScale = \[range\(1\.3, 2\.8\), range\(0\.8, 2\.1\), range\(1\.5, 3\.2\)\]/,
    'hill scale must be known before its final lateral placement',
  );
  assert.match(ground, /const sightlineClearance = 20/);
  assert.match(ground, /const hillRadius = 12 \* Math\.max\(\.\.\.hillScale\)/);
  assert.match(
    ground,
    /const hillX = Math\.max\(lateralSeed, sightlineClearance \+ hillRadius\)/,
    'every scaled and rotated hill must keep its full radius outside the temple sightline',
  );
  assert.match(ground, /hill\.position\.set\(side \* hillX,/);
  assert.match(ground, /hill\.scale\.set\(\.\.\.hillScale\)/);
});

test('combined editorial masks preserve scene transmission at reading anchors', async () => {
  const css = await read('styles.css');
  const mobileCss = css.slice(css.indexOf('@media (max-width: 720px)'));
  const chapterRules = ['.chapter-wash', '.hero .chapter-wash', '.work .chapter-wash', '.contact .chapter-wash']
    .map((selector) => ruleBody(css, selector));
  const desktopHaze = ruleBody(css, '.scene-haze');
  const mobileHaze = ruleBody(mobileCss, '.scene-haze');

  const desktopText = combinedTransmission(desktopHaze, chapterRules, { x: 0.18, y: 0.48, width: 1440, height: 900 });
  const mobileText = combinedTransmission(mobileHaze, chapterRules, { x: 0.12, y: 0.48, width: 390, height: 844 });
  assert.ok(desktopText >= 0.35, `desktop text anchor transmission ${desktopText.toFixed(3)} must be >= 0.35`);
  assert.ok(mobileText >= 0.28, `mobile text anchor transmission ${mobileText.toFixed(3)} must be >= 0.28`);

  for (const [label, haze, viewport] of [
    ['desktop', desktopHaze, { width: 1440, height: 900 }],
    ['mobile', mobileHaze, { width: 390, height: 844 }],
  ]) {
    const center = combinedTransmission(haze, chapterRules, { x: 0.5, y: 0.5, ...viewport });
    const extremeLeft = combinedTransmission(haze, chapterRules, { x: 0, y: 0.5, ...viewport });
    assert.ok(center >= 0.7, `${label} center transmission ${center.toFixed(3)} must be >= 0.70`);
    assert.ok(extremeLeft >= 0.2, `${label} extreme-left transmission ${extremeLeft.toFixed(3)} must be >= 0.20`);
  }
});

test('ground fill remains restrained while exposure and bloom stay bounded', async () => {
  const scene = await read('scene.js');
  const luma = (hex) => perceivedLuminance(channels(hex));
  const earth = luma(materialColor(scene, 'earth'));
  const moss = luma(materialColor(scene, 'moss'));
  const foliage = luma(materialColor(scene, 'foliage'));
  const foliageCold = luma(materialColor(scene, 'foliageCold'));
  assert.ok(earth >= 0.1 && earth <= 0.18, 'earth must retain a dark readable floor value');
  assert.ok(moss >= 0.22 && moss <= 0.34, 'moss must stay visible without washing gray');
  assert.ok(foliage >= 0.23 && foliage <= 0.34, 'foliage must separate from the background');
  assert.ok(foliageCold >= foliage * 1.12 && foliageCold <= 0.4, 'cold foliage must preserve restrained separation');

  const hemisphere = scene.match(/new THREE\.HemisphereLight\(0x([\da-f]+),\s*0x([\da-f]+),\s*(\d*\.?\d+)\)/i);
  assert.ok(hemisphere, 'hemisphere colors and intensity must remain explicit');
  assert.ok(luma(Number.parseInt(hemisphere[1], 16)) >= 0.35 && luma(Number.parseInt(hemisphere[1], 16)) <= 0.52);
  assert.ok(luma(Number.parseInt(hemisphere[2], 16)) >= 0.14 && luma(Number.parseInt(hemisphere[2], 16)) <= 0.22);
  assert.ok(Number(hemisphere[3]) >= 1.35 && Number(hemisphere[3]) <= 1.6);

  const rim = scene.match(/const rim = new THREE\.DirectionalLight\(0x([\da-f]+),\s*(\d*\.?\d+)\)/i);
  assert.ok(rim, 'rim color and intensity must remain explicit');
  assert.ok(luma(Number.parseInt(rim[1], 16)) >= 0.25 && luma(Number.parseInt(rim[1], 16)) <= 0.5);
  assert.ok(Number(rim[2]) >= 1 && Number(rim[2]) <= 1.2);

  const exposure = numberFrom(scene, /toneMappingExposure\s*=\s*(\d*\.?\d+)/, 'tone mapping exposure');
  assert.ok(exposure >= 1.05 && exposure <= 1.25);
  const bloom = scene.match(/new UnrealBloomPass\(\s*new THREE\.Vector2\([^)]*\),\s*(\d*\.?\d+),\s*(\d*\.?\d+),\s*(\d*\.?\d+)\)/);
  assert.ok(bloom, 'bloom parameters must remain explicit');
  assert.ok(Number(bloom[1]) <= 0.35 && Number(bloom[2]) <= 0.6 && Number(bloom[3]) >= 0.7);
  assert.doesNotMatch(scene, /new THREE\.AmbientLight/);
});

test('global night base keeps blue-charcoal and fog above a readable luminance floor', async () => {
  const scene = await read('scene.js');
  const clear = hexFrom(scene, /setClearColor\(0x([\da-f]+),\s*1\)/i, 'renderer clear color');
  const background = hexFrom(scene, /scene\.background\s*=\s*new THREE\.Color\(0x([\da-f]+)\)/i, 'scene background');
  const fog = hexFrom(scene, /new THREE\.FogExp2\(0x([\da-f]+),/i, 'fog color');
  const luma = (hex) => perceivedLuminance(channels(hex));
  const isBlueCharcoal = (hex) => {
    const [red, green, blue] = channels(hex);
    return blue > green && green > red;
  };

  assert.equal(clear, background, 'renderer clear and scene background must share one night value');
  assert.ok(isBlueCharcoal(background), 'background must remain blue-charcoal');
  assert.ok(isBlueCharcoal(fog), 'fog must remain blue-gray');
  assert.ok(luma(background) >= 0.085 && luma(background) <= 0.13, `background luminance ${luma(background).toFixed(3)} must remain readable and nocturnal`);
  assert.ok(luma(fog) >= 0.18 && luma(fog) <= 0.28, `fog luminance ${luma(fog).toFixed(3)} must preserve depth without washing gray`);
  assert.ok(luma(fog) >= luma(background) * 1.8, 'fog must separate from the background by at least 1.8x');
});

test('global cold fill lifts the scene without ambient light or bloom escalation', async () => {
  const scene = await read('scene.js');
  const luma = (hex) => perceivedLuminance(channels(hex));
  const hemisphere = scene.match(/new THREE\.HemisphereLight\(0x([\da-f]+),\s*0x([\da-f]+),\s*(\d*\.?\d+)\)/i);
  const moonKey = scene.match(/const moonKey = new THREE\.DirectionalLight\(0x([\da-f]+),\s*(\d*\.?\d+)\)/i);
  const rim = scene.match(/const rim = new THREE\.DirectionalLight\(0x([\da-f]+),\s*(\d*\.?\d+)\)/i);
  assert.ok(hemisphere && moonKey && rim, 'cold fill lights must keep explicit colors and intensities');

  const hemisphereSky = luma(Number.parseInt(hemisphere[1], 16));
  const hemisphereGround = luma(Number.parseInt(hemisphere[2], 16));
  assert.ok(hemisphereSky >= 0.45 && hemisphereSky <= 0.55, `hemisphere sky luminance ${hemisphereSky.toFixed(3)} must stay readable and cold`);
  assert.ok(hemisphereGround >= 0.19 && hemisphereGround <= 0.25, `hemisphere ground luminance ${hemisphereGround.toFixed(3)} must retain a dark fill`);
  assert.ok(Number(hemisphere[3]) >= 1.55 && Number(hemisphere[3]) <= 1.65);

  const moonLuminance = luma(Number.parseInt(moonKey[1], 16));
  assert.ok(moonLuminance >= 0.68 && moonLuminance <= 0.78, `moon key luminance ${moonLuminance.toFixed(3)} must preserve cold highlights`);
  assert.ok(Number(moonKey[2]) >= 2.75 && Number(moonKey[2]) <= 3);

  const rimLuminance = luma(Number.parseInt(rim[1], 16));
  assert.ok(rimLuminance >= 0.4 && rimLuminance <= 0.5, `rim luminance ${rimLuminance.toFixed(3)} must separate silhouettes`);
  assert.ok(Number(rim[2]) >= 1.15 && Number(rim[2]) <= 1.25);

  const exposure = numberFrom(scene, /toneMappingExposure\s*=\s*(\d*\.?\d+)/, 'tone mapping exposure');
  assert.ok(exposure >= 1.16 && exposure <= 1.22, 'exposure lift must stay small and bounded');
  const bloom = scene.match(/new UnrealBloomPass\(\s*new THREE\.Vector2\([^)]*\),\s*(\d*\.?\d+),\s*(\d*\.?\d+),\s*(\d*\.?\d+)\)/);
  assert.ok(bloom, 'bloom parameters must remain explicit');
  assert.deepEqual(bloom.slice(1).map(Number), [0.28, 0.52, 0.86], 'global lift must not use bloom as a shortcut');
  assert.doesNotMatch(scene, /new THREE\.AmbientLight/);
});

test('narrower editorial masks raise global transmission while retaining text scrims', async () => {
  const css = await read('styles.css');
  const mobileCss = css.slice(css.indexOf('@media (max-width: 720px)'));
  const chapterRules = ['.chapter-wash', '.hero .chapter-wash', '.work .chapter-wash', '.contact .chapter-wash']
    .map((selector) => ruleBody(css, selector));
  const desktopHaze = ruleBody(css, '.scene-haze');
  const mobileHaze = ruleBody(mobileCss, '.scene-haze');
  const samples = [
    ['desktop', desktopHaze, { width: 1440, height: 900 }, 0.18, 0.62, 0.74],
    ['mobile', mobileHaze, { width: 390, height: 844 }, 0.12, 0.5, 0.68],
  ];

  for (const [label, haze, viewport, textX, textMinimum, textMaximum] of samples) {
    const textTransmission = combinedTransmission(haze, chapterRules, { x: textX, y: 0.48, ...viewport });
    const centerTransmission = combinedTransmission(haze, chapterRules, { x: 0.5, y: 0.5, ...viewport });
    const leftTransmission = combinedTransmission(haze, chapterRules, { x: 0, y: 0.5, ...viewport });
    assert.ok(textTransmission >= textMinimum && textTransmission <= textMaximum, `${label} text transmission ${textTransmission.toFixed(3)} must lift the scene while retaining a scrim`);
    assert.ok(centerTransmission >= 0.84, `${label} center transmission ${centerTransmission.toFixed(3)} must be >= 0.84`);
    assert.ok(leftTransmission >= 0.36 && leftTransmission <= 0.5, `${label} left transmission ${leftTransmission.toFixed(3)} must stay readable and protected`);
  }

  chapterRules.forEach((rule) => {
    const stops = gradientStops(rule, 90);
    assert.ok(stops[0].alpha >= 0.28 && stops[0].alpha <= 0.38, 'chapter wash must retain a restrained left scrim');
    assert.ok(stops.at(-1).alpha === 0 && stops.at(-1).position <= 66, 'chapter wash must clear the scene by 66%');
  });
});

test('mobile Experience and Contact headings keep a local scrim across their real text span', async () => {
  const css = await read('styles.css');
  const mobileBreakpoint = css.indexOf('@media (max-width: 720px)');
  const desktopCss = css.slice(0, mobileBreakpoint);
  const mobileCss = css.slice(mobileBreakpoint);
  const mobileHaze = ruleBody(mobileCss, '.scene-haze');
  const scrimSelectors = [
    '.experience .chapter-heading h2::before',
    '.contact h2::before',
  ];
  const scrimRule = listedRuleBody(mobileCss, scrimSelectors);
  const scrimStops = scrimRule
    ? gradientStops(scrimRule, 90)
    : [{ alpha: 0, position: 0 }, { alpha: 0, position: 100 }];
  const viewport = { width: 390, height: 844 };
  const headingBounds = { start: 20 / viewport.width, end: 0.88 };
  const chapters = [
    ['Experience', ruleBody(css, '.chapter-wash'), 0.28],
    ['Contact', ruleBody(css, '.contact .chapter-wash'), 0.43],
  ];

  for (const [label, chapterRule, headingY] of chapters) {
    for (const x of [0.5, 0.65, 0.8]) {
      const localPosition = ((x - headingBounds.start) / (headingBounds.end - headingBounds.start)) * 100;
      const sceneTransmission = combinedTransmission(mobileHaze, [chapterRule], { x, y: headingY, ...viewport });
      const headingTransmission = sceneTransmission * (1 - alphaAt(scrimStops, localPosition));
      assert.ok(
        headingTransmission >= 0.52 && headingTransmission <= 0.78,
        `${label} heading transmission at x=${x.toFixed(2)} is ${headingTransmission.toFixed(3)}; the real text span needs a restrained local scrim`,
      );
    }

    const nonHeadingCenter = combinedTransmission(mobileHaze, [chapterRule], { x: 0.5, y: 0.62, ...viewport });
    assert.ok(nonHeadingCenter >= 0.84, `${label} non-heading center must retain the global lift`);
  }

  assert.ok(scrimRule, 'mobile Experience and Contact headings must declare a shared local scrim');
  assert.equal(listedRuleBody(desktopCss, scrimSelectors), null, 'heading scrim must remain mobile-only');
  assert.doesNotMatch(mobileCss, /^\s*\.chapter-heading h2::before\s*\{/m, 'other chapter headings must not inherit the local scrim');
  assert.match(scrimRule, /position:\s*absolute/);
  assert.ok(alphaAt(scrimStops, 90) >= 0.16, 'local scrim must continue protecting the far end of the title');
  assert.ok(Math.max(...scrimStops.map(({ alpha }) => alpha)) <= 0.44, 'local scrim must not recreate a dark global wash');
});
