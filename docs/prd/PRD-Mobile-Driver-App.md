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
| 11 | Kendaraan Saya | [[PRD-MOB-Vehicle-Detail]] | [[FRD-MOB-Vehicle-Detail]] | M02 | `VehicleMaster` |
| 12 | Rute & Posisi Trip | [[PRD-MOB-Trip-Tracking]] | [[FRD-MOB-Trip-Tracking]] | M05 | `TrackingMap` |
| 13 | Peringatan Trip | [[PRD-MOB-Alerts]] | [[FRD-MOB-Alerts]] | M06 | `GeofenceAlert` |
| 14 | Laporan Kerusakan | [[PRD-MOB-Defect-Report]] | [[FRD-MOB-Defect-Report]] | M08 | `MaintenanceWorkOrder` |
| 15 | Ringkasan Kinerja Saya | [[PRD-MOB-Performance]] | [[FRD-MOB-Performance]] | M10 | `DashboardReporting` |
| 16 | Aktivitas Saya | [[PRD-MOB-Activity-Log]] | [[FRD-MOB-Activity-Log]] | M11 | `AuditAdministration` |
| 17 | DNA Kesehatan Saya | [[PRD-MOB-DNA-Saya]] | [[FRD-MOB-DNA-Saya]] | M13 | `HealthEngine` |
| 18 | Rute Disarankan | [[PRD-MOB-Route-Suggest]] | [[FRD-MOB-Route-Suggest]] | M14 | `RouteOptimizer` |
| 19 | Settlement & Pendapatan Saya | [[PRD-MOB-Settlement]] | [[FRD-MOB-Settlement]] | M15 | `BillingCostCenter` |
| 20 | Kepatuhan & Sertifikasi Saya | [[PRD-MOB-Compliance]] | [[FRD-MOB-Compliance]] | M16 | `SafetyCompliance` |
| 21 | Peristiwa Safety Saya | [[PRD-MOB-Safety-Events]] | [[FRD-MOB-Safety-Events]] | M18 | `SafetyEvents` |
| 22 | Aset & Equipment Trip | [[PRD-MOB-Asset-Trip]] | [[FRD-MOB-Asset-Trip]] | M19 | `AssetEquipment` |
| 23 | Kartu BBM & Pengeluaran Saya | [[PRD-MOB-Fuel-Card]] | [[FRD-MOB-Fuel-Card]] | M22 | `FuelSpendMgmt` |

**Total: 23 layar mobile (cakupan M01–M22).**

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
Semua modul M01–M22 punya slice mobile, tetapi **fungsi admin-only** dari modul tersebut
tidak masuk mobile: konfigurasi alert/behavior rules (M06/M18), registry & utilisasi aset (M19),
rate card/approval settlement (M15), audit sistem & security config (M11), dashboard armada
penuh + export laporan (M10), route optimizer sisi dispatcher (M14), live map armada penuh,
video dashcam hosting. Layar admin murni bersifat **read-only** di mobile (mis. Settlement,
Aktivitas Saya).

---

## Catatan Penutup
### Acuan Dokumen
`BRD-Mobile.md` (= BRD induk), `FRD.md` (FRD-Mxx-xx), `MODULE-MAP-v2.md`, folder BE terkait.
Peta relasi dua arah mobile ↔ desktop: [`RELASI-MOBILE-DESKTOP.md`](../RELASI-MOBILE-DESKTOP.md).
Setiap PRD/FRD layar menautkan ke dokumen desktop (`prd/PRD-Mxx`, `prd/frd/FRD-Mxx`), dan sebaliknya.
### Sumber Scope
Layar driver-facing resmi dari FRD (`[Driver]`) + slice mobile dari **seluruh 22 modul** (M01–M22),
dengan fungsi admin-only dibatasi read-only / out-of-scope.
### Hal yang Dilengkapi Sebelum Kickoff
Keputusan offline-sync strategy, prioritas Android vs iOS, provider tile/peta untuk driver, kebijakan izin kamera/lokasi.
