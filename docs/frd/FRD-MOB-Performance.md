---
tags: [FRD, Mobile, Driver, Dashboard]
category: Mobile
related: [[PRD-MOB-Performance]]
---

# FRD-MOB — Ringkasan Kinerja Saya (Performance Summary)

**Mirror**: FRD-M10-01 (Main Dashboard), FRD-M10-03 (KPI Overview), FRD-M10-07 (Driver Performance)

## FRD-MOB-PERF-01 KPI Pribadi
Kartu KPI driver: trip selesai, on-time %, jarak, konsumsi L/100km.
**AC**: Given driver membuka layar, When data dimuat, Then KPI tampil dengan skeleton loading lalu nilai aktual (mirror FRD-M10-03).

## FRD-MOB-PERF-02 Skeleton Loading Wajib
Memuat KPI memakai skeleton, bukan spinner.
**AC**: Given data sedang dimuat, When layar render, Then skeleton tampil sampai data siap (mirror FRD-M10-03).

## FRD-MOB-PERF-03 Tren 7 Hari
Grafik ringkas trip & on-time 7 hari terakhir.
**AC**: Given ada data 7 hari, When dibuka, Then grafik tren tampil.

## FRD-MOB-PERF-04 Filter Periode
Minggu ini / Bulan ini.
**AC**: Given periode diubah, When filter diterapkan, Then KPI dan tren ter-update sesuai periode.

## FRD-MOB-PERF-05 Batas Lingkup Mobile
Hanya data driver sendiri; dashboard armada & export = out-of-scope mobile.
**AC**: Given driver membuka layar, When data dimuat, Then hanya KPI miliknya yang tampil (mirror FRD-M01-06).

## Wording
- "Belum ada aktivitas pada periode ini."

---

## Terhubung ke Dokumen Desktop (Sistem)
> Mirror FRD desktop di bawah; layar mobile = slice driver-only.

| Dokumen Desktop | Tautan |
|---|---|
| FRD modul M10 | [prd/frd/FRD-M10-Dashboard-Reporting.md](../../../prd/frd/FRD-M10-Dashboard-Reporting.md) |
| PRD modul | [M10](../../../prd/PRD-M10-Dashboard-Reporting.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](../prd/PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
