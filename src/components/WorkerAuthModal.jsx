import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';

export default function WorkerAuthModal() {
  const [name, setName] = useState('');
  const setWorkerName = useProjectStore((state) => state.setWorkerName);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setWorkerName(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        {/* 헤더 */}
        <div className="p-4 text-center" style={{ backgroundColor: '#000000' }}>
          <h2 className="text-xl font-bold" style={{ color: '#ffffff' }}>작업자 확인</h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>현장 기록을 위해 이름을 입력해주세요</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-lg focus:outline-none transition-all"
              style={{ border: '1px solid #D1D5DB', color: '#111111' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#000000')}
              onBlur={e => (e.currentTarget.style.borderColor = '#D1D5DB')}
              placeholder="이름을 입력하세요"
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full font-bold py-3 px-4 rounded-lg transition-colors text-lg"
            style={{ backgroundColor: '#000000', color: '#ffffff' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#222222')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#000000')}
          >
            접속하기
          </button>
        </form>
      </div>
    </div>
  );
}
