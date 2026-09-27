/**
 * Circuit Simulation Engine for VoltMaster SMK
 * Evaluates electrical networks, voltages, currents, phase relationships,
 * short-circuits, relay energization, and motor rotation.
 */

class CircuitEngine {
  constructor() {
    this.components = [];
    this.wires = [];
    this.nodes = new Map(); // pinId -> NetID
    this.nets = new Map();  // NetID -> { potential: { type: 'AC'|'DC'|'NONE', v: 0, phase: 0 }, pins: [] }
    this.isShortCircuit = false;
    this.shortCircuitDetails = null;
    this.listeners = [];
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this));
  }

  setCircuit(components, wires) {
    this.components = components;
    this.wires = wires;
    this.solve();
  }

  solve() {
    this.isShortCircuit = false;
    this.shortCircuitDetails = null;

    // Iterative solving to handle contactor latching/interlocking
    let iterations = 0;
    let stateChanged = true;

    while (stateChanged && iterations < 5) {
      iterations++;
      stateChanged = this.solveStep();
    }

    this.notify();
  }

  solveStep() {
    // 1. Build Pin Adjacency Graph from wires and closed internal component switches
    const pinGraph = new Map();

    const addEdge = (p1, p2) => {
      if (!pinGraph.has(p1)) pinGraph.set(p1, new Set());
      if (!pinGraph.has(p2)) pinGraph.set(p2, new Set());
      pinGraph.get(p1).add(p2);
      pinGraph.get(p2).add(p1);
    };

    // Add external wire connections
    this.wires.forEach(w => {
      addEdge(w.from, w.to);
    });

    // Add internal component connections (closed switches, MCBs, contactors, etc.)
    this.components.forEach(comp => {
      if (comp.getInternalConnections) {
        const conns = comp.getInternalConnections();
        conns.forEach(pair => addEdge(pair[0], pair[1]));
      }
    });

    // 2. Identify Equipotential Nets using BFS/Connected Components
    const visited = new Set();
    const nets = [];

    // Collect all pins
    const allPins = new Set();
    this.components.forEach(comp => {
      comp.pins.forEach(pin => allPins.add(pin.id));
    });

    allPins.forEach(pinId => {
      if (!visited.has(pinId)) {
        const netPins = [];
        const queue = [pinId];
        visited.add(pinId);

        while (queue.length > 0) {
          const curr = queue.shift();
          netPins.push(curr);
          const neighbors = pinGraph.get(curr) || [];
          neighbors.forEach(nbr => {
            if (!visited.has(nbr)) {
              visited.add(nbr);
              queue.push(nbr);
            }
          });
        }
        nets.push(netPins);
      }
    });

    // Map each pin to its net
    const pinToNetMap = new Map();
    nets.forEach((netPins, idx) => {
      netPins.forEach(p => pinToNetMap.set(p, idx));
    });

    // 3. Determine Sources & Potentials in each Net
    const netPotentials = new Map(); // netIndex -> array of source potentials

    this.components.forEach(comp => {
      if (comp.isSource && comp.getPinPotentials) {
        const pots = comp.getPinPotentials();
        for (const [pinId, pot] of Object.entries(pots)) {
          const netIdx = pinToNetMap.get(pinId);
          if (netIdx !== undefined) {
            if (!netPotentials.has(netIdx)) netPotentials.set(netIdx, []);
            netPotentials.get(netIdx).push({ compId: comp.id, pinId, pot });
          }
        }
      }
    });

    // 4. Check for Short Circuits (Korsleting / Hubung Singkat)
    for (const [netIdx, sources] of netPotentials.entries()) {
      if (sources.length > 1) {
        // Check if conflicting sources are connected to the same net with zero resistance
        for (let i = 0; i < sources.length; i++) {
          for (let j = i + 1; j < sources.length; j++) {
            const s1 = sources[i].pot;
            const s2 = sources[j].pot;

            const isConflicting = 
              (s1.type === 'AC' && s2.type === 'AC' && (s1.phase !== s2.phase || s1.isNeutral !== s2.isNeutral)) ||
              (s1.type === 'DC' && s2.type === 'DC' && s1.v !== s2.v);

            if (isConflicting) {
              this.isShortCircuit = true;
              this.shortCircuitDetails = {
                netIndex: netIdx,
                source1: sources[i],
                source2: sources[j]
              };

              // Trip any closed MCBs in the circuit
              this.tripProtectiveMCBs();
              break;
            }
          }
          if (this.isShortCircuit) break;
        }
      }
    }

    // 5. Assign Final Potential to each Net
    const resolvedNetPotentials = new Map();
    nets.forEach((netPins, idx) => {
      const srcList = netPotentials.get(idx);
      if (srcList && srcList.length > 0) {
        // Take dominant source (first valid source)
        resolvedNetPotentials.set(idx, srcList[0].pot);
      } else {
        resolvedNetPotentials.set(idx, { type: 'NONE', v: 0, phase: 0, isNeutral: false, isGround: false });
      }
    });

    this.pinToNetMap = pinToNetMap;
    this.resolvedNetPotentials = resolvedNetPotentials;
    this.nets = nets;

    // 6. Update States of Loads (Bulbs, Relays, Motors, Contactors)
    let stateChanged = false;
    this.components.forEach(comp => {
      if (comp.updateState) {
        const changed = comp.updateState(this);
        if (changed) stateChanged = true;
      }
    });

    return stateChanged;
  }

  // Find and trip MCB when short-circuit occurs
  tripProtectiveMCBs() {
    let trippedAny = false;
    this.components.forEach(comp => {
      if ((comp.type === 'mcb1p' || comp.type === 'mcb3p' || comp.type === 'mcb_pln') && comp.state.isOn) {
        comp.state.isOn = false;
        comp.state.tripped = true;
        trippedAny = true;
      }
    });

    if (trippedAny && window.sound) {
      window.sound.playMcbTrip();
    }
  }

  // Get electrical potential of a specific pin
  getPinPotential(pinId) {
    if (!this.pinToNetMap || !this.resolvedNetPotentials) {
      return { type: 'NONE', v: 0, phase: 0, isNeutral: false, isGround: false };
    }
    const netIdx = this.pinToNetMap.get(pinId);
    if (netIdx === undefined) return { type: 'NONE', v: 0, phase: 0, isNeutral: false, isGround: false };
    return this.resolvedNetPotentials.get(netIdx) || { type: 'NONE', v: 0, phase: 0, isNeutral: false, isGround: false };
  }

  // Calculate voltage difference between two pins
  measureVoltage(pinIdA, pinIdB) {
    const potA = this.getPinPotential(pinIdA);
    const potB = this.getPinPotential(pinIdB);

    // If both AC
    if (potA.type === 'AC' && potB.type === 'AC') {
      // Vector difference of AC: V = sqrt(Va^2 + Vb^2 - 2*Va*Vb*cos(thetaA - thetaB))
      const radA = (potA.phase * Math.PI) / 180;
      const radB = (potB.phase * Math.PI) / 180;

      const realA = potA.v * Math.cos(radA);
      const imagA = potA.v * Math.sin(radA);

      const realB = potB.v * Math.cos(radB);
      const imagB = potB.v * Math.sin(radB);

      const diffReal = realA - realB;
      const diffImag = imagA - imagB;

      const rms = Math.sqrt(diffReal * diffReal + diffImag * diffImag);
      return { type: 'AC', v: Math.round(rms * 10) / 10 };
    }

    // If both DC
    if (potA.type === 'DC' && potB.type === 'DC') {
      const diff = potA.v - potB.v;
      return { type: 'DC', v: Math.round(diff * 100) / 100 };
    }

    // If one has voltage and other is Neutral/Ground (0V)
    if (potA.type === 'AC' && (potB.isNeutral || potB.isGround || potB.type === 'NONE')) {
      return { type: 'AC', v: potA.v };
    }
    if (potB.type === 'AC' && (potA.isNeutral || potA.isGround || potA.type === 'NONE')) {
      return { type: 'AC', v: potB.v };
    }

    if (potA.type === 'DC' && potB.type === 'NONE') {
      return { type: 'DC', v: potA.v };
    }
    if (potB.type === 'DC' && potA.type === 'NONE') {
      return { type: 'DC', v: -potB.v };
    }

    return { type: 'NONE', v: 0.0 };
  }

  // Check continuity (resistance) between two pins when circuit is unpowered
  measureContinuity(pinIdA, pinIdB) {
    if (!pinIdA || !pinIdB) return { connected: false, resistance: Infinity };
    if (pinIdA === pinIdB) return { connected: true, resistance: 0.0 };

    // Traverse unpowered path
    const visited = new Set();
    const queue = [{ pin: pinIdA, r: 0 }];
    visited.add(pinIdA);

    // Build unpowered adjacency with resistances
    const graph = new Map();
    const addPath = (p1, p2, res = 0.02) => {
      if (!graph.has(p1)) graph.set(p1, []);
      if (!graph.has(p2)) graph.set(p2, []);
      graph.get(p1).push({ to: p2, r: res });
      graph.get(p2).push({ to: p1, r: res });
    };

    // Wires have approx 0.02 Ohm
    this.wires.forEach(w => addPath(w.from, w.to, 0.02));

    // Internal closed component paths
    this.components.forEach(comp => {
      if (comp.getInternalResistancePaths) {
        const paths = comp.getInternalResistancePaths();
        paths.forEach(p => addPath(p.p1, p.p2, p.r));
      }
    });

    while (queue.length > 0) {
      const curr = queue.shift();
      if (curr.pin === pinIdB) {
        return { connected: true, resistance: Math.round(curr.r * 100) / 100 };
      }

      const neighbors = graph.get(curr.pin) || [];
      for (const nbr of neighbors) {
        if (!visited.has(nbr.to)) {
          visited.add(nbr.to);
          queue.push({ pin: nbr.to, r: curr.r + nbr.r });
        }
      }
    }

    return { connected: false, resistance: Infinity };
  }

  // Check Tespen glow on a pin
  testTespen(pinId) {
    const pot = this.getPinPotential(pinId);
    // Neon glows if voltage > 70V AC (Live/Fasa)
    if (pot.type === 'AC' && pot.v >= 70 && !pot.isNeutral && !pot.isGround) {
      return { glows: true, intensity: Math.min(1.0, pot.v / 220) };
    }
    return { glows: false, intensity: 0 };
  }
}

window.CircuitEngine = CircuitEngine;
