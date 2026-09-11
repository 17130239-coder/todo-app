export type Priority = 'focus' | 'quick' | 'normal';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  durationTag?: string;
}

export interface Task {
  id: string;
  title: string;
  notes: string;
  completed: boolean;
  completedAt?: string | null;
  createdAt: string;
  dueDate: string; // e.g., "Today, 3:00 PM", "2:00 PM"
  dueTime?: string;
  priority: Priority;
  durationMinutes: number;
  spaceId: string;
  categoryIcon: string;
  categoryLabel: string;
  tags: string[];
  subtasks: Subtask[];
  bannerImage?: string;
}

export interface Space {
  id: string;
  name: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  textClass: string;
  badgeClass: string;
}

export interface MindfulHabit {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  completedDays: number;
  totalDays: number;
  completedToday: boolean;
}

export interface DailyCompletion {
  dayName: string; // "Mon", "Tue", etc.
  count: number;
  isToday?: boolean;
}

export interface StreakDay {
  dayLabel: string; // "M", "T", "W", "T", "F", "S", "S"
  fullName: string;
  completed: boolean;
  isCurrentDay?: boolean;
}

export type ViewType = 'today' | 'lists' | 'insights';
export type FilterType = 'all' | 'focus' | 'quick' | 'done';
export type SoundType = 'rain' | 'forest' | 'zen' | 'mute';
