import React from 'react';
import { Calendar, AlertTriangle, FileText, Target } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';


export default function Dashboard() {
  const { data, updateProjectInfo, mode } = useProjectStore();

  const calculateProgress = () => {
    let totalTasks = 0;
    let completedTasks = 0;

    data.days.forEach(day => {
      day.tasks.forEach(task => {
        totalTasks++;
        if (task.status === 'completed') completedTasks++;
      });
    });

    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const taskProgress = calculateProgress();

  return (
    <div className="bg-slate-50 p-4 pb-6 border-b border-slate-200">
      <div className="mb-6 px-2">
        {mode === 'admin' ? (
            <input
              type="text"
              value={data.projectName}
              onChange={(e) => updateProjectInfo({ projectName: e.target.value })}
              className="w-full text-[25px] font-bold text-slate-900 border-b-2 border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none pb-2 bg-transparent transition-colors min-h-[44px]"
              placeholder="프로젝트명을 입력하세요"
            />
        ) : (
          <h2 className="text-[25px] font-bold text-slate-900 tracking-tight min-h-[44px] flex items-center">{data.projectName || "프로젝트 명칭 없음"}</h2>
        )}
      </div>

      <div className="space-y-4">
        {/* Date Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center text-slate-700 mb-3">
            <Calendar size={18} className="mr-2 text-slate-400" />
            <span className="font-semibold">기간 설정</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={data.startDate || ''}
              onChange={(e) => updateProjectInfo({ startDate: e.target.value })}
              disabled={mode === 'worker'}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-[13px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-slate-100 disabled:text-slate-400"
            />
            <span className="text-slate-300 font-bold">-</span>
            <input
              type="date"
              value={data.endDate || ''}
              onChange={(e) => updateProjectInfo({ endDate: e.target.value })}
              disabled={mode === 'worker'}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-[13px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>
          {(!data.startDate || !data.endDate) && (
            <p className="text-xs text-slate-500 mt-2 flex items-center">
              <AlertTriangle size={12} className="mr-1 text-amber-500" />
              기간이 설정되지 않아 진행률 계산이 제외됩니다.
            </p>
          )}
        </div>

        {/* Volume & Progress Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center text-slate-700 mb-3">
            <Target size={18} className="mr-2 text-slate-400" />
            <span className="font-semibold">전체 작업 물량 요약</span>
          </div>
          {mode === 'admin' ? (
            <textarea
              rows={3}
              value={data.totalVolume || ''}
              onChange={(e) => updateProjectInfo({ totalVolume: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[13px] leading-relaxed rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow min-h-[96px]"
              placeholder="예: 천장형 1way 650대, 벽걸이 110대 (총 761대)"
            />
          ) : (
            <div className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[13px] leading-relaxed rounded-xl p-4 min-h-[96px] whitespace-pre-wrap">
              {data.totalVolume || "등록된 전체 작업 물량 요약이 없습니다."}
            </div>
          )}

          <div className="mt-5">
            <div className="flex justify-between text-[13px] mb-2">
              <span className="text-slate-600 font-medium">작업 달성률</span>
              <span className="text-blue-600 font-bold text-base">{taskProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${taskProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Notice Card */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center text-amber-900 mb-2">
            <FileText size={18} className="mr-2 text-amber-600" />
            <span className="font-bold">공지사항</span>
          </div>
          {mode === 'admin' ? (
            <textarea
              value={data.notice || ''}
              onChange={(e) => updateProjectInfo({ notice: e.target.value })}
              className="w-full bg-white/60 border border-amber-200 text-amber-900 text-[13px] leading-relaxed rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow min-h-[96px]"
              placeholder="작업 전 주의사항을 입력하세요"
            />
          ) : (
            <div className="w-full bg-white/40 text-amber-900 text-[13px] leading-relaxed rounded-xl p-4 min-h-[96px] whitespace-pre-wrap font-medium">
              {data.notice || "등록된 공지사항이 없습니다."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
