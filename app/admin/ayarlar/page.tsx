import { getClinic } from "@/lib/clinic";
import { Calendar, Copy } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AyarlarPage() {
  const clinic = await getClinic();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const icalUrl = `${appUrl}/api/calendar/${clinic.slug}.ics`;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Ayarlar</h1>
        <p className="text-slate-500 text-sm mt-1">{clinic.name}</p>
      </div>

      <div className="space-y-4">
        {/* Klinik Bilgileri */}
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-4 text-sm">Klinik Bilgileri</h2>
          <div className="space-y-3 text-sm">
            {[
              { label: "Klinik Adı", value: clinic.name },
              { label: "Telefon", value: clinic.phone ?? "—" },
              { label: "Adres", value: clinic.address ?? "—" },
              { label: "Uzmanlık", value: clinic.specialty ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <span className="text-slate-500">{label}</span>
                <span className="font-medium text-slate-200">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Takvim Entegrasyonu */}
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={15} className="text-indigo-400" />
            <h2 className="font-semibold text-white text-sm">Takvim Entegrasyonu</h2>
          </div>
          <p className="text-slate-500 text-xs mb-4">
            Bu URL&apos;yi Google Calendar, Apple Calendar veya Outlook&apos;a ekleyerek randevularınızı otomatik senkronize edin.
          </p>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 flex items-center gap-2">
            <code className="text-xs text-indigo-300 flex-1 break-all">{icalUrl}</code>
          </div>
          <div className="mt-4 space-y-2 text-xs text-slate-500">
            <p><span className="text-slate-300 font-medium">Google Calendar:</span> Diğer takvimler → URL&apos;den ekle → URL&apos;yi yapıştır</p>
            <p><span className="text-slate-300 font-medium">Apple Calendar:</span> Dosya → Yeni Takvim Aboneliği → URL&apos;yi yapıştır</p>
            <p><span className="text-slate-300 font-medium">Outlook:</span> Takvim Ekle → İnternet&apos;ten → URL&apos;yi yapıştır</p>
          </div>
        </div>

        {/* VAPI */}
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-4 text-sm">VAPI Voice Agent</h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Assistant ID</span>
              <code className="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded">{process.env.VAPI_ASSISTANT_ID ?? "—"}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Phone Number ID</span>
              <code className="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded">{process.env.VAPI_PHONE_NUMBER_ID ?? "—"}</code>
            </div>
          </div>
          <div className="mt-4 border-t border-white/5 pt-4 text-xs text-slate-600 space-y-1">
            <p>Availability: <code>/api/vapi/availability</code></p>
            <p>Book: <code>/api/vapi/book</code></p>
            <p>Call-ended: <code>/api/vapi/call-ended</code></p>
          </div>
        </div>

        {/* n8n */}
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-4 text-sm">n8n Otomasyonlar</h2>
          <div className="text-sm space-y-3">
            <div>
              <span className="text-slate-500 text-xs block mb-1">Randevu Hatırlatma</span>
              <code className="text-xs text-slate-400">{process.env.N8N_WEBHOOK_REMINDER || "Ayarlanmadı"}</code>
            </div>
            <div>
              <span className="text-slate-500 text-xs block mb-1">Google Review İsteği</span>
              <code className="text-xs text-slate-400">{process.env.N8N_WEBHOOK_REVIEW || "Ayarlanmadı"}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
