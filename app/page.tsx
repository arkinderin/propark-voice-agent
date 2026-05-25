import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import DemoSection from "@/components/DemoSection";
import ROICalculator from "@/components/ROICalculator";
import CallExamples from "@/components/CallExamples";
import WhatsAppFlow from "@/components/WhatsAppFlow";
import { Phone, Calendar, BarChart2, Zap, Shield, Clock, ArrowRight, Star, MessageSquare, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Phone,
    title: "7/24 Konsültasyon Hattı",
    desc: "Lazer, botoks, dolgu — müşterileriniz saat kaçta ararsa arasın, AI asistan anında karşılar ve konsültasyon randevusu alır.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Calendar,
    title: "Otomatik Randevu",
    desc: "Seans takvimini yönet, çakışmaları önle. Müşteri araması geldiğinde uygun saat anında önerilir.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: BarChart2,
    title: "Gerçek Zamanlı Dashboard",
    desc: "Tüm aramaları, konsültasyonları ve seans randevularını tek ekrandan takip edin.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: MessageSquare,
    title: "Fiyat Soruları Yönetimi",
    desc: "\"Botoks kaç para?\", \"Kaç seans lazım?\" gibi soruları AI halleder, müşteriyi ücretsiz konsültasyona yönlendirir.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Shield,
    title: "KVKK Uyumlu",
    desc: "Tüm müşteri verileri şifreli, Türkiye sunucularında güvenle saklanır.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    icon: TrendingUp,
    title: "Dönüşüm Analizi",
    desc: "Kaç arama konsültasyona dönüştü? Sezon bazlı doluluk raporu. Tüm metrikler elinizde.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

const steps = [
  { step: "01", title: "Kaydolun", desc: "Kliniğinizi 5 dakikada sisteme ekleyin, planınızı seçin." },
  { step: "02", title: "Hizmetleri Girin", desc: "Lazer, botoks, dolgu — sunduğunuz hizmetleri ve uzmanlarınızı ekleyin." },
  { step: "03", title: "Yayına Alın", desc: "Size özel telefon numarasını aktive edin. AI asistan fiyat sorularını, konsültasyon ve seans randevularını otomatik halleder." },
];

const testimonials = [
  {
    name: "Dr. Zeynep Arslan",
    role: "Lazer Epilasyon & Estetik Merkezi, İstanbul",
    text: "Yaz sezonu öncesi arama hacmimiz 3 katına çıktı. Operexo olmadan o yükün altından kalkamadık. Personelimiz artık seansa odaklanıyor.",
    stars: 5,
  },
  {
    name: "Op. Dr. Selin Kaya",
    role: "Medikal Estetik Kliniği, Ankara",
    text: "Botoks ve dolgu danışma randevularımız ilk ayda yüzde 65 arttı. Fiyat sorularını AI çok iyi yönetiyor, konsültasyona yönlendiriyor.",
    stars: 5,
  },
  {
    name: "Estetisyen Derya Yılmaz",
    role: "Güzellik & Estetik Merkezi, İzmir",
    text: "Akşam 22'de bile lazer randevusu alabiliyorlar. Sabah panele bakıyorum, gece gelen 8-10 yeni randevu var.",
    stars: 5,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#070B14] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-28 px-4 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/25 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/70 to-transparent" />
        {/* Grid — fades out radially from center top */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.055)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_10%,black_20%,transparent_100%)] pointer-events-none" />
        {/* Glow orbs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-indigo-600/[0.13] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[340px] bg-indigo-500/[0.07] rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute top-2/3 left-1/5 w-[380px] h-[380px] bg-cyan-600/[0.06] rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-2/3 right-1/5 w-[380px] h-[380px] bg-violet-600/[0.06] rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.09] rounded-full px-4 py-2 text-sm text-slate-300 mb-10 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Medikal Estetik Klinikleri için tasarlandı
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-[72px] lg:text-[84px] font-black leading-[1.0] mb-7 tracking-tight">
            <span className="text-white block">Lazer, botoks, dolgu —</span>
            <span className="relative inline-block mt-1">
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                randevular otomatik
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/45 to-transparent" />
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-11 leading-relaxed">
            AI sesli asistan fiyat sorularını yönetir, ücretsiz konsültasyon randevusu alır ve seans takviminizi doldurur.{" "}
            <span className="text-slate-200 font-medium">Gece 02&apos;de gelen aramaları bile.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link
              href="/kayit"
              className="group relative inline-flex items-center justify-center"
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-300 group-hover:opacity-90" />
              <span className="absolute inset-0 rounded-xl shadow-[0_8px_32px_rgba(99,102,241,0.45)] group-hover:shadow-[0_12px_48px_rgba(99,102,241,0.65)] transition-shadow duration-300" />
              <span className="relative px-9 py-4 flex items-center gap-2 text-white font-semibold text-base">
                14 Gün Ücretsiz Dene
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
            <Link
              href="/#nasil-calisir"
              className="group border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 hover:text-white px-9 py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-base backdrop-blur-sm"
            >
              Nasıl Çalışır?
              <ArrowRight size={16} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </div>

          {/* Social proof + trust bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-[#070B14] bg-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">Z</div>
                <div className="w-8 h-8 rounded-full border-2 border-[#070B14] bg-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-300">S</div>
                <div className="w-8 h-8 rounded-full border-2 border-[#070B14] bg-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300">D</div>
                <div className="w-8 h-8 rounded-full border-2 border-[#070B14] bg-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-300">M</div>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-slate-400">500+ klinik kullanıyor</span>
              </div>
            </div>
            <div className="hidden sm:block h-5 w-px bg-white/[0.08]" />
            <div className="flex items-center gap-5 sm:gap-6 text-slate-500">
              <div className="flex items-center gap-1.5">
                <Shield size={13} className="text-emerald-500" />
                <span>Kredi kartı gerekmez</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap size={13} className="text-amber-500" />
                <span>1 günde kurulum</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-indigo-400" />
                <span>İptal istediğin zaman</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DemoSection />

      {/* Dashboard preview mockup */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto relative">
          <div className="rounded-2xl border border-white/10 bg-[#0D1117] overflow-hidden shadow-2xl shadow-indigo-950/50">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0A0E1A]">
              <div className="w-3 h-3 rounded-full bg-rose-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="ml-2 text-xs text-slate-600">operexo.com/admin</span>
            </div>
            <div className="p-6 grid grid-cols-3 gap-4">
              {[
                { label: "Bugün Konsültasyon", value: "24", color: "text-indigo-400" },
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
            { value: "500+", label: "Aktif Estetik Klinik" },
            { value: "1M+", label: "Yönetilen Arama" },
            { value: "%78", label: "Konsültasyona Dönüşüm" },
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
            <h2 className="text-3xl md:text-4xl font-bold text-white">Estetik klinik için her şey</h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto">Lazer, botoks, dolgu — seans takviminden fiyat sorularına kadar tüm operasyon tek platformda.</p>
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

      <CallExamples />

      <ROICalculator />

      <WhatsAppFlow />

      <PricingSection />

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
