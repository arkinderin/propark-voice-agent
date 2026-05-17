import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, Calendar, BarChart2, Zap, Shield, Clock, CheckCircle, ArrowRight, Star, MessageSquare, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Phone,
    title: "7/24 Sesli Asistan",
    desc: "Türkçe konuşan AI asistan, hasta aramaları hiç kaçırmadan karşılar ve randevu alır.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Calendar,
    title: "Otomatik Randevu",
    desc: "Müsaitlik kontrolü, randevu oluşturma ve takvim yönetimi tamamen otomatik.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: BarChart2,
    title: "Gerçek Zamanlı Dashboard",
    desc: "Tüm aramaları, randevuları ve istatistikleri tek ekrandan takip edin.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: MessageSquare,
    title: "Doğal Konuşma",
    desc: "Hastalara insan gibi cevap veren, bağlamı anlayan gelişmiş dil modeli.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Shield,
    title: "KVKK Uyumlu",
    desc: "Tüm hasta verileri şifreli, Türkiye sunucularında güvenle saklanır.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    icon: TrendingUp,
    title: "Dönüşüm Analizi",
    desc: "Kaç arama randevuya dönüştü? Cevapsız aramalar kimdi? Tüm metrikler elinizde.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

const steps = [
  { step: "01", title: "Kaydolun", desc: "Kliniğinizi 5 dakikada sisteme ekleyin, planınızı seçin." },
  { step: "02", title: "Ayarlayın", desc: "Doktorlarınızı, hizmetlerinizi ve çalışma saatlerinizi girin." },
  { step: "03", title: "Yayına Alın", desc: "Size özel telefon numarasını aktive edin, AI asistan hazır." },
];

const plans = [
  {
    name: "Starter",
    price: "2.490",
    setup: "2.500",
    credits: "300",
    overage: "10",
    desc: "Tek lokasyon klinikler için",
    features: [
      "300 operasyon kredisi/ay",
      "1 telefon numarası",
      "Randevu takvimi & dashboard",
      "E-posta bildirimleri",
      "Aşım: 10₺/kredi",
    ],
    cta: "Starter ile Başla",
    highlight: false,
  },
  {
    name: "Professional",
    price: "4.990",
    setup: "5.000",
    credits: "700",
    overage: "8",
    desc: "Büyüyen klinikler için tam paket",
    features: [
      "700 operasyon kredisi/ay",
      "2 telefon numarası",
      "WhatsApp AI takip dahil",
      "Gelmeme azaltma (SMS/WA)",
      "Gelişmiş analitik",
      "Öncelikli destek",
      "Aşım: 8₺/kredi",
    ],
    cta: "Professional ile Başla",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "9.990",
    setup: "10.000",
    credits: "1.800",
    overage: "6",
    desc: "Zincir klinikler & hastaneler için",
    features: [
      "1.800 operasyon kredisi/ay",
      "5 telefon numarası",
      "Çok şubeli yönetim",
      "CRM & özel entegrasyonlar",
      "White-label seçeneği",
      "Dedicated account manager",
      "Aşım: 6₺/kredi",
    ],
    cta: "Satış Ekibiyle Görüş",
    highlight: false,
  },
];

const testimonials = [
  {
    name: "Dr. Ayşe Kaya",
    role: "Diş Kliniği Sahibi, İstanbul",
    text: "Randevu kayıplarımız %90 azaldı. Artık telefonu kaçırmak diye bir şey kalmadı.",
    stars: 5,
  },
  {
    name: "Op. Dr. Mehmet Demir",
    role: "Genel Cerrahi, Ankara",
    text: "Personelimiz artık sadece hastalarla ilgileniyor. Telefon işlerini AI hallediyor.",
    stars: 5,
  },
  {
    name: "Uzm. Dr. Fatma Yıldız",
    role: "Dermatoloji, İzmir",
    text: "Kurulum 1 günde bitti, ilk haftada 40'tan fazla yeni randevu aldık.",
    stars: 5,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#070B14] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-6">
            <Zap size={14} />
            <span>Türkiye&apos;nin ilk AI Klinik Sesli Asistanı</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
            Kliniğiniz artık
            <span className="block bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              7/24 açık
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Yapay zeka destekli sesli asistan, hasta aramalarını otomatik karşılar, randevu alır ve takibini yapar. Hiç kaçan çağrı olmaz.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/kayit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-base"
            >
              14 Gün Ücretsiz Dene
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/#nasil-calisir"
              className="border border-white/10 text-slate-300 hover:bg-white/5 px-8 py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-base"
            >
              Nasıl Çalışır?
            </Link>
          </div>
          <p className="text-slate-600 text-sm mt-5">Kredi kartı gerekmez · Kurulum 1 gün · İptal istediğin zaman</p>
        </div>

        {/* Dashboard preview mockup */}
        <div className="max-w-4xl mx-auto mt-16 relative">
          <div className="rounded-2xl border border-white/10 bg-[#0D1117] overflow-hidden shadow-2xl shadow-indigo-950/50">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0A0E1A]">
              <div className="w-3 h-3 rounded-full bg-rose-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="ml-2 text-xs text-slate-600">operexo.com/admin</span>
            </div>
            <div className="p-6 grid grid-cols-3 gap-4">
              {[
                { label: "Bugün Randevu", value: "24", color: "text-indigo-400" },
                { label: "Toplam Arama", value: "1,847", color: "text-cyan-400" },
                { label: "Dönüşüm Oranı", value: "%78", color: "text-emerald-400" },
              ].map((s) => (
                <div key={s.label} className="bg-[#111827] rounded-xl p-4 border border-white/5">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              <div className="bg-[#111827] rounded-xl border border-white/5 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 text-xs text-slate-500 font-medium">Son Aramalar</div>
                {[
                  { phone: "+90 532 xxx xx 12", time: "14:32", outcome: "Randevu Alındı", color: "text-emerald-400" },
                  { phone: "+90 555 xxx xx 87", time: "14:15", outcome: "Bilgi Verildi", color: "text-cyan-400" },
                  { phone: "+90 543 xxx xx 34", time: "13:58", outcome: "Randevu Alındı", color: "text-emerald-400" },
                ].map((r, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between border-b border-white/5 last:border-0 text-sm">
                    <span className="text-slate-400">{r.phone}</span>
                    <span className="text-slate-600 text-xs">{r.time}</span>
                    <span className={`text-xs font-medium ${r.color}`}>{r.outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/5 bg-white/[0.02] py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "500+", label: "Aktif Klinik" },
            { value: "1M+", label: "Yönetilen Arama" },
            { value: "%78", label: "Ortalama Dönüşüm" },
            { value: "7/24", label: "Kesintisiz Hizmet" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-slate-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="ozellikler" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest mb-3">Özellikler</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Her şey dahil</h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto">Klinik yönetimini kolaylaştıran tüm araçlar tek platformda.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-[#0D1117] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition group">
                <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon size={20} className={f.color} />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="nasil-calisir" className="py-24 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-sm font-medium uppercase tracking-widest mb-3">Nasıl Çalışır</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">3 adımda başlayın</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-2/3 w-full h-px bg-gradient-to-r from-indigo-500/30 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center mx-auto mb-4 text-2xl font-black text-white">
                  {s.step}
                </div>
                <h3 className="font-bold text-white mb-2 text-lg">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="fiyatlandirma" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-emerald-400 text-sm font-medium uppercase tracking-widest mb-3">Fiyatlandırma</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Şeffaf fiyatlandırma</h2>
            <p className="text-slate-400 mt-3">Gizli ücret yok. İstediğinde iptal et.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`relative rounded-2xl p-6 border flex flex-col ${
                  p.highlight
                    ? "bg-indigo-600/10 border-indigo-500/50 shadow-xl shadow-indigo-950/50"
                    : "bg-[#0D1117] border-white/5"
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    En Popüler
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="font-bold text-white text-lg">{p.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">{p.desc}</p>
                </div>
                <div className="mb-2">
                  <span className="text-4xl font-black text-white">₺{p.price}</span>
                  <span className="text-slate-500 text-sm">/ay</span>
                </div>
                <div className="text-xs text-slate-600 mb-5">
                  + ₺{p.setup} kurulum ücreti (tek seferlik)
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5 mb-5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{p.credits} operasyon kredisi/ay</span>
                  <span className="text-xs text-slate-600">Aşım: {p.overage}₺/kredi</span>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/kayit"
                  className={`block text-center py-2.5 px-4 rounded-xl font-medium text-sm transition ${
                    p.highlight
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-600 text-sm mt-6">
            Yıllık ödemede %20 indirim · 14 gün ücretsiz deneme · İstediğinde iptal
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-violet-400 text-sm font-medium uppercase tracking-widest mb-3">Referanslar</p>
            <h2 className="text-3xl font-bold text-white">Klinikler ne diyor?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-[#0D1117] border border-white/5 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">&quot;{t.text}&quot;</p>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center mx-auto mb-6">
            <Clock size={28} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hemen başlamaya hazır mısınız?
          </h2>
          <p className="text-slate-400 mb-8">14 gün ücretsiz deneyin. Kredi kartı gerekmez.</p>
          <Link
            href="/kayit"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl transition text-base"
          >
            Ücretsiz Denemeyi Başlat
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
