import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HizmetlerPage() {
  let svcs: typeof services.$inferSelect[] = [];
  try {
    svcs = await db.select().from(services).where(eq(services.isActive, true));
  } catch {}

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Hizmetlerimiz</h1>
          <p className="text-gray-500 text-center mb-10">
            Net fiyat bilgisi için muayene gerekmektedir.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {svcs.map((s) => (
              <div key={s.id} className="bg-white rounded-xl p-5 shadow-sm border flex items-start gap-4">
                <div className="text-2xl">🦷</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{s.name}</h3>
                  {s.description && <p className="text-sm text-gray-500 mt-1">{s.description}</p>}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {s.durationMinutes} dk
                    </span>
                    {s.priceFrom != null && (
                      <span>
                        {s.priceFrom === 0
                          ? "Ücretsiz muayene"
                          : `${s.priceFrom.toLocaleString("tr-TR")}₺${s.priceTo ? ` – ${s.priceTo.toLocaleString("tr-TR")}₺` : "+"}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/randevu" className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition">
              Randevu Al
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
