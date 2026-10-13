---
tags: [PRD, Mobile, Driver, Trip]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Inbox]]
---

# PRD-MOB — Driver Inbox (Daftar Trip)

**[PRD-MOB-04]** - Driver Inbox
**Modul Sumber**: M04 (Trip Assignment) · **Folder BE**: `AssignmentTrip`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Phase 1
**FRD**: FRD-M04-08 (Driver Inbox)

---

## Tujuan
Driver melihat semua trip yang ditugaskan kepadanya, memfilter by status, dan mengambil aksi accept/decline cepat.

## Komponen Layar
| Komponen | Isi |
|---|---|
| Tab Status | Draft/Assigned/Ongoing/Completed/Cancelled (filter chip) |
| Trip Card | Tujuan, waktu, kendaraan, status; aksi Accept/Decline |
| Badge | Jumlah trip baru (real-time via SignalR) |
| Empty State | Ilustrasi + "Belum ada tugas" |

## Spesifikasi Fungsional
- Accept → status jadi Assigned/Acknowledged (FRD-M04-06).
- Decline WAJIB alasan → tercatat (FRD-M04-08).
- Push real-time saat trip baru ditugaskan (SignalR).
- Offline: menampilkan trip terakhir cache; aksi accept/decline masuk antrian sync.

## Acceptance Criteria
- Given trip baru ditugaskan, When SignalR push, Then badge & kartu muncul tanpa refresh (FRD-M04-08).
- Given driver decline, When submit, Then alasan wajib & tercatat di timeline trip.
- Given offline, When buka inbox, Then trip cache tampil; aksi tersimpan & sync saat online.

## Wording (Microcopy)
- Accept sukses: "Tugas diterima."
- Decline: "Alasan penolakan wajib diisi."
- Kosong: "Belum ada tugas untuk Anda."

## Non-Fungsional
- Daftar ringan (virtualized list) untuk banyak trip.
- Sinkron idempotent agar accept/decline tidak dobel saat retry.

## Dependency
M04 (trip & workflow), M12 (notifikasi tugas baru), SignalR (real-time).

---

## Terhubung ke Dokumen Desktop (Sistem)
> Layar ini adalah **slice driver-only** dari modul desktop di bawah. Fungsi admin modul tersebut tidak ada di mobile.

| Dokumen Desktop | Tautan |
|---|---|
| PRD modul M04 | [prd/PRD-M04-Assignment-Trip.md](../../../prd/PRD-M04-Assignment-Trip.md) |
| FRD modul M04 | [prd/frd/FRD-M04-Trip-Assignment.md](../../../prd/frd/FRD-M04-Trip-Assignment.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| Peta modul | [MODULE-MAP-v2.md](../../../MODULE-MAP-v2.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
