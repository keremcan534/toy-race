import { LoopVoice, SOUNDS } from './AudioBase';
import { AudioEngine } from './AudioEngine';

export class AudioEffects extends AudioEngine {
  // --- Gear Shift Sound (Disabled per user request) ---
  public playGearShift() {
    // Disabled
  }

  // Filtered white noise, looped: the shared building block of squeal, brake and nitro.
  private noiseVoice(type: BiquadFilterType, frequency: number, q: number, fadeIn: number, fadeOut: number) {
    return new LoopVoice((ctx, output) => {
      const noise = this.getNoiseBuffer();
      if (!noise) return null;
      const src = ctx.createBufferSource();
      src.buffer = noise;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = type;
      filter.frequency.value = frequency;
      filter.Q.value = q;
      src.connect(filter);
      filter.connect(output);
      src.onended = () => filter.disconnect();
      return src;
    }, fadeIn, fadeOut);
  }

  private tireSqueal = this.noiseVoice('bandpass', 1200, 2, 0.05, 0.1); // High pitched squeal
  private brake = this.noiseVoice('bandpass', 1000, 1, 0.1, 0.1); // Screech
  private nitro = this.noiseVoice('bandpass', 650, 1.4, 0.04, 0.05);
  private offRoad = new LoopVoice((ctx, output) => {
    // Low frequency rumble
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 40;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 120;
    osc.connect(filter);
    filter.connect(output);
    osc.onended = () => filter.disconnect();
    return osc;
  }, 0.01, 0.1);

  private startLoop(voice: LoopVoice, level: number) {
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    voice.start(this.ctx, this.masterGain, level);
  }

  // --- Tire Squeal Sound ---
  public startTireSqueal(intensity: number = 1.0) {
    if (this.tireSqueal.active && this.ctx) {
      this.tireSqueal.setLevel(this.ctx, 0.3 * intensity);
      return;
    }
    this.startLoop(this.tireSqueal, 0.3 * intensity);
  }

  public stopTireSqueal() {
    this.tireSqueal.stop(this.ctx);
  }

  // --- Brake Sound ---
  public startBrake() {
    if (this.brake.active) return;
    this.startLoop(this.brake, 0.2);
  }

  public stopBrake() {
    this.brake.stop(this.ctx);
  }

  // --- Collision Sound ---
  public playCollision() {
    this.resume();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    // 1. Low Thud (Triangle wave)
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.onended = () => gain.disconnect();
    osc.start(now);
    osc.stop(now + 0.3);

    // 2. Noise Burst (Crunch)
    const noiseBuffer = this.getNoiseBuffer();
    if (!noiseBuffer) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 1000;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.onended = () => noiseGain.disconnect();
    noise.start(now, Math.random() * 1.5, 0.2);
  }

  // --- Crate Open Sound ---
  public playCrateOpen() {
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const master = this.masterGain;
    const now = ctx.currentTime;

    // Arpeggio: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.50];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      const startTime = now + (i * 0.1);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

      osc.connect(gain);
      gain.connect(master);
      osc.onended = () => gain.disconnect();

      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });
  }

  // --- Off-road Rumble ---
  public startOffRoad() {
    if (this.offRoad.active) return;
    // Play impact thud
    this.playCollision();
    this.startLoop(this.offRoad, 0.15);
  }

  public stopOffRoad() {
    this.offRoad.stop(this.ctx);
  }

  // --- Race Finish Sound (upgrade.wav) ---
  public async playRaceFinishSound() {
    this.stopEngine();
    this.stopBrake();
    this.stopOffRoad();
    this.stopTireSqueal();
    await this.playSample(SOUNDS.raceFinish, 0.95);
  }

  // --- Warning Sound (warning.wav) ---
  public async playWarning() {
    await this.playSample(SOUNDS.warning, 0.90);
  }

  // --- Token Buy Sound (tokenbuy2.wav) ---
  public async playTokenBuy() {
    await this.playSample(SOUNDS.tokenBuy, 0.90);
  }

  // --- Instant Token Upgrade Sound (instanttokenbuy.wav) ---
  public async playInstantUpgrade() {
    await this.playSample(SOUNDS.instantUpgrade, 0.92);
  }

  // --- Purchase Sound (storebuy1.wav) ---
  public async playPurchase() {
    await this.playSample(SOUNDS.purchase, 0.90);
  }

  // --- Upgrade in Progress Sound (upgradingcar1.wav) ---
  public async playUpgrade() {
    await this.playSample(SOUNDS.upgrading, 0.92);
  }

  // --- Upgrade Finished / Level Up Sound (upgrade1.wav) ---
  public async playUpgradeComplete() {
    await this.playSample(SOUNDS.upgradeComplete, 0.92);
  }

  // --- UI Click Sound (menu1s.wav) ---
  public async playUIClick() {
    await this.playSample(SOUNDS.menuClick, 0.85);
  }

  // --- Start Race Sound (startrace.wav) ---
  public async playStartRaceSound() {
    await this.playSample(SOUNDS.startRace, 0.95);
  }

  // --- Countdown / Starting Sound (starting.wav) ---
  public async playStartingSound() {
    await this.playSample(SOUNDS.starting, 0.90);
  }

  // --- Win Sound ---
  public playWin() {
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const master = this.masterGain;
    const now = ctx.currentTime;

    // Fanfare: C4, E4, G4, C5 (arpeggio fast)
    const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 523.25];
    const times = [0, 0.1, 0.2, 0.3, 0.4, 0.6];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      const t = now + times[i];

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

      osc.connect(gain);
      gain.connect(master);
      osc.onended = () => gain.disconnect();

      osc.start(t);
      osc.stop(t + 0.5);
    });
  }

  public playConeHit() {
    this.resume();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    // Short thud/pop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.onended = () => gain.disconnect();

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // --- Nitro Boost Sound ---
  public startNitroSound() {
    if (this.nitro.active) return;
    this.startLoop(this.nitro, 0.32);
  }

  public stopNitroSound() {
    this.nitro.stop(this.ctx);
  }

  /** Stops every looping race sound at once (pause, exit, results). */
  public stopLoops() {
    this.stopEngine();
    this.tireSqueal.release();
    this.brake.release();
    this.offRoad.release();
    this.nitro.release();
  }
}
