# Dokumentasi Mobile — GenZys FleetOps Driver App (`fleet-app`)

Dokumentasi aplikasi mobile driver (Flutter). Semua layar mobile ditarik dari modul
otoritatif `MODULE-MAP-v2.md` (M01–M22) dan selaras dengan `FRD.md` + folder BE.

**Rantai dokumen:** BRD induk (`BR-xxx`/`BRL-xxx`) → **BRD-Mobile** (`MBR-xxx`/`MBRL-xxx`, driver-focused)
→ PRD-MOB per layar → FRD-MOB per layar (mirror `FRD-Mxx-xx` desktop) → folder BE.

> **Cakupan lengkap 22 modul.** Setiap modul M01–M22 punya slice mobile (driver-facing);
> modul yang murni admin (mis. M10 export, M11 config, M15 approval) tetap dibuatkan
> layarnya namun **dibatasi read-only / out-of-scope** sesuai kebutuhan mobile.

## Struktur
```
fleet-app/docs/
├── BRD-Mobile.md                 # BRD mobile driver-focused (MBR/MBRL) — turunan BRD induk
├── RELASI-MOBILE-DESKTOP.md      # Peta relasi + traceability MBR ↔ PRD/FRD ↔ desktop
├── QUICK-REFERENCE.md            # Ringkasan 23 layar + MBR
├── prd/
│   ├── PRD-Mobile-Driver-App.md  # PRD INDUK (screen inventory + prinsip)
│   ├── PRD-MOB-Login-Driver.md   # M01
│   ├── PRD-MOB-Home.md           # M03
│   ├── PRD-MOB-Profile.md        # M03 + M09
│   ├── PRD-MOB-Inbox.md          # M04
│   ├── PRD-MOB-Trip-Execution.md # M04
│   ├── PRD-MOB-DVIR.md           # M17
│   ├── PRD-MOB-POD.md            # M21
│   ├── PRD-MOB-Fuel-Log.md       # M07
│   ├── PRD-MOB-Notifications.md  # M12
│   ├── PRD-MOB-Coaching.md       # M20
│   ├── PRD-MOB-Vehicle-Detail.md # M02
│   ├── PRD-MOB-Trip-Tracking.md  # M05
│   ├── PRD-MOB-Alerts.md         # M06
│   ├── PRD-MOB-Defect-Report.md  # M08
│   ├── PRD-MOB-Performance.md    # M10
│   ├── PRD-MOB-Activity-Log.md   # M11
│   ├── PRD-MOB-DNA-Saya.md       # M13
│   ├── PRD-MOB-Route-Suggest.md  # M14
│   ├── PRD-MOB-Settlement.md     # M15
│   ├── PRD-MOB-Compliance.md     # M16
│   ├── PRD-MOB-Safety-Events.md  # M18
│   ├── PRD-MOB-Asset-Trip.md     # M19
│   └── PRD-MOB-Fuel-Card.md      # M22
└── frd/
    └── FRD-MOB-<nama>.md         # 23 file, satu per layar
```

## Statistik
- **BRD**: 1 (BRD-Mobile, driver-focused) + BRD induk (`prd/BRD_...docx`)
- **Kebutuhan bisnis mobile**: 30 `MBR-xxx` + 16 `MBRL-xxx` (aturan mobile)
- **PRD**: 24 (1 induk + 23 layar)
- **FRD**: 23 (per layar)
- **Layar mobile**: 23 (driver-facing, mencakup M01–M22)
- **Platform**: Flutter (Android prioritas, iOS target berikutnya)

## Layar → Modul Sumber → Kebutuhan → Folder BE
| # | Layar | Modul | MBR | Folder BE |
|---|---|---|---|---|
| 1 | Login Driver | M01 | MBR-001, 026 | `AccessOrganization` |
| 2 | Driver App Home | M03 | MBR-002 | `DriverMaster` |
| 3 | Profil & Dokumen | M03+M09 | MBR-003 | `DriverMaster`/`DocumentCompliance` |
| 4 | Driver Inbox | M04 | MBR-004 | `AssignmentTrip` |
| 5 | Trip Execution | M04 | MBR-005 | `AssignmentTrip` |
| 6 | DVIR Form | M17 | MBR-006 | `DvirInspection` |
| 7 | POD Capture | M21 | MBR-007 | `CustomerExperiencePOD` |
| 8 | Fuel Log | M07 | MBR-008 | `FuelCost` |
| 9 | Notifikasi | M12 | MBR-009, 030 | `Notifications` |
| 10 | Coaching | M20 | MBR-010 | `CoachingWorkforce` |
| 11 | Kendaraan Saya | M02 | MBR-011 | `VehicleMaster` |
| 12 | Rute & Posisi Trip | M05 | MBR-012 | `TrackingMap` |
| 13 | Peringatan Trip | M06 | MBR-013 | `GeofenceAlert` |
| 14 | Laporan Kerusakan | M08 | MBR-014 | `MaintenanceWorkOrder` |
| 15 | Ringkasan Kinerja Saya | M10 | MBR-015 | `DashboardReporting` |
| 16 | Aktivitas Saya | M11 | MBR-016 | `AuditAdministration` |
| 17 | DNA Kesehatan Saya | M13 | MBR-017 | `HealthEngine` |
| 18 | Rute Disarankan | M14 | MBR-018 | `RouteOptimizer` |
| 19 | Settlement & Pendapatan | M15 | MBR-019 | `BillingCostCenter` |
| 20 | Kepatuhan & Sertifikasi | M16 | MBR-020 | `SafetyCompliance` |
| 21 | Peristiwa Safety Saya | M18 | MBR-021 | `SafetyEvents` |
| 22 | Aset & Equipment Trip | M19 | MBR-022 | `AssetEquipment` |
| 23 | Kartu BBM & Pengeluaran | M22 | MBR-023 | `FuelSpendMgmt` |

## Catatan
- Setiap modul M01–M22 punya slice mobile; layar admin murni dibatasi read-only / out-of-scope.
- `BRD-Mobile.md` = **BRD mobile driver-focused** (turunan, bukan salinan) dari BRD induk `prd/BRD_...docx` — menetapkan kebutuhan `MBR-xxx` + aturan `MBRL-xxx` yang memetakan ke `BR-xxx`/`BRL-xxx` induk.
- **Saling terhubung (dua arah)**: setiap PRD/FRD mobile menautkan ke dokumen desktop (`prd/PRD-Mxx`, `prd/frd/FRD-Mxx`, `FRD.md`, `MODULE-MAP-v2.md`) + `BRD-Mobile.md`, dan setiap PRD/FRD desktop menaut balik ke layar mobile terkait. Peta + matriks traceability lengkap: `RELASI-MOBILE-DESKTOP.md`.
- Offline-first wajib untuk DVIR, POD, Fuel Log, Defect Report, Insiden (MBR-024, MBRL-009).
- **Tanpa registrasi mandiri**: akun & perangkat disediakan admin/vendor (GenZys) — driver hanya login (PIN/OTP/QR). Tidak ada layar sign-up di mobile (MBR-026, MBRL-002).
