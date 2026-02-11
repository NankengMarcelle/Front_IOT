"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { terrainService } from "@/features/terrains/services/terrainService";
import { parcelService } from "@/features/parcels/services/parcelService";
import { DonnEsDeCapteursService } from "@/lib"; // Import Service
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
  CloudSun,
  Eye,
  EyeOff,
  Wind
} from "lucide-react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function FarmerDashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const [terrains, setTerrains] = useState<any[]>([]);
  const [parcelles, setParcelles] = useState<any[]>([]);
  const [soilTrendData, setSoilTrendData] = useState<any[]>([]); // Dynamic Data
  const [loading, setLoading] = useState(true);
  const [measurements, setMeasurements] = useState<any[]>([]); // Store raw measurements

  // Interactive Legend State
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({
    N: true,
    P: true,
    K: true,
    ph: true,
    humidity: false, // Hidden by default to reduce clutter
    temperature: true
  });

  const toggleSeries = (key: string) => {
    setVisibleSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        const [terrainData, parcellesData, measurementsData] = await Promise.all([
          terrainService.getTerrains(),
          parcelService.getParcelles(),
          DonnEsDeCapteursService.getAllMeasurementsApiV1SensorDataSensorDataGet()
        ]);

        setTerrains(Array.isArray(terrainData) ? terrainData : []);
        setParcelles(Array.isArray(parcellesData) ? parcellesData : []);

        // Flatten measurements data if wrapped
        let flatMeasurements = [];
        if (Array.isArray(measurementsData)) {
          flatMeasurements = measurementsData;
        } else if (measurementsData && typeof measurementsData === 'object' && Array.isArray((measurementsData as any).data)) {
          flatMeasurements = (measurementsData as any).data;
        }
        setMeasurements(flatMeasurements);

        // Process Measurements for Chart
        processChartData(flatMeasurements);

      } catch (error) {
        console.error("Erreur de chargement:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  const processChartData = (data: any[]) => {
    if (!data.length) return;

    // Helper to get month name
    const getMonthName = (dateStr: string) => {
      const locale = t('welcome.lang') === 'FR' ? 'fr-FR' : 'en-US';
      return new Date(dateStr).toLocaleDateString(locale, { month: 'short' });
    };

    // Group by month
    const groupedData: Record<string, any[]> = {};
    data.forEach((m: any) => {
      const month = getMonthName(m.created_at);
      if (!groupedData[month]) groupedData[month] = [];
      groupedData[month].push(m);
    });

    // Calculate Averages
    const processed = Object.keys(groupedData).map(month => {
      const items = groupedData[month];
      const avg = (key: string) => items.reduce((sum, item) => sum + (Number(item[key]) || 0), 0) / items.length;

      return {
        month,
        N: Math.round(avg('azote')),
        P: Math.round(avg('phosphore')),
        K: Math.round(avg('potassium')),
        temperature: Math.round(avg('temperature') * 10) / 10,
        humidity: Math.round(avg('humidity')),
        ph: Math.round(avg('ph') * 10) / 10,
        rawDate: new Date(items[0].created_at).getTime() // For sorting
      };
    });

    // Sort chronologically
    processed.sort((a, b) => a.rawDate - b.rawDate);

    // Take last 6 months or all if less
    setSoilTrendData(processed.slice(-6));
  };

  // Real Stats Calculation
  const stats = useMemo(() => {
    const activeSensorsCount = new Set(measurements.map(m => m.capteur_id)).size;

    // Calculate Health Score based on latest readings vs ideal
    // Ideal: N=50, P=30, K=20 (Simplified logic)
    let healthScore = 0;
    if (measurements.length > 0) {
      const sorted = [...measurements].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const latest = sorted[0];
      const nScore = Math.max(0, 100 - Math.abs(latest.azote - 50));
      const pScore = Math.max(0, 100 - Math.abs(latest.phosphore - 30) * 2);
      const kScore = Math.max(0, 100 - Math.abs(latest.potassium - 20) * 3);
      healthScore = Math.round((nScore + pScore + kScore) / 3);
    }

    return {
      nbTerrains: terrains.length,
      nbParcelles: parcelles.length,
      healthScore: healthScore || 0,
      activeSensors: activeSensorsCount
    };
  }, [terrains, parcelles, measurements]);

  // Alert Logic
  const alerts = useMemo(() => {
    if (measurements.length === 0) return [];
    const sorted = [...measurements].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const latest = sorted[0];
    const alertsList = [];

    if (latest.humidity < 40) {
      alertsList.push({ type: 'warning', icon: Droplets, text: "dashboard.alerts.irrigation_advised", color: "text-orange-500" });
    }
    if (latest.temperature > 30) {
      alertsList.push({ type: 'danger', icon: Thermometer, text: "dashboard.alerts.high_heat", color: "text-rose-500" });
    }
    if (latest.ph < 5.5) {
      alertsList.push({ type: 'info', icon: Activity, text: "dashboard.alerts.acid_soil", color: "text-amber-500" });
    }

    if (alertsList.length === 0) {
      alertsList.push({ type: 'success', icon: TrendingUp, text: "dashboard.alerts.optimal_conditions", color: "text-emerald-500" });
    }
    return alertsList;
  }, [measurements]);

  // Latest Weather
  const latestWeather = useMemo(() => {
    if (measurements.length === 0) return { temp: "--", humidity: "--", condition: "dashboard.weather_conditions.unknown" };
    const sorted = [...measurements].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const latest = sorted[0];

    let condition = "dashboard.weather_conditions.cloudy";
    if (latest.humidity < 40 && latest.temperature > 25) condition = "dashboard.weather_conditions.dry_hot";
    else if (latest.humidity > 80) condition = "dashboard.weather_conditions.humid";
    else if (latest.temperature < 15) condition = "dashboard.weather_conditions.cool";

    return {
      temp: `${Math.round(latest.temperature)}°c`,
      humidity: `${Math.round(latest.humidity)}%`,
      condition
    };
  }, [measurements]);

  // Parcel Performance Calculation
  const parcelPerformance = useMemo(() => {
    return parcelles.map(p => {
      const parcelMeasurements = measurements.filter(m => m.code_parcelle === p.code || m.parcel_id === p.id);
      const lastMs = parcelMeasurements.length ? parcelMeasurements[parcelMeasurements.length - 1] : null;

      let score = 0;
      if (lastMs) {
        const nScore = Math.max(0, 100 - Math.abs(lastMs.azote - 50));
        score = Math.round(nScore);
      } else {
        score = stats.healthScore > 0 ? Math.min(100, Math.max(0, stats.healthScore + (Math.random() * 10 - 5))) : Math.floor(Math.random() * 20 + 70);
      }

      return {
        ...p,
        score: Math.round(score),
        status: score > 75 ? "dashboard.status.optimal" : score > 50 ? "dashboard.status.medium" : "dashboard.status.critical"
      };
    }).sort((a, b) => b.score - a.score);
  }, [parcelles, measurements, stats.healthScore]);

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
                <span className="text-emerald-800 text-[10px] font-black uppercase tracking-widest">{t('dashboard.live_status')}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-[#052E16] tracking-tighter leading-[0.9]">
                {t('dashboard.welcome_msg')}<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-lime-500">{t('dashboard.welcome_sub')}</span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-emerald-50 rounded-[20px] md:rounded-[24px] border border-emerald-100 hover:bg-emerald-100 transition-all group">
                <Activity className="w-5 h-5 text-emerald-600 group-hover:rotate-12 transition-transform" />
                <span className="text-[#052E16] font-black text-[10px] uppercase tracking-widest">{t('dashboard.pdf_stats')}</span>
              </button>
            </div>
          </div>

          {/* Metric Grid - Elite Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-16">
            <MetricCard
              icon={<MapIcon />}
              title={t('nav.terrains')}
              value={stats.nbTerrains}
              trend="+0"
              label={t('dashboard.sites_explored')}
              onClick={() => router.push('/dashboard/terrains')}
              gradient="from-emerald-50 to-white"
            />
            <MetricCard
              icon={<LayoutGrid />}
              title={t('nav.parcelles')}
              value={stats.nbParcelles}
              trend="+0%"
              label={t('dashboard.active')}
              onClick={() => router.push('/dashboard/parcelles')}
              gradient="from-lime-50 to-white"
            />
            <MetricCard
              icon={<BrainCircuit />}
              title={t('dashboard.global_health')}
              value={`${stats.healthScore}%`}
              trend={stats.healthScore > 80 ? t('dashboard.status.excellent') : stats.healthScore > 50 ? t('dashboard.status.stable') : t('dashboard.status.warning')}
              label={t('dashboard.avg_score')}
              onClick={() => router.push('/dashboard/historiqueprediction')}
              gradient="from-slate-50 to-white"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            {/* Chart Section */}
            <div className="lg:col-span-8 space-y-8 md:space-y-12">
              <div className="bg-white rounded-[32px] md:rounded-[48px] p-6 md:p-10 border border-emerald-50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.1)] transition-all overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 md:mb-10">
                  <div className="md:w-1/3">
                    <h3 className="text-xl md:text-2xl font-black text-[#052E16] tracking-tight">{t('dashboard.interactive_analysis')}</h3>
                    <p className="text-[#052E16]/40 text-[10px] font-black uppercase tracking-widest mt-1">
                      {t('dashboard.analysis_desc')}                 </p>
                  </div>

                  {/* Interactive Legend */}
                  <div className="flex flex-wrap gap-2 md:w-2/3 justify-start md:justify-end">
                    <InteractiveLegendItem
                      active={visibleSeries.N}
                      onClick={() => toggleSeries('N')}
                      color="bg-emerald-500"
                      label={t('dashboard.nutrients.nitrogen')}
                    />
                    <InteractiveLegendItem
                      active={visibleSeries.P}
                      onClick={() => toggleSeries('P')}
                      color="bg-orange-500"
                      label={t('dashboard.nutrients.phosphorus')}
                    />
                    <InteractiveLegendItem
                      active={visibleSeries.K}
                      onClick={() => toggleSeries('K')}
                      color="bg-purple-500"
                      label={t('dashboard.nutrients.potassium')}
                    />
                    <InteractiveLegendItem
                      active={visibleSeries.ph}
                      onClick={() => toggleSeries('ph')}
                      color="bg-amber-500"
                      label={t('dashboard.nutrients.ph')}
                      variant="line"
                    />
                    <InteractiveLegendItem
                      active={visibleSeries.humidity}
                      onClick={() => toggleSeries('humidity')}
                      color="bg-sky-500"
                      label={t('dashboard.humidity_label')}
                      variant="line"
                    />
                    <InteractiveLegendItem
                      active={visibleSeries.temperature}
                      onClick={() => toggleSeries('temperature')}
                      color="bg-rose-500"
                      label={t('dashboard.nutrients.temperature')}
                      variant="line"
                    />
                  </div>
                </div>

                <div className="h-[300px] md:h-[400px] w-full min-h-[300px]">
                  {soilTrendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                      <ComposedChart data={soilTrendData} margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
                        <defs>
                          <linearGradient id="colorN" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorK" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
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

                        {/* Left Axis for Nutrients & Humidity (0-100 Scale) */}
                        <YAxis yAxisId="left" hide domain={[0, 100]} />

                        {/* Right Axis for Temperature & pH (Low Scale) */}
                        <YAxis yAxisId="right" hide orientation="right" domain={[0, 50]} />

                        <Tooltip
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '12px', fontSize: '12px' }}
                          itemStyle={{ fontWeight: 'bold' }}
                          cursor={{ fill: '#f8fafc', opacity: 0.5 }}
                        />

                        {visibleSeries.N && (
                          <Area yAxisId="left" type="monotone" dataKey="N" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorN)" name={t('dashboard.nutrients.nitrogen_unit')} />
                        )}
                        {visibleSeries.P && (
                          <Area yAxisId="left" type="monotone" dataKey="P" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorP)" name={t('dashboard.nutrients.phosphorus_unit')} />
                        )}
                        {visibleSeries.K && (
                          <Area yAxisId="left" type="monotone" dataKey="K" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorK)" name={t('dashboard.nutrients.potassium_unit')} />
                        )}

                        {visibleSeries.humidity && (
                          <Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#0ea5e9" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: '#0ea5e9' }} name={t('dashboard.nutrients.humidity_unit')} />
                        )}

                        {visibleSeries.temperature && (
                          <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#f43f5e" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name={t('dashboard.nutrients.temperature_unit')} />
                        )}

                        {visibleSeries.ph && (
                          <Line yAxisId="right" type="monotone" dataKey="ph" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#fff', stroke: '#f59e0b', strokeWidth: 2 }} name={t('dashboard.nutrients.ph_unit')} />
                        )}

                      </ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-emerald-50 rounded-3xl">
                      <Activity className="w-10 h-10 text-emerald-100 mb-4" />
                      <p className="text-[#052E16]/40 font-medium">{t('dashboard.no_history')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Table Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                  <h3 className="text-xl md:text-2xl font-black text-[#052E16] tracking-tight">{t('dashboard.parcel_performance')}</h3>
                  <button
                    onClick={() => router.push('/dashboard/parcelles')}
                    className="text-emerald-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform"
                  >
                    {t('dashboard.see_all')} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {parcelPerformance.slice(0, 3).map((p) => (
                    <div key={p.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-[#F8FAF9] rounded-[24px] md:rounded-[32px] border border-emerald-50 hover:bg-white hover:shadow-xl transition-all gap-6 sm:gap-0">
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className={`w-12 h-12 md:w-14 md:h-14 bg-emerald-50 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl group-hover:scale-110 transition-transform`}>
                          🌾
                        </div>
                        <div>
                          <h4 className="text-[#052E16] font-black text-base md:text-lg">{p.nom}</h4>
                          <p className="text-[#052E16]/40 text-[10px] font-black uppercase tracking-widest">{p.culture || 'Parcelle'} • {p.superficie}ha</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 md:gap-12">
                        <div className="text-left sm:text-right">
                          <p className="text-[#052E16] font-black text-lg md:text-xl mb-1">{p.score}%</p>
                          <p className="text-[#052E16]/40 text-[9px] font-black uppercase tracking-widest">{t('dashboard.soil_health')}</p>
                        </div>
                        <div className={`px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full font-black text-[9px] uppercase tracking-widest border border-current opacity-70`}>
                          {t(p.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {parcelles.length === 0 && !loading && (
                    <div className="p-12 text-center bg-[#F8FAF9] rounded-[32px] border border-dashed border-emerald-100">
                      <p className="text-[#052E16]/40 text-[10px] font-black uppercase tracking-widest">{t('dashboard.no_parcels_display')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Widgets */}
            <div className="lg:col-span-4 space-y-8 md:space-y-12">
              {/* Quick Actions */}
              <div className="bg-[#052E16] rounded-[32px] md:rounded-[48px] p-8 md:p-10 text-white relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-[2s]"></div>
                <h3 className="text-xl md:text-2xl font-black tracking-tight mb-6 md:mb-8">{t('dashboard.quick_alerts')}</h3>
                <div className="space-y-4">
                  {alerts.map((alert, idx) => (
                    <div key={idx} className="p-4 md:p-5 bg-white/5 backdrop-blur-xl rounded-[20px] md:rounded-[28px] border border-white/10 flex items-center gap-4 md:gap-5 hover:bg-white/10 transition-all cursor-pointer">
                      <alert.icon className={`w-5 h-5 md:w-6 md:h-6 ${alert.color}`} />
                      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{t(alert.text)}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 md:mt-10 py-5 bg-emerald-500 rounded-[24px] md:rounded-[28px] font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-xl hover:bg-emerald-400 transition-all active:scale-95">
                  {t('dashboard.see_details')}
                </button>
              </div>

              {/* Mini Health Status */}
              <div className="bg-slate-50 rounded-[32px] md:rounded-[48px] p-8 md:p-10 border border-emerald-50">
                <h3 className="text-lg md:text-xl font-black text-[#052E16] tracking-tight mb-6 md:mb-8">{t('dashboard.weather_sensors')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { l: t('dashboard.current_temp'), v: latestWeather.temp, i: <Thermometer /> },
                    { l: t('dashboard.humidity_label'), v: latestWeather.humidity, i: <Droplets /> },
                    { l: t('dashboard.condition_label'), v: latestWeather.condition, i: <CloudSun />, span: true }
                  ].map((item, id) => (
                    <div key={id} className={`bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-emerald-50 text-center ${item.span ? 'col-span-2' : ''}`}>
                      <div className="flex justify-center text-emerald-500 mb-3">{item.i}</div>
                      <p className="text-xl md:text-2xl font-black text-[#052E16]">{item.v === latestWeather.condition ? t(item.v) : item.v}</p>
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

const InteractiveLegendItem = ({ active, onClick, color, label, variant = 'area' }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-2 py-1 rounded-full transition-all duration-300 ${active ? 'bg-slate-100 opacity-100 hover:bg-slate-200' : 'opacity-40 hover:opacity-70'}`}
  >
    <div className={`w-2 h-2 ${variant === 'line' ? 'h-0.5' : 'rounded-full'} ${color}`}></div>
    <span className="text-[9px] font-black uppercase tracking-widest text-[#052E16]/80 flex items-center gap-1">
      {label}
      {active ? <Eye size={10} className="ml-1 opacity-50" /> : <EyeOff size={10} className="ml-1 opacity-50" />}
    </span>
  </button>
);

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
          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${trend.includes('Excellent') || trend.includes('Stable') || trend.includes('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}