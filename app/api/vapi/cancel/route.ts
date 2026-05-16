import { NextRequest } from "next/server";
import { verifyVapiSignature } from "@/lib/vapi";
import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("x-vapi-secret");

  if (!verifyVapiSignature(rawBody, sig)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
  const { appointmentId, reason } = body.functionCall?.parameters ?? {};

  if (!appointmentId) {
    return Response.json({ result: { error: "appointmentId zorunlu" } }, { status: 400 });
  }

  const [updated] = await db
    .update(appointments)
    .set({ status: "iptal", cancelReason: reason ?? null, updatedAt: new Date() })
    .where(eq(appointments.id, appointmentId))
    .returning();

  if (!updated) {
    return Response.json({ result: { error: "Randevu bulunamadı" } });
  }

  return Response.json({ result: { success: true, message: "Randevunuz iptal edildi." } });
}
