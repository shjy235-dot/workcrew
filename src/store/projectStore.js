import { create } from 'zustand';
import { supabase } from '../supabaseClient';

const initialMockData = {
  projectName: "에어컨 유지보수 및 점검 현장",
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
  notice: "각 학사 호실 방문 전 학생들에게 사전 안내 부탁드립니다.",
  totalVolume: "천장형 1way (EHP: 398대, FCU: 232대)\n천장형 4way (EHP: 34대, FCU: 25대)\n벽걸이: 110대, 스탠드: 1대\n(총 800대)",
  days: [
    {
      id: "day-1",
      title: "1일차 작업",
      date: new Date().toISOString().split('T')[0],
      tasks: [
        { id: "t-1", scope: "반야학사 호실(1층-4층)", acType: "천장형 1way(EHP)", acCount: "65", status: "pending", completedCount: "0", memo: "" },
        { id: "t-2", scope: "반야학사 공용공간", acType: "천장형 1way(EHP)", acCount: "3", status: "pending", completedCount: "0", memo: "" },
        { id: "t-2-2", scope: "반야학사 공용공간", acType: "천장형 4way(EHP)", acCount: "1", status: "pending", completedCount: "0", memo: "" },
        { id: "t-3", scope: "현암학사 호실(1층~6층)", acType: "천장형 1way(EHP)", acCount: "135", status: "pending", completedCount: "0", memo: "" },
        { id: "t-3-2", scope: "현암학사 호실(1층~6층)", acType: "천장형 4way(EHP)", acCount: "9", status: "pending", completedCount: "0", memo: "" }
      ]
    },
    {
      id: "day-2",
      title: "2일차 작업",
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      tasks: [
        { id: "t-4", scope: "담곡학사(2층~16층)", acType: "천장형 1way(EHP)", acCount: "191", status: "pending", completedCount: "0", memo: "" },
        { id: "t-4-2", scope: "담곡학사(2층~16층)", acType: "천장형 4way(EHP)", acCount: "2", status: "pending", completedCount: "0", memo: "" },
        { id: "t-5", scope: "담곡학사 공용공간", acType: "천장형 1way(EHP)", acCount: "4", status: "pending", completedCount: "0", memo: "" },
        { id: "t-5-2", scope: "담곡학사 공용공간", acType: "천장형 4way(EHP)", acCount: "16", status: "pending", completedCount: "0", memo: "" }
      ]
    },
    {
      id: "day-3",
      title: "3일차 작업",
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      tasks: [
        { id: "t-6", scope: "봉소학사 호실(1층~5층)", acType: "벽걸이", acCount: "109", status: "pending", completedCount: "0", memo: "" },
        { id: "t-7", scope: "봉소학사 공용공간", acType: "벽걸이", acCount: "1", status: "pending", completedCount: "0", memo: "" },
        { id: "t-7-2", scope: "봉소학사 공용공간", acType: "천장형 4way(EHP)", acCount: "5", status: "pending", completedCount: "0", memo: "" },
        { id: "t-7-3", scope: "봉소학사 공용공간", acType: "스탠드", acCount: "1", status: "pending", completedCount: "0", memo: "" },
        { id: "t-8", scope: "청림학사(2층~16층)", acType: "천장형 1way(FCU)", acCount: "230", status: "pending", completedCount: "0", memo: "" },
        { id: "t-8-2", scope: "청림학사(2층~16층)", acType: "천장형 4way(FCU)", acCount: "7", status: "pending", completedCount: "0", memo: "" },
        { id: "t-9", scope: "청림학사 공용공간", acType: "천장형 1way(FCU)", acCount: "2", status: "pending", completedCount: "0", memo: "" },
        { id: "t-9-2", scope: "청림학사 공용공간", acType: "천장형 4way(EHP)", acCount: "1", status: "pending", completedCount: "0", memo: "" },
        { id: "t-9-3", scope: "청림학사 공용공간", acType: "천장형 4way(FCU)", acCount: "18", status: "pending", completedCount: "0", memo: "" }
      ]
    }
  ]
};

export const useProjectStore = create((set, get) => ({
  data: { projectName: "", startDate: "", endDate: "", notice: "", totalVolume: "", days: [] },
  mode: localStorage.getItem('workcrew-mode') || 'worker',
  workerName: localStorage.getItem('workcrew-worker') || null,
  isInitialized: false,
  lastUpdateTime: 0,
  fetchTimer: null,
  activeProjectId: null,

  setMode: (mode) => {
    localStorage.setItem('workcrew-mode', mode);
    set({ mode });
  },
  
  setWorkerName: (name) => {
    localStorage.setItem('workcrew-worker', name);
    set({ workerName: name });
  },

  initDB: async () => {
    if (get().isInitialized) return;

    const { data: projectInfo } = await supabase.from('project_info').select('*').eq('status', 'active').limit(1).maybeSingle();

    if (!projectInfo) {
      await supabase.from('project_info').insert({
        id: '1',
        project_name: initialMockData.projectName,
        start_date: initialMockData.startDate,
        end_date: initialMockData.endDate,
        notice: initialMockData.notice,
        total_volume: initialMockData.totalVolume,
        status: 'active'
      });

      for (let i = 0; i < initialMockData.days.length; i++) {
        const day = initialMockData.days[i];
        await supabase.from('days').insert({
          id: day.id,
          project_id: '1',
          title: day.title,
          date: day.date,
          site: '',
          order_index: i
        });

        for (let j = 0; j < day.tasks.length; j++) {
          const task = day.tasks[j];
          await supabase.from('tasks').insert({
            id: task.id,
            day_id: day.id,
            scope: task.scope,
            ac_type: task.acType,
            ac_count: task.acCount,
            completed_count: task.completedCount || "0",
            status: task.status,
            memo: task.memo,
            order_index: j
          });
        }
      }
    }

    await get().fetchFromDB();
    set({ isInitialized: true });

    // 기존 채널이 있으면 제거 후 재생성 (더블 마운트 방어)
    try {
      await supabase.removeChannel(supabase.channel('public:any_changes'));
    } catch (_) {}

    try {
      supabase.channel('public:any_changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => {
          // 내가 타이핑 중일 때(최근 2초 이내 업데이트 발생) DB에서 다시 불러오면 한글 타이핑이 끊기는 현상 방지
          const timeSinceLastUpdate = Date.now() - get().lastUpdateTime;
          if (timeSinceLastUpdate > 2000) {
            get().fetchFromDB();
          } else {
            clearTimeout(get().fetchTimer);
            set({ fetchTimer: setTimeout(() => get().fetchFromDB(), 2000) });
          }
        })
        .subscribe();
    } catch (e) {
      console.warn('[Realtime] 쳄널 등록 실패, 무시합니다:', e.message);
    }
  },

  fetchFromDB: async () => {
    const { data: projectInfo } = await supabase.from('project_info').select('*').eq('status', 'active').limit(1).maybeSingle();
    if (!projectInfo) return;

    const [ { data: daysData }, { data: tasksData } ] = await Promise.all([
      supabase.from('days').select('*').eq('project_id', projectInfo.id).order('order_index', { ascending: true }),
      supabase.from('tasks').select('*').order('order_index', { ascending: true })
    ]);

    const days = (daysData || []).map(day => ({
      id: day.id,
      title: day.title,
      date: day.date || "",
      site: day.site || "",
      tasks: (tasksData || [])
        .filter(t => t.day_id === day.id)
        .map(t => {
          // ac_type 필드에서 acItems 파싱 (기존 단일 문자열 형식과 하위 호환)
          let acItems = [];
          if (t.ac_type) {
            const trimmed = t.ac_type.trim();
            if (trimmed.startsWith('[')) {
              try { acItems = JSON.parse(trimmed); } catch { acItems = [{ id: `legacy-${t.id}`, type: t.ac_type, count: t.ac_count || '0' }]; }
            } else {
              // 기존 단일 문자열 → 단일 항목 배열로 변환
              acItems = [{ id: `legacy-${t.id}`, type: t.ac_type, count: t.ac_count || '0' }];
            }
          }
          return {
            id: t.id,
            title: t.title || "",
            scope: t.scope || "",
            acItems,
            completedCount: t.completed_count || "0",
            status: t.status || "pending",
            memo: t.memo || ""
          };
        })
    }));

    set({
      activeProjectId: projectInfo.id,
      data: {
        projectName: projectInfo.project_name || "",
        startDate: projectInfo.start_date || "",
        endDate: projectInfo.end_date || "",
        notice: projectInfo.notice || "",
        totalVolume: projectInfo.total_volume || "",
        days: days
      }
    });
  },

  updateProjectInfo: async (info) => {
    set((state) => ({ data: { ...state.data, ...info }, lastUpdateTime: Date.now() }));

    const dbPayload = {};
    if (info.projectName !== undefined) dbPayload.project_name = info.projectName;
    if (info.startDate !== undefined) dbPayload.start_date = info.startDate;
    if (info.endDate !== undefined) dbPayload.end_date = info.endDate;
    if (info.notice !== undefined) dbPayload.notice = info.notice;
    if (info.totalVolume !== undefined) dbPayload.total_volume = info.totalVolume;

    if (Object.keys(dbPayload).length > 0 && get().activeProjectId) {
      await supabase.from('project_info').update(dbPayload).eq('id', get().activeProjectId);
    }
  },

  addDay: async () => {
    const newDayId = `day-${Date.now()}`;
    const newDayNumber = get().data.days.length + 1;
    const newDay = {
      id: newDayId,
      title: `${newDayNumber}일차 작업`,
      date: '',
      site: '',
      tasks: []
    };

    set((state) => ({ data: { ...state.data, days: [...state.data.days, newDay] }, lastUpdateTime: Date.now() }));

    await supabase.from('days').insert({
      id: newDay.id,
      project_id: get().activeProjectId,
      title: newDay.title,
      date: newDay.date,
      site: newDay.site,
      order_index: newDayNumber - 1
    });
  },

  updateDay: async (dayId, updates) => {
    set((state) => ({
      data: {
        ...state.data,
        days: state.data.days.map(day => day.id === dayId ? { ...day, ...updates } : day)
      },
      lastUpdateTime: Date.now()
    }));

    const dbPayload = {};
    if (updates.title !== undefined) dbPayload.title = updates.title;
    if (updates.date !== undefined) dbPayload.date = updates.date;
    if (updates.site !== undefined) dbPayload.site = updates.site;

    if (Object.keys(dbPayload).length > 0) {
      await supabase.from('days').update(dbPayload).eq('id', dayId);
    }
  },

  listProjects: async () => {
    const { data } = await supabase.from('project_info').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  startNewProject: async (name) => {
    const state = get();
    if (state.activeProjectId) {
      await supabase.from('project_info').update({ status: 'archived' }).eq('id', state.activeProjectId);
    }
    const newId = `project-${Date.now()}`;
    await supabase.from('project_info').insert({
      id: newId,
      project_name: name || '새 프로젝트',
      start_date: '',
      end_date: '',
      notice: '',
      total_volume: '',
      status: 'active'
    });
    await get().fetchFromDB();
  },

  loadProject: async (projectId) => {
    const state = get();
    if (state.activeProjectId && state.activeProjectId !== projectId) {
      await supabase.from('project_info').update({ status: 'archived' }).eq('id', state.activeProjectId);
    }
    await supabase.from('project_info').update({ status: 'active' }).eq('id', projectId);
    await get().fetchFromDB();
  },

  deleteProject: async (projectId) => {
    const { data: projectDays } = await supabase.from('days').select('id').eq('project_id', projectId);
    const dayIds = (projectDays || []).map(d => d.id);
    if (dayIds.length > 0) {
      await supabase.from('tasks').delete().in('day_id', dayIds);
      await supabase.from('days').delete().in('id', dayIds);
    }
    await supabase.from('project_info').delete().eq('id', projectId);
  },

  removeDay: async (dayId) => {
    set((state) => ({ data: { ...state.data, days: state.data.days.filter(day => day.id !== dayId) }, lastUpdateTime: Date.now() }));
    await supabase.from('days').delete().eq('id', dayId);
  },

  addTask: async (dayId) => {
    const state = get();
    const day = state.data.days.find(d => d.id === dayId);
    if (!day) return;
    
    const newTask = {
      id: `task-${Date.now()}`,
      title: "",
      scope: "",
      acItems: [],  // 에어컨 종류 및 수량 배열
      completedCount: "0",
      status: "pending",
      memo: ""
    };
    
    const newDays = state.data.days.map(d => 
      d.id === dayId ? { ...d, tasks: [...d.tasks, newTask] } : d
    );
    set({ data: { ...state.data, days: newDays }, lastUpdateTime: Date.now() });
    
    await supabase.from('tasks').insert({
      id: newTask.id,
      day_id: dayId,
      title: newTask.title,
      scope: newTask.scope,
      ac_type: JSON.stringify([]),  // 빈 배열을 JSON 문자열로 저장
      ac_count: "0",
      completed_count: newTask.completedCount,
      status: newTask.status,
      memo: newTask.memo,
      order_index: day.tasks.length
    });
  },

  updateTask: async (dayId, taskId, updates) => {
    set((state) => {
      const newDays = state.data.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            tasks: day.tasks.map(task => 
              task.id === taskId ? { ...task, ...updates } : task
            )
          };
        }
        return day;
      });
      return { data: { ...state.data, days: newDays }, lastUpdateTime: Date.now() };
    });

    const dbPayload = {};
    if (updates.title !== undefined) dbPayload.title = updates.title;
    if (updates.scope !== undefined) dbPayload.scope = updates.scope;
    if (updates.acItems !== undefined) {
      // acItems 배열을 JSON 문자열로 직렬화하여 ac_type 컬럼에 저장 (스키마 변경 불필요)
      dbPayload.ac_type = JSON.stringify(updates.acItems);
      // 총 수량을 ac_count에 참조용으로 저장
      dbPayload.ac_count = String(updates.acItems.reduce((sum, item) => sum + (Number(item.count) || 0), 0));
    }
    if (updates.completedCount !== undefined) dbPayload.completed_count = updates.completedCount;
    if (updates.status !== undefined) dbPayload.status = updates.status;
    if (updates.memo !== undefined) dbPayload.memo = updates.memo;

    if (Object.keys(dbPayload).length > 0) {
      await supabase.from('tasks').update(dbPayload).eq('id', taskId);
    }
  },

  removeTask: async (dayId, taskId) => {
    set((state) => {
      const newDays = state.data.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            tasks: day.tasks.filter(task => task.id !== taskId)
          };
        }
        return day;
      });
      return { data: { ...state.data, days: newDays }, lastUpdateTime: Date.now() };
    });
    
    await supabase.from('tasks').delete().eq('id', taskId);
  },

  loadFromUrl: () => false,
  getShareUrl: () => window.location.origin
}));
