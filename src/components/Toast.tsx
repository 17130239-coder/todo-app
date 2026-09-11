import React from 'react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  return (
    <div
      className={`fixed bottom-20 inset-x-6 z-50 transform transition-all duration-300 pointer-events-none flex justify-center ${
        toastMessage
          ? 'translate-y-0 opacity-100'
          : 'translate-y-16 opacity-0'
      }`}
      id="toast-pill"
    >
      <div className="bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 max-w-sm backdrop-blur-md">
        <span className="material-symbols-outlined text-[18px] text-secondary-fixed shrink-0">
          check
        </span>
        <span className="font-label-md text-label-md truncate" id="toast-text">
          {toastMessage || ''}
        </span>
      </div>
    </div>
  );
};
