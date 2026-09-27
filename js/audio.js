/**
 * Audio Engine for VoltMaster SMK
 * Uses the Web Audio API to synthesize realistic electrical sounds without external files.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.motorOsc = null;
    this.motorGain = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.motorGain) {
      this.motorGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
    return this.muted;
  }

  // Switch Click (Sakelar ON/OFF)
  playSwitch() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // MCB Lever snap (Naik / Turun)
  playMcbToggle(isOn) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(isOn ? 180 : 130, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // MCB Trip (Korsleting / Anjlok mendadak)
  playMcbTrip() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Spark noise
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    noise.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    // Mechanical snap
    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'sawtooth';
    snapOsc.frequency.setValueAtTime(280, now);
    snapOsc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

    snapGain.gain.setValueAtTime(0.8, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    snapOsc.connect(snapGain);
    snapGain.connect(this.ctx.destination);

    noise.start(now);
    snapOsc.start(now);
    noise.stop(now + 0.15);
    snapOsc.stop(now + 0.15);
  }

  // Kontaktor Magnetik berbunyi "KLAK"
  playContactor(isEnergized) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(isEnergized ? 220 : 160, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.09);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Multimeter Continuity Buzzer (Suara BEEP saat sirkuit nyambung)
  playContinuityBeep(start) {
    if (this.muted || !this.initialized) return;
    if (!this.ctx) return;

    if (start) {
      if (this.beepOsc) return;
      this.beepOsc = this.ctx.createOscillator();
      this.beepGain = this.ctx.createGain();

      this.beepOsc.type = 'sine';
      this.beepOsc.frequency.setValueAtTime(2450, this.ctx.currentTime); // Standard DMM buzzer freq

      this.beepGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      this.beepOsc.connect(this.beepGain);
      this.beepGain.connect(this.ctx.destination);

      this.beepOsc.start();
    } else {
      if (this.beepOsc) {
        try {
          this.beepOsc.stop();
          this.beepOsc.disconnect();
        } catch (e) {}
        this.beepOsc = null;
        this.beepGain = null;
      }
    }
  }

  // Knob rotary switch multimeter berputar (klik kecil)
  playKnobClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.015);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.015);
  }

  // Motor 3 Fasa berdengung halus berputar
  setMotorHum(running) {
    if (!this.initialized || this.muted) return;
    if (!this.ctx) return;

    if (running) {
      if (this.motorOsc) return;
      this.motorOsc = this.ctx.createOscillator();
      this.motorSub = this.ctx.createOscillator();
      this.motorGain = this.ctx.createGain();

      this.motorOsc.type = 'sawtooth';
      this.motorOsc.frequency.setValueAtTime(50, this.ctx.currentTime); // 50 Hz industrial mains
      this.motorSub.type = 'sine';
      this.motorSub.frequency.setValueAtTime(100, this.ctx.currentTime); // 2nd harmonic

      this.motorGain.gain.setValueAtTime(0.07, this.ctx.currentTime);

      this.motorOsc.connect(this.motorGain);
      this.motorSub.connect(this.motorGain);
      this.motorGain.connect(this.ctx.destination);

      this.motorOsc.start();
      this.motorSub.start();
    } else {
      if (this.motorOsc) {
        try {
          this.motorGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
          setTimeout(() => {
            if (this.motorOsc) {
              this.motorOsc.stop();
              this.motorSub.stop();
              this.motorOsc.disconnect();
              this.motorSub.disconnect();
              this.motorOsc = null;
              this.motorSub = null;
              this.motorGain = null;
            }
          }, 320);
        } catch (e) {
          this.motorOsc = null;
        }
      }
    }
  }

  // Level Complete / Victory Fanfare
  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.12;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  // Wire connect click
  playConnect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }
}

// Global Sound Instance
window.sound = new SoundEngine();
