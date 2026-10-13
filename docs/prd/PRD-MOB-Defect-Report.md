---
tags: [PRD, Mobile, Driver, Maintenance]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Defect-Report]] [[PRD-MOB-DVIR]] [[PRD-MOB-Vehicle-Detail]]
---

# PRD-MOB — Laporan Kerusakan (Defect Report)

**[PRD-MOB-14]** - Laporan Kerusakan
**Modul Sumber**: M08 (Maintenance & Work Orders) · **Folder BE**: `MaintenanceWorkOrder`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Wave 2
**FRD**: FRD-M08-01 (WO List), FRD-M08-02 (WO Detail), FRD-M08-03 (Create/Edit WO), FRD-M08-04 (Maintenance Schedule)

---

## Tujuan
Driver melaporkan kerusakan kendaraan dari lapangan dalam 1 menit (foto + deskripsi) dan memantau status perbaikannya — pelengkap otomatis dari temuan DVIR.

## Komponen Layar
| Komponen | Isi |
|---|---|
| Form Kerusakan | Kendaraan, kategori, deskripsi, severity (Low/Medium/High/Out-of-service) |
| Foto Defect | Kamera (kompres) — wajib bila severity ≥ High |
| Status WO | Daftar work order kendaraan saya + status (open→in-progress→done→closed) |
| Jadwal Preventif | Perawatan terjadwal berikutnya untuk kendaraan saya |
| Riwayat | WO selesai kendaraan saya (read-only) |

## Spesifikasi Fungsional
- Laporan kerusakan offline-safe: simpan lokal, sync idempotent saat online (R-MOB-01).
- Severity **Out-of-service** → kendaraan ditandai tidak layak + trigger alur M17 (auto-block) dan notifikasi dispatcher.
- Temuan DVIR otomatis membuat WO (FRD-M17-07) — tampil di sini sebagai WO berstatus open.
- Driver hanya melihat WO kendaraan yang ditugaskan (ownership, FRD-M01-06).
- WO selesai bersifat immutable (CRC-01).

## Acceptance Criteria
- Given driver mengisi form kerusakan + foto, When submit, Then WO baru dibuat (FRD-M08-03).
- Given severity = Out-of-service, When submit, Then kendaraan ditandai tidak layak dan dispatcher diberi notifikasi.
- Given WO berubah status di server, When dibuka, Then status terbaru tampil tanpa refresh manual (FRD-M08-02).

## Wording (Microcopy)
- Overdue: "Jadwal perawatan preventif terlewat."
- Foto wajib: "Foto kerusakan wajib untuk tingkat High atau Out-of-service."

## Non-Fungsional
- Kompres foto sebelum upload (device kamera rendah, R-MOB-02).
- Berfungsi offline; antrian sinkron ditampilkan jelas.

## Dependency
M02 (kendaraan), M08 (WO), M17 (auto-WO dari DVIR), M06 (alert overdue).
