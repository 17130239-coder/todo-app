import React from 'react';
import { useApp } from '../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, showToast } = useApp();

  if (!isNotificationsOpen) return null;

  const notifications = [
    {
      id: 'n1',
      title: 'Mindful Break Reminder',
      message: 'You have been in deep flow for 45 minutes. Step away and gaze into the distance.',
      time: '10m ago',
      icon: 'spa',
      iconColor: 'text-secondary',
      bgColor: 'bg-secondary-container',
    },
    {
      id: 'n2',
      title: 'Daily Flow Milestone',
      message: 'You have completed 4 out of 7 tasks today. Next milestone at 5 tasks (71%).',
      time: '35m ago',
      icon: 'check_circle',
      iconColor: 'text-primary',
      bgColor: 'bg-primary-fixed',
    },
    {
      id: 'n3',
      title: 'Upcoming Scheduled Task',
      message: '"Send quarterly design digest to team" is scheduled for 2:00 PM.',
      time: '1h ago',
      icon: 'schedule',
      iconColor: 'text-tertiary',
      bgColor: 'bg-tertiary-fixed',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-primary/30 backdrop-blur-xs transition-opacity animate-fadeIn">
      <div
        className="w-full max-w-sm h-full bg-surface shadow-2xl flex flex-col pt-safe overflow-hidden"
        role="dialog"
      >
        {/* Header */}
        <div className="h-16 px-margin flex items-center justify-between border-b border-surface-container-high/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-primary">notifications</span>
            <h3 className="font-headline-md text-headline-md text-primary">Mindful Notices</h3>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
            aria-label="Close notifications"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-margin py-4 space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container/60 hover:shadow-sm transition-shadow flex items-start gap-3"
            >
              <div
                className={`w-9 h-9 rounded-full ${n.bgColor} ${n.iconColor} flex items-center justify-center shrink-0 mt-0.5`}
              >
                <span className="material-symbols-outlined text-[18px]">{n.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="font-headline-md text-[14px] text-primary truncate">
                    {n.title}
                  </span>
                  <span className="font-label-sm text-[10px] text-outline shrink-0">{n.time}</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {n.message}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-margin border-t border-surface-container-high/60 pb-safe">
          <button
            onClick={() => {
              setIsNotificationsOpen(false);
              showToast('All notifications marked as read');
            }}
            className="w-full py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};
