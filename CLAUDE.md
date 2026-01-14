# 🤖 CLAUDE.md – dtslib Agent Protocol

> **이 파일은 Claude Code 에이전트가 읽고 따라야 할 지침입니다.**

---

## 📁 레포지토리 개요

이 레포지토리는 **buddies.kr boilerplate**를 기반으로 만든 GitHub Pages 사이트입니다.

- **루트 index.html**: 메인 랜딩 페이지
- **staff/**: 스태프 전용 관리 포털 (비밀번호 보호)
- **card/**: 디지털 명함 페이지
- **tools/**: 각종 유틸리티 도구들
- **project/**: 프로젝트 소개 페이지
- **philosophy/**: 철학/원칙 페이지
- **docs/**: 문서 및 매뉴얼
- **articles/**: 아티클/블로그 목록
- **studio/**: 스튜디오 개요 페이지
- **assets/**: 이미지, 아이콘, 샘플 데이터

---

## 🔧 설정 파일

### config.json

중앙 설정 파일. 사이트 정보, 서비스 가격, 소유자 정보, 스태프 코드 등 포함.

```json
{
  "site": {
    "name": "사이트명",
    "domain": "example.com",
    "github_repo": "username/repo"
  },
  "service": {
    "name": "서비스명",
    "price": "가격",
    "duration": "소요시간"
  },
  "owner": {
    "name": "이름",
    "email": "이메일"
  },
  "staff": {
    "code": "스태프코드"
  }
}
```

---

## 📋 작업 규칙

### 1. 파일 수정 시

- **HTML 파일**: 인라인 CSS 또는 `<style>` 태그 사용
- **외부 라이브러리**: 최소화, CDN 사용 시 주석으로 출처 표기
- **모바일 우선**: `max-width: 500px` 기준 반응형
- **다크 테마**: `--bg: #0F1F15`, `--gold: #D4AF37` 색상 시스템 유지

### 2. 커밋 메시지

```
타입: 간단한 설명

- 세부 변경 사항 1
- 세부 변경 사항 2
```

타입: `feat`, `fix`, `docs`, `style`, `refactor`, `chore`

### 3. 새 페이지 추가 시

1. 폴더 생성 (예: `new-page/`)
2. `index.html` 파일 생성
3. 기존 디자인 시스템 따르기
4. 필요시 `config.json` 업데이트
5. 메인 페이지에 링크 추가

---

## 🚫 금지 사항

- `staff/` 비밀번호 외부 노출 금지
- 민감한 API 키 직접 커밋 금지
- 대용량 미디어 파일 직접 커밋 지양 (CDN 활용)

---

## 📞 문의

설정 관련 문의는 `config.json`의 owner 정보 참조.
