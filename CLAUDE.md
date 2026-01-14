# dtslib 에이전트 프로토콜

> 이 문서는 Claude Code가 dtslib-branch 레포지토리에서 작업할 때 따라야 하는 가이드입니다.

---

## 1. 프로젝트 개요

### 목적
AI 업무 자동화 컨설팅 서비스를 위한 랜딩페이지

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
dtslib-branch/
├── index.html              # 메인 랜딩페이지
├── config.json             # 중앙 설정 파일
├── CNAME                   # 커스텀 도메인 (dtslib.com)
├── robots.txt              # SEO
├── sitemap.xml             # 사이트맵
├── sw.js                   # Service Worker (PWA)
├── .nojekyll               # Jekyll 비활성화
│
├── assets/
│   ├── manifest.json       # PWA 설정
│   └── icons/
│       └── logo.png        # 앱 아이콘 (TODO: 추가 필요)
│
└── staff/
    └── index.html          # 스태프 포털 (비밀번호: 1126)
```

---

## 3. 설정 파일 (config.json)

모든 변수화된 값은 `config.json`에 집중되어 있습니다.

### 주요 설정
| 항목 | 현재 값 | 설명 |
|------|----------|------|
| `site.name` | dtslib 컨설팅 | 사이트명 |
| `site.domain` | dtslib.com | 도메인 |
| `owner.email` | dimas@dtslib.com | 연락처 |
| `service.price` | 25만원 / 2시간 | 서비스 가격 |
| `staff.accessCode` | 1126 | 스태프 포털 비밀번호 |

### 복제 시 변경 항목
1. `config.json` 수정
2. `CNAME` 파일 수정
3. `index.html` 내 하드코딩된 값 수정
4. `assets/manifest.json` 수정

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
3. Custom domain: `dtslib.com`

### DNS 설정
CNAME 레코드: `dtslib1979.github.io`

---

## 6. TODO

- [ ] 로고 이미지 추가 (`assets/icons/logo.png`)
- [ ] OG 이미지 추가
- [ ] DNS 설정 완료
- [ ] 추가 페이지 필요 시 확장

---

## 7. 보일러플레이트 기반

이 프로젝트는 `buddies.kr` 레포지토리를 기반으로 복제/변형되었습니다.

### 변경 사항
| buddies 원본 | dtslib 변경 |
|--------------|----------------|
| buddies.kr | dtslib.com |
| 로컨 핫플레이스 시스템 | AI 업무 자동화 세팅 |
| pro@buddies.kr | dimas@dtslib.com |
| Daniel/Justin/Thomas | DIMAS |
| 18 Holes 캐러셀 | 제거 |
| Portfolio 섹션 | 제거 |

---

*마지막 업데이트: 2026-01-12*
