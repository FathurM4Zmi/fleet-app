---
tags: [Mobile, Driver, Relasi, Index]
category: Mobile
related: [[README]] [[PRD-Mobile-Driver-App]] [[QUICK-REFERENCE]]
---

# Peta Relasi Mobile ↔ Desktop — GenZys FleetOps

Aplikasi mobile `fleet-app` = **driver-only** (persona R6 Driver, ala Gojek/Grab driver app).
Setiap layar adalah **slice driver** dari modul desktop; fungsi admin modul tersebut tetap di web.

> **Konvensi tautan**: dokumen mobile menautkan ke dokumen desktop (`../../../prd/...`), dan setiap
> PRD/FRD desktop menaut balik ke layar mobile terkait (`../fleet-app/docs/...`). Tautan relatif ini
> resolve pada layout monorepo (root `GenZysFleetOps/`). Catatan: `fleet-app/` adalah repo git terpisah.

## Matriks Modul ↔ Layar Mobile
| Modul Desktop | Nama Modul | Layar Mobile | PRD Mobile | FRD Mobile | Folder BE |
|---|---|---|---|---|---|
| M01 | Auth/RBAC/Org | Login Driver | `PRD-MOB-Login-Driver.md` | `FRD-MOB-Login-Driver.md` | `AccessOrganization` |
| M02 | Vehicle Master | Kendaraan Saya | `PRD-MOB-Vehicle-Detail.md` | `FRD-MOB-Vehicle-Detail.md` | `VehicleMaster` |
| M03 | Driver Management | Home, Profil & Dokumen | `PRD-MOB-Home.md`, `PRD-MOB-Profile.md` | `FRD-MOB-Home.md`, `FRD-MOB-Profile.md` | `DriverMaster` |
| M04 | Trip Assignment | Driver Inbox, Trip Execution | `PRD-MOB-Inbox.md`, `PRD-MOB-Trip-Execution.md` | `FRD-MOB-Inbox.md`, `FRD-MOB-Trip-Execution.md` | `AssignmentTrip` |
| M05 | Tracking/Telemetry | Rute & Posisi Trip | `PRD-MOB-Trip-Tracking.md` | `FRD-MOB-Trip-Tracking.md` | `TrackingMap` |
| M06 | Geofence/Alert | Peringatan Trip | `PRD-MOB-Alerts.md` | `FRD-MOB-Alerts.md` | `GeofenceAlert` |
| M07 | Fuel & Cost | Fuel Log | `PRD-MOB-Fuel-Log.md` | `FRD-MOB-Fuel-Log.md` | `FuelCost` |
| M08 | Maintenance/WO | Laporan Kerusakan | `PRD-MOB-Defect-Report.md` | `FRD-MOB-Defect-Report.md` | `MaintenanceWorkOrder` |
| M09 | Document & Compliance | Profil & Dokumen | `PRD-MOB-Profile.md` | `FRD-MOB-Profile.md` | `DocumentCompliance` |
| M10 | Dashboard & Reporting | Ringkasan Kinerja Saya | `PRD-MOB-Performance.md` | `FRD-MOB-Performance.md` | `DashboardReporting` |
| M11 | Settings & Audit | Aktivitas Saya | `PRD-MOB-Activity-Log.md` | `FRD-MOB-Activity-Log.md` | `AuditAdministration` |
| M12 | Notifications | Notifikasi | `PRD-MOB-Notifications.md` | `FRD-MOB-Notifications.md` | `Notifications` |
| M13 | Fleet DNA/Health | DNA Kesehatan Saya | `PRD-MOB-DNA-Saya.md` | `FRD-MOB-DNA-Saya.md` | `HealthEngine` |
| M14 | Route Optimization | Rute Disarankan | `PRD-MOB-Route-Suggest.md` | `FRD-MOB-Route-Suggest.md` | `RouteOptimizer` |
| M15 | Billing/Rate Card | Settlement & Pendapatan | `PRD-MOB-Settlement.md` | `FRD-MOB-Settlement.md` | `BillingCostCenter` |
| M16 | Regulatory & Safety | Kepatuhan & Sertifikasi | `PRD-MOB-Compliance.md` | `FRD-MOB-Compliance.md` | `SafetyCompliance` |
| M17 | DVIR & Inspection | DVIR Form | `PRD-MOB-DVIR.md` | `FRD-MOB-DVIR.md` | `DvirInspection` |
| M18 | Safety Events | Peristiwa Safety Saya | `PRD-MOB-Safety-Events.md` | `FRD-MOB-Safety-Events.md` | `SafetyEvents` |
| M19 | Asset & Equipment | Aset & Equipment Trip | `PRD-MOB-Asset-Trip.md` | `FRD-MOB-Asset-Trip.md` | `AssetEquipment` |
| M20 | Driver Coaching | Coaching & Sertifikasi | `PRD-MOB-Coaching.md` | `FRD-MOB-Coaching.md` | `CoachingWorkforce` |
| M21 | Customer Exp & POD | POD Capture | `PRD-MOB-POD.md` | `FRD-MOB-POD.md` | `CustomerExperiencePOD` |
| M22 | Fuel & Spend | Kartu BBM & Pengeluaran | `PRD-MOB-Fuel-Card.md` | `FRD-MOB-Fuel-Card.md` | `FuelSpendMgmt` |

## Prinsip Keterhubungan
- **Satu arah data, dua arah dokumen**: data mengalir dari BE (modul desktop) ke mobile; dokumen saling menautkan.
- **Driver-only**: layar mobile hanya memuat kemampuan driver. Fungsi admin modul (config, approval, registry,
  dashboard armada, export) **tidak** direplikasi ke mobile.
- **Ownership**: semua layar dibatasi site+user scope (FRD-M01-06) — driver hanya data miliknya.
- **Kode acuan**: setiap dokumen mobile mencantumkan kode `FRD-Mxx-xx` / `BRL-xxx` dari desktop (`FRD.md`).

## Dokumen Terkait
- BRD: `BRD-Mobile.md` (= salinan BRD induk `prd/BRD_...docx`, satu BRD untuk desktop & mobile)
- PRD induk mobile: `prd/PRD-Mobile-Driver-App.md`
- FRD induk: `FRD.md` · Peta modul: `MODULE-MAP-v2.md`
