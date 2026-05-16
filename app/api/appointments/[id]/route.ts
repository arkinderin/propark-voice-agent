import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const PatchSchema = z.object({
  status: z.enum(["talep", "onaylandi", "tamamlandi", "iptal", "gelmedi"]).optional(),
  appointmentAt: z.string().datetime().optional(),
  internalNotes: z.string().optional(),
  cancelReason: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });

  const update: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
  if (parsed.data.appointmentAt) {
    update.appointmentAt = new Date(parsed.data.appointmentAt);
  }

  const [updated] = await db
    .update(appointments)
    .set(update)
    .where(eq(appointments.id, id))
    .returning();

  if (!updated) return Response.json({ error: "Bulunamadı" }, { status: 404 });
  return Response.json(updated);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const appt = await db.query.appointments.findFirst({
    where: eq(appointments.id, id),
    with: { doctorId: true, serviceId: true },
  });
  if (!appt) return Response.json({ error: "Bulunamadı" }, { status: 404 });
  return Response.json(appt);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [deleted] = await db
    .update(appointments)
    .set({ status: "iptal", updatedAt: new Date() })
    .where(eq(appointments.id, id))
    .returning();
  if (!deleted) return Response.json({ error: "Bulunamadı" }, { status: 404 });
  return Response.json({ success: true });
}
