import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { clinics } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function getClinic() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [clinic] = await db.select().from(clinics).where(eq(clinics.clerkUserId, userId));
  if (!clinic) redirect("/sign-in");

  return clinic;
}

export async function getClinicByAssistantId(assistantId: string) {
  const [clinic] = await db.select().from(clinics).where(eq(clinics.vapiAssistantId, assistantId));
  return clinic ?? null;
}

export async function getDefaultClinic() {
  const assistantId = process.env.VAPI_ASSISTANT_ID;
  if (assistantId) {
    const clinic = await getClinicByAssistantId(assistantId);
    if (clinic) return clinic;
  }
  const [clinic] = await db.select().from(clinics).limit(1);
  return clinic ?? null;
}
