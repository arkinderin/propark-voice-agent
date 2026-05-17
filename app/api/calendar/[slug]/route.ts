import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { clinics, appointments } from "@/lib/db/schema";
import { eq, gte } from "drizzle-orm";

function icalDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeIcal(s: string): string {
  return s.replace(/[\\;,]/g, "\\$&").replace(/\n/g, "\\n");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const [clinic] = await db.select().from(clinics).where(eq(clinics.slug, slug));
  if (!clinic) {
    return new Response("Not found", { status: 404 });
  }

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const appts = await db.query.appointments.findMany({
    where: (a, { and, eq, gte }) => and(eq(a.clinicId, clinic.id), gte(a.appointmentAt, threeMonthsAgo)),
    with: { doctor: true, service: true },
    limit: 500,
  });

  const statusMap: Record<string, string> = {
    talep: "Talep",
    onaylandi: "Onaylandı",
    tamamlandi: "Tamamlandı",
    iptal: "İptal",
    gelmedi: "Gelmedi",
  };

  const events = appts.map(appt => {
    const start = new Date(appt.appointmentAt);
    const durationMin = appt.service?.durationMinutes ?? 30;
    const end = new Date(start.getTime() + durationMin * 60000);

    const summary = `${appt.patientName}${appt.doctor ? ` — ${appt.doctor.fullName}` : ""}`;
    const description = [
      appt.service ? `Hizmet: ${appt.service.name}` : null,
      `Durum: ${statusMap[appt.status] ?? appt.status}`,
      appt.phone ? `Tel: ${appt.phone}` : null,
    ].filter(Boolean).join("\\n");

    return [
      "BEGIN:VEVENT",
      `UID:${appt.id}@operexo.com`,
      `DTSTAMP:${icalDate(new Date())}`,
      `DTSTART:${icalDate(start)}`,
      `DTEND:${icalDate(end)}`,
      `SUMMARY:${escapeIcal(summary)}`,
      `DESCRIPTION:${description}`,
      clinic.address ? `LOCATION:${escapeIcal(clinic.address)}` : null,
      `STATUS:${appt.status === "iptal" ? "CANCELLED" : "CONFIRMED"}`,
      "END:VEVENT",
    ].filter(Boolean).join("\r\n");
  });

  const cal = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Operexo//Randevu Takvimi//TR",
    `X-WR-CALNAME:${escapeIcal(clinic.name)} Randevuları`,
    "X-WR-TIMEZONE:Europe/Istanbul",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(cal, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}-randevular.ics"`,
      "Cache-Control": "no-cache, no-store",
    },
  });
}
