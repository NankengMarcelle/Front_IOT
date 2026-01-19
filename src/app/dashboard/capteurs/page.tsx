"use client";

import { useState, useEffect } from "react";
import { sensorService } from "@/features/sensors/services/sensorService";
import { parcelService } from "@/features/parcels/services/parcelService";
import {
  Thermometer,
  Droplets,
  Activity,
  Cpu,
  RefreshCw,
  Search,
  Filter,
  Wifi,
  Zap,
  ChevronRight
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
    if (t.includes("temp")) return <Thermometer className="w-6 h-6" />;
    if (t.includes("hum")) return <Droplets className="w-6 h-6" />;
    return <Activity className="w-6 h-6" />;
  };

  const filteredSensors = sensors.filter(s =>
    s.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white relative overflow-hidden text-[#052E16]">
      {/* Premium Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-lime-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-60"></div>
      </div>

      <main className="relative z-10 pt-0">
        <div className="px-4 md:px-12 py-8 md:py-12 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-10 md:mb-16">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full mb-4 border border-emerald-100">
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-800 text-[10px] font-black uppercase tracking-widest">LoRaWAN Network</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]">
                Réseau de<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-lime-500">Capteurs.</span>
              </h1>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={loadData}
                className="w-12 h-12 md:w-14 md:h-14 bg-white border border-emerald-50 rounded-xl md:rounded-[20px] flex items-center justify-center text-[#052E16] hover:bg-emerald-50 transition-all shadow-sm"
                title="Synchroniser"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <div className="relative group flex-grow md:flex-grow-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher un nœud..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white border border-emerald-50 rounded-xl md:rounded-[20px] pl-12 pr-6 py-3.5 md:py-4 text-sm font-medium outline-none focus:border-emerald-500 focus:shadow-xl transition-all w-full md:w-64"
                />
              </div>
            </div>
          </div>

          {/* Stats Hub */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mb-10 md:mb-16">
            <div className="bg-white/50 backdrop-blur-xl p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-emerald-50 shadow-sm flex items-center gap-5 md:gap-6 group hover:shadow-xl transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-[#052E16] group-hover:text-white transition-all duration-500">
                <Cpu className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <p className="text-[#052E16]/40 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">Total Déployés</p>
                <p className="text-2xl md:text-3xl font-black tracking-tighter">{sensors.length}</p>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-xl p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-emerald-50 shadow-sm flex items-center gap-5 md:gap-6 group hover:shadow-xl transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                <Thermometer className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <p className="text-[#052E16]/40 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">Nœuds Température</p>
                <p className="text-2xl md:text-3xl font-black tracking-tighter">
                  {sensors.filter(s => s.nom?.toLowerCase().includes('temp')).length}
                </p>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-xl p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-emerald-50 shadow-sm flex items-center gap-5 md:gap-6 group hover:shadow-xl transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-all duration-500">
                <Droplets className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <p className="text-[#052E16]/40 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">Nœuds Humidité</p>
                <p className="text-2xl md:text-3xl font-black tracking-tighter">
                  {sensors.filter(s => s.nom?.toLowerCase().includes('hum')).length}
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white h-[260px] md:h-[280px] rounded-[32px] md:rounded-[48px] animate-pulse border border-emerald-50 shadow-sm" />
              ))}
            </div>
          ) : filteredSensors.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-xl rounded-[32px] md:rounded-[64px] border-2 border-dashed border-emerald-100 py-16 md:py-32 flex flex-col items-center justify-center text-center px-6">
              <Search className="w-16 h-16 md:w-20 md:h-20 text-emerald-100 mb-8" />
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-4">Aucun nœud détecté</h3>
              <p className="text-[#052E16]/40 max-w-md font-medium text-sm md:text-base">Les capteurs s'activent automatiquement lors de leur déploiement physique par l'équipe technique SmartAgro.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {filteredSensors.map((sensor) => (
                <div
                  key={sensor.id}
                  className="group bg-white p-8 md:p-10 rounded-[32px] md:rounded-[48px] shadow-sm border border-emerald-50 hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.08)] md:hover:-translate-y-4 transition-all duration-700 overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-emerald-50 rounded-bl-[120px] -mr-16 md:-mr-20 -mt-16 md:-mt-20 group-hover:scale-150 transition-transform duration-[2s] opacity-50 z-0" />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8 md:mb-10">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 rounded-2xl md:rounded-[28px] flex items-center justify-center text-emerald-600 group-hover:bg-[#052E16] group-hover:text-white transition-all shadow-inner">
                        {getIconForType(sensor.nom || sensor.code)}
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 px-3.5 md:px-4 py-1.5 md:py-2 bg-emerald-100/50 rounded-full border border-emerald-100">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span className="text-emerald-700 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]">Online</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-black text-2xl md:text-3xl tracking-tighter mb-2 group-hover:text-emerald-600 transition-colors">
                      {sensor.nom}
                    </h3>
                    <div className="inline-flex items-center gap-2 text-[9px] md:text-[10px] font-black text-[#052E16]/30 bg-slate-50 px-4 py-2 rounded-xl group-hover:bg-white transition-colors">
                      <Zap className="w-3 h-3 text-lime-500" />
                      ID-TRANS: {sensor.code}
                    </div>

                    <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-emerald-50 flex items-center justify-between">
                      <div>
                        <p className="text-[8px] md:text-[9px] text-[#052E16]/30 font-black uppercase tracking-widest mb-1">Affectation</p>
                        <p className="text-xs md:text-sm font-black tracking-tight">
                          {getParcelName(sensor.parcelleId || sensor.parcelle_id)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] md:text-[9px] text-[#052E16]/30 font-black uppercase tracking-widest mb-1">Data Rate</p>
                        <p className="text-xs md:text-sm font-black text-emerald-600 tracking-tight flex items-center gap-1 justify-end">
                          SF7 <ChevronRight className="w-3 h-3" />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
