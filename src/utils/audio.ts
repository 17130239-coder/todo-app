// Web Audio API based ambient sound generator for mindful deep work

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private currentType: string = 'mute';
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private timer: number | null = null;

  public getCurrentType() {
    return this.currentType;
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Create smooth pink/brown noise buffer for natural rain/wind textures
  private createNoiseBuffer(duration = 5): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext missing');
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown/pink filter approximation
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain compensation
    }
    return buffer;
  }

  public playAmbient(type: 'rain' | 'forest' | 'mute' | 'zen') {
    this.stopAmbient();
    this.currentType = type;

    if (type === 'mute') return;

    this.initContext();
    if (!this.ctx) return;

    if (type === 'zen') {
      this.playZenBowl();
      return;
    }

    try {
      const noiseBuffer = this.createNoiseBuffer(6);
      const source = this.ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 1.5);

      if (type === 'rain') {
        // Rain filtering: lowpass + resonant mid for gentle rain drops
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);

        const highpass = this.ctx.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.setValueAtTime(120, this.ctx.currentTime);

        source.connect(highpass);
        highpass.connect(filter);
        filter.connect(masterGain);
      } else if (type === 'forest') {
        // Forest wind: dynamic filter modulation
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450, this.ctx.currentTime);
        filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

        source.connect(filter);
        filter.connect(masterGain);

        // Slow wind swell modulation
        const lfo = this.ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
      }

      masterGain.connect(this.ctx.destination);
      source.start();

      this.noiseNode = source;
      this.gainNode = masterGain;
    } catch (e) {
      console.warn('Ambient audio could not be initialized:', e);
    }
  }

  public stopAmbient() {
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          if (this.noiseNode && 'stop' in this.noiseNode) {
            (this.noiseNode as AudioBufferSourceNode).stop();
          }
          this.noiseNode = null;
          this.gainNode = null;
        }, 500);
      } catch {
        this.noiseNode = null;
        this.gainNode = null;
      }
    }
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    this.currentType = 'mute';
  }

  // Play peaceful meditation bowl chime
  public playZenBowl() {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Fundamental freq and soft harmonics
      const freqs = [432, 864, 1296];
      const gains = [0.25, 0.08, 0.03];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(gains[idx], now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 4.0);
      });
    } catch (e) {
      console.warn('Zen bowl audio error:', e);
    }
  }

  // Soft gentle micro-chime for task completion
  public playTaskCompleteChime() {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + i * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.75);
      });
    } catch (e) {
      console.warn('Task chime audio error:', e);
    }
  }
}

export const soundEngine = new AmbientAudioEngine();
