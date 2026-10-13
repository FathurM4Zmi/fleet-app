---
tags: [PRD, Mobile, Driver, POD]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-POD]] [[PRD-MOB-Trip-Execution]]
---

# PRD-MOB — POD Capture (Proof of Delivery)

**[PRD-MOB-07]** - POD Capture
**Modul Sumber**: M21 (Customer Experience & POD) · **Folder BE**: `CustomerExperiencePOD`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Phase 2
**FRD**: FRD-M21-02 (POD Capture), FRD-M21-06 (POD & Chain-of-Custody)

---

## Tujuan
Driver menangkap bukti pengiriman sekali proses: foto, tanda tangan, barcode/scan + timestamp + geo. POD immutable sebagai bukti anti-sengketa.

## Komponen Layar
| Komponen | Isi |
|---|---|
| Foto Barang | Kamera (bisa multi) |
| Tanda Tangan | Canvas tanda tangan penerima |
| Scan/Barcode | Scan kode pengiriman (opsional) |
| Nama Penerima | Input nama yang menerima |
| Geo + Waktu | Otomatis tercatat (immutable) |
| Submit | Tombol besar; indikator offline |

## Spesifikasi Fungsional
- Capture foto + tanda tangan penerima + (opsional) scan barcode.
- Geo & timestamp otomatis, tidak bisa diubah driver (FRD-M21-02).
- **Offline-safe**: POD tersimpan lokal, sync saat online; immutable setelah tersimpan (CRC-01).
- Selesai → status delivery Delivered → notifikasi pelanggan (M12/M21-04).

## Acceptance Criteria
- Given driver di lokasi, When capture POD, Then foto/tanda tangan/geo + timestamp tersimpan immutable (FRD-M21-02/06).
- Given offline, When submit POD, Then tersimpan lokal & sync idempotent saat online; tidak bisa diubah setelah sync.
- Given POD tersimpan, When delivery selesai, Then notifikasi pelanggan terkirim (FRD-M21-04).

## Wording (Microcopy)
- Tersimpan: "Bukti pengiriman tersimpan."
- Wajib: "Foto atau tanda tangan penerima wajib diisi."
- Offline: "Tersimpan offline. Akan tersinkron saat online."

## Non-Fungsional
- Foto terkompresi; tanda tangan sebagai gambar ringan.
- Geo akurasi wajar; tamper-evident (tidak ada edit destruktif).

## Dependency
M21 (POD/chain-of-custody), M04 (trip), M12 (notifikasi pelanggan), M05 (lokasi).

---

## Terhubung ke Dokumen Desktop (Sistem)
> Layar ini adalah **slice driver-only** dari modul desktop di bawah. Fungsi admin modul tersebut tidak ada di mobile.

| Dokumen Desktop | Tautan |
|---|---|
| PRD modul M21 | [prd/PRD-M21-Customer-Experience-POD.md](../../../prd/PRD-M21-Customer-Experience-POD.md) |
| FRD modul M21 | [prd/frd/FRD-M21-Customer-POD.md](../../../prd/frd/FRD-M21-Customer-POD.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| Peta modul | [MODULE-MAP-v2.md](../../../MODULE-MAP-v2.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
