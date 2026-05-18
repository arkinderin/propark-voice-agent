"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Phone, PhoneOff, Mic, MicOff, ChevronRight, Loader2 } from "lucide-react";
import Vapi from "@vapi-ai/web";

const DEMO_PHONE = "+1 (707) 669-9123";

type CallStatus = "idle" | "connecting" | "active" | "ending" | "ended";

type Transcript = { role: "assistant" | "user"; text: string };

export default function DemoSection() {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const vapiRef = useRef<Vapi | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcripts]);

  const initVapi = useCallback(() => {
    if (vapiRef.current) return vapiRef.current;
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!;
    const vapi = new Vapi(publicKey);

    vapi.on("call-start", () => setStatus("active"));
    vapi.on("call-end", () => {
      setStatus("ended");
      setTimeout(() => setStatus("idle"), 3000);
    });
    vapi.on("error", (e) => {
      console.error("VAPI error", e);
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
      setStatus("idle");
    });
    vapi.on("volume-level", (vol: number) => setVolumeLevel(vol));
    vapi.on("message", (msg: { type: string; role?: string; transcript?: string; transcriptType?: string }) => {
      if (msg.type === "transcript" && msg.transcriptType === "final" && msg.role && msg.transcript) {
        setTranscripts((prev) => [
          ...prev,
          { role: msg.role as "assistant" | "user", text: msg.transcript! },
        ]);
      }
    });

    vapiRef.current = vapi;
    return vapi;
  }, []);

  const startCall = async () => {
    setError(null);
    setTranscripts([]);
    setStatus("connecting");
    try {
      const vapi = initVapi();
      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!;
      await vapi.start(assistantId);
    } catch (e) {
      console.error(e);
      setError("Arama başlatılamadı. Mikrofon izni verildiğinden emin olun.");
      setStatus("idle");
    }
  };

  const endCall = async () => {
    setStatus("ending");
    vapiRef.current?.stop();
  };

  const toggleMute = () => {
    if (!vapiRef.current) return;
    if (isMuted) {
      vapiRef.current.setMuted(false);
      setIsMuted(false);
    } else {
      vapiRef.current.setMuted(true);
      setIsMuted(true);
    }
  };

  const volumeBars = Array.from({ length: 5 }, (_, i) => i < Math.round(volumeLevel * 5));

  return (
    <section id="demo" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest mb-3">Canlı Demo</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            AI&apos;yı şimdi duyun
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">
            Tarayıcınızdan doğrudan konuşun. Gerçek AI asistan — lazer randevusu, fiyat sorusu, her şeyi deneyin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Call panel */}
          <div className="bg-gradient-to-b from-indigo-600/10 to-transparent border border-indigo-500/20 rounded-2xl p-8">

            {/* Status indicator */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {status === "idle" && (
                <span className="text-slate-500 text-sm">Aramaya hazır</span>
              )}
              {status === "connecting" && (
                <>
                  <Loader2 size={14} className="text-indigo-400 animate-spin" />
                  <span className="text-indigo-400 text-sm">Bağlanıyor...</span>
                </>
              )}
              {status === "active" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-sm font-medium">Görüşme aktif</span>
                  {/* Volume bars */}
                  <div className="flex items-end gap-0.5 h-4 ml-2">
                    {volumeBars.map((active, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all ${active ? "bg-emerald-400" : "bg-white/10"}`}
                        style={{ height: `${(i + 1) * 20}%` }}
                      />
                    ))}
                  </div>
                </>
              )}
              {status === "ending" && (
                <span className="text-slate-400 text-sm">Kapatılıyor...</span>
              )}
              {status === "ended" && (
                <span className="text-emerald-400 text-sm">Görüşme tamamlandı</span>
              )}
            </div>

            {/* Main call button */}
            <div className="flex justify-center mb-6">
              {status === "idle" || status === "ended" ? (
                <button
                  onClick={startCall}
                  className="w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center transition shadow-2xl shadow-indigo-900/50 hover:scale-105 active:scale-95"
                >
                  <Phone size={32} className="text-white" />
                </button>
              ) : status === "connecting" ? (
                <div className="w-20 h-20 rounded-full bg-indigo-600/50 border-2 border-indigo-500 flex items-center justify-center animate-pulse">
                  <Phone size={32} className="text-white/50" />
                </div>
              ) : (
                <button
                  onClick={endCall}
                  className="w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center transition shadow-2xl shadow-rose-900/50 hover:scale-105 active:scale-95"
                >
                  <PhoneOff size={32} className="text-white" />
                </button>
              )}
            </div>

            {/* Mute button — only when active */}
            {status === "active" && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={toggleMute}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition border ${
                    isMuted
                      ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                  {isMuted ? "Sessize alındı" : "Mikrofon açık"}
                </button>
              </div>
            )}

            {error && (
              <p className="text-rose-400 text-xs text-center mb-4 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <p className="text-center text-slate-600 text-xs mb-6">
              {status === "idle"
                ? "Yeşil butona basın, konuşmaya başlayın"
                : status === "active"
                ? "Kırmızı butona basarak kapatın"
                : ""}
            </p>

            {/* Divider */}
            <div className="border-t border-white/5 pt-6">
              <p className="text-slate-500 text-xs text-center mb-3">Veya doğrudan arayın</p>
              <a
                href={`tel:${DEMO_PHONE.replace(/\s|\(|\)|-/g, "")}`}
                className="flex items-center justify-center gap-2 text-slate-300 hover:text-white transition text-sm font-medium"
              >
                <Phone size={14} className="text-indigo-400" />
                {DEMO_PHONE}
              </a>
              <p className="text-center text-xs text-slate-700 mt-1">ABD numarası · 7/24 aktif</p>
            </div>
          </div>

          {/* Transcript panel */}
          <div className="bg-[#0D1117] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[460px]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0A0E1A] shrink-0">
              <span className={`w-2 h-2 rounded-full ${status === "active" ? "bg-emerald-400 animate-pulse" : "bg-white/10"}`} />
              <span className="text-xs text-slate-500 font-medium">Konuşma Metni</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {transcripts.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-slate-600 text-sm text-center leading-relaxed">
                    Aramayı başlatın ve konuşun.<br />
                    <span className="text-slate-700 text-xs mt-1 block">
                      Lazer randevusu, fiyat sorusu,<br />botoks — her şeyi deneyin.
                    </span>
                  </p>
                </div>
              )}

              {transcripts.map((t, i) => (
                <div key={i} className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      t.role === "assistant"
                        ? "bg-indigo-600/15 border border-indigo-500/20 text-slate-200 rounded-tl-sm"
                        : "bg-white/8 text-slate-300 rounded-tr-sm"
                    }`}
                  >
                    {t.role === "assistant" && (
                      <div className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider mb-1">AI Asistan</div>
                    )}
                    {t.text}
                  </div>
                </div>
              ))}

              {status === "active" && transcripts.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-indigo-600/10 border border-indigo-500/15 rounded-2xl rounded-tl-sm px-3 py-2.5">
                    <div className="flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>
        </div>

        {/* Bottom features */}
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
