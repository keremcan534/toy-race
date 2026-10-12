
import { AudioEffects } from './AudioEffects';

class AudioManager extends AudioEffects {
  constructor() {
    super();
    // Lazy init
  }

  public stopAll() {
    this.stopLoops();
  }
}

export const audioManager = new AudioManager();
