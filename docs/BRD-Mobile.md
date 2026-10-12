# BRD Mobile — GenZys FleetOps Driver App

> **Dokumen turunan.** Acuan bisnis utama = `prd/BRD_Fleet_Management_System_GenZys_v1.0_Corporate.docx`
> (BRD induk keseluruhan sistem). Dokumen ini menurunkan **kebutuhan bisnis khusus aplikasi mobile driver**
> (`fleet-app`, Flutter) dari BRD induk — bukan BRD baru yang berdiri sendiri.
> Penomoran modul mengikuti skema otoritatif `MODULE-MAP-v2.md` (M01–M22).

## Kontrol Dokumen
| Atribut | Keterangan |
|---|---|
| Nama Dokumen | BRD Mobile — GenZys FleetOps Driver App |
| Kode Dokumen | BRD-MOB/FMS/26/001 |
| Versi | 1.0 |
| Tanggal | 12 Oktober 2026 |
| Penyusun | PT GenZys Digital Creatindo |
| Status | Draft for Review |
| Referensi | BRD induk v1.0, FRD.md, MODULE-MAP-v2.md |

---

## 1. Tujuan Bisnis Mobile
Aplikasi mobile driver (`fleet-app`) adalah **satu-satunya alat kerja driver di lapangan**. Tujuannya:
1. Driver menerima & mengeksekusi tugas (trip) tanpa perlu panggilan telepon/WhatsApp.
2. Driver mencatat bukti lapangan (DVIR pre/post-trip, POD) secara digital & offline-safe.
3. Driver melihat performa/coaching-nya sendiri (transparansi dua arah).
4. Mengurangi biaya operasional (koordinasi manual, sengketa POD, inspeksi kertas).

## 2. Pengguna & Peran Mobile
| Peran | Kebutuhan inti | Lingkup |
|---|---|---|
| R6 Driver | Tugas, DVIR, POD, fuel log, notifikasi, coaching | Hanya data miliknya sendiri (site-scoped) |

> Driver TIDAK mengakses modul admin (billing, rate card, audit, config). Akses dibatasi policy
> (`RequirePermission`) + ownership check di backend — konsisten FRD-M01-06.

## 3. Lingkup Bisnis Mobile (layar driver-facing)
Layar mobile ditarik dari modul otoritatif:
| Sumber Modul | Layar Mobile | BRD Induk |
|---|---|---|
| M01 | Login Driver (PIN/OTP/QR) | Auth & RBAC |
| M03 | Driver App Home, Profil & Dokumen | Driver Management |
| M04 | Driver Inbox, Trip Execution | Trip Assignment |
| M07 | Fuel Log (entri BBM) | Fuel & Cost |
| M12 | Notifikasi Inbox | Notifications |
| M17 | DVIR Form (pre/post-trip) | DVIR |
| M20 | Coaching & Sertifikasi Saya | Coaching/Workforce |
| M21 | POD Capture | Customer Experience & POD |

## 4. Kebutuhan Non-Fungsional (Mobile)
- **Offline-first**: DVIR & POD wajib bisa diisi tanpa sinyal, sync saat online (BRL/BRD continuity).
- **Mobile-friendly**: target sentuh besar, minim teks, satu tangan (BRD Bab 11).
- **Performa**: cold start < 3 detik di device kelas menengah.
- **Keamanan**: session aman, token via JWT, tidak simpan kredensial di cleartext.
- **Baterai/data**: tracking background hemat baterai (sample interval wajar).

## 5. Risiko & Asumsi (Mobile)
| ID | Risiko/Asumsi | Mitigasi |
|---|---|---|
| R-MOB-01 | Sinyal tidak stabil di lapangan | Offline queue + sync idempotent |
| R-MOB-02 | Device lama/kamera rendah | Kompresi foto POD, fallback input manual |
| A-MOB-01 | Driver punya smartphone Android (mayoritas) | Prioritas Android; iOS target berikutnya |
| A-MOB-02 | Backend API & SignalR sudah tersedia | Konsumsi endpoint BE yang sudah ada (26 controller) |

## 6. Kriteria Sukses (Mobile)
- 100% trip ditugaskan terlihat di Driver Inbox (real-time).
- DVIR & POD bisa disubmit offline tanpa kehilangan data.
- Waktu koordinasi manual (telepon/WA) turun signifikan.
- Kelengkapan POD meningkat → sengketa menurun.

---
## Dokumen Terkait
- PRD induk: `prd/PRD-Mobile-Driver-App.md`
- PRD per-layar: `prd/` folder
- FRD per-layar: `frd/` folder
- Acuan bisnik induk: `prd/BRD_Fleet_Management_System_GenZys_v1.0_Corporate.docx`
