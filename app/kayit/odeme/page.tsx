"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Lock } from "lucide-react";

function OdemeForm() {
  const params = useSearchParams();
  const clinicId = params.get("clinicId");
  const plan = params.get("plan") ?? "profesyonel";
  const contactName = params.get("name") ?? "";
  const email = params.get("email") ?? "";
  const phone = params.get("phone") ?? "";

  const [checkoutHtml, setCheckoutHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clinicId) return;

    const nameParts = contactName.split(" ");
    const buyerName = nameParts[0] ?? "Ad";
    const buyerSurname = nameParts.slice(1).join(" ") || "Soyad";

    fetch("/api/iyzico/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clinicId, plan, buyerName, buyerSurname, buyerEmail: email, buyerPhone: phone }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.checkoutFormContent) {
          setCheckoutHtml(data.checkoutFormContent);
        } else {
          setError(data.error ?? "Ödeme formu yüklenemedi");
        }
      })
      .catch(() => setError("Bağlantı hatası"))
      .finally(() => setLoading(false));
  }, [clinicId, plan, contactName, email, phone]);

  useEffect(() => {
    if (checkoutHtml) {
      const script = document.createElement("script");
      script.src = "https://sandbox-static.iyzipay.com/checkoutform/v2/bundle.js";
      script.async = true;
      document.body.appendChild(script);
      return () => { document.body.removeChild(script); };
    }
  }, [checkoutHtml]);

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
            <span className="text-white font-black text-xs">O</span>
          </div>
          <span className="font-bold text-xl text-white">operexo</span>
        </div>

        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-2 text-emerald-400 text-sm mb-4">
            <Lock size={14} />
            <span>256-bit SSL şifreleme ile güvenli ödeme</span>
          </div>
          {loading && (
            <div className="text-center py-8 text-slate-400 text-sm">Ödeme formu yükleniyor...</div>
          )}
          {error && (
            <div className="text-center py-8 text-rose-400 text-sm">{error}</div>
          )}
          {checkoutHtml && (
            <div
              dangerouslySetInnerHTML={{ __html: checkoutHtml }}
              id="iyzipay-checkout-form"
              className="checkout-form"
            />
          )}
        </div>
        <p className="text-center text-slate-600 text-xs">
          iyzico güvencesiyle ödeme yapılmaktadır
        </p>
      </div>
    </div>
  );
}

export default function OdemePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070B14] flex items-center justify-center text-slate-400">Yükleniyor...</div>}>
      <OdemeForm />
    </Suspense>
  );
}
