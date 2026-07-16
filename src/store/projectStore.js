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
  mode: localStorage.getItem('workcrew-mode') || 'admin',
  workerName: localStorage.getItem('workcrew-worker') || null,
  isInitialized: false,

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

    const { data: projectInfo } = await supabase.from('project_info').select('*').eq('id', 1).single();
    
    if (!projectInfo) {
      await supabase.from('project_info').insert({
        id: 1,
        project_name: initialMockData.projectName,
        start_date: initialMockData.startDate,
        end_date: initialMockData.endDate,
        notice: initialMockData.notice,
        total_volume: initialMockData.totalVolume
      });

      for (let i = 0; i < initialMockData.days.length; i++) {
        const day = initialMockData.days[i];
        await supabase.from('days').insert({
          id: day.id,
          title: day.title,
          date: day.date,
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

    supabase.channel('public:any_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_info' }, () => get().fetchFromDB())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'days' }, () => get().fetchFromDB())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => get().fetchFromDB())
      .subscribe();
  },

  fetchFromDB: async () => {
    const [ { data: projectInfo }, { data: daysData }, { data: tasksData } ] = await Promise.all([
      supabase.from('project_info').select('*').eq('id', 1).single(),
      supabase.from('days').select('*').order('order_index', { ascending: true }),
      supabase.from('tasks').select('*').order('order_index', { ascending: true })
    ]);

    if (!projectInfo) return;

    const days = (daysData || []).map(day => ({
      id: day.id,
      title: day.title,
      date: day.date || "",
      tasks: (tasksData || [])
        .filter(t => t.day_id === day.id)
        .map(t => ({
          id: t.id,
          scope: t.scope || "",
          acType: t.ac_type || "",
          acCount: t.ac_count || "",
          completedCount: t.completed_count || "0",
          status: t.status || "pending",
          memo: t.memo || ""
        }))
    }));

    set({
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
    set((state) => ({ data: { ...state.data, ...info } }));
    
    const dbPayload = {};
    if (info.projectName !== undefined) dbPayload.project_name = info.projectName;
    if (info.startDate !== undefined) dbPayload.start_date = info.startDate;
    if (info.endDate !== undefined) dbPayload.end_date = info.endDate;
    if (info.notice !== undefined) dbPayload.notice = info.notice;
    if (info.totalVolume !== undefined) dbPayload.total_volume = info.totalVolume;
    
    if (Object.keys(dbPayload).length > 0) {
      await supabase.from('project_info').update(dbPayload).eq('id', 1);
    }
  },

  addDay: async () => {
    const newDayId = `day-${Date.now()}`;
    const newDayNumber = get().data.days.length + 1;
    const newDay = {
      id: newDayId,
      title: `${newDayNumber}일차 작업`,
      date: '',
      tasks: []
    };
    
    set((state) => ({ data: { ...state.data, days: [...state.data.days, newDay] } }));
    
    await supabase.from('days').insert({
      id: newDay.id,
      title: newDay.title,
      date: newDay.date,
      order_index: newDayNumber - 1
    });
  },

  removeDay: async (dayId) => {
    set((state) => ({ data: { ...state.data, days: state.data.days.filter(day => day.id !== dayId) } }));
    await supabase.from('days').delete().eq('id', dayId);
  },

  addTask: async (dayId) => {
    const state = get();
    const day = state.data.days.find(d => d.id === dayId);
    if (!day) return;
    
    const newTask = {
      id: `task-${Date.now()}`,
      scope: "",
      acType: "",
      acCount: "",
      completedCount: "0",
      status: "pending",
      memo: ""
    };
    
    const newDays = state.data.days.map(d => 
      d.id === dayId ? { ...d, tasks: [...d.tasks, newTask] } : d
    );
    set({ data: { ...state.data, days: newDays } });
    
    await supabase.from('tasks').insert({
      id: newTask.id,
      day_id: dayId,
      scope: newTask.scope,
      ac_type: newTask.acType,
      ac_count: newTask.acCount,
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
      return { data: { ...state.data, days: newDays } };
    });

    const dbPayload = {};
    if (updates.scope !== undefined) dbPayload.scope = updates.scope;
    if (updates.acType !== undefined) dbPayload.ac_type = updates.acType;
    if (updates.acCount !== undefined) dbPayload.ac_count = updates.acCount;
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
      return { data: { ...state.data, days: newDays } };
    });
    
    await supabase.from('tasks').delete().eq('id', taskId);
  },

  loadFromUrl: () => false,
  getShareUrl: () => window.location.origin
}));
