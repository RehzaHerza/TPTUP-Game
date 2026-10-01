/**
 * Virtual Multimeter and Tespen Tool Engine
 * Provides realistic electrical measurement with flexible probe cables,
 * rotating selector dial, digital LCD display, continuity buzzer, and live phase detector.
 */

class MultimeterTool {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.mode = 'ACV_750'; // 'OFF' | 'ACV_750' | 'ACV_200' | 'DCV_1000' | 'DCV_20' | 'OHM_CONT'
    
    // Probe positions (draggable needle probes)
    this.probeRed = { x: 720, y: 320, attachedPin: null, isDragging: false };
    this.probeBlack = { x: 770, y: 320, attachedPin: null, isDragging: false };

    // Tespen tool
    this.isTespenActive = true;
    this.tespenPos = { x: 820, y: 320, attachedPin: null, isDragging: false };

    this.beeping = false;
    this.lastValue = '0.0';
    this.unit = 'V AC';

    this.initDOM();
  }

  initDOM() {
    let dmmPanel = document.getElementById('multimeter-hud');
    if (!dmmPanel) {
      dmmPanel = document.createElement('div');
      dmmPanel.id = 'multimeter-hud';
      dmmPanel.className = 'multimeter-panel';
      document.body.appendChild(dmmPanel);
    }

    dmmPanel.innerHTML = `
      <div class="dmm-header">
        <span class="dmm-brand">⚡ VOLTCRAFT DMM-500</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="dmm-cat">CAT III 600V</span>
          <button class="dmm-min-btn" onclick="app.multimeter.toggleMinimize()" title="Perkecil/Perbesar Tampilan Multimeter">─</button>
        </div>
      </div>

      <!-- High-Contrast Digital LCD Screen -->
      <div class="dmm-screen" id="dmm-screen">
        <div class="dmm-hold-indicator" id="dmm-mode-ind">AUTO</div>
        <span class="dmm-value" id="dmm-value">0.0</span>
        <span class="dmm-unit" id="dmm-unit">V AC</span>
      </div>

      <!-- Rotary Dial Knob with Angle Markers -->
      <div class="dmm-knob-container">
        <div class="dmm-knob-label">SELEKTOR SKALA:</div>
        <div class="dmm-knob-wrapper">
          <div class="dmm-dial-wheel" id="dmm-dial-wheel">
            <div class="dmm-dial-notch"></div>
          </div>
        </div>
        <select id="dmm-selector" class="dmm-select" onchange="app.multimeter.setMode(this.value)">
          <option value="ACV_750" selected>~ 750 V AC (Tegangan Jala-jala/PLN)</option>
          <option value="ACV_200">~ 200 V AC</option>
          <option value="DCV_1000">⎓ 1000 V DC</option>
          <option value="DCV_20">⎓ 20 V DC (Baterai & Aki)</option>
          <option value="OHM_CONT">🔊 Ω Kontinuitas / Buzzer Kawat</option>
          <option value="OFF">OFF (Matikan Multimeter)</option>
        </select>
      </div>

      <!-- Probe Target Indicators -->
      <div class="dmm-probes-info">
        <div class="probe-tag probe-tag-red">
          <span class="probe-dot red"></span> Probe (+) : <strong id="probe-red-target">Bebas</strong>
        </div>
        <div class="probe-tag probe-tag-black">
          <span class="probe-dot black"></span> Probe (-) : <strong id="probe-black-target">Bebas</strong>
        </div>
      </div>

      <div class="dmm-footer">
        <button class="btn btn-sm btn-outline" onclick="app.multimeter.resetProbes()" title="Kembalikan kedua probe ke meja ukur">
          📍 Reset Probe
        </button>
      </div>
    `;

    this.updateDialAngle();
    this.updateDisplay();
  }

  setMode(newMode) {
    this.mode = newMode;
    this.updateDialAngle();
    if (window.sound) window.sound.playKnobClick();
    this.evaluate();
  }

  updateDialAngle() {
    const dial = document.getElementById('dmm-dial-wheel');
    if (!dial) return;
    const angles = {
      'OFF': 0,
      'ACV_750': 45,
      'ACV_200': 85,
      'DCV_1000': 140,
      'DCV_20': 180,
      'OHM_CONT': 240
    };
    const deg = angles[this.mode] !== undefined ? angles[this.mode] : 45;
    dial.style.transform = `rotate(${deg}deg)`;
  }

  toggleMinimize() {
    const dmm = document.getElementById('multimeter-hud');
    if (dmm) dmm.classList.toggle('minimized');
  }

  resetProbes() {
    this.probeRed = { x: 720, y: 320, attachedPin: null, isDragging: false };
    this.probeBlack = { x: 770, y: 320, attachedPin: null, isDragging: false };
    this.tespenPos = { x: 820, y: 320, attachedPin: null, isDragging: false };
    this.evaluate();
    if (window.app) window.app.render();
  }

  evaluate() {
    const screenVal = document.getElementById('dmm-value');
    const screenUnit = document.getElementById('dmm-unit');
    const redTarget = document.getElementById('probe-red-target');
    const blackTarget = document.getElementById('probe-black-target');

    if (redTarget) redTarget.innerText = this.probeRed.attachedPin ? this.formatPinName(this.probeRed.attachedPin) : 'Bebas';
    if (blackTarget) blackTarget.innerText = this.probeBlack.attachedPin ? this.formatPinName(this.probeBlack.attachedPin) : 'Bebas';

    if (!window.circuitEngine || this.mode === 'OFF') {
      if (screenVal) screenVal.innerText = '';
      if (screenUnit) screenUnit.innerText = 'OFF';
      this.stopBeep();
      return;
    }

    const pinA = this.probeRed.attachedPin;
    const pinB = this.probeBlack.attachedPin;

    if (!pinA || !pinB) {
      if (this.mode === 'OHM_CONT') {
        if (screenVal) screenVal.innerText = 'O.L';
        if (screenUnit) screenUnit.innerText = 'MΩ';
      } else {
        if (screenVal) screenVal.innerText = '0.0';
        if (screenUnit) screenUnit.innerText = this.getUnitForMode();
      }
      this.stopBeep();
      return;
    }

    if (this.mode === 'ACV_750' || this.mode === 'ACV_200') {
      this.stopBeep();
      const meas = window.circuitEngine.measureVoltage(pinA, pinB);
      if (meas.type === 'AC') {
        if (this.mode === 'ACV_200' && meas.v > 200) {
          if (screenVal) screenVal.innerText = 'O.L';
          if (screenUnit) screenUnit.innerText = 'V AC';
        } else {
          if (screenVal) screenVal.innerText = meas.v.toFixed(1);
          if (screenUnit) screenUnit.innerText = 'V AC';
        }
      } else {
        if (screenVal) screenVal.innerText = '0.0';
        if (screenUnit) screenUnit.innerText = 'V AC';
      }
    } else if (this.mode === 'DCV_1000' || this.mode === 'DCV_20') {
      this.stopBeep();
      const meas = window.circuitEngine.measureVoltage(pinA, pinB);
      if (meas.type === 'DC') {
        if (this.mode === 'DCV_20' && Math.abs(meas.v) > 20) {
          if (screenVal) screenVal.innerText = 'O.L';
          if (screenUnit) screenUnit.innerText = 'V DC';
        } else {
          if (screenVal) screenVal.innerText = meas.v.toFixed(2);
          if (screenUnit) screenUnit.innerText = 'V DC';
        }
      } else {
        if (screenVal) screenVal.innerText = '0.00';
        if (screenUnit) screenUnit.innerText = 'V DC';
      }
    } else if (this.mode === 'OHM_CONT') {
      const cont = window.circuitEngine.measureContinuity(pinA, pinB);
      if (cont.connected) {
        if (cont.resistance <= 35) {
          if (screenVal) screenVal.innerText = cont.resistance.toFixed(2);
          if (screenUnit) screenUnit.innerText = 'Ω (🔊)';
          this.startBeep();
        } else if (cont.resistance < 1000) {
          if (screenVal) screenVal.innerText = cont.resistance.toFixed(1);
          if (screenUnit) screenUnit.innerText = 'Ω';
          this.stopBeep();
        } else {
          if (screenVal) screenVal.innerText = (cont.resistance / 1000).toFixed(2);
          if (screenUnit) screenUnit.innerText = 'kΩ';
          this.stopBeep();
        }
      } else {
        if (screenVal) screenVal.innerText = 'O.L';
        if (screenUnit) screenUnit.innerText = 'MΩ';
        this.stopBeep();
      }
    }
  }

  formatPinName(pinId) {
    if (!pinId) return '';
    const parts = pinId.split('_');
    return parts.slice(parts.length - 2).join(' ').toUpperCase();
  }

  getUnitForMode() {
    switch (this.mode) {
      case 'ACV_750':
      case 'ACV_200': return 'V AC';
      case 'DCV_1000':
      case 'DCV_20': return 'V DC';
      case 'OHM_CONT': return 'Ω';
      default: return '';
    }
  }

  startBeep() {
    if (!this.beeping) {
      this.beeping = true;
      if (window.sound) window.sound.playContinuityBeep(true);
    }
  }

  stopBeep() {
    if (this.beeping) {
      this.beeping = false;
      if (window.sound) window.sound.playContinuityBeep(false);
    }
  }

  updateDisplay() {
    this.evaluate();
  }

  // Renders the realistic probes along with flexible cables connecting to bottom-right HUD
  renderProbesSVG() {
    let svg = '';

    // Fixed multimeter jack coordinates relative to workbench container
    const dmmJackRed = { x: 740, y: 560 };
    const dmmJackBlack = { x: 770, y: 560 };

    const prX = this.probeRed.x;
    const prY = this.probeRed.y;
    const pbX = this.probeBlack.x;
    const pbY = this.probeBlack.y;

    // Flexible cable for RED PROBE
    const cpRedX = (prX + dmmJackRed.x) / 2;
    const cpRedY = Math.max(prY, dmmJackRed.y) + 40;
    const cableRedPath = `M ${dmmJackRed.x} ${dmmJackRed.y} Q ${cpRedX} ${cpRedY} ${prX} ${prY - 70}`;
    svg += `
      <path d="${cableRedPath}" fill="none" stroke="#000" stroke-width="6" opacity="0.3"/>
      <path d="${cableRedPath}" fill="none" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>
    `;

    // Flexible cable for BLACK PROBE
    const cpBlackX = (pbX + dmmJackBlack.x) / 2;
    const cpBlackY = Math.max(pbY, dmmJackBlack.y) + 50;
    const cableBlackPath = `M ${dmmJackBlack.x} ${dmmJackBlack.y} Q ${cpBlackX} ${cpBlackY} ${pbX} ${pbY - 70}`;
    svg += `
      <path d="${cableBlackPath}" fill="none" stroke="#000" stroke-width="6" opacity="0.3"/>
      <path d="${cableBlackPath}" fill="none" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
    `;

    // Highlight snap circle if probe attached
    if (this.probeRed.attachedPin) {
      svg += `<circle cx="${prX}" cy="${prY}" r="14" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="3,3" class="rotor-spinning"/>`;
    }
    if (this.probeBlack.attachedPin) {
      svg += `<circle cx="${pbX}" cy="${pbY}" r="14" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="3,3" class="rotor-spinning"/>`;
    }

    // Probe Red Handle & Needle
    svg += `
      <g class="probe-group probe-red" id="probe_red" transform="translate(${prX}, ${prY})" style="cursor:grab;">
        <!-- Needle Tip -->
        <polygon points="0,0 -3,-20 3,-20" fill="#f8fafc" stroke="#94a3b8" stroke-width="0.5"/>
        <line x1="0" y1="0" x2="0" y2="-6" stroke="#f59e0b" stroke-width="2.5"/>
        <!-- Handle body -->
        <rect x="-7" y="-72" width="14" height="52" rx="4" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
        <line x1="-7" y1="-46" x2="7" y2="-46" stroke="#ffffff" stroke-width="2"/>
        <!-- Finger guard -->
        <ellipse cx="0" cy="-20" rx="9" ry="4" fill="#b91c1c"/>
        <text x="0" y="-77" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="900">+</text>
      </g>
    `;

    // Probe Black Handle & Needle
    svg += `
      <g class="probe-group probe-black" id="probe_black" transform="translate(${pbX}, ${pbY})" style="cursor:grab;">
        <!-- Needle Tip -->
        <polygon points="0,0 -3,-20 3,-20" fill="#f8fafc" stroke="#94a3b8" stroke-width="0.5"/>
        <line x1="0" y1="0" x2="0" y2="-6" stroke="#f59e0b" stroke-width="2.5"/>
        <!-- Handle body -->
        <rect x="-7" y="-72" width="14" height="52" rx="4" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
        <line x1="-7" y1="-46" x2="7" y2="-46" stroke="#ffffff" stroke-width="2"/>
        <!-- Finger guard -->
        <ellipse cx="0" cy="-20" rx="9" ry="4" fill="#0f172a"/>
        <text x="0" y="-77" text-anchor="middle" fill="#94a3b8" font-size="10" font-weight="bold">COM</text>
      </g>
    `;

    // Tespen Tool
    if (this.isTespenActive) {
      const tpX = this.tespenPos.x;
      const tpY = this.tespenPos.y;
      const pin = this.tespenPos.attachedPin;
      let glows = false;
      if (pin && window.circuitEngine) {
        glows = window.circuitEngine.testTespen(pin).glows;
      }

      const neonColor = glows ? '#ff4500' : '#475569';
      const neonFilter = glows ? 'filter: drop-shadow(0 0 12px #ff4500);' : '';

      svg += `
        <g class="tespen-group" id="tespen_tool" transform="translate(${tpX}, ${tpY})" style="cursor:grab;">
          <!-- Flat metal screwdriver blade -->
          <rect x="-2.5" y="-20" width="5" height="20" fill="#e2e8f0" stroke="#94a3b8"/>
          <!-- Insulated body -->
          <rect x="-8" y="-78" width="16" height="58" rx="4" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
          <!-- Transparent neon window -->
          <rect x="-5" y="-58" width="10" height="24" rx="3" fill="#0f172a"/>
          <ellipse cx="0" cy="-46" rx="3.5" ry="8" fill="${neonColor}" style="${neonFilter}"/>
          <!-- Brass end cap -->
          <circle cx="0" cy="-78" r="4" fill="#ca8a04"/>
          <text x="0" y="-85" text-anchor="middle" fill="#38bdf8" font-size="9" font-weight="bold">TESPEN</text>
        </g>
      `;
    }

    return svg;
  }
}

window.MultimeterTool = MultimeterTool;
