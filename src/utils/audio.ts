// Pet World Web Audio Sound Engine
// Zero external audio files required! High-energy Rock synthesizer, 11 animal voices, Ferrari engine & horns!

class SoundManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  public isMusicMuted: boolean = false;
  public volume: number = 0.5;

  private bgmInterval: any = null;
  private currentTrack: string | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private distortionCurve: Float32Array | null = null;

  constructor() {}

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Create guitar overdrive distortion curve
  private getDistortionCurve(amount = 25): Float32Array {
    if (this.distortionCurve) return this.distortionCurve;
    const k = amount;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    this.distortionCurve = curve;
    return curve;
  }

  // Play a simple frequency synth note
  private playTone(freq: number, type: OscillatorType, duration: number, startGain = 0.3, endGain = 0.001) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(startGain * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, endGain * this.volume), this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  // ROCK DRUM KIT: Punchy Kick Drum
  private playRockKick(time: number) {
    if (this.isMusicMuted || this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, time);
      osc.frequency.exponentialRampToValueAtTime(32, time + 0.12);

      gain.gain.setValueAtTime(0.6 * this.volume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + 0.18);
    } catch (e) {}
  }

  // ROCK DRUM KIT: Snappy Rock Snare
  private playRockSnare(time: number) {
    if (this.isMusicMuted || this.isMuted || !this.ctx) return;
    try {
      // Noise burst for snare snap
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 800;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35 * this.volume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      // Tone snap
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, time);
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.08);
      oscGain.gain.setValueAtTime(0.3 * this.volume, time);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      noise.start(time);
      osc.start(time);
      noise.stop(time + 0.15);
      osc.stop(time + 0.08);
    } catch (e) {}
  }

  // ROCK DRUM KIT: Hi-Hat
  private playRockHiHat(time: number, accent = false) {
    if (this.isMusicMuted || this.isMuted || !this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 6000;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime((accent ? 0.2 : 0.09) * this.volume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(time);
      noise.stop(time + 0.045);
    } catch (e) {}
  }

  // ROCK ELECTRIC GUITAR POWER CHORD
  private playPowerChord(rootFreq: number, duration: number, isDistorted = true) {
    if (this.isMusicMuted || this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Power chord: Root + Perfect Fifth (1.5x) + Octave (2.0x)
      const freqs = [rootFreq, rootFreq * 1.4983, rootFreq * 2];

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.18 * this.volume, now);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      const distortion = this.ctx.createWaveShaper();
      distortion.curve = this.getDistortionCurve(isDistorted ? 30 : 10) as any;
      distortion.oversample = '2x';

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2400;

      freqs.forEach(f => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);
        osc.connect(distortion);
        osc.start(now);
        osc.stop(now + duration);
      });

      distortion.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(this.ctx.destination);
    } catch (e) {}
  }

  // ROCK HEAVY BASS NOTE
  private playRockBass(freq: number, duration: number) {
    if (this.isMusicMuted || this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq / 2, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(0.28 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  // UI & Action Sounds
  public playClick() {
    this.playTone(600, 'sine', 0.08, 0.2);
  }

  public playPop() {
    this.playTone(880, 'triangle', 0.1, 0.3);
  }

  public playCoin() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.08);

    gain.gain.setValueAtTime(0.25 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playHeart() {
    this.playTone(587.33, 'triangle', 0.2, 0.25);
    setTimeout(() => this.playTone(880.0, 'sine', 0.3, 0.3), 80);
  }

  public playBrush() {
    this.playTone(600, 'triangle', 0.08, 0.2);
    setTimeout(() => this.playTone(750, 'sine', 0.1, 0.2), 60);
  }

  public playMunch() {
    this.playTone(350, 'triangle', 0.06, 0.3);
    setTimeout(() => this.playTone(420, 'triangle', 0.06, 0.3), 70);
    setTimeout(() => this.playTone(380, 'sine', 0.08, 0.25), 140);
  }

  public playHorn(type: 'classic' | 'fanfare' | 'melody' | 'turbo_honk' = 'classic') {
    this.playFerrariHorn(type);
  }

  public playWaterSplash() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(700, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1600, this.ctx.currentTime + 0.15);
    filter.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();
    whiteNoise.stop(this.ctx.currentTime + 0.35);
  }

  public playSoapSuds() {
    this.playTone(1200, 'sine', 0.05, 0.15);
    setTimeout(() => this.playTone(1500, 'sine', 0.05, 0.15), 50);
    setTimeout(() => this.playTone(1800, 'triangle', 0.06, 0.2), 100);
  }

  public playBlowDryer() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();
  }

  public playFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      setTimeout(() => this.playPowerChord(n / 2, 0.35), idx * 110);
    });
  }

  // FERRARI ENGINE AUDIO
  public startEngine() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    this.stopEngine();

    try {
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();

      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(65, this.ctx.currentTime); // Low V8 Rumble

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350;

      this.engineGain.gain.setValueAtTime(0.12 * this.volume, this.ctx.currentTime);

      this.engineOsc.connect(filter);
      filter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);

      this.engineOsc.start();
    } catch (e) {}
  }

  public setEngineRPM(speedRatio: number) {
    if (!this.engineOsc || !this.ctx) return;
    const targetFreq = 65 + speedRatio * 220; // 65Hz to 285Hz V8 Rev
    this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.06);
  }

  public stopEngine() {
    if (this.engineOsc) {
      try {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
      } catch (e) {}
      this.engineOsc = null;
    }
    if (this.engineGain) {
      try {
        this.engineGain.disconnect();
      } catch (e) {}
      this.engineGain = null;
    }
  }

  public playNitroBoost() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    this.playPowerChord(220, 0.8, true); // Hard rock guitar screech!

    const bufferSize = this.ctx.sampleRate * 0.7;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3200, this.ctx.currentTime + 0.3);
    filter.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.7);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.7);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();
    whiteNoise.stop(this.ctx.currentTime + 0.7);
  }

  public playFerrariHorn(type: 'classic' | 'fanfare' | 'melody' | 'turbo_honk' = 'classic') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    // Italian Dual-Tone High Pitch Horn
    osc1.frequency.setValueAtTime(440, now); // A4
    osc2.frequency.setValueAtTime(554.37, now); // C#5

    gain.gain.setValueAtTime(0.3 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  }

  // ANIMAL VOICES
  public playPetSound(species: string) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    switch (species) {
      case 'puppy': {
        const bark = (delay: number) => {
          setTimeout(() => {
            if (!this.ctx) return;
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, t);
            osc.frequency.exponentialRampToValueAtTime(650, t + 0.05);
            osc.frequency.exponentialRampToValueAtTime(220, t + 0.15);

            gain.gain.setValueAtTime(0.35 * this.volume, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.16);
          }, delay);
        };
        bark(0);
        bark(160);
        break;
      }
      case 'cat':
      case 'kitten': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(550, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.35);

        gain.gain.setValueAtTime(0.25 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }
      case 'parrot': {
        [1200, 1600, 1400, 1800].forEach((f, idx) => {
          setTimeout(() => this.playTone(f, 'sine', 0.08, 0.2), idx * 60);
        });
        break;
      }
      case 'gecko': {
        this.playTone(1800, 'triangle', 0.04, 0.25);
        setTimeout(() => this.playTone(2100, 'triangle', 0.04, 0.25), 80);
        break;
      }
      case 'ferret': {
        for (let i = 0; i < 4; i++) {
          setTimeout(() => this.playTone(500 + i * 80, 'triangle', 0.05, 0.22), i * 65);
        }
        break;
      }
      case 'axolotl': {
        [450, 680, 520, 800].forEach((f, idx) => {
          setTimeout(() => this.playTone(f, 'sine', 0.09, 0.22), idx * 90);
        });
        break;
      }
      case 'hedgehog': {
        this.playTone(320, 'triangle', 0.06, 0.2);
        setTimeout(() => this.playTone(850, 'sine', 0.1, 0.22), 160);
        break;
      }
      case 'snake': {
        this.playTone(900, 'triangle', 0.25, 0.18);
        break;
      }
      case 'hamster': {
        this.playTone(1500, 'sine', 0.05, 0.22);
        setTimeout(() => this.playTone(1750, 'sine', 0.05, 0.22), 70);
        break;
      }
      case 'guinea_pig': {
        const wheek = (delay: number) => {
          setTimeout(() => {
            if (!this.ctx) return;
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(700, t);
            osc.frequency.exponentialRampToValueAtTime(1600, t + 0.14);

            gain.gain.setValueAtTime(0.3 * this.volume, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.2);
          }, delay);
        };
        wheek(0);
        wheek(200);
        break;
      }
      default:
        this.playTone(500, 'sine', 0.15, 0.2);
    }
  }

  // 🎸 HIGH-ENERGY ROCK & ROLL SOUNDTRACK SYNTHESIZER 🎸
  public startBGM(theme: 'main' | 'driving' | 'shelter' | 'house' = 'main') {
    if (this.currentTrack === theme && this.bgmInterval) return;
    this.stopBGM();
    this.currentTrack = theme;

    if (this.isMusicMuted || this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    let step = 0;

    // Rock Power Chords Progression: E5 -> G5 -> A5 -> D5 / E5 -> D5 -> B5 -> E5
    const rockChords = [
      164.81, 164.81, 196.0, 220.0, 220.0, 196.0, 146.83, 164.81,
      164.81, 164.81, 196.0, 246.94, 220.0, 196.0, 164.81, 164.81
    ];

    // High energy driving tempo
    const tempo = theme === 'driving' ? 145 : 175;

    this.bgmInterval = setInterval(() => {
      if (this.isMusicMuted || this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const beatInBar = step % 8;
      const chord = rockChords[step % rockChords.length];

      // 1. Rock Kick on Beats 1, 3, 5, 7
      if (beatInBar === 0 || beatInBar === 4 || beatInBar === 6) {
        this.playRockKick(now);
      }

      // 2. Heavy Rock Snare on Beats 2 and 6 (Backbeat)
      if (beatInBar === 2 || beatInBar === 6) {
        this.playRockSnare(now);
      }

      // 3. Steady Rock Hi-Hat on every 8th note
      this.playRockHiHat(now, beatInBar === 0);

      // 4. Overdriven Rhythm Guitar Power Chords
      if (beatInBar === 0 || beatInBar === 1 || beatInBar === 3 || beatInBar === 4 || beatInBar === 5) {
        this.playPowerChord(chord, 0.16, true);
        this.playRockBass(chord, 0.18);
      }

      step++;
    }, tempo);
  }

  public stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.currentTrack = null;
  }
}

export const soundManager = new SoundManager();
