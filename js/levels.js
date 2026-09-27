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
          feedback: `SELAMAT! Motor Induksi 3 Fasa berhasil berputar sempurna (${motor.state.rpm} RPM). Anda telah menyelesaikan seluruh tingkatan kejuruan listrik SMK!`
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
  }
];

window.GAME_LEVELS = GAME_LEVELS;
