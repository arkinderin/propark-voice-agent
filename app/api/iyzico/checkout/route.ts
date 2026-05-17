import { NextRequest } from "next/server";
import { z } from "zod";
import { PLAN_PRICES, PlanId, getIyzipay } from "@/lib/iyzico";
import { db } from "@/lib/db";
import { clinics, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const Schema = z.object({
  clinicId: z.string().uuid(),
  plan: z.enum(["baslangic", "profesyonel", "kurumsal"]),
  buyerName: z.string(),
  buyerSurname: z.string(),
  buyerEmail: z.string().email(),
  buyerPhone: z.string(),
  buyerIp: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { clinicId, plan, buyerName, buyerSurname, buyerEmail, buyerPhone } = parsed.data;
  const planInfo = PLAN_PRICES[plan as PlanId];

  const [clinic] = await db.select().from(clinics).where(eq(clinics.id, clinicId));
  if (!clinic) {
    return Response.json({ error: "Clinic not found" }, { status: 404 });
  }

  const totalAmount = ((planInfo.monthly + planInfo.setup) / 100).toFixed(2);
  const conversationId = `operexo_${clinicId}_${Date.now()}`;
  const buyerIp = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "85.34.78.112";

  const request = {
    locale: "tr",
    conversationId,
    price: totalAmount,
    paidPrice: totalAmount,
    currency: "TRY",
    basketId: clinicId,
    paymentGroup: "SUBSCRIPTION",
    callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/kayit/odeme/callback`,
    buyer: {
      id: clinicId,
      name: buyerName,
      surname: buyerSurname,
      gsmNumber: buyerPhone,
      email: buyerEmail,
      identityNumber: "11111111111", // zorunlu alan
      registrationAddress: clinic.address ?? "Türkiye",
      ip: buyerIp,
      city: "Istanbul",
      country: "Turkey",
    },
    shippingAddress: {
      contactName: `${buyerName} ${buyerSurname}`,
      city: "Istanbul",
      country: "Turkey",
      address: clinic.address ?? "Türkiye",
    },
    billingAddress: {
      contactName: `${buyerName} ${buyerSurname}`,
      city: "Istanbul",
      country: "Turkey",
      address: clinic.address ?? "Türkiye",
    },
    basketItems: [
      {
        id: `setup_${plan}`,
        name: `${planInfo.name} - Kurulum Ücreti`,
        category1: "SaaS",
        itemType: "VIRTUAL",
        price: (planInfo.setup / 100).toFixed(2),
      },
      {
        id: `monthly_${plan}`,
        name: `${planInfo.name} - 1. Ay Abonelik`,
        category1: "SaaS",
        itemType: "VIRTUAL",
        price: (planInfo.monthly / 100).toFixed(2),
      },
    ],
  };

  // Mock mod — iyzico key yokken veya test modunda UI testi için
  if (!process.env.IYZICO_API_KEY) {
    const mockToken = `mock_${Date.now()}`;
    const mockHtml = `
      <div style="background:#111827;border:1px solid #1f2937;border-radius:12px;padding:24px;color:#fff;font-family:sans-serif">
        <div style="color:#10b981;font-size:13px;margin-bottom:16px">🔒 Test Modu — Gerçek ödeme alınmaz</div>
        <div style="margin-bottom:12px">
          <label style="display:block;font-size:12px;color:#9ca3af;margin-bottom:6px">Kart Numarası</label>
          <input value="5528790000000008" readonly style="width:100%;background:#1f2937;border:1px solid #374151;border-radius:8px;padding:10px;color:#fff;font-size:14px">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div>
            <label style="display:block;font-size:12px;color:#9ca3af;margin-bottom:6px">Son Kullanma</label>
            <input value="12/30" readonly style="width:100%;background:#1f2937;border:1px solid #374151;border-radius:8px;padding:10px;color:#fff;font-size:14px">
          </div>
          <div>
            <label style="display:block;font-size:12px;color:#9ca3af;margin-bottom:6px">CVV</label>
            <input value="123" readonly style="width:100%;background:#1f2937;border:1px solid #374151;border-radius:8px;padding:10px;color:#fff;font-size:14px">
          </div>
        </div>
        <a href="/kayit/odeme/basarili" style="display:block;text-align:center;background:#6366f1;color:#fff;padding:12px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
          Ödemeyi Tamamla (Test)
        </a>
      </div>
    `;
    return Response.json({ checkoutFormContent: mockHtml, token: mockToken, conversationId });
  }

  const iyzipay = getIyzipay();
  return new Promise<Response>((resolve) => {
    iyzipay.checkoutFormInitialize.create(request, (err: Error | null, result: Record<string, unknown>) => {
      if (err || result.status !== "success") {
        resolve(Response.json({ error: err?.message ?? result.errorMessage }, { status: 500 }));
        return;
      }
      resolve(Response.json({
        checkoutFormContent: result.checkoutFormContent,
        token: result.token,
        conversationId,
      }));
    });
  });
}
