import React from 'react';
import { Home, ClipboardList } from 'lucide-react';

const vc = {
  bg: '#ffffff',
  border: '#E5E7EB',
  textDim: '#9CA3AF',
  accent: '#000000',
};

const tabs = [
  { id: 'dashboard', label: '홈', icon: Home },
  { id: 'tasks', label: '작업 현황', icon: ClipboardList },
];

export default function TabBar({ activeView, setActiveView }) {
  return (
    <div
      className="sticky bottom-0 z-40 flex"
      style={{ backgroundColor: vc.bg, borderTop: `1px solid ${vc.border}` }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className="flex-1 flex flex-col items-center justify-center py-2 min-h-[56px] transition-colors"
            style={{ color: isActive ? vc.accent : vc.textDim }}
          >
            <Icon size={22} />
            <span className="text-[11px] font-medium mt-1">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
