---
tags: [PRD, Mobile, Driver, Alert]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Alerts]] [[PRD-MOB-Notifications]]
---

# PRD-MOB — Peringatan Trip (Alerts)

**[PRD-MOB-13]** - Peringatan Trip
**Modul Sumber**: M06 (Geofence, Alert & Exception) · **Folder BE**: `GeofenceAlert`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Wave 2
**FRD**: FRD-M06-01 (Unified Command Feed), FRD-M06-04 (Geofence Breach), FRD-M06-06 (Exception Resolution)

---

## Tujuan
Driver menerima peringatan yang **relevan untuk trip-nya sendiri** (geofence breach, keluar rute, SLA) dan bisa menindaklanjuti dengan alasan — bukan feed exception penuh milik dispatcher.

## Komponen Layar
| Komponen | Isi |
|---|---|
| Daftar Peringatan | Item peringatan trip, badge severity (Critical/Warning/Info) |
| Kartu Detail | Konteks (lokasi, waktu, tipe pelanggaran), SLA countdown |
| Aksi | "Tandai Ditangani" / "Beri Alasan" (override wajib alasan) |
| Riwayat | Peringatan yang sudah selesai (read-only) |

## Spesifikasi Fungsional
- Hanya menampilkan peringatan yang tertaut ke driver/trip miliknya (site+user scope, FRD-M01-06).
- Severity Critical → muncul di atas + notifikasi push (via M12) + pulse halus.
- Resolusi/override **wajib alasan** dan masuk audit immutable (BRL-028, FRD-M06-06).
- Peringatan datang real-time via SignalR saat trip berjalan.
- Sinkron badge jumlah peringatan ke Notifikasi (M12).

## Acceptance Criteria
- Given peringatan baru untuk trip driver, When SignalR push, Then item muncul di atas daftar dengan badge severity (FRD-M06-01).
- Given driver tap "Beri Alasan", When submit tanpa alasan, Then ditolak (FRD-M06-06).
- Given peringatan sudah ditangani, When dibuka lagi, Then status berubah menjadi resolved (read-only).

## Wording (Microcopy)
- Override wajib alasan: "Alasan override wajib diisi."
- Keluar zona: "Anda keluar dari zona rute yang ditentukan."

## Non-Fungsional
- Notifikasi kritis tetap tampil walau app di background (push).
- Aksi resolve harus idempotent (aman saat retry offline).

## Dependency
M04 (trip), M05 (posisi), M06 (alert), M12 (push notifikasi).

---

## Terhubung ke Dokumen Desktop (Sistem)
> Layar ini adalah **slice driver-only** dari modul desktop di bawah. Fungsi admin modul tersebut tidak ada di mobile.

| Dokumen Desktop | Tautan |
|---|---|
| PRD modul M06 | [prd/PRD-M06-Geofence-Alert.md](../../../prd/PRD-M06-Geofence-Alert.md) |
| FRD modul M06 | [prd/frd/FRD-M06-Geofence-Alert.md](../../../prd/frd/FRD-M06-Geofence-Alert.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| Peta modul | [MODULE-MAP-v2.md](../../../MODULE-MAP-v2.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
