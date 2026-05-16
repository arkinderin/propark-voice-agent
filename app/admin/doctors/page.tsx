import { db } from "@/lib/db";
import { doctors } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function DoctorsAdminPage() {
  let docs: typeof doctors.$inferSelect[] = [];
  try {
    docs = await db.select().from(doctors).orderBy(doctors.displayOrder);
  } catch {}

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Doktorlar</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Ad</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Uzmanlık</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Sıra</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Durum</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900">{d.title} {d.fullName}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">{d.specialty ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500">{d.displayOrder}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                    {d.isActive ? "Aktif" : "Pasif"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-3">Doktor eklemek/düzenlemek için seed.ts veya DB'yi güncelleyin.</p>
    </div>
  );
}
