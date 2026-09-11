import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const InsightsView: React.FC = () => {
  const {
    todayFocusMinutes,
    weeklyCompletions,
    streakDays,
    habits,
    toggleHabit,
    addHabit,
    isTimerRunning,
    timerSecondsRemaining,
    timerTotalDuration,
    toggleTimer,
    resetTimer,
    soundSelection,
    setSoundSelection,
    showToast,
  } = useApp();

  const [showAddHabitModal, setShowAddHabitModal] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitSubtitle, setNewHabitSubtitle] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('wb_sunny');

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Timer SVG math (r=70 -> circumference = 440)
  const timerCircumference = 440;
  const timerProgressOffset =
    timerTotalDuration > 0
      ? timerCircumference - (timerSecondsRemaining / timerTotalDuration) * timerCircumference
      : 0;

  // Habit consistency calculation
  const totalPossibleHabitDays = habits.reduce((acc, h) => acc + h.totalDays, 0);
  const totalCompletedHabitDays = habits.reduce((acc, h) => acc + h.completedDays, 0);
  const habitConsistencyPercent =
    totalPossibleHabitDays > 0
      ? Math.round((totalCompletedHabitDays / totalPossibleHabitDays) * 100)
      : 0;

  // Max weekly completion for bar height
  const maxWeekly = Math.max(...weeklyCompletions.map((d) => d.count), 10);
  const totalWeeklyTasks = weeklyCompletions.reduce((acc, d) => acc + d.count, 0);

  const hours = Math.floor(todayFocusMinutes / 60);
  const mins = todayFocusMinutes % 60;

  const handleSelectPreset = (minutes: number) => {
    resetTimer(minutes * 60);
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    addHabit(newHabitTitle.trim(), newHabitSubtitle.trim() || 'Mindful practice', newHabitIcon);
    setNewHabitTitle('');
    setNewHabitSubtitle('');
    setShowAddHabitModal(false);
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-margin pb-space-xl space-y-space-lg">
      {/* Top Streak Banner */}
      <section className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col space-y-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-space-sm">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-sm">
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                eco
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md text-on-surface">
                14-Day Mindful Streak
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Gentle momentum, balanced rhythm
              </span>
            </div>
          </div>
          <div className="bg-surface-container-low px-space-sm py-space-xs rounded-full flex items-center space-x-1">
            <span
              className="material-symbols-outlined text-[16px] text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
            <span className="font-label-sm text-label-sm text-secondary font-bold">Lvl 3</span>
          </div>
        </div>

        {/* 7-day Dot Tracker */}
        <div className="bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between">
          {streakDays.map((day, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center space-y-1 cursor-pointer group"
              onClick={() => showToast(`${day.fullName}: ${day.completed ? 'Mindful intention met' : 'Today in progress'}`)}
            >
              <span
                className={`font-label-sm text-label-sm ${
                  day.isCurrentDay ? 'font-bold text-secondary' : 'text-on-surface-variant'
                }`}
              >
                {day.dayLabel}
              </span>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-95 ${
                  day.completed
                    ? 'bg-secondary text-on-secondary'
                    : day.isCurrentDay
                    ? 'bg-secondary-container text-on-secondary-container animate-pulse'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {day.completed ? 'check' : day.isCurrentDay ? 'spa' : 'remove'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Today's Focus Time Highlight Card */}
      <section className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-secondary-container/30 pointer-events-none" />
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Today's Focus Time
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="font-display-lg-mobile text-display-lg-mobile text-primary tracking-tight font-semibold">
                {hours}h {mins}m
              </span>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                +18m vs avg
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
          </div>
        </div>

        <div className="mt-space-md bg-surface-container-low rounded-lg p-space-sm flex items-center space-x-space-sm">
          <span
            className="material-symbols-outlined text-secondary text-[20px] shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            lightbulb
          </span>
          <p className="font-body-sm text-body-sm text-on-surface leading-snug">
            You hit peak focus between <span className="font-semibold text-primary">9:00 AM</span>{' '}
            and <span className="font-semibold text-primary">11:30 AM</span>.
          </p>
        </div>
      </section>

      {/* Weekly Completion Bar Chart */}
      <section className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col space-y-space-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-md text-headline-md text-primary">Tasks Completed</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {totalWeeklyTasks} intentional milestones reached
            </p>
          </div>
          <span className="font-label-sm text-label-sm bg-surface-container px-space-sm py-1 rounded-full text-on-surface-variant font-medium">
            This Week
          </span>
        </div>

        {/* Soft Rounded Bar Chart */}
        <div className="h-36 w-full pt-2 flex items-end justify-between px-1">
          {weeklyCompletions.map((day, idx) => {
            const heightPercent = Math.min(100, Math.round((day.count / maxWeekly) * 100));
            const isToday = day.isToday;

            return (
              <div
                key={idx}
                onClick={() => showToast(`${day.dayName}: ${day.count} milestones completed`)}
                className="flex flex-col items-center space-y-2 flex-1 group cursor-pointer"
              >
                <div className="relative w-6 h-28 bg-surface-container rounded-full flex items-end p-0.5 overflow-hidden">
                  <div
                    className={`w-full rounded-full transition-all duration-700 ease-out ${
                      isToday
                        ? 'bg-secondary'
                        : heightPercent > 80
                        ? 'bg-secondary-fixed-dim'
                        : 'bg-secondary-fixed'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span
                  className={`font-label-sm text-label-sm ${
                    isToday ? 'font-semibold text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  {day.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mindful Habits Completed */}
      <section className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col space-y-space-md">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-primary">Mindful Habits</h3>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm text-secondary font-medium">
              {habitConsistencyPercent}% Consistency
            </span>
            <button
              onClick={() => setShowAddHabitModal(true)}
              className="w-6 h-6 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-primary transition-colors"
              aria-label="Add habit"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
            </button>
          </div>
        </div>

        <div className="space-y-space-sm">
          {habits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className="bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-space-sm min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    habit.completedToday
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{habit.icon}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-body-md text-body-md font-semibold text-primary truncate">
                    {habit.title}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {habit.subtitle}
                  </span>
                </div>
              </div>

              <span
                className={`font-label-sm text-label-sm px-2.5 py-1 rounded-full shrink-0 font-medium ${
                  habit.completedToday
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {habit.completedDays === habit.totalDays
                  ? '100%'
                  : `${habit.completedDays}/${habit.totalDays} days`}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Focus Timer Quick Launch & Dial */}
      <section className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col items-center text-center space-y-space-md">
        <div className="w-full flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-primary">Focus Session</h3>
          {/* Preset Buttons */}
          <div className="flex items-center gap-1 text-on-surface-variant">
            {[15, 25, 45].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`px-2 py-0.5 rounded-full text-label-sm font-medium transition-colors ${
                  timerTotalDuration === preset * 60
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                {preset}m
              </button>
            ))}
          </div>
        </div>

        {/* Circular Dial */}
        <div className="relative w-44 h-44 flex items-center justify-center my-1">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            <circle
              className="text-surface-container-low"
              cx="80"
              cy="80"
              fill="none"
              r="70"
              stroke="currentColor"
              strokeWidth="8"
            />
            <circle
              className="text-secondary transition-all duration-700 ease-out"
              cx="80"
              cy="80"
              fill="none"
              r="70"
              stroke="currentColor"
              strokeDasharray={timerCircumference}
              strokeDashoffset={timerProgressOffset}
              strokeLinecap="round"
              strokeWidth="8"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span
              className="font-display-lg text-display-lg text-primary tracking-tight font-mono"
              id="timer-display"
            >
              {formatTime(timerSecondsRemaining)}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mt-0.5">
              {isTimerRunning ? 'Deep Flow' : 'Mindful Block'}
            </span>
          </div>
        </div>

        {/* Sound Selector Chips */}
        <div className="flex items-center space-x-space-sm w-full justify-center flex-wrap gap-y-1">
          <button
            type="button"
            onClick={() => setSoundSelection(soundSelection === 'rain' ? 'mute' : 'rain')}
            className={`sound-chip px-space-sm py-1.5 rounded-full font-label-md text-label-md flex items-center space-x-1.5 transition-colors cursor-pointer ${
              soundSelection === 'rain'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">water_drop</span>
            <span>Rain &amp; Lo-Fi</span>
          </button>

          <button
            type="button"
            onClick={() => setSoundSelection(soundSelection === 'forest' ? 'mute' : 'forest')}
            className={`sound-chip px-space-sm py-1.5 rounded-full font-label-md text-label-md flex items-center space-x-1.5 transition-colors cursor-pointer ${
              soundSelection === 'forest'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">forest</span>
            <span>Forest Calm</span>
          </button>

          <button
            type="button"
            onClick={() => setSoundSelection(soundSelection === 'zen' ? 'mute' : 'zen')}
            className={`sound-chip px-space-sm py-1.5 rounded-full font-label-md text-label-md flex items-center space-x-1.5 transition-colors cursor-pointer ${
              soundSelection === 'zen'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">spa</span>
            <span>Zen Bell</span>
          </button>
        </div>

        {/* Launch Action */}
        <div className="flex gap-2 w-full">
          <button
            type="button"
            onClick={() => toggleTimer()}
            className={`flex-1 py-3.5 px-space-md rounded-full font-headline-md text-headline-md flex items-center justify-center space-x-2 shadow-sm active:scale-[0.98] transition-all cursor-pointer ${
              isTimerRunning
                ? 'bg-secondary text-on-secondary'
                : 'bg-primary text-on-primary'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isTimerRunning ? 'pause' : 'play_arrow'}
            </span>
            <span>{isTimerRunning ? 'Pause Focus' : 'Start Session'}</span>
          </button>

          {timerSecondsRemaining !== timerTotalDuration && (
            <button
              type="button"
              onClick={() => resetTimer(timerTotalDuration)}
              className="w-12 h-12 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
              aria-label="Reset timer"
            >
              <span className="material-symbols-outlined text-[20px]">replay</span>
            </button>
          )}
        </div>
      </section>

      {/* Gentle Mindful Reflection Card with Image */}
      <section className="w-full rounded-xl bg-surface-container-low p-space-md flex items-center space-x-space-md shadow-xs">
        <img
          className="w-16 h-16 rounded-lg object-cover shrink-0 shadow-sm"
          alt="Tranquil ceramic mug on sunlit pine desk"
          src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=200&q=80"
        />
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-secondary font-bold uppercase">
            Daily Wisdom
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant italic mt-0.5">
            “Progress is made in quiet, daily steps.”
          </p>
        </div>
      </section>

      {/* Modal to Add Habit */}
      {showAddHabitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-margin bg-primary/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-surface-container-lowest p-space-lg rounded-2xl shadow-xl flex flex-col">
            <h3 className="font-headline-md text-headline-md text-primary mb-3">
              Add Mindful Habit
            </h3>
            <form onSubmit={handleCreateHabit} className="space-y-3">
              <div>
                <label className="block font-label-sm text-label-sm text-outline mb-1">
                  Habit Title
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  placeholder="e.g. Afternoon Tea Break"
                  className="w-full bg-surface-container-low p-2.5 rounded-xl border border-surface-container focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-outline mb-1">
                  Intention
                </label>
                <input
                  type="text"
                  value={newHabitSubtitle}
                  onChange={(e) => setNewHabitSubtitle(e.target.value)}
                  placeholder="e.g. Step outside for 10 minutes"
                  className="w-full bg-surface-container-low p-2.5 rounded-xl border border-surface-container focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-outline mb-1">
                  Icon
                </label>
                <div className="flex gap-2">
                  {['wb_sunny', 'self_improvement', 'local_cafe', 'bedtime', 'spa'].map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewHabitIcon(ic)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        newHabitIcon === ic
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{ic}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddHabitModal(false)}
                  className="flex-1 py-2 rounded-full bg-surface-container text-on-surface text-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-full bg-primary text-on-primary text-label-md"
                >
                  Add Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
