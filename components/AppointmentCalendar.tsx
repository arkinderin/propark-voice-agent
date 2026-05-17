"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type Appointment = {
  id: string;
  patientName: string;
  phone: string;
  appointmentAt: string;
  status: string;
  doctorId: string | null;
};

type Doctor = { id: string; fullName: string };

const STATUS_COLORS: Record<string, string> = {
  talep: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  onaylandi: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  tamamlandi: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  iptal: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  gelmedi: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

const STATUS_LABELS: Record<string, string> = {
  talep: "Talep",
  onaylandi: "Onaylandı",
  tamamlandi: "Tamamlandı",
  iptal: "İptal",
  gelmedi: "Gelmedi",
};

const DAYS_TR = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTHS_TR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  const cells: { date: Date; current: boolean }[] = [];
  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, prevDays - i), current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), current: true });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    cells.push({ date: new Date(last.getTime() + 86400000), current: false });
  }
  return cells;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function AppointmentCalendar({ appointments, doctors }: { appointments: Appointment[]; doctors: Doctor[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<Date>(today);

  const cells = getMonthDays(year, month);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const apptsByDay = (date: Date) =>
    appointments.filter(a => isSameDay(new Date(a.appointmentAt), date));

  const selectedAppts = apptsByDay(selected).sort(
    (a, b) => new Date(a.appointmentAt).getTime() - new Date(b.appointmentAt).getTime()
  );

  const doctorName = (id: string | null) =>
    id ? doctors.find(d => d.id === id)?.fullName ?? "—" : "—";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Calendar grid */}
      <div className="lg:col-span-2 bg-[#0D1117] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white text-lg">{MONTHS_TR[month]} {year}</h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {DAYS_TR.map(d => (
            <div key={d} className="text-center text-xs text-slate-500 font-medium py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, i) => {
            const dayAppts = apptsByDay(cell.date);
            const isToday = isSameDay(cell.date, today);
            const isSelected = isSameDay(cell.date, selected);

            return (
              <button
                key={i}
                onClick={() => setSelected(cell.date)}
                className={`relative aspect-square rounded-xl flex flex-col items-center justify-start pt-1.5 text-sm transition ${
                  !cell.current ? "opacity-25" : ""
                } ${
                  isSelected
                    ? "bg-indigo-600 text-white"
                    : isToday
                    ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/30"
                    : "hover:bg-white/5 text-slate-300"
                }`}
              >
                <span className="font-medium text-xs leading-none">{cell.date.getDate()}</span>
                {dayAppts.length > 0 && (
                  <div className="flex gap-0.5 mt-1 flex-wrap justify-center px-1">
                    {dayAppts.slice(0, 3).map((a, j) => (
                      <span
                        key={j}
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? "bg-white/70" :
                          a.status === "onaylandi" ? "bg-indigo-400" :
                          a.status === "tamamlandi" ? "bg-emerald-400" :
                          a.status === "iptal" ? "bg-rose-400" : "bg-amber-400"
                        }`}
                      />
                    ))}
                    {dayAppts.length > 3 && (
                      <span className={`text-[9px] ${isSelected ? "text-white/70" : "text-slate-500"}`}>
                        +{dayAppts.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day detail */}
      <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 flex flex-col">
        <div className="mb-4">
          <h3 className="font-bold text-white">
            {selected.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}
          </h3>
          <p className="text-slate-500 text-sm">{selectedAppts.length} randevu</p>
        </div>

        {selectedAppts.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-600 text-sm text-center">
            Bu gün randevu yok
          </div>
        ) : (
          <div className="space-y-2 flex-1 overflow-y-auto">
            {selectedAppts.map(a => (
              <Link
                key={a.id}
                href={`/admin/appointments/${a.id}`}
                className="block bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-xl p-3 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium text-white text-sm truncate">{a.patientName}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{doctorName(a.doctorId)}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-slate-300 text-xs font-medium">
                      {new Date(a.appointmentAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full border mt-1 ${STATUS_COLORS[a.status]}`}>
                      {STATUS_LABELS[a.status]}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
