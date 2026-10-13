---
tags: [FRD, Mobile, Driver, Tracking]
category: Mobile
related: [[PRD-MOB-Trip-Tracking]]
---

# FRD-MOB — Rute & Posisi Trip (Trip Tracking)

**Mirror**: FRD-M05-01 (Live Fleet Map), FRD-M05-02 (History Trace), FRD-M05-03 (Telemetry Feed), FRD-M05-07 (Data Quality)

## FRD-MOB-TRK-01 Peta Posisi Driver
Peta menampilkan posisi driver live + marker tujuan + garis rute trip aktif.
**AC**: Given trip aktif, When buka layar, Then peta menampilkan posisi driver + rute ke tujuan (mirror FRD-M05-01).

## FRD-MOB-TRK-02 Update Posisi Real-time
Marker bergerak via SignalR (< 2 detik) saat layar aktif.
**AC**: Given posisi berubah di server, When SignalR push, Then marker bergerak tanpa refresh manual.

## FRD-MOB-TRK-03 Telemetry Ringkas
Level BBM, kecepatan, status ignition dari `ITelemetrySource`.
**AC**: Given telemetry tersedia, When buka layar, Then nilai BBM/kecepatan/ignition tampil (mirror FRD-M05-03).

## FRD-MOB-TRK-04 Banner No-signal
Indikator GPS terputus > N menit.
**AC**: Given GPS hilang > N menit, When melewati ambang, Then banner no-signal tampil (mirror FRD-M05-07).

## FRD-MOB-TRK-05 Batas Lingkup Mobile
Hanya rute trip driver; live map armada penuh = out-of-scope.
**AC**: Given driver membuka layar, When data dimuat, Then hanya rute trip miliknya yang tampil (bukan armada penuh).

## Wording
- "Sinyal kendaraan terputus selama {n} menit."
- "Tidak ada perjalanan aktif."

---

## Terhubung ke Dokumen Desktop (Sistem)
> Mirror FRD desktop di bawah; layar mobile = slice driver-only.

| Dokumen Desktop | Tautan |
|---|---|
| FRD modul M05 | [prd/frd/FRD-M05-Tracking-Map.md](../../../prd/frd/FRD-M05-Tracking-Map.md) |
| PRD modul | [M05](../../../prd/PRD-M05-Tracking-Map.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](../prd/PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
