/**
 * Jobsheet & Vocational Module Management System for VoltMaster SMK
 * Enables loading, importing, creating, and exporting official vocational lab sheets (Jobsheet Praktikum).
 * Conforms to Kurikulum Merdeka SMK (Teknik Ketenagalistrikan & TPTUP).
 */

const BUILTIN_JOBSHEETS = [
  {
    id: "JS-01",
    title: "Jobsheet 01: K3 & Identifikasi Kawat Fasa-Netral-Arde",
    category: "Dasar & K3",
    subject: "Dasar-Dasar Teknik Ketenagalistrikan",
    grade: "SMK Kelas X",
    duration: "2 Jam Pelajaran (90 Menit)",
    author: "Tim Guru Ketenagalistrikan SMK",
    objectives: [
      "Siswa mampu menerapkan prosedur K3 sebelum memeriksa rangkaian listrik aktif.",
      "Siswa mampu mengidentifikasi kawat Fasa bertegangan menggunakan Tespen secara benar.",
      "Siswa mampu membedakan karakteristik kawat Fasa (L), Netral (N), dan Grounding (PE) sesuai PUIL 2011."
    ],
    safetyInstructions: [
      "Pastikan tangan dalam kondisi kering dan gunakan sepatu safety berisolasi karet.",
      "Pegang gagang isolasi Tespen dan sentuhkan jari pada pelat logam bagian pangkal Tespen.",
      "Dilarang menyentuh langsung ujung logam konduktor aktif saat dialiri arus listrik."
    ],
    steps: [
      "Dekatkan ujung obeng Tespen ke terminal L (Fasa) pada sumber PLN.",
      "Amati lampu indikator neon di dalam gagang transparan Tespen.",
      "Sentuhkan Tespen ke terminal N (Netral) dan PE (Arde) lalu bandingkan hasilnya."
    ],
    schematicDesc: "Tespen mendeteksi tegangan fasa 220V AC terhadap tanah melalui resistansi pembatas tinggi (~1 MΩ) dan lampu neon.",
    schematicSVG: `
      <svg viewBox="0 0 400 160" width="100%" height="160">
        <rect width="100%" height="100%" fill="#090e17" rx="6"/>
        <text x="200" y="24" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">SKEMA PENGUJIAN TESPEN (K3)</text>
        <rect x="50" y="50" width="80" height="70" rx="4" fill="#1e293b" stroke="#38bdf8"/>
        <text x="90" y="75" fill="#facc15" font-size="10" text-anchor="middle">PLN 220V</text>
        <circle cx="110" cy="95" r="5" fill="#8B4513"/>
        <text x="110" y="115" fill="#94a3b8" font-size="9" text-anchor="middle">Fasa L</text>
        <!-- Tespen representation -->
        <line x1="110" y1="95" x2="220" y2="95" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4,2"/>
        <rect x="220" y="85" width="70" height="20" rx="3" fill="#0284c7" stroke="#38bdf8"/>
        <ellipse cx="250" cy="95" rx="6" ry="4" fill="#ff4500"/>
        <text x="250" y="80" fill="#ff4500" font-size="9" font-weight="bold" text-anchor="middle">Neon Menyala</text>
        <!-- Ground Return -->
        <path d="M 290 95 L 340 95 L 340 130" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="2,2"/>
        <line x1="330" y1="130" x2="350" y2="130" stroke="#16a34a" stroke-width="2"/>
        <text x="340" y="145" fill="#16a34a" font-size="8" text-anchor="middle">Arus Bocor Aman ke Tanah</text>
      </svg>
    `,
    components: [
      { type: 'pln1p', x: 260, y: 150 }
    ],
    initialWires: []
  },

  {
    id: "JS-02",
    title: "Jobsheet 02: Pengukuran Multimeter Digital (DCV & ACV)",
    category: "Alat Ukur",
    subject: "Pengukuran Besaran Listrik",
    grade: "SMK Kelas X",
    duration: "2 Jam Pelajaran (90 Menit)",
    author: "Tim Guru Ketenagalistrikan SMK",
    objectives: [
      "Siswa terampil memilih batas ukur (range selector) multimeter secara akurat.",
      "Siswa mampu mengukur tegangan DC pada baterai 12V.",
      "Siswa mampu mengukur tegangan bolak-balik (AC) 220V pada jala-jala listrik PLN."
    ],
    safetyInstructions: [
      "Jangan pernah mengukur tegangan AC saat selektor berada di posisi Ohm (Ω) atau DCA (Arus), karena sekring multimeter dapat putus!",
      "Gunakan batas ukur tegangan yang lebih tinggi dari perkiraan tegangan yang diukur (skala 750V AC untuk PLN 220V)."
    ],
    steps: [
      "Pindahkan selektor multimeter ke posisi ⎓ 20 V DC.",
      "Tempelkan probe merah ke kutub (+) baterai dan probe hitam ke kutub (-). Catat hasil pengukuran.",
      "Pindahkan selektor multimeter ke posisi ~ 750 V AC.",
      "Tempelkan probe merah ke terminal L dan probe hitam ke terminal N pada suplai PLN. Catat tegangan AC yang tertera."
    ],
    schematicDesc: "Multimeter dipasang paralel dengan sumber tegangan yang diukur. Polaritas DC harus searah, sedangkan AC bebas bolak-balik.",
    schematicSVG: `
      <svg viewBox="0 0 400 160" width="100%" height="160">
        <rect width="100%" height="100%" fill="#090e17" rx="6"/>
        <text x="200" y="24" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">PENGUKURAN TEGANGAN PARALEL</text>
        <!-- Multimeter Box -->
        <rect x="150" y="45" width="100" height="70" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <rect x="165" y="55" width="70" height="24" rx="3" fill="#a3e635"/>
        <text x="200" y="72" fill="#0f172a" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">220.0 V</text>
        <circle cx="180" cy="98" r="6" fill="#ef4444"/>
        <circle cx="220" cy="98" r="6" fill="#0f172a"/>
        <!-- Probes -->
        <path d="M 180 104 L 180 135 L 80 135 L 80 110" fill="none" stroke="#ef4444" stroke-width="2"/>
        <path d="M 220 104 L 220 135 L 320 135 L 320 110" fill="none" stroke="#38bdf8" stroke-width="2"/>
        <text x="80" y="95" fill="#ef4444" font-size="9" text-anchor="middle">Terminal (+)</text>
        <text x="320" y="95" fill="#38bdf8" font-size="9" text-anchor="middle">Terminal (-/COM)</text>
      </svg>
    `,
    components: [
      { type: 'battery', x: 130, y: 160, options: { voltage: 12 } },
      { type: 'pln1p', x: 440, y: 150 }
    ],
    initialWires: []
  },

  {
    id: "JS-03",
    title: "Jobsheet 03: Rangkaian 1 Lampu Dikontrol 1 Sakelar Tunggal & MCB",
    category: "Instalasi Penerangan",
    subject: "Instalasi Penerangan Listrik",
    grade: "SMK Kelas X",
    duration: "3 Jam Pelajaran (135 Menit)",
    author: "Tim Guru Ketenagalistrikan SMK",
    objectives: [
      "Siswa mampu membaca skema garis tunggal dan skema pengawatan penerangan 1 grup.",
      "Siswa mampu memasang MCB 1P sebagai pengaman sirkuit cabang penerangan.",
      "Siswa mampu menyambungkan sakelar tunggal pada kawat fasa sesuai ketentuan PUIL 2011."
    ],
    safetyInstructions: [
      "Sakelar WAJIB memutus kawat FASA, bukan kawat Netral, agar fitting lampu bebas tegangan saat sakelar dimatikan.",
      "Pilih warna kabel standar PUIL: Fasa (Coklat), Netral (Biru), Pembumian (Kuning-Hijau)."
    ],
    steps: [
      "Tarik kabel Fasa (Coklat) dari PLN L ke terminal Input MCB 1P.",
      "Tarik kabel Fasa dari Output MCB 1P ke terminal Masuk Sakelar Tunggal.",
      "Tarik kabel Fasa Balik dari Output Sakelar ke terminal Fasa Lampu Bohlam.",
      "Tarik kabel Netral (Biru) dari terminal Netral Lampu kembali ke PLN N.",
      "Naikkan tuas MCB dan tekan tombol sakelar untuk menyalakan lampu."
    ],
    schematicDesc: "Skema Pengawatan Rangkaian Penerangan 1 Lampu dengan Sakelar Tunggal dan Pengaman MCB 1-Fasa.",
    schematicSVG: `
      <svg viewBox="0 0 500 160" width="100%" height="160">
        <rect width="100%" height="100%" fill="#090e17" rx="6"/>
        <text x="250" y="24" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">SKEMA PENGOBATAN 1 LAMPU 1 SAKELAR (PUIL)</text>
        <!-- L line -->
        <text x="30" y="55" fill="#8B4513" font-size="10" font-weight="bold">L (Fasa)</text>
        <line x1="75" y1="50" x2="140" y2="50" stroke="#8B4513" stroke-width="2.5"/>
        <!-- MCB -->
        <rect x="140" y="40" width="35" height="20" fill="#1e293b" stroke="#f59e0b"/>
        <text x="157" y="54" fill="#fff" font-size="8" text-anchor="middle">MCB</text>
        <line x1="175" y1="50" x2="250" y2="50" stroke="#8B4513" stroke-width="2.5"/>
        <!-- Switch -->
        <circle cx="250" cy="50" r="3" fill="#8B4513"/>
        <line x1="250" y1="50" x2="280" y2="35" stroke="#f59e0b" stroke-width="2.5"/>
        <circle cx="285" cy="50" r="3" fill="#8B4513"/>
        <text x="268" y="28" fill="#f59e0b" font-size="9" text-anchor="middle">Sakelar</text>
        <line x1="288" y1="50" x2="380" y2="50" stroke="#f59e0b" stroke-width="2.5"/>
        <!-- Lamp -->
        <circle cx="395" cy="50" r="15" fill="#1e293b" stroke="#facc15" stroke-width="2"/>
        <line x1="384" y1="39" x2="406" y2="61" stroke="#facc15" stroke-width="2"/>
        <line x1="384" y1="61" x2="406" y2="39" stroke="#facc15" stroke-width="2"/>
        <!-- Neutral line -->
        <line x1="410" y1="50" x2="440" y2="50" stroke="#2563EB" stroke-width="2.5"/>
        <line x1="440" y1="50" x2="440" y2="120" stroke="#2563EB" stroke-width="2.5"/>
        <line x1="440" y1="120" x2="75" y2="120" stroke="#2563EB" stroke-width="2.5"/>
        <text x="30" y="125" fill="#2563EB" font-size="10" font-weight="bold">N (Netral)</text>
      </svg>
    `,
    components: [
      { type: 'pln1p', x: 80, y: 150 },
      { type: 'mcb1p', x: 270, y: 140, options: { rating: 'C4' } },
      { type: 'switch_single', x: 390, y: 160 },
      { type: 'bulb', x: 540, y: 150 }
    ],
    initialWires: []
  },

  {
    id: "JS-04",
    title: "Jobsheet 04: Rangkaian 2 Sakelar Tukar (Lampu Tangga / Lorong Hotel)",
    category: "Instalasi Penerangan",
    subject: "Instalasi Penerangan Listrik",
    grade: "SMK Kelas X",
    duration: "3 Jam Pelajaran (135 Menit)",
    author: "Tim Guru Ketenagalistrikan SMK",
    objectives: [
      "Siswa memahami prinsip sakelar tukar (SPDT) dengan 3 terminal (COM, L1, L2).",
      "Siswa mampu merangkai kendali lampu dari dua tempat berbeda secara bolak-balik.",
      "Siswa mampu menganalisis tabel kebenaran logika sakelar tukar."
    ],
    safetyInstructions: [
      "Pastikan jalur penghubung antara terminal L1-L1 dan L2-L2 tidak tertukar dengan terminal Common.",
      "Periksa kerapihan dan keteguhan sambungan kabel terminal."
    ],
    steps: [
      "Sambungkan Fasa PLN melalui MCB 1P ke terminal COM Sakelar Tukar 1.",
      "Sambungkan kawat korespondensi dari terminal Jalur 1 Sakelar 1 ke Jalur 1 Sakelar 2.",
      "Sambungkan kawat korespondensi dari terminal Jalur 2 Sakelar 1 ke Jalur 2 Sakelar 2.",
      "Sambungkan terminal COM Sakelar Tukar 2 ke terminal Fasa Lampu.",
      "Sambungkan terminal Netral Lampu ke Netral PLN.",
      "Uji coba nyalakan dan matikan lampu secara bergantian dari Sakelar 1 dan Sakelar 2."
    ],
    schematicDesc: "Diagram Rangkaian Sakelar Tukar (Two-Way Switch Circuit) untuk Lorong atau Tangga Bangunan Bertingkat.",
    schematicSVG: `
      <svg viewBox="0 0 500 160" width="100%" height="160">
        <rect width="100%" height="100%" fill="#090e17" rx="6"/>
        <text x="250" y="24" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">SKEMA 2 SAKELAR TUKAR (HOTEL / TANGGA)</text>
        <!-- L line -->
        <text x="25" y="65" fill="#8B4513" font-size="10" font-weight="bold">Fasa (L)</text>
        <line x1="75" y1="60" x2="130" y2="60" stroke="#8B4513" stroke-width="2.5"/>
        <!-- Switch 1 -->
        <rect x="130" y="40" width="45" height="40" fill="#1e293b" stroke="#38bdf8"/>
        <text x="152" y="65" fill="#fff" font-size="8" text-anchor="middle">SW 1</text>
        <!-- Twin wires -->
        <line x1="175" y1="48" x2="275" y2="48" stroke="#f59e0b" stroke-width="2.5"/>
        <text x="225" y="42" fill="#f59e0b" font-size="8" text-anchor="middle">Jalur 1</text>
        <line x1="175" y1="72" x2="275" y2="72" stroke="#f59e0b" stroke-width="2.5"/>
        <text x="225" y="86" fill="#f59e0b" font-size="8" text-anchor="middle">Jalur 2</text>
        <!-- Switch 2 -->
        <rect x="275" y="40" width="45" height="40" fill="#1e293b" stroke="#38bdf8"/>
        <text x="297" y="65" fill="#fff" font-size="8" text-anchor="middle">SW 2</text>
        <!-- Lamp -->
        <line x1="320" y1="60" x2="380" y2="60" stroke="#f59e0b" stroke-width="2.5"/>
        <circle cx="395" cy="60" r="14" fill="#1e293b" stroke="#facc15" stroke-width="2"/>
        <!-- Neutral -->
        <line x1="410" y1="60" x2="440" y2="60" stroke="#2563EB" stroke-width="2.5"/>
        <line x1="440" y1="60" x2="440" y2="125" stroke="#2563EB" stroke-width="2.5"/>
        <line x1="440" y1="125" x2="75" y2="125" stroke="#2563EB" stroke-width="2.5"/>
        <text x="25" y="130" fill="#2563EB" font-size="10" font-weight="bold">Netral (N)</text>
      </svg>
    `,
    components: [
      { type: 'pln1p', x: 50, y: 150 },
      { type: 'mcb1p', x: 190, y: 140 },
      { type: 'switch_hotel', x: 290, y: 160, options: { id: 'sw_hotel_1', name: 'Sakelar Lantai 1' } },
      { type: 'switch_hotel', x: 440, y: 160, options: { id: 'sw_hotel_2', name: 'Sakelar Lantai 2' } },
      { type: 'bulb', x: 590, y: 150 }
    ],
    initialWires: []
  },

  {
    id: "JS-05",
    title: "Jobsheet 05: Pemasangan APP PLN (KWH Meter, MCB & Ground Rod)",
    category: "Distribusi PLN",
    subject: "Instalasi Tenaga Listrik",
    grade: "SMK Kelas X",
    duration: "4 Jam Pelajaran (180 Menit)",
    author: "Tim Guru Ketenagalistrikan SMK",
    objectives: [
      "Siswa memahami fungsi dan urutan instalasi Alat Pengukur dan Pembatas (APP) PLN.",
      "Siswa mampu memasang pengawatan KWH Meter 1 Fasa dan MCB Pembatas tersegel.",
      "Siswa mampu menghubungkan kawat pembumian (PE) ke batang elektroda tanah (Ground Rod) dengan tahanan R ≤ 5 Ω."
    ],
    safetyInstructions: [
      "Segel kawat timah PLN pada KWH meter tidak boleh dirusak oleh pelanggan umum.",
      "Pastikan elektroda pembumian tertanam sempurna ke dalam tanah lembab untuk menjamin keselamatan dari tegangan sentuh."
    ],
    steps: [
      "Hubungkan Saluran Masuk Pelayanan (SUTR) PLN Fasa ke terminal 1 KWH meter.",
      "Hubungkan terminal 2 KWH meter (Fasa Keluar) ke input MCB Pembatas.",
      "Hubungkan SUTR Netral ke terminal 3 KWH meter, dan teruskan terminal 4 ke beban instalasi.",
      "Hubungkan terminal 5 KWH meter ke Batang Elektroda Pembumian (Ground Rod).",
      "Nyalakan MCB dan amati piringan KWH meter berputar saat ada beban lampu yang menyala."
    ],
    schematicDesc: "Skema Pengawatan Saluran Masuk Pelayanan (SMP) melalui KWH Meter 1 Fasa dan Pembatas MCB PLN.",
    schematicSVG: `
      <svg viewBox="0 0 500 160" width="100%" height="160">
        <rect width="100%" height="100%" fill="#090e17" rx="6"/>
        <text x="250" y="24" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">SKEMA SAMBUNGAN APP PLN & PEMBUMIAN</text>
        <rect x="50" y="45" width="60" height="85" fill="#1e293b" stroke="#0284c7" rx="4"/>
        <text x="80" y="65" fill="#38bdf8" font-size="8" text-anchor="middle">SUTR PLN</text>
        <!-- KWH Meter -->
        <rect x="160" y="40" width="110" height="95" fill="#1e293b" stroke="#38bdf8" rx="6"/>
        <text x="215" y="60" fill="#facc15" font-size="10" font-weight="bold" text-anchor="middle">KWH METER</text>
        <text x="180" y="125" fill="#8B4513" font-size="8">1:L</text>
        <text x="200" y="125" fill="#8B4513" font-size="8">2:L</text>
        <text x="225" y="125" fill="#2563EB" font-size="8">3:N</text>
        <text x="245" y="125" fill="#2563EB" font-size="8">4:N</text>
        <!-- MCB -->
        <rect x="310" y="45" width="45" height="40" fill="#1e293b" stroke="#f59e0b" rx="4"/>
        <text x="332" y="70" fill="#fff" font-size="9" text-anchor="middle">MCB</text>
        <!-- Ground Rod -->
        <line x1="215" y1="135" x2="215" y2="150" stroke="#16a34a" stroke-width="2.5"/>
        <line x1="205" y1="150" x2="225" y2="150" stroke="#16a34a" stroke-width="2"/>
        <text x="215" y="145" fill="#16a34a" font-size="7" text-anchor="end">Arde PE</text>
        <!-- Load -->
        <circle cx="420" cy="65" r="14" fill="#1e293b" stroke="#facc15" stroke-width="2"/>
        <text x="420" y="95" fill="#cbd5e1" font-size="8" text-anchor="middle">Beban Rumah</text>
      </svg>
    `,
    components: [
      { type: 'pln1p', x: 40, y: 150 },
      { type: 'kwh_meter', x: 190, y: 130 },
      { type: 'mcb1p', x: 420, y: 140, options: { rating: 'C2' } },
      { type: 'ground_rod', x: 530, y: 150, options: { resistance: 2.8 } },
      { type: 'bulb', x: 630, y: 150 }
    ],
    initialWires: []
  },

  {
    id: "JS-06",
    title: "Jobsheet 06: Pengendali Motor Induksi 3 Fasa Starter DOL (Direct On Line)",
    category: "Industri & Tenaga",
    subject: "Instalasi Motor Listrik",
    grade: "SMK Kelas X",
    duration: "4 Jam Pelajaran (180 Menit)",
    author: "Tim Guru Ketenagalistrikan SMK",
    objectives: [
      "Siswa mampu membedakan Rangkaian Daya (Power Circuit) dan Rangkaian Kontrol (Control Circuit).",
      "Siswa mampu merangkai pengasutan motor 3 fasa DOL dengan Kontaktor Magnetik KM1.",
      "Siswa mampu mengimplementasikan kontak bantu NO 13-14 sebagai sistem pengunci (self-holding circuit)."
    ],
    safetyInstructions: [
      "Pastikan urutan fasa R-S-T terpasang benar agar motor berputar searah jarum jam (CW).",
      "Periksa kondisi grounding bodi motor sebelum memberi daya tegangan 380V!",
      "Jika motor berdengung dan tidak berputar, SEGERA matikan MCB untuk mencegah terbakarnya belitan stator!"
    ],
    steps: [
      "Rangkai Rangkaian Daya: Suplai R-S-T -> MCB 3P In. MCB 3P Out -> Kontak Utama Kontaktor 1/L1, 3/L2, 5/L3.",
      "Keluaran Kontaktor 2/T1, 4/T2, 6/T3 dihubungkan ke terminal Motor U1, V1, W1.",
      "Rangkai Rangkaian Kontrol: Koil A1-A2 diberi tegangan 220V melalui kontak pengunci.",
      "Naikkan MCB 3P dan periksa putaran motor berkecepatan 1440 RPM."
    ],
    schematicDesc: "Rangkaian Pengasutan Langsung (Direct On Line - DOL Starter) Motor Induksi Tiga Fasa.",
    schematicSVG: `
      <svg viewBox="0 0 500 160" width="100%" height="160">
        <rect width="100%" height="100%" fill="#090e17" rx="6"/>
        <text x="250" y="24" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">RANGKAIAN DAYA STARTER MOTOR 3-FASA (DOL)</text>
        <text x="50" y="55" fill="#8B4513" font-size="9" font-weight="bold">R (L1)</text>
        <text x="50" y="85" fill="#111827" font-size="9" font-weight="bold" stroke="#64748b">S (L2)</text>
        <text x="50" y="115" fill="#6B7280" font-size="9" font-weight="bold">T (L3)</text>
        <!-- MCB 3P -->
        <rect x="110" y="40" width="40" height="85" fill="#1e293b" stroke="#f59e0b" rx="4"/>
        <text x="130" y="85" fill="#fff" font-size="8" text-anchor="middle">MCB 3P</text>
        <!-- KM1 -->
        <rect x="210" y="40" width="55" height="85" fill="#1e293b" stroke="#0284c7" rx="4"/>
        <text x="237" y="85" fill="#38bdf8" font-size="9" font-weight="bold" text-anchor="middle">KM1</text>
        <!-- Motor -->
        <circle cx="370" cy="82" r="32" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="370" y="86" fill="#facc15" font-size="12" font-weight="bold" text-anchor="middle">M 3~</text>
      </svg>
    `,
    components: [
      { type: 'pln3p', x: 30, y: 140 },
      { type: 'mcb3p', x: 260, y: 130, options: { rating: 'C16' } },
      { type: 'contactor', x: 430, y: 120 },
      { type: 'motor3p', x: 650, y: 130 }
    ],
    initialWires: [
      { from: 'contactor_1_A1', to: 'mcb3p_1_out_R', color: '#8B4513' },
      { from: 'contactor_1_A2', to: 'pln3p_1_N', color: '#2563EB' }
    ]
  }
];

class JobsheetManager {
  constructor(app) {
    this.app = app;
    this.jobsheets = [...BUILTIN_JOBSHEETS];
    this.activeJobsheet = null;
  }

  getJobsheets() {
    return this.jobsheets;
  }

  loadJobsheet(id) {
    const js = this.jobsheets.find(j => j.id === id);
    if (!js) {
      alert("Jobsheet tidak ditemukan!");
      return false;
    }

    this.activeJobsheet = js;
    
    // Switch app mode to 'jobsheet'
    this.app.currentMode = 'jobsheet';
    
    // Instantiate components
    const comps = js.components.map(c => createComponent(c.type, c.x, c.y, c.options || {}));
    const wires = (js.initialWires || []).map(w => ({ ...w }));

    this.app.loadCircuitState(comps, wires);

    // Update Jobsheet Sidebar Panel
    this.renderJobsheetSidebar(js);
    return true;
  }

  renderJobsheetSidebar(js) {
    const titleEl = document.getElementById('jobsheet-title');
    const badgeEl = document.getElementById('jobsheet-badge');
    const objEl = document.getElementById('jobsheet-objectives');
    const stepsEl = document.getElementById('jobsheet-steps');
    const safetyEl = document.getElementById('jobsheet-safety');

    if (titleEl) titleEl.innerText = js.title;
    if (badgeEl) badgeEl.innerText = `${js.category} • ${js.duration}`;

    if (objEl) {
      objEl.innerHTML = (js.objectives || []).map(o => `<li>${o}</li>`).join('');
    }

    if (stepsEl) {
      stepsEl.innerHTML = (js.steps || []).map((s, idx) => `
        <div class="checklist-item" id="js_step_${idx}">
          <div class="chk-box"></div>
          <div class="chk-label">${s}</div>
        </div>
      `).join('');
    }

    if (safetyEl) {
      safetyEl.innerHTML = (js.safetyInstructions || []).map(si => `<li>${si}</li>`).join('');
    }
  }

  // Import Jobsheet from JSON string or File
  importFromJSON(jsonText) {
    try {
      const data = JSON.parse(jsonText);
      if (!data.id || !data.title || !data.components) {
        throw new Error("Format JSON Jobsheet tidak valid! Field wajib: id, title, components.");
      }

      // Check if exists or add
      const existingIdx = this.jobsheets.findIndex(j => j.id === data.id);
      if (existingIdx >= 0) {
        this.jobsheets[existingIdx] = data;
      } else {
        this.jobsheets.push(data);
      }

      alert(`Berhasil mengimpor Jobsheet: ${data.title}`);
      this.populateJobsheetSelector();
      this.loadJobsheet(data.id);
      return true;
    } catch (err) {
      alert(`Gagal mengimpor Jobsheet: ${err.message}`);
      return false;
    }
  }

  // Export current circuit on workbench as a downloadable Jobsheet JSON
  exportCurrentAsJobsheet(metadata = {}) {
    const jsData = {
      id: metadata.id || `JS-CUSTOM-${Date.now().toString().slice(-4)}`,
      title: metadata.title || "Jobsheet Praktik Kustom",
      category: metadata.category || "Praktik Kejuruan",
      subject: "Instalasi Ketenagalistrikan SMK",
      grade: "SMK Kelas X",
      duration: "2 Jam Pelajaran (90 Menit)",
      author: metadata.author || "Guru Pembimbing",
      objectives: metadata.objectives || ["Merakit dan menguji rangkaian kelistrikan sesuai SOP."],
      safetyInstructions: [
        "Periksa sambungan kabel sebelum menghidupkan tegangan sumber.",
        "Gunakan APD standar laboratorium listrik."
      ],
      steps: metadata.steps || ["Pasang kabel pengawatan antar komponen.", "Uji kerja rangkaian."],
      schematicDesc: "Rangkaian dibuat melalui Meja Kerja Bebas VoltMaster SMK.",
      components: this.app.components.map(c => ({
        type: c.type,
        x: c.x,
        y: c.y,
        options: { rating: c.rating, voltage: c.voltage, name: c.name }
      })),
      initialWires: this.app.wires.map(w => ({ from: w.from, to: w.to, color: w.color }))
    };

    const blob = new Blob([JSON.stringify(jsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${jsData.id}_${jsData.title.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Populate Jobsheet select dropdown
  populateJobsheetSelector() {
    const sel = document.getElementById('jobsheet-selector');
    if (!sel) return;

    sel.innerHTML = this.jobsheets.map(js => `
      <option value="${js.id}">${js.id}: ${js.title}</option>
    `).join('');
  }

  // Generate printable Vocational Assessment Report (Lembar Penilaian Siswa)
  generateAssessmentReport(studentName, studentClass, score = 95) {
    const js = this.activeJobsheet || BUILTIN_JOBSHEETS[0];
    const now = new Date().toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const reportHTML = `
      <div class="report-paper">
        <div class="report-header">
          <div class="report-logo">⚡</div>
          <div class="report-title-block">
            <h3>KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI</h3>
            <h4>SEKOLAH MENENGAH KEJURUAN (SMK) PROGRAM KETENAGALISTRIKAN</h4>
            <h2>LEMBAR PENILAIAN HASIL PRAKTIK KEJURUAN</h2>
          </div>
          <div class="report-grade-badge">
            <span class="score-num">${score}</span>
            <span class="score-grade">${score >= 85 ? 'SANGAT KOMPETEN (A)' : 'KOMPETEN (B)'}</span>
          </div>
        </div>

        <hr class="report-divider"/>

        <table class="report-meta-table">
          <tr>
            <td width="20%"><strong>Nama Siswa</strong></td>
            <td width="30%">: ${studentName || 'Siswa SMK'}</td>
            <td width="20%"><strong>Mata Pelajaran</strong></td>
            <td width="30%">: ${js.subject}</td>
          </tr>
          <tr>
            <td><strong>Kelas / Jurusan</strong></td>
            <td>: ${studentClass || 'X TITL'}</td>
            <td><strong>Waktu Praktik</strong></td>
            <td>: ${now}</td>
          </tr>
          <tr>
            <td><strong>Nomor Jobsheet</strong></td>
            <td>: ${js.id}</td>
            <td><strong>Guru Pengampu</strong></td>
            <td>: ${js.author}</td>
          </tr>
        </table>

        <div class="report-section-title">A. Judul Praktik & Capaian Pembelajaran</div>
        <p style="font-size:0.9rem; margin-bottom:8px;"><strong>${js.title}</strong></p>
        <ul style="font-size:0.85rem; margin-left:20px; line-height:1.5;">
          ${(js.objectives || []).map(o => `<li>${o}</li>`).join('')}
        </ul>

        <div class="report-section-title">B. Penilaian Aspek Keterampilan & K3</div>
        <table class="report-score-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Indikator Kompetensi</th>
              <th>Bobot</th>
              <th>Skor (0-100)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Penerapan Prosedur K3 & APD Kelistrikan</td>
              <td>20%</td>
              <td>95</td>
              <td><span class="status-pass">✓ Memenuhi SOP</span></td>
            </tr>
            <tr>
              <td>2</td>
              <td>Kesesuaian Pengawatan dengan Standar Warna PUIL 2011</td>
              <td>35%</td>
              <td>${score}</td>
              <td><span class="status-pass">✓ Sesuai Standar</span></td>
            </tr>
            <tr>
              <td>3</td>
              <td>Keberhasilan Fungsi Sirkuit & Tidak Korslet</td>
              <td>30%</td>
              <td>100</td>
              <td><span class="status-pass">✓ Berfungsi Optimal</span></td>
            </tr>
            <tr>
              <td>4</td>
              <td>Ketelitian Pengukuran Alat Ukur (Multimeter/Tespen)</td>
              <td>15%</td>
              <td>90</td>
              <td><span class="status-pass">✓ Akurat</span></td>
            </tr>
          </tbody>
        </table>

        <div class="report-signature-block">
          <div class="sig-box">
            <p>Siswa Peserta Praktik,</p>
            <br><br><br>
            <p><strong>( ${studentName || 'Siswa SMK'} )</strong></p>
          </div>
          <div class="sig-box">
            <p>Guru Penguji / Instruktur,</p>
            <br><br><br>
            <p><strong>( ${js.author} )</strong></p>
          </div>
        </div>
      </div>
    `;

    return reportHTML;
  }
}

window.JobsheetManager = JobsheetManager;
window.BUILTIN_JOBSHEETS = BUILTIN_JOBSHEETS;
