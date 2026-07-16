# Supabase 실시간 동기화 시 React 한글 입력(IME) 자소 분리 현상 해결 패턴

## 개요
Supabase의 `postgres_changes` 실시간(Realtime) 구독 기능을 사용할 때, React 상태(Zustand 등)를 업데이트하는 과정에서 한글 입력(IME) 시 자음과 모음이 분리되거나 타이핑이 밀리는(끊기는) 현상이 발생합니다. 이 문서는 해당 버그의 원인과 해결 패턴을 기록합니다.

## 문제 원인 (Loopback 이벤트로 인한 IME Composition 중단)
1. **입력 발생**: 사용자가 `<input>` 또는 `<textarea>`에 한글을 입력합니다. (예: "하")
2. **로컬 상태 업데이트 및 DB 전송**: `onChange` 이벤트가 발생하여 로컬 상태(Zustand)가 "하"로 즉시 업데이트되고, 동시에 Supabase DB로 `update` 요청이 전송됩니다.
3. **실시간 이벤트 수신 (Loopback)**: 약 100~300ms 후, Supabase Realtime 서버에서 방금 업데이트된 "하" 데이터에 대한 `postgres_changes` 이벤트를 클라이언트(자신 포함)로 브로드캐스트합니다.
4. **글로벌 상태 강제 덮어쓰기**: 클라이언트는 이 이벤트를 수신하고 DB에서 최신 데이터를 다시 `fetch`하여 글로벌 상태를 덮어씌웁니다.
5. **IME Composition 깨짐**: React 컴포넌트가 다시 렌더링되면서 `<input>`의 `value` 속성에 새로운 객체 레퍼런스(또는 비동기로 갱신된 값)가 주입됩니다. 이 비동기적 덮어쓰기는 브라우저가 관리하고 있던 한글 조합 상태(IME Composition)를 강제로 초기화시켜, 다음 타이핑이 기존 글자와 합쳐지지 않고 밀리거나 자소가 분리되는 현상을 유발합니다.

## 해결 방법 (Debounce / Typing Guard 패턴)
이 문제를 해결하기 위해 가장 깔끔한 방법은 **사용자가 능동적으로 상태를 변경(타이핑) 중일 때는 일정 시간 동안 외부(Realtime)에서 들어오는 업데이트를 무시하거나 지연(Debounce)시키는 것**입니다.

### 구현 방법
Zustand Store 내부에 `lastUpdateTime`을 두어, 로컬에서 데이터를 수정할 때마다 타임스탬프를 갱신합니다. 그리고 실시간 구독 리스너에서는 이 타임스탬프를 확인하여 덮어쓰기를 방어합니다.

```javascript
// store.js 예시
export const useProjectStore = create((set, get) => ({
  // ... existing state
  lastUpdateTime: 0,
  fetchTimer: null,

  // 1. 상태를 업데이트할 때마다 lastUpdateTime을 현재 시간으로 갱신
  updateData: async (info) => {
    set((state) => ({ data: { ...state.data, ...info }, lastUpdateTime: Date.now() }));
    // DB 업데이트 로직...
    await supabase.from('table').update(info).eq('id', 1);
  },

  initDB: async () => {
    // 2. Realtime Listener에 방어 로직 추가
    supabase.channel('public:any_changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        // 마지막 업데이트(타이핑) 이후 흐른 시간 계산
        const timeSinceLastUpdate = Date.now() - get().lastUpdateTime;
        
        if (timeSinceLastUpdate > 2000) {
          // 2초 이상 지났으면 즉시 동기화 (내가 타이핑 중이 아님)
          get().fetchFromDB();
        } else {
          // 타이핑 중이라면 기존 타이머를 취소하고 2초 뒤로 갱신 지연
          clearTimeout(get().fetchTimer);
          set({ fetchTimer: setTimeout(() => get().fetchFromDB(), 2000) });
        }
      })
      .subscribe();
  }
}));
```

## 기대 효과
- 사용자가 한글을 연속적으로 타이핑할 때는 `timeSinceLastUpdate`가 계속 0에 가까우므로, Realtime 이벤트가 들어와도 즉시 렌더링되지 않고 타이머만 계속 연장됩니다.
- 한글 타이핑이 전혀 방해받지 않으므로 자소 분리 현상이 완벽하게 사라집니다.
- 사용자가 타이핑을 멈추고 2초가 지나면 큐에 쌓여있던 타이머가 실행되어 최신 상태로 동기화됩니다.
- 다른 사용자가 변경한 데이터도 2초 이내에 타이핑 중이 아니라면 즉각적으로 화면에 반영됩니다.
