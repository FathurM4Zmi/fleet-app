---
tags: [BRD, Mobile, Driver, Flutter]
category: Mobile
related:
  - "[[PRD-Mobile-Driver-App]]"
  - "[[RELASI-MOBILE-DESKTOP]]"
  - "[[QUICK-REFERENCE]]"
---

# BRD Mobile — GenZys FleetOps Driver App (`fleet-app`)

**[BRD-MOB]** — Business Requirements Document · Aplikasi Mobile Driver
**Produk**: GenZys FleetOps — Driver App (Flutter)
**Turunan dari**: BRD induk `BRD/FMS/26/001` (`prd/BRD_Fleet_Management_System_GenZys_v1.0_Corporate.docx`)
**Persona utama**: R6 Driver (driver-only app)
**Platform**: Mobile (Android prioritas, iOS target berikutnya)
**Status**: Baseline Internal untuk Pengembangan Prototype

> **Satu produk, dua permukaan.** BRD induk mendefinisikan kebutuhan bisnis sistem FMS secara
> keseluruhan (desktop-first untuk admin/dispatcher). **BRD ini adalah turunan driver-focused**:
> hanya menetapkan kebutuhan bisnis untuk permukaan **mobile driver**. Setiap kebutuhan di sini
> memetakan (trace) ke kebutuhan/aturan induk `BR-xxx` / `BRL-xxx`, dan tidak boleh bertentangan
> dengannya. Bila terjadi konflik, **BRD induk menang**.

---

## Daftar Isi

| # | Bab |
|---|---|
| 0 | Kontrol Dokumen |
| 1 | Ringkasan Eksekutif |
| 2 | Latar Belakang & Peluang Bisnis Mobile |
| 3 | Tujuan Bisnis Mobile & Indikator Keberhasilan |
| 4 | Ruang Lingkup |
| 5 | Pemangku Kepentingan & Persona Driver |
| 6 | Permasalahan Saat Ini & Target Kondisi (Mobile) |
| 7 | Proses Bisnis Mobile Target |
| 8 | Kebutuhan Bisnis Mobile (MBR) |
| 9 | Aturan Bisnis Mobile (MBRL) |
| 10 | Kebutuhan Data, Dashboard & Pelaporan Mobile |
| 11 | Ekspektasi Non-Fungsional Mobile |
| 12 | Asumsi, Dependensi & Batasan |
| 13 | Risiko & Mitigasi |
| 14 | Deliverable & Kriteria Penerimaan |
| 15 | Roadmap Mobile |
| 16 | Keputusan Terbuka |
| A | Lampiran A — Ketertelusuran Kebutuhan |
| B | Lampiran B — Glosarium & Referensi |

---

# 0. KONTROL DOKUMEN

## 0.1 Informasi Dokumen

| Atribut | Keterangan |
|---|---|
| Nama Dokumen | Business Requirements Document (BRD) — Fleet Driver Mobile App |
| Kode Dokumen | BRD/FMS/26/001-MOB |
| Versi | 1.0 |
| Tanggal | 15 Oktober 2026 |
| Penyusun | PT GenZys Digital Creatindo |
| Status | Baseline Internal untuk Pengembangan Prototype |
| Klasifikasi | Internal - Product Development |
| Dokumen Induk | BRD/FMS/26/001 (Fleet Management System) |
| Referensi Produk | Product Catalog GenZys 2026 — Fleet Management System, halaman katalog 22-23 |

## 0.2 Riwayat Revisi

| Versi | Tanggal | Perubahan | Penyusun |
|---|---|---|---|
| 0.9 | 12 Okt 2026 | Salinan markdown BRD induk (placeholder). | PT GenZys Digital Creatindo |
| 1.0 | 15 Okt 2026 | Dijadikan BRD turunan **driver-focused**: scope mobile, persona R6, kebutuhan `MBR-xxx`, aturan `MBRL-xxx`, NFR mobile, traceability ke `BR-xxx`/`BRL-xxx`. | PT GenZys Digital Creatindo |

## 0.3 Review dan Persetujuan

| Peran | Nama/Pihak | Tanggung Jawab | Status |
|---|---|---|---|
| Business Owner | Manajemen PT GenZys Digital Creatindo | Arah produk mobile, target pasar, prioritas fitur driver. | Untuk Review |
| Product/Project Lead | Ditentukan | Menjaga scope dan menurunkan BRD-MOB menjadi PRD/FRD mobile. | Untuk Review |
| Technical Lead | Menentukan | Validasi feasibility mobile (offline-sync, peta, push, keamanan device). | Untuk Review |
| Fleet/Operations SME | Ditentukan | Validasi alur kerja driver di lapangan (DVIR, POD, fuel, insiden). | Untuk Review |
| Prototype Team | Internal/PKL | Implementasi prototype `fleet-app` berdasarkan baseline yang disetujui. | Belum Ditugaskan |

## 0.4 Tujuan & Penggunaan Dokumen

Dokumen ini menetapkan kebutuhan bisnis, ruang lingkup, aturan operasional, indikator keberhasilan,
dan kriteria penerimaan untuk **aplikasi mobile driver** GenZys FleetOps. Dokumen menjadi baseline
sebelum diturunkan ke PRD mobile (`prd/PRD-Mobile-Driver-App.md` + `prd/PRD-MOB-*.md`), FRD mobile
(`frd/FRD-MOB-*.md`), desain UI/UX mobile, dan skenario pengujian.

| ■ Batasan Dokumen BRD-MOB menjelaskan kebutuhan dan nilai bisnis permukaan mobile. Detail teknis implementasi (Flutter, sinkronisasi, spesifikasi API, field-level validation, test case rinci) ditetapkan pada PRD/FRD mobile dan dokumen turunannya. |
|---|

---

# 1. RINGKASAN EKSEKUTIF

Aplikasi mobile driver GenZys FleetOps (`fleet-app`) adalah **alat kerja utama driver di lapangan**.
Aplikasi ini memberi driver satu permukaan ringan untuk: menerima tugas, menjalankan perjalanan,
melaporkan kondisi kendaraan, menangkap bukti serah terima, mencatat bahan bakar, dan memantau
kinerja serta keselamatan dirinya sendiri — semua dengan **satu tangan** dan **tetap berfungsi
saat sinyal tidak stabil**.

Mobile bukan versi mini dari desktop. Desktop (`GenZysFleetOps-fe`) melayani **admin, dispatcher,
fleet manager, maintenance, finance**. Mobile melayani **satu persona: Driver (R6)** dan hanya
memuat **slice driver** dari tiap modul. Fungsi admin (konfigurasi, approval, registry, dashboard
armada penuh, export) **tidak** direplikasi ke mobile.

| ■ Nilai Bisnis Utama Mengubah laporan manual driver (kertas, chat, telepon) menjadi data terstruktur & bertimestamp yang langsung mengalir ke modul desktop — sehingga visibilitas operasional, kepatuhan (DVIR/POD), dan akurasi biaya (fuel) meningkat tanpa menambah beban administratif driver. |
|---|

---

# 2. LATAR BELAKANG & PELUANG BISNIS MOBILE

## 2.1 Konteks Bisnis

Pada operasional armada saat ini, driver adalah **titik data paling kritis namun paling lemah
digitalisasinya**: bukti pengiriman difoto manual lalu dikirim via chat, insiden kendaraan
dilaporkan lisan, entri BBM menyusul berhari-hari, dan inspeksi pra-perjalanan sering tidak
terdokumentasi. Akibatnya data di desktop terlambat, tidak lengkap, dan sulit diaudit.

BRD induk menetapkan bahwa driver "dapat melihat assignment sendiri, acknowledge, start, update
status, dan complete melalui **tampilan mobile-friendly**" (`BR-012`) dan menempatkan "driver mobile
task list, pre-trip inspection, issue reporting" pada prioritas **Could** (`OD-10`). BRD-MOB ini
mengangkat kapabilitas tersebut menjadi produk mobile tersendiri dengan baseline kebutuhan yang
eksplisit, karena tanpa permukaan mobile yang matang, alur data inti FMS tetap bocor di lapangan.

## 2.2 Pernyataan Permasalahan (Mobile)

| Permasalahan | Dampak Bisnis |
|---|---|
| Driver menerima tugas lewat chat/telepon tanpa status terstruktur. | Status perjalanan tidak akurat; dispatcher menebak-nebak. |
| Bukti serah terima (POD) & inspeksi tidak terdokumentasi rapi. | Sengketa pengiriman sulit dibuktikan; klaim tidak terlindungi. |
| Pelaporan kerusakan & insiden bergantung ingatan/laporan lisan. | Kerusakan terlambat ditangani; keselamatan tidak terukur. |
| Entri BBM menyusul, odometer tidak akurat. | KPI konsumsi & biaya per kendaraan menyesatkan. |
| Sinyal di lapangan (pelosok, gudang, basement) sering hilang. | Aplikasi web/manual gagal; driver berhenti bekerja atau menunda input. |
| Driver tidak tahu alasan skor/peringkatnya. | Tidak ada perbaikan perilaku; coaching tidak tepat sasaran. |
| Perangkat & akun dibagikan/dipinjam. | Risiko keamanan data & akuntabilitas (SoD) rusak. |

## 2.3 Peluang & Positioning

Aplikasi driver diposisikan sebagai **"companion app" operasional** — bukan sekadar task list.
Ia menutup celah data terakhir antara lapangan dan kantor, serta menjadi kanal umpan balik
(coaching, skor safety, settlement) kepada driver. Positioning: **ringan, offline-first, satu tangan,
aman, dan terhubung realtime ke modul desktop yang sudah ada**.

| ■ Prinsip Positioning Mobile = permukaan kerja driver, bukan replika desktop. Setiap kemampuan harus lulus uji: "apakah driver benar-benar butuh ini di lapangan, dengan satu tangan, tanpa sinyal?" Jika tidak → out-of-scope mobile. |
|---|

---

# 3. TUJUAN BISNIS MOBILE & INDIKATOR KEBERHASILAN

## 3.1 Tujuan Bisnis Mobile

• **Menutup celah data lapangan** — mengubah laporan manual driver menjadi data terstruktur, bertimestamp, dan ter-geo-tag yang mengalir ke modul desktop.

• **Mempercepat siklus tugas** — driver menerima, mengakui, menjalankan, dan menutup perjalanan tanpa telepon/chat.

• **Meningkatkan kepatuhan & keselamatan** — DVIR pre/post-trip, pelaporan insiden, dan POD menjadi wajib dan terdokumentasi.

• **Menjaga akurasi biaya** — entri BBM & odometer dicatat saat kejadian, bukan menyusul.

• **Membuat driver tetap produktif tanpa sinyal** — operasi inti berjalan offline dengan antrian sinkronisasi.

• **Memberi transparansi ke driver** — skor DNA, peringkat kinerja, dan rincian settlement dapat dilihat driver sendiri.

• **Menjaga batas peran (SoD)** — mobile hanya untuk driver; fungsi admin tetap di desktop.

## 3.2 Indikator Keberhasilan Prototype Mobile

| Indikator | Target Prototype | Metode Validasi |
|---|---|---|
| Coverage alur driver | Login → Inbox → DVIR → Trip → POD → Fuel → Close dapat didemonstrasikan end-to-end. | Demo checklist. |
| Adopsi alur tugas | Tidak ada langkah wajib driver yang hanya bisa diselesaikan via desktop. | Walkthrough peran. |
| Offline resilience | DVIR, POD, Fuel Log, Defect, Insiden dapat diisi tanpa sinyal lalu tersinkron tanpa duplikat. | Skenario airplane-mode. |
| Akurasi data lapangan | Entri BBM & odometer tercatat saat kejadian; geotag bukti valid. | Validasi data & peta. |
| Kepatuhan | DVIR gagal → trip terblokir; POD wajib sebelum close. | Negative scenario test. |
| Usability satu tangan | Semua aksi utama terjangkau ibu jari; target sentuh ≥48dp. | Internal walkthrough + device test. |
| Keamanan | Token di secure storage; tidak ada kredensial cleartext; nomor kartu masked. | Security review. |
| Kualitas | Tidak ada defect Critical/High pada alur demo utama. | Issue log & sign-off. |

## 3.3 KPI Mobile (Definisi Awal)

| KPI | Definisi Awal | Catatan |
|---|---|---|
| Task Acknowledgement Rate | Trip di-acknowledge / trip ditugaskan. | Turunan `BR-012`. |
| On-Time Start (driver) | Trip mulai dalam toleransi jadwal. | Selaras KPI induk On-Time Start. |
| DVIR Completion Rate | DVIR pre-trip lengkap / trip dimulai. | Gate kepatuhan. |
| POD Capture Rate | POD tertangkap / trip selesai. | Bukti serah terima. |
| Fuel Entry Timeliness | Entri BBM ≤ X jam setelah transaksi. | Kualitas data biaya. |
| Sync Success Rate | Item antrian offline tersinkron sukses / total. | Reliabilitas mobile. |
| Driver DNA Trend | Perubahan skor DNA per periode. | Dari M13. |

---

# 4. RUANG LINGKUP

## 4.1 In-Scope Mobile (Driver-Facing)

| Area (Modul Desktop) | Cakupan Mobile Driver |
|---|---|
| Access & Org (M01) | Login driver (PIN/OTP/QR), auto-login, guard status/SIM. Tanpa self-registration. |
| Driver Master (M03) | Home driver, profil & dokumen pribadi, accept/decline tugas. |
| Vehicle Master (M02) | Kendaraan saya (unit ditugaskan), ring DNA unit, lapor rusak. |
| Assignment & Trip (M04) | Inbox tugas, eksekusi trip (start/arrive/complete), lokasi berkala. |
| Tracking & Map (M05) | Peta posisi sendiri + rute + ETA (driver-scope). |
| Geofence & Alert (M06) | Feed peringatan trip milik driver + resolve dengan alasan. |
| Fuel & Cost (M07) | Entri BBM (volume>0, odometer, foto struk). |
| Maintenance (M08) | Laporan kerusakan + foto → auto work order; status WO. |
| Document & Compliance (M09) | Dokumen pribadi & masa berlaku (read-only + reminder). |
| Dashboard & Reporting (M10) | Ringkasan kinerja pribadi (KPI diri sendiri). |
| Settings & Audit (M11) | Aktivitas saya (jejak aksi pribadi, read-only). |
| Notifications (M12) | Inbox notifikasi, push, deep-link, preferensi. |
| Fleet DNA / Health (M13) | DNA kesehatan saya + breakdown sub-komponen. |
| Route Optimization (M14) | Rute disarankan + ETA; konfirmasi sebelum simpan. |
| Billing / Rate Card (M15) | Settlement & pendapatan saya (read-only, SoD). |
| Regulatory & Safety (M16) | Kepatuhan & sertifikasi saya; lapor insiden (immutable). |
| DVIR & Inspection (M17) | Checklist DVIR pre/post-trip + foto defect; fail → block. |
| Safety Events (M18) | Peristiwa safety saya + skor safety (read-only). |
| Asset & Equipment (M19) | Aset/trailer pada trip, reefer suhu, anti-theft. |
| Driver Coaching (M20) | Rencana coaching, milestone, sertifikasi saya. |
| Customer Exp & POD (M21) | POD capture: foto + TTD + scan + geo, immutable, offline. |
| Fuel & Spend (M22) | Kartu BBM (masked), limit, transaksi, fraud flag. |

**Total: 23 layar driver-facing** — cakupan M01–M22 (lihat `README.md` & `QUICK-REFERENCE.md`).

## 4.2 Out-of-Scope Mobile

• Seluruh fungsi **admin-only** dari modul yang sama: konfigurasi alert/behavior rules (M06/M18), registry & utilisasi aset (M19), rate card & approval settlement (M15), audit sistem & security config (M11), dashboard armada penuh + export laporan (M10), route optimizer sisi dispatcher (M14), live map armada penuh, video dashcam hosting.

• Registrasi akun mandiri (self-registration) — akun & perangkat disediakan admin/vendor.

• Manajemen pengguna/role, konfigurasi organisasi/site, dan pengaturan global.

• Fitur turunan BRD induk yang masih Won't-Fase 1 (real tracker integration, AI scoring, payroll, accounting ledger, e-POD pihak ketiga penuh).

## 4.3 Prioritas MoSCoW (Mobile)

| Prioritas | Fitur Mobile |
|---|---|
| Must | Login driver; Home; Inbox tugas; Eksekusi trip; DVIR; POD; Fuel Log; Notifikasi; Kendaraan saya; Ownership & keamanan. |
| Should | Rute & posisi trip; Peringatan trip; Laporan kerusakan; Profil & dokumen; Ringkasan kinerja; Kartu BBM. |
| Could | Coaching; DNA saya; Rute disarankan; Kepatuhan & sertifikasi; Peristiwa safety; Aset & equipment; Settlement; Aktivitas saya. |
| Won't - Fase 1 | Fungsi admin di mobile; konfigurasi; export laporan; live map armada penuh; dashcam hosting. |

---

# 5. PEMANGKU KEPENTINGAN & PERSONA DRIVER

## 5.1 Pemangku Kepentingan

| Stakeholder | Kepentingan pada Mobile | Ekspektasi |
|---|---|---|
| Driver/Field Operator | Alat kerja harian yang ringan & jelas. | Instruksi ringkas, satu tangan, tetap jalan tanpa sinyal. |
| Dispatcher/Operations | Status perjalanan akurat & realtime. | Acknowledge/start/complete tercatat otomatis. |
| Fleet/Operations Manager | Kepatuhan DVIR/POD & data lapangan lengkap. | Tidak ada lagi laporan manual yang bocor. |
| Maintenance Officer | Laporan kerusakan cepat + bukti foto. | Auto work order dari defect report. |
| Finance/Cost Controller | Data BBM & odometer akurat saat kejadian. | Entri BBM tepat waktu & ter-geo-tag. |
| Safety/Compliance | Insiden & DVIR terdokumentasi. | Pelaporan wajib, immutable, teraudit. |
| IT/System Administrator | Keamanan device & akun. | Token secure, tanpa kredensial cleartext, SoD terjaga. |
| Business Owner | Adopsi & nilai bisnis mobile. | Driver benar-benar memakai app di lapangan. |

## 5.2 Persona Utama — R6 Driver

| Atribut | Deskripsi |
|---|---|
| Peran | Pengemudi kendaraan operasional (logistik/distribusi/proyek). |
| Konteks | Di kabin/ lapangan; sering satu tangan; sinyal tidak stabil; cahaya matahari terik. |
| Tujuan | Menyelesaikan tugas dengan cepat, tanpa kertas, tanpa telepon, tanpa risiko administrasi. |
| Frustrasi | Aplikasi berat, form panjang, kehilangan data saat sinyal hilang, tidak tahu alasan penilaian. |
| Literasi digital | Sedang — butuh UI sederhana, ikon jelas, teks besar, bahasa Indonesia. |
| Perangkat | Android mid-range (prioritas); iOS target berikutnya. |
| Batasan | Tidak boleh melihat data biaya/kendaraan lain; hanya data miliknya (ownership). |

## 5.3 Job-to-be-Done Driver

| JTBD | Outcome |
|---|---|
| "Saya ingin tahu tugas saya hari ini." | Daftar tugas jelas di Inbox/Home. |
| "Saya ingin mengabari kantor tanpa menelepon." | Status trip berubah 1-tap. |
| "Saya ingin memastikan kendaraan layak jalan." | DVIR pre-trip memandu; gagal → blokir. |
| "Saya ingin membuktikan barang sudah diterima." | POD foto + TTD + geo. |
| "Saya ingin mencatat BBM tanpa repot." | Form singkat + foto struk, offline-safe. |
| "Saya ingin tahu kenapa skor saya begini." | DNA breakdown + tautan coaching. |
| "Saya ingin tetap bekerja saat tidak ada sinyal." | Antrian sync idempotent. |

## 5.4 Batas Peran (Role Boundary)

| Permukaan | Persona | Modul yang Dilayani |
|---|---|---|
| Desktop web (`GenZysFleetOps-fe`) | Admin, Dispatcher, Fleet Manager, Maintenance, Finance, Viewer | Semua fungsi M01–M22. |
| Mobile (`fleet-app`) | **Driver (R6) saja** | Slice driver dari M01–M22; sisanya out-of-scope. |

| ■ Segregation of Duties Mobile tidak boleh menjadi jalan pintas untuk fungsi admin. Layar admin murni di mobile bersifat read-only (mis. Settlement, Aktivitas Saya) dan tidak dapat mengubah data. |
|---|

---

# 6. PERMASALAHAN SAAT INI & TARGET KONDISI (MOBILE)

| Area | Kondisi Saat Ini | Target Kondisi Mobile |
|---|---|---|
| Penerimaan tugas | Via chat/telepon, tanpa status. | Inbox tugas + accept/decline 1-tap (alasan wajib bila decline). |
| Inspeksi kendaraan | Tidak terdokumentasi. | DVIR pre/post-trip dengan foto; gagal → blokir trip. |
| Bukti pengiriman | Foto manual via chat. | POD foto+TTD+scan+geo, immutable, offline-safe. |
| Pelaporan BBM | Menyusul, tidak akurat. | Entri BBM saat kejadian + odometer + foto struk. |
| Pelaporan kerusakan/insiden | Lisan/terlambat. | Form defect/insiden + foto → auto WO / catatan safety. |
| Sinyal lapangan | App gagal → kerja terhenti. | Offline-first + antrian sync idempotent. |
| Transparansi skor | Driver tidak tahu alasan. | DNA breakdown + coaching + ring kinerja pribadi. |
| Keamanan akun | Perangkat/akun bisa dipinjam. | Token secure storage + guard status + scope ownership. |

---

# 7. PROSES BISNIS MOBILE TARGET

## 7.1 Hari Kerja Driver (Day-in-the-Life)

1. **Login** — driver masuk via PIN/OTP/QR (tanpa registrasi); sistem memvalidasi status & SIM.
2. **Home** — driver melihat status, ring DNA, dan tugas berikutnya; accept/decline 1-tap.
3. **DVIR pre-trip** — driver mengisi checklist kendaraan; bila ada defect → foto + lapor; bila fail → trip terblokir.
4. **Eksekusi trip** — start (odometer awal) → perjalanan (lokasi berkala, rute, ETA) → arrive → complete (odometer akhir).
5. **POD** — saat sampai: foto, tanda tangan, scan dokumen, geotag (offline-safe, immutable).
6. **Fuel/Defect/Insiden** — dicatat kapan saja saat kejadian; offline-safe.
7. **Notifikasi & peringatan** — push realtime; alert trip di-resolve dengan alasan.
8. **Tutup hari** — ringkasan kinerja, DNA, dan (opsional) settlement pribadi dapat dilihat.

## 7.2 Alur Offline → Sinkronisasi

1. Driver mengisi DVIR/POD/Fuel/Defect/Insiden **tanpa sinyal** → disimpan lokal sebagai item antrian.
2. Setiap item diberi **idempotency key** lokal.
3. Saat sinyal kembali, antrian dikirim berurutan; server menolak duplikat via key.
4. Status sinkron terlihat di **Aktivitas Saya** (menunggu/tersinkron/gagal).
5. Item gagal tidak hilang; driver dapat mencoba ulang.

## 7.3 Lifecycle Status Mobile (Ringkas)

| Objek | Status di Mobile | Catatan |
|---|---|---|
| Sesi/Perangkat | Authenticated, Locked, Expired | Guard status & SIM saat login. |
| Tugas (Trip) | Assigned, Acknowledged, In Progress, Completed, Cancelled | Mirror lifecycle trip desktop (`BRL-009`, `BRL-013`, `BRL-014`). |
| DVIR | Draft, Submitted, Failed, Passed | Failed → blokir trip. |
| POD | Draft (offline), Uploaded, Verified | Immutable setelah upload. |
| Antrian Sync | Pending, Syncing, Synced, Failed | Idempotent. |
| Alert Trip | Open, Acknowledged, Resolved | Resolve wajib alasan (`BRL-019`). |

---

# 8. KEBUTUHAN BISNIS MOBILE (MBR)

Kebutuhan berikut adalah baseline permukaan mobile. Kolom **Trace** menautkan ke kebutuhan/aturan
BRD induk; `—` berarti kebutuhan spesifik mobile tanpa padanan langsung di BRD induk (modul
lanjutan `MODULE-MAP-v2.md`). Prioritas mengikuti MoSCoW.

| ID | Area / Layar | Kebutuhan Bisnis Mobile | Prioritas | Trace (Induk) |
|---|---|---|---|---|
| MBR-001 | Login Driver (M01) | Driver masuk dengan PIN/OTP/QR; auto-login via token; guard status aktif & SIM belum expired. | Must | BR-001, BR-002 |
| MBR-002 | Home (M03) | Driver melihat status, ring DNA, tugas berikutnya, dan aksi accept/decline 1-tap. | Must | BR-012 |
| MBR-003 | Profil & Dokumen (M03+M09) | Driver melihat profil, SIM, dokumen pribadi, dan status masa berlaku (read-only + reminder). | Should | BR-006, BR-030, BR-031 |
| MBR-004 | Inbox Tugas (M04) | Driver melihat daftar tugasnya dengan filter status, realtime via push. | Must | BR-012 |
| MBR-005 | Eksekusi Trip (M04) | Driver dapat start/arrive/complete trip dengan odometer & catatan; status tervalidasi. | Must | BR-011, BR-012, BRL-009..014 |
| MBR-006 | DVIR (M17) | Driver mengisi checklist pre/post-trip dengan foto; kegagalan memblokir trip. | Must | — (OD-10) |
| MBR-007 | POD (M21) | Driver menangkap bukti serah terima (foto+TTD+scan+geo) yang immutable & offline-safe. | Must | — |
| MBR-008 | Fuel Log (M07) | Driver mencatat BBM (volume>0, odometer, foto struk) saat kejadian. | Must | BR-023, BRL-020, BRL-021 |
| MBR-009 | Notifikasi (M12) | Driver menerima inbox notifikasi + push Critical + deep-link + preferensi. | Must | BR-021, BR-022 |
| MBR-010 | Coaching (M20) | Driver melihat rencana coaching, milestone, dan sertifikasi pribadi. | Could | — |
| MBR-011 | Kendaraan Saya (M02) | Driver melihat detail unit yang ditugaskan, ring DNA, dokumen, dan aksi lapor rusak. | Should | BR-003, BR-005 |
| MBR-012 | Rute & Posisi Trip (M05) | Driver melihat posisi sendiri, rute, dan ETA (driver-scope, bukan live map armada). | Should | BR-014, BR-016 |
| MBR-013 | Peringatan Trip (M06) | Driver melihat feed alert trip miliknya + resolve wajib alasan. | Should | BR-019..BR-022, BRL-019 |
| MBR-014 | Laporan Kerusakan (M08) | Driver melaporkan defect + foto → auto work order; status WO terlihat. | Should | BR-028 |
| MBR-015 | Ringkasan Kinerja (M10) | Driver melihat KPI pribadi + tren 7 hari (bukan dashboard armada). | Could | BR-032 |
| MBR-016 | Aktivitas Saya (M11) | Driver melihat jejak aksi pribadi (read-only) + status sinkron antrian. | Could | BR-035 |
| MBR-017 | DNA Kesehatan Saya (M13) | Driver melihat skor DNA + breakdown sub-komponen + alasan + tren. | Could | — |
| MBR-018 | Rute Disarankan (M14) | Driver menerima multi-opsi rute + ETA dan konfirmasi sebelum disimpan. | Could | — |
| MBR-019 | Settlement (M15) | Driver melihat rincian pendapatan per periode (read-only, SoD). | Could | BR-027 |
| MBR-020 | Kepatuhan & Sertifikasi (M16) | Driver melihat status SIM/sertifikat dan dapat melaporkan insiden (immutable). | Could | BR-030, BR-031 |
| MBR-021 | Peristiwa Safety (M18) | Driver melihat peristiwa perilaku (telemetry) + skor safety + bukti (read-only). | Could | — |
| MBR-022 | Aset & Equipment Trip (M19) | Driver melihat aset/trailer pada trip, reefer suhu, status anti-theft. | Could | — |
| MBR-023 | Kartu BBM & Pengeluaran (M22) | Driver melihat kartu BBM (masked), limit, transaksi, dan fraud flag. | Should | BR-023, BR-025 |
| MBR-024 | Lintas layar | Operasi inti (DVIR, POD, Fuel, Defect, Insiden) berfungsi offline dengan antrian sync idempotent. | Must | BR-015, BRL-016 |
| MBR-025 | Lintas layar | Semua layar dibatasi **ownership**: driver hanya data miliknya (site + user scope). | Must | BR-001, BRL-027, BRL-028 |
| MBR-026 | Lintas layar | **Tanpa registrasi mandiri**; akun & perangkat disediakan admin/vendor (B2B). | Must | BR-001 |
| MBR-027 | Lintas layar | Ergonomi **satu tangan** & aksesibilitas: target sentuh ≥48dp, teks besar, kontras, tanpa hover. | Must | BRD induk Bab 11 |
| MBR-028 | Lintas layar | Keamanan perangkat: token di secure storage, tanpa kredensial cleartext, nomor kartu masked. | Must | BRD induk Bab 11 |
| MBR-029 | Lintas layar | Push realtime (SignalR) untuk tugas, alert, status, dan skor. | Should | BR-021 |
| MBR-030 | Lintas layar | Notifikasi push + deep-link langsung ke layar kontekstual. | Should | BR-021 |

## 8.1 Kebutuhan Berdasarkan Persona

| Persona | JTBD | Outcome |
|---|---|---|
| R6 Driver | Menjalankan tugas harian tanpa kertas/telepon. | Alur tugas lengkap di satu app. |
| R6 Driver | Tetap produktif tanpa sinyal. | Operasi inti offline-safe. |
| R6 Driver | Tahu alasan penilaian dirinya. | DNA breakdown + coaching. |
| Dispatcher (tidak pakai app, tapi terpengaruh) | Status trip akurat. | Update status otomatis dari mobile. |

---

# 9. ATURAN BISNIS MOBILE (MBRL)

Aturan ini adalah **spesialisasi/penegasan** aturan induk untuk permukaan mobile. `Trace` menunjuk
ke aturan induk `BRL-xxx`; `—` berarti aturan khas mobile.

| ID | Aturan Bisnis Mobile | Trace |
|---|---|---|
| MBRL-001 | Driver hanya dapat melihat & mengubah data miliknya (site + user scope). | BRL-027, BRL-028 |
| MBRL-002 | Tidak ada registrasi/sign-up mandiri; akun & perangkat disediakan admin/vendor. | — |
| MBRL-003 | Login ditolak bila status driver non-aktif atau SIM expired. | BRL-005 |
| MBRL-004 | PIN salah 5x → lock sementara + notifikasi. | — |
| MBRL-005 | DVIR pre-trip gagal (fail) memblokir dimulainya trip. | — |
| MBRL-006 | Odometer akhir tidak boleh lebih kecil dari odometer awal tanpa koreksi beralasan. | BRL-011 |
| MBRL-007 | POD bersifat immutable setelah diunggah; koreksi via alur beralasan + audit. | BRL-019, BRL-028 |
| MBRL-008 | Entri BBM wajib volume > 0, odometer, dan bukti; pembatalan via void, bukan hapus. | BRL-020, BRL-021 |
| MBRL-009 | Item antrian offline wajib idempotent (idempotency key) agar tidak duplikat saat sinkron. | BRL-016 |
| MBRL-010 | Alert trip yang di-resolve wajib menyertakan alasan; tidak dapat dihapus. | BRL-019 |
| MBRL-011 | Data finansial (settlement, kartu BBM) hanya tampil read-only untuk driver; nomor kartu masked. | BRL-027 |
| MBRL-012 | Semua timestamp mengikuti timezone organization/site. | BRL-029 |
| MBRL-013 | Data lokasi driver diperlakukan sebagai data sensitif; akses terbatas & sesuai kebijakan privasi. | BRD induk Bab 11 |
| MBRL-014 | Fungsi admin modul (konfigurasi/approval/export) tidak tersedia di mobile. | — |
| MBRL-015 | Prototype memakai synthetic data; tidak memakai data driver/rute nyata tanpa persetujuan. | BRL-030 |

---

# 10. KEBUTUHAN DATA, DASHBOARD & PELAPORAN MOBILE

## 10.1 Entitas Data yang Disentuh Mobile

| Entitas | Akses Mobile | Relasi Kritis |
|---|---|---|
| Driver | Read (milik sendiri) | Trip, dokumen, alert, DNA. |
| Vehicle | Read (unit ditugaskan) | Trip, DVIR, defect, fuel. |
| Trip/Assignment | Read + update status | Vehicle, driver, telemetry, POD, fuel. |
| DVIR | Create/Read | Trip, vehicle, defect. |
| POD | Create (immutable) | Trip, customer. |
| Fuel/Expense | Create/Read (milik sendiri) | Vehicle, trip. |
| Defect/Work Order | Create defect, Read WO | Vehicle, maintenance. |
| Alert/Notification | Read + resolve | Trip, vehicle, driver. |
| DNA/Safety Score | Read | Driver, telemetry. |
| Sync Queue | Create/Read | Semua item offline. |

## 10.2 Dashboard Mobile (Driver)

| Komponen | Isi Minimum | Layar |
|---|---|---|
| Status Ringkas | Status driver, ring DNA, tugas berikutnya | Home |
| Kinerja Pribadi | KPI diri sendiri + tren 7 hari | Ringkasan Kinerja |
| DNA Breakdown | Skor komposit + sub-komponen + alasan | DNA Kesehatan Saya |
| Kepatuhan Pribadi | Status SIM/sertifikat + expiry | Kepatuhan & Sertifikasi |
| Status Sinkron | Antrian offline menunggu/tersinkron/gagal | Aktivitas Saya |

## 10.3 Pelaporan (Mobile)

Mobile **tidak menyediakan export laporan** (out-of-scope). Pelaporan penuh tetap di desktop (M10).
Mobile hanya menampilkan **ringkasan pribadi** (KPI diri, DNA, settlement pribadi, aktivitas saya).

---

# 11. EKSPEKTASI NON-FUNGSIONAL MOBILE

| Kategori | Ekspektasi Prototype Mobile |
|---|---|
| Offline-first | DVIR, POD, Fuel Log, Defect, Insiden berfungsi tanpa sinyal; antrian sync idempotent. |
| Performance | Cold start ke layar login < 3 detik; render layar < 2 detik; skeleton loading (bukan spinner). |
| Usability | Satu tangan; target sentuh ≥48dp; aksi utama di thumb zone; minim teks. |
| Mobile-friendly (BRD Bab 11) | Kontras memadai, font besar, tanpa ketergantungan hover. |
| Security | JWT di secure storage (Keychain/Keystore); tanpa kredensial cleartext; session expiry wajar. |
| Privacy | Lokasi driver = data sensitif; akses terbatas; nomor kartu masked. |
| Reliability | Duplikat/retry sinkron tidak menghasilkan data ganda; item gagal tidak hilang. |
| Compatibility | Android prioritas; iOS target berikutnya; diuji pada device umum untuk kamera/QR/geo. |
| Accessibility | Label jelas, status tidak hanya warna, alur sederhana. |
| Localization | Bahasa Indonesia default; label/unit/timezone configurable. |
| Interoperability | REST API BE + SignalR; konsisten dengan design token web FE. |
| Observability | Log sync, status antrian, dan error yang dapat terlihat driver (Aktivitas Saya). |

## 11.1 Target Kinerja Awal

| Area | Target Awal | Batasan |
|---|---|---|
| Cold start → login | ≤ 3 detik (environment demo stabil). | Tidak termasuk tile peta eksternal. |
| Render layar | ≤ 2 detik untuk data normal. | Pagination untuk histori besar. |
| Sinkron antrian | Item tersinkron ≤ 5 detik setelah sinyal kembali (dataset demo). | Tergantung jaringan. |
| Ukuran app | Ringan untuk Android mid-range. | Target final setelah profiling. |

---

# 12. ASUMSI, DEPENDENSI & BATASAN

## 12.1 Asumsi

• Satu organisasi dengan beberapa site/depot; struktur data tidak mengunci multi-organisasi.

• Mobile mengonsumsi REST API + SignalR dari BE yang sudah ada (26 controller).

• Data driver, plate, phone, dokumen, dan lokasi adalah dummy/dianonimkan.

• Peta memakai provider yang dipilih untuk demo (lihat OD-01 BRD induk).

• Android prioritas; iOS menyusul.

## 12.2 Dependensi

• Ketersediaan endpoint BE per modul M01–M22 + kontrak telemetry/status.

• Keputusan strategi offline-sync (queue, idempotency, konflik).

• Ketersediaan design token & komponen mobile yang selaras web FE.

• Keputusan provider peta/tile, push notification, dan izin kamera/lokasi.

• Ketersediaan reviewer bisnis untuk mengunci alur driver & aturan kepatuhan.

## 12.3 Batasan

• Mobile bukan sistem keselamatan/emergency dispatch, dan bukan sumber kebenaran regulasi.

• Near real-time bergantung pada jaringan & interval telemetry.

• Driver-only: tidak ada fungsi admin; layar admin murni bersifat read-only.

• Prototype, bukan production-grade multi-tenant SaaS.

---

# 13. RISIKO & MITIGASI

| ID | Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|---|
| MR-01 | Sinkron offline menghasilkan data duplikat/korup. | Sedang | Tinggi | Idempotency key, timestamp validation, urutan antrian, retry aman. |
| MR-02 | Driver mengabaikan DVIR/POD karena dianggap beban. | Sedang | Tinggi | UI 1-tangan, form singkat, gate kepatuhan (DVIR gagal → blokir). |
| MR-03 | Sinyal buruk membuat app terasa "rusak". | Tinggi | Sedang | Offline-first + indikator antrian yang jelas. |
| MR-04 | Perangkat/akun dibagikan (risiko keamanan). | Sedang | Tinggi | Secure storage, guard status, scope ownership, session expiry. |
| MR-05 | Data lokasi driver menimbulkan risiko privasi. | Sedang | Tinggi | Synthetic data, akses terbatas, masking, privacy notice. |
| MR-06 | Fungsi admin "bocor" ke mobile. | Sedang | Sedang | Scope guard: layar admin murni read-only/out-of-scope. |
| MR-07 | Provider peta/push punya batasan kuota/license. | Sedang | Sedang | Evaluasi provider, abstraction, fallback. |
| MR-08 | Fragmentasi device Android (kamera/QR/geo). | Tinggi | Sedang | Uji pada device umum; fallback input manual. |

---

# 14. DELIVERABLE & KRITERIA PENERIMAAN

## 14.1 Deliverable

| Deliverable | Deskripsi | Status Target |
|---|---|---|
| BRD-MOB | Dokumen ini — baseline kebutuhan bisnis mobile driver. | Dokumen ini |
| PRD Mobile | PRD induk + PRD per layar (23). | Berikutnya (ada) |
| FRD Mobile | FRD per layar (23). | Berikutnya (ada) |
| UI/UX Mobile | High-fidelity layar driver. | Berikutnya |
| Functional Prototype | `fleet-app` (Flutter) dengan alur driver end-to-end. | Target Delivery |
| Test & Issue Log | Checklist alur driver + defect. | Target Delivery |
| Handover Mobile | Setup, sync strategy, known limitation. | Target Delivery |

## 14.2 Kriteria Penerimaan

• Driver dapat login (PIN/OTP/QR) tanpa registrasi dan masuk ke Home.

• Driver dapat menerima, acknowledge, start, dan complete trip dari mobile.

• DVIR pre-trip wajib; kegagalan memblokir trip.

• POD dapat ditangkap (foto+TTD+scan+geo) dan immutable.

• Entri BBM tercatat dengan volume>0, odometer, dan bukti.

• DVIR, POD, Fuel, Defect, Insiden berfungsi offline lalu tersinkron tanpa duplikat.

• Driver hanya melihat data miliknya; layar admin bersifat read-only.

• Tidak ada defect Critical dan seluruh High pada alur utama ditutup sebelum sign-off.

---

# 15. ROADMAP MOBILE

| Fase | Fokus | Cakupan Utama |
|---|---|---|
| Fase 1 - Prototype MVP | Alur driver inti. | Login, Home, Inbox, Trip Execution, DVIR, POD, Fuel Log, Notifikasi. |
| Fase 2 - Pilot Client | Alur lapangan nyata. | Offline-sync matang, kartu BBM, laporan kerusakan, alert trip, kendaraan saya. |
| Fase 3 - Productization | Skala & pengalaman. | Coaching, DNA, settlement, aset/equipment, push lanjutan, iOS. |
| Fase 4 - Advanced | Umpan balik & optimasi. | Rute disarankan, integrasi tracker nyata, e-POD lanjutan. |

| ■ Prinsip Roadmap Jangan menambah fitur lanjutan sebelum alur inti (login → tugas → DVIR → trip → POD → fuel) stabil, offline-safe, dan tervalidasi. |
|---|

---

# 16. KEPUTUSAN TERBUKA (MOBILE)

| ID | Keputusan | Owner | Target | Status |
|---|---|---|---|---|
| MOD-01 | Strategi offline-sync: queue lokal, idempotency, resolusi konflik? | Technical Lead | Sebelum FRD sync | Open |
| MOD-02 | Prioritas platform: Android-only dulu atau Android+iOS paralel? | Product Lead | Sebelum sprint | Open |
| MOD-03 | Provider peta/tile untuk mobile driver? | Technical Lead | Sebelum layar peta | Open |
| MOD-04 | Metode login utama default: PIN, OTP, atau QR? | Business/Product | Sebelum PRD final | Open |
| MOD-05 | Ambang skor DNA yang memicu banner penurunan? | Fleet SME | Sebelum layar DNA | Open |
| MOD-06 | Apakah DVIR wajib untuk semua trip atau per policy? | Fleet SME | Sebelum FRD DVIR | Open |
| MOD-07 | Kebijakan izin kamera/lokasi & privacy notice? | Business/IT | Sebelum pilot | Open |
| MOD-08 | Provider push notification (FCM/APNs) & format deep-link? | Technical Lead | Sebelum notifikasi | Open |
| MOD-09 | Apakah settlement pribadi tampil di mobile Fase 1? | Business Owner | Sebelum PRD final | Open |
| MOD-10 | Retention data lokasi pada antrian offline device? | Business/IT | Sebelum pilot | Open |

---

# Lampiran A. RINGKASAN KETERTELUSURAN KEBUTUHAN

| Tujuan Bisnis Mobile | Requirement (MBR) | Layar | Indikator |
|---|---|---|---|
| Celah data lapangan tertutup | MBR-006, MBR-007, MBR-008, MBR-014, MBR-020 | DVIR, POD, Fuel Log, Defect, Compliance | DVIR/POD/Fuel completion & timeliness. |
| Siklus tugas lebih cepat | MBR-002, MBR-004, MBR-005 | Home, Inbox, Trip Execution | Acknowledgement & on-time start. |
| Kepatuhan & keselamatan | MBR-006, MBR-013, MBR-020, MBR-021 | DVIR, Alerts, Compliance, Safety | DVIR rate, alert resolution. |
| Akurasi biaya | MBR-008, MBR-023 | Fuel Log, Fuel Card | Fuel entry timeliness. |
| Produktif tanpa sinyal | MBR-024, MBR-016 | Lintas layar, Aktivitas Saya | Sync success rate. |
| Transparansi driver | MBR-010, MBR-015, MBR-017, MBR-019 | Coaching, Performance, DNA, Settlement | Driver DNA trend. |
| Batas peran (SoD) | MBR-025, MBR-026, MBR-028 | Lintas layar | Tidak ada fungsi admin di mobile. |

> Peta lengkap MBR ↔ PRD-MOB ↔ FRD-MOB ↔ modul desktop ada di
> [`RELASI-MOBILE-DESKTOP.md`](RELASI-MOBILE-DESKTOP.md).

# Lampiran B. GLOSARIUM & REFERENSI

## B.1 Glosarium

| Istilah | Definisi |
|---|---|
| MBR | Mobile Business Requirement — kebutuhan bisnis mobile (dokumen ini). |
| MBRL | Mobile Business Rule — aturan bisnis mobile (dokumen ini). |
| DVIR | Driver Vehicle Inspection Report — inspeksi kendaraan pra/pasca perjalanan. |
| POD | Proof of Delivery — bukti serah terima (foto, tanda tangan, scan, geo). |
| Offline-first | Operasi inti berjalan tanpa sinyal dengan antrian sinkronisasi idempotent. |
| Idempotency Key | Kunci unik agar pengiriman ulang tidak menghasilkan data ganda. |
| Ownership | Batas akses: driver hanya data miliknya (site + user scope). |
| SoD | Segregation of Duties — pemisahan peran admin vs driver. |
| Driver DNA | Skor kesehatan komposit driver (M13). |

## B.2 Referensi & Tautan

**Dokumen induk (desktop / sistem):**
- BRD induk: `prd/BRD_Fleet_Management_System_GenZys_v1.0_Corporate.docx`
- FRD induk: [FRD.md](../../FRD.md) · Peta modul: [MODULE-MAP-v2.md](../../MODULE-MAP-v2.md)
- PRD modul desktop: `prd/PRD-M01..M22-*.md` · FRD modul: `prd/frd/FRD-M01..M22-*.md`

**Dokumen mobile:**
- PRD induk mobile: [PRD-Mobile-Driver-App.md](prd/PRD-Mobile-Driver-App.md)
- PRD per layar: [prd/](prd/) · FRD per layar: [frd/](frd/)
- Peta relasi mobile ↔ desktop: [RELASI-MOBILE-DESKTOP.md](RELASI-MOBILE-DESKTOP.md)
- Quick reference: [QUICK-REFERENCE.md](QUICK-REFERENCE.md)

> **Catatan layout**: tautan ke dokumen desktop (`../../prd/...`) resolve pada layout monorepo
> (root `GenZysFleetOps/`). `fleet-app/` adalah repo git terpisah.

--- Akhir Dokumen ---
