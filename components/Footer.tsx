import { Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-white text-lg mb-2">
            {process.env.NEXT_PUBLIC_CLINIC_NAME}
          </h3>
          <p className="text-sm leading-relaxed">
            Sağlığınız için profesyonel hizmet.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-2">İletişim</h4>
          <div className="flex items-center gap-2 text-sm mb-1">
            <Phone size={14} />
            <a href={`tel:${process.env.NEXT_PUBLIC_CLINIC_PHONE}`} className="hover:text-white">
              {process.env.NEXT_PUBLIC_CLINIC_PHONE}
            </a>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <MapPin size={14} className="mt-0.5 shrink-0" />
            <span>{process.env.NEXT_PUBLIC_CLINIC_ADDRESS}</span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-2">Çalışma Saatleri</h4>
          <p className="text-sm">Pzt–Cuma: 09:00–19:00</p>
          <p className="text-sm">Cumartesi: 10:00–14:00</p>
          <p className="text-sm">Pazar: Kapalı</p>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_CLINIC_NAME}. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
