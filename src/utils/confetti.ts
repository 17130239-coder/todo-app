import confetti from 'canvas-confetti';

export function fireMindfulConfetti() {
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#4b6456', '#cae6d4', '#fcb69d', '#2d3436', '#cde9d7'],
    disableForReducedMotion: true,
    scalar: 0.8,
  });
}
