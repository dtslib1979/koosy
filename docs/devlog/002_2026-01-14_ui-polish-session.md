# 개발일지 #002

**날짜**: 2026-01-14
**작업자**: Claude Code
**브랜치**: `claude/evaluate-repo-structure-9dWsE`
**세션 효율**: 50% (10개 커밋 중 5개가 fix)

---

## 작업 요약

랜딩 페이지 UI 폴리싱: 히브리어 파피루스 배경, YouTube 임베드, 프리미엄 타이틀, 지문 버튼 개선

---

## 변경 목록

### 1. 히브리어 파피루스 배경

| 파일 | 변경 내용 |
|------|----------|
| `index.html` | `.graph-container::before`에 창세기 1장 히브리어 텍스트 배경 |
| `index.html` | `.articles-showcase::after`에 히브리어 배경 (제거됨 → graph-container로 이동) |

### 2. YouTube 임베드 (로고 영역)

| 항목 | Before | After |
|------|--------|-------|
| 로고 형태 | 원형 100x100px | 가로 16:9 (max 320px) |
| 콘텐츠 | logo-video.mp4 | YouTube embed (2FaUlNhuvTA) |
| 로딩 UX | YouTube 로고 노출 | 썸네일 포스터 → 페이드인 |
| 끝 처리 | YouTube 로고 노출 | 1초 전 자동 재시작 |

### 3. 프리미엄 KOOSY 타이틀

| 항목 | Before | After |
|------|--------|-------|
| 폰트 | 시스템 기본 | Cinzel (Google Fonts) |
| 사이즈 | 24px | 32px |
| 효과 | 없음 | 금색 그라데이션 + shine 애니메이션 |

### 4. 지문 버튼 (Secret Office)

| 항목 | Before | After |
|------|--------|-------|
| 크기 | 40x40px | 80x80px (2배) |
| 아이콘 | 20px | 40px |
| 효과 | 없음 | goldShimmer 애니메이션 |

### 5. 태그라인 업데이트

| 파일 | Before | After |
|------|--------|-------|
| `index.html` | Bluffing based editing... | Not Content. Not Hype. A Standard for Real Money. |
| `card/index.html` | (동일) | Built on Gold. Measured in Silver. |

---

## 삽질 분석 & 교훈

### 문제 1: 히브리어 배경 안 보임 (커밋 5개 소요)

**증상**:
- pseudo-element 적용했는데 안 보임
- `.affiliates-section::before`가 `.graph-container` 덮음
- 텍스트 양 부족

**근본 원인**:
- CSS pseudo-element 기본 속성 누락 (`display: block`)
- 대상 요소 확인 안 함 (section vs container)
- 텍스트 양 계산 안 함

**해결**:
```css
.graph-container::before {
  content: '히브리어 텍스트...';
  display: block;
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  /* 부모에 position: relative 필수 */
}
```

**교훈**: pseudo-element는 `display`, `position`, 부모 `position: relative` 세트로 확인

---

### 문제 2: 캔버스 이미지 품질 저하 (커밋 2개 소요)

**증상**:
- 고화질 이미지가 흐릿하게 렌더링
- 원형 테두리와 이미지 사이 검은 갭

**근본 원인**:
- High DPI 디스플레이 대응 안 함
- 테두리를 이미지 아래에 그림

**해결**:
```javascript
var dpr = window.devicePixelRatio || 1;
canvas.width = w * dpr;
canvas.height = h * dpr;
ctx.scale(dpr, dpr);
// 테두리는 이미지 위에 그림
```

**교훈**: Canvas 작업 시 `devicePixelRatio` 기본 적용

---

### 문제 3: YouTube 로고 노출 (커밋 3개 소요)

**증상**:
- 페이지 로딩 시 YouTube 로고 보임
- 영상 끝날 때 YouTube 로고 보임

**해결**:
```javascript
// 로딩 시: 포스터 이미지로 가림
<div class="logo-poster"><img src="thumbnail.jpg"></div>
<iframe style="opacity:0">

// 재생 시작 시: 페이드인
function onPlayerStateChange(e) {
  if (e.data === YT.PlayerState.PLAYING) {
    iframe.classList.add('playing'); // opacity: 1
    poster.classList.add('hidden');
  }
}

// 끝 1초 전: 재시작
setInterval(() => {
  if (cur >= dur - 1) player.seekTo(0);
}, 500);
```

**교훈**: YouTube 임베드는 로딩/끝 상태 모두 처리 필요

---

### 문제 4: 버튼 사이즈 과대 (커밋 2개 소요)

**증상**: "3배"로 키웠는데 너무 큼

**근본 원인**: 구체적 픽셀값 확인 없이 바로 적용

**교훈**: 수치 변경 시 "40px → 120px (3배) 맞나요?" 확인 후 진행

---

## 퍼포먼스 평가

| 항목 | Claude | 유저 |
|------|--------|------|
| 요청 이해도 | 5/10 | 요청 명확성 6/10 |
| 코드 품질 | 7/10 | 피드백 속도 9/10 |
| 작업 속도 | 4/10 | - |

---

## 재발 방지 체크리스트

```
□ CSS pseudo-element → display, position, 부모 relative 확인
□ Canvas 이미지 → devicePixelRatio 기본 적용
□ YouTube 임베드 → 포스터 + API 상태 감지 + 끝 처리
□ 수치 변경 → 픽셀값 환산해서 확인 후 진행
□ 모호한 요청 → "~~ 맞나요?" 확인하고 진행
□ "블록 안에" → 정확히 어떤 클래스인지 확인
```

---

## 관련 커밋

| 커밋 | 메시지 |
|------|--------|
| `cf98905` | feat: update tagline - Not Content. Not Hype. A Standard for Real Money. |
| `f9d19d8` | fix: hide YouTube logo during loading - show thumbnail poster until video plays |
| `2314e8c` | feat: premium KOOSY title with Cinzel font + animated gold shine effect |
| `51aff66` | feat: horizontal YouTube frame + auto-restart 1sec before end to hide YouTube logo |
| `2536489` | feat: replace logo video with YouTube embed (2FaUlNhuvTA) |
| `b9a1985` | fix: reduce fingerprint button to 2x size (80px) |
| `fe5bb17` | feat: fill entire graph-container with Hebrew text + enlarge fingerprint button 3x |
| `b311a09` | fix: remove redundant Hebrew text outside graph-container |
| `240a77c` | fix: add Hebrew papyrus background inside graph-container dark green box |
| `6214680` | fix: fill entire background with repeated Hebrew text in Articles and Affiliates |

---

*작성: 2026-01-14 by Claude Code*
