import { db } from "@/lib/db";
import { voiceCalls, appointments } from "@/lib/db/schema";
import { desc, eq, count, sql } from "drizzle-orm";
import Link from "next/link";
import { formatTR } from "@/lib/utils";
import { Phone, Clock, TrendingUp, MessageSquare, User, X } from "lucide-react";
import { getClinic } from "@/lib/clinic";

export const dynamic = "force-dynamic";

const outcomeLabel: Record<string, { label: string; color: string; bg: string }> = {
  randevu_alindi: { label: "Randevu Alındı", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  bilgi_verildi:  { label: "Bilgi Verildi",  color: "text-blue-400",    bg: "bg-blue-500/10" },
  insan_aktarimi: { label: "İnsan Aktarımı", color: "text-amber-400",   bg: "bg-amber-500/10" },
  cevapsiz:       { label: "Cevapsız",       color: "text-slate-400",   bg: "bg-slate-500/10" },
  spam:           { label: "Spam",           color: "text-rose-400",    bg: "bg-rose-500/10" },
  hata:           { label: "Hata",           color: "text-rose-400",    bg: "bg-rose-500/10" },
};

export default async function CallsPage({ searchParams }: { searchParams: Promise<{ outcome?: string }> }) {
  const clinic = await getClinic();
  const { outcome: outcomeFilter } = await searchParams;

  type CallRow = typeof voiceCalls.$inferSelect & { patientName: string | null };

  let calls: CallRow[] = [];
  let outcomeCounts: { outcome: string | null; count: number }[] = [];
  let avgDuration = 0;
  let totalCalls = 0;

  try {
    const [rawCalls, oc] = await Promise.all([
      db
        .select({
          id: voiceCalls.id,
          clinicId: voiceCalls.clinicId,
          externalCallId: voiceCalls.externalCallId,
          phone: voiceCalls.phone,
          direction: voiceCalls.direction,
          durationSeconds: voiceCalls.durationSeconds,
          transcript: voiceCalls.transcript,
          summary: voiceCalls.summary,
          outcome: voiceCalls.outcome,
          appointmentId: voiceCalls.appointmentId,
          recordingUrl: voiceCalls.recordingUrl,
          createdAt: voiceCalls.createdAt,
          patientName: appointments.patientName,
        })
        .from(voiceCalls)
        .leftJoin(appointments, eq(voiceCalls.appointmentId, appointments.id))
        .where(eq(voiceCalls.clinicId, clinic.id))
        .orderBy(desc(voiceCalls.createdAt))
        .limit(100),
      db
        .select({ outcome: voiceCalls.outcome, count: count() })
        .from(voiceCalls)
        .where(eq(voiceCalls.clinicId, clinic.id))
        .groupBy(voiceCalls.outcome),
    ]);

    calls = outcomeFilter ? rawCalls.filter(c => c.outcome === outcomeFilter) : rawCalls;
    outcomeCounts = oc;
    totalCalls = outcomeFilter ? calls.length : rawCalls.length;
    const withDuration = calls.filter(c => c.durationSeconds);
    avgDuration = withDuration.length > 0
      ? Math.round(withDuration.reduce((s, c) => s + (c.durationSeconds ?? 0), 0) / withDuration.length)
      : 0;
  } catch {}

  const booked = outcomeCounts.find(o => o.outcome === "randevu_alindi")?.count ?? 0;
  const convRate = totalCalls > 0 ? Math.round((booked / totalCalls) * 100) : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">AI Görüşme Analizi</h1>
        <p className="text-slate-500 text-sm mt-1">Sesli asistan tarafından gerçekleştirilen aramalar</p>
        {outcomeFilter && (
          <div className="flex items-center gap-2 mt-3">
            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${outcomeLabel[outcomeFilter]?.bg ?? "bg-slate-500/10"} ${outcomeLabel[outcomeFilter]?.color ?? "text-slate-400"}`}>
              {outcomeLabel[outcomeFilter]?.label ?? outcomeFilter}
            </span>
            <Link href="/admin/calls" className="text-xs text-slate-600 hover:text-slate-400 transition flex items-center gap-1">
              <X size={12} />
              Filtreyi kaldır
            </Link>
          </div>
        )}
      </div>

      {/* Özet istatistikler */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Toplam Arama",     value: totalCalls, icon: Phone,        color: "text-cyan-400",    border: "border-cyan-500/20",    bg: "bg-cyan-500/10" },
          { label: "Randevuya Dönen",  value: booked,     icon: TrendingUp,   color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/10" },
          { label: "Dönüşüm Oranı",   value: `%${convRate}`, icon: MessageSquare, color: "text-indigo-400", border: "border-indigo-500/20", bg: "bg-indigo-500/10" },
          { label: "Ort. Süre", value: avgDuration > 0 ? `${Math.floor(avgDuration/60)}:${String(avgDuration%60).padStart(2,"0")}` : "—", icon: Clock, color: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/10" },
        ].map(s => (
          <div key={s.label} className={`bg-[#0D1117] border ${s.border} rounded-2xl p-5 flex items-center gap-4`}>
            <div className={`${s.bg} p-3 rounded-xl shrink-0`}>
              <s.icon size={20} className={s.color} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sonuç dağılımı */}
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5">
          <h2 className="font-semibold text-white text-sm mb-4">Görüşme Sonuçları</h2>
          <div className="space-y-3">
            {outcomeCounts.sort((a, b) => b.count - a.count).map(oc => {
              const key = oc.outcome ?? "hata";
              const info = outcomeLabel[key] ?? { label: key, color: "text-slate-400", bg: "bg-slate-500/10" };
              const pct = totalCalls > 0 ? Math.round((oc.count / totalCalls) * 100) : 0;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={info.color}>{info.label}</span>
                    <span className="text-slate-500">{oc.count} (%{pct})</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {outcomeCounts.length === 0 && (
              <p className="text-slate-600 text-xs text-center py-4">Henüz arama verisi yok</p>
            )}
          </div>
        </div>

        {/* Görüşme listesi */}
        <div className="lg:col-span-2 bg-[#0D1117] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h2 className="font-semibold text-white text-sm">Son Görüşmeler</h2>
          </div>
          <div className="divide-y divide-white/5">
            {calls.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                <Phone size={32} className="mb-2 opacity-30" />
                <p className="text-sm">Henüz arama kaydı yok</p>
              </div>
            ) : calls.slice(0, 8).map(c => {
              const info = c.outcome ? (outcomeLabel[c.outcome] ?? { label: c.outcome, color: "text-slate-400", bg: "bg-slate-500/10" }) : null;
              const dur = c.durationSeconds
                ? `${Math.floor(c.durationSeconds / 60)}:${String(c.durationSeconds % 60).padStart(2, "0")}`
                : null;
              return (
                <Link key={c.id} href={`/admin/calls/${c.id}`} className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition group">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={15} className="text-slate-500" />
                  </div>

                  {/* Hasta bilgisi */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">
                        {c.patientName ?? "Bilinmiyor"}
                      </span>
                      <span className="text-xs text-slate-600">{c.phone}</span>
                      {info && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-md ${info.bg} ${info.color}`}>{info.label}</span>
                      )}
                    </div>
                    {c.summary ? (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{c.summary}</p>
                    ) : (
                      <p className="text-xs text-slate-600 mt-0.5">
                        {c.direction === "inbound" ? "Gelen arama" : "Giden arama"}
                        {dur ? ` · ${dur}` : ""}
                      </p>
                    )}
                  </div>

                  {/* Sağ taraf */}
                  <div className="text-right shrink-0 space-y-1">
                    <div className="text-xs text-slate-600">{formatTR(c.createdAt, "d MMM, HH:mm")}</div>
                    {dur && <div className="text-xs text-slate-700">{dur}</div>}
                  </div>
                </Link>
              );
            })}
          </div>
          {calls.length > 8 && (
            <div className="px-5 py-3 border-t border-white/5 text-center">
              <span className="text-xs text-slate-600">+{calls.length - 8} daha fazla görüşme</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
