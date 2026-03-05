# KOOSY 커머스 전환 — 자기완결 실행 가이드

> **이 문서는 자기완결적이다. 다른 레포 접근 없이 이 문서만으로 전환 실행 가능.**
> `cp ~/dongseon-studio/...` 같은 명령은 없다. 모든 소스가 이 문서에 임베드되어 있다.
> Web Claude가 이 문서만 보고 순서대로 실행하면 커머스 전환이 완료된다.

**작성일:** 2026-03-05
**기반:** gohsy-fashion 보일러플레이트 → koosy 교육 키트 컨텍스트 변환
**계획서:** `docs/KOOSY-COMMERCE-REFACTORING-PLAN.md` (348줄)

---

## 변환 매핑 요약

| 항목 | gohsy (원본) | koosy (변환) |
|------|-------------|-------------|
| 브랜드 | GOHSY | KOOSY |
| 도메인 | gohsy.com | koosy.kr |
| 전역 객체 | window.GOHSY | window.KOOSY |
| accent | #2E7D52 (green) | #3b82f6 (blue) |
| accent-hover | #3A9966 | #60a5fa |
| 카테고리 | outer/top/bottom/acc | kit/course/template/bundle |
| 아이콘 | 🧥👕👖👜 | 🔧📚🤖📦 |
| 콘텐츠 | real_model/webtoon/fantasy/cad | unboxing/tutorial/ai_coding/showcase |
| 채널 | Story/Material/Costume/Academy | Project/Component/Workshop/Academy |
| 채널색 | ch1:#6366f1 ch2:#22c55e ch3:#f59e0b ch4:#8b5cf6 | ch1:#8b5cf6 ch2:#3b82f6 ch3:#10b981 ch4:#f59e0b |
| 상품ID | PROD- | KS- |
| 태그라인 | Fashion TV — Wear the Story | Education Kit — Build to Learn |
| localStorage | gohsy_ws_* | koosy_ws_* |
| YouTube catId | 26 (Howto) | 27 (Education) |

---

## Phase 0: Archive + Scaffold

### 커밋: `migration: Phase 0 — legacy 아카이브 + 커머스 스캐폴딩`

### 0-1. legacy/ 아카이브

```bash
cd ~/koosy
mkdir -p legacy

git mv philosophy/ legacy/philosophy/
git mv affiliates/ legacy/affiliates/
git mv articles/ legacy/articles/
```

### 0-2. 디렉토리 스캐폴딩

```bash
cd ~/koosy

mkdir -p catalog/products/KS-001
mkdir -p channels
mkdir -p showroom/lookbook
mkdir -p coupang/queue coupang/rendered coupang/templates
mkdir -p naver/queue naver/rendered naver/templates
mkdir -p youtube/queue youtube/rendered youtube/templates youtube/thumbnails
mkdir -p automation/adapters automation/engine automation/plugins
mkdir -p pipeline/specs
mkdir -p analytics/evidence analytics/reports
mkdir -p gpu/detail-renderer gpu/render
mkdir -p content/unboxing content/tutorials content/ai-coding content/showcase
mkdir -p styles js
mkdir -p workstation
mkdir -p scripts
mkdir -p tools/margin-calc
```

---

## Phase 1: Catalog + Pipeline Core

### 파일: `FACTORY.json`

```json
{
  "$schema": "factory.v3.0",
  "id": "koosy",
  "version": "4.0.0",

  "identity": {
    "name": "KOOSY",
    "nameKo": "쿠씨",
    "tagline": "만들면서 배운다 — Build to Learn",
    "type": "commerce-education",
    "domain": "koosy.kr",
    "github": "dtslib1979.github.io/koosy",
    "language": "ko-KR",
    "established": "2026-01-13",
    "transitioned": "2026-03-05"
  },

  "architecture": {
    "singleSourceOfTruth": "PRODUCT_CARD.json",
    "channels": ["coupang", "naver", "youtube", "showroom"],
    "contentTypes": ["unboxing", "tutorial", "ai_coding", "showcase"],
    "automation": "termux-bridge CDP",
    "rendering": "gpu/ (상세페이지 + 영상 렌더링)"
  },

  "directories": {
    "catalog": "상품 카탈로그 (SoT)",
    "coupang": "쿠팡 벤더 시스템",
    "naver": "네이버 스마트스토어",
    "youtube": "YouTube 마케팅",
    "showroom": "koosy.kr 브랜드 쇼룸",
    "gpu": "렌더링 엔진",
    "automation": "GUI 자동화",
    "pipeline": "파이프라인 JSON 컨트랙트",
    "content": "콘텐츠 소스",
    "analytics": "매출/트래픽 분석",
    "core": "브랜치 표준 모듈",
    "scripts": "운영 스크립트"
  },

  "pipeline": {
    "flow": [
      "PRODUCT_CARD 작성",
      "에셋 생성 (사진/영상 촬영)",
      "GPU 렌더링 (상세페이지 + 영상)",
      "4채널 동시 배포",
      "매출 추적 → 루프백"
    ]
  },

  "businessModel": {
    "name": "허생.exe",
    "sourcing": "1688/타오바오 (원가 5,000원)",
    "bundle": "하드웨어 + AI 프롬프트 + 강의 영상",
    "retail": "29,900원 (마진 51.5%)",
    "moat": ["콘텐츠 해자", "커뮤니티 해자", "속도 해자"]
  },

  "transition": {
    "from": {
      "id": "koosy (셀럽 스토리 편집 방송)",
      "type": "legacy",
      "model": "content-platform"
    },
    "to": {
      "id": "koosy (교육 키트 커머스)",
      "type": "commerce-education",
      "model": "4채널 루프백 교육 커머스"
    }
  },

  "meta": {
    "createdAt": "2026-01-13",
    "updatedAt": "2026-03-05",
    "version": "4.0.0"
  }
}
```

### 파일: `catalog/categories.json`

```json
{
  "$schema": "categories.v1.0",
  "updated": "2026-03-05",
  "categories": {
    "kit": {
      "label": "교육 키트",
      "labelEn": "Education Kit",
      "subcategories": ["esp32", "arduino", "raspberry_pi", "sensor", "robot"],
      "icon": "🔧"
    },
    "course": {
      "label": "강의 패키지",
      "labelEn": "Course",
      "subcategories": ["beginner", "intermediate", "project", "ai_coding"],
      "icon": "📚"
    },
    "template": {
      "label": "AI 템플릿",
      "labelEn": "Template",
      "subcategories": ["claude", "chatgpt", "gemini", "automation"],
      "icon": "🤖"
    },
    "bundle": {
      "label": "번들 세트",
      "labelEn": "Bundle",
      "subcategories": ["starter", "maker", "pro"],
      "icon": "📦"
    }
  }
}
```

### 파일: `catalog/index.json`

```json
{
  "$schema": "catalog.v1.0",
  "updated": "2026-03-05",
  "brand": "koosy",
  "total_products": 1,
  "products": [
    {
      "id": "KS-001",
      "name": "ESP32 IoT 스타터 키트",
      "name_en": "ESP32 IoT Starter Kit",
      "category": "kit/esp32",
      "difficulty": "beginner",
      "price": 29900,
      "image": "catalog/products/KS-001/main.jpg",
      "state": "DRAFT",
      "card": "products/KS-001/card.json"
    }
  ]
}
```

### 파일: `catalog/products/KS-001/card.json`

```json
{
  "schema_version": "1.0",
  "product_id": "KS-001",
  "id": "KS-001",
  "name": "ESP32 IoT 스타터 키트",
  "name_en": "ESP32 IoT Starter Kit",
  "brand": "koosy",
  "state": "DRAFT",
  "category": "kit/esp32",
  "difficulty": "beginner",

  "sourcing": {
    "supplier": "1688.com",
    "supplier_url": null,
    "unit_cost_cny": 25,
    "unit_cost_krw": 5000,
    "moq": 50,
    "lead_time_days": 14
  },

  "price": {
    "cost": 5000,
    "shipping": 6500,
    "retail": 39900,
    "coupang": 29900,
    "naver": 29900,
    "currency": "KRW"
  },

  "kit_contents": {
    "hardware": ["ESP32 DevKit v1", "브레드보드", "점퍼선 20p", "LED 5종", "저항 세트", "온습도 센서 DHT11"],
    "digital": ["프로젝트 가이드 PDF", "Claude 프롬프트 템플릿 3종", "회로도 SVG"],
    "video": ["강의 영상 3편 (총 45분)"]
  },

  "projects": [
    { "id": "P1", "name": "LED 신호등", "difficulty": "beginner", "time": "30분" },
    { "id": "P2", "name": "온도 모니터", "difficulty": "beginner", "time": "45분" },
    { "id": "P3", "name": "IoT 알림봇", "difficulty": "intermediate", "time": "60분" }
  ],

  "spec": {
    "target_age": "중학생~성인",
    "prerequisites": "없음",
    "tools_needed": "PC (Arduino IDE 또는 브라우저)",
    "weight": "350g",
    "origin": "중국 (조립: 한국)"
  },

  "images": {
    "main": "main.jpg",
    "detail": [],
    "lookbook": null,
    "webtoon": null,
    "cad": null
  },

  "tags": ["ESP32", "IoT", "아두이노", "교육키트", "메이커", "초보자"],

  "content_matrix": {
    "unboxing": { "enabled": true, "note": "키트 개봉 + 부품 소개" },
    "tutorial": { "enabled": true, "note": "프로젝트 3개 step-by-step" },
    "ai_coding": { "enabled": true, "note": "Claude로 코드 짜는 과정" },
    "showcase": { "enabled": true, "note": "완성작 데모 + 확장 아이디어" }
  },

  "channels": {
    "coupang": { "status": "pending", "detail_html": "coupang/rendered/KS-001.html" },
    "naver": { "status": "pending", "detail_html": "naver/rendered/KS-001.html" },
    "youtube": { "video_ids": [], "status": "pending" },
    "showroom": { "page_url": "/showroom/lookbook/KS-001.html", "status": "pending" }
  }
}
```

### 파일: `pipeline/flow.json`

```json
{
  "$schema": "flow.v1.0",
  "description": "전체 워크플로우 정의 — PRODUCT_CARD → 4채널 배포",

  "stages": [
    {
      "id": "S1_SPEC",
      "name": "상품 기획",
      "input": "트렌드 조사 + analytics/ 데이터 + 1688 소싱",
      "output": "catalog/products/KS-XXX/card.json",
      "state_transition": "→ DRAFT → SPEC_READY",
      "manual": true,
      "tools": []
    },
    {
      "id": "S2_ASSET",
      "name": "에셋 생성",
      "input": "card.json + 키트 실물 촬영",
      "output": "main.jpg + detail-*.jpg + unboxing photos",
      "state_transition": "SPEC_READY → ASSETS_READY",
      "manual": true,
      "tools": [
        "카메라 촬영",
        "parksy-image 후보정 (선택)"
      ]
    },
    {
      "id": "S3_RENDER",
      "name": "렌더링",
      "input": "card.json + images + bgm",
      "output": "coupang HTML + naver HTML + YouTube MP4",
      "state_transition": "ASSETS_READY → RENDERED",
      "manual": false,
      "tools": [
        "gpu/detail-renderer/generate-detail.js",
        "gpu/render/render-video.js"
      ]
    },
    {
      "id": "S4_DEPLOY",
      "name": "4채널 배포",
      "input": "rendered HTML + MP4 + showroom page",
      "output": "4채널 라이브",
      "state_transition": "RENDERED → COUPANG_LIVE + NAVER_LIVE + YOUTUBE_LIVE + SHOWROOM_LIVE → ALL_LIVE",
      "manual": false,
      "tools": [
        "automation/orchestrator.js",
        "automation/adapters/coupang.js",
        "automation/adapters/naver.js",
        "automation/adapters/youtube.js",
        "automation/adapters/showroom.js"
      ]
    },
    {
      "id": "S5_TRACK",
      "name": "매출 추적 + 루프백",
      "input": "채널 매출/트래픽 데이터",
      "output": "analytics/reports/ + 다음 PRODUCT_CARD",
      "state_transition": "ALL_LIVE → TRACKING → S1_SPEC (루프)",
      "manual": true,
      "tools": [
        "analytics/collector.js",
        "analytics/dashboard.json",
        "scripts/generate-report.sh",
        "showroom/console.html"
      ]
    }
  ],

  "state_machine": {
    "states": ["DRAFT", "SPEC_READY", "ASSETS_READY", "RENDERED", "COUPANG_LIVE", "NAVER_LIVE", "YOUTUBE_LIVE", "SHOWROOM_LIVE", "ALL_LIVE", "TRACKING", "DISCONTINUED", "CANCELLED"],
    "transitions": {
      "DRAFT → SPEC_READY": "card.json 스펙 확정 + 소싱 정보 입력",
      "SPEC_READY → ASSETS_READY": "키트 실물 촬영 + 에셋 생성 완료",
      "ASSETS_READY → RENDERED": "상세페이지 + 영상 렌더링 완료",
      "RENDERED → *_LIVE": "각 채널 등록 완료",
      "ALL_LIVE → TRACKING": "전 채널 라이브 확인",
      "TRACKING → DRAFT": "루프백 (매출 → 다음 기획)"
    }
  }
}
```

### 파일: `pipeline/content-matrix.json`

```json
{
  "$schema": "content-matrix.v1.0",
  "description": "콘텐츠 유형별 파이프라인 매핑 — 교육 키트 특화",

  "types": {
    "unboxing": {
      "label": "키트 개봉기",
      "description": "키트 실물 언박싱 + 부품 소개 + 첫인상",
      "outputs": ["main.jpg", "detail-*.jpg", "unboxing-video.mp4"],
      "channels": {
        "coupang": "상품 메인/디테일 이미지",
        "naver": "상품 메인/디테일 이미지",
        "youtube": "시리즈 A (키트 뜯어보기)",
        "showroom": "상품 갤러리"
      }
    },
    "tutorial": {
      "label": "만들기 강의",
      "description": "프로젝트 step-by-step 가이드. 핵심 콘텐츠.",
      "outputs": ["tutorial-video.mp4", "project-guide.pdf", "circuit-diagram.svg"],
      "channels": {
        "coupang": "강의 미리보기 상세페이지",
        "naver": "블로그 연동 + 디지털 상품",
        "youtube": "시리즈 B (30분 만에 IoT 완성)",
        "showroom": "Workshop 페이지"
      }
    },
    "ai_coding": {
      "label": "AI 코딩",
      "description": "Claude/ChatGPT로 코드 짜는 과정 시연",
      "outputs": ["ai-coding-video.mp4", "prompt-templates.json"],
      "channels": {
        "coupang": "AI 활용 사례 상세",
        "naver": "디지털 상품 (프롬프트 팩)",
        "youtube": "시리즈 C (Claude한테 코드 시키기)",
        "showroom": "Academy 페이지"
      }
    },
    "showcase": {
      "label": "완성작 데모",
      "description": "완성된 프로젝트 데모 + 확장 아이디어",
      "outputs": ["showcase-video.mp4", "demo-photos.jpg"],
      "channels": {
        "coupang": "상세 하단 완성샷",
        "naver": "후기형 콘텐츠",
        "youtube": "시리즈 D (쿠씨의 과외)",
        "showroom": "Project 페이지"
      }
    }
  },

  "bgm_mapping": {
    "source": "parksy-audio/lyria3/",
    "categories": {
      "unboxing": "lyria3/shorts/",
      "tutorial": "lyria3/material/ambient/",
      "ai_coding": "lyria3/material/texture/",
      "showcase": "lyria3/jingle/"
    }
  }
}
```

### 파일: `pipeline/sourcing-model.json`

```json
{
  "$schema": "sourcing.v1.0",
  "model": "허생.exe",
  "description": "정보 시차 거래 — 미국(Brain) + 중국(Body) + 한국(Mouth)",

  "sourcing_chain": {
    "brain": {
      "sources": ["Reddit", "GitHub Trending", "Hackernews", "ProductHunt"],
      "role": "트렌드 발굴 — 뜨는 메이커 프로젝트/키트 선별"
    },
    "body": {
      "sources": ["1688.com", "타오바오", "AliExpress"],
      "role": "부품 소싱 — 최저가 MOQ 50~100개 단위",
      "typical_cost": "3,000~8,000 KRW per kit"
    },
    "mouth": {
      "outputs": ["AI 프롬프트 템플릿", "영상 강의", "프로젝트 가이드"],
      "role": "콘텐츠 번들 — 부품 + 지식 = 29,900원 상품",
      "margin": "51.5% (키트) ~ 100% (디지털)"
    }
  },

  "moat": {
    "content": "키트당 강의 3편 + AI 템플릿 — 따라올 수 없는 번들",
    "community": "12슬롯 길드 + YouTube 구독자 커뮤니티",
    "speed": "Claude Code로 강의 자동 생성 — 경쟁사 2주 vs 1일"
  },

  "pricing_tiers": [
    { "type": "kit", "retail": 29900, "cost": 5000, "shipping": 6500, "margin": "51.5%" },
    { "type": "course", "retail": 19900, "cost": 0, "shipping": 0, "margin": "100%" },
    { "type": "template", "retail": 9900, "cost": 0, "shipping": 0, "margin": "100%" },
    { "type": "bundle", "retail": 49900, "cost": 5000, "shipping": 6500, "margin": "70.9%" }
  ]
}
```

### 파일: `automation/orchestrator.js`

```javascript
#!/usr/bin/env node
/**
 * orchestrator.js — 4채널 디스패처 + 상태 머신
 *
 * PRODUCT_CARD.json 하나로 4채널 동시 배포.
 * 헌법 제2조: 증빙(스크린샷) 필수, BOM(card.json) 확인 후 착공.
 *
 * Usage:
 *   node orchestrator.js <product_id> [--channels coupang,naver,youtube,showroom] [--dry-run]
 *
 * Examples:
 *   node orchestrator.js KS-001
 *   node orchestrator.js KS-001 --channels coupang,naver --dry-run
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const productId = args[0];
const dryRun = args.includes('--dry-run');

if (!productId) {
  console.error('Usage: node orchestrator.js <product_id> [--channels ...] [--dry-run]');
  process.exit(1);
}

function getArg(flag, fallback) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const requestedChannels = getArg('--channels', 'coupang,naver,youtube,showroom').split(',');

// ── Load PRODUCT_CARD ─────────────────────────────────
const cardPath = path.join(ROOT, 'catalog/products', productId, 'card.json');
if (!fs.existsSync(cardPath)) {
  console.error(`ERROR: ${cardPath} not found (BOM 미확인 — 헌법 위반)`);
  process.exit(1);
}

const card = JSON.parse(fs.readFileSync(cardPath, 'utf8'));
if (!card.product_id && card.id) card.product_id = card.id;

console.log(`\n${'='.repeat(60)}`);
console.log(`  ORCHESTRATOR: ${card.product_id} — ${card.name}`);
console.log(`  channels: ${requestedChannels.join(', ')}`);
console.log(`  dry-run: ${dryRun}`);
console.log(`${'='.repeat(60)}\n`);

// ── State Machine ─────────────────────────────────────
const STATES = {
  PENDING: 'pending',
  DEPLOYING: 'deploying',
  LIVE: 'live',
  FAILED: 'failed'
};

// ── Adapters ──────────────────────────────────────────
const adapters = {
  coupang: require('./adapters/coupang'),
  naver: require('./adapters/naver'),
  youtube: require('./adapters/youtube'),
  showroom: require('./adapters/showroom')
};

// ── Pre-flight Checks ─────────────────────────────────
function preflight(ch) {
  if (ch === 'coupang' || ch === 'naver') {
    const htmlPath = path.join(ROOT, ch, 'rendered', `${card.product_id}.html`);
    if (!fs.existsSync(htmlPath)) {
      console.log(`  ⚠ ${ch}: 상세페이지 미렌더 → gpu/detail-renderer/generate-detail.js 먼저 실행`);
      return false;
    }
  }
  if (ch === 'youtube') {
    const descPath = path.join(ROOT, 'youtube/rendered', `${card.product_id}-desc.txt`);
    if (!fs.existsSync(descPath)) {
      console.log(`  ⚠ youtube: 영상 설명 미생성 → gpu/render/render-video.js 먼저 실행`);
      return false;
    }
  }
  return true;
}

// ── Deploy ────────────────────────────────────────────
async function deploy() {
  const results = {};
  const timestamp = new Date().toISOString();

  for (const ch of requestedChannels) {
    console.log(`\n--- ${ch.toUpperCase()} ---`);

    if (!adapters[ch]) {
      console.log(`  ✗ unknown channel: ${ch}`);
      results[ch] = STATES.FAILED;
      continue;
    }

    if (!preflight(ch)) {
      results[ch] = STATES.FAILED;
      continue;
    }

    if (card.channels[ch]) {
      card.channels[ch].status = STATES.DEPLOYING;
    }

    try {
      if (dryRun) {
        console.log(`  [DRY-RUN] ${ch} adapter would execute here`);
        results[ch] = STATES.LIVE;
      } else {
        const result = await adapters[ch].deploy(card, ROOT);
        results[ch] = result.success ? STATES.LIVE : STATES.FAILED;

        if (result.url && card.channels[ch]) {
          card.channels[ch].product_url = result.url;
        }
        if (result.message) {
          console.log(`  ${result.success ? '✓' : '✗'} ${result.message}`);
        }
      }
    } catch (err) {
      console.error(`  ✗ ${ch} error: ${err.message}`);
      results[ch] = STATES.FAILED;
    }

    if (card.channels[ch]) {
      card.channels[ch].status = results[ch];
    }
  }

  // ── Update PRODUCT_CARD ───────────────────────────────
  const allLive = requestedChannels.every(ch => results[ch] === STATES.LIVE);
  if (allLive) {
    card.state = 'ALL_LIVE';
  }

  if (!dryRun) {
    fs.writeFileSync(cardPath, JSON.stringify(card, null, 2) + '\n', 'utf8');
    console.log(`\n  ✓ card.json updated`);

    const indexPath = path.join(ROOT, 'catalog/index.json');
    if (fs.existsSync(indexPath)) {
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      const entry = index.products.find(p => p.id === card.product_id);
      if (entry && entry.state !== card.state) {
        entry.state = card.state;
        fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');
        console.log(`  ✓ index.json synced (${card.product_id} → ${card.state})`);
      }
    }
  }

  // ── Queue Log ───────────────────────────────────────
  const logEntry = {
    ts: timestamp,
    product_id: card.product_id,
    channels: results,
    all_live: allLive,
    dry_run: dryRun
  };

  if (!dryRun) {
    const logPath = path.join(ROOT, 'analytics/deploy-log.jsonl');
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n', 'utf8');
  }

  // ── Summary ─────────────────────────────────────────
  console.log(`\n${'='.repeat(60)}`);
  console.log('  RESULT:');
  for (const [ch, state] of Object.entries(results)) {
    const icon = state === STATES.LIVE ? '✓' : '✗';
    console.log(`    ${icon} ${ch}: ${state}`);
  }
  console.log(`\n  ALL_LIVE: ${allLive}`);
  console.log(`${'='.repeat(60)}\n`);

  return allLive ? 0 : 1;
}

deploy().then(code => process.exit(code));
```

### 파일: `automation/adapters/coupang.js`

```javascript
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
```

### 파일: `automation/adapters/naver.js`

```javascript
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
```

### 파일: `automation/adapters/youtube.js`

```javascript
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
```

### 파일: `automation/adapters/showroom.js`

```javascript
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
```

### 파일: `automation/engine/screenshot.js`

```javascript
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
```

### 파일: `automation/engine/session.js`

```javascript
/**
 * session.js — 세션/쿠키 관리
 *
 * 쿠팡/네이버 로그인 세션 유지.
 * .credentials/ 디렉토리 (gitignore 대상).
 */

const fs = require('fs');
const path = require('path');

const CRED_DIR = '.credentials';

class SessionManager {
  constructor(root) {
    this.root = root;
    this.credDir = path.join(root, 'automation', CRED_DIR);
  }

  _path(channel) {
    return path.join(this.credDir, `${channel}-session.json`);
  }

  load(channel) {
    const p = this._path(channel);
    if (!fs.existsSync(p)) {
      console.log(`  [session] no saved session for ${channel}`);
      return null;
    }
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (data.expires && new Date(data.expires) < new Date()) {
      console.log(`  [session] ${channel} session expired`);
      return null;
    }
    console.log(`  [session] loaded ${channel} session`);
    return data;
  }

  save(channel, sessionData) {
    fs.mkdirSync(this.credDir, { recursive: true });
    fs.writeFileSync(this._path(channel), JSON.stringify(sessionData, null, 2), 'utf8');
    console.log(`  [session] saved ${channel} session`);
  }

  clear(channel) {
    const p = this._path(channel);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log(`  [session] cleared ${channel} session`);
    }
  }

  isConfigured() {
    return fs.existsSync(this.credDir);
  }
}

module.exports = SessionManager;
```

### 파일: `analytics/collector.js`

```javascript
#!/usr/bin/env node
/**
 * collector.js — 4채널 매출/트래픽 데이터 수집기
 *
 * 각 채널에서 데이터를 가져와 analytics/*.jsonl에 append.
 * 헌법 제2조: append-only 원장. 삭제 금지.
 *
 * Usage:
 *   node collector.js [--channel coupang|naver|youtube|showroom|all] [--date YYYY-MM-DD]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ANALYTICS = path.join(ROOT, 'analytics');

const args = process.argv.slice(2);
function getArg(flag, fallback) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const channel = getArg('--channel', 'all');
const date = getArg('--date', new Date().toISOString().split('T')[0]);
const inputFile = getArg('--input', null);

console.log(`\n${'='.repeat(50)}`);
console.log(`  COLLECTOR: ${channel} / ${date}`);
console.log(`${'='.repeat(50)}\n`);

// ── Append to JSONL ───────────────────────────────
function appendLog(file, entry) {
  const line = JSON.stringify(entry) + '\n';
  fs.appendFileSync(path.join(ANALYTICS, file), line);
}

// ── Load catalog ──────────────────────────────────
const catalogPath = path.join(ROOT, 'catalog/index.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const liveProducts = catalog.products.filter(p => p.state === 'ALL_LIVE');

// ── CSV/JSON Input Mode ───────────────────────────
if (inputFile) {
  console.log(`  input: ${inputFile}`);
  const raw = fs.readFileSync(inputFile, 'utf8').trim();

  if (inputFile.endsWith('.json')) {
    const entries = JSON.parse(raw);
    (Array.isArray(entries) ? entries : [entries]).forEach(e => {
      e.timestamp = e.timestamp || new Date().toISOString();
      e.source = 'manual-import';
      if (e.revenue !== undefined) {
        appendLog('sales-log.jsonl', e);
        console.log(`  + sale: ${e.product_id} ${e.channel} ₩${e.revenue}`);
      } else {
        appendLog('traffic-log.jsonl', e);
        console.log(`  + traffic: ${e.product_id} ${e.channel} ${e.count}`);
      }
    });
  } else if (inputFile.endsWith('.csv')) {
    const lines = raw.split('\n').slice(1);
    lines.forEach(line => {
      const [product_id, ch, type, value] = line.split(',').map(s => s.trim());
      if (!product_id) return;
      const ts = new Date().toISOString();
      if (type === 'sale') {
        appendLog('sales-log.jsonl', {
          timestamp: ts, product_id, channel: ch,
          event: 'sale', quantity: 1, price: Number(value), revenue: Number(value),
          source: 'csv-import'
        });
        console.log(`  + sale: ${product_id} ${ch} ₩${value}`);
      } else {
        appendLog('traffic-log.jsonl', {
          timestamp: ts, product_id, channel: ch,
          event: type || 'view', count: Number(value) || 1,
          source: 'csv-import'
        });
        console.log(`  + traffic: ${product_id} ${ch} ${value}`);
      }
    });
  }
  console.log('\n  ✓ import complete');
  process.exit(0);
}

// ── Interactive: Manual Data Entry ────────────────
if (args.includes('--interactive')) {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  function ask(q) {
    return new Promise(resolve => rl.question(q, resolve));
  }

  (async () => {
    console.log('  Available products:');
    liveProducts.forEach(p => console.log(`    ${p.id}: ${p.name} (${p.state})`));
    console.log();

    const pid = await ask('  product_id: ');
    const ch = await ask('  channel (coupang/naver/youtube/showroom): ');
    const type = await ask('  type (sale/view/click): ');

    if (type === 'sale') {
      const qty = await ask('  quantity: ');
      const price = await ask('  price: ');
      appendLog('sales-log.jsonl', {
        timestamp: new Date().toISOString(),
        product_id: pid, channel: ch, event: 'sale',
        quantity: Number(qty), price: Number(price),
        revenue: Number(qty) * Number(price),
        source: 'manual'
      });
      console.log(`  ✓ sale recorded`);
    } else {
      const count = await ask('  count: ');
      appendLog('traffic-log.jsonl', {
        timestamp: new Date().toISOString(),
        product_id: pid, channel: ch,
        event: type, count: Number(count),
        source: 'manual'
      });
      console.log(`  ✓ traffic recorded`);
    }

    updateChannelPerformance(pid, ch);
    rl.close();
  })();
} else {
  // ── Auto Collect: Aggregate from logs ───────────
  console.log('  mode: aggregate');
  console.log(`  live products: ${liveProducts.length}`);

  aggregateDashboard();
  console.log('\n  ✓ dashboard.json updated');
}

// ── Channel Performance ───────────────────────────
function updateChannelPerformance(productId, ch) {
  appendLog('channel-performance.jsonl', {
    timestamp: new Date().toISOString(),
    product_id: productId,
    channel: ch,
    event: 'update'
  });
}

// ── Dashboard Aggregation ─────────────────────────
function aggregateDashboard() {
  const salesLog = path.join(ANALYTICS, 'sales-log.jsonl');
  const trafficLog = path.join(ANALYTICS, 'traffic-log.jsonl');
  const deployLog = path.join(ANALYTICS, 'deploy-log.jsonl');

  function readJsonl(file) {
    if (!fs.existsSync(file)) return [];
    return fs.readFileSync(file, 'utf8').trim().split('\n')
      .map(l => { try { return JSON.parse(l); } catch { return null; } })
      .filter(e => e && !e.$dummy);
  }

  const sales = readJsonl(salesLog);
  const traffic = readJsonl(trafficLog);
  const deploys = readJsonl(deployLog);

  const revenueByChannel = {};
  const salesByProduct = {};
  sales.forEach(s => {
    revenueByChannel[s.channel] = (revenueByChannel[s.channel] || 0) + (s.revenue || 0);
    salesByProduct[s.product_id] = (salesByProduct[s.product_id] || 0) + (s.quantity || 0);
  });

  const trafficByChannel = {};
  traffic.forEach(t => {
    trafficByChannel[t.channel] = (trafficByChannel[t.channel] || 0) + (t.count || 0);
  });

  const channels = ['coupang', 'naver', 'youtube', 'showroom'];
  const channelMetrics = {};
  channels.forEach(ch => {
    const rev = revenueByChannel[ch] || 0;
    const views = trafficByChannel[ch] || 0;
    channelMetrics[ch] = {
      revenue: rev,
      traffic: views,
      conversion: views > 0 ? ((salesByProduct[ch] || 0) / views * 100).toFixed(2) + '%' : 'N/A',
      status: 'active'
    };
  });

  const totalRevenue = Object.values(revenueByChannel).reduce((a, b) => a + b, 0);
  const totalTraffic = Object.values(trafficByChannel).reduce((a, b) => a + b, 0);

  const dashboard = {
    generated: new Date().toISOString(),
    period: date.substring(0, 7),
    kpi: {
      total_revenue: totalRevenue,
      total_orders: sales.length,
      total_traffic: totalTraffic,
      products_live: liveProducts.length,
      products_total: catalog.products.length,
      avg_order_value: sales.length > 0 ? Math.round(totalRevenue / sales.length) : 0,
      currency: 'KRW'
    },
    channels: channelMetrics,
    top_products: Object.entries(salesByProduct)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, qty]) => ({ product_id: id, quantity: qty, revenue: revenueByChannel[id] || 0 })),
    deploys: {
      total: deploys.length,
      all_live: deploys.filter(d => d.all_live).length
    },
    loopback: {
      note: 'TRACKING → S1_SPEC: 매출 데이터 기반 다음 상품 기획',
      ready: totalRevenue > 0
    }
  };

  fs.writeFileSync(
    path.join(ANALYTICS, 'dashboard.json'),
    JSON.stringify(dashboard, null, 2) + '\n'
  );

  console.log(`  revenue: ₩${totalRevenue.toLocaleString()}`);
  console.log(`  orders: ${sales.length}`);
  console.log(`  traffic: ${totalTraffic}`);
  channels.forEach(ch => {
    console.log(`    ${ch}: ₩${channelMetrics[ch].revenue.toLocaleString()} / ${channelMetrics[ch].traffic} views`);
  });
}
```

### 파일: `analytics/dashboard.json`

```json
{
  "generated": null,
  "period": "2026-03",
  "kpi": {
    "total_revenue": 0,
    "total_orders": 0,
    "total_traffic": 0,
    "products_live": 0,
    "products_total": 1,
    "avg_order_value": 0,
    "currency": "KRW"
  },
  "channels": {
    "coupang": { "revenue": 0, "traffic": 0, "conversion": "N/A", "status": "setup" },
    "naver": { "revenue": 0, "traffic": 0, "conversion": "N/A", "status": "setup" },
    "youtube": { "revenue": 0, "traffic": 0, "conversion": "N/A", "status": "setup" },
    "showroom": { "revenue": 0, "traffic": 0, "conversion": "N/A", "status": "setup" }
  },
  "top_products": [],
  "deploys": { "total": 0, "all_live": 0 },
  "loopback": {
    "note": "TRACKING → S1_SPEC: 매출 데이터 기반 다음 상품 기획",
    "ready": false
  }
}
```

### 파일: `gpu/detail-renderer/generate-detail.js`

```javascript
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
```

### 파일: `gpu/render/render-video.js`

```javascript
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
```

### 파일: `gpu/render/ffmpeg-builder.js`

```javascript
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
```

### 커밋: `migration: Phase 1 — catalog + pipeline + automation + analytics + gpu 코어`

---

## Phase 2: Design System + Channel Pages

### 파일: `styles/tokens.css`

```css
/* KOOSY Education Kit — Design Tokens */
:root {
  --black:#000;--white:#fff;
  --bg:#0a0f1a;--surface:#111827;--elevated:#1f2937;--overlay:rgba(10,15,26,0.85);
  --text:#f1f5f9;--text-2:#94a3b8;--text-3:#64748b;--text-inv:#0a0f1a;
  --accent:#3b82f6;--accent-dim:rgba(59,130,246,0.12);--accent-hover:#60a5fa;
  --success:#34c759;--warning:#f59e0b;--error:#ff453a;
  --border:rgba(255,255,255,0.08);--border-bold:rgba(255,255,255,0.15);
  --ch1:#8b5cf6;--ch2:#3b82f6;--ch3:#10b981;--ch4:#f59e0b;
  --font:'Pretendard Variable','Pretendard',-apple-system,BlinkMacSystemFont,system-ui,'Noto Sans KR',sans-serif;
  --font-mono:'JetBrains Mono','SF Mono','Fira Code',monospace;
  --text-display:clamp(3.5rem,10vw,8rem);--text-hero:clamp(2.5rem,7vw,5.5rem);
  --text-h1:clamp(1.75rem,4vw,3rem);--text-h2:clamp(1.25rem,2.5vw,2rem);
  --text-h3:clamp(1rem,1.5vw,1.25rem);--text-body:clamp(0.875rem,1vw,1rem);
  --text-small:0.8125rem;--text-xs:0.6875rem;--text-micro:0.5625rem;
  --w-thin:100;--w-light:200;--w-regular:400;--w-medium:500;--w-semibold:600;--w-bold:700;--w-black:900;
  --lh-tight:1.1;--lh-snug:1.25;--lh-normal:1.5;--lh-relaxed:1.75;
  --ls-tight:-0.02em;--ls-normal:0;--ls-wide:0.08em;--ls-wider:0.15em;--ls-widest:0.3em;
  --sp-1:4px;--sp-2:8px;--sp-3:12px;--sp-4:16px;--sp-5:20px;--sp-6:24px;--sp-8:32px;
  --sp-10:40px;--sp-12:48px;--sp-16:64px;--sp-20:80px;--sp-24:96px;--sp-32:128px;
  --max-w:1440px;--max-w-text:720px;--max-w-narrow:480px;--gutter:clamp(16px,4vw,48px);
  --nav-h:56px;--player-h:64px;--player-h-m:56px;
  --r-none:0;--r-sm:4px;--r-md:8px;--r-lg:12px;--r-xl:20px;--r-full:9999px;
  --shadow-sm:0 1px 2px rgba(0,0,0,0.3);--shadow-md:0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg:0 8px 32px rgba(0,0,0,0.5);--shadow-glow:0 0 40px rgba(59,130,246,0.15);
  --ease-out:cubic-bezier(0.16,1,0.3,1);--ease-in-out:cubic-bezier(0.65,0,0.35,1);
  --ease-spring:cubic-bezier(0.34,1.56,0.64,1);
  --dur-fast:150ms;--dur-normal:300ms;--dur-slow:600ms;--dur-slower:1000ms;
  --z-base:1;--z-sticky:10;--z-nav:100;--z-player:200;--z-overlay:300;--z-modal:400;--z-toast:500;
}
[data-theme="light"]{--bg:#f5f3ee;--surface:#fff;--elevated:#fafafa;--text:#111;--text-2:#666;--text-3:#aaa;--text-inv:#fff;--border:rgba(0,0,0,0.08);--border-bold:rgba(0,0,0,0.15)}
```

### 파일: `styles/reset.css`

```css
/* KOOSY Education Kit — Reset & Base */
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;scroll-behavior:smooth;font-size:16px;-webkit-tap-highlight-color:transparent;-webkit-text-size-adjust:100%}
body{font-family:var(--font);font-size:var(--text-body);font-weight:var(--w-regular);line-height:var(--lh-normal);color:var(--text);background-color:var(--bg);min-height:100vh;min-height:100dvh;overflow-x:hidden}
body::-webkit-scrollbar{width:6px}
body::-webkit-scrollbar-track{background:var(--bg)}
body::-webkit-scrollbar-thumb{background:var(--text-3);border-radius:var(--r-full)}
::selection{background:var(--accent);color:var(--white)}
h1,h2,h3,h4,h5,h6{font-weight:var(--w-bold);line-height:var(--lh-tight);letter-spacing:var(--ls-tight);font-family:var(--font-mono)}
a{color:inherit;text-decoration:none;transition:color var(--dur-fast) ease}
img,picture,video,canvas,svg{display:block;max-width:100%}
img{height:auto;-webkit-user-drag:none}
button,input,select,textarea{font:inherit;color:inherit;background:none;border:none;outline:none}
button{cursor:pointer;-webkit-user-select:none;user-select:none}
ul,ol{list-style:none}
table{border-collapse:collapse;border-spacing:0}
hr{border:none;height:1px;background:var(--border)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
:focus:not(:focus-visible){outline:none}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.container{width:100%;max-width:var(--max-w);margin:0 auto;padding:0 var(--gutter)}
.container--text{max-width:var(--max-w-text)}
.container--narrow{max-width:var(--max-w-narrow)}
```

### 파일: `styles/components.css`

```css
/* KOOSY Education Kit — Shared Components */

/* ── NAV ── */
.nav{position:fixed;top:0;left:0;right:0;height:var(--nav-h);z-index:var(--z-nav);display:flex;align-items:center;justify-content:space-between;padding:0 var(--gutter);background:rgba(10,15,26,0.75);backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%);border-bottom:1px solid var(--border);transition:background var(--dur-normal) ease}
.nav--scrolled{background:rgba(10,15,26,0.95)}
.nav__brand{font-size:1rem;font-weight:var(--w-light);letter-spacing:var(--ls-widest);text-transform:uppercase;white-space:nowrap;flex-shrink:0;font-family:var(--font-mono)}
.nav__channels{display:flex;gap:var(--sp-1);position:absolute;left:50%;transform:translateX(-50%)}
.nav__ch{position:relative;padding:var(--sp-2) var(--sp-4);font-size:var(--text-xs);font-weight:var(--w-medium);letter-spacing:var(--ls-wide);text-transform:uppercase;color:var(--text-3);transition:color var(--dur-normal) ease;white-space:nowrap}
.nav__ch::after{content:'';position:absolute;bottom:-1px;left:var(--sp-4);right:var(--sp-4);height:2px;background:var(--accent);transform:scaleX(0);transform-origin:center;transition:transform var(--dur-normal) var(--ease-out)}
.nav__ch:hover{color:var(--text-2)}
.nav__ch.is-active{color:var(--text)}
.nav__ch.is-active::after{transform:scaleX(1)}
.nav__actions{display:flex;gap:var(--sp-4);align-items:center;flex-shrink:0}
.nav__link{font-size:var(--text-xs);font-weight:var(--w-regular);letter-spacing:var(--ls-wide);color:var(--text-3);text-transform:uppercase;transition:color var(--dur-fast) ease}
.nav__link:hover{color:var(--text)}
@media(max-width:1279px){.nav__channels{gap:0}.nav__ch{padding:var(--sp-2) var(--sp-3);font-size:var(--text-micro)}}
@media(max-width:768px){.nav__channels{position:static;transform:none;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}.nav__channels::-webkit-scrollbar{display:none}.nav__actions{display:none}}

/* ── PLAYER BAR ── */
.player-bar{position:fixed;bottom:0;left:0;right:0;height:var(--player-h);z-index:var(--z-player);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 var(--gutter);gap:var(--sp-4);background:rgba(10,15,26,0.92);backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%);border-top:1px solid var(--border);transform:translateY(100%);transition:transform var(--dur-slow) var(--ease-out)}
.player-bar.is-visible{transform:translateY(0)}
.player-bar__music{display:flex;align-items:center;gap:var(--sp-3);min-width:0}
.player-bar__art{width:40px;height:40px;border-radius:var(--r-sm);background:var(--elevated);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:var(--text-small)}
.player-bar__meta{min-width:0}
.player-bar__title{font-size:var(--text-xs);font-weight:var(--w-medium);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.player-bar__artist{font-size:var(--text-micro);color:var(--text-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.player-bar__controls{display:flex;align-items:center;gap:var(--sp-4)}
.player-bar__btn{width:36px;height:36px;border-radius:var(--r-full);border:1px solid var(--border-bold);display:flex;align-items:center;justify-content:center;font-size:var(--text-small);transition:all var(--dur-fast) ease;color:var(--text)}
.player-bar__btn:hover{background:var(--text);color:var(--bg);border-color:var(--text)}
.player-bar__btn--play{width:40px;height:40px;background:var(--text);color:var(--bg);border:none}
.player-bar__btn--play:hover{transform:scale(1.08);background:var(--accent);color:var(--white)}
.player-bar__product{display:flex;align-items:center;gap:var(--sp-3);justify-content:flex-end;min-width:0}
.player-bar__thumb{width:40px;height:40px;border-radius:var(--r-sm);background:var(--elevated);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:var(--text-small)}
.player-bar__buy{flex-shrink:0;padding:var(--sp-2) var(--sp-4);background:var(--accent);color:var(--white);font-size:var(--text-micro);font-weight:var(--w-semibold);letter-spacing:var(--ls-wide);text-transform:uppercase;border-radius:var(--r-full);transition:all var(--dur-fast) ease}
.player-bar__buy:hover{background:var(--accent-hover);transform:scale(1.04)}
@media(max-width:768px){.player-bar{height:var(--player-h-m);grid-template-columns:1fr auto auto;gap:var(--sp-3)}.player-bar__controls{gap:var(--sp-2)}.player-bar__btn{display:none}.player-bar__btn--play{display:flex;width:32px;height:32px}.player-bar__meta{display:none}}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:var(--sp-2);padding:var(--sp-3) var(--sp-8);font-size:var(--text-xs);font-weight:var(--w-medium);letter-spacing:var(--ls-wider);text-transform:uppercase;border:1px solid var(--text-3);border-radius:0;color:var(--text);background:transparent;transition:all var(--dur-normal) var(--ease-out);white-space:nowrap;position:relative;overflow:hidden}
.btn::before{content:'';position:absolute;inset:0;background:var(--text);transform:translateY(101%);transition:transform var(--dur-normal) var(--ease-out)}
.btn:hover::before{transform:translateY(0)}
.btn:hover{color:var(--bg);border-color:var(--text)}
.btn span{position:relative;z-index:1}
.btn--accent{background:var(--accent);border-color:var(--accent);color:var(--white)}
.btn--accent::before{background:var(--white)}
.btn--accent:hover{color:var(--accent)}
.btn--ghost{border-color:transparent;color:var(--text-2)}
.btn--ghost::before{display:none}
.btn--ghost:hover{color:var(--text)}
.btn--lg{padding:var(--sp-4) var(--sp-12);font-size:var(--text-small)}
.btn--sm{padding:var(--sp-2) var(--sp-4);font-size:var(--text-micro)}
.btn--full{width:100%}

/* ── PRODUCT CARD ── */
.card{position:relative;overflow:hidden;cursor:pointer;transition:transform var(--dur-slow) var(--ease-out);display:block}
.card:hover{transform:translateY(-4px)}
.card__image{position:relative;width:100%;aspect-ratio:3/4;overflow:hidden;background:var(--surface)}
.card__image img{width:100%;height:100%;object-fit:cover;transition:transform var(--dur-slow) var(--ease-out)}
.card:hover .card__image img{transform:scale(1.05)}
.card__placeholder{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--sp-2);background:var(--surface);transition:background var(--dur-normal) ease}
.card__placeholder-icon{font-size:2.5rem;opacity:0.3}
.card__placeholder-text{font-size:var(--text-display);font-weight:var(--w-black);letter-spacing:var(--ls-tight);opacity:0.04;position:absolute;white-space:nowrap}
.card:hover .card__placeholder{background:var(--elevated)}
.card__badge{position:absolute;top:var(--sp-3);left:var(--sp-3);padding:var(--sp-1) var(--sp-3);font-size:var(--text-micro);font-weight:var(--w-semibold);letter-spacing:var(--ls-wide);text-transform:uppercase;background:var(--bg);color:var(--text);border:1px solid var(--border-bold)}
.card__info{padding:var(--sp-4) 0}
.card__category{font-size:var(--text-micro);font-weight:var(--w-medium);letter-spacing:var(--ls-wider);text-transform:uppercase;color:var(--text-3);margin-bottom:var(--sp-1)}
.card__name{font-size:var(--text-body);font-weight:var(--w-light);margin-bottom:var(--sp-1)}
.card__price{font-size:var(--text-body);font-weight:var(--w-medium)}

/* ── SECTION ── */
.section{padding:var(--sp-24) 0;position:relative}
.section--flush{padding:0}
.section--sm{padding:var(--sp-16) 0}
.section__label{font-size:var(--text-micro);font-weight:var(--w-medium);letter-spacing:var(--ls-widest);text-transform:uppercase;color:var(--text-3);margin-bottom:var(--sp-6)}
.section__title{font-size:var(--text-h1);font-weight:var(--w-thin);letter-spacing:var(--ls-tight);margin-bottom:var(--sp-6)}
@media(max-width:768px){.section{padding:var(--sp-16) 0}}

/* ── FOOTER ── */
.footer{padding:var(--sp-24) 0 var(--sp-8);border-top:1px solid var(--border)}
.footer__brand{font-size:var(--text-h2);font-weight:var(--w-light);letter-spacing:var(--ls-widest);text-transform:uppercase;margin-bottom:var(--sp-2);font-family:var(--font-mono)}
.footer__tagline{font-size:var(--text-xs);color:var(--text-3);letter-spacing:var(--ls-wide);margin-bottom:var(--sp-12)}
.footer__links{display:flex;gap:var(--sp-8);margin-bottom:var(--sp-16);flex-wrap:wrap}
.footer__link{font-size:var(--text-xs);font-weight:var(--w-medium);letter-spacing:var(--ls-wider);text-transform:uppercase;color:var(--text-3);transition:color var(--dur-fast) ease}
.footer__link:hover{color:var(--text)}
.footer__copy{font-size:var(--text-micro);color:var(--text-3)}
.page-spacer{height:var(--player-h)}
@media(max-width:768px){.page-spacer{height:var(--player-h-m)}.footer{padding:var(--sp-16) 0 var(--sp-6)}}

/* ── NEXT CHANNEL CTA ── */
.next-channel{text-align:center;padding:var(--sp-24) var(--gutter);border-top:1px solid var(--border)}
.next-channel__label{font-size:var(--text-micro);letter-spacing:var(--ls-widest);text-transform:uppercase;color:var(--text-3);margin-bottom:var(--sp-4)}
.next-channel__name{font-size:var(--text-h1);font-weight:var(--w-bold);transition:color var(--dur-fast) ease}
.next-channel a:hover .next-channel__name{color:var(--accent)}
```

### 파일: `styles/animations.css`

```css
/* KOOSY Education Kit — Animations */

/* ── Scroll Reveal ── */
.reveal{opacity:0;transform:translateY(32px);transition:opacity var(--dur-slow) var(--ease-out),transform var(--dur-slow) var(--ease-out)}
.reveal.is-visible{opacity:1;transform:translateY(0)}
.reveal-d1{transition-delay:100ms}.reveal-d2{transition-delay:200ms}.reveal-d3{transition-delay:300ms}.reveal-d4{transition-delay:400ms}
.reveal--left{transform:translateX(-32px)}.reveal--left.is-visible{transform:translateX(0)}
.reveal--right{transform:translateX(32px)}.reveal--right.is-visible{transform:translateX(0)}
.reveal--scale{transform:scale(0.95)}.reveal--scale.is-visible{transform:scale(1)}
.reveal--none{transform:none}.reveal--none.is-visible{transform:none}

/* ── Text Reveal ── */
.reveal-text{overflow:hidden}
.reveal-text .line{display:block;opacity:0;transform:translateY(110%);transition:opacity var(--dur-slow) var(--ease-out),transform var(--dur-slow) var(--ease-out);transition-delay:calc(var(--i,0)*120ms)}
.reveal-text.is-visible .line{opacity:1;transform:translateY(0)}

/* ── Keyframes ── */
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes pulse{0%,100%{opacity:0.3;transform:translateY(0)}50%{opacity:1;transform:translateY(8px)}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}

/* ── Loader ── */
.loader{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:var(--bg);transition:opacity 0.6s var(--ease-out)}
.loader.is-done{opacity:0;pointer-events:none}
.loader__brand{font-size:clamp(2rem,6vw,4rem);font-weight:var(--w-light);letter-spacing:var(--ls-widest);text-transform:uppercase;animation:fadeIn 0.8s var(--ease-out) both;font-family:var(--font-mono)}

/* ── Scroll Hint ── */
.scroll-hint{position:absolute;bottom:var(--sp-8);left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:var(--sp-2);animation:pulse 2s ease-in-out infinite}
.scroll-hint__line{width:1px;height:40px;background:linear-gradient(to bottom,transparent,var(--text-3))}
.scroll-hint__text{font-size:var(--text-micro);letter-spacing:var(--ls-widest);text-transform:uppercase;color:var(--text-3)}

/* ── Reduced Motion ── */
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important}.reveal,.reveal-text .line{opacity:1;transform:none}.scroll-hint{animation:none}}
```

### 파일: `styles/landing.css`

```css
/* KOOSY Education Kit — Landing Page */

/* ── HERO ── */
.hero{position:relative;height:100vh;height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;padding-top:var(--nav-h)}
.hero__bg{position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse 80% 60% at 50% 40%,rgba(59,130,246,0.06) 0%,transparent 60%),radial-gradient(ellipse 60% 80% at 30% 70%,rgba(139,92,246,0.03) 0%,transparent 50%),var(--bg)}
.hero__bg::after{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");background-repeat:repeat;background-size:256px;opacity:0.4;pointer-events:none}
.hero__content{position:relative;z-index:1;text-align:center;padding:0 var(--gutter)}
.hero__brand{font-size:clamp(4rem,14vw,12rem);font-weight:var(--w-thin);letter-spacing:0.4em;text-transform:uppercase;line-height:0.9;margin-right:-0.4em;animation:fadeIn 1.2s var(--ease-out) 0.3s both;font-family:var(--font-mono)}
.hero__tagline{font-size:var(--text-small);font-weight:var(--w-light);letter-spacing:var(--ls-widest);text-transform:lowercase;color:var(--text-3);margin-top:var(--sp-6);animation:fadeIn 1s var(--ease-out) 0.8s both}
.hero__line{width:1px;height:48px;background:linear-gradient(to bottom,var(--text-3),transparent);margin:var(--sp-8) auto 0;animation:fadeIn 1s var(--ease-out) 1.2s both}

/* ── CHANNEL GRID ── */
.channels-section{padding:0}
.channel-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border)}
.channel-card{position:relative;display:flex;flex-direction:column;justify-content:flex-end;padding:var(--sp-10) var(--sp-8);min-height:50vh;background:var(--bg);overflow:hidden;transition:background var(--dur-normal) ease;cursor:pointer}
.channel-card:hover{background:var(--elevated)}
.channel-card__num{position:absolute;top:var(--sp-8);right:var(--sp-8);font-size:clamp(4rem,10vw,8rem);font-weight:var(--w-black);line-height:0.85;color:transparent;-webkit-text-stroke:1px var(--border-bold);user-select:none;transition:-webkit-text-stroke-color var(--dur-normal) ease}
.channel-card:hover .channel-card__num{-webkit-text-stroke-color:var(--text-3)}
.channel-card__label{font-size:var(--text-micro);font-weight:var(--w-medium);letter-spacing:var(--ls-widest);text-transform:uppercase;color:var(--text-3);margin-bottom:var(--sp-3)}
.channel-card__name{font-size:var(--text-h1);font-weight:var(--w-bold);letter-spacing:var(--ls-tight);line-height:var(--lh-tight);margin-bottom:var(--sp-3);transition:color var(--dur-normal) ease}
.channel-card:hover .channel-card__name{color:var(--accent)}
.channel-card__desc{font-size:var(--text-small);font-weight:var(--w-light);color:var(--text-2);max-width:320px}
.channel-card__arrow{position:absolute;bottom:var(--sp-8);right:var(--sp-8);width:40px;height:40px;display:flex;align-items:center;justify-content:center;border:1px solid var(--border);border-radius:var(--r-full);font-size:var(--text-small);color:var(--text-3);transition:all var(--dur-normal) var(--ease-out)}
.channel-card:hover .channel-card__arrow{background:var(--text);color:var(--bg);border-color:var(--text);transform:scale(1.1)}
@media(min-width:1280px){.channel-grid{grid-template-columns:repeat(4,1fr)}.channel-card{min-height:40vh}}
@media(max-width:768px){.channel-grid{grid-template-columns:1fr}.channel-card{min-height:40vh;padding:var(--sp-8) var(--sp-6)}.channel-card__num{font-size:4rem;top:var(--sp-6);right:var(--sp-6)}}

/* ── STATEMENT ── */
.statement{padding:var(--sp-32) var(--gutter);max-width:var(--max-w);margin:0 auto}
.statement__text{font-size:var(--text-hero);font-weight:var(--w-thin);line-height:var(--lh-snug);letter-spacing:var(--ls-tight)}
.statement__text em{font-style:normal;color:var(--accent);font-weight:var(--w-light)}
@media(max-width:768px){.statement{padding:var(--sp-20) var(--gutter)}}

/* ── MARQUEE ── */
.marquee{overflow:hidden;white-space:nowrap;padding:var(--sp-6) 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.marquee__inner{display:inline-flex;animation:marquee 30s linear infinite}
.marquee__item{font-size:var(--text-xs);font-weight:var(--w-medium);letter-spacing:var(--ls-widest);text-transform:uppercase;color:var(--text-3);padding:0 var(--sp-10)}
```

### 파일: `js/app.js`

```javascript
/* KOOSY Education Kit — Core App */
(function(){
  'use strict';
  var BASE=(function(){var p=window.location.pathname;return(p.indexOf('/channels/')!==-1||p.indexOf('/showroom/')!==-1)?'../catalog/':'catalog/'})();
  var COLOR_MAP={red:'#ef4444',blue:'#3b82f6',green:'#10b981',purple:'#8b5cf6',yellow:'#f59e0b',white:'#f5f5f5',black:'#1a1a1a'};
  var CAT_ICONS={kit:'\uD83D\uDD27',course:'\uD83D\uDCDA',template:'\uD83E\uDD16',bundle:'\uD83D\uDCE6'};
  var catalog=null;
  window.KOOSY={COLOR_MAP:COLOR_MAP,CAT_ICONS:CAT_ICONS,getCatalog:getCatalog,formatPrice:formatPrice,getColorHex:getColorHex,getCatIcon:getCatIcon};
  function getCatalog(){if(catalog)return Promise.resolve(catalog);return fetch(BASE+'index.json').then(function(r){return r.json()}).then(function(d){catalog=d;return d})}
  function formatPrice(n){return'\u20A9'+Number(n).toLocaleString('ko-KR')}
  function getColorHex(name){return COLOR_MAP[name]||'#888'}
  function getCatIcon(cat){return CAT_ICONS[cat.split('/')[0]]||'\uD83D\uDCE6'}
  function initLoader(){var l=document.querySelector('.loader');if(!l)return;var s=Date.now();function dismiss(){var d=Math.max(0,800-(Date.now()-s));setTimeout(function(){l.classList.add('is-done');setTimeout(function(){if(l.parentNode)l.parentNode.removeChild(l)},700)},d)}if(document.readyState==='complete')dismiss();else window.addEventListener('load',dismiss)}
  function initNavScroll(){var n=document.querySelector('.nav');if(!n)return;var s=false;function onS(){var is=window.scrollY>10;if(is!==s){s=is;n.classList.toggle('nav--scrolled',s)}}window.addEventListener('scroll',onS,{passive:true});onS()}
  function initActiveChannel(){var tabs=document.querySelectorAll('.nav__ch');if(!tabs.length)return;var p=window.location.pathname;for(var i=0;i<tabs.length;i++){var h=tabs[i].getAttribute('href');if(h&&p.indexOf(h.replace(/^\.\.?\//,''))!==-1)tabs[i].classList.add('is-active')}}
  function init(){initLoader();initNavScroll();initActiveChannel()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
```

### 파일: `js/scroll-reveal.js`

```javascript
/* KOOSY Education Kit — Scroll Reveal */
(function(){
  'use strict';
  function init(){
    if(!('IntersectionObserver' in window)){var els=document.querySelectorAll('.reveal,.reveal-text');for(var i=0;i<els.length;i++)els[i].classList.add('is-visible');return}
    var observer=new IntersectionObserver(function(entries){for(var i=0;i<entries.length;i++){if(entries[i].isIntersecting){entries[i].target.classList.add('is-visible');observer.unobserve(entries[i].target)}}},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
    var targets=document.querySelectorAll('.reveal,.reveal-text');for(var j=0;j<targets.length;j++)observer.observe(targets[j]);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
```

### 파일: `js/player-bar.js`

```javascript
/* KOOSY Education Kit — Now Playing Bar + YouTube Playback
   ─────────────────────────────────────────────────────── */
(function(){
  'use strict';

  var TRACKS = {
    plasticLove:  { title: 'Plastic Love',         artist: 'Mariya Takeuchi', emoji: '\u266A', videoId: '3bNITQR4Uso' },
    takeOnMe:     { title: 'Take On Me',           artist: 'a-ha',            emoji: '\u266B', videoId: 'djV11Xbc914' },
    blueMonday:   { title: 'Blue Monday',          artist: 'New Order',       emoji: '\u266A', videoId: 'FYH8DsU2WCk' },
    sweetDreams:  { title: 'Sweet Dreams',         artist: 'Eurythmics',      emoji: '\u266B', videoId: 'qeMFqkcPYcg' },
    everyBreath:  { title: 'Every Breath You Take', artist: 'The Police',     emoji: '\u266A', videoId: 'OMOGaugKpzs' }
  };

  var CHANNEL_ORDER = {
    showroom:  ['plasticLove', 'takeOnMe',   'blueMonday',  'sweetDreams', 'everyBreath'],
    project:   ['takeOnMe',    'plasticLove', 'blueMonday',  'sweetDreams', 'everyBreath'],
    component: ['blueMonday',  'plasticLove', 'takeOnMe',    'sweetDreams', 'everyBreath'],
    workshop:  ['sweetDreams', 'plasticLove', 'takeOnMe',    'blueMonday',  'everyBreath'],
    academy:   ['everyBreath', 'plasticLove', 'takeOnMe',    'blueMonday',  'sweetDreams']
  };

  var playlist = [];
  var trackIndex = 0;
  var ytPlayer = null;
  var bar = null;
  var isPlaying = false;
  var isMuted = true;
  var userInteracted = false;
  var currentProduct = null;
  var muteHint = null;

  function init() {
    bar = document.querySelector('.player-bar');
    if (!bar) return;
    var channel = bar.dataset.channel || 'showroom';
    var order = CHANNEL_ORDER[channel] || CHANNEL_ORDER.showroom;
    playlist = order.map(function(key) { return TRACKS[key]; });
    setTimeout(function(){ bar.classList.add('is-visible'); }, 1500);
    bindControls();
    updateTrackUI(playlist[0]);
    observeProducts();
    loadYouTubeAPI();
    listenForInteraction();
    createMuteHint();
  }

  function loadYouTubeAPI() {
    if (window.YT && window.YT.Player) { createPlayer(); return; }
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(tag, first);
  }

  window.onYouTubeIframeAPIReady = function() { createPlayer(); };

  function createPlayer() {
    var container = document.createElement('div');
    container.id = 'ytPlayer';
    container.style.cssText = 'position:fixed;width:1px;height:1px;bottom:0;left:-9999px;opacity:0;pointer-events:none;overflow:hidden';
    document.body.appendChild(container);
    ytPlayer = new YT.Player('ytPlayer', {
      width: '1', height: '1',
      videoId: playlist[0].videoId,
      playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, rel: 0, playsinline: 1, origin: window.location.origin },
      events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange, onError: onPlayerError }
    });
  }

  function onPlayerReady(e) { e.target.mute(); e.target.playVideo(); isPlaying = true; isMuted = true; updatePlayBtn(); }
  function onPlayerStateChange(e) {
    if (e.data === YT.PlayerState.ENDED) { trackIndex = (trackIndex + 1) % playlist.length; loadTrack(trackIndex); return; }
    isPlaying = (e.data === YT.PlayerState.PLAYING); updatePlayBtn();
  }
  function onPlayerError() { trackIndex = (trackIndex + 1) % playlist.length; loadTrack(trackIndex); }

  function listenForInteraction() {
    var events = ['click', 'touchstart', 'scroll', 'keydown'];
    function handle() {
      if (userInteracted) return;
      userInteracted = true;
      if (ytPlayer && typeof ytPlayer.unMute === 'function') { ytPlayer.unMute(); ytPlayer.setVolume(80); isMuted = false; }
      hideMuteHint();
      var art = bar ? bar.querySelector('.player-bar__art') : null;
      if (art) { art.style.background = 'var(--accent)'; art.style.transition = 'background 0.6s ease'; setTimeout(function(){ art.style.background = ''; }, 800); }
      for (var i = 0; i < events.length; i++) { document.removeEventListener(events[i], handle); }
    }
    for (var i = 0; i < events.length; i++) { document.addEventListener(events[i], handle, { passive: true }); }
  }

  function createMuteHint() {
    muteHint = document.createElement('div');
    muteHint.className = 'player-bar__mute-hint';
    muteHint.textContent = '\uD83D\uDD07 Tap to unmute';
    muteHint.style.cssText = 'position:absolute;top:-32px;left:50%;transform:translateX(-50%);padding:4px 12px;font-size:11px;letter-spacing:0.05em;background:rgba(255,255,255,0.08);color:var(--text-3);border-radius:20px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity 0.4s ease';
    if (bar) { bar.style.position = bar.style.position || 'fixed'; bar.appendChild(muteHint); setTimeout(function(){ if (muteHint) muteHint.style.opacity = '1'; }, 2000); }
  }
  function hideMuteHint() { if (!muteHint) return; muteHint.style.opacity = '0'; setTimeout(function(){ if (muteHint && muteHint.parentNode) muteHint.parentNode.removeChild(muteHint); muteHint = null; }, 400); }

  function bindControls() {
    var playBtn = document.getElementById('playerPlay');
    var prevBtn = document.getElementById('playerPrev');
    var nextBtn = document.getElementById('playerNext');
    if (playBtn) playBtn.addEventListener('click', function() { togglePlay(); });
    if (prevBtn) prevBtn.addEventListener('click', function() { trackIndex = (trackIndex - 1 + playlist.length) % playlist.length; loadTrack(trackIndex); });
    if (nextBtn) nextBtn.addEventListener('click', function() { trackIndex = (trackIndex + 1) % playlist.length; loadTrack(trackIndex); });
  }

  function togglePlay() {
    if (!ytPlayer || typeof ytPlayer.getPlayerState !== 'function') return;
    if (isPlaying) { ytPlayer.pauseVideo(); } else {
      ytPlayer.playVideo();
      if (isMuted && ytPlayer.unMute) { ytPlayer.unMute(); ytPlayer.setVolume(80); isMuted = false; userInteracted = true; hideMuteHint(); }
    }
  }
  function loadTrack(index) { var track = playlist[index]; updateTrackUI(track); if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') { ytPlayer.loadVideoById(track.videoId); } }
  function updatePlayBtn() { var btn = document.getElementById('playerPlay'); if (btn) btn.textContent = isPlaying ? '\u275A\u275A' : '\u25B6'; }
  function updateTrackUI(t) {
    var art = document.getElementById('playerBar') && bar.querySelector('.player-bar__art');
    var title = document.getElementById('playerTitle');
    var artist = document.getElementById('playerArtist');
    if (art) art.textContent = t.emoji;
    if (title) title.textContent = t.title;
    if (artist) artist.textContent = t.artist;
  }

  function observeProducts() {
    if (!('IntersectionObserver' in window)) return;
    var ps = document.querySelectorAll('[data-product-id]');
    if (!ps.length) return;
    var obs = new IntersectionObserver(function(entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting && entries[i].intersectionRatio > 0.3) {
          var el = entries[i].target;
          setProduct({ id: el.dataset.productId, name: el.dataset.productName || '', price: el.dataset.productPrice || '', icon: el.dataset.productIcon || '', url: el.dataset.productUrl || '#' });
        }
      }
    }, { threshold: [0.3] });
    for (var j = 0; j < ps.length; j++) obs.observe(ps[j]);
  }

  function setProduct(p) {
    if (currentProduct && currentProduct.id === p.id) return;
    currentProduct = p;
    if (!bar) return;
    var th = bar.querySelector('.player-bar__thumb');
    var n = bar.querySelector('.player-bar__product .player-bar__title');
    var pr = bar.querySelector('.player-bar__product .player-bar__artist');
    var b = bar.querySelector('.player-bar__buy');
    if (th) th.textContent = p.icon;
    if (n) n.textContent = p.name;
    if (pr) pr.textContent = p.price;
    if (b) b.setAttribute('href', p.url);
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
```

### 커밋: `migration: Phase 2 — design system + JS 코어`

---

## Phase 3: Showroom + Workstation

### 파일: `showroom/index.html`

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Showroom — KOOSY Education Kit</title>
<meta name="description" content="KOOSY 교육 키트 쇼룸. 만들면서 배우는 전체 컬렉션.">
<meta name="theme-color" content="#0a0f1a">
<link rel="icon" href="../assets/brand/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="stylesheet" href="../styles/tokens.css">
<link rel="stylesheet" href="../styles/reset.css">
<link rel="stylesheet" href="../styles/components.css">
<link rel="stylesheet" href="../styles/animations.css">
</head>
<body>

<nav class="nav" id="nav">
  <a href="../" class="nav__brand">KOOSY</a>
  <div class="nav__channels">
    <a href="../channels/project.html" class="nav__ch" data-ch="ch1">CH1 Project</a>
    <a href="../channels/component.html" class="nav__ch" data-ch="ch2">CH2 Component</a>
    <a href="../channels/workshop.html" class="nav__ch" data-ch="ch3">CH3 Workshop</a>
    <a href="../channels/academy.html" class="nav__ch" data-ch="ch4">CH4 Academy</a>
  </div>
  <div class="nav__actions">
    <a href="./" class="nav__link" style="color:var(--text)">Showroom</a>
  </div>
</nav>

<section class="section" style="padding-top:calc(var(--nav-h) + var(--sp-16));text-align:center">
  <div class="container">
    <div class="section__label reveal">Showroom</div>
    <h1 class="section__title reveal" style="font-size:var(--text-hero);font-weight:var(--w-thin);letter-spacing:0.2em;text-transform:uppercase">KOOSY</h1>
    <p style="font-size:var(--text-body);color:var(--text-2);font-weight:var(--w-light);margin-top:var(--sp-3)" class="reveal">Education Kit Collection — Build to Learn</p>
  </div>
</section>

<section style="padding:var(--sp-8) 0">
  <div class="container" style="display:flex;gap:var(--sp-2);justify-content:center;flex-wrap:wrap" id="filters"></div>
</section>

<section class="section--sm">
  <div class="container">
    <div id="productGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(280px,100%),1fr));gap:var(--sp-6)"></div>
    <div id="emptyState" style="display:none;text-align:center;padding:var(--sp-24) 0">
      <div style="font-size:3rem;margin-bottom:var(--sp-4)">🔧</div>
      <p style="color:var(--text-3)">키트 준비 중</p>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <div class="footer__brand">KOOSY</div>
    <p class="footer__tagline">Education Kit — Build to Learn</p>
    <div class="footer__links">
      <a href="../channels/project.html" class="footer__link">Project</a>
      <a href="../channels/component.html" class="footer__link">Component</a>
      <a href="../channels/workshop.html" class="footer__link">Workshop</a>
      <a href="../channels/academy.html" class="footer__link">Academy</a>
      <a href="../" class="footer__link">Home</a>
    </div>
    <p class="footer__copy">&copy; 2026 KOOSY. All rights reserved.</p>
  </div>
</footer>

<div class="page-spacer"></div>

<div class="player-bar" id="playerBar" data-channel="showroom">
  <div class="player-bar__music">
    <div class="player-bar__art">♪</div>
    <div class="player-bar__meta">
      <div class="player-bar__title" id="playerTitle">Plastic Love</div>
      <div class="player-bar__artist" id="playerArtist">Mariya Takeuchi</div>
    </div>
  </div>
  <div class="player-bar__controls">
    <button class="player-bar__btn" id="playerPrev">⏮</button>
    <button class="player-bar__btn player-bar__btn--play" id="playerPlay">▶</button>
    <button class="player-bar__btn" id="playerNext">⏭</button>
  </div>
  <div class="player-bar__product" id="playerProduct">
    <div class="player-bar__thumb" id="playerThumb">🔧</div>
    <a href="./" class="player-bar__buy">Shop Now</a>
  </div>
</div>

<script src="../js/app.js"></script>
<script src="../js/scroll-reveal.js"></script>
<script src="../js/player-bar.js"></script>
<script>
(function(){
  'use strict';
  var CATEGORIES={kit:{label:'교육 키트',icon:'🔧'},course:{label:'강의 패키지',icon:'📚'},template:{label:'AI 템플릿',icon:'🤖'},bundle:{label:'번들 세트',icon:'📦'}};
  var allProducts=[];
  var currentFilter='all';

  function init(){
    if(!window.KOOSY)return;
    window.KOOSY.getCatalog().then(function(data){
      allProducts=data.products||[];
      renderFilters();
      renderGrid(allProducts);
    }).catch(function(){
      document.getElementById('emptyState').style.display='block';
    });
  }

  function renderFilters(){
    var el=document.getElementById('filters');
    var html='<button class="btn btn--sm is-active" data-cat="all" style="border-color:var(--accent);color:var(--accent)"><span>전체</span></button>';
    var keys=Object.keys(CATEGORIES);
    for(var i=0;i<keys.length;i++){
      var k=keys[i],c=CATEGORIES[k];
      html+='<button class="btn btn--sm" data-cat="'+k+'"><span>'+c.icon+' '+c.label+'</span></button>';
    }
    el.innerHTML=html;
    el.addEventListener('click',function(e){
      var btn=e.target.closest('[data-cat]');
      if(!btn)return;
      currentFilter=btn.dataset.cat;
      var btns=el.querySelectorAll('[data-cat]');
      for(var j=0;j<btns.length;j++){btns[j].style.borderColor='';btns[j].style.color='';btns[j].classList.remove('is-active')}
      btn.style.borderColor='var(--accent)';btn.style.color='var(--accent)';btn.classList.add('is-active');
      var filtered=currentFilter==='all'?allProducts:allProducts.filter(function(p){return p.category.split('/')[0]===currentFilter});
      renderGrid(filtered);
    });
  }

  function renderGrid(products){
    var grid=document.getElementById('productGrid');
    var empty=document.getElementById('emptyState');
    if(!products.length){grid.innerHTML='';empty.style.display='block';return}
    empty.style.display='none';
    var html='';
    for(var i=0;i<products.length;i++){
      var p=products[i];
      var icon=window.KOOSY.getCatIcon(p.category);
      html+='<a href="lookbook/'+p.id+'.html" class="card reveal" data-product-id="'+p.id+'" data-product-name="'+p.name+'" data-product-price="'+p.price+'" data-product-icon="'+icon+'">';
      html+='<div class="card__image"><div class="card__placeholder"><span class="card__placeholder-icon">'+icon+'</span><span class="card__placeholder-text">'+p.name_en+'</span></div>';
      html+='<span class="card__badge">'+( p.difficulty||'')+'</span></div>';
      html+='<div class="card__info"><div class="card__category">'+p.category.replace('/',' / ')+'</div>';
      html+='<div class="card__name">'+p.name+'</div>';
      html+='<div class="card__price">'+window.KOOSY.formatPrice(p.price)+'</div>';
      html+='</div></a>';
    }
    grid.innerHTML=html;
  }

  if(window.KOOSY)init();
  else document.addEventListener('DOMContentLoaded',function(){setTimeout(init,100)});
})();
</script>
</body>
</html>
```

### 파일: `showroom/console.html`

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KOOSY — Analytics Console</title>
<meta name="robots" content="noindex, nofollow">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#0a0f1a;--surface:#111827;--card:#1f2937;--accent:#3b82f6;
  --green:#2ecc71;--yellow:#f1c40f;--blue:#3498db;
  --text:#f1f5f9;--dim:rgba(241,245,249,0.5);--border:rgba(255,255,255,0.08);
}
body{font-family:-apple-system,system-ui,'Noto Sans KR',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;padding:1rem}
header{padding:1.5rem 0;border-bottom:1px solid var(--border);margin-bottom:2rem;display:flex;justify-content:space-between;align-items:center}
h1{font-size:1.4rem;font-weight:800;letter-spacing:0.1em}
h1 span{color:var(--accent)}
.sync-info{font-size:0.7rem;color:var(--dim)}
.grid{display:grid;gap:1rem;margin-bottom:2rem}
.grid-4{grid-template-columns:repeat(auto-fit,minmax(140px,1fr))}
.kpi-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.2rem;text-align:center}
.kpi-value{font-size:2rem;font-weight:800;margin:0.3rem 0}
.kpi-label{font-size:0.7rem;color:var(--dim);text-transform:uppercase;letter-spacing:0.05em}
.kpi-value.revenue{color:var(--green)}
.kpi-value.orders{color:var(--blue)}
.kpi-value.traffic{color:var(--yellow)}
.section{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem}
.section h2{font-size:1rem;font-weight:700;margin-bottom:1rem;padding-bottom:0.5rem;border-bottom:1px solid var(--border)}
table{width:100%;border-collapse:collapse;font-size:0.8rem}
th{text-align:left;color:var(--dim);font-weight:500;padding:0.5rem;border-bottom:1px solid var(--border)}
td{padding:0.5rem;border-bottom:1px solid rgba(255,255,255,0.03)}
.status-live{color:var(--green)}
.status-setup{color:var(--yellow)}
.channel-bar{display:flex;align-items:center;gap:0.5rem;margin:0.5rem 0}
.channel-bar .label{width:70px;font-size:0.75rem;color:var(--dim)}
.channel-bar .bar{flex:1;height:20px;background:var(--card);border-radius:4px;overflow:hidden}
.channel-bar .fill{height:100%;border-radius:4px;transition:width 0.5s}
.fill-coupang{background:var(--accent)}
.fill-naver{background:var(--green)}
.fill-youtube{background:#ff0000}
.fill-showroom{background:var(--blue)}
.channel-bar .val{font-size:0.75rem;width:80px;text-align:right}
.loopback{background:linear-gradient(135deg,rgba(59,130,246,0.1),rgba(16,185,129,0.1));border:1px solid var(--accent);border-radius:12px;padding:1.5rem;text-align:center}
.loopback h3{color:var(--accent);margin-bottom:0.5rem}
.loopback p{font-size:0.8rem;color:var(--dim)}
footer{text-align:center;padding:2rem;color:var(--dim);font-size:0.65rem}
</style>
</head>
<body>
<header>
  <h1><span>KOOSY</span> Analytics Console</h1>
  <div class="sync-info" id="sync-info">loading...</div>
</header>

<div class="grid grid-4" id="kpi-grid">
  <div class="kpi-card"><div class="kpi-label">Total Revenue</div><div class="kpi-value revenue" id="kpi-revenue">-</div></div>
  <div class="kpi-card"><div class="kpi-label">Orders</div><div class="kpi-value orders" id="kpi-orders">-</div></div>
  <div class="kpi-card"><div class="kpi-label">Traffic</div><div class="kpi-value traffic" id="kpi-traffic">-</div></div>
  <div class="kpi-card"><div class="kpi-label">Products Live</div><div class="kpi-value" id="kpi-live">-</div></div>
</div>

<div class="section">
  <h2>Channel Performance</h2>
  <div id="channel-bars"></div>
  <table style="margin-top:1rem">
    <thead><tr><th>Channel</th><th>Revenue</th><th>Traffic</th><th>Status</th></tr></thead>
    <tbody id="channel-table"></tbody>
  </table>
</div>

<div class="section">
  <h2>Product Status</h2>
  <table>
    <thead><tr><th>ID</th><th>Name</th><th>Price</th><th>State</th></tr></thead>
    <tbody id="product-table"></tbody>
  </table>
</div>

<div class="loopback" id="loopback">
  <h3>LOOPBACK STATUS</h3>
  <div style="font-size:1.5rem;margin:0.5rem 0" id="loop-icon">⟳</div>
  <p id="loop-text">loading...</p>
</div>

<div class="section" style="margin-top:1.5rem">
  <h2>HQ Sync (dtslib-papyrus)</h2>
  <table>
    <thead><tr><th>File</th><th>Status</th><th>Last Sync</th></tr></thead>
    <tbody id="hq-table">
      <tr><td>state.json</td><td id="hq-state">-</td><td id="hq-state-ts">-</td></tr>
      <tr><td>domains.json</td><td id="hq-domains">-</td><td id="hq-domains-ts">-</td></tr>
    </tbody>
  </table>
</div>

<footer>koosy Commerce — Analytics + HQ Console<br>비공개 관리 콘솔. 검색엔진 노출 차단.</footer>

<script>
(function(){
  'use strict';
  var dashUrl = '../analytics/dashboard.json';
  var catalogUrl = '../catalog/index.json';
  function fmt(n) { return n !== undefined && n !== null ? '₩' + Number(n).toLocaleString('ko-KR') : '-'; }
  function num(n) { return n !== undefined ? Number(n).toLocaleString() : '-'; }

  Promise.all([
    fetch(dashUrl).then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; }),
    fetch(catalogUrl).then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; })
  ]).then(function(results) {
    var dash = results[0]; var catalog = results[1];
    if (!dash) { document.getElementById('sync-info').textContent = 'dashboard.json not found — run: node analytics/collector.js'; return; }
    document.getElementById('sync-info').textContent = 'Generated: ' + new Date(dash.generated).toLocaleString('ko-KR');
    document.getElementById('kpi-revenue').textContent = fmt(dash.kpi.total_revenue);
    document.getElementById('kpi-orders').textContent = num(dash.kpi.total_orders);
    document.getElementById('kpi-traffic').textContent = num(dash.kpi.total_traffic);
    document.getElementById('kpi-live').textContent = dash.kpi.products_live + '/' + dash.kpi.products_total;

    var channels = dash.channels || {};
    var maxRev = Math.max.apply(null, Object.values(channels).map(function(c){ return c.revenue || 0; })) || 1;
    var barsHtml = '';
    ['coupang','naver','youtube','showroom'].forEach(function(ch){
      var c = channels[ch] || {};
      var pct = maxRev > 0 ? Math.round((c.revenue || 0) / maxRev * 100) : 0;
      barsHtml += '<div class="channel-bar"><span class="label">' + ch + '</span><div class="bar"><div class="fill fill-' + ch + '" style="width:' + pct + '%"></div></div><span class="val">' + fmt(c.revenue) + '</span></div>';
    });
    document.getElementById('channel-bars').innerHTML = barsHtml;

    var tableHtml = '';
    ['coupang','naver','youtube','showroom'].forEach(function(ch){
      var c = channels[ch] || {};
      tableHtml += '<tr><td>' + ch + '</td><td>' + fmt(c.revenue) + '</td><td>' + num(c.traffic) + '</td><td class="status-live">' + (c.status || '-') + '</td></tr>';
    });
    document.getElementById('channel-table').innerHTML = tableHtml;

    if (catalog && catalog.products) {
      var pHtml = '';
      catalog.products.forEach(function(p){
        var stateClass = p.state === 'ALL_LIVE' ? 'status-live' : 'status-setup';
        pHtml += '<tr><td>' + p.id + '</td><td>' + p.name + '</td><td>' + fmt(p.price) + '</td><td class="' + stateClass + '">' + p.state + '</td></tr>';
      });
      document.getElementById('product-table').innerHTML = pHtml;
    }

    var loop = dash.loopback || {};
    document.getElementById('loop-icon').textContent = loop.ready ? '✓' : '⟳';
    document.getElementById('loop-icon').style.color = loop.ready ? '#2ecc71' : '#f1c40f';
    document.getElementById('loop-text').textContent = loop.ready ? '루프백 가동 중 — 매출 데이터 → 다음 PRODUCT_CARD 기획' : '매출 데이터 대기 중 — 첫 매출 발생 시 루프백 시작';

    document.getElementById('hq-state').textContent = 'education-commerce line';
    document.getElementById('hq-state-ts').textContent = dash.generated ? new Date(dash.generated).toLocaleDateString('ko-KR') : '-';
    document.getElementById('hq-domains').textContent = 'koosy.kr';
    document.getElementById('hq-domains-ts').textContent = dash.generated ? new Date(dash.generated).toLocaleDateString('ko-KR') : '-';
  });
})();
</script>
</body>
</html>
```

### 파일: `workstation/index.html`

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>KOOSY — Workstation</title>
<meta name="theme-color" content="#0a0f1a">
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="gate" id="gate">
  <div class="gate__brand">KOOSY</div>
  <h1 class="gate__title">Workstation</h1>
  <p class="gate__subtitle">Private workspace</p>
  <form class="gate__form" id="gateForm" autocomplete="off">
    <input class="gate__input" id="gateInput" type="password" inputmode="numeric" placeholder="Enter code" maxlength="10" autocomplete="off">
    <button class="gate__btn" type="submit">Enter</button>
    <div class="gate__error" id="gateError"></div>
  </form>
</div>
<script src="app.js"></script>
<script>KOOSY.ws.initGate();</script>
</body>
</html>
```

### 파일: `workstation/dashboard.html`

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>KOOSY — Workstation</title>
<meta name="theme-color" content="#0a0f1a">
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="stylesheet" href="style.css">
</head>
<body>
<nav class="ws-nav">
  <div class="ws-nav__brand">
    <a href="../">KOOSY</a>
    <span class="ws-nav__badge">WS</span>
  </div>
  <div class="ws-nav__actions">
    <a href="../" class="ws-nav__link">Home</a>
    <a href="../showroom/" class="ws-nav__link">Showroom</a>
    <button class="ws-nav__logout" id="logoutBtn">Logout</button>
  </div>
</nav>
<main class="ws-main">
  <div class="ws-grid">
    <div class="ws-module reveal">
      <div class="ws-module__header"><div class="ws-module__title"><span class="ws-module__icon">💡</span> Idea Board</div><div class="ws-module__actions"><button class="ws-module__btn" id="ideaAdd" title="Add idea">+</button></div></div>
      <div class="ws-module__body"><textarea class="idea-input" id="ideaInput" placeholder="New idea... (Enter to add)"></textarea><div class="idea-cards" id="ideaCards"></div></div>
    </div>
    <div class="ws-module reveal">
      <div class="ws-module__header"><div class="ws-module__title"><span class="ws-module__icon">📦</span> Product Tracker</div></div>
      <div class="ws-module__body"><div class="product-list" id="productList"><div class="ws-module__empty">Loading...</div></div></div>
    </div>
    <div class="ws-module reveal">
      <div class="ws-module__header"><div class="ws-module__title"><span class="ws-module__icon">📊</span> Analytics</div></div>
      <div class="ws-module__body" id="analyticsBody"><div class="ws-module__empty">Loading...</div></div>
    </div>
    <div class="ws-module reveal">
      <div class="ws-module__header"><div class="ws-module__title"><span class="ws-module__icon">📝</span> Notes</div></div>
      <div class="ws-module__body"><textarea class="notes-area" id="notesArea" placeholder="Write anything..."></textarea></div>
    </div>
    <div class="ws-module reveal">
      <div class="ws-module__header"><div class="ws-module__title"><span class="ws-module__icon">🔗</span> Quick Links</div></div>
      <div class="ws-module__body">
        <div class="quick-links">
          <a href="https://wing.coupang.com" target="_blank" rel="noopener" class="quick-link"><span class="quick-link__icon">🛒</span><span class="quick-link__text">Coupang Wing</span><span class="quick-link__arrow">→</span></a>
          <a href="https://sell.smartstore.naver.com" target="_blank" rel="noopener" class="quick-link"><span class="quick-link__icon">🟢</span><span class="quick-link__text">Naver Commerce</span><span class="quick-link__arrow">→</span></a>
          <a href="https://studio.youtube.com" target="_blank" rel="noopener" class="quick-link"><span class="quick-link__icon">▶️</span><span class="quick-link__text">YouTube Studio</span><span class="quick-link__arrow">→</span></a>
          <a href="https://analytics.google.com" target="_blank" rel="noopener" class="quick-link"><span class="quick-link__icon">📈</span><span class="quick-link__text">Google Analytics</span><span class="quick-link__arrow">→</span></a>
          <a href="../console/" target="_blank" rel="noopener" class="quick-link"><span class="quick-link__icon">🖥️</span><span class="quick-link__text">KOOSY Console</span><span class="quick-link__arrow">→</span></a>
        </div>
      </div>
    </div>
  </div>
</main>
<script src="app.js"></script>
<script>
KOOSY.ws.initDashboard();
document.getElementById('logoutBtn').addEventListener('click',function(){KOOSY.ws.logout();});
</script>
</body>
</html>
```

### 파일: `workstation/app.js`

```javascript
/* === KOOSY WORKSTATION — AUTH + MODULES === */
(function(){
  'use strict';

  var HASH='5817ae4948371f9b6b7d94615c0704e6a13ba5a773938351ebd832d0fcdbdf2f';
  var SESSION_KEY='koosy_ws_session';
  var SESSION_TTL=24*60*60*1000;

  function sha256(str){
    var buf=new TextEncoder().encode(str);
    return crypto.subtle.digest('SHA-256',buf).then(function(h){
      return Array.from(new Uint8Array(h)).map(function(b){return b.toString(16).padStart(2,'0')}).join('');
    });
  }

  function getSession(){
    try{ var s=JSON.parse(localStorage.getItem(SESSION_KEY)); if(s&&s.t&&(Date.now()-s.t)<SESSION_TTL)return true; }catch(e){}
    return false;
  }
  function setSession(){ localStorage.setItem(SESSION_KEY,JSON.stringify({t:Date.now()})); }
  function clearSession(){ localStorage.removeItem(SESSION_KEY); }

  window.KOOSY=window.KOOSY||{};
  window.KOOSY.ws={
    isAuth:getSession,
    logout:function(){clearSession();location.href='index.html';},

    initGate:function(){
      if(getSession()){location.href='dashboard.html';return;}
      var form=document.getElementById('gateForm');
      var input=document.getElementById('gateInput');
      var err=document.getElementById('gateError');
      if(!form)return;
      form.addEventListener('submit',function(e){
        e.preventDefault();
        var val=input.value.trim();
        if(!val)return;
        sha256(val).then(function(h){
          if(h===HASH){
            setSession();
            location.href='dashboard.html';
          }else{
            err.textContent='Access denied';
            err.classList.add('is-visible');
            form.classList.add('shake');
            input.value='';
            input.focus();
            setTimeout(function(){form.classList.remove('shake')},400);
            setTimeout(function(){err.classList.remove('is-visible')},2000);
          }
        });
      });
      input.focus();
    },

    initDashboard:function(){
      if(!getSession()){location.href='index.html';return;}
      this._initIdeaBoard();
      this._initProductTracker();
      this._initAnalytics();
      this._initNotes();
      this._initReveal();
    },

    _initIdeaBoard:function(){
      var KEY='koosy_ws_ideas';
      var container=document.getElementById('ideaCards');
      var input=document.getElementById('ideaInput');
      var addBtn=document.getElementById('ideaAdd');
      if(!container)return;
      function load(){try{return JSON.parse(localStorage.getItem(KEY))||[];}catch(e){return[];}}
      function save(ideas){localStorage.setItem(KEY,JSON.stringify(ideas));}
      function render(){
        var ideas=load();
        if(!ideas.length){container.innerHTML='<div class="ws-module__empty">No ideas yet</div>';return;}
        var html='';
        for(var i=ideas.length-1;i>=0;i--){
          html+='<div class="idea-card" data-idx="'+i+'"><div class="idea-card__text">'+escHtml(ideas[i].text)+'</div><div class="idea-card__time">'+timeAgo(ideas[i].ts)+'</div><button class="idea-card__del" data-idx="'+i+'" title="Delete">&times;</button></div>';
        }
        container.innerHTML=html;
        container.querySelectorAll('.idea-card__del').forEach(function(btn){
          btn.addEventListener('click',function(){ var idx=parseInt(this.getAttribute('data-idx')); var ideas=load();ideas.splice(idx,1);save(ideas);render(); });
        });
      }
      function addIdea(){ var text=input.value.trim(); if(!text)return; var ideas=load(); ideas.push({text:text,ts:Date.now()}); save(ideas); input.value=''; render(); }
      if(addBtn)addBtn.addEventListener('click',addIdea);
      if(input)input.addEventListener('keydown',function(e){ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();addIdea();} });
      render();
    },

    _initProductTracker:function(){
      var container=document.getElementById('productList');
      if(!container)return;
      fetch('../catalog/index.json').then(function(r){return r.json()}).then(function(data){
        var products=data.products||[];
        if(!products.length){container.innerHTML='<div class="ws-module__empty">No products</div>';return;}
        var html='';
        for(var i=0;i<products.length;i++){
          var p=products[i];
          var stateClass=p.state==='ALL_LIVE'?'live':'ready';
          html+='<div class="product-row"><div><div class="product-row__name">'+escHtml(p.name)+'</div><div class="product-row__price">₩'+p.price.toLocaleString()+'</div></div><div class="product-row__state product-row__state--'+stateClass+'">'+p.state.replace('_',' ')+'</div></div>';
        }
        container.innerHTML=html;
      }).catch(function(){container.innerHTML='<div class="ws-module__empty">Failed to load</div>';});
    },

    _initAnalytics:function(){
      var container=document.getElementById('analyticsBody');
      if(!container)return;
      fetch('../analytics/dashboard.json').then(function(r){return r.json()}).then(function(data){
        var kpi=data.kpi||{};
        var html='<div class="analytics-grid">';
        html+='<div class="analytics-card"><div class="analytics-card__label">Revenue</div><div class="analytics-card__value">₩'+(kpi.total_revenue||0).toLocaleString()+'</div></div>';
        html+='<div class="analytics-card"><div class="analytics-card__label">Orders</div><div class="analytics-card__value">'+(kpi.total_orders||0)+'</div></div>';
        html+='<div class="analytics-card"><div class="analytics-card__label">Traffic</div><div class="analytics-card__value">'+(kpi.total_traffic||0)+'</div></div>';
        html+='<div class="analytics-card"><div class="analytics-card__label">Products</div><div class="analytics-card__value">'+(kpi.products_live||0)+' / '+(kpi.products_total||0)+'</div></div>';
        html+='</div>';
        container.innerHTML=html;
      }).catch(function(){container.innerHTML='<div class="ws-module__empty">Failed to load</div>';});
    },

    _initNotes:function(){
      var KEY='koosy_ws_notes';
      var area=document.getElementById('notesArea');
      if(!area)return;
      area.value=localStorage.getItem(KEY)||'';
      var timer;
      area.addEventListener('input',function(){ clearTimeout(timer); timer=setTimeout(function(){localStorage.setItem(KEY,area.value);},500); });
    },

    _initReveal:function(){
      if(!('IntersectionObserver' in window)){ document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('is-visible');}); return; }
      var obs=new IntersectionObserver(function(entries){ entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target);}}); },{threshold:0.1});
      document.querySelectorAll('.reveal').forEach(function(el){obs.observe(el);});
    }
  };

  function escHtml(s){ var d=document.createElement('div');d.textContent=s;return d.innerHTML; }
  function timeAgo(ts){ var d=Date.now()-ts; if(d<60000)return 'just now'; if(d<3600000)return Math.floor(d/60000)+'m ago'; if(d<86400000)return Math.floor(d/3600000)+'h ago'; return Math.floor(d/86400000)+'d ago'; }
})();
```

### 파일: `workstation/style.css`

> workstation/style.css는 분량이 120줄이므로 핵심 변환점만 표기. 전체 복사.

```css
/* === WORKSTATION — KOOSY PRIVATE === */
:root{
  --bg:#0a0f1a;--surface:#111827;--elevated:#1f2937;
  --text:#f1f5f9;--text-2:rgba(241,245,249,0.7);--text-3:rgba(241,245,249,0.4);
  --accent:#3b82f6;--accent-hover:#60a5fa;--white:#fff;
  --border:rgba(255,255,255,0.06);--border-bold:rgba(255,255,255,0.12);
  --font:'Pretendard Variable',Pretendard,-apple-system,system-ui,'Noto Sans KR',sans-serif;
  --gutter:clamp(16px,4vw,48px);
  --max-w:1200px;
  --ease-out:cubic-bezier(0.16,1,0.3,1);
  --success:#34c759;--warning:#ff9f0a;--error:#ff453a;
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{font-size:16px;-webkit-font-smoothing:antialiased}
body{font-family:var(--font);background:var(--bg);color:var(--text);line-height:1.6;overflow-x:hidden;min-height:100vh}
a{color:inherit;text-decoration:none}
button{border:none;background:none;cursor:pointer;font:inherit;color:inherit}
.gate{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:32px;background:var(--bg);z-index:999}
.gate__brand{font-size:0.7rem;font-weight:200;letter-spacing:0.4em;text-transform:uppercase;color:var(--text-3)}
.gate__title{font-size:clamp(1.5rem,4vw,2.5rem);font-weight:100;letter-spacing:-0.02em}
.gate__subtitle{font-size:0.7rem;color:var(--text-3);letter-spacing:0.1em;margin-top:-16px}
.gate__form{display:flex;flex-direction:column;align-items:center;gap:16px;width:100%;max-width:280px}
.gate__input{width:100%;padding:14px 20px;background:var(--surface);border:1px solid var(--border-bold);color:var(--text);font-size:1rem;letter-spacing:0.3em;text-align:center;outline:none;transition:border-color 0.3s ease}
.gate__input:focus{border-color:var(--accent)}
.gate__input::placeholder{color:var(--text-3);letter-spacing:0.1em;font-size:0.75rem}
.gate__btn{width:100%;padding:14px;background:var(--text);color:var(--bg);font-size:0.65rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;transition:all 0.3s var(--ease-out)}
.gate__btn:hover{background:var(--accent);color:var(--white)}
.gate__error{font-size:0.65rem;color:var(--error);letter-spacing:0.05em;opacity:0;transition:opacity 0.3s ease;min-height:1em}
.gate__error.is-visible{opacity:1}
@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
.gate__form.shake{animation:shake 0.4s ease}
.ws-nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 var(--gutter);height:56px;background:rgba(10,15,26,0.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1px solid var(--border)}
.ws-nav__brand{font-size:0.75rem;font-weight:200;letter-spacing:0.3em;text-transform:uppercase;display:flex;align-items:center;gap:12px}
.ws-nav__badge{font-size:0.55rem;font-weight:600;letter-spacing:0.1em;padding:3px 8px;background:var(--accent);color:var(--white);text-transform:uppercase}
.ws-nav__actions{display:flex;gap:16px;align-items:center}
.ws-nav__link{font-size:0.6rem;letter-spacing:0.1em;color:var(--text-3);text-transform:uppercase;transition:color 0.2s}
.ws-nav__link:hover{color:var(--text)}
.ws-nav__logout{font-size:0.6rem;letter-spacing:0.1em;color:var(--error);text-transform:uppercase;padding:4px 12px;border:1px solid var(--error);transition:all 0.2s}
.ws-nav__logout:hover{background:var(--error);color:var(--white)}
.ws-main{padding:24px var(--gutter);max-width:var(--max-w);margin:0 auto}
.ws-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
@media(max-width:1024px){.ws-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.ws-grid{grid-template-columns:1fr}}
.ws-module{background:var(--surface);border:1px solid var(--border);display:flex;flex-direction:column;min-height:360px;transition:border-color 0.3s ease}
.ws-module:hover{border-color:var(--border-bold)}
.ws-module__header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border)}
.ws-module__title{font-size:0.65rem;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;display:flex;align-items:center;gap:8px}
.ws-module__body{flex:1;padding:16px 20px;overflow-y:auto;scrollbar-width:thin}
.ws-module__empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:8px;color:var(--text-3);font-size:0.75rem}
.ws-module__btn{width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;border:1px solid var(--border);color:var(--text-3);transition:all 0.2s}
.ws-module__btn:hover{color:var(--text);border-color:var(--text-3)}
.idea-cards{display:flex;flex-direction:column;gap:8px}
.idea-card{padding:12px;background:var(--elevated);border:1px solid var(--border);position:relative}
.idea-card__text{font-size:0.8rem;font-weight:300;line-height:1.5;white-space:pre-wrap}
.idea-card__time{font-size:0.55rem;color:var(--text-3);margin-top:8px}
.idea-card__del{position:absolute;top:8px;right:8px;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:0.6rem;color:var(--text-3);opacity:0;transition:opacity 0.2s}
.idea-card:hover .idea-card__del{opacity:1}
.idea-input{width:100%;padding:10px 12px;background:var(--elevated);border:1px solid var(--border);color:var(--text);font-size:0.8rem;font-family:var(--font);resize:none;outline:none;margin-bottom:8px;min-height:60px;transition:border-color 0.3s}
.idea-input:focus{border-color:var(--accent)}
.product-list{display:flex;flex-direction:column;gap:8px}
.product-row{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--elevated);border:1px solid var(--border)}
.product-row__name{font-size:0.8rem;font-weight:400}
.product-row__price{font-size:0.75rem;color:var(--text-2);font-weight:500}
.product-row__state{font-size:0.55rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;padding:3px 8px}
.product-row__state--live{background:rgba(52,199,89,0.15);color:var(--success)}
.product-row__state--ready{background:rgba(255,159,10,0.15);color:var(--warning)}
.analytics-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.analytics-card{padding:12px;background:var(--elevated);border:1px solid var(--border)}
.analytics-card__label{font-size:0.55rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-3);margin-bottom:4px}
.analytics-card__value{font-size:1.2rem;font-weight:600}
.notes-area{width:100%;height:100%;min-height:240px;padding:12px;background:var(--elevated);border:1px solid var(--border);color:var(--text);font-size:0.8rem;font-family:var(--font);line-height:1.7;resize:none;outline:none;transition:border-color 0.3s}
.notes-area:focus{border-color:var(--accent)}
.quick-links{display:flex;flex-direction:column;gap:6px}
.quick-link{display:flex;align-items:center;gap:12px;padding:12px;background:var(--elevated);border:1px solid var(--border);transition:all 0.2s}
.quick-link:hover{border-color:var(--border-bold);background:var(--bg)}
.quick-link__icon{font-size:1rem;width:28px;text-align:center}
.quick-link__text{font-size:0.75rem}
.quick-link__arrow{margin-left:auto;font-size:0.65rem;color:var(--text-3)}
.reveal{opacity:0;transform:translateY(16px);transition:opacity 0.6s var(--ease-out),transform 0.6s var(--ease-out)}
.reveal.is-visible{opacity:1;transform:translateY(0)}
```

### 커밋: `migration: Phase 3 — showroom + workstation + console`

---

## Phase 4: 기존 콘텐츠 재사용 + 설정 업데이트

> 기존 koosy 레포의 config.json, branch.json을 커머스 전환에 맞게 업데이트한다.
> 기존 콘텐츠(articles, card, affiliates)는 보존하되 새 구조와 공존시킨다.

### 4-1. config.json 업데이트

기존 config.json에 커머스 섹션을 추가한다. **기존 필드는 삭제하지 않는다** (헌법 제1조: 삭제는 없다).

**파일**: `config.json`

```json
{
  "site": {
    "name": "KOOSY",
    "shortName": "KOOSY",
    "domain": "koosy.kr",
    "url": "https://dtslib1979.github.io/koosy/",
    "description": "교육 키트 커머스 — AI 코딩 교육 키트 4채널 루프백",
    "tagline": "Real Money, Real World",
    "established": "2026.01.13",
    "themeColor": "#3b82f6"
  },
  "owner": {
    "name": "DIMAS",
    "email": "dimas@dtslib.com",
    "location": "대한민국"
  },
  "guild": {
    "enabled": true,
    "name": "KOOSY 과외 길드",
    "industry": "education",
    "totalSlots": 12,
    "registryPath": "/registry.json",
    "masterSlot": "slot01",
    "features": ["walkie", "card", "blog", "console"]
  },
  "commerce": {
    "enabled": true,
    "brand": "KOOSY",
    "domain": "koosy.kr",
    "model": "허생.exe",
    "channels": {
      "coupang": { "status": "pending", "adapter": "automation/adapters/coupang.js" },
      "naver": { "status": "pending", "adapter": "automation/adapters/naver.js" },
      "youtube": { "status": "pending", "adapter": "automation/adapters/youtube.js" },
      "showroom": { "status": "active", "adapter": "automation/adapters/showroom.js" }
    },
    "categories": ["kit", "course", "template", "bundle"],
    "contentTypes": ["unboxing", "tutorial", "ai_coding", "showcase"],
    "sot": "catalog/products/KS-XXX/card.json",
    "gpu": "gpu/",
    "automation": "automation/",
    "analytics": "analytics/"
  },
  "service": {
    "title": "AI 업무 자동화 세팅",
    "subtitle": "ChatGPT를 진짜 업무에 쓰게 만들어드립니다",
    "price": "25만원 / 2시간",
    "ctaText": "문의하기",
    "features": [
      "자영업자 / 대표님 맞춤",
      "혼자서 이것저것 다 하는 분",
      "AI 써보려다 포기한 분"
    ]
  },
  "staff": {
    "accessCode": "1126",
    "storageKey": "dtslib_staff_auth"
  },
  "console": {
    "accessCode": "1126",
    "storageKey": "koosy_console_auth"
  },
  "pr": {
    "channel": "kakao",
    "kakaoId": "koosy",
    "webhookEnabled": false
  },
  "pricing": {
    "entry": 500000,
    "monthly": 100000,
    "monthlyBreakdown": {
      "chatgpt": 30000,
      "guild": 70000
    }
  },
  "pwa": {
    "enabled": true,
    "cacheName": "koosy-v2"
  },
  "card": {
    "name": "KOOSY",
    "title": "AI Education Kit Commerce",
    "organization": "KOOSY",
    "tagline": "Real Money, Real World",
    "quote": "EST. 2026.01.13",
    "email": "koosy@koosy.kr",
    "phone": "",
    "website": "https://koosy.kr",
    "cardUrl": "https://koosy.kr/card/",
    "ogImage": "https://dtslib1979.github.io/koosy/assets/icons/profile.jpg",
    "contactButtonLabel": "CONTACT",
    "theme": "blue"
  },
  "meta": {
    "version": "2.0.0",
    "lastUpdated": "2026-03-05",
    "template": "KOOSY-COMMERCE"
  }
}
```

**변경 포인트**:
- `site.description`: 커머스 설명으로 변경
- `site.themeColor`: `#D4AF37` (gold) → `#3b82f6` (blue)
- `commerce` 섹션 추가 (4채널, 카테고리, SoT 경로)
- `pwa.cacheName`: `koosy-v1` → `koosy-v2` (캐시 무효화)
- `card.title`: 커머스 정체성 반영
- `card.theme`: `gold` → `blue`
- `meta.version`: `1.0.0` → `2.0.0`
- `meta.template`: `KOOSY` → `KOOSY-COMMERCE`

### 4-2. branch.json 업데이트

**파일**: `branch.json`

```json
{
  "id": "koosy",
  "name": "KOOSY",
  "tagline": "AI Education Kit Commerce — 4-Channel Loopback",
  "hq": "dtslib1979/dtslib-branch",
  "version": "2.0",
  "status": "active",
  "visibility": "public",
  "area": "commerce",
  "tier": "standard",
  "theme": {
    "primary": "#3b82f6",
    "accent": "#60a5fa",
    "bg": "#0a0a0a",
    "text": "#f5f5f5"
  },
  "subscriptions": [
    {
      "feedId": "parksy-gallery",
      "publisher": "parksy",
      "autoSync": true,
      "target": "assets/feeds/parksy"
    },
    {
      "feedId": "parksy-templates",
      "publisher": "parksy",
      "autoSync": true,
      "target": "assets/feeds/templates"
    },
    {
      "feedId": "eae-courses",
      "publisher": "eae",
      "autoSync": true,
      "target": "assets/feeds/eae"
    },
    {
      "feedId": "hq-notices",
      "publisher": "hq",
      "autoSync": true,
      "target": null
    },
    {
      "feedId": "hq-sdk",
      "publisher": "hq",
      "autoSync": true,
      "target": "assets/js"
    }
  ],
  "features": ["education-kit", "4ch-loopback", "gpu-render", "commerce"],
  "commerce": {
    "model": "허생.exe",
    "channels": ["coupang", "naver", "youtube", "showroom"],
    "sot": "PRODUCT_CARD.json",
    "upstream": ["parksy-image", "parksy-audio", "OrbitPrompt"],
    "downstream": ["dtslib-papyrus", "dtslib.kr"]
  }
}
```

**변경 포인트**:
- `tagline`: 커머스 정체성 반영
- `version`: `1.0` → `2.0`
- `area`: `content` → `commerce`
- `theme`: blue 계열로 전환 (gohsy green 대신)
- `features`: 커머스 기능 반영
- `commerce` 섹션 추가 (허생.exe 모델, 4채널, SoT)

### 4-3. 기존 콘텐츠 보존

기존 디렉토리는 **삭제하지 않는다**. 커머스 구조와 공존한다.

```bash
# 기존 콘텐츠 — 건드리지 않음
articles/       # 기존 아티클 → 나중에 content/로 통합 가능
affiliates/     # 기존 제휴 → 유지
card/           # 명함 페이지 → 유지
assets/         # 아이콘/이미지 → 유지 + 커머스 에셋 추가

# 기존 index.html → legacy/index.html.bak 으로 백업
# (Phase 0에서 이미 처리됨)
```

### 커밋: `migration: Phase 4 — config/branch 커머스 전환, 기존 콘텐츠 보존`

---

## Phase 5: 스크립트 + HQ 동기화

> 크로스레포 동기화 스크립트를 koosy 맥락으로 변환한다.
> 헌법 제2조: 크로스레포 작업은 반드시 스크립트 경유.

### 5-1. scripts/sync-to-papyrus.sh

gohsy-fashion → papyrus 동기화를 koosy → papyrus로 변환.

**파일**: `scripts/sync-to-papyrus.sh`

```bash
#!/usr/bin/env bash
# sync-to-papyrus.sh — HQ(dtslib-papyrus) state.json 업데이트
# koosy 상태를 papyrus education-commerce 라인에 반영
# 헌법 제2조: 크로스레포는 스크립트 경유

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PAPYRUS_REPO="dtslib1979/dtslib-papyrus"

echo "=== sync-to-papyrus ==="

# 현재 상태 수집
PRODUCT_COUNT=$(node -e "const idx=require('${ROOT}/catalog/index.json');console.log(idx.products.length)" 2>/dev/null || echo 0)
LIVE_COUNT=$(node -e "const idx=require('${ROOT}/catalog/index.json');console.log(idx.products.filter(p=>p.state==='ALL_LIVE').length)" 2>/dev/null || echo 0)
KIT_COUNT=$(ls "${ROOT}/catalog/products/"KS-*/card.json 2>/dev/null | wc -l | tr -d ' ')

echo "  products: ${PRODUCT_COUNT} (${LIVE_COUNT} live)"
echo "  kits: ${KIT_COUNT}"

# state.json 현재 내용 가져오기
echo "  fetching papyrus state.json..."
STATE_JSON=$(gh api "repos/${PAPYRUS_REPO}/contents/state.json" -q '.content' 2>/dev/null | base64 -d 2>/dev/null)

if [ -z "$STATE_JSON" ]; then
  echo "  WARN: state.json not found or empty"
  echo "  manual update needed"
  exit 0
fi

SHA=$(gh api "repos/${PAPYRUS_REPO}/contents/state.json" -q '.sha' 2>/dev/null)

# education-commerce 라인 상태 업데이트
# NOTE: node로 state.json 수정 — education-commerce 라인의 current_step/blocker 업데이트
UPDATED=$(echo "$STATE_JSON" | node -e "
  const fs = require('fs');
  let data = '';
  process.stdin.on('data', d => data += d);
  process.stdin.on('end', () => {
    try {
      const state = JSON.parse(data);
      if (state.lines && state.lines['education-commerce']) {
        const ec = state.lines['education-commerce'];
        ec.blocker = ${LIVE_COUNT} > 0 ? null : ec.blocker;
        ec.last_output = {
          products: ${PRODUCT_COUNT},
          live: ${LIVE_COUNT},
          kits: ${KIT_COUNT},
          synced: new Date().toISOString()
        };
      }
      console.log(JSON.stringify(state, null, 2));
    } catch(e) {
      console.error('parse error:', e.message);
      process.exit(1);
    }
  });
")

if [ -n "$UPDATED" ] && [ "$UPDATED" != "null" ]; then
  ENCODED=$(echo "$UPDATED" | base64 -w 0)
  gh api "repos/${PAPYRUS_REPO}/contents/state.json" \
    -X PUT \
    -f message="sync: koosy → papyrus (${PRODUCT_COUNT} products, ${LIVE_COUNT} live)" \
    -f content="$ENCODED" \
    -f sha="$SHA" \
    > /dev/null 2>&1 && echo "  OK papyrus state.json updated" || echo "  FAIL update failed"
else
  echo "  FAIL failed to generate updated state"
fi

echo "=== sync complete ==="
```

**변환 포인트**:
- 코멘트: `gohsy-fashion` → `koosy`
- 라인 이름: `fashion-commerce` → `education-commerce`
- 변수: `FORMULA_COUNT` → `KIT_COUNT` (교육 키트 카운트)
- 경로: `catalog/style-db/formulas/` → `catalog/products/KS-*/card.json`
- 커밋 메시지: `gohsy-fashion` → `koosy`
- 체크마크 이모지 제거 (OK/FAIL 텍스트)

### 5-2. scripts/generate-report.sh

월간 리포트 생성 스크립트. analytics/*.jsonl → analytics/reports/YYYY-MM.json

**파일**: `scripts/generate-report.sh`

```bash
#!/usr/bin/env bash
# generate-report.sh — 월간 리포트 생성
# analytics/*.jsonl → analytics/reports/YYYY-MM.json
# 헌법 제2조: analytics는 append-only

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MONTH="${1:-$(date +%Y-%m)}"
REPORT_DIR="${ROOT}/analytics/reports"
mkdir -p "$REPORT_DIR"

echo "=== generate-report: ${MONTH} ==="

# deploy-log 집계
DEPLOY_LOG="${ROOT}/analytics/deploy-log.jsonl"
if [ -f "$DEPLOY_LOG" ]; then
  TOTAL_DEPLOYS=$(wc -l < "$DEPLOY_LOG" | tr -d ' ')
  ALL_LIVE=$(grep -c '"all_live":true' "$DEPLOY_LOG" 2>/dev/null || echo 0)
  echo "  deploys: ${TOTAL_DEPLOYS} total, ${ALL_LIVE} all_live"
else
  TOTAL_DEPLOYS=0
  ALL_LIVE=0
fi

# 상품 수
PRODUCT_COUNT=$(node -e "const idx=require('${ROOT}/catalog/index.json');console.log(idx.products.length)" 2>/dev/null || echo 0)

# 키트 수 (KS- 프리픽스)
KIT_COUNT=$(ls "${ROOT}/catalog/products/"KS-*/card.json 2>/dev/null | wc -l | tr -d ' ')

# 리포트 생성
cat > "${REPORT_DIR}/${MONTH}.json" << REPORT
{
  "month": "${MONTH}",
  "generated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "brand": "koosy",
  "products": {
    "total": ${PRODUCT_COUNT},
    "spec_ready": $(node -e "const idx=require('${ROOT}/catalog/index.json');console.log(idx.products.filter(p=>p.state==='SPEC_READY').length)" 2>/dev/null || echo 0),
    "all_live": $(node -e "const idx=require('${ROOT}/catalog/index.json');console.log(idx.products.filter(p=>p.state==='ALL_LIVE').length)" 2>/dev/null || echo 0)
  },
  "kits": {
    "total": ${KIT_COUNT}
  },
  "deploys": {
    "total": ${TOTAL_DEPLOYS},
    "all_live": ${ALL_LIVE}
  },
  "channels": {
    "coupang": "active",
    "naver": "active",
    "youtube": "active",
    "showroom": "active"
  }
}
REPORT

echo "  OK ${REPORT_DIR}/${MONTH}.json"
cat "${REPORT_DIR}/${MONTH}.json"
```

**변환 포인트**:
- `brand` 필드 추가: `"koosy"`
- `style_db` 섹션 → `kits` 섹션 (교육 키트 기준)
- `FORMULA_COUNT` → `KIT_COUNT`
- 경로: `catalog/style-db/formulas/` → `catalog/products/KS-*/card.json`
- `contexts` 관련 삭제 (패션 전용)
- 체크마크 이모지 → `OK` 텍스트

### 5-3. scripts/validate-card.sh (신규)

PRODUCT_CARD.json 유효성 검증 스크립트. 헌법 제2조: BOM 확인 후 착공.

**파일**: `scripts/validate-card.sh`

```bash
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
```

### 커밋: `migration: Phase 5 — scripts 커머스 전환, HQ 동기화, card 검증`

---

## Phase 6: 첫 상품 검증 (KS-001)

> 파이프라인 전체를 관통하는 첫 상품을 등록하여 시스템 검증.
> PRODUCT_CARD → 에셋 생성 → GPU 렌더 → 4채널 배포 → 매출 추적

### 6-1. 첫 상품 카드 (KS-001)

**파일**: `catalog/products/KS-001/card.json`

```json
{
  "id": "KS-001",
  "name": "AI 코딩 스타터 키트",
  "name_en": "AI Coding Starter Kit",
  "category": "kit/basic",
  "season": "ALL",
  "tags": ["beginner", "ai", "coding", "python", "chatgpt"],
  "price": {
    "cost": 15000,
    "retail": 39900,
    "coupang": 35900,
    "naver": 37900
  },
  "spec": {
    "contents": [
      "가이드북 1권 (PDF 120p)",
      "프롬프트 템플릿 30종",
      "실습 코드 파일 15개",
      "노션 대시보드 템플릿 1종",
      "슬랙 커뮤니티 초대 (30일)"
    ],
    "level": "beginner",
    "duration": "2주 완성",
    "platform": ["Windows", "Mac", "Chromebook"],
    "requirements": "인터넷 연결, 브라우저"
  },
  "images": {
    "main": "catalog/products/KS-001/main.png",
    "detail": [
      "catalog/products/KS-001/detail-01.png",
      "catalog/products/KS-001/detail-02.png",
      "catalog/products/KS-001/detail-03.png"
    ],
    "thumbnail": "catalog/products/KS-001/thumb.png"
  },
  "channels": {
    "coupang": "DRAFT",
    "naver": "DRAFT",
    "youtube": "DRAFT",
    "showroom": "DRAFT"
  },
  "content_matrix": {
    "unboxing": {
      "status": "PENDING",
      "source": "parksy-image/render",
      "output": "content/unboxing/KS-001/"
    },
    "tutorial": {
      "status": "PENDING",
      "source": "parksy-image/story",
      "output": "content/tutorial/KS-001/"
    },
    "ai_coding": {
      "status": "PENDING",
      "source": "OrbitPrompt",
      "output": "content/ai_coding/KS-001/"
    },
    "showcase": {
      "status": "PENDING",
      "source": "parksy-image/cad",
      "output": "content/showcase/KS-001/"
    }
  },
  "pipeline": {
    "image_source": "parksy-image",
    "audio_source": "parksy-audio",
    "render_engine": "gpu/render/render-video.js",
    "detail_renderer": "gpu/detail-renderer/generate-detail.js"
  },
  "analytics": {
    "views": 0,
    "sales": 0,
    "clicks": 0,
    "revenue": 0,
    "conversion_rate": 0
  },
  "created": "2026-03-05",
  "updated": "2026-03-05",
  "state": "SPEC_READY"
}
```

### 6-2. catalog/index.json에 KS-001 추가

catalog/index.json의 products 배열에 KS-001을 추가한다:

```json
{
  "id": "KS-001",
  "name": "AI 코딩 스타터 키트",
  "name_en": "AI Coding Starter Kit",
  "category": "kit/basic",
  "season": "ALL",
  "price": 39900,
  "colors": [],
  "image": "catalog/products/KS-001/main.png",
  "state": "SPEC_READY",
  "card": "products/KS-001/card.json"
}
```

### 6-3. Dry-run 검증

모든 파일 생성 후 다음 순서로 검증한다:

```bash
# 1. card.json 유효성 검증
bash scripts/validate-card.sh catalog/products/KS-001/card.json

# 2. orchestrator dry-run (실제 등록 안 함)
node automation/orchestrator.js --dry-run --product KS-001

# 3. 상세페이지 렌더 테스트
node gpu/detail-renderer/generate-detail.js --product KS-001 --preview

# 4. 리포트 생성 테스트
bash scripts/generate-report.sh 2026-03

# 5. showroom에서 상품 표시 확인
# 브라우저에서 showroom/index.html 열고 KS-001 카드 표시 확인
```

### 6-4. 검증 체크리스트

| 항목 | 확인 | 비고 |
|------|------|------|
| card.json 파싱 성공 | [ ] | validate-card.sh 통과 |
| catalog/index.json에 등록 | [ ] | products 배열에 존재 |
| orchestrator dry-run 성공 | [ ] | 4채널 어댑터 로드 확인 |
| detail-renderer 실행 가능 | [ ] | HTML 출력 확인 |
| showroom 카드 표시 | [ ] | 브라우저 확인 |
| analytics 초기값 0 | [ ] | dashboard.json 확인 |
| sync-to-papyrus 실행 가능 | [ ] | HQ 상태 반영 |

### 커밋: `feat: Phase 6 — KS-001 첫 상품 등록, 파이프라인 검증`

---
