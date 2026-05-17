import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { clinics, subscriptions } from "@/lib/db/schema";

const Schema = z.object({
  clinicName: z.string().min(2),
  specialty: z.string().min(1),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().optional(),
  city: z.string().min(1),
  plan: z.enum(["baslangic", "profesyonel", "kurumsal"]),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { clinicName, specialty, contactName, email, phone, address, city, plan } = parsed.data;

  const slug = clinicName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 50) + "-" + Date.now().toString(36);

  // Klinik kaydı oluştur (henüz Clerk user yok, pending state)
  const [clinic] = await db
    .insert(clinics)
    .values({
      clerkUserId: `pending_${Date.now()}`, // Aktivasyonda gerçek user ID ile güncellenecek
      name: clinicName,
      slug,
      phone,
      address: address ? `${address}, ${city}` : city,
      specialty,
    })
    .returning();

  // Trial subscription oluştur
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 14);

  await db.insert(subscriptions).values({
    clinicId: clinic.id,
    plan,
    status: "trial",
    currentPeriodStart: new Date(),
    currentPeriodEnd: trialEnd,
  });

  // TODO: Aktivasyon e-postası gönder (e-posta servisi eklenince)
  console.log(`New clinic registration: ${clinicName} (${email}) - Plan: ${plan}`);

  return Response.json({ success: true, clinicId: clinic.id }, { status: 201 });
}
