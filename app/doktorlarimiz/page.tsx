import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { doctors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DoktorlarPage() {
  let docs: typeof doctors.$inferSelect[] = [];
  try {
    docs = await db.select().from(doctors).where(eq(doctors.isActive, true)).orderBy(doctors.displayOrder);
  } catch {}

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Doktorlarımız</h1>
          <p className="text-gray-500 text-center mb-10">Uzman kadromuzla tanışın</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {docs.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl p-6 shadow-sm border text-center">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700 mx-auto mb-4">
                  {doc.fullName.charAt(0)}
                </div>
                <div className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">{doc.title}</div>
                <h2 className="font-bold text-gray-900 text-lg">{doc.fullName}</h2>
                <p className="text-gray-500 text-sm mb-3">{doc.specialty}</p>
                {doc.bio && <p className="text-gray-600 text-sm leading-relaxed">{doc.bio}</p>}
                <Link
                  href={`/randevu?doctorId=${doc.id}`}
                  className="mt-4 inline-block bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Randevu Al
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
