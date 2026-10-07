/**
 * Main Application Controller for VoltMaster SMK
 * Enhanced with:
 * - Pan & Zoom for TV Interactive Panels, Mobile & Desktop
 * - Touch & Stylus Friendly Controls
 * - 16 Full Vocational Levels & 6 UKK Troubleshooting Cases
 * - Jobsheet & Module Import/Export System
 * - Vocational Assessment Report Generation (PDF/Print)
 * - Animated Current Flow on Energized Wires
 * - Live Step-by-Step Checklist
 */

class VoltMasterApp {
  constructor() {
    this.currentMode = 'misi'; // 'misi' | 'troubleshoot' | 'sandbox' | 'jobsheet'
    this.currentLevelIdx = 0;
    this.currentCaseIdx = 0;
    
    this.components = [];
    this.wires = [];
    
    // Wire connection in progress
    this.activeWireStart = null;
    this.mousePos = { x: 0, y: 0 };
    this.selectedWireColor = '#8B4513'; // Default Brown (PUIL Phase L/R)

    // Pan & Zoom Engine for TV Panels, Tablets, and Desktop
    this.zoomScale = 1.0;
    this.panOffset = { x: 0, y: 0 };
    this.isCanvasPanning = false;
    this.panStartPos = { x: 0, y: 0 };
    this.pinchDist = null;

    // Dragging state for components or probes
    this.draggingTarget = null;
    this.dragOffset = { x: 0, y: 0 };

    this.isTVMode = false;

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
    this.jobsheet = new JobsheetManager(this);
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
      // Menyatukan pembacaan koordinat dari Mouse, Touchscreen, atau Stylus (Pointer Events API)
      const clientX = e.clientX;
      const clientY = e.clientY;
      return {
        x: (clientX - rect.left - this.panOffset.x) / this.zoomScale,
        y: (clientY - rect.top - this.panOffset.y) / this.zoomScale,
        rawX: clientX - rect.left,
        rawY: clientY - rect.top
      };
    };

    // Canvas Background Drag for Panning (Empty space drag)
    this.svg.addEventListener('pointerdown', (e) => {
      const isBg = e.target === this.svg || (e.target.tagName === 'rect' && e.target.getAttribute('fill') === 'url(#grid)');
      if (isBg && !this.activeWireStart && !this.draggingTarget) {
        if (e.cancelable) e.preventDefault(); // Kunci untuk Touchscreen Android TV
        this.isCanvasPanning = true;
        this.panStartPos = { x: e.clientX - this.panOffset.x, y: e.clientY - this.panOffset.y };
        try { this.svg.setPointerCapture(e.pointerId); } catch(err){}
      }
    }, { passive: false });

    container.addEventListener('pointermove', (e) => {
      // Hanya aktifkan preventDefault jika kita sedang menyeret sesuatu (mencegah scroll di TV Android)
      if (this.isCanvasPanning || this.draggingTarget) {
        if (e.cancelable) e.preventDefault();
      }

      const coords = getSVGCoords(e);
      this.mousePos = { x: coords.x, y: coords.y };

      // Handle Canvas Panning
      if (this.isCanvasPanning) {
        this.panOffset.x = e.clientX - this.panStartPos.x;
        this.panOffset.y = e.clientY - this.panStartPos.y;
        this.render();
        return;
      }

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
        if (this.draggingTarget.type === 'component' && (this.currentMode === 'sandbox' || this.currentMode === 'jobsheet')) {
          const comp = this.components.find(c => c.id === this.draggingTarget.id);
          if (comp) {
            comp.x = Math.max(10, this.mousePos.x - this.dragOffset.x);
            comp.y = Math.max(10, this.mousePos.y - this.dragOffset.y);
            this.render();
            return;
          }
        }
      }

      // If drawing a wire, re-render to update dynamic wire path
      if (this.activeWireStart) {
        this.render();
      }
    }, { passive: false });

    // Handle pelepasan pointer (mouse dilepas / jari diangkat)
    const handlePointerUp = (e) => {
      this.draggingTarget = null;
      this.isCanvasPanning = false;
      try { this.svg.releasePointerCapture(e.pointerId); } catch(err){}

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
    };

    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp); // Penting untuk TV & Stylus jika interupsi sistem muncul

    // Touch Pinch-to-Zoom Support for Tablets & TV Interactive Panels
    container.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length === 2) {
        if (e.cancelable) e.preventDefault(); // Matikan zoom default Android
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (this.pinchDist !== null) {
          const diff = dist - this.pinchDist;
          if (Math.abs(diff) > 4) {
            this.zoomScale = Math.min(2.5, Math.max(0.5, this.zoomScale + diff * 0.005));
            this.updateZoomDisplay();
            this.render();
          }
        }
        this.pinchDist = dist;
      }
    }, { passive: false });

    container.addEventListener('touchend', (e) => {
      if (!e.touches || e.touches.length < 2) {
        this.pinchDist = null;
      }
    });
  }

  // -------------------------------------------------------------
  // PAN & ZOOM CONTROLS (Ideal for TV Interactive Panels & Mobile)
  // -------------------------------------------------------------
  zoomIn() {
    this.zoomScale = Math.min(2.5, Math.round((this.zoomScale + 0.15) * 100) / 100);
    this.updateZoomDisplay();
    this.render();
  }

  zoomOut() {
    this.zoomScale = Math.max(0.5, Math.round((this.zoomScale - 0.15) * 100) / 100);
    this.updateZoomDisplay();
    this.render();
  }

  resetZoom() {
    this.zoomScale = 1.0;
    this.panOffset = { x: 0, y: 0 };
    this.updateZoomDisplay();
    this.render();
  }

  fitToScreen() {
    if (this.components.length === 0) {
      this.resetZoom();
      return;
    }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    this.components.forEach(c => {
      minX = Math.min(minX, c.x);
      minY = Math.min(minY, c.y);
      maxX = Math.max(maxX, c.x + 190);
      maxY = Math.max(maxY, c.y + 160);
    });

    const rect = this.svg.getBoundingClientRect();
    const width = Math.max(200, maxX - minX + 80);
    const height = Math.max(200, maxY - minY + 80);
    const scaleX = rect.width / width;
    const scaleY = rect.height / height;

    this.zoomScale = Math.min(1.4, Math.max(0.6, Math.min(scaleX, scaleY)));
    this.panOffset.x = (rect.width - width * this.zoomScale) / 2 - minX * this.zoomScale + 40;
    this.panOffset.y = (rect.height - height * this.zoomScale) / 2 - minY * this.zoomScale + 40;

    this.updateZoomDisplay();
    this.render();
  }

  updateZoomDisplay() {
    const lbl = document.getElementById('zoom-percentage');
    if (lbl) lbl.innerText = `${Math.round(this.zoomScale * 100)}%`;
  }

  toggleTVMode() {
    this.isTVMode = !this.isTVMode;
    document.body.classList.toggle('tv-mode', this.isTVMode);
    const btn = document.getElementById('btn-tv-mode');
    if (btn) btn.classList.toggle('active', this.isTVMode);
    this.render();
  }

  toggleMobileSidebar(force) {
    const sb = document.querySelector('.sidebar');
    if (sb) {
      if (force !== undefined) sb.classList.toggle('open', force);
      else sb.classList.toggle('open');
    }
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
    let minDist = 30;

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
    this.updateChecklistUI();
  }

  switchTab(tabName) {
    this.currentMode = tabName;
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.getElementById(`tab-${tabName}`);
    if (activeTab) activeTab.classList.add('active');

    // Toggle panels
    const missionPanel = document.getElementById('mission-info-panel');
    const troublePanel = document.getElementById('troubleshoot-tools-panel');
    const sandboxPanel = document.getElementById('sandbox-tools-panel');
    const jobsheetPanel = document.getElementById('jobsheet-tools-panel');

    if (missionPanel) missionPanel.style.display = (tabName === 'misi') ? 'block' : 'none';
    if (troublePanel) troublePanel.style.display = (tabName === 'troubleshoot') ? 'block' : 'none';
    if (sandboxPanel) sandboxPanel.style.display = (tabName === 'sandbox') ? 'block' : 'none';
    if (jobsheetPanel) jobsheetPanel.style.display = (tabName === 'jobsheet') ? 'block' : 'none';

    // Close mobile drawer on tab switch
    this.toggleMobileSidebar(false);

    if (tabName === 'misi') {
      this.loadLevel(this.currentLevelIdx);
    } else if (tabName === 'troubleshoot') {
      this.loadTroubleshootCase(this.currentCaseIdx);
    } else if (tabName === 'sandbox') {
      this.sandbox.loadTemplate('simple_lamp');
    } else if (tabName === 'jobsheet') {
      this.jobsheet.populateJobsheetSelector();
      this.jobsheet.loadJobsheet(BUILTIN_JOBSHEETS[0].id);
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

    // Update level buttons
    document.querySelectorAll('.btn-lvl').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === this.currentLevelIdx);
      btn.classList.toggle('completed', !!this.progress.completedLevels[idx + 1]);
    });

    this.recalculate();
    this.fitToScreen();
    this.updateChecklistUI();
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
    this.fitToScreen();
  }

  loadCircuitState(components, wires) {
    this.components = components;
    this.wires = wires;
    this.activeWireStart = null;
    this.recalculate();
    this.fitToScreen();
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
    } else if (this.currentMode === 'jobsheet' && this.jobsheet.activeJobsheet) {
      this.jobsheet.loadJobsheet(this.jobsheet.activeJobsheet.id);
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
      this.updateChecklistUI();
    }
  }

  deleteWire(wireIdx) {
    this.wires.splice(wireIdx, 1);
    this.recalculate();
    this.render();
    this.updateChecklistUI();
  }

  toggleComponent(compId, extraParam) {
    const comp = this.components.find(c => c.id === compId);
    if (comp) {
      if (comp.type === 'mcb1p' || comp.type === 'mcb3p' || comp.type === 'elcb') {
        comp.toggle();
      } else if (comp.type === 'switch_single' || comp.type === 'switch_hotel' || comp.type === 'switch_cross') {
        comp.toggle();
      } else if (comp.type === 'switch_double') {
        comp.toggleSwitch(extraParam);
      }
      this.recalculate();
      this.render();
      this.updateChecklistUI();
    }
  }

  testTripELCB(compId) {
    const comp = this.components.find(c => c.id === compId);
    if (comp && comp.testTrip) {
      comp.testTrip();
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
      this.updateChecklistUI();
    }
  }

  releasePushButton(compId) {
    const comp = this.components.find(c => c.id === compId);
    if (comp && comp.release) {
      comp.release();
      this.recalculate();
      this.render();
      this.updateChecklistUI();
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
    if (e.cancelable) e.preventDefault(); // Hentikan gestur sentuh lain saat mulai drag
    
    // Pointer capture agar jari tidak lepas dari komponen saat digeser cepat
    try { e.target.setPointerCapture(e.pointerId); } catch(err){}
    
    const rect = this.svg.getBoundingClientRect();
    const clientX = e.clientX; // PointerEvent otomatis menyatukan koordinat
    const clientY = e.clientY;
    const mouseX = (clientX - rect.left - this.panOffset.x) / this.zoomScale;

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
  }

  checkShortCircuitBanner() {
    const banner = document.getElementById('short-circuit-alert');
    if (banner) {
      banner.style.display = this.engine.isShortCircuit ? 'flex' : 'none';
    }
  }

  updateChecklistUI() {
    const container = document.getElementById('live-checklist-container');
    if (!container) return;

    if (this.currentMode === 'misi') {
      const lvl = GAME_LEVELS[this.currentLevelIdx];
      if (!lvl || !lvl.checklist) {
        container.innerHTML = '';
        return;
      }

      container.innerHTML = `
        <div class="checklist-header">
          <span>📋 Langkah Pengerjaan (Live SOP)</span>
        </div>
        ${lvl.checklist.map((item) => {
          const isDone = item.check(this.engine, this.multimeter);
          return `
            <div class="checklist-item ${isDone ? 'done' : ''}">
              <div class="chk-box">${isDone ? '✓' : ''}</div>
              <div class="chk-label">${item.text}</div>
            </div>
          `;
        }).join('')}
      `;
    }
  }

  // -------------------------------------------------------------
  // VERIFICATION & ASSESSMENT
  // -------------------------------------------------------------
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
        this.showModal(`Level ${lvl.id} Selesai! 🎉`, result.feedback, true);
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
    } else if (this.currentMode === 'jobsheet') {
      if (this.engine.isShortCircuit) {
        this.showModal("Hasil Pemeriksaan Jobsheet", "Terjadi korsleting hubung singkat! Segera periksa jalur fasa dan netral!", false);
      } else {
        if (window.sound) window.sound.playSuccess();
        this.showModal("Jobsheet Selesai! 🎓", "Seluruh pengawatan berhasil dirakit dan berfungsi optimal tanpa hubung singkat. Anda dapat mencetak lembar penilaian resmi praktikum sekarang!", true);
      }
    }
  }

  nextLevel() {
    this.closeModal();
    if (this.currentMode === 'misi') {
      if (this.currentLevelIdx < GAME_LEVELS.length - 1) {
        this.loadLevel(this.currentLevelIdx + 1);
      } else {
        alert("Luar biasa! Anda telah menyelesaikan seluruh 16 level kejuruan!");
      }
    } else if (this.currentMode === 'troubleshoot') {
      if (this.currentCaseIdx < TROUBLESHOOTING_CASES.length - 1) {
        this.loadTroubleshootCase(this.currentCaseIdx + 1);
      } else {
        alert("Selamat! Semua kasus troubleshooting berhasil Anda selesaikan!");
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

  showSchematicModal() {
    let schematic = null;
    if (this.currentMode === 'misi') {
      schematic = GAME_LEVELS[this.currentLevelIdx]?.schematic;
    } else if (this.currentMode === 'jobsheet' && this.jobsheet.activeJobsheet) {
      schematic = {
        title: this.jobsheet.activeJobsheet.title,
        desc: this.jobsheet.activeJobsheet.schematicDesc,
        svg: this.jobsheet.activeJobsheet.schematicSVG
      };
    }

    if (!schematic) return;

    const modal = document.getElementById('schematic-modal');
    const titleEl = document.getElementById('schematic-title');
    const descEl = document.getElementById('schematic-desc');
    const bodyEl = document.getElementById('schematic-body');

    if (titleEl) titleEl.innerText = `📐 ${schematic.title}`;
    if (descEl) descEl.innerHTML = schematic.desc;
    if (bodyEl) bodyEl.innerHTML = schematic.svg;

    if (modal) modal.classList.add('open');
  }

  closeSchematicModal() {
    const modal = document.getElementById('schematic-modal');
    if (modal) modal.classList.remove('open');
  }

  showOnboardingModal() {
    const modal = document.getElementById('onboarding-modal');
    if (modal) modal.classList.add('open');
  }

  closeOnboardingModal() {
    const modal = document.getElementById('onboarding-modal');
    if (modal) modal.classList.remove('open');
  }

  openImportJobsheetModal() {
    const modal = document.getElementById('import-jobsheet-modal');
    if (modal) modal.classList.add('open');
  }

  closeImportJobsheetModal() {
    const modal = document.getElementById('import-jobsheet-modal');
    if (modal) modal.classList.remove('open');
  }

  openPrintReportModal() {
    const modal = document.getElementById('report-modal');
    const container = document.getElementById('report-paper-container');
    if (container && this.jobsheet) {
      const studentName = document.getElementById('student-name-input')?.value || 'Siswa SMK';
      const studentClass = document.getElementById('student-class-input')?.value || 'X TITL 1';
      container.innerHTML = this.jobsheet.generateAssessmentReport(studentName, studentClass, 96);
    }
    if (modal) modal.classList.add('open');
  }

  closeReportModal() {
    const modal = document.getElementById('report-modal');
    if (modal) modal.classList.remove('open');
  }

  printReport() {
    window.print();
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  updateStatsUI() {
    const xpEl = document.getElementById('total-xp');
    const completedLvlCount = Object.keys(this.progress.completedLevels).length;
    const completedCaseCount = Object.keys(this.progress.completedCases).length;
    const progressEl = document.getElementById('overall-progress');

    if (xpEl) xpEl.innerText = `${this.progress.totalXP} XP`;
    if (progressEl) {
      const totalItems = GAME_LEVELS.length + TROUBLESHOOTING_CASES.length;
      const pct = Math.round(((completedLvlCount + completedCaseCount) / totalItems) * 100);
      progressEl.innerText = `${pct}% Selesai`;
    }
  }

  // -------------------------------------------------------------
  // MAIN RENDER LOOP: SVG Workbench
  // -------------------------------------------------------------
  render() {
    if (!this.svg) return;

    let svgHtml = '';

    // 1. Grid Background (Always fills canvas)
    svgHtml += `
      <defs>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#334155" opacity="0.6"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" style="cursor:${this.isCanvasPanning ? 'grabbing' : 'grab'};"/>
    `;

    // 2. Viewport Transform Group (Scales & Pans all elements)
    svgHtml += `<g id="viewport-group" transform="translate(${this.panOffset.x}, ${this.panOffset.y}) scale(${this.zoomScale})">`;

    // 2A. Render Existing Wires (Bézier curves for realistic panel cabling)
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

        // Check if wire carries active current (animated dashed particle flow)
        const isCurrentFlowing = this.engine.isWireEnergized(wire);

        svgHtml += `
          <g class="wire-group ${isCurrentFlowing ? 'wire-energized' : ''}" onclick="app.deleteWire(${idx})" style="cursor:pointer;" title="Klik untuk menghapus kabel ini">
            <!-- Fat invisible stroke for easy clicking on touch & mouse -->
            <path d="${pathData}" fill="none" stroke="transparent" stroke-width="18"/>
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

    // 2B. Render In-Progress Wire
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

    // 2C. Render Components
    this.components.forEach(comp => {
      svgHtml += comp.renderSVG();
    });

    // 2D. Render Multimeter Probes & Tespen
    svgHtml += this.multimeter.renderProbesSVG();

    // Close Viewport Group
    svgHtml += `</g>`;

    this.svg.innerHTML = svgHtml;

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

      // Draggable components in sandbox and jobsheet
      const compEl = document.getElementById(`comp_${comp.id}`);
      if (compEl && (this.currentMode === 'sandbox' || this.currentMode === 'jobsheet')) {
        compEl.style.cursor = 'move';
        compEl.addEventListener('pointerdown', (e) => {
          if (e.target.closest('.pin-terminal') || e.target.closest('.mcb-lever') || e.target.tagName === 'circle') return;
          this.startDragging('component', comp.id, e);
        });
      }
    });

    // Attach probe dragging handlers
    const probeRedEl = document.getElementById('probe_red');
    if (probeRedEl) {
      probeRedEl.addEventListener('pointerdown', (e) => this.startDragging('probe_red', null, e));
    }

    const probeBlackEl = document.getElementById('probe_black');
    if (probeBlackEl) {
      probeBlackEl.addEventListener('pointerdown', (e) => this.startDragging('probe_black', null, e));
    }

    const tespenEl = document.getElementById('tespen_tool');
    if (tespenEl) {
      tespenEl.addEventListener('pointerdown', (e) => this.startDragging('tespen', null, e));
    }
  }
}

// Global bootstrap
window.addEventListener('DOMContentLoaded', () => {
  window.app = new VoltMasterApp();
});
