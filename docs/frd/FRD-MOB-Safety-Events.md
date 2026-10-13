---
tags: [FRD, Mobile, Driver, Safety]
category: Mobile
related: [[PRD-MOB-Safety-Events]]
---

# FRD-MOB — Peristiwa Safety Saya (Safety Events)

**Mirror**: FRD-M18-01 (Safety Events Feed), FRD-M18-02 (Event Evidence), FRD-M18-04 (Safety Scorecard)

## FRD-MOB-SAF-01 Feed Peristiwa Pribadi
Daftar event perilaku driver (harsh brake/accel/corner, speeding) dari telemetry.
**AC**: Given ada event baru dari telemetry, When masuk, Then tampil di feed dengan badge jenis (mirror FRD-M18-01).

## FRD-MOB-SAF-02 Bukti Event
Foto/keterangan opsional + tautan video vendor (bila ada), tanpa hosting.
**AC**: Given event punya tautan video vendor, When dibuka, Then tautan tampil (bukan pemutar internal) (mirror FRD-M18-02).

## FRD-MOB-SAF-03 Skor Safety Pribadi
Skor safety rolling driver sendiri.
**AC**: Given driver membuka skor safety, When data dimuat, Then skor rolling driver sendiri tampil (mirror FRD-M18-04).

## FRD-MOB-SAF-04 Immutable
Event tidak dapat dihapus/diubah driver.
**AC**: Given driver mencoba menghapus event, When aksi dilakukan, Then tidak tersedia (mirror CRC-01).

## FRD-MOB-SAF-05 Push Event Kritis
Event kritis → push notifikasi (M12).
**AC**: Given event kritis terdeteksi, When masuk, Then push terkirim.

## FRD-MOB-SAF-06 Batas Lingkup Mobile
Hanya event driver sendiri; behavior rules & vendor config = admin-only.
**AC**: Given driver membuka layar, When data dimuat, Then hanya event miliknya yang tampil (mirror FRD-M01-06).

## Wording
- "Perilaku mengemudi berisiko terdeteksi."
- "Tidak ada peristiwa. Pertahankan cara mengemudi yang aman."
