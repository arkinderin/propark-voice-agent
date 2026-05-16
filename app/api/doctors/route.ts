import { db } from "@/lib/db";
import { doctors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const rows = await db
    .select()
    .from(doctors)
    .where(eq(doctors.isActive, true))
    .orderBy(doctors.displayOrder);
  return Response.json(rows);
}
