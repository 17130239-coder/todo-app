import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const TaskDetailsModal: React.FC = () => {
  const {
    tasks,
    activeTaskDetailsId,
    setActiveTaskDetailsId,
    updateTask,
    deleteTask,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    toggleTask,
    isTimerRunning,
    timerSecondsRemaining,
    toggleTimer,
    showToast,
  } = useApp();

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showAddSubtaskInput, setShowAddSubtaskInput] = useState(false);

  const task = tasks.find((t) => t.id === activeTaskDetailsId);

  if (!task) return null;

  const completedSubtasksCount = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasksCount = task.subtasks.length;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(task.id, newSubtaskTitle.trim(), '15m');
    setNewSubtaskTitle('');
    setShowAddSubtaskInput(false);
  };

  const formatTimerDisplay = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleTogglePriority = () => {
    const nextPriority =
      task.priority === 'focus' ? 'quick' : task.priority === 'quick' ? 'normal' : 'focus';
    updateTask(task.id, { priority: nextPriority });
    showToast(`Priority set to ${nextPriority}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-surface flex flex-col pt-safe animate-fadeIn pb-safe">
      {/* Header Bar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(45,52,54,0.03)] pt-safe">
        <div className="h-16 px-margin max-w-lg mx-auto flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs min-w-0">
            <button
              aria-label="Go back"
              className="w-11 h-11 -ml-2 flex items-center justify-center rounded-full text-on-surface hover:text-primary transition-colors focus:outline-none"
              onClick={() => setActiveTaskDetailsId(null)}
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <img
              alt="Focus App Icon"
              className="h-7 w-7 object-contain shrink-0"
              src="./focus-icon.svg"
            />
            <h1 className="font-headline-md text-headline-md text-primary tracking-tight truncate pl-1">
              Task Details
            </h1>
          </div>

          <div className="flex items-center gap-space-xs shrink-0">
            <button
              aria-label="Delete Task"
              onClick={() => {
                if (window.confirm(`Delete "${task.title}"?`)) {
                  deleteTask(task.id);
                }
              }}
              className="w-11 h-11 flex items-center justify-center rounded-full text-outline hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">delete</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col relative w-full pt-20 pb-12 max-w-lg mx-auto px-margin space-y-space-lg">
        {/* Top Context & Status */}
        <div className="flex items-center justify-between pt-space-sm">
          <button
            onClick={() => setActiveTaskDetailsId(null)}
            className="flex items-center gap-space-xs text-on-surface-variant hover:text-primary transition-colors focus:outline-none -ml-1"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span className="font-label-md text-label-md">Back to Overview</span>
          </button>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full shadow-sm ${
              task.completed
                ? 'bg-secondary text-on-secondary'
                : 'bg-secondary-container text-on-secondary-container'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                task.completed ? 'bg-on-secondary' : 'bg-secondary animate-pulse'
              }`}
            />
            <span className="font-label-sm text-label-sm font-medium">
              {task.completed
                ? 'Completed'
                : `In Progress • Due ${task.dueTime || task.dueDate || '3:00 PM'}`}
            </span>
          </div>
        </div>

        {/* Visual Delight & Mood Card */}
        <div className="relative w-full rounded-xl overflow-hidden bg-surface-container shadow-sm h-36">
          <img
            className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
            alt="Zen workspace aesthetic"
            src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/40 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary">spa</span>
              <span className="font-label-sm text-label-sm text-on-surface tracking-wider uppercase font-semibold">
                {task.categoryLabel || 'Strategic Milestone'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-sm text-on-surface">
              <span
                className="material-symbols-outlined text-[14px] text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
              <span className="font-label-sm text-label-sm font-medium">
                {completedSubtasksCount} / {totalSubtasksCount} Subtasks
              </span>
            </div>
          </div>
        </div>

        {/* Title & Editable Scope Notes */}
        <div className="space-y-space-sm">
          <input
            type="text"
            value={task.title}
            onChange={(e) => updateTask(task.id, { title: e.target.value })}
            className="w-full bg-transparent font-display-lg-mobile text-display-lg-mobile text-primary tracking-tight border-none outline-none focus:ring-1 focus:ring-secondary/30 rounded px-1 -mx-1"
          />

          <div className="p-3.5 rounded-xl bg-surface-container-low shadow-sm transition-all focus-within:bg-surface-container-lowest focus-within:shadow-md">
            <label
              htmlFor="task-notes"
              className="block font-label-sm text-label-sm text-on-surface-variant mb-1 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">edit_note</span>
              Context &amp; Notes
            </label>
            <textarea
              id="task-notes"
              rows={3}
              value={task.notes}
              onChange={(e) => updateTask(task.id, { notes: e.target.value })}
              className="w-full bg-transparent font-body-md text-body-md text-on-surface focus:outline-none resize-none leading-relaxed"
              placeholder="Add additional references or constraints..."
            />
          </div>
        </div>

        {/* Metadata Attribute Chips (Horizontal Scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar -mx-margin px-margin">
          {/* Due Date Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[16px] text-secondary">
              calendar_today
            </span>
            <span className="font-label-md text-label-md">{task.dueDate}</span>
          </div>

          {/* Priority Pill */}
          <button
            onClick={handleTogglePriority}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0 shadow-sm transition-transform active:scale-95 ${
              task.priority === 'focus'
                ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                : 'bg-secondary-fixed text-on-secondary-fixed'
            }`}
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
            <span className="font-label-md text-label-md">
              {task.priority === 'focus'
                ? 'High Priority'
                : task.priority === 'quick'
                ? 'Quick Win'
                : 'Normal'}
            </span>
          </button>

          {/* Tag Pill */}
          {task.tags.map((tag) => (
            <div
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed shrink-0 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">label</span>
              <span className="font-label-md text-label-md">{tag}</span>
            </div>
          ))}

          {/* Duration Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
              timer
            </span>
            <span className="font-label-md text-label-md">{task.durationMinutes} min</span>
          </div>
        </div>

        {/* Subtask Checklist Breakdown Card */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm space-y-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">checklist</span>
              <h3 className="font-headline-md text-headline-md text-primary">Key Deliverables</h3>
            </div>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
              {completedSubtasksCount} of {totalSubtasksCount} completed
            </span>
          </div>

          {/* Interactive Checklist */}
          <div className="space-y-space-sm" id="subtask-list">
            {task.subtasks.map((sub) => (
              <div
                key={sub.id}
                onClick={() => toggleSubtask(task.id, sub.id)}
                className="group flex items-start gap-3 p-2.5 rounded-lg transition-colors hover:bg-surface-container-low cursor-pointer"
              >
                <button
                  type="button"
                  aria-label="Toggle subtask"
                  className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90 shadow-sm ${
                    sub.completed
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface-container-high text-transparent hover:text-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">check</span>
                </button>

                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                  <span
                    className={`font-body-md text-body-md truncate ${
                      sub.completed ? 'text-outline line-through' : 'text-on-surface'
                    }`}
                  >
                    {sub.title}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full ${
                        sub.completed
                          ? 'text-on-secondary-container bg-secondary-container'
                          : 'text-on-surface-variant bg-surface-container'
                      }`}
                    >
                      {sub.completed ? 'Done' : sub.durationTag || '15m'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSubtask(task.id, sub.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-outline hover:text-error p-0.5 transition-opacity"
                      aria-label="Delete subtask"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Inline Add Subtask Input Form */}
          <div className="pt-1">
            {showAddSubtaskInput ? (
              <form onSubmit={handleAddSubtask} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  autoFocus
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="flex-1 bg-surface-container-low font-body-md text-body-md text-on-surface px-3 py-2 rounded-lg focus:outline-none focus:bg-surface-container-lowest shadow-sm"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md active:scale-95 transition-transform shadow-sm"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSubtaskInput(false)}
                  className="px-2 py-2 rounded-lg text-outline hover:text-on-surface text-label-md"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddSubtaskInput(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md active:scale-98 transition-all"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">add</span>
                <span>Add subtask</span>
              </button>
            )}
          </div>
        </div>

        {/* Pomodoro Mini Focus Card */}
        <div className="relative overflow-hidden rounded-xl bg-primary-container text-on-primary p-space-md shadow-md space-y-space-md">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-secondary/15 blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-surface-container-lowest/10 flex items-center justify-center text-on-primary">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  timer
                </span>
              </div>
              <div>
                <h4 className="font-headline-md text-headline-md leading-tight text-surface-container-lowest">
                  Deep Focus Block
                </h4>
                <p className="font-body-sm text-body-sm text-outline-variant">
                  Structured 25-minute Pomodoro cycle
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-on-primary font-headline-md text-headline-md tracking-wider bg-surface-container-lowest/10 px-2.5 py-1 rounded-full font-mono">
              <span>{formatTimerDisplay(timerSecondsRemaining)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toggleTimer(task.id)}
            className="relative z-10 w-full py-3 rounded-full bg-surface-container-lowest text-primary hover:bg-surface-bright font-label-md text-label-md flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isTimerRunning ? 'pause' : 'play_arrow'}
            </span>
            <span>{isTimerRunning ? 'Pause Focus' : 'Start Focus Block'}</span>
          </button>
        </div>

        {/* Ambient Productivity Inspiration Tile */}
        <div className="flex items-center gap-space-md p-space-md rounded-xl bg-surface-container shadow-sm">
          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
            <img
              alt="Bamboo and sunlight"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=150&q=80"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
              Mindful Tip
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
              Batch communication windows after drafting key deliverables.
            </p>
          </div>
        </div>

        {/* Primary Bottom Actions */}
        <div className="pt-space-sm space-y-space-md">
          <button
            type="button"
            onClick={() => toggleTask(task.id)}
            className={`w-full py-3.5 rounded-full font-label-md text-label-md flex items-center justify-center gap-2 active:scale-98 transition-all shadow-md ${
              task.completed
                ? 'bg-secondary text-on-secondary'
                : 'bg-primary text-on-primary hover:bg-primary-container'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">task_alt</span>
            <span>{task.completed ? 'Completed!' : 'Mark Task as Complete'}</span>
          </button>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to remove this task?')) {
                  deleteTask(task.id);
                }
              }}
              className="inline-flex items-center gap-1 font-label-md text-label-md text-outline hover:text-error transition-colors p-2 focus:outline-none"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              <span>Delete Task</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
