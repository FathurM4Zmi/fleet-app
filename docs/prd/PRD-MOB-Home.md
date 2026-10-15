---
tags: [PRD, Mobile, Driver, Home]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Home]]
---

# PRD-MOB — Driver App Home

**[PRD-MOB-02]** - Driver App Home
**Modul Sumber**: M03 (Driver Management) · **Folder BE**: `DriverMaster`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Phase 1
**FRD**: FRD-M03-09 (Driver App Home)
**BRD-Mobile**: MBR-002 · [BRD-Mobile.md](../BRD-Mobile.md)

---

## Tujuan
Satu layar ringkas yang menjawab "apa yang harus saya lakukan sekarang": status saya, skor DNA, trip berikutnya, dan aksi cepat (accept/decline tugas).

## Komponen Layar
| Komponen | Isi |
|---|---|
| Header | Nama driver, status (Available/OnTrip/OffDuty), avatar |
| DNA Ring | Skor kesehatan driver 0–100 (dari M13/M18), warna hijau/amber/merah |
| Next Trip Card | Trip berikutnya: tujuan, waktu, kendaraan; tombol Accept/Decline 1-tap |
| Quick Actions | DVIR pre-trip (jika belum), Fuel Log, POD (saat kontests) |
| Reminder | Dokumen/SIM hampir expired (dari M09) |

## Spesifikasi Fungsional
- Accept/Decline trip 1-tap; decline WAJIB alasan (FRD-M04-08).
- DNA ring real-time via SignalR saat skor berubah.
- Quick action muncul kontekstual (DVIR sebelum mulai trip).
- Pull-to-refresh + sinkron notifikasi badge.

## Acceptance Criteria
- Given ada trip ditugaskan, When buka Home, Then kartu Next Trip tampil dengan Accept/Decline (FRD-M03-09).
- Given driver decline, When tap Decline, Then form alasan wajib sebelum submit (FRD-M04-08).
- Given skor DNA berubah di server, When SignalR push, Then ring ter-update tanpa refresh manual.

## Wording (Microcopy)
- Tidak ada tugas: "Belum ada tugas. Istirahatlah dulu."
- Decline wajib alasan: "Alasan penolakan wajib diisi."

## Non-Fungsional
- Render < 2 detik; skeleton loading (bukan spinner).
- Berfungsi menampilkan data terakhir cache saat offline.

## Dependency
M03 (profil/status), M04 (tugas), M13/M18 (DNA), M09 (reminder dokumen).

---

## Terhubung ke Dokumen Desktop (Sistem)
> Layar ini adalah **slice driver-only** dari modul desktop di bawah. Fungsi admin modul tersebut tidak ada di mobile.

| Dokumen Desktop | Tautan |
|---|---|
| PRD modul M03 | [prd/PRD-M03-Driver-Master.md](../../../prd/PRD-M03-Driver-Master.md) |
| FRD modul M03 | [prd/frd/FRD-M03-Driver-Management.md](../../../prd/frd/FRD-M03-Driver-Management.md) |
| BRD mobile | [BRD-Mobile.md](../BRD-Mobile.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| Peta modul | [MODULE-MAP-v2.md](../../../MODULE-MAP-v2.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
