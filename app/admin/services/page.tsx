"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Clock, Banknote, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";

type ServiceRow = {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  priceFrom: number | null;
  priceTo: number | null;
  isActive: boolean;
};

type ServiceForm = {
  name: string;
  description: string;
  durationMinutes: number;
  priceFrom: string;
  priceTo: string;
  isActive: boolean;
};

type FormErrors = {
  name?: string;
  durationMinutes?: string;
  priceFrom?: string;
  priceTo?: string;
};

const EMPTY_FORM: ServiceForm = {
  name: "",
  description: "",
  durationMinutes: 30,
  priceFrom: "",
  priceTo: "",
  isActive: true,
};

const SERVICE_ICONS: Record<string, string> = {
  "Genel Muayene": "🔍",
  "Diş Temizliği": "✨",
  Dolgu: "🦷",
  "Diş Çekimi": "⚕️",
  "Kanal Tedavisi": "🩺",
  "İmplant Muayene": "🔬",
  "Diş Teli Kontrolü": "📋",
  "Ağız Röntgeni": "🫁",
};

function formatPrice(
  from: number | null,
  to: number | null | undefined
): string {
  if (from == null) return "Fiyat belirtilmemiş";
  if (from === 0) return "Ücretsiz";
  const f = from.toLocaleString("tr-TR");
  if (to) return `${f}₺ – ${to.toLocaleString("tr-TR")}₺`;
  return `${f}₺+`;
}

export default function ServicesAdminPage() {
  const [svcs, setSvcs] = useState<ServiceRow[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ServiceRow | null>(null);
  const [form, setForm] = useState<ServiceForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchSvcs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/services");
      if (!res.ok) throw new Error("Sunucu hatası");
      setSvcs(await res.json());
    } catch {
      showToast("error", "Hizmetler yüklenemedi.");
    } finally {
      setPageLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSvcs();
  }, [fetchSvcs]);

  // Escape ile kapat
  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalOpen]);

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(svc: ServiceRow) {
    setEditTarget(svc);
    setForm({
      name: svc.name,
      description: svc.description ?? "",
      durationMinutes: svc.durationMinutes,
      priceFrom: svc.priceFrom != null ? String(svc.priceFrom) : "",
      priceTo: svc.priceTo != null ? String(svc.priceTo) : "",
      isActive: svc.isActive,
    });
    setErrors({});
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setEditTarget(null);
    setErrors({});
  }

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = "Hizmet adı en az 2 karakter olmalı";
    }
    if (!form.durationMinutes || form.durationMinutes < 5) {
      errs.durationMinutes = "En az 5 dakika olmalı";
    }
    const from = form.priceFrom !== "" ? Number(form.priceFrom) : null;
    const to = form.priceTo !== "" ? Number(form.priceTo) : null;
    if (from !== null && isNaN(from)) errs.priceFrom = "Geçerli bir sayı girin";
    if (to !== null && isNaN(to)) errs.priceTo = "Geçerli bir sayı girin";
    if (from !== null && to !== null && to < from) {
      errs.priceTo = "Maksimum fiyat, minimumdan küçük olamaz";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    const priceFrom =
      form.priceFrom !== "" ? parseInt(form.priceFrom, 10) : null;
    const priceTo =
      form.priceTo !== "" ? parseInt(form.priceTo, 10) : null;

    try {
      const url = editTarget
        ? `/api/admin/services/${editTarget.id}`
        : "/api/admin/services";
      const res = await fetch(url, {
        method: editTarget ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
          durationMinutes: form.durationMinutes,
          priceFrom,
          priceTo,
          isActive: form.isActive,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg =
          typeof data.error === "string"
            ? data.error
            : "İşlem başarısız oldu.";
        throw new Error(msg);
      }
      closeModal();
      await fetchSvcs();
      showToast(
        "success",
        editTarget ? "Hizmet güncellendi." : "Hizmet eklendi."
      );
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Bir hata oluştu."
      );
    } finally {
      setSaving(false);
    }
  }

  const activeCount = svcs.filter((s) => s.isActive).length;
  const totalMinutes = svcs.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl transition-all ${
            toast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/25 text-rose-300"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={15} />
          ) : (
            <AlertCircle size={15} />
          )}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Hizmetler</h1>
          <p className="text-slate-500 text-sm mt-1">
            <span className="text-emerald-400 font-medium">{activeCount}</span>{" "}
            aktif,{" "}
            <span className="text-slate-400">{svcs.length} toplam hizmet</span>
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
        >
          <Plus size={15} />
          Hizmet Ekle
        </button>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <span className="text-indigo-400 text-lg">📋</span>
          </div>
          <div>
            <div className="text-xl font-bold text-white">{svcs.length}</div>
            <div className="text-xs text-slate-500">Toplam Hizmet</div>
          </div>
        </div>
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Clock size={16} className="text-emerald-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">
              {svcs.length > 0 ? Math.round(totalMinutes / svcs.length) : 0} dk
            </div>
            <div className="text-xs text-slate-500">Ort. Süre</div>
          </div>
        </div>
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <Banknote size={16} className="text-cyan-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{activeCount}</div>
            <div className="text-xs text-slate-500">Aktif Hizmet</div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {pageLoading && (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-indigo-400" />
        </div>
      )}

      {/* Empty */}
      {!pageLoading && svcs.length === 0 && (
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl flex flex-col items-center justify-center py-16 text-slate-600">
          <Plus size={36} className="mb-3 opacity-30" />
          <p className="text-sm">Henüz hizmet eklenmemiş</p>
        </div>
      )}

      {/* Hizmet listesi */}
      {!pageLoading && svcs.length > 0 && (
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {svcs.map((s) => {
              const icon = SERVICE_ICONS[s.name] ?? "🏥";
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition ${
                    !s.isActive ? "opacity-50" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-lg shrink-0">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">
                        {s.name}
                      </span>
                      {!s.isActive && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500">
                          Pasif
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock size={10} /> {s.durationMinutes} dk
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-emerald-400">
                      {formatPrice(s.priceFrom, s.priceTo)}
                    </div>
                  </div>
                  <button
                    onClick={() => openEdit(s)}
                    className="text-xs text-slate-600 hover:text-white transition ml-2 shrink-0"
                  >
                    Düzenle
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-[#0D1117] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="font-semibold text-white text-base">
                {editTarget ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"}
              </h2>
              <button
                onClick={closeModal}
                disabled={saving}
                className="text-slate-500 hover:text-white transition disabled:opacity-40"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Hizmet Adı */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Hizmet Adı <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Diş Temizliği"
                  className={`w-full bg-white/[0.04] border rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/60 transition ${
                    errors.name ? "border-rose-500/50" : "border-white/10"
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-rose-400 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Açıklama */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Açıklama
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Hizmet hakkında kısa açıklama..."
                  rows={2}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/60 transition resize-none"
                />
              </div>

              {/* Süre + Fiyat */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">
                    Süre (dk) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={form.durationMinutes}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        durationMinutes: Number(e.target.value),
                      }))
                    }
                    className={`w-full bg-white/[0.04] border rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/60 transition ${
                      errors.durationMinutes
                        ? "border-rose-500/50"
                        : "border-white/10"
                    }`}
                  />
                  {errors.durationMinutes && (
                    <p className="text-xs text-rose-400 mt-1">
                      {errors.durationMinutes}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">
                    Min Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.priceFrom}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, priceFrom: e.target.value }))
                    }
                    placeholder="500"
                    className={`w-full bg-white/[0.04] border rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/60 transition ${
                      errors.priceFrom ? "border-rose-500/50" : "border-white/10"
                    }`}
                  />
                  {errors.priceFrom && (
                    <p className="text-xs text-rose-400 mt-1">{errors.priceFrom}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">
                    Maks Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.priceTo}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, priceTo: e.target.value }))
                    }
                    placeholder="1500"
                    className={`w-full bg-white/[0.04] border rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/60 transition ${
                      errors.priceTo ? "border-rose-500/50" : "border-white/10"
                    }`}
                  />
                  {errors.priceTo && (
                    <p className="text-xs text-rose-400 mt-1">{errors.priceTo}</p>
                  )}
                </div>
              </div>

              {/* Aktif toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, isActive: !f.isActive }))
                  }
                  className={`relative w-10 h-6 rounded-full transition-colors ${
                    form.isActive ? "bg-emerald-500" : "bg-white/10"
                  }`}
                  aria-label="Aktiflik durumu"
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      form.isActive ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-xs text-slate-400">
                  {form.isActive ? "Aktif" : "Pasif"}
                </span>
              </div>

              {/* Butonlar */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white py-2.5 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {editTarget ? "Güncelle" : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
