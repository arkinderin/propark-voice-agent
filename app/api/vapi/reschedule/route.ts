import { NextRequest } from "next/server";
import { verifyVapiSignature } from "@/lib/vapi";
import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { and, eq, gte, lte, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("x-vapi-secret");

  if (!verifyVapiSignature(rawBody, sig)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
  const { appointmentId, newStartAt } = body.functionCall?.parameters ?? {};

  if (!appointmentId || !newStartAt) {
    return Response.json({ result: { error: "appointmentId ve newStartAt zorunlu" } }, { status: 400 });
  }

  const newStart = new Date(newStartAt);
  const newEnd = new Date(newStart.getTime() + 30 * 60000);

  const conflict = await db
    .select()
    .from(appointments)
    .where(
      and(
        gte(appointments.appointmentAt, newStart),
        lte(appointments.appointmentAt, newEnd),
        sql`status NOT IN ('iptal')`,
        sql`id != ${appointmentId}`
      )
    )
    .limit(1);

  if (conflict.length > 0) {
    return Response.json({ result: { error: "Bu saat dolu, başka bir saat seçin" } });
  }

  const [updated] = await db
    .update(appointments)
    .set({ appointmentAt: newStart, updatedAt: new Date() })
    .where(eq(appointments.id, appointmentId))
    .returning();

  if (!updated) {
    return Response.json({ result: { error: "Randevu bulunamadı" } });
  }

  const tarih = newStart.toLocaleString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  return Response.json({
    result: { success: true, message: `Randevunuz ${tarih} tarihine taşındı.` },
  });
}
