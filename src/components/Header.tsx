import React from 'react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { currentView, setIsNotificationsOpen, setIsProfileOpen } = useApp();

  const getTitle = () => {
    switch (currentView) {
      case 'today':
        return 'Today';
      case 'lists':
        return 'Lists';
      case 'insights':
        return 'Insights';
      default:
        return 'Today';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(45,52,54,0.03)] pt-safe">
      <div className="h-16 px-margin max-w-lg mx-auto flex items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm min-w-0">
          <img
            alt="Focus App Icon"
            className="h-8 w-8 object-contain shrink-0"
            src="/focus-icon.svg"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-headline-md text-headline-md text-primary tracking-tight truncate">
              {getTitle()}
            </span>
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-xs shrink-0">
          <button
            aria-label="Notifications"
            onClick={() => setIsNotificationsOpen(true)}
            className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary transition-colors focus:outline-none relative"
          >
            <span className="material-symbols-outlined text-[22px]">notifications_none</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-secondary rounded-full"></span>
          </button>

          <button
            aria-label="User Profile"
            onClick={() => setIsProfileOpen(true)}
            className="w-11 h-11 flex items-center justify-center rounded-full focus:outline-none p-1 shrink-0 group"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-surface-container-high group-hover:ring-primary transition-all"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
