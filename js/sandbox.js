/**
 * Sandbox Mode & Workbench Management for VoltMaster SMK
 * Allows free component placement, circuit experimentation, and predefined vocational templates.
 */

class SandboxManager {
  constructor(app) {
    this.app = app;
  }

  // Pre-configured templates for quick classroom demonstration
  loadTemplate(templateKey) {
    this.app.lastSandboxTemplate = templateKey; // FIX: diingat untuk tombol Reset
    let components = [];
    let wires = [];

    switch (templateKey) {
      case 'simple_lamp':
        components = [
          createComponent('pln1p', 80, 150),
          createComponent('mcb1p', 260, 140),
          createComponent('switch_single', 380, 160),
          createComponent('bulb', 540, 150)
        ];
        wires = [
          { from: 'pln1p_1_L', to: 'mcb1p_1_in', color: '#8B4513' },
          { from: 'mcb1p_1_out', to: 'switch_single_1_in', color: '#8B4513' },
          { from: 'switch_single_1_out', to: 'bulb_1_phase', color: '#f59e0b' },
          { from: 'bulb_1_neutral', to: 'pln1p_1_N', color: '#2563EB' }
        ];
        break;

      case 'double_lamp':
        components = [
          createComponent('pln1p', 60, 150),
          createComponent('mcb1p', 220, 140),
          createComponent('switch_double', 340, 160),
          createComponent('bulb', 520, 90, { id: 'bulb_1', name: 'Lampu 1' }),
          createComponent('bulb', 520, 240, { id: 'bulb_2', name: 'Lampu 2' })
        ];
        wires = [
          { from: 'pln1p_1_L', to: 'mcb1p_1_in', color: '#8B4513' },
          { from: 'mcb1p_1_out', to: 'switch_double_1_com', color: '#8B4513' },
          { from: 'switch_double_1_out1', to: 'bulb_1_phase', color: '#f59e0b' },
          { from: 'switch_double_1_out2', to: 'bulb_2_phase', color: '#f59e0b' },
          { from: 'bulb_1_neutral', to: 'pln1p_1_N', color: '#2563EB' },
          { from: 'bulb_2_neutral', to: 'pln1p_1_N', color: '#2563EB' }
        ];
        break;

      case 'outlet_grounding':
        components = [
          createComponent('pln1p', 60, 150),
          createComponent('mcb1p', 230, 140),
          createComponent('outlet', 380, 150),
          createComponent('ground_rod', 570, 150)
        ];
        wires = [
          { from: 'pln1p_1_L', to: 'mcb1p_1_in', color: '#8B4513' },
          { from: 'mcb1p_1_out', to: 'outlet_1_L', color: '#8B4513' },
          { from: 'outlet_1_N', to: 'pln1p_1_N', color: '#2563EB' },
          { from: 'outlet_1_PE', to: 'ground_rod_1_pe', color: '#16A34A' }
        ];
        break;

      case 'kwh_app':
        components = [
          createComponent('pln1p', 40, 150),
          createComponent('kwh_meter', 190, 130),
          createComponent('mcb1p', 430, 140),
          createComponent('ground_rod', 540, 150),
          createComponent('bulb', 640, 150)
        ];
        wires = [
          { from: 'pln1p_1_L', to: 'kwh_meter_1_in_L', color: '#8B4513' },
          { from: 'kwh_meter_1_out_L', to: 'mcb1p_1_in', color: '#8B4513' },
          { from: 'mcb1p_1_out', to: 'bulb_1_phase', color: '#8B4513' },
          { from: 'pln1p_1_N', to: 'kwh_meter_1_in_N', color: '#2563EB' },
          { from: 'kwh_meter_1_out_N', to: 'bulb_1_neutral', color: '#2563EB' },
          { from: 'kwh_meter_1_ground', to: 'ground_rod_1_pe', color: '#16A34A' }
        ];
        break;

      case 'motor_3phase':
        components = [
          createComponent('pln3p', 40, 140),
          createComponent('mcb3p', 280, 130),
          createComponent('motor3p', 540, 130)
        ];
        wires = [
          { from: 'pln3p_1_R', to: 'mcb3p_1_in_R', color: '#8B4513' },
          { from: 'pln3p_1_S', to: 'mcb3p_1_in_S', color: '#111827' },
          { from: 'pln3p_1_T', to: 'mcb3p_1_in_T', color: '#6B7280' },
          { from: 'mcb3p_1_out_R', to: 'motor3p_1_U1', color: '#8B4513' },
          { from: 'mcb3p_1_out_S', to: 'motor3p_1_V1', color: '#111827' },
          { from: 'mcb3p_1_out_T', to: 'motor3p_1_W1', color: '#6B7280' }
        ];
        break;

      default:
        return;
    }

    this.app.loadCircuitState(components, wires);
  }
}

window.SandboxManager = SandboxManager;