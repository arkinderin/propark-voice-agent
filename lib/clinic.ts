import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { clinics } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function getClinic() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL tanımlı değil. Vercel → Settings → Environment Variables'a ekleyin.");
  }

  const [clinic] = await db.select().from(clinics).where(eq(clinics.clerkUserId, userId));
  if (!clinic) {
    throw new Error(`Bu kullanıcı için klinik kaydı bulunamadı (userId: ${userId}). Veritabanına seed çalıştırmanız gerekiyor.`);
  }

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
