"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-5">
        <AlertTriangle size={26} className="text-rose-400" />
      </div>
      <h2 className="text-white font-semibold text-lg mb-2">Bir hata oluştu</h2>
      <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
        {error.message || "Sayfa yüklenirken beklenmeyen bir hata oluştu."}
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm px-4 py-2 rounded-xl transition"
      >
        <RefreshCw size={14} />
        Tekrar Dene
      </button>
    </div>
  );
}
