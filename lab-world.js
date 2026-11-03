import * as THREE from './assets/vendor/three/three.module.min.js';
import { PROJECT_BAYS, getSceneDetailProfile } from './scene-model.js';

export const LAB_WORLD_ID = 'continuous-laboratory';

export const LAB_PALETTE = Object.freeze({
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

export const TEXTURE_GPU_LIMITS = Object.freeze({
  high: 64 * 1024 * 1024,
  balanced: 32 * 1024 * 1024,
  low: 20 * 1024 * 1024,
});

const SCENE_MEDIA_MAPPINGS = Object.freeze([
  'physical-integrated-screen',
  'physical-control-console',
  'physical-dual-monitor-workstation',
  'semantic-foreground-phone-or-tablet',
]);

function setRole(object, semanticRole) {
  object.userData.semanticRole = semanticRole;
  object.name = semanticRole;
  return object;
}

function createGroup(role) {
  return setRole(new THREE.Group(), role);
}

function createMaterial(options, paletteRole) {
  const material = new THREE.MeshStandardMaterial(options);
  material.userData.paletteRole = paletteRole;
  return material;
}

function createPhysicalMaterial(options, paletteRole) {
  const material = new THREE.MeshPhysicalMaterial(options);
  material.userData.paletteRole = paletteRole;
  return material;
}

const PROCEDURAL_SURFACE_SIZES = Object.freeze({
  high: 1024,
  balanced: 512,
  low: 256,
});

const proceduralSurfaceDataCache = new Map();

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function hashNoise(x, y, seed) {
  let value = Math.imul(x + 1, 374761393) + Math.imul(y + 1, 668265263) + Math.imul(seed, 1442695041);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 0xffffffff;
}

function sampleSurfaceHeight(surfaceRole, x, y, seed) {
  const grain = hashNoise(x, y, seed) - 0.5;
  if (surfaceRole === 'painted-shell') {
    const orangePeel = (((x + y + seed) % 9) / 8) - 0.5;
    return clamp01(0.5 + grain * 0.72 + orangePeel * 0.12);
  }
  if (surfaceRole === 'brushed-metal') {
    const brushed = ((((y * 5) + seed) % 17) / 16 - 0.5) * 0.48;
    return clamp01(0.5 + brushed + grain * 0.18);
  }
  const weave = ((((x + seed) & 3) < 2 ? 1 : -1) + (((y + seed) & 3) < 2 ? 1 : -1)) * 0.16;
  return clamp01(0.5 + weave + grain * 0.16);
}

function sampleSurfaceRoughness(surfaceRole, x, y, seed) {
  const grain = hashNoise(x, y, seed) - 0.5;
  if (surfaceRole === 'painted-shell') {
    const orangePeel = (((x - y + seed + 18) % 9) / 8) - 0.5;
    return clamp01(0.82 + grain * 0.16 + orangePeel * 0.05);
  }
  if (surfaceRole === 'brushed-metal') {
    const brushed = ((((y * 3) + seed) % 13) / 12 - 0.5) * 0.2;
    return clamp01(0.72 + brushed + grain * 0.08);
  }
  const weave = ((((x + seed) & 3) < 2 ? 1 : 0) + (((y + seed) & 3) < 2 ? 1 : 0)) * 0.04;
  return clamp01(0.84 + weave + grain * 0.06);
}

function createProceduralSurfaceTexture({
  detailTier,
  surfaceRole,
  pbrChannel,
  seed,
  repeat,
  normalStrength = 1,
}) {
  const size = PROCEDURAL_SURFACE_SIZES[detailTier];
  const cacheKey = `${size}:${surfaceRole}:${pbrChannel}:${seed}:${normalStrength}`;
  let data = proceduralSurfaceDataCache.get(cacheKey);
  if (!data) {
    data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const offset = (y * size + x) * 4;
        if (pbrChannel === 'roughness') {
          const roughness = Math.round(sampleSurfaceRoughness(surfaceRole, x, y, seed) * 255);
          data[offset] = roughness;
          data[offset + 1] = roughness;
          data[offset + 2] = roughness;
        } else {
          const left = sampleSurfaceHeight(surfaceRole, (x - 1 + size) % size, y, seed);
          const right = sampleSurfaceHeight(surfaceRole, (x + 1) % size, y, seed);
          const down = sampleSurfaceHeight(surfaceRole, x, (y - 1 + size) % size, seed);
          const up = sampleSurfaceHeight(surfaceRole, x, (y + 1) % size, seed);
          const normalX = (left - right) * normalStrength;
          const normalY = (down - up) * normalStrength;
          const inverseLength = 1 / Math.sqrt(normalX * normalX + normalY * normalY + 1);
          data[offset] = Math.round((normalX * inverseLength * 0.5 + 0.5) * 255);
          data[offset + 1] = Math.round((normalY * inverseLength * 0.5 + 0.5) * 255);
          data[offset + 2] = Math.round((inverseLength * 0.5 + 0.5) * 255);
        }
        data[offset + 3] = 255;
      }
    }
    proceduralSurfaceDataCache.set(cacheKey, data);
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.UnsignedByteType);
  texture.name = `${surfaceRole}-${pbrChannel}-${detailTier}`;
  texture.colorSpace = THREE.NoColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(...repeat);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.userData.runtimeWidth = size;
  texture.userData.runtimeHeight = size;
  texture.userData.gpuBytes = estimateTextureBytes(size, size, false);
  texture.userData.surfaceRole = surfaceRole;
  texture.userData.pbrChannel = pbrChannel;
  texture.userData.independentFromAlbedo = true;
  texture.needsUpdate = true;
  return texture;
}

function createProceduralSurfaceTextures(detailTier) {
  const definitions = [
    ['shellRoughness', 'painted-shell', 'roughness', 11, [7, 5], 1],
    ['shellNormal', 'painted-shell', 'normal', 29, [7, 5], 0.38],
    ['silverRoughness', 'brushed-metal', 'roughness', 43, [12, 4], 1],
    ['silverNormal', 'brushed-metal', 'normal', 61, [12, 4], 0.52],
    ['upholsteryRoughness', 'woven-upholstery', 'roughness', 73, [8, 8], 1],
    ['upholsteryNormal', 'woven-upholstery', 'normal', 97, [8, 8], 0.64],
  ];
  return Object.fromEntries(definitions.map(([
    id,
    surfaceRole,
    pbrChannel,
    seed,
    repeat,
    normalStrength,
  ]) => [id, createProceduralSurfaceTexture({
    detailTier,
    surfaceRole,
    pbrChannel,
    seed,
    repeat,
    normalStrength,
  })]));
}

function createMaterials(detailTier) {
  const lowDetail = detailTier === 'low';
  const surfaceTextures = createProceduralSurfaceTextures(detailTier);
  const materials = {
    floor: createMaterial({ color: LAB_PALETTE.floor, roughness: 0.82, metalness: 0.08 }, 'graphite-floor'),
    graphite: createMaterial({ color: LAB_PALETTE.graphite, roughness: 0.58, metalness: 0.24 }, 'graphite-structure'),
    shell: createPhysicalMaterial({
      color: LAB_PALETTE.shell,
      roughness: 0.34,
      metalness: 0.08,
      clearcoat: 0.46,
      clearcoatRoughness: 0.3,
      roughnessMap: surfaceTextures.shellRoughness,
      normalMap: surfaceTextures.shellNormal,
      normalScale: new THREE.Vector2(0.08, 0.08),
    }, 'equipment-shell'),
    silver: createPhysicalMaterial({
      color: LAB_PALETTE.silver,
      roughness: 0.28,
      metalness: 0.76,
      clearcoat: 0.12,
      clearcoatRoughness: 0.24,
      roughnessMap: surfaceTextures.silverRoughness,
      normalMap: surfaceTextures.silverNormal,
      normalScale: new THREE.Vector2(0.1, 0.045),
    }, 'equipment-silver'),
    smoked: createMaterial({ color: LAB_PALETTE.smoked, roughness: 0.4, metalness: 0.12 }, 'smoked-panel'),
    glass: createPhysicalMaterial({
      color: LAB_PALETTE.clear,
      roughness: 0.12,
      metalness: 0,
      transmission: lowDetail ? 0.38 : 0.52,
      thickness: 0.08,
      ior: 1.46,
      transparent: true,
      opacity: lowDetail ? 0.42 : 0.32,
      depthWrite: false,
      side: THREE.DoubleSide,
    }, 'necessary-glass'),
    smokedGlass: createPhysicalMaterial({
      color: 0x26363b,
      roughness: 0.18,
      metalness: 0,
      transmission: lowDetail ? 0.24 : 0.34,
      thickness: 0.12,
      ior: 1.5,
      transparent: true,
      opacity: lowDetail ? 0.58 : 0.52,
      depthWrite: false,
      side: THREE.DoubleSide,
    }, 'smoked-glass'),
    cyan: createMaterial({
      color: LAB_PALETTE.cyan,
      emissive: LAB_PALETTE.cyan,
      emissiveIntensity: 0.7,
      roughness: 0.3,
      metalness: 0.08,
    }, 'functional-cyan'),
    amber: createMaterial({
      color: 0xd6a84e,
      emissive: 0x8d5b16,
      emissiveIntensity: 0.52,
      roughness: 0.34,
      metalness: 0.08,
    }, 'functional-amber'),
    navigation: createMaterial({
      color: 0x60787a,
      emissive: 0x30484a,
      emissiveIntensity: 0.12,
      roughness: 0.62,
      metalness: 0.08,
    }, 'navigation-guide'),
    contactShadow: createMaterial({
      color: 0x090d10,
      transparent: true,
      opacity: lowDetail ? 0.18 : 0.14,
      depthWrite: false,
      roughness: 1,
      metalness: 0,
    }, 'baked-contact-shadow'),
    red: createMaterial({
      color: LAB_PALETTE.red,
      emissive: LAB_PALETTE.red,
      emissiveIntensity: 0.35,
      roughness: 0.36,
    }, 'emergency-red'),
    upholstery: createPhysicalMaterial({
      color: LAB_PALETTE.upholstery,
      roughness: 0.82,
      metalness: 0,
      sheen: 0.34,
      sheenRoughness: 0.72,
      sheenColor: 0xa7b2b6,
      roughnessMap: surfaceTextures.upholsteryRoughness,
      normalMap: surfaceTextures.upholsteryNormal,
      normalScale: new THREE.Vector2(0.12, 0.12),
    }, 'seat-upholstery'),
    light: createMaterial({
      color: 0xf4f7f6,
      emissive: 0xffffff,
      emissiveIntensity: 1.5,
      roughness: 0.28,
    }, 'neutral-light'),
    screenNeutral: createMaterial({ color: 0x17242b, emissive: 0x0b1419, emissiveIntensity: 0.45, roughness: 0.34 }, 'neutral-screen'),
    screenOxygen: createMaterial({ color: 0x17242b, emissive: 0x0b1419, emissiveIntensity: 0.45, roughness: 0.34 }, 'neutral-screen'),
    screenConsole: createMaterial({ color: 0x26353b, emissive: 0x10191d, emissiveIntensity: 0.38, roughness: 0.36 }, 'neutral-screen'),
    screenCloudRemote: createMaterial({ color: 0x17242b, emissive: 0x0b1419, emissiveIntensity: 0.45, roughness: 0.34 }, 'neutral-screen'),
    screenCloudTablet: createMaterial({ color: 0x17242b, emissive: 0x0b1419, emissiveIntensity: 0.45, roughness: 0.34 }, 'neutral-screen'),
  };
  return { materials, proceduralTextures: new Set(Object.values(surfaceTextures)) };
}

function createGeometries(detailProfile) {
  const radialSegments = detailProfile.laboratory.shellSegments;
  const roundedShape = new THREE.Shape();
  const halfExtent = 0.46;
  const cornerRadius = 0.14;
  roundedShape.moveTo(-halfExtent + cornerRadius, -halfExtent);
  roundedShape.lineTo(halfExtent - cornerRadius, -halfExtent);
  roundedShape.quadraticCurveTo(halfExtent, -halfExtent, halfExtent, -halfExtent + cornerRadius);
  roundedShape.lineTo(halfExtent, halfExtent - cornerRadius);
  roundedShape.quadraticCurveTo(halfExtent, halfExtent, halfExtent - cornerRadius, halfExtent);
  roundedShape.lineTo(-halfExtent + cornerRadius, halfExtent);
  roundedShape.quadraticCurveTo(-halfExtent, halfExtent, -halfExtent, halfExtent - cornerRadius);
  roundedShape.lineTo(-halfExtent, -halfExtent + cornerRadius);
  roundedShape.quadraticCurveTo(-halfExtent, -halfExtent, -halfExtent + cornerRadius, -halfExtent);

  const roundedBox = new THREE.ExtrudeGeometry(roundedShape, {
    depth: 0.92,
    steps: 1,
    curveSegments: Math.max(3, Math.round(radialSegments / 6)),
    bevelEnabled: true,
    bevelSegments: detailProfile.laboratory.equipmentDetail === 'full' ? 3 : 2,
    bevelSize: 0.04,
    bevelThickness: 0.04,
  });
  roundedBox.translate(0, 0, -0.46);
  roundedBox.computeVertexNormals();
  roundedBox.userData.shapeFamily = 'rounded-box';

  const cylinder = new THREE.CylinderGeometry(0.5, 0.5, 1, radialSegments);
  cylinder.userData.shapeFamily = 'cylinder';
  const taperedCylinder = new THREE.CylinderGeometry(0.3, 0.5, 1, radialSegments);
  taperedCylinder.userData.shapeFamily = 'tapered-cylinder';
  const sphere = new THREE.SphereGeometry(0.5, Math.max(8, radialSegments), Math.max(6, Math.round(radialSegments / 2)));
  sphere.userData.shapeFamily = 'sphere';

  const handheldShell = new THREE.LatheGeometry([
    new THREE.Vector2(0, -0.78),
    new THREE.Vector2(0.26, -0.77),
    new THREE.Vector2(0.36, -0.7),
    new THREE.Vector2(0.41, -0.52),
    new THREE.Vector2(0.35, -0.18),
    new THREE.Vector2(0.31, 0),
    new THREE.Vector2(0.35, 0.18),
    new THREE.Vector2(0.41, 0.52),
    new THREE.Vector2(0.36, 0.7),
    new THREE.Vector2(0.26, 0.77),
    new THREE.Vector2(0, 0.78),
  ], radialSegments);
  handheldShell.computeVertexNormals();
  handheldShell.userData.shapeFamily = 'continuous-waisted-lathe';

  const handheldBoundaryArc = new THREE.TorusGeometry(
    0.5,
    0.035,
    Math.max(6, Math.round(radialSegments / 2)),
    radialSegments,
    Math.PI,
  );
  handheldBoundaryArc.userData.shapeFamily = 'curved-boundary';

  const tubeSegments = detailProfile.laboratory.equipmentDetail === 'full' ? 28 : 18;
  const tubeRadialSegments = detailProfile.laboratory.equipmentDetail === 'full' ? 8 : 6;
  const oxygenHose = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.95, 0.92, 0.98),
    new THREE.Vector3(-2.72, 0.8, 1.02),
    new THREE.Vector3(-2.48, 0.62, 0.96),
    new THREE.Vector3(-2.18, 0.92, 1.05),
    new THREE.Vector3(-1.92, 1.56, 1.2),
    new THREE.Vector3(-1.72, 2.28, 1.37),
  ]), tubeSegments, 0.045, tubeRadialSegments, false);
  oxygenHose.userData.shapeFamily = 'attached-hose';

  const cloudProbeCable = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.5, 1.4, 0.49),
    new THREE.Vector3(0.7, 1.18, 0.54),
    new THREE.Vector3(0.67, 0.8, 0.52),
    new THREE.Vector3(0.48, 0.58, 0.46),
  ]), tubeSegments, 0.025, tubeRadialSegments, false);
  cloudProbeCable.userData.shapeFamily = 'probe-cable';

  return {
    box: new THREE.BoxGeometry(1, 1, 1),
    roundedBox,
    cylinder,
    taperedCylinder,
    sphere,
    plane: new THREE.PlaneGeometry(1, 1),
    ring: new THREE.TorusGeometry(0.5, 0.08, Math.max(6, Math.round(radialSegments / 2)), radialSegments),
    contactShadow: new THREE.CircleGeometry(0.5, Math.max(16, radialSegments)),
    handheldShell,
    handheldBoundaryArc,
    oxygenHose,
    cloudProbeCable,
  };
}

function addBox(parent, geometries, material, role, size, position, rotation = [0, 0, 0]) {
  const mesh = setRole(new THREE.Mesh(geometries.box, material), role);
  mesh.position.set(...position);
  mesh.scale.set(...size);
  mesh.rotation.set(...rotation);
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addRoundedBox(parent, geometries, material, role, size, position, rotation = [0, 0, 0]) {
  const mesh = setRole(new THREE.Mesh(geometries.roundedBox, material), role);
  mesh.position.set(...position);
  mesh.scale.set(...size);
  mesh.rotation.set(...rotation);
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addCylinder(parent, geometries, material, role, size, position, rotation = [0, 0, 0], tapered = false) {
  const geometry = tapered ? geometries.taperedCylinder : geometries.cylinder;
  const mesh = setRole(new THREE.Mesh(geometry, material), role);
  mesh.position.set(...position);
  mesh.scale.set(...size);
  mesh.rotation.set(...rotation);
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addSphere(parent, geometries, material, role, size, position) {
  const mesh = setRole(new THREE.Mesh(geometries.sphere, material), role);
  mesh.position.set(...position);
  mesh.scale.set(...size);
  parent.add(mesh);
  return mesh;
}

function addGeometryMesh(parent, geometry, material, role, size, position, rotation = [0, 0, 0]) {
  const mesh = setRole(new THREE.Mesh(geometry, material), role);
  mesh.position.set(...position);
  mesh.scale.set(...size);
  mesh.rotation.set(...rotation);
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addInstancedGeometry(parent, geometry, material, role, transforms) {
  const mesh = setRole(new THREE.InstancedMesh(geometry, material, transforms.length), role);
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const rotation = new THREE.Euler();
  const scale = new THREE.Vector3();
  transforms.forEach((transform, index) => {
    position.set(...transform.position);
    rotation.set(...(transform.rotation ?? [0, 0, 0]));
    quaternion.setFromEuler(rotation);
    scale.set(...transform.scale);
    matrix.compose(position, quaternion, scale);
    mesh.setMatrixAt(index, matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addInstancedBoxes(parent, geometries, material, role, transforms) {
  return addInstancedGeometry(parent, geometries.box, material, role, transforms);
}

function addContactShadows(parent, geometries, material) {
  const transforms = [
    { position: [-5.8, 0.014, 1.2], scale: [4.4, 3.1, 1] },
    { position: [5.6, 0.014, -4], scale: [4.5, 2.5, 1] },
    { position: [-5.8, 0.014, -9], scale: [5.2, 3.1, 1] },
    { position: [4.85, 0.014, -13.75], scale: [1.8, 1.5, 1] },
    { position: [6.8, 0.014, -14.25], scale: [2.6, 1.5, 1] },
    { position: [2, 0.014, -17], scale: [2.5, 1.7, 1] },
  ];
  const mesh = setRole(new THREE.InstancedMesh(geometries.contactShadow, material, transforms.length), 'laboratory-contact-shadow');
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const rotation = new THREE.Euler(-Math.PI / 2, 0, 0);
  const scale = new THREE.Vector3();
  transforms.forEach((transform, index) => {
    position.set(...transform.position);
    quaternion.setFromEuler(rotation);
    scale.set(...transform.scale);
    matrix.compose(position, quaternion, scale);
    mesh.setMatrixAt(index, matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh.renderOrder = 1;
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  parent.add(mesh);
}

function addBuildingShell(parent, geometries, materials, detailTier) {
  addBox(parent, geometries, materials.floor, 'laboratory-floor', [19, 0.22, 60], [0, -0.12, -12]);
  addBox(parent, geometries, materials.graphite, 'laboratory-left-shell', [0.24, 1.08, 60], [-9.4, 0.54, -12]);
  addBox(parent, geometries, materials.graphite, 'laboratory-right-shell', [0.24, 1.08, 60], [9.4, 0.54, -12]);
  addBox(parent, geometries, materials.shell, 'laboratory-rear-shell', [19, 4.6, 0.24], [0, 2.3, -42]);
  addBox(parent, geometries, materials.graphite, 'shared-axis-counter', [2.2, 0.78, 5.4], [0, 0.39, -17.6]);

  addBox(parent, geometries, materials.navigation, 'shared-axis-floor-guide', [0.055, 0.018, 34], [-0.8, 0.03, -2]);
  addBox(parent, geometries, materials.silver, 'main-ceiling-rail', [0.16, 0.12, 34], [-0.8, 4.05, -2]);
  addBox(parent, geometries, materials.navigation, 'continuation-corridor-floor-guide', [0.055, 0.018, 21], [1.6, 0.03, -28.5]);
  addBox(parent, geometries, materials.silver, 'continuation-ceiling-rail', [0.16, 0.12, 21], [1.6, 4.05, -28.5]);

  const architectureScale = detailTier === 'high' ? 1 : detailTier === 'balanced' ? 0.78 : 0.58;
  const floorJointCount = Math.round(18 * architectureScale);
  addInstancedBoxes(parent, geometries, materials.smoked, 'laboratory-floor-joint', Array.from({ length: floorJointCount }, (_, index) => ({
    position: [0, 0.012, 14 - index * (54 / Math.max(1, floorJointCount - 1))],
    scale: [18.2, 0.012, 0.018],
  })));

  const cofferCount = Math.round(15 * architectureScale);
  addInstancedBoxes(parent, geometries, materials.graphite, 'laboratory-ceiling-coffer', Array.from({ length: cofferCount }, (_, index) => ({
    position: [0, 4.23, 13.5 - index * (53 / Math.max(1, cofferCount - 1))],
    scale: [18.4, 0.08, 0.055],
  })));

  const columnZ = [10, 2, -6, -14, -22, -30, -38].slice(0, Math.max(4, Math.round(7 * architectureScale)));
  addInstancedBoxes(parent, geometries, materials.silver, 'laboratory-structural-column', columnZ.flatMap((z) => [
    { position: [-8.85, 2.05, z], scale: [0.22, 4.1, 0.28] },
    { position: [8.85, 2.05, z], scale: [0.22, 4.1, 0.28] },
  ]));

  addInstancedBoxes(parent, geometries, materials.graphite, 'laboratory-glass-partition-frame', columnZ.flatMap((z) => [
    { position: [-8.71, 2.05, z - 1.75], scale: [0.07, 4.05, 0.07] },
    { position: [8.71, 2.05, z - 1.75], scale: [0.07, 4.05, 0.07] },
    { position: [-8.71, 3.72, z - 1.75], scale: [0.07, 0.07, 3.5] },
    { position: [8.71, 3.72, z - 1.75], scale: [0.07, 0.07, 3.5] },
  ]));

  addInstancedBoxes(parent, geometries, materials.silver, 'laboratory-service-trunk', [
    { position: [-8.58, 3.42, -12], scale: [0.18, 0.24, 50] },
    { position: [8.58, 3.42, -12], scale: [0.18, 0.24, 50] },
  ]);
  addInstancedBoxes(parent, geometries, materials.graphite, 'laboratory-upper-service-band', [
    { position: [-9.34, 3.86, -12], scale: [0.16, 0.7, 60] },
    { position: [9.34, 3.86, -12], scale: [0.16, 0.7, 60] },
  ]);

  const glassPanelCount = detailTier === 'high' ? 12 : detailTier === 'balanced' ? 9 : 6;
  const glassPanelDepth = 52 / glassPanelCount - 0.12;
  const partitionPanels = addInstancedBoxes(
    parent,
    geometries,
    materials.smokedGlass,
    'laboratory-side-glass-partition',
    Array.from({ length: glassPanelCount }, (_, index) => {
      const z = 13 - (index + 0.5) * (52 / glassPanelCount);
      return [
        { position: [-9.28, 2.22, z], scale: [0.035, 2.5, glassPanelDepth] },
        { position: [9.28, 2.22, z], scale: [0.035, 2.5, glassPanelDepth] },
      ];
    }).flat(),
  );
  partitionPanels.userData.visibilityLayers = 1;
  addContactShadows(parent, geometries, materials.contactShadow);

  const mainCount = detailTier === 'high' ? 16 : detailTier === 'balanced' ? 13 : 10;
  const continuationCount = detailTier === 'high' ? 13 : detailTier === 'balanced' ? 10 : 8;
  addInstancedBoxes(parent, geometries, materials.light, 'main-ceiling-light', Array.from({ length: mainCount }, (_, index) => ({
    position: [-0.8, 3.92, 14 - index * (32 / Math.max(1, mainCount - 1))],
    scale: [0.72, 0.06, 0.13],
  })));
  addInstancedBoxes(parent, geometries, materials.light, 'continuation-ceiling-light', Array.from({ length: continuationCount }, (_, index) => ({
    position: [1.6, 3.92, -18 - index * (21 / Math.max(1, continuationCount - 1))],
    scale: [0.72, 0.06, 0.13],
  })));

  const entranceSign = addBox(parent, geometries, materials.shell, 'entrance-sign', [2.4, 0.46, 0.16], [0, 3.05, 13.4]);
  entranceSign.userData.doubleSidedIdentity = true;
  addBox(parent, geometries, materials.shell, 'laboratory-end-sign', [2.4, 0.46, 0.16], [1, 3.05, -40]);
  addBox(parent, geometries, materials.smoked, 'control-hub-sign', [1.8, 0.5, 0.14], [0, 2.45, -18.3]);
  addBox(parent, geometries, materials.red, 'emergency-stop', [0.16, 0.16, 0.12], [0.78, 1.08, -16.95]);

  const corridor = createGroup('continuation-glass-corridor');
  const panelCount = detailTier === 'low' ? 1 : 2;
  for (let index = 0; index < panelCount; index += 1) {
    const panel = addBox(
      corridor,
      geometries,
      materials.glass,
      'continuation-corridor-glass-panel',
      [0.05, 3.1, 21],
      [2.9 + index * 0.08, 1.72, -28.5],
    );
    panel.userData.visibilityLayers = index + 1;
  }
  parent.add(corridor);
}

function addBayTaskLights(parent) {
  const lightTargets = [
    { position: [-5.6, 3.55, 3.5], target: [-5.8, 0.9, 1.2], intensity: 18 },
    { position: [5.6, 3.55, -1.8], target: [5.6, 1.0, -4], intensity: 17 },
    { position: [-5.7, 3.55, -6.0], target: [-5.8, 1.1, -8.2], intensity: 20 },
    { position: [5.7, 3.55, -11.3], target: [5.7, 1.0, -13.6], intensity: 18 },
    { position: [2.0, 3.55, -15.5], target: [1.8, 1.0, -17.1], intensity: 16 },
  ];

  lightTargets.forEach(({ position, target, intensity }, index) => {
    const light = new THREE.SpotLight(0xf5f8f7, intensity, 7.5, Math.PI / 4.8, 0.72, 1.65);
    light.position.set(...position);
    light.target.position.set(...target);
    light.castShadow = false;
    light.userData.semanticRole = 'laboratory-bay-task-light';
    light.userData.lightRole = `laboratory-bay-task-${index + 1}`;
    light.name = `laboratory-bay-task-light-${index + 1}`;
    parent.add(light, light.target);
  });
}

function addLaboratoryLights(parent, detailTier) {
  const ambient = new THREE.HemisphereLight(0xffffff, 0x858b8d, 1.25);
  ambient.userData.lightRole = 'laboratory-ambient';
  parent.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(-3, 8, 10);
  key.target.position.set(0, 0.8, -15);
  key.userData.lightRole = 'laboratory-key';
  key.castShadow = detailTier === 'high';
  if (key.castShadow) {
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -14;
    key.shadow.camera.right = 14;
    key.shadow.camera.top = 14;
    key.shadow.camera.bottom = -14;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 70;
    key.shadow.camera.updateProjectionMatrix();
    key.shadow.bias = -0.0006;
    key.shadow.normalBias = 0.03;
    key.shadow.radius = 2;
  }
  parent.add(key, key.target);

  const fill = new THREE.DirectionalLight(0xeef6f6, 1.25);
  fill.position.set(8, 5, -14);
  fill.target.position.set(0, 1.2, -7);
  fill.userData.lightRole = 'laboratory-fill';
  parent.add(fill, fill.target);
}

function configureLaboratoryShadows(root, detailTier) {
  const shadowsEnabled = detailTier === 'high';
  const equipmentRoots = new Set(['alab-bay', 'primegen-bay', 'oxygen-bay', 'cloud-compound-bay']);

  root.traverse((object) => {
    if (!(object.isMesh || object.isInstancedMesh)) return;
    const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
    const transparent = objectMaterials.some((material) => material?.transparent === true && material.opacity > 0);
    let ancestor = object.parent;
    let equipment = false;
    while (ancestor && !equipment) {
      equipment = equipmentRoots.has(ancestor.userData.semanticRole);
      ancestor = ancestor.parent;
    }
    object.castShadow = shadowsEnabled && equipment && !transparent;
    object.receiveShadow = true;
  });
}

function addProjectGuide(parent, geometries, materials, role, x, z) {
  const guide = addBox(parent, geometries, materials.navigation, role, [Math.abs(x), 0.018, 0.05], [x / 2, 0.035, z]);
  guide.userData.continuityAnchor = true;
  return guide;
}

function addProjectSign(parent, geometries, materials, role, position) {
  const sign = addBox(parent, geometries, materials.smoked, role, [2, 0.46, 0.12], position);
  sign.userData.continuityAnchor = true;
  return sign;
}

function addAlabBay(parent, geometries, materials, detailTier, actionNodes) {
  const bay = createGroup('alab-bay');
  bay.position.set(...PROJECT_BAYS.alab.center);
  bay.userData.bayId = PROJECT_BAYS.alab.id;

  addProjectGuide(bay, geometries, materials, 'alab-floor-guide', 5.0, 0.3);
  addProjectSign(bay, geometries, materials, 'alab-project-sign', [0, 3.15, -1.1]);

  const enclosure = createGroup('alab-enclosure');
  addBox(enclosure, geometries, materials.silver, 'alab-enclosure-base', [3.9, 0.18, 2.7], [0, 0.09, 0]);
  addInstancedBoxes(enclosure, geometries, materials.silver, 'alab-enclosure-frame', [
    { position: [-1.85, 1.35, -1.2], scale: [0.12, 2.7, 0.12] },
    { position: [1.85, 1.35, -1.2], scale: [0.12, 2.7, 0.12] },
    { position: [-1.85, 1.35, 1.2], scale: [0.12, 2.7, 0.12] },
    { position: [1.85, 1.35, 1.2], scale: [0.12, 2.7, 0.12] },
    { position: [0, 2.65, -1.2], scale: [3.8, 0.12, 0.12] },
    { position: [0, 2.65, 1.2], scale: [3.8, 0.12, 0.12] },
  ]);
  const enclosurePanel = addBox(enclosure, geometries, materials.glass, 'alab-enclosure-glass', [3.55, 2.25, 0.035], [0, 1.38, 1.18]);
  enclosurePanel.userData.visibilityLayers = 1;
  bay.add(enclosure);

  const arm = createGroup('alab-robot-arm');
  arm.position.set(-0.45, 0.25, 0);
  addCylinder(arm, geometries, materials.silver, 'alab-robot-base', [0.62, 0.3, 0.62], [0, 0.3, 0]);
  const axisOffsets = [
    [0, 0.58, 0],
    [0, 0.62, 0],
    [0.42, 0.52, 0],
    [0.58, 0.18, 0],
    [0.34, -0.1, 0],
    [0.2, -0.02, 0],
  ];
  let axisParent = arm;
  const axes = axisOffsets.map((offset, index) => {
    const axis = createGroup(`alab-robot-axis-${index + 1}`);
    axis.userData.axisIndex = index + 1;
    axis.position.set(...offset);
    axisParent.add(axis);
    axisParent = axis;
    return axis;
  });
  const linkVectors = axisOffsets.slice(1, 5);
  const linkRadii = [0.44, 0.41, 0.35, 0.29];
  linkVectors.forEach(([x, y], index) => {
    const length = Math.hypot(x, y);
    addCylinder(
      axes[index],
      geometries,
      materials.shell,
      'alab-robot-link',
      [linkRadii[index], length, linkRadii[index]],
      [x / 2, y / 2, 0],
      [0, 0, -Math.atan2(x, y)],
      true,
    );
  });
  const jointPositions = [];
  const jointSeams = [];
  const jointCursor = new THREE.Vector3();
  const jointRadii = [0.48, 0.45, 0.4, 0.34, 0.28, 0.22];
  axisOffsets.forEach((offset, index) => {
    jointCursor.add(new THREE.Vector3(...offset));
    const radius = jointRadii[index];
    jointPositions.push({
      position: jointCursor.toArray(),
      scale: Array(3).fill(radius),
    });
    jointSeams.push({
      position: [jointCursor.x, jointCursor.y, jointCursor.z + radius * 0.46],
      scale: Array(3).fill(radius * 0.7),
    });
  });
  addInstancedGeometry(arm, geometries.sphere, materials.shell, 'alab-robot-joint', [
    ...jointPositions,
  ]);
  if (detailTier !== 'low') {
    addInstancedGeometry(arm, geometries.ring, materials.graphite, 'alab-robot-joint-seam', jointSeams);
  }
  const wrist = createGroup('alab-robot-wrist');
  const endEffector = createGroup('alab-end-effector');
  if (detailTier !== 'low') {
    addCylinder(wrist, geometries, materials.shell, 'alab-robot-wrist-housing', [0.14, 0.3, 0.14], [0.14, 0, 0], [0, 0, -Math.PI / 2]);
  }
  addRoundedBox(endEffector, geometries, materials.graphite, 'alab-robot-sample-plate', [0.82, 0.08, 0.55], [0.5, -0.12, 0]);
  wrist.add(endEffector);
  axes[5].add(wrist);
  bay.add(arm);

  const carrier = addBox(bay, geometries, materials.shell, 'alab-sample-carrier', [0.9, 0.14, 0.62], [-0.2, 0.72, 0.72]);
  actionNodes['alab-transfer'] = carrier;
  addInstancedBoxes(bay, geometries, materials.graphite, 'alab-sample-rack', Array.from({ length: detailTier === 'high' ? 10 : 7 }, (_, index) => ({
    position: [0.9 + (index % 5) * 0.22, 0.68, 0.72 + Math.floor(index / 5) * 0.22],
    scale: [0.12, 0.3, 0.12],
  })));
  const analyzer = createGroup('alab-analyzer');
  analyzer.position.set(1.28, 0, -0.45);
  addRoundedBox(analyzer, geometries, materials.shell, 'alab-analyzer-shell', [1.1, 1.25, 1.45], [0, 0.72, 0]);
  addBox(analyzer, geometries, materials.screenNeutral, 'alab-analyzer-screen', [0.72, 0.42, 0.04], [0, 0.95, 0.74]);
  if (detailTier !== 'low') {
    addInstancedBoxes(analyzer, geometries, materials.graphite, 'alab-analyzer-depth-detail', [
      { position: [-0.39, 0.38, 0.72], scale: [0.13, 0.38, 0.05] },
      { position: [0, 0.34, 0.72], scale: [0.42, 0.06, 0.05] },
      { position: [0.39, 0.38, 0.72], scale: [0.13, 0.38, 0.05] },
    ]);
  }
  bay.add(analyzer);
  parent.add(bay);
}

function addPrimegenBay(parent, geometries, materials, detailTier, actionNodes) {
  const bay = createGroup('primegen-bay');
  bay.position.set(...PROJECT_BAYS.primegen.center);
  bay.userData.bayId = PROJECT_BAYS.primegen.id;

  addProjectGuide(bay, geometries, materials, 'primegen-floor-guide', -4.8, 0.35);
  addProjectSign(bay, geometries, materials, 'primegen-project-sign', [0, 3.1, -1.2]);
  const tower = createGroup('primegen-planning-console');
  const towerBody = createGroup('primegen-tower-body');
  addRoundedBox(towerBody, geometries, materials.shell, 'primegen-central-analyzer', [0.9, 1.78, 0.6], [0.05, 0.94, 0.72]);
  tower.add(towerBody);
  addInstancedBoxes(tower, geometries, materials.screenNeutral, 'primegen-planning-screen', [
    { position: [0.05, 1.22, 1.035], scale: [0.74, 0.42, 0.04] },
    { position: [0.05, 1.62, 1.035], scale: [0.74, 0.3, 0.04] },
  ]);

  const queueCursor = addRoundedBox(
    tower,
    geometries,
    materials.amber,
    'primegen-queue-indicator',
    [0.72, 0.04, 0.04],
    [0.05, 0.94, 1.04],
  );
  queueCursor.userData.visualRole = 'primegen-task-light-bar';
  actionNodes['primegen-queue'] = queueCursor;
  addInstancedBoxes(tower, geometries, materials.smoked, 'primegen-queue-row', Array.from({ length: detailTier === 'high' ? 6 : 4 }, (_, index) => ({
    position: [-0.32 + index * 0.13, 1.84, 0.72],
    scale: [0.09, 0.06, 0.16],
  })));

  const gantry = createGroup('primegen-gantry');
  addInstancedBoxes(gantry, geometries, materials.silver, 'primegen-gantry-frame', [
    { position: [1.3, 1.05, 0.02], scale: [0.065, 1.34, 0.065] },
    { position: [0.84, 1.69, 0.02], scale: [0.98, 0.065, 0.065] },
    { position: [1.3, 1.69, 0.3], scale: [0.065, 0.065, 0.62] },
    { position: [0.94, 1.46, 0.3], scale: [0.72, 0.055, 0.055] },
  ]);
  const pipettingHead = createGroup('primegen-pipetting-head');
  const pipettingHardware = createGroup('primegen-pipetting-head-hardware');
  addRoundedBox(pipettingHardware, geometries, materials.silver, 'primegen-pipetting-head-shell', [0.52, 0.24, 0.38], [1.16, 1.42, 0.3]);
  const nozzles = addInstancedGeometry(pipettingHardware, geometries.taperedCylinder, materials.graphite, 'primegen-pipette-nozzle', Array.from({ length: 6 }, (_, index) => ({
    position: [1.01 + (index % 3) * 0.15, 1.16, 0.2 + Math.floor(index / 3) * 0.13],
    scale: [0.038, 0.3, 0.038],
  })));
  nozzles.userData.hardwareRole = 'multichannel-pipetting-array';
  if (detailTier !== 'low') {
    addInstancedGeometry(pipettingHardware, geometries.cylinder, materials.graphite, 'primegen-pipetting-head-collar', Array.from({ length: 6 }, (_, index) => ({
      position: [1.01 + (index % 3) * 0.15, 1.29, 0.2 + Math.floor(index / 3) * 0.13],
      scale: [0.055, 0.07, 0.055],
    })));
  }
  pipettingHead.add(pipettingHardware);
  gantry.add(pipettingHead);
  tower.add(gantry);

  const deck = createGroup('primegen-deck-array');
  const deckBase = createGroup('primegen-deck-base');
  addInstancedBoxes(deckBase, geometries, materials.graphite, 'primegen-deck-rail', [
    { position: [0.05, 0.12, 0.02], scale: [2.9, 0.06, 0.07] },
    { position: [0.05, 0.12, 0.58], scale: [2.9, 0.06, 0.07] },
    ...Array.from({ length: 5 }, (_, index) => ({
      position: [-1.1 + index * 0.56, 0.115, 0.3],
      scale: [0.055, 0.05, 0.62],
    })),
  ]);
  deck.add(deckBase);
  addInstancedBoxes(deck, geometries, materials.shell, 'primegen-labware-plate', Array.from({ length: 8 }, (_, index) => ({
    position: [-1.02 + (index % 4) * 0.68, 0.18, 0.08 + Math.floor(index / 4) * 0.44],
    scale: [0.5, 0.07, 0.3],
  })));
  tower.add(deck);
  bay.add(tower);

  const moduleTransforms = [
    { position: [-1.5, 0.67, -1.15], scale: [0.62, 1.28, 0.85] },
    { position: [-0.72, 0.54, -1.15], scale: [0.68, 1.02, 0.78] },
    { position: [0.06, 0.76, -1.15], scale: [0.58, 1.46, 0.85] },
    { position: [0.84, 0.6, -1.15], scale: [0.7, 1.14, 0.72] },
    { position: [1.62, 0.7, -1.15], scale: [0.62, 1.34, 0.85] },
  ];
  const moduleCount = detailTier === 'high' ? 5 : 4;
  const instrumentModules = addInstancedBoxes(
    bay,
    geometries,
    materials.shell,
    'primegen-instrument-row',
    moduleTransforms.slice(0, moduleCount),
  );
  instrumentModules.userData.includesCentralAnalyzer = true;
  addBox(bay, geometries, materials.cyan, 'primegen-sample-flow', [3.3, 0.025, 0.07], [0, 0.06, -0.48]);
  parent.add(bay);
}

function addSeat(parent, geometries, materials, x, z, equipmentDetail, componentRole) {
  const component = createGroup(componentRole);
  component.position.set(x, 0, z);
  const seat = createGroup('oxygen-high-back-seat');
  addRoundedBox(seat, geometries, materials.upholstery, 'oxygen-seat-back', [0.72, 1.3, 0.22], [0, 1.22, -0.1], [-0.12, 0, 0]);
  addRoundedBox(seat, geometries, materials.upholstery, 'oxygen-seat-cushion', [0.72, 0.18, 0.68], [0, 0.58, 0.18]);
  addCylinder(seat, geometries, materials.silver, 'oxygen-seat-base', [0.1, 0.5, 0.1], [0, 0.29, 0.18]);

  if (equipmentDetail === 'full') {
    addRoundedBox(seat, geometries, materials.upholstery, 'oxygen-seat-headrest', [0.58, 0.3, 0.2], [0, 1.9, -0.18], [-0.12, 0, 0]);
    addRoundedBox(seat, geometries, materials.graphite, 'oxygen-seat-armrest', [0.08, 0.08, 0.48], [-0.43, 0.83, 0.17]);
    addRoundedBox(seat, geometries, materials.graphite, 'oxygen-seat-armrest', [0.08, 0.08, 0.48], [0.43, 0.83, 0.17]);
    addRoundedBox(seat, geometries, materials.silver, 'oxygen-seat-foot', [0.7, 0.07, 0.08], [0, 0.07, 0.18]);
    addRoundedBox(seat, geometries, materials.silver, 'oxygen-seat-foot', [0.08, 0.07, 0.7], [0, 0.07, 0.18]);
  }
  component.add(seat);
  parent.add(component);
}

function addShellSurface(parent, geometries, materials, componentRole, size, position, legacyRole = componentRole) {
  const component = createGroup(componentRole);
  const legacyComponent = legacyRole === componentRole ? component : createGroup(legacyRole);
  addRoundedBox(legacyComponent, geometries, materials.shell, 'oxygen-shell-surface', size, position);
  if (legacyComponent !== component) component.add(legacyComponent);
  parent.add(component);
}

function addOxygenBay(parent, geometries, materials, detailProfile, actionNodes, screens) {
  const bay = createGroup('oxygen-bay');
  bay.position.set(...PROJECT_BAYS.oxygen.center);
  bay.userData.bayId = PROJECT_BAYS.oxygen.id;
  const equipmentDetail = detailProfile.laboratory.equipmentDetail;
  const hasStandardDetails = equipmentDetail !== 'essential';
  const hasFullDetails = equipmentDetail === 'full';

  addProjectGuide(bay, geometries, materials, 'oxygen-floor-guide', 5.0, 0.5);
  addProjectSign(bay, geometries, materials, 'oxygen-project-sign', [0, 3.2, -1.35]);

  const shell = createGroup('oxygen-rounded-shell');
  shell.position.set(0, 0, -0.1);
  addShellSurface(shell, geometries, materials, 'oxygen-shell-side-depth', [4.45, 2.95, 0.28], [0, 1.55, -1.12], 'oxygen-side-depth');
  addShellSurface(shell, geometries, materials, 'oxygen-shell-top', [4.45, 0.34, 2.6], [0, 2.84, 0]);
  addShellSurface(shell, geometries, materials, 'oxygen-shell-bottom', [4.45, 0.3, 2.6], [0, 0.2, 0]);
  addShellSurface(shell, geometries, materials, 'oxygen-shell-side', [0.3, 2.6, 2.6], [-2.08, 1.5, 0]);
  addShellSurface(shell, geometries, materials, 'oxygen-shell-side', [0.3, 2.6, 2.6], [2.08, 1.5, 0]);
  addRoundedBox(shell, geometries, materials.shell, 'oxygen-shell-radius', [0.34, 0.34, 0.44], [-1.9, 2.65, 1.14]);
  addRoundedBox(shell, geometries, materials.shell, 'oxygen-shell-radius', [0.34, 0.34, 0.44], [1.9, 2.65, 1.14]);

  const frontFrame = createGroup('oxygen-dark-front-frame');
  const doorHardware = createGroup('oxygen-door-hardware');
  doorHardware.position.set(1.93, 0, 1.47);
  addInstancedBoxes(frontFrame, geometries, materials.graphite, 'oxygen-front-frame-member', [
    { position: [-2.0, 1.52, 1.32], scale: [0.12, 2.6, 0.16] },
    { position: [-0.68, 1.52, 1.32], scale: [0.1, 2.35, 0.16] },
    { position: [-0.66, 2.72, 1.32], scale: [2.64, 0.12, 0.16] },
    { position: [-0.66, 0.34, 1.32], scale: [2.64, 0.12, 0.16] },
  ]);
  shell.add(frontFrame);

  addBox(doorHardware, geometries, materials.graphite, 'oxygen-door-frame-member', [0.1, 2.35, 0.16], [-1.25, 1.52, -0.15]);
  addBox(doorHardware, geometries, materials.graphite, 'oxygen-door-frame-member', [0.12, 2.6, 0.16], [0.07, 1.52, -0.15]);
  addBox(doorHardware, geometries, materials.graphite, 'oxygen-door-frame-member', [1.32, 0.12, 0.16], [-0.59, 2.72, -0.15]);
  addBox(doorHardware, geometries, materials.graphite, 'oxygen-door-frame-member', [1.32, 0.12, 0.16], [-0.59, 0.34, -0.15]);
  const doorPane = addBox(doorHardware, geometries, materials.glass, 'oxygen-window-pane', [1.08, 2.18, 0.045], [-0.58, 1.52, -0.18]);
  doorPane.userData.visibilityLayers = 1;

  if (hasStandardDetails) {
    addRoundedBox(frontFrame, geometries, materials.graphite, 'oxygen-shell-reveal', [3.82, 0.055, 0.05], [0, 2.58, 1.42]);
    addRoundedBox(frontFrame, geometries, materials.graphite, 'oxygen-shell-reveal', [3.82, 0.055, 0.05], [0, 0.47, 1.42]);
    [0.72, 1.47, 2.22].forEach((y) => {
      addCylinder(doorHardware, geometries, materials.silver, 'oxygen-door-hinge', [0.055, 0.18, 0.055], [0, y, 0]);
    });
  }
  addRoundedBox(doorHardware, geometries, materials.silver, 'oxygen-door-handle', [0.09, 0.78, 0.1], [-0.15, 1.45, 0.01]);
  frontFrame.add(doorHardware);

  const interiorAssembly = createGroup('oxygen-interior-assembly');
  const windows = createGroup('oxygen-window-section');
  [-1.35, 0].forEach((x, index) => {
    const paneMaterial = index === 0 ? materials.smokedGlass : materials.glass;
    const pane = addBox(windows, geometries, paneMaterial, 'oxygen-window-pane', [1.08, 2.18, 0.045], [x, 1.52, 1.29]);
    pane.userData.visibilityLayers = 1;
  });
  frontFrame.add(windows);
  addSeat(interiorAssembly, geometries, materials, -0.72, 0.2, equipmentDetail, 'oxygen-high-back-seat-left');
  addSeat(interiorAssembly, geometries, materials, 0.72, 0.2, equipmentDetail, 'oxygen-high-back-seat-right');
  shell.add(interiorAssembly);

  const baseFrame = createGroup('oxygen-base-frame');
  addRoundedBox(baseFrame, geometries, materials.graphite, 'oxygen-base-frame', [4.2, 0.18, 2.35], [0, 0.08, 0]);
  shell.add(baseFrame);

  if (hasFullDetails) {
    addCylinder(shell, geometries, materials.silver, 'oxygen-air-port', [0.09, 0.06, 0.09], [-1.72, 2.28, 1.47], [Math.PI / 2, 0, 0]);
  }

  const integratedScreenComponent = createGroup('oxygen-integrated-screen');
  integratedScreenComponent.position.set(-0.43, 2.26, -0.01);
  const integratedScreen = addBox(integratedScreenComponent, geometries, materials.screenOxygen, 'oxygen-integrated-screen', [0.7, 0.45, 0.05], [0, 0, 0]);
  doorHardware.add(integratedScreenComponent);
  screens['physical-integrated-screen'] = integratedScreen;
  const statusComponent = createGroup('oxygen-status-line');
  const status = addBox(statusComponent, geometries, materials.cyan, 'oxygen-status-line', [1.05, 0.045, 0.055], [0, 2.64, 1.48]);
  frontFrame.add(statusComponent);
  actionNodes['oxygen-status'] = status;
  bay.add(shell);

  const generator = createGroup('oxygen-generator');
  generator.position.set(-2.95, 0, 0.55);
  addRoundedBox(generator, geometries, materials.shell, 'oxygen-generator-body', [0.9, 1.35, 0.78], [0, 0.72, 0]);
  addBox(generator, geometries, materials.smoked, 'oxygen-generator-vent', [0.58, 0.46, 0.04], [0, 0.9, 0.42]);
  addInstancedGeometry(generator, geometries.cylinder, materials.silver, 'oxygen-generator-detail', [
    { position: [-0.24, 1.18, 0.42], scale: [0.07, 0.045, 0.07], rotation: [Math.PI / 2, 0, 0] },
    { position: [0, 1.18, 0.42], scale: [0.07, 0.045, 0.07], rotation: [Math.PI / 2, 0, 0] },
    { position: [0.24, 1.18, 0.42], scale: [0.07, 0.045, 0.07], rotation: [Math.PI / 2, 0, 0] },
  ]);
  bay.add(generator);

  const hose = createGroup('oxygen-hose');
  const hoseSegment = addGeometryMesh(hose, geometries.oxygenHose, materials.graphite, 'oxygen-hose-segment', [1, 1, 1], [0, 0, 0]);
  hoseSegment.userData.attachment = {
    parentSocket: 'oxygen-generator-outlet',
    localStart: [-2.95, 0.92, 0.98],
    localEnd: [-1.72, 2.28, 1.37],
    contactType: 'socket',
    embedDepth: 0.03,
    gapTolerance: 0.02,
  };
  bay.add(hose);

  const consoleGroup = createGroup('oxygen-touch-console');
  consoleGroup.position.set(2.8, 0, 2.946);
  addBox(consoleGroup, geometries, materials.silver, 'oxygen-console-stand', [0.14, 1.25, 0.14], [0, 0.62, 0]);
  const consoleScreen = addBox(consoleGroup, geometries, materials.screenConsole, 'oxygen-console-screen', [1.15, 0.72, 0.06], [0, 1.42, 0], [-0.18, 0, 0]);
  screens['physical-control-console'] = consoleScreen;
  bay.add(consoleGroup);
  parent.add(bay);
}

function addMobileCasterSet(parent, geometries, materials, wheelRole, forkRole, coordinates, includeForks = true) {
  addInstancedGeometry(parent, geometries.cylinder, materials.graphite, wheelRole, coordinates.map(([x, z]) => ({
    position: [x, 0.12, z],
    scale: [0.18, 0.12, 0.18],
    rotation: [Math.PI / 2, 0, 0],
  })));
  if (includeForks) {
    addInstancedBoxes(parent, geometries, materials.silver, forkRole, coordinates.map(([x, z]) => ({
      position: [x, 0.24, z],
      scale: [0.09, 0.22, 0.12],
    })));
  }
}

function addCloudBay(parent, geometries, materials, detailTier, actionNodes, screens) {
  const bay = createGroup('cloud-compound-bay');
  bay.position.set(...PROJECT_BAYS.cloud.center);
  bay.userData.bayId = PROJECT_BAYS.cloud.id;
  const hasStandardDetails = detailTier !== 'low';

  addProjectGuide(bay, geometries, materials, 'cloud-floor-guide', -5.0, 0.2);
  addBox(bay, geometries, materials.silver, 'cloud-ceiling-rail', [0.16, 0.12, 6.4], [0, 4.0, -0.3]);
  addProjectSign(bay, geometries, materials, 'cloud-project-sign', [0, 3.2, -2.6]);

  const deviceEnd = createGroup('cloud-remote-device-end');
  deviceEnd.position.set(-0.95, 0, 1.25);
  deviceEnd.userData.mobileSystem = true;
  addRoundedBox(deviceEnd, geometries, materials.graphite, 'cloud-remote-device-base', [1.25, 0.18, 1.05], [0, 0.27, 0]);
  const equipmentBody = createGroup('cloud-remote-equipment-body');
  addInstancedGeometry(equipmentBody, geometries.roundedBox, materials.shell, 'cloud-remote-equipment-shell', [
    { position: [0, 0.58, -0.02], scale: [1.22, 0.72, 0.98] },
    { position: [0, 1.02, -0.06], scale: [1.08, 0.48, 0.82] },
    { position: [0, 1.34, -0.1], scale: [0.88, 0.32, 0.66] },
  ]);
  deviceEnd.add(equipmentBody);
  addBox(deviceEnd, geometries, materials.silver, 'cloud-remote-column', [0.1, 1.72, 0.1], [0, 1.82, -0.08]);
  addRoundedBox(deviceEnd, geometries, materials.shell, 'cloud-remote-control-console', [1.05, 0.08, 0.76], [0, 1.46, 0.46], [-0.08, 0, 0]);
  if (hasStandardDetails) {
    addRoundedBox(deviceEnd, geometries, materials.graphite, 'cloud-remote-control-surface', [0.76, 0.025, 0.42], [0, 1.505, 0.47], [-0.08, 0, 0]);
  }
  addMobileCasterSet(deviceEnd, geometries, materials, 'cloud-remote-caster', 'cloud-remote-device-caster-fork', [
    [-0.48, -0.38], [0.48, -0.38], [-0.48, 0.38], [0.48, 0.38],
  ], hasStandardDetails);
  const deviceMonitorArm = createGroup('cloud-remote-device-monitor-arm');
  if (hasStandardDetails) {
    addInstancedBoxes(deviceMonitorArm, geometries, materials.silver, 'cloud-remote-device-monitor-arm-segment', [
      { position: [0, 2.18, -0.04], scale: [0.05, 0.52, 0.05] },
      { position: [-0.12, 2.42, -0.04], scale: [0.72, 0.05, 0.05] },
      { position: [-0.4, 2.28, -0.04], scale: [0.05, 0.28, 0.05] },
    ]);
  }
  addInstancedBoxes(deviceMonitorArm, geometries, materials.screenCloudRemote, 'cloud-remote-device-monitor', [
    { position: [0.17, 2.45, 0.16], scale: [0.62, 0.42, 0.04] },
    { position: [-0.415, 2.38, 0.16], scale: [0.42, 0.29, 0.04] },
  ]);
  deviceEnd.add(deviceMonitorArm);
  if (hasStandardDetails) {
    const probeDock = addRoundedBox(deviceEnd, geometries, materials.graphite, 'cloud-remote-probe-dock', [0.24, 0.42, 0.24], [0.49, 1.18, 0.38]);
    probeDock.userData.socketId = 'cloud-remote-probe-dock';
    const probeCable = addGeometryMesh(deviceEnd, geometries.cloudProbeCable, materials.graphite, 'cloud-remote-probe-cable', [1, 1, 1], [0, 0, 0]);
    probeCable.userData.attachment = {
      parentSocket: 'cloud-remote-probe-dock',
      localStart: [0.5, 1.4, 0.49],
      localEnd: [0.48, 0.58, 0.46],
      contactType: 'socket',
      embedDepth: 0.02,
      gapTolerance: 0.02,
    };
  }
  bay.add(deviceEnd);

  const consultationEnd = createGroup('cloud-remote-consultation-end');
  consultationEnd.position.set(1.0, 0, 0.75);
  consultationEnd.userData.mobileSystem = true;
  addRoundedBox(consultationEnd, geometries, materials.graphite, 'cloud-consultation-base', [2.25, 0.18, 0.85], [0, 0.27, 0]);
  addRoundedBox(consultationEnd, geometries, materials.shell, 'cloud-consultation-desk', [2.08, 0.34, 0.65], [0, 0.58, 0]);
  addMobileCasterSet(consultationEnd, geometries, materials, 'cloud-consultation-caster', 'cloud-consultation-caster-fork', [
    [-0.92, -0.3], [0.92, -0.3], [-0.92, 0.3], [0.92, 0.3],
  ], hasStandardDetails);
  addBox(consultationEnd, geometries, materials.silver, 'cloud-monitor-column', [0.1, 1.1, 0.1], [0, 1.32, -0.23]);
  if (hasStandardDetails) {
    addRoundedBox(consultationEnd, geometries, materials.graphite, 'cloud-consultation-keyboard', [1.02, 0.06, 0.28], [0, 0.94, 0.3], [-0.16, 0, 0]);
  }
  const monitorGroup = createGroup('cloud-dual-monitor');
  if (hasStandardDetails) {
    addInstancedBoxes(monitorGroup, geometries, materials.silver, 'cloud-monitor-arm', [
      { position: [-0.48, 1.55, -0.04], scale: [0.48, 0.05, 0.05] },
      { position: [0.48, 1.55, -0.04], scale: [0.48, 0.05, 0.05] },
      { position: [0, 1.61, -0.04], scale: [0.05, 0.28, 0.05] },
    ]);
  }
  const consultationMonitors = addInstancedBoxes(monitorGroup, geometries, materials.screenCloudRemote, 'cloud-consultation-monitor', [
    { position: [-0.45, 1.8, 0], scale: [0.9, 0.6, 0.045] },
    { position: [0.5, 1.76, 0], scale: [0.72, 0.52, 0.045] },
  ]);
  consultationEnd.add(monitorGroup);
  screens['physical-dual-monitor-workstation'] = consultationMonitors;
  bay.add(consultationEnd);

  const syncLine = addBox(bay, geometries, materials.cyan, 'cloud-remote-sync-line', [2.0, 0.035, 0.06], [0, 0.08, 1.0]);
  actionNodes['cloud-remote-sync'] = syncLine;

  const handheld = createGroup('cloud-handheld-station');
  handheld.position.set(-3.8, 0, -2.0);
  const stand = createGroup('cloud-handheld-stand');
  stand.position.set(0.2325, 0, 0);
  addRoundedBox(stand, geometries, materials.shell, 'cloud-handheld-charging-base', [0.84, 0.14, 0.62], [0, 0.08, 0]);
  addBox(stand, geometries, materials.silver, 'cloud-handheld-stand-column', [0.09, 1.3, 0.09], [0, 0.74, -0.06]);
  const cradle = createGroup('cloud-handheld-cradle');
  cradle.position.set(0, 1.62, 0);
  cradle.scale.x = 1.2;
  if (hasStandardDetails) {
    addInstancedBoxes(cradle, geometries, materials.graphite, 'cloud-handheld-cradle-jaw', [
      { position: [-0.4, -0.62, 0], scale: [0.07, 0.24, 1.15] },
      { position: [0.4, -0.62, 0], scale: [0.07, 0.24, 1.15] },
      { position: [0, -0.75, 0], scale: [0.68, 0.08, 0.5] },
    ]);
  }

  const probe = createGroup('cloud-handheld-waisted-body');
  probe.userData.attachment = {
    parentSocket: 'cloud-handheld-cradle',
    localStart: [0, -0.78, 0],
    localEnd: [0, -0.62, 0],
    contactType: 'socket',
    embedDepth: 0.08,
    gapTolerance: 0.02,
  };
  addGeometryMesh(probe, geometries.handheldShell, materials.shell, 'cloud-handheld-shell-surface', [1, 1, 0.78], [0, 0, 0]);
  addGeometryMesh(probe, geometries.handheldBoundaryArc, materials.navigation, 'cloud-handheld-top-arc', [0.74, 0.72, 0.74], [0, 0.74, 0], [Math.PI / 2, 0, 0]);
  addGeometryMesh(probe, geometries.handheldBoundaryArc, materials.graphite, 'cloud-handheld-bottom-arc', [0.74, 0.72, 0.74], [0, -0.74, 0], [-Math.PI / 2, Math.PI, 0]);
  if (hasStandardDetails) {
    addBox(probe, geometries, materials.graphite, 'cloud-handheld-shell-seam', [0.035, 1.22, 0.035], [0.36, 0, 0]);
  }
  addRoundedBox(probe, geometries, materials.cyan, 'cloud-handheld-status-line', [0.05, 0.96, 0.04], [0, 0, 0.32]);
  if (hasStandardDetails) {
    addRoundedBox(probe, geometries, materials.graphite, 'cloud-handheld-side-button', [0.08, 0.24, 0.12], [0.37, 0.15, 0]);
  }
  cradle.add(probe);
  stand.add(cradle);
  handheld.add(stand);

  const tablet = createGroup('cloud-tablet');
  tablet.position.set(0.2325, 1.03, -0.48);
  addRoundedBox(tablet, geometries, materials.graphite, 'cloud-tablet-frame', [0.56, 1.02, 0.1], [0, 0, 0]);
  const tabletScreen = addBox(tablet, geometries, materials.screenCloudTablet, 'cloud-tablet-screen', [0.46, 0.86, 0.035], [0, 0, 0.07]);
  screens['semantic-foreground-phone-or-tablet'] = tabletScreen;
  const frameLine = addBox(tablet, geometries, materials.cyan, 'cloud-handheld-frame-line', [0.34, 0.03, 0.04], [0, -0.28, 0.1]);
  actionNodes['cloud-handheld-frame'] = frameLine;
  handheld.add(tablet);
  bay.add(handheld);
  parent.add(bay);
}

function captureTransform(node) {
  return {
    position: node.position.toArray(),
    rotation: node.rotation.toArray().slice(0, 3),
    scale: node.scale.toArray(),
  };
}

function restoreTransform(node, transform) {
  node.position.fromArray(transform.position);
  node.rotation.set(...transform.rotation);
  node.scale.fromArray(transform.scale);
}

function createActionController(actionNodes) {
  const actions = new Map();
  const implementations = {
    'alab-transfer': (node, phase, base) => { node.position.x = base.position[0] + phase * 1.35; },
    'primegen-queue': (node, phase, base) => { node.position.x = base.position[0] + phase * 1.72; },
    'oxygen-status': (node, phase, base) => { node.scale.x = base.scale[0] * (0.2 + phase * 0.8); },
    'cloud-remote-sync': (node, phase, base) => { node.scale.x = base.scale[0] * (0.15 + phase * 0.85); },
    'cloud-handheld-frame': (node, phase, base) => { node.position.y = base.position[1] + phase * 0.96; },
  };

  Object.entries(actionNodes).forEach(([id, node]) => {
    actions.set(id, {
      id,
      node,
      base: captureTransform(node),
      apply: implementations[id],
      phase: 0,
      active: false,
    });
  });
  return { actions, activeAction: null };
}

function resetDeviceActions(controller) {
  for (const action of controller.actions.values()) {
    restoreTransform(action.node, action.base);
    action.phase = 0;
    action.active = false;
    action.node.userData.actionPhase = 0;
    action.node.userData.actionActive = false;
  }
  controller.activeAction = null;
}

export function applyDeviceAction(controller, actionState) {
  resetDeviceActions(controller);
  if (!actionState || !controller.actions.has(actionState.id)) return;
  const action = controller.actions.get(actionState.id);
  const phase = Math.min(1, Math.max(0, Number.isFinite(actionState.phase) ? actionState.phase : 0));
  action.apply(action.node, phase, action.base);
  action.phase = phase;
  action.active = true;
  action.node.userData.actionPhase = phase;
  action.node.userData.actionActive = true;
  controller.activeAction = action.id;
}

export function snapshotDeviceActions(controller) {
  return {
    activeAction: controller.activeAction,
    actions: [...controller.actions.values()].map((action) => ({
      id: action.id,
      active: action.active,
      phase: action.phase,
      transform: captureTransform(action.node),
    })),
  };
}

export function estimateTextureBytes(width, height, generateMipmaps = false) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 0 || height < 0) return 0;
  return width * height * 4 * (generateMipmaps ? 4 / 3 : 1);
}

export function configureRuntimeTexture(texture, dimensions) {
  const width = dimensions?.width;
  const height = dimensions?.height;
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new TypeError('runtime texture requires positive integer dimensions');
  }
  if (Math.max(width, height) > 1024) {
    throw new RangeError('runtime texture longest edge must not exceed 1024 pixels');
  }
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.userData.runtimeWidth = width;
  texture.userData.runtimeHeight = height;
  texture.userData.gpuBytes = estimateTextureBytes(width, height, false);
  texture.needsUpdate = true;
  return texture;
}

export function selectPublishedSceneMedia(manifest) {
  const selected = new Map();
  for (const item of manifest?.media ?? []) {
    if (!SCENE_MEDIA_MAPPINGS.includes(item.mapping)) continue;
    if (item.authStatus !== 'APPROVED' || item.publicationStatus !== 'PUBLISHED') continue;
    if (typeof item.path !== 'string' || !item.path.startsWith('./assets/images/')) continue;
    if (!Number.isInteger(item.width) || !Number.isInteger(item.height)) continue;
    if (item.width <= 0 || item.height <= 0 || Math.max(item.width, item.height) > 1024) continue;
    selected.set(item.mapping, item);
  }
  return selected;
}

export async function loadPublishedSceneTextures(manifest, {
  textureLoader = new THREE.TextureLoader(),
  baseUrl = import.meta.url,
} = {}) {
  const selected = selectPublishedSceneMedia(manifest);
  const results = await Promise.allSettled([...selected.entries()].map(async ([mapping, item]) => {
    let texture = null;
    try {
      texture = await textureLoader.loadAsync(new URL(item.path, baseUrl).href);
      configureRuntimeTexture(texture, item);
      texture.name = item.id;
      return [mapping, texture];
    } catch (error) {
      try {
        texture?.dispose?.();
      } catch {
        // Preserve the load/configuration failure as the batch rejection cause.
      }
      throw error;
    }
  }));

  const failures = results.filter(({ status }) => status === 'rejected');
  if (failures.length > 0) {
    const fulfilledTextures = new Set(
      results
        .filter(({ status }) => status === 'fulfilled')
        .map(({ value }) => value[1]),
    );
    for (const texture of fulfilledTextures) {
      try {
        texture.dispose();
      } catch {
        // Cleanup must not hide the original batch failures.
      }
    }
    throw new AggregateError(
      failures.map(({ reason }) => reason),
      'Failed to load laboratory scene textures',
    );
  }
  return new Map(results.map(({ value }) => value));
}

export function applyMappedTextures(world, textures) {
  for (const [mapping, texture] of textures) {
    const target = world.screens[mapping];
    if (!target || !texture) continue;
    target.material.map = texture;
    target.material.color.set(0xffffff);
    target.material.emissive.set(0x111111);
    target.material.emissiveIntensity = 0.12;
    target.material.needsUpdate = true;
    world.loadedTextures.add(texture);
  }
}

function getGeometryTriangles(geometry) {
  if (!geometry) return 0;
  if (geometry.index) return geometry.index.count / 3;
  const positions = geometry.getAttribute?.('position');
  return positions ? positions.count / 3 : 0;
}

function textureDimensions(texture) {
  const image = texture?.image;
  return {
    width: texture?.userData?.runtimeWidth ?? image?.naturalWidth ?? image?.videoWidth ?? image?.width ?? 0,
    height: texture?.userData?.runtimeHeight ?? image?.naturalHeight ?? image?.videoHeight ?? image?.height ?? 0,
  };
}

export function collectSceneStats(root, { detailTier = 'low', additionalTextures = [] } = {}) {
  const profile = getSceneDetailProfile(detailTier);
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  const semanticRoles = new Set();
  let triangles = 0;
  let drawables = 0;
  let instancedCount = 0;
  let transparentDrawables = 0;
  let maxVisibilityLayers = 0;

  root.traverse((object) => {
    if (object.userData.semanticRole) semanticRoles.add(object.userData.semanticRole);
    maxVisibilityLayers = Math.max(maxVisibilityLayers, Number(object.userData.visibilityLayers) || 0);
    if (!(object.isMesh || object.isLine || object.isPoints)) return;
    drawables += 1;
    if (object.geometry) geometries.add(object.geometry);
    const instanceMultiplier = object.isInstancedMesh ? object.count : 1;
    if (object.isInstancedMesh) instancedCount += object.count;
    triangles += getGeometryTriangles(object.geometry) * instanceMultiplier;

    const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
    let transparent = false;
    for (const material of objectMaterials) {
      if (!material) continue;
      materials.add(material);
      transparent ||= material.transparent === true && material.opacity > 0;
      for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'alphaMap']) {
        if (material[key]) textures.add(material[key]);
      }
    }
    if (transparent) transparentDrawables += 1;
  });

  for (const texture of additionalTextures) {
    if (texture?.isTexture) textures.add(texture);
  }

  let textureBytes = 0;
  let maxTextureEdge = 0;
  for (const texture of textures) {
    const { width, height } = textureDimensions(texture);
    maxTextureEdge = Math.max(maxTextureEdge, width, height);
    textureBytes += texture.userData.gpuBytes ?? estimateTextureBytes(width, height, texture.generateMipmaps);
  }
  const budget = {
    ...profile.budget,
    maxTransparentDrawables: 20,
    maxTextureBytes: TEXTURE_GPU_LIMITS[detailTier],
  };
  const roundedTriangles = Math.ceil(triangles);
  const withinBudget = roundedTriangles <= budget.maxTriangles
    && drawables <= budget.maxDrawables
    && geometries.size <= budget.maxGeometries
    && materials.size <= budget.maxMaterials
    && transparentDrawables <= budget.maxTransparentDrawables
    && maxVisibilityLayers <= profile.laboratory.transparentLayers
    && textureBytes <= budget.maxTextureBytes
    && maxTextureEdge <= 1024;

  return {
    triangles: roundedTriangles,
    drawables,
    geometries: geometries.size,
    materials: materials.size,
    transparentDrawables,
    textureBytes,
    maxTextureEdge,
    maxVisibilityLayers,
    instancedCount,
    semanticRoles: [...semanticRoles].sort(),
    budget,
    withinBudget,
  };
}

const OXYGEN_COLLIDER_PROXIES = Object.freeze({
  'oxygen-rounded-shell': { offset: [0, 1.55, 0], size: [4.45, 2.95, 2.6] },
  'oxygen-dark-front-frame': { offset: [0, 1.52, 1.32], size: [4.05, 2.6, 0.16] },
  'oxygen-interior-assembly': { offset: [0, 1.05, 0.2], size: [2.15, 2.1, 1.2] },
  'oxygen-base-frame': { offset: [0, 0.08, 0], size: [4.2, 0.18, 2.35] },
  'oxygen-shell-side-depth': { offset: [0, 1.55, -1.12], size: [4.45, 2.95, 0.28] },
  'oxygen-shell-top': { offset: [0, 2.84, 0], size: [4.45, 0.34, 2.6] },
  'oxygen-shell-bottom': { offset: [0, 0.2, 0], size: [4.45, 0.3, 2.6] },
  'oxygen-window-section': { offset: [-0.675, 1.52, 1.29], size: [2.43, 2.18, 0.045] },
  'oxygen-door-hardware': { offset: [-0.59, 1.52, -0.08], size: [1.38, 2.5, 0.2] },
  'oxygen-high-back-seat-left': { offset: [0, 1.02, 0.1], size: [0.9, 2.1, 0.9] },
  'oxygen-high-back-seat-right': { offset: [0, 1.02, 0.1], size: [0.9, 2.1, 0.9] },
  'oxygen-integrated-screen': { offset: [0, 0, 0], size: [0.7, 0.45, 0.05] },
  'oxygen-status-line': { offset: [0, 2.64, 1.48], size: [1.05, 0.045, 0.055] },
});

const OXYGEN_ANIMATION_ROLES = Object.freeze({
  'oxygen-door-hardware': 'door-control',
  'oxygen-integrated-screen': 'material-state',
  'oxygen-status-line': 'status-progress',
});

const EQUIPMENT_ASSEMBLY_PARTS = Object.freeze({
  'alab-bay': Object.freeze([
    'alab-enclosure',
    'alab-robot-arm',
    'alab-sample-carrier',
    'alab-sample-rack',
    'alab-analyzer',
  ]),
  'primegen-bay': Object.freeze([
    'primegen-planning-console',
    'primegen-instrument-row',
    'primegen-sample-flow',
  ]),
  'oxygen-bay': Object.freeze([
    'oxygen-rounded-shell',
    'oxygen-generator',
    'oxygen-hose',
    'oxygen-touch-console',
  ]),
  'cloud-compound-bay': Object.freeze([
    'cloud-remote-device-end',
    'cloud-remote-consultation-end',
    'cloud-handheld-station',
  ]),
});

function nearestSemanticParentRole(object) {
  let parent = object.parent;
  while (parent) {
    if (parent.userData.semanticRole) return parent.userData.semanticRole;
    parent = parent.parent;
  }
  return null;
}

function serializeNodeTransform(object) {
  return {
    position: [object.position.x, object.position.y, object.position.z],
    rotation: [object.rotation.x, object.rotation.y, object.rotation.z],
    scale: [object.scale.x, object.scale.y, object.scale.z],
  };
}

function createSculptRuntime(root) {
  const nodes = new Map();
  const parts = new Set();
  root.traverse((object) => {
    const role = object.userData.semanticRole;
    if (!role) return;
    if (!nodes.has(role)) nodes.set(role, object);
    if (object.isGroup) parts.add(role);
  });

  const colliders = {};
  const destruction = {};
  for (const [partId, definition] of Object.entries(OXYGEN_COLLIDER_PROXIES)) {
    colliders[partId] = {
      type: 'box',
      offset: [...definition.offset],
      size: [...definition.size],
      isTrigger: false,
      proxy: true,
    };
    destruction[partId] = {
      breakable: false,
      fractureGroup: partId,
      seamRefs: [],
      detachableFragments: [],
      breakImpulse: 0,
    };
  }

  const serializableNodes = [...nodes.entries()].map(([id, object]) => {
    const descriptor = {
      id,
      nodeType: object.isGroup ? 'group' : object.isInstancedMesh ? 'instanced-mesh' : object.isMesh ? 'mesh' : 'object3d',
      parentRole: nearestSemanticParentRole(object),
      transform: serializeNodeTransform(object),
    };
    if (object.isGroup) {
      descriptor.actionProfile = {
        animationRole: OXYGEN_ANIMATION_ROLES[id] ?? 'static',
        pivot: {
          mode: 'group-origin',
          localPosition: [0, 0, 0],
          axis: [0, 1, 0],
        },
        transformChannels: {
          translate: true,
          rotate: true,
          scale: true,
          bend: false,
          twist: false,
          detach: false,
          visibility: true,
          materialState: true,
        },
      };
      if (colliders[id]) descriptor.actionProfile.collider = colliders[id];
      if (destruction[id]) descriptor.actionProfile.destruction = destruction[id];
      object.userData.actionProfile = descriptor.actionProfile;
    }
    return descriptor;
  }).sort((a, b) => a.id.localeCompare(b.id));

  const assemblyParts = new Map();
  const partOwners = new Map();
  const originalPartPositions = new Map();
  for (const [assemblyId, partIds] of Object.entries(EQUIPMENT_ASSEMBLY_PARTS)) {
    const assemblyRoot = nodes.get(assemblyId);
    if (!assemblyRoot) continue;
    const resolved = partIds.map((partId) => nodes.get(partId)).filter(Boolean);
    assemblyParts.set(assemblyId, resolved);
    resolved.forEach((part) => {
      partOwners.set(part, assemblyId);
      originalPartPositions.set(part, part.position.clone());
      part.traverse((object) => {
        if (object !== part && object.isMesh) object.userData.explodeWithParent = true;
      });
    });
  }

  const metadata = {
    version: 1,
    rigType: 'action-ready-static-rig',
    rootRole: 'continuous-laboratory',
    nodes: serializableNodes,
    parts: [...parts].sort(),
    sockets: {
      'oxygen-door': {
        parentRole: 'oxygen-door-hardware',
        position: [0, 0, 0],
        axis: [0, 1, 0],
      },
      'oxygen-front-opening': {
        parentRole: 'oxygen-rounded-shell',
        position: [0, 1.52, 1.32],
      },
      'oxygen-interior-floor': {
        parentRole: 'oxygen-rounded-shell',
        position: [0, 0.2, 0],
      },
      'oxygen-door-hinge': {
        parentRole: 'oxygen-door-hardware',
        position: [0, 1.47, 0],
        axis: [0, 1, 0],
      },
      'oxygen-left-seat': {
        parentRole: 'oxygen-interior-assembly',
        position: [-0.72, 0, 0.2],
      },
      'oxygen-right-seat': {
        parentRole: 'oxygen-interior-assembly',
        position: [0.72, 0, 0.2],
      },
      'oxygen-integrated-screen': {
        parentRole: 'oxygen-integrated-screen',
        position: [0, 0, 0],
      },
    },
    colliders,
    destruction,
    destructionGroups: Object.fromEntries(
      [...assemblyParts.entries()].map(([assemblyId, assemblyPartList]) => [
        assemblyId,
        assemblyPartList.map((part) => part.userData.semanticRole),
      ]),
    ),
    destructionPolicy: {
      mode: 'metadata-only',
      defaultBreakable: false,
      debrisStrategy: 'detach-semantic-groups',
    },
  };
  root.userData.sculptRuntime = metadata;

  function partsForAssembly(assemblyId) {
    return [...(assemblyParts.get(assemblyId) ?? [])];
  }

  function resolvePart(object) {
    let cursor = object ?? null;
    while (cursor) {
      if (partOwners.has(cursor)) return cursor;
      cursor = cursor.parent;
    }
    return null;
  }

  function setExploded(assemblyId, amount = 0) {
    const assemblyPartList = assemblyParts.get(assemblyId) ?? [];
    const factor = THREE.MathUtils.clamp(Number(amount) || 0, 0, 1.5);
    if (assemblyPartList.length === 0) return;
    const center = assemblyPartList.reduce(
      (sum, part) => sum.add(originalPartPositions.get(part)),
      new THREE.Vector3(),
    ).multiplyScalar(1 / assemblyPartList.length);

    assemblyPartList.forEach((part, index) => {
      const origin = originalPartPositions.get(part);
      const radial = origin.clone().sub(center);
      radial.y *= 0.45;
      if (radial.lengthSq() < 0.015) {
        const angle = (index / assemblyPartList.length) * Math.PI * 2;
        radial.set(Math.cos(angle), index % 2 ? 0.24 : -0.12, Math.sin(angle));
      }
      const direction = radial.clone().normalize();
      const offset = radial.multiplyScalar(0.72 * factor)
        .add(direction.multiplyScalar(0.22 * factor));
      part.position.copy(origin).add(offset);
    });
  }

  return {
    nodes,
    metadata,
    partsForAssembly,
    resolvePart,
    setExploded,
  };
}

export function createLaboratoryWorld({ detailTier = 'low' } = {}) {
  const detailProfile = getSceneDetailProfile(detailTier);
  const { materials, proceduralTextures } = createMaterials(detailTier);
  const geometries = createGeometries(detailProfile);
  const root = createGroup('continuous-laboratory');
  root.userData.worldId = LAB_WORLD_ID;
  const building = createGroup('laboratory-building');
  building.userData.worldPart = 'continuous-building';
  root.add(building);

  const actionNodes = {};
  const screens = {};
  addBuildingShell(building, geometries, materials, detailTier);
  addLaboratoryLights(building, detailTier);
  addBayTaskLights(building);
  addAlabBay(building, geometries, materials, detailTier, actionNodes);
  addPrimegenBay(building, geometries, materials, detailTier, actionNodes);
  addOxygenBay(building, geometries, materials, detailProfile, actionNodes, screens);
  addCloudBay(building, geometries, materials, detailTier, actionNodes, screens);
  configureLaboratoryShadows(root, detailTier);

  const sculptRuntime = createSculptRuntime(root);
  const actionController = createActionController(actionNodes);
  const loadedTextures = new Set();
  let disposed = false;
  const world = {
    root,
    building,
    materials,
    geometries,
    screens,
    sculptRuntime,
    actionController,
    loadedTextures,
    proceduralTextures,
    detailTier,
    dispose() {
      if (disposed) return;
      disposed = true;
      resetDeviceActions(actionController);
      loadedTextures.forEach((texture) => texture.dispose());
      proceduralTextures.forEach((texture) => texture.dispose());
      Object.values(materials).forEach((material) => material.dispose());
      Object.values(geometries).forEach((geometry) => geometry.dispose());
      sculptRuntime.nodes.clear();
      root.clear();
    },
  };
  return world;
}
