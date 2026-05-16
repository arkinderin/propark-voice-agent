"use client";

import { useEffect } from "react";
import { useRandevuStore } from "@/store/randevu";
import { formatTR } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, User, CheckCircle, AlertTriangle } from "lucide-react";

export default function RandevuForm() {
  const store = useRandevuStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const doctorId = searchParams.get("doctorId");
    if (doctorId) store.setDoctor(doctorId);

    fetch("/api/doctors").then((r) => r.json()).then(store.setDoctors).catch(() => {});
    fetch("/api/services").then((r) => r.json()).then(store.setServices).catch(() => {});
  }, []);

  // Step 1: Şikayet + Triage
  async function handleStep1() {
    if (store.complaint.length < 10) {
      store.setError("Lütfen şikayetinizi en az 10 karakter açıklayın.");
      return;
    }
    store.setLoading(true);
    store.setError(null);
    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complaint: store.complaint }),
      });
      const data = await res.json();
      store.setTriage(data);
      if (data.suggestedDoctorId) store.setDoctor(data.suggestedDoctorId);
      if (data.suggestedServiceId) store.setService(data.suggestedServiceId);
      store.setStep(2);
    } catch {
      store.setError("Bir hata oluştu, tekrar deneyin.");
    } finally {
      store.setLoading(false);
    }
  }

  // Step 2: Doktor + Saat
  async function loadSlots(doctorId: string | null) {
    const url = "/api/appointments/availability" + (doctorId ? `?doctorId=${doctorId}` : "");
    const res = await fetch(url);
    const data = await res.json();
    store.setSlots(data.slots ?? []);
  }

  useEffect(() => {
    if (store.step === 2) {
      loadSlots(store.selectedDoctorId);
    }
  }, [store.step, store.selectedDoctorId]);

  function handleDoctorChange(id: string) {
    store.setDoctor(id || null);
  }

  // Step 3: Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!store.selectedSlot) { store.setError("Lütfen bir saat seçin."); return; }
    if (!store.patientName || !store.phone) { store.setError("Ad ve telefon zorunludur."); return; }
    if (!store.kvkkConsent) { store.setError("KVKK onayı zorunludur."); return; }

    store.setLoading(true);
    store.setError(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: store.patientName,
          phone: store.phone,
          email: store.email || undefined,
          doctorId: store.selectedDoctorId || undefined,
          serviceId: store.selectedServiceId || undefined,
          appointmentAt: store.selectedSlot,
          complaint: store.complaint,
          source: "web",
          kvkkConsent: store.kvkkConsent,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        store.setError(err.error ?? "Randevu oluşturulamadı.");
        return;
      }

      const appt = await res.json();
      store.reset();
      router.push(`/randevu/basarili?id=${appt.id}`);
    } catch {
      store.setError("Bir hata oluştu, tekrar deneyin.");
    } finally {
      store.setLoading(false);
    }
  }

  const urgencyColor = store.triage?.urgency === "yüksek"
    ? "bg-red-50 border-red-200 text-red-800"
    : store.triage?.urgency === "orta"
    ? "bg-yellow-50 border-yellow-200 text-yellow-800"
    : "bg-green-50 border-green-200 text-green-800";

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${store.step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
              {s}
            </div>
            {s < 3 && <div className={`flex-1 h-1 mx-1 ${store.step > s ? "bg-blue-600" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {store.step === 1 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Şikayetinizi Anlatın</h2>
          <p className="text-gray-500 text-sm mb-5">AI asistanımız uygun doktoru önerecektir.</p>
          <textarea
            value={store.complaint}
            onChange={(e) => store.setComplaint(e.target.value)}
            rows={5}
            placeholder="Örn: Sağ üst dişimde iki haftadır şiddetli ağrı var, soğuğa duyarlı..."
            className="w-full border border-gray-300 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {store.error && (
            <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
              <AlertTriangle size={14} /> {store.error}
            </div>
          )}
          <button
            onClick={handleStep1}
            disabled={store.loading}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {store.loading ? "Analiz ediliyor..." : "Devam Et"}
          </button>
        </div>
      )}

      {/* Step 2 */}
      {store.step === 2 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Doktor ve Saat Seçin</h2>

          {store.triage && (
            <div className={`border rounded-xl p-4 mb-5 text-sm ${urgencyColor}`}>
              <p><strong>Öneri:</strong> {store.triage.reasoning}</p>
              {store.triage.urgency === "yüksek" && (
                <p className="mt-1 font-semibold">⚠ Acil görünüyor — en yakın saati seçmenizi öneririz.</p>
              )}
            </div>
          )}

          <label className="block text-sm font-medium text-gray-700 mb-1">Doktor Seçin</label>
          <select
            value={store.selectedDoctorId ?? ""}
            onChange={(e) => handleDoctorChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tüm Doktorlar</option>
            {store.doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title} {d.fullName} — {d.specialty}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium text-gray-700 mb-1">Hizmet Seçin</label>
          <select
            value={store.selectedServiceId ?? ""}
            onChange={(e) => store.setService(e.target.value || null)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seçiniz (isteğe bağlı)</option>
            {store.services.map((s) => (
              <option key={s.id} value={s.id}>{s.name} — {s.durationMinutes} dk</option>
            ))}
          </select>

          <label className="block text-sm font-medium text-gray-700 mb-2">Müsait Saatler</label>
          {store.slots.length === 0 ? (
            <p className="text-gray-400 text-sm">Müsait saat bulunamadı.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {store.slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => store.setSlot(slot)}
                  className={`text-xs p-2 rounded-lg border transition ${
                    store.selectedSlot === slot
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-blue-400"
                  }`}
                >
                  {formatTR(slot, "d MMM, HH:mm")}
                </button>
              ))}
            </div>
          )}

          {store.error && (
            <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
              <AlertTriangle size={14} /> {store.error}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button onClick={() => store.setStep(1)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
              Geri
            </button>
            <button
              onClick={() => {
                if (!store.selectedSlot) { store.setError("Lütfen bir saat seçin."); return; }
                store.setError(null);
                store.setStep(3);
              }}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Devam Et
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {store.step === 3 && (
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Bilgilerinizi Girin</h2>
          <p className="text-sm text-gray-500 mb-5">
            Seçilen saat: <strong>{formatTR(store.selectedSlot!)}</strong>
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
              <input
                type="text"
                value={store.patientName}
                onChange={(e) => store.setPatientName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ahmet Yılmaz"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
              <input
                type="tel"
                value={store.phone}
                onChange={(e) => store.setPhone(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+90 555 000 0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta (isteğe bağlı)</label>
              <input
                type="email"
                value={store.email}
                onChange={(e) => store.setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ornek@email.com"
              />
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={store.kvkkConsent}
                onChange={(e) => store.setKvkk(e.target.checked)}
                className="mt-0.5"
              />
              <span className="text-xs text-gray-500 leading-relaxed">
                KVKK kapsamında kişisel verilerimin klinik tarafından işlenmesine onay veriyorum.
                Verilerim randevu yönetimi amacıyla 10 yıl saklanacaktır.
              </span>
            </label>
          </div>

          {store.error && (
            <div className="mt-3 text-red-600 text-sm flex items-center gap-1">
              <AlertTriangle size={14} /> {store.error}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => store.setStep(2)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
              Geri
            </button>
            <button
              type="submit"
              disabled={store.loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition flex items-center justify-center gap-2"
            >
              {store.loading ? "Kaydediliyor..." : <><CheckCircle size={16} /> Randevu Onayla</>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
