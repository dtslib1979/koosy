/**
 * youtube.js — YouTube 업로드 어댑터
 *
 * 교육 콘텐츠 4시리즈 매핑.
 * YouTube Data API v3 업로드.
 */

const fs = require('fs');
const path = require('path');
const { saveEvidence } = require('../engine/screenshot');

function mapToYouTubeMeta(card, series) {
  const seriesNames = {
    A: '키트 뜯어보기',
    B: '30분 만에 IoT 완성',
    C: 'Claude한테 코드 시키기',
    D: '쿠씨의 과외'
  };

  const seriesName = seriesNames[series] || seriesNames.D;

  return {
    title: `${card.name} — ${seriesName} | KOOSY`,
    description: null,
    tags: [
      'koosy', '교육키트', '메이커', 'IoT', 'ESP32', seriesName,
      ...(card.tags || [])
    ].filter(Boolean),
    categoryId: '27',
    privacyStatus: 'public',
    defaultLanguage: 'ko'
  };
}

async function deploy(card, root) {
  const videoPath = path.join(root, 'youtube/rendered', `${card.product_id}.mp4`);
  const descPath = path.join(root, 'youtube/rendered', `${card.product_id}-desc.txt`);
  const thumbPath = path.join(root, 'youtube/thumbnails', `${card.product_id}-thumb.jpg`);
  const queueDir = path.join(root, 'youtube/queue');
  fs.mkdirSync(queueDir, { recursive: true });

  const meta = mapToYouTubeMeta(card, 'D');

  if (fs.existsSync(descPath)) {
    meta.description = fs.readFileSync(descPath, 'utf8');
    console.log('  ✓ description loaded');
  }

  const queuePath = path.join(queueDir, `${card.product_id}.json`);
  const queueData = {
    meta,
    video: fs.existsSync(videoPath) ? videoPath : null,
    thumbnail: fs.existsSync(thumbPath) ? thumbPath : null,
    status: fs.existsSync(videoPath) ? 'ready' : 'video_missing'
  };

  fs.writeFileSync(queuePath, JSON.stringify(queueData, null, 2) + '\n', 'utf8');
  console.log(`  ✓ youtube queue: ${card.product_id}.json`);

  console.log(`  ${fs.existsSync(videoPath) ? '✓' : '✗'} video: ${card.product_id}.mp4`);
  console.log(`  ${fs.existsSync(descPath) ? '✓' : '✗'} description`);
  console.log(`  ${fs.existsSync(thumbPath) ? '✓' : '✗'} thumbnail`);

  console.log('  ○ API 업로드 대기 (token.json 설정 후 활성화)');

  saveEvidence(root, card.product_id, 'youtube', null);

  return {
    success: true,
    message: `youtube queue 생성 완료 (${queueData.status})`,
    url: null
  };
}

module.exports = { deploy, mapToYouTubeMeta };
