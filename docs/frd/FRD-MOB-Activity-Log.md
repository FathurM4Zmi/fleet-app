---
tags: [FRD, Mobile, Driver, Audit]
category: Mobile
related: [[PRD-MOB-Activity-Log]]
---

# FRD-MOB — Aktivitas Saya (Activity Log)

**Mirror**: FRD-M11-06 (Audit Log Viewer), BRL-028 (immutability)

## FRD-MOB-ACT-01 Daftar Aktivitas Pribadi
Daftar kronologis aksi driver sendiri (login, DVIR, POD, fuel, trip).
**AC**: Given driver membuka layar, When data dimuat, Then daftar aktivitas miliknya tampil kronologis terbaru dulu (mirror FRD-M11-06).

## FRD-MOB-ACT-02 Read-only & Immutable
Driver tidak dapat mengubah/menghapus entri.
**AC**: Given driver mencoba menghapus entri, When aksi dilakukan, Then tidak tersedia (mirror BRL-028).

## FRD-MOB-ACT-03 Status Sinkronisasi
Menampilkan entri offline berstatus pending.
**AC**: Given ada aksi offline belum tersinkron, When dibuka, Then entri berstatus pending terlihat jelas.

## FRD-MOB-ACT-04 Filter Jenis & Tanggal
Filter jenis aksi + rentang tanggal.
**AC**: Given filter diterapkan, When daftar dimuat ulang, Then hanya entri sesuai filter tampil.

## FRD-MOB-ACT-05 Batas Lingkup Mobile
Tidak menampilkan konfigurasi/security/audit sistem (admin-only).
**AC**: Given driver membuka layar, When data dimuat, Then hanya entri actor=driver yang tampil.

## Wording
- "Belum ada aktivitas tercatat."
- "Menunggu sinkronisasi."

---

## Terhubung ke Dokumen Desktop (Sistem)
> Mirror FRD desktop di bawah; layar mobile = slice driver-only.

| Dokumen Desktop | Tautan |
|---|---|
| FRD modul M11 | [prd/frd/FRD-M11-Settings-Audit.md](../../../prd/frd/FRD-M11-Settings-Audit.md) |
| PRD modul | [M11](../../../prd/PRD-M11-Audit-Administration.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](../prd/PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
