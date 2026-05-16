import Link from "next/link";
import { Phone, Calendar, Star, Clock, CheckCircle, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const featuredServices = [
  { icon: "🦷", name: "Diş Temizliği", desc: "Profesyonel diş taşı temizliği ve diş yüzeyi parlatma" },
  { icon: "🔬", name: "Kanal Tedavisi", desc: "Ağrısız kanal tedavisi, modern ekipmanlarla" },
  { icon: "✨", name: "Diş Teli", desc: "Metal, seramik ve şeffaf plak seçenekleriyle ortodonti" },
];

const stats = [
  { value: "5000+", label: "Mutlu Hasta" },
  { value: "15+", label: "Yıl Deneyim" },
  { value: "3", label: "Uzman Doktor" },
  { value: "%98", label: "Memnuniyet" },
];

export default function HomePage() {
  const clinicName = process.env.NEXT_PUBLIC_CLINIC_NAME ?? "Klinik";
  const clinicPhone = process.env.NEXT_PUBLIC_CLINIC_PHONE ?? "";

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-700 to-blue-500 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-blue-200 text-sm font-medium uppercase tracking-widest mb-3">Hoş Geldiniz</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {clinicName}
            </h1>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              7/24 AI telefon asistanı ile randevu alın. Kaçan çağrı yok, bekleme yok.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/randevu"
                className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
              >
                <Calendar size={18} />
                Online Randevu Al
              </Link>
              <a
                href={`tel:${clinicPhone}`}
                className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white/10 transition flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                {clinicPhone}
              </a>
            </div>
          </div>
        </section>

        {/* AI Vurgu */}
        <section className="bg-blue-50 py-8 px-4">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="text-4xl">🤖</div>
            <div>
              <p className="font-semibold text-blue-900">7/24 AI Voice Asistan</p>
              <p className="text-blue-700 text-sm">Telefonla arayın, yapay zeka asistanımız Türkçe olarak randevunuzu anlık alır.</p>
            </div>
            <div className="sm:ml-auto">
              <a href={`tel:${clinicPhone}`} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                Şimdi Ara
              </a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-blue-700">{s.value}</div>
                <div className="text-gray-500 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Öne Çıkan Hizmetler */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Hizmetlerimiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredServices.map((s) => (
                <div key={s.name} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition">
                  <div className="text-4xl mb-3">{s.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{s.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/hizmetler" className="text-blue-600 font-medium hover:underline flex items-center justify-center gap-1">
                Tüm Hizmetler <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-blue-700 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <Clock size={32} className="mx-auto mb-3 text-blue-200" />
            <h2 className="text-3xl font-bold mb-3">Randevunuzu Hemen Alın</h2>
            <p className="text-blue-200 mb-6">Online form veya telefon — 2 dakikada ayarlanır.</p>
            <Link
              href="/randevu"
              className="bg-white text-blue-700 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition inline-flex items-center gap-2"
            >
              <Calendar size={18} />
              Randevu Al
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
