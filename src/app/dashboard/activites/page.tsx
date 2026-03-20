"use client";
import React from 'react';
import { useTranslation } from '@/providers/TranslationProvider';
import { Calendar, PlusCircle, RefreshCw, Microscope, ChevronRight, Activity, Clock } from "lucide-react";

export default function ActivitesPage() {
  const { t } = useTranslation();
  const activites = [
    { id: 1, type: 'create', icon: <PlusCircle className="text-emerald-500" />, text: "Nouveau terrain 'Exploitation Sud' enregistré", date: "19 Janv 2026", heure: "12:30", color: "bg-emerald-50" },
    { id: 2, type: 'predict', icon: <Microscope className="text-orange-500" />, text: "Diagnostic IA : Maïs recommandé pour 'Parcelle 08'", date: "18 Janv 2026", heure: "09:15", color: "bg-orange-50" },
    { id: 3, type: 'update', icon: <RefreshCw className="text-blue-500" />, text: "Noeud LoRa-X3 assigné à 'Parcelle Nord'", date: "16 Janv 2026", heure: "16:45", color: "bg-blue-50" },
    { id: 4, type: 'alert', icon: <Activity className="text-rose-500" />, text: "Alerte : Humidité faible détectée sur 'Zone B'", date: "15 Janv 2026", heure: "11:20", color: "bg-rose-50" },
  ];

  return (
    <div className="bg-white relative overflow-hidden text-[#052E16] flex-1">
      {/* Premium Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-lime-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-60"></div>
      </div>

      <main className="relative z-10 pt-8 md:pt-12 pb-16 md:pb-24">
        <div className="px-4 md:px-12 py-8 md:py-12 max-w-5xl mx-auto w-full">
          <header className="mb-10 md:mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-600">
                <Clock className="w-6 h-6 md:w-7 h-7" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]">Flux d'<br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-lime-500">Activités.</span></h1>
            </div>
            <p className="text-[#052E16]/40 text-xs md:text-sm font-medium italic">Journal temps-réel des opérations et diagnostics SmartAgro.</p>
          </header>

          <div className="space-y-6 md:space-y-10 relative">
            <div className="absolute left-[23px] md:left-[31px] top-6 bottom-6 w-0.5 bg-emerald-50"></div>

            {activites.map((act) => (
              <div key={act.id} className="flex gap-4 md:gap-8 group animate-fadeIn">
                <div className="relative z-10">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[24px] ${act.color} border border-white shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    {/* Fixed React.cloneElement */}
                    {React.cloneElement(act.icon as React.ReactElement, { className: 'w-5 h-5 md:w-6 md:h-6' })}
                  </div>
                </div>

                <div className="bg-white/50 backdrop-blur-xl p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-emerald-50 shadow-2xl shadow-emerald-900/5 flex-grow group-hover:bg-white group-hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.06)] transition-all flex items-center justify-between">
                  <div className="max-w-[80%]">
                    <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2 opacity-40">
                      <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">{act.date} • {act.heure}</p>
                    </div>
                    <h3 className="text-lg md:text-2xl font-black tracking-tighter text-[#052E16] group-hover:text-emerald-600 transition-colors leading-tight">
                      {act.text}
                    </h3>
                  </div>
                  <button className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl border border-emerald-50 flex items-center justify-center text-emerald-200 group-hover:text-emerald-500 group-hover:border-emerald-200 transition-all shrink-0">
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-10 md:mt-16 py-6 md:py-8 rounded-[32px] md:rounded-[40px] border border-emerald-50 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-50 transition-all text-[#052E16]/30">
            Charger plus d'historique
          </button>
        </div>
      </main>
    </div>
  );
}
