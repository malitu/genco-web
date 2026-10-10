# Yayın Öncesi Kontrol Listesi — GENCO

**Son güncelleme:** 2026-07-11
**Durum:** Site teknik olarak hazır. Aşağıdaki 3 kalem kullanıcıya bağlı.

> Bu dosya her oturumun başında kontrol edilir. Kullanıcı "kontrol listesine bak"
> derse veya yeni bir iş başlatıldığında güncellenir.

---

## ⏳ Bekleyen 3 kalem

### 1. GA4 (Google Analytics 4) ölçüm kimliği

**Neden:** Trafik ölçümü kurulmadan "hangi sayfa işe yarıyor", "AI aramalarından
mı geliyor" soruları yanıtlanamaz. Geçmiş veri geriye dönük çıkarılamaz — bu
yüzden **yayından önce** kurulması gerekir.

**Altyapı hazır:** `src/components/Analytics.jsx` eklendi ve iki durumu da test
edildi — kimlik tanımlıyken TR + EN ölçülüyor, `/admin` ölçülmüyor. `.env.example`
içinde `NEXT_PUBLIC_GA_ID` tanımlı. Kullanıcı yalnızca değeri tanımlamalı.

| Adım | İş | Durum |
|---|---|---|
| 1 | [analytics.google.com](https://analytics.google.com) → **Yönetici** → **Mülk oluştur** → Web | ⬜ |
| 2 | Mülk adı + web sitesi adresi gir (`https://www.gencotr.com`) | ⬜ |
| 3 | **Ölçüm Kimliği**ni kopyalayın (`G-XXXXXXX`) | ⬜ |
| 4 | Vercel → proje → **Settings → Environment Variables** → `NEXT_PUBLIC_GA_ID` = `G-XXXXXXX` | ⬜ |
| 5 | **Production** ve **Preview** için ekleyin, sonra yeniden dağıt | ⬜ |
| 6 | analytics.google.com → **Canlı** sekmesi → kendinizi ziyaret edin → gerçek zamanlı veri akışı | ⬜ |

**Kontrol:** Adım 6'da gerçek zamanlı akışta kendi ziyaretiniz görünmeli.

---

### 2. Domain taşıma (NETDIREKT)

**Neden:** Alan adı hâlâ `ns1/2/3.wordpress.com` üzerinde; `gencotr.com`
eski WordPress sitesini gösteriyor. Site Vercel'de hazır ama alan adı taşınmadı.

| Durum | Değer |
|---|---|
| Kayıt sorumlusu | Şirket (bize "domain'i size devrettik" denmiş ama panele erişim yok) |
| Registrar aracısı | NETDIREKT A.Ş. (OnlineNIC "bizim bayi" dedi) — `netdirekt.com.tr/iletisim.html`, 0481 451 76 10 |
| Mevcut NS | `ns1/2/3.wordpress.com` |
| Mevcut A kayıtları | `192.0.78.24`, `192.0.78.25` |
| Kilit | `clientTransferProhibited` |
| Site durumu | 200 (WordPress), e-posta Titan MX ile çalışıyor |
| Kayıt tarihi | 2008-07-14 → bitiş 2028-07-14 |

**Gönderilecek e-posta taslağı:** `docs/onlinic-e-posta-taslagi.md`
(2026-07-11 itibarıyla yanıt bekleniyordu; hafta sonu gönderilmiş olabilir.)

**Firmaya iletilecek DNS değişiklikleri:**

```
A kaydı  @     →  216.198.79.1
CNAME    www   →  af3297a349b7eb6b.vercel-dns-017.com
SİL             192.0.78.24
SİL             192.0.78.25
DOKUNMA         MX · TXT · DKIM · SPF   (Titan e-posta)
```

> ⚠️ MX kayıtları WordPress Hosting'te tanımlı. Silinirse `info@gencotr.com`
> ölür. DNS değişikliği acele ettirmeyin.

**Taşıma sonrası tek kontrol:**
`nslookup -type=mx gencotr.com` → `mx1/mx2.titan.email` görmeli.

---

### 3. www / çıplak domain tutarlılığı (yayın anında)

**Neden:** Eski sitenin sitemap'inde adres `gencotr.com` (**www'siz**) olarak
yazıyordu. Yeni sitede `www.gencotr.com` varsayılan. İkisi de 200 dönerse
Google aynı sayfanın iki kopyası olduğunu sanar (duplicate content) ve
sıralama ikiye bölünür.

**Karar:** Tek yön seçilmeli. Öneri → **`www.gencotr.com` birincil**,
`gencotr.com` → `www`'ye **308** yönlendirmeli.

**Yapılacak:**
- [ ] Vercel'de alan adı eklenirken `www.gencotr.com` birincil seçilir
- [ ] DNS `A`/`CNAME` kayıtları yukarıdaki gibi girilir
- [ ] Vercel otomatik `gencotr.com → www.gencotr.com` yönlendirmesini kurar
- [ ] `https://gencotr.com` **308** → `https://www.gencotr.com` doğrulanır
- [ ] `https://www.gencotr.com` **200** doğrulanır
- [ ] Search Console'da **alan adı özelliği** alınır (https bile www için, https://)

**Vercel'de kontrol:** `NEXT_PUBLIC_SITE_URL` = `https://www.gencotr.com`
olmalı. Yanlışsa canonical/sitemap kalıcı olarak yanlış adresi bildirir.

---

## ✅ Tamamlananlar (arşiv)

| İş | Commit |
|---|---|
| `/en/` mimarisi — 16 adres, hreflang, sitemap, `html lang` | `28f705d` |
| `/admin` ve 404 sayfası düzeltildi (route group kapsam dışı bırakmıştı) | `19e7363` |
| Instagram rozeti + `sameAs` | `f022e79` |
| EN bağlantıları, eski URL yönlendirmeleri, metin temizliği, GA4 yuvası | `ace8a0e` |
| Mobil hamburger menü | `c4eca6b` |
| Footer LinkedIn rozeti | `12c99fc` |
| Stats bandı ana sayfada yukarı taşındı | `c4eca6b` |
| Domain taşıması | ⏳ |

---

## 📌 Sonraki büyük işler (yayını engellemez)

- Somut vaka analizleri (şu an yalnız sektör/pazar/kapsam)
- Ayrıntılı hizmet detay sayfaları (`/services` tek sayfada toplu)
- LinkedIn ve Instagram profillerine `gencotr.com` bağlantısı (backlink)
- Tümİşyeri dizin kaydındaki eski telefon/adres güncellemesi