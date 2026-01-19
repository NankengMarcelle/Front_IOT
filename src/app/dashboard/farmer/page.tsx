"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { terrainService } from "@/features/terrains/services/terrainService";
import { parcelService } from "@/features/parcels/services/parcelService";
import { useTranslation } from "@/providers/TranslationProvider";
import {
  LayoutGrid,
  Map as MapIcon,
  BrainCircuit,
  Lightbulb,
  ArrowRight,
  Activity,
  ChevronRight,
  TrendingUp,
  Droplets,
  Thermometer,
  CloudSun
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function FarmerDashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const [terrains, setTerrains] = useState<any[]>([]);
  const [parcelles, setParcelles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        const terrainData: any = await terrainService.getTerrains();
        setTerrains(terrainData);
        const parcellesData = await parcelService.getParcelles();
        setParcelles(parcellesData);
      } catch (error) {
        console.error("Erreur de chargement:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  const stats = useMemo(() => ({
    nbTerrains: terrains.length,
    nbParcelles: parcelles.length,
    precision: 99.8,
    activeSensors: 12
  }), [terrains, parcelles]);

  const soilTrendData = [
    { month: "Jan", N: 35, P: 28, K: 42 },
    { month: "Fév", N: 38, P: 30, K: 45 },
    { month: "Mar", N: 42, P: 32, K: 48 },
    { month: "Avr", N: 45, P: 35, K: 50 },
    { month: "Mai", N: 48, P: 38, K: 52 },
    { month: "Juin", N: 50, P: 40, K: 55 }
  ];

  const parcellePerformance = [
    { id: 1, name: "Parcelle A", area: 5, crop: "Maïs", fertilityScore: 85, badge: "Optimal", color: "text-emerald-600", bg: "bg-emerald-50" },
    { id: 2, name: "Parcelle B", area: 3.5, crop: "Blé", fertilityScore: 72, badge: "Attention", color: "text-amber-600", bg: "bg-amber-50" },
    { id: 3, name: "Parcelle C", area: 2.5, crop: "Soja", fertilityScore: 91, badge: "Elite", color: "text-lime-600", bg: "bg-lime-50" }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Premium Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-lime-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-60"></div>
      </div>

      <main className="relative z-10 pt-0">
        {/* Welcome Header */}
        <div className="px-4 md:px-6 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8 md:mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full mb-4 border border-emerald-100">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <span className="text-emerald-800 text-[10px] font-black uppercase tracking-widest">Live Dashboard</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-[#052E16] tracking-tighter leading-[0.9]">
                Bonjour,<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-lime-500">Cultivons Plus.</span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-emerald-50 rounded-[20px] md:rounded-[24px] border border-emerald-100 hover:bg-emerald-100 transition-all group">
                <Activity className="w-5 h-5 text-emerald-600 group-hover:rotate-12 transition-transform" />
                <span className="text-[#052E16] font-black text-[10px] uppercase tracking-widest">Statistiques PDF</span>
              </button>
            </div>
          </div>

          {/* Metric Grid - Elite Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12 md:mb-16">
            <MetricCard
              icon={<MapIcon />}
              title="Terrains"
              value={stats.nbTerrains}
              trend="+2"
              label="Sites Explorés"
              onClick={() => router.push('/dashboard/terrains')}
              gradient="from-emerald-50 to-white"
            />
            <MetricCard
              icon={<LayoutGrid />}
              title="Parcelles"
              value={stats.nbParcelles}
              trend="+15%"
              label="Actives"
              onClick={() => router.push('/dashboard/parcelles')}
              gradient="from-lime-50 to-white"
            />
            <MetricCard
              icon={<BrainCircuit />}
              title="IA-Precision"
              value={`${stats.precision}%`}
              trend="stable"
              label="Score Moyen"
              onClick={() => router.push('/dashboard/historiqueprediction')}
              gradient="from-slate-50 to-white"
            />
            <MetricCard
              icon={<Activity />}
              title="Capteurs"
              value={stats.activeSensors}
              trend="Live"
              label="Nœuds Connectés"
              onClick={() => router.push('/dashboard/capteurs')}
              gradient="from-green-50 to-white"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            {/* Chart Section */}
            <div className="lg:col-span-8 space-y-8 md:space-y-12">
              <div className="bg-white rounded-[32px] md:rounded-[48px] p-6 md:p-10 border border-emerald-50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.1)] transition-all overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 md:mb-10">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-[#052E16] tracking-tight">Analyse de Fertilité</h3>
                    <p className="text-[#052E16]/40 text-[10px] font-black uppercase tracking-widest mt-1">Tendances N-P-K sur 6 mois</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#052E16]/60">N</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-lime-500"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#052E16]/60">P</span>
                    </div>
                  </div>
                </div>

                <div className="h-[250px] md:h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={soilTrendData}>
                      <defs>
                        <linearGradient id="colorN" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '20px' }}
                      />
                      <Area type="monotone" dataKey="N" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorN)" />
                      <Area type="monotone" dataKey="P" stroke="#84cc16" strokeWidth={4} fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Table Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                  <h3 className="text-xl md:text-2xl font-black text-[#052E16] tracking-tight">Performance Parcelles</h3>
                  <button className="text-emerald-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                    Voir Tout <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {parcellePerformance.map((p) => (
                    <div key={p.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-[#F8FAF9] rounded-[24px] md:rounded-[32px] border border-emerald-50 hover:bg-white hover:shadow-xl transition-all gap-6 sm:gap-0">
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className={`w-12 h-12 md:w-14 md:h-14 ${p.bg} rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl group-hover:scale-110 transition-transform`}>
                          🌾
                        </div>
                        <div>
                          <h4 className="text-[#052E16] font-black text-base md:text-lg">{p.name}</h4>
                          <p className="text-[#052E16]/40 text-[10px] font-black uppercase tracking-widest">{p.crop} • {p.area}ha</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 md:gap-12">
                        <div className="text-left sm:text-right">
                          <p className="text-[#052E16] font-black text-lg md:text-xl mb-1">{p.fertilityScore}%</p>
                          <p className="text-[#052E16]/40 text-[9px] font-black uppercase tracking-widest">Santé Sol</p>
                        </div>
                        <div className={`px-4 py-2 ${p.bg} ${p.color} rounded-full font-black text-[9px] uppercase tracking-widest border border-current opacity-70`}>
                          {p.badge}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Widgets */}
            <div className="lg:col-span-4 space-y-8 md:space-y-12">
              {/* Quick Actions */}
              <div className="bg-[#052E16] rounded-[32px] md:rounded-[48px] p-8 md:p-10 text-white relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-[2s]"></div>
                <h3 className="text-xl md:text-2xl font-black tracking-tight mb-6 md:mb-8">Alertes Rapides</h3>
                <div className="space-y-4">
                  <div className="p-4 md:p-5 bg-white/5 backdrop-blur-xl rounded-[20px] md:rounded-[28px] border border-white/10 flex items-center gap-4 md:gap-5 hover:bg-white/10 transition-all cursor-pointer">
                    <Droplets className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Irrigation Nord Requise</span>
                  </div>
                  <div className="p-4 md:p-5 bg-white/5 backdrop-blur-xl rounded-[20px] md:rounded-[28px] border border-white/10 flex items-center gap-4 md:gap-5 hover:bg-white/10 transition-all cursor-pointer">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-lime-400" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Récolte Optimale Prévue</span>
                  </div>
                </div>
                <button className="w-full mt-8 md:mt-10 py-5 bg-emerald-500 rounded-[24px] md:rounded-[28px] font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-xl hover:bg-emerald-400 transition-all active:scale-95">
                  Voir les Détails
                </button>
              </div>

              {/* Mini Health Status */}
              <div className="bg-slate-50 rounded-[32px] md:rounded-[48px] p-8 md:p-10 border border-emerald-50">
                <h3 className="text-lg md:text-xl font-black text-[#052E16] tracking-tight mb-6 md:mb-8">Statuts Capteurs</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { l: 'Temp', v: '24°c', i: <Thermometer /> },
                    { l: 'Météo', v: 'Ensoleillé', i: <CloudSun /> }
                  ].map((item, id) => (
                    <div key={id} className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-emerald-50 text-center">
                      <div className="flex justify-center text-emerald-500 mb-3">{item.i}</div>
                      <p className="text-xl md:text-2xl font-black text-[#052E16]">{item.v}</p>
                      <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#052E16]/40">{item.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ icon, title, value, trend, label, onClick, gradient }: any) {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white p-8 rounded-[40px] border border-emerald-50 shadow-sm transition-all duration-500 hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-4 cursor-pointer overflow-hidden`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50`}></div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h4 className="text-[#052E16]/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{title}</h4>
        <p className="text-4xl font-black text-[#052E16] tracking-tighter mb-1">{value}</p>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#052E16]/60">{label}</span>
          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${trend.includes('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}