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
    monthly: 199000,   // 1990₺ (kuruş cinsinden)
    setup: 350000,     // 3500₺
  },
  profesyonel: {
    name: "Operexo Aktif Klinik",
    monthly: 449000,   // 4490₺
    setup: 500000,     // 5000₺
  },
  kurumsal: {
    name: "Operexo Kurumsal",
    monthly: 999000,   // 9990₺ — contact sales, display-only
    setup: 1000000,    // 10000₺
  },
} as const;

export type PlanId = keyof typeof PLAN_PRICES;
