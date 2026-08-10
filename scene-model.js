export const CHAPTER_IDS = ['top', 'about', 'work', 'craft', 'experience', 'contact'];
export const READING_LINE_RATIO = 0.46;

export const CAMERA_POSES = [
  { position: [13, 8.5, 32], target: [0, 5.4, -11], fov: 43, fogDensity: 0.009, warmth: 0.2 },
  { position: [-8.5, 5.6, 16], target: [0, 4.5, -4], fov: 39, fogDensity: 0.011, warmth: 0.34 },
  { position: [9.5, 7.4, -2], target: [0, 6.5, -21], fov: 42, fogDensity: 0.01, warmth: 0.5 },
  { position: [-7.2, 9.2, -23], target: [0, 9.3, -39], fov: 38, fogDensity: 0.013, warmth: 0.74 },
  { position: [6.2, 11.6, -42], target: [0, 12.4, -60], fov: 41, fogDensity: 0.011, warmth: 0.58 },
  { position: [-16, 20, -46], target: [-3, 14, -72], fov: 50, fogDensity: 0.008, warmth: 0.88 },
];

export const SCENE_DETAIL_PROFILES = Object.freeze({
  high: Object.freeze({
    tier: 'high',
    textureSize: 256,
    terrainSegments: [56, 72],
    hillDetail: 2,
    temple: Object.freeze({
      shojiPanels: 7,
      mullionsPerPanel: 4,
      bracketClusters: 8,
      rafters: 18,
      railingPosts: 12,
      roofSegments: 18,
    }),
    torii: Object.freeze({ count: 3, postSides: 10, kasagiSegments: 5 }),
    trees: Object.freeze({ archetypes: 3, crownLayers: 4, trunkSides: 8, crownDetail: 1 }),
    stairs: Object.freeze({ count: 39, variants: 3, mossSeams: 13 }),
    lanterns: Object.freeze({ count: 18, frameBars: 4, capSides: 8 }),
    budget: Object.freeze({ minTriangles: 30000, maxTriangles: 110000, maxDrawables: 180, maxGeometries: 48, maxMaterials: 20 }),
  }),
  balanced: Object.freeze({
    tier: 'balanced',
    textureSize: 128,
    terrainSegments: [44, 58],
    hillDetail: 2,
    temple: Object.freeze({
      shojiPanels: 7,
      mullionsPerPanel: 3,
      bracketClusters: 6,
      rafters: 12,
      railingPosts: 8,
      roofSegments: 14,
    }),
    torii: Object.freeze({ count: 3, postSides: 8, kasagiSegments: 3 }),
    trees: Object.freeze({ archetypes: 3, crownLayers: 3, trunkSides: 7, crownDetail: 1 }),
    stairs: Object.freeze({ count: 39, variants: 3, mossSeams: 10 }),
    lanterns: Object.freeze({ count: 18, frameBars: 3, capSides: 6 }),
    budget: Object.freeze({ minTriangles: 18000, maxTriangles: 65000, maxDrawables: 140, maxGeometries: 40, maxMaterials: 20 }),
  }),
  low: Object.freeze({
    tier: 'low',
    textureSize: 128,
    terrainSegments: [32, 46],
    hillDetail: 1,
    temple: Object.freeze({
      shojiPanels: 7,
      mullionsPerPanel: 2,
      bracketClusters: 4,
      rafters: 8,
      railingPosts: 6,
      roofSegments: 10,
    }),
    torii: Object.freeze({ count: 3, postSides: 8, kasagiSegments: 3 }),
    trees: Object.freeze({ archetypes: 3, crownLayers: 2, trunkSides: 6, crownDetail: 0 }),
    stairs: Object.freeze({ count: 39, variants: 3, mossSeams: 7 }),
    lanterns: Object.freeze({ count: 18, frameBars: 2, capSides: 6 }),
    budget: Object.freeze({ minTriangles: 10000, maxTriangles: 35000, maxDrawables: 110, maxGeometries: 32, maxMaterials: 20 }),
  }),
});

export function getSceneDetailProfile(tier) {
  return SCENE_DETAIL_PROFILES[tier] ?? SCENE_DETAIL_PROFILES.low;
}

export function clamp01(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function clonePose(pose) {
  return Object.fromEntries(Object.entries(pose).map(([key, value]) => [key, Array.isArray(value) ? [...value] : value]));
}

function mix(start, end, amount) {
  return start + (end - start) * amount;
}

export function interpolateCamera(progress, poses = CAMERA_POSES) {
  if (!Array.isArray(poses) || poses.length === 0) {
    throw new TypeError('interpolateCamera requires at least one camera pose');
  }
  if (poses.length === 1) return clonePose(poses[0]);

  const scaled = clamp01(progress) * (poses.length - 1);
  const startIndex = Math.min(Math.floor(scaled), poses.length - 2);
  const local = scaled - startIndex;
  const eased = local * local * (3 - 2 * local);
  const start = poses[startIndex];
  const end = poses[startIndex + 1];
  const result = {};

  for (const key of Object.keys(start)) {
    if (Array.isArray(start[key]) && Array.isArray(end[key])) {
      result[key] = start[key].map((value, index) => mix(value, end[key][index], eased));
    } else if (Number.isFinite(start[key]) && Number.isFinite(end[key])) {
      result[key] = mix(start[key], end[key], eased);
    } else {
      result[key] = local < 0.5 ? start[key] : end[key];
    }
  }

  return result;
}

export function getActiveChapter(progress, chapters = CHAPTER_IDS) {
  if (!Array.isArray(chapters) || chapters.length === 0) return null;
  const index = Math.min(chapters.length - 1, Math.floor(clamp01(progress) * chapters.length));
  return chapters[index];
}

export function normalizeScroll(scrollY, scrollHeight, viewportHeight) {
  const travel = Math.max(1, scrollHeight - viewportHeight);
  return clamp01(scrollY / travel);
}

export function alignChapterOffsets(sectionOffsets, viewportHeight, readingLineRatio = READING_LINE_RATIO) {
  if (!Array.isArray(sectionOffsets)) return [];

  const offsets = sectionOffsets.map(Number).filter(Number.isFinite);
  const height = Number.isFinite(viewportHeight) ? Math.max(0, viewportHeight) : 0;
  const readingLine = height * clamp01(readingLineRatio);

  return offsets.map((offset, index) => Math.max(0, index === 0 ? offset : offset - readingLine));
}

export function normalizeChapterScroll(scrollY, sectionOffsets) {
  if (!Array.isArray(sectionOffsets) || sectionOffsets.length < 2) return 0;

  const offsets = sectionOffsets.map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  if (offsets.length < 2) return 0;

  const position = Number.isFinite(scrollY) ? scrollY : 0;
  if (position <= offsets[0]) return 0;
  if (position >= offsets[offsets.length - 1]) return 1;

  let index = 0;
  while (index < offsets.length - 2 && position >= offsets[index + 1]) index += 1;

  const span = Math.max(1, offsets[index + 1] - offsets[index]);
  const local = clamp01((position - offsets[index]) / span);
  return (index + local) / (offsets.length - 1);
}

export function snapCameraProgress(progress, poseCount) {
  const count = Math.max(1, Math.floor(Number(poseCount) || 0));
  if (count < 2) return 0;

  const normalized = clamp01(progress);
  if (normalized === 1) return 1;

  const segments = count - 1;
  return Math.floor(normalized * segments) / segments;
}

export function getHeroTempleTargetOffset(progress, aspect) {
  const viewportAspect = Number.isFinite(aspect) && aspect > 0 ? aspect : 1;
  const portraitWeight = clamp01((0.8 - viewportAspect) / 0.34);
  const heroWeight = 1 - clamp01(clamp01(progress) / 0.2);
  return 7.5 * portraitWeight * heroWeight;
}

export function getPerformanceProfile({
  width = 1440,
  devicePixelRatio = 1,
  hardwareConcurrency = 8,
  reducedMotion = false,
} = {}) {
  const mobile = width <= 720;
  const constrained = mobile || hardwareConcurrency <= 4;
  const dprCap = mobile ? 1.2 : constrained ? 1.3 : 1.5;

  if (reducedMotion) {
    return {
      tier: 'static',
      detailTier: mobile ? 'low' : 'balanced',
      dpr: Math.min(devicePixelRatio, dprCap),
      animate: false,
      rainCount: 0,
      leafCount: 0,
      emberCount: 0,
      treeCount: mobile ? 18 : 28,
      bloom: false,
    };
  }

  return {
    tier: constrained ? 'balanced' : 'full',
    detailTier: constrained ? 'balanced' : 'high',
    dpr: Math.min(devicePixelRatio, dprCap),
    animate: true,
    rainCount: constrained ? 260 : 700,
    leafCount: constrained ? 38 : 86,
    emberCount: constrained ? 28 : 64,
    treeCount: constrained ? 24 : 42,
    bloom: true,
  };
}
