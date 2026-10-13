---
tags: [PRD, Mobile, Driver, Vehicle]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Vehicle-Detail]] [[PRD-MOB-Home]]
---

# PRD-MOB — Kendaraan Saya (Vehicle Detail)

**[PRD-MOB-11]** - Kendaraan Saya
**Modul Sumber**: M02 (Vehicle Master) · **Folder BE**: `VehicleMaster`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Wave 1
**FRD**: FRD-M02-02 (Vehicle Detail), FRD-M02-06 (Vehicle Documents), FRD-M02-09 (Vehicle Health & DNA)

---

## Tujuan
Driver tahu kondisi kendaraan yang ditugaskan **sebelum** berangkat: identitas, status, skor DNA, dan dokumen yang relevan — tanpa harus bertanya ke dispatcher.

## Komponen Layar
| Komponen | Isi |
|---|---|
| Header Kendaraan | Foto, nomor polisi, tipe/kelas, status (Available/OnTrip/Maintenance) |
| DNA Ring | Skor kesehatan kendaraan 0–100 (M13), warna hijau/amber/merah |
| Spesifikasi | Kapasitas, bahan bakar, odometer terakhir |
| Dokumen | STNK/KIR/insurans + badge expiry (dari M09) |
| Riwayat Singkat | 3 WO maintenance terakhir + status |
| CTA | "Laporkan Kerusakan" → Defect Report (M08) |

## Spesifikasi Fungsional
- Hanya kendaraan yang **sedang/akan ditugaskan** ke driver yang tampil (ownership site+user scope, FRD-M01-06).
- DNA ring real-time via SignalR saat skor berubah (FRD-M02-09).
- Badge expiry dokumen berubah warna (amber < 30 hari, merah expired).
- Odometer hanya-baca di mobile (edit hanya web admin) — FRD-M02-04.
- Pull-to-refresh untuk sinkron status terbaru.

## Acceptance Criteria
- Given driver punya trip aktif, When buka Kendaraan Saya, Then detail kendaraan yang ditugaskan tampil lengkap (FRD-M02-02).
- Given dokumen kendaraan hampir expired, When buka layar, Then badge amber muncul pada dokumen terkait (FRD-M02-06).
- Given skor DNA kendaraan berubah di server, When SignalR push, Then ring ter-update tanpa refresh manual (FRD-M02-09).

## Wording (Microcopy)
- Tidak ada kendaraan: "Belum ada kendaraan yang ditugaskan."
- Unit tidak layak: "Kendaraan ini tidak tersedia untuk ditugaskan."

## Non-Fungsional
- Render < 2 detik; skeleton loading (bukan spinner).
- Tampilkan data cache terakhir saat offline (read-only).

## Dependency
M02 (kendaraan), M09 (dokumen), M13 (DNA), M08 (riwayat WO).
