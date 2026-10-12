---
tags: [FRD, Mobile, Driver, Profile]
category: Mobile
related: [[PRD-MOB-Profile]]
---

# FRD-MOB — Profil & Dokumen Saya

**Mirror**: FRD-M03-02 (Profile), FRD-M03-05 (Licensing), FRD-M03-06 (Documents), FRD-M09-05 (Expiry)

## FRD-MOB-PROFILE-01 Lihat Profil & Lisensi
**AC**: Given driver login, When buka Profil, Then data pribadi, SIM, kelas, & endorsement tampil (mirror FRD-M03-02/05).

## FRD-MOB-PROFILE-02 Status Dokumen & Expiry
**AC**: Given dokumen expiry < 30 hari, When buka Dokumen, Then badge amber; expired → merah + reminder (mirror FRD-M09-05).

## FRD-MOB-PROFILE-03 Data Inti Read-only
**AC**: Given driver coba ubah NIK/SIM, When submit, Then ditolak (hanya admin boleh).

## Wording
- "{dokumen} akan kedaluwarsa dalam {n} hari."
- "Data ini hanya dapat diubah oleh administrator."
