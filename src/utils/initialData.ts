import type { Task, Space, MindfulHabit, DailyCompletion, StreakDay } from '../types';

export const INITIAL_SPACES: Space[] = [
  {
    id: 'product-design',
    name: 'Product & Design',
    icon: 'layers',
    colorClass: 'bg-primary',
    bgClass: 'bg-surface-container',
    textClass: 'text-primary',
    badgeClass: 'bg-surface-container text-on-surface-variant'
  },
  {
    id: 'personal-growth',
    name: 'Personal Growth',
    icon: 'auto_stories',
    colorClass: 'bg-on-tertiary-container',
    bgClass: 'bg-tertiary-fixed/60',
    textClass: 'text-tertiary',
    badgeClass: 'bg-tertiary-fixed/60 text-on-tertiary-fixed'
  },
  {
    id: 'health-mind',
    name: 'Health & Mind',
    icon: 'self_improvement',
    colorClass: 'bg-secondary',
    bgClass: 'bg-secondary-fixed',
    textClass: 'text-secondary',
    badgeClass: 'bg-secondary-container text-on-secondary-container'
  },
  {
    id: 'home-errands',
    name: 'Home & Errands',
    icon: 'cottage',
    colorClass: 'bg-outline',
    bgClass: 'bg-surface-container-high',
    textClass: 'text-outline',
    badgeClass: 'bg-surface-container text-on-surface-variant'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Synthesize client interview insights',
    notes: 'Group feedback into common architecture themes & friction notes for Friday design review.',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: 'Today, 11:30 AM',
    dueTime: '11:30 AM',
    priority: 'focus',
    durationMinutes: 45,
    spaceId: 'product-design',
    categoryIcon: 'psychology',
    categoryLabel: 'Research',
    tags: ['#deepwork'],
    subtasks: [
      { id: 'sub-1', title: 'Extract quotes from transcript audio', completed: true, durationTag: '15m' },
      { id: 'sub-2', title: 'Group friction points into affinity cluster', completed: false, durationTag: '20m' },
      { id: 'sub-3', title: 'Summarize top 3 recommendations', completed: false, durationTag: '10m' },
    ]
  },
  {
    id: 'task-2',
    title: 'Refine mobile layout token specs',
    notes: 'Harmonize warm neutral surface colors with typography pairs in layout shell documentation.',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: 'Today, 1:00 PM',
    dueTime: '1:00 PM',
    priority: 'focus',
    durationMinutes: 30,
    spaceId: 'product-design',
    categoryIcon: 'palette',
    categoryLabel: 'Specs',
    tags: ['#deepwork', '#quickwin'],
    subtasks: [
      { id: 'sub-2-1', title: 'Check WCAG contrast on linen surfaces', completed: true, durationTag: 'Done' },
      { id: 'sub-2-2', title: 'Export JSON token specs to team Figma', completed: false, durationTag: '15m' }
    ]
  },
  {
    id: 'task-3',
    title: 'Send quarterly design digest to team',
    notes: 'Highlight recent user testing wins and preview upcoming sprint design experiments.',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: 'Today, 2:00 PM',
    dueTime: '2:00 PM',
    priority: 'quick',
    durationMinutes: 15,
    spaceId: 'product-design',
    categoryIcon: 'mail',
    categoryLabel: 'Comms',
    tags: ['#quickwin'],
    subtasks: []
  },
  {
    id: 'task-4',
    title: 'Sync with engineering on fluid motion',
    notes: 'Calibrate cubic-bezier transition curves and spring physics for the drawer interactions.',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: 'Today, 3:30 PM',
    dueTime: '3:30 PM',
    priority: 'quick',
    durationMinutes: 25,
    spaceId: 'product-design',
    categoryIcon: 'group',
    categoryLabel: 'Collab',
    tags: ['#deepwork'],
    subtasks: []
  },
  {
    id: 'task-5',
    title: 'Review prototype micro-copy drafts',
    notes: 'Refine mindfulness tooltips and friendly empty-state guidance prompts.',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: 'Today, 4:45 PM',
    dueTime: '4:45 PM',
    priority: 'quick',
    durationMinutes: 10,
    spaceId: 'product-design',
    categoryIcon: 'auto_fix_high',
    categoryLabel: 'Polish',
    tags: ['#quickwin'],
    subtasks: []
  },
  {
    id: 'task-6',
    title: 'Finalize quarterly product strategy deck',
    notes: 'Key focus on mobile conversion data, Q4 user retention cohorts, and team resource allocation.',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: 'Today, 3:00 PM',
    dueTime: '3:00 PM',
    priority: 'focus',
    durationMinutes: 45,
    spaceId: 'product-design',
    categoryIcon: 'spa',
    categoryLabel: 'Strategic Milestone',
    tags: ['#deepwork', '#wellness'],
    subtasks: [
      { id: 'sub-6-1', title: 'Pull analytics export from Mixpanel', completed: true, durationTag: 'Done' },
      { id: 'sub-6-2', title: 'Draft executive summary slide', completed: false, durationTag: '30m' },
      { id: 'sub-6-3', title: 'Align budget forecast with finance team', completed: false, durationTag: '15m' },
      { id: 'sub-6-4', title: 'Review design system token updates', completed: false, durationTag: '20m' }
    ]
  },
  // Completed tasks
  {
    id: 'task-done-1',
    title: 'Daily team morning alignment',
    notes: 'Quick sync on priorities and focus blocks for the day.',
    completed: true,
    completedAt: '9:00 AM',
    createdAt: new Date().toISOString(),
    dueDate: 'Today, 9:00 AM',
    dueTime: '9:00 AM',
    priority: 'quick',
    durationMinutes: 15,
    spaceId: 'product-design',
    categoryIcon: 'diversity_3',
    categoryLabel: 'Ritual',
    tags: ['#quickwin'],
    subtasks: []
  },
  {
    id: 'task-done-2',
    title: 'Plan weekly sprint commitments',
    notes: 'Scoped backlog items and balanced workload across design tracks.',
    completed: true,
    completedAt: '9:30 AM',
    createdAt: new Date().toISOString(),
    dueDate: 'Today, 9:30 AM',
    dueTime: '9:30 AM',
    priority: 'focus',
    durationMinutes: 30,
    spaceId: 'product-design',
    categoryIcon: 'checklist',
    categoryLabel: 'Planning',
    tags: ['#deepwork'],
    subtasks: []
  },
  {
    id: 'task-done-3',
    title: 'Water office monstera plant',
    notes: 'Gentle hydration and misting for office greenery.',
    completed: true,
    completedAt: '10:05 AM',
    createdAt: new Date().toISOString(),
    dueDate: 'Today, 10:05 AM',
    dueTime: '10:05 AM',
    priority: 'quick',
    durationMinutes: 5,
    spaceId: 'health-mind',
    categoryIcon: 'potted_plant',
    categoryLabel: 'Care',
    tags: ['#wellness'],
    subtasks: []
  },
  {
    id: 'task-done-4',
    title: 'Log morning mindfulness reflection',
    notes: 'Three deep breaths and setting a peaceful focus intention.',
    completed: true,
    completedAt: '10:20 AM',
    createdAt: new Date().toISOString(),
    dueDate: 'Today, 10:20 AM',
    dueTime: '10:20 AM',
    priority: 'quick',
    durationMinutes: 10,
    spaceId: 'personal-growth',
    categoryIcon: 'self_improvement',
    categoryLabel: 'Reflection',
    tags: ['#wellness'],
    subtasks: []
  }
];

export const INITIAL_HABITS: MindfulHabit[] = [
  {
    id: 'habit-1',
    title: 'Morning Task Planning',
    subtitle: 'Set intentions with a calm coffee',
    icon: 'wb_sunny',
    completedDays: 7,
    totalDays: 7,
    completedToday: true,
  },
  {
    id: 'habit-2',
    title: 'No afternoon task spillover',
    subtitle: 'Guarding boundary limits',
    icon: 'timelapse',
    completedDays: 5,
    totalDays: 7,
    completedToday: false,
  },
  {
    id: 'habit-3',
    title: 'Evening Shutdown Ritual',
    subtitle: 'Clear desk and close browser tabs',
    icon: 'nightlight',
    completedDays: 6,
    totalDays: 7,
    completedToday: false,
  }
];

export const INITIAL_WEEKLY_COMPLETIONS: DailyCompletion[] = [
  { dayName: 'Mon', count: 6 },
  { dayName: 'Tue', count: 8 },
  { dayName: 'Wed', count: 4, isToday: true },
  { dayName: 'Thu', count: 9 },
  { dayName: 'Fri', count: 10 },
  { dayName: 'Sat', count: 3 },
  { dayName: 'Sun', count: 5 }
];

export const INITIAL_STREAK: StreakDay[] = [
  { dayLabel: 'M', fullName: 'Monday', completed: true },
  { dayLabel: 'T', fullName: 'Tuesday', completed: true },
  { dayLabel: 'W', fullName: 'Wednesday', completed: true, isCurrentDay: true },
  { dayLabel: 'T', fullName: 'Thursday', completed: true },
  { dayLabel: 'F', fullName: 'Friday', completed: true },
  { dayLabel: 'S', fullName: 'Saturday', completed: true },
  { dayLabel: 'S', fullName: 'Sunday', completed: false }
];

export const ALL_TAGS = ['#deepwork', '#quickwin', '#reading', '#finance', '#wellness', '#urgent'];
