import { NextRequest } from "next/server";
import { verifyVapiSignature } from "@/lib/vapi";
import { db } from "@/lib/db";
import { voiceCalls, appointments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getClinicByAssistantId, getDefaultClinic } from "@/lib/clinic";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("x-vapi-secret");

  if (!verifyVapiSignature(rawBody, sig)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
  const call = body.call ?? body;

  const assistantId = call.assistantId;
  const clinic = assistantId
    ? await getClinicByAssistantId(assistantId)
    : await getDefaultClinic();

  if (!clinic) {
    return Response.json({ error: "Clinic not found" }, { status: 404 });
  }

  // tool çağrılarından appointmentId bul
  let appointmentId: string | null = null;
  const messages: unknown[] = call.messages ?? [];
  for (const msg of messages) {
    const m = msg as Record<string, unknown>;
    if (m.role === "tool" && typeof m.content === "string") {
      try {
        const parsed = JSON.parse(m.content);
        if (parsed.appointmentId) {
          appointmentId = parsed.appointmentId;
          break;
        }
      } catch {}
    }
  }

  let outcome: string = "hata";
  if (call.endedReason === "customer-ended-call") outcome = "bilgi_verildi";
  if (appointmentId) outcome = "randevu_alindi";

  const [vc] = await db
    .insert(voiceCalls)
    .values({
      clinicId: clinic.id,
      externalCallId: call.id ?? null,
      phone: call.customer?.number ?? "unknown",
      direction: call.type === "outboundPhoneCall" ? "outbound" : "inbound",
      durationSeconds: call.endedAt
        ? Math.round((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000)
        : null,
      transcript: call.transcript ?? null,
      summary: call.summary ?? null,
      outcome: outcome as "randevu_alindi",
      appointmentId,
      recordingUrl: call.recordingUrl ?? null,
    })
    .returning();

  return Response.json({ received: true, voiceCallId: vc.id });
}
