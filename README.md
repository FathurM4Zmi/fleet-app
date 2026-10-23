# GenZys FleetOps — Driver App

Aplikasi mobile driver GenZys FleetOps. Dibangun dengan **React Native + Expo SDK 57**
(Expo Router, TypeScript), bukan Flutter. Seluruh layar membaca data dari API backend
`/api/driver` — tidak ada data fixture di dalam aplikasi.

## Menjalankan

```bash
npm ci
cp .env.example .env    # isi EXPO_PUBLIC_API_URL bila backend bukan di localhost
npx expo start          # dev server
npx expo start --android
npx expo start --ios
npx tsc --noEmit        # typecheck
npx expo lint           # lint
npm test                # unit tests (Jest + React Native Testing Library)
```

Untuk build EAS, `EXPO_PUBLIC_API_URL` **wajib** diisi (mis. lewat environment
variable di profil EAS). Build produksi akan gagal cepat bila variabel ini kosong
agar aplikasi tidak diam-diam menembak `localhost`.

`EXPO_PUBLIC_API_URL` adalah satu-satunya konfigurasi backend. Bila kosong:

1. host LAN dari dev server Expo dipakai (agar perangkat fisik bisa menghubungi
   `dotnet run` di mesin yang sama), lalu
2. `http://10.0.2.2:5196` di emulator Android, atau
3. `http://127.0.0.1:5196` di iOS/web.

## Struktur

- `src/app/` — route Expo Router (setiap file = layar), 47 route
- `src/components/` — komponen UI + design system
- `src/data/` — tipe domain, adapter DTO→view model, checklist DVIR, konstanta UI
- `src/hooks/api/` — query per layar (`useHome`, `useTripDetail`, …)
- `src/lib/api/` — client HTTP, tipe wire, endpoint bertipe
- `src/lib/offline/` — outbox AsyncStorage untuk submit saat offline
- `src/lib/auth/` — sesi di SecureStore (Keychain/Keystore) + fallback web
- `src/store/` — auth context + draft form yang belum dikirim
- `src/theme/` — token warna, spacing, tipografi

## Alur data

1. `AuthProvider` menyimpan token; `src/lib/api/client.ts` membacanya di setiap request.
2. Setiap layar memakai hook di `src/hooks/api/useDriverData.ts`.
3. `src/data/adapters.ts` memetakan DTO backend ke view model layar (format rupiah,
   label status, enum lowercase).
4. Submit yang bisa offline (DVIR, POD, BBM, damage, insiden, koreksi odometer)
   diunggah fotonya dulu, lalu diantrekan di `src/lib/offline/queue.ts` bila jaringan
   gagal. Queue mencoba ulang maksimal 5 kali dan membuang error 4xx permanen.

## Dokumentasi

- `docs/API-CONTRACT.md` — peta layar → endpoint backend (50 endpoint driver-facing)
- `docs/BRD-Mobile.md`, `docs/prd/`, `docs/frd/` — BRD/PRD/FRD mobile
- `AGENTS.md` — aturan kerja untuk agen/AI
