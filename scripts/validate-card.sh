#!/usr/bin/env bash
# validate-card.sh — PRODUCT_CARD.json 유효성 검증
# 헌법 제2조: BOM 확인 후 착공

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CARD_PATH="${1:-}"

if [ -z "$CARD_PATH" ]; then
  echo "Usage: validate-card.sh <path-to-card.json>"
  echo "  e.g.: validate-card.sh catalog/products/KS-001/card.json"
  exit 1
fi

FULL_PATH="${ROOT}/${CARD_PATH}"

if [ ! -f "$FULL_PATH" ]; then
  echo "FAIL: card not found: ${FULL_PATH}"
  exit 1
fi

echo "=== validate-card: ${CARD_PATH} ==="

# JSON 파싱 검증
node -e "
  const card = require('${FULL_PATH}');
  const errors = [];

  // 필수 필드 검증
  if (!card.id) errors.push('id 누락');
  if (!card.name) errors.push('name 누락');
  if (!card.category) errors.push('category 누락');
  if (!card.price || !card.price.retail) errors.push('price.retail 누락');
  if (!card.spec) errors.push('spec 누락');
  if (!card.channels) errors.push('channels 누락');
  if (!card.content_matrix) errors.push('content_matrix 누락');

  // ID 프리픽스 검증
  if (card.id && !card.id.startsWith('KS-')) {
    errors.push('id는 KS- 프리픽스 필요 (현재: ' + card.id + ')');
  }

  // 카테고리 검증
  const validCats = ['kit/basic', 'kit/premium', 'course/online', 'course/live', 'template/notion', 'template/prompt', 'bundle/starter', 'bundle/pro'];
  if (card.category && !validCats.some(c => card.category.startsWith(c.split('/')[0]))) {
    errors.push('유효하지 않은 category: ' + card.category);
  }

  // 채널 상태 검증
  if (card.channels) {
    const validStates = ['DRAFT', 'READY', 'PENDING', 'LIVE', 'ERROR'];
    for (const [ch, state] of Object.entries(card.channels)) {
      if (!validStates.includes(state)) {
        errors.push(ch + ' 채널 상태 이상: ' + state);
      }
    }
  }

  // 결과 출력
  if (errors.length > 0) {
    console.log('FAIL: ' + errors.length + ' errors');
    errors.forEach(e => console.log('  - ' + e));
    process.exit(1);
  } else {
    console.log('OK: card valid');
    console.log('  id: ' + card.id);
    console.log('  name: ' + card.name);
    console.log('  category: ' + card.category);
    console.log('  price: ' + (card.price ? card.price.retail : 'N/A'));
  }
" 2>&1

echo "=== validate complete ==="
