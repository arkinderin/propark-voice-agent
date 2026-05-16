# Klinik Voice Agent — Kurulum Rehberi

## 1. Ortam Değişkenleri

`.env.local` dosyasını açıp şunları doldur:

| Değişken | Nereden |
|---|---|
| `DATABASE_URL` | [neon.tech](https://neon.tech) → yeni proje → connection string |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `VAPI_API_KEY` | [vapi.ai](https://vapi.ai) → Dashboard → API Keys |
| `VAPI_WEBHOOK_SECRET` | VAPI → Assistant → Webhooks |
| `WHATSAPP_META_TOKEN` | Meta Business → WhatsApp → API |
| `WHATSAPP_PHONE_NUMBER_ID` | Meta Business → WhatsApp |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `N8N_WEBHOOK_REMINDER` | n8n'de klinik-reminder workflow URL |
| `N8N_WEBHOOK_REVIEW` | n8n'de klinik-review workflow URL |
| `CRON_SECRET` | Rastgele string (min 32 karakter) |

## 2. Veritabanı Kurulumu

```bash
# Tabloları oluştur
npm run db:push

# Örnek veri yükle (3 doktor, 8 hizmet, 10 randevu)
npm run db:seed
```

## 3. n8n Workflow'ları İmport

1. n8n'i aç (cloud veya self-hosted)
2. **Settings → Import Workflow** 
3. `n8n/klinik-reminder.json` → WhatsApp credential bağla
4. `n8n/klinik-review.json` → WhatsApp credential bağla
5. `n8n/klinik-recall.json` → WhatsApp + Anthropic + Postgres credential bağla
6. Her workflow'u **aktif** et
7. Webhook URL'lerini `.env.local`'a yaz

## 4. VAPI Kurulumu

1. [vapi.ai](https://vapi.ai) → yeni Assistant oluştur
2. Model: GPT-4o (Realtime) + ElevenLabs Türkçe ses
3. System prompt: `lib/prompts/voice-agent.ts` içindeki metni yapıştır
4. Tools ekle:
   - `check_availability` → POST `https://YOUR_DOMAIN/api/vapi/availability`
   - `book_appointment` → POST `https://YOUR_DOMAIN/api/vapi/book`
   - `transfer_to_human` → built-in transfer
5. Webhook: Call Ended → `https://YOUR_DOMAIN/api/vapi/call-ended`
6. Phone number al ve kliniğe bağla
7. `.env.local`'a VAPI_ASSISTANT_ID ve VAPI_PHONE_NUMBER_ID yaz

## 5. Geliştirme Sunucusu

```bash
npm run dev
# http://localhost:3000
```

## 6. Vercel Deploy

```bash
# Vercel'e bağla
npx vercel

# Env değişkenlerini dashboard'dan ekle
# Otomatik cron: vercel.json'daki schedule ile çalışır
```

## Sayfa Haritası

| Sayfa | URL |
|---|---|
| Landing | `/` |
| Doktorlar | `/doktorlarimiz` |
| Hizmetler | `/hizmetler` |
| Randevu | `/randevu` |
| İletişim | `/iletisim` |
| Admin | `/admin` |
| Admin Randevular | `/admin/appointments` |
| Admin Aramalar | `/admin/calls` |

## API Endpoint'leri

| Endpoint | Metod | Açıklama |
|---|---|---|
| `/api/appointments` | POST | Randevu oluştur |
| `/api/appointments` | GET | Randevu listesi |
| `/api/appointments/[id]` | PATCH | Status/not güncelle |
| `/api/appointments/availability` | GET | Müsait saatler |
| `/api/triage` | POST | AI doktor/hizmet önerisi |
| `/api/vapi/availability` | POST | VAPI tool: müsait saatler |
| `/api/vapi/book` | POST | VAPI tool: randevu al |
| `/api/vapi/call-ended` | POST | VAPI webhook: çağrı bitti |
| `/api/cron/reminder` | GET | 24h hatırlatma cron |
| `/api/cron/reminder?type=2h` | GET | 2h hatırlatma cron |
| `/api/cron/review` | GET | Google review cron |
