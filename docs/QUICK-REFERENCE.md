---
tags: [QuickRef, Mobile, Driver]
category: Mobile
related: [[README]] [[PRD-Mobile-Driver-App]]
---

# GenZys FleetOps Mobile — Quick Reference

App: `fleet-app` (Flutter) · Persona: **R6 Driver** · 23 layar driver-facing (cakupan M01–M22).
Detail: `fleet-app/docs/` (BRD-Mobile + PRD/FRD per layar).

| # | Layar | Modul | Folder BE | 1-liner |
|---|---|---|---|---|
| 1 | Login Driver | M01 | `AccessOrganization` | PIN/OTP/QR, auto-login, guard SIM |
| 2 | Driver App Home | M03 | `DriverMaster` | Status, DNA ring, next trip, accept/decline |
| 3 | Profil & Dokumen | M03+M09 | `DriverMaster`/`DocumentCompliance` | SIM, dokumen, expiry badge |
| 4 | Driver Inbox | M04 | `AssignmentTrip` | Daftar trip, filter status, push realtime |
| 5 | Trip Execution | M04 | `AssignmentTrip` | Start/arrive/complete, rute, lokasi berkala |
| 6 | DVIR Form | M17 | `DvirInspection` | Checklist + foto defect, offline-safe, fail→block |
| 7 | POD Capture | M21 | `CustomerExperiencePOD` | Foto+TTD+scan+geo, immutable, offline |
| 8 | Fuel Log | M07 | `FuelCost` | Entri BBM (volume>0), odometer, foto struk |
| 9 | Notifikasi | M12 | `Notifications` | Inbox, push Critical, deep-link, preferensi |
| 10 | Coaching | M20 | `CoachingWorkforce` | Coaching plan, milestone, skor safety, sertifikasi |
| 11 | Kendaraan Saya | M02 | `VehicleMaster` | Detail unit ditugaskan, DNA ring, dokumen, lapor rusak |
| 12 | Rute & Posisi Trip | M05 | `TrackingMap` | Peta posisi sendiri + rute + ETA, telemetry ringkas |
| 13 | Peringatan Trip | M06 | `GeofenceAlert` | Feed alert trip, severity, resolve wajib alasan |
| 14 | Laporan Kerusakan | M08 | `MaintenanceWorkOrder` | Form defect + foto, auto-WO, status WO |
| 15 | Ringkasan Kinerja | M10 | `DashboardReporting` | KPI pribadi, tren 7 hari, skeleton loading |
| 16 | Aktivitas Saya | M11 | `AuditAdministration` | Jejak aksi pribadi, read-only, status sinkron |
| 17 | DNA Kesehatan Saya | M13 | `HealthEngine` | Skor komposit, breakdown sub-komponen, tren |
| 18 | Rute Disarankan | M14 | `RouteOptimizer` | Multi-opsi rute + ETA, konfirmasi sebelum simpan |
| 19 | Settlement | M15 | `BillingCostCenter` | Rincian pendapatan per periode, read-only (SoD) |
| 20 | Kepatuhan & Sertifikasi | M16 | `SafetyCompliance` | Status SIM/sertifikat, lapor insiden (immutable) |
| 21 | Peristiwa Safety | M18 | `SafetyEvents` | Event perilaku (telemetry), skor safety, bukti |
| 22 | Aset & Equipment Trip | M19 | `AssetEquipment` | Aset/trailer trip, reefer suhu, anti-theft |
| 23 | Kartu BBM & Pengeluaran | M22 | `FuelSpendMgmt` | Kartu (masked), limit, transaksi, fraud flag |

## Prinsip Mobile
- **Offline-first**: DVIR, POD, Fuel Log, Defect Report, Insiden wajib offline-safe (antrian sync idempotent).
- **Satu tangan**: target sentuh ≥48dp, bottom nav, minim teks.
- **Mobile-friendly** (BRD Bab 11): kontras, font besar, tanpa hover.
- **Aman**: JWT secure storage, tanpa kredensial cleartext, nomor kartu masked.
- **Read-only untuk modul admin**: settlement, aktivitas, settlement/rate card tidak dapat diubah dari mobile (SoD).

## Navigasi
Bottom nav: **Home · Tasks(Inbox) · [+Aksi kontekstual] · Notifikasi · Profil**.
Layar M02/M05/M06/M08/M13/M14/M18/M19/M22 diakses kontekstual dari Home/Trip/Profil.
DriverLayout (mobile) ≠ AdminLayout (desktop web).

## Integrasi
- REST API BE (26 controller sudah ada).
- SignalR untuk push realtime (tugas, alert, posisi, status).
- Ownership: driver hanya data miliknya (site+user scope, FRD-M01-06).

## Out-of-Scope Mobile
Fungsi **admin-only** dari modul yang sama: konfigurasi alert/behavior rules (M06/M18),
registry & utilisasi aset (M19), rate card/approval settlement (M15), audit sistem & security
config (M11), dashboard armada penuh + export laporan (M10), route optimizer sisi dispatcher (M14),
live map armada penuh, video dashcam hosting.
