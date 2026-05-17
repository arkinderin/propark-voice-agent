import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getClinic } from "@/lib/clinic";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  const clinic = await getClinic();
  let svcs: typeof services.$inferSelect[] = [];
  try {
    svcs = await db.select().from(services).where(eq(services.clinicId, clinic.id));
  } catch {}

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Hizmetler</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Hizmet</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Süre</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Fiyat Aralığı</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Durum</th>
            </tr>
          </thead>
          <tbody>
            {svcs.map((s) => (
              <tr key={s.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                <td className="px-4 py-3 text-gray-500">{s.durationMinutes} dk</td>
                <td className="px-4 py-3 text-gray-500">
                  {s.priceFrom != null
                    ? `${s.priceFrom.toLocaleString("tr-TR")}₺${s.priceTo ? ` – ${s.priceTo.toLocaleString("tr-TR")}₺` : "+"}`
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                    {s.isActive ? "Aktif" : "Pasif"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
