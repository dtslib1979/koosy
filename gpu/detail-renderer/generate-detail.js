#!/usr/bin/env node
/**
 * generate-detail.js — PRODUCT_CARD → 상세페이지 HTML 렌더러
 *
 * card.json 하나로 쿠팡/네이버 상세페이지 HTML 자동 생성
 * 헌법 제2조: BOM(card.json) 확인 후 착공
 *
 * Usage:
 *   node generate-detail.js <product_id> [--channel coupang|naver|all] [--template standard|premium]
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const productId = args[0];

if (!productId) {
  console.error('Usage: node generate-detail.js <product_id> [--channel coupang|naver|all] [--template standard|premium]');
  process.exit(1);
}

function getArg(flag, fallback) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const channel = getArg('--channel', 'all');
const templateType = getArg('--template', 'standard');

const ROOT = path.resolve(__dirname, '../..');
const cardPath = path.join(ROOT, 'catalog/products', productId, 'card.json');

if (!fs.existsSync(cardPath)) {
  console.error(`ERROR: ${cardPath} not found (BOM 미확인 — 헌법 위반)`);
  process.exit(1);
}

const card = JSON.parse(fs.readFileSync(cardPath, 'utf8'));
if (!card.product_id && card.id) card.product_id = card.id;
if (!card.id && card.product_id) card.id = card.product_id;
console.log(`=== generate-detail: ${productId} (${card.name}) ===`);

function loadTemplate(ch, tmpl) {
  const tmplPath = path.join(ROOT, ch, 'templates', `detail-${tmpl}.html`);
  if (!fs.existsSync(tmplPath)) {
    console.error(`WARN: template not found: ${tmplPath}, using standard`);
    const fallback = path.join(ROOT, ch, 'templates', 'detail-standard.html');
    if (!fs.existsSync(fallback)) {
      console.error(`ERROR: no templates found for ${ch}`);
      return null;
    }
    return fs.readFileSync(fallback, 'utf8');
  }
  return fs.readFileSync(tmplPath, 'utf8');
}

function interpolate(html, card) {
  const imageBase = `../../catalog/products/${card.product_id}`;

  const detailImagesHtml = (card.images.detail || []).map((img, i) =>
    `      <div class="detail-image">
        <img src="${imageBase}/${img}" alt="${card.name} 디테일 ${i + 1}" loading="lazy">
      </div>`
  ).join('\n');

  // 키트 내용물 HTML (교육 키트 특화)
  const kitHtml = card.kit_contents ? [
    '<h3>키트 구성품</h3>',
    '<ul class="kit-list">',
    ...(card.kit_contents.hardware || []).map(h => `<li class="kit-hw">${h}</li>`),
    ...(card.kit_contents.digital || []).map(d => `<li class="kit-dg">${d}</li>`),
    ...(card.kit_contents.video || []).map(v => `<li class="kit-vid">${v}</li>`),
    '</ul>'
  ].join('\n') : '';

  // 프로젝트 목록 HTML
  const projectsHtml = card.projects ? card.projects.map(p =>
    `<div class="project-card"><strong>${p.name}</strong> (${p.difficulty}) — ${p.time}</div>`
  ).join('\n') : '';

  // 스펙 테이블
  const specRows = [
    ['대상', card.spec.target_age],
    ['선수 지식', card.spec.prerequisites],
    ['필요 도구', card.spec.tools_needed],
    ['중량', card.spec.weight],
    ['원산지', card.spec.origin]
  ].filter(([, v]) => v).map(([k, v]) =>
    `        <tr><th>${k}</th><td>${v}</td></tr>`
  ).join('\n');

  const tagsHtml = (card.tags || []).map(t => `#${t}`).join(' ');

  const formatPrice = (n) => n ? `₩${n.toLocaleString()}` : '';

  return html
    .replace(/\{\{product_id\}\}/g, card.product_id)
    .replace(/\{\{name\}\}/g, card.name)
    .replace(/\{\{name_en\}\}/g, card.name_en || '')
    .replace(/\{\{brand\}\}/g, card.brand || 'koosy')
    .replace(/\{\{difficulty\}\}/g, card.difficulty || '')
    .replace(/\{\{category\}\}/g, card.category || '')
    .replace(/\{\{price_retail\}\}/g, formatPrice(card.price.retail))
    .replace(/\{\{price_coupang\}\}/g, formatPrice(card.price.coupang))
    .replace(/\{\{price_naver\}\}/g, formatPrice(card.price.naver))
    .replace(/\{\{main_image\}\}/g, `${imageBase}/${card.images.main}`)
    .replace(/\{\{detail_images\}\}/g, detailImagesHtml)
    .replace(/\{\{kit_contents\}\}/g, kitHtml)
    .replace(/\{\{projects\}\}/g, projectsHtml)
    .replace(/\{\{spec_table\}\}/g, specRows)
    .replace(/\{\{tags\}\}/g, tagsHtml)
    .replace(/\{\{showroom_url\}\}/g, `https://koosy.kr/showroom/lookbook/${card.product_id}.html`)
    .replace(/\{\{year\}\}/g, new Date().getFullYear().toString());
}

function render(ch) {
  const template = loadTemplate(ch, templateType);
  if (!template) return false;

  const html = interpolate(template, card);
  const outPath = path.join(ROOT, ch, 'rendered', `${productId}.html`);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`  ✓ ${ch}/rendered/${productId}.html (${(html.length / 1024).toFixed(1)}KB)`);
  return true;
}

const channels = channel === 'all' ? ['coupang', 'naver'] : [channel];
let success = 0;

for (const ch of channels) {
  if (render(ch)) success++;
}

console.log(`=== render complete: ${success}/${channels.length} channels ===`);
process.exit(success === channels.length ? 0 : 1);
