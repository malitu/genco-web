# GENCO B2B Platform - Full Source Code

Bu paket, GENCO'nun yeni nesil web platformunu ve yönetim panelini (CMS) içermektedir.

## Özellikler
- **Frontend:** Next.js (React) ve Tailwind CSS (Yüksek SEO ve hız performansı).
- **Backend / Veritabanı:** Firebase Firestore (İçerikler için).
- **Dosya Depolama:** Firebase Storage (Logo ve görseller için).
- **Kimlik Doğrulama:** Firebase Auth (Sadece yöneticilerin erişebilmesi için şifreli giriş).

## Nasıl Çalıştırılır / Yayına Alınır?

1. Node.js yüklü olduğundan emin olun.
2. Terminali açın ve projenin klasörüne girin.
3. `npm install` komutunu çalıştırarak gerekli paketleri indirin.
4. `src/lib/firebase.js` dosyasına kendi Firebase proje anahtarlarınızı girin.
5. Geliştirme ortamında test etmek için: `npm run dev` komutunu çalıştırın.
   - Açık Site: http://localhost:3000
   - Admin Paneli: http://localhost:3000/admin
6. **Canlıya Almak İçin:** Projeyi **Vercel** veya **Firebase Hosting** üzerinden ücretsiz ve saniyeler içinde canlıya (`gencotr.com`) alabilirsiniz.
