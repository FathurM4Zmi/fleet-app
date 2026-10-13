---
tags: [FRD, Mobile, Driver, Maintenance]
category: Mobile
related: [[PRD-MOB-Defect-Report]]
---

# FRD-MOB — Laporan Kerusakan (Defect Report)

**Mirror**: FRD-M08-01 (WO List), FRD-M08-02 (WO Detail), FRD-M08-03 (Create/Edit WO), FRD-M08-04 (Maintenance Schedule), FRD-M17-07 (Defect → WO)

## FRD-MOB-DEF-01 Form Kerusakan
Kendaraan, kategori, deskripsi, severity (Low/Medium/High/Out-of-service), foto.
**AC**: Given driver mengisi form + foto, When submit, Then WO baru dibuat (mirror FRD-M08-03).

## FRD-MOB-DEF-02 Out-of-service Auto-block
Severity Out-of-service → kendaraan ditandai tidak layak + notifikasi dispatcher.
**AC**: Given severity=Out-of-service, When submit, Then kendaraan ditandai tidak layak dan dispatcher diberi notifikasi.

## FRD-MOB-DEF-03 Foto Wajib High+
Foto wajib untuk severity ≥ High.
**AC**: Given severity=High dan foto kosong, When submit, Then ditolak dengan pesan foto wajib.

## FRD-MOB-DEF-04 Auto-WO dari DVIR
Temuan DVIR otomatis tampil sebagai WO open di layar ini.
**AC**: Given DVIR menemukan defect, When dibuka Defect Report, Then WO terkait tampil berstatus open (mirror FRD-M17-07).

## FRD-MOB-DEF-05 Status & Riwayat WO
Daftar WO kendaraan driver + status; riwayat immutable.
**AC**: Given WO berubah status di server, When dibuka, Then status terbaru tampil tanpa refresh manual (mirror FRD-M08-02).

## FRD-MOB-DEF-06 Offline-safe Submit
Submit kerusakan dapat dilakukan tanpa sinyal, sync idempotent.
**AC**: Given offline, When driver submit, Then laporan tersimpan lokal dan terkirim saat online (mirror R-MOB-01).

## Wording
- "Jadwal perawatan preventif terlewat."
- "Foto kerusakan wajib untuk tingkat High atau Out-of-service."
