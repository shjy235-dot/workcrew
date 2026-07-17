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
    <div
      className="p-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(7, 8, 10, 0.85)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div className="flex items-center space-x-3">
        <h1 className="text-[20px] font-bold tracking-tight" style={{ color: '#f9f9f9' }}>
          누리종합환경
        </h1>
        {mode === 'worker' && workerName && (
          <span
            className="text-[10px] px-2 py-1 rounded-full flex items-center font-medium"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: '#9c9c9d',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <User size={12} className="mr-1" />
            {workerName}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleShare}
          className="flex items-center space-x-1 min-h-[44px] px-4 py-2 rounded-lg transition-all"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            color: copied ? '#55b3ff' : '#9c9c9d',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
        >
          {copied ? <Check size={18} /> : <Share2 size={18} />}
          <span className="text-[13px] font-medium">{copied ? '복사됨' : '공유'}</span>
        </button>

        <button
          onClick={toggleMode}
          className="flex items-center space-x-1 min-h-[44px] px-4 py-2 rounded-lg font-medium transition-all"
          style={
            mode === 'admin'
              ? {
                  backgroundColor: '#FF6363',
                  color: '#ffffff',
                  border: '1px solid #FF6363',
                }
              : {
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  color: '#9c9c9d',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }
          }
        >
          <UserCog size={18} />
          <span className="text-[13px]">{mode === 'admin' ? '관리자' : '작업자'}</span>
        </button>
      </div>
    </div>
  );
}
