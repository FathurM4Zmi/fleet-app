---
tags: [FRD, Mobile, Driver, Profile]
category: Mobile
related: [[PRD-MOB-Profile]]
---

# FRD-MOB — Profil & Dokumen Saya

**Mirror**: FRD-M03-02 (Profile), FRD-M03-05 (Licensing), FRD-M03-06 (Documents), FRD-M09-05 (Expiry)
**BRD-Mobile**: MBR-003 · [BRD-Mobile.md](../BRD-Mobile.md)

## FRD-MOB-PROFILE-01 Lihat Profil & Lisensi
**AC**: Given driver login, When buka Profil, Then data pribadi, SIM, kelas, & endorsement tampil (mirror FRD-M03-02/05).

## FRD-MOB-PROFILE-02 Status Dokumen & Expiry
**AC**: Given dokumen expiry < 30 hari, When buka Dokumen, Then badge amber; expired → merah + reminder (mirror FRD-M09-05).

## FRD-MOB-PROFILE-03 Data Inti Read-only
**AC**: Given driver coba ubah NIK/SIM, When submit, Then ditolak (hanya admin boleh).

## Wording
- "{dokumen} akan kedaluwarsa dalam {n} hari."
- "Data ini hanya dapat diubah oleh administrator."

---

## Terhubung ke Dokumen Desktop (Sistem)
> Mirror FRD desktop di bawah; layar mobile = slice driver-only.

| Dokumen Desktop | Tautan |
|---|---|
| FRD modul M03 | [prd/frd/FRD-M03-Driver-Management.md](../../../prd/frd/FRD-M03-Driver-Management.md) |
| FRD modul M09 | [prd/frd/FRD-M09-Document-Compliance.md](../../../prd/frd/FRD-M09-Document-Compliance.md) |
| PRD modul | [M03](../../../prd/PRD-M03-Driver-Master.md) · [M09](../../../prd/PRD-M09-Document-Compliance.md) |
| BRD mobile | [BRD-Mobile.md](../BRD-Mobile.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](../prd/PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
