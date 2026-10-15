---
tags: [PRD, Mobile, Driver, Audit]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Activity-Log]]
---

# PRD-MOB — Aktivitas Saya (Activity Log)

**[PRD-MOB-16]** - Aktivitas Saya
**Modul Sumber**: M11 (Settings, Configuration & Audit) · **Folder BE**: `AuditAdministration`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Wave 3
**FRD**: FRD-M11-06 (Audit Log Viewer)
**BRD-Mobile**: MBR-016 · [BRD-Mobile.md](../BRD-Mobile.md)

---

## Tujuan
Driver dapat meninjau **jejak aktivitasnya sendiri** (login, submit DVIR/POD/fuel, perubahan status trip) untuk transparansi dan bukti saat ada sengketa — versi terbatas, read-only, tanpa akses audit sistem penuh.

## Komponen Layar
| Komponen | Isi |
|---|---|
| Daftar Aktivitas | Kronologis aksi driver (waktu, aksi, objek, hasil) |
| Filter | Jenis aksi (login, DVIR, POD, fuel, trip) + rentang tanggal |
| Detail Item | Metadata aksi + status sinkron (terkirim/pending) |
| Banner Privasi | Penjelasan data yang dicatat |

## Spesifikasi Fungsional
- Hanya menampilkan entri audit dengan actor = driver sendiri (ownership, FRD-M01-06).
- Read-only — driver tidak dapat mengubah/menghapus entri audit (immutable, BRL-028, FRD-M11-06).
- Menampilkan status sinkronisasi untuk aksi offline (pending → terkirim) agar driver tahu data aman.
- Pengaturan perangkat (profil, locale, preferensi notifikasi) didelegasikan ke layar Profil (M03) & Notifikasi (M12), bukan di sini.
- Tidak menampilkan data konfigurasi/security sistem (admin-only, out-of-scope mobile).

## Acceptance Criteria
- Given driver membuka layar, When data dimuat, Then daftar aktivitas miliknya tampil kronologis terbaru dulu (FRD-M11-06).
- Given ada aksi offline yang belum tersinkron, When dibuka, Then entri berstatus pending terlihat jelas.
- Given driver mencoba menghapus entri, When aksi dilakukan, Then tidak tersedia (read-only).

## Wording (Microcopy)
- Empty state: "Belum ada aktivitas tercatat."
- Pending: "Menunggu sinkronisasi."

## Non-Fungsional
- Muat cepat; pagination/infinite scroll untuk daftar panjang.
- Data audit tidak disimpan cleartext di device.

## Dependency
M01 (identitas/actor), M11 (audit pipeline), M12 (preferensi notifikasi).

---

## Terhubung ke Dokumen Desktop (Sistem)
> Layar ini adalah **slice driver-only** dari modul desktop di bawah. Fungsi admin modul tersebut tidak ada di mobile.

| Dokumen Desktop | Tautan |
|---|---|
| PRD modul M11 | [prd/PRD-M11-Audit-Administration.md](../../../prd/PRD-M11-Audit-Administration.md) |
| FRD modul M11 | [prd/frd/FRD-M11-Settings-Audit.md](../../../prd/frd/FRD-M11-Settings-Audit.md) |
| BRD mobile | [BRD-Mobile.md](../BRD-Mobile.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| Peta modul | [MODULE-MAP-v2.md](../../../MODULE-MAP-v2.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
