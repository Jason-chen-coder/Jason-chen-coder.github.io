const CAMERA_HEIGHT = 1.65;
const MINIMUM_HOLD_VIEWPORT_RATIO = 0.35;
const DOM_METRIC_ROUNDING_TOLERANCE_PX = 1;

function freezeVector(values) {
  return Object.freeze([...values]);
}

function normalizeVector(values) {
  const length = Math.hypot(...values);
  if (!Number.isFinite(length) || length === 0) return [0, 0, -1];
  return values.map((value) => value / length);
}

function deriveTarget(position, forward, focusDistance) {
  return position.map((value, index) => value + forward[index] * focusDistance);
}

function createPose(stopId, position, forward, focusDistance, fov, target, preserveTargetY = false) {
  const stablePosition = freezeVector(position);
  const authoredTarget = target ?? deriveTarget(stablePosition, normalizeVector(forward), focusDistance);
  const stableTarget = freezeVector([
    authoredTarget[0],
    preserveTargetY ? authoredTarget[1] : stablePosition[1],
    authoredTarget[2],
  ]);
  const stableForward = freezeVector(normalizeVector(stableTarget.map((value, index) => value - stablePosition[index])));
  const stableFocusDistance = Math.hypot(...stableTarget.map((value, index) => value - stablePosition[index]));
  return Object.freeze({
    stopId,
    position: stablePosition,
    forward: stableForward,
    target: stableTarget,
    focusDistance: stableFocusDistance,
    fov,
    roll: 0,
  });
}

function createBay(id, center, anchorIds) {
  return Object.freeze({
    id,
    center: freezeVector(center),
    anchorIds: Object.freeze([...anchorIds]),
  });
}

export const PROJECT_BAYS = Object.freeze({
  alab: createBay('alab-bay', [-5.8, 0, 1.2], [
    'alab-floor-guide',
    'main-ceiling-rail',
    'alab-project-sign',
  ]),
  primegen: createBay('primegen-bay', [5.6, 0, -4], [
    'primegen-floor-guide',
    'main-ceiling-rail',
    'primegen-project-sign',
  ]),
  oxygen: createBay('oxygen-bay', [-5.8, 0, -9], [
    'oxygen-floor-guide',
    'main-ceiling-rail',
    'oxygen-project-sign',
  ]),
  cloud: createBay('cloud-imaging-bay', [5.8, 0, -15], [
    'cloud-floor-guide',
    'cloud-ceiling-rail',
    'cloud-project-sign',
  ]),
});

const STOP_DEFINITIONS = [
  {
    id: 'top',
    selector: '#top',
    position: [-0.8, CAMERA_HEIGHT, 14],
    forward: [0, 0, -1],
    focusDistance: 10,
    fov: 48,
    anchorIds: ['entrance-sign'],
  },
  {
    id: 'about',
    selector: '#about',
    position: [-0.8, CAMERA_HEIGHT, 10.5],
    forward: [0, 0, -1],
    focusDistance: 9,
    fov: 46,
    anchorIds: ['shared-axis-floor-guide', 'main-ceiling-rail'],
  },
  {
    id: 'alab',
    selector: '.project-alab',
    position: [-5.775, CAMERA_HEIGHT, 8.5],
    forward: [0, 0, -1],
    focusDistance: 7.2,
    fov: 44,
    target: [-5.775, CAMERA_HEIGHT, 1.2],
    bay: PROJECT_BAYS.alab,
    actionId: 'alab-transfer',
  },
  {
    id: 'primegen',
    selector: '.project-primegen',
    position: [5.66, CAMERA_HEIGHT, 2.2],
    forward: [0, 0, -1],
    focusDistance: 7.2,
    fov: 44,
    target: [5.66, CAMERA_HEIGHT, -4.2575],
    bay: PROJECT_BAYS.primegen,
    actionId: 'primegen-queue',
  },
  {
    id: 'oxygen',
    selector: '.project-oxygen',
    position: [-5.8, CAMERA_HEIGHT, -2.4],
    forward: [0, 0, -1],
    focusDistance: 7.2,
    fov: 45,
    target: [-5.8, CAMERA_HEIGHT, -8.985],
    bay: PROJECT_BAYS.oxygen,
    actionId: 'oxygen-status',
  },
  {
    id: 'cloud-remote',
    selector: '.project-imaging [data-scene-stop="cloud-remote"]',
    position: [6.075, CAMERA_HEIGHT, -7.3],
    forward: [0, 0, -1],
    focusDistance: 7.2,
    fov: 44,
    target: [6.075, CAMERA_HEIGHT, -13.7922],
    bay: PROJECT_BAYS.cloud,
    actionId: 'cloud-remote-sync',
  },
  {
    id: 'cloud-handheld',
    selector: '.project-imaging [data-scene-stop="cloud-handheld"]',
    position: [2.1025, CAMERA_HEIGHT, -11],
    forward: [0, 0, -1],
    focusDistance: 7,
    fov: 43,
    target: [2.1025, CAMERA_HEIGHT, -17],
    bay: PROJECT_BAYS.cloud,
    actionId: 'cloud-handheld-frame',
  },
  {
    id: 'craft',
    selector: '#craft',
    position: [0, CAMERA_HEIGHT, -16],
    forward: [0, 0, -1],
    focusDistance: 7,
    fov: 46,
    target: [0, CAMERA_HEIGHT, -18.3],
    anchorIds: ['control-hub-sign', 'main-ceiling-rail'],
  },
  {
    id: 'experience',
    selector: '#experience',
    position: [1.6, CAMERA_HEIGHT, -26],
    forward: [0, 0, -1],
    focusDistance: 9,
    fov: 47,
    anchorIds: ['continuation-corridor-floor-guide', 'continuation-ceiling-rail'],
  },
  {
    id: 'contact',
    selector: '#contact',
    position: [1, CAMERA_HEIGHT, -35],
    forward: [0, 0, -1],
    focusDistance: 7,
    fov: 48,
    anchorIds: ['laboratory-end-sign'],
  },
];

export const SCENE_STOPS = Object.freeze(STOP_DEFINITIONS.map((definition) => {
  const anchorIds = definition.bay?.anchorIds ?? Object.freeze([...(definition.anchorIds ?? [])]);
  return Object.freeze({
    id: definition.id,
    selector: definition.selector,
    pose: createPose(
      definition.id,
      definition.position,
      definition.forward,
      definition.focusDistance,
      definition.fov,
      definition.target,
      definition.preserveTargetY,
    ),
    bayId: definition.bay?.id ?? null,
    anchorIds,
    actionId: definition.actionId ?? null,
  });
}));

export const CAMERA_POSES = Object.freeze(SCENE_STOPS.map(({ pose }) => pose));

function createCollider(id, bayId, minimum, maximum) {
  return Object.freeze({
    id,
    bayId,
    min: freezeVector(minimum),
    max: freezeVector(maximum),
  });
}

export const LAB_COLLIDERS = Object.freeze([
  createCollider('alab-equipment', PROJECT_BAYS.alab.id, [-7.85, -0.1, -0.25], [-3.7, 2.81, 2.65]),
  createCollider('primegen-equipment', PROJECT_BAYS.primegen.id, [3.69, -0.07, -5.675], [7.63, 1.945, -2.8]),
  createCollider('oxygen-chamber', PROJECT_BAYS.oxygen.id, [-9.3, -0.11, -10.5], [-2.325, 3.125, -5.86]),
  createCollider('cloud-remote-equipment', PROJECT_BAYS.cloud.id, [4.125, -0.07, -14.775], [8.025, 2.78, -12.809]),
  createCollider('cloud-handheld-equipment', PROJECT_BAYS.cloud.id, [1.61, -0.1, -17.675], [2.85, 2.51, -16.325]),
]);

function createDetailProfile(tier, laboratory, budget) {
  return Object.freeze({
    tier,
    laboratory: Object.freeze(laboratory),
    budget: Object.freeze(budget),
  });
}

export const SCENE_DETAIL_PROFILES = Object.freeze({
  high: createDetailProfile(
    'high',
    { shellSegments: 24, equipmentDetail: 'full', transparentLayers: 2 },
    { maxTriangles: 110000, maxDrawables: 180, maxGeometries: 48, maxMaterials: 20 },
  ),
  balanced: createDetailProfile(
    'balanced',
    { shellSegments: 18, equipmentDetail: 'standard', transparentLayers: 2 },
    { maxTriangles: 65000, maxDrawables: 140, maxGeometries: 40, maxMaterials: 20 },
  ),
  low: createDetailProfile(
    'low',
    { shellSegments: 12, equipmentDetail: 'essential', transparentLayers: 1 },
    { maxTriangles: 35000, maxDrawables: 110, maxGeometries: 32, maxMaterials: 20 },
  ),
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

function getLateralScale(responsiveConfig) {
  const requested = responsiveConfig?.lateralScale;
  if (!Number.isFinite(requested)) return 1;
  return Math.min(1, Math.max(0.6, requested));
}

function restorePoseFocus(result) {
  if (!Array.isArray(result.position) || !Array.isArray(result.target)) return result;
  const offset = result.target.map((value, index) => value - result.position[index]);
  result.focusDistance = Math.hypot(...offset);
  result.forward = normalizeVector(offset);
  result.roll = 0;
  return result;
}

function applyResponsiveConfig(pose, responsiveConfig) {
  const result = clonePose(pose);
  const lateralScale = getLateralScale(responsiveConfig);
  if (lateralScale !== 1) result.position[0] *= lateralScale;

  const override = responsiveConfig?.stopOverrides?.[pose.stopId];
  const dolly = Number.isFinite(override?.dolly) ? Math.max(0, override.dolly) : 0;
  if (dolly > 0 && Array.isArray(result.target)) {
    const configuredDirection = override?.dollyDirection;
    const horizontalX = Array.isArray(configuredDirection) && Number.isFinite(configuredDirection[0])
      ? configuredDirection[0]
      : result.position[0] - result.target[0];
    const horizontalZ = Array.isArray(configuredDirection) && Number.isFinite(configuredDirection[1])
      ? configuredDirection[1]
      : result.position[2] - result.target[2];
    const horizontalLength = Math.hypot(horizontalX, horizontalZ);
    if (horizontalLength > 0) {
      result.position[0] += horizontalX / horizontalLength * dolly;
      result.position[2] += horizontalZ / horizontalLength * dolly;
    }
  }
  if (Number.isFinite(override?.fov)) result.fov = Math.min(70, Math.max(35, override.fov));
  return restorePoseFocus(result);
}

function preserveAdvancingDepth(poses, minimumStep = 0.25) {
  const result = [...poses];
  for (let index = result.length - 2; index >= 0; index -= 1) {
    const minimumZ = result[index + 1].position[2] + minimumStep;
    if (result[index].position[2] > minimumZ) continue;
    const adjustedPose = clonePose(result[index]);
    adjustedPose.position[2] = minimumZ;
    result[index] = restorePoseFocus(adjustedPose);
  }
  return result;
}

function resolveResponsivePoses(poses, responsiveConfig) {
  return preserveAdvancingDepth(
    poses.map((pose) => applyResponsiveConfig(pose, responsiveConfig)),
  );
}

function validateCameraPoses(poses) {
  poses.forEach((pose, index) => {
    for (const key of ['position', 'forward', 'target']) {
      const vector = pose?.[key];
      if (!Array.isArray(vector) || vector.length !== 3 || !vector.every(Number.isFinite)) {
        throw new TypeError(`camera pose ${index} ${key} must contain exactly three finite numbers`);
      }
    }
    if (Math.hypot(...pose.forward) === 0) {
      throw new RangeError(`camera pose ${index} forward must be non-zero`);
    }
    const targetOffset = pose.target.map((value, axis) => value - pose.position[axis]);
    if (Math.hypot(...targetOffset) === 0) {
      throw new RangeError(`camera pose ${index} target must differ from position`);
    }
    if (!Number.isFinite(pose.fov)) {
      throw new TypeError(`camera pose ${index} fov must be finite`);
    }
    if (pose.fov <= 0 || pose.fov >= 180) {
      throw new RangeError(`camera pose ${index} fov must be between 0 and 180 degrees`);
    }
    if (!Number.isFinite(pose.roll)) {
      throw new TypeError(`camera pose ${index} roll must be finite`);
    }
  });
}

function interpolateResolvedCamera(progress, poses) {
  if (poses.length === 1 || clamp01(progress) === 0) return poses[0];
  if (clamp01(progress) === 1) return poses.at(-1);

  const scaled = clamp01(progress) * (poses.length - 1);
  const startIndex = Math.min(Math.floor(scaled), poses.length - 2);
  const local = scaled - startIndex;
  const start = poses[startIndex];
  const end = poses[startIndex + 1];
  const result = {};

  for (const key of new Set([...Object.keys(start), ...Object.keys(end)])) {
    if (Array.isArray(start[key]) && Array.isArray(end[key])) {
      result[key] = start[key].map((value, index) => mix(value, end[key][index], local));
    } else if (Number.isFinite(start[key]) && Number.isFinite(end[key])) {
      result[key] = mix(start[key], end[key], local);
    } else {
      result[key] = local < 0.5 ? start[key] : end[key];
    }
  }

  return restorePoseFocus(result);
}

export function interpolateCamera(progress, poses, responsiveConfig = {}) {
  const usesProductionRoute = poses === undefined || poses === CAMERA_POSES;
  const sourcePoses = poses ?? CAMERA_POSES;
  if (!Array.isArray(sourcePoses) || sourcePoses.length === 0) {
    throw new TypeError('interpolateCamera requires at least one camera pose');
  }
  validateCameraPoses(sourcePoses);
  const resolvedPoses = usesProductionRoute
    ? resolveResponsivePoses(sourcePoses, responsiveConfig)
    : sourcePoses.map((pose) => applyResponsiveConfig(pose, responsiveConfig));
  return interpolateResolvedCamera(progress, resolvedPoses);
}

export function buildSceneTimeline(metrics, viewportHeight) {
  if (!Array.isArray(metrics) || metrics.length !== SCENE_STOPS.length) {
    throw new TypeError(`buildSceneTimeline requires ${SCENE_STOPS.length} DOM metrics`);
  }
  if (!Number.isFinite(viewportHeight) || viewportHeight <= 0) {
    throw new TypeError('buildSceneTimeline requires a positive viewport height');
  }

  const holdHeight = viewportHeight * MINIMUM_HOLD_VIEWPORT_RATIO;
  let previousTop = -Infinity;
  let previousHoldEnd = -Infinity;
  const measuredStops = metrics.map((metric, index) => {
    const stableStop = SCENE_STOPS[index];
    if (!metric || metric.id !== stableStop.id) {
      throw new RangeError(`DOM metric ${index} must match stable stop ${stableStop.id}`);
    }

    const metricTop = Number(metric.top);
    const metricHeight = Number(metric.height);
    if (!Number.isFinite(metricTop) || !Number.isFinite(metricHeight)) {
      throw new TypeError(`DOM metric ${stableStop.id} requires finite top and height`);
    }
    if (metricTop <= previousTop) {
      throw new RangeError('DOM metric tops must be strictly increasing in stable stop order');
    }
    if (metricHeight <= 0 || metricHeight + DOM_METRIC_ROUNDING_TOLERANCE_PX < holdHeight) {
      throw new RangeError(`DOM metric ${stableStop.id} must provide at least a 35vh hold`);
    }

    const holdStart = Math.floor(metricTop);
    const holdEnd = holdStart + holdHeight;
    if (holdStart <= previousHoldEnd) {
      throw new RangeError('DOM metrics must leave a strictly increasing transition between holds');
    }
    previousTop = metricTop;
    previousHoldEnd = holdEnd;

    return {
      ...stableStop,
      metricTop,
      metricHeight,
      holdStart,
      holdEnd,
    };
  });

  const start = measuredStops[0].holdStart;
  const lastStop = measuredStops.at(-1);
  const end = Math.max(lastStop.metricTop + lastStop.metricHeight, lastStop.holdEnd);
  const span = end - start;
  const stops = measuredStops.map((stop) => Object.freeze({
    ...stop,
    holdStartProgress: (stop.holdStart - start) / span,
    holdEndProgress: (stop.holdEnd - start) / span,
    poseProgress: ((stop.holdStart + stop.holdEnd) / 2 - start) / span,
  }));

  return Object.freeze({
    viewportHeight,
    start,
    end,
    stops: Object.freeze(stops),
  });
}

function requireTimeline(timeline) {
  if (!timeline || !Array.isArray(timeline.stops) || timeline.stops.length !== SCENE_STOPS.length) {
    throw new TypeError('evaluateSceneTimeline requires a measured scene timeline');
  }
}

function getSnappedStop(scrollY, stops) {
  let snapped = stops[0];
  for (const stop of stops) {
    if (scrollY < stop.holdStart) break;
    snapped = stop;
  }
  return snapped;
}

function createTimelineState(progress, activeStopId, camera, action, snapped) {
  return { progress, activeStopId, camera, action, snapped };
}

export function evaluateSceneTimeline(
  scrollY,
  timeline,
  { reducedMotion = false, responsiveConfig = {} } = {},
) {
  requireTimeline(timeline);
  const position = Number.isFinite(scrollY) ? scrollY : timeline.start;
  const progress = clamp01((position - timeline.start) / Math.max(1, timeline.end - timeline.start));
  const { stops } = timeline;
  const resolvedPoses = resolveResponsivePoses(
    stops.map(({ pose }) => pose),
    responsiveConfig,
  );

  if (reducedMotion) {
    const stop = getSnappedStop(position, stops);
    return createTimelineState(
      progress,
      stop.id,
      resolvedPoses[stops.indexOf(stop)],
      null,
      true,
    );
  }

  if (position < stops[0].holdStart) {
    return createTimelineState(progress, null, resolvedPoses[0], null, false);
  }

  for (let index = 0; index < stops.length; index += 1) {
    const stop = stops[index];
    if (position >= stop.holdStart && position <= stop.holdEnd) {
      const phase = clamp01((position - stop.holdStart) / (stop.holdEnd - stop.holdStart));
      const action = stop.actionId ? { id: stop.actionId, phase } : null;
      return createTimelineState(
        progress,
        stop.id,
        resolvedPoses[index],
        action,
        false,
      );
    }

    const next = stops[index + 1];
    if (next && position > stop.holdEnd && position < next.holdStart) {
      const transitionProgress = clamp01((position - stop.holdEnd) / (next.holdStart - stop.holdEnd));
      return createTimelineState(
        progress,
        null,
        interpolateResolvedCamera(transitionProgress, resolvedPoses.slice(index, index + 2)),
        null,
        false,
      );
    }
  }

  return createTimelineState(
    progress,
    null,
    resolvedPoses.at(-1),
    null,
    false,
  );
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
    };
  }

  return {
    tier: constrained ? 'balanced' : 'full',
    detailTier: constrained ? 'balanced' : 'high',
    dpr: Math.min(devicePixelRatio, dprCap),
    animate: true,
  };
}
