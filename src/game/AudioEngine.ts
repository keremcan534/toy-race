import { AudioBase, SOUNDS } from './AudioBase';

export class AudioEngine extends AudioBase {
  // Sampled Engine
  protected sampleEngineSource: AudioBufferSourceNode | null = null;
  protected sampleEngineGain: GainNode | null = null;
  protected isElectricRunning: boolean = false;
  protected isEngineRunning: boolean = false;
  protected currentGear: number = 1;
  // Bumped by every start/stop so a start that is still loading can't revive a stopped engine.
  private engineGeneration = 0;

  public async startEngine(isElectric: boolean = false) {
    const generation = ++this.engineGeneration;
    await this.resume();
    if (generation !== this.engineGeneration) return;
    if (!this.ctx || !this.masterGain) return;

    this.releaseEngineNodes();
    this.isEngineRunning = true;
    this.isElectricRunning = isElectric;

    // Load and play sample: engine1 for normal, engine2 for electric
    const soundUrl = isElectric ? SOUNDS.electricEngine : SOUNDS.engine;

    this.sampleEngineGain = this.ctx.createGain();
    this.sampleEngineGain.gain.value = isElectric ? 0.28 : 0.35;
    this.sampleEngineGain.connect(this.masterGain);

    const playBuffer = (buffer: AudioBuffer) => {
      if (generation !== this.engineGeneration || !this.ctx || !this.sampleEngineGain) return;
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      src.playbackRate.value = isElectric ? 0.8 : 0.85;
      src.connect(this.sampleEngineGain);
      src.start(0);
      this.sampleEngineSource = src;
    };

    const cached = this.audioBuffers.get(soundUrl);
    if (cached) {
      playBuffer(cached);
    } else {
      this.getAudioBuffer(soundUrl).then(buf => {
        if (buf) playBuffer(buf);
      });
    }
  }

  public stopEngine() {
    this.engineGeneration++;
    this.releaseEngineNodes();
    this.isEngineRunning = false;
  }

  private releaseEngineNodes() {
    if (this.sampleEngineSource) {
      try {
        this.sampleEngineSource.stop();
      } catch (e) {}
      this.sampleEngineSource.disconnect();
      this.sampleEngineSource = null;
    }
    if (this.sampleEngineGain) {
      this.sampleEngineGain.disconnect();
      this.sampleEngineGain = null;
    }
  }

  public updateEngine(rpm: number, isElectric: boolean = false, gear: number = 1) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.sampleEngineSource && this.sampleEngineGain) {
      if (isElectric) {
        // Electric car engine2 modulation
        const targetRate = 0.75 + (rpm * 0.75);
        this.sampleEngineSource.playbackRate.setTargetAtTime(targetRate, now, 0.08);
        const targetVol = 0.22 + (rpm * 0.22);
        this.sampleEngineGain.gain.setTargetAtTime(targetVol, now, 0.08);
      } else {
        // Normal car engine1 modulation
        const baseRate = 0.70 + (rpm * 0.45) + (gear * 0.04);
        this.sampleEngineSource.playbackRate.setTargetAtTime(baseRate, now, 0.05);
        const targetVol = 0.28 + (rpm * 0.25);
        this.sampleEngineGain.gain.setTargetAtTime(targetVol, now, 0.05);
      }
    }
  }
}
