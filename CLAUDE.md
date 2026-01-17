# KOOSY 에이전트 프로토콜

> 이 문서는 Claude Code가 koosy 레포지토리에서 작업할 때 따라야 하는 가이드입니다.

---

## 1. 프로젝트 개요

### 목적
셀럽 스토리 편집 방송 - 블러핑 기반 편집 콘텐츠 플랫폼

### 기술 스택
- 순수 정적 사이트 (HTML/CSS/JS)
- GitHub Pages 호스팅

### 핵심 가치
- 셀럽 스토리텔링
- 블러핑 기반 편집
- 모바일 퍼스트

---

## 2. HQ 연동

이 프로젝트는 **DTSLIB HQ**에서 관리됩니다.

| 항목 | 값 |
|------|-----|
| **본사 레포** | dtslib1979/dtslib-branch |
| **브랜치 ID** | koosy |
| **상태** | active |
| **공개** | public |

### HQ 브랜치 레지스트리
`dtslib-branch/hq/registry/branches.json`에서 이 프로젝트 설정 확인 가능

---

## 3. 폴더 구조

```
koosy/
├── index.html              # 메인 페이지
├── config.json             # 설정 파일
├── CLAUDE.md               # 이 문서
├── CNAME                   # 커스텀 도메인
│
├── assets/
│   ├── manifest.json       # PWA 설정
│   └── icons/
│
├── articles/               # 아티클 콘텐츠
├── affiliates/             # 제휴 페이지
└── card/                   # 명함 페이지
```

---

## 4. 커밋 컨벤션

```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 업데이트
style: 디자인 변경
content: 콘텐츠 추가/수정
```

---

## 5. 작업 시 주의사항

1. 수정 전 반드시 `git pull` 실행
2. 커밋 메시지는 한글로 명확하게
3. 셀럽 관련 민감 정보 주의
4. 이미지 파일은 적절한 크기로 최적화

---

## 6. 주요 기능

- **셀럽 카드**: 셀럽 프로필 카드 컴포넌트
- **스토리 편집**: 블러핑 기반 스토리 편집
- **아티클**: 콘텐츠 아티클 관리

---

## 7. 배포

- **호스팅**: GitHub Pages
- **도메인**: koosy.kr (예정)
- **자동배포**: main 브랜치 push 시

---

*마지막 업데이트: 2026-01-17*
*소속: DTSLIB HQ*
