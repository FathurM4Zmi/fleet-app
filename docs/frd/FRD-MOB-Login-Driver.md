---
tags: [FRD, Mobile, Driver, Auth]
category: Mobile
related: [[PRD-MOB-Login-Driver]]
---

# FRD-MOB — Login Driver

**Mirror**: FRD-M01-02 (Login driver), FRD-M01-03 (Forgot/Reset), FRD-M01-01 (lock)

## FRD-MOB-LOGIN-01 Login PIN/OTP/QR
Driver terautentikasi via PIN 6 digit / OTP / scan QR sekali-pakai.
**AC**: Given driver aktif & SIM belum expired, When scan QR / PIN benar, Then terautentikasi & direct ke Driver App Home (mirror FRD-M01-02).

## FRD-MOB-LOGIN-02 Auto-login & Session
Token JWT tersimpan di secure storage; refresh otomatis bila belum expired.
**AC**: Given token valid tersimpan, When buka app, Then langsung ke Home tanpa login ulang.

## FRD-MOB-LOGIN-03 Lock Percobaan
PIN salah 5x → lock sementara.
**AC**: Given PIN salah 5x, When submit ke-6, Then akun dikunci sementara + notifikasi (mirror FRD-M01-01).

## FRD-MOB-LOGIN-04 Guard Status Driver
Driver non-aktif / SIM expired ditolak.
**AC**: Given SIM expired, When login, Then ditolak dengan pesan status lisensi (mirror FRD-M03-03).

## FRD-MOB-LOGIN-05 Tanpa Registrasi Mandiri
App tidak menyediakan pendaftaran akun; akun & perangkat disediakan admin/vendor (GenZys).
**AC**: Given pengguna baru, When buka app, Then tidak ada opsi registrasi/sign-up — hanya login dengan kredensial yang diberikan (mirror FRD-M01-04).

## Wording
- "PIN atau kode salah. Silakan coba lagi."
- "Terlalu banyak percobaan. Coba lagi dalam {n} menit."
- "Akun diblokir: SIM Anda telah kedaluwarsa. Hubungi supervisor."

---

## Terhubung ke Dokumen Desktop (Sistem)
> Mirror FRD desktop di bawah; layar mobile = slice driver-only.

| Dokumen Desktop | Tautan |
|---|---|
| FRD modul M01 | [prd/frd/FRD-M01-Auth-Access.md](../../../prd/frd/FRD-M01-Auth-Access.md) |
| PRD modul | [M01](../../../prd/PRD-M01-Access-Organization.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](../prd/PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
