---
tags: [Mobile, Driver, Relasi, Index, Traceability]
category: Mobile
related: [[README]] [[BRD-Mobile]] [[PRD-Mobile-Driver-App]] [[QUICK-REFERENCE]]
---

# Peta Relasi Mobile ↔ Desktop — GenZys FleetOps

Aplikasi mobile `fleet-app` = **driver-only** (persona R6 Driver, ala Gojek/Grab driver app).
Setiap layar adalah **slice driver** dari modul desktop; fungsi admin modul tersebut tetap di web.

> **Konvensi tautan**: dokumen mobile menautkan ke dokumen desktop (`../../../prd/...`), dan setiap
> PRD/FRD desktop menaut balik ke layar mobile terkait (`../fleet-app/docs/...`). Tautan relatif ini
> resolve pada layout monorepo (root `GenZysFleetOps/`). Catatan: `fleet-app/` adalah repo git terpisah.

**Rantai ketertelusuran (traceability chain):**

```
BRD induk (BR-xxx / BRL-xxx)
   └─ BRD-Mobile (MBR-xxx / MBRL-xxx)   ← BRD driver-focused
        └─ PRD-MOB (per layar)
             └─ FRD-MOB (per layar)  ⇄  FRD-Mxx desktop (mirror kode)
                  └─ Folder BE (per modul)
```

---

## Matriks Modul ↔ Layar ↔ Kebutuhan Mobile

| Modul Desktop | Nama Modul | Layar Mobile | MBR | PRD Mobile | FRD Mobile | FRD Desktop (mirror) | Folder BE |
|---|---|---|---|---|---|---|---|
| M01 | Auth/RBAC/Org | Login Driver | MBR-001, 026 | `PRD-MOB-Login-Driver.md` | `FRD-MOB-Login-Driver.md` | `FRD-M01-Auth-Access.md` | `AccessOrganization` |
| M02 | Vehicle Master | Kendaraan Saya | MBR-011 | `PRD-MOB-Vehicle-Detail.md` | `FRD-MOB-Vehicle-Detail.md` | `FRD-M02-Vehicle-Master.md` | `VehicleMaster` |
| M03 | Driver Management | Home, Profil & Dokumen | MBR-002, 003 | `PRD-MOB-Home.md`, `PRD-MOB-Profile.md` | `FRD-MOB-Home.md`, `FRD-MOB-Profile.md` | `FRD-M03-Driver-Management.md` | `DriverMaster` |
| M04 | Trip Assignment | Driver Inbox, Trip Execution | MBR-004, 005 | `PRD-MOB-Inbox.md`, `PRD-MOB-Trip-Execution.md` | `FRD-MOB-Inbox.md`, `FRD-MOB-Trip-Execution.md` | `FRD-M04-Trip-Assignment.md` | `AssignmentTrip` |
| M05 | Tracking/Telemetry | Rute & Posisi Trip | MBR-012 | `PRD-MOB-Trip-Tracking.md` | `FRD-MOB-Trip-Tracking.md` | `FRD-M05-Tracking-Map.md` | `TrackingMap` |
| M06 | Geofence/Alert | Peringatan Trip | MBR-013 | `PRD-MOB-Alerts.md` | `FRD-MOB-Alerts.md` | `FRD-M06-Geofence-Alert.md` | `GeofenceAlert` |
| M07 | Fuel & Cost | Fuel Log | MBR-008 | `PRD-MOB-Fuel-Log.md` | `FRD-MOB-Fuel-Log.md` | `FRD-M07-Fuel-Cost.md` | `FuelCost` |
| M08 | Maintenance/WO | Laporan Kerusakan | MBR-014 | `PRD-MOB-Defect-Report.md` | `FRD-MOB-Defect-Report.md` | `FRD-M08-Maintenance-WorkOrder.md` | `MaintenanceWorkOrder` |
| M09 | Document & Compliance | Profil & Dokumen | MBR-003 | `PRD-MOB-Profile.md` | `FRD-MOB-Profile.md` | `FRD-M09-Document-Compliance.md` | `DocumentCompliance` |
| M10 | Dashboard & Reporting | Ringkasan Kinerja Saya | MBR-015 | `PRD-MOB-Performance.md` | `FRD-MOB-Performance.md` | `FRD-M10-Dashboard-Reporting.md` | `DashboardReporting` |
| M11 | Settings & Audit | Aktivitas Saya | MBR-016 | `PRD-MOB-Activity-Log.md` | `FRD-MOB-Activity-Log.md` | `FRD-M11-Settings-Audit.md` | `AuditAdministration` |
| M12 | Notifications | Notifikasi | MBR-009, 030 | `PRD-MOB-Notifications.md` | `FRD-MOB-Notifications.md` | `FRD-M12-Notifications.md` | `Notifications` |
| M13 | Fleet DNA/Health | DNA Kesehatan Saya | MBR-017 | `PRD-MOB-DNA-Saya.md` | `FRD-MOB-DNA-Saya.md` | `FRD-M13-Fleet-DNA-Health.md` | `HealthEngine` |
| M14 | Route Optimization | Rute Disarankan | MBR-018 | `PRD-MOB-Route-Suggest.md` | `FRD-MOB-Route-Suggest.md` | `FRD-M14-Route-Optimization.md` | `RouteOptimizer` |
| M15 | Billing/Rate Card | Settlement & Pendapatan | MBR-019 | `PRD-MOB-Settlement.md` | `FRD-MOB-Settlement.md` | `FRD-M15-Billing-RateCard.md` | `BillingCostCenter` |
| M16 | Regulatory & Safety | Kepatuhan & Sertifikasi | MBR-020 | `PRD-MOB-Compliance.md` | `FRD-MOB-Compliance.md` | `FRD-M16-Regulatory-Safety.md` | `SafetyCompliance` |
| M17 | DVIR & Inspection | DVIR Form | MBR-006 | `PRD-MOB-DVIR.md` | `FRD-MOB-DVIR.md` | `FRD-M17-DVIR-Inspection.md` | `DvirInspection` |
| M18 | Safety Events | Peristiwa Safety Saya | MBR-021 | `PRD-MOB-Safety-Events.md` | `FRD-MOB-Safety-Events.md` | `FRD-M18-Safety-Events.md` | `SafetyEvents` |
| M19 | Asset & Equipment | Aset & Equipment Trip | MBR-022 | `PRD-MOB-Asset-Trip.md` | `FRD-MOB-Asset-Trip.md` | `FRD-M19-Asset-Equipment.md` | `AssetEquipment` |
| M20 | Driver Coaching | Coaching & Sertifikasi | MBR-010 | `PRD-MOB-Coaching.md` | `FRD-MOB-Coaching.md` | `FRD-M20-Driver-Coaching.md` | `CoachingWorkforce` |
| M21 | Customer Exp & POD | POD Capture | MBR-007 | `PRD-MOB-POD.md` | `FRD-MOB-POD.md` | `FRD-M21-Customer-POD.md` | `CustomerExperiencePOD` |
| M22 | Fuel & Spend | Kartu BBM & Pengeluaran | MBR-023 | `PRD-MOB-Fuel-Card.md` | `FRD-MOB-Fuel-Card.md` | `FRD-M22-Fuel-Spend.md` | `FuelSpendMgmt` |

## Kebutuhan Lintas Layar (Mobile)

| MBR | Kebutuhan | Berdampak ke Layar |
|---|---|---|
| MBR-024 | Offline-first & sync idempotent | DVIR, POD, Fuel Log, Defect, Insiden, Aktivitas Saya |
| MBR-025 | Ownership (data milik sendiri) | Semua layar |
| MBR-026 | Tanpa registrasi mandiri | Login, Profil |
| MBR-027 | Ergonomi satu tangan & aksesibilitas | Semua layar |
| MBR-028 | Keamanan perangkat (secure storage) | Semua layar |
| MBR-029 | Push realtime (SignalR) | Home, Inbox, Notifikasi, DNA, Tracking |
| MBR-030 | Push + deep-link | Notifikasi, Home, Inbox |

## Prinsip Keterhubungan

- **Satu arah data, dua arah dokumen**: data mengalir dari BE (modul desktop) ke mobile; dokumen saling menautkan.
- **Driver-only**: layar mobile hanya memuat kemampuan driver. Fungsi admin modul (config, approval, registry,
  dashboard armada, export) **tidak** direplikasi ke mobile.
- **Ownership**: semua layar dibatasi site+user scope (FRD-M01-06) — driver hanya data miliknya.
- **Kode acuan**: setiap dokumen mobile mencantumkan kode `FRD-Mxx-xx` / `BRL-xxx` dari desktop (`FRD.md`)
  serta `MBR-xxx` dari `BRD-Mobile.md`.

## Aturan Bisnis Mobile (Ringkas)

Aturan khas mobile `MBRL-xxx` (detail di [`BRD-Mobile.md`](BRD-Mobile.md) §9) yang **melampaui** aturan induk:
DVIR gagal → blokir trip (MBRL-005), POD immutable (MBRL-007), entri BBM wajib bukti & void-bukan-hapus (MBRL-008),
antrian offline idempotent (MBRL-009), resolve alert wajib alasan (MBRL-010), finansial read-only + masked (MBRL-011),
tanpa registrasi mandiri (MBRL-002), fungsi admin tidak ada di mobile (MBRL-014).

## Dokumen Terkait

- BRD induk (desktop/sistem): `prd/BRD_Fleet_Management_System_GenZys_v1.0_Corporate.docx`
- **BRD mobile (driver-focused)**: [`BRD-Mobile.md`](BRD-Mobile.md)
- PRD induk mobile: [`prd/PRD-Mobile-Driver-App.md`](prd/PRD-Mobile-Driver-App.md)
- FRD induk: [`FRD.md`](../../FRD.md) · Peta modul: [`MODULE-MAP-v2.md`](../../MODULE-MAP-v2.md)
- Quick reference: [`QUICK-REFERENCE.md`](QUICK-REFERENCE.md)
