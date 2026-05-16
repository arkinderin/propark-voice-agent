import { db } from "@/lib/db";
import { appointments, doctors, services } from "@/lib/db/schema";
import { and, gte, lte, eq } from "drizzle-orm";
import Link from "next/link";
import { formatTR, statusLabel, statusColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

type View = "bugun" | "hafta" | "ay";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; doctorId?: string }>;
}) {
  const params = await searchParams;
  const view = (params.view ?? "bugun") as View;
  const doctorIdFilter = params.doctorId;

  const now = new Date();
  let start = new Date(now);
  let end = new Date(now);

  if (view === "bugun") {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (view === "hafta") {
    const day = now.getDay() || 7;
    start.setDate(now.getDate() - day + 1);
    start.setHours(0, 0, 0, 0);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  }

  const conditions = [gte(appointments.appointmentAt, start), lte(appointments.appointmentAt, end)];
  if (doctorIdFilter) conditions.push(eq(appointments.doctorId, doctorIdFilter));

  let rows: typeof appointments.$inferSelect[] = [];
  let allDoctors: typeof doctors.$inferSelect[] = [];
  try {
    [rows, allDoctors] = await Promise.all([
      db.select().from(appointments).where(and(...conditions)).orderBy(appointments.appointmentAt) as Promise<typeof appointments.$inferSelect[]>,
      db.select().from(doctors).orderBy(doctors.displayOrder),
    ]);
  } catch {}

  const tabs: { view: View; label: string }[] = [
    { view: "bugun", label: "Bugün" },
    { view: "hafta", label: "Bu Hafta" },
    { view: "ay", label: "Bu Ay" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Randevular</h1>
        <div className="flex gap-2">
          {tabs.map((t) => (
            <Link
              key={t.view}
              href={`/admin/appointments?view=${t.view}${doctorIdFilter ? `&doctorId=${doctorIdFilter}` : ""}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${view === t.view ? "bg-blue-600 text-white" : "bg-white text-gray-600 border hover:bg-gray-50"}`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Doktor filtresi */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <Link
          href={`/admin/appointments?view=${view}`}
          className={`text-xs px-3 py-1 rounded-full border transition ${!doctorIdFilter ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 hover:bg-gray-50"}`}
        >
          Tüm Doktorlar
        </Link>
        {allDoctors.map((d) => (
          <Link
            key={d.id}
            href={`/admin/appointments?view=${view}&doctorId=${d.id}`}
            className={`text-xs px-3 py-1 rounded-full border transition ${doctorIdFilter === d.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 hover:bg-gray-50"}`}
          >
            {d.fullName}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Hasta</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Tarih/Saat</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Kaynak</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Durum</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">Randevu bulunamadı</td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{r.patientName}</div>
                    <div className="text-gray-400 text-xs">{r.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatTR(r.appointmentAt, "d MMM yyyy, HH:mm")}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{r.source}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(r.status)}`}>
                      {statusLabel(r.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/appointments/${r.id}`} className="text-blue-600 hover:underline text-xs">
                      Detay
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
