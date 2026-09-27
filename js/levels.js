/**
 * Mission Levels Configuration for VoltMaster SMK
 * Tailored for SMK Grade 10 (Dasar-dasar Teknik Ketenagalistrikan / TITL / TIPTL / TPTUP)
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
      Kawat <strong>Fasa (L)</strong> membawa tegangan bolak-balik 220V terhadap tanah. Jika tespen disentuhkan ke Fasa dan ujung pangkalnya disentuh jari, lampu neon di dalam tespen akan <strong>menyala oranye</strong>.<br>
      Kawat <strong>Netral (N)</strong> dan <strong>Pembumian/Arde (PE)</strong> tidak memiliki beda potensial terhadap tanah, sehingga lampu tespen tidak menyala.
    `,
    objective: "Ujilah ketiga terminal suplai PLN (L, N, PE) menggunakan Tespen. Pastikan kamu berhasil mendeteksi kawat Fasa (L) yang bertegangan!",
    components: [
      { type: 'pln1p', x: 260, y: 150 }
    ],
    initialWires: [],
    toolsNeeded: ['tespen'],
    checkCompletion: (engine, mm) => {
      // Checked if student tested the L pin with tespen
      const tespenAttached = mm.tespenPos.attachedPin;
      if (tespenAttached && tespenAttached.endsWith('_L')) {
        const test = engine.testTespen(tespenAttached);
        if (test.glows) {
          return {
            passed: true,
            feedback: "Luar biasa! Lampu neon tespen menyala terang. Ini membuktikan kawat Fasa bertegangan 220V. Ingat: Selalu gunakan Tespen sebelum bekerja!"
          };
        }
      }
      return {
        passed: false,
        feedback: "Aktifkan alat Tespen, lalu dekatkan ujung tespen ke terminal L (Fasa) untuk mendeteksi tegangan hidup."
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
      1. Untuk mengukur baterai/aki DC, posisikan selektor pada skala <strong>⎓ DCV (20V)</strong>.<br>
      2. Untuk mengukur tegangan listrik PLN rumah tangga, posisikan selektor pada skala <strong>~ ACV (750V)</strong>.<br>
      3. Probe <strong>Merah (+)</strong> dan Probe <strong>Hitam (-/COM)</strong> dipasang paralel pada kedua kutub/terminal yang diukur.
    `,
    objective: "Lakukan pengukuran tegangan pada Baterai DC 12V (Mode DCV 20V) dan pada Suplai PLN 220V (Mode ACV 750V).",
    components: [
      { type: 'battery', x: 140, y: 160, options: { voltage: 12 } },
      { type: 'pln1p', x: 420, y: 150 }
    ],
    initialWires: [],
    toolsNeeded: ['multimeter'],
    checkCompletion: (engine, mm) => {
      const pinA = mm.probeRed.attachedPin;
      const pinB = mm.probeBlack.attachedPin;

      if (!pinA || !pinB) {
        return { passed: false, feedback: "Tempelkan kedua probe multimeter (Merah dan Hitam) ke terminal yang ingin diukur." };
      }

      // Check DC Battery measurement
      if ((pinA.includes('battery') && pinB.includes('battery')) && (mm.mode === 'DCV_20' || mm.mode === 'DCV_1000')) {
        const v = engine.measureVoltage(pinA, pinB);
        if (Math.abs(v.v) >= 11.5) {
          return {
            passed: true,
            feedback: `Hebat! Kamu berhasil mengukur Baterai DC sebesar ${Math.abs(v.v)} V DC dengan akurat!`
          };
        }
      }

      // Check AC PLN measurement
      if ((pinA.includes('pln1p') && pinB.includes('pln1p')) && (mm.mode === 'ACV_750' || mm.mode === 'ACV_200')) {
        const v = engine.measureVoltage(pinA, pinB);
        if (v.v >= 210) {
          return {
            passed: true,
            feedback: `Sempurna! Tegangan jala-jala PLN terukur ${v.v} V AC. Kamu telah menguasai pengukuran dasar multimeter!`
          };
        }
      }

      return {
        passed: false,
        feedback: "Pastikan selektor multimeter berada pada posisi skala yang sesuai dengan sumber daya yang diukur."
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
      { type: 'pln1p', x: 80, y: 150 },
      { type: 'mcb1p', x: 270, y: 140, options: { rating: 'C4' } },
      { type: 'switch_single', x: 390, y: 160 },
      { type: 'bulb', x: 540, y: 150 }
    ],
    initialWires: [],
    toolsNeeded: ['wires'],
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

      return {
        passed: false,
        feedback: "Hubungkan kabel: PLN L -> MCB IN, MCB OUT -> Sakelar IN, Sakelar OUT -> Lampu Fasa, Lampu Netral -> PLN N. Naikkan tuas MCB dan klik sakelar."
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
      Terminal <strong>COM (Common)</strong> dihubungkan ke sumber Fasa dari MCB. Terminal <strong>OUT 1</strong> ke Lampu 1, dan terminal <strong>OUT 2</strong> ke Lampu 2.
    `,
    objective: "Rakit instalasi sakelar seri. Nyalakan MCB dan aktifkan kedua tuas sakelar ganda hingga kedua lampu menyala!",
    components: [
      { type: 'pln1p', x: 50, y: 150 },
      { type: 'mcb1p', x: 210, y: 140 },
      { type: 'switch_double', x: 320, y: 160 },
      { type: 'bulb', x: 490, y: 100, options: { id: 'bulb_1', name: 'Lampu 1 (Ruang Tamu)' } },
      { type: 'bulb', x: 490, y: 240, options: { id: 'bulb_2', name: 'Lampu 2 (Teras Luar)' } }
    ],
    initialWires: [],
    toolsNeeded: ['wires'],
    checkCompletion: (engine) => {
      const bulbs = engine.components.filter(c => c.type === 'bulb');
      const allLit = bulbs.length === 2 && bulbs.every(b => b.state.isLit);

      if (allLit) {
        return {
          passed: true,
          feedback: "Mantap! Kedua lampu berhasil dikontrol secara independen melalui sakelar seri. Instalasi memenuhi standar!"
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
        feedback: "Sambungkan Fasa PLN -> MCB -> COM Sakelar Ganda. Output 1 ke Lampu 1, Output 2 ke Lampu 2. Netral kedua lampu hubungkan ke PLN N."
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
      Sakelar tukar (SPDT) memiliki 3 terminal: <em>Common (C)</em>, <em>L1</em>, dan <em>L2</em>.<br>
      Dengan menyambungkan terminal L1 ke L1 dan L2 ke L2 antara dua sakelar tukar, lampu dapat dinyalakan atau dimatikan dari lantai bawah maupun lantai atas secara bergantian.
    `,
    objective: "Rakit rangkaian sakelar tukar lorong/tangga. Pastikan lampu menyala dan dapat dikendalikan dari kedua posisi sakelar.",
    components: [
      { type: 'pln1p', x: 50, y: 150 },
      { type: 'mcb1p', x: 190, y: 140 },
      { type: 'switch_hotel', x: 290, y: 160, options: { id: 'sw_hotel_1', name: 'Sakelar Lantai 1' } },
      { type: 'switch_hotel', x: 440, y: 160, options: { id: 'sw_hotel_2', name: 'Sakelar Lantai 2' } },
      { type: 'bulb', x: 590, y: 150 }
    ],
    initialWires: [],
    toolsNeeded: ['wires'],
    checkCompletion: (engine) => {
      const bulb = engine.components.find(c => c.type === 'bulb');
      if (bulb && bulb.state.isLit) {
        return {
          passed: true,
          feedback: "Hebat sekali! Rangkaian sakelar tukar berfungsi sempurna. Ini adalah instalasi standar untuk lorong dan tangga gedung!"
        };
      }
      return {
        passed: false,
        feedback: "Sambungkan: MCB Out -> COM Sakelar 1. Jalur 1 Sakelar 1 -> Jalur 1 Sakelar 2. Jalur 2 Sakelar 1 -> Jalur 2 Sakelar 2. COM Sakelar 2 -> Fasa Lampu. Netral Lampu -> Netral PLN."
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
      • Dari terminal 2 (Fasa Keluar) menuju MCB pembatas PLN.<br>
      • Terminal 4 (Netral Keluar) diteruskan ke instalasi rumah.<br>
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
    checkCompletion: (engine) => {
      const kwh = engine.components.find(c => c.type === 'kwh_meter');
      const bulb = engine.components.find(c => c.type === 'bulb');

      if (kwh && kwh.state.isSpinning && bulb && bulb.state.isLit) {
        return {
          passed: true,
          feedback: "Bagus sekali! KWH meter mencatat pemakaian listrik (piringan berputar) dan MCB pembatas terpasang rapi dengan pengamanan elektroda pembumian!"
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
      • <strong>Tegangan Fasa ke Fasa (V_L-L / Tegangan Jalur)</strong>: Tegangan antar kawat fasa (R ke S, S ke T, atau T ke R) = <strong>220 &times; &radic;3 &asymp; 380 Volt AC</strong>.<br>
      • Selalu gunakan Multimeter dengan batas ukur tegangan AC minimal 600V atau 750V AC!
    `,
    objective: "Gunakan multimeter AC 750V untuk mengukur: 1) Tegangan R ke Netral (220V), dan 2) Tegangan R ke S (380V).",
    components: [
      { type: 'pln3p', x: 240, y: 140 }
    ],
    initialWires: [],
    toolsNeeded: ['multimeter'],
    checkCompletion: (engine, mm) => {
      const pinA = mm.probeRed.attachedPin;
      const pinB = mm.probeBlack.attachedPin;

      if (!pinA || !pinB) {
        return { passed: false, feedback: "Gunakan probe merah dan hitam untuk mengukur terminal tegangan 3-Fasa." };
      }

      if (mm.mode === 'ACV_750') {
        const v = engine.measureVoltage(pinA, pinB);
        // Checking for line-to-line 380V measurement
        if (v.v >= 370 && v.v <= 390) {
          return {
            passed: true,
            feedback: `Luar Biasa! Terukur tegangan antar Fasa (Line-to-Line) = ${v.v} V AC (380V). Ini adalah tegangan standar industri untuk menggerakkan mesin & motor besar!`
          };
        } else if (v.v >= 210 && v.v <= 230) {
          return {
            passed: false,
            feedback: `Terukur ${v.v} V AC (Tegangan Fasa-Netral). Sekarang coba ukur tegangan Fasa ke Fasa (misal Probe Merah di R dan Hitam di S) untuk mendapatkan 380V!`
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
      { type: 'contactor', x: 430, y: 120 },
      { type: 'motor3p', x: 650, y: 130 }
    ],
    initialWires: [
      // Pre-wired control coil for ease of SMK grade 10 students focusing on main power stage
      { from: 'contactor_1_A1', to: 'mcb3p_1_out_R', color: '#8B4513' },
      { from: 'contactor_1_A2', to: 'pln3p_1_N', color: '#2563EB' }
    ],
    toolsNeeded: ['wires'],
    checkCompletion: (engine) => {
      const motor = engine.components.find(c => c.type === 'motor3p');
      if (motor && motor.state.isRunning) {
        return {
          passed: true,
          feedback: `SELAMAT! Motor Induksi 3 Fasa berhasil berputar sempurna (${motor.state.rpm} RPM). Anda telah menyelesaikan seluruh tingkatan pelatihan teknisi listrik SMK!`
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
