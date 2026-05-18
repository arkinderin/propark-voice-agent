"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, PhoneCall, Mic, MicOff, ChevronRight } from "lucide-react";

const DEMO_PHONE = "+1 (707) 669-9123";

const conversation = [
  { role: "ai", text: "Merhaba, Güzel Estetik Merkezi'ne hoş geldiniz. Size nasıl yardımcı olabilirim?" },
  { role: "human", text: "Lazer epilasyon hakkında bilgi almak istiyorum." },
  { role: "ai", text: "Tabii ki. Lazer epilasyon; tene ve bölgeye göre ortalama 6 ila 10 seans arasında tamamlanıyor. Sonuçlar kişiden kişiye değişse de çok etkili bir yöntem. Hangi bölge için düşünüyordunuz?" },
  { role: "human", text: "Tüm bacak. Fiyatı ne kadar?" },
  { role: "ai", text: "Fiyat; bölge büyüklüğüne, ten tipine ve seans planına göre belirleniyor. Net rakam için ücretsiz bir konsültasyon randevusu almak en doğrusu olur. Size en uygun günü ve saati hemen ayarlayabilirim, ister misiniz?" },
  { role: "human", text: "Evet, olur." },
  { role: "ai", text: "Harika. Adınızı ve iletişim numaranızı alabilir miyim?" },
  { role: "human", text: "Selin Arslan, 0532 400 00 12." },
  { role: "ai", text: "Selin Hanım, 0532 400 00 12 — bu numara doğru mu?" },
  { role: "human", text: "Evet, doğru." },
  { role: "ai", text: "Yarın, Salı, saat 14:00 uygun mu? Uzmanımız ücretsiz olarak değerlendirme yapacak." },
  { role: "human", text: "Evet, uygun." },
  { role: "ai", text: "Randevunuz oluşturuldu. Yarın 14:00'de bekliyoruz, Selin Hanım. İyi günler." },
];

export default function DemoSection() {
  const [playing, setPlaying] = useState(false);
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!playing) return;
    if (shown >= conversation.length) { setPlaying(false); return; }

    setTyping(true);
    const delay = 600 + conversation[shown].text.length * 18;
    timerRef.current = setTimeout(() => {
      setShown((s) => s + 1);
      setTyping(false);
    }, delay);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, shown]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [shown, typing]);

  const handleStart = () => {
    setShown(0);
    setTyping(false);
    setPlaying(true);
  };

  const handleStop = () => {
    setPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <section id="demo" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest mb-3">Canlı Demo</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            AI&apos;yı duyun, kendiniz karar verin
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">
            Gerçek bir klinik asistanı gibi konuşuyor — fiyat sorularını yönetiyor, konsültasyon randevusu alıyor.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Call to action — phone */}
          <div className="bg-gradient-to-b from-indigo-600/10 to-transparent border border-indigo-500/20 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
              <Phone size={28} className="text-indigo-400" />
            </div>
            <p className="text-slate-400 text-sm mb-2">Şimdi arayın — gerçek AI asistanıyla konuşun</p>
            <a
              href={`tel:${DEMO_PHONE.replace(/\s|\(|\)|-/g, "")}`}
              className="text-3xl font-black text-white tracking-tight hover:text-indigo-300 transition block mb-6"
            >
              {DEMO_PHONE}
            </a>
            <div className="flex flex-col gap-2 text-xs text-slate-600">
              <span className="flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Hat aktif — 7/24 yanıt veriyor
              </span>
              <span>Uluslararası arama ücreti operatörünüze göre değişir</span>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-slate-500 text-sm mb-4">Veya aşağıdaki simüle konuşmayı izleyin</p>
              {!playing ? (
                <button
                  onClick={handleStart}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
                >
                  <PhoneCall size={16} />
                  Demo Konuşmasını Başlat
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
                >
                  <MicOff size={16} />
                  Durdur
                </button>
              )}
            </div>
          </div>

          {/* Transcript */}
          <div className="bg-[#0D1117] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[460px]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0A0E1A] shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-500 font-medium">AI Asistan · Güzel Estetik Merkezi</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {shown === 0 && !playing && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-slate-600 text-sm text-center">
                    Demo konuşmasını başlatmak için<br />soldaki butona tıklayın
                  </p>
                </div>
              )}

              {conversation.slice(0, shown).map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "human" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "ai"
                        ? "bg-indigo-600/15 border border-indigo-500/20 text-slate-200 rounded-tl-sm"
                        : "bg-white/10 text-slate-300 rounded-tr-sm"
                    }`}
                  >
                    {msg.role === "ai" && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <Mic size={10} className="text-indigo-400" />
                        <span className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider">AI Asistan</span>
                      </div>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="bg-indigo-600/15 border border-indigo-500/20 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {shown >= conversation.length && (
                <div className="text-center py-3">
                  <span className="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1">
                    Randevu oluşturuldu
                  </span>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-slate-600">
          {[
            "Türkçe doğal konuşma",
            "Fiyat soruları → konsültasyona yönlendirme",
            "Telefon numarası doğrulama",
            "Anında randevu kaydı",
          ].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <ChevronRight size={11} className="text-indigo-500" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
