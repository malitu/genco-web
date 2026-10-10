import React from 'react';

export default function MethodPage() {
  return (
    <div className="bg-[#fafafa] text-[#1e293b] antialiased min-h-screen">
      
      {/* TAM NAVİGASYON */}
      <nav className="bg-white border-b border-gray-200 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
                <a href="/" className="text-2xl font-bold text-[#0f172a] tracking-tight">GENCO</a>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-semibold text-gray-600">
                <a href="/services" className="hover:text-[#f97316] transition">Hizmetler</a>
                <a href="/industries" className="hover:text-[#f97316] transition">Sektörler</a>
                <a href="/case-studies" className="hover:text-[#f97316] transition">Vaka Analizleri</a>
                <a href="/insights" className="hover:text-[#f97316] transition">Trade Intelligence</a>
                <a href="/about" className="hover:text-[#f97316] transition">Hakkımızda</a>
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-gray-800 cursor-pointer hover:text-[#f97316]">TR</span>
                <span className="text-xs font-bold text-gray-400">|</span>
                <span className="text-xs font-bold text-gray-400 cursor-pointer hover:text-[#f97316]">EN</span>
                <a href="/contact" className="bg-[#f97316] text-white px-5 py-2 text-sm font-bold rounded hover:bg-orange-600 transition shadow-sm ml-2">
                    Proje Başlatın
                </a>
            </div>
        </div>
      </nav>

      <header className="py-24 bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-[#f97316] font-bold tracking-wider text-sm mb-4 uppercase">Nasıl Çalışıyoruz?</span>
            <h1 className="text-5xl font-bold leading-tight mb-6">The GENCO Method</h1>
            <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
                İzmir merkezli bir danışmanlık firması olmanın ötesinde; araştıran, bağlayan, uygulayan ve büyüten aktif bir ticari iş geliştirme sürecini benimsiyoruz.
            </p>
        </div>
      </header>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="border-l-4 border-[#f97316] pl-6">
                    <div className="text-[#f97316] font-bold text-xl mb-2">01. Research (Araştırma)</div>
                    <h3 className="text-2xl font-bold text-[#1e293b] mb-4">Veri odaklı pazar ve hedef analizi.</h3>
                    <p className="text-gray-600">Hedef pazarın, potansiyel ithalatçıların veya üreticilerin derinlemesine haritalanması. Jenerik listeler yerine, doğrudan karar vericileri (C-level ve Satın Alma) tespit ediyoruz.</p>
                </div>
                <div className="border-l-4 border-[#f97316] pl-6">
                    <div className="text-[#f97316] font-bold text-xl mb-2">02. Connect (İletişim)</div>
                    <h3 className="text-2xl font-bold text-[#1e293b] mb-4">Stratejik B2B erişim.</h3>
                    <p className="text-gray-600">Tespit edilen karar vericilere yönelik özelleştirilmiş soğuk erişim (cold outreach) ve B2B iletişim stratejileri ile nitelikli ticari görüşmeler başlatıyoruz.</p>
                </div>
                <div className="border-l-4 border-[#f97316] pl-6">
                    <div className="text-[#f97316] font-bold text-xl mb-2">03. Execute (İcraat)</div>
                    <h3 className="text-2xl font-bold text-[#1e293b] mb-4">Masada ve sahada yönetim.</h3>
                    <p className="text-gray-600">Fiyatlandırma, numune yönetimi, sertifikasyon takibi ve ticari müzakerelerin yürütülerek siparişin başarıyla kapatılması.</p>
                </div>
                <div className="border-l-4 border-[#f97316] pl-6">
                    <div className="text-[#f97316] font-bold text-xl mb-2">04. Grow (Büyütme)</div>
                    <h3 className="text-2xl font-bold text-[#1e293b] mb-4">Sürdürülebilir ağ inşası.</h3>
                    <p className="text-gray-600">Tek seferlik satışlar yerine, süreklilik sağlayan uluslararası distribütörlük ve tedarik ağlarının yönetilmesi.</p>
                </div>
            </div>
        </div>
      </section>

    </div>
  );
}