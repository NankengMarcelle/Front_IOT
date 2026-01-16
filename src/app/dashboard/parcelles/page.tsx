"use client";
import { useState, useEffect } from "react";
import DashboardHeader from '@/components/layout/Header';
import DashboardFooter from '@/components/layout/Footer';
import ParcelCard from "@/features/parcels/components/ParcelCard";
import ParcelForm from "@/features/parcels/components/ParcelForm";
import { StatutParcelle } from "@/lib/models/StatutParcelle";
import { ParcellesService } from "@/lib/services/ParcellesService";
import { TerrainsService } from "@/lib/services/TerrainsService";
import { CapteursService } from "@/lib/services/CapteursService";
import { DonnEsDeCapteursService } from "@/lib/services/DonnEsDeCapteursService";
import { useTranslation } from "@/providers/TranslationProvider";

export default function ParcellesPage() {
  const { t } = useTranslation();
  const [view, setView] = useState("list");
  const [parcelles, setParcelles] = useState<any[]>([]);
  const [terrains, setTerrains] = useState<any[]>([]);
  const [selectedParcel, setSelectedParcel] = useState(null);

  const loadData = async () => {
    try {
      const terrainsData = await TerrainsService.getAllTerrainsApiV1TerrainsTerrainsGet();
      setTerrains(terrainsData);

      const allParcellesPromises = terrainsData.map(t =>
        ParcellesService.getParcellesByTerrainApiV1ParcellesParcellesTerrainTerrainIdGet(t.id)
      );

      const allParcellesResults = await Promise.all(allParcellesPromises);
      const flattenedParcelles = allParcellesResults.flat();

      const sensors = await CapteursService.readCapteursApiV1CapteursGet();

      const parcellesWithExtras = await Promise.all(flattenedParcelles.map(async (p) => {
        // Find sensors
        const parcelSensors = sensors.filter(s => String(s.parcelle_id) === String(p.id));
        const capteursListe = parcelSensors.map(s => s.nom || s.code).join(', ');

        // Fetch latest measurement
        let measurements = {
          azote: 0,
          phosphore: 0,
          potassium: 0,
          humidite: 0,
          temperature: 0,
          ph: 0
        };

        try {
          const parcelMeasurements = await DonnEsDeCapteursService.getMeasurementsByParcelleApiV1SensorDataSensorDataParcelleParcelleIdGet(p.id, 0, 1);
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

        return {
          ...p,
          ...measurements,
          capteursListe
        };
      }));

      setParcelles(parcellesWithExtras);
      setView("list");
    } catch (error) {
      console.error("Error loading parcelles data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getTerrainName = (id: string | number) => {
    const terrain = terrains.find(tr => String(tr.id) === String(id));
    return terrain ? terrain.nom : "Terrain inconnu";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F8F4]">
      <DashboardHeader />
      <main className="flex-grow p-8 max-w-7xl mx-auto w-full">
        {view === "form" ? (
          <ParcelForm initialData={selectedParcel} onSuccess={loadData} onCancel={() => setView("list")} />
        ) : (
          <>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-3xl font-extrabold text-green-900">{t('parcelles_list.title')}</h1>
              <button
                onClick={() => { setSelectedParcel(null); setView("form"); }}
                className="bg-[#22C55E] text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-[#16A34A] transition-all transform active:scale-95"
              >
                + {t('parcelles_list.add_button')}
              </button>
            </div>

            {parcelles.length === 0 ? (
              <div className="bg-white rounded-[40px] border-2 border-dashed h-[400px] flex items-center justify-center">
                <p className="text-gray-400 text-xl font-semibold">{t('parcelles_list.no_parcelles')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {parcelles.map(p => (
                  <ParcelCard
                    key={p.id}
                    parcel={p}
                    terrainName={getTerrainName(p.terrain_id)}
                    onEdit={() => { setSelectedParcel(p); setView("form"); }}
                    onDelete={async () => {
                      if (confirm(t('parcelles_list.delete_confirm'))) {
                        await ParcellesService.deleteParcelleApiV1ParcellesParcellesParcelleIdDelete(p.id);
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