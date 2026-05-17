import { db } from "@/lib/db";
import { appointments, voiceCalls } from "@/lib/db/schema";
import { eq, gte, count, and } from "drizzle-orm";
import Link from "next/link";
import { Calendar, Phone, TrendingUp, Clock, ArrowRight, CheckCircle } from "lucide-react";
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

  try {
    const [tc, pc, vc, ta] = await Promise.all([
      db.select({ count: count() }).from(appointments).where(and(eq(appointments.clinicId, clinic.id), gte(appointments.appointmentAt, today))),
      db.select({ count: count() }).from(appointments).where(and(eq(appointments.clinicId, clinic.id), eq(appointments.status, "talep"))),
      db.select({ count: count() }).from(voiceCalls).where(eq(voiceCalls.clinicId, clinic.id)),
      db.select({ count: count() }).from(appointments).where(eq(appointments.clinicId, clinic.id)),
    ]);
    todayCount = tc[0].count;
    pendingCount = pc[0].count;
    totalCalls = vc[0].count;
    totalAppts = ta[0].count;
  } catch {}

  const conversionRate = totalCalls > 0 ? Math.round((totalAppts / totalCalls) * 100) : 0;

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-4 text-sm">Hızlı Erişim</h2>
          <div className="space-y-1">
            {[
              { href: "/admin/appointments", label: "Randevu Takvimi", icon: Calendar },
              { href: "/admin/calls", label: "Son Aramalar", icon: Phone },
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
