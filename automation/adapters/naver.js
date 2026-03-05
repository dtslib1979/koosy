/**
 * naver.js — 네이버 스마트스토어 어댑터
 *
 * API 우선, GUI 폴백.
 * 네이버 커머스 API: https://apicenter.commerce.naver.com
 */

const fs = require('fs');
const path = require('path');
const { saveEvidence } = require('../engine/screenshot');

function mapToNaverApi(card) {
  return {
    originProduct: {
      statusType: 'SALE',
      saleType: 'NEW',
      leafCategoryId: mapCategory(card.category),
      name: card.name,
      detailContent: `naver/rendered/${card.product_id}.html`,
      salePrice: card.price.naver,
      stockQuantity: 999,
      deliveryInfo: {
        deliveryType: 'DELIVERY',
        deliveryFee: { deliveryFeeType: 'FREE' }
      },
      detailAttribute: {
        originAreaInfo: { type: 'IMPORT', content: card.spec.origin || '중국 (조립: 한국)' },
        afterServiceInfo: { type: 'EMAIL' }
      }
    },
    smartstoreChannelProduct: {
      channelProductName: card.name,
      storeKeepExclusiveProduct: false
    }
  };
}

function mapCategory(cat) {
  const map = {
    'kit/esp32': '50002711',
    'kit/arduino': '50002711',
    'kit/raspberry_pi': '50002711',
    'kit/sensor': '50002711',
    'kit/robot': '50002712',
    'course/beginner': '50005241',
    'course/ai_coding': '50005241',
    'template/claude': '50005241',
    'bundle/starter': '50002711'
  };
  return map[cat] || '50002711';
}

async function deploy(card, root) {
  const apiData = mapToNaverApi(card);
  const queueDir = path.join(root, 'naver/queue');
  fs.mkdirSync(queueDir, { recursive: true });

  const queuePath = path.join(queueDir, `${card.product_id}.json`);
  fs.writeFileSync(queuePath, JSON.stringify(apiData, null, 2) + '\n', 'utf8');
  console.log(`  ✓ naver queue: ${card.product_id}.json`);

  const htmlPath = path.join(root, 'naver/rendered', `${card.product_id}.html`);
  if (fs.existsSync(htmlPath)) {
    const size = (fs.statSync(htmlPath).size / 1024).toFixed(1);
    console.log(`  ✓ detail HTML: ${size}KB`);
  }

  console.log('  ○ API 호출 대기 (OAuth 인증 미설정)');

  saveEvidence(root, card.product_id, 'naver', null);

  return {
    success: true,
    message: 'naver queue 생성 완료 (API 인증 설정 후 자동 등록)',
    url: null
  };
}

module.exports = { deploy, mapToNaverApi };
