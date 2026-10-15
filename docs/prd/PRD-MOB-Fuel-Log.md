---
tags: [PRD, Mobile, Driver, Fuel]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Fuel-Log]]
---

# PRD-MOB — Fuel Log (Entri BBM)

**[PRD-MOB-08]** - Fuel Log
**Modul Sumber**: M07 (Fuel & Cost) · **Folder BE**: `FuelCost`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Phase 2
**FRD**: FRD-M07-02 (Add/Import Fuel), FRD-M07-01 (Fuel Entries)
**BRD-Mobile**: MBR-008 · [BRD-Mobile.md](../BRD-Mobile.md)

---

## Tujuan
Driver mencatat pengisian BBM di lapangan: volume, harga, odometer, stasiun, foto struk — sebagai input biaya & konsumsi (L/100km).

## Komponen Layar
| Komponen | Isi |
|---|---|
| Kendaraan | Otomatis dari trip aktif / pilih |
| Volume (liter) | Input angka, wajib > 0 |
| Odometer | Input odometer saat isi |
| Harga/Total | Input biaya |
| Stasiun | Nama/lokasi SPBU |
| Foto Struk | Kamera/galeri (opsional tapi dianjurkan) |
| Submit | Simpan; indikator offline |

## Spesifikasi Fungsional
- Volume WAJIB > 0 (BRL: "Volume BBM harus lebih dari 0 liter.", FRD-M07-02).
- Odometer >= nilai terakhir; turun wajib koreksi + alasan (pola FRD-M02-04).
- Foto struk melengkapi bukti (mendukung rekonsiliasi M22).
- **Offline-safe**: entri tersimpan lokal, sync saat online.

## Acceptance Criteria
- Given volume 0, When submit, Then ditolak dengan "Volume BBM harus lebih dari 0 liter." (FRD-M07-02).
- Given odometer turun, When submit, Then wajib mode koreksi + alasan.
- Given offline, When simpan, Then tersimpan lokal & sync saat online.

## Wording (Microcopy)
- Volume invalid: "Volume BBM harus lebih dari 0 liter."
- Odometer turun: "Odometer tidak boleh berkurang. Ajukan koreksi dengan alasan."
- Tersimpan: "Catatan BBM tersimpan."

## Non-Fungsional
- Input angka dengan keypad numerik.
- Foto struk terkompresi.

## Dependency
M07 (fuel/biaya), M02 (kendaraan/odometer), M22 (rekonsiliasi/fraud).

---

## Terhubung ke Dokumen Desktop (Sistem)
> Layar ini adalah **slice driver-only** dari modul desktop di bawah. Fungsi admin modul tersebut tidak ada di mobile.

| Dokumen Desktop | Tautan |
|---|---|
| PRD modul M07 | [prd/PRD-M07-Fuel-Cost.md](../../../prd/PRD-M07-Fuel-Cost.md) |
| FRD modul M07 | [prd/frd/FRD-M07-Fuel-Cost.md](../../../prd/frd/FRD-M07-Fuel-Cost.md) |
| BRD mobile | [BRD-Mobile.md](../BRD-Mobile.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| Peta modul | [MODULE-MAP-v2.md](../../../MODULE-MAP-v2.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
