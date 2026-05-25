import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { clinics } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const result: Record<string, unknown> = {};

  // 1. Env vars
  result.DATABASE_URL = process.env.DATABASE_URL ? "SET" : "MISSING";
  result.CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY ? "SET" : "MISSING";
  result.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "SET" : "MISSING";

  // 2. Auth
  try {
    const { userId } = await auth();
    result.userId = userId ?? "null (not authenticated)";

    // 3. DB + clinic lookup
    if (userId && process.env.DATABASE_URL) {
      const [clinic] = await db.select({ id: clinics.id, name: clinics.name })
        .from(clinics)
        .where(eq(clinics.clerkUserId, userId));
      result.clinic = clinic
        ? { id: clinic.id, name: clinic.name }
        : "NOT FOUND for this userId";
    }
  } catch (e) {
    result.error = e instanceof Error ? e.message : String(e);
  }

  return Response.json(result);
}
