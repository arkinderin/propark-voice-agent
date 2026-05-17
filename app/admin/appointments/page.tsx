import { db } from "@/lib/db";
import { appointments, doctors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getClinic } from "@/lib/clinic";
import AppointmentCalendar from "@/components/AppointmentCalendar";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const clinic = await getClinic();

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
