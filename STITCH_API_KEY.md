# Panduan API Key Google Stitch

Panduan langkah demi langkah untuk membuat dan memakai API key Google Stitch
di agent / MCP client (OpenCode, Claude Code, dsb).

## 1. Buat API key di Stitch (via browser)

1. Buka **https://stitch.withgoogle.com/** dan login dengan akun Google.
2. Klik **profile picture** (pojok kanan atas) → **Stitch settings**.
3. Pilih tab **API keys** (bagian Integrations).
4. Klik **Create key**.
5. Beri nama key, misal `opencode-agent`.
6. **Salin key-nya sekarang** — hanya ditampilkan satu kali.
   Format-nya kira-kira `AIza...` (39 karakter).

> Catatan: menu ini butuh project Stitch yang sudah dibuat. Jika belum ada
> project, buat satu dulu lewat tombol **New project**.

## 2. Simpan key sebagai environment variable (Windows / PowerShell)

**Sesi ini saja (cepat, hilang saat terminal ditutup):**

```powershell
$env:STITCH_API_KEY = "TEMPEL_KEY_DI_SINI"
```

**Permanent (tersimpan untuk semua sesi berikutnya):**

```powershell
[Environment]::SetEnvironmentVariable("STITCH_API_KEY", "TEMPEL_KEY_DI_SINI", "User")
```

Setelah set permanent, **restart terminal / OpenCode** supaya env var terbaca.

Verifikasi:

```powershell
echo $env:STITCH_API_KEY
```

## 3. Endpoint MCP Stitch

| Item | Nilai |
|------|-------|
| URL | `https://stitch.googleapis.com/mcp` |
| Header auth | `X-Goog-Api-Key: $STITCH_API_KEY` |
| Transport | Streamable HTTP |

Contoh tes manual dengan curl:

```powershell
curl -X POST https://stitch.googleapis.com/mcp `
  -H "Content-Type: application/json" `
  -H "Accept: application/json, text/event-stream" `
  -H "X-Goog-Api-Key: $env:STITCH_API_KEY" `
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}'
```

Jika response berisi `serverInfo` → key valid. Jika `401/403` → key salah atau
belum aktif.

## 4. Pakai di OpenCode

File `.opencode/opencode.json` di root project ini sudah disiapkan dengan
konfigurasi MCP Stitch. Restart OpenCode, lalu cek tool `stitch` tersedia.

## 5. Pakai di Claude Code (alternatif)

```powershell
claude mcp add --transport http stitch https://stitch.googleapis.com/mcp `
  --header "X-Goog-Api-Key: $env:STITCH_API_KEY"
```

## Catatan keamanan

- API key adalah **secret**. Jangan commit ke git. File `.env` / config lokal
  yang memuat key harus masuk `.gitignore`.
- Jangan paste key di chat publik / screenshot.
- Untuk rotasi: kembali ke Stitch settings → API keys → **Delete** lalu buat
  key baru.

## Troubleshooting

| Gejala | Solusi |
|--------|--------|
| `401/403 Unauthorized` | Key salah, belum aktif, atau env var belum kebaca (restart terminal). |
| Env var tidak terbaca di OpenCode | Set permanent (`User`) lalu restart aplikasi, bukan cuma sesi. |
| Remote URL MCP gagal / OAuth error | Beberapa client belum support HTTP transport + API key. Fallback: pakai proxy stdio lokal `npx -y stitch-mcp` (butuh `STITCH_API_KEY` di env). |
| Tool tidak muncul | Cek `opencode mcp list` / restart session. |
