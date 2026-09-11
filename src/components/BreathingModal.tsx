import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/audio';

type Phase = 'Inhale' | 'Hold' | 'Exhale';

export const BreathingModal: React.FC = () => {
  const { isBreathingOpen, setIsBreathingOpen } = useApp();
  const [phase, setPhase] = useState<Phase>('Inhale');
  const [countdown, setCountdown] = useState<number>(4);
  const [cycle, setCycle] = useState<number>(1);

  const handleClose = () => {
    setPhase('Inhale');
    setCountdown(4);
    setCycle(1);
    setIsBreathingOpen(false);
  };

  useEffect(() => {
    if (!isBreathingOpen) return;

    soundEngine.playZenBowl();

    const interval = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (phase === 'Inhale') {
            setPhase('Hold');
            return 7;
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            return 8;
          } else {
            setPhase('Inhale');
            setCycle((c) => c + 1);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingOpen, phase]);

  if (!isBreathingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-margin bg-primary/40 backdrop-blur-md transition-all animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-2xl bg-surface-container-lowest p-space-lg shadow-xl flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Title & Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container mb-3">
          <span className="material-symbols-outlined text-[15px] text-secondary">spa</span>
          <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Mindful Pause</span>
        </div>

        <h3 className="font-headline-lg text-headline-lg text-primary">Box Breathing</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 mb-6">
          Cycle {cycle} • Deep calm restores mental bandwidth
        </p>

        {/* Dynamic Breathing Bubble */}
        <div className="relative w-48 h-48 flex items-center justify-center my-4">
          {/* Animated Glow Circle */}
          <div
            className={`absolute rounded-full transition-all duration-[4000ms] ease-in-out ${
              phase === 'Inhale'
                ? 'w-44 h-44 bg-secondary-fixed/50 scale-110 shadow-lg'
                : phase === 'Hold'
                ? 'w-44 h-44 bg-secondary-container scale-105'
                : 'w-28 h-28 bg-secondary-container/40 scale-90'
            }`}
          />

          {/* Inner Circle with Phase Text */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="font-headline-md text-headline-md text-primary font-semibold tracking-wide">
              {phase}
            </span>
            <span className="font-display-lg text-display-lg text-secondary mt-1 font-mono">
              {countdown}s
            </span>
          </div>
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant italic mt-3 mb-6">
          {phase === 'Inhale' && 'Slowly breathe in calmness and clarity.'}
          {phase === 'Hold' && 'Hold gently with relaxed shoulders.'}
          {phase === 'Exhale' && 'Softly release all tension and hurry.'}
        </p>

        {/* Finish button */}
        <button
          onClick={handleClose}
          className="w-full py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md active:scale-98 transition-transform shadow-sm"
        >
          Return Refreshed
        </button>
      </div>
    </div>
  );
};
