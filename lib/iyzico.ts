// eslint-disable-next-line @typescript-eslint/no-require-imports
const Iyzipay = require("iyzipay");

export function getIyzipay() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_BASE_URI ?? "https://sandbox-api.iyzipay.com",
  });
}

export const PLAN_PRICES = {
  baslangic: {
    name: "Operexo Solo Klinik",
    monthly: 790000,   // ₺7.900
    setup: 990000,     // ₺9.900
  },
  profesyonel: {
    name: "Operexo Aktif Klinik",
    monthly: 1490000,  // ₺14.900
    setup: 1990000,    // ₺19.900
  },
  premium: {
    name: "Operexo Premium Klinik",
    monthly: 2490000,  // ₺24.900
    setup: 3990000,    // ₺39.900
  },
  kurumsal: {
    name: "Operexo Kurumsal",
    monthly: 5000000,  // ₺50.000 — contact sales, display-only
    setup: 7500000,    // ₺75.000
  },
} as const;

export type PlanId = keyof typeof PLAN_PRICES;
