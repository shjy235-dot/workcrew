# Zustand Local Storage에서 Supabase 실시간 동기화로의 전환 패턴

## 개요
이 프로젝트는 초기에 `zustand/middleware/persist`를 사용하여 클라이언트 브라우저 로컬 스토리지 기반으로 상태를 관리했습니다. 하지만 여러 작업자가 동시에 현장 작업 내역을 갱신해야 하는 요구사항(실시간 협업)이 발생함에 따라 Supabase DB 기반의 실시간(Realtime) 동기화 아키텍처로 전환했습니다.

## 해결 방법 (패턴)
1. **Supabase Client 구성**: `.env`에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`를 넣고 클라이언트를 초기화합니다.
2. **Supabase DB 스키마 정규화**: JSON을 통째로 덮어쓰면 레이스 컨디션(동시성 문제)이 발생할 수 있으므로, `project_info`, `days`, `tasks` 테이블로 분리합니다. 별도의 Auth가 없으므로 RLS(Row Level Security)를 비활성화합니다.
3. **Zustand 스토어 개조 (Optimistic Update 적용)**:
   - `initDB` 메서드: 앱 마운트 시 DB를 읽고, 만약 빈 DB라면 로컬에 있던 `initialMockData`를 DB에 Insert하여 초기화합니다.
   - **실시간 리스너 (`postgres_changes`)**: 다른 사람이 DB를 변경하면 즉각 `fetchFromDB()`를 호출해 전역 상태를 동기화합니다.
   - **낙관적 업데이트 (Optimistic Rendering)**: 사용자가 버튼을 눌렀을 때, `await supabase...` 완료를 기다리지 않고 로컬 Zustand의 `set()`을 우선 호출해 UI 반응성을 극대화합니다. 그 후 백그라운드에서 DB 업데이트를 날립니다.

## 교훈 및 지식 복리화 (Auto ce-compound)
- 프론트엔드의 부드러운 UX를 유지하면서 실시간 협업 기능을 도입할 때는 **"로컬 상태 선반영 + 백그라운드 DB 업데이트 + 외부 변경분 실시간 리스닝"** 형태의 아키텍처가 가장 쾌적하고 강력합니다.
- Vercel과 Vite 조합 시, 프론트엔드 코드 내부에서 노출될 환경변수에는 반드시 `VITE_` 접두사를 붙여야 합니다 (`import.meta.env.VITE_...`).
