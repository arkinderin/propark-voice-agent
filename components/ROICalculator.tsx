"use client";

import { useState, useMemo } from "react";
import { TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const AVG_SERVICE_OPTIONS = [
  { label: "₺800 (lazer tek bölge)", value: 800 },
  { label: "₺1.500 (botoks / dolgu)", value: 1500 },
  { label: "₺2.500 (kombine paket)", value: 2500 },
  { label: "₺4.000 (premium paket)", value: 4000 },
];

export default function ROICalculator() {
  const [missedCalls, setMissedCalls] = useState(30);
  const [convRate, setConvRate] = useState(40);
  const [avgService, setAvgService] = useState(1500);

  const { monthlyLoss, yearlyLoss, recoveredRevenue, roiMultiple } = useMemo(() => {
    const potentialPatients = (missedCalls * convRate) / 100;
    const monthlyLoss = Math.round(potentialPatients * avgService);
    const yearlyLoss = monthlyLoss * 12;
    const recoveredRevenue = Math.round(monthlyLoss * 0.75);
    const planCost = 7900;
    const roiMultiple = Math.round((recoveredRevenue / planCost) * 10) / 10;
    return { monthlyLoss, yearlyLoss, recoveredRevenue, roiMultiple };
  }, [missedCalls, convRate, avgService]);

  const fmt = (n: number) =>
    n.toLocaleString("tr-TR") + " ₺";

  return (
    <section className="py-24 px-4 bg-white/[0.015] border-y border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-widest mb-3">ROI Hesaplayıcı</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Kaçan her arama ne kadara mal oluyor?
          </h2>
          <p className="text-slate-400 mt-3 max-w-lg mx-auto">
            Gerçek rakamlarla görün. Çoğu klinik ilk ayda yatırımını kurtarıyor.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6">
            {/* Missed calls */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-slate-300 font-medium">
                  Aylık kaçan arama sayısı
                </label>
                <span className="text-indigo-400 font-bold text-sm">{missedCalls} arama</span>
              </div>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={missedCalls}
                onChange={(e) => setMissedCalls(Number(e.target.value))}
                className="w-full accent-indigo-500 h-2 rounded-full"
              />
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>5</span>
                <span>200</span>
              </div>
            </div>

            {/* Conversion rate */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-slate-300 font-medium">
                  Konsültasyona dönüşüm oranı
                </label>
                <span className="text-indigo-400 font-bold text-sm">%{convRate}</span>
              </div>
              <input
                type="range"
                min={10}
                max={80}
                step={5}
                value={convRate}
                onChange={(e) => setConvRate(Number(e.target.value))}
                className="w-full accent-indigo-500 h-2 rounded-full"
              />
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>%10</span>
                <span>%80</span>
              </div>
            </div>

            {/* Avg service price */}
            <div>
              <label className="text-sm text-slate-300 font-medium block mb-2">
                Ortalama hizmet değeri
              </label>
              <div className="grid grid-cols-2 gap-2">
                {AVG_SERVICE_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => setAvgService(o.value)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition text-left ${
                      avgService === o.value
                        ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300"
                        : "bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/15"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-4">
            <div className="bg-rose-500/8 border border-rose-500/20 rounded-2xl p-5">
              <p className="text-xs text-rose-400 font-medium uppercase tracking-wider mb-1">Aylık Potansiyel Kayıp</p>
              <div className="text-4xl font-black text-white">{fmt(monthlyLoss)}</div>
              <p className="text-slate-500 text-xs mt-1.5">
                Yıllık: <span className="text-rose-400 font-semibold">{fmt(yearlyLoss)}</span>
              </p>
            </div>

            <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-2xl p-5">
              <p className="text-xs text-emerald-400 font-medium uppercase tracking-wider mb-1">Operexo ile Geri Kazanılacak Gelir</p>
              <div className="text-4xl font-black text-white">{fmt(recoveredRevenue)}<span className="text-slate-500 text-lg font-normal">/ay</span></div>
              <p className="text-slate-500 text-xs mt-1.5">
                %75 geri kazanım varsayımıyla
              </p>
            </div>

            <div className="bg-indigo-500/8 border border-indigo-500/20 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-indigo-400 font-medium uppercase tracking-wider mb-1">ROI Çarpanı</p>
                <div className="text-3xl font-black text-white">{roiMultiple}x</div>
                <p className="text-slate-500 text-xs mt-1">Solo Klinik planı bazında</p>
              </div>
              <TrendingUp size={36} className="text-indigo-400/30" />
            </div>

            <Link
              href="/kayit"
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition text-sm"
            >
              14 Gün Ücretsiz Dene
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
