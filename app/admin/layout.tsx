import Link from "next/link";
import { Calendar, Phone, Users, Settings, BarChart2, Stethoscope, Zap } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

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
    <div className="flex h-screen bg-[#070B14] text-white">
      <aside className="w-56 bg-[#0A0E1A] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-white">operexo</span>
          </div>
          <p className="text-xs text-slate-600 mt-2 uppercase tracking-widest">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition text-sm"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5 flex items-center justify-between">
          <Link href="/" className="text-xs text-slate-600 hover:text-slate-400 transition">
            ← Siteye Dön
          </Link>
          <UserButton />
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
