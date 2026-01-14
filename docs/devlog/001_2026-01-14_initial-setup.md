# 개발일지 #001

**날짜**: 2026-01-14
**작업자**: Claude Code
**브랜치**: `claude/evaluate-repo-structure-9dWsE`
**기반 템플릿**: buddies.kr → KOOSY

---

## 작업 요약

dtslib 보일러플레이트를 KOOSY 브랜딩으로 전환하고, 자동 아티클 피드 시스템 구축

---

## 변경 목록

### 1. 브랜딩 변경 (dtslib → KOOSY)

| 파일 | 변경 내용 |
|------|----------|
| `config.json` | site.name, card.name, tagline 전체 변경 |
| `assets/manifest.json` | PWA 앱 이름 변경 |
| `index.html` | 타이틀, OG 태그, 슬로건 변경 |
| `card/index.html` | 명함 정보 전체 변경 |
| `articles/index.html` | 헤더 브랜딩 변경 |

### 2. 에셋 추가

| 파일 | 용도 |
|------|------|
| `assets/icons/logo.jpg` | 파비콘, PWA 아이콘 |
| `assets/icons/logo-video.mp4` | 헤더 애니메이션 로고 |
| `assets/icons/profile.jpg` | 명함 프로필, OG 이미지 |
| `assets/icons/business-license.jpg` | 사업자등록증 모달 |

### 3. UI/UX 변경

| 항목 | Before | After |
|------|--------|-------|
| 슬로건 | "AI 업무 자동화" | "Real Money, Real World" |
| 설립일 | EST. 2024.04.24 | EST. 2026.01.13 |
| 슬로건 폰트 | 기본 | Cormorant Garamond (italic) |
| Films 영상 | 샘플 3개 | tHbaJXgj3Yg 1개 |
| HTMLPost 메뉴 | 있음 | 제거 |

### 4. 자동 아티클 피드 시스템

```
articles/*.html 업로드
    ↓
GitHub Action 실행 (.github/workflows/articles-feed.yml)
    ↓
articles.json 자동 생성 (title, description, date)
    ↓
index.html & articles/index.html 동적 로딩
```

**새로 추가된 파일**:
- `.github/workflows/articles-feed.yml` - 자동 피드 생성 Action
- `articles/articles.json` - 아티클 메타데이터 JSON

**수정된 파일**:
- `index.html` - Articles 카운터 배지, Latest Articles 피드 섹션
- `articles/index.html` - 동적 로딩 (하드코딩 → JS fetch)

---

## 발생한 문제 & 해결

### 문제 1: 로고 이미지 안 뜸
- **원인**: 코드에서 `logo.png` 참조, 실제 파일은 `logo.jpg`
- **해결**: 확장자 확인 후 경로 수정
- **소요 시간**: 15분 (확인 부족)

### 문제 2: 카카오톡 미리보기 이미지 안 뜸
- **원인**: `card/index.html`에 `og:image` 태그 누락
- **해결**: 전체 OG 태그 추가 (og:image, width, height, type)
- **소요 시간**: 20분

### 문제 3: Articles 페이지 정적 하드코딩
- **원인**: GitHub Action만 만들고 프론트엔드 연동 안 함
- **해결**: `articles/index.html`을 JS 동적 로딩으로 전환
- **소요 시간**: 30분

### 문제 4: GitHub Action 테스트 불가
- **원인**: Action이 `main` 브랜치에서만 트리거
- **해결**: PR 머지 후 확인 (사전 설명 필요)

---

## 다음 작업 시 체크리스트

```
□ 이미지 업로드 시 파일명/확장자 먼저 확인
□ OG 태그는 모든 public 페이지에 동시 적용
□ 동적 데이터 = JSON + JS fetch 세트로 구현
□ GitHub Action 트리거 조건 사전 설명
□ 수정 전 관련 파일 목록 먼저 파악
```

---

## 관련 커밋

| 커밋 | 메시지 |
|------|--------|
| `bfccf55` | fix: remove HTMLPost menu from dashboard |
| `dcf3caa` | feat: add auto article feed system |
| `ef8e884` | feat: dynamic article feed system with counter |

---

## 보일러플레이트 반영 필요 사항

1. **OG 태그 템플릿화**: 모든 public HTML에 기본 포함
2. **articles.json 초기 파일**: 빈 배열로 기본 생성
3. **GitHub Action 기본 포함**: articles-feed.yml
4. **동적 피드 JS**: index.html에 기본 포함
5. **에셋 네이밍 규칙**: logo.jpg, profile.jpg 등 표준화

---

*작성: 2026-01-14 by Claude Code*
