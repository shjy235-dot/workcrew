import React, { useRef } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';

export default function DayNavigation({ activeDayId, setActiveDayId }) {
  const { data, mode, addDay, removeDay } = useProjectStore();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 150;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
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
        const remaining = data.days.filter(d => d.id !== dayId);
        setActiveDayId(remaining[0].id);
      }
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-[68px] z-30 shadow-sm">
      <div className="flex items-center px-2 py-2">
        <button onClick={() => scroll('left')} className="p-2 text-gray-400 hover:text-gray-800">
          <ChevronLeft size={20} />
        </button>
        
        <div 
          ref={scrollRef}
          className="flex-1 flex overflow-x-auto hide-scrollbar space-x-2 snap-x"
        >
          {data.days.map((day) => (
            <div 
              key={day.id}
              onClick={() => setActiveDayId(day.id)}
              className={`flex-shrink-0 snap-start flex items-center px-4 py-2 rounded-full cursor-pointer transition-colors border ${
                activeDayId === day.id 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium whitespace-nowrap">{day.title}</span>
              {mode === 'admin' && (
                <button 
                  onClick={(e) => handleRemoveDay(day.id, e)}
                  className={`ml-2 p-1 rounded-full ${
                    activeDayId === day.id ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-200 text-gray-400'
                  }`}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}

          {mode === 'admin' && (
            <button
              onClick={handleAddDay}
              className="flex-shrink-0 flex items-center px-4 py-2 rounded-full border border-dashed border-gray-400 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} className="mr-1" />
              <span className="font-medium whitespace-nowrap">일정 추가</span>
            </button>
          )}
        </div>

        <button onClick={() => scroll('right')} className="p-2 text-gray-400 hover:text-gray-800">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
