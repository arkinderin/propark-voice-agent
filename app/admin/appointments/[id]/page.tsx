"use client";

import { useEffect, useState } from "react";
import { formatTR, statusLabel, statusColor } from "@/lib/utils";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  email: string | null;
  appointmentAt: string;
  status: string;
  source: string;
  complaint: string | null;
  internalNotes: string | null;
  cancelReason: string | null;
  doctorId: string | null;
  serviceId: string | null;
}

export default function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [appt, setAppt] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      fetch(`/api/appointments/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setAppt(data);
          setNotes(data.internalNotes ?? "");
        })
        .finally(() => setLoading(false));
    });
  }, []);

  async function updateStatus(status: string, cancelReason?: string) {
    setSaving(true);
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, cancelReason }),
    });
    setSaving(false);
    router.refresh();
    setAppt((a) => a ? { ...a, status } : a);
  }

  async function saveNotes() {
    setSaving(true);
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ internalNotes: notes }),
    });
    setSaving(false);
  }

  if (loading) return <div className="text-gray-400 text-sm">Yükleniyor...</div>;
  if (!appt) return <div className="text-red-500">Randevu bulunamadı.</div>;

  return (
    <div className="max-w-2xl">
      <Link href="/admin/appointments" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4">
        <ArrowLeft size={14} /> Geri
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Randevu Detayı</h1>

      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xl font-semibold text-gray-900">{appt.patientName}</p>
            <p className="text-gray-500 text-sm">{appt.phone}</p>
            {appt.email && <p className="text-gray-500 text-sm">{appt.email}</p>}
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(appt.status)}`}>
            {statusLabel(appt.status)}
          </span>
        </div>

        <div className="border-t pt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-400 text-xs uppercase mb-1">Tarih/Saat</p>
            <p className="text-gray-800">{formatTR(appt.appointmentAt)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase mb-1">Kaynak</p>
            <p className="text-gray-800">{appt.source}</p>
          </div>
        </div>

        {appt.complaint && (
          <div className="border-t pt-4">
            <p className="text-gray-400 text-xs uppercase mb-1">Şikayet</p>
            <p className="text-gray-700 text-sm">{appt.complaint}</p>
          </div>
        )}

        <div className="border-t pt-4">
          <p className="text-gray-400 text-xs uppercase mb-1">Dahili Not</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Sekreter notu..."
          />
          <button
            onClick={saveNotes}
            disabled={saving}
            className="mt-2 text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition"
          >
            {saving ? "Kaydediliyor..." : "Notu Kaydet"}
          </button>
        </div>

        <div className="border-t pt-4 flex gap-2 flex-wrap">
          {appt.status === "talep" && (
            <button
              onClick={() => updateStatus("onaylandi")}
              className="flex items-center gap-1 bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <CheckCircle size={14} /> Onayla
            </button>
          )}
          {["talep", "onaylandi"].includes(appt.status) && (
            <>
              <button
                onClick={() => updateStatus("tamamlandi")}
                className="flex items-center gap-1 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Tamamlandı
              </button>
              <button
                onClick={() => updateStatus("gelmedi")}
                className="flex items-center gap-1 bg-gray-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Gelmedi
              </button>
              <button
                onClick={() => {
                  const reason = prompt("İptal sebebi:");
                  if (reason !== null) updateStatus("iptal", reason);
                }}
                className="flex items-center gap-1 bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                <XCircle size={14} /> İptal Et
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
