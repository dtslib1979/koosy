#!/usr/bin/env node
/**
 * render-video.js — PRODUCT_CARD → YouTube 영상 렌더링
 *
 * FFmpeg CLI 실제 실행. 에셋 없으면 플레이스홀더 자동 생성.
 *
 * Usage:
 *   node render-video.js <product_id> [--series A|B|C|D] [--render] [--thumb-only]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { buildCommand, buildThumbnailCommand, parseDuration } = require('./ffmpeg-builder');

const args = process.argv.slice(2);
const productId = args[0];
const series = args.indexOf('--series') !== -1 ? args[args.indexOf('--series') + 1] : 'D';
const doRender = args.includes('--render');
const thumbOnly = args.includes('--thumb-only');

if (!productId) {
  console.error('Usage: node render-video.js <product_id> [--series A|B|C|D] [--render] [--thumb-only]');
  process.exit(1);
}

const ROOT = path.resolve(__dirname, '../..');
const cardPath = path.join(ROOT, 'catalog/products', productId, 'card.json');
const videoSpecPath = path.join(ROOT, 'pipeline/video-spec.json');
const productDir = path.join(ROOT, 'catalog/products', productId);

if (!fs.existsSync(cardPath)) {
  console.error(`ERROR: ${cardPath} not found`);
  process.exit(1);
}

const card = JSON.parse(fs.readFileSync(cardPath, 'utf8'));
if (!card.product_id && card.id) card.product_id = card.id;

// Series mapping — 교육 키트 시리즈
const seriesMap = {
  'A': 'A_unboxing',
  'B': 'B_tutorial',
  'C': 'C_ai_coding',
  'D': 'D_showcase'
};

const seriesNames = {
  'A': '키트 뜯어보기',
  'B': '30분 만에 IoT 완성',
  'C': 'Claude한테 코드 시키기',
  'D': '쿠씨의 과외'
};

const seriesKey = seriesMap[series.toUpperCase()];
const seriesName = seriesNames[series.toUpperCase()] || series;

// 기본 씬 (video-spec.json 없을 때)
const defaultScenes = [
  { scene: 'intro', content: card.name, duration: '5s' },
  { scene: 'unboxing', content: '키트 구성품 소개', duration: '15s' },
  { scene: 'build', content: '조립 과정', duration: '30s' },
  { scene: 'demo', content: '동작 데모', duration: '15s' },
  { scene: 'outro', content: 'koosy.kr', duration: '5s' }
];

let scenes = defaultScenes;
if (fs.existsSync(videoSpecPath)) {
  const videoSpec = JSON.parse(fs.readFileSync(videoSpecPath, 'utf8'));
  if (videoSpec.series && videoSpec.series[seriesKey]) {
    const spec = videoSpec.series[seriesKey];
    const structure = spec.structure;
    scenes = Array.isArray(structure)
      ? structure
      : Object.entries(structure).map(([key, val]) =>
          typeof val === 'string' ? { scene: key, content: val, duration: '5s' } : { scene: key, ...val }
        );
  }
}

scenes.forEach(s => {
  if (!s.duration && s.content) {
    const m = s.content.match(/\((\d+(?:-\d+)?s?)\)/);
    if (m) s.duration = m[1];
  }
  if (!s.duration) s.duration = '5s';
});

const resolution = '1080x1920';

console.log(`\n${'='.repeat(60)}`);
console.log(`  RENDER-VIDEO: ${productId} — ${seriesName}`);
console.log(`  series: ${series} | resolution: ${resolution}`);
console.log(`  mode: ${doRender ? 'RENDER' : 'DRY-RUN'}${thumbOnly ? ' (thumb-only)' : ''}`);
console.log(`${'='.repeat(60)}\n`);

console.log('Scenes:');
let totalDur = 0;
scenes.forEach((s, i) => {
  const dur = parseDuration(s.duration);
  totalDur += dur;
  console.log(`  ${i + 1}. [${s.scene}] ${s.content || ''} — ${dur}s`);
});
console.log(`  Total: ${totalDur}s\n`);

// ── Asset Check ─────────────────────────────────
console.log('Assets:');
const imageFiles = card.images || {};
const assetChecks = [
  { name: 'main.jpg', file: imageFiles.main }
];
let assetCount = 0;
assetChecks.forEach(a => {
  const fullPath = a.file ? path.join(productDir, a.file) : null;
  const exists = fullPath && fs.existsSync(fullPath);
  if (exists) assetCount++;
  console.log(`  ${exists ? '✓' : '○'} ${a.name}${exists ? '' : ' (placeholder)'}`);
});

// BGM
const bgmSearchDirs = [
  path.join(ROOT, 'content/audio'),
  path.join(ROOT, 'assets/audio')
];
let bgmPath = null;
for (const dir of bgmSearchDirs) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp3') || f.endsWith('.wav'));
    if (files.length > 0) {
      bgmPath = path.join(dir, files[0]);
      break;
    }
  }
}
console.log(`  ${bgmPath ? '✓' : '○'} BGM ${bgmPath ? path.basename(bgmPath) : '(silent)'}\n`);

// ── Output Paths ────────────────────────────────
const outputDir = path.join(ROOT, 'youtube/rendered');
const thumbDir = path.join(ROOT, 'youtube/thumbnails');
fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(thumbDir, { recursive: true });

const videoOut = path.join(outputDir, `${productId}-${series}.mp4`);
const thumbOut = path.join(thumbDir, `${productId}-thumb.jpg`);
const descOut = path.join(outputDir, `${productId}-desc.txt`);

// ── Thumbnail ───────────────────────────────────
const thumbCmd = buildThumbnailCommand({
  card, productDir,
  resolution: '1280x720',
  outputPath: thumbOut
});

console.log(`--- THUMBNAIL (${thumbCmd.source}) ---`);
if (doRender || thumbOnly) {
  try {
    execSync(thumbCmd.cmd, { stdio: 'pipe', timeout: 30000 });
    console.log(`  ✓ ${thumbOut}`);
  } catch (e) {
    console.error(`  ✗ thumbnail failed: ${e.message}`);
  }
} else {
  console.log(`  [DRY-RUN] ${thumbCmd.cmd}\n`);
}

if (thumbOnly) {
  console.log('\n=== thumb-only mode complete ===');
  process.exit(0);
}

// ── Video ───────────────────────────────────────
const videoCmd = buildCommand({
  scenes, card, productDir,
  resolution,
  bgmPath,
  outputPath: videoOut,
  fps: 30
});

console.log(`\n--- VIDEO (${videoCmd.inputs} inputs, ${videoCmd.totalDuration}s) ---`);

if (doRender) {
  console.log('  Rendering...');
  try {
    execSync(videoCmd.cmd, { stdio: 'pipe', timeout: 300000 });
    console.log(`  ✓ ${videoOut}`);
    const stat = fs.statSync(videoOut);
    console.log(`  Size: ${(stat.size / 1024 / 1024).toFixed(1)} MB`);
  } catch (e) {
    const stderr = e.stderr ? e.stderr.toString().split('\n').slice(-5).join('\n') : e.message;
    console.error(`  ✗ render failed:\n${stderr}`);
    const cmdPath = path.join(outputDir, `${productId}-${series}.ffmpeg.sh`);
    fs.writeFileSync(cmdPath, '#!/bin/bash\n' + videoCmd.cmd + '\n', 'utf8');
    console.log(`  Saved command to: ${cmdPath}`);
    process.exit(1);
  }
} else {
  console.log('\n  [DRY-RUN] FFmpeg command:');
  console.log('  ' + videoCmd.cmd.split('\n').join('\n  '));
  const cmdPath = path.join(outputDir, `${productId}-${series}.ffmpeg.sh`);
  fs.writeFileSync(cmdPath, '#!/bin/bash\n' + videoCmd.cmd + '\n', 'utf8');
  console.log(`\n  Saved: ${cmdPath}`);
}

// ── Description ─────────────────────────────────
const desc = [
  `${card.name} — ${seriesName} | KOOSY`,
  '',
  `키트 구매: ${(card.channels.coupang || {}).product_url || '[쿠팡 링크 대기]'}`,
  `네이버: ${(card.channels.naver || {}).product_url || '[네이버 링크 대기]'}`,
  `쇼룸: https://koosy.kr/showroom/lookbook/${card.product_id}.html`,
  '',
  `가격: ₩${card.price.coupang ? card.price.coupang.toLocaleString() : ''}`,
  '',
  (card.tags || []).map(t => `#${t}`).join(' ')
].join('\n');

fs.writeFileSync(descOut, desc, 'utf8');
console.log(`\n  ✓ description: ${descOut}`);

console.log(`\n${'='.repeat(60)}`);
console.log('  OUTPUT:');
console.log(`    video: ${doRender ? '✓' : '○'} ${videoOut}`);
console.log(`    thumb: ${doRender || thumbOnly ? '✓' : '○'} ${thumbOut}`);
console.log(`    desc:  ✓ ${descOut}`);
console.log(`${'='.repeat(60)}\n`);
