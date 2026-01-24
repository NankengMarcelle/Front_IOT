"use client";

import { useState, useEffect } from "react";
import { DonnEsDeCapteursService, ParcellesService, RecommandationsService } from "@/lib";
import { parcelService } from "@/features/parcels/services/parcelService";
import {
    History,
    Search,
    Filter,
    MapPin,
    Calendar,
    Thermometer,
    Droplets,
    Activity,
    ChevronRight,
    RefreshCw,
    Sparkles,
    RadioTower
} from "lucide-react";
import { useTranslation } from "@/providers/TranslationProvider";

export default function HistoriquePredictionPage() {
    const { t } = useTranslation();
    const [measurements, setMeasurements] = useState<any[]>([]);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [parcelles, setParcelles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<'measurements' | 'predictions'>('measurements');

    const ensureArray = (data: any) => {
        if (Array.isArray(data)) return data;
        if (data && typeof data === 'object' && Array.isArray(data.data)) return data.data;
        return [];
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const [measurementsRaw, parcellesData, recommendationsRaw] = await Promise.all([
                DonnEsDeCapteursService.getAllMeasurementsApiV1SensorDataSensorDataGet(),
                parcelService.getParcelles(),
                RecommandationsService.getAllRecommendationsApiV1RecommendationsGet()
            ]);

            const measurementsData = ensureArray(measurementsRaw);
            const recommendationsData = ensureArray(recommendationsRaw);

            setParcelles(parcellesData);
            setRecommendations(recommendationsData.sort((a: any, b: any) =>
                new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
            ));
            setMeasurements(measurementsData.sort((a: any, b: any) =>
                new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
            ));
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const getParcelleName = (parcelleId: string | number) => {
        const p = parcelles.find(p => String(p.id) === String(parcelleId));
        return p ? p.nom : "Parcelle Inconnue";
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredData = activeTab === 'measurements'
        ? measurements.filter(m =>
            getParcelleName(m.parcelle_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.capteur_id?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : recommendations.filter(r =>
            getParcelleName(r.parcelle_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.titre?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-lime-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-60"></div>
            </div>

            <main className="relative z-10 pt-0">
                <div className="px-4 md:px-12 py-8 md:py-12 max-w-7xl mx-auto w-full">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-10 md:mb-16">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full mb-4 border border-emerald-100">
                                <History className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-800 text-[10px] font-black uppercase tracking-widest">Logs de Transmission</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]">
                                Historique<br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-lime-500">Global.</span>
                            </h1>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <div className="relative group flex-grow sm:flex-grow-0">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Chercher..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-white border border-emerald-50 rounded-xl md:rounded-[20px] pl-12 pr-6 py-3.5 md:py-4 text-sm font-medium outline-none focus:border-emerald-500 focus:shadow-xl transition-all w-full sm:w-64 shadow-sm"
                                />
                            </div>
                            <button
                                onClick={loadData}
                                className="bg-[#052E16] text-white p-4 md:p-5 rounded-xl md:rounded-[24px] font-black hover:rotate-180 transition-all shadow-2xl active:scale-95"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setActiveTab('measurements')}
                            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'measurements' ? 'bg-[#052E16] text-white' : 'bg-emerald-50 text-[#052E16] opacity-40 hover:opacity-100'}`}
                        >
                            <RadioTower size={14} /> Mesures
                        </button>
                        <button
                            onClick={() => setActiveTab('predictions')}
                            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'predictions' ? 'bg-[#052E16] text-white' : 'bg-emerald-50 text-[#052E16] opacity-40 hover:opacity-100'}`}
                        >
                            <Sparkles size={14} /> Prédictions
                        </button>
                    </div>

                    {/* List/Table */}
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-24 bg-white/50 rounded-3xl animate-pulse border border-emerald-50" />
                            ))}
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="bg-white/50 backdrop-blur-xl rounded-[48px] border-2 border-dashed border-emerald-100 py-24 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-emerald-50 rounded-[28px] flex items-center justify-center mb-6 shadow-inner">
                                <History className="w-10 h-10 text-emerald-200" />
                            </div>
                            <h3 className="text-2xl font-black text-[#052E16] tracking-tighter mb-2">Aucune donnée trouvée</h3>
                            <p className="text-[#052E16]/40 max-w-sm font-medium">Les données s'afficheront ici dès qu'elles seront disponibles.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {activeTab === 'measurements' ? (
                                filteredData.map((m) => (
                                    <div key={m.id} className="group bg-white/80 backdrop-blur-xl p-6 rounded-[32px] border border-emerald-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6">

                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-[#052E16] rounded-2xl flex flex-col items-center justify-center text-white">
                                                <Calendar className="w-4 h-4 text-lime-400 mb-0.5" />
                                                <span className="text-[10px] font-black leading-none">{new Date(m.created_at).getDate()}</span>
                                                <span className="text-[7px] font-black uppercase opacity-60 tracking-tighter">{new Date(m.created_at).toLocaleString('fr', { month: 'short' })}</span>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase tracking-widest rounded-md border border-emerald-100">
                                                        ID: {m.capteur_id?.substring(0, 8)}...
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-bold">•</span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{formatDate(m.created_at)}</span>
                                                </div>
                                                <h4 className="text-xl font-black text-[#052E16] tracking-tight">{getParcelleName(m.parcelle_id)}</h4>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 md:gap-8 flex-grow max-w-2xl px-2">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-[#052E16]/30 uppercase text-[8px] font-black tracking-widest">
                                                    <Thermometer className="w-3 h-3 text-rose-500" /> Temper.
                                                </div>
                                                <p className="text-sm font-black text-[#052E16]">{m.temperature}°C</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-[#052E16]/30 uppercase text-[8px] font-black tracking-widest">
                                                    <Droplets className="w-3 h-3 text-sky-500" /> Humid.
                                                </div>
                                                <p className="text-sm font-black text-[#052E16]">{m.humidity}%</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-[#052E16]/30 uppercase text-[8px] font-black tracking-widest">
                                                    <Activity className="w-3 h-3 text-emerald-500" /> Azote (N)
                                                </div>
                                                <p className="text-sm font-black text-[#052E16]">{m.azote}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-[#052E16]/30 uppercase text-[8px] font-black tracking-widest">
                                                    <Activity className="w-3 h-3 text-orange-500" /> Phos. (P)
                                                </div>
                                                <p className="text-sm font-black text-[#052E16]">{m.phosphore}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-[#052E16]/30 uppercase text-[8px] font-black tracking-widest">
                                                    <Activity className="w-3 h-3 text-purple-500" /> Potas. (K)
                                                </div>
                                                <p className="text-sm font-black text-[#052E16]">{m.potassium}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-[#052E16]/30 uppercase text-[8px] font-black tracking-widest">
                                                    <Activity className="w-3 h-3 text-amber-500" /> pH Sol
                                                </div>
                                                <p className="text-sm font-black text-[#052E16]">{m.ph}</p>
                                            </div>
                                        </div>

                                        <button className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#052E16]/20 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all self-end md:self-center">
                                            <ChevronRight size={20} />
                                        </button>

                                    </div>
                                ))
                            ) : (
                                filteredData.map((r) => (
                                    <div key={r.id} className="group bg-white/80 backdrop-blur-xl p-6 rounded-[32px] border border-emerald-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6">

                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex flex-col items-center justify-center text-white">
                                                <Sparkles className="w-5 h-5 text-lime-400" />
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{getParcelleName(r.parcelle_id)}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold">•</span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{formatDate(r.created_at)}</span>
                                                </div>
                                                <h4 className="text-xl font-black text-[#052E16] tracking-tight">{r.titre}</h4>
                                            </div>
                                        </div>

                                        <div className="flex-grow max-w-xl">
                                            <p className="text-sm font-medium text-[#052E16]/60 line-clamp-2 leading-relaxed">
                                                {r.description}
                                            </p>
                                        </div>

                                        <button className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 self-end md:self-center">
                                            <ChevronRight size={20} />
                                        </button>

                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}