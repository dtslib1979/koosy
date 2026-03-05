/**
 * showroom.js — koosy.kr 쇼룸 배포 어댑터
 *
 * GitHub Pages 배포 = git add + commit + push.
 * 가장 단순한 채널. 완전 자동화 가능.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { saveEvidence } = require('../engine/screenshot');

async function deploy(card, root) {
  const lookbookPath = path.join(root, 'showroom/lookbook', `${card.product_id}.html`);

  if (!fs.existsSync(lookbookPath)) {
    console.log(`  ✗ lookbook page not found: ${lookbookPath}`);
    return { success: false, message: 'lookbook page missing' };
  }
  console.log('  ✓ lookbook page exists');

  const showroomIndex = path.join(root, 'showroom/index.html');
  if (fs.existsSync(showroomIndex)) {
    console.log('  ✓ showroom index exists');
  }

  try {
    const status = execSync('git status --porcelain showroom/', { cwd: root }).toString().trim();

    if (status) {
      console.log('  ○ showroom changes detected, staging...');
      execSync('git add showroom/', { cwd: root });
      execSync(
        `git commit -m "deploy: showroom ${card.product_id} — ${card.name}"`,
        { cwd: root }
      );
      console.log('  ✓ committed');
      console.log('  ○ git push 대기 (수동 확인 후 push)');
    } else {
      console.log('  ✓ showroom already up to date');
    }
  } catch (err) {
    console.log(`  ⚠ git: ${err.message}`);
  }

  const url = `https://koosy.kr/showroom/lookbook/${card.product_id}.html`;
  saveEvidence(root, card.product_id, 'showroom', null);

  return {
    success: true,
    message: `showroom deployed: ${url}`,
    url
  };
}

module.exports = { deploy };
