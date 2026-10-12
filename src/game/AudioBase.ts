import menuClickUrl from '../assets/sounds/menu1s.ogg';
import startingUrl from '../assets/sounds/starting.ogg';
import startRaceUrl from '../assets/sounds/startrace.ogg';
import engineUrl from '../assets/sounds/engine1.ogg';
import electricEngineUrl from '../assets/sounds/engine2.ogg';
import warningUrl from '../assets/sounds/warning.ogg';
import purchaseUrl from '../assets/sounds/storebuy1.ogg';
import tokenBuyUrl from '../assets/sounds/tokenbuy2.ogg';
import instantUpgradeUrl from '../assets/sounds/instanttokenbuy.ogg';
import upgradingUrl from '../assets/sounds/upgradingcar1.ogg';
import upgradeCompleteUrl from '../assets/sounds/upgrade1.ogg';
import raceFinishUrl from '../assets/sounds/upgrade.ogg';

export const SOUNDS = {
  menuClick: menuClickUrl,
  starting: startingUrl,
  startRace: startRaceUrl,
  engine: engineUrl,
  electricEngine: electricEngineUrl,
  warning: warningUrl,
  purchase: purchaseUrl,
  tokenBuy: tokenBuyUrl,
  instantUpgrade: instantUpgradeUrl,
  upgrading: upgradingUrl,
  upgradeComplete: upgradeCompleteUrl,
  raceFinish: raceFinishUrl,
};

const MASTER_VOLUME = 0.75;

export class AudioBase {
  protected ctx: AudioContext | null = null;
  protected masterGain: GainNode | null = null;
  protected audioBuffers: Map<string, AudioBuffer> = new Map();
  protected loadingPromises: Map<string, Promise<AudioBuffer | null>> = new Map();
  private noise: AudioBuffer | null = null;
  private muted = false;
  private preloaded = false;

  constructor() {
    this.setupAutoUnlock();
    this.setupVisibilityHandling();
  }

  private setupAutoUnlock() {
    if (typeof window === 'undefined') return;
    // Only these events count as a user gesture for starting audio (touchstart/pointerdown don't on touch screens).
    const events = ['pointerup', 'touchend', 'click', 'keydown'] as const;
    const unlock = () => {
      this.resume();
      this.preloadSounds();
      if (this.ctx && this.ctx.state === 'running') {
        events.forEach(e => window.removeEventListener(e, unlock));
      }
    };
    events.forEach(e => window.addEventListener(e, unlock, { passive: true }));
  }

  // Android keeps a WebView's audio running when the app goes to the background; silence it.
  private setupVisibilityHandling() {
    if (typeof document === 'undefined') return;
    document.addEventListener('visibilitychange', () => {
      if (!this.ctx) return;
      if (document.hidden) {
        this.ctx.suspend().catch(() => {});
      } else {
        this.ctx.resume().catch(() => {});
      }
    });
  }

  protected init() {
    if (this.ctx) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0 : MASTER_VOLUME;
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('AudioContext init error:', e);
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : MASTER_VOLUME, this.ctx.currentTime, 0.02);
    }
  }

  public preloadSounds() {
    if (this.preloaded) return;
    this.init();
    if (!this.ctx) return;
    this.preloaded = true;
    Object.values(SOUNDS).forEach(url => {
      this.getAudioBuffer(url).catch(() => {});
    });
  }

  public async getAudioBuffer(url: string): Promise<AudioBuffer | null> {
    const cached = this.audioBuffers.get(url);
    if (cached) return cached;
    const pending = this.loadingPromises.get(url);
    if (pending) return pending;

    const promise = (async () => {
      try {
        this.init();
        if (!this.ctx) return null;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const audioBuffer = await this.ctx.decodeAudioData(await res.arrayBuffer());
        this.audioBuffers.set(url, audioBuffer);
        return audioBuffer;
      } catch (e) {
        console.warn(`Could not load audio buffer from ${url}:`, e);
        this.loadingPromises.delete(url); // allow a later retry
        return null;
      }
    })();

    this.loadingPromises.set(url, promise);
    return promise;
  }

  public async resume() {
    if (!this.ctx) this.init();
    if (this.ctx?.state === 'suspended' && !document.hidden) {
      try {
        await this.ctx.resume();
      } catch (e) {
        console.warn('AudioContext resume failed:', e);
      }
    }
  }

  /** Two seconds of white noise, shared by every noise-based effect. */
  protected getNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    if (!this.noise) {
      const size = this.ctx.sampleRate * 2;
      this.noise = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
    }
    return this.noise;
  }

  /**
   * Guaranteed sample playback using Web Audio API buffer node with HTML5 Audio fallback
   */
  public async playSample(url: string, volume: number = 0.85, rate: number = 1.0): Promise<void> {
    await this.resume();

    // 1. Try Web Audio buffer source
    if (this.ctx && this.masterGain && this.ctx.state === 'running') {
      const buffer = this.audioBuffers.get(url) || await this.getAudioBuffer(url);
      if (buffer) {
        try {
          const src = this.ctx.createBufferSource();
          src.buffer = buffer;
          src.playbackRate.value = rate;

          const gain = this.ctx.createGain();
          gain.gain.value = volume;

          src.connect(gain);
          gain.connect(this.masterGain);
          src.onended = () => gain.disconnect();
          src.start(0);
          return;
        } catch (e) {
          console.warn(`Buffer play failed for ${url}, trying Audio fallback:`, e);
        }
      }
    }

    // 2. Fallback to HTML5 Audio element
    if (this.muted || document.hidden) return;
    try {
      const audio = new Audio(url);
      audio.volume = Math.min(1.0, Math.max(0.0, volume));
      audio.playbackRate = rate;
      audio.play().catch(() => {});
    } catch (e) {
      console.warn(`HTML5 Audio fallback failed for ${url}:`, e);
    }
  }
}

/**
 * A looping sound (noise through a filter, or an oscillator) that fades in and out.
 * Calling start() while it is fading out cancels the pending stop instead of starting a
 * second copy, and stop() is a no-op once a stop is scheduled, so per-frame calls are cheap.
 */
export class LoopVoice {
  private gain: GainNode | null = null;
  private source: AudioScheduledSourceNode | null = null;
  private stopTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private build: (ctx: AudioContext, output: AudioNode) => AudioScheduledSourceNode | null,
    private fadeIn = 0.05,
    private fadeOut = 0.1
  ) {}

  get active() {
    return this.gain !== null && this.stopTimer === null;
  }

  start(ctx: AudioContext, destination: AudioNode, level: number) {
    const now = ctx.currentTime;
    if (this.gain) {
      if (this.stopTimer) {
        clearTimeout(this.stopTimer);
        this.stopTimer = null;
      }
      this.gain.gain.cancelScheduledValues(now);
      this.gain.gain.setTargetAtTime(level, now, this.fadeIn);
      return;
    }
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(destination);
    const source = this.build(ctx, gain);
    if (!source) {
      gain.disconnect();
      return;
    }
    source.start();
    gain.gain.setTargetAtTime(level, now, this.fadeIn);
    this.gain = gain;
    this.source = source;
  }

  setLevel(ctx: AudioContext, level: number) {
    if (this.active && this.gain) this.gain.gain.setTargetAtTime(level, ctx.currentTime, this.fadeIn);
  }

  stop(ctx: AudioContext | null) {
    if (!this.gain || this.stopTimer) return;
    if (!ctx) {
      this.release();
      return;
    }
    this.gain.gain.cancelScheduledValues(ctx.currentTime);
    this.gain.gain.setTargetAtTime(0, ctx.currentTime, this.fadeOut);
    this.stopTimer = setTimeout(() => this.release(), this.fadeOut * 5000);
  }

  release() {
    if (this.stopTimer) clearTimeout(this.stopTimer);
    this.stopTimer = null;
    try { this.source?.stop(); } catch {}
    this.source?.disconnect();
    this.gain?.disconnect();
    this.source = null;
    this.gain = null;
  }
}
