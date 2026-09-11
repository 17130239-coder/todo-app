import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Priority } from '../types';

export const AddTaskModal: React.FC = () => {
  const { isAddTaskOpen, setIsAddTaskOpen, spaces, tags, addTask } = useApp();

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [spaceId, setSpaceId] = useState(spaces[0]?.id || 'product-design');
  const [priority, setPriority] = useState<Priority>('focus');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [dueTime, setDueTime] = useState('2:00 PM');
  const [selectedTags, setSelectedTags] = useState<string[]>(['#deepwork']);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState('');

  if (!isAddTaskOpen) return null;

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddSubtaskDraft = () => {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [...prev, newSubtask.trim()]);
    setNewSubtask('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedSpace = spaces.find((s) => s.id === spaceId);

    addTask({
      title: title.trim(),
      notes: notes.trim(),
      completed: false,
      dueDate: `Today, ${dueTime}`,
      dueTime,
      priority,
      durationMinutes,
      spaceId,
      categoryIcon: selectedSpace?.icon || 'checklist',
      categoryLabel: selectedSpace?.name || 'Task',
      tags: selectedTags,
      subtasks: subtasks.map((s, idx) => ({
        id: 'sub-' + Date.now() + '-' + idx,
        title: s,
        completed: false,
        durationTag: '15m',
      })),
    });

    // Reset & close
    setTitle('');
    setNotes('');
    setSubtasks([]);
    setIsAddTaskOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-primary/40 backdrop-blur-xs transition-opacity animate-fadeIn">
      <div
        className="w-full max-w-lg bg-surface rounded-t-2xl sm:rounded-2xl shadow-2xl p-space-lg flex flex-col max-h-[90vh] overflow-y-auto pb-safe"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[18px]">add_task</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary">New Intentional Task</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsAddTaskOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Title input */}
          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">
              Task Title *
            </label>
            <input
              type="text"
              autoFocus
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Synthesize user interview insights"
              className="w-full bg-surface-container-lowest font-headline-md text-headline-md text-primary p-3 rounded-xl border border-surface-container shadow-xs focus:outline-none focus:border-secondary transition-colors"
            />
          </div>

          {/* Notes / Context */}
          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">
              Context &amp; Purpose
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What makes this meaningful today?"
              className="w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface p-3 rounded-xl border border-surface-container shadow-xs focus:outline-none focus:border-secondary transition-colors resize-none"
            />
          </div>

          {/* Space / Project selection */}
          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
              Space / Area
            </label>
            <div className="grid grid-cols-2 gap-2">
              {spaces.map((space) => (
                <button
                  key={space.id}
                  type="button"
                  onClick={() => setSpaceId(space.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all text-left ${
                    spaceId === space.id
                      ? 'border-primary bg-surface-container-lowest shadow-xs ring-1 ring-primary'
                      : 'border-surface-container-high bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    {space.icon}
                  </span>
                  <span className="font-label-md text-label-md text-primary truncate">
                    {space.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority & Duration Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setPriority('focus')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-1 transition-all ${
                    priority === 'focus'
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed font-semibold shadow-xs'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">wb_sunny</span>
                  Focus
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('quick')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-1 transition-all ${
                    priority === 'quick'
                      ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-xs'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  Quick
                </button>
              </div>
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
                Duration
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface p-2 rounded-lg border border-surface-container focus:outline-none"
              >
                <option value={10}>10 min</option>
                <option value={15}>15 min</option>
                <option value={25}>25 min (Pomodoro)</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min (Deep Work)</option>
                <option value={60}>60 min</option>
              </select>
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">
              Scheduled Time
            </label>
            <input
              type="text"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              placeholder="e.g. 2:00 PM"
              className="w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface p-2.5 rounded-xl border border-surface-container shadow-xs focus:outline-none focus:border-secondary"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Subtasks draft */}
          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
              Key Deliverables / Subtasks
            </label>
            <div className="space-y-1.5 mb-2">
              {subtasks.map((st, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low text-body-sm"
                >
                  <span className="truncate">{st}</span>
                  <button
                    type="button"
                    onClick={() => setSubtasks(subtasks.filter((_, idx) => idx !== i))}
                    className="text-outline hover:text-error"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtaskDraft();
                  }
                }}
                placeholder="Add deliverable step..."
                className="flex-1 bg-surface-container-lowest font-body-sm text-body-sm p-2 rounded-lg border border-surface-container focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSubtaskDraft}
                className="px-3 py-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-primary font-label-sm"
              >
                Add
              </button>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setIsAddTaskOpen(false)}
              className="flex-1 py-3 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-md active:scale-98 transition-transform"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
