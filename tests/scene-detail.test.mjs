import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import * as THREE from '../assets/vendor/three/three.module.min.js';
import {
  TEXTURE_GPU_LIMITS,
  applyMappedTextures,
  collectSceneStats,
  configureRuntimeTexture,
  createLaboratoryWorld,
  estimateTextureBytes,
  loadPublishedSceneTextures,
  selectPublishedSceneMedia,
} from '../lab-world.js';
import {
  SCENE_DETAIL_PROFILES,
  getPerformanceProfile,
  getSceneDetailProfile,
} from '../scene-model.js';

const manifestUrl = new URL('../assets/images/lab-media-manifest.json', import.meta.url);
const sculptSpecUrl = new URL('../.img2threejs/object-sculpt-spec.json', import.meta.url);
const oxygenActionPartIds = Object.freeze([
  'oxygen-rounded-shell',
  'oxygen-dark-front-frame',
  'oxygen-interior-assembly',
  'oxygen-base-frame',
  'oxygen-shell-side-depth',
  'oxygen-shell-top',
  'oxygen-shell-bottom',
  'oxygen-window-section',
  'oxygen-door-hardware',
  'oxygen-high-back-seat-left',
  'oxygen-high-back-seat-right',
  'oxygen-integrated-screen',
  'oxygen-status-line',
]);

function objectsWithRole(root, role) {
  const matches = [];
  root.traverse((object) => {
    if (object.userData.semanticRole === role) matches.push(object);
  });
  return matches;
}

function worldPosition(object) {
  return object.getWorldPosition(new THREE.Vector3());
}

test('img2threejs review harness isolates every equipment family with deterministic orbit views', async () => {
  const source = await readFile(new URL('../.img2threejs/review-harness.js', import.meta.url), 'utf8');
  assert.match(source, /params\.get\('model'\)/);
  for (const modelId of ['alab', 'primegen', 'oxygen', 'cloud-remote', 'cloud-handheld']) {
    assert.match(source, new RegExp(`['"]${modelId}['"]\\s*:`), `missing review subject ${modelId}`);
  }
  for (const viewId of ['front', 'three-quarter', 'side', 'rear']) {
    assert.match(source, new RegExp(`['"]${viewId}['"]\\s*:`), `missing deterministic view ${viewId}`);
  }
  assert.match(source, /traverseVisible\(/);
  assert.match(source, /isolateRoles:\s*\['cloud-remote-device-end',\s*'cloud-remote-consultation-end'\]/);
  assert.match(source, /createLaboratoryReflectionEnvironment\(document\)/);
  assert.match(source, /additionalTextures:\s*\[reflectionEnvironment\]/);
  assert.match(source, /window\.__interactive\s*=\s*false/);
  assert.match(source, /data(?:set)?\.model|dataset\.model/);
});

test('performance and detail tiers retain exact laboratory ceilings without geometry floors', () => {
  assert.equal(getPerformanceProfile({ width: 1440, hardwareConcurrency: 8 }).detailTier, 'high');
  assert.equal(getPerformanceProfile({ width: 1440, hardwareConcurrency: 8, reducedMotion: true }).detailTier, 'balanced');
  assert.equal(getPerformanceProfile({ width: 390, hardwareConcurrency: 8 }).detailTier, 'balanced');
  assert.equal(getPerformanceProfile({ width: 390, hardwareConcurrency: 8, reducedMotion: true }).detailTier, 'low');
  assert.equal(getPerformanceProfile({ width: 1440, hardwareConcurrency: 4 }).detailTier, 'balanced');

  const exact = {
    high: [110000, 180, 48, 20],
    balanced: [65000, 140, 40, 20],
    low: [35000, 110, 32, 20],
  };
  for (const [tier, expected] of Object.entries(exact)) {
    const profile = getSceneDetailProfile(tier);
    assert.equal(profile, SCENE_DETAIL_PROFILES[tier]);
    assert.deepEqual(Object.values(profile.budget), expected);
    assert.equal('minTriangles' in profile.budget, false);
    assert.equal(profile.laboratory.transparentLayers <= 2, true);
  }
});

test('each tier builds required laboratory structure inside real scene budgets', () => {
  const requiredRoles = [
    'continuous-laboratory',
    'shared-axis-floor-guide',
    'main-ceiling-rail',
    'entrance-sign',
    'continuation-glass-corridor',
    'alab-enclosure',
    'primegen-planning-console',
    'oxygen-rounded-shell',
    'cloud-compound-bay',
  ];

  for (const tier of ['high', 'balanced', 'low']) {
    const world = createLaboratoryWorld({ detailTier: tier });
    const stats = collectSceneStats(world.root, { detailTier: tier });
    const budget = getSceneDetailProfile(tier).budget;

    assert.equal(world.root.userData.worldId, 'continuous-laboratory');
    assert.ok(stats.triangles > 0);
    assert.ok(stats.drawables > 0);
    assert.ok(stats.instancedCount > 0, `${tier} must use instancing for repeated lab structure`);
    assert.ok(stats.triangles <= budget.maxTriangles, `${tier} triangle budget`);
    assert.ok(stats.drawables <= budget.maxDrawables, `${tier} drawable budget`);
    assert.ok(stats.geometries <= budget.maxGeometries, `${tier} geometry budget`);
    assert.ok(stats.materials <= budget.maxMaterials, `${tier} material budget`);
    assert.ok(stats.transparentDrawables <= 20, `${tier} transparent drawable budget`);
    assert.ok(stats.maxVisibilityLayers <= getSceneDetailProfile(tier).laboratory.transparentLayers);
    assert.ok(stats.textureBytes <= TEXTURE_GPU_LIMITS[tier]);
    assert.equal(stats.withinBudget, true);
    requiredRoles.forEach((role) => assert.ok(stats.semanticRoles.includes(role), `${tier} missing ${role}`));
    world.dispose();
  }
});

test('shared laboratory architecture reads as a built environment instead of an empty box', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  try {
    const requiredRoles = [
      'laboratory-ceiling-coffer',
      'laboratory-floor-joint',
      'laboratory-structural-column',
      'laboratory-glass-partition-frame',
      'laboratory-service-trunk',
      'laboratory-bay-task-light',
    ];

    for (const role of requiredRoles) {
      assert.ok(objectsWithRole(world.root, role).length > 0, `built environment missing ${role}`);
    }
    assert.ok(objectsWithRole(world.root, 'laboratory-ceiling-coffer')[0].isInstancedMesh);
    assert.ok(objectsWithRole(world.root, 'laboratory-floor-joint')[0].isInstancedMesh);
    assert.ok(objectsWithRole(world.root, 'laboratory-structural-column')[0].isInstancedMesh);
    assert.ok(objectsWithRole(world.root, 'laboratory-bay-task-light').every((light) => light.isSpotLight));
  } finally {
    world.dispose();
  }
});

test('oxygen chamber reconstruction uses rounded hard-surface geometry and tiered reference details', () => {
  const worlds = Object.fromEntries(
    ['high', 'balanced', 'low'].map((detailTier) => [detailTier, createLaboratoryWorld({ detailTier })]),
  );

  try {
    for (const [detailTier, world] of Object.entries(worlds)) {
      const roundedShells = objectsWithRole(world.root, 'oxygen-shell-surface');
      assert.ok(roundedShells.length >= 4, `${detailTier} must retain the chamber macro silhouette`);
      assert.ok(
        roundedShells.every((mesh) => mesh.geometry.userData.shapeFamily === 'rounded-box'),
        `${detailTier} chamber shell must use real rounded hard-surface geometry`,
      );
      const cornerReturns = objectsWithRole(world.root, 'oxygen-shell-radius');
      assert.equal(cornerReturns.length, 2);
      assert.ok(
        cornerReturns.every((mesh) => mesh.scale.z <= 0.5),
        `${detailTier} corner returns must stay attached instead of projecting as long rails`,
      );
    }

    const balancedRoles = collectSceneStats(worlds.balanced.root, { detailTier: 'balanced' }).semanticRoles;
    const highRoles = collectSceneStats(worlds.high.root, { detailTier: 'high' }).semanticRoles;
    const lowRoles = collectSceneStats(worlds.low.root, { detailTier: 'low' }).semanticRoles;

    for (const role of ['oxygen-door-hinge', 'oxygen-shell-reveal']) {
      assert.ok(balancedRoles.includes(role), `standard equipment detail must include ${role}`);
      assert.equal(lowRoles.includes(role), false, `essential equipment detail must omit ${role}`);
    }
    for (const role of ['oxygen-seat-armrest', 'oxygen-seat-headrest', 'oxygen-seat-foot']) {
      assert.ok(highRoles.includes(role), `full equipment detail must include ${role}`);
      assert.equal(balancedRoles.includes(role), false, `standard equipment detail must omit ${role}`);
    }

    const highStats = collectSceneStats(worlds.high.root, { detailTier: 'high' });
    const balancedStats = collectSceneStats(worlds.balanced.root, { detailTier: 'balanced' });
    const lowStats = collectSceneStats(worlds.low.root, { detailTier: 'low' });
    assert.ok(highStats.triangles > balancedStats.triangles);
    assert.ok(balancedStats.triangles > lowStats.triangles);
    assert.ok(highStats.drawables > balancedStats.drawables);
    assert.ok(balancedStats.drawables > lowStats.drawables);
  } finally {
    Object.values(worlds).forEach((world) => world.dispose());
  }
});

test('reference material classes use physically expressive material parameters', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  try {
    for (const materialId of ['shell', 'silver', 'glass', 'upholstery']) {
      assert.equal(
        world.materials[materialId].isMeshPhysicalMaterial,
        true,
        `${materialId} must use MeshPhysicalMaterial`,
      );
    }
    assert.ok(world.materials.shell.clearcoat >= 0.35);
    assert.ok(world.materials.silver.metalness >= 0.7);
    assert.ok(world.materials.glass.transmission >= 0.35);
    assert.equal(world.materials.glass.depthWrite, false);
    assert.ok(world.materials.upholstery.sheen >= 0.25);
    const panes = objectsWithRole(world.root, 'oxygen-window-pane');
    assert.equal(panes.length, 3);
    const smokedPanes = panes.filter(({ material }) => material.userData.paletteRole === 'smoked-glass');
    const clearPanes = panes.filter(({ material }) => material.userData.paletteRole === 'necessary-glass');
    assert.equal(smokedPanes.length, 1);
    assert.equal(clearPanes.length, 2);
    assert.ok(smokedPanes[0].material.opacity > clearPanes[0].material.opacity);
  } finally {
    world.dispose();
  }
});

test('procedural PBR micro-surfaces use independent linear textures and dispose with the world', () => {
  const textureSizes = { high: 1024, balanced: 512, low: 256 };

  for (const detailTier of ['high', 'balanced', 'low']) {
    const world = createLaboratoryWorld({ detailTier });
    const expectedSize = textureSizes[detailTier];
    const bindings = [
      [world.materials.shell, 'roughnessMap', 'painted-shell', 'roughness'],
      [world.materials.shell, 'normalMap', 'painted-shell', 'normal'],
      [world.materials.silver, 'roughnessMap', 'brushed-metal', 'roughness'],
      [world.materials.silver, 'normalMap', 'brushed-metal', 'normal'],
      [world.materials.upholstery, 'roughnessMap', 'woven-upholstery', 'roughness'],
      [world.materials.upholstery, 'normalMap', 'woven-upholstery', 'normal'],
    ];

    assert.equal(world.proceduralTextures.size, bindings.length);
    for (const [material, mapSlot, surfaceRole, pbrChannel] of bindings) {
      const texture = material[mapSlot];
      assert.equal(texture?.isDataTexture, true, `${surfaceRole} ${pbrChannel} must be procedural data`);
      assert.equal(texture.colorSpace, THREE.NoColorSpace, `${pbrChannel} data must stay linear`);
      assert.equal(texture.generateMipmaps, false);
      assert.equal(texture.image.width, expectedSize);
      assert.equal(texture.image.height, expectedSize);
      assert.equal(texture.userData.surfaceRole, surfaceRole);
      assert.equal(texture.userData.pbrChannel, pbrChannel);
      assert.equal(texture.userData.independentFromAlbedo, true);
      assert.equal(texture.userData.gpuBytes, estimateTextureBytes(expectedSize, expectedSize, false));
      assert.notEqual(texture, material.map, `${pbrChannel} must not reuse albedo`);
      const samples = new Set();
      const sampleStride = Math.max(4, Math.floor(texture.image.data.length / 1024 / 4) * 4);
      for (let offset = pbrChannel === 'roughness' ? 1 : 0; offset < texture.image.data.length; offset += sampleStride) {
        samples.add(texture.image.data[offset]);
        if (pbrChannel === 'normal') samples.add(texture.image.data[offset + 1]);
      }
      assert.ok(samples.size >= 8, `${surfaceRole} ${pbrChannel} must contain real variation`);
    }
    assert.notEqual(world.materials.shell.roughnessMap, world.materials.shell.normalMap);
    assert.notEqual(world.materials.silver.roughnessMap, world.materials.silver.normalMap);
    assert.notEqual(world.materials.upholstery.roughnessMap, world.materials.upholstery.normalMap);
    assert.notEqual(world.materials.shell.roughnessMap.image.data, world.materials.shell.normalMap.image.data);
    assert.notEqual(world.materials.silver.roughnessMap.image.data, world.materials.silver.normalMap.image.data);
    assert.notEqual(world.materials.upholstery.roughnessMap.image.data, world.materials.upholstery.normalMap.image.data);

    const stats = collectSceneStats(world.root, { detailTier });
    assert.equal(stats.textureBytes, bindings.length * estimateTextureBytes(expectedSize, expectedSize, false));
    assert.equal(stats.withinBudget, true);

    let disposeCount = 0;
    world.proceduralTextures.forEach((texture) => {
      texture.addEventListener('dispose', () => { disposeCount += 1; });
    });
    world.dispose();
    world.dispose();
    assert.equal(disposeCount, bindings.length, 'procedural textures dispose exactly once');
  }
});

test('world exposes an animation-ready semantic hierarchy for the rebuilt equipment', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  try {
    const runtime = world.root.userData.sculptRuntime;
    assert.equal(runtime.version, 1);
    assert.equal(runtime.rootRole, 'continuous-laboratory');
    assert.ok(runtime.parts.includes('oxygen-rounded-shell'));
    assert.ok(runtime.parts.includes('alab-robot-arm'));
    assert.equal(runtime.rigType, 'action-ready-static-rig');
    assert.doesNotThrow(() => JSON.stringify(runtime), 'root sculpt metadata must stay serializable');
    assert.ok(Array.isArray(runtime.nodes));
    const doorNode = runtime.nodes.find(({ id }) => id === 'oxygen-door-hardware');
    assert.equal(doorNode.nodeType, 'group');
    assert.equal(doorNode.parentRole, 'oxygen-dark-front-frame');
    assert.equal(doorNode.actionProfile.animationRole, 'door-control');
    assert.deepEqual(doorNode.transform.position, [1.93, 0, 1.47]);
    assert.deepEqual(doorNode.actionProfile.pivot, {
      mode: 'group-origin',
      localPosition: [0, 0, 0],
      axis: [0, 1, 0],
    });
    assert.deepEqual(runtime.sockets['oxygen-door'], {
      parentRole: 'oxygen-door-hardware',
      position: [0, 0, 0],
      axis: [0, 1, 0],
    });
    assert.deepEqual(runtime.sockets['oxygen-door-hinge'], {
      parentRole: 'oxygen-door-hardware',
      position: [0, 1.47, 0],
      axis: [0, 1, 0],
    });
    assert.deepEqual(runtime.sockets['oxygen-left-seat'], {
      parentRole: 'oxygen-interior-assembly',
      position: [-0.72, 0, 0.2],
    });
    assert.deepEqual(runtime.sockets['oxygen-integrated-screen'], {
      parentRole: 'oxygen-integrated-screen',
      position: [0, 0, 0],
    });

    for (const partId of [
      'oxygen-rounded-shell',
      'oxygen-dark-front-frame',
      'oxygen-window-section',
      'oxygen-door-hardware',
      'oxygen-high-back-seat-left',
    ]) {
      const collider = runtime.colliders[partId];
      assert.equal(collider.type, 'box');
      assert.equal(collider.proxy, true);
      assert.equal(collider.isTrigger, false);
      assert.equal(collider.size.length, 3);
      assert.ok(collider.size.every((dimension) => dimension > 0));
      assert.deepEqual(runtime.destruction[partId], {
        breakable: false,
        fractureGroup: partId,
        seamRefs: [],
        detachableFragments: [],
        breakImpulse: 0,
      });
    }
    assert.deepEqual(runtime.destructionPolicy, {
      mode: 'metadata-only',
      defaultBreakable: false,
      debrisStrategy: 'detach-semantic-groups',
    });
    assert.ok(world.sculptRuntime.nodes.get('oxygen-rounded-shell')?.isGroup);
    assert.ok(world.sculptRuntime.nodes.get('alab-robot-arm')?.isGroup);
    assert.equal(world.sculptRuntime.metadata, runtime);
    assert.deepEqual(
      world.sculptRuntime.nodes.get('oxygen-door-hardware').userData.actionProfile,
      doorNode.actionProfile,
    );
    for (const partId of [
      'oxygen-rounded-shell',
      'oxygen-dark-front-frame',
      'oxygen-interior-assembly',
      'oxygen-base-frame',
      'oxygen-shell-side-depth',
      'oxygen-shell-top',
      'oxygen-shell-bottom',
      'oxygen-window-section',
      'oxygen-door-hardware',
      'oxygen-high-back-seat-left',
      'oxygen-high-back-seat-right',
      'oxygen-integrated-screen',
      'oxygen-status-line',
    ]) {
      assert.ok(world.sculptRuntime.nodes.get(partId), `sculpt runtime missing ${partId}`);
    }
  } finally {
    world.dispose();
    assert.equal(world.sculptRuntime.nodes.size, 0, 'dispose clears live Object3D handles');
  }
});

test('oxygen door group rotates its real panel about the right hinge axis', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  try {
    const door = world.sculptRuntime.nodes.get('oxygen-door-hardware');
    const shell = world.sculptRuntime.nodes.get('oxygen-rounded-shell');
    const hinges = objectsWithRole(door, 'oxygen-door-hinge');
    const [handle] = objectsWithRole(door, 'oxygen-door-handle');
    const [pane] = objectsWithRole(door, 'oxygen-window-pane');
    const screen = world.sculptRuntime.nodes.get('oxygen-integrated-screen');
    const doorFrame = objectsWithRole(door, 'oxygen-door-frame-member');

    assert.equal(door?.isGroup, true);
    assert.equal(hinges.length, 3);
    assert.ok(handle);
    assert.ok(pane, 'the actual right glass pane belongs to the door pivot');
    assert.equal(screen?.parent, door, 'integrated screen belongs to the moving door');
    assert.deepEqual(screen.position.toArray(), [-0.43, 2.26, -0.01]);
    assert.ok(doorFrame.length >= 4, 'the moving pane retains its necessary frame');
    assert.equal(pane.parent, door);
    assert.ok(doorFrame.every((member) => member.parent === door));

    world.root.updateMatrixWorld(true);
    const pivotBefore = worldPosition(door);
    const shellOrigin = worldPosition(shell);
    const hingeBefore = hinges.map(worldPosition);
    const handleBefore = worldPosition(handle);
    const paneBefore = worldPosition(pane);
    const screenBefore = worldPosition(screen);
    assert.ok(screenBefore.distanceTo(new THREE.Vector3(-4.3, 2.26, -7.64)) < 1e-8, 'closed screen world pose stays unchanged');
    assert.ok(pivotBefore.distanceTo(shellOrigin) > 1.5, 'door pivot must be at the right hinge, not chamber center');

    door.rotation.y = Math.PI / 4;
    world.root.updateMatrixWorld(true);
    const pivotAfter = worldPosition(door);
    const handleAfter = worldPosition(handle);
    const paneAfter = worldPosition(pane);
    const screenAfter = worldPosition(screen);

    assert.ok(pivotAfter.distanceTo(pivotBefore) < 1e-8, 'door pivot stays fixed while rotating');
    hinges.forEach((hinge, index) => {
      assert.ok(worldPosition(hinge).distanceTo(hingeBefore[index]) < 1e-8, 'hinge axis stays fixed');
    });
    assert.ok(handleAfter.distanceTo(handleBefore) > 0.05, 'handle follows the rotating door');
    assert.ok(handleAfter.distanceTo(handleBefore) < 0.3, 'handle rotates locally instead of orbiting chamber center');
    assert.ok(paneAfter.distanceTo(paneBefore) > 0.3, 'right door pane follows the rotating door');
    assert.ok(screenAfter.distanceTo(screenBefore) > 0.2, 'integrated screen follows the rotating door');
    assert.ok(Math.abs(handleAfter.distanceTo(pivotAfter) - handleBefore.distanceTo(pivotBefore)) < 1e-8);
    assert.ok(Math.abs(paneAfter.distanceTo(pivotAfter) - paneBefore.distanceTo(pivotBefore)) < 1e-8);
    assert.ok(Math.abs(screenAfter.distanceTo(pivotAfter) - screenBefore.distanceTo(pivotBefore)) < 1e-8);
  } finally {
    world.dispose();
  }
});

test('sculpt spec interaction hierarchy and proxies match production metadata', async () => {
  const spec = JSON.parse(await readFile(sculptSpecUrl, 'utf8'));
  const components = new Map(spec.componentTree.map((component) => [component.id, component]));
  const world = createLaboratoryWorld({ detailTier: 'high' });
  try {
    const runtime = world.root.userData.sculptRuntime;
    const runtimeNodes = new Map(runtime.nodes.map((node) => [node.id, node]));
    assert.deepEqual(Object.keys(runtime.colliders).sort(), [...oxygenActionPartIds].sort());
    let comparedParts = 0;
    for (const partId of oxygenActionPartIds) {
      const component = components.get(partId);
      const runtimeNode = runtimeNodes.get(partId);
      assert.ok(component, `spec missing ${partId}`);
      assert.equal(component.parent, runtimeNode.parentRole, `${partId} parent`);
      assert.deepEqual(component.transform, runtimeNode.transform, `${partId} Group transform`);
      assert.equal(component.actionProfile.animationRole, runtimeNode.actionProfile.animationRole);
      assert.deepEqual(component.actionProfile.pivot, runtimeNode.actionProfile.pivot);
      assert.deepEqual(component.actionProfile.transformChannels, runtimeNode.actionProfile.transformChannels);
      assert.equal(component.actionProfile.collider.type, runtime.colliders[partId].type);
      assert.deepEqual(component.actionProfile.collider.offset, runtime.colliders[partId].offset);
      assert.deepEqual(component.actionProfile.collider.scale, runtime.colliders[partId].size);
      assert.equal(component.actionProfile.collider.isTrigger, runtime.colliders[partId].isTrigger);
      assert.equal(component.actionProfile.destruction.breakable, runtime.destruction[partId].breakable);
      assert.equal(component.actionProfile.destruction.fractureGroup, runtime.destruction[partId].fractureGroup);
      assert.equal(component.actionProfile.destruction.breakImpulse, runtime.destruction[partId].breakImpulse);
      comparedParts += 1;
    }
    assert.equal(comparedParts, 13, 'all action-ready Oxygen components must match production');
    assert.deepEqual(components.get('oxygen-integrated-screen').actionProfile.sockets, [{
      id: 'screen-center',
      localPosition: [0, 0, 0],
      localRotation: [0, 0, 0],
    }]);
  } finally {
    world.dispose();
  }
});

test('scene stats traverse geometry and multiply indexed triangles by InstancedMesh count', () => {
  const root = new THREE.Group();
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial();
  const instances = new THREE.InstancedMesh(geometry, material, 4);
  instances.userData.semanticRole = 'fixture-row';
  root.add(instances);

  const stats = collectSceneStats(root, { detailTier: 'low' });
  const trianglesPerBox = geometry.index.count / 3;
  assert.equal(stats.triangles, trianglesPerBox * 4);
  assert.equal(stats.drawables, 1);
  assert.equal(stats.geometries, 1);
  assert.equal(stats.materials, 1);
  assert.equal(stats.instancedCount, 4);
  assert.deepEqual(stats.semanticRoles, ['fixture-row']);
});

test('manifest gate selects only published approved physical screen mappings', async () => {
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
  const selected = selectPublishedSceneMedia(manifest);

  assert.deepEqual([...selected.keys()], [
    'physical-integrated-screen',
    'physical-control-console',
    'physical-dual-monitor-workstation',
    'semantic-foreground-phone-or-tablet',
  ]);
  assert.equal(selected.has('semantic-foreground-phone'), false, 'Oxygen mini program stays semantic foreground only');
  for (const item of selected.values()) {
    assert.equal(item.authStatus, 'APPROVED');
    assert.equal(item.publicationStatus, 'PUBLISHED');
    assert.match(item.path, /^\.\/assets\/images\/[a-z0-9-]+\.webp$/);
    assert.ok(Math.max(item.width, item.height) <= 1024);
  }
});

function publishedMediaItem({
  id,
  mapping,
  width = 64,
  height = 32,
}) {
  return {
    id,
    mapping,
    width,
    height,
    path: `./assets/images/${id}.webp`,
    authStatus: 'APPROVED',
    publicationStatus: 'PUBLISHED',
  };
}

function disposableTexture() {
  const texture = new THREE.Texture({ width: 64, height: 32 });
  let disposeCount = 0;
  texture.dispose = () => { disposeCount += 1; };
  return { texture, get disposeCount() { return disposeCount; } };
}

test('manifest texture dimensions must be positive finite integers no larger than 1024', () => {
  const mapping = 'physical-integrated-screen';
  const candidates = [
    publishedMediaItem({ id: 'negative-width', mapping, width: -1 }),
    publishedMediaItem({ id: 'zero-height', mapping, height: 0 }),
    publishedMediaItem({ id: 'fractional-width', mapping, width: 63.5 }),
    publishedMediaItem({ id: 'nan-width', mapping, width: Number.NaN }),
    publishedMediaItem({ id: 'infinite-height', mapping, height: Number.POSITIVE_INFINITY }),
    publishedMediaItem({ id: 'oversized', mapping, width: 1025 }),
  ];

  for (const item of candidates) {
    assert.equal(
      selectPublishedSceneMedia({ media: [item] }).size,
      0,
      `${item.id} must fail the runtime texture gate`,
    );
  }
  assert.equal(
    selectPublishedSceneMedia({ media: [publishedMediaItem({ id: 'valid-size', mapping, width: 1024, height: 1 })] }).size,
    1,
  );
});

test('texture loaded before configuration failure is disposed and rejection reaches the caller', async () => {
  const probe = disposableTexture();
  probe.texture.userData = Object.freeze({});
  const manifest = { media: [publishedMediaItem({ id: 'configure-failure', mapping: 'physical-integrated-screen' })] };
  const textureLoader = { loadAsync: async () => probe.texture };

  await assert.rejects(
    loadPublishedSceneTextures(manifest, { textureLoader }),
    (error) => error instanceof AggregateError && /laboratory scene textures/i.test(error.message),
  );
  assert.equal(probe.disposeCount, 1);
});

test('texture loader transport failures reject instead of returning an empty map', async () => {
  const manifest = { media: [publishedMediaItem({ id: 'missing-screen', mapping: 'physical-integrated-screen' })] };
  const textureLoader = { loadAsync: async () => { throw new Error('404 missing-screen'); } };
  let resolved = false;

  await assert.rejects(
    loadPublishedSceneTextures(manifest, { textureLoader }).then(() => { resolved = true; }),
    (error) => error instanceof AggregateError
      && error.errors.some((cause) => /404 missing-screen/.test(cause.message)),
  );
  assert.equal(resolved, false);
});

test('mixed texture batches dispose fulfilled textures and never return a partial map', async () => {
  const success = disposableTexture();
  const manifest = {
    media: [
      publishedMediaItem({ id: 'successful-screen', mapping: 'physical-integrated-screen' }),
      publishedMediaItem({ id: 'failed-screen', mapping: 'physical-dual-monitor-workstation' }),
    ],
  };
  const textureLoader = {
    loadAsync: async (url) => {
      if (url.includes('failed-screen')) throw new Error('404 failed-screen');
      return success.texture;
    },
  };
  let returnedMap = null;

  await assert.rejects(
    loadPublishedSceneTextures(manifest, { textureLoader }).then((loaded) => { returnedMap = loaded; }),
    (error) => error instanceof AggregateError && error.errors.length === 1,
  );
  assert.equal(success.disposeCount, 1);
  assert.equal(returnedMap, null);
});

test('runtime texture configuration disables mipmaps and uses the explicit GPU formula', () => {
  assert.equal(estimateTextureBytes(1024, 658, false), 1024 * 658 * 4);
  assert.equal(estimateTextureBytes(12, 10, true), 12 * 10 * 4 * 4 / 3);

  const texture = new THREE.Texture({ width: 1024, height: 658 });
  const configured = configureRuntimeTexture(texture, { width: 1024, height: 658 });
  assert.equal(configured, texture);
  assert.equal(texture.colorSpace, THREE.SRGBColorSpace);
  assert.equal(texture.generateMipmaps, false);
  assert.equal(texture.minFilter, THREE.LinearFilter);
  assert.equal(texture.magFilter, THREE.LinearFilter);
  assert.equal(texture.userData.gpuBytes, 1024 * 658 * 4);
  assert.throws(
    () => configureRuntimeTexture(new THREE.Texture(), { width: 1025, height: 400 }),
    /longest edge.*1024/i,
  );
  assert.throws(
    () => configureRuntimeTexture(new THREE.Texture(), { width: 12.5, height: 10 }),
    /positive integer dimensions/i,
  );
});

test('scene stats account for every mapped screen texture without mip overhead', () => {
  const world = createLaboratoryWorld({ detailTier: 'low' });
  const proceduralBytes = collectSceneStats(world.root, { detailTier: 'low' }).textureBytes;
  const definitions = [
    ['physical-integrated-screen', 1024, 580],
    ['physical-control-console', 1024, 716],
    ['physical-dual-monitor-workstation', 1024, 658],
    ['semantic-foreground-phone-or-tablet', 498, 1024],
  ];
  const textures = new Map(definitions.map(([mapping, width, height]) => [
    mapping,
    configureRuntimeTexture(new THREE.Texture({ width, height }), { width, height }),
  ]));
  applyMappedTextures(world, textures);

  const stats = collectSceneStats(world.root, { detailTier: 'low' });
  const expectedBytes = definitions.reduce(
    (total, [, width, height]) => total + estimateTextureBytes(width, height, false),
    0,
  );
  assert.equal(stats.textureBytes, expectedBytes + proceduralBytes);
  assert.equal(stats.maxTextureEdge, 1024);
  assert.ok(stats.textureBytes < TEXTURE_GPU_LIMITS.low);
  assert.equal(stats.withinBudget, true);
  world.dispose();
});
