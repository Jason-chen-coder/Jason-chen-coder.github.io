import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

async function loadSceneModel() {
  const source = await read('scene-model.js');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}

async function loadThree() {
  const source = await read('assets/vendor/three/three.core.min.js');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}

function readTopLevelFunction(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} must exist`);
  const bodyStart = source.indexOf('{', start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  assert.fail(`${name} must have a complete function body`);
}

function channels(hex) {
  return {
    red: (hex >> 16) & 255,
    green: (hex >> 8) & 255,
    blue: hex & 255,
  };
}

function luminance(hex) {
  const color = channels(hex);
  return (color.red * 0.2126 + color.green * 0.7152 + color.blue * 0.0722) / 255;
}

function mappedLuminance(base, tint) {
  const baseChannels = channels(base);
  const tintChannels = channels(tint);
  const toLinear = (channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  const toSrgb = (value) => (
    value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055
  );
  const mapped = Object.fromEntries(['red', 'green', 'blue'].map((channel) => [
    channel,
    toSrgb(toLinear(baseChannels[channel]) * toLinear(tintChannels[channel])),
  ]));
  return mapped.red * 0.2126 + mapped.green * 0.7152 + mapped.blue * 0.0722;
}

function readMaterialColor(scene, name) {
  const match = scene.match(new RegExp(`${name}: new THREE\\.MeshStandardMaterial\\(\\{[\\s\\S]*?color: 0x([0-9a-f]+)`, 'i'));
  assert.ok(match, `${name} material color must be explicit`);
  return Number.parseInt(match[1], 16);
}

function readTextureConfig(scene, name) {
  const match = scene.match(new RegExp(
    `const\\s+${name}Textures\\s*=\\s*createSurfaceTextureSet\\(\\s*0x([0-9a-f]+),\\s*[^,]+,\\s*detailProfile\\.textureSize,\\s*\\{\\s*pattern:\\s*'${name}',\\s*repeat:\\s*([\\d.]+)\\s*\\}\\s*\\)`,
    'i',
  ));
  assert.ok(match, `${name} texture must declare its pattern and repeat`);
  return { baseColor: Number.parseInt(match[1], 16), repeat: Number(match[2]) };
}

function readNestedFunction(scene, name) {
  const match = scene.match(new RegExp(`  function ${name}\\([^)]*\\) \\{([\\s\\S]*?)\\n  \\}`));
  assert.ok(match, `${name} must be declared inside createExperience`);
  return match[1];
}

test('performance profiles select a geometry tier independently from motion', async () => {
  const { getPerformanceProfile } = await loadSceneModel();

  assert.equal(getPerformanceProfile({ width: 1440, hardwareConcurrency: 8 }).detailTier, 'high');
  assert.equal(getPerformanceProfile({ width: 1440, hardwareConcurrency: 8, reducedMotion: true }).detailTier, 'balanced');
  assert.equal(getPerformanceProfile({ width: 390, hardwareConcurrency: 8 }).detailTier, 'balanced');
  assert.equal(getPerformanceProfile({ width: 390, hardwareConcurrency: 8, reducedMotion: true }).detailTier, 'low');
  assert.equal(getPerformanceProfile({ width: 1440, hardwareConcurrency: 4 }).detailTier, 'balanced');
});

test('scene detail profiles preserve core structures and scale semantic detail monotonically', async () => {
  const { SCENE_DETAIL_PROFILES, getSceneDetailProfile } = await loadSceneModel();
  const high = getSceneDetailProfile('high');
  const balanced = getSceneDetailProfile('balanced');
  const low = getSceneDetailProfile('low');

  assert.equal(high, SCENE_DETAIL_PROFILES.high);
  assert.equal(getSceneDetailProfile('unknown'), low);

  for (const profile of [high, balanced, low]) {
    assert.equal(profile.temple.shojiPanels, 7);
    assert.equal(profile.torii.count, 3);
    assert.equal(profile.stairs.count, 39);
    assert.equal(profile.stairs.variants, 3);
    assert.equal(profile.lanterns.count, 18);
    assert.equal(profile.trees.archetypes, 3);
  }

  const semanticPaths = [
    ['temple', 'mullionsPerPanel'],
    ['temple', 'bracketClusters'],
    ['temple', 'rafters'],
    ['temple', 'railingPosts'],
    ['temple', 'roofSegments'],
    ['torii', 'postSides'],
    ['torii', 'kasagiSegments'],
    ['trees', 'crownLayers'],
    ['trees', 'trunkSides'],
    ['stairs', 'mossSeams'],
    ['lanterns', 'frameBars'],
  ];

  semanticPaths.forEach(([group, key]) => {
    assert.ok(high[group][key] >= balanced[group][key], `${group}.${key} must decrease for balanced`);
    assert.ok(balanced[group][key] >= low[group][key], `${group}.${key} must decrease for low`);
  });

  assert.ok(high.temple.mullionsPerPanel * high.temple.shojiPanels >= 28);
  assert.ok(high.temple.bracketClusters >= 8);
  assert.ok(high.temple.rafters >= 16);
  assert.deepEqual(high.budget, { minTriangles: 30000, maxTriangles: 110000, maxDrawables: 180, maxGeometries: 48, maxMaterials: 20 });
  assert.deepEqual(balanced.budget, { minTriangles: 18000, maxTriangles: 65000, maxDrawables: 140, maxGeometries: 40, maxMaterials: 20 });
  assert.deepEqual(low.budget, { minTriangles: 10000, maxTriangles: 35000, maxDrawables: 110, maxGeometries: 32, maxMaterials: 20 });
});

test('nearest torii carries original hero detailing while distant gates stay lightweight', async () => {
  const scene = await read('scene.js');
  const toriiStart = scene.indexOf('function createTorii(');
  const sequenceStart = scene.indexOf('function addToriiSequence(');
  const lanternStart = scene.indexOf('function addLanternPath(');
  assert.ok(toriiStart >= 0 && sequenceStart > toriiStart && lanternStart > sequenceStart);

  const torii = scene.slice(toriiStart, sequenceStart);
  const sequence = scene.slice(sequenceStart, lanternStart);
  const heroRoles = [
    'hero-torii-kasagi',
    'hero-torii-shimaki',
    'hero-torii-lacquer-cap',
    'hero-torii-nuki',
    'hero-torii-gakuzuka',
    'hero-torii-plaque',
    'hero-torii-post-bracket',
    'hero-torii-wing-support',
    'hero-torii-stone-footing',
    'hero-torii-footing-band',
    'hero-torii-post-collar',
  ];

  assert.deepEqual(
    heroRoles.filter((role) => !torii.includes(`'${role}'`)),
    [],
    'hero torii must publish every structural role for runtime scene stats',
  );
  assert.match(torii, /function createTorii\([^)]*\bisHero\b/);
  assert.match(sequence, /createTorii\([\s\S]*?index === 0[\s\S]*?\);/);
  assert.match(torii, /if \(!isHero\) \{[\s\S]*?return;/);
  assert.match(torii, /const includeHeroOrnaments = detailProfile\.tier !== 'low';/);
  assert.match(torii, /if \(includeHeroOrnaments\) \{/);
  assert.match(scene, /function addCurvedToriiBeam\(/);
  assert.match(torii, /addInstanced\(group, geometries\.band/);
  for (const retainedRole of ['torii-kasagi', 'torii-nuki', 'torii-plaque']) {
    assert.match(torii, new RegExp(`'${retainedRole}'`), `distant gates must retain ${retainedRole}`);
  }
  assert.doesNotMatch(scene, /sweepPoly|texLacquer|buildTorii/);
});

test('scene construction consumes detail profiles and publishes stats from the real world graph', async () => {
  const scene = await read('scene.js');

  assert.match(scene, /getSceneDetailProfile/);
  assert.match(scene, /const detailProfile = getSceneDetailProfile\(profile\.detailTier\)/);
  for (const helper of ['createMaterials', 'addGround', 'addStonePath', 'addToriiSequence', 'addLanternPath', 'addTemple', 'addForest']) {
    assert.match(scene, new RegExp(`${helper}\\([^;\\n]*detailProfile`), `${helper} must consume the active detail profile`);
  }

  assert.match(scene, /createSeededRandom/);
  assert.match(scene, /createSurfaceTextureSet/);
  assert.match(scene, /new THREE\.InstancedMesh/);
  assert.match(scene, /semanticRole/);
  assert.match(scene, /collectSceneStats\(world, detailProfile\.tier\)/);
  assert.match(scene, /targetCanvas\.dataset\.sceneStats = JSON\.stringify\(sceneStats\)/);
  assert.match(scene, /object\.isInstancedMesh \? object\.count : 1/);
  assert.match(scene, /geometry\.index\?\.count \?\? geometry\.attributes\.position\?\.count/);
});

test('scene bootstrap initializes shared geometry before creating the experience', async () => {
  const scene = await read('scene.js');
  const sharedGeometryIndex = scene.indexOf('const UNIT_BOX_GEOMETRY =');
  const bootstrapIndex = scene.indexOf('if (!canvas) {');

  assert.notEqual(sharedGeometryIndex, -1, 'shared geometry declaration must exist');
  assert.notEqual(bootstrapIndex, -1, 'scene bootstrap must exist');
  assert.ok(
    sharedGeometryIndex < bootstrapIndex,
    'module bootstrap must run after shared geometry constants leave the temporal dead zone',
  );
});

test('surface patterns and palette separate architecture from the night background', async () => {
  const scene = await read('scene.js');

  assert.match(scene, /function createSurfaceTextureSet\(baseColor, seed, size, \{ pattern, repeat \}\)/);
  for (const pattern of ['stone', 'timber', 'roof']) assert.match(scene, new RegExp(`case '${pattern}'`));

  const stone = readTextureConfig(scene, 'stone');
  const timber = readTextureConfig(scene, 'timber');
  const roofTexture = readTextureConfig(scene, 'roof');
  assert.ok(stone.repeat >= 5 && stone.repeat <= 6);
  assert.ok(timber.repeat >= 3 && timber.repeat <= 4.5);
  assert.ok(roofTexture.repeat >= 5.5 && roofTexture.repeat <= 6.5);
  assert.ok(luminance(roofTexture.baseColor) >= luminance(0x28373a) * 1.12);

  const roof = readMaterialColor(scene, 'roof');
  const roofEdge = readMaterialColor(scene, 'roofEdge');
  const timberDark = readMaterialColor(scene, 'timberDark');
  const foliage = readMaterialColor(scene, 'foliage');
  const foliageCold = readMaterialColor(scene, 'foliageCold');
  assert.ok(
    mappedLuminance(roofTexture.baseColor, roofEdge) >= mappedLuminance(roofTexture.baseColor, roof) * 1.06,
    'fascia and ridges must read above the mapped roof plane',
  );
  assert.ok(mappedLuminance(timber.baseColor, timberDark) >= 0.125 && mappedLuminance(timber.baseColor, timberDark) < 0.2);
  assert.ok(luminance(foliage) >= luminance(0x101b17) * 1.6 && luminance(foliage) < 0.3);
  assert.ok(luminance(foliageCold) >= luminance(foliage) * 1.15 && luminance(foliageCold) < 0.36);
  for (const color of [channels(foliage), channels(foliageCold)]) {
    assert.ok(color.green > color.red && color.blue > color.red, 'foliage must remain blue-green');
  }

  const sharedMaterialConstructors = scene.slice(scene.indexOf('function createMaterials'), scene.indexOf('function shadow'))
    .match(/new THREE\.MeshStandardMaterial/g) ?? [];
  assert.equal(sharedMaterialConstructors.length, 13, 'material separation must not add shared materials');
});

test('floating stair treads sit on one continuous inset sloped stone foundation', async () => {
  const scene = await read('scene.js');
  const foundationSource = readTopLevelFunction(scene, 'createStairFoundationGeometry');
  const pathStart = scene.indexOf('function addStonePath(');
  const pathEnd = scene.indexOf('function addCurvedToriiBeam(', pathStart);
  const stonePath = scene.slice(pathStart, pathEnd);

  assert.equal((stonePath.match(/'stair-foundation'/g) ?? []).length, 1, 'the flight must expose one foundation drawable');
  assert.match(
    stonePath,
    /new THREE\.Mesh\(createStairFoundationGeometry\(\), materials\.stoneDark\)/,
    'the foundation must be one mesh reusing stoneDark',
  );

  const THREE = await loadThree();
  const geometry = Function('THREE', `${foundationSource}\nreturn createStairFoundationGeometry();`)(THREE);
  assert.ok(geometry.isBufferGeometry, 'the foundation must use BufferGeometry');
  assert.equal(geometry.index.count, 36, 'a closed wedge prism must contain twelve triangles');
  assert.equal(geometry.attributes.uv.count, geometry.attributes.position.count, 'mapped stone needs UVs on every vertex');
  assert.equal(geometry.attributes.normal.count, geometry.attributes.position.count, 'the wedge must publish computed normals');

  const positions = geometry.attributes.position;
  const uvs = geometry.attributes.uv;
  const positionAxes = ['x', 'y', 'z'];
  const faceVertices = Array.from({ length: positions.count / 4 }, (_, faceIndex) => (
    Array.from({ length: 4 }, (_, vertexIndex) => {
      const index = faceIndex * 4 + vertexIndex;
      return {
        position: [positions.getX(index), positions.getY(index), positions.getZ(index)],
        uv: [uvs.getX(index), uvs.getY(index)],
      };
    })
  ));
  const span = (face, axis) => {
    const values = face.map(({ position }) => position[axis]);
    return Math.max(...values) - Math.min(...values);
  };
  const mappedFaces = {};
  const capFaces = [];
  faceVertices.forEach((face) => {
    if (span(face, 2) < 1e-5) {
      mappedFaces[face[0].position[2] > 0 ? 'front' : 'rear'] = { face, axes: [0, 1] };
      return;
    }
    if (span(face, 0) < 1e-5) {
      mappedFaces[face[0].position[0] < 0 ? 'left side' : 'right side'] = { face, axes: [2, 1] };
      return;
    }
    capFaces.push(face);
  });
  const averageY = (face) => face.reduce((sum, vertex) => sum + vertex.position[1] / face.length, 0);
  capFaces.sort((left, right) => averageY(left) - averageY(right));
  mappedFaces.bottom = { face: capFaces[0], axes: [0, 2] };
  mappedFaces.top = { face: capFaces[1], axes: [0, 2] };
  assert.deepEqual(
    Object.keys(mappedFaces).sort(),
    ['bottom', 'front', 'left side', 'rear', 'right side', 'top'],
    'the UV contract must classify all six foundation faces',
  );
  const uvWorldScale = 5.5;
  for (const label of ['left side', 'right side', 'top', 'front', 'rear', 'bottom']) {
    const { face, axes } = mappedFaces[label];
    const origin = face[0];
    face.slice(1).forEach((vertex) => {
      const expectedU = (vertex.position[axes[0]] - origin.position[axes[0]]) / uvWorldScale;
      const expectedV = (vertex.position[axes[1]] - origin.position[axes[1]]) / uvWorldScale;
      assert.ok(
        Math.abs((vertex.uv[0] - origin.uv[0]) - expectedU) < 1e-5,
        `${label} U must track world ${positionAxes[axes[0]]} at one UV per ${uvWorldScale} units`,
      );
      assert.ok(
        Math.abs((vertex.uv[1] - origin.uv[1]) - expectedV) < 1e-5,
        `${label} V must track world ${positionAxes[axes[1]]} at one UV per ${uvWorldScale} units`,
      );
    });
  }

  const uniqueCorners = [...new Map(Array.from({ length: positions.count }, (_, index) => {
    const corner = [positions.getX(index), positions.getY(index), positions.getZ(index)];
    return [corner.map((value) => value.toFixed(5)).join(','), corner];
  })).values()];
  assert.equal(uniqueCorners.length, 8, 'the foundation must be one trapezoidal prism');

  const xs = uniqueCorners.map(([x]) => x);
  const zs = uniqueCorners.map(([, , z]) => z);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const frontZ = Math.max(...zs);
  const rearZ = Math.min(...zs);
  const expectedFrontZ = 22 + 2.5 / 2;
  const expectedRearZ = 22 - (39 - 1) * 2.35 - 2.5 / 2;
  assert.ok(maxX - minX >= 4.6 && maxX - minX <= 4.8, 'foundation width must retain tread side overhang');
  assert.ok(5.5 - 0.28 > maxX - minX, 'even the narrowest tread must overhang the foundation');
  assert.ok(Math.abs(frontZ - expectedFrontZ) < 1e-5, 'foundation must start at the first tread front edge');
  assert.ok(Math.abs(rearZ - expectedRearZ) < 1e-5, 'foundation must end at the last tread rear edge');

  const frontYs = uniqueCorners.filter(([, , z]) => Math.abs(z - frontZ) < 1e-5).map(([, y]) => y);
  const rearYs = uniqueCorners.filter(([, , z]) => Math.abs(z - rearZ) < 1e-5).map(([, y]) => y);
  const frontTopY = Math.max(...frontYs);
  const frontBottomY = Math.min(...frontYs);
  const rearTopY = Math.max(...rearYs);
  const rearBottomY = Math.min(...rearYs);
  const frontThickness = frontTopY - frontBottomY;
  const rearThickness = rearTopY - rearBottomY;
  assert.ok(frontThickness >= 0.85 && frontThickness <= 0.95, 'front foundation thickness must stay near 0.9 instead of reaching terrain');
  assert.ok(rearThickness >= 0.85 && rearThickness <= 0.95, 'rear foundation thickness must stay near 0.9 instead of reaching terrain');

  const slope = (rearTopY - frontTopY) / (frontZ - rearZ);
  const bottomSlope = (rearBottomY - frontBottomY) / (frontZ - rearZ);
  assert.ok(Math.abs(slope - 0.34 / 2.35) < 1e-6, 'foundation top must follow the stair rise/run');
  assert.ok(Math.abs(bottomSlope - slope) < 1e-6, 'foundation bottom must stay parallel to its top');
  for (let index = 0; index < 39; index += 1) {
    const treadZ = 22 - index * 2.35;
    const treadUnderside = index * 0.34 - 0.48 / 2;
    const foundationTop = frontTopY + (frontZ - treadZ) * slope;
    const clearance = treadUnderside - foundationTop;
    assert.ok(clearance >= 0.05 - 1e-5 && clearance <= 0.1 + 1e-5, `tread ${index} must float just above the foundation`);
  }

  const terrainHelperSource = readTopLevelFunction(scene, 'liftTerrainForStairFoundation');
  const pathElevationModel = (z) => Math.min(13.2, Math.max(0, (22 - z) * 0.145));
  const liftTerrain = Function(
    'pathElevation',
    `${terrainHelperSource}\nreturn liftTerrainForStairFoundation;`,
  )(pathElevationModel);
  for (let index = 0; index < 39; index += 1) {
    const treadZ = 22 - index * 2.35;
    const foundationBottom = frontBottomY + (frontZ - treadZ) * bottomSlope;
    const terrainY = liftTerrain(0, -20, treadZ);
    const overlap = terrainY - foundationBottom;
    assert.ok(overlap >= 0.08 && overlap <= 0.16, `terrain must overlap the foundation beneath tread ${index}`);
  }

  const coreZ = -20;
  const naturalY = -5;
  const targetBedY = pathElevationModel(coreZ) - 1.1;
  for (const x of [-3, 0, 3]) {
    assert.ok(Math.abs(liftTerrain(x, naturalY, coreZ) - targetBedY) < 1e-9, `x=${x} must receive full stair support`);
  }
  const sideFalloffY = liftTerrain(5.75, naturalY, coreZ);
  assert.ok(sideFalloffY > naturalY && sideFalloffY < targetBedY, 'side support must fade between x=3 and x=8.5');
  for (const x of [-9, -8.5, 8.5, 9]) {
    assert.equal(liftTerrain(x, naturalY, coreZ), naturalY, `x=${x} must preserve natural terrain`);
  }

  const frontTargetY = pathElevationModel(25) - 1.1;
  assert.ok(Math.abs(liftTerrain(0, naturalY, 25) - frontTargetY) < 1e-9, 'front support must remain full through z=25');
  assert.equal(liftTerrain(0, naturalY, 34), naturalY, 'front support must fade out by z=34');
  assert.ok(liftTerrain(0, naturalY, 29.5) > naturalY && liftTerrain(0, naturalY, 29.5) < frontTargetY, 'front support must fade gradually');
  const rearTargetY = pathElevationModel(-80) - 1.1;
  assert.ok(Math.abs(liftTerrain(0, naturalY, -80) - rearTargetY) < 1e-9, 'rear support must remain full through z=-80');
  assert.equal(liftTerrain(0, naturalY, -94), naturalY, 'rear support must fade out by z=-94');
  assert.ok(liftTerrain(0, naturalY, -87) > naturalY && liftTerrain(0, naturalY, -87) < rearTargetY, 'rear support must fade gradually');
  for (const [x, z] of [[0, coreZ], [5.75, 29.5], [0, -87]]) {
    assert.equal(liftTerrain(x, 20, z), 20, 'stair support must never lower natural terrain');
  }

  const groundSource = readTopLevelFunction(scene, 'addGround');
  for (const contract of [
    /const groundPosition = \[0, -1\.2, -30\]/,
    /const localPlaneY = positions\.getY\(index\)/,
    /const worldZ = groundPosition\[2\] - localPlaneY/,
    /const liftedWorldY = terrainElevation\(x, worldZ\)/,
    /positions\.setZ\(index, liftedWorldY - groundPosition\[1\]\)/,
    /ground\.position\.set\(\.\.\.groundPosition\)/,
  ]) assert.match(groundSource, contract, 'ground shaping must convert between plane-local and world coordinates');

  const landingRearZ = -70 - 16 / 2;
  const landingFrontZ = -70 + 16 / 2;
  const landingBottomY = 12.75 - 1.1 / 2;
  const landingTopY = 12.75 + 1.1 / 2;
  assert.ok(rearZ >= landingRearZ && rearZ <= landingFrontZ, 'upper foundation end must stay inside the landing footprint');
  assert.ok(rearTopY >= landingBottomY && rearTopY <= landingTopY, 'upper foundation end must meet without rising through the landing');

  const center = uniqueCorners.reduce(
    (sum, [x, y, z]) => [sum[0] + x / 8, sum[1] + y / 8, sum[2] + z / 8],
    [0, 0, 0],
  );
  const indices = geometry.index.array;
  for (let offset = 0; offset < indices.length; offset += 3) {
    const vertices = [indices[offset], indices[offset + 1], indices[offset + 2]].map((index) => (
      [positions.getX(index), positions.getY(index), positions.getZ(index)]
    ));
    const ab = vertices[1].map((value, axis) => value - vertices[0][axis]);
    const ac = vertices[2].map((value, axis) => value - vertices[0][axis]);
    const normal = [
      ab[1] * ac[2] - ab[2] * ac[1],
      ab[2] * ac[0] - ab[0] * ac[2],
      ab[0] * ac[1] - ab[1] * ac[0],
    ];
    const triangleCenter = [0, 1, 2].map((axis) => (
      (vertices[0][axis] + vertices[1][axis] + vertices[2][axis]) / 3
    ));
    const outward = normal.reduce((dot, value, axis) => dot + value * (triangleCenter[axis] - center[axis]), 0);
    assert.ok(outward > 1e-5, `triangle ${offset / 3} must wind outward`);
  }
});

test('lantern footings reach the side terrain instead of floating beside the stairs', async () => {
  const scene = await read('scene.js');
  const terrainSource = readTopLevelFunction(scene, 'terrainElevation');
  const meshTerrainSource = readTopLevelFunction(scene, 'terrainMeshElevation');
  const groundSource = readTopLevelFunction(scene, 'addGround');
  const lanternSource = readTopLevelFunction(scene, 'addLanternPath');

  assert.match(groundSource, /terrainElevation\(x, worldZ\)/, 'ground and lanterns must share one height model');
  assert.match(lanternSource, /const groundY = terrainMeshElevation\(x, z, detailProfile\.terrainSegments\)/);
  assert.match(lanternSource, /const y = Math\.max\(pathY, groundY \+ 0\.75\);/);
  assert.match(lanternSource, /lanterns\.push\(\{ x, y, z, groundY \}\)/);
  assert.match(lanternSource, /const footingTop = y \+ 0\.375;/);
  assert.match(lanternSource, /const footingBottom = groundY - 0\.12;/);
  assert.match(lanternSource, /position: \[x, \(footingTop \+ footingBottom\) \/ 2, z\]/);
  assert.match(lanternSource, /scale: \[0\.75, footingTop - footingBottom, 0\.75\]/);

  const terrainElevation = Function(
    'pathElevation',
    `${readTopLevelFunction(scene, 'liftTerrainForStairFoundation')}\n${terrainSource}\nreturn terrainElevation;`,
  )((z) => Math.min(13.2, Math.max(0, (22 - z) * 0.145)));

  const terrainMeshElevation = Function(
    'terrainElevation',
    `${meshTerrainSource}\nreturn terrainMeshElevation;`,
  )(terrainElevation);
  const THREE = await loadThree();
  const { SCENE_DETAIL_PROFILES } = await loadSceneModel();
  for (const [tier, { terrainSegments }] of Object.entries(SCENE_DETAIL_PROFILES)) {
    const geometry = new THREE.PlaneGeometry(120, 190, ...terrainSegments);
    const positions = geometry.attributes.position;
    for (let vertex = 0; vertex < positions.count; vertex += 1) {
      const x = positions.getX(vertex);
      const worldZ = -30 - positions.getY(vertex);
      positions.setZ(vertex, terrainElevation(x, worldZ) + 1.2);
    }
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(0, -1.2, -30);
    mesh.updateMatrixWorld(true);
    const raycaster = new THREE.Raycaster();

    for (let index = 3; index < 37; index += 4) {
      const z = 22 - index * 2.35;
      const pathY = index * 0.34 + 0.2;
      for (const side of [-1, 1]) {
        const x = side * (4.1 + Math.sin(index) * 0.18);
        raycaster.set(new THREE.Vector3(x, 30, z), new THREE.Vector3(0, -1, 0));
        const visibleGroundY = raycaster.intersectObject(mesh, false)[0]?.point.y;
        assert.ok(Number.isFinite(visibleGroundY), `${tier} lantern ${index}/${side} must sit above terrain`);
        const sampledGroundY = terrainMeshElevation(x, z, terrainSegments);
        const y = Math.max(pathY, sampledGroundY + 0.75);
        assert.ok(Math.abs(sampledGroundY - visibleGroundY) < 1e-5, `${tier} mesh sampler must match rendered terrain`);
        const footingTop = y + 0.375;
        const footingBottom = sampledGroundY - 0.12;
        assert.ok(footingBottom < visibleGroundY, `${tier} lantern ${index}/${side} footing must penetrate terrain`);
        assert.ok(footingTop > y + 0.325, `${tier} lantern ${index}/${side} footing must overlap its stem`);
        assert.ok(footingTop - footingBottom > 1, `${tier} lantern ${index}/${side} needs a substantial buried footing`);
      }
    }
  }
});

test('torii footings reach terrain outside the stair foundation', async () => {
  const scene = await read('scene.js');
  const toriiSource = readTopLevelFunction(scene, 'createTorii');
  const terrainSource = readTopLevelFunction(scene, 'terrainElevation');
  const meshTerrainSource = readTopLevelFunction(scene, 'terrainMeshElevation');

  assert.match(toriiSource, /const footingTransforms = \[-1, 1\]\.map\(\(side\) => \{/);
  assert.match(toriiSource, /const worldPostX = x \+ side \* 3\.1 \* scale;/);
  assert.match(toriiSource, /const groundY = terrainMeshElevation\(worldPostX, z, detailProfile\.terrainSegments\);/);
  assert.match(toriiSource, /const footingTop = 0\.43;/);
  assert.match(toriiSource, /const footingBottom = \(groundY - 0\.12 - y\) \/ scale;/);
  assert.match(toriiSource, /position: \[side \* 3\.1, \(footingTop \+ footingBottom\) \/ 2, 0\]/);
  assert.match(toriiSource, /scale: \[1, \(footingTop - footingBottom\) \/ 0\.5, 1\]/);

  const pathElevationModel = (z) => Math.min(13.2, Math.max(0, (22 - z) * 0.145));
  const terrainElevation = Function(
    'pathElevation',
    `${readTopLevelFunction(scene, 'liftTerrainForStairFoundation')}\n${terrainSource}\nreturn terrainElevation;`,
  )(pathElevationModel);
  const terrainMeshElevation = Function(
    'terrainElevation',
    `${meshTerrainSource}\nreturn terrainMeshElevation;`,
  )(terrainElevation);
  const { SCENE_DETAIL_PROFILES } = await loadSceneModel();

  for (const [tier, { terrainSegments }] of Object.entries(SCENE_DETAIL_PROFILES)) {
    for (const [gateIndex, stepIndex] of [5, 17, 29].entries()) {
      const x = Math.sin(gateIndex * 2.1) * 0.2;
      const y = stepIndex * 0.34 + 0.3;
      const z = 22 - stepIndex * 2.35;
      const scale = 1 - gateIndex * 0.04;
      for (const side of [-1, 1]) {
        const worldPostX = x + side * 3.1 * scale;
        const groundY = terrainMeshElevation(worldPostX, z, terrainSegments);
        const footingTopWorld = y + 0.43 * scale;
        const footingBottomWorld = groundY - 0.12;
        assert.ok(footingBottomWorld < groundY, `${tier} torii ${gateIndex}/${side} must penetrate terrain`);
        assert.ok(footingTopWorld > y - 0.15 * scale, `${tier} torii ${gateIndex}/${side} footing must overlap its post`);
        assert.ok(footingTopWorld > footingBottomWorld, `${tier} torii ${gateIndex}/${side} footing scale must stay positive`);
      }
    }
  }
});

test('the summit terrain supports the full temple footprint', async () => {
  const scene = await read('scene.js');
  const terrainSource = readTopLevelFunction(scene, 'terrainElevation');
  const meshTerrainSource = readTopLevelFunction(scene, 'terrainMeshElevation');
  const { SCENE_DETAIL_PROFILES } = await loadSceneModel();

  assert.match(terrainSource, /templePlateau/, 'terrain must include a summit plateau beneath the temple');
  assert.match(terrainSource, /Math\.max\(naturalWorldY, templePlateau\)/);

  const pathElevationModel = (z) => Math.min(13.2, Math.max(0, (22 - z) * 0.145));
  const terrainElevation = Function(
    'pathElevation',
    `${readTopLevelFunction(scene, 'liftTerrainForStairFoundation')}\n${terrainSource}\nreturn terrainElevation;`,
  )(pathElevationModel);
  const terrainMeshElevation = Function(
    'terrainElevation',
    `${meshTerrainSource}\nreturn terrainMeshElevation;`,
  )(terrainElevation);

  for (const [tier, { terrainSegments }] of Object.entries(SCENE_DETAIL_PROFILES)) {
    for (const x of [-12, -6, 0, 6, 12]) {
      for (const z of [-79.5, -75.75, -72, -68.25, -64.5]) {
        assert.ok(
          terrainMeshElevation(x, z, terrainSegments) >= 12.45,
          `${tier} terrain at ${x},${z} must overlap the temple base`,
        );
      }
    }
  }
});

test('every tree trunk is planted into the rendered terrain mesh', async () => {
  const scene = await read('scene.js');
  const forestSource = readTopLevelFunction(scene, 'addForest');

  assert.match(
    forestSource,
    /const groundY = terrainMeshElevation\(x, z, detailProfile\.terrainSegments\);/,
    'forest placement must sample the same triangulated surface that is rendered',
  );
  assert.match(forestSource, /y: groundY - 0\.12/);
  assert.doesNotMatch(forestSource, /pathElevation\(z\) \+ range/);
});

test('WebGL context lifecycle suspends stale frames and restores one render loop', async () => {
  const scene = await read('scene.js');
  const contextLost = readNestedFunction(scene, 'handleContextLost');
  const contextRestored = readNestedFunction(scene, 'handleContextRestored');
  const animate = readNestedFunction(scene, 'animate');
  const requestStaticRender = readNestedFunction(scene, 'requestStaticRender');

  assert.match(scene, /let suspended = false/);
  for (const contract of [
    /event\.preventDefault\(\)/,
    /cancelAnimationFrame\(animationFrame\)/,
    /cancelAnimationFrame\(resizeFrame\)/,
    /animationFrame = 0/,
    /resizeFrame = 0/,
    /suspended = true/,
    /targetCanvas\.dataset\.sceneState = 'suspended'/,
    /markFallback\(\)/,
  ]) assert.match(contextLost, contract);

  for (const contract of [
    /if \(disposed \|\| !suspended\) return/,
    /suspended = false/,
    /root\.dataset\.webgl = 'ready'/,
    /targetCanvas\.dataset\.sceneState = 'ready'/,
    /renderer\.setPixelRatio\(runtimeDpr\)/,
    /renderer\.setSize\(window\.innerWidth, window\.innerHeight, false\)/,
    /composer\?\.setPixelRatio\(runtimeDpr\)/,
    /composer\?\.setSize\(window\.innerWidth, window\.innerHeight\)/,
    /camera\.aspect = window\.innerWidth \/ window\.innerHeight/,
    /camera\.updateProjectionMatrix\(\)/,
    /chapterOffsets = measureChapterOffsets\(\)/,
    /targetProgress = readScrollProgress\(\)/,
    /currentProgress = targetProgress/,
    /if \(profile\.animate && !animationFrame\) animationFrame = requestAnimationFrame\(animate\)/,
    /else requestStaticRender\(\)/,
  ]) assert.match(contextRestored, contract);

  assert.match(animate, /if \(disposed \|\| suspended\)/);
  assert.match(requestStaticRender, /if \(disposed \|\| suspended \|\| animationFrame\) return/);
  assert.equal((scene.match(/addEventListener\('webglcontextlost'/g) ?? []).length, 1);
  assert.equal((scene.match(/addEventListener\('webglcontextrestored'/g) ?? []).length, 1);
  assert.match(scene, /removeEventListener\('webglcontextlost', handleContextLost\)/);
  assert.match(scene, /removeEventListener\('webglcontextrestored', handleContextRestored\)/);
});
