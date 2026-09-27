/**
 * Electrical Components Definitions for VoltMaster SMK
 * Implements standard electrical symbols, realistic visual SVGs, and behavioral models.
 */

let _componentCounter = 1;

class BaseComponent {
  constructor(type, x, y, options = {}) {
    this.id = options.id || `${type}_${_componentCounter++}`;
    this.type = type;
    this.x = x || 100;
    this.y = y || 100;
    this.name = options.name || type.toUpperCase();
    this.pins = [];
    this.state = {};
    this.isSource = false;
  }

  getPin(pinId) {
    return this.pins.find(p => p.id === pinId);
  }

  getPinAbsolutePos(pinId) {
    const pin = this.getPin(pinId);
    if (!pin) return { x: this.x, y: this.y };
    return { x: this.x + pin.x, y: this.y + pin.y };
  }

  getInternalConnections() {
    return [];
  }

  getInternalResistancePaths() {
    return [];
  }

  updateState(engine) {
    return false;
  }
}

// -------------------------------------------------------------
// 1. PLN 1-PHASE SOURCE (220V AC)
// -------------------------------------------------------------
class SourcePLN1P extends BaseComponent {
  constructor(x, y, options = {}) {
    super('pln1p', x, y, options);
    this.name = "Suplai PLN 1 Fasa (220V)";
    this.isSource = true;
    this.state = { isLive: true };

    this.pins = [
      { id: `${this.id}_L`, label: 'L (Fasa)', type: 'AC_PHASE', x: 25, y: 110, color: '#8B4513' }, // Brown/Black
      { id: `${this.id}_N`, label: 'N (Netral)', type: 'AC_NEUTRAL', x: 75, y: 110, color: '#1E90FF' }, // Blue
      { id: `${this.id}_PE`, label: 'PE (Arde)', type: 'AC_GROUND', x: 125, y: 110, color: '#32CD32' } // Yellow-Green
    ];
  }

  getPinPotentials() {
    return {
      [`${this.id}_L`]: { type: 'AC', v: 220, phase: 0, isNeutral: false, isGround: false },
      [`${this.id}_N`]: { type: 'AC', v: 0, phase: 0, isNeutral: true, isGround: false },
      [`${this.id}_PE`]: { type: 'AC', v: 0, phase: 0, isNeutral: false, isGround: true }
    };
  }

  renderSVG() {
    return `
      <g class="comp pln1p-comp" id="comp_${this.id}" transform="translate(${this.x}, ${this.y})">
        <!-- Box -->
        <rect width="150" height="120" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <rect x="0" y="0" width="150" height="28" rx="8" fill="#0284c7"/>
        <text x="75" y="19" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">PLN 1-FASA 220V</text>
        
        <!-- Icon & Wave -->
        <circle cx="75" cy="60" r="20" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
        <path d="M 63 60 Q 69 52 75 60 T 87 60" fill="none" stroke="#facc15" stroke-width="2.5"/>
        <text x="75" y="92" text-anchor="middle" fill="#94a3b8" font-size="10">50 Hz ~ 220V</text>

        <!-- Pins -->
        ${renderPinDOM(this.pins[0], 'L (Fasa)')}
        ${renderPinDOM(this.pins[1], 'N (Netral)')}
        ${renderPinDOM(this.pins[2], 'PE (Arde)')}
      </g>
    `;
  }
}

// -------------------------------------------------------------
// 2. PLN 3-PHASE INDUSTRIAL SOURCE (380V/220V)
// -------------------------------------------------------------
class SourcePLN3P extends BaseComponent {
  constructor(x, y, options = {}) {
    super('pln3p', x, y, options);
    this.name = "Suplai PLN 3 Fasa (380V)";
    this.isSource = true;
    this.state = { isLive: true };

    this.pins = [
      { id: `${this.id}_R`, label: 'R (L1)', type: 'AC_PHASE', x: 25, y: 110, color: '#8B4513' },  // Coklat
      { id: `${this.id}_S`, label: 'S (L2)', type: 'AC_PHASE', x: 65, y: 110, color: '#111827' },  // Hitam
      { id: `${this.id}_T`, label: 'T (L3)', type: 'AC_PHASE', x: 105, y: 110, color: '#6B7280' }, // Abu-abu
      { id: `${this.id}_N`, label: 'N', type: 'AC_NEUTRAL', x: 145, y: 110, color: '#2563EB' },      // Biru
      { id: `${this.id}_PE`, label: 'PE', type: 'AC_GROUND', x: 185, y: 110, color: '#16A34A' }     // Kuning-Hijau
    ];
  }

  getPinPotentials() {
    return {
      [`${this.id}_R`]: { type: 'AC', v: 220, phase: 0, isNeutral: false, isGround: false },
      [`${this.id}_S`]: { type: 'AC', v: 220, phase: -120, isNeutral: false, isGround: false },
      [`${this.id}_T`]: { type: 'AC', v: 220, phase: -240, isNeutral: false, isGround: false },
      [`${this.id}_N`]: { type: 'AC', v: 0, phase: 0, isNeutral: true, isGround: false },
      [`${this.id}_PE`]: { type: 'AC', v: 0, phase: 0, isNeutral: false, isGround: true }
    };
  }

  renderSVG() {
    return `
      <g class="comp pln3p-comp" id="comp_${this.id}" transform="translate(${this.x}, ${this.y})">
        <rect width="210" height="120" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <rect x="0" y="0" width="210" height="28" rx="8" fill="#d97706"/>
        <text x="105" y="19" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">PLN 3-FASA 380V/220V</text>

        <text x="105" y="55" text-anchor="middle" fill="#facc15" font-size="11" font-weight="bold">R-S-T-N-PE (PUIL)</text>
        <text x="105" y="75" text-anchor="middle" fill="#94a3b8" font-size="10">V(L-L)=380V | V(L-N)=220V</text>

        ${renderPinDOM(this.pins[0], 'R')}
        ${renderPinDOM(this.pins[1], 'S')}
        ${renderPinDOM(this.pins[2], 'T')}
        ${renderPinDOM(this.pins[3], 'N')}
        ${renderPinDOM(this.pins[4], 'PE')}
      </g>
    `;
  }
}

// -------------------------------------------------------------
// 3. BATTERY DC SOURCE (Baterai 12V / 9V / 1.5V)
// -------------------------------------------------------------
class BatteryDC extends BaseComponent {
  constructor(x, y, options = {}) {
    super('battery', x, y, options);
    this.voltage = options.voltage || 12;
    this.name = `Baterai DC ${this.voltage}V`;
    this.isSource = true;

    this.pins = [
      { id: `${this.id}_pos`, label: '+ (Positif)', type: 'DC_POS', x: 25, y: 80, color: '#ef4444' },
      { id: `${this.id}_neg`, label: '- (Negatif)', type: 'DC_NEG', x: 95, y: 80, color: '#111827' }
    ];
  }

  getPinPotentials() {
    return {
      [`${this.id}_pos`]: { type: 'DC', v: this.voltage, phase: 0 },
      [`${this.id}_neg`]: { type: 'DC', v: 0, phase: 0 }
    };
  }

  renderSVG() {
    return `
      <g class="comp battery-comp" id="comp_${this.id}" transform="translate(${this.x}, ${this.y})">
        <rect width="120" height="90" rx="8" fill="#1e293b" stroke="#ef4444" stroke-width="2"/>
        <rect x="0" y="0" width="120" height="24" rx="8" fill="#b91c1c"/>
        <text x="60" y="17" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">BATERAI DC ${this.voltage}V</text>

        <circle cx="60" cy="50" r="16" fill="#0f172a" stroke="#64748b"/>
        <text x="60" y="55" text-anchor="middle" fill="#ef4444" font-size="14" font-weight="bold">DC</text>

        ${renderPinDOM(this.pins[0], '+')}
        ${renderPinDOM(this.pins[1], '-')}
      </g>
    `;
  }
}

// -------------------------------------------------------------
// 4. MCB 1-PHASE (Miniature Circuit Breaker 1P)
// -------------------------------------------------------------
class MCB1P extends BaseComponent {
  constructor(x, y, options = {}) {
    super('mcb1p', x, y, options);
    this.rating = options.rating || 'C6';
    this.name = `MCB 1-Fasa (${this.rating})`;
    this.state = { isOn: options.isOn || false, tripped: false };

    this.pins = [
      { id: `${this.id}_in`, label: 'Input (1)', type: 'IN', x: 35, y: 10, color: '#f59e0b' },
      { id: `${this.id}_out`, label: 'Output (2)', type: 'OUT', x: 35, y: 130, color: '#f59e0b' }
    ];
  }

  toggle() {
    this.state.isOn = !this.state.isOn;
    this.state.tripped = false;
    if (window.sound) window.sound.playMcbToggle(this.state.isOn);
  }

  getInternalConnections() {
    if (this.state.isOn && !this.state.tripped) {
      return [[`${this.id}_in`, `${this.id}_out`]];
    }
    return [];
  }

  getInternalResistancePaths() {
    if (this.state.isOn && !this.state.tripped) {
      return [{ p1: `${this.id}_in`, p2: `${this.id}_out`, r: 0.05 }];
    }
    return [];
  }

  renderSVG() {
    const leverColor = this.state.tripped ? '#ef4444' : (this.state.isOn ? '#22c55e' : '#64748b');
    const leverY = this.state.isOn ? 50 : 70;
    const statusText = this.state.tripped ? 'TRIP' : (this.state.isOn ? 'ON (1)' : 'OFF (0)');

    return `
      <g class="comp mcb1p-comp" id="comp_${this.id}" transform="translate(${this.x}, ${this.y})">
        <!-- Body -->
        <rect width="70" height="140" rx="6" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
        <rect x="10" y="25" width="50" height="90" rx="4" fill="#cbd5e1"/>

        <!-- Model Text -->
        <text x="35" y="40" text-anchor="middle" fill="#0f172a" font-size="9" font-weight="bold">MCB 1P</text>
        <text x="35" y="52" text-anchor="middle" fill="#0284c7" font-size="10" font-weight="bold">${this.rating}</text>
        <text x="35" y="108" text-anchor="middle" fill="#334155" font-size="8">230V~ 4500A</text>

        <!-- Toggle Lever Button -->
        <rect x="22" y="${leverY}" width="26" height="24" rx="4" fill="${leverColor}" stroke="#1e293b" stroke-width="1.5"
              class="mcb-lever" style="cursor:pointer;" onclick="app.toggleComponent('${this.id}')"/>
        <text x="35" y="${leverY + 16}" text-anchor="middle" fill="#fff" font-size="9" font-weight="bold" pointer-events="none">
          ${this.state.isOn ? 'I' : 'O'}
        </text>

        <!-- Status Badge -->
        <text x="35" y="125" text-anchor="middle" fill="${leverColor}" font-size="8" font-weight="bold">${statusText}</text>

        ${renderPinDOM(this.pins[0], 'IN')}
        ${renderPinDOM(this.pins[1], 'OUT')}
      </g>
    `;
  }
}

// -------------------------------------------------------------
// 5. MCB 3-PHASE (MCB 3-Pole 380V)
// -------------------------------------------------------------
class MCB3P extends BaseComponent {
  constructor(x, y, options = {}) {
    super('mcb3p', x, y, options);
    this.rating = options.rating || 'C16';
    this.name = `MCB 3-Fasa (${this.rating})`;
    this.state = { isOn: options.isOn || false, tripped: false };

    this.pins = [
      { id: `${this.id}_in_R`, label: 'In R (1)', type: 'IN', x: 25, y: 10, color: '#8B4513' },
      { id: `${this.id}_in_S`, label: 'In S (3)', type: 'IN', x: 75, y: 10, color: '#111827' },
      { id: `${this.id}_in_T`, label: 'In T (5)', type: 'IN', x: 125, y: 10, color: '#6B7280' },
      { id: `${this.id}_out_R`, label: 'Out R (2)', type: 'OUT', x: 25, y: 140, color: '#8B4513' },
      { id: `${this.id}_out_S`, label: 'Out S (4)', type: 'OUT', x: 75, y: 140, color: '#111827' },
      { id: `${this.id}_out_T`, label: 'Out T (6)', type: 'OUT', x: 125, y: 140, color: '#6B7280' }
    ];
  }

  toggle() {
    this.state.isOn = !this.state.isOn;
    this.state.tripped = false;
    if (window.sound) window.sound.playMcbToggle(this.state.isOn);
  }

  getInternalConnections() {
    if (this.state.isOn && !this.state.tripped) {
      return [
        [`${this.id}_in_R`, `${this.id}_out_R`],
        [`${this.id}_in_S`, `${this.id}_out_S`],
        [`${this.id}_in_T`, `${this.id}_out_T`]
      ];
    }
    return [];
  }

  getInternalResistancePaths() {
    if (this.state.isOn && !this.state.tripped) {
      return [
        { p1: `${this.id}_in_R`, p2: `${this.id}_out_R`, r: 0.05 },
        { p1: `${this.id}_in_S`, p2: `${this.id}_out_S`, r: 0.05 },
        { p1: `${this.id}_in_T`, p2: `${this.id}_out_T`, r: 0.05 }
      ];
    }
    return [];
  }

  renderSVG() {
    const leverColor = this.state.tripped ? '#ef4444' : (this.state.isOn ? '#22c55e' : '#64748b');
    const leverY = this.state.isOn ? 55 : 75;

    return `
      <g class="comp mcb3p-comp" id="comp_${this.id}" transform="translate(${this.x}, ${this.y})">
        <rect width="150" height="150" rx="6" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
        <rect x="10" y="25" width="130" height="100" rx="4" fill="#cbd5e1"/>

        <text x="75" y="42" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="bold">MCB 3-PHASE (${this.rating})</text>
        <text x="75" y="118" text-anchor="middle" fill="#334155" font-size="9">400V~ 6000A</text>

        <!-- Triple Gang Handle Connected Bar -->
        <rect x="25" y="${leverY}" width="100" height="24" rx="4" fill="${leverColor}" stroke="#1e293b" stroke-width="1.5"
              class="mcb-lever" style="cursor:pointer;" onclick="app.toggleComponent('${this.id}')"/>
        <text x="75" y="${leverY + 16}" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold" pointer-events="none">
          ${this.state.isOn ? 'ON (1)' : 'OFF (0)'}
        </text>

        ${renderPinDOM(this.pins[0], '1 (R)')}
        ${renderPinDOM(this.pins[1], '3 (S)')}
        ${renderPinDOM(this.pins[2], '5 (T)')}
        ${renderPinDOM(this.pins[3], '2 (R)')}
        ${renderPinDOM(this.pins[4], '4 (S)')}
        ${renderPinDOM(this.pins[5], '6 (T)')}
      </g>
    `;
  }
}

// -------------------------------------------------------------
// 6. SINGLE SWITCH (Sakelar Tunggal)
// -------------------------------------------------------------
class SingleSwitch extends BaseComponent {
  constructor(x, y, options = {}) {
    super('switch_single', x, y, options);
    this.name = "Sakelar Tunggal";
    this.state = { isOn: false };

    this.pins = [
      { id: `${this.id}_in`, label: 'Fasa Masuk', type: 'IN', x: 25, y: 100, color: '#8B4513' },
      { id: `${this.id}_out`, label: 'Fasa Balik', type: 'OUT', x: 75, y: 100, color: '#f59e0b' }
    ];
  }

  toggle() {
    this.state.isOn = !this.state.isOn;
    if (window.sound) window.sound.playSwitch();
  }

  getInternalConnections() {
    if (this.state.isOn) {
      return [[`${this.id}_in`, `${this.id}_out`]];
    }
    return [];
  }

  getInternalResistancePaths() {
    if (this.state.isOn) {
      return [{ p1: `${this.id}_in`, p2: `${this.id}_out`, r: 0.05 }];
    }
    return [];
  }

  renderSVG() {
    const rockerTransform = this.state.isOn ? 'rotate(10, 50, 45)' : 'rotate(-10, 50, 45)';
    return `
      <g class="comp switch-comp" id="comp_${this.id}" transform="translate(${this.x}, ${this.y})">
        <!-- Frame -->
        <rect width="100" height="110" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
        <rect x="15" y="15" width="70" height="65" rx="4" fill="#e2e8f0" stroke="#cbd5e1"/>

        <!-- Rocker button -->
        <g transform="${rockerTransform}" style="cursor:pointer;" onclick="app.toggleComponent('${this.id}')">
          <rect x="22" y="22" width="56" height="50" rx="3" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="28" y1="47" x2="72" y2="47" stroke="#cbd5e1" stroke-width="2"/>
          <circle cx="50" cy="${this.state.isOn ? 35 : 58}" r="3" fill="${this.state.isOn ? '#22c55e' : '#94a3b8'}"/>
        </g>

        ${renderPinDOM(this.pins[0], 'IN')}
        ${renderPinDOM(this.pins[1], 'OUT')}
      </g>
    `;
  }
}

// -------------------------------------------------------------
// 7. DOUBLE SWITCH (Sakelar Seri / Ganda)
// -------------------------------------------------------------
class DoubleSwitch extends BaseComponent {
  constructor(x, y, options = {}) {
    super('switch_double', x, y, options);
    this.name = "Sakelar Ganda (Seri)";
    this.state = { isOn1: false, isOn2: false };

    this.pins = [
      { id: `${this.id}_com`, label: 'Common (Fasa)', type: 'IN', x: 25, y: 100, color: '#8B4513' },
      { id: `${this.id}_out1`, label: 'Out Lampu 1', type: 'OUT', x: 65, y: 100, color: '#f59e0b' },
      { id: `${this.id}_out2`, label: 'Out Lampu 2', type: 'OUT', x: 105, y: 100, color: '#f59e0b' }
    ];
  }

  toggleSwitch(switchIdx) {
    if (switchIdx === 1) this.state.isOn1 = !this.state.isOn1;
    if (switchIdx === 2) this.state.isOn2 = !this.state.isOn2;
    if (window.sound) window.sound.playSwitch();
  }

  getInternalConnections() {
    const conns = [];
    if (this.state.isOn1) conns.push([`${this.id}_com`, `${this.id}_out1`]);
    if (this.state.isOn2) conns.push([`${this.id}_com`, `${this.id}_out2`]);
    return conns;
  }

  renderSVG() {
    return `
      <g class="comp switch-double-comp" id="comp_${this.id}" transform="translate(${this.x}, ${this.y})">
        <rect width="130" height="110" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
        
        <!-- Rocker 1 -->
        <rect x="18" y="18" width="42" height="58" rx="3" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"
              style="cursor:pointer;" onclick="app.toggleComponent('${this.id}', 1)"/>
        <circle cx="39" cy="${this.state.isOn1 ? 30 : 55}" r="3" fill="${this.state.isOn1 ? '#22c55e' : '#94a3b8'}"/>
        <text x="39" y="70" text-anchor="middle" font-size="8" fill="#64748b">SW 1</text>

        <!-- Rocker 2 -->
        <rect x="70" y="18" width="42" height="58" rx="3" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"
              style="cursor:pointer;" onclick="app.toggleComponent('${this.id}', 2)"/>
        <circle cx="91" cy="${this.state.isOn2 ? 30 : 55}" r="3" fill="${this.state.isOn2 ? '#22c55e' : '#94a3b8'}"/>
        <text x="91" y="70" text-anchor="middle" font-size="8" fill="#64748b">SW 2</text>

        ${renderPinDOM(this.pins[0], 'COM')}
        ${renderPinDOM(this.pins[1], 'OUT 1')}
        ${renderPinDOM(this.pins[2], 'OUT 2')}
      </g>
    `;
  }
}

// -------------------------------------------------------------
// 8. CHANGEOVER / TWO-WAY SWITCH (Sakelar Tukar / Hotel)
// -------------------------------------------------------------
class ChangeoverSwitch extends BaseComponent {
  constructor(x, y, options = {}) {
    super('switch_hotel', x, y, options);
    this.name = options.name || "Sakelar Tukar (Hotel)";
    this.state = { position: 1 }; // 1 connects COM to L1; 2 connects COM to L2

    this.pins = [
      { id: `${this.id}_com`, label: 'Common (C)', type: 'COM', x: 25, y: 100, color: '#8B4513' },
      { id: `${this.id}_l1`, label: 'Jalur 1', type: 'OUT', x: 65, y: 100, color: '#f59e0b' },
      { id: `${this.id}_l2`, label: 'Jalur 2', type: 'OUT', x: 105, y: 100, color: '#f59e0b' }
    ];
  }

  toggle() {
    this.state.position = this.state.position === 1 ? 2 : 1;
    if (window.sound) window.sound.playSwitch();
  }

  getInternalConnections() {
    if (this.state.position === 1) {
      return [[`${this.id}_com`, `${this.id}_l1`]];
    } else {
      return [[`${this.id}_com`, `${this.id}_l2`]];
    }
  }

  renderSVG() {
    return `
      <g class="comp switch-hotel-comp" id="comp_${this.id}" transform="translate(${this.x}, ${this.y})">
        <rect width="130" height="110" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
        <rect x="25" y="15" width="80" height="65" rx="4" fill="#e2e8f0"/>
        
        <!-- Toggle button -->
        <rect x="35" y="20" width="60" height="55" rx="3" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"
              style="cursor:pointer;" onclick="app.toggleComponent('${this.id}')"/>
        <text x="65" y="45" text-anchor="middle" font-size="10" font-weight="bold" fill="#0284c7">
          POS ${this.state.position}
        </text>
        <text x="65" y="60" text-anchor="middle" font-size="8" fill="#64748b">
          ${this.state.position === 1 ? 'COM → 1' : 'COM → 2'}
        </text>

        ${renderPinDOM(this.pins[0], 'COM')}
        ${renderPinDOM(this.pins[1], 'L1')}
        ${renderPinDOM(this.pins[2], 'L2')}
      </g>
    `;
  }
}

// -------------------------------------------------------------
// 9. LIGHT BULB (Lampu Pijar / Fitting)
// -------------------------------------------------------------
class BulbPijar extends BaseComponent {
  constructor(x, y, options = {}) {
    super('bulb', x, y, options);
    this.name = options.name || "Lampu Pijar 60W";
    this.state = { isLit: false, voltage: 0 };

    this.pins = [
      { id: `${this.id}_phase`, label: 'Fasa (L)', type: 'LOAD_P', x: 25, y: 110, color: '#f59e0b' },
      { id: `${this.id}_neutral`, label: 'Netral (N)', type: 'LOAD_N', x: 75, y: 110, color: '#2563EB' }
    ];
  }

  updateState(engine) {
    const meas = engine.measureVoltage(`${this.id}_phase`, `${this.id}_neutral`);
    const wasLit = this.state.isLit;
    this.state.voltage = meas.v;
    // Lights up if voltage is around 180V - 250V AC, or approx DC
    this.state.isLit = (meas.v >= 160);
    return wasLit !== this.state.isLit;
  }

  getInternalResistancePaths() {
    return [{ p1: `${this.id}_phase`, p2: `${this.id}_neutral`, r: 806 }]; // 60W at 220V => R = V^2 / P ~ 806 Ohm
  }

  renderSVG() {
    const glowFill = this.state.isLit ? '#fef08a' : '#cbd5e1';
    const glowFilter = this.state.isLit ? 'filter: drop-shadow(0 0 16px #facc15);' : '';
    const filamentStroke = this.state.isLit ? '#ea580c' : '#94a3b8';

    return `
      <g class="comp bulb-comp" id="comp_${this.id}" transform="translate(${this.x}, ${this.y})">
        <!-- Bulb Glow -->
        <circle cx="50" cy="45" r="30" fill="${glowFill}" stroke="#94a3b8" stroke-width="1.5" style="${glowFilter}"/>
        <!-- Base socket -->
        <rect x="38" y="70" width="24" height="20" fill="#94a3b8" rx="2"/>
        <line x1="38" y1="76" x2="62" y2="76" stroke="#64748b" stroke-width="1.5"/>
        <line x1="38" y1="82" x2="62" y2="82" stroke="#64748b" stroke-width="1.5"/>

        <!-- Filament -->
        <path d="M 43 65 L 47 48 L 53 48 L 57 65" fill="none" stroke="${filamentStroke}" stroke-width="1.5"/>

        ${this.state.isLit ? `
          <line x1="50" y1="8" x2="50" y2="1" stroke="#facc15" stroke-width="2"/>
          <line x1="18" y1="25" x2="12" y2="20" stroke="#facc15" stroke-width="2"/>
          <line x1="82" y1="25" x2="88" y2="20" stroke="#facc15" stroke-width="2"/>
        ` : ''}

        ${renderPinDOM(this.pins[0], 'FASA')}
        ${renderPinDOM(this.pins[1], 'NETRAL')}
      </g>
    `;
  }
}

// -------------------------------------------------------------
// 10. POWER OUTLET (Stop Kontak 2P + Arde)
// -------------------------------------------------------------
class Outlet2P extends BaseComponent {
  constructor(x, y, options = {}) {
    super('outlet', x, y, options);
    this.name = "Stop Kontak (2P + PE)";
    this.state = { isPowered: false };

    this.pins = [
      { id: `${this.id}_L`, label: 'Fasa (L)', type: 'OUTLET_L', x: 25, y: 110, color: '#8B4513' },
      { id: `${this.id}_N`, label: 'Netral (N)', type: 'OUTLET_N', x: 65, y: 110, color: '#2563EB' },
      { id: `${this.id}_PE`, label: 'Arde (PE)', type: 'OUTLET_PE', x: 105, y: 110, color: '#16A34A' }
    ];
  }

  updateState(engine) {
    const meas = engine.measureVoltage(`${this.id}_L`, `${this.id}_N`);
    this.state.isPowered = (meas.v >= 180);
    return false;
  }

  renderSVG() {
    return `
      <g class="comp outlet-comp" id="comp_${this.id}" transform="translate(${this.x}, ${this.y})">
        <rect width="130" height="120" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
        <circle cx="65" cy="50" r="32" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>

        <!-- Grounding clips top & bottom -->
        <rect x="62" y="20" width="6" height="6" fill="#ca8a04"/>
        <rect x="62" y="74" width="6" height="6" fill="#ca8a04"/>

        <!-- Socket Holes -->
        <circle cx="50" cy="50" r="5" fill="#1e293b"/>
        <circle cx="80" cy="50" r="5" fill="#1e293b"/>

        <!-- Power indicator dot -->
        <circle cx="65" cy="90" r="3" fill="${this.state.isPowered ? '#22c55e' : '#cbd5e1'}"/>

        ${renderPinDOM(this.pins[0], 'L')}
        ${renderPinDOM(this.pins[1], 'N')}
        ${renderPinDOM(this.pins[2], 'PE')}
      </g>
    `;
  }
}

// -------------------------------------------------------------
// 11. KWH METER PLN (APP - Alat Pengukur dan Pembatas)
// -------------------------------------------------------------
class KWHMeter extends BaseComponent {
  constructor(x, y, options = {}) {
    super('kwh_meter', x, y, options);
    this.name = "KWH Meter PLN (APP)";
    this.state = { isSpinning: false, kwh: 1248.5 };

    this.pins = [
      { id: `${this.id}_in_L`, label: '1 (Fasa Masuk SUTR)', type: 'IN_L', x: 25, y: 150, color: '#8B4513' },
      { id: `${this.id}_out_L`, label: '2 (Fasa Keluar ke MCB)', type: 'OUT_L', x: 65, y: 150, color: '#8B4513' },
      { id: `${this.id}_in_N`, label: '3 (Netral Masuk)', type: 'IN_N', x: 105, y: 150, color: '#2563EB' },
      { id: `${this.id}_out_N`, label: '4 (Netral Keluar)', type: 'OUT_N', x: 145, y: 150, color: '#2563EB' },
      { id: `${this.id}_ground`, label: '5 (Pentanahan APP)', type: 'GND', x: 185, y: 150, color: '#16A34A' }
    ];
  }

  getInternalConnections() {
    // Current coil connects 1 to 2; Voltage coil connects 1 & 3; Netral passes 3 to 4
    return [
      [`${this.id}_in_L`, `${this.id}_out_L`],
      [`${this.id}_in_N`, `${this.id}_out_N`]
    ];
  }

  getInternalResistancePaths() {
    return [
      { p1: `${this.id}_in_L`, p2: `${this.id}_out_L`, r: 0.05 },
      { p1: `${this.id}_in_N`, p2: `${this.id}_out_N`, r: 0.01 }
    ];
  }

  updateState(engine) {
    const v = engine.measureVoltage(`${this.id}_out_L`, `${this.id}_out_N`);
    this.state.isSpinning = (v.v >= 180);
    return false;
  }

  renderSVG() {
    return `
      <g class="comp kwh-comp" id="comp_${this.id}" transform="translate(${this.x}, ${this.y})">
        <rect width="210" height="160" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <rect x="0" y="0" width="210" height="30" rx="10" fill="#0369a1"/>
        <text x="105" y="20" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">KWH METER PLN (APP)</text>

        <!-- Digital LCD / Mechanical Register Counter -->
        <rect x="35" y="40" width="140" height="35" rx="4" fill="#0f172a" stroke="#475569"/>
        <text x="105" y="64" text-anchor="middle" fill="#22c55e" font-family="monospace" font-size="18" font-weight="bold">
          01248.5 kWh
        </text>

        <!-- Spinning disc simulation -->
        <rect x="55" y="85" width="100" height="16" rx="2" fill="#64748b"/>
        <circle cx="105" cy="93" r="6" fill="${this.state.isSpinning ? '#ef4444' : '#1e293b'}"/>
        <text x="105" y="115" text-anchor="middle" fill="#94a3b8" font-size="9">
          ${this.state.isSpinning ? 'DISC ROTATING (BEBAN AKTIF)' : 'STANDBY'}
        </text>

        <!-- PLN Seal Badge -->
        <circle cx="185" cy="95" r="10" fill="#dc2626"/>
        <text x="185" y="99" text-anchor="middle" fill="#fff" font-size="8" font-weight="bold">PLN</text>

        ${renderPinDOM(this.pins[0], '1-L')}
        ${renderPinDOM(this.pins[1], '2-L')}
        ${renderPinDOM(this.pins[2], '3-N')}
        ${renderPinDOM(this.pins[3], '4-N')}
        ${renderPinDOM(this.pins[4], '5-PE')}
      </g>
    `;
  }
}

// -------------------------------------------------------------
// 12. GROUND ROD (Batang Pembumian / Arde)
// -------------------------------------------------------------
class GroundRod extends BaseComponent {
  constructor(x, y, options = {}) {
    super('ground_rod', x, y, options);
    this.name = "Batang Arde (Ground Rod)";
    this.resistance = options.resistance || 3.2; // <= 5 Ohm per PUIL

    this.pins = [
      { id: `${this.id}_pe`, label: 'Terminal Arde', type: 'GROUND', x: 40, y: 15, color: '#16A34A' }
    ];
  }

  getPinPotentials() {
    return {
      [`${this.id}_pe`]: { type: 'AC', v: 0, phase: 0, isNeutral: false, isGround: true }
    };
  }

  renderSVG() {
    return `
      <g class="comp ground-rod-comp" id="comp_${this.id}" transform="translate(${this.x}, ${this.y})">
        <rect width="80" height="110" rx="6" fill="#1e293b" stroke="#16a34a" stroke-width="2"/>
        <text x="40" y="45" text-anchor="middle" fill="#4ade80" font-size="10" font-weight="bold">ARDE (PE)</text>
        <text x="40" y="60" text-anchor="middle" fill="#94a3b8" font-size="9">R = ${this.resistance} Ω</text>
        <text x="40" y="75" text-anchor="middle" fill="#22c55e" font-size="8">PUIL &lt; 5Ω OK</text>

        <!-- Ground symbol lines -->
        <line x1="25" y1="85" x2="55" y2="85" stroke="#4ade80" stroke-width="3"/>
        <line x1="30" y1="92" x2="50" y2="92" stroke="#4ade80" stroke-width="2.5"/>
        <line x1="35" y1="99" x2="45" y2="99" stroke="#4ade80" stroke-width="2"/>

        ${renderPinDOM(this.pins[0], 'PE')}
      </g>
    `;
  }
}

// -------------------------------------------------------------
// 13. PUSH BUTTON NO (Start - Hijau) & NC (Stop - Merah)
// -------------------------------------------------------------
class PushButton extends BaseComponent {
  constructor(x, y, options = {}) {
    super('push_button', x, y, options);
    this.isNC = options.isNC || false; // default NO
    this.name = this.isNC ? "Tombol STOP (NC)" : "Tombol START (NO)";
    this.state = { isPressed: false };

    if (this.isNC) {
      this.pins = [
        { id: `${this.id}_1`, label: '1 (NC)', type: 'PB_NC', x: 25, y: 90, color: '#ef4444' },
        { id: `${this.id}_2`, label: '2 (NC)', type: 'PB_NC', x: 75, y: 90, color: '#ef4444' }
      ];
    } else {
      this.pins = [
        { id: `${this.id}_3`, label: '3 (NO)', type: 'PB_NO', x: 25, y: 90, color: '#22c55e' },
        { id: `${this.id}_4`, label: '4 (NO)', type: 'PB_NO', x: 75, y: 90, color: '#22c55e' }
      ];
    }
  }

  press() {
    this.state.isPressed = true;
    if (window.sound) window.sound.playSwitch();
  }

  release() {
    this.state.isPressed = false;
  }

  getInternalConnections() {
    // If NC: closed when NOT pressed, open when pressed
    if (this.isNC) {
      if (!this.state.isPressed) {
        return [[`${this.id}_1`, `${this.id}_2`]];
      }
    } else {
      // If NO: open when NOT pressed, closed when pressed
      if (this.state.isPressed) {
        return [[`${this.id}_3`, `${this.id}_4`]];
      }
    }
    return [];
  }

  getInternalResistancePaths() {
    if ((this.isNC && !this.state.isPressed) || (!this.isNC && this.state.isPressed)) {
      const p1 = this.pins[0].id;
      const p2 = this.pins[1].id;
      return [{ p1, p2, r: 0.05 }];
    }
    return [];
  }

  renderSVG() {
    const btnColor = this.isNC ? '#dc2626' : '#16a34a';
    const label = this.isNC ? 'STOP (NC)' : 'START (NO)';

    return `
      <g class="comp pb-comp" id="comp_${this.id}" transform="translate(${this.x}, ${this.y})">
        <rect width="100" height="100" rx="8" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
        
        <!-- Push button head -->
        <circle cx="50" cy="40" r="22" fill="${btnColor}" stroke="#ffffff" stroke-width="2"
                style="cursor:pointer;"
                onmousedown="app.pressPushButton('${this.id}')"
                onmouseup="app.releasePushButton('${this.id}')"
                ontouchstart="app.pressPushButton('${this.id}')"
                ontouchend="app.releasePushButton('${this.id}')"/>
        <text x="50" y="44" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold" pointer-events="none">
          ${this.isNC ? 'O' : 'I'}
        </text>
        <text x="50" y="75" text-anchor="middle" fill="#cbd5e1" font-size="9" font-weight="bold">${label}</text>

        ${renderPinDOM(this.pins[0], this.isNC ? '1' : '3')}
        ${renderPinDOM(this.pins[1], this.isNC ? '2' : '4')}
      </g>
    `;
  }
}

// -------------------------------------------------------------
// 14. MAGNETIC CONTACTOR (Kontaktor Magnetik 3 Fasa + Aux NO 13-14)
// -------------------------------------------------------------
class MagneticContactor extends BaseComponent {
  constructor(x, y, options = {}) {
    super('contactor', x, y, options);
    this.name = "Kontaktor Magnetik (KM1)";
    this.state = { isEnergized: false };

    this.pins = [
      // Coil Terminals
      { id: `${this.id}_A1`, label: 'A1 (Koil 220V)', type: 'COIL', x: 25, y: 15, color: '#f59e0b' },
      { id: `${this.id}_A2`, label: 'A2 (Koil Netral)', type: 'COIL', x: 175, y: 15, color: '#2563EB' },

      // Main Power Contacts (Inputs)
      { id: `${this.id}_L1`, label: '1/L1', type: 'MAIN_IN', x: 55, y: 15, color: '#8B4513' },
      { id: `${this.id}_L2`, label: '3/L2', type: 'MAIN_IN', x: 95, y: 15, color: '#111827' },
      { id: `${this.id}_L3`, label: '5/L3', type: 'MAIN_IN', x: 135, y: 15, color: '#6B7280' },

      // Main Power Contacts (Outputs)
      { id: `${this.id}_T1`, label: '2/T1', type: 'MAIN_OUT', x: 55, y: 150, color: '#8B4513' },
      { id: `${this.id}_T2`, label: '4/T2', type: 'MAIN_OUT', x: 95, y: 150, color: '#111827' },
      { id: `${this.id}_T3`, label: '6/T3', type: 'MAIN_OUT', x: 135, y: 150, color: '#6B7280' },

      // Auxiliary Contacts (NO 13-14 for Latching)
      { id: `${this.id}_13`, label: '13 (NO)', type: 'AUX_NO', x: 25, y: 150, color: '#10b981' },
      { id: `${this.id}_14`, label: '14 (NO)', type: 'AUX_NO', x: 175, y: 150, color: '#10b981' }
    ];
  }

  updateState(engine) {
    const coilVoltage = engine.measureVoltage(`${this.id}_A1`, `${this.id}_A2`);
    const wasEnergized = this.state.isEnergized;
    this.state.isEnergized = (coilVoltage.v >= 170);

    if (wasEnergized !== this.state.isEnergized && window.sound) {
      window.sound.playContactor(this.state.isEnergized);
    }
    return wasEnergized !== this.state.isEnergized;
  }

  getInternalConnections() {
    if (this.state.isEnergized) {
      return [
        [`${this.id}_L1`, `${this.id}_T1`],
        [`${this.id}_L2`, `${this.id}_T2`],
        [`${this.id}_L3`, `${this.id}_T3`],
        [`${this.id}_13`, `${this.id}_14`]
      ];
    }
    return [];
  }

  getInternalResistancePaths() {
    const paths = [{ p1: `${this.id}_A1`, p2: `${this.id}_A2`, r: 450 }]; // Coil resistance
    if (this.state.isEnergized) {
      paths.push(
        { p1: `${this.id}_L1`, p2: `${this.id}_T1`, r: 0.05 },
        { p1: `${this.id}_L2`, p2: `${this.id}_T2`, r: 0.05 },
        { p1: `${this.id}_L3`, p2: `${this.id}_T3`, r: 0.05 },
        { p1: `${this.id}_13`, p2: `${this.id}_14`, r: 0.05 }
      );
    }
    return paths;
  }

  renderSVG() {
    const indicatorColor = this.state.isEnergized ? '#22c55e' : '#64748b';
    return `
      <g class="comp contactor-comp" id="comp_${this.id}" transform="translate(${this.x}, ${this.y})">
        <rect width="200" height="165" rx="8" fill="#334155" stroke="#0284c7" stroke-width="2"/>
        <rect x="40" y="35" width="120" height="95" rx="4" fill="#1e293b"/>

        <text x="100" y="55" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">KONTAKTOR (KM1)</text>
        <text x="100" y="70" text-anchor="middle" fill="#94a3b8" font-size="9">Koil: 220V 50Hz</text>

        <!-- Mechanical armature indicator -->
        <rect x="80" y="80" width="40" height="24" rx="3" fill="#0f172a" stroke="#64748b"/>
        <circle cx="100" cy="92" r="6" fill="${indicatorColor}"/>
        <text x="100" y="120" text-anchor="middle" fill="${indicatorColor}" font-size="9" font-weight="bold">
          ${this.state.isEnergized ? 'AKTIF (ON)' : 'LEPAS (OFF)'}
        </text>

        <!-- Pins Top -->
        ${renderPinDOM(this.pins[0], 'A1')}
        ${renderPinDOM(this.pins[2], '1/L1')}
        ${renderPinDOM(this.pins[3], '3/L2')}
        ${renderPinDOM(this.pins[4], '5/L3')}
        ${renderPinDOM(this.pins[1], 'A2')}

        <!-- Pins Bottom -->
        ${renderPinDOM(this.pins[8], '13')}
        ${renderPinDOM(this.pins[5], '2/T1')}
        ${renderPinDOM(this.pins[6], '4/T2')}
        ${renderPinDOM(this.pins[7], '6/T3')}
        ${renderPinDOM(this.pins[9], '14')}
      </g>
    `;
  }
}

// -------------------------------------------------------------
// 15. THERMAL OVERLOAD RELAY (TOR / Overload 3 Fasa)
// -------------------------------------------------------------
class ThermalOverloadRelay extends BaseComponent {
  constructor(x, y, options = {}) {
    super('tor', x, y, options);
    this.name = "Thermal Overload Relay (TOR)";
    this.state = { isTripped: false };

    this.pins = [
      // Top main pins (connect from contactor)
      { id: `${this.id}_in_1`, label: '1/L1', type: 'TOR_IN', x: 25, y: 15, color: '#8B4513' },
      { id: `${this.id}_in_2`, label: '3/L2', type: 'TOR_IN', x: 65, y: 15, color: '#111827' },
      { id: `${this.id}_in_3`, label: '5/L3', type: 'TOR_IN', x: 105, y: 15, color: '#6B7280' },

      // Bottom main pins (connect to motor)
      { id: `${this.id}_out_1`, label: '2/T1', type: 'TOR_OUT', x: 25, y: 130, color: '#8B4513' },
      { id: `${this.id}_out_2`, label: '4/T2', type: 'TOR_OUT', x: 65, y: 130, color: '#111827' },
      { id: `${this.id}_out_3`, label: '6/T3', type: 'TOR_OUT', x: 105, y: 130, color: '#6B7280' },

      // Auxiliary NC (95-96)
      { id: `${this.id}_95`, label: '95 (NC)', type: 'TOR_NC', x: 145, y: 35, color: '#ef4444' },
      { id: `${this.id}_96`, label: '96 (NC)', type: 'TOR_NC', x: 145, y: 110, color: '#ef4444' }
    ];
  }

  getInternalConnections() {
    const conns = [
      [`${this.id}_in_1`, `${this.id}_out_1`],
      [`${this.id}_in_2`, `${this.id}_out_2`],
      [`${this.id}_in_3`, `${this.id}_out_3`]
    ];
    // NC 95-96 is closed when NOT tripped
    if (!this.state.isTripped) {
      conns.push([`${this.id}_95`, `${this.id}_96`]);
    }
    return conns;
  }

  renderSVG() {
    return `
      <g class="comp tor-comp" id="comp_${this.id}" transform="translate(${this.x}, ${this.y})">
        <rect width="170" height="145" rx="8" fill="#1e293b" stroke="#f97316" stroke-width="2"/>
        <text x="85" y="60" text-anchor="middle" fill="#fdba74" font-size="11" font-weight="bold">OVERLOAD (TOR)</text>
        <text x="85" y="76" text-anchor="middle" fill="#94a3b8" font-size="9">Arus: 4.0 - 6.0 A</text>

        <!-- Reset Button -->
        <rect x="65" y="85" width="40" height="20" rx="3" fill="#0284c7" stroke="#fff" style="cursor:pointer;"
              onclick="app.resetTOR('${this.id}')"/>
        <text x="85" y="99" text-anchor="middle" fill="#fff" font-size="9" font-weight="bold" pointer-events="none">RESET</text>

        ${renderPinDOM(this.pins[0], '1')}
        ${renderPinDOM(this.pins[1], '3')}
        ${renderPinDOM(this.pins[2], '5')}
        ${renderPinDOM(this.pins[3], '2')}
        ${renderPinDOM(this.pins[4], '4')}
        ${renderPinDOM(this.pins[5], '6')}
        ${renderPinDOM(this.pins[6], '95')}
        ${renderPinDOM(this.pins[7], '96')}
      </g>
    `;
  }
}

// -------------------------------------------------------------
// 16. 3-PHASE INDUCTION MOTOR (Motor Listrik 3 Fasa)
// -------------------------------------------------------------
class Motor3P extends BaseComponent {
  constructor(x, y, options = {}) {
    super('motor3p', x, y, options);
    this.name = "Motor Induksi 3 Fasa";
    this.state = { isRunning: false, direction: 'CW', rpm: 0, statusNote: 'Standby' };

    this.pins = [
      { id: `${this.id}_U1`, label: 'U1', type: 'M_U1', x: 30, y: 150, color: '#8B4513' },
      { id: `${this.id}_V1`, label: 'V1', type: 'M_V1', x: 75, y: 150, color: '#111827' },
      { id: `${this.id}_W1`, label: 'W1', type: 'M_W1', x: 120, y: 150, color: '#6B7280' },
      { id: `${this.id}_PE`, label: 'PE (Bodi)', type: 'M_PE', x: 165, y: 150, color: '#16A34A' }
    ];
  }

  updateState(engine) {
    const potU = engine.getPinPotential(`${this.id}_U1`);
    const potV = engine.getPinPotential(`${this.id}_V1`);
    const potW = engine.getPinPotential(`${this.id}_W1`);

    const wasRunning = this.state.isRunning;

    // Check presence of 3 phases
    const hasU = potU.type === 'AC' && potU.v >= 180;
    const hasV = potV.type === 'AC' && potV.v >= 180;
    const hasW = potW.type === 'AC' && potW.v >= 180;

    if (hasU && hasV && hasW) {
      this.state.isRunning = true;
      this.state.rpm = 1440;

      // Phase sequence check (CW vs CCW)
      // Standard R=0, S=-120, T=-240
      if (potU.phase === 0 && potV.phase === -120 && potW.phase === -240) {
        this.state.direction = 'CW (Searah Jarum Jam)';
      } else if (potU.phase === 0 && potV.phase === -240 && potW.phase === -120) {
        this.state.direction = 'CCW (Terbalik / Berlawanan)';
      } else {
        this.state.direction = 'CW';
      }
      this.state.statusNote = `Berputar ${this.state.direction} ~ 1440 RPM`;
    } else if (hasU || hasV || hasW) {
      // Single phasing hazard (hilang satu fasa)
      this.state.isRunning = false;
      this.state.rpm = 0;
      this.state.statusNote = 'BAHAYA: Hilang Fasa! Motor mendengung & cepat panas!';
    } else {
      this.state.isRunning = false;
      this.state.rpm = 0;
      this.state.statusNote = 'Standby (Mati)';
    }

    if (window.sound) {
      window.sound.setMotorHum(this.state.isRunning);
    }

    return wasRunning !== this.state.isRunning;
  }

  getInternalResistancePaths() {
    return [
      { p1: `${this.id}_U1`, p2: `${this.id}_V1`, r: 12 },
      { p1: `${this.id}_V1`, p2: `${this.id}_W1`, r: 12 },
      { p1: `${this.id}_W1`, p2: `${this.id}_U1`, r: 12 }
    ];
  }

  renderSVG() {
    const rotorClass = this.state.isRunning ? 'rotor-spinning' : '';
    const statusColor = this.state.isRunning ? '#22c55e' : (this.state.statusNote.includes('BAHAYA') ? '#ef4444' : '#94a3b8');

    return `
      <g class="comp motor-comp" id="comp_${this.id}" transform="translate(${this.x}, ${this.y})">
        <!-- Motor Stator Casing -->
        <rect width="195" height="160" rx="10" fill="#334155" stroke="#64748b" stroke-width="2"/>
        <rect x="0" y="0" width="195" height="28" rx="10" fill="#1e293b"/>
        <text x="97" y="19" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">MOTOR 3-FASA (M1)</text>

        <!-- Rotor Fan -->
        <circle cx="97" cy="80" r="36" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
        <g class="${rotorClass}" transform-origin="97 80">
          <line x1="97" y1="48" x2="97" y2="112" stroke="#facc15" stroke-width="3"/>
          <line x1="65" y1="80" x2="129" y2="80" stroke="#facc15" stroke-width="3"/>
          <line x1="74" y1="57" x2="120" y2="103" stroke="#facc15" stroke-width="3"/>
          <line x1="74" y1="103" x2="120" y2="57" stroke="#facc15" stroke-width="3"/>
          <circle cx="97" cy="80" r="12" fill="#38bdf8"/>
        </g>

        <!-- Status info -->
        <text x="97" y="132" text-anchor="middle" fill="${statusColor}" font-size="9" font-weight="bold">
          ${this.state.statusNote}
        </text>

        ${renderPinDOM(this.pins[0], 'U1')}
        ${renderPinDOM(this.pins[1], 'V1')}
        ${renderPinDOM(this.pins[2], 'W1')}
        ${renderPinDOM(this.pins[3], 'PE')}
      </g>
    `;
  }
}

// -------------------------------------------------------------
// HELPER: Pin SVG DOM Renderer
// -------------------------------------------------------------
function renderPinDOM(pin, label) {
  const pinTitle = label || pin.label;
  return `
    <g class="pin-terminal" id="pin_${pin.id}" data-pin-id="${pin.id}" transform="translate(${pin.x}, ${pin.y})" style="cursor:crosshair;">
      <title>Terminal: ${pinTitle}</title>
      <!-- Large invisible circle for comfortable clicking on mouse & touch -->
      <circle cx="0" cy="0" r="16" fill="transparent" class="pin-touch-target"/>
      <!-- Visible pin terminal -->
      <circle cx="0" cy="0" r="8" fill="${pin.color || '#f59e0b'}" stroke="#ffffff" stroke-width="2.5" class="pin-hitbox"/>
      <circle cx="0" cy="0" r="3" fill="#0f172a"/>
      <text x="0" y="-12" text-anchor="middle" fill="#f1f5f9" font-size="8.5" font-weight="800" pointer-events="none" filter="drop-shadow(0 1px 2px #000)">
        ${pinTitle}
      </text>
    </g>
  `;
}

// Factory helper to construct components by type
function createComponent(type, x, y, options = {}) {
  switch (type) {
    case 'pln1p': return new SourcePLN1P(x, y, options);
    case 'pln3p': return new SourcePLN3P(x, y, options);
    case 'battery': return new BatteryDC(x, y, options);
    case 'mcb1p': return new MCB1P(x, y, options);
    case 'mcb3p': return new MCB3P(x, y, options);
    case 'switch_single': return new SingleSwitch(x, y, options);
    case 'switch_double': return new DoubleSwitch(x, y, options);
    case 'switch_hotel': return new ChangeoverSwitch(x, y, options);
    case 'bulb': return new BulbPijar(x, y, options);
    case 'outlet': return new Outlet2P(x, y, options);
    case 'kwh_meter': return new KWHMeter(x, y, options);
    case 'ground_rod': return new GroundRod(x, y, options);
    case 'push_button': return new PushButton(x, y, options);
    case 'contactor': return new MagneticContactor(x, y, options);
    case 'tor': return new ThermalOverloadRelay(x, y, options);
    case 'motor3p': return new Motor3P(x, y, options);
    default:
      console.warn('Unknown component type:', type);
      return null;
  }
}

window.createComponent = createComponent;
