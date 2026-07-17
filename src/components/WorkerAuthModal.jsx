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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="bg-primary text-white p-4 text-center">
          <h2 className="text-xl font-bold">작업자 확인</h2>
          <p className="text-sm opacity-80 mt-1">현장 기록을 위해 이름을 입력해주세요</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue text-lg"
              placeholder="이름을 입력하세요"
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent-blue hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg"
          >
            접속하기
          </button>
        </form>
      </div>
    </div>
  );
}
