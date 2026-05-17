"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/#ozellikler", label: "Özellikler" },
  { href: "/#nasil-calisir", label: "Nasıl Çalışır" },
  { href: "/#fiyatlandirma", label: "Fiyatlandırma" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#070B14]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
            <span className="text-white font-black text-sm">O</span>
          </div>
          <span className="font-bold text-xl text-white tracking-tight">operexo</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-slate-400 hover:text-white transition text-sm">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/sign-in" className="text-slate-400 hover:text-white text-sm transition">
            Giriş Yap
          </Link>
          <Link
            href="/kayit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Ücretsiz Başla
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#070B14] px-4 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-slate-300 text-sm">
              {l.label}
            </Link>
          ))}
          <Link href="/kayit" onClick={() => setOpen(false)} className="bg-indigo-600 text-white text-center px-4 py-2 rounded-lg text-sm font-medium">
            Ücretsiz Başla
          </Link>
        </div>
      )}
    </nav>
  );
}
