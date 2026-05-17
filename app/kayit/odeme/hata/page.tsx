import Link from "next/link";
import { XCircle } from "lucide-react";

export default function OdemeHata() {
  return (
    <div className="min-h-screen bg-[#070B14] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-rose-400" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Ödeme Başarısız</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Ödeme işlemi tamamlanamadı. Lütfen kart bilgilerinizi kontrol edip tekrar deneyin.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/kayit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
          >
            Tekrar Dene
          </Link>
          <Link href="/" className="border border-white/10 text-slate-300 hover:bg-white/5 px-5 py-2.5 rounded-xl text-sm transition">
            Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
