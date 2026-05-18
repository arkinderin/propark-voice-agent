import { db } from "@/lib/db";
import { voiceCalls, appointments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatTR } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Phone, Clock, MessageSquare, FileText, Mic } from "lucide-react";

export const dynamic = "force-dynamic";

const outcomeLabel: Record<string, { label: string; color: string; bg: string }> = {
  randevu_alindi: { label: "Randevu Alındı", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  bilgi_verildi:  { label: "Bilgi Verildi",  color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
  insan_aktarimi: { label: "İnsan Aktarımı", color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" },
  cevapsiz:       { label: "Cevapsız",       color: "text-slate-400",   bg: "bg-slate-500/10 border-slate-500/20" },
  spam:           { label: "Spam",           color: "text-rose-400",    bg: "bg-rose-500/10 border-rose-500/20" },
  hata:           { label: "Hata",           color: "text-rose-400",    bg: "bg-rose-500/10 border-rose-500/20" },
};

export default async function CallDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let call: typeof voiceCalls.$inferSelect | undefined;
  let patientName: string | null = null;
  try {
    call = await db.query.voiceCalls.findFirst({ where: eq(voiceCalls.id, id) });
    if (call?.appointmentId) {
      const appt = await db.query.appointments.findFirst({ where: eq(appointments.id, call.appointmentId) });
      patientName = appt?.patientName ?? null;
    }
  } catch {}
  if (!call) notFound();

  const info = call.outcome ? (outcomeLabel[call.outcome] ?? { label: call.outcome, color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20" }) : null;
  const dur = call.durationSeconds ? `${Math.floor(call.durationSeconds / 60)}:${String(call.durationSeconds % 60).padStart(2, "0")}` : null;

  return (
    <div className="max-w-2xl">
      <Link href="/admin/calls" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition mb-6">
        <ArrowLeft size={14} /> Görüşmelere Dön
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{patientName ?? call.phone}</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {patientName && <span className="mr-2">{call.phone} ·</span>}
            {formatTR(call.createdAt, "d MMMM yyyy, HH:mm")}
          </p>
        </div>
        {info && (
          <span className={`text-sm px-3 py-1 rounded-full border ${info.bg} ${info.color}`}>{info.label}</span>
        )}
      </div>

      {/* Meta bilgiler */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-[#0D1117] border border-white/5 rounded-xl p-4 flex items-center gap-3">
          <Phone size={16} className="text-slate-500" />
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Yön</div>
            <div className="text-sm text-white">{call.direction === "inbound" ? "Gelen" : "Giden"}</div>
          </div>
        </div>
        <div className="bg-[#0D1117] border border-white/5 rounded-xl p-4 flex items-center gap-3">
          <Clock size={16} className="text-slate-500" />
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Süre</div>
            <div className="text-sm text-white">{dur ?? "—"}</div>
          </div>
        </div>
        {call.appointmentId && (
          <Link href={`/admin/appointments/${call.appointmentId}`} className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-center gap-3 hover:bg-indigo-500/15 transition">
            <MessageSquare size={16} className="text-indigo-400" />
            <div>
              <div className="text-xs text-indigo-400/70 mb-0.5">Randevu</div>
              <div className="text-sm text-indigo-300">Görüntüle →</div>
            </div>
          </Link>
        )}
      </div>

      {/* AI Özeti */}
      {call.summary && (
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white font-black text-xs">AI</span>
            </div>
            <h2 className="text-sm font-semibold text-white">AI Görüşme Özeti</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{call.summary}</p>
        </div>
      )}

      {/* Transkript */}
      {call.transcript && (
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={15} className="text-slate-500" />
            <h2 className="text-sm font-semibold text-white">Görüşme Transkripti</h2>
          </div>
          <pre className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto scrollbar-thin">
            {call.transcript}
          </pre>
        </div>
      )}

      {/* Ses kaydı */}
      {call.recordingUrl && (
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Mic size={15} className="text-slate-500" />
            <h2 className="text-sm font-semibold text-white">Ses Kaydı</h2>
          </div>
          <audio controls src={call.recordingUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}
