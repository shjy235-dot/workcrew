import React, { useState } from 'react';
import { Share2, UserCog, User, Copy, Check } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';

export default function TopBar() {
  const { mode, setMode, getShareUrl, workerName, setWorkerName } = useProjectStore();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const toggleMode = () => {
    if (mode === 'worker') {
      const pin = window.prompt('관리자 비밀번호를 입력해주세요:');
      if (pin === '9445') {
        setMode('admin');
      } else if (pin !== null) {
        alert('비밀번호가 일치하지 않습니다.');
      }
    } else {
      setMode('worker');
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md text-slate-900 p-4 flex items-center justify-between sticky top-0 z-40 border-b border-slate-200">
      <div className="flex items-center space-x-3">
        <h1 className="text-[20px] font-bold tracking-tight text-slate-900">누리종합환경</h1>
        {mode === 'worker' && workerName && (
          <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded-full flex items-center border border-slate-200 font-medium">
            <User size={12} className="mr-1" />
            {workerName}
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <button 
          onClick={handleShare}
          className="flex items-center space-x-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 min-h-[44px] px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          {copied ? <Check size={18} className="text-blue-500" /> : <Share2 size={18} />}
          <span className="text-[13px] font-medium">{copied ? '복사됨' : '공유'}</span>
        </button>

        <button 
          onClick={toggleMode}
          className={`flex items-center space-x-1 min-h-[44px] px-4 py-2 rounded-lg font-medium transition-colors shadow-sm border ${
            mode === 'admin' 
              ? 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800' 
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <UserCog size={18} />
          <span className="text-[13px]">{mode === 'admin' ? '관리자' : '작업자'}</span>
        </button>
      </div>
    </div>
  );
}
