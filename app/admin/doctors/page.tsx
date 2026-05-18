import { db } from "@/lib/db";
import { doctors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getClinic } from "@/lib/clinic";
import { UserPlus } from "lucide-react";

export const dynamic = "force-dynamic";

const specialtyColors: Record<string, string> = {
  "Genel Diş Hekimliği": "bg-cyan-500/10 text-cyan-400",
  "Ortodonti": "bg-indigo-500/10 text-indigo-400",
  "İmplant": "bg-violet-500/10 text-violet-400",
  "Pedodonti": "bg-amber-500/10 text-amber-400",
  "Periodontoloji": "bg-emerald-500/10 text-emerald-400",
  "Oral Cerrahi": "bg-rose-500/10 text-rose-400",
};

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

const avatarColors = [
  "from-indigo-500 to-cyan-400",
  "from-violet-500 to-indigo-400",
  "from-cyan-500 to-emerald-400",
  "from-amber-500 to-rose-400",
  "from-emerald-500 to-cyan-400",
];

export default async function DoctorsAdminPage() {
  const clinic = await getClinic();
  let docs: typeof doctors.$inferSelect[] = [];
  try {
    docs = await db.select().from(doctors).where(eq(doctors.clinicId, clinic.id)).orderBy(doctors.displayOrder);
  } catch {}

  const activeCount = docs.filter(d => d.isActive).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Doktorlar</h1>
          <p className="text-slate-500 text-sm mt-1">
            <span className="text-emerald-400 font-medium">{activeCount}</span> aktif,{" "}
            <span className="text-slate-400">{docs.length} toplam</span>
          </p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition">
          <UserPlus size={15} />
          Doktor Ekle
        </button>
      </div>

      {/* Kart grid */}
      {docs.length === 0 ? (
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl flex flex-col items-center justify-center py-16 text-slate-600">
          <UserPlus size={36} className="mb-3 opacity-30" />
          <p className="text-sm">Henüz doktor eklenmemiş</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {docs.map((d, i) => {
            const specialtyColor = d.specialty
              ? (specialtyColors[d.specialty] ?? "bg-slate-500/10 text-slate-400")
              : "bg-slate-500/10 text-slate-400";
            const gradientColor = avatarColors[i % avatarColors.length];

            return (
              <div key={d.id} className={`bg-[#0D1117] border rounded-2xl p-5 flex flex-col gap-4 transition hover:border-white/10 ${d.isActive ? "border-white/5" : "border-white/5 opacity-60"}`}>
                {/* Üst satır: avatar + isim + durum */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-bold text-sm">{getInitials(d.fullName)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white text-sm">{d.title} {d.fullName}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${d.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-slate-500"}`}>
                        {d.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </div>
                    {d.specialty && (
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-lg mt-1 ${specialtyColor}`}>
                        {d.specialty}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {d.bio && (
                  <p className="text-xs text-slate-500 leading-relaxed border-t border-white/5 pt-3">
                    {d.bio}
                  </p>
                )}

                {/* Alt bilgi */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs text-slate-600">
                  <span>Sıra #{d.displayOrder}</span>
                  <button className="text-slate-500 hover:text-white transition">Düzenle</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
