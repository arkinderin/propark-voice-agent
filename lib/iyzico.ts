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
    name: "Operexo Starter",
    monthly: 249000,   // 2490₺ (kuruş cinsinden)
    setup: 250000,     // 2500₺
  },
  profesyonel: {
    name: "Operexo Professional",
    monthly: 499000,
    setup: 500000,
  },
  kurumsal: {
    name: "Operexo Enterprise",
    monthly: 999000,
    setup: 1000000,
  },
} as const;

export type PlanId = keyof typeof PLAN_PRICES;
