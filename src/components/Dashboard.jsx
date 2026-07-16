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
    <div className="bg-white p-5 shadow-sm border-b border-gray-100">
      <div className="mb-4">
        {mode === 'admin' ? (
          <input
            type="text"
            value={data.projectName}
            onChange={(e) => updateProjectInfo({ projectName: e.target.value })}
            className="w-full text-2xl font-bold text-gray-900 border-b border-gray-200 focus:border-accent-blue focus:outline-none pb-1 bg-transparent"
            placeholder="프로젝트명을 입력하세요"
          />
        ) : (
          <h2 className="text-2xl font-bold text-gray-900">{data.projectName || "프로젝트 명칭 없음"}</h2>
        )}
      </div>

      <div className="bg-secondary rounded-xl p-4 mb-4">
        <div className="flex items-center text-gray-700 mb-3">
          <Calendar size={18} className="mr-2 text-gray-500" />
          <span className="font-semibold">기간 설정</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={data.startDate || ''}
            onChange={(e) => updateProjectInfo({ startDate: e.target.value })}
            disabled={mode === 'worker'}
            className="flex-1 bg-white border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-accent-blue disabled:bg-gray-100 disabled:text-gray-500"
          />
          <span className="text-gray-500 font-bold">-</span>
          <input
            type="date"
            value={data.endDate || ''}
            onChange={(e) => updateProjectInfo({ endDate: e.target.value })}
            disabled={mode === 'worker'}
            className="flex-1 bg-white border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-accent-blue disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>
        
        {(!data.startDate || !data.endDate) && (
          <p className="text-xs text-accent-orange mt-2 flex items-center">
            <AlertTriangle size={12} className="mr-1" />
            기간이 설정되지 않아 진행률 계산이 제외됩니다.
          </p>
        )}
      </div>

      <div className="mb-5">
        <div className="flex items-center text-gray-700 mb-2">
          <Target size={18} className="mr-2 text-gray-500" />
          <span className="font-semibold">전체 작업 물량 요약</span>
        </div>
        {mode === 'admin' ? (
          <textarea
            rows={4}
            value={data.totalVolume || ''}
            onChange={(e) => updateProjectInfo({ totalVolume: e.target.value })}
            className="w-full bg-blue-50 border border-blue-200 text-blue-900 text-sm rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-blue min-h-[110px]"
            placeholder="예: 천장형 1way 650대, 벽걸이 110대 (총 761대)"
          />
        ) : (
          <div className="w-full bg-blue-50 border border-blue-200 text-blue-900 text-sm rounded-lg p-3 min-h-[110px] whitespace-pre-wrap">
            {data.totalVolume || "등록된 전체 작업 물량 요약이 없습니다."}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm font-medium mb-1">
            <span className="text-gray-600">작업 달성률</span>
            <span className="text-accent-blue font-bold">{taskProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-accent-blue h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${taskProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-gray-100 pt-4">
        <div className="flex items-center text-gray-700 mb-2">
          <FileText size={18} className="mr-2 text-gray-500" />
          <span className="font-semibold">현장 공지 / 안전사항</span>
        </div>
        {mode === 'admin' ? (
          <textarea
            value={data.notice || ''}
            onChange={(e) => updateProjectInfo({ notice: e.target.value })}
            className="w-full bg-red-50 border border-red-200 text-red-900 text-sm rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[80px]"
            placeholder="작업 전 주의사항을 입력하세요"
          />
        ) : (
          <div className="w-full bg-red-50 border border-red-200 text-red-900 text-sm rounded-lg p-3 min-h-[80px] whitespace-pre-wrap">
            {data.notice || "등록된 공지사항이 없습니다."}
          </div>
        )}
      </div>
    </div>
  );
}
