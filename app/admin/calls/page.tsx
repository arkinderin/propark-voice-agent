import { db } from "@/lib/db";
import { voiceCalls } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { formatTR } from "@/lib/utils";
import { Phone } from "lucide-react";

export const dynamic = "force-dynamic";

const outcomeLabel: Record<string, string> = {
  randevu_alindi: "✅ Randevu Alındı",
  bilgi_verildi: "ℹ️ Bilgi Verildi",
  insan_aktarimi: "👤 İnsan Aktarımı",
  cevapsiz: "📵 Cevapsız",
  spam: "🚫 Spam",
  hata: "❌ Hata",
};

export default async function CallsPage() {
  let calls: typeof voiceCalls.$inferSelect[] = [];
  try {
    calls = await db.select().from(voiceCalls).orderBy(desc(voiceCalls.createdAt)).limit(100);
  } catch {}

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Voice Aramalar</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Telefon</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Yön</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Süre</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Sonuç</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Tarih</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {calls.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  <Phone size={32} className="mx-auto mb-2 opacity-30" />
                  Henüz arama kaydı yok
                </td>
              </tr>
            ) : (
              calls.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.phone}</td>
                  <td className="px-4 py-3 text-gray-500">{c.direction === "inbound" ? "Gelen" : "Giden"}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {c.durationSeconds ? `${Math.floor(c.durationSeconds / 60)}:${String(c.durationSeconds % 60).padStart(2, "0")}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">{c.outcome ? outcomeLabel[c.outcome] ?? c.outcome : "—"}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatTR(c.createdAt, "d MMM yyyy, HH:mm")}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/calls/${c.id}`} className="text-blue-600 hover:underline text-xs">
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
