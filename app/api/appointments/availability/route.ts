import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { and, gte, lte, eq, sql } from "drizzle-orm";
import { generateSlots } from "@/lib/vapi";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId");
  const dateStr = searchParams.get("date") ?? new Date().toISOString().split("T")[0];

  const start = new Date(dateStr);
  start.setHours(0, 0, 0, 0);
  const end = new Date(dateStr);
  end.setDate(end.getDate() + 7);
  end.setHours(23, 59, 59, 999);

  const conditions = [
    gte(appointments.appointmentAt, start),
    lte(appointments.appointmentAt, end),
    sql`status NOT IN ('iptal')`,
  ];
  if (doctorId) conditions.push(eq(appointments.doctorId, doctorId));

  const booked = await db
    .select({
      appointmentAt: appointments.appointmentAt,
      durationMinutes: appointments.durationMinutes,
    })
    .from(appointments)
    .where(and(...conditions));

  const busyRanges = booked.map((b) => ({
    start: b.appointmentAt,
    end: new Date(b.appointmentAt.getTime() + (b.durationMinutes ?? 30) * 60000),
  }));

  const slots = generateSlots(start, end, busyRanges);
  return Response.json({ slots });
}
