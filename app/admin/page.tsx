import { db } from "@/lib/db";
import { appointments, voiceCalls } from "@/lib/db/schema";
import { eq, gte, count, and, sql } from "drizzle-orm";
import Link from "next/link";
import { Calendar, Phone, TrendingUp, Clock, ArrowRight, CheckCircle, BarChart2 } from "lucide-react";
import { getClinic } from "@/lib/clinic";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const clinic = await getClinic();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let todayCount = 0;
  let pendingCount = 0;
  let totalCalls = 0;
  let totalAppts = 0;
  let outcomeCounts: { outcome: string | null; cnt: number }[] = [];
  let avgDuration = 0;

  try {
    const [tc, pc, vc, ta, oc, ad] = await Promise.all([
      db.select({ count: count() }).from(appointments).where(and(eq(appointments.clinicId, clinic.id), gte(appointments.appointmentAt, today))),
      db.select({ count: count() }).from(appointments).where(and(eq(appointments.clinicId, clinic.id), eq(appointments.status, "talep"))),
      db.select({ count: count() }).from(voiceCalls).where(eq(voiceCalls.clinicId, clinic.id)),
      db.select({ count: count() }).from(appointments).where(eq(appointments.clinicId, clinic.id)),
      db.select({ outcome: voiceCalls.outcome, cnt: count() }).from(voiceCalls).where(eq(voiceCalls.clinicId, clinic.id)).groupBy(voiceCalls.outcome),
      db.select({ avg: sql<number>`avg(duration_seconds)` }).from(voiceCalls).where(eq(voiceCalls.clinicId, clinic.id)),
    ]);
    todayCount = tc[0].count;
    pendingCount = pc[0].count;
    totalCalls = vc[0].count;
    totalAppts = ta[0].count;
    outcomeCounts = oc;
    avgDuration = Math.round(Number(ad[0]?.avg ?? 0));
  } catch {}

  const conversionRate = totalCalls > 0 ? Math.round((totalAppts / totalCalls) * 100) : 0;

  const outcomeConfig: Record<string, { label: string; color: string }> = {
    randevu_alindi: { label: "Randevu Alındı", color: "bg-emerald-500" },
    bilgi_verildi:  { label: "Bilgi Verildi",  color: "bg-blue-500" },
    insan_aktarimi: { label: "İnsan Aktarımı", color: "bg-amber-500" },
    cevapsiz:       { label: "Cevapsız",       color: "bg-slate-500" },
    spam:           { label: "Spam",           color: "bg-rose-500" },
    hata:           { label: "Hata",           color: "bg-rose-700" },
  };

  const stats = [
    { label: "Bugün Randevu", value: todayCount, icon: Calendar, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { label: "Bekleyen Talep", value: pendingCount, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "Toplam Arama", value: totalCalls, icon: Phone, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { label: "Dönüşüm Oranı", value: `%${conversionRate}`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">{clinic.name}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
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

      {/* Dönüşüm Analizi */}
      <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-indigo-400" />
            <h2 className="font-semibold text-white text-sm">Dönüşüm Analizi</h2>
          </div>
          <Link href="/admin/calls" className="text-xs text-indigo-400 hover:text-indigo-300 transition">
            Tüm Görüşmeler →
          </Link>
        </div>

        {totalCalls === 0 ? (
          <p className="text-slate-600 text-sm text-center py-6">Henüz arama verisi yok</p>
        ) : (
          <>
            {/* Huni */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Toplam Arama", value: totalCalls, color: "text-cyan-400", sub: "AI tarafından karşılandı" },
                { label: "Randevuya Döndü", value: outcomeCounts.find(o => o.outcome === "randevu_alindi")?.cnt ?? 0, color: "text-emerald-400", sub: `%${conversionRate} dönüşüm` },
                { label: "Ort. Görüşme", value: avgDuration > 0 ? `${Math.floor(avgDuration/60)}:${String(avgDuration%60).padStart(2,"0")}` : "—", color: "text-amber-400", sub: "dakika:saniye" },
              ].map(f => (
                <div key={f.label} className="bg-white/[0.02] rounded-xl p-4 text-center">
                  <div className={`text-2xl font-bold ${f.color}`}>{f.value}</div>
                  <div className="text-xs font-medium text-white mt-0.5">{f.label}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">{f.sub}</div>
                </div>
              ))}
            </div>

            {/* Sonuç çubukları */}
            <div className="space-y-2">
              {outcomeCounts.sort((a, b) => b.cnt - a.cnt).map(oc => {
                const key = oc.outcome ?? "hata";
                const cfg = outcomeConfig[key] ?? { label: key, color: "bg-slate-500" };
                const pct = totalCalls > 0 ? Math.round((oc.cnt / totalCalls) * 100) : 0;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-32 shrink-0">{cfg.label}</span>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${cfg.color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-slate-500 w-16 text-right shrink-0">{oc.cnt} (%{pct})</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-4 text-sm">Hızlı Erişim</h2>
          <div className="space-y-1">
            {[
              { href: "/admin/appointments", label: "Randevu Takvimi", icon: Calendar },
              { href: "/admin/calls", label: "AI Görüşme Analizi", icon: Phone },
              { href: "/admin/doctors", label: "Doktor Yönetimi", icon: CheckCircle },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition group"
              >
                <div className="flex items-center gap-2.5 text-sm text-slate-400 group-hover:text-white transition">
                  <item.icon size={15} />
                  {item.label}
                </div>
                <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-4 text-sm">Sistem Durumu</h2>
          <div className="space-y-3">
            {[
              { label: "VAPI Voice Agent", active: !!clinic.vapiAssistantId },
              { label: "Telefon Numarası", active: !!clinic.vapiPhoneNumberId },
              { label: "Webhook Bağlantısı", active: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{item.label}</span>
                <div className={`flex items-center gap-1.5 text-xs font-medium ${item.active ? "text-emerald-400" : "text-rose-400"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${item.active ? "bg-emerald-400" : "bg-rose-400"}`} />
                  {item.active ? "Aktif" : "Pasif"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
