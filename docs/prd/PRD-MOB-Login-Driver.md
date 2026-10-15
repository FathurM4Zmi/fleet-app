---
tags: [PRD, Mobile, Driver, Auth]
category: Mobile
related: [[PRD-Mobile-Driver-App]] [[FRD-MOB-Login-Driver]]
---

# PRD-MOB — Login Driver (PIN/OTP/QR)

**[PRD-MOB-01]** - Login Driver
**Modul Sumber**: M01 (Auth, RBAC & Access) · **Folder BE**: `AccessOrganization`
**Platform**: Mobile · **Persona**: R6 Driver · **Prioritas**: Phase 1
**FRD**: FRD-M01-02 (Login driver), FRD-M01-03 (Forgot/Reset)
**BRD-Mobile**: MBR-001, MBR-026 · [BRD-Mobile.md](../BRD-Mobile.md)

---

## Tujuan
Driver masuk ke app dengan cara cepat & aman di lapangan: PIN, OTP, atau scan QR — bukan email/password yang merepotkan.

> **Model akun (B2B)**: akun & perangkat disediakan oleh admin/vendor (GenZys). App **tidak** punya
> registrasi mandiri (self-registration) — driver hanya login dengan kredensial yang diberikan.

## Alur & Layar
1. Splash → cek session tersimpan (auto-login bila token valid).
2. Pilih metode: **PIN** (6 digit) / **OTP** (SMS/WA) / **QR** (scan dari device terdaftar).
3. Validasi → cek status driver aktif & SIM belum expired.
4. Sukses → langsung ke Driver App Home. Gagal → pesan jelas.

## Spesifikasi Fungsional
| Fitur | Detail |
|---|---|
| Auto-login | Token JWT tersimpan di secure storage; refresh bila belum expired |
| PIN login | 6 digit; lock sementara setelah 5x gagal (FRD-M01-01 pola) |
| OTP | Kirim ke nomor terdaftar; berlaku 15 menit (FRD-M01-03) |
| QR login | Scan QR sekali-pakai dari device supervisor/ops |
| Guard | Driver non-aktif / SIM expired → ditolak dengan alasan (FRD-M03-03) |

## Acceptance Criteria
- Given driver aktif & SIM valid, When scan QR / masukkan PIN benar, Then masuk ke Driver App Home (FRD-M01-02).
- Given PIN salah 5x, When submit ke-6, Then akun dikunci sementara + notifikasi (FRD-M01-01).
- Given SIM expired, When login, Then ditolak dengan pesan status lisensi.

## Wording (Microcopy)
- Gagal: "PIN atau kode salah. Silakan coba lagi."
- Terkunci: "Terlalu banyak percobaan. Coba lagi dalam {n} menit."
- SIM expired: "Akun diblokir: SIM Anda telah kedaluwarsa. Hubungi supervisor."

## Non-Fungsional
- Cold start ke layar login < 3 detik.
- Kredensial/token di secure storage (Keychain/Keystore), bukan cleartext.

## Dependency
M01 backend (auth endpoint), M03 (status driver & lisensi).

---

## Terhubung ke Dokumen Desktop (Sistem)
> Layar ini adalah **slice driver-only** dari modul desktop di bawah. Fungsi admin modul tersebut tidak ada di mobile.

| Dokumen Desktop | Tautan |
|---|---|
| PRD modul M01 | [prd/PRD-M01-Access-Organization.md](../../../prd/PRD-M01-Access-Organization.md) |
| FRD modul M01 | [prd/frd/FRD-M01-Auth-Access.md](../../../prd/frd/FRD-M01-Auth-Access.md) |
| BRD mobile | [BRD-Mobile.md](../BRD-Mobile.md) |
| FRD induk | [FRD.md](../../../FRD.md) |
| Peta modul | [MODULE-MAP-v2.md](../../../MODULE-MAP-v2.md) |
| PRD mobile induk | [PRD-Mobile-Driver-App.md](PRD-Mobile-Driver-App.md) |
| Peta relasi | [RELASI-MOBILE-DESKTOP.md](../RELASI-MOBILE-DESKTOP.md) |
