# KOOSY 커머스 전환 — 실행 가이드 (Sonnet 전용)

> **이 문서를 순서대로 실행하면 커머스 전환이 완료된다.**
> 기존 계획서: `docs/KOOSY-COMMERCE-REFACTORING-PLAN.md` (348줄) — 컨셉/스키마/디자인 정의
> 본 문서: **코드 레벨 실행 지침** — 파일별 정확한 내용, 변경점, 커밋 단위

---

## 소스 경로 매핑

| 레포 | 로컬 경로 |
|------|----------|
| koosy (작업 대상) | `~/koosy/` |
| gohsy-fashion (이식 소스) | `~/dongseon-studio/` |

---

## Phase 0: Archive + Scaffold

### 커밋: `migration: Phase 0 — legacy 아카이브 + 커머스 스캐폴딩`

### 0-1. legacy/ 아카이브

```bash
cd ~/koosy
mkdir -p legacy

# git mv로 이동 (이력 보존)
git mv philosophy/ legacy/philosophy/
git mv affiliates/ legacy/affiliates/
git mv articles/ legacy/articles/
```

**주의**: `articles/articles.json`은 이동 후에도 legacy/ 경로에서 참조 가능하므로 별도 백업 불필요.

### 0-2. 디렉토리 스캐폴딩

```bash
cd ~/koosy

# catalog
mkdir -p catalog/products/KS-001

# channels
mkdir -p channels

# showroom
mkdir -p showroom/lookbook

# 마켓플레이스 채널
mkdir -p coupang/queue coupang/rendered coupang/templates
mkdir -p naver/queue naver/rendered naver/templates
mkdir -p youtube/queue youtube/rendered youtube/templates youtube/thumbnails

# automation
mkdir -p automation/adapters automation/engine automation/plugins

# pipeline
mkdir -p pipeline/specs

# analytics
mkdir -p analytics/evidence analytics/reports

# gpu
mkdir -p gpu/detail-renderer gpu/render

# content
mkdir -p content/unboxing content/tutorials content/ai-coding content/showcase

# styles, js
mkdir -p styles js

# workstation
mkdir -p workstation

# scripts
mkdir -p scripts

# tools (기존 유지, 하위 추가)
mkdir -p tools/margin-calc
```

### 0-3. FACTORY.json 생성

파일: `~/koosy/FACTORY.json`

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
    "rendering": "gpu/ (상세페이지 + 강의 영상)"
  },

  "directories": {
    "catalog": "상품 카탈로그 (SoT)",
    "coupang": "쿠팡 벤더 시스템",
    "naver": "네이버 스마트스토어",
    "youtube": "YouTube 강의 마케팅",
    "showroom": "koosy.kr 브랜드 쇼룸",
    "gpu": "렌더링 엔진 (상세페이지 + 영상)",
    "automation": "GUI 자동화",
    "pipeline": "파이프라인 JSON 컨트랙트",
    "content": "콘텐츠 소스",
    "analytics": "매출/트래픽 분석",
    "core": "브랜치 표준 모듈 (HQ 연결)",
    "scripts": "운영 스크립트",
    "channels": "4채널 페이지",
    "workstation": "비공개 워크스테이션"
  },

  "pipeline": {
    "flow": [
      "PRODUCT_CARD 작성",
      "키트 사진 + 강의 에셋 생성",
      "GPU 렌더링 (상세페이지 + 영상)",
      "4채널 동시 배포",
      "매출 추적 → 루프백"
    ]
  },

  "transplants": {
    "count": 30,
    "newTech": 0,
    "source": "gohsy-fashion (~/dongseon-studio/)",
    "items": [
      "catalog/ 구조",
      "automation/ (orchestrator + 4 adapters + engine)",
      "pipeline/ (flow.json + content-matrix.json)",
      "gpu/ (detail-renderer + render)",
      "styles/ (9 CSS)",
      "js/ (app + scroll-reveal + player-bar)",
      "showroom/ (index + console)",
      "workstation/ (4파일)",
      "analytics/ (collector + dashboard)",
      "scripts/ (sync-to-papyrus)"
    ]
  },

  "transition": {
    "from": {
      "id": "koosy v3.0",
      "type": "content-guild",
      "model": "12슬롯 과외 길드"
    },
    "to": {
      "id": "koosy v4.0",
      "type": "commerce-education",
      "model": "교육 키트 쇼핑몰 + 강의 + 길드 트리플"
    },
    "preserved": ["core/", "staff/", "console/", "slots/", "modules/", "tools/", "card/", "studio/"],
    "archived": ["philosophy/ → legacy/", "affiliates/ → legacy/", "articles/ → legacy/"]
  },

  "meta": {
    "createdAt": "2026-01-13",
    "updatedAt": "2026-03-05",
    "version": "4.0.0"
  }
}
```

### 0-4. .gitignore 추가/확인

파일: `~/koosy/.gitignore` (없으면 생성, 있으면 추가)

```
# Credentials
automation/.credentials/
.credentials/

# Queue (orchestrator 관리)
coupang/queue/*.json
naver/queue/*.json
youtube/queue/*.json

# OS
.DS_Store
Thumbs.db

# Editor
.vscode/
*.swp
```

---

## Phase 1: Catalog + Pipeline Core

### 커밋: `feat: Phase 1 — catalog + pipeline + automation 코어`

### 1-1. catalog/categories.json

파일: `~/koosy/catalog/categories.json`

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
      "labelEn": "AI Template",
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

### 1-2. catalog/index.json

파일: `~/koosy/catalog/index.json`

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

### 1-3. catalog/products/KS-001/card.json

파일: `~/koosy/catalog/products/KS-001/card.json`

기존 계획서 §4 스키마 그대로 사용:

```json
{
  "schema_version": "1.0",
  "product_id": "KS-001",
  "name": "ESP32 IoT 스타터 키트",
  "name_en": "ESP32 IoT Starter Kit",
  "brand": "koosy",
  "state": "DRAFT",
  "category": "kit/esp32",
  "difficulty": "beginner",
  "tags": ["esp32", "iot", "beginner", "arduino", "교육키트"],

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

  "content_matrix": {
    "unboxing": { "enabled": true, "note": "키트 개봉 + 부품 소개" },
    "tutorial": { "enabled": true, "note": "프로젝트 3개 step-by-step" },
    "ai_coding": { "enabled": true, "note": "Claude로 코드 짜는 과정" },
    "showcase": { "enabled": true, "note": "완성작 데모 + 확장 아이디어" }
  },

  "channels": {
    "coupang": { "status": "pending", "detail_html": "coupang/rendered/KS-001.html", "product_url": null },
    "naver": { "status": "pending", "detail_html": "naver/rendered/KS-001.html", "product_url": null },
    "youtube": { "video_ids": [], "status": "pending" },
    "showroom": { "page_url": "/showroom/lookbook/KS-001.html", "status": "pending" }
  },

  "created": "2026-03-05",
  "updated": "2026-03-05"
}
```

### 1-4. pipeline/flow.json

**gohsy 소스**: `~/dongseon-studio/pipeline/flow.json` (89행)
**변경점**: S2 tools를 교육키트 에셋으로 수정

파일: `~/koosy/pipeline/flow.json`

```json
{
  "$schema": "flow.v1.0",
  "description": "전체 워크플로우 정의 — PRODUCT_CARD → 4채널 배포",

  "stages": [
    {
      "id": "S1_SPEC",
      "name": "상품 기획",
      "input": "시장 조사 (Reddit/1688) + analytics/ 데이터",
      "output": "catalog/products/KS-XXX/card.json",
      "state_transition": "→ DRAFT → SPEC_READY",
      "manual": true,
      "tools": []
    },
    {
      "id": "S2_ASSET",
      "name": "에셋 생성",
      "input": "card.json + 키트 사진 + 강의 스크립트",
      "output": "main.jpg + detail-*.jpg + project-guide.pdf + lecture-slides",
      "state_transition": "SPEC_READY → ASSETS_READY",
      "manual": true,
      "tools": [
        "키트 사진 촬영",
        "프로젝트 가이드 PDF 작성",
        "Claude 프롬프트 템플릿 작성",
        "회로도 SVG 생성"
      ]
    },
    {
      "id": "S3_RENDER",
      "name": "GPU 렌더링",
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
        "core/hq/reporter.js",
        "showroom/console.html"
      ]
    }
  ],

  "state_machine": {
    "states": ["DRAFT", "SPEC_READY", "ASSETS_READY", "RENDERED", "COUPANG_LIVE", "NAVER_LIVE", "YOUTUBE_LIVE", "SHOWROOM_LIVE", "ALL_LIVE", "TRACKING", "DISCONTINUED", "CANCELLED"],
    "transitions": {
      "DRAFT → SPEC_READY": "card.json 스펙 확정",
      "SPEC_READY → ASSETS_READY": "키트 사진 + 강의 에셋 생성 완료",
      "ASSETS_READY → RENDERED": "상세페이지 + 강의영상 렌더링 완료",
      "RENDERED → *_LIVE": "각 채널 등록 완료",
      "ALL_LIVE → TRACKING": "전 채널 라이브 확인",
      "TRACKING → DRAFT": "루프백 (매출 → 다음 기획)"
    }
  }
}
```

### 1-5. pipeline/content-matrix.json

파일: `~/koosy/pipeline/content-matrix.json`

```json
{
  "$schema": "content-matrix.v1.0",
  "description": "콘텐츠 유형별 파이프라인 매핑 — 교육 키트 특화",

  "types": {
    "unboxing": {
      "label": "키트 개봉",
      "source": "키트 사진 + 부품 리스트",
      "outputs": ["main.jpg", "detail-*.jpg", "unboxing-video.mp4"],
      "channels": {
        "coupang": "상품 메인/디테일 이미지",
        "naver": "상품 메인 이미지",
        "youtube": "시리즈 A (29,900원 키트 뜯어보기)",
        "showroom": "갤러리"
      }
    },
    "tutorial": {
      "label": "만들기 강의",
      "source": "프로젝트 가이드 PDF + 회로도 SVG",
      "outputs": ["tutorial-slides/", "tutorial-video.mp4", "project-guide.pdf"],
      "channels": {
        "coupang": "상세페이지 하단 (프로젝트 소개)",
        "naver": "블로그 연동 강의",
        "youtube": "시리즈 B (30분 만에 IoT 완성) — 핵심",
        "showroom": "Workshop 페이지"
      }
    },
    "ai_coding": {
      "label": "AI 코딩",
      "source": "Claude 프롬프트 템플릿 + 코드 스니펫",
      "outputs": ["ai-coding-video.mp4", "prompt-templates.zip"],
      "channels": {
        "coupang": "상세페이지 AI 활용 섹션",
        "naver": "디지털 상품 미리보기",
        "youtube": "시리즈 C (Claude한테 코드 시키기)",
        "showroom": "Academy 페이지"
      }
    },
    "showcase": {
      "label": "완성작 데모",
      "source": "완성된 프로젝트 사진/영상",
      "outputs": ["showcase-video.mp4", "showcase-photos/"],
      "channels": {
        "coupang": "상세페이지 하단 완성작",
        "naver": "리뷰/후기 연동",
        "youtube": "시리즈 D (쿠씨의 과외 — 기존 연결)",
        "showroom": "Project 페이지"
      }
    }
  },

  "youtube_series": {
    "A": { "name": "개봉기", "title_template": "{{price}} 교육키트 뜯어보기 | {{name}}", "category_id": "28" },
    "B": { "name": "만들기", "title_template": "{{time}}분 만에 완성! {{project_name}} | {{name}}", "category_id": "28" },
    "C": { "name": "AI 코딩", "title_template": "Claude한테 {{project_name}} 코드 시키기 | {{name}}", "category_id": "28" },
    "D": { "name": "쿠씨의 과외", "title_template": "쿠씨의 과외 — {{topic}} | KOOSY", "category_id": "27" }
  }
}
```

### 1-6. pipeline/sourcing-model.json (허생.exe 이식)

파일: `~/koosy/pipeline/sourcing-model.json`

```json
{
  "$schema": "sourcing-model.v1.0",
  "description": "허생.exe 정보차익 소싱 모델 — USA(Brain) → China(Body) → Korea(Mouth)",

  "model": {
    "brain": {
      "source": "USA",
      "platforms": ["Reddit", "GitHub", "Hacker News", "Product Hunt"],
      "output": "트렌드/키워드 → 다음 키트 기획"
    },
    "body": {
      "source": "China",
      "platforms": ["1688.com", "Taobao", "AliExpress"],
      "output": "부품 소싱 (원가 ¥25 = ₩5,000)"
    },
    "mouth": {
      "source": "Korea",
      "platforms": ["Coupang", "Naver", "YouTube", "koosy.kr"],
      "output": "AI 번들 키트 (₩29,900 판매)"
    }
  },

  "margin_structure": {
    "kit": {
      "cost": 5000,
      "shipping": 6500,
      "platform_fee": 3000,
      "retail": 29900,
      "net_profit": 15400,
      "margin_pct": 51.5
    },
    "digital_course": {
      "cost": 0,
      "shipping": 0,
      "platform_fee": 2000,
      "retail": 19900,
      "net_profit": 17900,
      "margin_pct": 89.9
    },
    "ai_template": {
      "cost": 0,
      "shipping": 0,
      "platform_fee": 1000,
      "retail": 9900,
      "net_profit": 8900,
      "margin_pct": 89.9
    },
    "bundle": {
      "cost": 5000,
      "shipping": 6500,
      "platform_fee": 5000,
      "retail": 49900,
      "net_profit": 33400,
      "margin_pct": 66.9
    }
  },

  "moats": {
    "content": "키트당 강의 3편 + AI 템플릿 — 따라올 수 없는 번들",
    "community": "12슬롯 길드 + YouTube 구독자 커뮤니티",
    "speed": "Claude Code로 강의 자동 생성 — 경쟁사 2주 vs 1일"
  }
}
```

### 1-7. automation/orchestrator.js

**gohsy 소스**: `~/dongseon-studio/automation/orchestrator.js` (188행)
**이식 방법**: 복사 후 브랜드/URL만 수정

```bash
cp ~/dongseon-studio/automation/orchestrator.js ~/koosy/automation/orchestrator.js
```

**수정점 (2곳)**:
1. 라인 없음 — orchestrator.js는 브랜드 독립적. 그대로 사용 가능.

### 1-8. automation/adapters/ (4개)

```bash
cp ~/dongseon-studio/automation/adapters/coupang.js ~/koosy/automation/adapters/coupang.js
cp ~/dongseon-studio/automation/adapters/naver.js ~/koosy/automation/adapters/naver.js
cp ~/dongseon-studio/automation/adapters/youtube.js ~/koosy/automation/adapters/youtube.js
cp ~/dongseon-studio/automation/adapters/showroom.js ~/koosy/automation/adapters/showroom.js
```

**수정점 — coupang.js**:
- `mapCategory()` 함수의 매핑을 교육키트로 변경:
```javascript
function mapCategory(cat) {
  const map = {
    'kit/esp32': '가전디지털 > DIY/공구 > 전자부품',
    'kit/arduino': '가전디지털 > DIY/공구 > 전자부품',
    'kit/raspberry_pi': '가전디지털 > DIY/공구 > 전자부품',
    'kit/sensor': '가전디지털 > DIY/공구 > 전자부품',
    'kit/robot': '완구/취미 > 로봇/RC',
    'course/beginner': '도서 > 컴퓨터/IT',
    'template/claude': '도서 > 컴퓨터/IT'
  };
  return map[cat] || '가전디지털 > DIY/공구 > 전자부품';
}
```
- `mapToWingForm()`:
  - `brandName: card.brand || 'koosy'`
  - `options` 에서 `sizes` → 삭제, `colors` → 삭제 (키트에 불필요)
  - 대신 `kit_contents: card.kit_contents` 추가
- `images.main` 경로 그대로 (card.json 기반이므로 동일 구조)

**수정점 — naver.js**:
- `mapCategory()`:
```javascript
function mapCategory(cat) {
  const map = {
    'kit/esp32': '50002806',
    'kit/arduino': '50002806',
    'course/beginner': '50005542',
    'template/claude': '50005542'
  };
  return map[cat] || '50002806';
}
```

**수정점 — youtube.js**:
- `seriesNames` 변경:
```javascript
const seriesNames = {
  A: '키트 개봉기',
  B: '만들기 강의',
  C: 'AI 코딩',
  D: '쿠씨의 과외'
};
```
- `tags` 변경: `['koosy', '교육키트', 'IoT', 'ESP32', seriesName, ...]`
- `categoryId: '27'` (Education)
- title 형식: `${card.name} — ${seriesName} | KOOSY`

**수정점 — showroom.js**:
- 라인 62: URL을 `https://koosy.kr/showroom/lookbook/` 으로 변경
- 커밋 메시지: `"deploy: showroom ${card.product_id} — ${card.name}"` 유지

### 1-9. automation/engine/ (2개)

```bash
cp ~/dongseon-studio/automation/engine/screenshot.js ~/koosy/automation/engine/screenshot.js
cp ~/dongseon-studio/automation/engine/session.js ~/koosy/automation/engine/session.js
```

**수정점**: 없음. 브랜드 독립적 모듈.

### 1-10. analytics/ 스텁

```bash
cp ~/dongseon-studio/analytics/collector.js ~/koosy/analytics/collector.js
```

**수정점**: 없음. collector.js는 catalog/index.json 기반이므로 koosy 카탈로그 자동 참조.

파일: `~/koosy/analytics/dashboard.json`

```json
{
  "generated": "2026-03-05T00:00:00.000Z",
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
  "loopback": { "note": "첫 매출 발생 시 루프백 시작", "ready": false }
}
```

빈 JSONL 파일 4개:

```bash
touch ~/koosy/analytics/deploy-log.jsonl
touch ~/koosy/analytics/sales-log.jsonl
touch ~/koosy/analytics/traffic-log.jsonl
touch ~/koosy/analytics/channel-performance.jsonl
```

### 1-11. gpu/detail-renderer/generate-detail.js

```bash
cp ~/dongseon-studio/gpu/detail-renderer/generate-detail.js ~/koosy/gpu/detail-renderer/generate-detail.js
```

**수정점**:
- `interpolate()` 함수에 교육키트 변수 추가:
```javascript
// 기존 패션 변수 유지 + 교육키트 변수 추가
// kit_contents HTML
const kitHardwareHtml = (card.kit_contents?.hardware || []).map(h =>
  `<li>${h}</li>`
).join('\n');
const kitDigitalHtml = (card.kit_contents?.digital || []).map(d =>
  `<li>${d}</li>`
).join('\n');

// projects HTML
const projectsHtml = (card.projects || []).map(p =>
  `<div class="project-card">
    <h4>${p.name}</h4>
    <span class="difficulty">${p.difficulty}</span>
    <span class="time">${p.time}</span>
  </div>`
).join('\n');

// difficulty badge
const difficultyBadge = card.difficulty ?
  `<span class="difficulty-badge difficulty-badge--${card.difficulty}">${card.difficulty}</span>` : '';
```

- `.replace()` 체인에 추가:
```javascript
.replace(/\{\{kit_hardware\}\}/g, kitHardwareHtml)
.replace(/\{\{kit_digital\}\}/g, kitDigitalHtml)
.replace(/\{\{projects\}\}/g, projectsHtml)
.replace(/\{\{difficulty\}\}/g, difficultyBadge)
.replace(/\{\{target_age\}\}/g, card.spec?.target_age || '')
.replace(/\{\{showroom_url\}\}/g, `https://koosy.kr/showroom/lookbook/${card.product_id}.html`)
```

### 1-12. gpu/render/ (2개)

```bash
cp ~/dongseon-studio/gpu/render/render-video.js ~/koosy/gpu/render/render-video.js
cp ~/dongseon-studio/gpu/render/ffmpeg-builder.js ~/koosy/gpu/render/ffmpeg-builder.js
```

**수정점 — render-video.js**:
- `seriesMap` 변경:
```javascript
const seriesMap = {
  'A': 'A_unboxing',
  'B': 'B_tutorial',
  'C': 'C_ai_coding',
  'D': 'D_showcase'
};
```

**수정점 — ffmpeg-builder.js**:
- `sceneText()` 내 텍스트 교육키트용으로 수정:
```javascript
const texts = {
  intro: productName,
  unboxing: `${productName}\n₩${price.toLocaleString()}`,
  tutorial: scene.content || 'Building...',
  ai_coding: 'AI Coding with Claude',
  showcase: `${productName} — Complete!`,
  outro: 'koosy.kr'
};
```
- `gohsy.com` → `koosy.kr` 전역 치환

---

## Phase 2: Design System + Channel Pages

### 커밋: `feat: Phase 2 — 디자인 시스템 + 4채널 페이지`

### 2-1. styles/tokens.css

파일: `~/koosy/styles/tokens.css`

gohsy 소스 (`~/dongseon-studio/styles/tokens.css`, 31행) 복사 후 **색상만 변경**:

```css
/* KOOSY — Design Tokens */
:root {
  --black:#000;--white:#fff;
  --bg:#0a0f1a;--surface:#111827;--elevated:#1f2937;--overlay:rgba(10,15,26,0.85);
  --text:#f1f5f9;--text-2:#94a3b8;--text-3:#64748b;--text-inv:#0a0f1a;
  --accent:#3b82f6;--accent-dim:rgba(59,130,246,0.12);--accent-hover:#60a5fa;
  --success:#10b981;--warning:#f59e0b;--error:#ef4444;
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
[data-theme="light"]{--bg:#f8fafc;--surface:#fff;--elevated:#f1f5f9;--text:#0f172a;--text-2:#475569;--text-3:#94a3b8;--text-inv:#fff;--border:rgba(0,0,0,0.08);--border-bold:rgba(0,0,0,0.15)}
```

**변경 요약**: `--bg`→딥네이비, `--accent`→블루, `--ch1~4` 퍼플/블루/그린/앰버, `--shadow-glow`→블루 글로우, JetBrains Mono 추가

### 2-2. styles/ 나머지 CSS (4파일 그대로 복사)

```bash
cp ~/dongseon-studio/styles/reset.css ~/koosy/styles/reset.css
cp ~/dongseon-studio/styles/animations.css ~/koosy/styles/animations.css
cp ~/dongseon-studio/styles/components.css ~/koosy/styles/components.css
cp ~/dongseon-studio/styles/landing.css ~/koosy/styles/landing.css
```

**수정점**: 없음. CSS 변수 기반이므로 tokens.css 변경만으로 색상 자동 적용.

### 2-3. 채널 CSS (4개)

gohsy 채널 CSS 구조 이식, 이름만 변경:

```bash
cp ~/dongseon-studio/styles/story.css ~/koosy/styles/project.css
cp ~/dongseon-studio/styles/material.css ~/koosy/styles/component.css
cp ~/dongseon-studio/styles/costume.css ~/koosy/styles/workshop.css
cp ~/dongseon-studio/styles/academy.css ~/koosy/styles/academy.css
```

**수정점 — project.css**:
- 클래스 접두어: `.story-` → `.project-` (전체 치환)
- `.story-hero` → `.project-hero` 등

**수정점 — component.css**:
- `.material-` → `.component-` (전체 치환)

**수정점 — workshop.css**:
- `.costume-` → `.workshop-` (전체 치환)

**수정점 — academy.css**:
- 변경 없음 (이미 academy)

### 2-4~2-7. channels/ HTML (4개)

4개 채널 페이지. gohsy 채널 HTML 구조 참조해서 koosy 맥락으로 새로 작성.

**공통 구조** (모든 채널 페이지):
```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CH{N} {Name} — KOOSY</title>
<meta name="description" content="{채널 설명}">
<meta name="theme-color" content="#0a0f1a">
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap">
<link rel="stylesheet" href="../styles/tokens.css">
<link rel="stylesheet" href="../styles/reset.css">
<link rel="stylesheet" href="../styles/components.css">
<link rel="stylesheet" href="../styles/animations.css">
<link rel="stylesheet" href="../styles/{channel}.css">
</head>
<body>

<!-- NAV -->
<nav class="nav">
  <a href="../" class="nav__brand">KOOSY</a>
  <div class="nav__channels">
    <a href="project.html" class="nav__ch" data-ch="ch1" style="--ch-color:var(--ch1)">CH1 Project</a>
    <a href="component.html" class="nav__ch" data-ch="ch2" style="--ch-color:var(--ch2)">CH2 Component</a>
    <a href="workshop.html" class="nav__ch" data-ch="ch3" style="--ch-color:var(--ch3)">CH3 Workshop</a>
    <a href="academy.html" class="nav__ch" data-ch="ch4" style="--ch-color:var(--ch4)">CH4 Academy</a>
  </div>
  <div class="nav__actions">
    <a href="../showroom/" class="nav__link">Showroom</a>
  </div>
</nav>

<!-- CONTENT: 채널별 본문 -->

<!-- FOOTER -->
<footer class="footer">
  <div class="container">
    <div class="footer__brand">KOOSY</div>
    <p class="footer__tagline">만들면서 배운다 — Build to Learn</p>
    <div class="footer__links">
      <a href="project.html" class="footer__link">Project</a>
      <a href="component.html" class="footer__link">Component</a>
      <a href="workshop.html" class="footer__link">Workshop</a>
      <a href="academy.html" class="footer__link">Academy</a>
      <a href="../" class="footer__link">Home</a>
    </div>
    <p class="footer__copy">&copy; 2026 KOOSY. All rights reserved.</p>
  </div>
</footer>

<div class="page-spacer"></div>
<script src="../js/app.js"></script>
<script src="../js/scroll-reveal.js"></script>
</body>
</html>
```

**CH1 Project** (`channels/project.html`) — "이걸로 뭘 만들 수 있나"
- 히어로: "PROJECT" 타이틀, --ch1 퍼플 액센트
- 프로젝트 3개 카드: LED 신호등, 온도 모니터, IoT 알림봇
- 각 카드: 프로젝트명, 난이도, 소요시간, 간단 설명

**CH2 Component** (`channels/component.html`) — 부품 해설
- 히어로: "COMPONENT" 타이틀, --ch2 블루 액센트
- ESP32 스펙 카드, 센서 목록, 저항/LED 선택 가이드

**CH3 Workshop** (`channels/workshop.html`) — 실습 워크숍
- 히어로: "WORKSHOP" 타이틀, --ch3 그린 액센트
- Step-by-step 가이드 (기존 chalkboard/ 참조)
- 프로젝트별 단계 리스트

**CH4 Academy** (`channels/academy.html`) — AI 코딩 강의
- 히어로: "ACADEMY" 타이틀, --ch4 앰버 액센트
- gohsy academy.html 구조 이식 (curriculum, lesson-entry 등)
- 레슨: Claude 활용법, ChatGPT 비교, 자동화 팁

### 2-8. js/app.js

```bash
cp ~/dongseon-studio/js/app.js ~/koosy/js/app.js
```

**수정점**:
- `window.GOHSY` → `window.KOOSY` (전체 치환)
- `COLOR_MAP` → 키트에는 불필요하지만 호환용 유지
- `CAT_ICONS` 변경:
```javascript
var CAT_ICONS={kit:'\uD83D\uDD27',course:'\uD83D\uDCDA',template:'\uD83E\uDD16',bundle:'\uD83D\uDCE6'};
```
- `getCatIcon` 수정: `cat.split('/')[0]` 으로 1단계 카테고리 참조

### 2-9. js/scroll-reveal.js, js/player-bar.js

```bash
cp ~/dongseon-studio/js/scroll-reveal.js ~/koosy/js/scroll-reveal.js
cp ~/dongseon-studio/js/player-bar.js ~/koosy/js/player-bar.js
```

**수정점 — scroll-reveal.js**: 없음
**수정점 — player-bar.js**:
- `CHANNEL_ORDER` 키 변경:
```javascript
var CHANNEL_ORDER = {
  showroom: ['plasticLove', ...],
  project: ['takeOnMe', ...],
  component: ['blueMonday', ...],
  workshop: ['sweetDreams', ...],
  academy: ['everyBreath', ...]
};
```

---

## Phase 3: Showroom + Templates

### 커밋: `feat: Phase 3 — 쇼룸 + 마켓플레이스 템플릿`

### 3-1. index.html 리라이트

기존 2559줄 → 새 구조. **기존 파일 전체를 새로 작성.**

핵심 구조:
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <!-- meta, PWA manifest, CSS imports (tokens, reset, components, animations, landing) -->
  <!-- JetBrains Mono + Pretendard 폰트 -->
</head>
<body>

<!-- LOADER -->
<div class="loader"><div class="loader__brand">KOOSY</div></div>

<!-- NAV (공통 구조) -->

<!-- HERO -->
<section class="hero">
  <div class="hero__bg"></div>
  <div class="hero__content">
    <h1 class="hero__brand">KOOSY</h1>
    <p class="hero__tagline">만들면서 배운다 — build to learn</p>
    <div class="hero__line"></div>
  </div>
  <div class="scroll-hint">
    <div class="scroll-hint__line"></div>
    <div class="scroll-hint__text">scroll</div>
  </div>
</section>

<!-- 4 CHANNEL GRID -->
<section class="channels-section">
  <div class="channel-grid">
    <!-- CH1 Project: 퍼플, "이걸로 뭘 만들 수 있나" -->
    <!-- CH2 Component: 블루, "부품 하나하나 알아보기" -->
    <!-- CH3 Workshop: 그린, "직접 만들어보기" -->
    <!-- CH4 Academy: 앰버, "AI로 코딩하기" -->
  </div>
</section>

<!-- ON AIR: 상품 카드 스크롤 (catalog/index.json fetch) -->
<section class="on-air">
  <div class="on-air__header container">
    <div class="on-air__label">
      <span class="on-air__dot"></span>
      <span class="section__label">Now Available</span>
    </div>
    <a href="showroom/" class="btn btn--sm"><span>모두 보기</span></a>
  </div>
  <div class="on-air__scroll" id="productScroll"></div>
</section>

<!-- STATEMENT: "왜 KOOSY 키트인가" (허생.exe 해자) -->
<section class="statement reveal">
  <div class="statement__text reveal-text">
    <span class="line" style="--i:0">중국 키트 15,000원 — <em>서랍행.</em></span>
    <span class="line" style="--i:1">KOOSY 29,900원 — 강의 + AI 템플릿 + 프로젝트 3개.</span>
    <span class="line" style="--i:2"><em>만들면서 배운다.</em></span>
  </div>
</section>

<!-- GUILD HQ 섹션 (기존 index.html에서 발췌 유지) -->
<!-- 12슬롯 길드 소개 — 기존 코드 재활용 -->

<!-- MARQUEE -->
<div class="marquee">
  <div class="marquee__inner">
    <span class="marquee__item">ESP32</span>
    <span class="marquee__item">IoT</span>
    <span class="marquee__item">Arduino</span>
    <span class="marquee__item">Claude AI</span>
    <span class="marquee__item">Build to Learn</span>
    <!-- 반복 -->
  </div>
</div>

<!-- FOOTER (공통) -->
<!-- PLAYER BAR -->

<script src="js/app.js"></script>
<script src="js/scroll-reveal.js"></script>
<script src="js/player-bar.js"></script>
<script>
// 상품 카드 렌더링 (catalog/index.json fetch)
(function(){
  if(!window.KOOSY)return;
  window.KOOSY.getCatalog().then(function(data){
    var scroll=document.getElementById('productScroll');
    if(!scroll||!data.products)return;
    var html='';
    data.products.forEach(function(p){
      var icon=window.KOOSY.getCatIcon(p.category);
      html+='<div class="on-air__item">';
      html+='<a href="showroom/lookbook/'+p.id+'.html" class="card" data-product-id="'+p.id+'">';
      html+='<div class="card__image"><div class="card__placeholder"><span class="card__placeholder-icon">'+icon+'</span></div>';
      html+='<span class="card__badge">'+p.difficulty+'</span></div>';
      html+='<div class="card__info"><div class="card__category">'+p.category+'</div>';
      html+='<div class="card__name">'+p.name+'</div>';
      html+='<div class="card__price">'+window.KOOSY.formatPrice(p.price)+'</div></div></a></div>';
    });
    scroll.innerHTML=html;
  });
})();
</script>
</body>
</html>
```

### 3-2. showroom/index.html

```bash
cp ~/dongseon-studio/showroom/index.html ~/koosy/showroom/index.html
```

**수정점**:
- 모든 `GOHSY` → `KOOSY`
- nav__brand: `GOHSY` → `KOOSY`
- nav__channels: story/material/costume/academy → project/component/workshop/academy
- CATEGORIES 변경:
```javascript
var CATEGORIES={kit:{label:'교육 키트',icon:'🔧'},course:{label:'강의 패키지',icon:'📚'},template:{label:'AI 템플릿',icon:'🤖'},bundle:{label:'번들 세트',icon:'📦'}};
```
- footer: tagline → "만들면서 배운다 — Build to Learn"
- CSS 경로 유지 (../styles/)
- `window.GOHSY` → `window.KOOSY`

### 3-3. showroom/console.html

```bash
cp ~/dongseon-studio/showroom/console.html ~/koosy/showroom/console.html
```

**수정점**:
- 타이틀: `GOHSY` → `KOOSY`
- HQ Sync: slot #9 → koosy 브랜치
- footer: `gohsy-fashion` → `koosy Phase 6`
- `catalogUrl`: 경로 유지 (../catalog/index.json)

### 3-4. showroom/lookbook/KS-001.html

Phase 6에서 generate-detail.js로 자동 생성 예정. 일단 플레이스홀더:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KS-001 ESP32 IoT 스타터 키트 — KOOSY</title>
<link rel="stylesheet" href="../../styles/tokens.css">
<link rel="stylesheet" href="../../styles/reset.css">
<link rel="stylesheet" href="../../styles/components.css">
</head>
<body>
<div class="container" style="padding:var(--sp-24) 0;text-align:center">
  <h1 style="font-size:var(--text-h1)">ESP32 IoT 스타터 키트</h1>
  <p style="color:var(--text-2);margin-top:var(--sp-4)">₩29,900 — 상세 페이지 준비 중</p>
  <a href="../" style="display:inline-block;margin-top:var(--sp-8);color:var(--accent)">← Showroom</a>
</div>
</body>
</html>
```

### 3-5~3-6. coupang/naver templates

파일: `~/koosy/coupang/templates/detail-standard.html`
파일: `~/koosy/coupang/templates/detail-education.html`
파일: `~/koosy/naver/templates/detail-standard.html`
파일: `~/koosy/naver/templates/detail-education.html`

공통 템플릿 구조:
```html
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><style>
  body{font-family:'Pretendard',sans-serif;max-width:860px;margin:0 auto;padding:20px;background:#fff;color:#222}
  .hero-img{width:100%;border-radius:8px}
  .title{font-size:28px;font-weight:800;margin:24px 0 8px}
  .price{font-size:24px;font-weight:700;color:#3b82f6}
  .badge{display:inline-block;padding:4px 12px;font-size:12px;font-weight:600;border-radius:4px;background:#eff6ff;color:#3b82f6}
  .section{margin:32px 0}
  .section h2{font-size:20px;margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid #3b82f6}
  .kit-list{list-style:none;padding:0}
  .kit-list li{padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:15px}
  .kit-list li::before{content:'✓ ';color:#10b981}
  .project-card{padding:16px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:12px}
  .project-card h3{font-size:16px;margin-bottom:4px}
  .project-card .meta{font-size:13px;color:#6b7280}
  .spec-table{width:100%;font-size:14px}
  .spec-table th{text-align:left;padding:8px;background:#f8fafc;width:120px}
  .spec-table td{padding:8px}
</style></head>
<body>
  <img class="hero-img" src="{{main_image}}" alt="{{name}}">
  <div class="badge">{{difficulty}}</div>
  <h1 class="title">{{name}}</h1>
  <div class="price">{{price_coupang}}</div>

  <div class="section">
    <h2>🔧 키트 구성품</h2>
    <h3>하드웨어</h3>
    <ul class="kit-list">{{kit_hardware}}</ul>
    <h3>디지털</h3>
    <ul class="kit-list">{{kit_digital}}</ul>
  </div>

  <div class="section">
    <h2>🚀 프로젝트 3개</h2>
    {{projects}}
  </div>

  <div class="section">
    <h2>📋 스펙</h2>
    <table class="spec-table">{{spec_table}}</table>
  </div>

  <div class="section" style="text-align:center;padding:24px;background:#f8fafc;border-radius:8px">
    <p style="font-size:18px;font-weight:700;margin-bottom:8px">만들면서 배운다</p>
    <p style="font-size:14px;color:#6b7280">KOOSY — Build to Learn</p>
    <p style="font-size:13px;color:#94a3b8;margin-top:4px">{{showroom_url}}</p>
  </div>
</body>
</html>
```

**detail-education.html**: 동일 구조에 "AI 활용 섹션" 추가 — Claude 프롬프트 예시 섹션 포함

네이버 템플릿: 동일 구조, 네이버 스타일 가이드 준수 (max-width: 740px)

### 3-7. youtube/templates/ (4종)

파일: `~/koosy/youtube/templates/unboxing.json`
```json
{
  "series": "A",
  "name": "개봉기",
  "title_template": "{{price}} 교육키트 뜯어보기 — {{name}} | KOOSY",
  "description_template": "KOOSY 교육 키트 개봉기!\n\n구성품:\n{{kit_contents}}\n\n프로젝트 3개:\n{{projects}}\n\n🛒 구매: {{coupang_url}}\n📚 강의: {{showroom_url}}\n\n#KOOSY #교육키트 #ESP32 #IoT",
  "category_id": "28",
  "tags": ["koosy", "교육키트", "개봉기", "ESP32", "IoT"]
}
```

유사하게 `tutorial.json`, `ai-coding.json`, `showcase.json` 작성.

### 3-8~3-10. 나머지

GPU 템플릿 변수 매핑 — Phase 1에서 이미 처리 (generate-detail.js 수정).
content/ 디렉토리 — 빈 디렉토리 + `.gitkeep`:

```bash
touch ~/koosy/content/unboxing/.gitkeep
touch ~/koosy/content/tutorials/.gitkeep
touch ~/koosy/content/ai-coding/.gitkeep
touch ~/koosy/content/showcase/.gitkeep
```

---

## Phase 4: 기존 콘텐츠 재활용

### 커밋: `refactor: Phase 4 — 기존 콘텐츠 커머스 전환`

### 4-1. config.json 업데이트

기존 `~/koosy/config.json` 에서 변경:

```json
{
  "site": {
    "name": "KOOSY",
    "domain": "koosy.kr",
    "url": "https://koosy.kr",
    "description": "만들면서 배우는 교육 키트 쇼핑몰",
    "tagline": "만들면서 배운다 — Build to Learn",
    "established": "2026.01.13",
    "themeColor": "#3b82f6"
  },
  "service": {
    "title": "교육 키트 + AI 강의",
    "subtitle": "하드웨어 키트 + Claude AI 프롬프트 + 영상 강의 번들",
    "categories": ["kit", "course", "template", "bundle"]
  }
}
```

**나머지 키 (owner, guild, staff, console, pr, pricing, pwa, card, meta) 유지**, `themeColor`만 `#D4AF37` → `#3b82f6`

### 4-2. branch.json 업데이트

```json
{
  "area": "commerce-education",
  "theme": {
    "primary": "#3b82f6",
    "accent": "#10b981",
    "bg": "#0a0f1a",
    "text": "#f1f5f9"
  },
  "features": ["edu-kit", "commerce", "workshop", "ai-coding"]
}
```

나머지 키 유지.

### 4-3. chalkboard/ → Workshop 칠판 전환

`~/koosy/chalkboard/board.json` 수정:

```json
{
  "title": "KOOSY Workshop — 오늘의 프로젝트",
  "topics": [
    { "id": 1, "title": "LED 신호등 만들기", "difficulty": "beginner", "time": "30분", "kit": "KS-001" },
    { "id": 2, "title": "온도 모니터 만들기", "difficulty": "beginner", "time": "45분", "kit": "KS-001" },
    { "id": 3, "title": "IoT 알림봇 만들기", "difficulty": "intermediate", "time": "60분", "kit": "KS-001" }
  ],
  "quickLinks": [
    { "label": "Showroom", "url": "/showroom/" },
    { "label": "Academy", "url": "/channels/academy.html" },
    { "label": "GitHub", "url": "https://github.com/dtslib1979/koosy" }
  ]
}
```

### 4-4. console/ 수정

`~/koosy/console/billing.html` — 기존 구조 유지하되 "상품 매출 대시보드" 링크 추가:
- 상단에 `<a href="/showroom/console.html">커머스 Analytics →</a>` 링크 추가

### 4-5. tools/margin-calc/index.html

새 파일: `~/koosy/tools/margin-calc/index.html`

간단한 계산기 HTML (single-file, 기존 tools/ 스타일과 일관):
- 입력: 1688 원가(CNY), 환율, 물류비
- 계산: 원가(KRW), 마진율, 손익분기점
- 출력: 쿠팡/네이버 판매가 시뮬레이션
- 순수 HTML/JS (프레임워크 없음)

### 4-6. workstation/ 이식

```bash
cp ~/dongseon-studio/workstation/index.html ~/koosy/workstation/index.html
cp ~/dongseon-studio/workstation/dashboard.html ~/koosy/workstation/dashboard.html
cp ~/dongseon-studio/workstation/app.js ~/koosy/workstation/app.js
cp ~/dongseon-studio/workstation/style.css ~/koosy/workstation/style.css
```

**수정점 전체**:
- `GOHSY` → `KOOSY` (전역 치환 — HTML, JS, CSS 모두)
- `gohsy_ws_` → `koosy_ws_` (localStorage 키)
- workstation/app.js:
  - `HASH` 값 유지 (같은 비밀번호 1126 사용)
  - `fetch('../catalog/index.json')` 경로 유지 (동일 구조)
  - `fetch('../analytics/dashboard.json')` 경로 유지
  - Style Master: `fetch('../catalog/style-db/index.json')` → 없으면 빈 상태 OK
- Quick Links: "Coupang Wing", "Naver Commerce", "YouTube Studio" 유지
  - "GOHSY Console" → "KOOSY Console" (`../console/`)
- workstation/style.css:
  - `--accent:#2E7D52` → `--accent:#3b82f6` (테크 블루)
  - `--accent-hover:#3A9966` → `--accent-hover:#60a5fa`

### 4-7. manifest.json 업데이트

`~/koosy/manifest.json` (루트):
```json
{
  "name": "KOOSY",
  "short_name": "KOOSY",
  "description": "만들면서 배운다 — Build to Learn",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0f1a",
  "theme_color": "#3b82f6",
  "icons": [
    { "src": "assets/1.jpg", "sizes": "192x192", "type": "image/jpeg", "purpose": "any maskable" },
    { "src": "assets/1.jpg", "sizes": "512x512", "type": "image/jpeg", "purpose": "any maskable" }
  ]
}
```

`~/koosy/assets/manifest.json`도 동일 내용으로 업데이트.

### 4-8. sitemap.xml 업데이트

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://koosy.kr/</loc><lastmod>2026-03-05</lastmod><priority>1.0</priority></url>
  <url><loc>https://koosy.kr/showroom/</loc><lastmod>2026-03-05</lastmod><priority>0.9</priority></url>
  <url><loc>https://koosy.kr/channels/project.html</loc><lastmod>2026-03-05</lastmod><priority>0.8</priority></url>
  <url><loc>https://koosy.kr/channels/component.html</loc><lastmod>2026-03-05</lastmod><priority>0.8</priority></url>
  <url><loc>https://koosy.kr/channels/workshop.html</loc><lastmod>2026-03-05</lastmod><priority>0.8</priority></url>
  <url><loc>https://koosy.kr/channels/academy.html</loc><lastmod>2026-03-05</lastmod><priority>0.8</priority></url>
  <url><loc>https://koosy.kr/card/</loc><lastmod>2026-03-05</lastmod><priority>0.7</priority></url>
</urlset>
```

---

## Phase 5: Scripts + HQ 연동

### 커밋: `feat: Phase 5 — HQ 연동 + 허생.exe 해자 전략`

### 5-1. scripts/sync-to-papyrus.sh

```bash
cp ~/dongseon-studio/scripts/sync-to-papyrus.sh ~/koosy/scripts/sync-to-papyrus.sh
chmod +x ~/koosy/scripts/sync-to-papyrus.sh
```

**수정점**:
- `FORMULA_COUNT` 라인 삭제 (koosy에 style-db 없음)
- `state.lines['fashion-commerce']` → `state.lines['education-commerce']`
- 커밋 메시지: `"sync: koosy → papyrus"`

### 5-2. scripts/generate-report.sh

파일: `~/koosy/scripts/generate-report.sh`

```bash
#!/usr/bin/env bash
# generate-report.sh — 월간 KPI 집계
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "=== generate-report ==="
node "${ROOT}/analytics/collector.js" --channel all
echo "=== report complete ==="
```

```bash
chmod +x ~/koosy/scripts/generate-report.sh
```

### 5-3. core/version.json 범프

```json
{
  "core": "2.0.0",
  "compatible": ["1.0.0", "2.0.0"],
  "updated": "2026-03-05",
  "modules": {
    "auth": "1.0.0",
    "registry": "1.0.0",
    "storage": "1.0.0",
    "pr": "1.0.0",
    "hq": "1.0.0"
  }
}
```

### 5-4. core/hq/reporter.js

기존 파일에 커머스 데이터 추가. 기존 `reporter.js` 읽은 뒤 말미에 커머스 리포팅 함수 추가:
```javascript
// 커머스 매출 데이터 집계 (v2.0 추가)
function getCommerceMetrics() {
  try {
    const dashboard = require('../../analytics/dashboard.json');
    return {
      revenue: dashboard.kpi.total_revenue,
      orders: dashboard.kpi.total_orders,
      products_live: dashboard.kpi.products_live,
      channels: dashboard.channels
    };
  } catch(e) {
    return null;
  }
}
```

### 5-5. docs/MOAT-STRATEGY.md

파일: `~/koosy/docs/MOAT-STRATEGY.md`

```markdown
# KOOSY 3가지 해자 전략

> 허생.exe 비즈니스 모델에서 이식

## 1. 콘텐츠 해자

- 키트당 강의 3편 + AI 프롬프트 템플릿 3종
- 중국 키트 = 부품만 → 완성률 20% (서랍행)
- KOOSY 키트 = 부품 + 강의 + AI → 완성률 90%+
- **복제 불가**: 강의 + 프롬프트 + 프로젝트 가이드 번들

## 2. 커뮤니티 해자

- 12슬롯 길드 (기존 인프라)
- YouTube 구독자 커뮤니티
- 사용자 프로젝트 쇼케이스

## 3. 속도 해자

- Claude Code로 강의 자동 생성
- 경쟁사: 새 키트 가이드 2주
- KOOSY: 새 키트 가이드 1일
- **Redis 트렌드 → 24시간 내 상품화**

## 비교

| 항목 | 중국 키트 | KOOSY 키트 |
|------|----------|-----------|
| 가격 | ₩15,000 | ₩29,900 |
| 내용물 | 부품만 | 부품 + 강의 + AI |
| 완성률 | ~20% | ~90% |
| 마진 | 가격 경쟁 | 51.5% |
| 방어력 | 없음 | 3중 해자 |
```

### 5-6. CLAUDE.md v4.0

기존 CLAUDE.md를 v4.0으로 업데이트. **기존 헌법 제1조/제2조 유지** + 아키텍처/커머스 섹션 추가.

**추가 섹션**:
```markdown
## 아키텍처 — 4채널 루프백

PRODUCT_CARD → 에셋 생성 → GPU 렌더 → 4채널 동시 배포 → 매출 → 다음 PRODUCT_CARD

채널: 쿠팡(키트) / 네이버(디지털) / YouTube(강의) / koosy.kr(쇼룸)

## PRODUCT_CARD = Single Source of Truth

catalog/products/KS-XXX/card.json 이 모든 것의 시작점.
card.json 없이 등록 금지 (헌법 제2조).

## 절대 규칙

| 금지 | 이유 |
|------|------|
| .credentials/ 커밋 | 인증 정보 유출 |
| queue/ 수동 편집 | orchestrator가 관리 |
| analytics/*.jsonl 삭제 | append-only 원장 |
| PRODUCT_CARD 없이 등록 | BOM 없는 착공 = 헌법 위반 |

## 기존 유지
- 12슬롯 길드 시스템 (core/, staff/, console/, slots/)
- HQ 연동 (dtslib-papyrus)
- ConsoleGate 인증 (1126)
```

**Version**: 3.0 → 4.0, Co-Authored-By: Claude Opus 4.6

---

## Phase 6: 첫 상품 검증

### 커밋: `feat: Phase 6 — KS-001 첫 상품 검증 완료`

### 6-1~6-3. 렌더링

```bash
cd ~/koosy
node gpu/detail-renderer/generate-detail.js KS-001 --channel coupang --template education
node gpu/detail-renderer/generate-detail.js KS-001 --channel naver --template education
```

→ `coupang/rendered/KS-001.html`, `naver/rendered/KS-001.html` 생성

### 6-4. showroom/lookbook/KS-001.html

generate-detail.js 출력 기반으로 showroom 버전 생성. 또는 수동 작성.

### 6-5. orchestrator.js --dry-run

```bash
cd ~/koosy
node automation/orchestrator.js KS-001 --dry-run
```

4채널 모두 통과 확인.

---

## 검증 체크리스트

```
[ ] git mv philosophy/ affiliates/ articles/ → legacy/ 완료
[ ] FACTORY.json 생성 완료
[ ] catalog/ (categories.json + index.json + KS-001/card.json) 완료
[ ] pipeline/ (flow.json + content-matrix.json + sourcing-model.json) 완료
[ ] automation/ (orchestrator + 4 adapters + engine) 복사+수정 완료
[ ] analytics/ (collector + dashboard + 4 JSONL) 완료
[ ] gpu/ (generate-detail + render-video + ffmpeg-builder) 복사+수정 완료
[ ] styles/ (tokens 블루 + reset + animations + components + landing + 4채널 CSS) 완료
[ ] js/ (app KOOSY 전역 + scroll-reveal + player-bar) 완료
[ ] channels/ (project + component + workshop + academy HTML) 완료
[ ] showroom/ (index + console + lookbook/KS-001) 완료
[ ] workstation/ (4파일 KOOSY 브랜딩) 완료
[ ] index.html 리라이트 완료
[ ] config.json + branch.json 업데이트 완료
[ ] manifest.json + sitemap.xml 업데이트 완료
[ ] CLAUDE.md v4.0 완료
[ ] scripts/ (sync-to-papyrus + generate-report) 완료
[ ] tools/margin-calc/ 완료
[ ] core/version.json v2.0.0 완료
[ ] docs/MOAT-STRATEGY.md 완료
[ ] .gitignore 업데이트 완료
[ ] orchestrator.js KS-001 --dry-run 통과
[ ] 기존 staff/ console/ slots/ core/ 정상 동작 확인
```

---

## 커밋 전략 (7 커밋)

```
1. migration: Phase 0 — legacy 아카이브 + 커머스 스캐폴딩
2. feat: Phase 1 — catalog + pipeline + automation 코어
3. feat: Phase 2 — 디자인 시스템 + 4채널 페이지
4. feat: Phase 3 — 쇼룸 + 마켓플레이스 템플릿
5. refactor: Phase 4 — 기존 콘텐츠 커머스 전환
6. feat: Phase 5 — HQ 연동 + 허생.exe 해자 전략
7. feat: Phase 6 — KS-001 첫 상품 검증 완료
```

모든 커밋에: `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`

---

*본 문서는 Sonnet 실행 전용 가이드. 위에서 아래로 순서대로 실행.*
*헌법 제2조 3항: BOM 확인 후 착공한다.*
