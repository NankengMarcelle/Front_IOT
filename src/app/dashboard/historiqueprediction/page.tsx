"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DonnEsDeCapteursService } from "@/lib";
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
    RadioTower
} from "lucide-react";
import { useTranslation } from "@/providers/TranslationProvider";

export default function HistoriquePredictionPage() {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") || "";
    const [measurements, setMeasurements] = useState<any[]>([]);
    const [parcelles, setParcelles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(initialSearch);

    const ensureArray = (data: any) => {
        if (Array.isArray(data)) return data;
        if (data && typeof data === 'object' && Array.isArray(data.data)) return data.data;
        return [];
    };

    const loadData = async () => {
        try {
            setLoading(true);
            // 1. Récupérer les parcelles de l'utilisateur
            const parcellesData = await parcelService.getParcelles();
            setParcelles(parcellesData);

            if (parcellesData.length === 0) {
                setMeasurements([]);
                return;
            }

            // 2. Pour chaque parcelle, récupérer les mesures
            const allMeasurementsPromises = parcellesData.map(p =>
                DonnEsDeCapteursService.getMeasurementsByParcelleApiV1SensorDataSensorDataParcelleParcelleIdGet(
                    String(p.id),
                    0,
                    50 // On récupère un nombre raisonnable par parcelle
                ).catch(err => {
                    console.error(`Error fetching measurements for parcel ${p.id}:`, err);
                    return [];
                })
            );

            const measurementsResults = await Promise.all(allMeasurementsPromises);

            // 3. Aplatir et agréger toutes les mesures
            const aggregatedMeasurements: any[] = [];
            measurementsResults.forEach(res => {
                const data = ensureArray(res);
                aggregatedMeasurements.push(...data);
            });

            // 4. Trier par date décroissante et limiter les résultats globaux
            setMeasurements(aggregatedMeasurements.sort((a: any, b: any) =>
                new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
            ).slice(0, 50));

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
        return p ? p.nom : t('history.unknown_parcel');
    };

    const formatDate = (dateStr: string) => {
        const locale = t('welcome.lang') === 'FR' ? 'fr-FR' : 'en-US';
        return new Date(dateStr).toLocaleDateString(locale, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredData = measurements.filter(m =>
        getParcelleName(m.parcelle_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.capteur_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (parcelles.find(p => String(p.id) === String(m.parcelle_id))?.code || '').toLowerCase().includes(searchTerm.toLowerCase())
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
                                <span className="text-emerald-800 text-[10px] font-black uppercase tracking-widest">{t('history.transmission_logs')}</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]">
                                {t('history.title')}<br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-lime-500">{t('history.global_title')}</span>
                            </h1>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <div className="relative group flex-grow sm:flex-grow-0">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder={t('history.search_placeholder')}
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

                    {/* Section Label */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="p-2 bg-[#052E16] text-white rounded-lg">
                            <RadioTower size={14} />
                        </div>
                        <h2 className="font-black text-[10px] uppercase tracking-[0.2em] text-[#052E16] opacity-60">
                            {t('history.measurements')}
                        </h2>
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
                            <h3 className="text-2xl font-black text-[#052E16] tracking-tighter mb-2">{t('history.no_data_found')}</h3>
                            <p className="text-[#052E16]/40 max-w-sm font-medium">{t('history.no_data_desc')}</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredData.map((m) => (
                                <div key={m.id} className="group bg-white/80 backdrop-blur-xl p-6 rounded-[32px] border border-emerald-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6">

                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-[#052E16] rounded-2xl flex flex-col items-center justify-center text-white">
                                            <Calendar className="w-4 h-4 text-lime-400 mb-0.5" />
                                            <span className="text-[10px] font-black leading-none">{new Date(m.created_at).getDate()}</span>
                                            <span className="text-[7px] font-black uppercase opacity-60 tracking-tighter">{new Date(m.created_at).toLocaleString(t('welcome.lang') === 'FR' ? 'fr' : 'en', { month: 'short' })}</span>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase tracking-widest rounded-md border border-emerald-100">
                                                    ID: {m.capteur_id?.substring(0, 8)}...
                                                </span>
                                                <span className="px-2 py-0.5 bg-lime-50 text-lime-700 text-[8px] font-black uppercase tracking-widest rounded-md border border-lime-100">
                                                    Code: {parcelles.find(p => String(p.id) === String(m.parcelle_id))?.code || 'N/A'}
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
                                                <Thermometer className="w-3 h-3 text-rose-500" /> {t('history.temperature_label')}
                                            </div>
                                            <p className="text-sm font-black text-[#052E16]">{m.temperature}°C</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[#052E16]/30 uppercase text-[8px] font-black tracking-widest">
                                                <Droplets className="w-3 h-3 text-sky-500" /> {t('history.humidity_label')}
                                            </div>
                                            <p className="text-sm font-black text-[#052E16]">{m.humidity}%</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[#052E16]/30 uppercase text-[8px] font-black tracking-widest">
                                                <Activity className="w-3 h-3 text-emerald-500" /> {t('history.nitrogen_label')}
                                            </div>
                                            <p className="text-sm font-black text-[#052E16]">{m.azote}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[#052E16]/30 uppercase text-[8px] font-black tracking-widest">
                                                <Activity className="w-3 h-3 text-orange-500" /> {t('history.phosphorus_label')}
                                            </div>
                                            <p className="text-sm font-black text-[#052E16]">{m.phosphore}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[#052E16]/30 uppercase text-[8px] font-black tracking-widest">
                                                <Activity className="w-3 h-3 text-purple-500" /> {t('history.potassium_label')}
                                            </div>
                                            <p className="text-sm font-black text-[#052E16]">{m.potassium}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[#052E16]/30 uppercase text-[8px] font-black tracking-widest">
                                                <Activity className="w-3 h-3 text-amber-500" /> {t('history.ph_label')}
                                            </div>
                                            <p className="text-sm font-black text-[#052E16]">{m.ph}</p>
                                        </div>
                                    </div>

                                    <button className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#052E16]/20 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all self-end md:self-center">
                                        <ChevronRight size={20} />
                                    </button>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
