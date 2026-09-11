import React from 'react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, setIsAddTaskOpen, setSmartViewFilter, setSelectedSpaceFilter, setSelectedTagFilter } = useApp();

  const handleNav = (view: 'today' | 'lists' | 'insights') => {
    if (view === 'today') {
      setSmartViewFilter(null);
      setSelectedSpaceFilter(null);
      setSelectedTagFilter(null);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(45,52,54,0.04)]">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-space-sm">
        {/* Today */}
        <button
          onClick={() => handleNav('today')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-colors ${
            currentView === 'today'
              ? 'text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-label="Today View"
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentView === 'today' ? "'FILL' 1" : "'FILL' 0" }}
          >
            check_circle
          </span>
          <span className="font-label-sm text-label-sm">Today</span>
        </button>

        {/* Add Task FAB */}
        <button
          onClick={() => setIsAddTaskOpen(true)}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 text-on-surface-variant transition-colors hover:text-on-surface group"
          aria-label="Add Task"
        >
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm active:scale-90 group-hover:bg-primary-container transition-all -mt-2">
            <span className="material-symbols-outlined text-[20px]">add</span>
          </div>
          <span className="font-label-sm text-label-sm -mt-0.5 font-medium">Add</span>
        </button>

        {/* Lists */}
        <button
          onClick={() => handleNav('lists')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-colors ${
            currentView === 'lists'
              ? 'text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-label="Lists View"
        >
          <span className="material-symbols-outlined text-[22px]">format_list_bulleted</span>
          <span className="font-label-sm text-label-sm">Lists</span>
        </button>

        {/* Insights */}
        <button
          onClick={() => handleNav('insights')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-colors ${
            currentView === 'insights'
              ? 'text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-label="Insights View"
        >
          <span className="material-symbols-outlined text-[22px]">timelapse</span>
          <span className="font-label-sm text-label-sm">Insights</span>
        </button>
      </div>
    </nav>
  );
};
