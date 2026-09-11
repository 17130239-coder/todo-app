import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { FilterType, Task } from '../types';

export const TodayView: React.FC = () => {
  const {
    tasks,
    activeFilter,
    setActiveFilter,
    toggleTask,
    setActiveTaskDetailsId,
    setIsBreathingOpen,
    isTimerRunning,
    toggleTimer,
  } = useApp();

  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  // Split tasks into groups
  const uncompletedTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  // Filter tasks based on activeFilter
  const getFilteredTasks = (taskList: Task[]) => {
    if (activeFilter === 'focus') {
      return taskList.filter((t) => t.priority === 'focus');
    }
    if (activeFilter === 'quick') {
      return taskList.filter((t) => t.priority === 'quick');
    }
    if (activeFilter === 'done') {
      return taskList.filter((t) => t.completed);
    }
    return taskList;
  };

  const deepFocusTasks = getFilteredTasks(uncompletedTasks.filter((t) => t.priority === 'focus'));
  const laterTodayTasks = getFilteredTasks(uncompletedTasks.filter((t) => t.priority !== 'focus'));

  const totalTodayTasks = tasks.length;
  const completedCount = completedTasks.length;
  const remainingCount = uncompletedTasks.length;
  const completionPercentage = totalTodayTasks > 0 ? Math.round((completedCount / totalTodayTasks) * 100) : 0;

  // Next milestone calculation
  const nextMilestoneTarget = Math.min(totalTodayTasks, completedCount + 1);
  const nextMilestonePercent = totalTodayTasks > 0 ? Math.round((nextMilestoneTarget / totalTodayTasks) * 100) : 100;

  // Remaining minutes sum
  const remainingMinutes = uncompletedTasks.reduce((sum, t) => sum + (t.durationMinutes || 15), 0);
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins = remainingMinutes % 60;
  const timeFormatted =
    remainingHours > 0 ? `~${remainingHours}h ${remainingMins}m left` : `~${remainingMins}m left`;

  // Circular progress math
  const circumference = 2 * Math.PI * 27; // r=27 -> 169.6
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  const focusCount = tasks.filter((t) => t.priority === 'focus').length;
  const quickCount = tasks.filter((t) => t.priority === 'quick').length;

  const filterOptions: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: totalTodayTasks },
    { key: 'focus', label: 'Focus', count: focusCount },
    { key: 'quick', label: 'Quick Wins', count: quickCount },
    { key: 'done', label: 'Completed', count: completedCount },
  ];

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto pb-6">
      {/* Calm Atmosphere & Mindful Greeting */}
      <section className="px-margin pt-space-md pb-space-lg flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-secondary tracking-wide uppercase">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <div className="flex items-center gap-1 text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-[15px] text-secondary">spa</span>
            <span className="font-label-sm text-label-sm">Morning Cadence</span>
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary">
            Good morning, Elena
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 italic leading-relaxed">
            “One task at a time with calm intention.”
          </p>
        </div>
      </section>

      {/* Visual Delight: Daily Flow & Tactile Focus Widget */}
      <section className="px-margin mb-space-xl">
        <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
          <div className="flex items-center justify-between gap-space-md">
            {/* Progress Ring & Numbers */}
            <div className="flex items-center gap-space-md min-w-0">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle
                    className="text-surface-container-high stroke-current"
                    cx="32"
                    cy="32"
                    fill="transparent"
                    r="27"
                    strokeWidth="4.5"
                  />
                  <circle
                    className="text-secondary stroke-current transition-all duration-700 ease-out"
                    cx="32"
                    cy="32"
                    fill="transparent"
                    r="27"
                    strokeDasharray="169.6"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    strokeWidth="4.5"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-headline-md text-headline-md text-primary leading-none">
                    {completionPercentage}%
                  </span>
                </div>
              </div>

              <div className="flex flex-col min-w-0">
                <span className="font-headline-md text-headline-md text-primary truncate">
                  Flow State
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {completedCount} of {totalTodayTasks} completed today
                </span>
                <span className="font-label-sm text-label-sm text-secondary mt-0.5 font-medium">
                  {remainingCount} calm tasks remaining
                </span>
              </div>
            </div>

            {/* Playful Mini Start Button */}
            <button
              aria-label="Start Deep Focus Session"
              onClick={() => toggleTimer()}
              className={`h-11 px-4 rounded-full font-label-md text-label-md flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 ${
                isTimerRunning
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-primary text-on-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isTimerRunning ? 'pause' : 'play_arrow'}
              </span>
              <span>{isTimerRunning ? 'Flowing' : 'Focus'}</span>
            </button>
          </div>

          {/* Mindful Ambient Micro-Bar */}
          <div className="mt-4 pt-3 flex items-center justify-between text-on-surface-variant border-t border-surface-container/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-label-sm text-label-sm">
                Next milestone: {nextMilestoneTarget} tasks ({nextMilestonePercent}%)
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-outline">{timeFormatted}</span>
          </div>
        </div>
      </section>

      {/* Filter Pills (Scrollable Row) */}
      <section className="px-margin mb-space-lg">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {filterOptions.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`filter-pill px-3.5 py-1.5 rounded-full font-label-md text-label-md shrink-0 transition-colors ${
                activeFilter === filter.key
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </section>

      {/* High Priority / In Deep Focus Section */}
      {activeFilter !== 'done' && deepFocusTasks.length > 0 && (
        <section className="px-margin mb-space-xl flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-tertiary">wb_sunny</span>
              <h2 className="font-headline-md text-headline-md text-primary">In Deep Focus</h2>
            </div>
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Top Priorities
            </span>
          </div>

          <div className="space-y-3">
            {deepFocusTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setActiveTaskDetailsId(task.id)}
                className="task-card bg-surface-container-lowest rounded-xl p-space-md shadow-sm transition-all duration-200 hover:shadow-md flex flex-col gap-3 group cursor-pointer"
              >
                <div className="flex items-start gap-space-sm">
                  <button
                    aria-label="Mark task as complete"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTask(task.id);
                    }}
                    className="task-checkbox w-6 h-6 rounded-full bg-surface-container shrink-0 mt-0.5 flex items-center justify-center text-transparent hover:text-secondary hover:bg-secondary-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px]">check</span>
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-headline-md text-headline-md text-primary group-hover:text-primary-container transition-colors truncate">
                        {task.title}
                      </h3>
                      <span className="material-symbols-outlined text-outline text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">
                        chevron_right
                      </span>
                    </div>
                    {task.notes && (
                      <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mt-1">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Meta Row */}
                <div className="flex items-center justify-between pt-2 pl-8 border-t border-surface-container/40">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[13px]">timer</span>
                      {task.durationMinutes} min
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      {task.categoryLabel || 'Deep Work'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px]">
                      {task.categoryIcon || 'psychology'}
                    </span>
                    <span className="font-label-sm text-label-sm">
                      {task.subtasks.length > 0
                        ? `${task.subtasks.filter((s) => s.completed).length}/${task.subtasks.length}`
                        : task.tags[0] || 'Focus'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Later Today Section */}
      {activeFilter !== 'done' && laterTodayTasks.length > 0 && (
        <section className="px-margin mb-space-xl flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary">schedule</span>
              <h2 className="font-headline-md text-headline-md text-primary">Later Today</h2>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {laterTodayTasks.length} items
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {laterTodayTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setActiveTaskDetailsId(task.id)}
                className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center justify-between gap-3 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    aria-label="Mark completed"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTask(task.id);
                    }}
                    className="task-checkbox w-5 h-5 rounded-full bg-surface-container shrink-0 flex items-center justify-center text-transparent hover:text-secondary hover:bg-secondary-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">check</span>
                  </button>

                  <div className="flex flex-col min-w-0">
                    <span className="font-body-lg text-body-lg text-primary truncate">
                      {task.title}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {task.durationMinutes} min • {task.categoryLabel || 'Task'}
                    </span>
                  </div>
                </div>

                <span className="font-label-sm text-label-sm text-outline shrink-0">
                  {task.dueTime || '2:00 PM'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Serene Interlude: Visual Texture */}
      <section className="px-margin mb-space-xl">
        <div
          onClick={() => setIsBreathingOpen(true)}
          className="relative rounded-xl overflow-hidden bg-surface-container-low p-space-md flex items-center gap-space-md shadow-xs hover:shadow-sm cursor-pointer transition-transform active:scale-[0.99]"
          role="button"
          tabIndex={0}
        >
          <img
            className="w-16 h-16 rounded-lg object-cover shrink-0"
            alt="Zen garden tabletop aesthetic"
            src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=200&q=80"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="material-symbols-outlined text-[14px] text-secondary">spa</span>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
                Mindful Pause
              </span>
            </div>
            <span className="font-body-md text-body-md text-primary font-medium">
              Breathe deeply between focus blocks.
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Quiet breaks refresh your cognitive capacity.
            </span>
          </div>
        </div>
      </section>

      {/* Completed Tasks Accordion */}
      {completedTasks.length > 0 && (
        <section className="px-margin mb-space-md">
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <button
              aria-expanded={isAccordionOpen}
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="w-full p-space-md flex items-center justify-between text-left transition-colors hover:bg-surface-container-low"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]">done_all</span>
                </div>
                <span className="font-headline-md text-headline-md text-primary">
                  Completed Today
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                  {completedTasks.length}
                </span>
              </div>
              <span
                className={`material-symbols-outlined text-outline text-[20px] transition-transform duration-300 ${
                  isAccordionOpen ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>

            {isAccordionOpen && (
              <div className="px-space-md pb-space-md flex flex-col gap-2.5">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setActiveTaskDetailsId(task.id)}
                    className="flex items-center justify-between py-1.5 opacity-65 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTask(task.id);
                        }}
                        className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-on-secondary shrink-0 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[13px]">check</span>
                      </button>
                      <span className="font-body-md text-body-md text-on-surface-variant line-through truncate">
                        {task.title}
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-outline shrink-0">
                      {task.completedAt || 'Done'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
