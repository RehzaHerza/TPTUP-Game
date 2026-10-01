/**
 * Mission Levels Configuration for VoltMaster SMK
 * Tailored for SMK Grade 10 (Dasar-dasar Teknik Ketenagalistrikan / TITL / TIPTL / TPTUP)
 * Includes live step-by-step checklist and visual schematic blueprints.
 */

const GAME_LEVELS = [
  // -----------------------------------------------------------------
  // LEVEL 1: K3 & Pengujian Fasa Menggunakan Tespen
  // -----------------------------------------------------------------
  {
    id: 1,
    title: "Level 1: K3 Listrik & Penggunaan Tespen",
    category: "Dasar & K3",
    difficulty: "Mudah",
    theory: `
      <strong>Prinsip K3 (Keselamatan dan Kesehatan Kerja):</strong><br>
      Sebelum menyentuh penghantar atau membongkar instalasi listrik, teknisi WAJIB memeriksa keberadaan tegangan menggunakan <em>Tespen</em>.<br>
      • Kawat <strong>Fasa (L)</strong> membawa tegangan bolak-balik 220V terhadap tanah. Lampu neon di dalam tespen akan <strong>menyala oranye</strong>.<br>
      • Kawat <strong>Netral (N)</strong> dan <strong>Pembumian/Arde (PE)</strong> berpotensial 0V terhadap tanah, sehingga lampu tespen tidak menyala.
    `,
    objective: "Ujilah terminal suplai PLN (L, N, PE) menggunakan Tespen. Pastikan kamu berhasil mendeteksi kawat Fasa (L) yang bertegangan aktif!",
    components: [
      { type: 'pln1p', x: 280, y: 150 }
    ],
    initialWires: [],
    toolsNeeded: ['tespen'],
    checklist: [
      {
        id: 'chk_1_1',
        text: 'Sentuhkan Tespen ke Terminal L (Fasa 220V)',
        check: (engine, mm) => {
          const pin = mm.tespenPos.attachedPin;
          return !!(pin && pin.endsWith('_L') && engine.testTespen(pin).glows);
        }
      },
      {
        id: 'chk_1_2',
        text: 'Sentuhkan Tespen ke Terminal N (Netral 0V - Lampu Mati)',
        check: (engine, mm) => {
          const pin = mm.tespenPos.attachedPin;
          return !!(pin && pin.endsWith('_N'));
        }
      }
    ],
    schematic: {
      title: "Prinsip Deteksi Kawat Fasa (L) dengan Tespen",
      desc: "Sentuhkan ujung logam tespen ke terminal Fasa (L). Arus milliampere yang sangat kecil dan aman mengalir melalui resistor pengaman tespen, menyalakan tabung neon, dan diteruskan melalui tubuh ke bumi.",
      svg: `
        <svg viewBox="0 0 400 200" width="100%" height="180">
          <rect x="20" y="30" width="110" height="140" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="75" y="60" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">PLN 1-FASA</text>
          <circle cx="75" cy="100" r="10" fill="#8B4513"/>
          <text x="75" y="125" text-anchor="middle" fill="#cbd5e1" font-size="10">L (Fasa 220V)</text>
          
          <!-- Tespen symbol -->
          <rect x="220" y="88" width="110" height="24" rx="4" fill="#0284c7" stroke="#38bdf8"/>
          <circle cx="275" cy="100" r="7" fill="#ff4500" filter="drop-shadow(0 0 6px #ff4500)"/>
          <text x="275" y="130" text-anchor="middle" fill="#ffedd5" font-size="10">Neon Menyala!</text>
          
          <line x1="85" y1="100" x2="220" y2="100" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4,4"/>
        </svg>
      `
    },
    checkCompletion: (engine, mm) => {
      const tespenAttached = mm.tespenPos.attachedPin;
      if (tespenAttached && tespenAttached.endsWith('_L')) {
        const test = engine.testTespen(tespenAttached);
        if (test.glows) {
          return {
            passed: true,
            feedback: "Luar biasa! Lampu neon tespen menyala terang oranye. Ini membuktikan kawat Fasa aktif 220V. Selalu ingat SOP K3: Tespen dahulu sebelum disentuh!"
          };
        }
      }
      return {
        passed: false,
        feedback: "Tarik ujung tespen ke bulatan Terminal L (Fasa) untuk mendeteksi tegangan fasa hidup."
      };
    }
  },

  // -----------------------------------------------------------------
  // LEVEL 2: Pengukuran Multimeter (DC 12V & AC 220V)
  // -----------------------------------------------------------------
  {
    id: 2,
    title: "Level 2: Mahir Multimeter Digital (DCV & ACV)",
    category: "Alat Ukur",
    difficulty: "Mudah",
    theory: `
      <strong>Aturan Menggunakan Multimeter:</strong><br>
      • Mengukur baterai/aki DC: posisikan selektor pada skala <strong>⎓ DCV (20V)</strong>.<br>
      • Mengukur tegangan jala-jala PLN: posisikan selektor pada skala <strong>~ ACV (750V)</strong>.<br>
      • Pasang Probe Merah (+) dan Probe Hitam (-/COM) secara paralel pada kedua terminal sumber tegangan.
    `,
    objective: "Lakukan pengukuran tegangan pada Baterai DC 12V (Mode DCV 20V) dan pada Suplai PLN 220V (Mode ACV 750V).",
    components: [
      { type: 'battery', x: 120, y: 160, options: { voltage: 12 } },
      { type: 'pln1p', x: 420, y: 150 }
    ],
    initialWires: [],
    toolsNeeded: ['multimeter'],
    checklist: [
      {
        id: 'chk_2_1',
        text: 'Ukur Baterai DC 12V (Selektor pada DCV 20V)',
        check: (engine, mm) => {
          const pA = mm.probeRed.attachedPin;
          const pB = mm.probeBlack.attachedPin;
          if (pA && pB && pA.includes('battery') && pB.includes('battery') && mm.mode.startsWith('DCV')) {
            const v = engine.measureVoltage(pA, pB);
            return Math.abs(v.v) >= 11.5;
          }
          return false;
        }
      },
      {
        id: 'chk_2_2',
        text: 'Ukur Tegangan PLN 220V (Selektor pada ACV 750V)',
        check: (engine, mm) => {
          const pA = mm.probeRed.attachedPin;
          const pB = mm.probeBlack.attachedPin;
          if (pA && pB && pA.includes('pln1p') && pB.includes('pln1p') && mm.mode.startsWith('ACV')) {
            const v = engine.measureVoltage(pA, pB);
            return v.v >= 210;
          }
          return false;
        }
      }
    ],
    schematic: {
      title: "Skema Pengukuran Tegangan Paralel",
      desc: "Voltmeter dipasang secara paralel terhadap beban atau sumber tegangan. Probe Merah ke Positif/Fasa, Probe Hitam ke Negatif/Netral.",
      svg: `
        <svg viewBox="0 0 400 180" width="100%" height="160">
          <rect x="30" y="40" width="100" height="90" rx="6" fill="#1e293b" stroke="#ef4444" stroke-width="2"/>
          <text x="80" y="70" text-anchor="middle" fill="#ef4444" font-weight="bold">BATERAI 12V</text>
          
          <rect x="250" y="30" width="120" height="110" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="310" y="60" text-anchor="middle" fill="#a3e635" font-family="monospace" font-size="14" font-weight="bold">12.00 V</text>
          
          <!-- Probes path -->
          <path d="M 50 110 C 120 160, 220 160, 280 120" fill="none" stroke="#ef4444" stroke-width="3"/>
          <path d="M 110 110 C 150 170, 230 170, 310 120" fill="none" stroke="#111827" stroke-width="3"/>
        </svg>
      `
    },
    checkCompletion: (engine, mm) => {
      const pinA = mm.probeRed.attachedPin;
      const pinB = mm.probeBlack.attachedPin;

      if (!pinA || !pinB) {
        return { passed: false, feedback: "Tempelkan kedua probe multimeter (Merah dan Hitam) ke terminal yang diukur." };
      }

      if (pinA.includes('battery') && pinB.includes('battery') && (mm.mode === 'DCV_20' || mm.mode === 'DCV_1000')) {
        const v = engine.measureVoltage(pinA, pinB);
        if (Math.abs(v.v) >= 11.5) {
          return { passed: true, feedback: `Hebat! Baterai DC terukur ${Math.abs(v.v)} V DC dengan akurat.` };
        }
      }

      if (pinA.includes('pln1p') && pinB.includes('pln1p') && (mm.mode === 'ACV_750' || mm.mode === 'ACV_200')) {
        const v = engine.measureVoltage(pinA, pinB);
        if (v.v >= 210) {
          return { passed: true, feedback: `Sempurna! Tegangan jala-jala PLN terukur ${v.v} V AC.` };
        }
      }

      return {
        passed: false,
        feedback: "Pastikan selektor multimeter berada pada skala yang sesuai (DCV 20V untuk Baterai, ACV 750V untuk PLN)."
      };
    }
  },

  // -----------------------------------------------------------------
  // LEVEL 3: Instalasi Penerangan Sederhana (1 Sakelar 1 Lampu + MCB)
  // -----------------------------------------------------------------
  {
    id: 3,
    title: "Level 3: Instalasi Penerangan 1 Lampu + MCB",
    category: "Instalasi Penerangan",
    difficulty: "Menengah",
    theory: `
      <strong>Standar PUIL 2011 untuk Instalasi Penerangan:</strong><br>
      • Kawat Fasa (L) dari PLN wajib masuk ke <strong>MCB</strong> terlebih dahulu sebagai proteksi hubung singkat & beban lebih.<br>
      • Dari output MCB, kawat Fasa diteruskan ke <strong>Sakelar Tunggal</strong> (Sakelar selalu memutus kawat FASA, BUKAN kawat Netral, demi keselamatan saat mengganti bohlam!).<br>
      • Fasa balik dari sakelar menuju ke fitting lampu.<br>
      • Terminal netral lampu dihubungkan langsung kembali ke kawat <strong>Netral (N) PLN</strong>.
    `,
    objective: "Pasang kabel pengawatan dari PLN ke MCB, Sakelar Tunggal, dan Lampu Pijar. Nyalakan MCB dan tekan Sakelar agar lampu menyala!",
    components: [
      { type: 'pln1p', x: 60, y: 150 },
      { type: 'mcb1p', x: 240, y: 140, options: { rating: 'C4' } },
      { type: 'switch_single', x: 380, y: 160 },
      { type: 'bulb', x: 550, y: 150 }
    ],
    initialWires: [],
    toolsNeeded: ['wires'],
    checklist: [
      {
        id: 'chk_3_1',
        text: 'Kabel Fasa: PLN (L) ke MCB (IN)',
        check: (engine) => engine.wires.some(w => (w.from.endsWith('_L') && w.to.endsWith('_in')) || (w.from.endsWith('_in') && w.to.endsWith('_L')))
      },
      {
        id: 'chk_3_2',
        text: 'Kabel Fasa: MCB (OUT) ke Sakelar (IN)',
        check: (engine) => engine.wires.some(w => (w.from.includes('mcb') && w.from.endsWith('_out') && w.to.includes('switch') && w.to.endsWith('_in')) ||
                                                  (w.to.includes('mcb') && w.to.endsWith('_out') && w.from.includes('switch') && w.from.endsWith('_in')))
      },
      {
        id: 'chk_3_3',
        text: 'Kabel Fasa Balik: Sakelar (OUT) ke Lampu (FASA)',
        check: (engine) => engine.wires.some(w => (w.from.includes('switch') && w.from.endsWith('_out') && w.to.includes('bulb') && w.to.endsWith('_phase')) ||
                                                  (w.to.includes('switch') && w.to.endsWith('_out') && w.from.includes('bulb') && w.from.endsWith('_phase')))
      },
      {
        id: 'chk_3_4',
        text: 'Kabel Netral: Lampu (NETRAL) ke PLN (N)',
        check: (engine) => engine.wires.some(w => (w.from.includes('bulb') && w.from.endsWith('_neutral') && w.to.endsWith('_N')) ||
                                                  (w.to.includes('bulb') && w.to.endsWith('_neutral') && w.from.endsWith('_N')))
      },
      {
        id: 'chk_3_5',
        text: 'Naikkan Tuas MCB (Posisi ON / I)',
        check: (engine) => {
          const mcb = engine.components.find(c => c.type === 'mcb1p');
          return !!(mcb && mcb.state.isOn && !mcb.state.tripped);
        }
      },
      {
        id: 'chk_3_6',
        text: 'Tekan Sakelar ON & Lampu Menyala Berpendar',
        check: (engine) => {
          const bulb = engine.components.find(c => c.type === 'bulb');
          return !!(bulb && bulb.state.isLit);
        }
      }
    ],
    schematic: {
      title: "Diagram Pengawatan (Wiring Diagram) 1 Lampu 1 Sakelar",
      desc: "Gunakan kabel Coklat untuk Fasa dari PLN ke MCB dan Sakelar. Gunakan kabel Kuning/Oranye untuk Fasa Balik ke Lampu. Gunakan kabel Biru untuk Netral.",
      svg: `
        <svg viewBox="0 0 500 200" width="100%" height="180">
          <!-- PLN -->
          <rect x="20" y="40" width="70" height="100" rx="6" fill="#1e293b" stroke="#38bdf8"/>
          <text x="55" y="70" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="bold">PLN</text>
          
          <!-- MCB -->
          <rect x="140" y="40" width="50" height="90" rx="4" fill="#cbd5e1" stroke="#475569"/>
          <text x="165" y="70" text-anchor="middle" fill="#0f172a" font-size="9" font-weight="bold">MCB</text>
          
          <!-- Sakelar -->
          <rect x="240" y="60" width="60" height="70" rx="4" fill="#f8fafc" stroke="#94a3b8"/>
          <text x="270" y="95" text-anchor="middle" fill="#0f172a" font-size="9">SAKELAR</text>
          
          <!-- Lampu -->
          <circle cx="410" cy="95" r="24" fill="#fef08a" stroke="#ca8a04"/>
          <text x="410" y="100" text-anchor="middle" fill="#713f12" font-size="9" font-weight="bold">LAMPU</text>
          
          <!-- Wires -->
          <path d="M 55 120 L 165 40" stroke="#8B4513" stroke-width="3" fill="none"/>
          <path d="M 165 130 L 255 120" stroke="#8B4513" stroke-width="3" fill="none"/>
          <path d="M 285 120 L 390 115" stroke="#f59e0b" stroke-width="3" fill="none"/>
          <path d="M 430 115 C 430 180, 55 180, 55 135" stroke="#2563EB" stroke-width="3" fill="none"/>
        </svg>
      `
    },
    checkCompletion: (engine) => {
      const bulb = engine.components.find(c => c.type === 'bulb');
      if (bulb && bulb.state.isLit) {
        return {
          passed: true,
          feedback: "Selamat! Rangkaian penerangan berhasil dirakit dengan benar dan aman sesuai PUIL 2011. Lampu berpendar menyala!"
        };
      }

      if (engine.isShortCircuit) {
        return {
          passed: false,
          feedback: "PERINGATAN K3: Terjadi hubung singkat (korsleting)! Kawat fasa terhubung langsung ke netral tanpa melewati beban lampu. MCB telah anjlok (trip)!"
        };
      }

      const mcb = engine.components.find(c => c.type === 'mcb1p');
      if (mcb && !mcb.state.isOn) {
        return {
          passed: false,
          feedback: "Kabel sudah terhubung, tetapi tuas MCB masih dalam posisi OFF (turun). Klik tuas MCB untuk menaikkannya ke posisi ON (I)."
        };
      }

      return {
        passed: false,
        feedback: "Periksa kembali sambungan: PLN L -> MCB IN, MCB OUT -> Sakelar IN, Sakelar OUT -> Lampu Fasa, Lampu Netral -> PLN N."
      };
    }
  },

  // -----------------------------------------------------------------
  // LEVEL 4: Instalasi Sakelar Ganda / Seri (2 Lampu Ruangan)
  // -----------------------------------------------------------------
  {
    id: 4,
    title: "Level 4: Sakelar Ganda / Seri (2 Lampu Terpisah)",
    category: "Instalasi Penerangan",
    difficulty: "Menengah",
    theory: `
      <strong>Fungsi Sakelar Ganda (Seri):</strong><br>
      Digunakan untuk mengendalikan dua buah lampu (misal lampu ruang tamu dan teras) secara terpisah dari satu kotak sakelar yang sama.<br>
      • Terminal <strong>COM (Common)</strong> dihubungkan ke sumber Fasa dari MCB.<br>
      • Terminal <strong>OUT 1</strong> ke Lampu 1, dan terminal <strong>OUT 2</strong> ke Lampu 2.<br>
      • Kawat netral kedua fitting lampu dihubungkan bersama (di-kopel) ke Netral PLN.
    `,
    objective: "Rakit instalasi sakelar seri. Nyalakan MCB dan aktifkan kedua tuas sakelar ganda hingga kedua lampu menyala!",
    components: [
      { type: 'pln1p', x: 50, y: 150 },
      { type: 'mcb1p', x: 200, y: 140 },
      { type: 'switch_double', x: 320, y: 160 },
      { type: 'bulb', x: 500, y: 90, options: { id: 'bulb_1', name: 'Lampu Ruang Tamu' } },
      { type: 'bulb', x: 500, y: 240, options: { id: 'bulb_2', name: 'Lampu Teras Luar' } }
    ],
    initialWires: [],
    toolsNeeded: ['wires'],
    checklist: [
      {
        id: 'chk_4_1',
        text: 'PLN (L) -> MCB (IN) & MCB (OUT) -> Sakelar Ganda (COM)',
        check: (engine) => engine.wires.some(w => w.to.includes('switch_double') || w.from.includes('switch_double'))
      },
      {
        id: 'chk_4_2',
        text: 'Sakelar OUT 1 ke Lampu 1 & OUT 2 ke Lampu 2',
        check: (engine) => {
          const w1 = engine.wires.some(w => w.from.includes('out1') || w.to.includes('out1'));
          const w2 = engine.wires.some(w => w.from.includes('out2') || w.to.includes('out2'));
          return w1 && w2;
        }
      },
      {
        id: 'chk_4_3',
        text: 'Netral Lampu 1 dan Lampu 2 ke PLN (N)',
        check: (engine) => {
          const bulbs = engine.components.filter(c => c.type === 'bulb');
          return bulbs.every(b => {
            const pot = engine.getPinPotential(`${b.id}_neutral`);
            return pot.isNeutral;
          });
        }
      },
      {
        id: 'chk_4_4',
        text: 'Kedua Lampu Berhasil Menyala Bersamaan',
        check: (engine) => {
          const bulbs = engine.components.filter(c => c.type === 'bulb');
          return bulbs.length === 2 && bulbs.every(b => b.state.isLit);
        }
      }
    ],
    schematic: {
      title: "Diagram Pengawatan Sakelar Ganda (Seri)",
      desc: "Kawat Fasa masuk ke terminal COM sakelar ganda, lalu dicabangkan melalui dua tombol terpisah ke masing-masing lampu.",
      svg: `
        <svg viewBox="0 0 500 220" width="100%" height="180">
          <rect x="20" y="50" width="60" height="90" rx="4" fill="#1e293b" stroke="#38bdf8"/>
          <rect x="130" y="50" width="45" height="80" rx="4" fill="#cbd5e1" stroke="#475569"/>
          <rect x="220" y="60" width="80" height="80" rx="4" fill="#f8fafc" stroke="#94a3b8"/>
          <circle cx="410" cy="60" r="20" fill="#fef08a" stroke="#ca8a04"/>
          <circle cx="410" cy="160" r="20" fill="#fef08a" stroke="#ca8a04"/>
          
          <path d="M 50 120 L 150 50" stroke="#8B4513" stroke-width="3" fill="none"/>
          <path d="M 150 130 L 235 120" stroke="#8B4513" stroke-width="3" fill="none"/>
          <path d="M 260 120 L 390 60" stroke="#f59e0b" stroke-width="3" fill="none"/>
          <path d="M 285 120 L 390 160" stroke="#f59e0b" stroke-width="3" fill="none"/>
          <path d="M 430 60 C 470 60, 470 200, 50 200 L 50 135" stroke="#2563EB" stroke-width="3" fill="none"/>
          <path d="M 430 160 L 460 160" stroke="#2563EB" stroke-width="3" fill="none"/>
        </svg>
      `
    },
    checkCompletion: (engine) => {
      const bulbs = engine.components.filter(c => c.type === 'bulb');
      const allLit = bulbs.length === 2 && bulbs.every(b => b.state.isLit);

      if (allLit) {
        return {
          passed: true,
          feedback: "Mantap! Kedua lampu berhasil dikontrol secara independen melalui sakelar seri. Instalasi memenuhi standar PUIL!"
        };
      }

      if (engine.isShortCircuit) {
        return {
          passed: false,
          feedback: "Korsleting terdeteksi! Periksa kembali apakah kawat fasa langsung bersentuhan dengan kawat netral."
        };
      }

      return {
        passed: false,
        feedback: "Sambungkan Fasa PLN -> MCB -> COM Sakelar Ganda. Output 1 ke Lampu 1, Output 2 ke Lampu 2. Hubungkan netral kedua lampu ke PLN N."
      };
    }
  },

  // -----------------------------------------------------------------
  // LEVEL 5: Sakelar Tukar / Sakelar Hotel (Lampu Tangga 2 Lantai)
  // -----------------------------------------------------------------
  {
    id: 5,
    title: "Level 5: Sakelar Tukar / Hotel (Kendali Lampu Tangga)",
    category: "Instalasi Penerangan",
    difficulty: "Tantangan",
    theory: `
      <strong>Prinsip Sakelar Tukar (Two-Way Switch):</strong><br>
      Sakelar tukar (SPDT) memiliki 3 terminal: <em>Common (C)</em>, <em>Jalur 1</em>, dan <em>Jalur 2</em>.<br>
      • Kawat Fasa masuk ke COM Sakelar 1.<br>
      • Terminal Jalur 1 Sakelar 1 dihubungkan ke Jalur 1 Sakelar 2.<br>
      • Terminal Jalur 2 Sakelar 1 dihubungkan ke Jalur 2 Sakelar 2.<br>
      • Terminal COM Sakelar 2 menuju ke Lampu.<br>
      Dengan demikian, lampu di tengah tangga dapat dinyalakan atau dimatikan dari lantai bawah maupun lantai atas secara bergantian!
    `,
    objective: "Rakit rangkaian sakelar tukar lorong/tangga. Pastikan lampu dapat dinyalakan dan dimatikan dari kedua posisi sakelar.",
    components: [
      { type: 'pln1p', x: 50, y: 150 },
      { type: 'mcb1p', x: 190, y: 140 },
      { type: 'switch_hotel', x: 290, y: 160, options: { id: 'sw_hotel_1', name: 'Sakelar Lantai Bawah' } },
      { type: 'switch_hotel', x: 440, y: 160, options: { id: 'sw_hotel_2', name: 'Sakelar Lantai Atas' } },
      { type: 'bulb', x: 590, y: 150 }
    ],
    initialWires: [],
    toolsNeeded: ['wires'],
    checklist: [
      {
        id: 'chk_5_1',
        text: 'PLN (L) -> MCB (IN) & MCB (OUT) -> COM Sakelar 1',
        check: (engine) => engine.wires.some(w => w.from.includes('sw_hotel_1_com') || w.to.includes('sw_hotel_1_com'))
      },
      {
        id: 'chk_5_2',
        text: 'Hubungkan Jalur 1 ke Jalur 1 dan Jalur 2 ke Jalur 2',
        check: (engine) => {
          const l1 = engine.wires.some(w => (w.from.includes('l1') && w.to.includes('l1')));
          const l2 = engine.wires.some(w => (w.from.includes('l2') && w.to.includes('l2')));
          return l1 && l2;
        }
      },
      {
        id: 'chk_5_3',
        text: 'COM Sakelar 2 ke Lampu (Fasa) & Lampu Netral ke PLN (N)',
        check: (engine) => {
          const bulb = engine.components.find(c => c.type === 'bulb');
          if (!bulb) return false;
          const potN = engine.getPinPotential(`${bulb.id}_neutral`);
          return potN.isNeutral;
        }
      },
      {
        id: 'chk_5_4',
        text: 'Lampu Berhasil Menyala!',
        check: (engine) => {
          const bulb = engine.components.find(c => c.type === 'bulb');
          return !!(bulb && bulb.state.isLit);
        }
      }
    ],
    schematic: {
      title: "Diagram Pengawatan Sakelar Tukar (Hotel / Tangga)",
      desc: "Dua sakelar tukar SPDT dihubungkan sejajar pada terminal jalur 1 dan 2. Arus akan mengalir jika kedua sakelar berada di jalur yang sama.",
      svg: `
        <svg viewBox="0 0 500 200" width="100%" height="180">
          <rect x="20" y="50" width="55" height="90" rx="4" fill="#1e293b" stroke="#38bdf8"/>
          <rect x="110" y="50" width="45" height="80" rx="4" fill="#cbd5e1" stroke="#475569"/>
          <rect x="190" y="60" width="70" height="70" rx="4" fill="#f8fafc" stroke="#94a3b8"/>
          <rect x="300" y="60" width="70" height="70" rx="4" fill="#f8fafc" stroke="#94a3b8"/>
          <circle cx="430" cy="95" r="22" fill="#fef08a" stroke="#ca8a04"/>
          
          <path d="M 45 120 L 130 50" stroke="#8B4513" stroke-width="3" fill="none"/>
          <path d="M 130 130 L 205 120" stroke="#8B4513" stroke-width="3" fill="none"/>
          <path d="M 230 120 L 325 120" stroke="#f59e0b" stroke-width="3" fill="none"/>
          <path d="M 245 140 L 340 140" stroke="#f59e0b" stroke-width="3" fill="none"/>
          <path d="M 355 120 L 410 95" stroke="#f59e0b" stroke-width="3" fill="none"/>
          <path d="M 450 95 C 490 95, 490 190, 45 190 L 45 135" stroke="#2563EB" stroke-width="3" fill="none"/>
        </svg>
      `
    },
    checkCompletion: (engine) => {
      const bulb = engine.components.find(c => c.type === 'bulb');
      if (bulb && bulb.state.isLit) {
        return {
          passed: true,
          feedback: "Hebat sekali! Rangkaian sakelar tukar berfungsi sempurna. Ini adalah instalasi standar untuk lorong dan tangga gedung bertingkat!"
        };
      }
      return {
        passed: false,
        feedback: "Sambungkan: MCB Out -> COM Sakelar 1. Jalur 1 Sakelar 1 -> Jalur 1 Sakelar 2. Jalur 2 Sakelar 1 -> Jalur 2 Sakelar 2. COM Sakelar 2 -> Lampu Fasa. Netral Lampu -> Netral PLN."
      };
    }
  },

  // -----------------------------------------------------------------
  // LEVEL 6: Instalasi APP PLN (KWH Meter + Grounding Batang Arde)
  // -----------------------------------------------------------------
  {
    id: 6,
    title: "Level 6: Pemasangan APP PLN (KWH Meter & Pembumian)",
    category: "Instalasi PLN / Distribusi",
    difficulty: "Tantangan",
    theory: `
      <strong>Struktur Alat Pengukur dan Pembatas (APP) PLN:</strong><br>
      • Saluran Masuk Pelayanan (SMP) dari SUTR masuk ke terminal 1 (Fasa) & 3 (Netral) KWH Meter.<br>
      • Terminal 2 (Fasa Keluar) menuju ke MCB pembatas PLN.<br>
      • Terminal 4 (Netral Keluar) diteruskan ke instalasi beban rumah.<br>
      • Terminal 5 (Pentanahan) dihubungkan ke Batang Elektroda Pembumian (Ground Rod) dengan syarat tahanan tanah R &le; 5 Ohm sesuai PUIL.
    `,
    objective: "Pasang pengawatan KWH Meter PLN dari sumber SUTR, hubungkan MCB Pembatas, dan sambungkan sistem pembumian ke Batang Arde.",
    components: [
      { type: 'pln1p', x: 40, y: 150 },
      { type: 'kwh_meter', x: 190, y: 130 },
      { type: 'mcb1p', x: 420, y: 140, options: { rating: 'C2' } },
      { type: 'ground_rod', x: 530, y: 150, options: { resistance: 2.8 } },
      { type: 'bulb', x: 630, y: 150 }
    ],
    initialWires: [],
    toolsNeeded: ['wires'],
    checklist: [
      {
        id: 'chk_6_1',
        text: 'PLN (L) ke Terminal 1 KWH & PLN (N) ke Terminal 3 KWH',
        check: (engine) => {
          const w1 = engine.wires.some(w => w.to.includes('in_L') || w.from.includes('in_L'));
          const w2 = engine.wires.some(w => w.to.includes('in_N') || w.from.includes('in_N'));
          return w1 && w2;
        }
      },
      {
        id: 'chk_6_2',
        text: 'Terminal 2 KWH ke MCB IN & MCB OUT ke Lampu Fasa',
        check: (engine) => {
          const bulb = engine.components.find(c => c.type === 'bulb');
          if (!bulb) return false;
          const pot = engine.getPinPotential(`${bulb.id}_phase`);
          return pot.type === 'AC' && pot.v >= 180;
        }
      },
      {
        id: 'chk_6_3',
        text: 'Terminal 5 Pentanahan KWH ke Batang Arde (Ground Rod)',
        check: (engine) => engine.wires.some(w => w.from.includes('ground') || w.to.includes('ground'))
      },
      {
        id: 'chk_6_4',
        text: 'Piringan KWH Meter Berputar & Lampu Menyala',
        check: (engine) => {
          const kwh = engine.components.find(c => c.type === 'kwh_meter');
          const bulb = engine.components.find(c => c.type === 'bulb');
          return !!(kwh && kwh.state.isSpinning && bulb && bulb.state.isLit);
        }
      }
    ],
    schematic: {
      title: "Diagram APP PLN (Alat Pengukur dan Pembatas)",
      desc: "Terminal 1 dan 3 menerima suplai PLN. Terminal 2 dan 4 menyalurkan daya ke pelanggan. Terminal 5 melindungi instalasi dengan arde ke bumi.",
      svg: `
        <svg viewBox="0 0 500 200" width="100%" height="180">
          <rect x="20" y="40" width="60" height="90" rx="4" fill="#1e293b" stroke="#38bdf8"/>
          <rect x="120" y="30" width="120" height="110" rx="6" fill="#1e293b" stroke="#0284c7"/>
          <text x="180" y="55" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="bold">KWH METER</text>
          
          <rect x="280" y="40" width="45" height="80" rx="4" fill="#cbd5e1" stroke="#475569"/>
          <rect x="360" y="60" width="50" height="70" rx="4" fill="#1e293b" stroke="#16a34a"/>
          <circle cx="450" cy="85" r="20" fill="#fef08a" stroke="#ca8a04"/>
          
          <!-- Connections -->
          <line x1="45" y1="110" x2="135" y2="135" stroke="#8B4513" stroke-width="3"/>
          <line x1="165" y1="135" x2="300" y2="50" stroke="#8B4513" stroke-width="3"/>
          <line x1="300" y1="120" x2="430" y2="85" stroke="#8B4513" stroke-width="3"/>
          <line x1="60" y1="110" x2="195" y2="135" stroke="#2563EB" stroke-width="3"/>
          <line x1="225" y1="135" x2="470" y2="85" stroke="#2563EB" stroke-width="3"/>
          <line x1="240" y1="135" x2="385" y2="80" stroke="#16A34A" stroke-width="3"/>
        </svg>
      `
    },
    checkCompletion: (engine) => {
      const kwh = engine.components.find(c => c.type === 'kwh_meter');
      const bulb = engine.components.find(c => c.type === 'bulb');

      if (kwh && kwh.state.isSpinning && bulb && bulb.state.isLit) {
        return {
          passed: true,
          feedback: "Bagus sekali! KWH meter mencatat pemakaian listrik dan sistem pembumian terpasang sempurna sesuai ketentuan PUIL!"
        };
      }

      return {
        passed: false,
        feedback: "Ikuti diagram APP: PLN L -> KWH pin 1, KWH pin 2 -> MCB IN, MCB OUT -> Lampu Fasa. PLN N -> KWH pin 3, KWH pin 4 -> Lampu Netral. KWH pin 5 -> Batang Arde PE."
      };
    }
  },

  // -----------------------------------------------------------------
  // LEVEL 7: Pengukuran Sistem 3-Fasa Industri (380V / 220V)
  // -----------------------------------------------------------------
  {
    id: 7,
    title: "Level 7: Pengukuran Sistem 3-Fasa Industri (380V/220V)",
    category: "Industri & Alat Ukur",
    difficulty: "Mahir",
    theory: `
      <strong>Sistem Tenaga Listrik 3-Fasa (PUIL 2011):</strong><br>
      • <strong>Tegangan Fasa ke Netral (V_L-N)</strong>: Tegangan antara kawat fasa (R, S, atau T) terhadap Netral (N) = <strong>220 Volt AC</strong>.<br>
      • <strong>Tegangan Fasa ke Fasa (V_L-L / Tegangan Jalur)</strong>: Tegangan antar kawat fasa (R-S, S-T, atau T-R) = <strong>220 &times; &radic;3 &asymp; 380 Volt AC</strong>.<br>
      • Selalu gunakan Multimeter dengan batas ukur tegangan AC minimal 600V atau 750V AC!
    `,
    objective: "Gunakan multimeter skala AC 750V untuk mengukur: 1) Tegangan R ke Netral (220V), dan 2) Tegangan R ke S (380V).",
    components: [
      { type: 'pln3p', x: 240, y: 140 }
    ],
    initialWires: [],
    toolsNeeded: ['multimeter'],
    checklist: [
      {
        id: 'chk_7_1',
        text: 'Ukur Tegangan Fasa ke Netral (R ke N = 220V AC)',
        check: (engine, mm) => {
          const pA = mm.probeRed.attachedPin;
          const pB = mm.probeBlack.attachedPin;
          if (pA && pB && mm.mode === 'ACV_750') {
            const v = engine.measureVoltage(pA, pB);
            return v.v >= 210 && v.v <= 230;
          }
          return false;
        }
      },
      {
        id: 'chk_7_2',
        text: 'Ukur Tegangan Antar Fasa (R ke S = 380V AC)',
        check: (engine, mm) => {
          const pA = mm.probeRed.attachedPin;
          const pB = mm.probeBlack.attachedPin;
          if (pA && pB && mm.mode === 'ACV_750') {
            const v = engine.measureVoltage(pA, pB);
            return v.v >= 370 && v.v <= 390;
          }
          return false;
        }
      }
    ],
    schematic: {
      title: "Vektor Diagram Tegangan Sistem 3 Fasa",
      desc: "Tegangan antar fasa (Line to Line) selalu 1.732 kali lebih besar dari tegangan fasa ke netral karena pergeseran fasa 120 derajat.",
      svg: `
        <svg viewBox="0 0 400 180" width="100%" height="160">
          <circle cx="150" cy="90" r="60" fill="none" stroke="#475569" stroke-dasharray="4,4"/>
          <!-- R, S, T vectors -->
          <line x1="150" y1="90" x2="150" y2="30" stroke="#8B4513" stroke-width="3"/>
          <text x="150" y="24" text-anchor="middle" fill="#8B4513" font-weight="bold">R (0°)</text>
          
          <line x1="150" y1="90" x2="202" y2="120" stroke="#111827" stroke-width="3"/>
          <text x="215" y="125" text-anchor="middle" fill="#111827" font-weight="bold">S (-120°)</text>
          
          <line x1="150" y1="90" x2="98" y2="120" stroke="#6B7280" stroke-width="3"/>
          <text x="85" y="125" text-anchor="middle" fill="#6B7280" font-weight="bold">T (-240°)</text>
          
          <line x1="150" y1="30" x2="202" y2="120" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,3"/>
          <text x="270" y="70" fill="#facc15" font-size="11" font-weight="bold">V(R-S) = 380V</text>
          <text x="270" y="90" fill="#38bdf8" font-size="11" font-weight="bold">V(R-N) = 220V</text>
        </svg>
      `
    },
    checkCompletion: (engine, mm) => {
      const pinA = mm.probeRed.attachedPin;
      const pinB = mm.probeBlack.attachedPin;

      if (!pinA || !pinB) {
        return { passed: false, feedback: "Gunakan probe merah dan hitam untuk mengukur terminal tegangan 3-Fasa." };
      }

      if (mm.mode === 'ACV_750') {
        const v = engine.measureVoltage(pinA, pinB);
        if (v.v >= 370 && v.v <= 390) {
          return {
            passed: true,
            feedback: `Luar Biasa! Terukur tegangan antar Fasa = ${v.v} V AC (380V). Ini adalah standar industri untuk motor & mesin berat!`
          };
        } else if (v.v >= 210 && v.v <= 230) {
          return {
            passed: false,
            feedback: `Terukur ${v.v} V AC (Tegangan Fasa-Netral). Sekarang coba ukur tegangan Fasa ke Fasa (Probe Merah di R dan Hitam di S) untuk 380V!`
          };
        }
      }

      return {
        passed: false,
        feedback: "Pastikan selektor multimeter berada pada posisi ~ 750 V AC dan ukur antara terminal R dan terminal S."
      };
    }
  },

  // -----------------------------------------------------------------
  // LEVEL 8: Pengendali Motor Listrik 3 Fasa DOL (Direct On Line)
  // -----------------------------------------------------------------
  {
    id: 8,
    title: "Level 8: Starter Motor 3-Fasa DOL (Direct-On-Line)",
    category: "Industri & Tenaga",
    difficulty: "Master Kejuruan",
    theory: `
      <strong>Rangkaian DOL (Direct On Line) Starter:</strong><br>
      • <strong>Rangkaian Daya:</strong> Suplai 3 Fasa (R-S-T) -> MCB 3P -> Kontak Utama Kontaktor (1/L1, 3/L2, 5/L3) -> Output Kontaktor (2/T1, 4/T2, 6/T3) -> Terminal Motor (U1, V1, W1).<br>
      • <strong>Rangkaian Kontrol (Self-Holding / Pengunci):</strong> Kawat Fasa melalui MCB 1P -> Tombol STOP (NC) -> Tombol START (NO) dipasang paralel dengan Kontak Bantu NO 13-14 Kontaktor -> Koil Kontaktor A1 -> Koil A2 ke Netral.<br>
      Saat tombol START ditekan sekejap, koil A1-A2 bekerja dan kontak 13-14 mengunci arus, sehingga motor tetap berputar!
    `,
    objective: "Rakit rangkaian daya starter DOL motor 3-fasa. Naikkan MCB 3P dan hubungkan ke motor hingga motor berputar 1440 RPM!",
    components: [
      { type: 'pln3p', x: 30, y: 140 },
      { type: 'mcb3p', x: 260, y: 130, options: { rating: 'C16' } },
      { type: 'contactor', x: 440, y: 120 },
      { type: 'motor3p', x: 670, y: 130 }
    ],
    initialWires: [
      // Pre-wired control coil for ease of SMK grade 10 students focusing on main power stage
      { from: 'contactor_1_A1', to: 'mcb3p_1_out_R', color: '#8B4513' },
      { from: 'contactor_1_A2', to: 'pln3p_1_N', color: '#2563EB' }
    ],
    toolsNeeded: ['wires'],
    checklist: [
      {
        id: 'chk_8_1',
        text: 'Suplai R-S-T PLN ke Input MCB 3-Fasa (1, 3, 5)',
        check: (engine) => {
          const mcb = engine.components.find(c => c.type === 'mcb3p');
          if (!mcb) return false;
          const pR = engine.getPinPotential(`${mcb.id}_in_R`);
          const pS = engine.getPinPotential(`${mcb.id}_in_S`);
          const pT = engine.getPinPotential(`${mcb.id}_in_T`);
          return pR.v >= 180 && pS.v >= 180 && pT.v >= 180;
        }
      },
      {
        id: 'chk_8_2',
        text: 'Output MCB 3P (2, 4, 6) ke Kontak Utama Kontaktor (L1, L2, L3)',
        check: (engine) => {
          const km = engine.components.find(c => c.type === 'contactor');
          if (!km) return false;
          const p1 = engine.getPinPotential(`${km.id}_L1`);
          const p2 = engine.getPinPotential(`${km.id}_L2`);
          const p3 = engine.getPinPotential(`${km.id}_L3`);
          return p1.v >= 180 && p2.v >= 180 && p3.v >= 180;
        }
      },
      {
        id: 'chk_8_3',
        text: 'Output Kontaktor (T1, T2, T3) ke Terminal Motor (U1, V1, W1)',
        check: (engine) => {
          const m = engine.components.find(c => c.type === 'motor3p');
          if (!m) return false;
          return engine.wires.some(w => w.to.includes('motor3p') || w.from.includes('motor3p'));
        }
      },
      {
        id: 'chk_8_4',
        text: 'Naikkan MCB 3P dan Amati Motor Berputar 1440 RPM',
        check: (engine) => {
          const m = engine.components.find(c => c.type === 'motor3p');
          return !!(m && m.state.isRunning);
        }
      }
    ],
    schematic: {
      title: "Diagram Daya Pengasutan Motor 3-Fasa DOL",
      desc: "Tiga kawat fasa R, S, T diproteksi oleh MCB 3-kutub, dialirkan melalui kontak utama kontaktor KM1 (L1-T1, L2-T2, L3-T3), menuju terminal motor U1-V1-W1.",
      svg: `
        <svg viewBox="0 0 500 200" width="100%" height="180">
          <rect x="20" y="30" width="70" height="120" rx="4" fill="#1e293b" stroke="#f59e0b"/>
          <text x="55" y="55" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold">PLN 3P</text>
          
          <rect x="130" y="30" width="70" height="110" rx="4" fill="#cbd5e1" stroke="#475569"/>
          <text x="165" y="55" text-anchor="middle" fill="#0f172a" font-size="9" font-weight="bold">MCB 3P</text>
          
          <rect x="240" y="25" width="90" height="125" rx="4" fill="#334155" stroke="#0284c7"/>
          <text x="285" y="55" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="bold">KM1</text>
          
          <rect x="370" y="30" width="90" height="120" rx="6" fill="#1e293b" stroke="#64748b"/>
          <circle cx="415" cy="90" r="26" fill="#0f172a" stroke="#38bdf8"/>
          <text x="415" y="94" text-anchor="middle" fill="#facc15" font-size="9" font-weight="bold">MOTOR</text>
          
          <!-- R-S-T Lines -->
          <line x1="55" y1="125" x2="145" y2="35" stroke="#8B4513" stroke-width="2.5"/>
          <line x1="65" y1="125" x2="165" y2="35" stroke="#111827" stroke-width="2.5"/>
          <line x1="75" y1="125" x2="185" y2="35" stroke="#6B7280" stroke-width="2.5"/>
          
          <line x1="145" y1="135" x2="260" y2="35" stroke="#8B4513" stroke-width="2.5"/>
          <line x1="165" y1="135" x2="285" y2="35" stroke="#111827" stroke-width="2.5"/>
          <line x1="185" y1="135" x2="310" y2="35" stroke="#6B7280" stroke-width="2.5"/>
          
          <line x1="260" y1="145" x2="390" y2="145" stroke="#8B4513" stroke-width="2.5"/>
          <line x1="285" y1="145" x2="415" y2="145" stroke="#111827" stroke-width="2.5"/>
          <line x1="310" y1="145" x2="440" y2="145" stroke="#6B7280" stroke-width="2.5"/>
        </svg>
      `
    },
    checkCompletion: (engine) => {
      const motor = engine.components.find(c => c.type === 'motor3p');
      if (motor && motor.state.isRunning) {
        return {
          passed: true,
          feedback: `Bagus sekali! Rangkaian daya motor 3-fasa DOL berhasil berputar 1440 RPM!`
        };
      }

      if (motor && motor.state.statusNote.includes('BAHAYA')) {
        return {
          passed: false,
          feedback: "Peringatan: Motor mendengung karena hilang satu fasa! Pastikan ketiga fasa R, S, dan T terhubung lengkap ke U1, V1, dan W1."
        };
      }

      return {
        passed: false,
        feedback: "Sambungkan: Suplai R-S-T -> MCB 3P In. MCB 3P Out -> Kontaktor L1-L2-L3. Kontaktor T1-T2-T3 -> Motor U1-V1-W1. Naikkan tuas MCB 3P!"
      };
    }
  },

  // -----------------------------------------------------------------
  // LEVEL 9: Instalasi Gabungan Sakelar Tunggal + Lampu + Stop Kontak
  // -----------------------------------------------------------------
  {
    id: 9,
    title: "Level 9: Instalasi Gabungan (Sakelar, Lampu & Stop Kontak)",
    category: "Instalasi Domestik",
    difficulty: "Menengah",
    theory: `
      <strong>Instalasi Kotak Kontak & Sakelar Berdampingan (PUIL 2011):</strong><br>
      • Kawat Fasa dari MCB dicabangkan ke terminal masuk sakelar dan lubang Fasa stop kontak.<br>
      • Stop kontak WAJIB dilengkapi kawat pembumian (PE) berisolasi kuning-hijau yang tersambung ke elektroda bumi.<br>
      • Kawat Netral (Biru) dikopel untuk melayani beban lampu dan stop kontak.
    `,
    objective: "Rakit instalasi terpadu: 1 MCB 1P mengamankan 1 Sakelar Tunggal + Lampu dan 1 Stop Kontak 2P+PE. Pastikan lampu menyala dan stop kontak berdaya dengan grounding aman!",
    components: [
      { type: 'pln1p', x: 40, y: 150 },
      { type: 'mcb1p', x: 190, y: 140, options: { rating: 'C6' } },
      { type: 'switch_single', x: 300, y: 160 },
      { type: 'bulb', x: 440, y: 90 },
      { type: 'outlet', x: 440, y: 220 },
      { type: 'ground_rod', x: 600, y: 220 }
    ],
    initialWires: [],
    toolsNeeded: ['wires'],
    checklist: [
      {
        id: 'chk_9_1',
        text: 'PLN L ke MCB IN & MCB OUT ke Sakelar IN + Stop Kontak L',
        check: (engine) => {
          const sw = engine.components.find(c => c.type === 'switch_single');
          const ot = engine.components.find(c => c.type === 'outlet');
          if (!sw || !ot) return false;
          const pSw = engine.getPinPotential(`${sw.id}_in`);
          const pOt = engine.getPinPotential(`${ot.id}_L`);
          return pSw.v >= 180 && pOt.v >= 180;
        }
      },
      {
        id: 'chk_9_2',
        text: 'Netral PLN ke Netral Lampu dan Netral Stop Kontak',
        check: (engine) => {
          const b = engine.components.find(c => c.type === 'bulb');
          const ot = engine.components.find(c => c.type === 'outlet');
          if (!b || !ot) return false;
          const pB = engine.getPinPotential(`${b.id}_neutral`);
          const pOt = engine.getPinPotential(`${ot.id}_N`);
          return pB.isNeutral && pOt.isNeutral;
        }
      },
      {
        id: 'chk_9_3',
        text: 'Terminal Arde Stop Kontak (PE) ke Batang Pembumian (Ground Rod)',
        check: (engine) => {
          const ot = engine.components.find(c => c.type === 'outlet');
          return !!(ot && engine.getPinPotential(`${ot.id}_PE`).isGround);
        }
      },
      {
        id: 'chk_9_4',
        text: 'Naikkan MCB dan Tekan Sakelar (Lampu Nyala & Stop Kontak Aktif)',
        check: (engine) => {
          const b = engine.components.find(c => c.type === 'bulb');
          const ot = engine.components.find(c => c.type === 'outlet');
          return !!(b && b.state.isLit && ot && ot.state.isPowered);
        }
      }
    ],
    schematic: {
      title: "Skema Instalasi Gabungan Sakelar & Stop Kontak",
      desc: "Kawat Fasa melalui MCB dicabangkan ke Sakelar dan Stop Kontak. Kawat Netral melayani keduanya, dan kawat Pembumian PE khusus dihubungkan ke pelat arde Stop Kontak.",
      svg: `
        <svg viewBox="0 0 500 180" width="100%" height="160">
          <rect width="100%" height="100%" fill="#090e17" rx="6"/>
          <text x="250" y="24" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">SKEMA GABUNGAN SAKELAR + STOP KONTAK</text>
          <line x1="40" y1="50" x2="110" y2="50" stroke="#8B4513" stroke-width="2.5"/>
          <rect x="110" y="40" width="30" height="20" fill="#1e293b" stroke="#f59e0b"/>
          <line x1="140" y1="50" x2="220" y2="50" stroke="#8B4513" stroke-width="2.5"/>
          <!-- Branch to Switch & Outlet -->
          <circle cx="220" cy="50" r="3" fill="#8B4513"/>
          <line x1="220" y1="50" x2="300" y2="50" stroke="#8B4513" stroke-width="2"/>
          <line x1="220" y1="50" x2="220" y2="120" stroke="#8B4513" stroke-width="2"/>
          <line x1="220" y1="120" x2="300" y2="120" stroke="#8B4513" stroke-width="2"/>
          <!-- Switch & Lamp -->
          <rect x="300" y="42" width="30" height="16" fill="#1e293b" stroke="#38bdf8"/>
          <line x1="330" y1="50" x2="390" y2="50" stroke="#f59e0b" stroke-width="2"/>
          <circle cx="405" cy="50" r="14" fill="#1e293b" stroke="#facc15" stroke-width="2"/>
          <!-- Outlet -->
          <rect x="300" y="110" width="45" height="35" fill="#1e293b" stroke="#cbd5e1"/>
          <!-- Ground line -->
          <line x1="345" y1="135" x2="420" y2="135" stroke="#16a34a" stroke-width="2"/>
          <text x="440" y="140" fill="#16a34a" font-size="9">Arde PE</text>
        </svg>
      `
    },
    checkCompletion: (engine) => {
      const b = engine.components.find(c => c.type === 'bulb');
      const ot = engine.components.find(c => c.type === 'outlet');
      if (b && b.state.isLit && ot && ot.state.isPowered) {
        return {
          passed: true,
          feedback: "Hebat! Instalasi gabungan penerangan dan kotak kontak tersambung rapi dengan pengamanan pembumian sesuai standar PUIL 2011!"
        };
      }
      return {
        passed: false,
        feedback: "Pastikan kawat Fasa terhubung ke Sakelar dan Stop Kontak, kawat Netral terhubung ke Lampu dan Stop Kontak, serta kawat Arde terpasang ke Ground Rod."
      };
    }
  },

  // -----------------------------------------------------------------
  // LEVEL 10: Rangkaian Sakelar Silang (Kendali 3 Lokasi)
  // -----------------------------------------------------------------
  {
    id: 10,
    title: "Level 10: Kendali 3 Lokasi (2 Sakelar Tukar + 1 Sakelar Silang)",
    category: "Instalasi Penerangan",
    difficulty: "Tantangan",
    theory: `
      <strong>Prinsip Sakelar Silang (Cross / Intermediate Switch):</strong><br>
      • Untuk mengendalikan 1 lampu dari 3 tempat berbeda atau lebih, digunakan <strong>2 Sakelar Tukar</strong> di ujung awal dan ujung akhir, serta <strong>Sakelar Silang (4 Terminal)</strong> di tengah.<br>
      • Sakelar Silang dapat membalikkan posisi hubungan antara kawat Jalur A dan Jalur B.
    `,
    objective: "Rakit kendali 1 lampu dari 3 tempat menggunakan Sakelar Tukar 1, Sakelar Silang, dan Sakelar Tukar 2.",
    components: [
      { type: 'pln1p', x: 40, y: 150 },
      { type: 'mcb1p', x: 180, y: 140 },
      { type: 'switch_hotel', x: 280, y: 160, options: { id: 'sw_tukar_1', name: 'Sakelar Ujung 1' } },
      { type: 'switch_cross', x: 420, y: 140 },
      { type: 'switch_hotel', x: 560, y: 160, options: { id: 'sw_tukar_2', name: 'Sakelar Ujung 2' } },
      { type: 'bulb', x: 700, y: 150 }
    ],
    initialWires: [],
    toolsNeeded: ['wires'],
    checklist: [
      {
        id: 'chk_10_1',
        text: 'Fasa MCB ke COM Sakelar Tukar 1',
        check: (engine) => {
          const sw1 = engine.components.find(c => c.id.includes('sw_tukar_1'));
          return sw1 && engine.getPinPotential(`${sw1.id}_com`).v >= 180;
        }
      },
      {
        id: 'chk_10_2',
        text: 'Output L1 & L2 Sakelar Tukar 1 ke Input 1 & 2 Sakelar Silang',
        check: (engine) => {
          const sc = engine.components.find(c => c.type === 'switch_cross');
          return sc && engine.wires.some(w => w.to === `${sc.id}_1` || w.from === `${sc.id}_1`);
        }
      },
      {
        id: 'chk_10_3',
        text: 'Output 3 & 4 Sakelar Silang ke L1 & L2 Sakelar Tukar 2',
        check: (engine) => {
          const sw2 = engine.components.find(c => c.id.includes('sw_tukar_2'));
          return sw2 && engine.wires.some(w => w.to === `${sw2.id}_l1` || w.from === `${sw2.id}_l1`);
        }
      },
      {
        id: 'chk_10_4',
        text: 'COM Sakelar Tukar 2 ke Lampu Fasa & Netral Lampu ke PLN N',
        check: (engine) => {
          const b = engine.components.find(c => c.type === 'bulb');
          return b && b.state.isLit;
        }
      }
    ],
    schematic: {
      title: "Skema Pengendalian Lampu dari 3 Tempat",
      desc: "Fasa -> Sakelar Tukar 1 -> Sakelar Silang (Intermedier) -> Sakelar Tukar 2 -> Lampu -> Netral.",
      svg: `
        <svg viewBox="0 0 520 160" width="100%" height="160">
          <rect width="100%" height="100%" fill="#090e17" rx="6"/>
          <text x="260" y="22" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">KENDALI LAMPU 3 LOKASI (PUIL)</text>
          <!-- Switch 1 -->
          <rect x="70" y="50" width="45" height="40" fill="#1e293b" stroke="#38bdf8"/>
          <text x="92" y="74" fill="#fff" font-size="8" text-anchor="middle">TUKAR 1</text>
          <!-- Cross Switch -->
          <rect x="200" y="45" width="55" height="50" fill="#1e293b" stroke="#f59e0b"/>
          <text x="227" y="74" fill="#facc15" font-size="8" text-anchor="middle">SILANG</text>
          <!-- Switch 2 -->
          <rect x="340" y="50" width="45" height="40" fill="#1e293b" stroke="#38bdf8"/>
          <text x="362" y="74" fill="#fff" font-size="8" text-anchor="middle">TUKAR 2</text>
          <!-- Lamp -->
          <circle cx="450" cy="70" r="14" fill="#1e293b" stroke="#facc15" stroke-width="2"/>
        </svg>
      `
    },
    checkCompletion: (engine) => {
      const b = engine.components.find(c => c.type === 'bulb');
      if (b && b.state.isLit) {
        return {
          passed: true,
          feedback: "Luar biasa! Rangkaian kendali lampu dari 3 tempat dengan sakelar silang berfungsi sempurna!"
        };
      }
      return {
        passed: false,
        feedback: "Sambungkan: MCB Out -> COM Sakelar Tukar 1. L1 & L2 Tukar 1 -> Terminal 1 & 2 Sakelar Silang. Terminal 3 & 4 Sakelar Silang -> L1 & L2 Tukar 2. COM Tukar 2 -> Lampu Fasa. Netral Lampu -> PLN N."
      };
    }
  },

  // -----------------------------------------------------------------
  // LEVEL 11: Pemasangan APP PLN (KWH Meter 1 Fasa + Pembatas Arde)
  // -----------------------------------------------------------------
  {
    id: 11,
    title: "Level 11: Pemasangan APP PLN (KWH Meter & Pembumian)",
    category: "Distribusi PLN",
    difficulty: "Tantangan",
    theory: `
      <strong>Struktur Alat Pengukur dan Pembatas (APP) PLN:</strong><br>
      • Saluran Masuk Pelayanan (SMP) dari SUTR masuk ke terminal 1 (Fasa) & 3 (Netral) KWH Meter.<br>
      • Dari terminal 2 (Fasa Keluar) menuju MCB pembatas PLN.<br>
      • Terminal 4 (Netral Keluar) diteruskan ke instalasi rumah.<br>
      • Terminal 5 (Pentanahan) dihubungkan ke Batang Elektroda Pembumian (Ground Rod) dengan syarat tahanan tanah R ≤ 5 Ohm sesuai PUIL.
    `,
    objective: "Pasang pengawatan KWH Meter PLN dari sumber SUTR, hubungkan MCB Pembatas, dan sambungkan sistem pembumian ke Batang Arde.",
    components: [
      { type: 'pln1p', x: 40, y: 150 },
      { type: 'kwh_meter', x: 190, y: 130 },
      { type: 'mcb1p', x: 420, y: 140, options: { rating: 'C2' } },
      { type: 'ground_rod', x: 530, y: 150, options: { resistance: 2.8 } },
      { type: 'bulb', x: 630, y: 150 }
    ],
    initialWires: [],
    toolsNeeded: ['wires'],
    checklist: [
      {
        id: 'chk_11_1',
        text: 'Fasa SUTR ke Terminal 1 KWH & Netral SUTR ke Terminal 3 KWH',
        check: (engine) => {
          const k = engine.components.find(c => c.type === 'kwh_meter');
          return k && engine.getPinPotential(`${k.id}_in_L`).v >= 180 && engine.getPinPotential(`${k.id}_in_N`).isNeutral;
        }
      },
      {
        id: 'chk_11_2',
        text: 'Output Fasa KWH (2) ke Input MCB Pembatas',
        check: (engine) => {
          const m = engine.components.find(c => c.type === 'mcb1p');
          return m && engine.getPinPotential(`${m.id}_in`).v >= 180;
        }
      },
      {
        id: 'chk_11_3',
        text: 'Terminal Pentanahan KWH (5) ke Batang Arde (Ground Rod)',
        check: (engine) => {
          const k = engine.components.find(c => c.type === 'kwh_meter');
          return k && engine.getPinPotential(`${k.id}_ground`).isGround;
        }
      },
      {
        id: 'chk_11_4',
        text: 'MCB Output ke Fasa Beban & KWH Netral Out (4) ke Netral Beban',
        check: (engine) => {
          const b = engine.components.find(c => c.type === 'bulb');
          const k = engine.components.find(c => c.type === 'kwh_meter');
          return b && b.state.isLit && k && k.state.isSpinning;
        }
      }
    ],
    schematic: {
      title: "Diagram Sambungan APP KWH Meter PLN",
      desc: "Terminal 1: Fasa Masuk, Terminal 2: Fasa Keluar, Terminal 3: Netral Masuk, Terminal 4: Netral Keluar, Terminal 5: Pentanahan Bodi APP ke Ground Rod.",
      svg: `
        <svg viewBox="0 0 500 160" width="100%" height="160">
          <rect width="100%" height="100%" fill="#090e17" rx="6"/>
          <text x="250" y="24" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">SKEMA SAMBUNGAN KWH METER PLN</text>
          <rect x="180" y="45" width="140" height="90" fill="#1e293b" stroke="#38bdf8" rx="6"/>
          <text x="250" y="65" fill="#facc15" font-size="10" font-weight="bold" text-anchor="middle">KWH METER 1-PHASE</text>
          <text x="195" y="125" fill="#8B4513" font-size="9">1:L</text>
          <text x="225" y="125" fill="#8B4513" font-size="9">2:L</text>
          <text x="255" y="125" fill="#2563EB" font-size="9">3:N</text>
          <text x="285" y="125" fill="#2563EB" font-size="9">4:N</text>
          <text x="310" y="125" fill="#16a34a" font-size="9">5:PE</text>
        </svg>
      `
    },
    checkCompletion: (engine) => {
      const kwh = engine.components.find(c => c.type === 'kwh_meter');
      const bulb = engine.components.find(c => c.type === 'bulb');
      if (kwh && kwh.state.isSpinning && bulb && bulb.state.isLit) {
        return {
          passed: true,
          feedback: "Sempurna! KWH meter mencatat pemakaian listrik dan sistem pembumian terpasang sesuai standar penyambungan PLN!"
        };
      }
      return {
        passed: false,
        feedback: "Ikuti diagram APP: PLN L -> KWH pin 1, KWH pin 2 -> MCB IN, MCB OUT -> Lampu Fasa. PLN N -> KWH pin 3, KWH pin 4 -> Lampu Netral. KWH pin 5 -> Batang Arde PE."
      };
    }
  },

  // -----------------------------------------------------------------
  // LEVEL 12: Panel Hubung Bagi (PHB) 2 Kelompok / Grup
  // -----------------------------------------------------------------
  {
    id: 12,
    title: "Level 12: Pembagian Beban PHB 2 Kelompok (Penerangan & Stop Kontak)",
    category: "Distribusi Domestik",
    difficulty: "Mahir",
    theory: `
      <strong>Pembagian Grup pada Panel Hubung Bagi (PHB):</strong><br>
      • PUIL 2011 mensyaratkan instalasi rumah tinggal membagi beban minimal menjadi 2 kelompok sirkuit akhir.<br>
      • <strong>MCB Utama (C10 / 10A)</strong> membatasi total daya keseluruhan.<br>
      • <strong>MCB Grup 1 (C4 / 4A)</strong> khusus melayani sirkuit penerangan.<br>
      • <strong>MCB Grup 2 (C6 / 6A)</strong> khusus melayani sirkuit tenaga (stop kontak).
    `,
    objective: "Rakit sistem PHB 2 grup dengan 1 MCB Utama yang mencabangkan Fasa ke MCB Grup 1 (Lampu) dan MCB Grup 2 (Stop Kontak).",
    components: [
      { type: 'pln1p', x: 40, y: 150 },
      { type: 'mcb1p', x: 180, y: 140, options: { id: 'mcb_utama', rating: 'C10', name: 'MCB Utama (10A)' } },
      { type: 'mcb1p', x: 300, y: 80, options: { id: 'mcb_grup1', rating: 'C4', name: 'MCB Grup 1 (4A)' } },
      { type: 'mcb1p', x: 300, y: 220, options: { id: 'mcb_grup2', rating: 'C6', name: 'MCB Grup 2 (6A)' } },
      { type: 'bulb', x: 460, y: 80 },
      { type: 'outlet', x: 460, y: 220 },
      { type: 'ground_rod', x: 620, y: 220 }
    ],
    initialWires: [],
    toolsNeeded: ['wires'],
    checklist: [
      {
        id: 'chk_12_1',
        text: 'PLN L ke MCB Utama & Output MCB Utama dicabang ke Input MCB Grup 1 dan 2',
        check: (engine) => {
          const g1 = engine.components.find(c => c.id.includes('mcb_grup1'));
          const g2 = engine.components.find(c => c.id.includes('mcb_grup2'));
          return g1 && g2 && engine.getPinPotential(`${g1.id}_in`).v >= 180 && engine.getPinPotential(`${g2.id}_in`).v >= 180;
        }
      },
      {
        id: 'chk_12_2',
        text: 'Output MCB Grup 1 ke Lampu Fasa & Netral Lampu ke PLN N',
        check: (engine) => {
          const b = engine.components.find(c => c.type === 'bulb');
          return b && b.state.isLit;
        }
      },
      {
        id: 'chk_12_3',
        text: 'Output MCB Grup 2 ke Stop Kontak L & Grounding Stop Kontak ke Ground Rod',
        check: (engine) => {
          const ot = engine.components.find(c => c.type === 'outlet');
          return ot && ot.state.isPowered && engine.getPinPotential(`${ot.id}_PE`).isGround;
        }
      }
    ],
    schematic: {
      title: "Diagram Pembagian Kelompok Sirkuit Akhir PHB",
      desc: "MCB Utama memproteksi induk panel. Busbar fasa mendistribusikan arus ke MCB Cabang Grup 1 (Penerangan) dan Grup 2 (Tenaga).",
      svg: `
        <svg viewBox="0 0 500 180" width="100%" height="160">
          <rect width="100%" height="100%" fill="#090e17" rx="6"/>
          <text x="250" y="24" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">DIAGRAM PHB 2 KELOMPOK</text>
          <line x1="50" y1="90" x2="120" y2="90" stroke="#8B4513" stroke-width="2.5"/>
          <rect x="120" y="78" width="40" height="24" fill="#1e293b" stroke="#f59e0b"/>
          <text x="140" y="94" fill="#fff" font-size="8" text-anchor="middle">UTAMA</text>
          <!-- Busbar Split -->
          <line x1="160" y1="90" x2="220" y2="90" stroke="#8B4513" stroke-width="3"/>
          <line x1="220" y1="50" x2="220" y2="130" stroke="#ca8a04" stroke-width="3"/>
          <!-- Branch 1 -->
          <line x1="220" y1="50" x2="270" y2="50" stroke="#8B4513" stroke-width="2.5"/>
          <rect x="270" y="38" width="35" height="24" fill="#1e293b" stroke="#38bdf8"/>
          <text x="287" y="54" fill="#fff" font-size="8" text-anchor="middle">GRUP 1</text>
          <!-- Branch 2 -->
          <line x1="220" y1="130" x2="270" y2="130" stroke="#8B4513" stroke-width="2.5"/>
          <rect x="270" y="118" width="35" height="24" fill="#1e293b" stroke="#38bdf8"/>
          <text x="287" y="134" fill="#fff" font-size="8" text-anchor="middle">GRUP 2</text>
        </svg>
      `
    },
    checkCompletion: (engine) => {
      const b = engine.components.find(c => c.type === 'bulb');
      const ot = engine.components.find(c => c.type === 'outlet');
      if (b && b.state.isLit && ot && ot.state.isPowered) {
        return {
          passed: true,
          feedback: "Bagus sekali! Panel Hubung Bagi (PHB) 2 grup berhasil didistribusikan dengan andal dan seimbang!"
        };
      }
      return {
        passed: false,
        feedback: "Pastikan kedua grup aktif: MCB Utama -> cabang ke MCB Grup 1 (menyalakan lampu) dan MCB Grup 2 (menyalakan stop kontak)."
      };
    }
  },

  // -----------------------------------------------------------------
  // LEVEL 13: Proteksi Kebocoran Arus ELCB / RCCB 30mA
  // -----------------------------------------------------------------
  {
    id: 13,
    title: "Level 13: Proteksi Keselamatan Kebocoran Arus ELCB 30mA",
    category: "Proteksi & K3",
    difficulty: "Mahir",
    theory: `
      <strong>Prinsip Kerja ELCB / RCCB (PUIL 2011 Pasal 3.15):</strong><br>
      • ELCB 30mA adalah gawai proteksi arus sisa berkecepatan tinggi untuk melindungi manusia dari sengatan listrik.<br>
      • Bekerja dengan membandingkan keseimbangan arus antara kawat Fasa dan Netral. Jika ada kebocoran arus $\ge 30\text{mA}$ ke bumi, tuas langsung TRIP otomatis dalam waktu $< 0.1$ detik!<br>
      • Tombol <strong>Test 'T'</strong> berfungsi untuk menguji keandalan mekanik relay trip.
    `,
    objective: "Pasang ELCB 30mA pada instalasi stop kontak dan uji tombol Test 'T' untuk memastikan proteksi bekerja aktif.",
    components: [
      { type: 'pln1p', x: 50, y: 150 },
      { type: 'elcb', x: 230, y: 130 },
      { type: 'outlet', x: 420, y: 150 },
      { type: 'ground_rod', x: 580, y: 150 }
    ],
    initialWires: [],
    toolsNeeded: ['wires'],
    checklist: [
      {
        id: 'chk_13_1',
        text: 'PLN L & N ke Terminal IN L & IN N ELCB',
        check: (engine) => {
          const el = engine.components.find(c => c.type === 'elcb');
          return el && engine.getPinPotential(`${el.id}_in_L`).v >= 180 && engine.getPinPotential(`${el.id}_in_N`).isNeutral;
        }
      },
      {
        id: 'chk_13_2',
        text: 'Terminal OUT L & OUT N ELCB ke Stop Kontak L & N',
        check: (engine) => {
          const ot = engine.components.find(c => c.type === 'outlet');
          return ot && engine.wires.some(w => w.to === `${ot.id}_L` || w.from === `${ot.id}_L`);
        }
      },
      {
        id: 'chk_13_3',
        text: 'Stop Kontak Arde (PE) ke Batang Pembumian',
        check: (engine) => {
          const ot = engine.components.find(c => c.type === 'outlet');
          return ot && engine.getPinPotential(`${ot.id}_PE`).isGround;
        }
      },
      {
        id: 'chk_13_4',
        text: 'Naikkan Tuas ELCB ke ON (Stop Kontak Aktif)',
        check: (engine) => {
          const ot = engine.components.find(c => c.type === 'outlet');
          return ot && ot.state.isPowered;
        }
      }
    ],
    schematic: {
      title: "Diagram Proteksi ELCB / RCCB 30mA",
      desc: "Kawat Fasa dan Netral melewati inti transformator arus diferensial di dalam ELCB. Beban diproteksi dengan grounding terhubung ke tanah.",
      svg: `
        <svg viewBox="0 0 500 160" width="100%" height="160">
          <rect width="100%" height="100%" fill="#090e17" rx="6"/>
          <text x="250" y="24" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">SKEMA PROTEKSI ARUS BOCOR ELCB 30mA</text>
          <rect x="180" y="40" width="100" height="90" fill="#1e293b" stroke="#ef4444" rx="6"/>
          <text x="230" y="65" fill="#facc15" font-size="10" font-weight="bold" text-anchor="middle">ELCB 2P 30mA</text>
          <circle cx="255" cy="85" r="7" fill="#f59e0b"/>
          <text x="255" y="88" fill="#000" font-size="7" font-weight="bold" text-anchor="middle">T</text>
        </svg>
      `
    },
    checkCompletion: (engine) => {
      const ot = engine.components.find(c => c.type === 'outlet');
      if (ot && ot.state.isPowered) {
        return {
          passed: true,
          feedback: "Luar biasa! Instalasi berproteksi ELCB 30mA terpasang sempurna. Konsumen terlindung dari risiko sengatan listrik yang fatal!"
        };
      }
      return {
        passed: false,
        feedback: "Sambungkan PLN L & N ke ELCB IN, keluaran ELCB OUT ke Stop Kontak, pasang Arde PE ke Ground Rod, lalu naikkan tuas ELCB."
      };
    }
  },

  // -----------------------------------------------------------------
  // LEVEL 14: Pengukuran Sistem 3-Fasa Industri (380V / 220V)
  // -----------------------------------------------------------------
  {
    id: 14,
    title: "Level 14: Pengukuran Sistem 3-Fasa Industri (380V/220V)",
    category: "Industri & Alat Ukur",
    difficulty: "Mahir",
    theory: `
      <strong>Sistem Tenaga Listrik 3-Fasa (PUIL 2011):</strong><br>
      • <strong>Tegangan Fasa ke Netral (V_L-N)</strong>: Tegangan antara kawat fasa (R, S, atau T) terhadap Netral (N) = <strong>220 Volt AC</strong>.<br>
      • <strong>Tegangan Fasa ke Fasa (V_L-L / Tegangan Jalur)</strong>: Tegangan antar kawat fasa (R ke S, S ke T, atau T ke R) = <strong>220 × √3 ≈ 380 Volt AC</strong>.<br>
      • Selalu gunakan Multimeter dengan batas ukur tegangan AC minimal 600V atau 750V AC!
    `,
    objective: "Gunakan multimeter AC 750V untuk mengukur: 1) Tegangan R ke Netral (220V), dan 2) Tegangan R ke S (380V).",
    components: [
      { type: 'pln3p', x: 260, y: 140 }
    ],
    initialWires: [],
    toolsNeeded: ['multimeter'],
    checklist: [
      {
        id: 'chk_14_1',
        text: 'Atur Selektor Multimeter ke Skala ~ 750 V AC',
        check: (engine, mm) => mm.mode === 'ACV_750'
      },
      {
        id: 'chk_14_2',
        text: 'Ukur Tegangan Antar Fasa (Probe Merah di R, Probe Hitam di S)',
        check: (engine, mm) => {
          const pinA = mm.probeRed.attachedPin;
          const pinB = mm.probeBlack.attachedPin;
          if (!pinA || !pinB || mm.mode !== 'ACV_750') return false;
          const v = engine.measureVoltage(pinA, pinB);
          return v.v >= 370 && v.v <= 390;
        }
      }
    ],
    schematic: {
      title: "Hubungan Bintang (Star/Y) Sistem 3-Fasa",
      desc: "Tegangan fasa-ke-fasa sama dengan akar 3 dikali tegangan fasa-ke-netral: V_L-L = 1.732 x 220V = 380V AC.",
      svg: `
        <svg viewBox="0 0 400 180" width="100%" height="160">
          <rect width="100%" height="100%" fill="#090e17" rx="6"/>
          <text x="200" y="24" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">VEKTOR TEGANGAN 3-FASA</text>
          <!-- Star Y Winding -->
          <line x1="200" y1="90" x2="200" y2="40" stroke="#8B4513" stroke-width="3"/>
          <text x="200" y="35" fill="#8B4513" font-size="9" text-anchor="middle">R (0°)</text>
          <line x1="200" y1="90" x2="150" y2="130" stroke="#111827" stroke-width="3" stroke-dasharray="3,1"/>
          <text x="140" y="140" fill="#cbd5e1" font-size="9">S (-120°)</text>
          <line x1="200" y1="90" x2="250" y2="130" stroke="#6B7280" stroke-width="3"/>
          <text x="260" y="140" fill="#6B7280" font-size="9">T (-240°)</text>
          <circle cx="200" cy="90" r="4" fill="#2563EB"/>
          <text x="200" y="105" fill="#2563EB" font-size="9" text-anchor="middle">N (Titik Bintang)</text>
        </svg>
      `
    },
    checkCompletion: (engine, mm) => {
      const pinA = mm.probeRed.attachedPin;
      const pinB = mm.probeBlack.attachedPin;
      if (!pinA || !pinB) return { passed: false, feedback: "Tempelkan kedua probe multimeter ke terminal sumber 3-fasa." };

      if (mm.mode === 'ACV_750') {
        const v = engine.measureVoltage(pinA, pinB);
        if (v.v >= 370 && v.v <= 390) {
          return {
            passed: true,
            feedback: `Luar Biasa! Terukur tegangan antar Fasa (Line-to-Line) = ${v.v} V AC (380V). Standar industri untuk menggerakkan mesin & motor besar!`
          };
        }
      }
      return { passed: false, feedback: "Ukur tegangan antara fasa R dan fasa S menggunakan skala ACV 750V." };
    }
  },

  // -----------------------------------------------------------------
  // LEVEL 15: Rangkaian Kontrol Motor 3-Fasa DOL (Pengunci NO 13-14)
  // -----------------------------------------------------------------
  {
    id: 15,
    title: "Level 15: Rangkaian Kontrol Pengasut Motor DOL (Self-Holding)",
    category: "Industri & Tenaga",
    difficulty: "Master Kejuruan",
    theory: `
      <strong>Rangkaian Kontrol Pengunci (Self-Holding / Latching Circuit):</strong><br>
      • Tombol <strong>STOP (NC 1-2)</strong> selalu terhubung normal. Saat ditekan, sirkuit terbuka mematikan sistem.<br>
      • Tombol <strong>START (NO 3-4)</strong> dipasang paralel dengan kontak bantu <strong>NO 13-14 Kontaktor</strong>.<br>
      • Saat START ditekan, koil A1-A2 teraliri arus, menarik kontak 13-14 menjadi tertutup. Ketika tombol START dilepas, arus tetap mengalir melalui 13-14 menuju koil A1!
    `,
    objective: "Rakit rangkaian kontrol dengan Tombol STOP, Tombol START, dan kontak pengunci NO 13-14 hingga Lampu Indikator Hijau (RUN) menyala dan mengunci.",
    components: [
      { type: 'pln1p', x: 50, y: 150 },
      { type: 'mcb1p', x: 190, y: 140, options: { rating: 'C2', name: 'MCB Kontrol' } },
      { type: 'push_button', x: 300, y: 150, options: { isNC: true, name: 'STOP (NC)' } },
      { type: 'push_button', x: 420, y: 150, options: { isNC: false, name: 'START (NO)' } },
      { type: 'contactor', x: 550, y: 120 },
      { type: 'pilot_lamp', x: 740, y: 150, options: { color: 'green', name: 'Lampu RUN' } }
    ],
    initialWires: [],
    toolsNeeded: ['wires'],
    checklist: [
      {
        id: 'chk_15_1',
        text: 'PLN L ke MCB Kontrol & MCB Out ke Tombol STOP (1)',
        check: (engine) => {
          const pbStop = engine.components.find(c => c.isNC);
          return pbStop && engine.getPinPotential(`${pbStop.id}_1`).v >= 180;
        }
      },
      {
        id: 'chk_15_2',
        text: 'STOP (2) ke START (3) diparalel dengan Kontak Bantu NO 13 Kontaktor',
        check: (engine) => {
          const km = engine.components.find(c => c.type === 'contactor');
          return km && engine.wires.some(w => w.to === `${km.id}_13` || w.from === `${km.id}_13`);
        }
      },
      {
        id: 'chk_15_3',
        text: 'START (4) & Kontak Bantu NO 14 ke Koil A1 Kontaktor + Lampu RUN',
        check: (engine) => {
          const km = engine.components.find(c => c.type === 'contactor');
          return km && engine.wires.some(w => w.to === `${km.id}_A1` || w.from === `${km.id}_A1`);
        }
      },
      {
        id: 'chk_15_4',
        text: 'Koil A2 Kontaktor & Netral Lampu RUN ke PLN Netral',
        check: (engine) => {
          const km = engine.components.find(c => c.type === 'contactor');
          return km && engine.getPinPotential(`${km.id}_A2`).isNeutral;
        }
      }
    ],
    schematic: {
      title: "Diagram Kontrol Pengunci DOL (Self-Holding)",
      desc: "Tombol STOP (NC) seri dengan Tombol START (NO). Kontak bantu 13-14 dipasang paralel dengan START menuju koil A1.",
      svg: `
        <svg viewBox="0 0 520 180" width="100%" height="160">
          <rect width="100%" height="100%" fill="#090e17" rx="6"/>
          <text x="260" y="24" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">RANGKAIAN KONTROL PENGUNCI (LATCHING)</text>
          <line x1="40" y1="60" x2="100" y2="60" stroke="#8B4513" stroke-width="2.5"/>
          <!-- STOP NC -->
          <circle cx="110" cy="60" r="3" fill="#ef4444"/>
          <line x1="110" y1="57" x2="135" y2="57" stroke="#ef4444" stroke-width="2.5"/>
          <circle cx="135" cy="60" r="3" fill="#ef4444"/>
          <text x="122" y="48" fill="#ef4444" font-size="8" text-anchor="middle">STOP (NC)</text>
          <!-- START NO -->
          <line x1="135" y1="60" x2="200" y2="60" stroke="#8B4513" stroke-width="2"/>
          <circle cx="200" cy="60" r="3" fill="#22c55e"/>
          <line x1="200" y1="60" x2="225" y2="48" stroke="#22c55e" stroke-width="2.5"/>
          <circle cx="225" cy="60" r="3" fill="#22c55e"/>
          <text x="212" y="44" fill="#22c55e" font-size="8" text-anchor="middle">START (NO)</text>
          <!-- Parallel 13-14 -->
          <line x1="180" y1="60" x2="180" y2="105" stroke="#f59e0b" stroke-width="2"/>
          <line x1="180" y1="105" x2="200" y2="105" stroke="#f59e0b" stroke-width="2"/>
          <rect x="200" y="96" width="30" height="18" fill="#1e293b" stroke="#38bdf8"/>
          <text x="215" y="109" fill="#38bdf8" font-size="8" text-anchor="middle">13-14</text>
          <line x1="230" y1="105" x2="250" y2="105" stroke="#f59e0b" stroke-width="2"/>
          <line x1="250" y1="105" x2="250" y2="60" stroke="#f59e0b" stroke-width="2"/>
          <!-- Coil A1-A2 -->
          <line x1="225" y1="60" x2="330" y2="60" stroke="#8B4513" stroke-width="2"/>
          <rect x="330" y="46" width="40" height="28" fill="#1e293b" stroke="#0284c7"/>
          <text x="350" y="64" fill="#38bdf8" font-size="9" font-weight="bold" text-anchor="middle">A1-A2</text>
        </svg>
      `
    },
    checkCompletion: (engine) => {
      const km = engine.components.find(c => c.type === 'contactor');
      const pl = engine.components.find(c => c.type === 'pilot_lamp');
      if (km && km.state.isEnergized && pl && pl.state.isLit) {
        return {
          passed: true,
          feedback: "Hebat sekali! Rangkaian kontrol pengunci kontaktor berhasil aktif dan lampu indikator RUN menyala terang!"
        };
      }
      return {
        passed: false,
        feedback: "Tekan tombol START untuk mengaktifkan kontaktor. Pastikan kontak pengunci NO 13-14 telah dipasang paralel dengan tombol START."
      };
    }
  },

  // -----------------------------------------------------------------
  // LEVEL 16: Pengendali Motor 3 Fasa Lengkap (Daya + Kontrol + Overload TOR)
  // -----------------------------------------------------------------
  {
    id: 16,
    title: "Level 16: Pengendali Motor 3-Fasa Industri (DOL + Proteksi TOR)",
    category: "Industri & Tenaga",
    difficulty: "Master Kejuruan",
    theory: `
      <strong>Sistem Pengendalian Motor Industri Standar Lengkap:</strong><br>
      • <strong>Rangkaian Daya:</strong> MCB 3P -> Kontaktor KM1 -> Thermal Overload Relay (TOR) -> Motor 3-Fasa.<br>
      • <strong>Rangkaian Proteksi:</strong> Kontak bantu <strong>NC 95-96 TOR</strong> dipasang seri pada rangkaian kontrol. Jika terjadi arus beban lebih (*overload*), bimetal TOR memuai membuka kontak 95-96 sehingga koil kontaktor terputus dan motor selamat dari terbakar!<br>
      • Ini adalah standar tertinggi kompetensi instalasi motor listrik SMK!
    `,
    objective: "Rakit sistem starter motor 3-fasa lengkap dengan proteksi Thermal Overload Relay (TOR). Pastikan motor berputar 1440 RPM dan lampu RUN menyala!",
    components: [
      { type: 'pln3p', x: 30, y: 140 },
      { type: 'mcb3p', x: 230, y: 130 },
      { type: 'contactor', x: 380, y: 120 },
      { type: 'tor', x: 570, y: 130 },
      { type: 'motor3p', x: 730, y: 130 }
    ],
    initialWires: [
      { from: 'contactor_1_A1', to: 'mcb3p_1_out_R', color: '#8B4513' },
      { from: 'contactor_1_A2', to: 'pln3p_1_N', color: '#2563EB' },
      { from: 'contactor_1_T1', to: 'tor_1_in_1', color: '#8B4513' },
      { from: 'contactor_1_T2', to: 'tor_1_in_2', color: '#111827' },
      { from: 'contactor_1_T3', to: 'tor_1_in_3', color: '#6B7280' }
    ],
    toolsNeeded: ['wires'],
    checklist: [
      {
        id: 'chk_16_1',
        text: 'Suplai 3 Fasa R-S-T ke Input MCB 3P & Output MCB ke Kontaktor L1-L2-L3',
        check: (engine) => {
          const km = engine.components.find(c => c.type === 'contactor');
          return km && engine.getPinPotential(`${km.id}_L1`).v >= 180;
        }
      },
      {
        id: 'chk_16_2',
        text: 'Output TOR (T1, T2, T3) ke Terminal Motor U1, V1, W1',
        check: (engine) => {
          const m = engine.components.find(c => c.type === 'motor3p');
          return m && engine.wires.some(w => w.to.includes('motor3p') || w.from.includes('motor3p'));
        }
      },
      {
        id: 'chk_16_3',
        text: 'Naikkan MCB 3P dan Amati Motor Berputar Normal (1440 RPM)',
        check: (engine) => {
          const m = engine.components.find(c => c.type === 'motor3p');
          return m && m.state.isRunning;
        }
      }
    ],
    schematic: {
      title: "Diagram Sistem Pengasut Motor 3-Fasa Industri Lengkap",
      desc: "Suplai 380V -> MCB 3P -> Kontaktor KM1 -> Thermal Overload Relay (TOR) -> Motor Listrik 3-Fasa M1.",
      svg: `
        <svg viewBox="0 0 540 180" width="100%" height="160">
          <rect width="100%" height="100%" fill="#090e17" rx="6"/>
          <text x="270" y="22" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">SISTEM PENGASUT MOTOR 3-FASA LENGKAP DENGAN TOR</text>
          <rect x="30" y="45" width="45" height="90" fill="#1e293b" stroke="#f59e0b"/>
          <text x="52" y="90" fill="#f59e0b" font-size="8" text-anchor="middle">PLN 3P</text>
          <rect x="110" y="45" width="45" height="90" fill="#1e293b" stroke="#cbd5e1"/>
          <text x="132" y="90" fill="#fff" font-size="8" text-anchor="middle">MCB 3P</text>
          <rect x="190" y="45" width="55" height="90" fill="#1e293b" stroke="#0284c7"/>
          <text x="217" y="90" fill="#38bdf8" font-size="9" text-anchor="middle">KM1</text>
          <rect x="280" y="45" width="50" height="90" fill="#1e293b" stroke="#f97316"/>
          <text x="305" y="90" fill="#fdba74" font-size="8" text-anchor="middle">TOR</text>
          <circle cx="410" cy="90" r="32" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <text x="410" y="94" fill="#facc15" font-size="10" font-weight="bold" text-anchor="middle">MOTOR 3~</text>
        </svg>
      `
    },
    checkCompletion: (engine) => {
      const motor = engine.components.find(c => c.type === 'motor3p');
      if (motor && motor.state.isRunning) {
        return {
          passed: true,
          feedback: `SELAMAT! Anda telah menguasai seluruh 16 level materi instalasi dan pengukuran listrik SMK Kelas 10 berstandar PUIL 2011! Anda layak mendapat Sertifikat Teknisi Andal!`
        };
      }
      return {
        passed: false,
        feedback: "Sambungkan: Suplai R-S-T -> MCB 3P -> Kontaktor L1-L2-L3. Output TOR 2/T1, 4/T2, 6/T3 ke Motor U1, V1, W1. Naikkan tuas MCB 3P!"
      };
    }
  }
];

window.GAME_LEVELS = GAME_LEVELS;

