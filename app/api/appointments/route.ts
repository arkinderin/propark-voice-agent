import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { appointments, doctors, services } from "@/lib/db/schema";
import { and, gte, lte, eq, sql } from "drizzle-orm";

const CreateSchema = z.object({
  patientName: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional(),
  doctorId: z.string().uuid().optional(),
  serviceId: z.string().uuid().optional(),
  appointmentAt: z.string().datetime(),
  complaint: z.string().optional(),
  source: z.enum(["web", "voice_agent", "whatsapp", "telefon", "yuzyuze"]).default("web"),
  kvkkConsent: z.boolean().refine((v) => v === true, "KVKK onayı zorunlu"),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { kvkkConsent: _, ...data } = parsed.data;
  const start = new Date(data.appointmentAt);

  // Çakışma kontrolü
  const duration = 30;
  const end = new Date(start.getTime() + duration * 60000);

  const existing = await db
    .select()
    .from(appointments)
    .where(
      and(
        data.doctorId ? eq(appointments.doctorId, data.doctorId) : sql`true`,
        gte(appointments.appointmentAt, start),
        lte(appointments.appointmentAt, end),
        sql`status NOT IN ('iptal')`
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return Response.json({ error: "Bu saat dolu" }, { status: 409 });
  }

  const [appt] = await db
    .insert(appointments)
    .values({ ...data, appointmentAt: start })
    .returning();

  // n8n confirmation webhook (fire-and-forget)
  if (process.env.N8N_WEBHOOK_REMINDER) {
    const doctor = data.doctorId
      ? await db.query.doctors.findFirst({ where: eq(doctors.id, data.doctorId!) })
      : null;
    const service = data.serviceId
      ? await db.query.services.findFirst({ where: eq(services.id, data.serviceId!) })
      : null;

    fetch(process.env.N8N_WEBHOOK_REMINDER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "confirmation",
        appointmentId: appt.id,
        patientName: appt.patientName,
        phone: appt.phone,
        appointmentAt: appt.appointmentAt,
        doctorName: doctor?.fullName,
        service: service?.name,
        clinicAddress: process.env.NEXT_PUBLIC_CLINIC_ADDRESS,
      }),
    }).catch(() => {});
  }

  return Response.json(appt, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const status = searchParams.get("status");
  const doctorId = searchParams.get("doctorId");

  const conditions = [];
  if (date) {
    const d = new Date(date);
    const start = new Date(d.setHours(0, 0, 0, 0));
    const end = new Date(d.setHours(23, 59, 59, 999));
    conditions.push(gte(appointments.appointmentAt, start));
    conditions.push(lte(appointments.appointmentAt, end));
  }
  if (status) conditions.push(eq(appointments.status, status as "talep"));
  if (doctorId) conditions.push(eq(appointments.doctorId, doctorId));

  const rows = await db.query.appointments.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    with: { doctorId: true, serviceId: true },
    orderBy: (t, { asc }) => asc(t.appointmentAt),
  });

  return Response.json(rows);
}
