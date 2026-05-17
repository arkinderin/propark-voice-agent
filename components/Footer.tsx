import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#070B14] border-t border-white/5 text-slate-400 py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white font-black text-xs">O</span>
            </div>
            <span className="font-bold text-white">operexo</span>
          </div>
          <p className="text-sm leading-relaxed">
            Kliniklere yapay zeka destekli sesli randevu asistanı.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm mb-3">Ürün</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#ozellikler" className="hover:text-white transition">Özellikler</Link></li>
            <li><Link href="/#fiyatlandirma" className="hover:text-white transition">Fiyatlandırma</Link></li>
            <li><Link href="/#nasil-calisir" className="hover:text-white transition">Nasıl Çalışır</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm mb-3">Şirket</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/hakkimizda" className="hover:text-white transition">Hakkımızda</Link></li>
            <li><Link href="/iletisim" className="hover:text-white transition">İletişim</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm mb-3">Hesap</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/kayit" className="hover:text-white transition">Kayıt Ol</Link></li>
            <li><Link href="/sign-in" className="hover:text-white transition">Giriş Yap</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <span>© {new Date().getFullYear()} Operexo. Tüm hakları saklıdır.</span>
        <div className="flex gap-4">
          <Link href="/gizlilik" className="hover:text-slate-400 transition">Gizlilik Politikası</Link>
          <Link href="/kullanim-kosullari" className="hover:text-slate-400 transition">Kullanım Koşulları</Link>
        </div>
      </div>
    </footer>
  );
}
