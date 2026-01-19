"use client";

import { useState, useEffect, useMemo } from "react";
import TerrainForm from "@/features/terrains/components/TerrainForm";
import { terrainService } from "@/features/terrains/services/terrainService";
import { useTranslation } from "@/providers/TranslationProvider";
import {
  Plus,
  MapPin,
  Trash2,
  Edit3,
  Layers,
  Maximize2,
  Search,
  ChevronRight,
  Map
} from "lucide-react";

export default function TerrainsPage() {
  const { t } = useTranslation();
  const [view, setView] = useState("list");
  const [terrains, setTerrains] = useState<any[]>([]);
  const [selectedTerrain, setSelectedTerrain] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      const data: any = await terrainService.getTerrains();
      setTerrains(data);
      setView("list");
    } catch (error) {
      console.error("Error loading terrains:", error);
    }
  };

  useEffect(() => { loadData(); }, []);

  const stats = useMemo(() => {
    const totalSurface = terrains.reduce((acc, t) => acc + Number(t.superficie_totale || t.superficie || 0), 0);
    return { count: terrains.length, surface: totalSurface };
  }, [terrains]);

  const handleDelete = async (id: number | string) => {
    if (confirm(t('terrains.delete_confirm'))) {
      try {
        console.log("Deleting terrain:", id);
        await terrainService.deleteTerrain(id);
        loadData();
      } catch (error) {
        console.error("Error deleting terrain:", error);
        alert(t('terrains.delete_error') || "Impossible de supprimer ce terrain. Assurez-vous qu'il ne contient aucune parcelle ou donnée liée.");
      }
    }
  };

  const filteredTerrains = terrains.filter(t =>
    t.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.ville?.toLowerCase().includes(searchTerm.toLowerCase())
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
                  {selectedTerrain ? "Modifier le Terrain" : "Nouveau Terrain"}
                </h2>
              </div>
              <TerrainForm
                initialData={selectedTerrain}
                onSuccess={() => { loadData(); setView("list"); }}
                onCancel={() => setView("list")}
              />
            </div>
          ) : (
            <>
              {/* Page Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-10 md:mb-16">
                <div>
                  <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full mb-4 border border-emerald-100">
                    <Map className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-800 text-[10px] font-black uppercase tracking-widest">Patrimoine Foncier</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#052E16] tracking-tighter leading-[0.9]">
                    Vos<br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-lime-500">Exploitations.</span>
                  </h1>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div className="relative group flex-grow sm:flex-grow-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Localiser un site..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white border border-emerald-50 rounded-xl md:rounded-[20px] pl-12 pr-6 py-3.5 md:py-4 text-sm font-medium outline-none focus:border-emerald-500 focus:shadow-xl transition-all w-full sm:w-64"
                    />
                  </div>
                  <button
                    onClick={() => { setSelectedTerrain(null); setView("form"); }}
                    className="bg-[#052E16] text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-[24px] font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:scale-105 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter Terrain
                  </button>
                </div>
              </div>

              {terrains.length === 0 ? (
                <div className="bg-white/50 backdrop-blur-xl rounded-[32px] md:rounded-[64px] border-2 border-dashed border-emerald-100 py-16 md:py-32 flex flex-col items-center justify-center text-center px-6 shadow-sm">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-50 rounded-2xl md:rounded-[32px] flex items-center justify-center mb-6 md:mb-8 shadow-inner">
                    <MapPin className="w-8 h-8 md:w-10 md:h-10 text-emerald-200" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-[#052E16] tracking-tighter mb-4 px-4 text-balance">Aucun terrain enregistré</h3>
                  <p className="text-[#052E16]/40 max-w-sm font-medium text-sm md:text-base px-6">L'aventure commence par une simple coordonnée. Enregistrez votre premier site pour démarrer l'analyse.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                  {filteredTerrains.map((t_node) => (
                    <div key={t_node.id} className="group bg-white rounded-[32px] md:rounded-[48px] border border-emerald-50 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] md:hover:-translate-y-4 transition-all duration-700 flex flex-col overflow-hidden">
                      <div className="p-8 md:p-10 pb-4 flex justify-between items-start">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-50 rounded-2xl md:rounded-[24px] flex items-center justify-center text-emerald-600 shadow-inner group-hover:bg-[#052E16] group-hover:text-white transition-all duration-500">
                          <MapPin className="w-5 h-5 md:w-7 md:h-7" />
                        </div>
                        <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => { setSelectedTerrain(t_node); setView("form"); }}
                            className="w-10 h-10 bg-white rounded-xl border border-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(t_node.id)}
                            className="w-10 h-10 bg-white rounded-xl border border-rose-50 flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-all shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="px-8 md:px-10 pb-8 md:pb-10 flex-grow">
                        <h3 className="font-black text-xl md:text-2xl text-[#052E16] mb-2 tracking-tight group-hover:text-emerald-600 transition-colors">
                          {t_node.nom}
                        </h3>
                        <div className="flex items-center gap-2 text-[#052E16]/40 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                          <MapPin className="w-3.5 h-3.5" />
                          {t_node.ville} • <span className="text-emerald-600/60 font-black">{t_node.quartier}</span>
                        </div>
                      </div>

                      <div className="px-8 md:px-10 py-6 md:py-8 bg-[#F8FAF9] border-t border-emerald-50 flex justify-between items-center group-hover:bg-emerald-50/50 transition-colors">
                        <div>
                          <p className="text-[8px] md:text-[9px] text-[#052E16]/30 font-black uppercase tracking-widest mb-1">Surface Totale</p>
                          <p className="text-[#052E16] font-black text-xl md:text-2xl tracking-tighter">
                            {(t_node.superficie ?? t_node.superficie_totale ?? 0).toLocaleString()} <span className="text-[10px] font-black text-emerald-500/50">M²</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] md:text-[9px] text-[#052E16]/30 font-black uppercase tracking-widest mb-1">Typologie</p>
                          <p className="text-emerald-600 font-black text-[8px] md:text-[10px] uppercase tracking-widest bg-white px-2.5 md:px-3 py-1 md:py-1.5 rounded-full border border-emerald-50 shadow-sm">
                            {t_node.type_terrain || 'Agricole'}
                          </p>
                        </div>
                      </div>
                    </div>
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