"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from '@/components/layout/Header';
import { TerrainsService } from "@/lib/services/TerrainsService";
import { ParcellesService } from "@/lib/services/ParcellesService";
import { useTranslation } from "@/providers/TranslationProvider";
import { 
  LayoutGrid, 
  Map as MapIcon, 
  BrainCircuit, 
  Lightbulb, 
  History, 
  ArrowRight,
  Bell,
  TrendingUp,
  AlertCircle,
  Activity,
  Zap,
  Droplets,
  Wind
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function FarmerDashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const [terrains, setTerrains] = useState<any[]>([]);
  const [parcelles, setParcelles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        // Fetch terrains
        const terrainData = await TerrainsService.getAllTerrainsApiV1TerrainsTerrainsGet();
        setTerrains(terrainData);

        // Fetch parcelles for each terrain
        const allParcellesPromises = terrainData.map(t =>
          ParcellesService.getParcellesByTerrainApiV1ParcellesParcellesTerrainTerrainIdGet(t.id)
        );
        const allParcellesResults = await Promise.all(allParcellesPromises);
        setParcelles(allParcellesResults.flat());
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
    surfaceTerrains: terrains.reduce((acc, t) => acc + Number(t.superficie_totale || t.superficie || 0), 0),
    nbParcelles: parcelles.length,
    surfaceParcelles: parcelles.reduce((acc, p) => acc + Number(p.superficie || 0), 0)
  }), [terrains, parcelles]);

  // Mock data for enhanced dashboard
  const soilTrendData = [
    { month: "Jan", N: 35, P: 28, K: 42, pH: 6.8, humidity: 65, temperature: 12 },
    { month: "Feb", N: 38, P: 30, K: 45, pH: 6.9, humidity: 68, temperature: 14 },
    { month: "Mar", N: 42, P: 32, K: 48, pH: 7.0, humidity: 70, temperature: 18 },
    { month: "Apr", N: 45, P: 35, K: 50, pH: 7.1, humidity: 72, temperature: 22 },
    { month: "May", N: 48, P: 38, K: 52, pH: 7.0, humidity: 75, temperature: 26 },
    { month: "Jun", N: 50, P: 40, K: 55, pH: 6.9, humidity: 70, temperature: 28 }
  ];

  const yieldGoalData = [
    { name: "Atteint", value: 82 },
    { name: "Restant", value: 18 }
  ];

  const parcellePerformance = [
    { id: 1, name: "Parcelle A", area: 5, crop: "Maïs", fertilityScore: 85, recommendation: "Ajouter engrais N", badge: "Optimal", icon: "🌾", active: true },
    { id: 2, name: "Parcelle B", area: 3.5, crop: "Blé", fertilityScore: 72, recommendation: "Augmenter irrigation", badge: "Needs Irrigation", icon: "🌾", active: true },
    { id: 3, name: "Parcelle C", area: 2.5, crop: "Soja", fertilityScore: 91, recommendation: "Maintenir régime actuel", badge: "High Yield", icon: "🫘", active: true },
    { id: 4, name: "Parcelle D", area: 4, crop: "Riz", fertilityScore: 68, recommendation: "Ajuster pH du sol", badge: "Needs Attention", icon: "🍚", active: false }
  ];

  const sensorHealth = [
    { zone: "Nord-Est", status: "healthy", battery: 85 },
    { zone: "Sud-Ouest", status: "healthy", battery: 92 },
    { zone: "Centre", status: "warning", battery: 35 }
  ];

  const COLORS = { optimal: "#4CAF50", moderate: "#FFEB3B", low: "#FF6B6B" };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FFFFFF" }}>
      <DashboardHeader />

      <main className="flex-grow w-full">
        {/* Enhanced Top Bar with Search and Profile */}
        <div className="sticky top-[60px] z-40 bg-white border-b border-gray-200 px-6 lg:px-12 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#2E7D32]">Aperçu Général</h1>
                <p className="text-[#757575] text-sm mt-1">Gérez vos ressources et analysez vos performances agricoles</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative hidden sm:block flex-1 md:flex-none md:w-64">
                  <input
                    type="text"
                    placeholder="Rechercher une parcelle ou une prédiction..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-[#E8F5E9] text-gray-700 text-sm rounded-lg border border-[#4CAF50]/20 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all"
                  />
                </div>
                <button className="relative p-2 text-[#757575] hover:text-[#4CAF50] transition-colors" title="Notifications" aria-label="Notifications">
                  <Bell className="w-6 h-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                <div className="w-10 h-10 rounded-full bg-[#4CAF50] flex items-center justify-center text-white font-bold hover:bg-[#2E7D32] transition-colors cursor-pointer" title="Profil" aria-label="Profil utilisateur">
                  J
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 lg:p-12 max-w-7xl mx-auto w-full">
          {/* Metric Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <MetricCard
              icon={<MapIcon className="w-6 h-6" />}
              title="Mes Terrains"
              value={loading ? "..." : `${stats.nbTerrains}`}
              subtitle="Total sites"
              trend="+2%"
              trendUp={true}
              description="Accédez à la gestion complète"
              onClick={() => router.push('/dashboard/terrains')}
            />
            <MetricCard
              icon={<LayoutGrid className="w-6 h-6" />}
              title="Mes Parcelles"
              value={loading ? "..." : `${stats.nbParcelles}`}
              subtitle="Parcelles actives"
              trend="+15%"
              trendUp={true}
              description="Suivi de la santé des sols"
              onClick={() => router.push('/dashboard/parcelles')}
            />
            <MetricCard
              icon={<BrainCircuit className="w-6 h-6" />}
              title="Prédictions IA"
              value="Analyses prêtes"
              subtitle="Précision"
              trend="99%"
              trendUp={true}
              description="Recommandations intelligentes"
              onClick={() => router.push('/dashboard/historiqueprediction')}
            />
            <MetricCard
              icon={<Lightbulb className="w-6 h-6" />}
              title="Recommandations"
              value="3"
              subtitle="Nouvelles alertes"
              trend="+10%"
              trendUp={true}
              description="Conseils techniques appliqués"
              onClick={() => router.push('/dashboard/recommandations')}
            />
            <MetricCard
              icon={<Activity className="w-6 h-6" />}
              title="Santé des Capteurs"
              value="10 actifs"
              subtitle="2 alertes"
              trend="-5%"
              trendUp={false}
              description="LoRaWAN statut temps réel"
              onClick={() => router.push('/dashboard/capteurs')}
            />
          </div>

          {/* Top Performing Parcelles Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#2E7D32]">Top Parcelles Performantes</h2>
              <button 
                onClick={() => router.push('/dashboard/parcelles')}
                className="text-[#4CAF50] hover:text-[#2E7D32] text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                Voir tous <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-md">
              <table className="w-full">
                <thead className="bg-[#E8F5E9] border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E7D32]">Parcelle</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E7D32]">Surface (ha)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E7D32]">Culture</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E7D32]">Santé Sol</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E7D32]">Recommandation</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E7D32]">Badge</th>
                  </tr>
                </thead>
                <tbody>
                  {parcellePerformance.map((parcelle, idx) => (
                    <tr 
                      key={parcelle.id}
                      className="border-b border-gray-100 hover:bg-[#F1F8F6] transition-colors duration-200 cursor-pointer"
                      onClick={() => router.push(`/dashboard/parcelles/${parcelle.id}`)}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-[#2E7D32]">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{parcelle.icon}</span>
                          {parcelle.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#757575]">{parcelle.area} ha</td>
                      <td className="px-6 py-4 text-sm font-medium text-[#2E7D32]">{parcelle.crop}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#4CAF50]" 
                              style={{ width: `${parcelle.fertilityScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-[#2E7D32]">{parcelle.fertilityScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#757575]">{parcelle.recommendation}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          parcelle.badge === "Optimal" ? "bg-[#E8F5E9] text-[#2E7D32]" :
                          parcelle.badge === "High Yield" ? "bg-[#C8E6C9] text-[#1B5E20]" :
                          parcelle.badge === "Needs Irrigation" ? "bg-[#FFF9C4] text-[#F57F17]" :
                          "bg-[#FFCCBC] text-[#D84315]"
                        }`}>
                          {parcelle.badge}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts and Widgets Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Soil Fertility Trends */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-8 shadow-md">
              <h3 className="text-xl font-bold text-[#2E7D32] mb-6">Tendances de Fertilité du Sol</h3>
              <div className="w-full h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={soilTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" />
                    <XAxis dataKey="month" stroke="#757575" />
                    <YAxis stroke="#757575" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#FFFFFF", 
                        border: `1px solid #4CAF50`,
                        borderRadius: "8px"
                      }}
                      cursor={{ stroke: "#4CAF50", strokeWidth: 2 }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="N" stroke="#4CAF50" strokeWidth={2} dot={{ fill: "#4CAF50" }} name="Azote (N)" />
                    <Line type="monotone" dataKey="P" stroke="#66BB6A" strokeWidth={2} dot={{ fill: "#66BB6A" }} name="Phosphore (P)" />
                    <Line type="monotone" dataKey="K" stroke="#81C784" strokeWidth={2} dot={{ fill: "#81C784" }} name="Potassium (K)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Yield Objectives Progress */}
            <div className="bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-2xl p-8 text-white shadow-md flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-4">Objectifs de Rendement</h3>
                <div className="text-6xl font-bold mb-2">82%</div>
                <p className="text-sm opacity-90">Atteint</p>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 mb-6 overflow-hidden">
                <div className="bg-white h-full rounded-full" style={{ width: "82%" }}></div>
              </div>
              <div className="text-sm space-y-2">
                <p className="opacity-90">1.4k ha ciblés</p>
                <p className="font-semibold text-green-100">+15% vs. dernier cycle</p>
              </div>
            </div>
          </div>

          {/* Additional Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sensor Health Status */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-md">
              <h3 className="text-xl font-bold text-[#2E7D32] mb-6">Statut des Capteurs LoRaWAN</h3>
              <div className="space-y-4">
                {sensorHealth.map((sensor, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-[#F1F8F6] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${sensor.status === 'healthy' ? 'bg-[#4CAF50]' : 'bg-[#FFEB3B]'}`}></div>
                      <div>
                        <p className="font-medium text-[#2E7D32]">{sensor.zone}</p>
                        <p className="text-xs text-[#757575]">Batterie: {sensor.battery}%</p>
                      </div>
                    </div>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${sensor.battery > 50 ? 'bg-[#4CAF50]' : 'bg-[#FFEB3B]'}`}
                        style={{ width: `${sensor.battery}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Parcel Health Heatmap */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-md">
              <h3 className="text-xl font-bold text-[#2E7D32] mb-6">Cartographie des Parcelles</h3>
              <div className="grid grid-cols-3 gap-3">
                {[...Array(9)].map((_, idx) => {
                  const colors = ["bg-[#4CAF50]", "bg-[#FFEB3B]", "bg-[#FF6B6B]"];
                  const randomColor = colors[Math.floor(Math.random() * colors.length)];
                  return (
                    <button
                      key={idx}
                      className={`${randomColor} rounded-lg h-20 flex items-center justify-center text-white font-bold text-sm hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
                      title={`Zone ${idx + 1}`}
                      aria-label={`Zone ${idx + 1}`}
                    >
                      Z{idx + 1}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-[#757575] mt-6 space-y-1">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#4CAF50]"></span>
                  Optimal
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FFEB3B]"></span>
                  Modéré
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF6B6B]"></span>
                  Faible
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  trend: string;
  trendUp: boolean;
  description: string;
  onClick: () => void;
}

function MetricCard({ 
  icon, 
  title, 
  value, 
  subtitle, 
  trend, 
  trendUp, 
  description, 
  onClick 
}: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 group"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      aria-label={title}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[#757575] uppercase tracking-wide">{title}</h3>
          <p className="text-3xl font-bold text-[#2E7D32] mt-2">{value}</p>
          <p className="text-xs text-[#757575] mt-1">{subtitle}</p>
        </div>
        <div className="text-[#4CAF50] group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#757575]">{description}</p>
        <span className={`text-sm font-bold ${trendUp ? 'text-[#4CAF50]' : 'text-[#FF6B6B]'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}