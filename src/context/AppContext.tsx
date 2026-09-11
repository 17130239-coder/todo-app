import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { Task, Space, MindfulHabit, ViewType, FilterType, SoundType } from '../types';
import {
  INITIAL_TASKS,
  INITIAL_SPACES,
  INITIAL_HABITS,
  ALL_TAGS,
  INITIAL_WEEKLY_COMPLETIONS,
  INITIAL_STREAK,
} from '../utils/initialData';
import { soundEngine } from '../utils/audio';
import { fireMindfulConfetti } from '../utils/confetti';

interface AppContextType {
  // State
  tasks: Task[];
  spaces: Space[];
  habits: MindfulHabit[];
  tags: string[];
  currentView: ViewType;
  activeFilter: FilterType;
  searchQuery: string;
  selectedTagFilter: string | null;
  selectedSpaceFilter: string | null;
  smartViewFilter: 'all' | 'today' | 'scheduled' | 'archive' | null;
  activeTaskDetailsId: string | null;
  isAddTaskOpen: boolean;
  isCreateSpaceOpen: boolean;
  isBreathingOpen: boolean;
  isNotificationsOpen: boolean;
  isProfileOpen: boolean;
  toastMessage: string | null;
  todayFocusMinutes: number;
  soundSelection: SoundType;
  isTimerRunning: boolean;
  timerSecondsRemaining: number;
  timerTotalDuration: number;
  activeTimerTaskId: string | null;
  weeklyCompletions: typeof INITIAL_WEEKLY_COMPLETIONS;
  streakDays: typeof INITIAL_STREAK;

  // View Navigation
  setCurrentView: (view: ViewType) => void;
  setActiveFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTagFilter: (tag: string | null) => void;
  setSelectedSpaceFilter: (spaceId: string | null) => void;
  setSmartViewFilter: (view: 'all' | 'today' | 'scheduled' | 'archive' | null) => void;

  // Modal / Drawer Toggles
  setActiveTaskDetailsId: (id: string | null) => void;
  setIsAddTaskOpen: (open: boolean) => void;
  setIsCreateSpaceOpen: (open: boolean) => void;
  setIsBreathingOpen: (open: boolean) => void;
  setIsNotificationsOpen: (open: boolean) => void;
  setIsProfileOpen: (open: boolean) => void;

  // Task Operations
  toggleTask: (id: string) => void;
  addTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string, durationTag?: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Space & Tag Operations
  addSpace: (space: Omit<Space, 'id'>) => void;
  addTag: (tag: string) => void;

  // Habit Operations
  toggleHabit: (id: string) => void;
  addHabit: (title: string, subtitle: string, icon: string) => void;

  // Timer & Audio
  toggleTimer: (taskId?: string) => void;
  resetTimer: (seconds?: number) => void;
  setSoundSelection: (sound: SoundType) => void;

  // Utilities
  showToast: (message: string) => void;
  resetAllData: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('focus_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [spaces, setSpaces] = useState<Space[]>(() => {
    try {
      const saved = localStorage.getItem('focus_spaces');
      return saved ? JSON.parse(saved) : INITIAL_SPACES;
    } catch {
      return INITIAL_SPACES;
    }
  });

  const [habits, setHabits] = useState<MindfulHabit[]>(() => {
    try {
      const saved = localStorage.getItem('focus_habits');
      return saved ? JSON.parse(saved) : INITIAL_HABITS;
    } catch {
      return INITIAL_HABITS;
    }
  });

  const [tags, setTags] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('focus_tags');
      return saved ? JSON.parse(saved) : ALL_TAGS;
    } catch {
      return ALL_TAGS;
    }
  });

  const [todayFocusMinutes, setTodayFocusMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('focus_minutes');
      return saved ? JSON.parse(saved) : 165; // 2h 45m
    } catch {
      return 165;
    }
  });

  // UI state
  const [currentView, setCurrentView] = useState<ViewType>('today');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [selectedSpaceFilter, setSelectedSpaceFilter] = useState<string | null>(null);
  const [smartViewFilter, setSmartViewFilter] = useState<'all' | 'today' | 'scheduled' | 'archive' | null>(null);

  // Modals
  const [activeTaskDetailsId, setActiveTaskDetailsId] = useState<string | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimer, setToastTimer] = useState<number | null>(null);

  // Timer & Audio
  const [soundSelection, setSoundSelectionState] = useState<SoundType>('rain');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState(25 * 60);
  const [timerTotalDuration, setTimerTotalDuration] = useState(25 * 60);
  const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | null>(null);

  // Stats
  const [weeklyCompletions, setWeeklyCompletions] = useState(INITIAL_WEEKLY_COMPLETIONS);
  const [streakDays, setStreakDays] = useState(INITIAL_STREAK);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('focus_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('focus_spaces', JSON.stringify(spaces));
    } catch (e) {
      console.error(e);
    }
  }, [spaces]);

  useEffect(() => {
    try {
      localStorage.setItem('focus_habits', JSON.stringify(habits));
    } catch (e) {
      console.error(e);
    }
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem('focus_tags', JSON.stringify(tags));
    } catch (e) {
      console.error(e);
    }
  }, [tags]);

  useEffect(() => {
    try {
      localStorage.setItem('focus_minutes', JSON.stringify(todayFocusMinutes));
    } catch (e) {
      console.error(e);
    }
  }, [todayFocusMinutes]);

  // Toast helper
  const showToast = useCallback((msg: string) => {
    if (toastTimer) window.clearTimeout(toastTimer);
    setToastMessage(msg);
    const id = window.setTimeout(() => {
      setToastMessage(null);
    }, 2500);
    setToastTimer(id);
  }, [toastTimer]);

  // Sound selection handler
  const setSoundSelection = useCallback((sound: SoundType) => {
    setSoundSelectionState(sound);
    if (isTimerRunning) {
      soundEngine.playAmbient(sound);
    }
  }, [isTimerRunning]);

  // Timer countdown loop
  useEffect(() => {
    let interval: number | null = null;
    if (isTimerRunning) {
      soundEngine.playAmbient(soundSelection);
      interval = window.setInterval(() => {
        setTimerSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            soundEngine.stopAmbient();
            soundEngine.playZenBowl();
            fireMindfulConfetti();
            const minutesEarned = Math.round(timerTotalDuration / 60);
            setTodayFocusMinutes((m) => m + minutesEarned);
            showToast(`Session completed! +${minutesEarned}m mindful focus logged.`);
            return timerTotalDuration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      soundEngine.stopAmbient();
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isTimerRunning, soundSelection, timerTotalDuration, showToast]);

  const toggleTimer = useCallback((taskId?: string) => {
    if (taskId) {
      setActiveTimerTaskId(taskId);
    }
    setIsTimerRunning((prev) => {
      const next = !prev;
      if (next) {
        showToast('Deep focus session flowing...');
      } else {
        showToast('Session paused. Take a deep breath.');
      }
      return next;
    });
  }, [showToast]);

  const resetTimer = useCallback((seconds: number = 25 * 60) => {
    setIsTimerRunning(false);
    soundEngine.stopAmbient();
    setTimerTotalDuration(seconds);
    setTimerSecondsRemaining(seconds);
    showToast(`Timer reset to ${Math.round(seconds / 60)} minutes.`);
  }, [showToast]);

  // Task Operations
  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            soundEngine.playTaskCompleteChime();
            showToast(`Completed: "${t.title}"`);
            // Increment today's completion count
            setWeeklyCompletions((w) =>
              w.map((day) => (day.isToday ? { ...day, count: day.count + 1 } : day))
            );
          } else {
            showToast(`Restored: "${t.title}"`);
          }
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
          };
        }
        return t;
      })
    );
  }, [showToast]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Added task: "${newTask.title}"`);
  }, [showToast]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (activeTaskDetailsId === id) {
      setActiveTaskDetailsId(null);
    }
    showToast(taskToDelete ? `Deleted "${taskToDelete.title}"` : 'Task deleted');
  }, [tasks, activeTaskDetailsId, showToast]);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((s) => {
            if (s.id === subtaskId) {
              const next = !s.completed;
              if (next) soundEngine.playTaskCompleteChime();
              return { ...s, completed: next };
            }
            return s;
          });
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  }, []);

  const addSubtask = useCallback((taskId: string, title: string, durationTag?: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newSub: Task['subtasks'][0] = {
            id: 'sub-' + Date.now(),
            title,
            completed: false,
            durationTag: durationTag || 'New',
          };
          return { ...t, subtasks: [...t.subtasks, newSub] };
        }
        return t;
      })
    );
    showToast('Subtask added');
  }, [showToast]);

  const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
          };
        }
        return t;
      })
    );
  }, []);

  // Space & Tag Operations
  const addSpace = useCallback((spaceData: Omit<Space, 'id'>) => {
    const newSpace: Space = {
      ...spaceData,
      id: 'space-' + Date.now(),
    };
    setSpaces((prev) => [...prev, newSpace]);
    showToast(`Created space: "${newSpace.name}"`);
  }, [showToast]);

  const addTag = useCallback((tag: string) => {
    const formatted = tag.startsWith('#') ? tag : `#${tag}`;
    if (!tags.includes(formatted)) {
      setTags((prev) => [...prev, formatted]);
      showToast(`Added tag ${formatted}`);
    }
  }, [tags, showToast]);

  // Habit Operations
  const toggleHabit = useCallback((id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const next = !h.completedToday;
          if (next) {
            soundEngine.playTaskCompleteChime();
            showToast(`Habit completed: "${h.title}"`);
          }
          const nextCount = next ? Math.min(h.totalDays, h.completedDays + 1) : Math.max(0, h.completedDays - 1);
          return {
            ...h,
            completedToday: next,
            completedDays: nextCount,
          };
        }
        return h;
      })
    );
  }, [showToast]);

  const addHabit = useCallback((title: string, subtitle: string, icon: string) => {
    const newHabit: MindfulHabit = {
      id: 'habit-' + Date.now(),
      title,
      subtitle,
      icon,
      completedDays: 1,
      totalDays: 7,
      completedToday: true,
    };
    setHabits((prev) => [...prev, newHabit]);
    showToast(`Added mindful habit: "${title}"`);
  }, [showToast]);

  const resetAllData = useCallback(() => {
    setTasks(INITIAL_TASKS);
    setSpaces(INITIAL_SPACES);
    setHabits(INITIAL_HABITS);
    setTags(ALL_TAGS);
    setTodayFocusMinutes(165);
    setWeeklyCompletions(INITIAL_WEEKLY_COMPLETIONS);
    setStreakDays(INITIAL_STREAK);
    showToast('All app data reset to original serene defaults.');
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        tasks,
        spaces,
        habits,
        tags,
        currentView,
        activeFilter,
        searchQuery,
        selectedTagFilter,
        selectedSpaceFilter,
        smartViewFilter,
        activeTaskDetailsId,
        isAddTaskOpen,
        isCreateSpaceOpen,
        isBreathingOpen,
        isNotificationsOpen,
        isProfileOpen,
        toastMessage,
        todayFocusMinutes,
        soundSelection,
        isTimerRunning,
        timerSecondsRemaining,
        timerTotalDuration,
        activeTimerTaskId,
        weeklyCompletions,
        streakDays,

        setCurrentView,
        setActiveFilter,
        setSearchQuery,
        setSelectedTagFilter,
        setSelectedSpaceFilter,
        setSmartViewFilter,

        setActiveTaskDetailsId,
        setIsAddTaskOpen,
        setIsCreateSpaceOpen,
        setIsBreathingOpen,
        setIsNotificationsOpen,
        setIsProfileOpen,

        toggleTask,
        addTask,
        updateTask,
        deleteTask,
        toggleSubtask,
        addSubtask,
        deleteSubtask,

        addSpace,
        addTag,

        toggleHabit,
        addHabit,

        toggleTimer,
        resetTimer,
        setSoundSelection,

        showToast,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { useApp } from './useApp';
