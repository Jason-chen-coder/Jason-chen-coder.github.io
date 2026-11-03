import assert from 'node:assert/strict';
import test from 'node:test';

import * as THREE from '../assets/vendor/three/three.module.min.js';
import {
  collectSceneStats,
  createLaboratoryWorld,
} from '../lab-world.js';
import { getSceneDetailProfile } from '../scene-model.js';

function objectsWithRole(root, role) {
  const matches = [];
  root.traverse((object) => {
    if (object.userData.semanticRole === role) matches.push(object);
  });
  return matches;
}

function objectWithRole(root, role) {
  return objectsWithRole(root, role)[0];
}

function isDescendantOf(object, ancestor) {
  let cursor = object?.parent;
  while (cursor) {
    if (cursor === ancestor) return true;
    cursor = cursor.parent;
  }
  return false;
}

function matrixScales(instancedMesh) {
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const scales = [];
  for (let index = 0; index < instancedMesh.count; index += 1) {
    instancedMesh.getMatrixAt(index, matrix);
    matrix.decompose(position, quaternion, scale);
    scales.push(scale.toArray().map((value) => Number(value.toFixed(3))));
  }
  return scales;
}

function matrixTransforms(instancedMesh) {
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const transforms = [];
  for (let index = 0; index < instancedMesh.count; index += 1) {
    instancedMesh.getMatrixAt(index, matrix);
    matrix.decompose(position, quaternion, scale);
    transforms.push({ position: position.clone(), scale: scale.clone() });
  }
  return transforms;
}

function worldBounds(object) {
  object.updateWorldMatrix(true, true);
  return new THREE.Box3().setFromObject(object);
}

function worldSize(object) {
  return worldBounds(object).getSize(new THREE.Vector3());
}

test('AlphaLab is a nested six-axis arm with tapered links, wrist tooling and analyzer depth', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  try {
    const arm = objectWithRole(world.root, 'alab-robot-arm');
    const axes = Array.from({ length: 6 }, (_, index) => objectWithRole(arm, `alab-robot-axis-${index + 1}`));
    assert.ok(axes.every((axis) => axis?.isGroup), 'all six articulated axis groups must exist');
    axes.forEach((axis, index) => assert.equal(axis.userData.axisIndex, index + 1));
    for (let index = 1; index < axes.length; index += 1) {
      assert.equal(isDescendantOf(axes[index], axes[index - 1]), true, `axis ${index + 1} must descend from axis ${index}`);
    }

    const links = objectsWithRole(arm, 'alab-robot-link');
    assert.ok(links.length >= 4);
    assert.ok(links.every(({ geometry }) => ['rounded-box', 'tapered-cylinder'].includes(geometry.userData.shapeFamily)));

    const wrist = objectWithRole(arm, 'alab-robot-wrist');
    const endEffector = objectWithRole(arm, 'alab-end-effector');
    const samplePlate = objectWithRole(arm, 'alab-robot-sample-plate');
    assert.ok(wrist?.isGroup);
    assert.ok(endEffector?.isGroup);
    assert.ok(samplePlate?.isMesh);
    assert.equal(isDescendantOf(endEffector, wrist), true);
    assert.equal(isDescendantOf(samplePlate, endEffector), true);

    const analyzer = objectWithRole(world.root, 'alab-analyzer');
    const analyzerDepth = objectWithRole(analyzer, 'alab-analyzer-depth-detail');
    assert.equal(analyzerDepth?.isInstancedMesh, true);
    assert.ok(analyzerDepth.count >= 3);
  } finally {
    world.dispose();
  }
});

test('AlphaLab uses white joint covers, restrained dark seams and strongly tapered links', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  try {
    const arm = objectWithRole(world.root, 'alab-robot-arm');
    const covers = objectWithRole(arm, 'alab-robot-joint');
    const seams = objectWithRole(arm, 'alab-robot-joint-seam');
    assert.equal(covers?.isInstancedMesh, true);
    assert.equal(covers.count, 6);
    assert.equal(covers.material.userData.paletteRole, 'equipment-shell');
    assert.equal(seams?.isInstancedMesh, true);
    assert.equal(seams.count, 6);
    assert.equal(seams.material.userData.paletteRole, 'graphite-structure');
    const coverScales = matrixScales(covers);
    const seamScales = matrixScales(seams);
    seamScales.forEach((scale, index) => {
      assert.ok(scale[0] <= coverScales[index][0] * 0.8, 'joint seam must remain subordinate to its white cover');
    });

    const links = objectsWithRole(arm, 'alab-robot-link');
    assert.ok(links.every(({ geometry }) => geometry.parameters.radiusTop / geometry.parameters.radiusBottom <= 0.65));
  } finally {
    world.dispose();
  }
});

test('PrimeGen reads as a dual-screen tower with gantry, pipetting head, deck and varied modules', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  try {
    const bay = objectWithRole(world.root, 'primegen-bay');
    const screens = objectWithRole(bay, 'primegen-planning-screen');
    assert.equal(screens?.isInstancedMesh, true);
    assert.equal(screens.count, 2);

    const gantry = objectWithRole(bay, 'primegen-gantry');
    const head = objectWithRole(bay, 'primegen-pipetting-head');
    const nozzles = objectWithRole(bay, 'primegen-pipette-nozzle');
    const deck = objectWithRole(bay, 'primegen-deck-array');
    const plates = objectWithRole(deck, 'primegen-labware-plate');
    assert.ok(gantry?.isGroup);
    assert.ok(head?.isGroup && isDescendantOf(head, gantry));
    assert.equal(nozzles?.isInstancedMesh, true);
    assert.ok(nozzles.count >= 4);
    assert.ok(deck?.isGroup);
    assert.equal(plates?.isInstancedMesh, true);
    assert.ok(plates.count >= 6);

    const modules = objectWithRole(bay, 'primegen-instrument-row');
    assert.equal(modules?.isInstancedMesh, true);
    assert.ok(new Set(matrixScales(modules).map((scale) => scale.join(','))).size >= 3);
  } finally {
    world.dispose();
  }
});

test('PrimeGen refines into a tall tower, white central analyzer and low rail deck', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  try {
    const bay = objectWithRole(world.root, 'primegen-bay');
    const towerBody = objectWithRole(bay, 'primegen-tower-body');
    const towerSize = worldSize(towerBody);
    assert.ok(towerSize.y >= towerSize.x * 1.9, 'dual-screen tower must read tall rather than blocky');
    assert.ok(towerSize.z <= towerSize.x * 0.72, 'tower depth must stay visually narrow');

    const analyzer = objectWithRole(bay, 'primegen-central-analyzer');
    assert.ok(analyzer?.isMesh, 'central analyzer must be a distinct white module');
    assert.equal(analyzer.material.userData.paletteRole, 'equipment-shell');

    const deck = objectWithRole(bay, 'primegen-deck-array');
    const deckRail = objectWithRole(deck, 'primegen-deck-rail');
    assert.equal(deckRail?.isInstancedMesh, true);
    assert.ok(deckRail.count >= 7);
    assert.ok(worldSize(deck).y < worldSize(towerBody).y * 0.2, 'plate deck must stay low');

    const gantryFrame = objectWithRole(bay, 'primegen-gantry-frame');
    const frameScales = matrixScales(gantryFrame);
    assert.ok(frameScales.every((scale) => Math.min(scale[0], scale[1]) <= 0.08), 'gantry supports must stay slender');
  } finally {
    world.dispose();
  }
});

test('PrimeGen deck exposes plate lanes and the pipetting head reads as a hardware carriage', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  try {
    const bay = objectWithRole(world.root, 'primegen-bay');
    const deck = objectWithRole(bay, 'primegen-deck-array');
    const rails = objectWithRole(deck, 'primegen-deck-rail');
    assert.equal(rails?.isInstancedMesh, true);
    assert.ok(rails.count >= 7);
    const railScales = matrixScales(rails);
    assert.ok(railScales.filter(([x, , z]) => x >= z * 4).length >= 2, 'deck must retain two longitudinal rails');
    assert.ok(railScales.filter(([x, , z]) => z >= x * 4).length >= 5, 'deck must expose transverse plate lanes');

    const gantryFrame = objectWithRole(bay, 'primegen-gantry-frame');
    assert.ok(gantryFrame.count >= 4, 'gantry needs rail, upright and carriage supports');
    const head = objectWithRole(bay, 'primegen-pipetting-head');
    const hardware = objectWithRole(head, 'primegen-pipetting-head-hardware');
    const shell = objectWithRole(head, 'primegen-pipetting-head-shell');
    const nozzles = objectWithRole(head, 'primegen-pipette-nozzle');
    assert.ok(hardware?.isGroup);
    assert.equal(isDescendantOf(shell, hardware), true);
    assert.equal(isDescendantOf(nozzles, hardware), true);
  } finally {
    world.dispose();
  }
});

test('Cloud Remote contains two complete and visibly distinct mobile systems', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  try {
    const device = objectWithRole(world.root, 'cloud-remote-device-end');
    const consultation = objectWithRole(world.root, 'cloud-remote-consultation-end');
    assert.equal(device.userData.mobileSystem, true);
    assert.equal(consultation.userData.mobileSystem, true);

    const systems = [
      {
        root: device,
        roles: [
          'cloud-remote-device-base',
          'cloud-remote-caster',
          'cloud-remote-device-caster-fork',
          'cloud-remote-column',
          'cloud-remote-control-console',
          'cloud-remote-device-monitor-arm',
          'cloud-remote-device-monitor',
        ],
      },
      {
        root: consultation,
        roles: [
          'cloud-consultation-base',
          'cloud-consultation-caster',
          'cloud-consultation-caster-fork',
          'cloud-monitor-column',
          'cloud-consultation-keyboard',
          'cloud-monitor-arm',
          'cloud-consultation-monitor',
        ],
      },
    ];

    for (const { root, roles } of systems) {
      roles.forEach((role) => assert.ok(objectWithRole(root, role), `${root.name} missing ${role}`));
      const wheels = roles.includes('cloud-remote-caster')
        ? objectWithRole(root, 'cloud-remote-caster')
        : objectWithRole(root, 'cloud-consultation-caster');
      const forks = roles.includes('cloud-remote-caster')
        ? objectWithRole(root, 'cloud-remote-device-caster-fork')
        : objectWithRole(root, 'cloud-consultation-caster-fork');
      assert.equal(wheels.isInstancedMesh, true);
      assert.equal(wheels.count, 4);
      assert.equal(forks.isInstancedMesh, true);
      assert.equal(forks.count, 4);
    }

    const deviceMonitors = objectWithRole(device, 'cloud-remote-device-monitor');
    const consultationMonitors = objectWithRole(consultation, 'cloud-consultation-monitor');
    assert.equal(deviceMonitors.count, 2);
    assert.equal(consultationMonitors.count, 2);

    const probeDock = objectWithRole(device, 'cloud-remote-probe-dock');
    const probeCable = objectWithRole(device, 'cloud-remote-probe-cable');
    assert.ok(probeDock);
    assert.equal(probeCable?.geometry.type, 'TubeGeometry');
    assert.equal(probeCable.userData.attachment.parentSocket, 'cloud-remote-probe-dock');
  } finally {
    world.dispose();
  }
});

test('Cloud Remote uses tapered equipment mass and a thin floating consultation desk', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  try {
    const device = objectWithRole(world.root, 'cloud-remote-device-end');
    const body = objectWithRole(device, 'cloud-remote-equipment-body');
    const shells = objectWithRole(body, 'cloud-remote-equipment-shell');
    assert.ok(body?.isGroup);
    assert.equal(shells?.isInstancedMesh, true);
    assert.ok(shells.count >= 3);
    const shellStages = matrixTransforms(shells).sort((left, right) => left.position.y - right.position.y);
    const lowerShell = shellStages[0];
    const upperShell = shellStages.at(-1);
    assert.ok(lowerShell.scale.x >= upperShell.scale.x * 1.22, 'device must narrow toward its controls');
    assert.ok(lowerShell.scale.z >= upperShell.scale.z * 1.16, 'upper device shell must be shallower');

    const deviceBase = worldSize(objectWithRole(device, 'cloud-remote-device-base'));
    const deviceColumn = worldSize(objectWithRole(device, 'cloud-remote-column'));
    const deviceConsole = worldSize(objectWithRole(device, 'cloud-remote-control-console'));
    assert.ok(deviceColumn.x <= deviceBase.x * 0.12, 'device monitor column must be slender');
    assert.ok(deviceConsole.y <= 0.2, 'device console must read as a control surface, not another box');

    const consultation = objectWithRole(world.root, 'cloud-remote-consultation-end');
    const desk = objectWithRole(consultation, 'cloud-consultation-desk');
    const keyboard = objectWithRole(consultation, 'cloud-consultation-keyboard');
    const deskSize = worldSize(desk);
    assert.ok(deskSize.y <= 0.4 && deskSize.z <= 0.72, 'consultation desk must be shallow and thin');
    assert.ok(worldBounds(keyboard).min.y >= worldBounds(desk).max.y + 0.08, 'keyboard must float above the desk shell');

    const consultationBase = worldSize(objectWithRole(consultation, 'cloud-consultation-base'));
    const monitorColumn = worldSize(objectWithRole(consultation, 'cloud-monitor-column'));
    assert.ok(monitorColumn.x <= consultationBase.x * 0.06, 'consultation monitor column must not read as a TV stand');
  } finally {
    world.dispose();
  }
});

test('Cloud Remote has a continuous three-stage device body and asymmetric endpoint displays', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  try {
    const device = objectWithRole(world.root, 'cloud-remote-device-end');
    const shells = objectWithRole(device, 'cloud-remote-equipment-shell');
    assert.equal(shells?.isInstancedMesh, true);
    assert.ok(shells.count >= 3);
    const stages = matrixTransforms(shells).sort((left, right) => left.position.y - right.position.y);
    for (let index = 1; index < stages.length; index += 1) {
      assert.ok(stages[index - 1].scale.x >= stages[index].scale.x + 0.08, 'device shell must narrow continuously upward');
      assert.ok(stages[index - 1].scale.z >= stages[index].scale.z + 0.06, 'upper device stages must become shallower');
    }

    const console = objectWithRole(device, 'cloud-remote-control-console');
    assert.equal(console.material.userData.paletteRole, 'equipment-shell');
    const deviceDisplays = matrixScales(objectWithRole(device, 'cloud-remote-device-monitor'));
    assert.ok(new Set(deviceDisplays.map((scale) => scale.join(','))).size >= 2, 'device endpoint needs primary and auxiliary displays');

    const consultation = objectWithRole(world.root, 'cloud-remote-consultation-end');
    const consultationDisplays = matrixScales(objectWithRole(consultation, 'cloud-consultation-monitor'));
    assert.ok(new Set(consultationDisplays.map((scale) => scale.join(','))).size >= 2, 'consultation endpoint displays must not read as a TV pair');
  } finally {
    world.dispose();
  }
});

test('Cloud Handheld has one continuous waisted shell attached to a real cradle', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  try {
    const station = objectWithRole(world.root, 'cloud-handheld-station');
    const probe = objectWithRole(station, 'cloud-handheld-waisted-body');
    const surfaces = objectsWithRole(probe, 'cloud-handheld-shell-surface');
    assert.equal(surfaces.length, 1);
    assert.equal(surfaces[0].geometry.type, 'LatheGeometry');
    assert.equal(surfaces[0].geometry.userData.shapeFamily, 'continuous-waisted-lathe');
    assert.equal(objectsWithRole(probe, 'cloud-handheld-waist-upper').filter(({ isMesh }) => isMesh).length, 0);
    assert.equal(objectsWithRole(probe, 'cloud-handheld-waist-lower').filter(({ isMesh }) => isMesh).length, 0);

    for (const role of [
      'cloud-handheld-top-arc',
      'cloud-handheld-bottom-arc',
      'cloud-handheld-shell-seam',
      'cloud-handheld-status-line',
      'cloud-handheld-side-button',
    ]) assert.ok(objectWithRole(probe, role), `probe missing ${role}`);

    const cradle = objectWithRole(station, 'cloud-handheld-cradle');
    assert.ok(cradle?.isGroup);
    assert.equal(probe.userData.attachment.parentSocket, 'cloud-handheld-cradle');
    assert.equal(probe.userData.attachment.contactType, 'socket');
    assert.ok(probe.userData.attachment.embedDepth > 0);
    assert.ok(probe.userData.attachment.gapTolerance <= 0.04);
  } finally {
    world.dispose();
  }
});

test('Cloud Handheld sits on a light charging base and slender support', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  try {
    const station = objectWithRole(world.root, 'cloud-handheld-station');
    const stand = objectWithRole(station, 'cloud-handheld-stand');
    const chargingBase = objectWithRole(stand, 'cloud-handheld-charging-base');
    const column = objectWithRole(stand, 'cloud-handheld-stand-column');
    assert.ok(stand?.isGroup);
    assert.ok(chargingBase?.isMesh);
    assert.equal(chargingBase.material.userData.paletteRole, 'equipment-shell');
    const baseSize = worldSize(chargingBase);
    assert.ok(baseSize.x <= 0.85 && baseSize.z <= 0.7, 'charging base must not overpower the probe');
    const columnSize = worldSize(column);
    assert.ok(columnSize.x <= 0.11 && columnSize.z <= 0.11, 'charging support must stay slender');
    assert.equal(isDescendantOf(objectWithRole(station, 'cloud-handheld-cradle'), stand), true);
  } finally {
    world.dispose();
  }
});

test('Cloud Handheld keeps the tablet subordinate and close to the probe', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  try {
    const station = objectWithRole(world.root, 'cloud-handheld-station');
    const probe = objectWithRole(station, 'cloud-handheld-waisted-body');
    const tablet = objectWithRole(station, 'cloud-tablet');
    const probeSize = worldSize(probe);
    const tabletSize = worldSize(tablet);
    assert.ok(tabletSize.x <= probeSize.x * 0.82, 'the tablet must read as a supporting control surface');
    assert.ok(
      Math.abs(tablet.getWorldPosition(new THREE.Vector3()).x - probe.getWorldPosition(new THREE.Vector3()).x) <= 1.2,
      'the tablet must stay grouped with the handheld station',
    );
  } finally {
    world.dispose();
  }
});

test('Oxygen support equipment adds generator controls and one attached curved hose without changing chamber roles', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  try {
    assert.ok(objectWithRole(world.root, 'oxygen-rounded-shell'));
    assert.ok(objectWithRole(world.root, 'oxygen-door-hardware'));
    const generator = objectWithRole(world.root, 'oxygen-generator');
    const details = objectWithRole(generator, 'oxygen-generator-detail');
    const hose = objectWithRole(world.root, 'oxygen-hose-segment');
    assert.equal(details?.isInstancedMesh, true);
    assert.ok(details.count >= 3);
    assert.equal(hose?.geometry.type, 'TubeGeometry');
    assert.equal(hose.userData.attachment.parentSocket, 'oxygen-generator-outlet');
    assert.equal(hose.userData.attachment.localEnd.length, 3);
  } finally {
    world.dispose();
  }
});

test('model fidelity rises by tier while every unchanged scene budget remains enforced', () => {
  const triangleFloors = { high: 18000, balanced: 10000, low: 7000 };
  for (const detailTier of ['high', 'balanced', 'low']) {
    const world = createLaboratoryWorld({ detailTier });
    const stats = collectSceneStats(world.root, { detailTier });
    const budget = getSceneDetailProfile(detailTier).budget;
    assert.ok(stats.triangles >= triangleFloors[detailTier], `${detailTier} retains the upgraded model silhouette`);
    assert.ok(stats.triangles <= budget.maxTriangles);
    assert.ok(stats.drawables <= budget.maxDrawables);
    assert.ok(stats.geometries <= budget.maxGeometries);
    assert.ok(stats.materials <= budget.maxMaterials);
    assert.equal(stats.withinBudget, true);
    world.dispose();
  }
});

test('every equipment family shares one clickable and reversible explode-part definition', () => {
  const world = createLaboratoryWorld({ detailTier: 'high' });
  try {
    const runtime = world.sculptRuntime;
    for (const assemblyId of ['alab-bay', 'primegen-bay', 'oxygen-bay', 'cloud-compound-bay']) {
      const parts = runtime.partsForAssembly(assemblyId);
      assert.ok(parts.length >= 2, `${assemblyId} must expose separable semantic parts`);
      assert.ok(parts.every((part) => part.name && part.userData.semanticRole));

      const before = new Map(parts.map((part) => [part, part.position.clone()]));
      runtime.setExploded(assemblyId, 1);
      assert.ok(parts.some((part) => part.position.distanceTo(before.get(part)) > 0.05));
      runtime.setExploded(assemblyId, 0);
      parts.forEach((part) => assert.ok(part.position.distanceTo(before.get(part)) < 1e-8));

      const firstMesh = parts[0].getObjectByProperty('isMesh', true) ?? parts[0];
      assert.equal(runtime.resolvePart(firstMesh), parts[0]);
    }
  } finally {
    world.dispose();
  }
});
