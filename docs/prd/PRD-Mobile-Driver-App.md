---
tags:
  - PRD
  - Mobile
  - Driver
  - Flutter
category: Mobile
related:
  - [[BRD-Mobile]]
  - [[PRD-MOB-Login-Driver]]
  - [[PRD-MOB-Home]]
---

# PRD Mobile — GenZys FleetOps Driver App (Induk)

**[PRD-MOB]** - Mobile Driver App
**MODUL**: Mobile Driver App (`fleet-app`, Flutter) — agregasi layar driver-facing dari M01/M03/M04/M07/M12/M17/M20/M21
**PERSONA**: R6 Driver
**PLATFORM**: Mobile (Android prioritas, iOS target berikutnya)
**PRIORITAS**: Phase 1-2 (seiring Wave operasi)
**STATUS**: Draft for Review

---

## Ringkasan
Aplikasi mobile driver adalah alat kerja utama driver di lapangan. Dokumen ini adalah **PRD induk**;
setiap layar dirinci di PRD per-layar (`prd/PRD-MOB-*.md`) + FRD per-layar (`frd/FRD-MOB-*.md`).
Semua layar selaras dengan FRD induk `FRD.md` dan folder BE yang sudah ada.

## Daftar Layar (Screen Inventory)
| # | Layar | PRD | FRD | Modul Sumber | Folder BE |
|---|---|---|---|---|---|
| 1 | Login Driver (PIN/OTP/QR) | [[PRD-MOB-Login-Driver]] | [[FRD-MOB-Login-Driver]] | M01 | `AccessOrganization` |
| 2 | Driver App Home | [[PRD-MOB-Home]] | [[FRD-MOB-Home]] | M03 | `DriverMaster` |
| 3 | Profil & Dokumen Saya | [[PRD-MOB-Profile]] | [[FRD-MOB-Profile]] | M03 | `DriverMaster`/`DocumentCompliance` |
| 4 | Driver Inbox (daftar trip) | [[PRD-MOB-Inbox]] | [[FRD-MOB-Inbox]] | M04 | `AssignmentTrip` |
| 5 | Trip Execution | [[PRD-MOB-Trip-Execution]] | [[FRD-MOB-Trip-Execution]] | M04 | `AssignmentTrip` |
| 6 | DVIR Form (pre/post-trip) | [[PRD-MOB-DVIR]] | [[FRD-MOB-DVIR]] | M17 | `DvirInspection` |
| 7 | POD Capture | [[PRD-MOB-POD]] | [[FRD-MOB-POD]] | M21 | `CustomerExperiencePOD` |
| 8 | Fuel Log (entri BBM) | [[PRD-MOB-Fuel-Log]] | [[FRD-MOB-Fuel-Log]] | M07 | `FuelCost` |
| 9 | Notifikasi Inbox | [[PRD-MOB-Notifications]] | [[FRD-MOB-Notifications]] | M12 | `Notifications` |
| 10 | Coaching & Sertifikasi Saya | [[PRD-MOB-Coaching]] | [[FRD-MOB-Coaching]] | M20 | `CoachingWorkforce` |

**Total: 10 layar mobile.**

---

## Prinsip Desain Mobile (lintas layar)
- **Offline-first**: DVIR, POD, Fuel Log wajib bisa diisi tanpa sinyal → antrian sync idempotent.
- **Satu tangan**: target sentuh >= 48dp, aksi utama di thumb zone, minim teks.
- **Mobile-friendly** (BRD Bab 11): kontras, font besar, tidak mengandalkan hover.
- **Konsisten**: design token & warna brand sama dengan web FE (shadcn/Tailwind).
- **Aman**: JWT via secure storage; tidak simpan kredensial cleartext; session expiry wajar.

## Navigasi & Layout
- **Bottom navigation** (bukan sidebar): Home, Inbox (Tasks), [+ Aksi: DVIR/POD contextual], Notifikasi, Profil.
- Satu **DriverLayout** (mobile) — beda dari AdminLayout desktop di web FE.
- Aksi kontekstual (DVIR sebelum trip, POD setelah sampai) muncul sebagai tombol utama di layar terkait.

## Integrasi Backend
- REST API BE (26 controller sudah ada) untuk CRUD & submit.
- SignalR (`@microsoft/signalr` / padanan Flutter `signalr_net`) untuk push real-time: tugas baru, alert, status.
- Ownership: driver hanya melihat data miliknya (site + user scope, FRD-M01-06).

## Out-of-Scope (Mobile)
Modul admin (billing, rate card, audit, config), route optimizer (sisi dispatcher),
live map armada penuh (driver cukup rute trip-nya), video dashcam hosting.

---

## Catatan Penutup
### Acuan Dokumen
`BRD-Mobile.md`, `FRD.md` (FRD-Mxx-xx), `MODULE-MAP-v2.md`, folder BE terkait.
### Sumber Scope
Layar driver-facing resmi dari FRD (`[Driver]`) + layar turunan wajar (Profile, Fuel Log, Notifikasi, Coaching).
### Hal yang Dilengkapi Sebelum Kickoff
Keputusan offline-sync strategy, prioritas Android vs iOS, provider tile/peta untuk driver, kebijakan izin kamera/lokasi.
