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
**MODUL**: Mobile Driver App (`fleet-app`, Flutter) — agregasi layar driver-facing dari seluruh modul M01–M22
**PERSONA**: R6 Driver
**PLATFORM**: Mobile (Android prioritas, iOS target berikutnya)
**PRIORITAS**: Phase 1-2 (seiring Wave operasi)
**STATUS**: Draft for Review
**BRD-Mobile**: [BRD-Mobile.md](../BRD-Mobile.md) (MBR-001..030, MBRL-001..016)

---

## Ringkasan
Aplikasi mobile driver adalah alat kerja utama driver di lapangan. Dokumen ini adalah **PRD induk**;
setiap layar dirinci di PRD per-layar (`prd/PRD-MOB-*.md`) + FRD per-layar (`frd/FRD-MOB-*.md`).
Semua layar selaras dengan FRD induk `FRD.md` dan folder BE yang sudah ada.

## Daftar Layar (Screen Inventory)
| # | Layar | PRD | FRD | MBR | Modul Sumber | Folder BE |
|---|---|---|---|---|---|---|
| 1 | Login Driver (PIN/OTP/QR) | [[PRD-MOB-Login-Driver]] | [[FRD-MOB-Login-Driver]] | MBR-001, 026 | M01 | `AccessOrganization` |
| 2 | Driver App Home | [[PRD-MOB-Home]] | [[FRD-MOB-Home]] | MBR-002 | M03 | `DriverMaster` |
| 3 | Profil & Dokumen Saya | [[PRD-MOB-Profile]] | [[FRD-MOB-Profile]] | MBR-003 | M03 | `DriverMaster`/`DocumentCompliance` |
| 4 | Driver Inbox (daftar trip) | [[PRD-MOB-Inbox]] | [[FRD-MOB-Inbox]] | MBR-004 | M04 | `AssignmentTrip` |
| 5 | Trip Execution | [[PRD-MOB-Trip-Execution]] | [[FRD-MOB-Trip-Execution]] | MBR-005 | M04 | `AssignmentTrip` |
| 6 | DVIR Form (pre/post-trip) | [[PRD-MOB-DVIR]] | [[FRD-MOB-DVIR]] | MBR-006 | M17 | `DvirInspection` |
| 7 | POD Capture | [[PRD-MOB-POD]] | [[FRD-MOB-POD]] | MBR-007 | M21 | `CustomerExperiencePOD` |
| 8 | Fuel Log (entri BBM) | [[PRD-MOB-Fuel-Log]] | [[FRD-MOB-Fuel-Log]] | MBR-008 | M07 | `FuelCost` |
| 9 | Notifikasi Inbox | [[PRD-MOB-Notifications]] | [[FRD-MOB-Notifications]] | MBR-009, 030 | M12 | `Notifications` |
| 10 | Coaching & Sertifikasi Saya | [[PRD-MOB-Coaching]] | [[FRD-MOB-Coaching]] | MBR-010 | M20 | `CoachingWorkforce` |
| 11 | Kendaraan Saya | [[PRD-MOB-Vehicle-Detail]] | [[FRD-MOB-Vehicle-Detail]] | MBR-011 | M02 | `VehicleMaster` |
| 12 | Rute & Posisi Trip | [[PRD-MOB-Trip-Tracking]] | [[FRD-MOB-Trip-Tracking]] | MBR-012 | M05 | `TrackingMap` |
| 13 | Peringatan Trip | [[PRD-MOB-Alerts]] | [[FRD-MOB-Alerts]] | MBR-013 | M06 | `GeofenceAlert` |
| 14 | Laporan Kerusakan | [[PRD-MOB-Defect-Report]] | [[FRD-MOB-Defect-Report]] | MBR-014 | M08 | `MaintenanceWorkOrder` |
| 15 | Ringkasan Kinerja Saya | [[PRD-MOB-Performance]] | [[FRD-MOB-Performance]] | MBR-015 | M10 | `DashboardReporting` |
| 16 | Aktivitas Saya | [[PRD-MOB-Activity-Log]] | [[FRD-MOB-Activity-Log]] | MBR-016 | M11 | `AuditAdministration` |
| 17 | DNA Kesehatan Saya | [[PRD-MOB-DNA-Saya]] | [[FRD-MOB-DNA-Saya]] | MBR-017 | M13 | `HealthEngine` |
| 18 | Rute Disarankan | [[PRD-MOB-Route-Suggest]] | [[FRD-MOB-Route-Suggest]] | MBR-018 | M14 | `RouteOptimizer` |
| 19 | Settlement & Pendapatan Saya | [[PRD-MOB-Settlement]] | [[FRD-MOB-Settlement]] | MBR-019 | M15 | `BillingCostCenter` |
| 20 | Kepatuhan & Sertifikasi Saya | [[PRD-MOB-Compliance]] | [[FRD-MOB-Compliance]] | MBR-020 | M16 | `SafetyCompliance` |
| 21 | Peristiwa Safety Saya | [[PRD-MOB-Safety-Events]] | [[FRD-MOB-Safety-Events]] | MBR-021 | M18 | `SafetyEvents` |
| 22 | Aset & Equipment Trip | [[PRD-MOB-Asset-Trip]] | [[FRD-MOB-Asset-Trip]] | MBR-022 | M19 | `AssetEquipment` |
| 23 | Kartu BBM & Pengeluaran Saya | [[PRD-MOB-Fuel-Card]] | [[FRD-MOB-Fuel-Card]] | MBR-023 | M22 | `FuelSpendMgmt` |

**Total: 23 layar mobile (cakupan M01–M22).** Kebutuhan lintas layar: MBR-024 (offline-first),
MBR-025 (ownership), MBR-026 (tanpa registrasi), MBR-027 (satu tangan), MBR-028 (keamanan device),
MBR-029 (push realtime), MBR-030 (push + deep-link).

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

## Model Akun & Provisioning (B2B)
- **Tidak ada registrasi mandiri (self-registration)** di app mobile. Akun & perangkat disediakan oleh admin/vendor (GenZys) — sesuai model bisnis B2B.
- Driver hanya **login** dengan kredensial yang diberikan (PIN/OTP/QR); pembuatan/suspend akun dilakukan admin di web (M01).
- Tidak ada layar sign-up, form pendaftaran, maupun onboarding mandiri di mobile.

## Out-of-Scope (Mobile)
Semua modul M01–M22 punya slice mobile, tetapi **fungsi admin-only** dari modul tersebut
tidak masuk mobile: konfigurasi alert/behavior rules (M06/M18), registry & utilisasi aset (M19),
rate card/approval settlement (M15), audit sistem & security config (M11), dashboard armada
penuh + export laporan (M10), route optimizer sisi dispatcher (M14), live map armada penuh,
video dashcam hosting. Layar admin murni bersifat **read-only** di mobile (mis. Settlement,
Aktivitas Saya).

---

## Catatan Penutup
### Acuan Dokumen
[`BRD-Mobile.md`](../BRD-Mobile.md) (BRD driver-focused, `MBR-xxx`/`MBRL-xxx`) turunan BRD induk (`BR-xxx`/`BRL-xxx`), `FRD.md` (FRD-Mxx-xx), `MODULE-MAP-v2.md`, folder BE terkait.
Peta relasi + matriks traceability dua arah mobile ↔ desktop: [`RELASI-MOBILE-DESKTOP.md`](../RELASI-MOBILE-DESKTOP.md).
Setiap PRD/FRD layar menautkan ke BRD-Mobile dan ke dokumen desktop (`prd/PRD-Mxx`, `prd/frd/FRD-Mxx`), dan sebaliknya.
### Sumber Scope
Layar driver-facing resmi dari FRD (`[Driver]`) + slice mobile dari **seluruh 22 modul** (M01–M22),
dengan fungsi admin-only dibatasi read-only / out-of-scope.
### Hal yang Dilengkapi Sebelum Kickoff
Keputusan offline-sync strategy, prioritas Android vs iOS, provider tile/peta untuk driver, kebijakan izin kamera/lokasi.
