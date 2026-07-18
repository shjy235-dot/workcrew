import React, { useState } from 'react';
import { Calendar, AlertTriangle, FileText, Target, FolderOpen, Trash2, Building2 } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const getWeekday = (dateStr) => (dateStr ? WEEKDAYS[new Date(dateStr).getDay()] : '');
const formatDateShort = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${y.slice(2)}/${m}/${d}`;
};

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
  const { data, updateProjectInfo, mode, activeProjectId, listProjects, startNewProject, loadProject, deleteProject } = useProjectStore();
  const [showProjectList, setShowProjectList] = useState(false);
  const [projects, setProjects] = useState([]);

  const handleToggleProjectList = async () => {
    if (!showProjectList) {
      const list = await listProjects();
      setProjects(list);
    }
    setShowProjectList((v) => !v);
  };

  const handleStartNewProject = async () => {
    const name = window.prompt('새 프로젝트명을 입력하세요:');
    if (!name) return;
    if (!window.confirm(`"${name}" 프로젝트를 새로 시작합니다. 현재 프로젝트는 보관됩니다. 계속할까요?`)) return;
    await startNewProject(name);
    setShowProjectList(false);
  };

  const handleLoadProject = async (projectId, projectName) => {
    if (!window.confirm(`"${projectName || '이름 없음'}" 프로젝트를 불러옵니다. 계속할까요?`)) return;
    await loadProject(projectId);
    setShowProjectList(false);
  };

  const handleDeleteProject = async (projectId, projectName) => {
    if (!window.confirm(`"${projectName || '이름 없음'}" 프로젝트를 완전히 삭제합니다. 내부의 모든 일정과 작업 내역이 영구히 사라지며 되돌릴 수 없습니다. 계속할까요?`)) return;
    await deleteProject(projectId);
    const list = await listProjects();
    setProjects(list);
  };

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
      <div className="mb-6 px-2 flex flex-col items-center">
        <div
          className="flex items-center mb-3 px-4 py-1.5 rounded-full"
          style={{ backgroundColor: vc.surface, border: `1px solid ${vc.border}` }}
        >
          <Building2 size={14} className="mr-1.5" style={{ color: vc.textDim }} />
          <span className="text-[12px] font-bold tracking-wider uppercase" style={{ color: vc.textDim }}>
            진행 프로젝트
          </span>
        </div>
        {mode === 'admin' ? (
          <input
            type="text"
            value={data.projectName}
            onChange={(e) => updateProjectInfo({ projectName: e.target.value })}
            className="w-full font-extrabold text-center tracking-tight border-b-2 border-transparent focus:outline-none pb-2 bg-transparent transition-colors min-h-[44px]"
            style={{ color: vc.textMain, borderBottomColor: 'transparent', fontSize: 'clamp(18px, 6vw, 28px)' }}
            onFocus={e => (e.currentTarget.style.borderBottomColor = vc.accent)}
            onBlur={e => (e.currentTarget.style.borderBottomColor = 'transparent')}
            placeholder="프로젝트명을 입력하세요"
          />
        ) : (
          <h2
            className="w-full font-extrabold tracking-tight min-h-[44px] flex items-center justify-center text-center break-words leading-tight"
            style={{ color: vc.textMain, fontSize: 'clamp(18px, 6vw, 28px)' }}
          >
            {data.projectName || '프로젝트 명칭 없음'}
          </h2>
        )}
      </div>

      <div className="space-y-4">
        {/* 기간 설정 카드 */}
        <div className="p-4" style={cardStyle}>
          <div className="flex items-center mb-3" style={{ color: vc.textSec }}>
            <Calendar size={16} className="mr-2" />
            <h2 className="font-semibold text-[14px]">기간 설정</h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 min-w-0">
              <input
                type="date"
                value={data.startDate || ''}
                onChange={(e) => updateProjectInfo({ startDate: e.target.value })}
                disabled={mode === 'worker'}
                className="absolute inset-0 w-full h-full opacity-0 disabled:cursor-not-allowed"
                style={{ cursor: mode === 'worker' ? 'not-allowed' : 'pointer' }}
              />
              <div
                className="w-full p-3 text-[14px] font-semibold min-h-[44px] flex items-center justify-between pointer-events-none disabled:opacity-40"
                style={{ ...inputStyle, opacity: mode === 'worker' ? 0.4 : 1 }}
              >
                <span className="truncate">
                  {data.startDate ? `${formatDateShort(data.startDate)}(${getWeekday(data.startDate)})` : '날짜 선택'}
                </span>
                <Calendar size={14} className="ml-1 shrink-0" style={{ color: vc.textDim }} />
              </div>
            </div>
            <span className="font-bold shrink-0" style={{ color: vc.textDim }}>-</span>
            <div className="relative flex-1 min-w-0">
              <input
                type="date"
                value={data.endDate || ''}
                onChange={(e) => updateProjectInfo({ endDate: e.target.value })}
                disabled={mode === 'worker'}
                className="absolute inset-0 w-full h-full opacity-0 disabled:cursor-not-allowed"
                style={{ cursor: mode === 'worker' ? 'not-allowed' : 'pointer' }}
              />
              <div
                className="w-full p-3 text-[14px] font-semibold min-h-[44px] flex items-center justify-between pointer-events-none disabled:opacity-40"
                style={{ ...inputStyle, opacity: mode === 'worker' ? 0.4 : 1 }}
              >
                <span className="truncate">
                  {data.endDate ? `${formatDateShort(data.endDate)}(${getWeekday(data.endDate)})` : '날짜 선택'}
                </span>
                <Calendar size={14} className="ml-1 shrink-0" style={{ color: vc.textDim }} />
              </div>
            </div>
          </div>
          {(!data.startDate || !data.endDate) && (
            <p className="text-xs mt-2 flex items-center" style={{ color: vc.textDim }}>
              <AlertTriangle size={12} className="mr-1 text-amber-500" />
              기간이 설정되지 않아 진행률 계산이 제외됩니다.
            </p>
          )}
        </div>

        {/* 전체 작업 요약 카드 */}
        <div className="p-7" style={cardStyle}>
          <div className="flex items-center mb-4" style={{ color: vc.textSec }}>
            <Target size={18} className="mr-2" />
            <h2 className="font-semibold text-[16px]">전체 작업 요약</h2>
          </div>
          {mode === 'admin' ? (
            <textarea
              rows={6}
              value={data.totalVolume || ''}
              onChange={(e) => updateProjectInfo({ totalVolume: e.target.value })}
              className="w-full text-[15px] leading-relaxed p-4 focus:outline-none transition-all min-h-[160px] resize-none input-mac"
              style={{ ...inputStyle }}
              placeholder="예: 천장형 1way 650대, 벽걸이 110대 (총 761대)"
            />
          ) : (
            <div
              className="w-full text-[15px] leading-relaxed p-4 min-h-[160px] whitespace-pre-wrap rounded-xl"
              style={{ ...inputStyle, color: data.totalVolume ? vc.textMain : vc.textDim }}
            >
              {data.totalVolume || '등록된 전체 작업 요약이 없습니다.'}
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
          className="p-4"
          style={{
            backgroundColor: vc.redBg,
            border: `1px solid ${vc.redBorder}`,
            borderRadius: '16px',
            boxShadow: '0 1px 4px rgba(220,38,38,0.05)',
          }}
        >
          <div className="flex items-center mb-3" style={{ color: vc.red }}>
            <FileText size={16} className="mr-2" />
            <h2 className="font-semibold text-[14px]">공지사항</h2>
          </div>
          {mode === 'admin' ? (
            <textarea
              rows={2}
              value={data.notice || ''}
              onChange={(e) => updateProjectInfo({ notice: e.target.value })}
              className="w-full text-[15px] leading-relaxed p-4 focus:outline-none transition-all min-h-[64px] resize-none"
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
              className="w-full p-4 min-h-[64px] rounded-xl"
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

        {/* 프로젝트 관리 카드 (관리자 전용) */}
        {mode === 'admin' && (
          <div className="p-6" style={cardStyle}>
            <div className="flex items-center mb-4" style={{ color: vc.textSec }}>
              <FolderOpen size={18} className="mr-2" />
              <h2 className="font-semibold text-[16px]">프로젝트 관리</h2>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleStartNewProject}
                className="flex-1 py-3 rounded-xl text-[13px] font-medium min-h-[44px] transition-all btn-mac"
                style={{ backgroundColor: vc.accent, color: '#ffffff', border: `1px solid ${vc.accent}` }}
              >
                새 프로젝트 시작
              </button>
              <button
                onClick={handleToggleProjectList}
                className="flex-1 py-3 rounded-xl text-[13px] font-medium min-h-[44px] transition-all btn-mac"
                style={{ backgroundColor: vc.bg, color: vc.textMain, border: `1px solid ${vc.border}` }}
              >
                이전 프로젝트 불러오기
              </button>
            </div>

            {showProjectList && (
              <div className="mt-4 space-y-2">
                {projects.length === 0 ? (
                  <p className="text-[13px]" style={{ color: vc.textDim }}>불러올 프로젝트가 없습니다.</p>
                ) : (
                  projects.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{ backgroundColor: vc.surface, border: `1px solid ${vc.border}` }}
                    >
                      <div>
                        <p className="font-medium text-[14px]" style={{ color: vc.textMain }}>
                          {p.project_name || '이름 없음'}
                        </p>
                        <p className="text-[11px]" style={{ color: vc.textDim }}>
                          {p.id === activeProjectId ? '현재 진행 중' : '보관됨'} · {p.start_date || '?'} ~ {p.end_date || '?'}
                        </p>
                      </div>
                      {p.id !== activeProjectId && (
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => handleLoadProject(p.id, p.project_name)}
                            className="px-3 py-2 rounded-lg text-[12px] font-medium min-h-[44px]"
                            style={{ backgroundColor: vc.accent, color: '#ffffff' }}
                          >
                            불러오기
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.id, p.project_name)}
                            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors"
                            style={{ color: vc.textDim }}
                            onMouseEnter={e => (e.currentTarget.style.color = vc.red)}
                            onMouseLeave={e => (e.currentTarget.style.color = vc.textDim)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
