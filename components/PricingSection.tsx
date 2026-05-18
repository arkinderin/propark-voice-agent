"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Info, TrendingUp, Shield, Star } from "lucide-react";

function Tooltip({ content }: { content: string }) {
  return (
    <span className="relative group/tip inline-flex items-center ml-1 cursor-help shrink-0">
      <Info size={11} className="text-slate-600 group-hover/tip:text-slate-400 transition" />
      <span className="absolute bottom-full left-0 mb-2 w-64 bg-[#1a2236] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-300 leading-relaxed opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-30 shadow-2xl">
        {content}
        <span className="absolute top-full left-4 border-4 border-transparent border-t-[#1a2236]" />
      </span>
    </span>
  );
}

const SETUP_TOOLTIP =
  "Kapsamı: Kliniğinize özel AI eğitimi · Telefon hattı kurulumu & yönlendirme · Randevu sistemi entegrasyonu · 30 gün aktif onboarding desteği · Sınırsız test araması";

const CAPACITY_TOOLTIP =
  "AI hasta kapasitesi: kliniğinizin aylık karşılayabileceği tahmini yeni hasta etkileşimi sayısı. Arama hacmi ve konuşma süresine göre değişir.";

const USAGE_OPTIONS = [
  { label: "40–120 yeni hasta / ay", value: "low", recommended: "baslangic" },
  { label: "Yüksek hacimli hasta operasyonu", value: "mid", recommended: "profesyonel" },
  { label: "Çok şube / zincir operasyonu", value: "high", recommended: "premium" },
];

const USAGE_HINTS: Record<string, string> = {
  low: "Solo Klinik planı ihtiyaçlarınıza uygun görünüyor.",
  mid: "Aktif Klinik planı bu hacim için en verimli seçenek.",
  high: "Premium Klinik veya Kurumsal plan için ekibimizle konuşun.",
};

type Feature = { text: string; tooltip?: string };

type RegularPlan = {
  enterprise: false;
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  setup: number;
  capacityLabel: string;
  desc: string;
  features: Feature[];
  roi: string;
  highlight: boolean;
  badge?: string;
  cta: string;
};

type EnterprisePlan = {
  enterprise: true;
  id: string;
  name: string;
  desc: string;
  features: Feature[];
  roi: string;
  cta: string;
};

type Plan = RegularPlan | EnterprisePlan;

const plans: Plan[] = [
  {
    enterprise: false,
    id: "baslangic",
    name: "Solo Klinik",
    monthlyPrice: 7900,
    yearlyPrice: 6590,
    setup: 9900,
    capacityLabel: "40–120 yeni hasta / ay",
    desc: "İlk AI klinik danışmanınız",
    features: [
      { text: "AI çağrı karşılama & randevu alma" },
      { text: "WhatsApp bildirimi & onay mesajı" },
      { text: "Google Calendar entegrasyonu" },
      { text: "Temel analitik dashboard" },
      { text: "1 AI telefon hattı" },
    ],
    roi: "Ayda 20 kaçan arama → ortalama ₺12.000 kayıp. Bu plan ilk ayda kendini amorti eder.",
    highlight: false,
    cta: "14 Gün Ücretsiz Dene",
  },
  {
    enterprise: false,
    id: "profesyonel",
    name: "Aktif Klinik",
    monthlyPrice: 14900,
    yearlyPrice: 12400,
    setup: 19900,
    capacityLabel: "Yüksek hacimli hasta operasyonu",
    desc: "Kaçan hastaları randevuya dönüştüren AI çalışan",
    badge: "Estetik kliniklerin tercihi",
    features: [
      { text: "Gelişmiş AI konuşma akışı" },
      { text: "WhatsApp follow-up & hatırlatıcı" },
      { text: "Kaçan çağrı otomatik geri dönüşü" },
      { text: "Lead raporlama & dönüşüm analizi" },
      { text: "Satış odaklı konuşma senaryoları" },
      { text: "2 AI telefon hattı" },
      { text: "Öncelikli destek — 4 saat yanıt" },
    ],
    roi: "Gelmeme oranını %35 azaltmak = ayda 10+ ek dolu randevu. Kendini 3 haftada amorti eder.",
    highlight: true,
    cta: "14 Gün Ücretsiz Dene",
  },
  {
    enterprise: false,
    id: "premium",
    name: "Premium Klinik",
    monthlyPrice: 24900,
    yearlyPrice: 20750,
    setup: 39900,
    capacityLabel: "Çok şube / yüksek kapasite",
    desc: "7/24 çalışan AI hasta operasyon sistemi",
    features: [
      { text: "Çoklu hat desteği & lokasyon yönetimi" },
      { text: "Gelişmiş CRM entegrasyonu" },
      { text: "Özel AI konuşma senaryoları" },
      { text: "Detaylı analytics & segment raporu" },
      { text: "Özel onboarding — dedicated uzman" },
      { text: "SLA garantisi" },
    ],
    roi: "Çok şubeli kliniklerde AI, sekreter operasyon maliyetinin %60'ını düşürür.",
    highlight: false,
    cta: "Demo Talep Et",
  },
  {
    enterprise: true,
    id: "kurumsal",
    name: "Kurumsal",
    desc: "Enterprise AI çağrı operasyon altyapısı",
    features: [
      { text: "Multi-location yönetimi" },
      { text: "Özel AI model eğitimi" },
      { text: "ERP / CRM entegrasyonu" },
      { text: "White-label platform seçeneği" },
      { text: "Dedicated account manager" },
      { text: "SLA & uptime garantisi" },
    ],
    roi: "Klinik zincirlerinde AI; hat başı sekreter maliyetini tamamen elimine eder.",
    cta: "Demo Talep Et",
  },
];

const ROI_STATS = [
  { value: "%87", label: "Hasta memnuniyeti artışı" },
  { value: "%34", label: "Daha az kaçan çağrı" },
  { value: "48 sa", label: "Ortalama kurulum süresi" },
  { value: "7/24", label: "Kesintisiz hasta karşılama" },
];

const TRUST_BADGES = [
  "iyzico Güvenceli",
  "KVKK Uyumlu",
  "256-bit SSL",
  "14 Gün Tam İade",
];

export default function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [usage, setUsage] = useState<string | null>(null);

  const recommendedId = USAGE_OPTIONS.find((o) => o.value === usage)?.recommended ?? null;

  return (
    <section id="fiyatlandirma" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ROI stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16">
          {ROI_STATS.map((s) => (
            <div key={s.label} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-center">
              <div className="text-xl font-black text-indigo-400">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-widest mb-3">Fiyatlandırma</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Sonuç odaklı planlar</h2>
          <p className="text-slate-400 mt-3 max-w-lg mx-auto">
            Her plan, kliniğinizin kaçan hasta aramasını sıfıra yaklaştırmak ve operasyon yükünü azaltmak için tasarlandı.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`text-sm font-medium transition ${billing === "monthly" ? "text-white" : "text-slate-500"}`}>
            Aylık
          </span>
          <button
            onClick={() => setBilling((b) => (b === "monthly" ? "yearly" : "monthly"))}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              billing === "yearly" ? "bg-indigo-600" : "bg-white/10"
            }`}
            aria-label="Fatura periyodunu değiştir"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                billing === "yearly" ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition flex items-center gap-2 ${billing === "yearly" ? "text-white" : "text-slate-500"}`}>
            Yıllık
            <span className="bg-emerald-500/15 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
              2 ay bedava
            </span>
          </span>
        </div>

        {/* Usage estimator */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 mb-10">
          <p className="text-sm text-slate-300 font-medium mb-3">
            AI hasta kapasitesi ihtiyacınız nedir?{" "}
            <Tooltip content={CAPACITY_TOOLTIP} />
            <span className="text-slate-600 font-normal ml-2">Size uygun planı önerelim.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            {USAGE_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => setUsage((u) => (u === o.value ? null : o.value))}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium border transition ${
                  usage === o.value
                    ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300"
                    : "bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/15 hover:text-slate-300"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          {usage && (
            <p className="text-xs text-indigo-400 mt-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
              {USAGE_HINTS[usage]}
            </p>
          )}
        </div>

        {/* Plan cards — 2+2 on md, 4 on lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {plans.map((p) => {
            const isRecommended = recommendedId === p.id;

            if (p.enterprise) {
              return (
                <div
                  key={p.id}
                  className={`relative rounded-2xl p-5 border flex flex-col bg-gradient-to-b from-amber-500/5 to-transparent border-amber-500/20 ${
                    isRecommended ? "ring-2 ring-amber-400/40" : ""
                  }`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-lg shadow-amber-900/30">
                      Kurumsal
                    </span>
                  </div>

                  <div className="mt-2 mb-4">
                    <h3 className="font-bold text-white text-base">{p.name}</h3>
                    <p className="text-slate-500 text-xs mt-1">{p.desc}</p>
                  </div>

                  <div className="mb-5">
                    <div className="text-2xl font-black text-amber-400">₺50.000+</div>
                    <div className="text-xs text-slate-600 mt-0.5">/ay · Onboarding dahil</div>
                  </div>

                  <ul className="space-y-2 mb-5 flex-1">
                    {p.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle size={12} className="text-amber-400/80 shrink-0 mt-0.5" />
                        <span>{f.text}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-amber-500/8 border border-amber-500/15 rounded-xl px-3 py-2 mb-4 text-xs text-amber-300/80 leading-relaxed">
                    <TrendingUp size={10} className="inline mr-1 text-amber-400" />
                    {p.roi}
                  </div>

                  <a
                    href="mailto:satis@operexo.com?subject=Kurumsal Demo Talebi"
                    className="block text-center py-2.5 px-4 rounded-xl font-semibold text-xs transition bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20"
                  >
                    {p.cta}
                  </a>
                  <p className="text-center text-xs text-slate-600 mt-2">Ekibimiz 24 saat içinde ulaşır</p>
                </div>
              );
            }

            const price = billing === "yearly" ? p.yearlyPrice : p.monthlyPrice;

            return (
              <div
                key={p.id}
                className={`relative rounded-2xl p-5 border flex flex-col transition-all ${
                  p.highlight
                    ? "bg-gradient-to-b from-indigo-600/15 to-indigo-950/5 border-indigo-500/60 shadow-2xl shadow-indigo-900/30 md:scale-[1.02]"
                    : isRecommended
                    ? "bg-[#0D1117] border-indigo-400/40 ring-2 ring-indigo-400/20"
                    : "bg-[#0D1117] border-white/5"
                }`}
              >
                {p.highlight && p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-indigo-900/50">
                      {p.badge}
                    </span>
                  </div>
                )}
                {isRecommended && !p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Size Uygun
                    </span>
                  </div>
                )}

                <div className="mt-2 mb-3">
                  <h3 className="font-bold text-white text-base">{p.name}</h3>
                  <p className="text-slate-500 text-xs mt-1">{p.desc}</p>
                </div>

                <div className="mb-1 flex items-end gap-1">
                  <span className="text-3xl font-black text-white">
                    ₺{price.toLocaleString("tr-TR")}
                  </span>
                  <span className="text-slate-500 text-sm mb-1">/ay</span>
                  {billing === "yearly" && (
                    <span className="text-xs text-slate-600 line-through mb-1 ml-1">
                      ₺{p.monthlyPrice.toLocaleString("tr-TR")}
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 mb-4 flex items-center">
                  + ₺{p.setup.toLocaleString("tr-TR")} onboarding
                  <Tooltip content={SETUP_TOOLTIP} />
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 mb-4 text-xs text-slate-400 flex items-center gap-1">
                  {p.capacityLabel}
                  <Tooltip content={CAPACITY_TOOLTIP} />
                </div>

                <ul className="space-y-2 mb-4 flex-1">
                  {p.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span className="flex items-center flex-wrap gap-x-1">
                        {f.text}
                        {f.tooltip && <Tooltip content={f.tooltip} />}
                      </span>
                    </li>
                  ))}
                </ul>

                <div
                  className={`rounded-xl px-3 py-2 mb-4 text-xs leading-relaxed ${
                    p.highlight
                      ? "bg-indigo-500/10 border border-indigo-500/15 text-indigo-300/90"
                      : "bg-white/[0.02] border border-white/5 text-slate-500"
                  }`}
                >
                  <TrendingUp size={10} className={`inline mr-1 ${p.highlight ? "text-indigo-400" : "text-slate-600"}`} />
                  {p.roi}
                </div>

                <Link
                  href="/kayit"
                  className={`block text-center py-2.5 px-4 rounded-xl font-semibold text-xs transition ${
                    p.highlight
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Guarantee line */}
        <p className="text-center text-slate-600 text-sm mt-8">
          {billing === "yearly"
            ? "Yıllık ödeme peşin faturalandırılır · 14 gün memnuniyet garantisi · İstediğinde iptal"
            : "14 gün ücretsiz deneme · Memnun kalmazsanız tam iade · İstediğinde iptal"}
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-8 border-t border-white/5">
          {TRUST_BADGES.map((label) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-slate-600">
              <Shield size={11} className="text-slate-600" />
              {label}
            </div>
          ))}
        </div>

        {/* Featured testimonial */}
        <div className="mt-12 bg-[#0D1117] border border-white/5 rounded-2xl p-6 max-w-xl mx-auto">
          <div className="flex gap-0.5 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            &quot;Yaz sezonu öncesi arama hacmimiz 3 katına çıktı. Operexo olmadan altından kalkamadık.
            Personelimiz artık sadece uygulamalara odaklanıyor.&quot;
          </p>
          <div>
            <div className="font-semibold text-white text-sm">Dr. Zeynep Arslan</div>
            <div className="text-slate-500 text-xs mt-0.5">Lazer Epilasyon & Estetik Merkezi, İstanbul</div>
          </div>
        </div>

      </div>
    </section>
  );
}
