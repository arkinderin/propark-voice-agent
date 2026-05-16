import { db } from "@/lib/db";
import { appointments, voiceCalls } from "@/lib/db/schema";
import { eq, gte, count, and } from "drizzle-orm";
import Link from "next/link";
import { Calendar, Phone, TrendingUp, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let todayCount = 0;
  let pendingCount = 0;
  let totalCalls = 0;

  try {
    const [tc, pc, vc] = await Promise.all([
      db.select({ count: count() }).from(appointments).where(gte(appointments.appointmentAt, today)),
      db.select({ count: count() }).from(appointments).where(eq(appointments.status, "talep")),
      db.select({ count: count() }).from(voiceCalls),
    ]);
    todayCount = tc[0].count;
    pendingCount = pc[0].count;
    totalCalls = vc[0].count;
  } catch {}

  const stats = [
    { label: "Bugün Randevu", value: todayCount, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Bekleyen Talep", value: pendingCount, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Toplam Arama", value: totalCalls, icon: Phone, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border flex items-center gap-4">
            <div className={`${s.bg} p-3 rounded-xl`}>
              <s.icon size={22} className={s.color} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h2 className="font-semibold text-gray-900 mb-3">Hızlı Erişim</h2>
          <div className="space-y-2">
            <Link href="/admin/appointments" className="block text-blue-600 hover:underline text-sm">→ Bugünün Randevuları</Link>
            <Link href="/admin/calls" className="block text-blue-600 hover:underline text-sm">→ Son Aramalar</Link>
            <Link href="/admin/doctors" className="block text-blue-600 hover:underline text-sm">→ Doktor Yönetimi</Link>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h2 className="font-semibold text-gray-900 mb-3">Sistem Durumu</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">VAPI Agent</span>
              <span className="text-green-600 font-medium">● Aktif</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">WhatsApp</span>
              <span className="text-green-600 font-medium">● Aktif</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Cron (Hatırlatma)</span>
              <span className="text-green-600 font-medium">● Aktif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
