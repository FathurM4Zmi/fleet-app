---
tags: [PRD, Mobile, Driver, Profile]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Profile]]
---

# PRD-MOB — Profil & Dokumen Saya

**[PRD-MOB-03]** - Profil & Dokumen Saya
**Modul Sumber**: M03 (Driver) + M09 (Document) · **Folder BE**: `DriverMaster` / `DocumentCompliance`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Phase 1
**FRD**: FRD-M03-02 (Driver Profile), FRD-M03-06 (Driver Documents), FRD-M03-05 (Licensing)

---

## Tujuan
Driver melihat & merawat datanya sendiri: profil, lisensi/SIM, dokumen, dan status kedaluwarsa — tanpa perlu minta admin.

## Komponen Layar
| Komponen | Isi |
|---|---|
| Profil | Nama, foto, kontak, site |
| Lisensi | Nomor SIM, kelas, endorsements, expiry |
| Dokumen | Daftar dokumen + status (Valid/NearExpiry/Expired) |
| Sertifikasi | Sertifikasi & expiry (link M20) |

## Spesifikasi Fungsional
- Read-only untuk data inti (driver tidak mengubah NIK/SIM sembarangan; perubahan lewat admin).
- Upload dokumen pribadi yang diizinkan (mis. foto selfie verifikasi) — role-scoped.
- Badge expiry: < 30 hari amber, expired merah + reminder (FRD-M09-05).
- Edit kontak darurat & preferensi notifikasi (delegasi ke M12).

## Acceptance Criteria
- Given SIM expiry < 30 hari, When buka Profil, Then badge amber + reminder (FRD-M09-05).
- Given dokumen expired, When buka Dokumen, Then status merah & tidak bisa dipakai operasional.
- Given driver coba ubah NIK, When submit, Then ditolak (hanya admin boleh, FRD-M03).

## Wording (Microcopy)
- Dokumen hampir habis: "{dokumen} akan kedaluwarsa dalam {n} hari."
- Ubah terbatas: "Data ini hanya dapat diubah oleh administrator."

## Non-Fungsional
- Foto dokumen terkompresi sebelum upload.
- Data sensitif tidak di-cache di storage lokal tanpa enkripsi.

## Dependency
M03 (profil/lisensi), M09 (dokumen/expiry), M20 (sertifikasi).
