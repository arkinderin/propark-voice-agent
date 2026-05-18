import { db } from "@/lib/db";
import { appointments, doctors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getClinic } from "@/lib/clinic";
import AppointmentCalendar from "@/components/AppointmentCalendar";
import Link from "next/link";
import { X, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  talep: "Bekleyen Talep",
  onaylandi: "Onaylandı",
  tamamlandi: "Tamamlandı",
  iptal: "İptal",
  gelmedi: "Gelmedi",
};

const STATUS_COLORS: Record<string, string> = {
  talep: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  onaylandi: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  tamamlandi: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  iptal: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  gelmedi: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export default async function AppointmentsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const clinic = await getClinic();
  const { status: statusFilter } = await searchParams;

  const [allAppts, allDoctors] = await Promise.all([
    db.select().from(appointments).where(eq(appointments.clinicId, clinic.id)),
    db.select().from(doctors).where(eq(doctors.clinicId, clinic.id)),
  ]);

  const serialized = allAppts.map(a => ({
    id: a.id,
    patientName: a.patientName,
    phone: a.phone,
    appointmentAt: a.appointmentAt.toISOString(),
    status: a.status,
    doctorId: a.doctorId,
  }));

  if (statusFilter) {
    const filtered = serialized
      .filter(a => a.status === statusFilter)
      .sort((a, b) => new Date(a.appointmentAt).getTime() - new Date(b.appointmentAt).getTime());

    const doctorName = (id: string | null) =>
      id ? allDoctors.find(d => d.id === id)?.fullName ?? "—" : "—";

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Randevular</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[statusFilter] ?? "bg-slate-500/20 text-slate-400 border-slate-500/30"}`}>
                {STATUS_LABELS[statusFilter] ?? statusFilter}
              </span>
              <Link href="/admin/appointments" className="text-xs text-slate-600 hover:text-slate-400 transition flex items-center gap-1">
                <X size={12} />
                Filtreyi kaldır
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{filtered.length} randevu</span>
            <Link href="/admin/appointments" className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition">
              <Calendar size={13} />
              Takvime Dön
            </Link>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-12 text-center">
            <p className="text-slate-600 text-sm">Bu kategoride randevu yok</p>
          </div>
        ) : (
          <div className="bg-[#0D1117] border border-white/5 rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/5">
              {filtered.map(a => (
                <Link
                  key={a.id}
                  href={`/admin/appointments/${a.id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition group"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-white text-sm">{a.patientName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{a.phone} · {doctorName(a.doctorId)}</div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-sm text-slate-300 font-medium">
                      {new Date(a.appointmentAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {new Date(a.appointmentAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Randevular</h1>
        <div className="text-sm text-slate-500">{allAppts.length} toplam randevu</div>
      </div>
      <AppointmentCalendar appointments={serialized} doctors={allDoctors} />
    </div>
  );
}
