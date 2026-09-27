/**
 * Main Application Controller for VoltMaster SMK
 * Enhanced with Live Checklist tracking, Schematic Blueprint viewer,
 * Interactive Onboarding, Terminal Tooltips, and Animated Current Flow.
 */

class VoltMasterApp {
  constructor() {
    this.currentMode = 'misi'; // 'misi' | 'troubleshoot' | 'sandbox'
    this.currentLevelIdx = 0;
    this.currentCaseIdx = 0;
    
    this.components = [];
    this.wires = [];
    
    // Wire connection in progress
    this.activeWireStart = null;
    this.mousePos = { x: 0, y: 0 };
    this.selectedWireColor = '#8B4513'; // Default Brown (PUIL Phase L/R)

    // Dragging state for components or probes
    this.draggingTarget = null;
    this.dragOffset = { x: 0, y: 0 };

    this.engine = new CircuitEngine();
    window.circuitEngine = this.engine;

    // Student progress state
    this.progress = this.loadProgress();

    this.init();
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('voltmaster_smk_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      completedLevels: {},
      completedCases: {},
      totalXP: 0,
      hasSeenIntro: false
    };
  }

  saveProgress() {
    try {
      localStorage.setItem('voltmaster_smk_progress', JSON.stringify(this.progress));
    } catch (e) {}
    this.updateStatsUI();
  }

  init() {
    this.svg = document.getElementById('workbench-svg');
    this.sandbox = new SandboxManager(this);
    this.multimeter = new MultimeterTool(document.getElementById('workbench-container'));

    this.setupEventListeners();
    this.loadLevel(0);
    this.updateStatsUI();

    // Show onboarding for first-time student
    if (!this.progress.hasSeenIntro) {
      setTimeout(() => this.showOnboardingModal(), 600);
      this.progress.hasSeenIntro = true;
      this.saveProgress();
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.render());

    const container = document.getElementById('workbench-container');

    const getSVGCoords = (e) => {
      const rect = this.svg.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    container.addEventListener('mousemove', (e) => {
      this.mousePos = getSVGCoords(e);

      // Handle probe dragging
      if (this.draggingTarget) {
        if (this.draggingTarget.type === 'probe_red') {
          this.multimeter.probeRed.x = this.mousePos.x - this.dragOffset.x;
          this.multimeter.probeRed.y = this.mousePos.y - this.dragOffset.y;
          this.checkProbeSnap('red');
          this.render();
          return;
        }
        if (this.draggingTarget.type === 'probe_black') {
          this.multimeter.probeBlack.x = this.mousePos.x - this.dragOffset.x;
          this.multimeter.probeBlack.y = this.mousePos.y - this.dragOffset.y;
          this.checkProbeSnap('black');
          this.render();
          return;
        }
        if (this.draggingTarget.type === 'tespen') {
          this.multimeter.tespenPos.x = this.mousePos.x - this.dragOffset.x;
          this.multimeter.tespenPos.y = this.mousePos.y - this.dragOffset.y;
          this.checkProbeSnap('tespen');
          this.render();
          return;
        }
        if (this.draggingTarget.type === 'component' && this.currentMode === 'sandbox') {
          const comp = this.components.find(c => c.id === this.draggingTarget.id);
          if (comp) {
            comp.x = Math.max(10, this.mousePos.x - this.dragOffset.x);
            comp.y = Math.max(10, this.mousePos.y - this.dragOffset.y);
            this.render();
            return;
          }
        }
      }

      if (this.activeWireStart) {
        this.render();
      }
    });

    window.addEventListener('mouseup', () => {
      this.draggingTarget = null;
      let anyReleased = false;
      this.components.forEach(c => {
        if (c.type === 'push_button' && c.state.isPressed) {
          c.release();
          anyReleased = true;
        }
      });
      if (anyReleased) {
        this.recalculate();
        this.render();
      }
    });

    window.addEventListener('touchend', () => {
      this.draggingTarget = null;
      let anyReleased = false;
      this.components.forEach(c => {
        if (c.type === 'push_button' && c.state.isPressed) {
          c.release();
          anyReleased = true;
        }
      });
      if (anyReleased) {
        this.recalculate();
        this.render();
      }
    });

    // Touch support for drag
    container.addEventListener('touchmove', (e) => {
      if (this.draggingTarget || this.activeWireStart) {
        e.preventDefault();
        this.mousePos = getSVGCoords(e);
        if (this.draggingTarget) {
          if (this.draggingTarget.type === 'probe_red') {
            this.multimeter.probeRed.x = this.mousePos.x;
            this.multimeter.probeRed.y = this.mousePos.y;
            this.checkProbeSnap('red');
          } else if (this.draggingTarget.type === 'probe_black') {
            this.multimeter.probeBlack.x = this.mousePos.x;
            this.multimeter.probeBlack.y = this.mousePos.y;
            this.checkProbeSnap('black');
          } else if (this.draggingTarget.type === 'tespen') {
            this.multimeter.tespenPos.x = this.mousePos.x;
            this.multimeter.tespenPos.y = this.mousePos.y;
            this.checkProbeSnap('tespen');
          }
          this.render();
        }
      }
    }, { passive: false });

    // PUIL color selector buttons
    document.querySelectorAll('.wire-color-swatch').forEach(el => {
      el.addEventListener('click', (e) => {
        document.querySelectorAll('.wire-color-swatch').forEach(s => s.classList.remove('active'));
        el.classList.add('active');
        this.selectedWireColor = el.dataset.color;
      });
    });
  }

  checkProbeSnap(probeType) {
    let probeX, probeY;
    if (probeType === 'red') {
      probeX = this.multimeter.probeRed.x;
      probeY = this.multimeter.probeRed.y;
    } else if (probeType === 'black') {
      probeX = this.multimeter.probeBlack.x;
      probeY = this.multimeter.probeBlack.y;
    } else if (probeType === 'tespen') {
      probeX = this.multimeter.tespenPos.x;
      probeY = this.multimeter.tespenPos.y;
    }

    let closestPin = null;
    let minDist = 28;

    this.components.forEach(comp => {
      comp.pins.forEach(pin => {
        const absPos = comp.getPinAbsolutePos(pin.id);
        const dist = Math.hypot(probeX - absPos.x, probeY - absPos.y);
        if (dist < minDist) {
          closestPin = pin.id;
          minDist = dist;
        }
      });
    });

    if (probeType === 'red') {
      this.multimeter.probeRed.attachedPin = closestPin;
    } else if (probeType === 'black') {
      this.multimeter.probeBlack.attachedPin = closestPin;
    } else if (probeType === 'tespen') {
      this.multimeter.tespenPos.attachedPin = closestPin;
    }

    this.multimeter.evaluate();
  }

  switchTab(tabName) {
    this.currentMode = tabName;
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.getElementById(`tab-${tabName}`);
    if (activeTab) activeTab.classList.add('active');

    const missionPanel = document.getElementById('mission-info-panel');
    const sandboxPanel = document.getElementById('sandbox-tools-panel');
    const troublePanel = document.getElementById('troubleshoot-tools-panel');

    if (missionPanel) missionPanel.style.display = (tabName === 'misi') ? 'block' : 'none';
    if (sandboxPanel) sandboxPanel.style.display = (tabName === 'sandbox') ? 'block' : 'none';
    if (troublePanel) troublePanel.style.display = (tabName === 'troubleshoot') ? 'block' : 'none';

    if (tabName === 'misi') {
      this.loadLevel(this.currentLevelIdx);
    } else if (tabName === 'troubleshoot') {
      this.loadTroubleshootCase(this.currentCaseIdx);
    } else if (tabName === 'sandbox') {
      this.sandbox.loadTemplate('simple_lamp');
    }
  }

  loadLevel(levelIdx) {
    this.currentLevelIdx = Math.max(0, Math.min(levelIdx, GAME_LEVELS.length - 1));
    const lvl = GAME_LEVELS[this.currentLevelIdx];

    const titleEl = document.getElementById('mission-title');
    const objEl = document.getElementById('mission-objective');
    const theoryEl = document.getElementById('mission-theory');
    const badgeEl = document.getElementById('mission-badge');

    if (titleEl) titleEl.innerText = lvl.title;
    if (objEl) objEl.innerHTML = lvl.objective;
    if (theoryEl) theoryEl.innerHTML = lvl.theory;
    if (badgeEl) badgeEl.innerText = `${lvl.category} • ${lvl.difficulty}`;

    this.multimeter.isTespenActive = lvl.toolsNeeded.includes('tespen') || true;

    this.components = lvl.components.map(c => createComponent(c.type, c.x, c.y, c.options || {}));
    this.wires = (lvl.initialWires || []).map(w => ({ ...w }));
    this.activeWireStart = null;

    // Update level button active classes
    document.querySelectorAll('.btn-lvl').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === this.currentLevelIdx);
      btn.classList.toggle('completed', !!this.progress.completedLevels[idx + 1]);
    });

    this.recalculate();
    this.render();
  }

  loadTroubleshootCase(caseIdx) {
    this.currentCaseIdx = Math.max(0, Math.min(caseIdx, TROUBLESHOOTING_CASES.length - 1));
    const cs = TROUBLESHOOTING_CASES[this.currentCaseIdx];

    const titleEl = document.getElementById('trouble-title');
    const scenEl = document.getElementById('trouble-scenario');
    const hintEl = document.getElementById('trouble-hint');

    if (titleEl) titleEl.innerText = cs.title;
    if (scenEl) scenEl.innerHTML = cs.scenario;
    if (hintEl) hintEl.innerHTML = cs.hint;

    this.components = cs.components.map(c => createComponent(c.type, c.x, c.y, c.options || {}));
    this.wires = (cs.initialWires || []).map(w => ({ ...w }));
    this.activeWireStart = null;

    this.recalculate();
    this.render();
  }

  loadCircuitState(components, wires) {
    this.components = components;
    this.wires = wires;
    this.activeWireStart = null;
    this.recalculate();
    this.render();
  }

  addSandboxComponent(type) {
    const newComp = createComponent(type, 180 + Math.random() * 80, 150 + Math.random() * 60);
    if (newComp) {
      this.components.push(newComp);
      this.recalculate();
      this.render();
    }
  }

  clearWorkbench() {
    if (confirm("Kosongkan meja kerja dan semua kabel?")) {
      this.components = [];
      this.wires = [];
      this.activeWireStart = null;
      this.recalculate();
      this.render();
    }
  }

  resetCurrentLevel() {
    if (this.currentMode === 'misi') {
      this.loadLevel(this.currentLevelIdx);
    } else if (this.currentMode === 'troubleshoot') {
      this.loadTroubleshootCase(this.currentCaseIdx);
    }
  }

  undoWire() {
    if (this.wires.length > 0) {
      this.wires.pop();
      this.recalculate();
      this.render();
    }
  }

  onPinClick(pinId) {
    if (!this.activeWireStart) {
      this.activeWireStart = pinId;
      if (window.sound) window.sound.playConnect();
      this.render();
    } else {
      if (this.activeWireStart !== pinId) {
        const exists = this.wires.some(
          w => (w.from === this.activeWireStart && w.to === pinId) ||
               (w.from === pinId && w.to === this.activeWireStart)
        );

        if (!exists) {
          this.wires.push({
            from: this.activeWireStart,
            to: pinId,
            color: this.selectedWireColor
          });
          if (window.sound) window.sound.playConnect();
        }
      }
      this.activeWireStart = null;
      this.recalculate();
      this.render();
    }
  }

  deleteWire(wireIdx) {
    this.wires.splice(wireIdx, 1);
    this.recalculate();
    this.render();
  }

  toggleComponent(compId, extraParam) {
    const comp = this.components.find(c => c.id === compId);
    if (comp) {
      if (comp.type === 'mcb1p' || comp.type === 'mcb3p') {
        comp.toggle();
      } else if (comp.type === 'switch_single' || comp.type === 'switch_hotel') {
        comp.toggle();
      } else if (comp.type === 'switch_double') {
        comp.toggleSwitch(extraParam);
      }
      this.recalculate();
      this.render();
    }
  }

  pressPushButton(compId) {
    const comp = this.components.find(c => c.id === compId);
    if (comp && comp.press) {
      comp.press();
      this.recalculate();
      this.render();
    }
  }

  releasePushButton(compId) {
    const comp = this.components.find(c => c.id === compId);
    if (comp && comp.release) {
      comp.release();
      this.recalculate();
      this.render();
    }
  }

  resetTOR(compId) {
    const comp = this.components.find(c => c.id === compId);
    if (comp) {
      comp.state.isTripped = false;
      this.recalculate();
      this.render();
    }
  }

  startDragging(targetType, id, e) {
    const rect = this.svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    let targetX = 0, targetY = 0;
    if (targetType === 'probe_red') {
      targetX = this.multimeter.probeRed.x;
      targetY = this.multimeter.probeRed.y;
    } else if (targetType === 'probe_black') {
      targetX = this.multimeter.probeBlack.x;
      targetY = this.multimeter.probeBlack.y;
    } else if (targetType === 'tespen') {
      targetX = this.multimeter.tespenPos.x;
      targetY = this.multimeter.tespenPos.y;
    } else if (targetType === 'component') {
      const comp = this.components.find(c => c.id === id);
      if (comp) {
        targetX = comp.x;
        targetY = comp.y;
      }
    }

    this.draggingTarget = { type: targetType, id };
    this.dragOffset = {
      x: mouseX - targetX,
      y: mouseY - targetY
    };
  }

  recalculate() {
    this.engine.setCircuit(this.components, this.wires);
    this.multimeter.evaluate();
    this.checkShortCircuitBanner();
    this.updateChecklistUI();
  }

  // Evaluates live checklist and renders the step progress
  updateChecklistUI() {
    const container = document.getElementById('live-checklist-container');
    if (!container) return;

    if (this.currentMode !== 'misi') {
      container.style.display = 'none';
      return;
    }

    const lvl = GAME_LEVELS[this.currentLevelIdx];
    if (!lvl.checklist || lvl.checklist.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';

    let doneCount = 0;
    let html = `
      <div class="checklist-header">
        <span>📋 LANGKAH KERJA PRAKTIK</span>
        <span class="checklist-counter" id="chk-counter">0/${lvl.checklist.length}</span>
      </div>
      <div class="checklist-items">
    `;

    lvl.checklist.forEach(item => {
      const isDone = item.check(this.engine, this.multimeter);
      if (isDone) doneCount++;
      const itemClass = isDone ? 'chk-item completed' : 'chk-item pending';
      const checkIcon = isDone ? '✅' : '⚪';

      html += `
        <div class="${itemClass}">
          <span class="chk-icon">${checkIcon}</span>
          <span class="chk-text">${item.text}</span>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    const counterEl = document.getElementById('chk-counter');
    if (counterEl) counterEl.innerText = `${doneCount}/${lvl.checklist.length}`;
  }

  checkShortCircuitBanner() {
    const banner = document.getElementById('short-circuit-alert');
    if (banner) {
      banner.style.display = this.engine.isShortCircuit ? 'flex' : 'none';
    }
  }

  verifyCircuit() {
    let result = { passed: false, feedback: "" };

    if (this.currentMode === 'misi') {
      const lvl = GAME_LEVELS[this.currentLevelIdx];
      result = lvl.checkCompletion(this.engine, this.multimeter);
      if (result.passed) {
        if (!this.progress.completedLevels[lvl.id]) {
          this.progress.completedLevels[lvl.id] = true;
          this.progress.totalXP += 100;
          this.saveProgress();
        }
        if (window.sound) window.sound.playSuccess();
        this.showModal("Level Selesai! 🎉", result.feedback, true);
      } else {
        this.showModal("Pemeriksaan Rangkaian", result.feedback, false);
      }
    } else if (this.currentMode === 'troubleshoot') {
      const cs = TROUBLESHOOTING_CASES[this.currentCaseIdx];
      result = cs.checkCompletion(this.engine);
      if (result.passed) {
        if (!this.progress.completedCases[cs.id]) {
          this.progress.completedCases[cs.id] = true;
          this.progress.totalXP += 150;
          this.saveProgress();
        }
        if (window.sound) window.sound.playSuccess();
        this.showModal("Troubleshooting Sukses! 🛠️", result.feedback, true);
      } else {
        this.showModal("Hasil Diagnosa", result.feedback, false);
      }
    }
  }

  nextLevel() {
    this.closeModal();
    if (this.currentMode === 'misi') {
      if (this.currentLevelIdx < GAME_LEVELS.length - 1) {
        this.loadLevel(this.currentLevelIdx + 1);
      } else {
        alert("Selamat! Kamu telah menyelesaikan semua tingkatan kejuruan!");
      }
    } else if (this.currentMode === 'troubleshoot') {
      if (this.currentCaseIdx < TROUBLESHOOTING_CASES.length - 1) {
        this.loadTroubleshootCase(this.currentCaseIdx + 1);
      } else {
        alert("Selamat! Seluruh kasus troubleshooting berhasil dipecahkan!");
      }
    }
  }

  showModal(title, message, isSuccess) {
    const modal = document.getElementById('feedback-modal');
    const titleEl = document.getElementById('modal-title');
    const msgEl = document.getElementById('modal-message');
    const nextBtn = document.getElementById('modal-next-btn');

    if (titleEl) titleEl.innerText = title;
    if (msgEl) msgEl.innerHTML = message;
    if (nextBtn) nextBtn.style.display = isSuccess ? 'inline-block' : 'none';

    if (modal) modal.classList.add('open');
  }

  closeModal() {
    const modal = document.getElementById('feedback-modal');
    if (modal) modal.classList.remove('open');
  }

  // Opens schematic blueprint viewer
  showSchematicModal() {
    const modal = document.getElementById('schematic-modal');
    const titleEl = document.getElementById('schematic-title');
    const descEl = document.getElementById('schematic-desc');
    const bodyEl = document.getElementById('schematic-body');

    const lvl = GAME_LEVELS[this.currentLevelIdx];
    if (lvl && lvl.schematic) {
      if (titleEl) titleEl.innerText = `📐 Skema Rangkaian: ${lvl.title}`;
      if (descEl) descEl.innerHTML = lvl.schematic.desc;
      if (bodyEl) bodyEl.innerHTML = lvl.schematic.svg;
    }
    if (modal) modal.classList.add('open');
  }

  closeSchematicModal() {
    const modal = document.getElementById('schematic-modal');
    if (modal) modal.classList.remove('open');
  }

  // Onboarding Tutorial Modal
  showOnboardingModal() {
    const modal = document.getElementById('onboarding-modal');
    if (modal) modal.classList.add('open');
  }

  closeOnboardingModal() {
    const modal = document.getElementById('onboarding-modal');
    if (modal) modal.classList.remove('open');
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.warn(err));
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
    }
  }

  updateStatsUI() {
    const xpEl = document.getElementById('total-xp');
    const completedLvlCount = Object.keys(this.progress.completedLevels).length;
    const completedCaseCount = Object.keys(this.progress.completedCases).length;
    const progressEl = document.getElementById('overall-progress');

    if (xpEl) xpEl.innerText = `${this.progress.totalXP} XP`;
    if (progressEl) {
      const pct = Math.round(((completedLvlCount + completedCaseCount) / (GAME_LEVELS.length + TROUBLESHOOTING_CASES.length)) * 100);
      progressEl.innerText = `${pct}% Selesai`;
    }
  }

  // -------------------------------------------------------------
  // MAIN RENDER LOOP: SVG Workbench
  // -------------------------------------------------------------
  render() {
    if (!this.svg) return;

    let svgHtml = '';

    // 1. Grid Background
    svgHtml += `
      <defs>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#334155" opacity="0.65"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    `;

    // 2. Render Existing Wires (Bézier curves for realistic panel cabling)
    this.wires.forEach((wire, idx) => {
      let p1 = null, p2 = null;
      for (const comp of this.components) {
        if (comp.getPin(wire.from)) p1 = comp.getPinAbsolutePos(wire.from);
        if (comp.getPin(wire.to)) p2 = comp.getPinAbsolutePos(wire.to);
      }

      if (p1 && p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const sag = Math.min(80, Math.hypot(dx, dy) * 0.18);
        const cp1x = p1.x + dx * 0.25;
        const cp1y = p1.y + dy * 0.25 + sag;
        const cp2x = p1.x + dx * 0.75;
        const cp2y = p1.y + dy * 0.75 + sag;

        const pathData = `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;

        // Check if wire carries active current (animated dashes)
        const potFrom = this.engine.getPinPotential(wire.from);
        const potTo = this.engine.getPinPotential(wire.to);
        const isCurrentFlowing = (potFrom.type === 'AC' && potFrom.v >= 100) || (potTo.type === 'AC' && potTo.v >= 100);

        svgHtml += `
          <g class="wire-group" onclick="app.deleteWire(${idx})" style="cursor:pointer;" title="Klik untuk menghapus kabel">
            <!-- Fat invisible stroke for easy clicking -->
            <path d="${pathData}" fill="none" stroke="transparent" stroke-width="16"/>
            <!-- Outline shadow -->
            <path d="${pathData}" fill="none" stroke="#000" stroke-width="7" opacity="0.45"/>
            <!-- Main Wire -->
            <path d="${pathData}" fill="none" stroke="${wire.color || '#8B4513'}" stroke-width="4.5" stroke-linecap="round"/>
            ${isCurrentFlowing ? `
              <!-- Animated current flow particle dash -->
              <path d="${pathData}" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="5,12" stroke-linecap="round" class="wire-current-anim"/>
            ` : ''}
          </g>
        `;
      }
    });

    // 3. Render In-Progress Wire
    if (this.activeWireStart) {
      let p1 = null;
      for (const comp of this.components) {
        if (comp.getPin(this.activeWireStart)) {
          p1 = comp.getPinAbsolutePos(this.activeWireStart);
          break;
        }
      }

      if (p1) {
        const p2 = this.mousePos;
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const sag = Math.min(60, Math.hypot(dx, dy) * 0.15);
        const cp1x = p1.x + dx * 0.25;
        const cp1y = p1.y + dy * 0.25 + sag;
        const cp2x = p1.x + dx * 0.75;
        const cp2y = p1.y + dy * 0.75 + sag;

        const pathData = `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;

        svgHtml += `
          <!-- Active wire halo pulse -->
          <circle cx="${p1.x}" cy="${p1.y}" r="15" fill="none" stroke="${this.selectedWireColor}" stroke-width="2.5" class="rotor-spinning" stroke-dasharray="4,4"/>
          <path d="${pathData}" fill="none" stroke="${this.selectedWireColor}" stroke-width="3.5" stroke-dasharray="6,4" stroke-linecap="round"/>
        `;
      }
    }

    // 4. Render Components
    this.components.forEach(comp => {
      svgHtml += comp.renderSVG();
    });

    // 5. Render Multimeter Probes & Tespen
    svgHtml += this.multimeter.renderProbesSVG();

    this.svg.innerHTML = svgHtml;

    // Click empty SVG space to cancel active wire in progress
    this.svg.onmousedown = (e) => {
      if (e.target === this.svg || (e.target.tagName === 'rect' && e.target.getAttribute('fill') === 'url(#grid)')) {
        if (this.activeWireStart) {
          this.activeWireStart = null;
          this.render();
        }
      }
    };

    // Attach pin click handlers dynamically
    this.components.forEach(comp => {
      comp.pins.forEach(pin => {
        const pinEl = document.getElementById(`pin_${pin.id}`);
        if (pinEl) {
          pinEl.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onPinClick(pin.id);
          });
        }
      });

      // Sandbox draggable components
      const compEl = document.getElementById(`comp_${comp.id}`);
      if (compEl && this.currentMode === 'sandbox') {
        compEl.style.cursor = 'move';
        compEl.addEventListener('mousedown', (e) => {
          if (e.target.closest('.pin-terminal') || e.target.closest('.mcb-lever') || e.target.tagName === 'circle') return;
          this.startDragging('component', comp.id, e);
        });
      }
    });

    // Attach probe dragging handlers
    const probeRedEl = document.getElementById('probe_red');
    if (probeRedEl) {
      probeRedEl.addEventListener('mousedown', (e) => this.startDragging('probe_red', null, e));
      probeRedEl.addEventListener('touchstart', (e) => this.startDragging('probe_red', null, e));
    }

    const probeBlackEl = document.getElementById('probe_black');
    if (probeBlackEl) {
      probeBlackEl.addEventListener('mousedown', (e) => this.startDragging('probe_black', null, e));
      probeBlackEl.addEventListener('touchstart', (e) => this.startDragging('probe_black', null, e));
    }

    const tespenEl = document.getElementById('tespen_tool');
    if (tespenEl) {
      tespenEl.addEventListener('mousedown', (e) => this.startDragging('tespen', null, e));
      tespenEl.addEventListener('touchstart', (e) => this.startDragging('tespen', null, e));
    }
  }
}

// Global bootstrap
window.addEventListener('DOMContentLoaded', () => {
  window.app = new VoltMasterApp();
});
