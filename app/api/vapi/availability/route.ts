import { NextRequest } from "next/server";
import { verifyVapiSignature, generateSlots } from "@/lib/vapi";
import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { and, gte, lte, eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("x-vapi-secret");

  if (!verifyVapiSignature(rawBody, sig)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
  const { doctorId, startDate, endDate } = body.functionCall?.parameters ?? {};

  const start = startDate ? new Date(startDate) : new Date();
  const end = endDate ? new Date(endDate) : new Date(Date.now() + 7 * 86400000);

  const conditions = [
    gte(appointments.appointmentAt, start),
    lte(appointments.appointmentAt, end),
    sql`status NOT IN ('iptal')`,
  ];
  if (doctorId) conditions.push(eq(appointments.doctorId, doctorId));

  const booked = await db
    .select({ appointmentAt: appointments.appointmentAt, durationMinutes: appointments.durationMinutes })
    .from(appointments)
    .where(and(...conditions));

  const busyRanges = booked.map((b) => ({
    start: b.appointmentAt,
    end: new Date(b.appointmentAt.getTime() + (b.durationMinutes ?? 30) * 60000),
  }));

  const slots = generateSlots(start, end, busyRanges).slice(0, 10);
  return Response.json({ result: { doctorId: doctorId ?? null, slots } });
}
