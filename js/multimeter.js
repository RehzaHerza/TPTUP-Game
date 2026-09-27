/**
 * Virtual Multimeter and Tespen Tool Engine
 * Provides realistic electrical measurement with draggable probes, rotary switch,
 * digital LCD display, continuity buzzer, and live phase detector (Tespen).
 */

class MultimeterTool {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.mode = 'ACV_750'; // 'OFF' | 'ACV_750' | 'ACV_200' | 'DCV_1000' | 'DCV_20' | 'OHM_CONT' | 'DCA_10A'
    
    // Probe positions & attachments
    this.probeRed = { x: 80, y: 380, attachedPin: null, isDragging: false };
    this.probeBlack = { x: 130, y: 380, attachedPin: null, isDragging: false };

    // Tespen tool
    this.isTespenActive = false;
    this.tespenPos = { x: 180, y: 380, attachedPin: null, isDragging: false };

    this.beeping = false;
    this.lastValue = '0.0';
    this.unit = 'V AC';

    this.initDOM();
  }

  initDOM() {
    // Check if DMM element exists or create it
    let dmmPanel = document.getElementById('multimeter-hud');
    if (!dmmPanel) {
      dmmPanel = document.createElement('div');
      dmmPanel.id = 'multimeter-hud';
      dmmPanel.className = 'multimeter-panel';
      document.body.appendChild(dmmPanel);
    }

    dmmPanel.innerHTML = `
      <div class="dmm-header">
        <span class="dmm-brand">VOLTCRAFT DMM-100</span>
        <span class="dmm-cat">CAT III 600V</span>
      </div>
      <div class="dmm-screen" id="dmm-screen">
        <span class="dmm-value" id="dmm-value">0.0</span>
        <span class="dmm-unit" id="dmm-unit">V AC</span>
      </div>
      <div class="dmm-controls">
        <label>Mode Selektor:</label>
        <select id="dmm-selector" class="dmm-select" onchange="app.multimeter.setMode(this.value)">
          <option value="ACV_750" selected>~ 750 V AC (Tegangan Jala-jala)</option>
          <option value="ACV_200">~ 200 V AC</option>
          <option value="DCV_1000">⎓ 1000 V DC</option>
          <option value="DCV_20">⎓ 20 V DC (Baterai)</option>
          <option value="OHM_CONT">🔊 Ω Kontinuitas / Buzzer</option>
          <option value="OFF">OFF (Mati)</option>
        </select>
      </div>
      <div class="dmm-probes-info">
        <div class="probe-tag probe-tag-red">Probe (+) : <span id="probe-red-target">Bebas</span></div>
        <div class="probe-tag probe-tag-black">Probe (-) : <span id="probe-black-target">Bebas</span></div>
      </div>
      <div class="dmm-footer">
        <button class="btn btn-sm btn-outline" onclick="app.multimeter.resetProbes()">Reset Posisi Probe</button>
      </div>
    `;

    this.updateDisplay();
  }

  setMode(newMode) {
    this.mode = newMode;
    if (window.sound) window.sound.playKnobClick();
    this.evaluate();
  }

  resetProbes() {
    this.probeRed = { x: 60, y: 400, attachedPin: null, isDragging: false };
    this.probeBlack = { x: 120, y: 400, attachedPin: null, isDragging: false };
    this.tespenPos = { x: 180, y: 400, attachedPin: null, isDragging: false };
    this.evaluate();
    if (window.app) window.app.render();
  }

  attachProbe(color, pinId) {
    if (color === 'red') {
      this.probeRed.attachedPin = pinId;
    } else if (color === 'black') {
      this.probeBlack.attachedPin = pinId;
    } else if (color === 'tespen') {
      this.tespenPos.attachedPin = pinId;
    }
    this.evaluate();
  }

  evaluate() {
    const screenVal = document.getElementById('dmm-value');
    const screenUnit = document.getElementById('dmm-unit');
    const redTarget = document.getElementById('probe-red-target');
    const blackTarget = document.getElementById('probe-black-target');

    if (redTarget) redTarget.innerText = this.probeRed.attachedPin || 'Bebas';
    if (blackTarget) blackTarget.innerText = this.probeBlack.attachedPin || 'Bebas';

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
          if (screenVal) screenVal.innerText = 'O.L'; // Over Limit
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

  renderProbesSVG() {
    let svg = '';

    // Probe Red
    const prX = this.probeRed.x;
    const prY = this.probeRed.y;
    svg += `
      <g class="probe-group probe-red" id="probe_red" transform="translate(${prX}, ${prY})" style="cursor:grab;">
        <!-- Needle Tip -->
        <polygon points="0,0 -3,-20 3,-20" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.5"/>
        <line x1="0" y1="0" x2="0" y2="-5" stroke="#f59e0b" stroke-width="2"/>
        <!-- Handle body -->
        <rect x="-6" y="-70" width="12" height="50" rx="3" fill="#ef4444" stroke="#991b1b" stroke-width="1.5"/>
        <line x1="-6" y1="-45" x2="6" y2="-45" stroke="#ffffff" stroke-width="1.5"/>
        <text x="0" y="-75" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold">+</text>
      </g>
    `;

    // Probe Black
    const pbX = this.probeBlack.x;
    const pbY = this.probeBlack.y;
    svg += `
      <g class="probe-group probe-black" id="probe_black" transform="translate(${pbX}, ${pbY})" style="cursor:grab;">
        <!-- Needle Tip -->
        <polygon points="0,0 -3,-20 3,-20" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.5"/>
        <line x1="0" y1="0" x2="0" y2="-5" stroke="#f59e0b" stroke-width="2"/>
        <!-- Handle body -->
        <rect x="-6" y="-70" width="12" height="50" rx="3" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
        <line x1="-6" y1="-45" x2="6" y2="-45" stroke="#ffffff" stroke-width="1.5"/>
        <text x="0" y="-75" text-anchor="middle" fill="#94a3b8" font-size="10" font-weight="bold">- (COM)</text>
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
      const neonFilter = glows ? 'filter: drop-shadow(0 0 10px #ff4500);' : '';

      svg += `
        <g class="tespen-group" id="tespen_tool" transform="translate(${tpX}, ${tpY})" style="cursor:grab;">
          <!-- Flat Metal tip -->
          <rect x="-2" y="-18" width="4" height="18" fill="#e2e8f0" stroke="#94a3b8"/>
          <!-- Insulated body -->
          <rect x="-7" y="-75" width="14" height="57" rx="3" fill="#0284c7" stroke="#0369a1"/>
          <!-- Transparent window showing neon lamp -->
          <rect x="-4" y="-55" width="8" height="22" rx="2" fill="#0f172a"/>
          <ellipse cx="0" cy="-44" rx="3" ry="8" fill="${neonColor}" style="${neonFilter}"/>
          <circle cx="0" cy="-70" r="3" fill="#ca8a04"/>
          <text x="0" y="-80" text-anchor="middle" fill="#38bdf8" font-size="9" font-weight="bold">TESPEN</text>
        </g>
      `;
    }

    return svg;
  }
}

window.MultimeterTool = MultimeterTool;
