export class Speaker {
  private audioCtx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private finish: AudioNode | null = null;
  private oscillator: OscillatorNode | null = null;

  constructor() {
    const AudioContext = window.AudioContext;

    this.audioCtx = new AudioContext();

    // Create a gain, which will allow us to control the volume
    this.gain = this.audioCtx.createGain();
    this.finish = this.audioCtx.destination;

    // Connect the gain to the audio context
    this.gain.connect(this.finish);
  }

  setVolume(value: number) {
    if (!this.gain || !this.audioCtx) return;

    value = Math.min(Math.max(value, 0), 1);

    this.gain.gain.setValueAtTime(value, this.audioCtx.currentTime);
  }

  play(frequency: number) {
    if (!this.gain || !this.audioCtx) return;
    if (this.oscillator) return;

    this.oscillator = this.audioCtx.createOscillator();

    // Set the frequency
    this.oscillator.frequency.setValueAtTime(
      frequency || 440,
      this.audioCtx.currentTime
    );

    // Square wave
    this.oscillator.type = "square";

    // Connect the gain and start the sound
    this.oscillator.connect(this.gain);
    this.oscillator.start();
  }

  stop() {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }
  }
}
