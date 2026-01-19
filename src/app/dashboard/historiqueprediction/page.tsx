"use client";

import { useState, useEffect } from "react";
import { recommendationService } from "@/features/recommendations/services/recommendationService";
import { parcelService } from "@/features/parcels/services/parcelService";
import { terrainService } from "@/features/terrains/services/terrainService";
import { useTranslation } from "@/providers/TranslationProvider";
import { History, Calendar, MapPin, ChevronRight, Search } from "lucide-react";

export default function PredictionsListPage() {
    const { t } = useTranslation();
    const [predictions, setPredictions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPredictions = async () => {
            setLoading(true);
            try {
                await terrainService.getTerrains();
                const parcelles: any = await parcelService.getParcelles();
                const history: any = await recommendationService.getRecommendationsHistory();

                const mappedList = history.map((rec: any) => {
                    const parcel = parcelles.find((p: any) => p.id === rec.parcelle_id);
                    return {
                        id: rec.id,
                        nomParcelle: parcel?.nom || "Zone Indéterminée",
                        culture: rec.culture_predite || "Inconnu",
                        date: new Date(rec.created_at).toLocaleDateString(t('welcome.lang') === 'FR' ? 'fr-FR' : 'en-US', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        })
                    };
                });

                setPredictions(mappedList);
            } catch (error) {
                console.error("Erreur chargement prédictions:", error);
            } finally {
                setLoading(false);
            }
        };

        loadPredictions();
    }, [t]);

    return (
        <div className="min-h-screen bg-white relative overflow-hidden text-[#052E16]">
            {/* Premium Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-lime-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-60"></div>
            </div>

            <main className="relative z-10 pt-8 md:pt-12 pb-16 md:pb-24">
                <div className="px-4 md:px-12 py-8 md:py-12 max-w-7xl mx-auto w-full">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-10 md:mb-16">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full mb-4 border border-emerald-100">
                                <History className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-800 text-[10px] font-black uppercase tracking-widest">Logs Historiques</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]">
                                Archives de<br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-lime-500">Prédiction.</span>
                            </h1>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 w-full md:w-auto">
                            <div className="text-right">
                                <p className="text-[#052E16]/40 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">Total Analyses</p>
                                <p className="text-3xl md:text-4xl font-black tracking-tighter leading-none">{predictions.length}</p>
                            </div>
                            <div className="w-px h-10 md:h-12 bg-emerald-100"></div>
                            <button className="w-12 h-12 md:w-14 md:h-14 bg-white border border-emerald-50 rounded-xl md:rounded-[20px] flex items-center justify-center text-[#052E16] hover:bg-emerald-50 transition-all shadow-sm">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-4 md:space-y-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-24 md:h-28 bg-white/50 rounded-[28px] md:rounded-[40px] animate-pulse border border-emerald-50 shadow-sm" />
                            ))}
                        </div>
                    ) : predictions.length === 0 ? (
                        <div className="bg-white/50 backdrop-blur-xl rounded-[32px] md:rounded-[64px] border-2 border-dashed border-emerald-100 py-16 md:py-32 flex flex-col items-center justify-center text-center px-6 shadow-sm">
                            <History className="w-16 h-16 md:w-20 md:h-20 text-emerald-100 mb-6 md:mb-8" />
                            <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-4 px-4 text-balance">Aucune archive disponible</h3>
                            <p className="text-[#052E16]/40 max-w-sm font-medium text-sm md:text-base px-6">Les résultats de vos consultations IA apparaîtront ici automatiquement après chaque cycle d'analyse.</p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Layout: Card List */}
                            <div className="md:hidden space-y-4">
                                {predictions.map((item) => (
                                    <div key={item.id} className="bg-white p-6 rounded-[28px] border border-emerald-50 shadow-sm flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                                                <Calendar className="w-3 h-3 text-emerald-500" />
                                                <span className="text-[10px] font-black text-[#052E16]/60">{item.date}</span>
                                            </div>
                                            <button className="w-8 h-8 rounded-lg border border-emerald-50 flex items-center justify-center text-emerald-300">
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-black tracking-tight text-[#052E16]">{item.nomParcelle}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{item.culture}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Layout: Table */}
                            <div className="hidden md:block bg-white/50 backdrop-blur-2xl rounded-[48px] lg:rounded-[64px] border border-emerald-50 shadow-2xl shadow-emerald-900/5 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-emerald-50/30 border-b border-emerald-50">
                                                <th className="px-8 lg:px-12 py-6 lg:py-8 text-[9px] lg:text-[10px] font-black text-[#052E16]/40 uppercase tracking-[0.2em]">Diagnostic Date</th>
                                                <th className="px-8 lg:px-12 py-6 lg:py-8 text-[9px] lg:text-[10px] font-black text-[#052E16]/40 uppercase tracking-[0.2em]">Unité de Culture</th>
                                                <th className="px-8 lg:px-12 py-6 lg:py-8 text-[9px] lg:text-[10px] font-black text-[#052E16]/40 uppercase tracking-[0.2em]">Culture Optimale</th>
                                                <th className="px-8 lg:px-12 py-6 lg:py-8 text-[9px] lg:text-[10px] font-black text-[#052E16]/40 uppercase tracking-[0.2em]"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-emerald-50/50">
                                            {predictions.map((item) => (
                                                <tr key={item.id} className="group hover:bg-white transition-all">
                                                    <td className="px-8 lg:px-12 py-8 lg:py-10">
                                                        <div className="flex items-center gap-3">
                                                            <Calendar className="w-4 h-4 text-emerald-400" />
                                                            <span className="text-xs lg:text-sm font-black text-[#052E16]/60">{item.date}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 lg:px-12 py-8 lg:py-10">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-[#052E16] group-hover:text-white transition-all">
                                                                <MapPin className="w-5 h-5" />
                                                            </div>
                                                            <p className="font-black text-xl tracking-tight text-[#052E16]">
                                                                {item.nomParcelle}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 lg:px-12 py-8 lg:py-10">
                                                        <div className="inline-flex items-center gap-3 bg-emerald-50 px-5 py-2.5 rounded-full border border-emerald-100 group-hover:bg-[#052E16] group-hover:border-[#052E16] transition-all">
                                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                                            <span className="font-black text-[10px] uppercase tracking-widest text-emerald-700 group-hover:text-white transition-colors">{item.culture}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 lg:px-12 py-8 lg:py-10 text-right">
                                                        <button className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl border border-emerald-50 flex items-center justify-center text-emerald-200 group-hover:text-emerald-500 group-hover:border-emerald-200 transition-all ml-auto">
                                                            <ChevronRight className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}