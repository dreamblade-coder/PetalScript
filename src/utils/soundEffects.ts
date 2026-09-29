import { AmbientMusicTrack } from '../types/bouquet';

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private currentMusicTrack: AmbientMusicTrack = 'none';
  private musicIntervalId: any = null;
  private musicGainNode: GainNode | null = null;
  private rainNode: AudioNode | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Gentle wind chime / flower pluck
  public playBloomChime() {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.7);
    });
  }

  // Wax seal crack & envelope reveal
  public playUnwrapSound() {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Harmonic sparkle chord
    const chord = [392.0, 493.88, 587.33, 783.99, 987.77]; // G4, B4, D5, G5, B5
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);

      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.06);
      gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + i * 0.06 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.06 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.06);
      osc.stop(ctx.currentTime + i * 0.06 + 1.0);
    });
  }

  // Realistic Wax Seal Breaking / Cracking sound
  public playWaxSealCrack() {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // 1. Snappy textured crack
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(480, t);
    osc1.frequency.exponentialRampToValueAtTime(90, t + 0.07);
    gain1.gain.setValueAtTime(0.2, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.09);

    // 2. Resonant parchment flutter
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(260, t + 0.04);
    osc2.frequency.exponentialRampToValueAtTime(140, t + 0.18);
    gain2.gain.setValueAtTime(0.12, t + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t + 0.04);
    osc2.stop(t + 0.22);

    // 3. Delicate melodic shimmer
    this.playUnwrapSound();
  }

  // Cute pop when sticking or clicking a sticker
  public playStickerPop() {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(780, t + 0.08);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  // Soft click / ribbon untie
  public playSoftClick() {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.09);
  }

  // ==========================================
  // AMBIENT MUSIC ENGINE (Web Audio Synthesis)
  // ==========================================
  public startAmbientMusic(track: AmbientMusicTrack) {
    if (this.currentMusicTrack === track && this.musicIntervalId) return;
    this.stopAmbientMusic();

    if (track === 'none' || !this.enabled) {
      this.currentMusicTrack = track;
      return;
    }

    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.currentMusicTrack = track;
    this.musicGainNode = ctx.createGain();
    this.musicGainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    this.musicGainNode.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 1.2);
    this.musicGainNode.connect(ctx.destination);

    let step = 0;

    // Piano track chords: Fmaj7 -> G -> Em7 -> Am7
    const pianoPatterns = [
      [349.23, 440.0, 523.25, 659.25], // F4, A4, C5, E5
      [392.0, 493.88, 587.33, 783.99], // G4, B4, D5, G5
      [329.63, 392.0, 493.88, 587.33], // E4, G4, B4, D5
      [440.0, 523.25, 659.25, 880.0],  // A4, C5, E5, A5
    ];

    // Guitar & rain: warm acoustic nylon arpeggio + gentle breeze
    const guitarPatterns = [
      [261.63, 329.63, 392.0, 523.25], // C4, E4, G4, C5
      [220.0, 261.63, 329.63, 440.0],  // A3, C4, E4, A4
      [174.61, 261.63, 349.23, 440.0], // F3, C4, F4, A4
      [196.0, 246.94, 293.66, 392.0],  // G3, B3, D4, G4
    ];

    // Garden breeze: pentatonic chime arpeggios
    const breezeNotes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

    // Music box / Lofi: sweet nostalgic high bells
    const musicBoxNotes = [659.25, 783.99, 880.0, 987.77, 1046.5, 1174.66, 1318.51];

    const playNote = (freq: number, duration = 1.6, type: OscillatorType = 'triangle', detune = 0) => {
      if (!ctx || !this.musicGainNode) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (detune) osc.detune.setValueAtTime(detune, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.musicGainNode);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration + 0.1);
    };

    const intervalMs = track === 'lofi-musicbox' ? 520 : track === 'garden-breeze' ? 680 : 800;

    const tick = () => {
      if (!this.enabled || this.currentMusicTrack === 'none') return;

      if (track === 'piano') {
        const chordIdx = Math.floor(step / 4) % pianoPatterns.length;
        const noteIdx = step % 4;
        const freq = pianoPatterns[chordIdx][noteIdx];
        playNote(freq, 2.2, 'triangle', 2);
        if (noteIdx === 0) {
          playNote(freq / 2, 2.8, 'sine'); // Bass note
        }
      } else if (track === 'guitar-rain') {
        const chordIdx = Math.floor(step / 4) % guitarPatterns.length;
        const noteIdx = step % 4;
        const freq = guitarPatterns[chordIdx][noteIdx];
        playNote(freq, 1.8, 'triangle', -3);
        if (noteIdx === 0) {
          playNote(freq / 2, 2.5, 'sine');
        }
      } else if (track === 'garden-breeze') {
        const freq = breezeNotes[(step * 2 + (step % 3)) % breezeNotes.length];
        playNote(freq, 2.6, 'sine', (step % 2) * 4);
      } else if (track === 'lofi-musicbox') {
        const melody = [0, 2, 4, 3, 2, 5, 4, 1, 0, 3, 2, 4];
        const idx = melody[step % melody.length];
        const freq = musicBoxNotes[idx % musicBoxNotes.length];
        playNote(freq, 1.4, 'sine');
      }

      step++;
    };

    tick();
    this.musicIntervalId = setInterval(tick, intervalMs);
  }

  public stopAmbientMusic() {
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    if (this.musicGainNode && this.ctx) {
      try {
        this.musicGainNode.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
      } catch (e) {}
      this.musicGainNode = null;
    }
    this.currentMusicTrack = 'none';
  }

  public getCurrentTrack(): AmbientMusicTrack {
    return this.currentMusicTrack;
  }
}

export const soundManager = new SoundSynthesizer();
