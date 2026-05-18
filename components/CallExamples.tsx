"use client";

import { useState } from "react";
import { ChevronDown, Phone } from "lucide-react";

const EXAMPLES = [
  {
    id: "lazer",
    title: "Lazer epilasyon fiyat & seans sorusu",
    duration: "2:18",
    outcome: "Ücretsiz konsültasyon randevusu alındı",
    outcomeColor: "text-emerald-400",
    summary: "Müşteri tüm bacak lazer epilasyon fiyatını sordu. AI fiyat vermek yerine kişiselleştirilmiş konsültasyona yönlendirdi ve randevu oluşturdu.",
    messages: [
      { role: "ai", text: "Merhaba, Güzel Estetik Merkezi'ne hoş geldiniz. Size nasıl yardımcı olabilirim?" },
      { role: "human", text: "Lazer epilasyon yaptırmak istiyorum, ne kadar tutuyor?" },
      { role: "ai", text: "Fiyat; ten tipine, bölgeye ve seans planına göre belirleniyor. Net rakamı verebilmemiz için ücretsiz bir konsültasyon yapıyoruz. Uygun bir saat ayarlayabilir miyim?" },
      { role: "human", text: "Tamam, ne zaman olur?" },
      { role: "ai", text: "Bu hafta Perşembe 15:00 müsait. Adınız ve numaranız nedir?" },
      { role: "human", text: "Merve Koç, 0533 200 10 20." },
      { role: "ai", text: "0533 200 10 20 — doğru mu?" },
      { role: "human", text: "Evet." },
      { role: "ai", text: "Perşembe 15:00 randevunuz oluşturuldu, Merve Hanım. Görüşmek üzere." },
    ],
  },
  {
    id: "botoks",
    title: "Botoks + dolgu kombine danışma",
    duration: "3:04",
    outcome: "Konsültasyon randevusu alındı",
    outcomeColor: "text-emerald-400",
    summary: "Müşteri hem botoks hem dolgu hakkında sordu. AI her ikisi için de fiyat sormak yerine uzman değerlendirmesine yönlendirdi.",
    messages: [
      { role: "ai", text: "Merhaba, Güzel Estetik Merkezi. Nasıl yardımcı olabilirim?" },
      { role: "human", text: "Alın çizgileri için botoks, dudak dolgusu — ikisini aynı seansta yaptırabilir miyim?" },
      { role: "ai", text: "Evet, çoğu zaman aynı seansta yapılabiliyor, ama bu uzmanımızın yüz yapınıza bakıp karar vermesi gereken bir şey. Ücretsiz konsültasyonda hem botoks hem dolgu için en uygun planı çıkarsın ister misiniz?" },
      { role: "human", text: "Evet, ne zaman olur?" },
      { role: "ai", text: "Cuma 11:00 uygun. Adınız ve numaranız alabilir miyim?" },
      { role: "human", text: "Elif Şahin, 0542 333 44 55." },
      { role: "ai", text: "0542 333 44 55 — doğru mu?" },
      { role: "human", text: "Doğru." },
      { role: "ai", text: "Cuma 11:00 oluşturuldu, Elif Hanım. Görüşmek üzere, iyi günler." },
    ],
  },
  {
    id: "iptal",
    title: "Randevu iptal & yeniden planlama",
    duration: "1:42",
    outcome: "Randevu yeniden planlandı",
    outcomeColor: "text-cyan-400",
    summary: "Mevcut bir müşteri randevusunu iptal etmek istedi. AI iptal etti ve hemen yeni bir saat önerdi.",
    messages: [
      { role: "ai", text: "Merhaba, Güzel Estetik Merkezi. Nasıl yardımcı olabilirim?" },
      { role: "human", text: "Salı günü randevum var, iptal etmek istiyorum." },
      { role: "ai", text: "Tabii. Randevunuzu bulabilmem için adınızı ya da numaranızı alabilir miyim?" },
      { role: "human", text: "Selin Demir, 0532 100 20 30." },
      { role: "ai", text: "Salı 14:30'daki randevunuzu iptal edeyim mi? Hemen başka bir saat de önerebilirim." },
      { role: "human", text: "Evet, iptal edin ama Perşembe var mı?" },
      { role: "ai", text: "Perşembe 10:00 ve 16:00 müsait. Hangisi uygun?" },
      { role: "human", text: "16:00 olsun." },
      { role: "ai", text: "Salı iptal edildi, Perşembe 16:00 oluşturuldu. İyi günler, Selin Hanım." },
    ],
  },
];

function Message({ msg }: { msg: { role: string; text: string } }) {
  return (
    <div className={`flex ${msg.role === "human" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
          msg.role === "ai"
            ? "bg-indigo-600/10 border border-indigo-500/15 text-slate-300 rounded-tl-sm"
            : "bg-white/8 text-slate-400 rounded-tr-sm"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}

export default function CallExamples() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-cyan-400 text-sm font-medium uppercase tracking-widest mb-3">Çağrı Örnekleri</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Gerçek konuşmalar, gerçek sonuçlar
          </h2>
          <p className="text-slate-400 mt-3 max-w-lg mx-auto">
            AI&apos;ın estetik klinik aramalarını nasıl yönettiğini görün.
          </p>
        </div>

        <div className="space-y-3">
          {EXAMPLES.map((ex) => (
            <div key={ex.id} className="bg-[#0D1117] border border-white/5 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === ex.id ? null : ex.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <Phone size={14} className="text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white text-sm font-medium truncate">{ex.title}</div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-slate-600 text-xs">{ex.duration}</span>
                      <span className={`text-xs font-medium ${ex.outcomeColor}`}>{ex.outcome}</span>
                    </div>
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-500 shrink-0 transition-transform ${open === ex.id ? "rotate-180" : ""}`}
                />
              </button>

              {open === ex.id && (
                <div className="border-t border-white/5">
                  <div className="px-5 py-3 bg-white/[0.01]">
                    <p className="text-xs text-slate-500 leading-relaxed">{ex.summary}</p>
                  </div>
                  <div className="px-4 py-4 space-y-2 max-h-72 overflow-y-auto">
                    {ex.messages.map((msg, i) => (
                      <Message key={i} msg={msg} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
