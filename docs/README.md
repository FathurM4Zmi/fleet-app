# Dokumentasi Mobile — GenZys FleetOps Driver App (`fleet-app`)

Dokumentasi aplikasi mobile driver (Flutter). Semua layar mobile ditarik dari modul
otoritatif `MODULE-MAP-v2.md` (M01–M22) dan selaras dengan `FRD.md` + folder BE.

> **Cakupan lengkap 22 modul.** Setiap modul M01–M22 punya slice mobile (driver-facing);
> modul yang murni admin (mis. M10 export, M11 config, M15 approval) tetap dibuatkan
> layarnya namun **dibatasi read-only / out-of-scope** sesuai kebutuhan mobile.

## Struktur
```
fleet-app/docs/
├── BRD-Mobile.md                 # BRD — SAMA dengan BRD induk (markdown)
├── RELASI-MOBILE-DESKTOP.md      # Peta relasi dua arah mobile ↔ desktop
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
- **PRD**: 24 (1 induk + 23 layar)
- **FRD**: 23 (per layar)
- **Layar mobile**: 23 (driver-facing, mencakup M01–M22)
- **Platform**: Flutter (Android prioritas, iOS target berikutnya)

## Layar → Modul Sumber → Folder BE
| # | Layar | Modul | Folder BE |
|---|---|---|---|
| 1 | Login Driver | M01 | `AccessOrganization` |
| 2 | Driver App Home | M03 | `DriverMaster` |
| 3 | Profil & Dokumen | M03+M09 | `DriverMaster`/`DocumentCompliance` |
| 4 | Driver Inbox | M04 | `AssignmentTrip` |
| 5 | Trip Execution | M04 | `AssignmentTrip` |
| 6 | DVIR Form | M17 | `DvirInspection` |
| 7 | POD Capture | M21 | `CustomerExperiencePOD` |
| 8 | Fuel Log | M07 | `FuelCost` |
| 9 | Notifikasi | M12 | `Notifications` |
| 10 | Coaching | M20 | `CoachingWorkforce` |
| 11 | Kendaraan Saya | M02 | `VehicleMaster` |
| 12 | Rute & Posisi Trip | M05 | `TrackingMap` |
| 13 | Peringatan Trip | M06 | `GeofenceAlert` |
| 14 | Laporan Kerusakan | M08 | `MaintenanceWorkOrder` |
| 15 | Ringkasan Kinerja Saya | M10 | `DashboardReporting` |
| 16 | Aktivitas Saya | M11 | `AuditAdministration` |
| 17 | DNA Kesehatan Saya | M13 | `HealthEngine` |
| 18 | Rute Disarankan | M14 | `RouteOptimizer` |
| 19 | Settlement & Pendapatan | M15 | `BillingCostCenter` |
| 20 | Kepatuhan & Sertifikasi | M16 | `SafetyCompliance` |
| 21 | Peristiwa Safety Saya | M18 | `SafetyEvents` |
| 22 | Aset & Equipment Trip | M19 | `AssetEquipment` |
| 23 | Kartu BBM & Pengeluaran | M22 | `FuelSpendMgmt` |

## Catatan
- Setiap modul M01–M22 punya slice mobile; layar admin murni dibatasi read-only / out-of-scope.
- `BRD-Mobile.md` = salinan markdown dari BRD induk `prd/BRD_...docx` — **satu BRD yang sama** untuk desktop & mobile (bukan dokumen turunan terpisah).
- **Saling terhubung (dua arah)**: setiap PRD/FRD mobile menautkan ke dokumen desktop (`prd/PRD-Mxx`, `prd/frd/FRD-Mxx`, `FRD.md`, `MODULE-MAP-v2.md`), dan setiap PRD/FRD desktop menaut balik ke layar mobile terkait. Peta lengkap: `RELASI-MOBILE-DESKTOP.md`.
- Offline-first wajib untuk DVIR, POD, Fuel Log, Defect Report, Insiden (R-MOB-01).
