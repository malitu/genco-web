import './globals.css';

export const metadata = {
  title: 'GENCO | Uluslararası İş Geliştirme Ortağınız',
  description: 'Sadece danışmanlık değil, ticaret yaratır.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        {/* Tasarım motorunu doğrudan internetten çeken kesin çözüm */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}