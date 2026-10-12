---
tags: [FRD, Mobile, Driver, Fuel]
category: Mobile
related: [[PRD-MOB-Fuel-Log]]
---

# FRD-MOB — Fuel Log

**Mirror**: FRD-M07-02 (Add/Import Fuel), FRD-M07-01 (Fuel Entries), pola FRD-M02-04 (odometer)

## FRD-MOB-FUEL-01 Entri BBM
Volume, odometer, harga, stasiun, foto struk.
**AC**: Given data valid, When simpan, Then entri BBM tersimpan & masuk daftar (mirror FRD-M07-01/02).

## FRD-MOB-FUEL-02 Volume > 0
**AC**: Given volume 0, When submit, Then ditolak dengan "Volume BBM harus lebih dari 0 liter." (mirror FRD-M07-02).

## FRD-MOB-FUEL-03 Odometer Tidak Turun
**AC**: Given odometer turun, When submit, Then wajib mode koreksi + alasan (mirror FRD-M02-04).

## FRD-MOB-FUEL-04 Offline
**AC**: Given offline, When simpan, Then tersimpan lokal & sync saat online.

## Wording
- "Volume BBM harus lebih dari 0 liter."
- "Odometer tidak boleh berkurang. Ajukan koreksi dengan alasan."
- "Catatan BBM tersimpan."
