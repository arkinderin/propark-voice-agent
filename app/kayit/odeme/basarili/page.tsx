import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OdemeBasarili() {
  return (
    <div className="min-h-screen bg-[#070B14] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Ödeme Başarılı!</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Aboneliğiniz aktive edildi. 24 saat içinde telefon numaranız ve giriş bilgileriniz e-posta adresinize gönderilecektir.
        </p>
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 transition text-sm">
          Ana sayfaya dön
        </Link>
      </div>
    </div>
  );
}
