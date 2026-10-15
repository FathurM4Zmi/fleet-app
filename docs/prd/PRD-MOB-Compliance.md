---
tags: [PRD, Mobile, Driver, Compliance]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Compliance]] [[PRD-MOB-Profile]]
---

# PRD-MOB — Kepatuhan & Sertifikasi Saya (Compliance)

**[PRD-MOB-20]** - Kepatuhan & Sertifikasi Saya
**Modul Sumber**: M16 (Regulatory & Safety Compliance) · **Folder BE**: `SafetyCompliance`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Wave 4
**FRD**: FRD-M16-01 (Compliance Dashboard), FRD-M16-02 (Incident Reporting), FRD-M16-04 (Driver Training/Certification)
**BRD-Mobile**: MBR-020 · [BRD-Mobile.md](../BRD-Mobile.md)

---

## Tujuan
Driver memantau **status kepatuhan dirinya** (SIM, sertifikasi, pelatihan, expiry) dan bisa **melaporkan insiden** langsung dari lapangan dengan bukti foto.

## Komponen Layar
| Komponen | Isi |
|---|---|
| Status Kepatuhan | SIM, sertifikat, pelatihan + badge expiry |
| Peringatan Expiry | Amber < 30 hari, merah expired |
| Form Insiden | Kategori, deskripsi, lokasi, foto (wajib), kronologi |
| Riwayat Insiden | Insiden yang pernah dilaporkan (read-only) |
| Checklist Kepatuhan | Checklist berkala bila ditugaskan |

## Spesifikasi Fungsional
- Menampilkan hanya data kepatuhan driver sendiri (ownership, FRD-M01-06).
- **Laporan insiden immutable** setelah submit (CRC-01, FRD-M16-02); koreksi via laporan tambahan, bukan edit.
- Insiden dengan severity tinggi → notifikasi ke dispatcher/admin (via M12) + potensi alert M06.
- Foto bukti wajib untuk insiden; offline-safe dengan antrian sinkron.
- Pelanggaran kebijakan (speeding/jam kerja/geofence) tampil sebagai peringatan (sumber M06/M18).

## Acceptance Criteria
- Given SIM/sertifikat hampir expired, When buka layar, Then badge amber tampil pada item terkait (FRD-M16-01).
- Given driver submit laporan insiden + foto, When submit, Then insiden tercatat immutable dan dispatcher diberi notifikasi (FRD-M16-02).
- Given driver mencoba mengedit insiden yang sudah terkirim, When aksi dilakukan, Then tidak tersedia (immutable).

## Wording (Microcopy)
- Dokumen expired: "{dokumen} telah kedaluwarsa dan menonaktifkan operasional terkait."
- Foto wajib: "Foto bukti wajib dilampirkan."

## Non-Fungsional
- Form insiden offline-safe (MBR-024, MBRL-009); kompres foto (MBRL-016).
- Sertakan lokasi otomatis saat laporan dibuat (bila izin lokasi aktif).

## Dependency
M03 (driver/dokumen), M09 (dokumen), M16 (kepatuhan/insiden), M18 (pelanggaran), M12 (notifikasi).

---

## Terhubung ke Dokumen Desktop (Sistem)
> Layar ini adalah **slice driver-only** dari modul desktop di bawah. Fungsi admin modul tersebut tidak ada di mobile.

| Dokumen Desktop | Tautan |
|---|---|
| PRD modul M16 | [prd/PRD-M16-Regulatory-Safety-Compliance.md](../../../prd/PRD-M16-Regulatory-Safety-Compliance.md) |
| FRD modul M16 | [prd/frd/FRD-M16-Regulatory-Safety.md](../../../prd/frd/FRD-M16-Regulatory-Safety.md) |
| BRD mobile | [BRD-Mobile.md](../BRD-Mobile.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| Peta modul | [MODULE-MAP-v2.md](../../../MODULE-MAP-v2.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
