import React from 'react';
import { Calendar, AlertTriangle, FileText, Target } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';

// Vercel 모노크롬 토큰 (60-30-10 법칙)
const vc = {
  bg: '#ffffff',        // 60% 주조색 - 메인 배경
  surface: '#fafafa',  // 30% 보조색 - 섹션/카드
  border: '#E5E7EB',   // 보조 테두리
  borderDark: '#D1D5DB',
  textMain: '#000000', // 주 텍스트
  textSec: '#6B7280',  // 보조 텍스트
  textDim: '#9CA3AF',  // 비활성 텍스트
  accent: '#000000',   // 10% 강조색 - 순수 블랙
  // 공지사항 레드 포인트 유지 (semantic color)
  red: '#DC2626',
  redBg: '#FEF2F2',
  redBorder: '#FECACA',
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

  const cardStyle = {
    backgroundColor: vc.bg,
    border: `1px solid ${vc.border}`,
    borderRadius: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
  };

  const inputStyle = {
    backgroundColor: vc.surface,
    border: `1px solid ${vc.border}`,
    color: vc.textMain,
    borderRadius: '12px',
  };

  return (
    <div className="p-4 pb-6" style={{ backgroundColor: vc.surface, borderBottom: `1px solid ${vc.border}` }}>
      {/* 프로젝트명 */}
      <div className="mb-6 px-2">
        {mode === 'admin' ? (
          <input
            type="text"
            value={data.projectName}
            onChange={(e) => updateProjectInfo({ projectName: e.target.value })}
            className="w-full text-[25px] font-bold border-b-2 border-transparent focus:outline-none pb-2 bg-transparent transition-colors min-h-[44px]"
            style={{ color: vc.textMain, borderBottomColor: 'transparent' }}
            onFocus={e => (e.currentTarget.style.borderBottomColor = vc.accent)}
            onBlur={e => (e.currentTarget.style.borderBottomColor = 'transparent')}
            placeholder="프로젝트명을 입력하세요"
          />
        ) : (
          <h2 className="text-[25px] font-bold tracking-tight min-h-[44px] flex items-center" style={{ color: vc.textMain }}>
            {data.projectName || '프로젝트 명칭 없음'}
          </h2>
        )}
      </div>

      <div className="space-y-4">
        {/* 기간 설정 카드 */}
        <div className="p-6" style={cardStyle}>
          <div className="flex items-center mb-4" style={{ color: vc.textSec }}>
            <Calendar size={18} className="mr-2" />
            <h2 className="font-semibold text-[16px]">기간 설정</h2>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={data.startDate || ''}
              onChange={(e) => updateProjectInfo({ startDate: e.target.value })}
              disabled={mode === 'worker'}
              className="flex-1 p-3 text-[15px] font-medium min-h-[44px] focus:outline-none transition-all disabled:opacity-40"
              style={{ ...inputStyle, outline: 'none' }}
              onFocus={e => (e.currentTarget.style.borderColor = vc.accent)}
              onBlur={e => (e.currentTarget.style.borderColor = vc.border)}
            />
            <span className="font-bold" style={{ color: vc.textDim }}>-</span>
            <input
              type="date"
              value={data.endDate || ''}
              onChange={(e) => updateProjectInfo({ endDate: e.target.value })}
              disabled={mode === 'worker'}
              className="flex-1 p-3 text-[15px] font-medium min-h-[44px] focus:outline-none transition-all disabled:opacity-40"
              style={{ ...inputStyle, outline: 'none' }}
              onFocus={e => (e.currentTarget.style.borderColor = vc.accent)}
              onBlur={e => (e.currentTarget.style.borderColor = vc.border)}
            />
          </div>
          {(!data.startDate || !data.endDate) && (
            <p className="text-xs mt-2 flex items-center" style={{ color: vc.textDim }}>
              <AlertTriangle size={12} className="mr-1 text-amber-500" />
              기간이 설정되지 않아 진행률 계산이 제외됩니다.
            </p>
          )}
        </div>

        {/* 전체 작업 물량 카드 */}
        <div className="p-6" style={cardStyle}>
          <div className="flex items-center mb-4" style={{ color: vc.textSec }}>
            <Target size={18} className="mr-2" />
            <h2 className="font-semibold text-[16px]">전체 작업 물량 요약</h2>
          </div>
          {mode === 'admin' ? (
            <textarea
              rows={3}
              value={data.totalVolume || ''}
              onChange={(e) => updateProjectInfo({ totalVolume: e.target.value })}
              className="w-full text-[15px] leading-relaxed p-4 focus:outline-none transition-all min-h-[96px] resize-none input-mac"
              style={{ ...inputStyle }}
              placeholder="예: 천장형 1way 650대, 벽걸이 110대 (총 761대)"
            />
          ) : (
            <div
              className="w-full text-[15px] leading-relaxed p-4 min-h-[96px] whitespace-pre-wrap rounded-xl"
              style={{ ...inputStyle, color: data.totalVolume ? vc.textMain : vc.textDim }}
            >
              {data.totalVolume || '등록된 전체 작업 물량 요약이 없습니다.'}
            </div>
          )}
          <div className="mt-5">
            <div className="flex justify-between text-[13px] mb-2">
              <span className="font-medium" style={{ color: vc.textSec }}>작업 달성률</span>
              <span className="font-bold text-base" style={{ color: vc.accent }}>{taskProgress}%</span>
            </div>
            <div className="w-full rounded-full h-2" style={{ backgroundColor: vc.border }}>
              <div
                className="h-2 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${taskProgress}%`, backgroundColor: vc.accent }}
              />
            </div>
          </div>
        </div>

        {/* 공지사항 카드 - Red Semantic 유지 */}
        <div
          className="p-6"
          style={{
            backgroundColor: vc.redBg,
            border: `1px solid ${vc.redBorder}`,
            borderRadius: '16px',
            boxShadow: '0 1px 4px rgba(220,38,38,0.05)',
          }}
        >
          <div className="flex items-center mb-4" style={{ color: vc.red }}>
            <FileText size={18} className="mr-2" />
            <h2 className="font-semibold text-[16px]">공지사항</h2>
          </div>
          {mode === 'admin' ? (
            <textarea
              value={data.notice || ''}
              onChange={(e) => updateProjectInfo({ notice: e.target.value })}
              className="w-full text-[15px] leading-relaxed p-4 focus:outline-none transition-all min-h-[96px] resize-none"
              style={{
                backgroundColor: '#ffffff',
                border: `1px solid ${vc.redBorder}`,
                color: '#111111',
                borderRadius: '12px',
              }}
              placeholder="작업 전 주의사항을 입력하세요"
            />
          ) : (
            <div
              className="w-full p-4 min-h-[96px] rounded-xl"
              style={{ backgroundColor: '#ffffff', border: `1px solid ${vc.redBorder}` }}
            >
              {data.notice ? (
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: '#111111' }}>
                  {data.notice}
                </p>
              ) : (
                <p className="text-[15px] italic" style={{ color: vc.redBorder }}>
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
