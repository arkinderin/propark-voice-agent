import { NextRequest } from "next/server";
import { verifyVapiSignature } from "@/lib/vapi";
import { db } from "@/lib/db";
import { appointments, doctors, services } from "@/lib/db/schema";
import { and, gte, lte, eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("x-vapi-secret");

  if (!verifyVapiSignature(rawBody, sig)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
  const { patientName, phone, doctorId, serviceId, startAt, complaint } =
    body.functionCall?.parameters ?? {};

  if (!patientName || !phone || !startAt) {
    return Response.json(
      { result: { error: "patientName, phone, startAt zorunlu" } },
      { status: 400 }
    );
  }

  const start = new Date(startAt);
  const duration = 30;
  const end = new Date(start.getTime() + duration * 60000);

  // Çakışma kontrolü
  const conditions = [
    gte(appointments.appointmentAt, start),
    lte(appointments.appointmentAt, end),
    sql`status NOT IN ('iptal')`,
  ];
  if (doctorId) conditions.push(eq(appointments.doctorId, doctorId));

  const existing = await db.select().from(appointments).where(and(...conditions)).limit(1);
  if (existing.length > 0) {
    return Response.json({ result: { error: "Bu saat dolu, başka bir saat seçin" } });
  }

  const [appt] = await db
    .insert(appointments)
    .values({
      patientName,
      phone,
      doctorId: doctorId ?? null,
      serviceId: serviceId ?? null,
      appointmentAt: start,
      complaint: complaint ?? null,
      source: "voice_agent",
      status: "onaylandi",
    })
    .returning();

  const doctor = doctorId
    ? await db.query.doctors.findFirst({ where: eq(doctors.id, doctorId) })
    : null;
  const service = serviceId
    ? await db.query.services.findFirst({ where: eq(services.id, serviceId) })
    : null;

  const tarih = start.toLocaleString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  // n8n confirmation
  if (process.env.N8N_WEBHOOK_REMINDER) {
    fetch(process.env.N8N_WEBHOOK_REMINDER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "confirmation",
        appointmentId: appt.id,
        patientName,
        phone,
        appointmentAt: appt.appointmentAt,
        doctorName: doctor?.fullName,
        service: service?.name,
        clinicAddress: process.env.NEXT_PUBLIC_CLINIC_ADDRESS,
      }),
    }).catch(() => {});
  }

  return Response.json({
    result: {
      appointmentId: appt.id,
      confirmationMessage: `Randevunuz alındı. ${tarih}${doctor ? `, ${doctor.fullName}` : ""}. Sizi bekliyoruz!`,
    },
  });
}
