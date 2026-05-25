"use client";

import { useState, useEffect, useCallback } from "react";
import { UserPlus, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";

type DoctorRow = {
  id: string;
  fullName: string;
  title: string | null;
  specialty: string | null;
  bio: string | null;
  isActive: boolean;
  displayOrder: number | null;
};

type DoctorForm = {
  fullName: string;
  title: string;
  specialty: string;
  bio: string;
  isActive: boolean;
  displayOrder: number;
};

type FormErrors = {
  fullName?: string;
};

const EMPTY_FORM: DoctorForm = {
  fullName: "",
  title: "",
  specialty: "",
  bio: "",
  isActive: true,
  displayOrder: 0,
};

const specialtyColors: Record<string, string> = {
  "Genel Diş Hekimliği": "bg-cyan-500/10 text-cyan-400",
  Ortodonti: "bg-indigo-500/10 text-indigo-400",
  İmplant: "bg-violet-500/10 text-violet-400",
  Pedodonti: "bg-amber-500/10 text-amber-400",
  Periodontoloji: "bg-emerald-500/10 text-emerald-400",
  "Oral Cerrahi": "bg-rose-500/10 text-rose-400",
};

const AVATAR_COLORS = [
  "from-indigo-500 to-cyan-400",
  "from-violet-500 to-indigo-400",
  "from-cyan-500 to-emerald-400",
  "from-amber-500 to-rose-400",
  "from-emerald-500 to-cyan-400",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function DoctorsAdminPage() {
  const [docs, setDocs] = useState<DoctorRow[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DoctorRow | null>(null);
  const [form, setForm] = useState<DoctorForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchDocs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/doctors");
      if (!res.ok) throw new Error("Sunucu hatası");
      setDocs(await res.json());
    } catch {
      showToast("error", "Doktorlar yüklenemedi.");
    } finally {
      setPageLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

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

  function openEdit(doc: DoctorRow) {
    setEditTarget(doc);
    setForm({
      fullName: doc.fullName,
      title: doc.title ?? "",
      specialty: doc.specialty ?? "",
      bio: doc.bio ?? "",
      isActive: doc.isActive,
      displayOrder: doc.displayOrder ?? 0,
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
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      errs.fullName = "Ad Soyad en az 2 karakter olmalı";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const url = editTarget
        ? `/api/admin/doctors/${editTarget.id}`
        : "/api/admin/doctors";
      const res = await fetch(url, {
        method: editTarget ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          title: form.title.trim() || null,
          specialty: form.specialty.trim() || null,
          bio: form.bio.trim() || null,
          isActive: form.isActive,
          displayOrder: form.displayOrder,
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
      await fetchDocs();
      showToast("success", editTarget ? "Doktor güncellendi." : "Doktor eklendi.");
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Bir hata oluştu."
      );
    } finally {
      setSaving(false);
    }
  }

  const activeCount = docs.filter((d) => d.isActive).length;

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
          <h1 className="text-2xl font-bold text-white">Doktorlar</h1>
          <p className="text-slate-500 text-sm mt-1">
            <span className="text-emerald-400 font-medium">{activeCount}</span>{" "}
            aktif,{" "}
            <span className="text-slate-400">{docs.length} toplam</span>
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
        >
          <UserPlus size={15} />
          Doktor Ekle
        </button>
      </div>

      {/* Loading */}
      {pageLoading && (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-indigo-400" />
        </div>
      )}

      {/* Empty */}
      {!pageLoading && docs.length === 0 && (
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl flex flex-col items-center justify-center py-16 text-slate-600">
          <UserPlus size={36} className="mb-3 opacity-30" />
          <p className="text-sm">Henüz doktor eklenmemiş</p>
        </div>
      )}

      {/* Kart grid */}
      {!pageLoading && docs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {docs.map((d, i) => {
            const specialtyColor = d.specialty
              ? (specialtyColors[d.specialty] ?? "bg-slate-500/10 text-slate-400")
              : "bg-slate-500/10 text-slate-400";
            const gradientColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <div
                key={d.id}
                className={`bg-[#0D1117] border rounded-2xl p-5 flex flex-col gap-4 transition hover:border-white/10 ${
                  d.isActive ? "border-white/5" : "border-white/5 opacity-60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center shrink-0`}
                  >
                    <span className="text-white font-bold text-sm">
                      {getInitials(d.fullName)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white text-sm">
                        {d.title} {d.fullName}
                      </h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          d.isActive
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-white/5 text-slate-500"
                        }`}
                      >
                        {d.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </div>
                    {d.specialty && (
                      <span
                        className={`inline-block text-xs px-2 py-0.5 rounded-lg mt-1 ${specialtyColor}`}
                      >
                        {d.specialty}
                      </span>
                    )}
                  </div>
                </div>

                {d.bio && (
                  <p className="text-xs text-slate-500 leading-relaxed border-t border-white/5 pt-3">
                    {d.bio}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs text-slate-600">
                  <span>Sıra #{d.displayOrder}</span>
                  <button
                    onClick={() => openEdit(d)}
                    className="text-slate-500 hover:text-white transition"
                  >
                    Düzenle
                  </button>
                </div>
              </div>
            );
          })}
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
                {editTarget ? "Doktoru Düzenle" : "Yeni Doktor Ekle"}
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
              {/* Ad Soyad */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Ad Soyad <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                  placeholder="Ahmet Yılmaz"
                  className={`w-full bg-white/[0.04] border rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/60 transition ${
                    errors.fullName ? "border-rose-500/50" : "border-white/10"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-rose-400 mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Unvan + Uzmanlık */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">
                    Unvan
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    placeholder="Dr."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/60 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">
                    Uzmanlık
                  </label>
                  <input
                    type="text"
                    value={form.specialty}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, specialty: e.target.value }))
                    }
                    placeholder="Ortodonti"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/60 transition"
                  />
                </div>
              </div>

              {/* Biyografi */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Kısa Biyografi
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bio: e.target.value }))
                  }
                  placeholder="Doktorun uzmanlık alanı ve deneyimi..."
                  rows={3}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/60 transition resize-none"
                />
              </div>

              {/* Sıra + Aktif toggle */}
              <div className="flex items-center gap-4">
                <div className="w-28">
                  <label className="block text-xs text-slate-400 mb-1.5">
                    Görünüm Sırası
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.displayOrder}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        displayOrder: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/60 transition"
                  />
                </div>
                <div className="flex items-center gap-2 mt-5">
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
