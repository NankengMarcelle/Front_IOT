"use client";

import {
  Edit3,
  Trash2,
  Thermometer,
  Droplets,
  Wind,
  FlaskConical,
  Activity,
  Cpu
} from "lucide-react";

export default function ParcelCard({ parcel, terrainName, onEdit, onDelete }: any) {
  const stats = {
    azote: parcel.azote || 0,
    phosphore: parcel.phosphore || 0,
    potassium: parcel.potassium || 0,
    humidite: parcel.humidite || 0,
    temperature: parcel.temperature || 0,
    ph: parcel.ph || 0
  };

  const getProgress = (value: number, max: number = 20) => {
    return `${Math.min((value / max) * 100, 100)}%`;
  };

  return (
    <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500">
      {/* Header with Background Gradient */}
      <div className="bg-gradient-to-br from-[#1A4D2E] to-[#0d2a19] p-7 text-white relative h-32 flex flex-col justify-end">
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-md border border-white/5"
            title="Modifier"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-white/10 hover:bg-rose-500 rounded-xl transition-all backdrop-blur-md border border-white/5"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-2xl font-black tracking-tight leading-none mb-1">{parcel.nom}</h3>
          <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-emerald-500/20 rounded-md border border-white/10">{parcel.code || 'PK-01'}</span>
            <span>•</span>
            <span>{parcel.superficie} ha</span>
            <span>•</span>
            <span className="truncate">{terrainName}</span>
          </p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* NPK Grid with refined bars */}
        <div className="grid grid-cols-2 gap-x-10 gap-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic font-serif">N • Azote</span>
              <span className="text-xs font-black text-slate-700">{stats.azote} <span className="text-[10px] text-slate-300">mg/kg</span></span>
            </div>
            <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.3)]" style={{ width: getProgress(stats.azote) }}></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic font-serif">P • Phos.</span>
              <span className="text-xs font-black text-slate-700">{stats.phosphore} <span className="text-[10px] text-slate-300">mg/kg</span></span>
            </div>
            <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(249,115,22,0.3)]" style={{ width: getProgress(stats.phosphore) }}></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic font-serif">K • Potass.</span>
              <span className="text-xs font-black text-slate-700">{stats.potassium} <span className="text-[10px] text-slate-300">mg/kg</span></span>
            </div>
            <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(168,85,247,0.3)]" style={{ width: getProgress(stats.potassium) }}></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Humidité</span>
              <span className="text-xs font-black text-slate-700">{stats.humidite} <span className="text-[10px] text-slate-300">%</span></span>
            </div>
            <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(14,165,233,0.3)]" style={{ width: `${Math.min(stats.humidite, 100)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Temperature & pH with Icons */}
        <div className="flex gap-4 p-4 bg-slate-50/50 rounded-3xl border border-slate-100">
          <div className="flex-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-rose-500">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Temp.</p>
              <p className="text-sm font-black text-slate-800">{stats.temperature}°C</p>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200 self-center"></div>
          <div className="flex-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-teal-500">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">pH Sol</p>
              <p className="text-sm font-black text-slate-800">{stats.ph}</p>
            </div>
          </div>
        </div>

        {/* Prediction Card */}
        <div className="relative group/pred p-6 rounded-[32px] bg-emerald-50/50 border border-emerald-100 flex flex-col items-center text-center overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover/pred:scale-150 transition-all"></div>

          <div className="relative z-10">
            <p className="text-[10px] font-black text-[#1A4D2E] uppercase tracking-[0.2em] mb-2 opacity-60">
              Prédit par Expert IA
            </p>
            <p className="text-3xl font-black text-[#1A4D2E] tracking-tight">
              {parcel.culturePredite || "Maïs"}
            </p>
            {parcel.confiance && (
              <div className="inline-flex items-center gap-1.5 mt-2 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <Activity className="w-3 h-3 text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-600">
                  {parcel.confiance}% Fiabilité
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Hardware Footer */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div className="flex-grow flex flex-wrap gap-1.5">
            {parcel.capteursListe ? (
              parcel.capteursListe.split(',').map((capteur: string, idx: number) => (
                <span
                  key={idx}
                  className="text-[9px] font-black text-slate-500/70 border border-slate-200 px-2 py-0.5 rounded-md hover:border-emerald-200 hover:text-emerald-700 transition-all cursor-default"
                >
                  {capteur.trim()}
                </span>
              ))
            ) : (
              <span className="text-[9px] font-bold text-slate-300 italic">Aucun capteur lié</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}