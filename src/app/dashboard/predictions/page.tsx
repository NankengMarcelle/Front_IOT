"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parcelService } from "@/features/parcels/services/parcelService";
import { predictionService } from "@/features/predictions/services/predictionService";
import { useTranslation } from "@/providers/TranslationProvider";
import { BrainCircuit, CheckCircle, Loader2, Sparkles, Sprout, MapPin, ChevronRight, BarChart3 } from "lucide-react";

export default function PredictionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialParcelId = searchParams.get('parcelId');
  const { t } = useTranslation();
  const [parcelles, setParcelles] = useState<any[]>([]);
  const [selectedParcelId, setSelectedParcelId] = useState("");
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSelectParcel = async (id: string) => {
    if (selectedParcelId === id) {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      return;
    }
    setSelectedParcelId(id);
    setIsApplied(false);
    setPrediction(null);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);

    setLoading(true);
    try {
      const result = await predictionService.getPrediction(id);
      setPrediction(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadParcelles = async () => {
      try {
        const data: any = await parcelService.getParcelles();
        setParcelles(data);

        // Auto-select and trigger prediction if parcelId is in URL
        if (initialParcelId && data.find((p: any) => String(p.id) === initialParcelId)) {
          handleSelectParcel(initialParcelId);
        }
      } catch (error) {
        console.error("Erreur chargement", error);
      }
    };
    loadParcelles();
  }, [initialParcelId]);

  const handleApply = async () => {
    if (!selectedParcelId || !prediction) return;
    try {
      await predictionService.applyCulture(selectedParcelId, prediction.culture);
      setIsApplied(true);
      setTimeout(() => router.push("/dashboard/parcelles"), 1500);
    } catch (error) {
      alert("Erreur lors de l'enregistrement.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-lime-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-60"></div>
      </div>

      <div className="flex relative z-10 pt-0 h-[calc(100vh-96px)]">
        {/* SIDEBAR - Elite Glassmorphism */}
        <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} fixed lg:relative z-[60] lg:z-10 w-full max-w-[320px] md:max-w-96 bg-white/70 lg:bg-white/40 backdrop-blur-3xl border-r border-emerald-50 flex flex-col h-full shadow-2xl transition-transform duration-500`}>
          <div className="p-8 md:p-10 pb-6 border-b border-emerald-50/50 flex items-center justify-between">
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#052E16]/30 mb-2">Analyser une</h2>
              <h1 className="text-2xl md:text-3xl font-black text-[#052E16] tracking-tighter leading-none">Parcelle.</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar">
            {parcelles.length > 0 ? (
              parcelles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectParcel(p.id)}
                  className={`w-full text-left p-4 md:p-6 rounded-[24px] md:rounded-[32px] transition-all flex items-center gap-4 group ${selectedParcelId === p.id
                    ? "bg-[#052E16] text-white shadow-2xl shadow-emerald-900/40"
                    : "hover:bg-white/60 border border-transparent hover:border-emerald-50"
                    }`}
                >
                  <div className={`p-3 rounded-2xl transition-colors ${selectedParcelId === p.id ? "bg-lime-400 text-[#052E16]" : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
                    }`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-black tracking-tight truncate ${selectedParcelId === p.id ? "text-white" : "text-[#052E16]"}`}>
                      {p.nom}
                    </p>
                    {p.culturePredite && (
                      <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${selectedParcelId === p.id ? "text-lime-400/70" : "text-[#052E16]/30"}`}>
                        {p.culturePredite}
                      </p>
                    )}
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform ${selectedParcelId === p.id ? "text-lime-400 translate-x-0" : "text-[#052E16]/10 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                </button>
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                <Loader2 className="w-8 h-8 text-emerald-200 animate-spin mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest text-[#052E16]/20">Initialisation...</p>
              </div>
            )}
          </div>
        </aside>

        {/* MOBILE OVERLAY */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[55] bg-emerald-950/20 backdrop-blur-sm lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 custom-scrollbar bg-transparent relative">
          <div className="max-w-4xl mx-auto w-full">
            <header className="mb-12 md:mb-20">
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                <div className="flex items-center gap-4 md:gap-5">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-[#052E16] border border-emerald-50"
                  >
                    <BarChart3 className="w-5 h-5" />
                  </button>
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-[24px] shadow-xl flex items-center justify-center text-orange-500 border border-orange-50">
                    <BrainCircuit size={32} />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#052E16] tracking-tighter leading-[0.9]">
                    Diagnostic <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-400">Prédictif.</span>
                  </h1>
                  <p className="text-[#052E16]/40 text-sm md:text-lg font-medium italic mt-2">Optimisation biométrique des cultures par IA.</p>
                </div>
              </div>
            </header>

            {/* Prediction Result Display */}
            <div className="relative min-h-[400px] md:min-h-[500px]">
              {loading ? (
                <div className="bg-white/40 backdrop-blur-3xl rounded-[32px] md:rounded-[48px] p-12 md:p-24 text-center border border-white shadow-2xl shadow-emerald-900/5">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 rounded-2xl md:rounded-[28px] flex items-center justify-center mx-auto mb-8">
                    <Loader2 className="w-8 md:w-10 md:h-10 text-emerald-600 animate-spin" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-[#052E16] tracking-tighter animate-pulse">{t('predictions.calculating')}</h3>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#052E16]/30 mt-2">Analyse des données biométriques en cours</p>
                </div>
              ) : prediction ? (
                <div className="bg-white/60 backdrop-blur-3xl rounded-[40px] md:rounded-[64px] p-8 md:p-12 lg:p-20 shadow-2xl shadow-emerald-900/5 border border-white animate-fadeIn relative overflow-hidden group">
                  {/* Result Glow */}
                  <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-lime-400/10 rounded-full blur-[80px] md:blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                  <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                    <div className="w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-48 bg-gradient-to-br from-[#1A4D2E] to-emerald-800 rounded-[32px] md:rounded-[48px] shadow-2xl flex items-center justify-center text-white shrink-0 group-hover:rotate-6 transition-transform duration-700 mx-auto md:mx-0">
                      <Sprout size={80} className="text-lime-400" />
                    </div>

                    <div className="flex-1 space-y-6 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-3 text-emerald-600">
                        <Sparkles size={18} className="animate-pulse" />
                        <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] font-black">{t('predictions.recommended_culture')}</span>
                      </div>

                      <h2 className="text-5xl md:text-6xl lg:text-8xl font-black text-[#052E16] tracking-tighter leading-none italic">{prediction.culture}</h2>

                      <div className="py-6 md:py-8 px-6 md:px-10 bg-[#052E16]/5 rounded-[24px] md:rounded-[32px] border border-emerald-50 relative">
                        <p className="text-[#052E16] text-lg md:text-xl font-medium leading-relaxed italic tracking-tight">
                          "{prediction.raison}"
                        </p>
                      </div>

                      {/* Top 3 Predictions */}
                      {prediction.mlDetails?.top3_global && prediction.mlDetails.top3_global.length > 0 && (
                        <div className="mt-8 space-y-4">
                          <h3 className="text-sm md:text-md font-black text-[#052E16] uppercase tracking-widest flex items-center gap-2">
                            <BrainCircuit className="w-5 h-5 text-emerald-600" />
                            Alternatives (Top 3)
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {prediction.mlDetails.top3_global.map((item: any, idx: number) => (
                              <div
                                key={idx}
                                className={`bg-white rounded-[24px] p-5 shadow-sm border ${idx === 0 ? 'border-lime-400' : 'border-emerald-50'} hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group/card relative overflow-hidden`}
                                onClick={() => {
                                  if (prediction) {
                                    setPrediction({
                                      ...prediction,
                                      culture: item.culture,
                                      raison: prediction.detailedJustifications?.[item.culture] || prediction.raison
                                    });
                                  }
                                }}
                              >
                                {idx === 0 && (
                                  <div className="absolute top-0 right-0 w-16 h-16 bg-lime-400/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                                )}
                                <div className="flex justify-between items-start mb-3 relative z-10">
                                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${idx === 0 ? 'bg-lime-100 text-lime-700' : 'bg-slate-100 text-slate-500'}`}>
                                    Rang {item.rang || (idx + 1)}
                                  </span>
                                  <span className="text-sm font-black text-emerald-600">
                                    {Math.round(item.confiance_agregee || item.confiance || 0)}%
                                  </span>
                                </div>
                                <h4 className="text-xl font-black text-[#052E16] tracking-tight mb-2 relative z-10">{item.culture}</h4>
                                {prediction.detailedJustifications?.[item.culture] && (
                                  <p className="text-xs text-[#052E16]/60 line-clamp-3 relative z-10">
                                    {prediction.detailedJustifications[item.culture]}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-8 md:pt-10">
                        <button
                          onClick={handleApply}
                          disabled={isApplied}
                          className={`w-full py-6 md:py-8 rounded-[24px] md:rounded-[32px] font-black text-lg md:text-xl uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-4 ${isApplied
                            ? "bg-lime-400 text-[#052E16] scale-95"
                            : "bg-[#052E16] text-white hover:bg-emerald-800 hover:-translate-y-2 active:scale-95 shadow-emerald-900/40"
                            }`}
                        >
                          {isApplied ? (
                            <> <CheckCircle size={32} /> {t('predictions.applied_success')} </>
                          ) : (
                            <>
                              <BarChart3 size={24} className="text-lime-400" />
                              {t('predictions.confirm_culture')}
                            </>
                          )}
                        </button>
                        {isApplied && (
                          <p className="text-center mt-6 text-[10px] font-black uppercase tracking-widest text-[#052E16]/30 animate-pulse">Redirection vers vos parcelles...</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-4 border-dashed border-emerald-100 rounded-[40px] md:rounded-[64px] p-20 md:p-40 text-center bg-white/5 backdrop-blur-sm group hover:border-emerald-300 transition-colors">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 rounded-2xl md:rounded-[28px] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                    <BrainCircuit size={40} className="text-emerald-200 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-[#052E16] tracking-tighter opacity-20">{t('predictions.select_zone_message')}</h3>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#052E16]/10 mt-2">Cliquez sur une parcelle dans le menu latéral</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
