"use client";

import { useState, useEffect } from "react";
import DashboardHeader from '@/components/layout/Header';
import DashboardFooter from '@/components/layout/Footer';
import ParcelCard from "@/features/parcels/components/ParcelCard";
import ParcelForm from "@/features/parcels/components/ParcelForm";
import { parcelService } from "@/features/parcels/services/parcelService";
import { terrainService } from "@/features/terrains/services/terrainService";
import { sensorService } from "@/features/sensors/services/sensorService";
import { sensorDataService } from "@/features/sensors/services/sensorDataService";
import { useTranslation } from "@/providers/TranslationProvider";
import { Plus, Grid3x3, Search, Filter } from "lucide-react";

export default function ParcellesPage() {
  const { t } = useTranslation();
  const [view, setView] = useState("list");
  const [parcelles, setParcelles] = useState<any[]>([]);
  const [terrains, setTerrains] = useState<any[]>([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const terrainsData: any = await terrainService.getTerrains();
      setTerrains(terrainsData);

      const flattenedParcelles: any = await parcelService.getParcelles();
      const sensors: any = await sensorService.getSensors();

      const parcellesWithExtras = await Promise.all(flattenedParcelles.map(async (p: any) => {
        const parcelSensors = sensors.filter((s: any) => String(s.parcelleId || s.parcelle_id) === String(p.id));
        const capteursListe = parcelSensors.map((s: any) => s.nom || s.code).join(', ');

        let measurements = {
          azote: 0, phosphore: 0, potassium: 0,
          humidite: 0, temperature: 0, ph: 0
        };

        try {
          const parcelMeasurements = await sensorDataService.getMeasurementsByParcelle(p.id);
          if (parcelMeasurements && parcelMeasurements.length > 0) {
            const latest = parcelMeasurements[0];
            measurements = {
              azote: latest.azote || 0,
              phosphore: latest.phosphore || 0,
              potassium: latest.potassium || 0,
              humidite: latest.humidity || 0,
              temperature: latest.temperature || 0,
              ph: latest.ph || 0
            };
          }
        } catch (e) {
          console.error(`Error fetching measurements for parcel ${p.id}:`, e);
        }

        return { ...p, ...measurements, capteursListe };
      }));

      setParcelles(parcellesWithExtras);
      setView("list");
    } catch (error) {
      console.error("Error loading parcelles data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const getTerrainName = (id: string | number) => {
    const terrain = terrains.find(tr => String(tr.id) === String(id));
    return terrain ? terrain.nom : "Terrain inconnu";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FBFA]">
      <DashboardHeader />

      <main className="flex-grow p-6 sm:p-10 max-w-7xl mx-auto w-full">
        {view === "form" ? (
          <div className="max-w-3xl mx-auto">
            <ParcelForm initialData={selectedParcel} onSuccess={loadData} onCancel={() => setView("list")} />
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h1 className="text-4xl font-black text-[#1A4D2E] tracking-tight">{t('parcelles_list.title')}</h1>
                <p className="text-slate-500 mt-2 font-medium">Gérez le découpage de vos exploitations et leurs cultures.</p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setSelectedParcel(null); setView("form"); }}
                  className="bg-[#1A4D2E] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-[#133a23] shadow-lg shadow-emerald-900/10 transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {t('parcelles_list.add_button')}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => <div key={i} className="bg-white h-[300px] rounded-[40px] animate-pulse border border-slate-100" />)}
              </div>
            ) : parcelles.length === 0 ? (
              <div className="bg-white rounded-[48px] border-2 border-dashed border-slate-200 py-32 flex flex-col items-center justify-center text-center px-6">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Grid3x3 className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">{t('parcelles_list.no_parcelles')}</h3>
                <p className="text-slate-500 max-w-sm font-medium">Divisez vos terrains en parcelles pour un suivi précis de chaque culture.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {parcelles.map(p => (
                  <ParcelCard
                    key={p.id}
                    parcel={p}
                    terrainName={getTerrainName(p.terrain_id || p.terrainId)}
                    onEdit={() => { setSelectedParcel(p); setView("form"); }}
                    onDelete={async () => {
                      if (confirm(t('parcelles_list.delete_confirm'))) {
                        await parcelService.deleteParcelle(p.id);
                        loadData();
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <DashboardFooter />
    </div>
  );
}