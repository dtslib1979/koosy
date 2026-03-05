# KOOSY 커머스 전환 계획 — 교육 키트 쇼핑몰 + 강의 번들

> 허생.exe 비즈니스 모델 + koosy 강의 인프라 + gohsy-fashion 보일러플레이트
> ZONE G BRANCH → ZONE D PRODUCTION 승급

**작성일:** 2026-03-05
**선례:** gohsy-fashion (WS-11), papafly 계획서 참조

---

## 1. 컨셉 전환

**From**: KOOSY "AI 쓰는 과외 선생 12슬롯 길드" (서비스 only)
**To**: KOOSY "만들면서 배우는 교육 키트 쇼핑몰" (커머스 + 강의)

**핵심 모델 (허생.exe에서 이식):**
```
미국(Brain): Reddit/GitHub 트렌드 발굴
중국(Body): 1688/타오바오 부품 소싱 (원가 5,000원)
한국(Mouth): AI 프롬프트 템플릿 + 강의 번들 = 29,900원 판매
```

**tagline**: "만들면서 배운다 — Build to Learn"

---

## 2. 상품 구조

### 허생.exe 모델 적용

| 구분 | 일반 중국 키트 | KOOSY 키트 |
|------|-------------|-----------|
| 내용물 | 부품만 | 부품 + Claude AI 프롬프트 + 영상 강의 + 프로젝트 3개 |
| 완성률 | 20% (서랍행) | 90%+ |
| 가격 | 15,000원 | 29,900원 |
| 마진 | 없음 (가격 경쟁) | 51.5% (콘텐츠 해자) |

### 상품 카테고리

```json
{
  "kit": {
    "label": "교육 키트",
    "subcategories": ["esp32", "arduino", "raspberry_pi", "sensor", "robot"],
    "icon": "🔧",
    "note": "하드웨어 + 강의 번들"
  },
  "course": {
    "label": "강의 패키지",
    "subcategories": ["beginner", "intermediate", "project", "ai_coding"],
    "icon": "📚",
    "note": "PDF 워크북 + 영상 + AI 프롬프트 템플릿"
  },
  "template": {
    "label": "AI 템플릿",
    "subcategories": ["claude", "chatgpt", "gemini", "automation"],
    "icon": "🤖",
    "note": "프롬프트 팩 (디지털, 재고 0, 마진 100%)"
  },
  "bundle": {
    "label": "번들 세트",
    "subcategories": ["starter", "maker", "pro"],
    "icon": "📦",
    "note": "키트 + 강의 + 템플릿 올인원"
  }
}
```

### 수익 구조 (단위당)

| 상품 | 판매가 | 원가 | 물류비 | 순이익 | 마진율 |
|------|--------|------|--------|--------|--------|
| ESP32 스타터 키트 | 29,900 | 5,000 | 6,500 | 15,400 | 51.5% |
| 강의 패키지 (디지털) | 19,900 | 0 | 0 | 19,900 | 100% |
| AI 템플릿 팩 (디지털) | 9,900 | 0 | 0 | 9,900 | 100% |
| 메이커 번들 (키트+강의+템플릿) | 49,900 | 5,000 | 6,500 | 35,400 | 70.9% |

---

## 3. 채널 매핑

| CH | gohsy 원본 | koosy 전환 | 내용 |
|----|-----------|-----------|------|
| CH1 | Story | **Project** | 프로젝트 스토리. "이걸로 뭘 만들 수 있나" |
| CH2 | Material | **Component** | 부품 해설. ESP32/센서/모터 스펙, 선택 가이드 |
| CH3 | Costume | **Workshop** | 실습 워크숍. 만드는 과정 step-by-step |
| CH4 | Academy | **Academy** | AI 코딩 강의. Claude/ChatGPT 활용법 |

### 4채널 쇼핑몰 분배

| 채널 | 상품 | 이유 |
|------|------|------|
| **쿠팡** | 키트 (하드웨어) | 로켓배송, 검색 유입 |
| **네이버** | 강의+템플릿 (디지털) | 스마트스토어 디지털 상품, 블로그 연동 |
| **YouTube** | 강의 영상 (무료 미리보기) | 유입 퍼널, 광고 수익 |
| **koosy.kr** | 전체 쇼룸 + 번들 | 브랜드 허브, 프리미엄 번들 전용 |

---

## 4. PRODUCT_CARD 스키마 (교육 키트 특화)

gohsy 스키마 유지 + 교육 전용 필드:

```json
{
  "schema_version": "1.0",
  "product_id": "KS-001",
  "name": "ESP32 IoT 스타터 키트",
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

---

## 5. 콘텐츠 매트릭스 (교육 특화)

| Type | Label | 채널 활용 |
|------|-------|----------|
| `unboxing` | 키트 개봉 | 쿠팡: 상세페이지, YouTube: 시리즈A, 쇼룸: 갤러리 |
| `tutorial` | 만들기 강의 | YouTube: 시리즈B(핵심), 네이버: 블로그, 쇼룸: Workshop |
| `ai_coding` | AI 코딩 | YouTube: 시리즈C, 네이버: 디지털 상품 미리보기, 쇼룸: Academy |
| `showcase` | 완성작 데모 | YouTube: 쇼츠, 쿠팡: 상세 하단, 쇼룸: Project |

### YouTube 시리즈

| 시리즈 | 내용 | 수익 연결 |
|--------|------|----------|
| A. 개봉기 | "29,900원 키트 뜯어보기" | 쿠팡 링크 |
| B. 만들기 | "30분 만에 IoT 완성" (핵심) | 키트 구매 유도 |
| C. AI 코딩 | "Claude한테 코드 시키기" | 템플릿 팩 판매 |
| D. 쿠씨의 과외 | 기존 수학과외 + AI 활용 | 강의 패키지 판매 |

---

## 6. 디자인 토큰

```css
:root {
  --bg: #0a0f1a;           /* 딥 네이비 (테크/교육 느낌) */
  --surface: #111827;       /* 다크 슬레이트 */
  --elevated: #1f2937;
  --accent: #3b82f6;        /* 블루 (신뢰/교육) */
  --accent-dim: rgba(59,130,246,0.12);
  --secondary: #10b981;     /* 그린 (성공/완성) */
  --warning: #f59e0b;       /* 앰버 (주의/팁) */
  --text: #f1f5f9;
  --text-2: #94a3b8;
  --text-3: #64748b;
  --ch1: #8b5cf6;  /* Project — 퍼플 */
  --ch2: #3b82f6;  /* Component — 블루 */
  --ch3: #10b981;  /* Workshop — 그린 */
  --ch4: #f59e0b;  /* Academy — 앰버 */
}
```
폰트: `JetBrains Mono` (코드), `Pretendard` (본문)

---

## 7. 기존 파일 처리

### KEEP + ADAPT
- `CNAME` (koosy.kr)
- `core/` 전체 (HQ 거버넌스)
- `staff/` (관리자 포탈)
- `console/` (빌링, 리퀘스트 — 주문관리로 전환)
- `chalkboard/` → Workshop 칠판으로 전환 (만들기 가이드)
- `modules/` → 상품 모듈 관리로 전환
- `slots/` → 길드 슬롯 유지 (과외 선생 길드)
- `config.json`, `branch.json` — 아이덴티티 업데이트
- `project/` → 프로젝트 쇼케이스로 전환

### ARCHIVE (legacy/)
- `philosophy/` (구 브랜드 철학)
- `affiliates/` (구 제휴)
- `articles/` (구 기사)

### NEW (gohsy-fashion 이식)
- `catalog/` — categories.json, index.json, products/KS-001/card.json
- `channels/` — project.html, component.html, workshop.html, academy.html
- `showroom/` — index.html, lookbook/, console.html
- `coupang/` `naver/` `youtube/` — queue/, rendered/, templates/
- `automation/` — orchestrator.js + 4 adapters
- `pipeline/` — flow.json, content-matrix.json
- `analytics/` — collector.js, dashboard.json, *.jsonl
- `styles/` — tokens.css(테크 블루), reset/components/animations
- `js/` — app.js, scroll-reveal.js, player-bar.js
- `workstation/` — index.html, dashboard.html, app.js
- `FACTORY.json`
- `index.html` — 메인 랜딩 리라이트

---

## 8. 허생.exe 이식 항목

buddies.kr에서 koosy로 이식하는 비즈니스 로직:

| buddies.kr 원본 | koosy 이식 | 용도 |
|----------------|-----------|------|
| 정보 시차 거래 모델 | `pipeline/sourcing-model.json` | 소싱→번들→판매 파이프라인 |
| 3가지 해자 전략 | `docs/MOAT-STRATEGY.md` | 콘텐츠/커뮤니티/속도 해자 |
| EduArt 키트 컨셉 | `catalog/products/KS-001/` | 첫 번째 상품 |
| 원가/마진 계산 | `tools/margin-calc/` (quick-calc 전환) | JPY/CNY→KRW 환산 |
| 산학연계 모델 | `slots/` 길드에 통합 | 공대생 리크루팅 |

---

## 9. 3가지 해자 (허생.exe → koosy 적용)

| 해자 | 허생.exe 원본 | koosy 적용 |
|------|-------------|-----------|
| **콘텐츠** | 월 10개 신규 프로젝트 | 키트당 강의 3편 + AI 템플릿 — 따라올 수 없는 번들 |
| **커뮤니티** | 디스코드 500명 | 12슬롯 길드 + YouTube 구독자 커뮤니티 |
| **속도** | 신제품 24시간 내 가이드 | Claude Code로 강의 자동 생성 — 경쟁사 2주 vs 1일 |

---

## 10. 실행 순서 (6 Phase)

### Phase 0: Archive + Scaffold
- legacy/ 생성, 구 파일 이동
- 디렉토리 스캐폴딩
- CLAUDE.md, FACTORY.json 업데이트

### Phase 1: Catalog + Pipeline
- categories.json, index.json, KS-001 샘플 card.json
- pipeline/flow.json, content-matrix.json, sourcing-model.json
- automation/orchestrator.js + 4 adapters
- analytics/ 스텁

### Phase 2: Design System + Channel Pages
- styles/tokens.css (테크 블루 팔레트)
- 4채널 HTML + CSS
- js/ 이식

### Phase 3: Showroom + Templates
- index.html 리라이트
- showroom/, coupang/naver templates
- youtube templates 4종

### Phase 4: 기존 콘텐츠 재활용
- chalkboard → Workshop 칠판
- console → 주문관리
- quick-calc → 마진 계산기 (CNY→KRW)
- workstation/ 이식

### Phase 5: HQ 연동 + 허생.exe 이식
- scripts/sync-to-papyrus.sh
- 해자 전략 문서
- 소싱 모델 JSON
- .github/workflows/deploy.yml

### Phase 6: 첫 상품 검증
- KS-001 풀 카드 + rendered HTML
- orchestrator.js --dry-run

---

## 11. 듀얼 수익 구조

```
Lane A: 커머스 매출 (본업)
├── 쿠팡: 하드웨어 키트
├── 네이버: 디지털 강의/템플릿
└── koosy.kr: 프리미엄 번들

Lane B: YouTube + 강의 (부산물)
├── 강의 영상 = 광고 수익
├── 만드는 과정 = 콘텐츠
└── AI 코딩 시연 = 템플릿 판매 퍼널

Lane C: 길드 (기존 유지)
├── 12슬롯 과외 길드
└── 월 구독 수익

= 트리플 수익
```

---

## 12. 검증

- koosy.kr 접속 → 교육 키트 쇼핑몰 랜딩
- 4채널(project/component/workshop/academy) 페이지
- catalog/index.json fetch → 상품 카드 렌더링
- showroom/lookbook/KS-001.html 상품 상세
- workstation/ 비밀번호 게이트 (1126)
- margin-calc CNY→KRW 환산
- orchestrator.js KS-001 --dry-run 통과
- 모바일 반응형

---

*본 문서는 리팩토링 BOM. 헌법 제2조 3항: BOM 확인 후 착공한다.*
