/**
 * High quality Web Audio procedural sound effects & relaxing BGM synthesizer,
 * coupled with Web Speech API for authentic English time pronunciation.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmIntervalId: number | null = null;
  private bgmVolume: number = 0.25;
  private sfxVolume: number = 0.6;
  private isMuted: boolean = false;
  private currentStep: number = 0;

  // Speech synthesis settings
  public speechRate: number = 0.85; // slightly slower for junior high English learners
  public speechPitch: number = 1.0;
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initVoices();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
      }
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : this.bgmVolume, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Prioritize high-quality English voices
    const preferredVoices = voices.filter(
      (v) =>
        (v.lang.startsWith('en-US') || v.lang.startsWith('en-GB') || v.lang.startsWith('en')) &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Daniel') ||
          v.name.includes('Karen') ||
          v.name.includes('Aaron'))
    );
    if (preferredVoices.length > 0) {
      this.selectedVoice = preferredVoices[0];
    } else {
      this.selectedVoice = voices.find((v) => v.lang.startsWith('en')) || null;
    }
  }

  public getAvailableEnglishVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    return window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en'));
  }

  public setVoice(voiceURI: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    const found = voices.find((v) => v.voiceURI === voiceURI);
    if (found) this.selectedVoice = found;
  }

  public getSelectedVoiceName(): string {
    return this.selectedVoice?.name || 'Default English';
  }

  /**
   * Speak English text with native accent and customizable speed
   */
  public speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
    }
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // Cancel current speaking
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = options?.rate ?? this.speechRate;
    utterance.pitch = options?.pitch ?? this.speechPitch;

    if (options?.onStart) utterance.onstart = options.onStart;
    if (options?.onEnd) utterance.onend = options.onEnd;
    utterance.onerror = () => {
      if (options?.onEnd) options.onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Procedural Relaxing BGM: Soft marimba / acoustic music box arpeggios
   * Chord Progression: Cmaj7 - Am7 - Fmaj7 - G7 (gentle, encouraging study music)
   */
  public toggleBgm(): boolean {
    this.initContext();
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public startBgm() {
    this.initContext();
    if (this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
    this.isBgmPlaying = true;

    // Tempo: ~85 BPM, step interval = 350ms
    const notesC = [261.63, 329.63, 392.0, 493.88]; // C, E, G, B
    const notesAm = [220.0, 261.63, 329.63, 392.0]; // A, C, E, G
    const notesF = [174.61, 261.63, 329.63, 440.0]; // F, C, E, A
    const notesG = [196.0, 246.94, 293.66, 392.0]; // G, B, D, G

    const chordPattern = [
      ...notesC, 392.0, 329.63, 261.63, 329.63,
      ...notesAm, 329.63, 261.63, 220.0, 261.63,
      ...notesF, 329.63, 261.63, 174.61, 261.63,
      ...notesG, 293.66, 246.94, 196.0, 246.94,
    ];

    const playStep = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
      const freq = chordPattern[this.currentStep % chordPattern.length];
      this.playMarimbaNote(freq, 0.45);

      // Play soft bass every 8 steps
      if (this.currentStep % 8 === 0) {
        const chordIndex = Math.floor(this.currentStep / 8) % 4;
        const bassFreqs = [130.81, 110.0, 87.31, 98.0]; // C3, A2, F2, G2
        this.playSoftBass(bassFreqs[chordIndex], 1.2);
      }

      this.currentStep++;
    };

    playStep();
    this.bgmIntervalId = window.setInterval(playStep, 380);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public setBgmVolume(volume: number) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : this.bgmVolume, this.ctx.currentTime);
    }
  }

  public getBgmVolume(): number {
    return this.bgmVolume;
  }

  public setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
    }
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : this.bgmVolume, this.ctx.currentTime);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  private playMarimbaNote(freq: number, duration: number) {
    if (!this.ctx || !this.bgmGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  private playSoftBass(freq: number, duration: number) {
    if (!this.ctx || !this.bgmGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Sound Effect: Correct answer joyful sparkle chime
   */
  public playCorrectSound() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + i * 0.08);

      const startTime = this.ctx!.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  /**
   * Sound Effect: Friendly try again wobble
   */
  public playWrongSound() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.25);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  /**
   * Sound Effect: Clock hand tick
   */
  public playTick() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Sound Effect: Fanfare for stage cleared
   */
  public playFanfare() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const chords = [
      { freqs: [523.25, 659.25, 783.99], time: 0 },
      { freqs: [587.33, 739.99, 880.0], time: 0.15 },
      { freqs: [659.25, 830.61, 987.77], time: 0.3 },
      { freqs: [783.99, 987.77, 1174.66, 1567.98], time: 0.45, duration: 0.8 },
    ];

    chords.forEach((chord) => {
      chord.freqs.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';

        const start = this.ctx!.currentTime + chord.time;
        const dur = chord.duration || 0.25;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(start);
        osc.stop(start + dur + 0.05);
      });
    });
  }
}

export const soundEngine = new SoundEngine();
