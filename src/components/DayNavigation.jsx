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
    <div className="bg-slate-50 border-b border-slate-200 sticky top-[68px] z-30 shadow-sm">
      <div className="flex items-center px-2 py-2">
        <button onClick={() => scroll('left')} className="p-2 text-slate-400 hover:text-slate-800 transition-colors">
          <ChevronLeft size={20} />
        </button>
        
        <div 
          ref={scrollRef}
          className="flex-1 flex overflow-x-auto hide-scrollbar space-x-2 snap-x px-1"
        >
          {data.days.map((day) => (
            <div 
              key={day.id}
              onClick={() => setActiveDayId(day.id)}
              className={`flex-shrink-0 snap-start flex items-center px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 border shadow-sm ${
                activeDayId === day.id 
                  ? 'bg-slate-800 text-white border-slate-800 ring-1 ring-slate-800' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <span className="font-medium whitespace-nowrap text-sm">{day.title}</span>
              {mode === 'admin' && (
                <button 
                  onClick={(e) => handleRemoveDay(day.id, e)}
                  className={`ml-2 p-1 rounded-md transition-colors ${
                    activeDayId === day.id ? 'hover:bg-slate-700 text-slate-300 hover:text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-red-500'
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
              className="flex-shrink-0 flex items-center px-4 py-2 rounded-xl border border-dashed border-slate-300 text-slate-500 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-400 transition-all shadow-sm bg-slate-50"
            >
              <Plus size={16} className="mr-1" />
              <span className="font-medium whitespace-nowrap text-sm">일정 추가</span>
            </button>
          )}
        </div>

        <button onClick={() => scroll('right')} className="p-2 text-slate-400 hover:text-slate-800 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
