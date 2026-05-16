import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { and, gte, lte, isNull, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 86400000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 86400000);

  const completed = await db.query.appointments.findMany({
    where: and(
      eq(appointments.status, "tamamlandi"),
      gte(appointments.appointmentAt, threeDaysAgo),
      lte(appointments.appointmentAt, twoDaysAgo),
      isNull(appointments.reviewRequestedAt)
    ),
    with: { doctor: true },
  });

  const results = [];
  for (const appt of completed) {
    if (!process.env.N8N_WEBHOOK_REVIEW) break;

    const doctor = appt.doctor;

    await fetch(process.env.N8N_WEBHOOK_REVIEW, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "review_request",
        appointmentId: appt.id,
        patientName: appt.patientName,
        phone: appt.phone,
        doctorName: doctor?.fullName,
        googleReviewLink: process.env.CLINIC_GOOGLE_REVIEW_LINK,
      }),
    });

    await db
      .update(appointments)
      .set({ reviewRequestedAt: new Date(), updatedAt: new Date() })
      .where(eq(appointments.id, appt.id));

    results.push(appt.id);
  }

  return Response.json({ sent: results.length, ids: results });
}
