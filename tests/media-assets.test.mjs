import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { access, readFile, readdir, stat } from 'node:fs/promises';
import { basename, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const rootPath = fileURLToPath(root);
const read = (path) => readFile(new URL(path, root));
const execFileAsync = promisify(execFile);

const EXPECTED_MEDIA = [
  ['alab-laboratory-overview', 'alab', 1, './assets/images/plate-alab-continuous-lab.webp'],
  ['alab-task-management', 'alab', 2, './assets/images/alab-task-management.webp'],
  ['alab-protocol-orchestration', 'alab', 3, './assets/images/alab-protocol-orchestration.webp'],
  ['alab-device-execution', 'alab', 4, './assets/images/alab-device-execution.webp'],
  ['alab-run-timeline', 'alab', 5, './assets/images/alab-run-timeline.webp'],
  ['primegen-workflow-overview', 'primegen', 1, './assets/images/plate-primegen-workflow.webp'],
  ['primegen-ai-workflow', 'primegen', 2, './assets/images/primegen-ai-workflow.webp'],
  ['primegen-camera-composite', 'primegen', 3, './assets/images/primegen-camera-composite.webp'],
  ['oxygen-rigid-chamber', 'oxygen', 1, './assets/images/oxygen-rigid-chamber.webp'],
  ['oxygen-soft-chamber', 'oxygen', 2, './assets/images/oxygen-soft-chamber.webp'],
  ['oxygen-device-screen', 'oxygen', 3, './assets/images/oxygen-device-screen.webp'],
  ['oxygen-touch-client', 'oxygen', 4, './assets/images/oxygen-touch-client.webp'],
  ['oxygen-mini-program', 'oxygen', 5, './assets/images/oxygen-mini-program.webp'],
  ['cloud-remote-ultrasound-system', 'cloud', 1, './assets/images/cloud-remote-ultrasound-system.webp'],
  ['cloud-remote-consultation-ui', 'cloud', 2, './assets/images/cloud-remote-consultation-ui.webp'],
  ['cloud-handheld-probe', 'cloud', 3, './assets/images/cloud-handheld-probe.webp'],
  ['cloud-handheld-app', 'cloud', 4, './assets/images/cloud-handheld-app.webp'],
];

const EXPECTED_MAPPINGS = [
  'portfolio-alab-laboratory-overview',
  'portfolio-alab-task-management',
  'portfolio-alab-protocol-orchestration',
  'portfolio-alab-device-execution',
  'portfolio-alab-run-timeline',
  'portfolio-primegen-workflow-overview',
  'portfolio-primegen-ai-workflow',
  'portfolio-primegen-camera-composite',
  'physical-chamber-evidence',
  'physical-support-system-evidence',
  'physical-integrated-screen',
  'physical-control-console',
  'semantic-foreground-phone',
  'physical-remote-system',
  'physical-dual-monitor-workstation',
  'physical-display-stand',
  'semantic-foreground-phone-or-tablet',
];

const SENSITIVE_SOURCE_PREFIXES = ['cc3127a1', '9b7df9ac', '7103e1ee'];
const PRIMEGEN_CAMERA_SOURCE_SHA256 = {
  camera1: 'b96a892101d0abedfb941f99b5b9ea2ef5deb963657740aa16b61742f1103b25',
  camera2: 'c5b047ef923adac3eada6d298f5ce018de55d90a250fb2dc1acc843f6f0a56ce',
  camera3: 'd70b8db796ec6f34e165cdf4ebbab85790d19ed2e260e04a675609b204cd0683',
};
const SENSITIVE_SOURCE_SHA256 = new Set([
  'c7cf9c1942b6977a388db9f7994e4c5d593dbb79011262d3eb7790b9473379ae',
  ...Object.values(PRIMEGEN_CAMERA_SOURCE_SHA256),
  '185e993cc120d2c64db17fe553cbfb649410226dc9071d2c2457a8048d937bec',
  '8b87b2fe752e32ffaa5f0746c54cb034e3f35434e03d566fcd79b6dbc1ced742',
  '351f476d7013b4659fa66df6a7d4c3396684554be15814955e7ffd2519dc96bf',
  'cee58fd9cdfdb0aa8e8f50412b10426309480caf6000285b795b95dbbf21c457',
  '6c70fc1eedc954554cc23304da15ea81e3406f66d614fbb810055704347e3862',
  '366aedc4ebebc31d80074385fbde2856f8fb07724a217e7b6361cd485f6f9ed0',
  '37d10eb26956b7c5506cf47220397cd7da239465617a6959f1f9597b22cfc057',
]);

const LEGACY_GARDEN_PLATE_SHA256 = new Set([
  '78e58888a2b9eb9b218741c48fb8381396ee09abde559df66c053296cac71f1f',
  '9c76579f9defa75634cd9ecdbc643988a6b705acdbb90a41cec997246d781a99',
]);

const CURRENT_PROJECT_PLATE_SHA256 = new Map([
  ['assets/images/plate-alab-continuous-lab.webp', 'f4968482cd0bf69aa336fdbfa8645afc7081a9c7fdc7c2625505390416ef65bc'],
  ['assets/images/plate-primegen-workflow.webp', '7916ad5072bcf737f21399d28d23495165198ce3fd98f39bfeca4833406a8300'],
]);

function isSensitiveSourcePath(filePath) {
  const fileName = basename(filePath).toLowerCase();
  return SENSITIVE_SOURCE_PREFIXES.some((prefix) => fileName.startsWith(`codex-clipboard-${prefix}`));
}

async function listFilesRecursively(directoryPath) {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const entryPath = join(directoryPath, entry.name);
    return entry.isDirectory() ? listFilesRecursively(entryPath) : [entryPath];
  }));
  return nested.flat();
}

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

function findSensitiveContentRecords(records, forbiddenHashes = SENSITIVE_SOURCE_SHA256) {
  return records
    .filter(({ content }) => forbiddenHashes.has(sha256(content)))
    .map(({ path }) => path);
}

function readWebpDimensions(buffer) {
  assert.equal(buffer.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(buffer.subarray(8, 12).toString('ascii'), 'WEBP');

  for (let offset = 12; offset + 8 <= buffer.length;) {
    const type = buffer.subarray(offset, offset + 4).toString('ascii');
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (type === 'VP8X') {
      return {
        width: buffer.readUIntLE(data + 4, 3) + 1,
        height: buffer.readUIntLE(data + 7, 3) + 1,
      };
    }
    if (type === 'VP8 ') {
      assert.equal(buffer.subarray(data + 3, data + 6).toString('hex'), '9d012a');
      return {
        width: buffer.readUInt16LE(data + 6) & 0x3fff,
        height: buffer.readUInt16LE(data + 8) & 0x3fff,
      };
    }
    if (type === 'VP8L') {
      assert.equal(buffer[data], 0x2f);
      const bits = buffer.readUInt32LE(data + 1);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >>> 14) & 0x3fff) + 1,
      };
    }
    offset = data + size + (size % 2);
  }

  assert.fail('WebP must contain a supported image chunk');
}

function listWebpChunks(buffer) {
  const chunks = [];
  for (let offset = 12; offset + 8 <= buffer.length;) {
    const type = buffer.subarray(offset, offset + 4).toString('ascii');
    const size = buffer.readUInt32LE(offset + 4);
    chunks.push(type);
    offset += 8 + size + (size % 2);
  }
  return chunks;
}

function readWebpAnimation(buffer) {
  const frameDurations = [];
  let loopCount = null;
  for (let offset = 12; offset + 8 <= buffer.length;) {
    const type = buffer.subarray(offset, offset + 4).toString('ascii');
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (type === 'ANIM') loopCount = buffer.readUInt16LE(data + 4);
    if (type === 'ANMF') frameDurations.push(buffer.readUIntLE(data + 12, 3));
    offset = data + size + (size % 2);
  }
  return { frameDurations, loopCount };
}

test('lab media manifest keeps the approved order and publishes the approved touch client', async () => {
  const manifest = JSON.parse(await read('assets/images/lab-media-manifest.json'));

  assert.equal(manifest.version, 1);
  assert.deepEqual(
    manifest.media.map(({ id, project, order, path }) => [id, project, order, path]),
    EXPECTED_MEDIA,
  );
  assert.equal(manifest.media.length, 17);
  assert.equal(manifest.fallback.id, 'continuous-lab-fallback');
  assert.equal(manifest.fallback.path, './assets/images/poster-fallback.webp');

  const serialized = JSON.stringify(manifest);
  assert.doesNotMatch(serialized, /(?:\/private\/|\/Users\/|codex-clipboard-)/);
  for (const item of [...manifest.media, manifest.fallback]) {
    assert.match(item.source.kind, /^(?:user-provided-nonclinical|generated-safe-substitute)$/);
    assert.match(item.source.sourceRef, /^[a-z0-9]+(?:[-:.][a-z0-9]+)+$/);
    assert.match(item.authStatus, /^(?:APPROVED|PENDING_HUMAN_REVIEW)$/);
    assert.match(item.assetKind, /^[a-z]+(?:-[a-z]+)+$/);
    assert.match(item.publicationStatus, /^(?:PUBLISHED|PENDING_HUMAN_REVIEW)$/);
    assert.equal(typeof item.privacy, 'object');
    assert.equal(typeof item.privacy.containsClinicalData, 'boolean');
    assert.equal(typeof item.privacy.containsRecognizableFace, 'boolean');
    assert.equal(typeof item.privacy.deidentified, 'boolean');
    if (item.publicationStatus === 'PUBLISHED') {
      assert.equal(item.authStatus, 'APPROVED', `${item.id} cannot publish without approval`);
      assert.match(item.path, /^\.\/assets\/images\/[a-z0-9-]+\.webp$/);
      assert.match(item.sha256, /^[a-f0-9]{64}$/);
      assert.ok(Number.isInteger(item.width) && item.width > 0);
      assert.ok(Number.isInteger(item.height) && item.height > 0);
      assert.equal(item.metadataClean, true);
    } else {
      assert.equal(item.authStatus, 'PENDING_HUMAN_REVIEW');
      assert.equal(item.path, null);
      assert.equal(item.sha256, null);
      assert.equal(item.width, null);
      assert.equal(item.height, null);
      assert.equal(item.metadataClean, null);
    }
  }

  const touch = manifest.media.find(({ id }) => id === 'oxygen-touch-client');
  assert.equal(touch.authStatus, 'APPROVED');
  assert.equal(touch.publicationStatus, 'PUBLISHED');
  assert.equal(touch.path, './assets/images/oxygen-touch-client.webp');
  assert.ok(Number.isInteger(touch.width) && touch.width > 0);
  assert.ok(Number.isInteger(touch.height) && touch.height > 0);
  assert.match(touch.sha256, /^[a-f0-9]{64}$/);
  assert.equal(touch.metadataClean, true);
  assert.equal(touch.privacy.humanReviewRequired, false);
  await access(new URL('assets/images/oxygen-touch-client.webp', root));
});

test('published lab media are local metadata-free WebP files within the five MiB transfer budget', async () => {
  const manifest = JSON.parse(await read('assets/images/lab-media-manifest.json'));
  const published = [...manifest.media, manifest.fallback].filter(({ publicationStatus }) => publicationStatus === 'PUBLISHED');
  const reducedMotionPosters = published
    .filter(({ reducedMotionPoster }) => reducedMotionPoster)
    .map(({ id, reducedMotionPoster }) => ({ id: `${id} reduced-motion poster`, ...reducedMotionPoster }));
  let totalBytes = 0;

  assert.equal(published.length, 18, 'seventeen approved media items plus the fallback poster must publish');
  for (const item of [...published, ...reducedMotionPosters]) {
    assert.match(item.path, /^\.\/assets\/images\/[a-z0-9-]+\.webp$/);
    const buffer = await read(item.path.slice(2));
    const fileStat = await stat(new URL(item.path.slice(2), root));
    const dimensions = readWebpDimensions(buffer);
    const sha256 = createHash('sha256').update(buffer).digest('hex');
    const chunks = listWebpChunks(buffer);

    totalBytes += fileStat.size;
    assert.equal(item.metadataClean, true, `${item.id} must declare metadata removal`);
    assert.equal(item.sha256, sha256, `${item.id} hash must match the deployed file`);
    assert.deepEqual([item.width, item.height], [dimensions.width, dimensions.height]);
    assert.ok(Math.max(item.width, item.height) <= 1024, `${item.id} longest edge must be <= 1024`);
    for (const forbiddenChunk of ['EXIF', 'XMP ', 'ICCP']) {
      assert.equal(chunks.includes(forbiddenChunk), false, `${item.id} must not contain ${forbiddenChunk}`);
    }
  }

  assert.ok(totalBytes <= 5 * 1024 * 1024, `published lab media use ${totalBytes} bytes`);
});

test('PrimeGen AI workflow publishes as the reviewed infinite 123-frame animation', async () => {
  const manifest = JSON.parse(await read('assets/images/lab-media-manifest.json'));
  const item = manifest.media.find(({ id }) => id === 'primegen-ai-workflow');

  assert.ok(item, 'PrimeGen animation must be present in the manifest');
  assert.equal(item.assetKind, 'interface-animation');
  assert.equal(item.source.kind, 'user-provided-nonclinical');
  assert.equal(item.mapping, 'portfolio-primegen-ai-workflow');

  const buffer = await read(item.path.slice(2));
  const chunks = listWebpChunks(buffer);
  const animation = readWebpAnimation(buffer);
  assert.ok(chunks.includes('ANIM'));
  assert.equal(chunks.filter((chunk) => chunk === 'ANMF').length, 123);
  assert.equal(animation.loopCount, 0, 'Loop Count 0 must keep the workflow animation repeating');
  assert.deepEqual(new Set(animation.frameDurations), new Set([100]));
  assert.equal(animation.frameDurations.reduce((sum, duration) => sum + duration, 0), 12_300);
  assert.ok(
    SENSITIVE_SOURCE_SHA256.has('c7cf9c1942b6977a388db9f7994e4c5d593dbb79011262d3eb7790b9473379ae'),
    'the oversized source GIF must remain blocked by content hash',
  );
});

test('PrimeGen three-camera composite publishes as the reviewed infinite 48-frame animation', async () => {
  const manifest = JSON.parse(await read('assets/images/lab-media-manifest.json'));
  const item = manifest.media.find(({ id }) => id === 'primegen-camera-composite');

  assert.ok(item, 'PrimeGen three-camera animation must be present in the manifest');
  assert.equal(item.assetKind, 'interface-animation');
  assert.equal(item.source.kind, 'user-provided-nonclinical');
  assert.equal(item.mapping, 'portfolio-primegen-camera-composite');
  assert.deepEqual(
    [item.path, item.width, item.height, item.sha256],
    [
      './assets/images/primegen-camera-composite.webp',
      1024,
      678,
      '4d211b5359fe0dcd4024b03ed09e0cbe937f28e66bd3a5eae1f2488327a52e5f',
    ],
  );
  assert.deepEqual(item.reducedMotionPoster, {
    path: './assets/images/primegen-camera-composite-poster.webp',
    metadataClean: true,
    width: 1024,
    height: 678,
    sha256: '380411b42f32c2f32a8095678aacaf041195177bde8aa2bc90ce0f83b0cc53f1',
  });
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(PRIMEGEN_CAMERA_SOURCE_SHA256).filter(([, hash]) => SENSITIVE_SOURCE_SHA256.has(hash)),
    ),
    PRIMEGEN_CAMERA_SOURCE_SHA256,
    'all three source GIFs must remain blocked by content hash',
  );

  const buffer = await read(item.path.slice(2));
  const animationStat = await stat(new URL(item.path.slice(2), root));
  const posterStat = await stat(new URL(item.reducedMotionPoster.path.slice(2), root));
  const chunks = listWebpChunks(buffer);
  const animation = readWebpAnimation(buffer);
  assert.equal(animationStat.size, 1_916_696);
  assert.equal(posterStat.size, 51_100);
  assert.ok(chunks.includes('ANIM'));
  assert.equal(chunks.filter((chunk) => chunk === 'ANMF').length, 48);
  assert.equal(animation.loopCount, 0, 'Loop Count 0 must keep the three-camera animation repeating');
  assert.deepEqual(new Set(animation.frameDurations), new Set([100]));
  assert.equal(animation.frameDurations.reduce((sum, duration) => sum + duration, 0), 4_800);
});

test('preserved project plates remain optimized reviewed laboratory evidence', async () => {
  const html = (await read('index.html')).toString('utf8');
  const imagegen = (await read('assets/images/IMAGEGEN.md')).toString('utf8');
  const paths = [...CURRENT_PROJECT_PLATE_SHA256.keys()];

  assert.doesNotMatch(html, /assets\/images\/plate-(?:alab|primegen)\.webp/);
  for (const path of paths) {
    const buffer = await read(path);
    const dimensions = readWebpDimensions(buffer);
    const chunks = listWebpChunks(buffer);

    const currentHash = sha256(buffer);
    assert.equal(LEGACY_GARDEN_PLATE_SHA256.has(currentHash), false, `${path} still contains legacy garden imagery`);
    assert.equal(currentHash, CURRENT_PROJECT_PLATE_SHA256.get(path), `${path} must match the reviewed production plate`);
    assert.match(imagegen, new RegExp(`${basename(path)}[^\\n]*${currentHash}`), `${path} hash must be recorded`);
    assert.ok(Math.max(dimensions.width, dimensions.height) <= 1024, `${path} longest edge must be <= 1024`);
    for (const forbiddenChunk of ['EXIF', 'XMP ', 'ICCP']) {
      assert.equal(chunks.includes(forbiddenChunk), false, `${path} must not contain ${forbiddenChunk}`);
    }
  }
});

test('sensitive source basename gate recognizes the real intake prefixes without scanning document text', () => {
  const forbiddenFixtures = [
    'assets/private/codex-clipboard-cc3127a1-avatar-original.png',
    'assets/private/codex-clipboard-9b7df9ac-clinical-consult-original.png',
    'assets/private/codex-clipboard-7103e1ee-clinical-app-original.png',
  ];
  const allowedFixtures = [
    '.claude/artifacts/designs/continuous-lab-scene.md',
    'assets/images/cloud-remote-consultation-ui.webp',
    'assets/images/cloud-handheld-app.webp',
  ];

  assert.deepEqual(forbiddenFixtures.map(isSensitiveSourcePath), [true, true, true]);
  assert.deepEqual(allowedFixtures.map(isSensitiveSourcePath), [false, false, false]);
});

test('sensitive source hash gate catches renamed content without relying on its basename', () => {
  const rawFixture = Buffer.from('renamed-sensitive-source-fixture');
  const fixtureHashes = new Set([sha256(rawFixture)]);
  const records = [
    { path: 'assets/images/innocent-name.webp', content: rawFixture },
    { path: '.claude/artifacts/designs/continuous-lab-scene.md', content: Buffer.from('7103e1ee may appear as source documentation') },
  ];

  assert.deepEqual(findSensitiveContentRecords(records, fixtureHashes), ['assets/images/innocent-name.webp']);
});

test('sensitive originals are absent from the Git index and recursively deployed assets', async () => {
  const [{ stdout }, deployedAssetPaths] = await Promise.all([
    execFileAsync('git', ['ls-files', '-z'], { cwd: rootPath, encoding: 'utf8' }),
    listFilesRecursively(fileURLToPath(new URL('assets/', root))),
  ]);
  const indexedPaths = stdout.split('\0').filter(Boolean);
  const indexedSensitivePaths = indexedPaths.filter(isSensitiveSourcePath);
  const deployedSensitivePaths = deployedAssetPaths
    .filter(isSensitiveSourcePath)
    .map((filePath) => relative(rootPath, filePath));
  const contentCandidates = [...new Set([
    ...indexedPaths.map((filePath) => join(rootPath, filePath)),
    ...deployedAssetPaths,
  ])];
  const contentRecords = (await Promise.all(contentCandidates.map(async (filePath) => {
    try {
      return { path: relative(rootPath, filePath), content: await readFile(filePath) };
    } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
    }
  }))).filter(Boolean);
  const sensitiveContentPaths = findSensitiveContentRecords(contentRecords);

  assert.deepEqual(indexedSensitivePaths, [], 'raw avatar or clinical sources must not enter the Git index');
  assert.deepEqual(deployedSensitivePaths, [], 'raw avatar or clinical sources must not enter deployed assets');
  assert.deepEqual(sensitiveContentPaths, [], 'renamed raw avatar or clinical sources must fail by content hash');
});

test('homepage professional images resolve to approved manifest publications', async () => {
  const [manifest, html] = await Promise.all([
    read('assets/images/lab-media-manifest.json').then(JSON.parse),
    read('index.html').then(String),
  ]);
  const images = [...html.matchAll(/<img\b([^>]+)>/g)].map((match) => ({
    src: match[1].match(/\bsrc="([^"]+)"/)?.[1],
    alt: match[1].match(/\balt="([^"]*)"/)?.[1],
  })).filter(({ src }) => src?.startsWith('./assets/images/') && src !== './assets/images/cat-logo.svg');
  const approvedByPath = new Map(manifest.media.flatMap((item) => [
    [item.path, item],
    ...(item.reducedMotionPoster ? [[item.reducedMotionPoster.path, item]] : []),
  ]));

  assert.doesNotMatch(html, /\bdata-media-mapping=/, 'mapping must exist only in the manifest');
  assert.doesNotMatch(html, /\bdata-publication-status=/, 'publication status must exist only in the manifest');
  assert.deepEqual(manifest.media.map(({ mapping }) => mapping), EXPECTED_MAPPINGS);
  assert.equal(new Set(EXPECTED_MAPPINGS).size, EXPECTED_MAPPINGS.length, 'semantic mappings must be unique');
  assert.ok(images.length >= 3, 'the three image-based professional projects retain their visual evidence');
  assert.match(html, /<video\b[^>]*src="\.\/assets\/videos\/oxygen-future\.mp4(?:\?[^\"]*)?"/, 'Oxygen retains its product film as visual evidence');

  for (const image of images) {
    const item = approvedByPath.get(image.src);
    assert.ok(item, `${image.src} must have reviewed provenance in the media manifest`);
    assert.equal(item.publicationStatus, 'PUBLISHED', `${image.src} must be approved for publication`);
    assert.ok(image.alt?.trim(), `${image.src} must retain meaningful static alternative text`);
  }
});

test('Cloud publishes approved safe substitutes instead of clinical source captures', async () => {
  const [manifestBuffer, htmlBuffer] = await Promise.all([
    read('assets/images/lab-media-manifest.json'),
    read('index.html'),
  ]);
  const manifest = JSON.parse(manifestBuffer);
  const source = `${manifestBuffer}\n${htmlBuffer}`;
  const cloud = manifest.media.filter(({ project }) => project === 'cloud');

  assert.equal(cloud.length, 4);
  assert.deepEqual(cloud.map(({ publicationStatus }) => publicationStatus), Array(4).fill('PUBLISHED'));
  assert.equal(cloud[1].source.kind, 'generated-safe-substitute');
  assert.equal(cloud[3].source.kind, 'generated-safe-substitute');
  assert.equal(cloud[1].authStatus, 'APPROVED');
  assert.equal(cloud[3].authStatus, 'APPROVED');
  for (const item of cloud) {
    assert.equal(item.privacy.containsClinicalData, false);
    assert.equal(item.privacy.containsRecognizableFace, false);
  }
  assert.doesNotMatch(source, /patient|患者|diagnos(?:is|tic)|诊断|accuracy|准确率/i);
});
