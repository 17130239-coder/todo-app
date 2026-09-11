import React from 'react';
import { useApp } from '../context/AppContext';

export const ProfileModal: React.FC = () => {
  const { isProfileOpen, setIsProfileOpen, todayFocusMinutes, streakDays, resetAllData } = useApp();

  if (!isProfileOpen) return null;

  const completedDaysCount = streakDays.filter((d) => d.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-margin bg-primary/40 backdrop-blur-xs transition-opacity animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-2xl bg-surface-container-lowest p-space-lg shadow-xl flex flex-col">
        {/* Close */}
        <button
          onClick={() => setIsProfileOpen(false)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Profile Card Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-4">
          <div className="relative mb-3">
            <img
              alt="Elena Vance"
              className="w-20 h-20 rounded-full object-cover shadow-sm ring-4 ring-secondary-container"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[12px]">spa</span>
            </span>
          </div>
          <h3 className="font-headline-lg text-headline-lg text-primary">Elena Vance</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Staff Product Designer • Mindful Flow
          </p>
        </div>

        {/* Stat badges */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-surface-container-high/60 my-2 text-center">
          <div>
            <span className="font-headline-md text-headline-md text-primary block">
              14
            </span>
            <span className="font-label-sm text-[11px] text-on-surface-variant">Day Streak</span>
          </div>
          <div>
            <span className="font-headline-md text-headline-md text-secondary block">
              {Math.floor(todayFocusMinutes / 60)}h {todayFocusMinutes % 60}m
            </span>
            <span className="font-label-sm text-[11px] text-on-surface-variant">Focus Today</span>
          </div>
          <div>
            <span className="font-headline-md text-headline-md text-tertiary block">
              {completedDaysCount}/7
            </span>
            <span className="font-label-sm text-[11px] text-on-surface-variant">Weekly Rhythm</span>
          </div>
        </div>

        {/* Mindfulness Philosophy */}
        <div className="p-3 bg-surface-container-low rounded-xl my-2 text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant italic leading-relaxed">
            “Quiet attention turns small intentions into lasting craft.”
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2 mt-3">
          <button
            onClick={() => {
              if (window.confirm('Reset all demo data back to default state?')) {
                resetAllData();
                setIsProfileOpen(false);
              }
            }}
            className="w-full py-2.5 rounded-full bg-surface-container text-on-surface-variant hover:text-error hover:bg-error-container/30 font-label-md text-label-md transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={() => setIsProfileOpen(false)}
            className="w-full py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md active:scale-98 transition-transform"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
