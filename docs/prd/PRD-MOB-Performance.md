---
tags: [PRD, Mobile, Driver, Dashboard]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Performance]] [[PRD-MOB-Home]]
---

# PRD-MOB — Ringkasan Kinerja Saya (Performance Summary)

**[PRD-MOB-15]** - Ringkasan Kinerja Saya
**Modul Sumber**: M10 (Dashboard & Reporting) · **Folder BE**: `DashboardReporting`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Wave 3
**FRD**: FRD-M10-01 (Main Dashboard), FRD-M10-03 (KPI Overview), FRD-M10-07 (Driver Performance)

---

## Tujuan
Driver melihat ringkasan performanya sendiri (trip selesai, on-time, konsumsi BBM, skor) — versi mobile ringkas dari dashboard, tanpa akses ke data armada penuh.

## Komponen Layar
| Komponen | Isi |
|---|---|
| KPI Cards | Trip selesai, on-time %, jarak, konsumsi L/100km (periode ini) |
| Tren Mini | Grafik ringkas 7 hari (trip & on-time) |
| Skor Kinerja | Skor gabungan driver (dari M13/M18) |
| Filter Periode | Minggu ini / Bulan ini |

## Spesifikasi Fungsional
- Data **hanya milik driver** (ownership, FRD-M01-06) — bukan dashboard agregat armada (out-of-scope mobile).
- **Skeleton loading wajib** (bukan spinner) saat memuat KPI — FRD-M10-03.
- Target muat ≤ 3 detik (BRD 11.1).
- Export/unduh laporan tetap di web (mobile hanya lihat ringkas) — FRD-M10-11 out-of-scope mobile.
- Pull-to-refresh untuk memperbarui periode.

## Acceptance Criteria
- Given driver membuka layar, When data dimuat, Then KPI tampil dengan skeleton loading lalu nilai aktual (FRD-M10-03).
- Given periode diubah, When filter diterapkan, Then KPI dan tren ter-update sesuai periode.
- Given driver tidak punya trip pada periode, When dibuka, Then tampil empty state, bukan angka 0 menyesatkan.

## Wording (Microcopy)
- Belum ada data: "Belum ada aktivitas pada periode ini."

## Non-Fungsional
- Muat ≤ 3 detik (BRD 11.1); skeleton loading wajib.
- Tampilkan angka cache terakhir saat offline.

## Dependency
M04 (trip), M07 (konsumsi), M10 (agregasi), M13/M18 (skor).

---

## Terhubung ke Dokumen Desktop (Sistem)
> Layar ini adalah **slice driver-only** dari modul desktop di bawah. Fungsi admin modul tersebut tidak ada di mobile.

| Dokumen Desktop | Tautan |
|---|---|
| PRD modul M10 | [prd/PRD-M10-Dashboard-Reporting.md](../../../prd/PRD-M10-Dashboard-Reporting.md) |
| FRD modul M10 | [prd/frd/FRD-M10-Dashboard-Reporting.md](../../../prd/frd/FRD-M10-Dashboard-Reporting.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| Peta modul | [MODULE-MAP-v2.md](../../../MODULE-MAP-v2.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
