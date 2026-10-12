# İletişim Formu — Web3Forms engellendi (2026-10-12)

## Durum

Site yayında ve tüm anahtarlar Vercel'e tanımlandı, ancak form
gönderimleri **çalışmıyor**.

## Ölçülen kanıt

```
1. Form gönderimi  -> HTTP 502
2. Yanıt           -> {"ok":false,"fallback":true,
                      "error":"Mesaj gönderilemedi..."}
3. Vercel logu     -> "Web3Forms reddetti: 403"
4. Doğrudan test   -> Cloudflare: "Just a moment...
                      Enable JavaScript and cookies to continue"
```

## Kök neden

`api.web3forms.com`, Cloudflare bot korumasının arkasında. Web3Forms
API'sine **sunucudan** giden istekleri (bot gibi göründükleri için)
reddediyor.

```
Tarayıcı  ──> kendi formu  ──> api.web3forms.com    ✅ (çalışır)
Sunucu   ──> /api/contact  ──> api.web3forms.com    ❌ 403 (Cloudflare)
```

Vercel'den giden istek Cloudflare'ın "bot" kuralına takılıyor. Bu bir
anahtar hatası değil; Web3Forms'ın kendi kısıtlaması.

Yerel `.env.local`deki anahtar Web3Forms panelindekiyle **aynı**
(36 karakter, `6e9f568a-...`), panelde alıcı `info@gencotr.com`
olarak doğru ayarlanmış, "Total Submissions: 7" (geçmişte çalışmış).
Yani hesap ve anahtar tarafı sağlam.

## Etkisi

- Ziyaretçi formu doldurur, "başarılı" mesajı görür
- **E-posta gönderilmez**
- Bu sessiz bir hatadır; sunucu günlüğüne düşer ama kullanıcıya yansımaz

## Çözüm seçenekleri

### 1. Formu tarayıcıdan göndermek (en küçük değişiklik)

`src/app/api/contact/route.js` yerine doğrudan tarayıcıdan
`https://api.web3forms.com/submit` adresine POST yapılır. Tarayıcı
gerçek bir kullanıcı olduğu için Cloudflare engeli geçilir.

Yan etkileri:
- Turnstile token'ı zaten tarayıcıda üretiliyor, akış korunur
- Gizli anahtar (`WEB3FORMS_KEY`) istemciye gitmek zorunda kalır
  → anahtar istemci tarafında görünür hale gelir
  → Web3Forms anahtarı bu yüzden "gizli" sayılan bir şey değil;
  dokümantasyonda da istemcide kullanılması önerilir
- Rate limit sunucuda kalır (mevcut `rateLimit` koruması bozulmaz)

### 2. Kendi SMTP üzerinden göndermek (en sağlam)

Sunucuda Nodemailer + Titan SMTP. `MX` kayıtları zaten Titan'da ve
çalışıyor (bu taşıma sırasında korundu). Anahtar, gizlilik, rate limit
tamamen bizim kontrolümüzde olur.

Titan'dan giden e-posta `gencotr.com` alan adından gelir; SPF/DKIM
zaten tanımlıysa teslim sorunu olmaz.

### 3. Web3Forms Pro planı

Ücretli planda bu kısıtlama kalkıyor.

## Öneri

**Seçenek 2** (kendi SMTP). Nedenleri:
- Sunucudan gönderim korunur, Cloudflare engeline takılmaz
- Gizli anahtar istemciye sızmaz
- Üçüncü taraf bir servise ve ona verilecek anahtara bağımlılık kalmaz
- Titan zaten alan adının e-posta sağlayıcısı; ek maliyet yok

Seçenek 1 daha hızlıdır ama anahtar istemciye açılır ve Web3Forms'a
bağımlılık sürer.

## Uygulama için gerekenler (seçenek 2)

```
Titan SMTP ayarları:
  sunucu : smtp.titan.email
  port   : 465 (TLS) veya 587 (STARTTLS)
  kullanıcı: info@gencotr.com   (veya tam adres)
  şifre  : Titan panelinde üretilen uygulama şifresi
```

Bu bilgiler gelince `src/app/api/contact/route.js` Web3Forms yerine
Nodemailer kullanacak şekilde değiştirilir; geri kalanı aynı kalır.

## Doğrulama (çözüm sonrası)

```
1. https://www.gencotr.com/contact adresinden form doldurulur
2. info@gencotr.com'a e-posta düştüğü doğrulanır
3. Web3Forms panelinde yeni gönderim görünür (seçenek 1 ise)
4. npm run dogrula -- https://www.gencotr.com  -> 52 kontrol · 0 hata
```