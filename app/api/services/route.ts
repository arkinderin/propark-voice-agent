import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const rows = await db
    .select()
    .from(services)
    .where(eq(services.isActive, true));
  return Response.json(rows);
}
