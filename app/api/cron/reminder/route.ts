import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { appointments, doctors, services } from "@/lib/db/schema";
import { and, gte, lte, isNull, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = new URL(req.url).searchParams.get("type") ?? "24h";
  const now = new Date();

  let windowStart: Date;
  let windowEnd: Date;
  let reminderField: "reminderSentAt" | "secondReminderSentAt";

  if (type === "2h") {
    windowStart = new Date(now.getTime() + 1 * 3600000);
    windowEnd = new Date(now.getTime() + 3 * 3600000);
    reminderField = "secondReminderSentAt";
  } else {
    windowStart = new Date(now.getTime() + 22 * 3600000);
    windowEnd = new Date(now.getTime() + 26 * 3600000);
    reminderField = "reminderSentAt";
  }

  const upcoming = await db.query.appointments.findMany({
    where: and(
      gte(appointments.appointmentAt, windowStart),
      lte(appointments.appointmentAt, windowEnd),
      isNull(appointments[reminderField]),
      eq(appointments.status, "onaylandi")
    ),
    with: { doctorId: true, serviceId: true },
  });

  const results = [];
  for (const appt of upcoming) {
    if (!process.env.N8N_WEBHOOK_REMINDER) break;

    const doctor = appt.doctorId as unknown as { fullName?: string } | null;
    const service = appt.serviceId as unknown as { name?: string } | null;

    await fetch(process.env.N8N_WEBHOOK_REMINDER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: type === "2h" ? "reminder_2h" : "reminder_24h",
        appointmentId: appt.id,
        patientName: appt.patientName,
        phone: appt.phone,
        appointmentAt: appt.appointmentAt,
        doctorName: doctor?.fullName,
        service: service?.name,
        clinicAddress: process.env.NEXT_PUBLIC_CLINIC_ADDRESS,
      }),
    });

    await db
      .update(appointments)
      .set({ [reminderField]: new Date(), updatedAt: new Date() })
      .where(eq(appointments.id, appt.id));

    results.push(appt.id);
  }

  return Response.json({ sent: results.length, ids: results });
}
