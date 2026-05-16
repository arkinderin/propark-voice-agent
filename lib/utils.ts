import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTR(date: Date | string, fmt = "d MMMM yyyy, EEEE HH:mm") {
  return format(new Date(date), fmt, { locale: tr });
}

export function formatPhone(phone: string) {
  const clean = phone.replace(/\D/g, "");
  if (clean.startsWith("90") && clean.length === 12) {
    return `+90 (${clean.slice(2, 5)}) ${clean.slice(5, 8)} ${clean.slice(8, 10)} ${clean.slice(10)}`;
  }
  return phone;
}

export function statusLabel(status: string) {
  const map: Record<string, string> = {
    talep: "Talep",
    onaylandi: "Onaylandı",
    tamamlandi: "Tamamlandı",
    iptal: "İptal",
    gelmedi: "Gelmedi",
  };
  return map[status] ?? status;
}

export function statusColor(status: string) {
  const map: Record<string, string> = {
    talep: "bg-yellow-100 text-yellow-800",
    onaylandi: "bg-green-100 text-green-800",
    tamamlandi: "bg-blue-100 text-blue-800",
    iptal: "bg-red-100 text-red-800",
    gelmedi: "bg-gray-100 text-gray-800",
  };
  return map[status] ?? "bg-gray-100 text-gray-800";
}
