import React, { useRef } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';

const rc = {
  bg: '#07080a',
  surface: '#101111',
  card: '#1b1c1e',
  border: 'rgba(255, 255, 255, 0.06)',
  borderSolid: '#252829',
  textMain: '#f9f9f9',
  textSec: '#9c9c9d',
  blue: '#55b3ff',
  red: '#FF6363',
};

export default function DayNavigation({ activeDayId, setActiveDayId }) {
  const { data, mode, addDay, removeDay } = useProjectStore();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 150;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
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

  const getDayLabel = (day, index) => {
    if (!data.startDate) return day.title;
    const date = new Date(data.startDate);
    date.setDate(date.getDate() + index);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${index + 1}일차 (${mm}/${dd})`;
  };

  return (
    <div
      className="sticky z-30"
      style={{
        top: '68px',
        backgroundColor: rc.bg,
        borderBottom: `1px solid ${rc.border}`,
      }}
    >
      <div className="flex items-center px-2 py-2">
        <button
          onClick={() => scroll('left')}
          className="p-2 rounded-lg transition-colors"
          style={{ color: rc.textSec }}
          onMouseEnter={e => (e.currentTarget.style.color = rc.textMain)}
          onMouseLeave={e => (e.currentTarget.style.color = rc.textSec)}
        >
          <ChevronLeft size={20} />
        </button>

        <div ref={scrollRef} className="flex-1 flex overflow-x-auto hide-scrollbar space-x-2 snap-x px-1">
          {data.days.map((day, index) => {
            const isActive = activeDayId === day.id;
            return (
              <div
                key={day.id}
                onClick={() => setActiveDayId(day.id)}
                className="flex-shrink-0 snap-start flex items-center px-4 py-2 rounded-xl cursor-pointer transition-all duration-200"
                style={
                  isActive
                    ? {
                        backgroundColor: rc.blue,
                        color: '#07080a',
                        boxShadow: `0 0 16px rgba(85, 179, 255, 0.3)`,
                      }
                    : {
                        backgroundColor: rc.surface,
                        color: rc.textSec,
                        border: `1px solid ${rc.border}`,
                      }
                }
              >
                <span className="font-semibold whitespace-nowrap text-[15px]">
                  {getDayLabel(day, index)}
                </span>
                {mode === 'admin' && (
                  <button
                    onClick={(e) => handleRemoveDay(day.id, e)}
                    className="ml-2 p-1 rounded-md transition-colors"
                    style={{
                      color: isActive ? 'rgba(7,8,10,0.6)' : rc.textDim,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = rc.red)}
                    onMouseLeave={e => (e.currentTarget.style.color = isActive ? 'rgba(7,8,10,0.6)' : '#6a6b6c')}
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
                color: rc.textSec,
                border: `1px dashed ${rc.borderSolid}`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = rc.blue;
                e.currentTarget.style.color = rc.blue;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = rc.borderSolid;
                e.currentTarget.style.color = rc.textSec;
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
          style={{ color: rc.textSec }}
          onMouseEnter={e => (e.currentTarget.style.color = rc.textMain)}
          onMouseLeave={e => (e.currentTarget.style.color = rc.textSec)}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
