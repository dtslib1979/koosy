#!/usr/bin/env node
/**
 * ffmpeg-builder.js — FFmpeg 명령어 빌더
 *
 * card.json + scenes → FFmpeg filter_complex 생성.
 * Termux FFmpeg 8.0.1 호환.
 */

const fs = require('fs');
const path = require('path');

function resolveSceneSource(scene, card, productDir) {
  const sceneName = scene.scene || scene;
  const images = card.images || {};

  const mapping = {
    intro: images.main ? path.join(productDir, images.main) : null,
    unboxing: images.main ? path.join(productDir, images.main) : null,
    build: images.main ? path.join(productDir, images.main) : null,
    demo: images.main ? path.join(productDir, images.main) : null,
    outro: images.main ? path.join(productDir, images.main) : null,
    tutorial: images.main ? path.join(productDir, images.main) : null,
    ai_coding: images.main ? path.join(productDir, images.main) : null,
    showcase: images.main ? path.join(productDir, images.main) : null,
    price: images.main ? path.join(productDir, images.main) : null
  };

  const resolved = mapping[sceneName] || null;
  if (resolved && fs.existsSync(resolved)) return resolved;
  return null;
}

function parseDuration(dur) {
  if (!dur) return 5;
  const str = String(dur).replace(/s$/i, '');
  const match = str.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 5;
}

function sceneText(scene, card) {
  const name = scene.scene || '';
  const productName = card.name || card.name_en || '';
  const price = card.price ? (card.price.coupang || card.price.retail || 0) : 0;

  const texts = {
    intro: productName,
    unboxing: 'Unboxing',
    build: scene.content || 'Building...',
    demo: productName,
    outro: 'koosy.kr',
    tutorial: scene.content || 'Tutorial',
    ai_coding: scene.content || 'AI Coding',
    showcase: productName,
    price: `₩${price.toLocaleString()}`
  };

  return texts[name] || name;
}

function sceneColor(sceneName) {
  const colors = {
    intro: '0A0F1A',
    unboxing: '111827',
    build: '1F2937',
    demo: '0A0F1A',
    outro: '0A0F1A',
    tutorial: '111827',
    ai_coding: '1A1A2E',
    showcase: '0A0F1A',
    price: '111827'
  };
  return colors[sceneName] || '0A0F1A';
}

function buildCommand(options) {
  const { scenes, card, productDir, resolution, bgmPath, outputPath, fps = 30 } = options;
  const [width, height] = resolution.split('x').map(Number);

  const inputs = [];
  const filterParts = [];
  let totalDuration = 0;

  scenes.forEach((scene, i) => {
    const dur = parseDuration(scene.duration);
    totalDuration += dur;
    const sceneName = scene.scene || `scene_${i}`;
    const sourceImage = resolveSceneSource(scene, card, productDir);
    const text = sceneText(scene, card).replace(/'/g, "\\'").replace(/\n/g, '  ');

    if (sourceImage) {
      inputs.push(`-loop 1 -t ${dur} -i "${sourceImage}"`);
      filterParts.push(
        `[${i}:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,` +
        `pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=black,` +
        `zoompan=z='min(zoom+0.001,1.15)':d=${dur * fps}:s=${width}x${height}:fps=${fps},` +
        `drawtext=text='${text}':fontsize=36:fontcolor=white:` +
        `x=(w-text_w)/2:y=h-80:enable='between(t,0,${dur})'` +
        `[v${i}]`
      );
    } else {
      const bg = sceneColor(sceneName);
      inputs.push(
        `-f lavfi -t ${dur} -i "color=c=0x${bg}:s=${width}x${height}:r=${fps}"`
      );
      filterParts.push(
        `[${i}:v]drawtext=text='${text}':fontsize=48:fontcolor=white:` +
        `x=(w-text_w)/2:y=(h-text_h)/2,` +
        `drawtext=text='${sceneName.toUpperCase()}':fontsize=24:fontcolor=0x888888:` +
        `x=(w-text_w)/2:y=h*0.75` +
        `[v${i}]`
      );
    }
  });

  const concatInputs = scenes.map((_, i) => `[v${i}]`).join('');
  const concatFilter = `${concatInputs}concat=n=${scenes.length}:v=1:a=0[outv]`;

  const allFilters = [...filterParts, concatFilter].join(';\n');

  const parts = ['ffmpeg -y'];
  inputs.forEach(inp => parts.push(inp));

  if (bgmPath && fs.existsSync(bgmPath)) {
    parts.push(`-i "${bgmPath}"`);
  }

  parts.push(`-filter_complex "${allFilters}"`);
  parts.push('-map "[outv]"');

  if (bgmPath && fs.existsSync(bgmPath)) {
    parts.push(`-map ${scenes.length}:a`);
    parts.push('-shortest');
  }

  parts.push(`-c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p`);
  parts.push(`-c:a aac -b:a 128k`);
  parts.push(`-t ${totalDuration}`);
  parts.push(`"${outputPath}"`);

  return {
    cmd: parts.join(' \\\n  '),
    inputs: inputs.length,
    totalDuration,
    hasRealAssets: scenes.some(s => resolveSceneSource(s, card, productDir) !== null)
  };
}

function buildThumbnailCommand(options) {
  const { card, productDir, resolution, outputPath } = options;
  const [width, height] = ['1280', '720'];
  const productName = (card.name || '').replace(/'/g, "\\'");
  const price = card.price ? (card.price.coupang || card.price.retail || 0) : 0;
  const mainImage = card.images && card.images.main
    ? path.join(productDir, card.images.main) : null;

  if (mainImage && fs.existsSync(mainImage)) {
    return {
      cmd: `ffmpeg -y -i "${mainImage}" ` +
        `-vf "scale=${width}:${height}:force_original_aspect_ratio=decrease,` +
        `pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=black,` +
        `drawtext=text='${productName}':fontsize=56:fontcolor=white:x=40:y=${height}-120,` +
        `drawtext=text='₩${price.toLocaleString()}':fontsize=40:fontcolor=0x3B82F6:x=40:y=${height}-60" ` +
        `"${outputPath}"`,
      source: 'image'
    };
  }

  return {
    cmd: `ffmpeg -y -f lavfi -i "color=c=0x0A0F1A:s=${width}x${height}:d=1" ` +
      `-vf "drawtext=text='${productName}':fontsize=56:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-30,` +
      `drawtext=text='₩${price.toLocaleString()}':fontsize=40:fontcolor=0x3B82F6:x=(w-text_w)/2:y=(h-text_h)/2+40,` +
      `drawtext=text='koosy.kr':fontsize=28:fontcolor=0x888888:x=(w-text_w)/2:y=h-60" ` +
      `-frames:v 1 "${outputPath}"`,
    source: 'placeholder'
  };
}

module.exports = { buildCommand, buildThumbnailCommand, parseDuration, resolveSceneSource };
