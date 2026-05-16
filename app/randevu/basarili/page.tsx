import { CheckCircle, Calendar, Phone } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BasariliPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Randevunuz Alındı!</h1>
          <p className="text-gray-500 mb-6">
            WhatsApp üzerinden onay mesajı ve hatırlatma gönderilecektir.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 mb-6">
            <p>24 saat ve 2 saat önce hatırlatma mesajı alacaksınız.</p>
            <p className="mt-1">İptal/değişiklik için bizi arayabilirsiniz.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              Ana Sayfa
            </Link>
            <a
              href={`tel:${process.env.NEXT_PUBLIC_CLINIC_PHONE}`}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-1"
            >
              <Phone size={14} /> Bizi Ara
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
