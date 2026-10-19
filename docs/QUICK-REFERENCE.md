---
tags: [QuickRef, Mobile, Driver, BRD]
category: Mobile
related: [[README]] [[BRD-Mobile]] [[PRD-Mobile-Driver-App]] [[RELASI-MOBILE-DESKTOP]]
---

# GenZys FleetOps Mobile — Quick Reference

App: `fleet-app` (React Native / Expo SDK 57) · Persona: **R6 Driver** · 23 layar driver-facing (cakupan M01–M22).
Detail: `fleet-app/docs/` (BRD-Mobile + PRD/FRD per layar). Peta relasi + traceability dua arah mobile↔desktop: `RELASI-MOBILE-DESKTOP.md`.
Rantai dokumen: **BRD induk** (`BR-xxx`/`BRL-xxx`) → **BRD-Mobile** (`MBR-xxx`/`MBRL-xxx`) → PRD-MOB → FRD-MOB (mirror `FRD-Mxx-xx` desktop) → folder BE.

| # | Layar | Modul | MBR | Folder BE | 1-liner |
|---|---|---|---|---|---|
| 1 | Login Driver | M01 | MBR-001, 026 | `AccessOrganization` | PIN/OTP/QR, auto-login, guard SIM, tanpa registrasi |
| 2 | Driver App Home | M03 | MBR-002 | `DriverMaster` | Status, DNA ring, next trip, accept/decline |
| 3 | Profil & Dokumen | M03+M09 | MBR-003 | `DriverMaster`/`DocumentCompliance` | SIM, dokumen, expiry badge |
| 4 | Driver Inbox | M04 | MBR-004 | `AssignmentTrip` | Daftar trip, filter status, push realtime |
| 5 | Trip Execution | M04 | MBR-005 | `AssignmentTrip` | Start/arrive/complete, rute, lokasi berkala |
| 6 | DVIR Form | M17 | MBR-006 | `DvirInspection` | Checklist + foto defect, offline-safe, fail→block |
| 7 | POD Capture | M21 | MBR-007 | `CustomerExperiencePOD` | Foto+TTD+scan+geo, immutable, offline |
| 8 | Fuel Log | M07 | MBR-008 | `FuelCost` | Entri BBM (volume>0), odometer, foto struk |
| 9 | Notifikasi | M12 | MBR-009, 030 | `Notifications` | Inbox, push Critical, deep-link, preferensi |
| 10 | Coaching | M20 | MBR-010 | `CoachingWorkforce` | Coaching plan, milestone, skor safety, sertifikasi |
| 11 | Kendaraan Saya | M02 | MBR-011 | `VehicleMaster` | Detail unit ditugaskan, DNA ring, dokumen, lapor rusak |
| 12 | Rute & Posisi Trip | M05 | MBR-012 | `TrackingMap` | Peta posisi sendiri + rute + ETA, telemetry ringkas |
| 13 | Peringatan Trip | M06 | MBR-013 | `GeofenceAlert` | Feed alert trip, severity, resolve wajib alasan |
| 14 | Laporan Kerusakan | M08 | MBR-014 | `MaintenanceWorkOrder` | Form defect + foto, auto-WO, status WO |
| 15 | Ringkasan Kinerja | M10 | MBR-015 | `DashboardReporting` | KPI pribadi, tren 7 hari, skeleton loading |
| 16 | Aktivitas Saya | M11 | MBR-016 | `AuditAdministration` | Jejak aksi pribadi, read-only, status sinkron |
| 17 | DNA Kesehatan Saya | M13 | MBR-017 | `HealthEngine` | Skor komposit, breakdown sub-komponen, tren |
| 18 | Rute Disarankan | M14 | MBR-018 | `RouteOptimizer` | Multi-opsi rute + ETA, konfirmasi sebelum simpan |
| 19 | Settlement | M15 | MBR-019 | `BillingCostCenter` | Rincian pendapatan per periode, read-only (SoD) |
| 20 | Kepatuhan & Sertifikasi | M16 | MBR-020 | `SafetyCompliance` | Status SIM/sertifikat, lapor insiden (immutable) |
| 21 | Peristiwa Safety | M18 | MBR-021 | `SafetyEvents` | Event perilaku (telemetry), skor safety, bukti |
| 22 | Aset & Equipment Trip | M19 | MBR-022 | `AssetEquipment` | Aset/trailer trip, reefer suhu, anti-theft |
| 23 | Kartu BBM & Pengeluaran | M22 | MBR-023 | `FuelSpendMgmt` | Kartu (masked), limit, transaksi, fraud flag |

## Kebutuhan Lintas Layar
MBR-024 offline-first · MBR-025 ownership · MBR-026 tanpa registrasi mandiri · MBR-027 satu tangan/aksesibilitas · MBR-028 keamanan device · MBR-029 push realtime · MBR-030 push + deep-link.

## Prinsip Mobile
- **Offline-first**: DVIR, POD, Fuel Log, Defect Report, Insiden wajib offline-safe (antrian sync idempotent — MBR-024, MBRL-009).
- **Satu tangan**: target sentuh ≥48dp, bottom nav, minim teks.
- **Mobile-friendly** (BRD Bab 11): kontras, font besar, tanpa hover.
- **Aman**: JWT secure storage, tanpa kredensial cleartext, nomor kartu masked (MBR-028).
- **Read-only untuk modul admin**: settlement, aktivitas tidak dapat diubah dari mobile (SoD — MBRL-011, MBRL-014).
- **Tanpa registrasi mandiri**: akun & device disediakan admin/vendor (MBR-026, MBRL-002).

## Navigasi
Bottom nav: **Home · Tasks(Inbox) · [+Aksi kontekstual] · Notifikasi · Profil**.
Layar M02/M05/M06/M08/M13/M14/M18/M19/M22 diakses kontekstual dari Home/Trip/Profil.
DriverLayout (mobile) ≠ AdminLayout (desktop web).

## Integrasi
- REST API BE (26 controller sudah ada).
- SignalR untuk push realtime (tugas, alert, posisi, status).
- Ownership: driver hanya data miliknya (site+user scope, FRD-M01-06 / MBRL-001).

## Out-of-Scope Mobile
Fungsi **admin-only** dari modul yang sama: konfigurasi alert/behavior rules (M06/M18),
registry & utilisasi aset (M19), rate card/approval settlement (M15), audit sistem & security
config (M11), dashboard armada penuh + export laporan (M10), route optimizer sisi dispatcher (M14),
live map armada penuh, video dashcam hosting.

## Dokumen
- BRD mobile: [`BRD-Mobile.md`](BRD-Mobile.md) · BRD induk: `prd/BRD_...docx`
- PRD induk: [`prd/PRD-Mobile-Driver-App.md`](prd/PRD-Mobile-Driver-App.md)
- Peta + traceability: [`RELASI-MOBILE-DESKTOP.md`](RELASI-MOBILE-DESKTOP.md)
