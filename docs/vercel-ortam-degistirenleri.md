# Vercel Ortam Değişkenleri — Yapılacaklar

Site yayında: `https://www.gencotr.com` (NS kayıtları `ns1/ns2.vercel-dns.com`,
e-posta MX kayıtları Titan'da, dokunulmadı).

Bu dosya, Vercel'de tanımlanması gereken değişkenleri ve nasıl
tanımlanacağını tek yerde toplar. Her adım sonrası `npm run dogrula`
çalıştırılır.

---

## Nerede tanımlanır

```
Vercel → projeniz → Settings → Environment Variables → Add Variable
```

Her değişken için **Production** ve **Preview** kutularını işaretleyin
(Preview'ı işaretlemezseniz bir sonraki dağıtımda değer kaybolur).

Değişken ekledikten sonra **yeniden dağıtım** gerekir — mevcut dağıtım
değişkeni almaz:

```
Deployments → en üstteki dağıtım → ⋮ → Redeploy
```

---

## 1) NEXT_PUBLIC_SITE_URL  (zorunlu)

| | |
|---|---|
| **Değer** | `https://www.gencotr.com` |
| **Ortam** | Production ✓ · Preview ✓ |
| **Sonunda eğik çizgi olmasın** | `https://www.gencotr.com/` ← YANLIŞ |

**Ne yapıyor:** `src/lib/seo.js` içindeki `SITE_URL` bunu okur. Metadata,
`canonical`, `hreflang`, `sitemap.xml`, `robots.txt`, Open Graph ve JSON-LD
`@id` adreslerinin hepsi buradan üretilir. Yanlışsa arama motorları siteni
`vercel.app` adresiyle kaydeder.

**Şu anki durum:** Bu değişken **hiçbir yerde tanımlı değil**. Canlıda doğru
görünmesinin sebebi `seo.js` içindeki geri düşüş sabiti:

```js
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.gencotr.com"
).replace(/\/+$/, "");
```

Yani site doğru çalışıyor ama adres **koda gömülü**. Vercel'de tanımlanınca
tek yerden değiştirilebilir olur. Kötü bir durum değil, sadece kırılgan.

**Doğrulama (dağıtımdan sonra):**

```bash
npm run dogrula -- https://www.gencotr.com
```

---

## 2) NEXT_PUBLIC_GA_ID  (isteğe bağlı — trafik ölçümü)

| | |
|---|---|
| **Değer** | `G-XXXXXXXXXX` (GA4 ölçüm kimliği) |
| **Ortam** | Production ✓ · Preview ✓ |
| **Şimdilik** | Tanımlı değil — trafik kaydı tutulmuyor |

**Nasıl alınır (ücretsiz, ~5 dakika):**

1. `https://analytics.google.com` → sol altta **Yönetici**
2. **Mülk oluştur** → *Web sitesi*
3. **Mülk adı:** `GENCO` · **Web sitesi adresi:** `gencotr.com`
   → İkinci kutuya (Alan adı) `gencotr.com` da yazın.
4. Oluştur → **Yönetici → Mülk ayarları → Mülk kodu**
5. **Ölçüm Kimliği**'ni kopyalayın — `G-` ile başlayan bir kod.
   *(Not: Bu "Ölçüm Kimliği"dir; "Mülk Kimliği" (`UA-…`) değil.)*
6. Bu kodu Vercel'e `NEXT_PUBLIC_GA_ID` olarak ekleyin, yeniden dağıtın.

**Ne yapıyor:** `src/components/Analytics.jsx` iki kök düzende de bağlı
(TR ve EN), böylece İngilizce trafik de raporlanır. `/admin` ve 404 sayfası
bilerek **ölçülmez**.

**Şu an:** Değişken tanımlı değil → analiz kodu hiç yüklenmiyor → site normal
çalışıyor. Bu, "kod bozuk" riskini sıfırlar.

**Doğrulama (dağıtımdan sonra):**

```bash
curl -s https://www.gencotr.com | Select-String "googletagmanager"
```

Sonra `analytics.google.com` → **Realtime**'e girip siteyi aç; kendi
ziyaretini görüyorsan bağlantı tamam.

---

## 3) Şifreli anahtarlar (zaten yerelde tanımlı)

Bunlar **istemciye gönderilmez**, sadece sunucuda kullanılır. Vercel'de
tanımlı olmalıdır; tanımlı değilse ilgili özellik sessizce çalışmaz.

| Değişken | Etkisi | Tanımlı mı? |
|---|---|---|
| `WEB3FORMS_KEY` | İletişim formu e-postayı gönderir | Bilinmiyor — **kontrol edin** |
| `TURNSTILE_SECRET_KEY` | Captcha doğrulaması (sunucu) | Bilinmiyor — **kontrol edin** |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Captcha görünür | Bilinmiyor — **kontrol edin** |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Panelden eklenen özel sayfalar | Sabit kodda da var |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Aynı | Sabit kodda da var |

**İletişim formunu canlıda test edin:** `https://www.gencotr.com/contact`
→ bir mesaj gönderin → `info@gencotr.com` adresine gelip gelmediğini
doğrulayın. Gelmiyorsa `WEB3FORMS_KEY` tanımlı değildir.

---

## Yayın sonrası tek satır doğrulama

```
npm run dogrula -- https://www.gencotr.com
```

Beklenen: **52 kontrol · 0 hata · SONUÇ: TAMAM**

---

## Sırlar ve güvenlik

- `NEXT_PUBLIC_` ile başlayanlar **tarayıcıya gönderilir**. Sadece gizli
  olmayanlar için kullanılır (GA kimliği, site adresi, Firebase proje kimliği).
- Gerçek anahtarlar `.env.local` dosyasında durur; bu dosya Git'e girmez
  (`.gitignore` içinde).
- Şablon dosya: `.env.example` — anahtarların ne olduğu burada yazılıdır.
- Listeyi görmek için: `node scripts/env-kontrol.mjs`