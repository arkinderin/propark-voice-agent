import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getClinic } from "@/lib/clinic";
import { Plus, Clock, Banknote } from "lucide-react";

export const dynamic = "force-dynamic";

const serviceIcons: Record<string, string> = {
  "Genel Muayene":    "🔍",
  "Diş Temizliği":    "✨",
  "Dolgu":            "🦷",
  "Diş Çekimi":       "⚕️",
  "Kanal Tedavisi":   "🩺",
  "İmplant Muayene":  "🔬",
  "Diş Teli Kontrolü":"📋",
  "Ağız Röntgeni":    "🫁",
};

function formatPrice(from: number | null, to: number | null | undefined): string {
  if (from == null) return "Fiyat belirtilmemiş";
  if (from === 0) return "Ücretsiz";
  const f = from.toLocaleString("tr-TR");
  if (to) return `${f}₺ – ${to.toLocaleString("tr-TR")}₺`;
  return `${f}₺+`;
}

export default async function ServicesAdminPage() {
  const clinic = await getClinic();
  let svcs: typeof services.$inferSelect[] = [];
  try {
    svcs = await db.select().from(services).where(eq(services.clinicId, clinic.id));
  } catch {}

  const activeCount = svcs.filter(s => s.isActive).length;
  const totalMinutes = svcs.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Hizmetler</h1>
          <p className="text-slate-500 text-sm mt-1">
            <span className="text-emerald-400 font-medium">{activeCount}</span> aktif,{" "}
            <span className="text-slate-400">{svcs.length} toplam hizmet</span>
          </p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition">
          <Plus size={15} />
          Hizmet Ekle
        </button>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <span className="text-indigo-400 text-lg">📋</span>
          </div>
          <div>
            <div className="text-xl font-bold text-white">{svcs.length}</div>
            <div className="text-xs text-slate-500">Toplam Hizmet</div>
          </div>
        </div>
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Clock size={16} className="text-emerald-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{svcs.length > 0 ? Math.round(totalMinutes / svcs.length) : 0} dk</div>
            <div className="text-xs text-slate-500">Ort. Süre</div>
          </div>
        </div>
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <Banknote size={16} className="text-cyan-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{activeCount}</div>
            <div className="text-xs text-slate-500">Aktif Hizmet</div>
          </div>
        </div>
      </div>

      {/* Hizmet listesi */}
      {svcs.length === 0 ? (
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl flex flex-col items-center justify-center py-16 text-slate-600">
          <Plus size={36} className="mb-3 opacity-30" />
          <p className="text-sm">Henüz hizmet eklenmemiş</p>
        </div>
      ) : (
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {svcs.map((s) => {
              const icon = serviceIcons[s.name] ?? "🏥";
              return (
                <div key={s.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition ${!s.isActive ? "opacity-50" : ""}`}>
                  {/* İkon */}
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-lg shrink-0">
                    {icon}
                  </div>

                  {/* Hizmet adı */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{s.name}</span>
                      {!s.isActive && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500">Pasif</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock size={10} /> {s.durationMinutes} dk
                      </span>
                    </div>
                  </div>

                  {/* Fiyat */}
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-emerald-400">
                      {formatPrice(s.priceFrom, s.priceTo)}
                    </div>
                  </div>

                  {/* Düzenle */}
                  <button className="text-xs text-slate-600 hover:text-white transition ml-2 shrink-0">
                    Düzenle
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
