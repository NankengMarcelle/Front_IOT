"use client";

import { useState, useEffect } from "react";
import ParcelCard from "@/features/parcels/components/ParcelCard";
import ParcelForm from "@/features/parcels/components/ParcelForm";
import { parcelService } from "@/features/parcels/services/parcelService";
import { terrainService } from "@/features/terrains/services/terrainService";
import { useTranslation } from "@/providers/TranslationProvider";
import { CapteursService } from "@/lib";
import { useConfirmDialog } from "@/components/ConfirmDialog";
import { Plus, Grid3x3, Search, Layout, ChevronRight } from "lucide-react";

export default function ParcellesPage() {
  const { t } = useTranslation();
  const { confirm } = useConfirmDialog();
  const [view, setView] = useState("list");
  const [parcelles, setParcelles] = useState<any[]>([]);
  const [terrains, setTerrains] = useState<any[]>([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const terrainsData: any = await terrainService.getTerrains();
      setTerrains(terrainsData);

      const flattenedParcelles: any = await parcelService.getParcelles();
      setParcelles(flattenedParcelles);
      setView("list");
    } catch (error) {
      console.error("Error loading parcelles data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (parcel: any) => {
    let message = 'Êtes-vous sûr de vouloir supprimer cette parcelle ? Cette action est irréversible.';
    let sensorsToUnassign: string[] = [];

    if (parcel.capteursListe) {
      sensorsToUnassign = parcel.capteursListe.split(',').map((s: string) => s.trim()).filter((s: string) => s);
      if (sensorsToUnassign.length > 0) {
        message = `Cette parcelle possède ${sensorsToUnassign.length} capteur(s) assigné(s). Ils seront automatiquement désassignés avant la suppression. Voulez-vous continuer ?`;
      }
    }

    const confirmed = await confirm({
      title: 'Supprimer la parcelle',
      message: message,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      if (sensorsToUnassign.length > 0) {
        // Unassign sensors before deleting the parcel
        for (const sensorCode of sensorsToUnassign) {
          try {
            await CapteursService.desassignCapteurApiV1CapteursDesassignPost(parcel.code, sensorCode);
          } catch (unassignError) {
            console.error(`Error unassigning sensor ${sensorCode}:`, unassignError);
            // We might want to continue anyway or stop. Here we continue.
          }
        }
      }

      await parcelService.deleteParcelle(parcel.id);
      loadData();
    } catch (error) {
      console.error("Error deleting parcel:", error);
      await confirm({
        title: 'Erreur',
        message: 'Impossible de supprimer la parcelle.',
        confirmText: 'OK',
        type: 'danger'
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getTerrainName = (id: string | number) => {
    const terrain = terrains.find(tr => String(tr.id) === String(id));
    return terrain ? terrain.nom : "Terrain inconnu";
  };

  const filteredParcelles = parcelles.filter(p =>
    p.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getTerrainName(p.terrain_id || p.terrainId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Premium Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-lime-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-60"></div>
      </div>

      <main className="relative z-10 pt-0">
        <div className="px-4 md:px-12 py-8 md:py-12 max-w-7xl mx-auto w-full">
          {view === "form" ? (
            <div className="max-w-3xl mx-auto animate-fadeIn">
              <div className="mb-6 md:mb-10 flex items-center gap-4">
                <button onClick={() => setView("list")} className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl border border-emerald-50 flex items-center justify-center hover:bg-emerald-50 transition-all text-[#052E16]">
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 rotate-180" />
                </button>
                <h2 className="text-2xl md:text-3xl font-black text-[#052E16] tracking-tighter">
                  {selectedParcel ? "Éditer la Parcelle" : "Nouvelle Parcelle"}
                </h2>
              </div>
              <ParcelForm initialData={selectedParcel} onSuccess={loadData} onCancel={() => setView("list")} />
            </div>
          ) : (
            <>
              {/* Page Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-10 md:mb-16">
                <div>
                  <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full mb-4 border border-emerald-100">
                    <Layout className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-800 text-[10px] font-black uppercase tracking-widest">Segmentation Agricole</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-[0.9]">
                    Vos<br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-lime-500">Unités de Culture.</span>
                  </h1>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div className="relative group flex-grow sm:flex-grow-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Chercher une unité..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white border border-emerald-50 rounded-xl md:rounded-[20px] pl-12 pr-6 py-3.5 md:py-4 text-sm font-medium outline-none focus:border-emerald-500 focus:shadow-xl transition-all w-full sm:w-64"
                    />
                  </div>
                  <button
                    onClick={() => { setSelectedParcel(null); setView("form"); }}
                    className="bg-[#052E16] text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-[24px] font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:scale-105 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Plus className="w-4 h-4" />
                    Nouvelle Parcelle
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white h-[400px] md:h-[450px] rounded-[32px] md:rounded-[48px] animate-pulse border border-emerald-50 shadow-sm" />
                  ))}
                </div>
              ) : parcelles.length === 0 ? (
                <div className="bg-white/50 backdrop-blur-xl rounded-[32px] md:rounded-[64px] border-2 border-dashed border-emerald-100 py-16 md:py-32 flex flex-col items-center justify-center text-center px-6 shadow-sm">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-50 rounded-2xl md:rounded-[32px] flex items-center justify-center mb-6 md:mb-8 shadow-inner">
                    <Grid3x3 className="w-8 h-8 md:w-10 md:h-10 text-emerald-200" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-[#052E16] tracking-tighter mb-4 px-4 text-balance">Aucune parcelle définie</h3>
                  <p className="text-[#052E16]/40 max-w-sm font-medium text-sm md:text-base px-6">Divisez vos terrains pour une gestion ultra-précise et commencez à recevoir vos premiers rapports IA.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                  {filteredParcelles.map(p => (
                    <ParcelCard
                      key={p.id}
                      parcel={p}
                      terrainName={terrains.find((t: any) => String(t.id) === String(p.terrainId))?.nom || "Terrain Inconnu"}
                      onRefresh={loadData}
                      onEdit={() => {
                        setSelectedParcel(p);
                        setView("form");
                      }}
                      onDelete={() => handleDelete(p)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}