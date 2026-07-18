import React, { useRef } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';

// Vercel 모노크롬 토큰
const vc = {
  bg: '#ffffff',
  surface: '#fafafa',
  border: '#E5E7EB',
  textMain: '#000000',
  textSec: '#6B7280',
  textDim: '#9CA3AF',
  accent: '#1F2937',
  red: '#DC2626',
};

export default function DayNavigation({ activeDayId, setActiveDayId }) {
  const { data, mode, addDay, removeDay } = useProjectStore();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -150 : 150,
        behavior: 'smooth',
      });
    }
  };

  const handleAddDay = () => {
    addDay();
    setTimeout(() => scroll('right'), 100);
  };

  const handleRemoveDay = (dayId, e) => {
    e.stopPropagation();
    if (window.confirm('정말 이 일정을 삭제하시겠습니까? 내부의 모든 작업 내역이 사라집니다.')) {
      removeDay(dayId);
      if (activeDayId === dayId && data.days.length > 1) {
        const remaining = data.days.filter((d) => d.id !== dayId);
        setActiveDayId(remaining[0].id);
      }
    }
  };

  const getDayLabel = (day) => {
    if (!day.date) return day.title || '날짜 미정';
    const date = new Date(day.date);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${mm}/${dd}`;
  };

  return (
    <div
      className="sticky z-30 mt-5 mx-4 rounded-2xl overflow-hidden"
      style={{
        top: 0,
        backgroundColor: vc.bg,
        border: `1px solid ${vc.border}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-center px-2 py-2">
        <button
          onClick={() => scroll('left')}
          className="p-2 rounded-lg transition-colors"
          style={{ color: vc.textDim }}
          onMouseEnter={e => (e.currentTarget.style.color = vc.textMain)}
          onMouseLeave={e => (e.currentTarget.style.color = vc.textDim)}
        >
          <ChevronLeft size={20} />
        </button>

        <div ref={scrollRef} className="flex-1 flex overflow-x-auto hide-scrollbar space-x-2 snap-x px-1">
          {data.days.map((day) => {
            const isActive = activeDayId === day.id;
            return (
              <div
                key={day.id}
                onClick={() => setActiveDayId(day.id)}
                className="flex-shrink-0 snap-start flex items-center px-4 py-2 rounded-xl cursor-pointer transition-all duration-200"
                style={
                  isActive
                    ? {
                        backgroundColor: vc.accent,
                        color: '#ffffff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      }
                    : {
                        backgroundColor: vc.surface,
                        color: vc.textSec,
                        border: `1px solid ${vc.border}`,
                      }
                }
              >
                <div className="flex flex-col items-start leading-tight">
                  {day.site && (
                    <span
                      className="text-[10px] font-medium whitespace-nowrap"
                      style={{ color: isActive ? 'rgba(255,255,255,0.75)' : vc.textDim }}
                    >
                      {day.site}
                    </span>
                  )}
                  <span className="font-semibold whitespace-nowrap text-[15px]">
                    {getDayLabel(day)}
                  </span>
                </div>
                {mode === 'admin' && (
                  <button
                    onClick={(e) => handleRemoveDay(day.id, e)}
                    className="ml-2 p-1 rounded-md transition-colors"
                    style={{ color: isActive ? 'rgba(255,255,255,0.5)' : vc.textDim }}
                    onMouseEnter={e => (e.currentTarget.style.color = vc.red)}
                    onMouseLeave={e => (e.currentTarget.style.color = isActive ? 'rgba(255,255,255,0.5)' : vc.textDim)}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            );
          })}

          {mode === 'admin' && (
            <button
              onClick={handleAddDay}
              className="flex-shrink-0 flex items-center px-4 py-2 rounded-xl transition-all"
              style={{
                backgroundColor: 'transparent',
                color: vc.textDim,
                border: `1px dashed ${vc.border}`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = vc.accent;
                e.currentTarget.style.color = vc.accent;
                e.currentTarget.style.backgroundColor = vc.surface;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = vc.border;
                e.currentTarget.style.color = vc.textDim;
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Plus size={18} className="mr-1" />
              <span className="font-medium whitespace-nowrap text-[15px]">일정 추가</span>
            </button>
          )}
        </div>

        <button
          onClick={() => scroll('right')}
          className="p-2 rounded-lg transition-colors"
          style={{ color: vc.textDim }}
          onMouseEnter={e => (e.currentTarget.style.color = vc.textMain)}
          onMouseLeave={e => (e.currentTarget.style.color = vc.textDim)}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
