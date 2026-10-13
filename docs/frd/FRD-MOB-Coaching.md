---
tags: [FRD, Mobile, Driver, Coaching]
category: Mobile
related: [[PRD-MOB-Coaching]]
---

# FRD-MOB — Coaching & Sertifikasi Saya

**Mirror**: FRD-M20-02 (Coaching Plans), FRD-M20-03 (Training), FRD-M18-04 (Scorecard)

## FRD-MOB-COACH-01 Lihat Coaching Plan
**AC**: Given ada plan untuk driver, When buka Coaching, Then plan + milestone + status tampil (mirror FRD-M20-02).

## FRD-MOB-COACH-02 Update Progres Milestone
**AC**: Given driver update milestone, When simpan, Then progres tercatat & terlihat supervisor (mirror FRD-M20-06).

## FRD-MOB-COACH-03 Sertifikasi & Expiry
**AC**: Given sertifikasi expiry < 30 hari, When buka, Then reminder tampil (mirror FRD-M20-03).

## FRD-MOB-COACH-04 Skor Safety Rolling
**AC**: Given skor safety tersedia, When buka, Then skor rolling + tren tampil (mirror FRD-M18-04).

## Wording
- "Belum ada rencana coaching."
- "Progres coaching tersimpan."

---

## Terhubung ke Dokumen Desktop (Sistem)
> Mirror FRD desktop di bawah; layar mobile = slice driver-only.

| Dokumen Desktop | Tautan |
|---|---|
| FRD modul M20 | [prd/frd/FRD-M20-Driver-Coaching.md](../../../prd/frd/FRD-M20-Driver-Coaching.md) |
| PRD modul | [M20](../../../prd/PRD-M20-Driver-Coaching-Workforce.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](../prd/PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
