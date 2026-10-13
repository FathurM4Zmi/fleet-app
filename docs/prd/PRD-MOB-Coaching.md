---
tags: [PRD, Mobile, Driver, Coaching]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Coaching]]
---

# PRD-MOB — Coaching & Sertifikasi Saya

**[PRD-MOB-10]** - Coaching & Sertifikasi Saya
**Modul Sumber**: M20 (Driver Coaching & Workforce) · **Folder BE**: `CoachingWorkforce`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Phase 3
**FRD**: FRD-M20-02 (Coaching Plans), FRD-M20-03 (Training), FRD-M18-04 (Safety Scorecard)

---

## Tujuan
Driver melihat rencana coaching yang ditugaskan kepadanya, progres milestone, skor safety, dan sertifikasi/training yang harus diselesaikan — transparansi dua arah.

## Komponen Layar
| Komponen | Isi |
|---|---|
| Skor Safety | Safety scorecard rolling (dari M18/M13) |
| Coaching Aktif | Plan: target, milestone, status, progres |
| Riwayat Coaching | Plan selesai/dibatalkan |
| Training/Sertifikasi | Kursus + sertifikat + expiry |

## Spesifikasi Fungsional
- Tampilkan coaching plan yang di-assign ke driver ini saja (ownership).
- Update progres milestone oleh driver (bila diizinkan) → tercatat.
- Tampilkan sertifikasi & expiry (link M09); reminder sebelum expiry.
- Skor safety rolling + tren (before/after coaching).

## Acceptance Criteria
- Given ada coaching plan untuk driver, When buka Coaching, Then plan + milestone + status tampil (FRD-M20-02).
- Given driver update milestone, When simpan, Then progres tercatat & terlihat supervisor (FRD-M20-06).
- Given sertifikasi expiry < 30 hari, When buka, Then reminder tampil (FRD-M20-03).

## Wording (Microcopy)
- Tidak ada plan: "Belum ada rencana coaching."
- Progres tersimpan: "Progres coaching tersimpan."

## Non-Fungsional
- Read-heavy; chart skor ringan.
- Offline: tampilkan data terakhir cache.

## Dependency
M20 (coaching), M18/M13 (skor), M09 (sertifikasi/expiry).

---

## Terhubung ke Dokumen Desktop (Sistem)
> Layar ini adalah **slice driver-only** dari modul desktop di bawah. Fungsi admin modul tersebut tidak ada di mobile.

| Dokumen Desktop | Tautan |
|---|---|
| PRD modul M20 | [prd/PRD-M20-Driver-Coaching-Workforce.md](../../../prd/PRD-M20-Driver-Coaching-Workforce.md) |
| FRD modul M20 | [prd/frd/FRD-M20-Driver-Coaching.md](../../../prd/frd/FRD-M20-Driver-Coaching.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| Peta modul | [MODULE-MAP-v2.md](../../../MODULE-MAP-v2.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
