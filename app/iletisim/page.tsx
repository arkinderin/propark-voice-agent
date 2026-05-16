import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, MapPin, Clock } from "lucide-react";

export default function IletisimPage() {
  const phone = process.env.NEXT_PUBLIC_CLINIC_PHONE ?? "";
  const address = process.env.NEXT_PUBLIC_CLINIC_ADDRESS ?? "";
  const name = process.env.NEXT_PUBLIC_CLINIC_NAME ?? "Klinik";

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">İletişim</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="font-semibold text-gray-900 mb-4">Bize Ulaşın</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-blue-600 shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-blue-700">{phone}</a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p>Pzt–Cuma: 09:00–19:00</p>
                    <p>Cumartesi: 10:00–14:00</p>
                    <p>Pazar: Kapalı</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="font-semibold text-gray-900 mb-4">Hızlı Randevu</h2>
              <p className="text-sm text-gray-500 mb-4">
                7/24 AI asistanımızı arayarak veya online form ile randevu alabilirsiniz.
              </p>
              <a
                href={`tel:${phone}`}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium w-full mb-2"
              >
                <Phone size={16} /> Hemen Ara
              </a>
              <a
                href="/randevu"
                className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 px-5 py-2.5 rounded-lg hover:bg-blue-50 transition text-sm font-medium w-full"
              >
                Online Randevu Al
              </a>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-5 text-sm text-blue-800">
            <strong>Not:</strong> Acil durumlar için {process.env.CLINIC_EMERGENCY_PHONE} numaralı acil hattımızı arayabilirsiniz.
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
