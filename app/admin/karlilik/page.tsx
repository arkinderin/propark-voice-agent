import { db } from "@/lib/db";
import { clinics, subscriptions, voiceCalls } from "@/lib/db/schema";
import { eq, gte, lte, count, sum, avg, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Phone, DollarSign, Activity, Users } from "lucide-react";

export const dynamic = "force-dynamic";

// ─── Maliyet Sabitleri ───────────────────────────────────────────────────────
const USD_TRY          = 35;       // güncelle: gerçek kur
const VAPI_PER_MIN_USD = 0.062;    // VAPI AI ($0.05) + Twilio TR inbound ($0.012)
const INFRA_PER_CLINIC = 150;      // Vercel + DB + Auth payı (₺)
const IYZICO_RATE      = 0.0285;   // iyzico komisyon oranı

const PLAN_MRR: Record<string, number> = {
  baslangic:  1990,
  profesyonel: 4490,
  kurumsal:   9990,
};

const PLAN_PHONE_COST: Record<string, number> = {
  baslangic:  115,   // 1 hat
  profesyonel: 230,  // 2 hat
  kurumsal:   575,   // 5 hat
};

const PLAN_WASM_COST: Record<string, number> = {
  baslangic:  0,    // WhatsApp + SMS yok
  profesyonel: 350, // tahmini WA takip + SMS hatırlatma
  kurumsal:   0,    // contact sales → özel hesap
};

const PLAN_LABELS: Record<string, string> = {
  baslangic:  "Solo Klinik",
  profesyonel: "Aktif Klinik",
  kurumsal:   "Kurumsal",
};

const PLAN_INTERACTION_LIMIT: Record<string, number> = {
  baslangic:  150,
  profesyonel: 300,
  kurumsal:   1800,
};

// ─── Yardımcı ────────────────────────────────────────────────────────────────
function marginColor(pct: number) {
  if (pct >= 20) return "text-emerald-400";
  if (pct >= 8)  return "text-amber-400";
  return "text-rose-400";
}

function marginBg(pct: number) {
  if (pct >= 20) return "bg-emerald-500/10 border-emerald-500/20";
  if (pct >= 8)  return "bg-amber-500/10 border-amber-500/20";
  return "bg-rose-500/10 border-rose-500/20";
}

function MarginIcon({ pct }: { pct: number }) {
  if (pct >= 20) return <TrendingUp size={14} className="text-emerald-400" />;
  if (pct >= 8)  return <Minus size={14} className="text-amber-400" />;
  return <TrendingDown size={14} className="text-rose-400" />;
}

function fmt(n: number) {
  return n.toLocaleString("tr-TR", { maximumFractionDigits: 0 });
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function KarlilikPage() {
  const { userId } = await auth();

  // Sadece uygulama sahibi görebilir
  const ownerId = process.env.SUPERADMIN_CLERK_USER_ID;
  if (!userId || (ownerId && userId !== ownerId)) {
    redirect("/admin");
  }

  const now       = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  // Tüm klinikler + aktif abonelikler
  const [allClinics, allSubs] = await Promise.all([
    db.select().from(clinics),
    db.select().from(subscriptions).where(eq(subscriptions.status, "active")),
  ]);

  // Bu ay çağrı istatistikleri — klinik başına
  const [thisMonthStats, lastMonthStats] = await Promise.all([
    db.select({
      clinicId:          voiceCalls.clinicId,
      callCount:         count(voiceCalls.id),
      totalDurationSec:  sum(voiceCalls.durationSeconds),
      totalCostUsd:      sum(voiceCalls.costUsd),
      avgDurationSec:    avg(voiceCalls.durationSeconds),
    })
    .from(voiceCalls)
    .where(gte(voiceCalls.createdAt, monthStart))
    .groupBy(voiceCalls.clinicId),

    db.select({
      clinicId:     voiceCalls.clinicId,
      totalCostUsd: sum(voiceCalls.costUsd),
    })
    .from(voiceCalls)
    .where(and(
      gte(voiceCalls.createdAt, lastMonthStart),
      lte(voiceCalls.createdAt, lastMonthEnd),
    ))
    .groupBy(voiceCalls.clinicId),
  ]);

  // ─── P&L hesabı ─────────────────────────────────────────────────────────
  const rows = allClinics.map(clinic => {
    const sub        = allSubs.find(s => s.clinicId === clinic.id);
    const thisStat   = thisMonthStats.find(s => s.clinicId === clinic.id);
    const lastStat   = lastMonthStats.find(s => s.clinicId === clinic.id);
    const plan       = sub?.plan ?? "baslangic";

    const revenue      = PLAN_MRR[plan] ?? 0;
    const vapiCostUsd  = Number(thisStat?.totalCostUsd ?? 0);
    const vapiCostTRY  = vapiCostUsd * USD_TRY;
    const phoneCost    = PLAN_PHONE_COST[plan] ?? 115;
    const waSmsCost    = PLAN_WASM_COST[plan] ?? 0;
    const iyzicoFee    = revenue * IYZICO_RATE;
    const totalCOGS    = vapiCostTRY + phoneCost + waSmsCost + INFRA_PER_CLINIC + iyzicoFee;
    const grossProfit  = revenue - totalCOGS;
    const grossMargin  = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

    const callCount       = Number(thisStat?.callCount ?? 0);
    const avgDurMin       = Number(thisStat?.avgDurationSec ?? 0) / 60;
    const costPerCallTRY  = callCount > 0 ? vapiCostTRY / callCount : 0;
    const interactionLimit = PLAN_INTERACTION_LIMIT[plan] ?? 150;
    const usagePct        = interactionLimit > 0 ? (callCount / interactionLimit) * 100 : 0;

    const lastVapiCostTRY = Number(lastStat?.totalCostUsd ?? 0) * USD_TRY;
    const vapiTrend       = lastVapiCostTRY > 0
      ? ((vapiCostTRY - lastVapiCostTRY) / lastVapiCostTRY) * 100
      : null;

    return {
      id: clinic.id,
      name: clinic.name,
      specialty: clinic.specialty,
      plan,
      subStatus: sub?.status ?? "none",
      revenue,
      vapiCostUsd,
      vapiCostTRY,
      phoneCost,
      waSmsCost,
      iyzicoFee,
      totalCOGS,
      grossProfit,
      grossMargin,
      callCount,
      avgDurMin,
      costPerCallTRY,
      interactionLimit,
      usagePct,
      vapiTrend,
    };
  });

  // En riskli önce
  rows.sort((a, b) => a.grossMargin - b.grossMargin);

  // ─── Global istatistikler ────────────────────────────────────────────────
  const totalMRR        = rows.reduce((s, r) => s + r.revenue, 0);
  const totalCOGS       = rows.reduce((s, r) => s + r.totalCOGS, 0);
  const totalGP         = totalMRR - totalCOGS;
  const avgMargin       = rows.length > 0
    ? rows.reduce((s, r) => s + r.grossMargin, 0) / rows.length
    : 0;
  const atRisk          = rows.filter(r => r.grossMargin < 8).length;
  const totalVapiUsd    = rows.reduce((s, r) => s + r.vapiCostUsd, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Kârlılık Analizi</h1>
        <p className="text-slate-500 text-sm mt-1">
          {now.toLocaleString("tr-TR", { month: "long", year: "numeric" })} · Gerçek zamanlı maliyet takibi
        </p>
      </div>

      {/* Global özet kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Toplam MRR",
            value: `₺${fmt(totalMRR)}`,
            sub: `${rows.length} aktif klinik`,
            icon: DollarSign,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
          },
          {
            label: "Toplam COGS",
            value: `₺${fmt(totalCOGS)}`,
            sub: `₺${fmt(totalVapiUsd * USD_TRY)} VAPI dahil`,
            icon: Activity,
            color: "text-rose-400",
            bg: "bg-rose-500/10",
            border: "border-rose-500/20",
          },
          {
            label: "Brüt Kâr",
            value: `₺${fmt(totalGP)}`,
            sub: `Ort. %${avgMargin.toFixed(1)} marj`,
            icon: TrendingUp,
            color: totalGP > 0 ? "text-indigo-400" : "text-rose-400",
            bg: totalGP > 0 ? "bg-indigo-500/10" : "bg-rose-500/10",
            border: totalGP > 0 ? "border-indigo-500/20" : "border-rose-500/20",
          },
          {
            label: "Riskli Klinik",
            value: atRisk.toString(),
            sub: "Marj < %8",
            icon: AlertTriangle,
            color: atRisk > 0 ? "text-amber-400" : "text-slate-400",
            bg: atRisk > 0 ? "bg-amber-500/10" : "bg-white/5",
            border: atRisk > 0 ? "border-amber-500/20" : "border-white/5",
          },
        ].map(s => (
          <div key={s.label} className={`bg-[#0D1117] border ${s.border} rounded-2xl p-5 flex items-center gap-4`}>
            <div className={`${s.bg} p-3 rounded-xl shrink-0`}>
              <s.icon size={20} className={s.color} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              <div className="text-[10px] text-slate-700 mt-0.5">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Klinik P&L tablosu */}
      <div className="bg-[#0D1117] border border-white/5 rounded-2xl overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-semibold text-white text-sm">Klinik Başına P&L — Bu Ay</h2>
          <span className="text-xs text-slate-600">USD/TRY = {USD_TRY} (güncelle: .env SUPERADMIN_USD_TRY)</span>
        </div>

        {rows.length === 0 ? (
          <div className="py-12 text-center text-slate-600 text-sm">
            <Users size={32} className="mx-auto mb-2 opacity-30" />
            Henüz kayıtlı klinik yok
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  {["Klinik", "Plan", "MRR", "VAPI Maliyet", "Toplam COGS", "Brüt Kâr", "Marj", "Arama", "Ort. Süre", "Kullanım"].map(h => (
                    <th key={h} className="px-4 py-3 text-xs text-slate-600 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map(r => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition">
                    {/* Klinik */}
                    <td className="px-4 py-4">
                      <div className="font-medium text-white text-sm">{r.name}</div>
                      <div className="text-xs text-slate-600 mt-0.5">{r.specialty ?? "—"}</div>
                    </td>

                    {/* Plan */}
                    <td className="px-4 py-4">
                      <span className="text-xs bg-white/5 text-slate-400 px-2 py-0.5 rounded-md">
                        {PLAN_LABELS[r.plan] ?? r.plan}
                      </span>
                    </td>

                    {/* MRR */}
                    <td className="px-4 py-4 text-white font-medium">
                      ₺{fmt(r.revenue)}
                    </td>

                    {/* VAPI Maliyet */}
                    <td className="px-4 py-4">
                      <div className="text-white">₺{fmt(r.vapiCostTRY)}</div>
                      <div className="text-[10px] text-slate-600">${r.vapiCostUsd.toFixed(2)}</div>
                    </td>

                    {/* Toplam COGS */}
                    <td className="px-4 py-4">
                      <div className="text-slate-300">₺{fmt(r.totalCOGS)}</div>
                      <div className="text-[10px] text-slate-700 mt-0.5">
                        Hat: ₺{r.phoneCost}  · İnfra: ₺{INFRA_PER_CLINIC} · iyzico: ₺{fmt(r.iyzicoFee)}
                      </div>
                    </td>

                    {/* Brüt Kâr */}
                    <td className="px-4 py-4">
                      <span className={`font-semibold ${r.grossProfit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {r.grossProfit >= 0 ? "+" : ""}₺{fmt(r.grossProfit)}
                      </span>
                    </td>

                    {/* Marj */}
                    <td className="px-4 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-semibold ${marginBg(r.grossMargin)}`}>
                        <MarginIcon pct={r.grossMargin} />
                        <span className={marginColor(r.grossMargin)}>
                          %{r.grossMargin.toFixed(1)}
                        </span>
                      </div>
                    </td>

                    {/* Arama sayısı */}
                    <td className="px-4 py-4">
                      <div className="text-slate-300">{r.callCount}</div>
                      {r.vapiTrend !== null && (
                        <div className={`text-[10px] mt-0.5 ${r.vapiTrend > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                          {r.vapiTrend > 0 ? "▲" : "▼"} {Math.abs(r.vapiTrend).toFixed(0)}% geçen aya göre
                        </div>
                      )}
                    </td>

                    {/* Ortalama süre */}
                    <td className="px-4 py-4">
                      {r.avgDurMin > 0 ? (
                        <div>
                          <span className={`text-sm font-medium ${r.avgDurMin > 5 ? "text-rose-400" : r.avgDurMin > 3.5 ? "text-amber-400" : "text-emerald-400"}`}>
                            {Math.floor(r.avgDurMin)}:{String(Math.round((r.avgDurMin % 1) * 60)).padStart(2, "0")} dk
                          </span>
                          <div className="text-[10px] text-slate-600 mt-0.5">₺{r.costPerCallTRY.toFixed(1)}/arama</div>
                        </div>
                      ) : (
                        <span className="text-slate-700">—</span>
                      )}
                    </td>

                    {/* Kullanım */}
                    <td className="px-4 py-4 min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${r.usagePct > 90 ? "bg-rose-500" : r.usagePct > 70 ? "bg-amber-500" : "bg-indigo-500"}`}
                            style={{ width: `${Math.min(r.usagePct, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 whitespace-nowrap">
                          {r.callCount}/{r.interactionLimit}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Maliyet dağılımı açıklaması */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5">
          <h3 className="font-semibold text-white text-sm mb-4">COGS Bileşenleri</h3>
          <div className="space-y-3 text-xs">
            {[
              { label: "VAPI AI ($0.05/dk)", note: "LLM + STT + TTS", color: "bg-indigo-500" },
              { label: "Twilio TR inbound ($0.012/dk)", note: "Telefon operatörü", color: "bg-cyan-500" },
              { label: "Telefon hattı kirası", note: "₺115/hat/ay", color: "bg-violet-500" },
              { label: "WhatsApp + SMS", note: "Sadece Aktif Klinik (tahmini ₺350)", color: "bg-amber-500" },
              { label: "Altyapı payı", note: "₺150/klinik/ay (Vercel+DB+Auth)", color: "bg-rose-500" },
              { label: "iyzico komisyonu", note: "%2.85", color: "bg-slate-500" },
            ].map(i => (
              <div key={i.label} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full ${i.color} mt-1 shrink-0`} />
                <div>
                  <div className="text-slate-300">{i.label}</div>
                  <div className="text-slate-600">{i.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5">
          <h3 className="font-semibold text-white text-sm mb-4">Marj Referans Tablosu</h3>
          <div className="space-y-2 text-xs mb-5">
            {[
              { label: "Solo Klinik — 3 dk ort.", revenue: 1990, vapi: 150 * 3 * 2.17, other: 115 + 150 + 57 },
              { label: "Solo Klinik — 5 dk ort.", revenue: 1990, vapi: 150 * 5 * 2.17, other: 115 + 150 + 57 },
              { label: "Aktif Klinik — 3 dk ort.", revenue: 4490, vapi: 300 * 3 * 2.17, other: 230 + 350 + 150 + 128 },
              { label: "Aktif Klinik — 5 dk ort.", revenue: 4490, vapi: 300 * 5 * 2.17, other: 230 + 350 + 150 + 128 },
            ].map(s => {
              const cogs = s.vapi + s.other;
              const margin = ((s.revenue - cogs) / s.revenue) * 100;
              return (
                <div key={s.label} className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">{s.label}</span>
                  <span className={`font-semibold ${marginColor(margin)}`}>%{margin.toFixed(0)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-start gap-2 text-xs text-amber-400/80 bg-amber-500/5 border border-amber-500/15 rounded-lg p-3">
            <AlertTriangle size={12} className="shrink-0 mt-0.5" />
            <span>Gerçek VAPI maliyetini doğrulamak için dashboard.vapi.ai → Billing → Usage sayfasına bak.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
