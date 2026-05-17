"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, Building2, User, Phone, MapPin, Stethoscope } from "lucide-react";

const plans = [
  {
    id: "baslangic",
    name: "Starter",
    price: "2.490",
    setup: "2.500",
    idealFor: "Tek hekimli muayenehane veya küçük klinik",
    callsPerDay: "Günde ~5–10 arama",
    badge: null,
    features: [
      "Aylık ~300 hasta görüşmesi",
      "1 telefon hattı",
      "Randevu takvimi & dashboard",
      "E-posta bildirimleri",
    ],
    notFor: "Yoğun klinikler için yeterli olmayabilir",
  },
  {
    id: "profesyonel",
    name: "Professional",
    price: "4.990",
    setup: "5.000",
    idealFor: "Birden fazla hekim, aktif klinik",
    callsPerDay: "Günde ~15–25 arama",
    badge: "En Çok Tercih Edilen",
    features: [
      "Aylık ~700 hasta görüşmesi",
      "2 telefon hattı",
      "WhatsApp otomatik takip",
      "Gelmeme azaltma (hatırlatma)",
      "Gelişmiş raporlar",
    ],
    notFor: null,
    popular: true,
  },
  {
    id: "kurumsal",
    name: "Enterprise",
    price: "9.990",
    setup: "10.000",
    idealFor: "Poliklinik veya çok şubeli klinik zinciri",
    callsPerDay: "Günde 40+ arama",
    badge: null,
    features: [
      "Aylık ~1.800 hasta görüşmesi",
      "5 telefon hattı",
      "Çok şubeli yönetim",
      "CRM entegrasyonu",
      "White-label seçeneği",
    ],
    notFor: null,
  },
];

const specialties = [
  "Diş Kliniği", "Genel Cerrahi", "Dahiliye", "Kardiyoloji", "Ortopedi",
  "Kadın Hastalıkları", "Dermatoloji", "Göz Hastalıkları", "KBB", "Nöroloji",
  "Psikiyatri", "Üroloji", "Fizik Tedavi", "Çocuk Sağlığı", "Diğer",
];

export default function KayitPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    clinicName: "",
    specialty: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    plan: "profesyonel",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        const params = new URLSearchParams({
          clinicId: data.clinicId,
          plan: form.plan,
          name: form.contactName,
          email: form.email,
          phone: form.phone,
        });
        window.location.href = `/kayit/odeme?${params.toString()}`;
      }
    } catch {}
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/5 px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
          <ArrowLeft size={16} />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white font-black text-xs">O</span>
            </div>
            <span className="font-bold text-white">operexo</span>
          </div>
        </Link>
        <div className="text-slate-500 text-sm">Adım {Math.min(step, 3)} / 3</div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">

          {/* Step indicator */}
          {step < 4 && (
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    step > s ? "bg-emerald-500 text-white" : step === s ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-500"
                  }`}>
                    {step > s ? <CheckCircle size={16} /> : s}
                  </div>
                  {s < 3 && <div className={`flex-1 h-px ${step > s ? "bg-emerald-500/50" : "bg-white/5"}`} />}
                </div>
              ))}
            </div>
          )}

          {/* Step 1: Klinik bilgileri */}
          {step === 1 && (
            <div>
              <div className="mb-8">
                <Building2 size={32} className="text-indigo-400 mb-3" />
                <h1 className="text-2xl font-bold">Klinik Bilgileri</h1>
                <p className="text-slate-400 text-sm mt-1">Kliniğinizle ilgili temel bilgileri girin.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Klinik Adı *</label>
                  <input
                    type="text"
                    value={form.clinicName}
                    onChange={(e) => set("clinicName", e.target.value)}
                    placeholder="Örn: Çankaya Diş Kliniği"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Uzmanlık Alanı *</label>
                  <select
                    value={form.specialty}
                    onChange={(e) => set("specialty", e.target.value)}
                    className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="" className="bg-[#0D1117]">Seçin...</option>
                    {specialties.map((s) => (
                      <option key={s} value={s} className="bg-[#0D1117]">{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Şehir *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="Örn: Ankara"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Adres</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    placeholder="Klinik adresi"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!form.clinicName || !form.specialty || !form.city}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                Devam Et <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 2: Yetkili bilgileri */}
          {step === 2 && (
            <div>
              <div className="mb-8">
                <User size={32} className="text-cyan-400 mb-3" />
                <h1 className="text-2xl font-bold">Yetkili Bilgileri</h1>
                <p className="text-slate-400 text-sm mt-1">Hesap sahibinin iletişim bilgileri.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Ad Soyad *</label>
                  <input
                    type="text"
                    value={form.contactName}
                    onChange={(e) => set("contactName", e.target.value)}
                    placeholder="Adınız Soyadınız"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">E-posta *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="ornek@klinik.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Telefon *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+90 5XX XXX XX XX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-white/10 text-slate-300 hover:bg-white/5 py-3 rounded-xl transition"
                >
                  Geri
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!form.contactName || !form.email || !form.phone}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  Devam Et <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Plan seçimi */}
          {step === 3 && (
            <div>
              <div className="mb-8">
                <Stethoscope size={32} className="text-emerald-400 mb-3" />
                <h1 className="text-2xl font-bold">Plan Seçin</h1>
                <p className="text-slate-400 text-sm mt-1">14 gün ücretsiz deneme ile başlayın.</p>
              </div>
              <div className="space-y-3 mb-6">
                {plans.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => set("plan", p.id)}
                    className={`w-full text-left p-4 rounded-xl border transition ${
                      form.plan === p.id
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${form.plan === p.id ? "border-indigo-500" : "border-slate-600"}`}>
                          {form.plan === p.id && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white">{p.name}</span>
                            {p.badge && (
                              <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">{p.badge}</span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">{p.idealFor}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <span className="font-bold text-white">₺{p.price}<span className="text-slate-500 font-normal text-xs">/ay</span></span>
                        <div className="text-[10px] text-slate-600">+ ₺{p.setup} kurulum</div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 ${form.plan === p.id ? "bg-indigo-500/15" : "bg-white/[0.03]"}`}>
                      <Phone size={13} className="text-indigo-400 shrink-0" />
                      <span className="text-sm font-medium text-indigo-300">{p.callsPerDay}</span>
                    </div>
                    <div className="flex gap-x-3 gap-y-1 flex-wrap">
                      {p.features.map((f) => (
                        <span key={f} className="text-xs text-slate-400 flex items-center gap-1">
                          <CheckCircle size={11} className="text-emerald-400 shrink-0" /> {f}
                        </span>
                      ))}
                    </div>
                    {p.notFor && (
                      <div className="mt-2.5 text-xs text-amber-400/70 flex items-center gap-1.5">
                        <span>&#9888;</span> {p.notFor}
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 text-sm text-amber-300">
                14 gün ücretsiz deneme sonrası ödeme alınır. İstediğiniz zaman iptal edebilirsiniz.
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-white/10 text-slate-300 hover:bg-white/5 py-3 rounded-xl transition"
                >
                  Geri
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {loading ? "Gönderiliyor..." : "Başvuruyu Gönder"}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Başarı */}
          {step === 4 && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold mb-3">Başvurunuz Alındı!</h1>
              <p className="text-slate-400 leading-relaxed mb-8">
                <strong className="text-white">{form.clinicName}</strong> için başvurunuzu aldık.
                <br />24 saat içinde <strong className="text-white">{form.email}</strong> adresinize
                aktivasyon bilgilerini göndereceğiz.
              </p>
              <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 text-left mb-8">
                <h3 className="font-semibold text-white mb-3 text-sm">Sonraki adımlar:</h3>
                <ul className="space-y-2">
                  {[
                    "E-posta kutunuzu kontrol edin",
                    "Gelen aktivasyon linkiyle giriş yapın",
                    "Doktor ve hizmetlerinizi ekleyin",
                    "Telefon numaranız aktive edilsin",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-slate-400">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/" className="text-indigo-400 hover:text-indigo-300 transition text-sm">
                Ana sayfaya dön
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
