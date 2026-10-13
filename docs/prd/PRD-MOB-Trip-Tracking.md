---
tags: [PRD, Mobile, Driver, Tracking]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Trip-Tracking]] [[PRD-MOB-Trip-Execution]]
---

# PRD-MOB — Rute & Posisi Trip (Trip Tracking)

**[PRD-MOB-12]** - Rute & Posisi Trip
**Modul Sumber**: M05 (Tracking, Telemetry & Live Map) · **Folder BE**: `TrackingMap`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Wave 2
**FRD**: FRD-M05-01 (Live Fleet Map), FRD-M05-02 (History Trace), FRD-M05-03 (Telemetry Feed)

---

## Tujuan
Driver melihat **posisi dirinya sendiri** di peta, rute menuju tujuan, dan ETA — versi terbatas dari live map armada (hanya trip miliknya, bukan armada penuh).

## Komponen Layar
| Komponen | Isi |
|---|---|
| Peta | Posisi driver live + marker tujuan + garis rute |
| ETA Bar | Estimasi tiba + jarak sisa |
| Telemetry Ringkas | Level BBM, kecepatan, status ignition (dari `ITelemetrySource`) |
| Tombol Lokasi | Recenter ke posisi driver |
| Status Sinyal | Indikator kualitas GPS/no-signal (OD-03) |

## Spesifikasi Fungsional
- Peta menampilkan **hanya** rute trip aktif driver (bukan live map armada penuh — out-of-scope mobile).
- Update posisi via SignalR (< 2 detik) saat layar aktif; interval sampling hemat baterai saat background.
- Telemetry bersumber dari `ITelemetrySource` (BRL-038) — swap simulator → tracker nyata tanpa ubah layar.
- Saat sinyal terputus > N menit, tampilkan banner no-signal (FRD-M05-07).
- Playback rute (History Trace) hanya untuk trip yang sudah selesai.

## Acceptance Criteria
- Given trip aktif, When buka layar, Then peta menampilkan posisi driver + rute ke tujuan (FRD-M05-01).
- Given posisi berubah di server, When SignalR push, Then marker bergerak tanpa refresh manual.
- Given GPS hilang > N menit, When melewati ambang, Then banner no-signal tampil (FRD-M05-07).

## Wording (Microcopy)
- No-signal: "Sinyal kendaraan terputus selama {n} menit."
- Tanpa trip aktif: "Tidak ada perjalanan aktif."

## Non-Fungsional
- Hemat baterai: sampling posisi wajar, hentikan saat layar tidak aktif.
- Peta ringan (tile ter-cache) agar tetap terbaca saat sinyal lemah.

## Dependency
M04 (trip aktif), M05 (posisi/telemetry), M06 (no-signal alert).
