import React from 'react';
import { Calendar, AlertTriangle, FileText, Target } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';

// Raycast 스타일 다크 테마 색상 토큰
const rc = {
  surface: '#101111',
  card: '#1b1c1e',
  border: 'rgba(255, 255, 255, 0.06)',
  borderSolid: '#252829',
  textMain: '#f9f9f9',
  textSec: '#9c9c9d',
  textDim: '#6a6b6c',
  red: '#FF6363',
  blue: '#55b3ff',
};

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

  const inputStyle = {
    backgroundColor: rc.card,
    border: `1px solid ${rc.borderSolid}`,
    color: rc.textMain,
    borderRadius: '12px',
  };

  const cardStyle = {
    backgroundColor: rc.surface,
    border: `1px solid ${rc.border}`,
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
  };

  return (
    <div className="p-4 pb-6" style={{ borderBottom: `1px solid ${rc.border}` }}>
      {/* 프로젝트명 */}
      <div className="mb-6 px-2">
        {mode === 'admin' ? (
          <input
            type="text"
            value={data.projectName}
            onChange={(e) => updateProjectInfo({ projectName: e.target.value })}
            className="w-full text-[25px] font-bold border-b-2 border-transparent focus:outline-none pb-2 bg-transparent transition-colors min-h-[44px]"
            style={{ color: rc.textMain, borderBottomColor: 'transparent' }}
            onFocus={e => (e.currentTarget.style.borderBottomColor = rc.blue)}
            onBlur={e => (e.currentTarget.style.borderBottomColor = 'transparent')}
            placeholder="프로젝트명을 입력하세요"
          />
        ) : (
          <h2 className="text-[25px] font-bold tracking-tight min-h-[44px] flex items-center" style={{ color: rc.textMain }}>
            {data.projectName || '프로젝트 명칭 없음'}
          </h2>
        )}
      </div>

      <div className="space-y-6">
        {/* 기간 설정 카드 */}
        <div className="p-6" style={cardStyle}>
          <div className="flex items-center mb-4" style={{ color: rc.textSec }}>
            <Calendar size={18} className="mr-2" />
            <h2 className="font-semibold text-[16px]">기간 설정</h2>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={data.startDate || ''}
              onChange={(e) => updateProjectInfo({ startDate: e.target.value })}
              disabled={mode === 'worker'}
              className="flex-1 p-3 text-[15px] font-medium min-h-[44px] focus:outline-none transition-shadow disabled:opacity-40"
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
            <span className="font-bold" style={{ color: rc.textDim }}>-</span>
            <input
              type="date"
              value={data.endDate || ''}
              onChange={(e) => updateProjectInfo({ endDate: e.target.value })}
              disabled={mode === 'worker'}
              className="flex-1 p-3 text-[15px] font-medium min-h-[44px] focus:outline-none transition-shadow disabled:opacity-40"
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
          </div>
          {(!data.startDate || !data.endDate) && (
            <p className="text-xs mt-2 flex items-center" style={{ color: rc.textDim }}>
              <AlertTriangle size={12} className="mr-1" style={{ color: '#ffbc33' }} />
              기간이 설정되지 않아 진행률 계산이 제외됩니다.
            </p>
          )}
        </div>

        {/* 전체 작업 물량 카드 */}
        <div className="p-6" style={cardStyle}>
          <div className="flex items-center mb-4" style={{ color: rc.textSec }}>
            <Target size={18} className="mr-2" />
            <h2 className="font-semibold text-[16px]">전체 작업 물량 요약</h2>
          </div>
          {mode === 'admin' ? (
            <textarea
              rows={3}
              value={data.totalVolume || ''}
              onChange={(e) => updateProjectInfo({ totalVolume: e.target.value })}
              className="w-full text-[15px] leading-relaxed p-4 focus:outline-none transition-shadow min-h-[96px] resize-none"
              style={{ ...inputStyle, boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.3)' }}
              placeholder="예: 천장형 1way 650대, 벽걸이 110대 (총 761대)"
            />
          ) : (
            <div
              className="w-full text-[15px] leading-relaxed p-4 min-h-[96px] whitespace-pre-wrap"
              style={{ ...inputStyle, color: data.totalVolume ? rc.textMain : rc.textDim }}
            >
              {data.totalVolume || '등록된 전체 작업 물량 요약이 없습니다.'}
            </div>
          )}

          <div className="mt-5">
            <div className="flex justify-between text-[13px] mb-2">
              <span className="font-medium" style={{ color: rc.textSec }}>작업 달성률</span>
              <span className="font-bold text-base" style={{ color: rc.blue }}>{taskProgress}%</span>
            </div>
            <div className="w-full rounded-full h-2" style={{ backgroundColor: rc.borderSolid }}>
              <div
                className="h-2 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${taskProgress}%`,
                  background: `linear-gradient(90deg, ${rc.blue}, #a78bfa)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* 공지사항 카드 - Raycast Red 포인트 */}
        <div
          className="p-6"
          style={{
            backgroundColor: 'rgba(255, 99, 99, 0.08)',
            border: `1px solid rgba(255, 99, 99, 0.25)`,
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(255,99,99,0.08)',
          }}
        >
          <div className="flex items-center mb-4" style={{ color: rc.red }}>
            <FileText size={18} className="mr-2" />
            <h2 className="font-semibold text-[16px]">공지사항</h2>
          </div>

          {mode === 'admin' ? (
            <textarea
              value={data.notice || ''}
              onChange={(e) => updateProjectInfo({ notice: e.target.value })}
              className="w-full text-[15px] leading-relaxed p-4 focus:outline-none transition-shadow min-h-[96px] resize-none"
              style={{
                backgroundColor: 'rgba(255, 99, 99, 0.08)',
                border: `1px solid rgba(255, 99, 99, 0.2)`,
                color: '#f9f9f9',
                borderRadius: '12px',
              }}
              placeholder="작업 전 주의사항을 입력하세요"
            />
          ) : (
            <div
              className="w-full p-4 min-h-[96px] rounded-xl"
              style={{
                backgroundColor: 'rgba(255, 99, 99, 0.08)',
                border: `1px solid rgba(255, 99, 99, 0.15)`,
              }}
            >
              {data.notice ? (
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: '#f9f9f9' }}>
                  {data.notice}
                </p>
              ) : (
                <p className="text-[15px] italic" style={{ color: 'rgba(255,99,99,0.5)' }}>
                  등록된 공지사항이 없습니다.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
