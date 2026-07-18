import React, { useState } from 'react';
import { Share2, UserCog, User, Check } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import logo from '../assets/logo.png';

// Vercel 모노크롬 토큰
const vc = {
  bg: '#ffffff',
  surface: '#fafafa',
  border: '#E5E7EB',
  borderDark: '#D1D5DB',
  textMain: '#000000',
  textSec: '#6B7280',
  textDim: '#9CA3AF',
  accent: '#000000',    // 10% 강조 = 순수 블랙
};

export default function TopBar() {
  const { mode, setMode, getShareUrl, workerName, setWorkerName } = useProjectStore();
  const [copied, setCopied] = useState(false);

  const handleRenameWorker = () => {
    const newName = window.prompt('이름을 수정해주세요:', workerName);
    if (newName && newName.trim()) {
      setWorkerName(newName.trim());
    }
  };

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
      className="p-4 flex items-center sticky top-0 z-40 backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
      }}
    >
      <div className="flex-1 flex items-center justify-center space-x-3 min-w-0">
        <img src={logo} alt="누리종합환경" className="h-auto max-h-14 w-auto max-w-full min-w-0 object-contain" />
        {mode === 'worker' && workerName && (
          <button
            onClick={handleRenameWorker}
            className="text-[10px] px-2 py-1 rounded-full flex items-center font-medium shrink-0 transition-colors"
            style={{
              backgroundColor: vc.surface,
              color: vc.textSec,
              border: `1px solid ${vc.border}`,
            }}
          >
            <User size={12} className="mr-1 shrink-0" />
            <span className="truncate">{workerName}</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-end space-x-2 min-w-0">
        <button
          onClick={handleShare}
          className="flex items-center space-x-1 min-h-[44px] px-3 py-2 rounded-lg transition-all btn-mac min-w-0"
          style={{
            backgroundColor: vc.bg,
            color: copied ? '#000000' : vc.textSec,
            border: `1px solid ${vc.border}`,
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = vc.surface)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = vc.bg)}
        >
          {copied ? <Check size={18} className="shrink-0" /> : <Share2 size={18} className="shrink-0" />}
          <span className="text-[13px] font-medium truncate">{copied ? '복사됨' : '공유'}</span>
        </button>

        <button
          onClick={toggleMode}
          className="flex items-center space-x-1 min-h-[44px] px-4 py-2 rounded-lg font-medium transition-all btn-mac shrink-0"
          style={
            mode === 'admin'
              ? {
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: '1px solid #000000',
                }
              : {
                  backgroundColor: vc.bg,
                  color: vc.textSec,
                  border: `1px solid ${vc.border}`,
                }
          }
        >
          <UserCog size={18} />
          <span className="text-[13px] whitespace-nowrap">{mode === 'admin' ? '관리자' : '작업자'}</span>
        </button>
      </div>
    </div>
  );
}
