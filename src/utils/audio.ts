// Pet World Web Audio Sound Engine
// Zero external audio files required! Clean, responsive, and works flawlessly on iPad/iOS and desktop browsers.

class SoundManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  public isMusicMuted: boolean = false;
  public volume: number = 0.5;

  private bgmInterval: any = null;
  private currentTrack: string | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

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
    } catch (e) {
      // Audio not permitted yet
    }
  }

  // UI Sounds
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
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.25 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playHeart() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5

    osc2.frequency.setValueAtTime(659.25, now); // E5
    osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6

    gain.gain.setValueAtTime(0.2 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  }

  public playFanfare() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, High C
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.25, 0.35);
      }, idx * 100);
    });
  }

  public playMunch() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playTone(280 + Math.random() * 80, 'sawtooth', 0.07, 0.2);
      }, i * 90);
    }
  }

  public playWaterSplash() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Low frequency bubble bloop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.25);

    gain.gain.setValueAtTime(0.3 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playBrush() {
    if (this.isMuted) return;
    this.playTone(400, 'triangle', 0.09, 0.15);
  }

  // Ferrari Sounds
  public playHorn(soundType: 'classic' | 'fanfare' | 'melody' | 'turbo_honk' = 'classic') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (soundType === 'classic' || soundType === 'turbo_honk') {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      const f1 = soundType === 'turbo_honk' ? 520 : 440;
      const f2 = soundType === 'turbo_honk' ? 650 : 554.37;

      osc1.frequency.setValueAtTime(f1, now);
      osc2.frequency.setValueAtTime(f2, now);

      gain.gain.setValueAtTime(0.35 * this.volume, now);
      gain.gain.setValueAtTime(0.35 * this.volume, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } else if (soundType === 'fanfare') {
      const fNotes = [440, 554, 659, 880];
      fNotes.forEach((f, idx) => {
        setTimeout(() => this.playTone(f, 'sawtooth', 0.12, 0.3), idx * 80);
      });
    } else {
      const mNotes = [523, 659, 783, 659, 1046];
      mNotes.forEach((f, idx) => {
        setTimeout(() => this.playTone(f, 'triangle', 0.1, 0.25), idx * 70);
      });
    }
  }

  public playNitroBoost() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.3);

    gain.gain.setValueAtTime(0.4 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  public playDrift() {
    if (this.isMuted) return;
    this.playTone(350 + Math.random() * 50, 'sawtooth', 0.15, 0.25);
  }

  // Pet Vocalizations for all 11 animals!
  public playPetSound(species: string) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    switch (species) {
      case 'puppy': {
        // High energetic puppy bark
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.05);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.15);

        gain.gain.setValueAtTime(0.3 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);

        // Second little yip
        setTimeout(() => {
          this.playTone(750, 'triangle', 0.12, 0.25);
        }, 180);
        break;
      }
      case 'kitten': {
        // Ultra cute squeaky mew
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(1300, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.28);

        gain.gain.setValueAtTime(0.25 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
      case 'cat': {
        // Gentle purr & meow
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
        // Melodic chirps & squawk
        const freqs = [1200, 1600, 1400, 1800];
        freqs.forEach((f, idx) => {
          setTimeout(() => this.playTone(f, 'sine', 0.08, 0.2), idx * 60);
        });
        break;
      }
      case 'gecko': {
        // Cute gecko click chirps
        this.playTone(1800, 'triangle', 0.04, 0.25);
        setTimeout(() => this.playTone(2100, 'triangle', 0.04, 0.25), 80);
        setTimeout(() => this.playTone(1900, 'triangle', 0.04, 0.2), 160);
        break;
      }
      case 'ferret': {
        // Playful dook chuckled squeaks
        for (let i = 0; i < 4; i++) {
          setTimeout(() => this.playTone(500 + i * 80, 'triangle', 0.05, 0.22), i * 65);
        }
        break;
      }
      case 'axolotl': {
        // Gentle underwater water bloops / smiling bubbles
        const bloops = [450, 680, 520, 800];
        bloops.forEach((f, idx) => {
          setTimeout(() => {
            const o = this.ctx!.createOscillator();
            const g = this.ctx!.createGain();
            o.type = 'sine';
            o.frequency.setValueAtTime(f * 0.8, this.ctx!.currentTime);
            o.frequency.exponentialRampToValueAtTime(f * 1.3, this.ctx!.currentTime + 0.08);
            g.gain.setValueAtTime(0.25 * this.volume, this.ctx!.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.1);
            o.connect(g);
            g.connect(this.ctx!.destination);
            o.start();
            o.stop(this.ctx!.currentTime + 0.1);
          }, idx * 90);
        });
        break;
      }
      case 'hedgehog': {
        // Snuffle snuffle squeak
        this.playTone(320, 'triangle', 0.06, 0.2);
        setTimeout(() => this.playTone(340, 'triangle', 0.06, 0.2), 80);
        setTimeout(() => this.playTone(850, 'sine', 0.1, 0.22), 180);
        break;
      }
      case 'snake': {
        // Friendly gentle soft hiss & cute rattle
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.2);

        gain.gain.setValueAtTime(0.12 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }
      case 'hamster': {
        // Tiny rapid squeaks
        this.playTone(1500, 'sine', 0.05, 0.22);
        setTimeout(() => this.playTone(1750, 'sine', 0.05, 0.22), 70);
        setTimeout(() => this.playTone(1600, 'sine', 0.06, 0.2), 140);
        break;
      }
      case 'guinea_pig': {
        // Classic "WHEEK! WHEEK!" loud happy whistle
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

  // Continuous Cheerful Background Music Generator
  public startBGM(theme: 'main' | 'driving' | 'shelter' | 'house' = 'main') {
    if (this.currentTrack === theme && this.bgmInterval) return;
    this.stopBGM();
    this.currentTrack = theme;

    if (this.isMusicMuted || this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    let step = 0;
    // Scales based on theme
    const mainMelody = [523.25, 659.25, 783.99, 1046.50, 783.99, 659.25, 880.00, 783.99]; // C E G C G E A G
    const drivingMelody = [440.00, 523.25, 659.25, 880.00, 659.25, 783.99, 987.77, 1046.50]; // Upbeat fast
    const cozyMelody = [392.00, 493.88, 587.33, 659.25, 587.33, 493.88, 523.25, 392.00]; // Warm calm

    const melody = theme === 'driving' ? drivingMelody : theme === 'house' ? cozyMelody : mainMelody;
    const tempo = theme === 'driving' ? 170 : 260;

    this.bgmInterval = setInterval(() => {
      if (this.isMusicMuted || this.isMuted) return;
      const note = melody[step % melody.length];
      const isDownbeat = step % 4 === 0;

      // Play soft melodic chime
      this.playTone(note, 'sine', 0.18, isDownbeat ? 0.08 : 0.04);

      // Play soft bass note on downbeat
      if (isDownbeat) {
        this.playTone(note / 4, 'triangle', 0.3, 0.09);
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
