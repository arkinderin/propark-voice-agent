export default function AyarlarPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ayarlar</h1>
      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Klinik Bilgileri</h2>
          <div className="space-y-3 text-sm">
            {[
              { label: "Klinik Adı", env: process.env.NEXT_PUBLIC_CLINIC_NAME },
              { label: "Telefon", env: process.env.NEXT_PUBLIC_CLINIC_PHONE },
              { label: "Adres", env: process.env.NEXT_PUBLIC_CLINIC_ADDRESS },
            ].map(({ label, env }) => (
              <div key={label} className="flex justify-between border-b pb-2 last:border-0">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-800">{env ?? "—"}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">.env.local dosyasından güncellenir.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">VAPI Voice Agent</h2>
          <div className="text-sm space-y-2 text-gray-600">
            <p>Assistant ID: <code className="bg-gray-100 px-1 rounded">{process.env.VAPI_ASSISTANT_ID ?? "—"}</code></p>
            <p>Phone Number ID: <code className="bg-gray-100 px-1 rounded">{process.env.VAPI_PHONE_NUMBER_ID ?? "—"}</code></p>
          </div>
          <div className="mt-4 text-xs text-gray-400 space-y-1">
            <p>Availability webhook: <code>/api/vapi/availability</code></p>
            <p>Book webhook: <code>/api/vapi/book</code></p>
            <p>Call-ended webhook: <code>/api/vapi/call-ended</code></p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">n8n Webhook'lar</h2>
          <div className="text-sm space-y-2 text-gray-600">
            <p>Reminder: <code className="bg-gray-100 px-1 rounded text-xs">{process.env.N8N_WEBHOOK_REMINDER ?? "—"}</code></p>
            <p>Review: <code className="bg-gray-100 px-1 rounded text-xs">{process.env.N8N_WEBHOOK_REVIEW ?? "—"}</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
