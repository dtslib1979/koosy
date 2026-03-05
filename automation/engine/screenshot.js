/**
 * screenshot.js — 증빙 스크린샷 모듈
 *
 * 헌법 제2조: 증빙 없는 거래는 없다.
 * 채널 등록 후 반드시 스크린샷 저장.
 */

const fs = require('fs');
const path = require('path');

const EVIDENCE_DIR = 'analytics/evidence';

function saveEvidence(root, productId, channel, imageData) {
  const dir = path.join(root, EVIDENCE_DIR, productId);
  fs.mkdirSync(dir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${channel}-${timestamp}.png`;
  const filepath = path.join(dir, filename);

  if (imageData) {
    fs.writeFileSync(filepath, imageData);
    console.log(`  [evidence] saved: ${EVIDENCE_DIR}/${productId}/${filename}`);
  } else {
    const textFile = filepath.replace('.png', '.txt');
    fs.writeFileSync(textFile, `${channel} deploy evidence\n${new Date().toISOString()}\nproduct: ${productId}\n`);
    console.log(`  [evidence] text: ${EVIDENCE_DIR}/${productId}/${path.basename(textFile)}`);
  }

  return filepath;
}

module.exports = { saveEvidence };
