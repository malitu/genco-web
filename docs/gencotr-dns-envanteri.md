# gencotr.com — DNS Kayıt Envanteri

**Alındığı tarih:** 5 Ekim 2026
**Kaynak:** `ns1/2/3.wordpress.com` (WordPress.com DNS)

> Bu dosya, isim sunucuları Vercel'e taşınırken DNS kayıtlarını
> yeniden yaratmak için hazırlandı. **Taşınmadan önce doğrulayın.**

---

## 1. Mevcut kayıtlar (taşıma anındaki durum)

### NS
```
ns1.wordpress.com
ns2.wordpress.com
ns3.wordpress.com
```

### A
```
@    192.0.78.24
@    192.0.78.25
```

### CNAME
```
www    gencotr.com
```

### MX — e-posta (Titan Email) ⚠️ KRİTİK
```
@    mx1.titan.email    öncelik 10
@    mx2.titan.email    öncelik 20
```

### TXT
```
@            v=spf1 include:spf.titan.email ~all
_dmarc       v=DMARC1;p=none;sp=none;adkim=r;aspf=r;pct=100
```

### DKIM
Bilinen seçicilerde (`default`, `mail`, `titan`, `dkim`, `k1`, `s2`,
`google`, `zoho`, `mailgun`, `sendgrid`, `microsoft`...) **kayıt bulunamadı.**

→ Titan panelinde DKIM **açık değil** ya da özel bir seçici adı
kullanılıyor. Taşıma sonrası gelen maillerin spam'e düşmemesi için
Titan panelinden kontrol edilmeli.

### CAA
Kayıt yok. (Taşımada gerekmiyor.)

---

## 2. Vercel'e taşırken yeniden yaratılacak kayıtlar

### A. Site (Vercel nameserver kullanılırsa Vercel kendisi ekler)

| Tip | Ad | Değer |
|---|---|---|
| A | @ | Vercel otomatik ekler |
| CNAME | www | Vercel otomatik ekler (`af3297a349b7eb6b.vercel-dns-017.com`) |

> Proje ayarındaki **Vercel DNS** sekmesinde verilen değerler.
> Nameserver yöntemi seçilirse bu kayıtlar Vercel tarafından
> otomatik oluşturulur.

### B. E-posta — **mutlaka elle eklenmeli**

Vercel DNS → Domains → `gencotr.com` → DNS Records bölümüne:

| Tip | Ad | Değer | Öncelik |
|---|---|---|---|
| MX | @ | `mx1.titan.email` | 10 |
| MX | @ | `mx2.titan.email` | 20 |
| TXT | @ | `v=spf1 include:spf.titan.email ~all` | — |
| TXT | _dmarc | `v=DMARC1;p=none;sp=none;adkim=r;aspf=r;pct=100` | — |

---

## 3. Taşıma sırası (doğru sıra önemli)

1. Vercel'e `gencotr.com` + `www.gencotr.com` **eklendi** ✅
2. Kayıtçıda isim sunucuları `ns1.vercel-dns.com` / `ns2.vercel-dns.com`
   olarak değiştirilir
3. **Hemen ardından** Vercel DNS'e MX + SPF + DMARC kayıtları eklenir
4. DNS yayılması beklenir (1–48 saat, genelde 1–2 saat)
5. Vercel SSL sertifikasını otomatik alır
6. Kontrol: `nslookup -type=mx gencotr.com` → Titan MX'leri görünmeli

> ⏱️ 2. ve 3. adım arasında e-posta birkaç dakika kesilir.
> Bu süreyi minimize etmek için 3. adımı NS değişikliğinden
> hemen sonra yapın.

---

## 4. Geri dönüş planı

Alan adı kayıtçıda silinmemeli. DNS'i geri `ns1/2/3.wordpress.com`
yapmak eski WordPress sitesini geri getirir.
