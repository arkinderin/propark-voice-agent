import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🌱 Seeding...");

  // Propark kliniği — Clerk user ID'yi buraya gir
  const PROPARK_CLERK_USER_ID = process.env.SEED_CLERK_USER_ID ?? "placeholder_clerk_user_id";

  const [clinic] = await db
    .insert(schema.clinics)
    .values({
      clerkUserId: PROPARK_CLERK_USER_ID,
      name: "Propark Klinik",
      slug: "propark",
      phone: process.env.NEXT_PUBLIC_CLINIC_PHONE,
      address: process.env.NEXT_PUBLIC_CLINIC_ADDRESS,
      specialty: "Diş Kliniği",
      vapiAssistantId: process.env.VAPI_ASSISTANT_ID,
      vapiPhoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
    })
    .returning();

  const [doc1, doc2, doc3] = await db
    .insert(schema.doctors)
    .values([
      { clinicId: clinic.id, fullName: "Ahmet Yılmaz", title: "Dt.", specialty: "Genel Diş Hekimliği", bio: "15 yıllık deneyimli diş hekimi.", displayOrder: 1 },
      { clinicId: clinic.id, fullName: "Ayşe Kaya", title: "Op. Dr.", specialty: "Ortodonti", bio: "Diş teli ve invisalign uzmanı.", displayOrder: 2 },
      { clinicId: clinic.id, fullName: "Mehmet Demir", title: "Dr.", specialty: "İmplant", bio: "İmplant ve oral cerrahi uzmanı.", displayOrder: 3 },
    ])
    .returning();

  const svcs = await db
    .insert(schema.services)
    .values([
      { clinicId: clinic.id, name: "Genel Muayene", durationMinutes: 30, priceFrom: 500 },
      { clinicId: clinic.id, name: "Diş Temizliği", durationMinutes: 45, priceFrom: 800, priceTo: 1200 },
      { clinicId: clinic.id, name: "Dolgu", durationMinutes: 45, priceFrom: 600, priceTo: 1500 },
      { clinicId: clinic.id, name: "Diş Çekimi", durationMinutes: 30, priceFrom: 500, priceTo: 1000 },
      { clinicId: clinic.id, name: "Kanal Tedavisi", durationMinutes: 60, priceFrom: 2000, priceTo: 4000 },
      { clinicId: clinic.id, name: "İmplant Muayene", durationMinutes: 30, priceFrom: 0 },
      { clinicId: clinic.id, name: "Diş Teli Kontrolü", durationMinutes: 30, priceFrom: 300 },
      { clinicId: clinic.id, name: "Ağız Röntgeni", durationMinutes: 15, priceFrom: 200, priceTo: 500 },
    ])
    .returning();

  const now = new Date();
  const appts = [];
  for (let i = 0; i < 10; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i - 2);
    d.setHours(9 + i, 0, 0, 0);
    appts.push({
      clinicId: clinic.id,
      patientName: `Test Hasta ${i + 1}`,
      phone: `+9055500000${String(i).padStart(2, "0")}`,
      doctorId: [doc1.id, doc2.id, doc3.id][i % 3],
      serviceId: svcs[i % svcs.length].id,
      appointmentAt: d,
      status: (["talep", "onaylandi", "tamamlandi"][i % 3]) as "talep" | "onaylandi" | "tamamlandi",
      source: "web" as const,
      complaint: "Test şikayeti",
    });
  }

  await db.insert(schema.appointments).values(appts);

  console.log(`✅ Seed tamamlandı — Clinic ID: ${clinic.id}`);
  console.log(`   Clerk User ID için: SEED_CLERK_USER_ID env değişkenini ayarla`);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
