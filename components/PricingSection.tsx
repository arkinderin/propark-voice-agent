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
  "Ne içeriyor: Klinik ağzınıza özel AI eğitimi · Telefon hattı kurulumu & yönlendirme · Randevu sistemi entegrasyonu · İlk 30 gün aktif onboarding desteği · Sınırsız test araması";

const INTERACTION_TOOLTIP =
  "1 hasta etkileşimi = AI asistanının 1 telefon aramasını karşılaması. Çağrı süresi veya sonucundan bağımsız olarak 1 sayılır. Aşımda ek ücret uygulanır.";

const USAGE_OPTIONS = [
  { label: "0–100 arama / ay", value: "low", recommended: "baslangic" },
  { label: "100–600 arama / ay", value: "mid", recommended: "profesyonel" },
  { label: "600+ arama / ay", value: "high", recommended: "kurumsal" },
];

const USAGE_HINTS: Record<string, string> = {
  low: "Solo Klinik planı ihtiyaçlarınıza uygun görünüyor.",
  mid: "Aktif Klinik planı bu hacim için en verimli seçenek.",
  high: "Kurumsal plan veya özel teklif için ekibimizle iletişime geçin.",
};

type Feature = { text: string; tooltip?: string };

type RegularPlan = {
  enterprise: false;
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  setup: number;
  interactions: number;
  interactionsPerDay: string;
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
    monthlyPrice: 1990,
    yearlyPrice: 1590,
    setup: 3500,
    interactions: 150,
    interactionsPerDay: "~5 arama/gün",
    desc: "Tek hekimli muayenehane için",
    features: [
      { text: "Ayda 150 hastayı otomatik karşıla", tooltip: INTERACTION_TOOLTIP },
      { text: "1 AI telefon hattı" },
      { text: "Randevu takvimi & yönetim paneli" },
      { text: "E-posta bildirimleri" },
    ],
    roi: "Ortalama klinik yılda 240 hasta aramasını kaçırır. Bu plan her birine otomatik yanıt verir.",
    highlight: false,
    cta: "14 Gün Ücretsiz Dene",
  },
  {
    enterprise: false,
    id: "profesyonel",
    name: "Aktif Klinik",
    monthlyPrice: 4490,
    yearlyPrice: 3590,
    setup: 5000,
    interactions: 300,
    interactionsPerDay: "~10 arama/gün",
    desc: "Büyüyen klinikler için tam paket",
    badge: "Kliniklerin %73'ü bu paketi seçiyor",
    features: [
      { text: "Ayda 300 hastayı otomatik karşıla", tooltip: INTERACTION_TOOLTIP },
      { text: "2 AI telefon hattı" },
      { text: "WhatsApp AI takip — randevu sonrası otomatik mesaj" },
      { text: "Gelmeme oranını %35 azalt (SMS/WA hatırlatma)" },
      { text: "Gelişmiş analitik & dönüşüm raporu" },
      { text: "Öncelikli destek — 4 saat yanıt garantisi" },
    ],
    roi: "Gelmeme oranını %35 azaltmak = ayda 8 ek dolu randevu. Bu plan kendini ilk 3 haftada amorti eder.",
    highlight: true,
    cta: "14 Gün Ücretsiz Dene",
  },
  {
    enterprise: true,
    id: "kurumsal",
    name: "Kurumsal",
    desc: "Çok şubeli klinik zincirleri & hastaneler için",
    features: [
      { text: "Özel hasta etkileşimi limiti" },
      { text: "Sınırsız telefon hattı & lokasyon" },
      { text: "CRM & ERP entegrasyonu" },
      { text: "White-label platform seçeneği" },
      { text: "Dedicated account manager" },
      { text: "SLA garantisi" },
      { text: "Özel AI model eğitimi" },
    ],
    roi: "Çok şubeli kliniklerde AI, sekreter maliyetinin %60'ını düşürür.",
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
      <div className="max-w-5xl mx-auto">

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
          <span
            className={`text-sm font-medium transition flex items-center gap-2 ${
              billing === "yearly" ? "text-white" : "text-slate-500"
            }`}
          >
            Yıllık
            <span className="bg-emerald-500/15 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
              2 ay bedava
            </span>
          </span>
        </div>

        {/* Usage estimator */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 mb-10">
          <p className="text-sm text-slate-300 font-medium mb-3">
            Aylık hasta araması hacminiz nedir?{" "}
            <span className="text-slate-600 font-normal">Size uygun planı önerelim.</span>
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

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((p) => {
            const isRecommended = recommendedId === p.id;

            if (p.enterprise) {
              return (
                <div
                  key={p.id}
                  className={`relative rounded-2xl p-6 border flex flex-col bg-gradient-to-b from-amber-500/5 to-transparent border-amber-500/20 ${
                    isRecommended ? "ring-2 ring-amber-400/40" : ""
                  }`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap shadow-lg shadow-amber-900/30">
                      Kurumsal
                    </span>
                  </div>

                  <div className="mt-2 mb-4">
                    <h3 className="font-bold text-white text-lg">{p.name}</h3>
                    <p className="text-slate-500 text-sm mt-1">{p.desc}</p>
                  </div>

                  <div className="mb-5">
                    <div className="text-3xl font-black text-amber-400">Özel Teklif</div>
                    <div className="text-xs text-slate-600 mt-1">Onboarding dahildir</div>
                  </div>

                  <ul className="space-y-2.5 mb-5 flex-1">
                    {p.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <CheckCircle size={14} className="text-amber-400/80 shrink-0 mt-0.5" />
                        <span>{f.text}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-amber-500/8 border border-amber-500/15 rounded-xl px-3 py-2.5 mb-5 text-xs text-amber-300/80 leading-relaxed">
                    <TrendingUp size={11} className="inline mr-1.5 text-amber-400" />
                    {p.roi}
                  </div>

                  <a
                    href="mailto:satis@operexo.com?subject=Kurumsal Demo Talebi"
                    className="block text-center py-3 px-4 rounded-xl font-semibold text-sm transition bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20"
                  >
                    {p.cta}
                  </a>
                  <p className="text-center text-xs text-slate-600 mt-2">
                    Ekibimiz 24 saat içinde ulaşır
                  </p>
                </div>
              );
            }

            const price = billing === "yearly" ? p.yearlyPrice : p.monthlyPrice;

            return (
              <div
                key={p.id}
                className={`relative rounded-2xl p-6 border flex flex-col transition-all ${
                  p.highlight
                    ? "bg-gradient-to-b from-indigo-600/15 to-indigo-950/5 border-indigo-500/60 shadow-2xl shadow-indigo-900/30 md:scale-[1.03]"
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

                <div className="mt-2 mb-4">
                  <h3 className="font-bold text-white text-lg">{p.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">{p.desc}</p>
                </div>

                <div className="mb-1 flex items-end gap-1">
                  <span className="text-4xl font-black text-white">
                    ₺{price.toLocaleString("tr-TR")}
                  </span>
                  <span className="text-slate-500 text-sm mb-1">/ay</span>
                  {billing === "yearly" && (
                    <span className="text-xs text-slate-600 line-through mb-1 ml-1">
                      ₺{p.monthlyPrice.toLocaleString("tr-TR")}
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 mb-5 flex items-center">
                  + ₺{p.setup.toLocaleString("tr-TR")} onboarding paketi
                  <Tooltip content={SETUP_TOOLTIP} />
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5 mb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center">
                      {p.interactions} hasta etkileşimi/ay
                      <Tooltip content={INTERACTION_TOOLTIP} />
                    </span>
                    <span className="text-xs text-slate-600">{p.interactionsPerDay}</span>
                  </div>
                  <div className="text-[10px] text-slate-700 mt-1">
                    Aşımda {p.id === "baslangic" ? "₺18" : "₺14"}/etkileşim · önceden bildirim alırsınız
                  </div>
                </div>

                <ul className="space-y-2.5 mb-5 flex-1">
                  {p.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span className="flex items-center flex-wrap gap-x-1">
                        {f.text}
                        {f.tooltip && <Tooltip content={f.tooltip} />}
                      </span>
                    </li>
                  ))}
                </ul>

                <div
                  className={`rounded-xl px-3 py-2.5 mb-5 text-xs leading-relaxed ${
                    p.highlight
                      ? "bg-indigo-500/10 border border-indigo-500/15 text-indigo-300/90"
                      : "bg-white/[0.02] border border-white/5 text-slate-500"
                  }`}
                >
                  <TrendingUp
                    size={11}
                    className={`inline mr-1.5 ${p.highlight ? "text-indigo-400" : "text-slate-600"}`}
                  />
                  {p.roi}
                </div>

                <Link
                  href="/kayit"
                  className={`block text-center py-3 px-4 rounded-xl font-semibold text-sm transition ${
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
            &quot;Kurulum 1 günde bitti, ilk haftada 40&apos;tan fazla yeni randevu aldık.
            Sekreterimiz artık sadece gelen hastalarla ilgileniyor, telefonu hiç kaldırmak zorunda kalmıyor.&quot;
          </p>
          <div>
            <div className="font-semibold text-white text-sm">Uzm. Dr. Fatma Yıldız</div>
            <div className="text-slate-500 text-xs mt-0.5">Dermatoloji, İzmir</div>
          </div>
        </div>

      </div>
    </section>
  );
}
