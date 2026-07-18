import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { Plus, Trash2, CheckCircle2, PlayCircle, MapPin, Wrench, Target, MessageSquare, Calendar, Building2 } from 'lucide-react';

// Vercel 모노크롬 토큰 (60-30-10 법칙)
const vc = {
  bg: '#ffffff',        // 60% - 메인 배경
  surface: '#fafafa',  // 30% - 섹션 배경
  border: '#E5E7EB',
  borderDark: '#D1D5DB',
  textMain: '#000000',
  textSec: '#6B7280',
  textDim: '#9CA3AF',
  accent: '#000000',   // 10% - 순수 블랙 강조
  red: '#DC2626',
  // Semantic colors (접근성 유지)
  blue: '#2563EB',
  green: '#16A34A',
  amber: '#D97706',
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const getWeekday = (dateStr) => (dateStr ? WEEKDAYS[new Date(dateStr).getDay()] : '');
const formatDateShort = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${y.slice(2)}/${m}/${d}`;
};

export default function DayModule({ activeDayId }) {
  const { data, mode, workerName, addTask, updateTask, removeTask, updateDay } = useProjectStore();
  const day = data.days.find((d) => d.id === activeDayId);
  const [memoInput, setMemoInput] = useState({});

  if (!day) return null;

  const handleStatusChange = (taskId, newStatus) => {
    updateTask(day.id, taskId, { status: newStatus });
  };

  const handleMemoSubmit = (taskId) => {
    const text = memoInput[taskId]?.trim();
    if (!text) return;
    const task = day.tasks.find((t) => t.id === taskId);
    const timestamp = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    const namePrefix = workerName ? `[${workerName}] ` : mode === 'admin' ? '[관리자] ' : '[작업자] ';
    const newMemoLine = `${namePrefix}${text} - ${timestamp}`;
    const updatedMemo = task.memo ? `${task.memo}\n${newMemoLine}` : newMemoLine;
    updateTask(day.id, taskId, { memo: updatedMemo });
    setMemoInput({ ...memoInput, [taskId]: '' });
  };

  const cardStyle = {
    backgroundColor: vc.bg,
    border: `1px solid ${vc.border}`,
    borderRadius: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
    overflow: 'hidden',
    marginBottom: '20px',
  };

  const inputStyle = {
    backgroundColor: vc.surface,
    border: `1px solid ${vc.border}`,
    color: vc.textMain,
    borderRadius: '12px',
  };

  const labelStyle = {
    fontSize: '10px',
    fontWeight: '700',
    color: vc.textDim,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  };

  return (
    <div className="p-4 pb-28" style={{ backgroundColor: '#f8fafc' }}>
      {mode === 'admin' && (
        <div className="flex space-x-2 mb-4">
          <div
            className="relative flex-1 min-w-0 flex items-center px-3 py-2 rounded-xl min-h-[44px]"
            style={{ backgroundColor: vc.bg, border: `1px solid ${vc.border}` }}
          >
            <Calendar size={16} className="mr-2 flex-shrink-0" style={{ color: vc.textDim }} />
            <span className="truncate text-[14px] font-medium" style={{ color: day.date ? vc.textMain : vc.textDim }}>
              {day.date ? `${formatDateShort(day.date)}(${getWeekday(day.date)})` : '날짜 선택'}
            </span>
            <input
              type="date"
              value={day.date || ''}
              onChange={(e) => updateDay(day.id, { date: e.target.value })}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div
            className="flex-1 flex items-center px-3 py-2 rounded-xl min-h-[44px]"
            style={{ backgroundColor: vc.bg, border: `1px solid ${vc.border}` }}
          >
            <Building2 size={16} className="mr-2 flex-shrink-0" style={{ color: vc.textDim }} />
            <input
              type="text"
              value={day.site || ''}
              onChange={(e) => updateDay(day.id, { site: e.target.value })}
              placeholder="예: 담곡학사"
              className="w-full bg-transparent text-[14px] font-medium focus:outline-none"
              style={{ color: vc.textMain }}
            />
          </div>
        </div>
      )}

      {day.tasks.length === 0 ? (
        <div
          className="text-center py-12 rounded-2xl"
          style={{ border: `2px dashed ${vc.border}`, backgroundColor: vc.bg }}
        >
          <p className="mb-3 font-medium" style={{ color: vc.textSec }}>
            등록된 작업 내역이 없습니다.
          </p>
          {mode === 'admin' && (
            <button
              onClick={() => addTask(day.id)}
              className="px-6 py-3 rounded-xl text-[13px] font-medium flex items-center justify-center mx-auto transition-all min-h-[44px] btn-mac"
              style={{ backgroundColor: vc.accent, color: '#ffffff', border: `1px solid ${vc.accent}` }}
            >
              <Plus size={18} className="mr-2" />
              첫 작업 추가하기
            </button>
          )}
        </div>
      ) : (
        day.tasks.map((task, index) => (
          <div key={task.id} style={cardStyle}>
            {/* 헤더 */}
            <div
              className="px-5 py-3.5 flex justify-between items-center"
              style={{ borderBottom: `1px solid ${vc.border}`, backgroundColor: vc.surface }}
            >
              {mode === 'admin' ? (
                <input
                  type="text"
                  value={task.title || ''}
                  onChange={(e) => updateTask(day.id, task.id, { title: e.target.value })}
                  placeholder={`작업 #${index + 1}`}
                  className="font-bold text-[18px] tracking-tight bg-transparent border-none focus:outline-none w-full"
                  style={{ color: vc.textMain }}
                />
              ) : (
                <h3 className="font-bold text-[18px] tracking-tight" style={{ color: vc.textMain }}>
                  {task.title || `작업 #${index + 1}`}
                </h3>
              )}
              {mode === 'admin' && (
                <button
                  onClick={() => {
                    if (window.confirm('이 작업을 삭제하시겠습니까?')) removeTask(day.id, task.id);
                  }}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors"
                  style={{ color: vc.textDim }}
                  onMouseEnter={e => (e.currentTarget.style.color = vc.red)}
                  onMouseLeave={e => (e.currentTarget.style.color = vc.textDim)}
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            <div className="p-5 space-y-5">
              {/* 작업 범위 */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center mb-1">
                  <MapPin size={16} className="mr-2 flex-shrink-0" style={{ color: vc.textDim }} />
                  <label style={labelStyle}>작업 범위 (Work Scope)</label>
                </div>
                {mode === 'admin' ? (
                  <input
                    value={task.scope || ''}
                    onChange={(e) => updateTask(day.id, task.id, { scope: e.target.value })}
                    placeholder="예: A동 1층 로비"
                    className="w-full px-4 py-3 text-[15px] focus:outline-none transition-all min-h-[44px] input-mac"
                    style={{ ...inputStyle }}
                    onFocus={e => (e.currentTarget.style.borderColor = vc.accent)}
                    onBlur={e => (e.currentTarget.style.borderColor = vc.border)}
                  />
                ) : (
                  <div className="px-4 py-3 min-h-[44px] flex items-center rounded-xl" style={{ backgroundColor: vc.surface, border: `1px solid ${vc.border}` }}>
                    <p className="font-medium text-[15px]" style={{ color: task.scope ? vc.textMain : vc.textDim }}>
                      {task.scope || '-'}
                    </p>
                  </div>
                )}
              </div>

              {/* 에어컨 종류 및 수량 (다중 항목) */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center mb-1">
                  <Target size={16} className="mr-2 flex-shrink-0" style={{ color: vc.textDim }} />
                  <label style={labelStyle}>에어컨 종류 및 수량</label>
                </div>
                {mode === 'admin' ? (
                  <div className="space-y-2">
                    {(task.acItems || []).map((item) => (
                      <div key={item.id} className="flex space-x-2">
                        <select
                          value={item.type || ''}
                          onChange={(e) => {
                            const newItems = (task.acItems || []).map(it =>
                              it.id === item.id ? { ...it, type: e.target.value } : it
                            );
                            updateTask(day.id, task.id, { acItems: newItems });
                          }}
                          className="flex-1 px-4 py-3 text-[15px] min-h-[44px] focus:outline-none transition-all appearance-none"
                          style={inputStyle}
                        >
                          <option value="">선택</option>
                          <option value="벽걸이">벽걸이</option>
                          <option value="천장형 1way(EHP)">천장형 1way(EHP)</option>
                          <option value="천장형 1way(FCU)">천장형 1way(FCU)</option>
                          <option value="천장형 4way(EHP)">천장형 4way(EHP)</option>
                          <option value="천장형 4way(FCU)">천장형 4way(FCU)</option>
                          <option value="스탠드">스탠드</option>
                        </select>
                        <div
                          className="flex items-center w-24 rounded-xl overflow-hidden min-h-[44px]"
                          style={{ backgroundColor: vc.surface, border: `1px solid ${vc.border}` }}
                        >
                          <input
                            type="number"
                            value={item.count || ''}
                            onChange={(e) => {
                              const newItems = (task.acItems || []).map(it =>
                                it.id === item.id ? { ...it, count: e.target.value } : it
                              );
                              updateTask(day.id, task.id, { acItems: newItems });
                            }}
                            placeholder="0"
                            className="w-full bg-transparent p-3 text-[15px] font-medium focus:outline-none text-center"
                            style={{ color: vc.textMain }}
                          />
                        </div>
                        <button
                          onClick={() => {
                            const newItems = (task.acItems || []).filter(it => it.id !== item.id);
                            updateTask(day.id, task.id, { acItems: newItems });
                          }}
                          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors"
                          style={{ backgroundColor: vc.surface, border: `1px solid ${vc.border}`, color: vc.textDim }}
                          onMouseEnter={e => (e.currentTarget.style.color = vc.red)}
                          onMouseLeave={e => (e.currentTarget.style.color = vc.textDim)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newItems = [...(task.acItems || []), { id: `ac-${Date.now()}`, type: '', count: '' }];
                        updateTask(day.id, task.id, { acItems: newItems });
                      }}
                      className="w-full py-2.5 rounded-xl text-[13px] font-medium flex items-center justify-center transition-all min-h-[44px]"
                      style={{ backgroundColor: vc.bg, color: vc.textDim, border: `1.5px dashed ${vc.border}` }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = vc.accent; e.currentTarget.style.color = vc.accent; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = vc.border; e.currentTarget.style.color = vc.textDim; }}
                    >
                      <Plus size={16} className="mr-1.5" />
                      에어컨 종류 추가
                    </button>
                  </div>
                ) : (
                  <div
                    className="px-4 py-3 rounded-xl"
                    style={{ backgroundColor: vc.surface, border: `1px solid ${vc.border}` }}
                  >
                    {(task.acItems || []).length === 0 ? (
                      <p className="font-medium text-[15px]" style={{ color: vc.textDim }}>-</p>
                    ) : (
                      <div className="space-y-1.5">
                        {(task.acItems || []).map((item) => (
                          <div key={item.id} className="flex justify-between items-center min-h-[28px]">
                            <span className="font-medium text-[15px]" style={{ color: vc.textMain }}>{item.type || '-'}</span>
                            <span className="font-bold text-[15px]" style={{ color: vc.textMain }}>{item.count || 0}대</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 진행 수량 */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center mb-1">
                  <CheckCircle2 size={16} className="mr-2 flex-shrink-0" style={{ color: vc.textDim }} />
                  <label style={labelStyle}>진행 수량 (완료 / 미완료)</label>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  {/* 완료 수량 */}
                  <div
                    className="flex flex-col p-4 rounded-xl min-h-[72px] justify-center"
                    style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}
                  >
                    <span className="text-[10px] font-bold mb-1" style={{ color: vc.blue }}>완료 수량</span>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={task.completedCount || ''}
                        onChange={(e) => updateTask(day.id, task.id, { completedCount: e.target.value })}
                        placeholder="0"
                        className="w-full bg-transparent text-[20px] font-bold focus:outline-none min-h-[32px]"
                        style={{ color: vc.textMain }}
                      />
                      <span className="text-[15px] font-medium" style={{ color: vc.textSec }}>대</span>
                    </div>
                  </div>
                  {/* 잔여 수량 */}
                  <div
                    className="flex flex-col p-4 rounded-xl min-h-[72px] justify-center"
                    style={{ backgroundColor: vc.surface, border: `1px solid ${vc.border}` }}
                  >
                    <span className="text-[10px] font-bold mb-1" style={{ color: vc.textDim }}>잔여 수량</span>
                    <div className="flex items-center">
                      <div className="w-full text-[20px] font-bold min-h-[32px] flex items-center" style={{ color: vc.textMain }}>
                        {Math.max(0, (task.acItems || []).reduce((sum, item) => sum + (Number(item.count) || 0), 0) - (Number(task.completedCount) || 0))}
                      </div>
                      <span className="text-[15px] font-medium" style={{ color: vc.textSec }}>대</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 진행 상태 */}
              <div className="pt-4" style={{ borderTop: `1px solid ${vc.border}` }}>
                <div className="flex items-center mb-3">
                  <Wrench size={16} className="mr-2" style={{ color: vc.textDim }} />
                  <label style={labelStyle}>진행 상태 (Status)</label>
                </div>
                <div className="flex p-1 rounded-xl" style={{ backgroundColor: vc.surface }}>
                  <button
                    onClick={() => mode === 'admin' && handleStatusChange(task.id, 'in-progress')}
                    disabled={mode !== 'admin'}
                    className="flex-1 flex items-center justify-center min-h-[44px] rounded-lg transition-all text-[15px] font-medium disabled:cursor-not-allowed"
                    style={
                      task.status === 'in-progress'
                        ? { backgroundColor: vc.bg, color: vc.blue, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: `1px solid ${vc.border}` }
                        : { color: vc.textDim }
                    }
                  >
                    <PlayCircle size={18} className="mr-2" style={{ color: task.status === 'in-progress' ? vc.blue : vc.textDim }} />
                    진행중
                  </button>
                  <button
                    onClick={() => mode === 'admin' && handleStatusChange(task.id, 'completed')}
                    disabled={mode !== 'admin'}
                    className="flex-1 flex items-center justify-center min-h-[44px] rounded-lg transition-all text-[15px] font-medium disabled:cursor-not-allowed"
                    style={
                      task.status === 'completed'
                        ? { backgroundColor: vc.bg, color: vc.green, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: `1px solid ${vc.border}` }
                        : { color: vc.textDim }
                    }
                  >
                    <CheckCircle2 size={18} className="mr-2" style={{ color: task.status === 'completed' ? vc.green : vc.textDim }} />
                    작업완료
                  </button>
                </div>
              </div>

              {/* 현장 메모 */}
              <div className="pt-4" style={{ borderTop: `1px solid ${vc.border}` }}>
                <div className="flex items-center mb-3">
                  <MessageSquare size={16} className="mr-2" style={{ color: vc.textDim }} />
                  <label style={labelStyle}>현장 메모 / 특이사항</label>
                </div>

                {task.memo && (
                  <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-1">
                    {task.memo
                      .split('\n')
                      .filter(Boolean)
                      .map((line, lineIndex) => (
                        <div
                          key={lineIndex}
                          className="flex justify-between items-start p-4 rounded-xl"
                          style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}
                        >
                          <div className="text-[13px] whitespace-pre-wrap leading-relaxed flex-1" style={{ color: '#92400E' }}>
                            {line}
                          </div>
                          <button
                            onClick={() => {
                              if (window.confirm('이 메모를 삭제하시겠습니까?')) {
                                const lines = task.memo.split('\n').filter(Boolean);
                                lines.splice(lineIndex, 1);
                                updateTask(day.id, task.id, { memo: lines.join('\n') });
                              }
                            }}
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors ml-2 flex-shrink-0"
                            style={{ color: vc.textDim }}
                            onMouseEnter={e => (e.currentTarget.style.color = vc.red)}
                            onMouseLeave={e => (e.currentTarget.style.color = vc.textDim)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                  </div>
                )}

                <div className="flex items-stretch space-x-2">
                  <input
                    type="text"
                    value={memoInput[task.id] || ''}
                    onChange={(e) => setMemoInput({ ...memoInput, [task.id]: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleMemoSubmit(task.id)}
                    placeholder="현장 특이사항을 입력하세요..."
                    className="flex-1 px-4 py-3 text-[15px] focus:outline-none transition-shadow min-h-[44px] input-mac"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = vc.accent)}
                    onBlur={e => (e.currentTarget.style.borderColor = vc.border)}
                  />
                  <button
                    onClick={() => handleMemoSubmit(task.id)}
                    className="px-5 py-3 rounded-xl text-[13px] font-medium transition-all whitespace-nowrap min-h-[44px] flex items-center justify-center btn-mac"
                    style={{ backgroundColor: vc.accent, color: '#ffffff', border: `1px solid ${vc.accent}` }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#222222')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = vc.accent)}
                  >
                    등록
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {mode === 'admin' && day.tasks.length > 0 && (
        <button
          onClick={() => addTask(day.id)}
          className="w-full py-4 rounded-2xl font-medium flex items-center justify-center transition-all min-h-[44px] text-[13px]"
          style={{
            backgroundColor: vc.bg,
            color: vc.textDim,
            border: `2px dashed ${vc.border}`,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = vc.accent;
            e.currentTarget.style.color = vc.accent;
            e.currentTarget.style.backgroundColor = vc.surface;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = vc.border;
            e.currentTarget.style.color = vc.textDim;
            e.currentTarget.style.backgroundColor = vc.bg;
          }}
        >
          <Plus size={18} className="mr-2" />
          해당 일자에 새로운 작업 추가
        </button>
      )}
    </div>
  );
}
