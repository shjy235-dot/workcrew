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
    <div className="p-4 space-y-6 pb-24">
      {day.tasks.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 mb-2">등록된 작업 내역이 없습니다.</p>
          {mode === 'admin' && (
            <button 
              onClick={() => addTask(day.id)}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center mx-auto"
            >
              <Plus size={16} className="mr-1" />
              첫 작업 추가하기
            </button>
          )}
        </div>
      ) : (
        day.tasks.map((task, index) => (
          <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header / Admin Delete */}
            <div className="bg-secondary px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-lg">작업 #{index + 1}</h3>
              {mode === 'admin' && (
                <button 
                  onClick={() => {
                    if (window.confirm('이 작업을 삭제하시겠습니까?')) removeTask(day.id, task.id);
                  }}
                  className="text-red-500 p-1 hover:bg-red-50 rounded"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="p-4 space-y-4">
              {/* Task Details Form/Card */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin size={18} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">작업 범위 (Work Scope)</label>
                    {mode === 'admin' ? (
                      <input 
                        value={task.scope}
                        onChange={(e) => updateTask(day.id, task.id, { scope: e.target.value })}
                        placeholder="예: A동 1층 로비"
                        className="w-full mt-1 bg-gray-50 border border-gray-200 rounded p-2 text-gray-900 focus:outline-none focus:border-accent-blue"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium text-lg mt-0.5">{task.scope || '-'}</p>
                    )}
                  </div>
                </div>



                <div className="flex items-start">
                  <Target size={18} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">에어컨 종류 및 수량</label>
                    {mode === 'admin' ? (
                      <div className="flex space-x-2 mt-1">
                        <select 
                          value={task.acType || ''}
                          onChange={(e) => updateTask(day.id, task.id, { acType: e.target.value })}
                          className="w-2/3 bg-gray-50 border border-gray-200 rounded p-2 text-gray-900 text-sm focus:outline-none focus:border-accent-blue"
                        >
                          <option value="벽걸이">벽걸이</option>
                          <option value="천장형 1way(EHP)">천장형 1way(EHP)</option>
                          <option value="천장형 1way(FCU)">천장형 1way(FCU)</option>
                          <option value="천장형 4way(EHP)">천장형 4way(EHP)</option>
                          <option value="천장형 4way(FCU)">천장형 4way(FCU)</option>
                          <option value="스탠드">스탠드</option>
                        </select>
                        <div className="flex items-center w-1/3">
                          <input 
                            type="number"
                            value={task.acCount || ''}
                            onChange={(e) => updateTask(day.id, task.id, { acCount: e.target.value })}
                            placeholder="수량"
                            className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-gray-900 text-sm focus:outline-none focus:border-accent-blue"
                          />
                          <span className="ml-2 text-gray-600 text-sm font-medium whitespace-nowrap">대</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-800 mt-0.5">{task.acType ? `${task.acType} ${task.acCount}대` : '-'}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 size={18} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">작업 수량 (완료 / 미완료)</label>
                    <div className="flex space-x-2 mt-1 w-full">
                      <div className="flex items-center flex-1 bg-green-50 border border-green-200 rounded p-2">
                        <span className="text-sm text-green-700 font-bold mr-2 whitespace-nowrap">완료</span>
                        <input 
                          type="number"
                          value={task.completedCount || ''}
                          onChange={(e) => updateTask(day.id, task.id, { completedCount: e.target.value })}
                          placeholder="0"
                          className="w-full bg-transparent text-gray-900 text-sm font-bold focus:outline-none text-right"
                        />
                        <span className="ml-2 text-gray-600 text-sm font-medium">대</span>
                      </div>
                      <div className="flex items-center flex-1 bg-gray-50 border border-gray-200 rounded p-2">
                        <span className="text-sm text-gray-500 font-bold mr-2 whitespace-nowrap">미완료</span>
                        <div className="w-full text-right text-gray-900 text-sm font-bold">
                          {Math.max(0, (Number(task.acCount) || 0) - (Number(task.completedCount) || 0))}
                        </div>
                        <span className="ml-2 text-gray-600 text-sm font-medium">대</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Toggles */}
              <div className="pt-4 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">진행 상태 (Status)</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange(task.id, 'in-progress')}
                    className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg border transition-all ${
                      task.status === 'in-progress' 
                        ? 'bg-blue-50 border-accent-blue text-accent-blue font-bold shadow-inner ring-1 ring-accent-blue' 
                        : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <PlayCircle size={20} className="mb-1" />
                    <span className="text-sm">진행중</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange(task.id, 'completed')}
                    className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg border transition-all ${
                      task.status === 'completed' 
                        ? 'bg-green-50 border-accent-green text-accent-green font-bold shadow-inner ring-1 ring-accent-green' 
                        : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <CheckCircle2 size={20} className="mb-1" />
                    <span className="text-sm">작업완료</span>
                  </button>
                </div>
              </div>

              {/* Memo Section */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center text-gray-700 mb-2">
                  <MessageSquare size={16} className="mr-2 text-gray-400" />
                  <label className="text-xs font-bold text-gray-500 uppercase">현장 메모 / 이슈 리포트</label>
                </div>
                
                {task.memo && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3 max-h-40 overflow-y-auto text-sm text-gray-800 whitespace-pre-wrap">
                    {task.memo}
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={memoInput[task.id] || ''}
                    onChange={(e) => setMemoInput({ ...memoInput, [task.id]: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleMemoSubmit(task.id)}
                    placeholder="특이사항을 입력하세요..."
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-blue"
                  />
                  <button
                    onClick={() => handleMemoSubmit(task.id)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
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
          className="w-full bg-white border-2 border-dashed border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          <Plus size={18} className="mr-2" />
          해당 일자에 작업 추가하기
        </button>
      )}
    </div>
  );
}
