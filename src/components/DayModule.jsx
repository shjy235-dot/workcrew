import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { Plus, Trash2, CheckCircle2, Clock, PlayCircle, MapPin, Wrench, Target, MessageSquare } from 'lucide-react';

// Raycast 다크 테마 토큰
const rc = {
  bg: '#07080a',
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

export default function DayModule({ activeDayId }) {
  const { data, mode, workerName, addTask, updateTask, removeTask } = useProjectStore();
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
    backgroundColor: rc.surface,
    border: `1px solid ${rc.border}`,
    borderRadius: '16px',
    boxShadow: 'rgb(27 28 30) 0px 0px 0px 1px, 0 8px 32px rgba(0,0,0,0.5)',
    overflow: 'hidden',
    marginBottom: '24px',
  };

  const inputStyle = {
    backgroundColor: rc.card,
    border: `1px solid ${rc.borderSolid}`,
    color: rc.textMain,
    borderRadius: '12px',
  };

  const labelStyle = {
    fontSize: '10px',
    fontWeight: '700',
    color: rc.textDim,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  };

  return (
    <div className="p-4 pb-28" style={{ backgroundColor: rc.bg }}>
      {day.tasks.length === 0 ? (
        <div
          className="text-center py-12 rounded-2xl"
          style={{ border: `2px dashed ${rc.borderSolid}`, backgroundColor: rc.surface }}
        >
          <p className="mb-3 font-medium" style={{ color: rc.textSec }}>
            등록된 작업 내역이 없습니다.
          </p>
          {mode === 'admin' && (
            <button
              onClick={() => addTask(day.id)}
              className="px-6 py-3 rounded-xl text-[13px] font-medium flex items-center justify-center mx-auto transition-all min-h-[44px]"
              style={{
                backgroundColor: rc.blue,
                color: rc.bg,
                boxShadow: `0 0 20px rgba(85, 179, 255, 0.3)`,
              }}
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
              style={{ borderBottom: `1px solid ${rc.border}`, backgroundColor: rc.card }}
            >
              {mode === 'admin' ? (
                <input
                  type="text"
                  value={task.title || ''}
                  onChange={(e) => updateTask(day.id, task.id, { title: e.target.value })}
                  placeholder={`작업 #${index + 1}`}
                  className="font-bold text-[18px] tracking-tight bg-transparent border-none focus:outline-none w-full"
                  style={{ color: rc.textMain }}
                />
              ) : (
                <h3 className="font-bold text-[18px] tracking-tight" style={{ color: rc.textMain }}>
                  {task.title || `작업 #${index + 1}`}
                </h3>
              )}
              {mode === 'admin' && (
                <button
                  onClick={() => {
                    if (window.confirm('이 작업을 삭제하시겠습니까?')) removeTask(day.id, task.id);
                  }}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors"
                  style={{ color: rc.textDim }}
                  onMouseEnter={e => (e.currentTarget.style.color = rc.red)}
                  onMouseLeave={e => (e.currentTarget.style.color = rc.textDim)}
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            <div className="p-5 space-y-6">
              {/* 작업 범위 */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center mb-1">
                  <MapPin size={16} className="mr-2 flex-shrink-0" style={{ color: rc.textDim }} />
                  <label style={labelStyle}>작업 범위 (Work Scope)</label>
                </div>
                {mode === 'admin' ? (
                  <input
                    value={task.scope || ''}
                    onChange={(e) => updateTask(day.id, task.id, { scope: e.target.value })}
                    placeholder="예: A동 1층 로비"
                    className="w-full px-4 py-3 text-[15px] focus:outline-none transition-all min-h-[44px]"
                    style={inputStyle}
                  />
                ) : (
                  <div className="px-4 py-3 min-h-[44px] flex items-center rounded-xl" style={{ backgroundColor: rc.card, border: `1px solid ${rc.border}` }}>
                    <p className="font-medium text-[15px]" style={{ color: task.scope ? rc.textMain : rc.textDim }}>
                      {task.scope || '-'}
                    </p>
                  </div>
                )}
              </div>

              {/* 에어컨 종류 및 수량 */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center mb-1">
                  <Target size={16} className="mr-2 flex-shrink-0" style={{ color: rc.textDim }} />
                  <label style={labelStyle}>에어컨 종류 및 수량</label>
                </div>
                {mode === 'admin' ? (
                  <div className="flex space-x-2">
                    <select
                      value={task.acType || ''}
                      onChange={(e) => updateTask(day.id, task.id, { acType: e.target.value })}
                      className="flex-1 px-4 py-3 text-[15px] min-h-[44px] focus:outline-none transition-all appearance-none"
                      style={{ ...inputStyle, colorScheme: 'dark' }}
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
                      style={{ backgroundColor: rc.card, border: `1px solid ${rc.borderSolid}` }}
                    >
                      <input
                        type="number"
                        value={task.acCount || ''}
                        onChange={(e) => updateTask(day.id, task.id, { acCount: e.target.value })}
                        placeholder="0"
                        className="w-full bg-transparent p-3 text-[15px] font-medium focus:outline-none text-center"
                        style={{ color: rc.textMain }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-3 min-h-[44px] flex items-center rounded-xl" style={{ backgroundColor: rc.card, border: `1px solid ${rc.border}` }}>
                    <p className="font-medium text-[15px]" style={{ color: task.acType ? rc.textMain : rc.textDim }}>
                      {task.acType ? `${task.acType} ${task.acCount}대` : '-'}
                    </p>
                  </div>
                )}
              </div>

              {/* 진행 수량 */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center mb-1">
                  <CheckCircle2 size={16} className="mr-2 flex-shrink-0" style={{ color: rc.textDim }} />
                  <label style={labelStyle}>진행 수량 (완료 / 미완료)</label>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  {/* 완료 수량 */}
                  <div
                    className="flex flex-col p-4 rounded-xl min-h-[72px] justify-center"
                    style={{
                      backgroundColor: 'rgba(85, 179, 255, 0.08)',
                      border: `1px solid rgba(85, 179, 255, 0.2)`,
                    }}
                  >
                    <span className="text-[10px] font-bold mb-1" style={{ color: rc.blue }}>완료 수량</span>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={task.completedCount || ''}
                        onChange={(e) => updateTask(day.id, task.id, { completedCount: e.target.value })}
                        placeholder="0"
                        className="w-full bg-transparent text-[20px] font-bold focus:outline-none min-h-[32px]"
                        style={{ color: rc.textMain }}
                      />
                      <span className="text-[15px] font-medium" style={{ color: rc.textSec }}>대</span>
                    </div>
                  </div>
                  {/* 잔여 수량 */}
                  <div
                    className="flex flex-col p-4 rounded-xl min-h-[72px] justify-center"
                    style={{ backgroundColor: rc.card, border: `1px solid ${rc.borderSolid}` }}
                  >
                    <span className="text-[10px] font-bold mb-1" style={{ color: rc.textDim }}>잔여 수량</span>
                    <div className="flex items-center">
                      <div className="w-full text-[20px] font-bold min-h-[32px] flex items-center" style={{ color: rc.textMain }}>
                        {Math.max(0, (Number(task.acCount) || 0) - (Number(task.completedCount) || 0))}
                      </div>
                      <span className="text-[15px] font-medium" style={{ color: rc.textSec }}>대</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 진행 상태 */}
              <div className="pt-5" style={{ borderTop: `1px solid ${rc.border}` }}>
                <div className="flex items-center mb-4">
                  <Wrench size={16} className="mr-2" style={{ color: rc.textDim }} />
                  <label style={labelStyle}>진행 상태 (Status)</label>
                </div>
                <div className="flex p-1 rounded-xl" style={{ backgroundColor: rc.card }}>
                  {/* 진행중 버튼 */}
                  <button
                    onClick={() => handleStatusChange(task.id, 'in-progress')}
                    className="flex-1 flex items-center justify-center min-h-[44px] rounded-lg transition-all text-[15px] font-medium"
                    style={
                      task.status === 'in-progress'
                        ? { backgroundColor: rc.surface, color: rc.blue, boxShadow: `0 0 12px rgba(85,179,255,0.15)`, border: `1px solid rgba(85,179,255,0.3)` }
                        : { color: rc.textDim }
                    }
                  >
                    <PlayCircle size={18} className="mr-2" style={{ color: task.status === 'in-progress' ? rc.blue : rc.textDim }} />
                    진행중
                  </button>
                  {/* 완료 버튼 */}
                  <button
                    onClick={() => handleStatusChange(task.id, 'completed')}
                    className="flex-1 flex items-center justify-center min-h-[44px] rounded-lg transition-all text-[15px] font-medium"
                    style={
                      task.status === 'completed'
                        ? { backgroundColor: rc.surface, color: '#5fc992', boxShadow: `0 0 12px rgba(95,201,146,0.15)`, border: `1px solid rgba(95,201,146,0.3)` }
                        : { color: rc.textDim }
                    }
                  >
                    <CheckCircle2 size={18} className="mr-2" style={{ color: task.status === 'completed' ? '#5fc992' : rc.textDim }} />
                    작업완료
                  </button>
                </div>
              </div>

              {/* 현장 메모 */}
              <div className="pt-5" style={{ borderTop: `1px solid ${rc.border}` }}>
                <div className="flex items-center mb-4">
                  <MessageSquare size={16} className="mr-2" style={{ color: rc.textDim }} />
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
                          style={{
                            backgroundColor: 'rgba(255, 188, 51, 0.06)',
                            border: `1px solid rgba(255, 188, 51, 0.15)`,
                          }}
                        >
                          <div className="text-[13px] whitespace-pre-wrap leading-relaxed flex-1" style={{ color: rc.textSec }}>
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
                            style={{ color: rc.textDim }}
                            onMouseEnter={e => (e.currentTarget.style.color = rc.red)}
                            onMouseLeave={e => (e.currentTarget.style.color = rc.textDim)}
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
                    className="flex-1 px-4 py-3 text-[15px] focus:outline-none transition-shadow min-h-[44px]"
                    style={inputStyle}
                  />
                  <button
                    onClick={() => handleMemoSubmit(task.id)}
                    className="px-5 py-3 rounded-xl text-[13px] font-medium transition-all whitespace-nowrap min-h-[44px] flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      color: rc.textMain,
                      border: `1px solid ${rc.border}`,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
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
            backgroundColor: 'transparent',
            color: rc.textDim,
            border: `2px dashed ${rc.borderSolid}`,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = rc.blue;
            e.currentTarget.style.color = rc.blue;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = rc.borderSolid;
            e.currentTarget.style.color = rc.textDim;
          }}
        >
          <Plus size={18} className="mr-2" />
          해당 일자에 새로운 작업 추가
        </button>
      )}
    </div>
  );
}
