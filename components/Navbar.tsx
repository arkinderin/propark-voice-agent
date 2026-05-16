"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

const links = [
  { href: "/doktorlarimiz", label: "Doktorlarımız" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-xl text-blue-700">
          {process.env.NEXT_PUBLIC_CLINIC_NAME ?? "Klinik"}
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-gray-600 hover:text-blue-700 transition">
              {l.label}
            </Link>
          ))}
          <a
            href={`tel:${process.env.NEXT_PUBLIC_CLINIC_PHONE}`}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-700"
          >
            <Phone size={14} />
            {process.env.NEXT_PUBLIC_CLINIC_PHONE}
          </a>
          <Link
            href="/randevu"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Randevu Al
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white px-4 py-3 flex flex-col gap-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-gray-700">
              {l.label}
            </Link>
          ))}
          <Link href="/randevu" onClick={() => setOpen(false)} className="bg-blue-600 text-white text-center px-4 py-2 rounded-lg text-sm font-medium">
            Randevu Al
          </Link>
        </div>
      )}
    </nav>
  );
}
