import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const CreateSpaceModal: React.FC = () => {
  const { isCreateSpaceOpen, setIsCreateSpaceOpen, addSpace } = useApp();
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('palette');
  const [selectedTheme, setSelectedTheme] = useState<'primary' | 'secondary' | 'tertiary'>('primary');

  if (!isCreateSpaceOpen) return null;

  const icons = [
    'palette',
    'lightbulb',
    'fitness_center',
    'account_balance',
    'auto_stories',
    'laptop',
    'music_note',
    'eco',
    'coffee',
    'local_florist',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let colorClass = 'bg-primary';
    let bgClass = 'bg-surface-container';
    let textClass = 'text-primary';
    let badgeClass = 'bg-surface-container text-on-surface-variant';

    if (selectedTheme === 'secondary') {
      colorClass = 'bg-secondary';
      bgClass = 'bg-secondary-fixed';
      textClass = 'text-secondary';
      badgeClass = 'bg-secondary-container text-on-secondary-container';
    } else if (selectedTheme === 'tertiary') {
      colorClass = 'bg-on-tertiary-container';
      bgClass = 'bg-tertiary-fixed/60';
      textClass = 'text-tertiary';
      badgeClass = 'bg-tertiary-fixed/60 text-on-tertiary-fixed';
    }

    addSpace({
      name: name.trim(),
      icon: selectedIcon,
      colorClass,
      bgClass,
      textClass,
      badgeClass,
    });

    setName('');
    setIsCreateSpaceOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-margin bg-primary/40 backdrop-blur-xs transition-opacity animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-2xl bg-surface-container-lowest p-space-lg shadow-xl flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">folder_special</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary">Create Space</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateSpaceOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">
              Space Name *
            </label>
            <input
              type="text"
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Creative Projects"
              className="w-full bg-surface-container-low font-body-md text-body-md text-on-surface p-3 rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
              Choose Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                    selectedIcon === icon
                      ? 'bg-primary text-on-primary shadow-sm scale-105'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
              Color Palette
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedTheme('primary')}
                className={`flex-1 py-2 rounded-xl text-label-sm font-medium border flex items-center justify-center gap-1.5 ${
                  selectedTheme === 'primary'
                    ? 'border-primary bg-primary text-on-primary shadow-xs'
                    : 'border-surface-container bg-surface-container text-on-surface'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                Slate
              </button>
              <button
                type="button"
                onClick={() => setSelectedTheme('secondary')}
                className={`flex-1 py-2 rounded-xl text-label-sm font-medium border flex items-center justify-center gap-1.5 ${
                  selectedTheme === 'secondary'
                    ? 'border-secondary bg-secondary text-on-secondary shadow-xs'
                    : 'border-surface-container bg-surface-container text-on-surface'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                Sage
              </button>
              <button
                type="button"
                onClick={() => setSelectedTheme('tertiary')}
                className={`flex-1 py-2 rounded-xl text-label-sm font-medium border flex items-center justify-center gap-1.5 ${
                  selectedTheme === 'tertiary'
                    ? 'border-tertiary bg-tertiary text-on-tertiary shadow-xs'
                    : 'border-surface-container bg-surface-container text-on-surface'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                Terracotta
              </button>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setIsCreateSpaceOpen(false)}
              className="flex-1 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-sm active:scale-98 transition-transform"
            >
              Create Space
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
