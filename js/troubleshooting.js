/**
 * Troubleshooting / UKK (Uji Kompetensi Kejuruan) Scenarios for VoltMaster SMK
 * Simulates real-world electrical faults for diagnosis and problem solving.
 */

const TROUBLESHOOTING_CASES = [
  {
    id: 'case_1',
    title: "Kasus 1: Lampu Padam Total (Kabel Putus)",
    scenario: "Seorang teknisi menerima keluhan bahwa lampu kamar tidur padam total. Sakelar sudah ditekan ke posisi ON dan MCB sudah di posisi naik (ON).",
    hint: "Gunakan Multimeter (skala ACV atau Ohm Buzzer saat MCB OFF) untuk melacak di titik mana tegangan terputus.",
    components: [
      { type: 'pln1p', x: 60, y: 150 },
      { type: 'mcb1p', x: 230, y: 140, options: { isOn: true } },
      { type: 'switch_single', x: 370, y: 160, options: { isOn: true } },
      { type: 'bulb', x: 570, y: 150 }
    ],
    // Broken circuit: wire between switch and bulb is missing / disconnected
    initialWires: [
      { from: 'pln1p_1_L', to: 'mcb1p_1_in', color: '#8B4513' },
      { from: 'mcb1p_1_out', to: 'switch_single_1_in', color: '#8B4513' },
      // Broken: switch_single_1_out to bulb_1_phase is missing!
      { from: 'bulb_1_neutral', to: 'pln1p_1_N', color: '#2563EB' }
    ],
    diagnosisGoal: "Sambungkan kawat fasa balik yang putus dari Sakelar OUT ke Lampu Fasa.",
    checkCompletion: (engine) => {
      const bulb = engine.components.find(c => c.type === 'bulb');
      if (bulb && bulb.state.isLit) {
        return {
          passed: true,
          feedback: "Analisis tepat! Kamu berhasil melacak kawat fasa balik yang terputus dan memperbaikinya. Lampu menyala kembali!"
        };
      }
      return {
        passed: false,
        feedback: "Lampu masih belum menyala. Lacak jalur tegangan dari sakelar menuju fitting lampu."
      };
    }
  },

  {
    id: 'case_2',
    title: "Kasus 2: MCB Selalu Anjlok (Hubung Singkat / Korslet)",
    scenario: "Begitu MCB dinaikkan, MCB langsung anjlok (TRIP) seketika disertai percikan api. Terdapat hubung singkat di dalam kotak instalasi!",
    hint: "JANGAN terus menaikkan MCB! Periksa sambungan kabel. Cari kabel yang menghubungkan Fasa langsung ke Netral, hapus kabel yang korslet tersebut.",
    components: [
      { type: 'pln1p', x: 60, y: 150 },
      { type: 'mcb1p', x: 240, y: 140, options: { isOn: false } },
      { type: 'outlet', x: 420, y: 150 }
    ],
    initialWires: [
      { from: 'pln1p_1_L', to: 'mcb1p_1_in', color: '#8B4513' },
      { from: 'mcb1p_1_out', to: 'outlet_1_L', color: '#8B4513' },
      { from: 'outlet_1_N', to: 'pln1p_1_N', color: '#2563EB' },
      // FAULT WIRE: Short circuit across outlet terminals directly
      { from: 'outlet_1_L', to: 'outlet_1_N', color: '#ef4444', isFault: true }
    ],
    diagnosisGoal: "Hapus kabel merah yang menyebabkan hubung singkat antara Fasa dan Netral pada Stop Kontak, kemudian nyalakan MCB.",
    checkCompletion: (engine) => {
      const mcb = engine.components.find(c => c.type === 'mcb1p');
      const outlet = engine.components.find(c => c.type === 'outlet');

      if (!engine.isShortCircuit && mcb && mcb.state.isOn && outlet && outlet.state.isPowered) {
        return {
          passed: true,
          feedback: "Luar biasa! Kamu berhasil menyingkirkan hubung singkat berbahaya dan menormalkan kembali sistem stop kontak!"
        };
      }

      if (engine.isShortCircuit) {
        return {
          passed: false,
          feedback: "Hubung singkat masih ada! Klik kabel yang salah (merah yang menghubungkan L dan N langsung) lalu hapus kabel tersebut."
        };
      }

      return {
        passed: false,
        feedback: "Hapus kawat korslet yang menghubungkan L ke N, lalu naikkan tuas MCB."
      };
    }
  },

  {
    id: 'case_3',
    title: "Kasus 3: Bodi Peralatan Menggigit (Grounding Hilang)",
    scenario: "Pengguna merasakan sengatan kesemutan (tegangan bocor) saat menyentuh bodi panel stop kontak logam.",
    hint: "Gunakan Tespen atau Multimeter untuk memeriksa terminal PE (Ground). Sambungkan terminal PE Stop Kontak ke Batang Pembumian (Ground Rod) agar arus bocor dibuang ke tanah.",
    components: [
      { type: 'pln1p', x: 60, y: 150 },
      { type: 'mcb1p', x: 220, y: 140, options: { isOn: true } },
      { type: 'outlet', x: 380, y: 150 },
      { type: 'ground_rod', x: 570, y: 150 }
    ],
    initialWires: [
      { from: 'pln1p_1_L', to: 'mcb1p_1_in', color: '#8B4513' },
      { from: 'mcb1p_1_out', to: 'outlet_1_L', color: '#8B4513' },
      { from: 'outlet_1_N', to: 'pln1p_1_N', color: '#2563EB' }
      // Missing PE to Ground Rod!
    ],
    diagnosisGoal: "Pasang kabel Grounding (Kuning-Hijau) dari terminal PE Stop Kontak menuju Batang Arde (Ground Rod).",
    checkCompletion: (engine) => {
      const outlet = engine.components.find(c => c.type === 'outlet');
      const pePot = engine.getPinPotential('outlet_1_PE');

      if (pePot.isGround) {
        return {
          passed: true,
          feedback: "Sangat baik! Sistem pembumian kini terpasang sempurna. Arus bocor dibuang ke bumi secara aman, meniadakan bahaya sengatan listrik (K3 Terpenuhi)!"
        };
      }

      return {
        passed: false,
        feedback: "Hubungkan terminal PE Stop Kontak ke Batang Arde menggunakan kabel kuning-hijau."
      };
    }
  },

  {
    id: 'case_4',
    title: "Kasus 4: Motor 3-Fasa Hilang Fasa (Single Phasing)",
    scenario: "Motor 3 fasa di pabrik tidak bisa berputar, melainkan hanya berdengung kencang dan suhu bodinya meningkat drastis!",
    hint: "Periksa suplai ketiga fasa (R, S, T) menuju terminal motor U1, V1, W1. Cari fasa yang hilang dan hubungkan kembali.",
    components: [
      { type: 'pln3p', x: 50, y: 140 },
      { type: 'mcb3p', x: 290, y: 130, options: { isOn: true } },
      { type: 'motor3p', x: 530, y: 130 }
    ],
    initialWires: [
      { from: 'pln3p_1_R', to: 'mcb3p_1_in_R', color: '#8B4513' },
      { from: 'pln3p_1_S', to: 'mcb3p_1_in_S', color: '#111827' },
      { from: 'pln3p_1_T', to: 'mcb3p_1_in_T', color: '#6B7280' },
      { from: 'mcb3p_1_out_R', to: 'motor3p_1_U1', color: '#8B4513' },
      // FAULT: Phase S missing to V1!
      { from: 'mcb3p_1_out_T', to: 'motor3p_1_W1', color: '#6B7280' }
    ],
    diagnosisGoal: "Sambungkan fasa yang hilang dari MCB Out S menuju terminal motor V1.",
    checkCompletion: (engine) => {
      const motor = engine.components.find(c => c.type === 'motor3p');
      if (motor && motor.state.isRunning) {
        return {
          passed: true,
          feedback: "Troubleshooting Sukses! Gejala hilang satu fasa berhasil diselesaikan. Motor 3 fasa kembali berputar normal dan terhindar dari kerusakan isolasi kumparan!"
        };
      }
      return {
        passed: false,
        feedback: "Motor masih kehilangan satu fasa. Sambungkan kabel dari MCB 3P Out S (kabel hitam) ke terminal Motor V1."
      };
    }
  },

  {
    id: 'case_5',
    title: "Kasus 5: Kontak Pengunci Kontaktor Terlepas",
    scenario: "Motor hanya berputar selama tombol START ditekan. Begitu tombol START dilepas, motor langsung mati seketika (rangkaian tidak mengunci / no latching).",
    hint: "Periksa kontak bantu NO 13-14 pada Kontaktor KM1. Pasang kabel dari output START menuju terminal 14 kontaktor untuk mengaktifkan sistem pengunci (self-holding).",
    components: [
      { type: 'pln1p', x: 50, y: 150 },
      { type: 'mcb1p', x: 180, y: 140, options: { isOn: true } },
      { type: 'push_button', x: 300, y: 150, options: { isNC: false, name: 'START (NO)' } },
      { type: 'contactor', x: 440, y: 120 },
      { type: 'pilot_lamp', x: 620, y: 150, options: { color: 'green', name: 'Lampu RUN' } }
    ],
    initialWires: [
      { from: 'pln1p_1_L', to: 'mcb1p_1_in', color: '#8B4513' },
      { from: 'mcb1p_1_out', to: 'push_button_1_3', color: '#8B4513' },
      { from: 'mcb1p_1_out', to: 'contactor_1_13', color: '#8B4513' },
      { from: 'push_button_1_4', to: 'contactor_1_A1', color: '#f59e0b' },
      // FAULT: wire from contactor_1_14 to contactor_1_A1 is missing!
      { from: 'contactor_1_A2', to: 'pln1p_1_N', color: '#2563EB' },
      { from: 'contactor_1_A1', to: 'pilot_lamp_1_L', color: '#f59e0b' },
      { from: 'pilot_lamp_1_N', to: 'pln1p_1_N', color: '#2563EB' }
    ],
    diagnosisGoal: "Sambungkan kawat pengunci dari terminal 14 kontaktor ke terminal A1 kontaktor agar saat tombol START dilepas, koil tetap bekerja.",
    checkCompletion: (engine) => {
      const km = engine.components.find(c => c.type === 'contactor');
      // Check if wire between 14 and A1 exists
      const hasLatchingWire = engine.wires.some(w => 
        (w.from === `${km.id}_14` && (w.to === `${km.id}_A1` || w.to.includes('push_button_1_4'))) ||
        (w.to === `${km.id}_14` && (w.from === `${km.id}_A1` || w.from.includes('push_button_1_4')))
      );

      if (hasLatchingWire) {
        return {
          passed: true,
          feedback: "Analisis luar biasa! Kawat pengunci 13-14 kini terpasang sempurna. Kontaktor tetap mengunci daya saat tombol START dilepas!"
        };
      }
      return {
        passed: false,
        feedback: "Kawat pengunci masih belum terpasang. Sambungkan terminal NO 14 kontaktor ke terminal A1 kontaktor."
      };
    }
  },

  {
    id: 'case_6',
    title: "Kasus 6: Kawat Fasa Tertukar dengan Arde pada Stop Kontak",
    scenario: "Pengguna memasang stop kontak baru, namun ketika alat listrik dicolokkan ke stop kontak, bodi alat langsung bertegangan 220V dan membahayakan keselamatan!",
    hint: "Gunakan Tespen untuk memeriksa lubang stop kontak dan pelat arde. Temukan kawat Fasa yang keliru dipasang ke terminal PE (Arde) lalu pindahkan ke terminal L yang benar.",
    components: [
      { type: 'pln1p', x: 60, y: 150 },
      { type: 'mcb1p', x: 220, y: 140, options: { isOn: true } },
      { type: 'outlet', x: 390, y: 150 },
      { type: 'ground_rod', x: 580, y: 150 }
    ],
    initialWires: [
      { from: 'pln1p_1_L', to: 'mcb1p_1_in', color: '#8B4513' },
      // FAULT: Phase wrongly connected to PE!
      { from: 'mcb1p_1_out', to: 'outlet_1_PE', color: '#8B4513' },
      { from: 'outlet_1_N', to: 'pln1p_1_N', color: '#2563EB' }
    ],
    diagnosisGoal: "Pindahkan kawat dari terminal PE ke terminal L pada Stop Kontak, kemudian sambungkan terminal PE ke Batang Pembumian (Ground Rod).",
    checkCompletion: (engine) => {
      const ot = engine.components.find(c => c.type === 'outlet');
      const pePot = engine.getPinPotential(`${ot.id}_PE`);
      const lPot = engine.getPinPotential(`${ot.id}_L`);

      if (lPot.v >= 180 && pePot.isGround) {
        return {
          passed: true,
          feedback: "Sangat teliti! Kesalahan fatal fasa terbalik ke arde telah diperbaiki. Stop kontak kini bekerja aman sesuai standar PUIL 2011!"
        };
      }
      return {
        passed: false,
        feedback: "Pastikan terminal L menerima kawat Fasa (220V) dan pelat arde PE terhubung ke Batang Pembumian Ground Rod (0V)."
      };
    }
  }
];

window.TROUBLESHOOTING_CASES = TROUBLESHOOTING_CASES;

