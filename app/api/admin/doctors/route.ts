import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { doctors, clinics } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function getClinic() {
  const { userId } = await auth();
  if (!userId) return null;
  const [clinic] = await db.select().from(clinics).where(eq(clinics.clerkUserId, userId));
  return clinic ?? null;
}

const DoctorSchema = z.object({
  fullName: z.string().min(2, "Ad en az 2 karakter olmalı"),
  title: z.string().optional().nullable(),
  specialty: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export async function GET() {
  const clinic = await getClinic();
  if (!clinic) return Response.json({ error: "Yetkisiz" }, { status: 401 });

  const rows = await db
    .select()
    .from(doctors)
    .where(eq(doctors.clinicId, clinic.id))
    .orderBy(doctors.displayOrder);

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

  const parsed = DoctorSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const [created] = await db
    .insert(doctors)
    .values({ ...parsed.data, clinicId: clinic.id })
    .returning();

  return Response.json(created, { status: 201 });
}
