/**
 * coupang.js — 쿠팡 Wing 반자동 어댑터
 *
 * 완전 자동화 금지. 봇 감지 리스크.
 * 폼 매핑까지만 자동, 최종 제출은 수동 확인.
 */

const fs = require('fs');
const path = require('path');
const { saveEvidence } = require('../engine/screenshot');

function mapToWingForm(card) {
  return {
    productName: card.name,
    brandName: card.brand || 'koosy',
    category: mapCategory(card.category),
    salePrice: card.price.coupang,
    listPrice: card.price.retail,
    options: {
      difficulty: card.difficulty || 'beginner',
      kit_type: card.category
    },
    weight: card.spec.weight,
    origin: card.spec.origin || '중국 (조립: 한국)',
    images: {
      main: `catalog/products/${card.product_id}/${card.images.main}`,
      detail: (card.images.detail || []).map(d =>
        `catalog/products/${card.product_id}/${d}`
      )
    },
    detailHtml: `coupang/rendered/${card.product_id}.html`,
    tags: card.tags || []
  };
}

function mapCategory(cat) {
  const map = {
    'kit/esp32': '완구/취미 > 과학/공작 > 전자키트',
    'kit/arduino': '완구/취미 > 과학/공작 > 전자키트',
    'kit/raspberry_pi': '완구/취미 > 과학/공작 > 전자키트',
    'kit/sensor': '완구/취미 > 과학/공작 > 전자키트',
    'kit/robot': '완구/취미 > 과학/공작 > 로봇',
    'course/beginner': '도서/교육 > 컴퓨터/IT > 프로그래밍',
    'course/ai_coding': '도서/교육 > 컴퓨터/IT > 인공지능',
    'template/claude': '도서/교육 > 컴퓨터/IT > 인공지능',
    'bundle/starter': '완구/취미 > 과학/공작 > 전자키트'
  };
  return map[cat] || '완구/취미 > 과학/공작 > 전자키트';
}

async function deploy(card, root) {
  const formData = mapToWingForm(card);
  const queueDir = path.join(root, 'coupang/queue');
  fs.mkdirSync(queueDir, { recursive: true });

  const queuePath = path.join(queueDir, `${card.product_id}.json`);
  fs.writeFileSync(queuePath, JSON.stringify(formData, null, 2) + '\n', 'utf8');
  console.log(`  ✓ coupang queue: ${card.product_id}.json`);

  const htmlPath = path.join(root, 'coupang/rendered', `${card.product_id}.html`);
  if (fs.existsSync(htmlPath)) {
    const size = (fs.statSync(htmlPath).size / 1024).toFixed(1);
    console.log(`  ✓ detail HTML: ${size}KB`);
  }

  saveEvidence(root, card.product_id, 'coupang', null);

  return {
    success: true,
    message: `coupang queue 생성 완료 (Wing 수동 등록 대기)`,
    url: null
  };
}

module.exports = { deploy, mapToWingForm };
