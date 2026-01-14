# koosy 에이전트 프로토콜

> 이 문서는 Claude Code가 koosy 레포지토리에서 작업할 때 따라야 하는 가이드입니다.

---

## 1. 프로젝트 개요

### 목적
Bluffing based editing broadcasting CELEB story 서비스 랜딩페이지

### 기술 스택
- 순수 정적 사이트 (HTML/CSS/JS)
- GitHub Pages 호스팅
- PWA 지원

### 핵심 가치
- 모바일 퍼스트
- 서버 없이 독립 동작
- 변수화된 config로 쉽게 복제 가능

---

## 2. 폴더 구조

```
koosy/
├── index.html              # 메인 랜딩페이지
├── config.json             # 중앙 설정 파일
├── robots.txt              # SEO
├── sitemap.xml             # 사이트맵
├── .nojekyll               # Jekyll 비활성화
│
├── assets/
│   ├── manifest.json       # PWA 설정
│   └── icons/
│       └── logo.png        # 앱 아이콘
│
├── articles/               # 콘텐츠 아티클
├── card/                   # 명함 페이지
├── docs/                   # 문서
├── philosophy/             # 철학/컨셉
├── project/                # 프로젝트
├── staff/                  # 스태프 포털
├── studio/                 # 스튜디오
└── tools/                  # 유틸리티 도구
```

---

## 3. 설정 파일 (config.json)

모든 변수화된 값은 `config.json`에 집중되어 있습니다.

### 복제 시 변경 항목
1. `config.json` 수정
2. `index.html` 내 하드코딩된 값 수정
3. `assets/manifest.json` 수정

---

## 4. 커밋 컨벤션

```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 업데이트
style: 디자인 변경
refactor: 구조 개선
```

---

## 5. 배포

### GitHub Pages 설정
1. Settings → Pages
2. Source: `main` branch

---

## 6. TODO

- [ ] 로고 이미지 추가 (`assets/icons/logo.png`)
- [ ] OG 이미지 추가
- [ ] 콘텐츠 페이지 작성
- [ ] 커스텀 도메인 설정 (선택)

---

## 7. 보일러플레이트 기반

이 프로젝트는 `dtslib-branch` 레포지토리를 기반으로 복제/변형되었습니다.

### 변경 사항
| dtslib 원본 | koosy 변경 |
|-------------|------------|
| dtslib.com | koosy (도메인 미정) |
| AI 업무 자동화 | CELEB story broadcasting |
| dimas@dtslib.com | (이메일 미정) |
| DIMAS | KOOSY |

---

*마지막 업데이트: 2026-01-14*
