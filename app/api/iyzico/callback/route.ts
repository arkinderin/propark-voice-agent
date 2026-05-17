import { NextRequest } from "next/server";
import { getIyzipay } from "@/lib/iyzico";
import { db } from "@/lib/db";
import { clinics, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const token = formData.get("token")?.toString();

  if (!token) {
    return redirect("/kayit/odeme/hata");
  }

  const iyzipay = getIyzipay();
  return new Promise<Response>((resolve) => {
    iyzipay.checkoutForm.retrieve({ locale: "tr", token }, async (err: Error | null, result: Record<string, unknown>) => {
      if (err || result.status !== "success" || result.paymentStatus !== "SUCCESS") {
        resolve(Response.redirect(new URL("/kayit/odeme/hata", req.url)));
        return;
      }

      const basketId = result.basketId as string; // clinicId
      const conversationId = (result.conversationId as string) ?? "";
      const plan = conversationId.includes("profesyonel")
        ? "profesyonel"
        : conversationId.includes("kurumsal")
        ? "kurumsal"
        : "baslangic";

      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      await db
        .update(subscriptions)
        .set({
          status: "active",
          iyzicoSubscriptionRef: token,
          currentPeriodStart: new Date(),
          currentPeriodEnd: periodEnd,
        })
        .where(eq(subscriptions.clinicId, basketId));

      resolve(Response.redirect(new URL("/kayit/odeme/basarili", req.url)));
    });
  });
}
