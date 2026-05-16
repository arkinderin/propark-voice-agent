import Link from "next/link";
import { Calendar, Phone, Users, Settings, BarChart2, Stethoscope } from "lucide-react";

const navItems = [
  { href: "/admin", icon: BarChart2, label: "Dashboard" },
  { href: "/admin/appointments", icon: Calendar, label: "Randevular" },
  { href: "/admin/calls", icon: Phone, label: "Aramalar" },
  { href: "/admin/doctors", icon: Users, label: "Doktorlar" },
  { href: "/admin/services", icon: Stethoscope, label: "Hizmetler" },
  { href: "/admin/ayarlar", icon: Settings, label: "Ayarlar" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-56 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <p className="text-xs text-gray-400 uppercase tracking-widest">Admin Panel</p>
          <p className="font-bold text-sm mt-1 truncate">{process.env.NEXT_PUBLIC_CLINIC_NAME}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition text-sm"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Link href="/" className="text-xs text-gray-400 hover:text-white transition">
            ← Siteye Dön
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
