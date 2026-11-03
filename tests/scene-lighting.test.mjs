import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import * as THREE from '../assets/vendor/three/three.module.min.js';

import {
  LAB_PALETTE,
  collectSceneStats,
  createLaboratoryWorld,
} from '../lab-world.js';
import {
  configureRendererShadows,
  createLaboratoryReflectionEnvironment,
} from '../scene.js';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

function objectsWithRole(rootObject, role) {
  const matches = [];
  rootObject.traverse((object) => {
    if (object.userData.semanticRole === role) matches.push(object);
  });
  return matches;
}

function lightWithRole(rootObject, role) {
  let match = null;
  rootObject.traverse((object) => {
    if (!match && object.userData.lightRole === role) match = object;
  });
  return match;
}

test('soft shadows are enabled only for the High renderer profile', () => {
  for (const detailTier of ['high', 'balanced', 'low']) {
    const renderer = { shadowMap: { enabled: false, type: null } };
    configureRendererShadows(renderer, detailTier);
    assert.equal(renderer.shadowMap.enabled, detailTier === 'high');
    if (detailTier === 'high') assert.equal(renderer.shadowMap.type, THREE.PCFShadowMap);
  }
});

test('High uses one bounded key shadow while lower tiers skip the shadow pass', () => {
  for (const detailTier of ['high', 'balanced', 'low']) {
    const world = createLaboratoryWorld({ detailTier });
    const key = lightWithRole(world.root, 'laboratory-key');
    assert.ok(key?.isDirectionalLight);
    assert.equal(key.castShadow, detailTier === 'high');
    const shadowLights = [];
    world.root.traverse((object) => {
      if (object.isLight && object.castShadow) shadowLights.push(object);
    });
    assert.deepEqual(shadowLights, detailTier === 'high' ? [key] : []);

    const panes = objectsWithRole(world.root, 'oxygen-window-pane');
    assert.ok(panes.every((pane) => pane.castShadow === false), `${detailTier} glass must not cast`);
    const floor = objectsWithRole(world.root, 'laboratory-floor')[0];
    const shell = objectsWithRole(world.root, 'laboratory-left-shell')[0];
    assert.equal(floor.castShadow, false);
    assert.equal(floor.receiveShadow, true);
    assert.equal(shell.receiveShadow, true);

    const opaqueEquipment = [
      objectsWithRole(world.root, 'oxygen-shell-surface')[0],
      objectsWithRole(world.root, 'primegen-instrument-row')[0],
    ];
    assert.ok(opaqueEquipment.every(Boolean));
    assert.ok(opaqueEquipment.every((object) => object.castShadow === (detailTier === 'high')));

    if (detailTier === 'high') {
      assert.deepEqual(key.shadow.mapSize.toArray(), [1024, 1024]);
      assert.ok(key.shadow.camera.left <= -10 && key.shadow.camera.right >= 10);
      assert.ok(key.shadow.camera.bottom <= -10 && key.shadow.camera.top >= 10);
      assert.ok(key.shadow.camera.near > 0 && key.shadow.camera.far >= 40);
      assert.ok(key.target.position.z <= -12, 'the High shadow camera must reach the continuation corridor');
      assert.ok(key.shadow.bias < 0);
      assert.ok(key.shadow.normalBias > 0);
    }
    world.dispose();
  }
});

test('laboratory uses neutral white illumination and an explicit non-monochrome material system', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  const lights = [];
  world.root.traverse((object) => {
    if (object.isLight) lights.push(object);
  });

  assert.ok(lights.length >= 3);
  assert.ok(lights.some(({ userData }) => userData.lightRole === 'laboratory-ambient'));
  assert.ok(lights.some(({ userData }) => userData.lightRole === 'laboratory-key'));
  for (const light of lights) {
    const channels = [light.color.r, light.color.g, light.color.b];
    assert.ok(Math.max(...channels) - Math.min(...channels) <= 0.12, `${light.userData.lightRole} must stay neutral`);
  }

  assert.deepEqual(LAB_PALETTE, {
    floor: 0x252b30,
    graphite: 0x151b20,
    shell: 0xe7ecee,
    silver: 0x9aa6ad,
    smoked: 0x34434a,
    clear: 0xb9d4d8,
    cyan: 0x22c4c8,
    red: 0xc83c3c,
    upholstery: 0x69757b,
  });
  world.dispose();
});

test('physical equipment receives a local six-face studio reflection environment', () => {
  const drawCalls = [];
  const documentRef = {
    createElement(tagName) {
      assert.equal(tagName, 'canvas');
      const context = {
        fillStyle: '',
        fillRect(...values) {
          drawCalls.push({ fillStyle: this.fillStyle, values });
        },
      };
      return {
        width: 0,
        height: 0,
        getContext(type) {
          assert.equal(type, '2d');
          return context;
        },
      };
    },
  };

  const environment = createLaboratoryReflectionEnvironment(documentRef);
  assert.equal(environment.isCubeTexture, true);
  assert.equal(environment.images.length, 6);
  assert.ok(environment.images.every(({ width, height }) => width === 64 && height === 64));
  assert.equal(environment.colorSpace, THREE.SRGBColorSpace);
  assert.equal(environment.userData.environmentRole, 'laboratory-studio-reflection');
  assert.equal(environment.userData.gpuBytes, 64 * 64 * 4 * 6);
  assert.ok(drawCalls.length >= 18, 'each face needs a base, horizon and practical-light band');

  const world = createLaboratoryWorld({ detailTier: 'high' });
  const withoutEnvironment = collectSceneStats(world.root, { detailTier: 'high' });
  const withEnvironment = collectSceneStats(world.root, {
    detailTier: 'high',
    additionalTextures: [environment],
  });
  assert.equal(withEnvironment.textureBytes, withoutEnvironment.textureBytes + environment.userData.gpuBytes);
  assert.equal(withEnvironment.withinBudget, true);
  world.dispose();
  environment.dispose();
});

test('cyan is functional state and red appears only on emergency controls', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  let cyanCount = 0;
  let redCount = 0;

  world.root.traverse((object) => {
    if (!object.isMesh) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      if (material.userData.paletteRole === 'functional-cyan') {
        cyanCount += 1;
        assert.match(object.userData.semanticRole ?? '', /guide|status|queue|flow|sync|frame|light/);
      }
      if (material.userData.paletteRole === 'emergency-red') {
        redCount += 1;
        assert.equal(object.userData.semanticRole, 'emergency-stop');
      }
    }
  });

  assert.ok(cyanCount >= 5);
  assert.equal(redCount, 1);
  world.dispose();
});

test('every performance tier keeps equipment grounded and route guides visually restrained', () => {
  for (const detailTier of ['high', 'balanced', 'low']) {
    const world = createLaboratoryWorld({ detailTier });
    try {
      const contactShadows = objectsWithRole(world.root, 'laboratory-contact-shadow');
      assert.equal(contactShadows.length, 1);
      assert.equal(contactShadows[0].isInstancedMesh, true);
      assert.ok(contactShadows[0].count >= 6);
      assert.equal(contactShadows[0].material.transparent, true);
      assert.ok(contactShadows[0].material.opacity <= 0.22);
      assert.equal(contactShadows[0].material.depthWrite, false);

      for (const role of [
        'shared-axis-floor-guide',
        'continuation-corridor-floor-guide',
        'alab-floor-guide',
        'primegen-floor-guide',
        'oxygen-floor-guide',
        'cloud-floor-guide',
      ]) {
        const guide = objectsWithRole(world.root, role)[0];
        assert.equal(guide?.material.userData.paletteRole, 'navigation-guide');
        assert.ok((guide.material.emissiveIntensity ?? 0) <= 0.16);
      }
    } finally {
      world.dispose();
    }
  }
});

test('continuous ceiling fixtures are instanced and align the main and continuation legs', () => {
  const world = createLaboratoryWorld({ detailTier: 'balanced' });
  const mainFixtures = objectsWithRole(world.root, 'main-ceiling-light');
  const continuationFixtures = objectsWithRole(world.root, 'continuation-ceiling-light');

  assert.equal(mainFixtures.length, 1);
  assert.equal(continuationFixtures.length, 1);
  assert.equal(mainFixtures[0].isInstancedMesh, true);
  assert.equal(continuationFixtures[0].isInstancedMesh, true);
  assert.ok(mainFixtures[0].count >= 10);
  assert.ok(continuationFixtures[0].count >= 8);
  assert.equal(objectsWithRole(world.root, 'main-ceiling-rail').length, 1);
  assert.equal(objectsWithRole(world.root, 'continuation-ceiling-rail').length, 1);
  world.dispose();
});

test('runtime has no post-processing or periodic camera and device animation', async () => {
  const [scene, laboratory] = await Promise.all([read('scene.js'), read('lab-world.js')]);
  const runtime = `${scene}\n${laboratory}`;

  assert.doesNotMatch(runtime, /EffectComposer|RenderPass|OutputPass|UnrealBloomPass|WebGLRenderTarget/);
  assert.doesNotMatch(scene, /\bClock\b|Math\.(?:sin|cos)\s*\(/);
  assert.doesNotMatch(scene, /pointermove|clientX|clientY|damping|lerp\s*\(/i);
  assert.match(scene, /renderer\.render\(scene, camera\)/);
});
