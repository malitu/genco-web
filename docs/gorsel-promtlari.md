# Görsel Üretim Prompt'ları — GENCO

**Tarih:** 8 Ekim 2026
**Kullanım:** Aşağıdaki metinleri görsel üretim aracına (ChatGPT / DALL·E, Midjourney, Firefly) yapıştırın.

---

## 📐 Genel kurallar (her prompt için geçerli)

**Olması gerekenler**

| Kural | Neden |
|---|---|
| Görselin **içinde yazı/etiket/logo olmasın** | Metin AI görsellerinde bozuk çıkar; ayrıca iki dilli sitede yanlış dilde kalır |
| **Marka rengi:** turuncu `#f97316` sadece küçük detaylarda | Ana renk turuncu; fazlası amatör görünür |
| **Doğal ışık, gerçekçi**, stüdyo değil | Işık klişe görünürse "yapay" hissi verir |
| **Boş alan bırakın** (kadrajın %30'u) | Üzerine metin gelecek |
| Aynı **renk tonu** (soğuk gri-mavi, sıcak turuncu vurgu) | Altı sayfa birbirine benzemesin diye |

**Boyutlandırma** — bana verdiğiniz dosyayı ben WebP'ye çevirip boyutunu düşürürüm, siz sadece mümkün olan **en yüksek çözünürlüğü** indirin.

| Kullanım yeri | En-boy oranı | Önerilen px |
|---|---|---|
| Tam genişlik bant | 21:9 veya 16:9 | 2400×1200 |
| Metin + görsel (yan yana) | 4:3 | 1600×1200 |
| Kart görseli | 3:2 | 1400×933 |
| Mobil kapak | 4:5 | 1200×1500 |

---

## 🎯 Yoğunluk bütçesi — "boğmayalım" kuralı

Kural: **her 2 ekran için en fazla 1 görsel.** Ekstra görsel ancak o bölüm gerçekten "boş" hissediyorsa.

| Sayfa | Mevcut | **Hedef** | Nereye |
|---|---|---|---|
| `/` | 9 | **9** | Değişiklik yok ✅ |
| `/services` | 0 | **2–3** | 1 bant + 2 kart |
| `/industries` | 0 (6 SVG var) | **6** | Kart görselleri (SVG'lerin yerine) |
| `/case-studies` | 0 | **1–2** | Sadece üst bölüm |
| `/insights` | 0 | **1** | Üst bölüm |
| `/about` | 0 | **2** | 1 bant + 1 bölüm |
| `/method` | 0 | 1 | (sayfa önce düzeltilecek) |
| `/contact` | harita var | **0–1** | Gereksiz; harita yeterli |
| **Toplam** | | **13–16** | |

> **Kritik:** `/industries` dışındaki hiçbir sayfaya 6 görsel koymayın. Uzun metin sayfaları görselle boğulur, okuma kaybolur.

---

# 1️⃣ `/services` — 2–3 görsel

Sayfa şu an 6439px ve **tamamen metin**. En çok ihtiyaç duyan sayfa.

### 1-A. "Anahtar Teslim İthalat" bandı (tam genişlik)

> A realistic wide photograph of a busy export warehouse in Izmir, Turkey. A forklift is loading a wooden crate onto a waiting container truck. Two workers in high-visibility vests are checking a clipboard against the cargo. Soft morning daylight through tall windows. Cool grey-blue tones with a small orange accent on the safety vests. Documentary style, not staged. No text, no logos, no brand names. Empty space on the left third for overlaid text. 16:9.

### 1-B. Hizmet kartı görseli — dış kaynaklı ihracat

> A realistic photograph of two business professionals in a glass-walled office reviewing a laptop screen together, discussing international trade documents. The laptop content is not visible. Neutral modern office, cool grey tones, soft daylight from a window. Documentary corporate photography, candid, not posed. No text, no logos. 3:2.

### 1-C. Hizmet kartı görseli — tedarik ve üretici denetimi

> A realistic photograph of an inspector in a white coat and hairnet checking a stainless steel production line inside a clean food-safe manufacturing plant. Stainless steel surfaces, cool tones, bright even lighting. Industrial documentary photography, sharp detail, not staged. No text, no logos, no brand names. 3:2.

---

# 2️⃣ `/industries` — 6 kart görseli

Şu an 6 **çizgi çizim** (SVG) var. Bunların yerine fotoğraf isterseniz:

> **Not:** Mevcut SVG'ler tutarlı ve profesyonel görünüyor. Fotoğrafa geçerseniz kartlar birebir aynı ortak stile sahip olmalı — aşağıdaki 6 prompt tek bir stilde yazıldı.

### Ortak stil eklemesi (6 prompt'un sonuna ekleyin)

> Cinematic industrial photography, cool grey-blue palette with a single warm orange accent, consistent soft overcast lighting, no people facing camera, no text, no logos.

### 2-A. Vasıflı Çelik

> A realistic photograph of neatly stacked hexagonal steel bars at a port warehouse, shot from a low three-quarter angle. Cold metallic grey tones with a single orange painted band on one stack.

### 2-B. Yatçılık & Marine

> A realistic photograph of a marina at dusk with a moored motor yacht in the foreground, masts and rigging visible, calm water reflecting the sky. Cool blue tones, subtle warm lights.

### 2-C. Tohumculuk

> A realistic photograph of clean white seed packets and bulk seed samples arranged on a stainless steel laboratory bench, shallow depth of field, cool neutral tones.

### 2-D. Medikal & Cerrahi Sarf

> A realistic photograph of sterile surgical instrument sets arranged on a blue sterile drape in a bright operating-theatre preparation room, cool clinical tones, sharp detail.

### 2-E. Ambalaj

> A realistic photograph of a printing press in operation producing cardboard packaging, freshly printed carton sheets stacked beside it, industrial environment, cool grey tones with a warm orange carton accent.

### 2-F. Femtech & Sağlık

> A realistic photograph of a modern, minimalist gynaecological health device on a white seamless background, soft studio lighting, cool neutral palette, shallow depth of field.

---

# 3️⃣ `/case-studies` — 1–2 görsel

**Kritik uyarı:** 6 vaka var, 6 görsel koymayın. Bu sayfa metin ağırlıklı bir okuma sayfası. **Sadece üstte tek bir bant** yeter.

### 3-A. Sayfa üstü bandı (tam genişlik)

> A realistic wide photograph of a container ship's bow cutting through open water, viewed from slightly above, calm sea, overcast light, cool blue-grey tones with a small orange hull marking. Documentary maritime photography. No text, no logos, no ship names. Empty space on the left third. 16:9.

> **Alternatif (daha güvenli):** Boş bir liman apron'u, üst üste istiflenmiş konteynerler, üst kısımda geniş boş alan. Yükü belirsiz, kimliksiz.

---

# 4️⃣ `/insights` — 1 görsel

Analiz sayfası; okuma odaklı. Sadece üst bölüm.

### 4-A. Sayfa üstü bandı

> A realistic wide photograph of a steel mill interior, rows of glowing bars cooling on a conveyor, warm orange glow against cool grey industrial surroundings. Cinematic, shallow depth of field. No text, no people facing camera, no logos. Empty space on the left third. 16:9.

---

# 5️⃣ `/about` — 2 görsel

Kurumsal sayfa; güven ve ölçek anlatmalı.

### 5-A. Şirket/ekip bandı (tam genişlik)

> A realistic wide photograph of a modern trade company's operations floor in Izmir, Turkey: a bright open-plan office with people working at desks in the background, seen through a glass partition from a warehouse aisle in the foreground. Blurred foreground, sharp background, cool grey-blue tones, soft daylight. Documentary corporate photography. No text, no logos. Empty space on the left third. 16:9.

### 5-B. Detay görseli — malzeme seçimi

> A realistic photograph of a person's hands holding a piece of textured stone and a steel sample over a table of material swatches in a bright showroom, warm natural light, shallow depth of field, cool neutral tones with warm highlights. No faces visible. No text, no logos. 3:2.

---

# 6️⃣ `/contact` — 0–1 görsel

Harita zaten var. **Görsel eklemeyin.** Tek istisna: form yanına küçük bir ofis/depo karesi.

> A realistic photograph of a tidy export warehouse aisle in daylight, pallet racking with labelled cartons, cool grey tones, clean and orderly, no people. No text, no logos. 3:2.

---

# 7️⃣ `/method` — 1 görsel

> ⚠️ Bu sayfa önce blok sistemine taşınmalı (şu an bozuk). Sonra:

### 7-A. Süreç bandı

> A realistic wide photograph of a two-person team reviewing printed technical drawings and a physical metal sample side by side at a workbench, an engineer pointing at a dimension on the drawing, cool industrial tones, soft daylight. Documentary photography, hands and materials in focus, faces not identifiable. No text, no logos. 16:9.

---

# 🚫 Hareketli görsel (GIF) konusu

**ChatGPT/DALL·E GIF üretemez.** Statik görsel verir. Seçenekler:

| İstediğiniz | Nasıl |
|---|---|
| Kısa hareketli video | **Sora** veya **Veo** ile 5–10 sn üretin → mp4 → YouTube'e yükleyin → siteye embed |
| Fotoğraftan hareket | **Runway / Kling / Pika** — fotoğrafı yükleyip hafif hareket (kamera kayması) ürettirin |
| Gerçek operasyon videosu | **En iyisi.** Telefonla 20–30 sn çekin, YouTube'a yükleyin (gizlilik ayarı "herkese açık" değil, "gizli" olabilir — embed çalışır) |

**Video için 3 kural:**

1. **Vercel'de video barındırmayın.** Bant genişliği maliyeti yüksek. YouTube/Vimeo embed.
2. **Otomatik oynatma açık, ses kapalı** olmalı — zaten `media` bloğunda ayarlı.
3. **En fazla 1 video, sadece ana sayfada.** Uzun metinli sayfalarda video dikkat dağıtır.

### Ana sayfa için video prompt'u (Sora / Veo)

> Slow, steady tracking shot moving through an export warehouse aisle toward an open loading dock where a container truck is being loaded. Natural daylight, cool industrial tones, dust motes in the light beams. Documentary style, no people facing camera, no text, no logos. 10 seconds.

---

# 📋 Teslim sırası (bana gelince ne yapacağım)

1. **Dosyaları indirin** — en yüksek çözünürlük, PNG veya yüksek kaliteli JPEG
2. **Bana yolu verin** (masaüstüne kaydedin, yolu yazın)
3. Ben yapacağım:
   - WebP'ye çevirip 1600px'e küçültme (2 MB → ~90 KB)
   - `public/img/` altına yerleştirme
   - Doğru bloğa bağlama, 3:2 hizalama, `object-cover` kontrolü
   - TR/EN sayfa yapısında mobil görünümü test
   - Yedekte tutma (dosyalar silinmez)

---

# ⚠️ Son uyarı

Bu prompt'ların çoğu **yapay zekâ üretimi fotoğraf** verir. Yayına almadan önce şu testi yapın:

> Görseli büyütün ve bakın: parmak sayısı doğru mu, yüz ifadesi tutarlı mı, arka plan tutarlı mı, tekstürler doğal mı?

**Küçük bir hata bile B2B'de güven kırar.** Şüpheliyse kullanmayın — o bölümü görselsiz bırakmak, kötü bir görselden her zaman iyidir.