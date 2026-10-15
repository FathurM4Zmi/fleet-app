---
tags: [FRD, Mobile, Driver, Compliance]
category: Mobile
related: [[PRD-MOB-Compliance]]
---

# FRD-MOB — Kepatuhan & Sertifikasi Saya (Compliance)

**Mirror**: FRD-M16-01 (Compliance Dashboard), FRD-M16-02 (Incident Reporting), FRD-M16-04 (Driver Training/Certification)
**BRD-Mobile**: MBR-020 · [BRD-Mobile.md](../BRD-Mobile.md)

## FRD-MOB-CMP-01 Status Kepatuhan
SIM, sertifikat, pelatihan + badge expiry.
**AC**: Given SIM/sertifikat hampir expired, When buka layar, Then badge amber tampil pada item terkait (mirror FRD-M16-01).

## FRD-MOB-CMP-02 Laporan Insiden
Form insiden (kategori, deskripsi, lokasi, foto wajib, kronologi).
**AC**: Given driver submit laporan insiden + foto, When submit, Then insiden tercatat dan dispatcher diberi notifikasi (mirror FRD-M16-02).

## FRD-MOB-CMP-03 Immutable
Insiden tidak dapat diedit setelah submit; koreksi via laporan tambahan.
**AC**: Given insiden sudah terkirim, When driver mencoba mengedit, Then tidak tersedia (mirror CRC-01).

## FRD-MOB-CMP-04 Foto Wajib
Foto bukti wajib dilampirkan.
**AC**: Given foto kosong, When submit, Then ditolak dengan pesan foto wajib.

## FRD-MOB-CMP-05 Offline-safe Insiden
Laporan insiden dapat dibuat tanpa sinyal.
**AC**: Given offline, When driver submit insiden, Then tersimpan lokal dan terkirim saat online (mirror MBR-024, MBRL-009).

## FRD-MOB-CMP-06 Riwayat Insiden
Daftar insiden yang pernah dilaporkan (read-only).
**AC**: Given ada riwayat, When dibuka, Then daftar insiden tampil read-only.

## Wording
- "{dokumen} telah kedaluwarsa dan menonaktifkan operasional terkait."
- "Foto bukti wajib dilampirkan."

---

## Terhubung ke Dokumen Desktop (Sistem)
> Mirror FRD desktop di bawah; layar mobile = slice driver-only.

| Dokumen Desktop | Tautan |
|---|---|
| FRD modul M16 | [prd/frd/FRD-M16-Regulatory-Safety.md](../../../prd/frd/FRD-M16-Regulatory-Safety.md) |
| PRD modul | [M16](../../../prd/PRD-M16-Regulatory-Safety-Compliance.md) |
| BRD mobile | [BRD-Mobile.md](../BRD-Mobile.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](../prd/PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
