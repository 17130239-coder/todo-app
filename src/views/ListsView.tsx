import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ListsView: React.FC = () => {
  const {
    tasks,
    spaces,
    tags,
    searchQuery,
    setSearchQuery,
    selectedTagFilter,
    setSelectedTagFilter,
    selectedSpaceFilter,
    setSelectedSpaceFilter,
    smartViewFilter,
    setSmartViewFilter,
    setIsCreateSpaceOpen,
    setActiveTaskDetailsId,
    toggleTask,
    addTag,
    showToast,
  } = useApp();

  const [newTagInput, setNewTagInput] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);

  // Calculate task counts for smart views
  const todayCount = tasks.filter((t) => !t.completed).length;
  const scheduledCount = tasks.filter((t) => !t.completed).length; // Queued tasks
  const allCount = tasks.length;
  const archiveCount = tasks.filter((t) => t.completed).length;

  // Space stats
  const getSpaceStats = (spaceId: string) => {
    const spaceTasks = tasks.filter((t) => t.spaceId === spaceId);
    const completed = spaceTasks.filter((t) => t.completed).length;
    const total = spaceTasks.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { count: total, completed, percent };
  };

  // Tag count
  const getTagCount = (tag: string) => {
    return tasks.filter((t) => t.tags.includes(tag)).length;
  };

  // Filtered task results
  const filteredTasks = tasks.filter((t) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchNotes = t.notes?.toLowerCase().includes(q);
      const matchTags = t.tags.some((tag) => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchNotes && !matchTags) return false;
    }

    // Smart view filter
    if (smartViewFilter === 'today') {
      if (t.completed) return false;
    } else if (smartViewFilter === 'scheduled') {
      if (t.completed) return false;
    } else if (smartViewFilter === 'archive') {
      if (!t.completed) return false;
    }

    // Space filter
    if (selectedSpaceFilter && t.spaceId !== selectedSpaceFilter) {
      return false;
    }

    // Tag filter
    if (selectedTagFilter && !t.tags.includes(selectedTagFilter)) {
      return false;
    }

    return true;
  });

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    Boolean(selectedTagFilter) ||
    Boolean(selectedSpaceFilter) ||
    Boolean(smartViewFilter);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTagFilter(null);
    setSelectedSpaceFilter(null);
    setSmartViewFilter(null);
    showToast('Filters cleared');
  };

  const handleSmartViewClick = (view: 'today' | 'scheduled' | 'all' | 'archive') => {
    if (smartViewFilter === view) {
      setSmartViewFilter(null);
      showToast('Viewing all spaces');
    } else {
      setSmartViewFilter(view);
      setSelectedSpaceFilter(null);
      showToast(`Smart view: ${view.toUpperCase()}`);
    }
  };

  const handleSpaceClick = (spaceId: string, name: string) => {
    if (selectedSpaceFilter === spaceId) {
      setSelectedSpaceFilter(null);
      showToast('All spaces shown');
    } else {
      setSelectedSpaceFilter(spaceId);
      setSmartViewFilter(null);
      showToast(`Filtered by ${name}`);
    }
  };

  const handleTagClick = (tag: string) => {
    if (selectedTagFilter === tag) {
      setSelectedTagFilter(null);
      showToast('Tag filter removed');
    } else {
      setSelectedTagFilter(tag);
      showToast(`Filtered by ${tag}`);
    }
  };

  const handleAddNewTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    addTag(newTagInput.trim());
    setNewTagInput('');
    setShowAddTag(false);
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto pb-6 px-margin">
      {/* Search & Filter Bar */}
      <div className="w-full pt-1 pb-space-lg">
        <div className="relative w-full flex items-center bg-surface-container-low rounded-full px-space-md py-space-sm shadow-sm transition-all focus-within:bg-surface-container-lowest focus-within:shadow-md">
          <span className="material-symbols-outlined text-outline text-[20px] shrink-0 mr-space-xs">
            search
          </span>
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, lists, or tags..."
            className="w-full bg-transparent border-none outline-none font-body-md text-body-md text-on-surface placeholder:text-outline/70 focus:outline-none"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="text-outline hover:text-on-surface p-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => showToast('Filters: select tags or smart views below')}
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Pill Badge */}
      {hasActiveFilters && (
        <div className="mb-space-md p-3 rounded-xl bg-secondary-container/50 flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[18px] text-secondary">filter_alt</span>
            <span className="font-label-md text-label-md text-on-secondary-container truncate">
              {smartViewFilter && `View: ${smartViewFilter} `}
              {selectedSpaceFilter && `Space: ${spaces.find((s) => s.id === selectedSpaceFilter)?.name} `}
              {selectedTagFilter && `Tag: ${selectedTagFilter} `}
              {searchQuery && `"${searchQuery}"`}
              ({filteredTasks.length} results)
            </span>
          </div>
          <button
            onClick={clearAllFilters}
            className="font-label-sm text-label-sm text-secondary hover:underline font-semibold shrink-0"
          >
            Clear
          </button>
        </div>
      )}

      {/* Filtered Tasks List View if filter is active */}
      {hasActiveFilters ? (
        <div className="space-y-3 mb-space-xl">
          <h3 className="font-headline-md text-headline-md text-primary">Filtered Tasks</h3>
          {filteredTasks.length === 0 ? (
            <div className="p-space-lg text-center bg-surface-container-lowest rounded-xl shadow-sm">
              <span className="material-symbols-outlined text-[36px] text-outline mb-2">
                filter_list_off
              </span>
              <p className="font-body-md text-body-md text-on-surface-variant">
                No tasks match your current filter.
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setActiveTaskDetailsId(task.id)}
                className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center justify-between gap-3 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTask(task.id);
                    }}
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      task.completed
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-surface-container text-transparent hover:text-secondary hover:bg-secondary-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">check</span>
                  </button>
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`font-body-lg text-body-lg truncate ${
                        task.completed ? 'text-outline line-through' : 'text-primary'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {task.durationMinutes} min • {task.categoryLabel || 'Task'}
                    </span>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-outline shrink-0">
                  {task.dueTime || task.dueDate}
                </span>
              </div>
            ))
          )}
        </div>
      ) : null}

      {/* Smart Views 2x2 Bento Grid */}
      <div className="w-full mb-space-xl">
        <div className="flex items-center justify-between mb-space-sm">
          <h2 className="font-label-md text-label-md text-outline uppercase tracking-wider">
            Smart Views
          </h2>
          <span className="font-label-sm text-label-sm text-secondary font-semibold">
            4 active views
          </span>
        </div>

        <div className="grid grid-cols-2 gap-space-sm w-full">
          {/* 1. Today Card */}
          <div
            onClick={() => handleSmartViewClick('today')}
            className={`group relative bg-surface-container-lowest rounded-xl p-space-md shadow-sm active:scale-[0.98] transition-all flex flex-col justify-between overflow-hidden cursor-pointer ${
              smartViewFilter === 'today' ? 'ring-2 ring-tertiary-fixed-dim' : ''
            }`}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start justify-between w-full mb-3">
              <div className="w-9 h-9 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shadow-xs">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  wb_sunny
                </span>
              </div>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-tertiary-container/10 text-on-tertiary-container font-semibold">
                Due now
              </span>
            </div>
            <div>
              <span className="font-headline-md text-headline-md text-on-surface block tracking-tight group-hover:text-primary transition-colors">
                Today
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {todayCount} tasks pending
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-tertiary-fixed-dim rounded-b-xl" />
          </div>

          {/* 2. Scheduled Card */}
          <div
            onClick={() => handleSmartViewClick('scheduled')}
            className={`group relative bg-surface-container-lowest rounded-xl p-space-md shadow-sm active:scale-[0.98] transition-all flex flex-col justify-between overflow-hidden cursor-pointer ${
              smartViewFilter === 'scheduled' ? 'ring-2 ring-primary-container' : ''
            }`}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start justify-between w-full mb-3">
              <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-xs">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              </div>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-semibold">
                Next 7d
              </span>
            </div>
            <div>
              <span className="font-headline-md text-headline-md text-on-surface block tracking-tight group-hover:text-primary transition-colors">
                Scheduled
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {scheduledCount} tasks queued
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-container/40 rounded-b-xl" />
          </div>

          {/* 3. All Tasks Card */}
          <div
            onClick={() => handleSmartViewClick('all')}
            className={`group relative bg-surface-container-lowest rounded-xl p-space-md shadow-sm active:scale-[0.98] transition-all flex flex-col justify-between overflow-hidden cursor-pointer ${
              smartViewFilter === 'all' ? 'ring-2 ring-outline' : ''
            }`}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start justify-between w-full mb-3">
              <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface shadow-xs">
                <span className="material-symbols-outlined text-[20px]">inbox</span>
              </div>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-outline font-semibold">
                Total
              </span>
            </div>
            <div>
              <span className="font-headline-md text-headline-md text-on-surface block tracking-tight group-hover:text-primary transition-colors">
                All Tasks
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {allCount} items master
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-outline/40 rounded-b-xl" />
          </div>

          {/* 4. Archive Card */}
          <div
            onClick={() => handleSmartViewClick('archive')}
            className={`group relative bg-surface-container-lowest rounded-xl p-space-md shadow-sm active:scale-[0.98] transition-all flex flex-col justify-between overflow-hidden cursor-pointer ${
              smartViewFilter === 'archive' ? 'ring-2 ring-secondary' : ''
            }`}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start justify-between w-full mb-3">
              <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shadow-xs">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  task_alt
                </span>
              </div>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-container/60 text-secondary font-semibold">
                Historic
              </span>
            </div>
            <div>
              <span className="font-headline-md text-headline-md text-on-surface block tracking-tight group-hover:text-secondary transition-colors">
                Archive
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {archiveCount} completed
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary-fixed-dim rounded-b-xl" />
          </div>
        </div>
      </div>

      {/* Visual Space Vignette Banner */}
      <div className="w-full mb-space-xl relative rounded-xl overflow-hidden shadow-sm">
        <div
          className="w-full h-24 bg-cover bg-center flex items-center p-space-md relative"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-primary/45 backdrop-blur-[1px]" />
          <div className="relative z-10 text-on-primary max-w-[85%]">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-[16px] text-secondary-fixed">spa</span>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary-fixed font-semibold">
                Mindful Flow
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-surface-container-highest line-clamp-1 font-medium">
              Keep only what brings clear focus to your day.
            </p>
          </div>
        </div>
      </div>

      {/* My Lists / Spaces Section */}
      <div className="w-full mb-space-xl">
        <div className="flex items-center justify-between mb-space-sm">
          <h2 className="font-label-md text-label-md text-outline uppercase tracking-wider">
            Spaces &amp; Projects
          </h2>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {spaces.length} active spaces
          </span>
        </div>

        <div className="flex flex-col gap-space-sm w-full">
          {spaces.map((space) => {
            const stats = getSpaceStats(space.id);
            const isSelected = selectedSpaceFilter === space.id;

            return (
              <div
                key={space.id}
                onClick={() => handleSpaceClick(space.id, space.name)}
                className={`group w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm active:scale-[0.99] transition-all cursor-pointer ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full ${space.bgClass} flex items-center justify-center ${space.textClass} shrink-0`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{space.icon}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-headline-md text-headline-md text-on-surface tracking-tight group-hover:text-primary transition-colors truncate">
                        {space.name}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {stats.count} tasks
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full ${space.badgeClass} font-medium shrink-0`}
                  >
                    {stats.percent}%
                  </span>
                </div>

                {/* Progress track */}
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`${space.colorClass} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${stats.percent}%` }}
                  />
                </div>
              </div>
            );
          })}

          {/* Create New List Button */}
          <button
            type="button"
            onClick={() => setIsCreateSpaceOpen(true)}
            className="w-full py-3.5 px-space-md rounded-xl bg-surface-container-low hover:bg-surface-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-on-surface-variant shadow-xs cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-full bg-surface-container-highest group-hover:bg-primary group-hover:text-on-primary transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">add</span>
            </div>
            <span className="font-label-md text-label-md tracking-wide font-semibold text-primary">
              Create New List
            </span>
          </button>
        </div>
      </div>

      {/* Tags & Context Cloud */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-space-sm">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-outline">label</span>
            <h2 className="font-label-md text-label-md text-outline uppercase tracking-wider">
              Tags &amp; Context
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowAddTag(!showAddTag)}
            className="font-label-sm text-label-sm text-secondary hover:underline font-semibold"
          >
            {showAddTag ? 'Cancel' : 'Manage'}
          </button>
        </div>

        {/* Add Tag Inline Form */}
        {showAddTag && (
          <form onSubmit={handleAddNewTag} className="flex gap-2 mb-3">
            <input
              type="text"
              autoFocus
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="New tag e.g. #reading"
              className="flex-1 bg-surface-container-low font-body-sm text-body-sm p-2 rounded-xl border border-surface-container focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-primary text-on-primary font-label-sm text-label-sm"
            >
              Add
            </button>
          </form>
        )}

        <div className="flex flex-wrap gap-2 w-full">
          {tags.map((tag) => {
            const count = getTagCount(tag);
            const isSelected = selectedTagFilter === tag;

            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`tag-chip px-3 py-1.5 rounded-full flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? 'bg-primary text-on-primary ring-1 ring-primary'
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-container'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    tag.includes('urgent')
                      ? 'bg-error'
                      : tag.includes('wellness')
                      ? 'bg-secondary'
                      : tag.includes('deep')
                      ? 'bg-primary'
                      : 'bg-surface-tint'
                  }`}
                />
                <span className="font-label-md text-label-md">{tag}</span>
                <span
                  className={`font-label-sm text-label-sm ${
                    isSelected ? 'text-surface-container-highest' : 'text-outline'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {/* Tag Add Plus Button */}
          <button
            type="button"
            onClick={() => setShowAddTag(true)}
            aria-label="Add custom tag"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
