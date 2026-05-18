import { Phone, MessageSquare, Calendar, CheckCircle, ArrowDown } from "lucide-react";

const STEPS = [
  {
    icon: Phone,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    title: "Hasta Arar",
    desc: "Gece 23:00'de bile. AI asistan hemen karşılar.",
    detail: "7/24 aktif · Bekleme süresi sıfır",
  },
  {
    icon: MessageSquare,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    title: "AI Konuşur, Randevu Alır",
    desc: "Soruyu cevaplar, konsültasyon randevusu oluşturur.",
    detail: "Türkçe doğal konuşma · Fiyat soruları yönetilir",
  },
  {
    icon: MessageSquare,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    title: "WhatsApp Onay Mesajı",
    desc: "Anında WhatsApp mesajı: tarih, saat ve klinik bilgisi.",
    detail: "Otomatik · Kişiselleştirilmiş",
  },
  {
    icon: Calendar,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    title: "Hatırlatıcı Gönderilir",
    desc: "24 saat ve 2 saat önce WhatsApp hatırlatması.",
    detail: "Gelmeme oranı %35 azalır",
  },
  {
    icon: CheckCircle,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    title: "Hasta Gelir, Seans Tamamlanır",
    desc: "Personeliniz sadece uygulamaya odaklanır.",
    detail: "Operasyon yükü %60 azalır",
  },
];

export default function WhatsAppFlow() {
  return (
    <section className="py-24 px-4 bg-white/[0.015] border-y border-white/5">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-widest mb-3">Otomatik Akış</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Aramadan seansa — tamamen otomatik
          </h2>
          <p className="text-slate-400 mt-3 max-w-lg mx-auto">
            WhatsApp entegrasyonu ile hasta hiçbir adımı kaçırmıyor.
          </p>
        </div>

        <div className="relative">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex gap-4 mb-2">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={step.color} />
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 flex items-center justify-center my-1">
                      <ArrowDown size={14} className="text-white/10" />
                    </div>
                  )}
                </div>
                <div className={`flex-1 pb-5 ${i < STEPS.length - 1 ? "" : ""}`}>
                  <div className="bg-[#0D1117] border border-white/5 rounded-xl p-4 hover:border-white/10 transition">
                    <div className="font-semibold text-white text-sm mb-1">{step.title}</div>
                    <div className="text-slate-400 text-xs leading-relaxed mb-2">{step.desc}</div>
                    <div className={`text-[11px] font-medium ${step.color} bg-current/10 inline-block px-2 py-0.5 rounded-full`}
                      style={{ backgroundColor: "transparent" }}
                    >
                      <span className={`${step.color}`}>{step.detail}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* WhatsApp mockup */}
        <div className="mt-8 bg-[#0D1117] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <MessageSquare size={12} className="text-white" />
            </div>
            <span className="text-xs text-slate-400 font-medium">WhatsApp — Güzel Estetik Merkezi</span>
          </div>
          <div className="space-y-2">
            <div className="bg-emerald-900/20 border border-emerald-800/30 rounded-xl rounded-tl-sm px-3 py-2.5 max-w-[90%] text-xs text-slate-300 leading-relaxed">
              Merhaba Selin Hanım! Randevunuz onaylandı.<br/>
              <span className="font-medium text-white">Tarih:</span> Perşembe, 22 Mayıs · 14:00<br/>
              <span className="font-medium text-white">Hizmet:</span> Ücretsiz Konsültasyon<br/>
              <span className="font-medium text-white">Adres:</span> Bağcılar Mah. No:12, İstanbul<br/><br/>
              Görüşmek üzere!<br/>
              <span className="text-slate-600 text-[10px]">– Güzel Estetik Merkezi AI Asistan</span>
            </div>
            <div className="text-[10px] text-slate-700 ml-1">14:32 · Teslim edildi</div>
          </div>
        </div>
      </div>
    </section>
  );
}
