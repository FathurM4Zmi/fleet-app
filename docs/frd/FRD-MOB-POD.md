---
tags: [FRD, Mobile, Driver, POD]
category: Mobile
related: [[PRD-MOB-POD]]
---

# FRD-MOB — POD Capture

**Mirror**: FRD-M21-02 (POD Capture), FRD-M21-06 (chain-of-custody)

## FRD-MOB-POD-01 Capture Bukti
Foto + tanda tangan + (opsional) scan + geo + timestamp.
**AC**: Given driver di lokasi, When capture POD, Then foto/tanda tangan/geo + timestamp tersimpan immutable (mirror FRD-M21-02/06).

## FRD-MOB-POD-02 Immutable
**AC**: Given POD tersimpan, When coba ubah, Then tidak bisa diubah destruktif (CRC-01).

## FRD-MOB-POD-03 Offline Sync
**AC**: Given offline, When submit POD, Then tersimpan lokal & sync idempotent saat online.

## FRD-MOB-POD-04 Notifikasi Pelanggan
**AC**: Given delivery selesai, When POD tersimpan, Then notifikasi pelanggan terkirim (mirror FRD-M21-04).

## Wording
- "Bukti pengiriman tersimpan."
- "Foto atau tanda tangan penerima wajib diisi."
- "Tersimpan offline. Akan tersinkron saat online."

---

## Terhubung ke Dokumen Desktop (Sistem)
> Mirror FRD desktop di bawah; layar mobile = slice driver-only.

| Dokumen Desktop | Tautan |
|---|---|
| FRD modul M21 | [prd/frd/FRD-M21-Customer-POD.md](../../../prd/frd/FRD-M21-Customer-POD.md) |
| PRD modul | [M21](../../../prd/PRD-M21-Customer-Experience-POD.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](../prd/PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
