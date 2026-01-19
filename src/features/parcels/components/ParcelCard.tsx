"use client";

import {
  Edit3,
  Trash2,
  Thermometer,
  Droplets,
  FlaskConical,
  Activity,
  Cpu,
  MapPin,
  TrendingUp
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
    <div className="group bg-white rounded-[48px] border border-emerald-50 shadow-sm hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-4 transition-all duration-700 flex flex-col overflow-hidden">
      {/* Visual Header with Overlay */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#052E16] to-[#1A4D2E] z-10 opacity-90 group-hover:opacity-100 transition-opacity"></div>
        <img
          src="/strawberry-field.jpg"
          className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-[4s]"
          alt="Parcel"
        />

        <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/90">
              {parcel.code || 'Unit-Ref'}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all"
                title="Modifier"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-rose-500/50 transition-all font-black"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-black text-white tracking-tighter mb-1">{parcel.nom}</h3>
            <div className="flex items-center gap-2 text-white/60 text-[9px] font-black uppercase tracking-widest">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {terrainName} • {parcel.superficie}ha
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* NPK Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { l: 'Azote', v: stats.azote, c: 'bg-emerald-500', max: 20 },
            { l: 'Phos.', v: stats.phosphore, c: 'bg-orange-500', max: 20 },
            { l: 'Potas.', v: stats.potassium, c: 'bg-purple-500', max: 20 }
          ].map((item, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-[#052E16]/40 uppercase tracking-widest italic font-serif ">{item.l}</span>
                <span className="text-[10px] font-black text-[#052E16]">{item.v}</span>
              </div>
              <div className="w-full bg-slate-50 h-1 rounded-full overflow-hidden">
                <div
                  className={`${item.c} h-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
                  style={{ width: getProgress(item.v, item.max) }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Sensor Matrix */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 bg-emerald-50/50 rounded-3xl border border-emerald-100">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] text-[#052E16]/40 font-black uppercase tracking-widest">Temp Sol</p>
              <p className="text-sm font-black text-[#052E16] tracking-tighter">{stats.temperature}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-emerald-50/50 rounded-3xl border border-emerald-100">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] text-[#052E16]/40 font-black uppercase tracking-widest">Humidité</p>
              <p className="text-sm font-black text-[#052E16] tracking-tighter">{stats.humidite}%</p>
            </div>
          </div>
        </div>

        {/* AI Prediction Hub */}
        <div className="relative group/pred p-8 rounded-[36px] bg-[#F8FAF9] border border-emerald-50 text-center overflow-hidden transition-all hover:bg-emerald-50">
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl transition-transform group-hover/pred:scale-150"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">Crop Predictor AI</p>
            </div>
            <p className="text-4xl font-black text-[#052E16] tracking-tighter drop-shadow-sm leading-none mb-3">
              {parcel.culturePredite || "Maïs"}
            </p>
            {parcel.confiance && (
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                {parcel.confiance}% Fiabilité
              </span>
            )}
          </div>
        </div>

        {/* Hardware Status */}
        <div className="flex items-center gap-4 px-2">
          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-[#052E16]/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="flex flex-wrap gap-2">
            {parcel.capteursListe ? (
              parcel.capteursListe.split(',').map((c: string, i: number) => (
                <span key={i} className="text-[8px] font-black text-[#052E16]/40 uppercase tracking-widest bg-white border border-emerald-50 px-3 py-1 rounded-lg">
                  {c.trim()}
                </span>
              ))
            ) : (
              <span className="text-[8px] font-black text-slate-300 uppercase italic">Stand-alone Zone</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}