# KOOSY 에이전트 프로토콜 v3.0

> 이 문서는 Claude Code가 koosy 레포지토리에서 작업할 때 따라야 하는 가이드입니다.

---

## 1. Branch Identity (2-Axis System)

| 축 | 값 | 설명 |
|----|-----|------|
| **Governance** | `collaborator` | HQ와 강하게 연동. 구조/룰/업데이트 HQ 주도 |
| **Cognitive** | `hybrid` | Creator 기반 + Builder 성향 공존 |

### HQ Access 권한
```
✅ templates    - 페이지/컴포넌트 템플릿
✅ sync         - HQ 동기화 시스템
✅ claude-code  - Claude Code 에이전트 접근
✅ broadcast    - 방송/강의 시스템
```

### 캐릭터 프로필
- **욕망**: 글 쓰기 + Claude Code 호기심
- **제약**: 시간 적음
- **전략**: HQ 주도 필요, 템플릿 활용 극대화

---

## 2. 프로젝트 개요

### 목적
셀럽 스토리 편집 방송 - 블러핑 기반 편집 콘텐츠 플랫폼

### Focus 영역
- 방송/셀럽 콘텐츠
- 매크로 금융
- 금속 투자

### 기술 스택
- 순수 정적 사이트 (HTML/CSS/JS)
- GitHub Pages 호스팅

---

## 3. HQ 연동

이 프로젝트는 **DTSLIB HQ**에서 관리됩니다.

| 항목 | 값 |
|------|-----|
| **본사 레포** | dtslib1979/dtslib-branch |
| **브랜치 ID** | koosy |
| **상태** | active |
| **공개** | public |
| **레지스트리** | `hq/registry/branches.json` |

---

## 4. 폴더 구조

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

## 5. 커밋 컨벤션

```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 업데이트
style: 디자인 변경
content: 콘텐츠 추가/수정
```

커밋 메시지 끝:
```
Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

---

## 6. Hybrid 타입 작업 가이드

### Creator 모드 (기본)
- 콘텐츠 작성, 아티클 편집
- 블로그/방송 자료 준비
- AI는 도우미로 활용

### Builder 모드 (확장)
- Claude Code로 자동화 구축
- 템플릿 커스터마이징
- HQ SDK 활용 가능

> **전환 기준**: 반복 작업 3회 이상 → Builder 모드로 자동화 검토

---

## 7. 작업 시 주의사항

1. 수정 전 반드시 `git pull` 실행
2. 커밋 메시지는 한글로 명확하게
3. 셀럽 관련 민감 정보 주의
4. 이미지 파일은 적절한 크기로 최적화

---

*Version: 3.0*
*Last Updated: 2026-01-26*
*Affiliation: DTSLIB HQ (Collaborator)*
