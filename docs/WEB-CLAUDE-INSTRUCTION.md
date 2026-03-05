# KOOSY 커머스 전환 — Web Claude 실행 인스트럭션

## 너에게 주는 지시

이 레포(koosy)를 교육 키트 커머스 쇼핑몰로 전환한다.
모든 소스 코드는 `docs/IMPLEMENTATION-GUIDE.md`에 임베드되어 있다.
다른 레포 접근은 불가능하고 필요도 없다. 이 레포 안에서 전부 해결한다.

---

## 실행 순서

**반드시 Phase 순서대로 진행한다. 건너뛰기 금지.**

### Phase 0: Archive + Scaffold
1. `docs/IMPLEMENTATION-GUIDE.md`의 "Phase 0" 섹션을 읽는다
2. legacy/ 디렉토리를 만들고 기존 파일(philosophy/, affiliates/, articles/)을 이동한다
3. 새 디렉토리 구조를 스캐폴딩한다 (catalog/, channels/, showroom/, automation/, pipeline/, analytics/, gpu/, styles/, js/, workstation/, scripts/ 등)
4. 커밋: `migration: Phase 0 — legacy 아카이브 + 커머스 스캐폴딩`

### Phase 1: Catalog + Pipeline Core
1. `docs/IMPLEMENTATION-GUIDE.md`의 "Phase 1" 섹션을 읽는다
2. 가이드에 임베드된 소스 코드를 **그대로** 파일로 생성한다:
   - `FACTORY.json`
   - `catalog/categories.json`, `catalog/index.json`, `catalog/products/KS-001/card.json`
   - `pipeline/flow.json`, `pipeline/content-matrix.json`, `pipeline/sourcing-model.json`
   - `automation/orchestrator.js`, `automation/adapters/coupang.js`, `naver.js`, `youtube.js`, `showroom.js`
   - `automation/engine/screenshot.js`, `session.js`
   - `analytics/collector.js`, `analytics/dashboard.json`
   - `gpu/detail-renderer/generate-detail.js`, `gpu/render/render-video.js`, `gpu/render/ffmpeg-builder.js`
3. 가이드의 코드 블록을 그대로 복사해서 파일을 만든다. 수정하지 않는다.
4. 커밋: `feat: Phase 1 — catalog + pipeline + automation 코어`

### Phase 2: Design System + Channel Pages
1. `docs/IMPLEMENTATION-GUIDE.md`의 "Phase 2" 섹션을 읽는다
2. 가이드에 임베드된 소스 코드를 **그대로** 파일로 생성한다:
   - `styles/tokens.css`, `reset.css`, `components.css`, `animations.css`, `landing.css`
   - `js/app.js`, `js/scroll-reveal.js`
3. 채널 CSS 파일 4개는 가이드의 코드를 그대로 쓴다
4. 커밋: `feat: Phase 2 — 디자인 시스템 + 4채널 페이지`

### Phase 3: Showroom + Workstation
1. `docs/IMPLEMENTATION-GUIDE.md`의 "Phase 3" 섹션을 읽는다
2. 가이드에 임베드된 소스 코드를 **그대로** 파일로 생성한다:
   - `js/player-bar.js`
   - `showroom/index.html`, `showroom/console.html`
   - `workstation/index.html`, `workstation/dashboard.html`, `workstation/app.js`, `workstation/style.css`
3. 커밋: `feat: Phase 3 — 쇼룸 + 워크스테이션`

### Phase 4: 기존 콘텐츠 재사용
1. `docs/IMPLEMENTATION-GUIDE.md`의 "Phase 4" 섹션을 읽는다
2. 기존 파일 업데이트:
   - `config.json` — 태그라인, 서비스 섹션 변경
   - `branch.json` — area, theme, features 변경
   - `chalkboard/` — 교육키트 워크숍 전환
   - `console/` — 매출 대시보드 확장
   - `tools/margin-calc/` — CNY→KRW 마진 계산기 추가
   - `manifest.json` — PWA name, theme_color 변경
3. 커밋: `refactor: Phase 4 — 기존 콘텐츠 커머스 전환`

### Phase 5: 스크립트 + HQ 동기화
1. `docs/IMPLEMENTATION-GUIDE.md`의 "Phase 5" 섹션을 읽는다
2. 가이드에 임베드된 소스 코드를 **그대로** 파일로 생성한다:
   - `scripts/sync-to-papyrus.sh`
   - `scripts/generate-report.sh`
   - `scripts/validate-card.sh`
3. `core/version.json` 범프 (v1.0.0 → v2.0.0)
4. `core/hq/reporter.js` 업데이트
5. 커밋: `migration: Phase 5 — scripts 커머스 전환, HQ 동기화, card 검증`

### Phase 6: 첫 상품 검증
1. `docs/IMPLEMENTATION-GUIDE.md`의 "Phase 6" 섹션을 읽는다
2. `catalog/products/KS-001/card.json` 최종 완성
3. `catalog/index.json`에 KS-001 등록 확인
4. 검증 체크리스트 실행 (가이드 6-4절)
5. 커밋: `feat: Phase 6 — KS-001 첫 상품 등록, 파이프라인 검증`

---

## 절대 규칙

1. **`docs/IMPLEMENTATION-GUIDE.md`가 유일한 소스다.** 다른 레포 참조하지 마라.
2. **코드 블록은 그대로 복사한다.** 개선/리팩토링/최적화 하지 마라.
3. **Phase 순서 지킨다.** 건너뛰거나 합치지 마라.
4. **Phase마다 커밋 1개.** 커밋 메시지는 가이드에 명시된 것 사용.
5. **`.credentials/` 절대 커밋 금지.**
6. **`queue/`, `rendered/`, `analytics/*.jsonl` 수동 편집 금지.**
7. **PRODUCT_CARD 없이 채널 등록 금지.** card.json이 SoT(Single Source of Truth).
8. **`reset --hard` 금지.** 실수하면 `git revert`.

---

## 변환 매핑 (외울 것)

| gohsy (원본) | koosy (변환) |
|-------------|-------------|
| GOHSY | KOOSY |
| gohsy.com | koosy.kr |
| window.GOHSY | window.KOOSY |
| #2E7D52 (green) | #3b82f6 (blue) |
| outer/top/bottom/acc | kit/course/template/bundle |
| 🧥👕👖👜 | 🔧📚🤖📦 |
| real_model/webtoon/fantasy/cad | unboxing/tutorial/ai_coding/showcase |
| Story/Material/Costume/Academy | Project/Component/Workshop/Academy |
| PROD- | KS- |
| gohsy_ws_* | koosy_ws_* |

이 매핑은 이미 가이드 코드에 전부 반영되어 있다. 코드를 그대로 복사하면 된다.

---

## 컨텍스트 절약 팁

가이드가 3641줄이라 한 번에 다 못 읽는다. Phase별로 나눠서 읽어라:
- Phase 0: 34~72행 (짧다, bash 명령만)
- Phase 1: 73~1909행 (가장 길다, 파일 20개)
- Phase 2: 1910~2359행
- Phase 3: 2360~3022행
- Phase 4: 3023~3236행
- Phase 5: 3237~3494행
- Phase 6: 3495~3641행

Phase 1이 가장 무겁다. 파일 수가 많으니 한 번에 다 못 만들면 나눠서 해라:
- 1차: FACTORY.json + catalog/* + pipeline/* (73~600행 정도)
- 2차: automation/* (600~1400행 정도)
- 3차: analytics/* + gpu/* (1400~1909행 정도)

---

## 완료 기준

모든 Phase 커밋 후 다음을 확인:
- [ ] `catalog/index.json`에 KS-001 등록됨
- [ ] `showroom/index.html`에서 상품 카드 렌더링
- [ ] `workstation/` 비밀번호 게이트 작동 (1126)
- [ ] `styles/tokens.css`에 테크 블루 팔레트 적용
- [ ] 기존 `staff/`, `console/`, `slots/` 정상 동작
- [ ] `legacy/` 아카이브 접근 가능
