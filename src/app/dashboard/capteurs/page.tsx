"use client";

import { useState, useEffect } from "react";
import DashboardHeader from '@/components/layout/Header';
import DashboardFooter from '@/components/layout/Footer';
import { sensorService } from "@/features/sensors/services/sensorService";
import { parcelService } from "@/features/parcels/services/parcelService";
import {
  Thermometer,
  Droplets,
  Activity,
  Cpu,
  RefreshCw,
  Search,
  Filter
} from "lucide-react";

export default function CapteursPage() {
  const [sensors, setSensors] = useState<any[]>([]);
  const [parcelles, setParcelles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const parcellesData: any = await parcelService.getParcelles();
      setParcelles(parcellesData);

      // Fetch all sensors (simulation of backend-provided hardware)
      const sData: any = await sensorService.getSensors();
      setSensors(sData);
    } catch (err) {
      console.error("Error loading sensors data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getParcelName = (parcelId: number | null | undefined): string => {
    if (!parcelId) return "Non assignée";
    const parcel = parcelles.find((p) => String(p.id) === String(parcelId));
    return parcel?.nom ?? "Non assignée";
  };

  const getIconForType = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("temp")) return <Thermometer className="w-5 h-5 text-rose-500" />;
    if (t.includes("hum")) return <Droplets className="w-5 h-5 text-sky-500" />;
    return <Activity className="w-5 h-5 text-emerald-500" />;
  };

  const filteredSensors = sensors.filter(s =>
    s.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FBFA]">
      <DashboardHeader />

      <main className="flex-grow p-6 sm:p-10 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-[#1A4D2E] tracking-tight">Capteurs Matériels</h1>
            <p className="text-slate-500 mt-2 font-medium">Monitoring du matériel déployé sur vos parcelles.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm"
              title="Actualiser"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total</p>
              <p className="text-2xl font-black text-slate-800">{sensors.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
              <Thermometer className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Température</p>
              <p className="text-2xl font-black text-slate-800">
                {sensors.filter(s => s.nom?.toLowerCase().includes('temp')).length}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Humidité</p>
              <p className="text-2xl font-black text-slate-800">
                {sensors.filter(s => s.nom?.toLowerCase().includes('hum')).length}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters Strip */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un capteur par nom ou code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-[20px] pl-12 pr-4 py-4 text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-medium"
            />
          </div>
          <button className="bg-white border border-slate-200 rounded-[20px] px-6 py-4 text-slate-600 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-5 h-5" />
            Filtres
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white h-[200px] rounded-[32px] animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : filteredSensors.length === 0 ? (
          <div className="bg-white rounded-[48px] border-2 border-dashed border-slate-200 py-20 flex flex-col items-center justify-center text-center px-6">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Aucun matériel trouvé</h3>
            <p className="text-slate-500 max-w-md font-medium">Les capteurs sont automatiquement détectés lorsqu'ils sont installés sur le terrain par nos techniciens.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSensors.map((sensor) => (
              <div
                key={sensor.id}
                className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative"
              >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-50" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:shadow-lg transition-all">
                      {getIconForType(sensor.nom || sensor.code)}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                        Connecté
                      </span>
                    </div>
                  </div>

                  <h3 className="font-black text-2xl text-slate-800 mb-1 group-hover:text-emerald-900 transition-colors">
                    {sensor.nom}
                  </h3>
                  <code className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">
                    ID: {sensor.code}
                  </code>

                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Localisation</p>
                      <p className="text-sm font-black text-slate-700">
                        {getParcelName(sensor.parcelleId || sensor.parcelle_id)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Dernier Ping</p>
                      <p className="text-sm font-black text-slate-700">Il y a 2m</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <DashboardFooter />
    </div>
  );
}
