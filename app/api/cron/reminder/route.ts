import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { appointments, doctors, services } from "@/lib/db/schema";
import { and, gte, lte, isNull, eq } from "drizzle-orm";

async function sendReminders(
  windowStart: Date,
  windowEnd: Date,
  reminderField: "reminderSentAt" | "secondReminderSentAt",
  type: string
) {
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
        type,
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
  return results;
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // 24h penceresi: 22-26 saat sonrası randevular
  const r24 = await sendReminders(
    new Date(now.getTime() + 22 * 3600000),
    new Date(now.getTime() + 26 * 3600000),
    "reminderSentAt",
    "reminder_24h"
  );

  // 2h penceresi: 1-3 saat sonrası randevular
  const r2h = await sendReminders(
    new Date(now.getTime() + 1 * 3600000),
    new Date(now.getTime() + 3 * 3600000),
    "secondReminderSentAt",
    "reminder_2h"
  );

  return Response.json({ "24h": r24.length, "2h": r2h.length });
}
