import { db } from "@/lib/db";
import { voiceCalls } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatTR } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CallDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let call: typeof voiceCalls.$inferSelect | undefined;
  try {
    call = await db.query.voiceCalls.findFirst({ where: eq(voiceCalls.id, id) });
  } catch {}
  if (!call) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/calls" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4">
        <ArrowLeft size={14} /> Geri
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Arama Detayı</h1>
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-gray-400 text-xs uppercase mb-1">Telefon</p><p>{call.phone}</p></div>
          <div><p className="text-gray-400 text-xs uppercase mb-1">Yön</p><p>{call.direction === "inbound" ? "Gelen" : "Giden"}</p></div>
          <div><p className="text-gray-400 text-xs uppercase mb-1">Tarih</p><p>{formatTR(call.createdAt)}</p></div>
          <div><p className="text-gray-400 text-xs uppercase mb-1">Süre</p><p>{call.durationSeconds ? `${call.durationSeconds}s` : "—"}</p></div>
          <div><p className="text-gray-400 text-xs uppercase mb-1">Sonuç</p><p>{call.outcome ?? "—"}</p></div>
          {call.appointmentId && (
            <div>
              <p className="text-gray-400 text-xs uppercase mb-1">Randevu</p>
              <Link href={`/admin/appointments/${call.appointmentId}`} className="text-blue-600 hover:underline text-sm">
                Randevuya Git →
              </Link>
            </div>
          )}
        </div>

        {call.summary && (
          <div className="border-t pt-4">
            <p className="text-gray-400 text-xs uppercase mb-2">Özet</p>
            <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-lg p-3">{call.summary}</p>
          </div>
        )}

        {call.transcript && (
          <div className="border-t pt-4">
            <p className="text-gray-400 text-xs uppercase mb-2">Transkript</p>
            <pre className="text-xs text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {call.transcript}
            </pre>
          </div>
        )}

        {call.recordingUrl && (
          <div className="border-t pt-4">
            <p className="text-gray-400 text-xs uppercase mb-2">Kayıt</p>
            <audio controls src={call.recordingUrl} className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
