# ⚡ VoltMaster SMK: Simulator Instalasi & Pengukuran Listrik

**VoltMaster SMK** adalah media pembelajaran interaktif berbasis web (Game & Laboratorium Virtual) yang dirancang khusus untuk siswa **SMK Kelas 10** Program Keahlian **Teknik Ketenagalistrikan** (TITL, TIPTL, TOI, maupun TPTUP - Teknik Pendingin dan Tata Udara).

Game ini dapat dijalankan langsung di browser dan dihosting secara gratis di **GitHub Pages** tanpa perlu instalasi backend/database (100% Client-Side Pure HTML5, SVG, CSS3, dan Vanilla JavaScript).

---

## 🌟 Fitur Utama

1. **8 Level Misi Pembelajaran Bertingkat (Sesuai Kurikulum Merdeka SMK)**:
   - **Level 1 (K3 & Deteksi Fasa):** Pengujian kawat fasa bertegangan menggunakan **Tespen** (lampu neon menyala oranye) vs kawat netral/ground.
   - **Level 2 (Multimeter Master):** Pengukuran tegangan DC Baterai (12V) dan tegangan AC jala-jala PLN (220V), serta uji buzzer kontinuitas kabel.
   - **Level 3 (Instalasi Penerangan 1 Grup):** Pengawatan Fasa -> MCB 1P -> Sakelar Tunggal -> Lampu Pijar -> Netral sesuai standar PUIL 2011.
   - **Level 4 (Sakelar Ganda / Seri):** Pengendalian 2 lampu ruangan berbeda dari satu kotak sakelar seri.
   - **Level 5 (Sakelar Tukar / Sakelar Hotel):** Rangkaian 2 sakelar tukar untuk menyalakan/mematikan 1 lampu lorong atau tangga dari dua lantai berbeda.
   - **Level 6 (APP PLN & KWH Meter):** Pengawatan Saluran Masuk Pelayanan (SUTR) PLN, KWH Meter, MCB Pembatas, dan Batang Pembumian (*Ground Rod* tahanan $\le 5\ \Omega$).
   - **Level 7 (Sistem 3 Fasa Industri):** Pengukuran Tegangan Fasa-ke-Netral ($V_{L-N} = 220\text{V}$) dan Tegangan Antar Fasa ($V_{L-L} = 380\text{V}$).
   - **Level 8 (Starter Motor 3 Fasa DOL):** Rangkaian daya pengasutan *Direct On Line* (DOL) Motor Induksi 3 Fasa dengan MCB 3P, Kontaktor Magnetik, dan animasi putaran rotor 1440 RPM.

2. **Mode Troubleshooting / UKK (Uji Kompetensi Kejuruan)**:
   - Simulasi kasus kerusakan nyata di lapangan:
     - *Kasus 1:* Lampu mati akibat kawat putus di dalam pipa conduit.
     - *Kasus 2:* MCB selalu trip akibat hubung singkat (korsleting) fasa-netral.
     - *Kasus 3:* Bodi peralatan menyengat listrik karena kawat arde (PE) terputus.
     - *Kasus 4:* Motor 3 fasa berdengung dan tidak mau berputar karena hilang satu fasa (*single phasing*).

3. **Alat Ukur Interaktif**:
   - **Multimeter Digital Nyata:** Layar LCD 7-segmen, rotary knob selektor (ACV 750V/200V, DCV 1000V/20V, Ohm/Buzzer Kontinuitas 🔊). Memiliki dua probe fisik (**Probe Merah +** dan **Probe Hitam -/COM**) yang dapat digeser dan ditempelkan ke terminal mana saja untuk membaca nilai listrik real-time.
   - **Tespen Interaktif:** Dapat didekatkan ke terminal untuk mendeteksi kawat Fasa aktif (indikator neon menyala).

4. **Sintesis Audio Realistis (Web Audio API)**:
   - Suara klik mekanis sakelar dan tombol push button.
   - Suara tuas MCB naik/turun dan suara benturan pegas *TRIP* saat korsleting.
   - Suara *beep* kontinuitas multimeter pada frekuensi 2.45 kHz.
   - Suara tarikan jangkar kontaktor (*KLAK*) dan dengungan motor listrik 3 fasa 50 Hz.
   - Fanfare kemenangan saat menyelesaikan misi.

5. **Kesesuaian Standar PUIL 2011 / SNI**:
   - Pemilihan warna kabel instalasi sesuai standar resmi:
     - **Fasa 1 / Fasa R (L1):** Coklat
     - **Fasa S (L2):** Hitam
     - **Fasa T (L3):** Abu-abu
     - **Kawat Netral (N):** Biru
     - **Pembumian / Arde (PE):** Kuning-Hijau

---

## 🚀 Panduan Hosting di GitHub Pages (Langkah Cepat)

Anda dapat meng-online-kan game ini di GitHub Pages dalam waktu kurang dari 2 menit:

### Langkah 1: Buat Repositori di GitHub
1. Buka [github.com](https://github.com) dan login ke akun Anda.
2. Klik tombol **New** (Buat repositori baru).
3. Beri nama repositori, contoh: `voltmaster-smk` atau `simulasi-listrik-smk`.
4. Pilih **Public**.
5. Jangan centang "Add a README file" (karena sudah dibuat di proyek ini).
6. Klik **Create repository**.

### Langkah 2: Push Kode ke GitHub
Buka terminal / PowerShell di folder proyek ini (`c:\Users\Asus\Documents\TPTUP Game`), lalu jalankan perintah:

```bash
git add .
git commit -m "Inisialisasi VoltMaster SMK Simulator Kelistrikan"
git branch -M main
git remote add origin https://github.com/USERNAME-ANDA/NAMA-REPO-ANDA.git
git push -u origin main
```
*(Ganti `USERNAME-ANDA` dan `NAMA-REPO-ANDA` dengan username dan nama repositori GitHub Anda)*

### Langkah 3: Aktifkan GitHub Pages
1. Di halaman repositori GitHub Anda, klik menu tab **Settings**.
2. Pada bilah samping kiri (sidebar), klik **Pages**.
3. Di bawah bagian **Build and deployment**:
   - **Source:** Pilih `Deploy from a branch`.
   - **Branch:** Pilih `main` dan folder `/(root)`.
4. Klik tombol **Save**.
5. Tunggu sekitar 1 - 2 menit, GitHub akan menampilkan tautan web game Anda:
   `https://USERNAME-ANDA.github.io/NAMA-REPO-ANDA/`
6. Bagikan tautan tersebut kepada siswa-siswi SMK untuk langsung dimainkan di HP, laptop, atau lab komputer!

---

## 💻 Cara Menjalankan Secara Offline / Lokal

Game ini tidak memerlukan koneksi internet maupun server rumit:
- Cukup buka file `index.html` langsung dengan mengklik ganda (*double click*) di File Explorer untuk membuka di Google Chrome, Microsoft Edge, Mozilla Firefox, dll.
- Atau jalankan web server lokal menggunakan Python:
  ```bash
  python -m http.server 8000
  ```
  Lalu buka browser di `http://localhost:8000`.

---

## 📂 Struktur Berkas Proyek

```text
TPTUP Game/
├── index.html              # Tampilan utama workbench, panel informasi, dan HUD
├── css/
│   └── style.css           # Tema laboratorium panel listrik modern & responsif
├── js/
│   ├── audio.js            # Sintesis efek suara kelistrikan (Web Audio API)
│   ├── circuit-engine.js   # Solver simulasi sirkuit, tegangan, korslet & fasa
│   ├── components.js       # Model 16 komponen listrik berstandar PUIL (SVG)
│   ├── multimeter.js       # Multimeter digital interaktif, probe draggable & tespen
│   ├── levels.js           # 8 Level kurikulum ketenagalistrikan SMK Kelas 10
│   ├── troubleshooting.js  # Skenario pencarian kerusakan & UKK kejuruan
│   ├── sandbox.js          # Meja kerja bebas (Lab) & template rangkaian
│   └── app.js              # Kontroler utama aplikasi, wiring engine & progres
└── README.md               # Dokumentasi lengkap & panduan hosting
```

---

## 👨‍🏫 Manfaat untuk Guru dan Siswa SMK

- **Aman 100% dari Bahaya Tersengat Listrik Nyata:** Siswa dapat belajar mengenali kesalahan fatal seperti hubung singkat (*short circuit*) atau hilang fasa tanpa resiko bahaya fisik maupun merusak komponen bengkel sekolah.
- **Meningkatkan Daya Tarik Belajar:** Dilengkapi sistem reward XP, bintang capaian, dan feedback interaktif yang membuat siswa antusias bereksplorasi.
- **Siap untuk Uji Kompetensi Kejuruan (UKK):** Membiasakan siswa membaca skema diagram, menggunakan multimeter dengan teliti, dan memecahkan gangguan kelistrikan secara sistematis.

---
*Dibuat untuk memajukan pendidikan vokasi teknik ketenagalistrikan Indonesia (SMK Bisa, SMK Hebat!).*
