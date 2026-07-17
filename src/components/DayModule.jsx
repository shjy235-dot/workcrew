import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { Plus, Trash2, CheckCircle2, Clock, PlayCircle, MapPin, Wrench, Target, MessageSquare } from 'lucide-react';

export default function DayModule({ activeDayId }) {
  const { data, mode, workerName, addTask, updateTask, removeTask } = useProjectStore();
  const day = data.days.find(d => d.id === activeDayId);
  const [memoInput, setMemoInput] = useState({});

  if (!day) return null;

  const handleStatusChange = (taskId, newStatus) => {
    updateTask(day.id, taskId, { status: newStatus });
  };

  const handleMemoSubmit = (taskId) => {
    const text = memoInput[taskId]?.trim();
    if (!text) return;

    const task = day.tasks.find(t => t.id === taskId);
    const timestamp = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    const namePrefix = workerName ? `[${workerName}] ` : (mode === 'admin' ? '[관리자] ' : '[작업자] ');
    
    const newMemoLine = `${namePrefix}${text} - ${timestamp}`;
    const updatedMemo = task.memo ? `${task.memo}\n${newMemoLine}` : newMemoLine;

    updateTask(day.id, taskId, { memo: updatedMemo });
    setMemoInput({ ...memoInput, [taskId]: '' });
  };

  return (
    <div className="p-4 space-y-6 pb-28">
      {day.tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 mb-3 font-medium">등록된 작업 내역이 없습니다.</p>
          {mode === 'admin' && (
            <button 
              onClick={() => addTask(day.id)}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[13px] font-medium flex items-center justify-center mx-auto hover:bg-slate-800 transition-colors shadow-sm btn-mac min-h-[44px]"
            >
              <Plus size={18} className="mr-2" />
              첫 작업 추가하기
            </button>
          )}
        </div>
      ) : (
        day.tasks.map((task, index) => (
          <div key={task.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            {/* Header / Admin Delete */}
            <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg tracking-tight">작업 #{index + 1}</h3>
              {mode === 'admin' && (
                <button 
                  onClick={() => {
                    if (window.confirm('이 작업을 삭제하시겠습니까?')) removeTask(day.id, task.id);
                  }}
                  className="text-slate-400 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            <div className="p-5 space-y-6">
              {/* Task Details Form/Card */}
              <div className="space-y-5">
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center text-slate-700">
                    <MapPin size={16} className="text-slate-400 mr-2 flex-shrink-0" />
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">작업 범위 (Work Scope)</label>
                  </div>
                  {mode === 'admin' ? (
                    <input 
                      value={task.scope}
                      onChange={(e) => updateTask(day.id, task.id, { scope: e.target.value })}
                      placeholder="예: A동 1층 로비"
                      className="w-full bg-slate-50 border border-slate-200 input-mac rounded-xl px-4 py-3 text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all min-h-[44px]"
                    />
                  ) : (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 min-h-[44px] flex items-center">
                      <p className="text-slate-900 font-medium text-[16px]">{task.scope || '-'}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center text-slate-700">
                    <Target size={16} className="text-slate-400 mr-2 flex-shrink-0" />
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">에어컨 종류 및 수량</label>
                  </div>
                  {mode === 'admin' ? (
                    <div className="flex space-x-2">
                      <select 
                        value={task.acType || ''}
                        onChange={(e) => updateTask(day.id, task.id, { acType: e.target.value })}
                        className="flex-1 bg-slate-50 border border-slate-200 input-mac rounded-xl px-4 py-3 text-slate-900 text-[13px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all appearance-none"
                      >
                        <option value="벽걸이">벽걸이</option>
                        <option value="천장형 1way(EHP)">천장형 1way(EHP)</option>
                        <option value="천장형 1way(FCU)">천장형 1way(FCU)</option>
                        <option value="천장형 4way(EHP)">천장형 4way(EHP)</option>
                        <option value="천장형 4way(FCU)">천장형 4way(FCU)</option>
                        <option value="스탠드">스탠드</option>
                      </select>
                      <div className="flex items-center w-24 bg-slate-50 border border-slate-200 input-mac rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-slate-900 transition-all min-h-[44px]">
                        <input 
                          type="number"
                          value={task.acCount || ''}
                          onChange={(e) => updateTask(day.id, task.id, { acCount: e.target.value })}
                          placeholder="0"
                          className="w-full bg-transparent p-3 text-slate-900 text-[13px] font-medium focus:outline-none text-center"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 min-h-[44px] flex items-center">
                      <p className="text-slate-800 font-medium text-[16px]">{task.acType ? `${task.acType} ${task.acCount}대` : '-'}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center text-slate-700">
                    <CheckCircle2 size={16} className="text-slate-400 mr-2 flex-shrink-0" />
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">진행 수량 (완료 / 미완료)</label>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="flex flex-col bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm min-h-[72px] justify-center">
                      <span className="text-[10px] text-blue-700 font-bold mb-1">완료 수량</span>
                      <div className="flex items-center">
                        <input 
                          type="number"
                          value={task.completedCount || ''}
                          onChange={(e) => updateTask(day.id, task.id, { completedCount: e.target.value })}
                          placeholder="0"
                          className="w-full bg-transparent text-slate-900 text-[20px] font-bold focus:outline-none min-h-[32px]"
                        />
                        <span className="text-slate-500 text-[13px] font-medium">대</span>
                      </div>
                    </div>
                    <div className="flex flex-col bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm min-h-[72px] justify-center">
                      <span className="text-[10px] text-slate-500 font-bold mb-1">잔여 수량</span>
                      <div className="flex items-center">
                        <div className="w-full text-slate-900 text-[20px] font-bold min-h-[32px] flex items-center">
                          {Math.max(0, (Number(task.acCount) || 0) - (Number(task.completedCount) || 0))}
                        </div>
                        <span className="text-slate-500 text-[13px] font-medium">대</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Segmented Control */}
              <div className="pt-5 border-t border-slate-100">
                <div className="flex items-center text-slate-700 mb-4">
                  <Wrench size={16} className="text-slate-400 mr-2" />
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">진행 상태 (Status)</label>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => handleStatusChange(task.id, 'in-progress')}
                    className={`flex-1 flex items-center justify-center min-h-[44px] rounded-lg transition-all text-[13px] font-medium ${
                      task.status === 'in-progress' 
                        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <PlayCircle size={18} className={`mr-2 ${task.status === 'in-progress' ? 'text-blue-500' : 'text-slate-400'}`} />
                    진행중
                  </button>
                  <button
                    onClick={() => handleStatusChange(task.id, 'completed')}
                    className={`flex-1 flex items-center justify-center min-h-[44px] rounded-lg transition-all text-[13px] font-medium ${
                      task.status === 'completed' 
                        ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <CheckCircle2 size={18} className={`mr-2 ${task.status === 'completed' ? 'text-emerald-500' : 'text-slate-400'}`} />
                    작업완료
                  </button>
                </div>
              </div>

              {/* Memo Section */}
              <div className="pt-5 border-t border-slate-100">
                <div className="flex items-center text-slate-700 mb-4">
                  <MessageSquare size={16} className="mr-2 text-slate-400" />
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">현장 메모 / 특이사항</label>
                </div>
                
                {task.memo && (
                  <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-1">
                    {task.memo.split('\n').filter(Boolean).map((line, lineIndex) => (
                      <div key={lineIndex} className="flex justify-between items-start bg-amber-50/50 border border-amber-100 rounded-xl p-4 shadow-sm">
                        <div className="text-[13px] text-slate-700 whitespace-pre-wrap leading-relaxed flex-1">
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
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors ml-2 flex-shrink-0"
                          title="메모 삭제"
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
                    className="flex-1 bg-slate-50 border border-slate-200 input-mac rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow min-h-[44px]"
                  />
                  <button
                    onClick={() => handleMemoSubmit(task.id)}
                    className="bg-slate-800 text-white px-5 py-3 rounded-xl text-[13px] font-medium hover:bg-slate-900 transition-colors shadow-sm btn-mac whitespace-nowrap min-h-[44px] flex items-center justify-center"
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
          className="w-full bg-white border-2 border-dashed border-slate-300 text-slate-600 py-4 rounded-2xl font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center shadow-sm min-h-[44px] text-[13px]"
        >
          <Plus size={18} className="mr-2" />
          해당 일자에 새로운 작업 추가
        </button>
      )}
    </div>
  );
}
