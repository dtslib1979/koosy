# 개발일지 #004

**날짜**: 2026-01-15
**작업자**: Claude Code + User
**주제**: KakaoTalk 스타일 채팅 시스템 구현 (GitHub Issues 연동)

---

## 작업 요약

스태프 포털에 KakaoTalk 스타일 채팅 UI 구현. GitHub Issues를 백엔드로 활용하여 실시간 대화 + 아카이브 시스템 완성.

---

## 최종 구현 결과

### 기능 목록
| 기능 | 설명 |
|------|------|
| 채팅 UI | KakaoTalk 스타일 (노란 말풍선 HQ, 흰색 Partner) |
| 메시지 전송 | GitHub API로 직접 전송 (화면 안 바뀜) |
| PR 버튼 | Issue Close = 대화 완료 → Archive |
| 전체화면 | ⛶ 버튼으로 오버레이 확장 |
| 더보기 | 300자+ 메시지 접기/펼치기 |
| 다운로드 | 긴 메시지 마크다운 저장 |
| 복사 | 클립보드 복사 |

### 데이터 플로우
```
채팅 입력 → 전송 버튼 → GitHub API → Issue/Comment 생성
                                ↓
                         채팅창 자동 새로고침
                                ↓
                         메시지 즉시 표시

PR 버튼 → Issue Close → Archive 페이지로 이동
                      → 새 대화 자동 시작
```

### 파일 변경
- `staff/index.html` - 채팅 UI + JavaScript 전체

---

## 삽질 기록 (반복 금지!)

### 삽질 #1: GitHub 링크로 이동하는 방식
**문제**: 전송 버튼 누르면 GitHub 페이지로 이동
**유저 반응**: "씨발 왜 깃허브로 가냐"
**원인**: PAT 없이는 API 직접 호출 불가
**교훈**: 카톡처럼 하려면 PAT 필수. 처음부터 API 방식으로 설계할 것

### 삽질 #2: PAT 개별 설정 요구
**문제**: 각 유저에게 PAT 입력 요구 (🔑 버튼)
**유저 반응**: "귀찮아 이거 빼"
**해결**: Repository Network 설정의 PAT를 공용으로 사용
**교훈**:
- 비밀번호(1126) = 벨벳 로프 (접근 제어)
- PAT = API 인증 (오너가 한번만 설정)
- 사용자는 PAT 몰라도 됨

### 삽질 #3: 입력창이 링크였음
**문제**: `<a>` 태그로 입력창 만들어서 클릭하면 이동
**유저 반응**: "채팅창에 텍스트 입력이 왜 안 되냐"
**해결**: `<input type="text">` + `<button>` 으로 변경
**교훈**: 카톡 = 진짜 입력창. 링크 아님.

### 삽질 #4: "세션" 네이밍 혼란
**문제**: "세션 #1" 같은 표현 사용
**유저 반응**: "세션이 아니라 PR 발행이라고 바보야"
**해결**: "HQ 작업실 #번호" 로 변경
**교훈**: 유저 용어에 맞출 것. 세션 = 개발자 용어.

### 삽질 #5: 채팅창 높이 너무 작음
**문제**: 350px로 모바일에서 답답함
**해결**: 450px + 전체화면 오버레이 추가
**교훈**: 모바일 퍼스트. 스크롤 + 확장 옵션 제공

---

## 아키텍처 결정 사항

### GitHub Issues = 채팅 백엔드
```
Open Issue = 활성 대화
Comments = 메시지들
Close Issue = 대화 완료 (PR)
Closed Issues = Archive (상신함)
```

**장점**:
- 서버 없음 (GitHub이 서버)
- 무료 ($4/월 Pro로 Private repo)
- 자동 백업/버전관리
- API 제공

### 인증 구조
```
스태프 포털 비밀번호 (1126) = 접근 제어 (벨벳 로프)
GitHub PAT = API 인증 (실제 권한)
```

**Collaborator 방식 채택**:
- Owner (유저) = 관리자
- Collaborator (파트너) = 사용자
- 각자 GitHub 계정 + 각자 PAT
- 메시지에 각자 이름 표시

---

## 관련 커밋

```
1539219 feat: add real text input for KakaoTalk-style chat
35b6073 feat: background API for chat - no GitHub redirect
35f15f5 feat: add PAT settings panel in chat header
6c44f92 feat: add "더보기" (see more) for long messages
4aad7c2 feat: add download and copy buttons for long messages
a3a25cc refactor: simplify chat - remove PAT, use GitHub links
21b63be feat: add fullscreen chat overlay
0be1d80 wip: simplify chat PAT to use shared repo config
b1cfcaa feat: use shared PAT from settings for seamless chat
```

---

## 다음 작업 시 체크리스트

### 채팅 기능 추가 시
```
□ PAT는 Repository Network 설정에서 가져옴 (getChatPat())
□ GitHub API 엔드포인트: /repos/{owner}/{repo}/issues
□ 댓글: /issues/{number}/comments
□ Issue Close: PATCH /issues/{number} body: {state: 'closed'}
```

### 새 유저 온보딩
```
□ GitHub 계정 생성 (무료)
□ PAT 생성 (Settings → Developer settings → Tokens)
□ 레포 Collaborator로 초대
□ 스태프 포털 설정에서 PAT 입력
□ 끝 (다신 설정 안 해도 됨)
```

### UI 수정 시 주의
```
□ .kakao-* 클래스들이 채팅 관련
□ 전체화면은 #chatFullscreen 오버레이
□ 메시지 렌더링은 renderBubble() 함수
□ bubbleDataStore에 원본 텍스트 저장 (다운로드용)
```

---

## 보일러플레이트 반영 필요 사항

이 채팅 시스템을 템플릿화하려면:

1. **config.json에 추가할 것**
   - `chat.githubOwner`
   - `chat.githubRepo`

2. **복제 시 변경할 것**
   - `CHAT_GITHUB_OWNER` 상수
   - `CHAT_GITHUB_REPO` 상수

3. **문서화 필요**
   - PAT 생성 가이드
   - Collaborator 초대 방법

---

## 핵심 교훈

1. **카톡 = 심리스**: 전송 → 바로 표시. 페이지 이동 금지.
2. **PAT는 필수**: GitHub API 쓰려면 인증 필요. 피할 수 없음.
3. **설정은 한번만**: 유저가 반복 설정하면 이탈. 초기 1회로 끝내기.
4. **유저 용어 사용**: "세션" 아니고 "PR", "작업실"
5. **모바일 퍼스트**: 채팅창 높이, 전체화면 옵션 필수

---

*작성: 2026-01-15 by Claude Code*
