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
    setMode(mode === 'admin' ? 'worker' : 'admin');
  };

  return (
    <div className="bg-primary text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold tracking-wide">누리종합환경</h1>
        {mode === 'worker' && workerName && (
          <span className="bg-white/20 text-xs px-2 py-1 rounded-full flex items-center">
            <User size={12} className="mr-1" />
            {workerName}
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <button 
          onClick={handleShare}
          className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
        >
          {copied ? <Check size={16} className="text-accent-green" /> : <Share2 size={16} />}
          <span className="text-sm font-medium">{copied ? '복사됨' : '공유'}</span>
        </button>

        <button 
          onClick={toggleMode}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            mode === 'admin' ? 'bg-accent-orange text-white' : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          <UserCog size={16} />
          <span className="text-sm">{mode === 'admin' ? '관리자' : '작업자'}</span>
        </button>
      </div>
    </div>
  );
}
