import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { services, clinics } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

async function getClinic() {
  const { userId } = await auth();
  if (!userId) return null;
  const [clinic] = await db.select().from(clinics).where(eq(clinics.clerkUserId, userId));
  return clinic ?? null;
}

const PatchSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  durationMinutes: z.number().int().min(5).optional(),
  priceFrom: z.number().int().min(0).optional().nullable(),
  priceTo: z.number().int().min(0).optional().nullable(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const clinic = await getClinic();
  if (!clinic) return Response.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Geçersiz JSON" }, { status: 400 });
  }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const [updated] = await db
    .update(services)
    .set(parsed.data)
    .where(and(eq(services.id, id), eq(services.clinicId, clinic.id)))
    .returning();

  if (!updated) return Response.json({ error: "Bulunamadı" }, { status: 404 });
  return Response.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const clinic = await getClinic();
  if (!clinic) return Response.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;

  await db
    .delete(services)
    .where(and(eq(services.id, id), eq(services.clinicId, clinic.id)));

  return Response.json({ success: true });
}
