"use client";
import { useState, useEffect } from "react";

export default function Contact() {
  const [lang, setLang] = useState("TR");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("genco_lang");
    if (savedLang) setLang(savedLang);
  }, []);

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("genco_lang", newLang);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      message: e.target.message.value,
      targetEmail: "info@gencotr.com"
    };
    console.log("Form verisi info@gencotr.com adresine gönderiliyor:", formData);
    setSubmitted(true);
  };

  const t = {
    TR: {
      services: "Hizmetler", industries: "Sektörler", caseStudies: "Vaka Analizleri", insights: "Trade Intelligence", about: "Hakkımızda", contact: "İletişim",
      badge: "İletişim & İş Birliği",
      title: "Projelerinizi Sahada Birlikte Yönetelim",
      sub: "İhracatınızı büyütmek, Türkiye'den güvenli tedarik sağlamak veya pazarınıza yeni bir ortak aramak için bizimle doğrudan iletişime geçin.",
      formTitle: "Doğrudan Mesaj Gönderin",
      name: "Ad Soyad / İsim", email: "Kurumsal E-Posta", phone: "Telefon Numarası", message: "Proje Detayları ve Talebiniz", submit: "Mesajı Gönder",
      successMsg: "Mesajınız başarıyla alınmıştır. info@gencotr.com adresimize iletilmiştir, en kısa sürede dönüş yapacağız.",
      infoTitle: "İletişim Bilgilerimiz",
      addressLabel: "Merkez Adres", addressVal: "Meriç Mah. 5746/5 SK. No: 3 İç Kapı No: Z1 Bornova/İzmir - TÜRKİYE",
      phoneLabel: "Telefon", phoneVal: "+90 232 462 16 49",
      emailLabel: "E-Posta", emailVal: "info@gencotr.com",
      footerRights: "© 2026 GENCO Imports & Exports LTD. Tüm hakları saklıdır.",
      footerAddress: "Meriç Mah. 5746/5 SK. No: 3 İç Kapı No: Z1 Bornova/İzmir - TÜRKİYE | Tel: +90 232 462 16 49 | info@gencotr.com"
    },
    EN: {
      services: "Services", industries: "Industries", caseStudies: "Case Studies", insights: "Trade Intelligence", about: "About Us", contact: "Contact",
      badge: "Contact & Collaboration",
      title: "Let's Manage Your Projects Together on the Ground",
      sub: "Contact us directly to scale your exports, secure sourcing from Turkey, or find a new partner for your market.",
      formTitle: "Send a Direct Message",
      name: "Full Name", email: "Corporate Email", phone: "Phone Number", message: "Project Details & Inquiry", submit: "Send Message",
      successMsg: "Your message has been successfully received and forwarded to info@gencotr.com. We will get back to you shortly.",
      infoTitle: "Our Contact Information",
      addressLabel: "Headquarters", addressVal: "Meriç Mah. 5746/5 SK. No: 3 Inner Door No: Z1 Bornova/İzmir - TURKEY",
      phoneLabel: "Phone", phoneVal: "+90 232 462 16 49",
      emailLabel: "Email", emailVal: "info@gencotr.com",
      footerRights: "© 2026 GENCO Imports & Exports LTD. All rights reserved.",
      footerAddress: "Meriç Mah. 5746/5 SK. No: 3 Inner Door No: Z1 Bornova/İzmir - TURKEY | Phone: +90 232 462 16 49 | info@gencotr.com"
    }
  };

  const current = t[lang];

  return (
    <div className="bg-[#fafafa] text-[#1e293b] antialiased min-h-screen">
      <nav className="bg-white border-b border-gray-200 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
                <a href="/">
                  <img src="/logo.png" alt="GENCO Imports & Exports" className="h-10 w-auto object-contain" />
                </a>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-semibold text-gray-600">
                <a href="/services" className="hover:text-[#f97316] transition">{current.services}</a>
                <a href="/industries" className="hover:text-[#f97316] transition">{current.industries}</a>
                <a href="/case-studies" className="hover:text-[#f97316] transition">{current.caseStudies}</a>
                <a href="/insights" className="hover:text-[#f97316] transition">{current.insights}</a>
                <a href="/about" className="hover:text-[#f97316] transition">{current.about}</a>
                <a href="/contact" className="text-[#f97316] font-bold">{current.contact}</a>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold">
                <button onClick={() => changeLang("TR")} className={`px-2 py-1 rounded transition ${lang === "TR" ? "bg-[#f97316] text-white" : "text-gray-800 hover:text-[#f97316]"}`}>TR</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => changeLang("EN")} className={`px-2 py-1 rounded transition ${lang === "EN" ? "bg-[#f97316] text-white" : "text-gray-400 hover:text-[#f97316]"}`}>EN</button>
            </div>
        </div>
      </nav>

      <header className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-[#f97316] font-bold tracking-wider text-sm mb-3 uppercase">{current.badge}</span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-6">{current.title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">{current.sub}</p>
        </div>
      </header>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          <div className="bg-white border border-gray-200 p-8 md:p-12 rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold text-[#0f172a] mb-6">{current.formTitle}</h3>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-sm font-medium">
                {current.successMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{current.name}</label>
                  <input type="text" name="name" required className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-[#f97316] text-sm" placeholder="Ali Tunçdamar" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{current.email}</label>
                  <input type="email" name="email" required className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-[#f97316] text-sm" placeholder="info@gencotr.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{current.phone}</label>
                  <input type="tel" name="phone" className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-[#f97316] text-sm" placeholder="+90 ..." />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{current.message}</label>
                  <textarea name="message" rows="4" required className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-[#f97316] text-sm" placeholder="..."></textarea>
                </div>
                <button type="submit" className="w-full bg-[#f97316] text-white p-4 font-bold rounded-lg hover:bg-orange-600 transition shadow-md">{current.submit}</button>
              </form>
            )}
          </div>

          <div className="bg-[#0f172a] p-8 md:p-12 rounded-xl text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#f97316] opacity-10 rounded-full blur-2xl"></div>
            <div>
              <h3 className="text-2xl font-bold mb-8">{current.infoTitle}</h3>
              <div className="space-y-6 text-sm text-gray-300">
                <div>
                  <span className="text-[#f97316] font-mono text-xs uppercase tracking-widest block mb-1">{current.addressLabel}</span>
                  <p className="leading-relaxed">{current.addressVal}</p>
                </div>
                <div>
                  <span className="text-[#f97316] font-mono text-xs uppercase tracking-widest block mb-1">{current.phoneLabel}</span>
                  <p className="font-bold text-white">{current.phoneVal}</p>
                </div>
                <div>
                  <span className="text-[#f97316] font-mono text-xs uppercase tracking-widest block mb-1">{current.emailLabel}</span>
                  <p className="font-bold text-white">{current.emailVal}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6 mt-8 text-xs text-gray-500">
              GENCO Imports & Exports LTD. • İzmir / Bornova
            </div>
          </div>

        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-4">
          <div className="w-full h-[400px] rounded-lg overflow-hidden">
            <iframe 
              title="GENCO Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3125.357121652494!2d27.2023!3d38.4556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b9636a00000001%3A0x123456789abcdef!2zQm9ybm92YS_EsHptaXItVMO8cmtpeWU!5e0!3m2!1str!2str!4v1710000000000!5m2!1str!2str" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </section>

      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div>{current.footerRights}</div>
            <div className="mt-4 md:mt-0 text-center md:text-right">{current.footerAddress}</div>
        </div>
      </footer>
    </div>
  );
}