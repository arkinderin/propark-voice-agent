import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { services, clinics } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function getClinic() {
  const { userId } = await auth();
  if (!userId) return null;
  const [clinic] = await db.select().from(clinics).where(eq(clinics.clerkUserId, userId));
  return clinic ?? null;
}

const ServiceSchema = z.object({
  name: z.string().min(2, "Hizmet adı en az 2 karakter olmalı"),
  description: z.string().optional().nullable(),
  durationMinutes: z.number().int().min(5, "En az 5 dakika olmalı").default(30),
  priceFrom: z.number().int().min(0).optional().nullable(),
  priceTo: z.number().int().min(0).optional().nullable(),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const clinic = await getClinic();
  if (!clinic) return Response.json({ error: "Yetkisiz" }, { status: 401 });

  const rows = await db
    .select()
    .from(services)
    .where(eq(services.clinicId, clinic.id));

  return Response.json(rows);
}

export async function POST(req: NextRequest) {
  const clinic = await getClinic();
  if (!clinic) return Response.json({ error: "Yetkisiz" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Geçersiz JSON" }, { status: 400 });
  }

  const parsed = ServiceSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const [created] = await db
    .insert(services)
    .values({ ...parsed.data, clinicId: clinic.id })
    .returning();

  return Response.json(created, { status: 201 });
}
