---
tags: [PRD, Mobile, Driver, Trip]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Trip-Execution]] [[PRD-MOB-POD]]
---

# PRD-MOB — Trip Execution

**[PRD-MOB-05]** - Trip Execution
**Modul Sumber**: M04 (Trip Assignment) · **Folder BE**: `AssignmentTrip`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Phase 1
**FRD**: FRD-M04-09 (Trip Execution), FRD-M04-06 (Trip Status Workflow)
**BRD-Mobile**: MBR-005 · [BRD-Mobile.md](../BRD-Mobile.md)

---

## Tujuan
Driver mengeksekusi trip di lapangan: mulai perjalanan, melihat rute & titik antar, mencatat kejadian on-field, dan menyelesaikan trip.

## Komponen Layar
| Komponen | Isi |
|---|---|
| Status Stepper | Assigned → Started → Arrived → Completed (FRD-M04-06) |
| Peta Rute | Rute trip + titik antar (dari M14), posisi driver |
| Aksi Utama | "Mulai", "Sampai Titik", "Selesaikan" (besar, thumb zone) |
| Catatan On-field | Input teks/insiden singkat |
| Kontak | Hubungi penerima/pelanggan (chat M21) |

## Spesifikasi Fungsional
- Transisi status mengunci data (immutable) — tiap transisi tercatat timeline (FRD-M04-06).
- Mulai trip mencatat timestamp + geo start.
- Selesaikan → arahkan ke POD Capture (M21).
- Lokasi driver dikirim berkala (hemat baterai) untuk live map M05.
- Offline: transisi status masuk antrian sync; rute terakhir tampil dari cache.

## Acceptance Criteria
- Given trip Assigned, When driver tap Mulai, Then status Started + timestamp tercatat (FRD-M04-09).
- Given driver tap Selesaikan, When trip complete, Then diarahkan ke POD Capture & status Completed (FRD-M04-06).
- Given offline, When transisi status, Then tersimpan lokal & sync idempotent saat online.

## Wording (Microcopy)
- Mulai: "Mulai perjalanan?"
- Selesai: "Selesaikan trip dan lanjutunggah bukti pengiriman."

## Non-Fungsional
- Sample lokasi wajar (mis. tiap 30–60 dtk / pergerakan) untuk hemat baterai.
- Peta ringan; tile di-cache.

## Dependency
M04 (workflow/status), M14 (rute), M21 (POD & chat), M05 (live position).

---

## Terhubung ke Dokumen Desktop (Sistem)
> Layar ini adalah **slice driver-only** dari modul desktop di bawah. Fungsi admin modul tersebut tidak ada di mobile.

| Dokumen Desktop | Tautan |
|---|---|
| PRD modul M04 | [prd/PRD-M04-Assignment-Trip.md](../../../prd/PRD-M04-Assignment-Trip.md) |
| FRD modul M04 | [prd/frd/FRD-M04-Trip-Assignment.md](../../../prd/frd/FRD-M04-Trip-Assignment.md) |
| BRD mobile | [BRD-Mobile.md](../BRD-Mobile.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| Peta modul | [MODULE-MAP-v2.md](../../../MODULE-MAP-v2.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
