---
tags: [FRD, Mobile, Driver, Home]
category: Mobile
related: [[PRD-MOB-Home]]
---

# FRD-MOB — Driver App Home

**Mirror**: FRD-M03-09 (Driver App Home), FRD-M04-08 (accept/decline)

## FRD-MOB-HOME-01 Next Trip Card
Menampilkan trip berikutnya + aksi Accept/Decline 1-tap.
**AC**: Given ada trip ditugaskan, When buka Home, Then kartu Next Trip tampil dengan Accept/Decline (mirror FRD-M03-09).

## FRD-MOB-HOME-02 Decline Wajib Alasan
**AC**: Given driver tap Decline, When submit, Then form alasan wajib sebelum terkirim (mirror FRD-M04-08).

## FRD-MOB-HOME-03 DNA Ring Real-time
**AC**: Given skor DNA berubah di server, When SignalR push, Then ring ter-update tanpa refresh manual.

## FRD-MOB-HOME-04 Quick Action Kontekstual
**AC**: Given trip belum DVIR pre-trip, When buka Home, Then aksi DVIR muncul sebagai quick action utama.

## Wording
- "Belum ada tugas. Istirahatlah dulu."
- "Alasan penolakan wajib diisi."
