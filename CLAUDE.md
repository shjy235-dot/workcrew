# 프로젝트 전역 규칙 (Antigravity 글로벌 룰 이식본)

> 이 파일은 Antigravity IDE의 글로벌 룰(`~/.gemini/config/AGENTS.md`)과
> 글로벌 워크플로우(`~/.gemini/config/global_workflows/*.md`)를 Claude Code용으로
> 이식/통합한 것입니다. 이 프로젝트에서 작업할 때 아래 규칙을 기본 지침으로 따릅니다.

## 언어
- 모든 답변, 코드 주석, 설명은 **한국어로만** 작성합니다.

## 호칭
- 사용자는 AI를 "덱"이라는 애칭으로 부를 수 있으며, 자연스럽고 친근하게 반응합니다.

## 진행 상황 문서화 (Plan + Walkthrough 통합)
- 규모가 있는 작업을 시작할 때는 `docs/progress/[작업명].md` 파일을 만들어
  "계획" 섹션을 먼저 채우고 보여준 뒤 진행합니다.
- 작업이 끝나면 같은 파일에 "완료 내역" 섹션을 한 번에 채웁니다.
  (단계별 중간 체크박스 갱신 없이, 시작 시 1회 + 완료 시 1회만 기록)
- 형식:
  ```
  # [작업명]

  ## 계획
  - 목표: 한 줄 요약
  - 단계: 1. ... / 2. ... / 3. ...
  - 상태: 진행 중

  ## 완료 내역
  - 한 일: ...
  - 변경 파일: ...
  - 확인 방법: ...
  - 상태: 완료
  ```
- 간단한 질문 답변이나 사소한 수정에는 적용하지 않고, 여러 단계로 구성된
  기능 추가/버그 수정 등 규모 있는 작업에만 사용합니다.

## Python 작업 시 규칙 (해당 작업이 있을 경우)
- 기존에 가상환경 폴더가 있다면 새로 만들지 않습니다. 가상환경은 `uv`를 사용하며 `.venv`로 생성합니다.
- 데이터 시각화 시 seaborn의 스타일 설정을 사용하지 않습니다.
- matplotlib 기반 시각화를 할 때는 `koreanize-matplotlib`를 사용해 한글 폰트를 설정합니다.

## 날짜/D-Day 계산 방어 코드
- D-Day 계산이나 날짜 연산 로직 작성 시, 데이터가 비어있는(null/undefined/empty string)
  초기 상태를 반드시 고려해 방어 코드를 작성합니다.
- 과거/미래의 특정 날짜를 초과해 잘못된 알림(예: 결제 만기 임박 오탐)이 발생하지 않도록 주의합니다.

## 지식 복리화 (docs/solutions/)
- 중요한 버그/오류를 해결하거나 새로운 기술적 과제(배포, 아키텍처 등)를 성공적으로
  해결했을 때는, 사용자가 명시적으로 지시하지 않아도 해결 직후 자발적으로
  `docs/solutions/`에 문제 내용과 처리 방식을 문서로 기록합니다.
  (이 프로젝트는 이미 `docs/solutions/001_zustand_to_supabase_realtime.md`,
  `002_npm_install_freeze_troubleshooting.md`, `002_realtime_ime_composition_fix.md` 관행을 따르고 있음)

## Git 커밋 시 무한 대기 방지
- 터미널에서 git commit을 실행할 때 커밋 메시지 옵션을 절대 생략하지 않습니다.
  반드시 `git commit -m "명확한 커밋 메시지"` 형태로 실행합니다.
  (메시지를 생략하면 에디터 창이 열려 사용자가 닫기 전까지 터미널이 멈추는 원인이 됨)

## 능동적 실행 원칙
- 파일 도구가 권한 문제 등으로 막히더라도 "직접 붙여넣어 주세요"라고 소극적으로
  물러서지 않고, 가능한 우회 수단을 먼저 시도합니다. 다만 파괴적/비가역적 작업은
  (Claude Code 세션 표준 정책에 따라) 사용자 확인을 받은 뒤 진행합니다.

## npm 설치 프리징 방어
- 패키지 설치 시 기본 옵션: `npm install --no-audit --no-fund --legacy-peer-deps`
- 설치 중 2~3분 이상 멈추면(백신 등의 간섭으로 추정) 프로세스를 종료하고
  `node_modules`를 삭제한 뒤 `npm install --ignore-scripts --no-audit --no-fund --legacy-peer-deps`로 재시도합니다.

## 배치 파일 작성 안전 수칙
- `run_app.bat`, `install_and_run.bat` 등 서버 구동용 배치 파일에는
  `rmdir /s /q node_modules`, `del package-lock.json` 같은 패키지 강제 초기화 명령을
  절대 포함시키지 않습니다. 오직 `npm run dev` 등 서버 실행 목적으로만 작성합니다.

## 장기 실행 작업 모니터링
- 패키지 설치, 빌드 등 시간이 걸리는 작업은 예상 시간을 초과할 경우
  진행 상황을 스스로 확인해 사용자에게 중간 보고합니다.

---

## UI/UX 디자인 규칙 (프론트엔드 작업 시 필수 적용)

프론트엔드 UI/UX나 화면 컴포넌트를 신규 설계/수정할 때는 아래 원칙을 최우선으로 적용합니다.

### 레이아웃
- **8pt 그리드**: 모든 크기/패딩/마진은 8px의 배수(8, 16, 24, 32, 48px 등)로 통일
- **Blueprint Grid (Vercel 스타일)**: 배경에 1px 미세 라인 그리드, 투명도 10~20%

### 타이포그래피
- 기본 본문 16px, 1.25 비율(Major Third) 모듈러 스케일 적용 (13/16/20/25/31/39px)
- 라인 하이트는 4px 또는 8px 그리드의 공배수로 정렬

### 색상 & 접근성
- **60-30-10 법칙**: 주조색 60%(배경) / 보조색 30%(카드·내비게이션) / 강조색 10%(CTA)
- **WCAG 2.1 AA**: 일반 텍스트 4.5:1 이상, 대형 텍스트/의미있는 아이콘 3:1 이상 명도 대비

### UX 심리학
- 야콥 닐슨 10대 휴리스틱(즉각적 피드백, 되돌리기 지원, 직관적 에러 복구)
- 피츠의 법칙(터치/클릭 타겟 최소 44pt), 힉의 법칙·밀러의 법칙(한 화면 옵션 5~7개 이하)
- macOS 스타일 다층 섀도우 + 인셋 하이라이트로 깊이감 표현

### 새 화면 설계 시 출력 순서
1. Visual Theme & Atmosphere
2. Color Palette & Roles (CSS 변수 + Hex)
3. Typography Rules
4. Component Stylings
5. Layout Principles
6. Depth & Elevation
7. Do's and Don'ts
8. Responsive Behavior
9. Agent Prompt Guide

---

## Vercel 배포 가이드라인 (Vite + Express)
- 단일 레포 구조 유지: `backend` 폴더를 따로 만들지 않고, 프론트엔드 루트의
  `api/index.js`에 Express 백엔드 코드를 배치 (이 프로젝트의 `api/` 폴더가 이 구조)
- Express/Supabase 등 백엔드 의존성은 프론트엔드 `package.json`에 함께 설치
- `vercel.json`에 라우팅 필수 설정:
  - `{'src': '/api/(.*)', 'dest': '/api/index.js'}`
  - `{'src': '/(.*)', 'dest': '/index.html'}`
- Vercel 프로젝트의 Root Directory는 프론트엔드 루트, Framework Preset은 Vite로 지정
- `.env`의 `VITE_` 환경변수는 GitHub에 올라가지 않으므로, 배포 안내 시 반드시
  "Vercel Settings 탭에서 환경변수를 넣어야 한다"고 사용자에게 안내

## React + Supabase Realtime IME(한글 입력) 방어
- 로컬 상태 변경 시마다 `lastUpdateTime = Date.now()` 기록
- DB 변경 이벤트 수신 시, `Date.now() - lastUpdateTime < 2000ms`이면 타이핑 중으로
  간주해 DB 상태로 로컬을 덮어쓰지 않음 (루프백 차단)
- 타이핑이 멈추고 2초 후에만 DB로 업데이트 전송 (Debounce)
- (이 프로젝트는 `docs/solutions/002_realtime_ime_composition_fix.md`,
  커밋 `4c752b4`, `1ff7100`에서 이미 이 패턴을 적용 중)

## Supabase 셋업 SQL 제공 시 필수 포함 요소
1. 테이블 생성 (`CREATE TABLE`)
2. RLS 권한 해제 (`ALTER TABLE ... DISABLE ROW LEVEL SECURITY`, 개발 편의용)
3. 실시간 동기화 셋업 (`create publication supabase_realtime`)

---

## 코딩 행동 원칙 (Karpathy 가이드라인)
LLM 코딩 시 흔한 실수를 줄이기 위한 행동 지침. 사소한 작업에는 유연하게 판단.

1. **코딩 전에 생각하기**: 가정하지 않고, 혼란을 숨기지 않고, 트레이드오프를 드러냄.
   불확실하면 질문하고, 여러 해석이 가능하면 제시하며, 더 단순한 방법이 있으면 말함.
2. **단순함 우선**: 문제를 해결하는 최소한의 코드만 작성. 요청받지 않은 기능/추상화/
   유연성/에러 처리를 추가하지 않음.
3. **외과적 수정**: 반드시 수정해야 하는 부분만 건드림. 인접 코드나 포맷팅을
   "개선"하지 않고, 망가지지 않은 것을 리팩토링하지 않음. 기존 스타일을 따름.
   변경으로 인해 생긴 미사용 import/변수만 제거하고, 원래 있던 죽은 코드는 건드리지 않음.
4. **목표 지향 실행**: 검증 가능한 성공 기준을 정의하고 그것이 충족될 때까지 반복.

> 참고: 원본에는 Antigravity 고유의 스킬 워크플로우 시퀀스
> (office-hours → plan-ceo-review → plan-eng-review → brainstorming →
> subagent-driven-development → ce-compound)가 명시되어 있었으나, 이는
> Antigravity 전용 스킬 이름이라 Claude Code에는 동일한 스킬이 존재하지 않습니다.
> 대신 위 Karpathy 가이드라인(생각 → 계획 → 구현 → 검증)의 정신을 그대로 따릅니다.
