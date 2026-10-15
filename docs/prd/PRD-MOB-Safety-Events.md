---
tags: [PRD, Mobile, Driver, Safety]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Safety-Events]] [[PRD-MOB-Coaching]] [[PRD-MOB-DNA-Saya]]
---

# PRD-MOB — Peristiwa Safety Saya (Safety Events)

**[PRD-MOB-21]** - Peristiwa Safety Saya
**Modul Sumber**: M18 (Safety Events & Coaching) · **Folder BE**: `SafetyEvents`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Wave 5
**FRD**: FRD-M18-01 (Safety Events Feed), FRD-M18-02 (Event Evidence), FRD-M18-04 (Safety Scorecard)
**BRD-Mobile**: MBR-021 · [BRD-Mobile.md](../BRD-Mobile.md)

---

## Tujuan
Driver melihat **peristiwa perilaku mengemudinya sendiri** (harsh brake/accel/corner, speeding) beserta bukti, dan memahami dampaknya ke skor safety — mendorong perbaikan mandiri.

## Komponen Layar
| Komponen | Isi |
|---|---|
| Feed Peristiwa | Daftar event driver, badge jenis + waktu + lokasi |
| Detail Event | Konteks + foto/keterangan (opsional) + tautan video vendor (bila ada) |
| Skor Safety | Skor safety rolling driver sendiri |
| Filter | Jenis event + rentang tanggal |
| CTA | "Lihat Rencana Coaching" → M20 |

## Spesifikasi Fungsional
- Menampilkan **hanya** event milik driver sendiri (ownership, FRD-M01-06).
- Event berasal dari telemetry via `ITelemetrySource` (BRL-038) — ditampilkan real-time saat terjadi.
- Event bersifat **immutable** (CRC-01) — driver tidak dapat menghapus/mengubah.
- Video dashcam vendor hanya berupa **tautan (URL)** bila tersedia, tanpa hosting di aplikasi (flag OFF default).
- Skor safety menyuplai DNA (M13) dan Coaching (M20); layar ini read-only.

## Acceptance Criteria
- Given ada event baru dari telemetry, When masuk, Then tampil di feed dengan badge jenis (FRD-M18-01).
- Given event punya tautan video vendor, When dibuka, Then tautan tampil (bukan pemutar video internal) (FRD-M18-02).
- Given driver membuka skor safety, When data dimuat, Then skor rolling driver sendiri tampil (FRD-M18-04).

## Wording (Microcopy)
- Event kritis: "Perilaku mengemudi berisiko terdeteksi."
- Tanpa event: "Tidak ada peristiwa. Pertahankan cara mengemudi yang aman."

## Non-Fungsional
- Render < 2 detik; pagination untuk feed panjang.
- Notifikasi event kritis via M12 (push).

## Dependency
M05/M06 (telemetry & threshold), M13 (skor), M18 (event/scorecard), M20 (coaching).

---

## Terhubung ke Dokumen Desktop (Sistem)
> Layar ini adalah **slice driver-only** dari modul desktop di bawah. Fungsi admin modul tersebut tidak ada di mobile.

| Dokumen Desktop | Tautan |
|---|---|
| PRD modul M18 | [prd/PRD-M18-Safety-Events-Coaching.md](../../../prd/PRD-M18-Safety-Events-Coaching.md) |
| FRD modul M18 | [prd/frd/FRD-M18-Safety-Events.md](../../../prd/frd/FRD-M18-Safety-Events.md) |
| BRD mobile | [BRD-Mobile.md](../BRD-Mobile.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| Peta modul | [MODULE-MAP-v2.md](../../../MODULE-MAP-v2.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
