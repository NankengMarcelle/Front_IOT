"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardHeader from '@/components/layout/Header';
import DashboardFooter from '@/components/layout/Footer';
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
  MoreVertical,
  Search
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

  const handleDelete = async (id: number) => {
    if (confirm(t('terrains.delete_confirm'))) {
      try {
        await terrainService.deleteTerrain(id);
        loadData();
      } catch (error) {
        console.error("Error deleting terrain:", error);
      }
    }
  };

  const filteredTerrains = terrains.filter(t =>
    t.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.ville?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFB]">
      <DashboardHeader />

      <main className="flex-grow p-6 sm:p-10 max-w-7xl mx-auto w-full">
        {view === "form" ? (
          <div className="max-w-3xl mx-auto">
            <TerrainForm
              initialData={selectedTerrain}
              onSuccess={loadData}
              onCancel={() => setView("list")}
            />
          </div>
        ) : (
          <>
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h1 className="text-4xl font-black text-[#1A4D2E] tracking-tight">{t('terrains.title')}</h1>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest rounded-xl border border-emerald-100/50">
                    <Layers className="w-3.5 h-3.5" />
                    {stats.count} Entités
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest rounded-xl border border-blue-100/50">
                    <Maximize2 className="w-3.5 h-3.5" />
                    {stats.surface.toLocaleString()} m²
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative hidden sm:block">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Chercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white border border-slate-200 rounded-[18px] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition-all w-48 shadow-sm"
                  />
                </div>
                <button
                  onClick={() => { setSelectedTerrain(null); setView("form"); }}
                  className="bg-[#1A4D2E] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-[#133a23] shadow-lg shadow-emerald-900/10 transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {t('terrains.add_button')}
                </button>
              </div>
            </div>

            {terrains.length === 0 ? (
              <div className="bg-white rounded-[48px] border-2 border-dashed border-slate-200 py-32 flex flex-col items-center justify-center text-center px-6 shadow-sm">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">{t('terrains.no_terrains')}</h3>
                <p className="text-slate-500 max-w-sm font-medium">Commencez par ajouter votre premier terrain pour profiter de nos services d'intelligence agricole.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTerrains.map((t_node) => (
                  <div key={t_node.id} className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 flex flex-col">
                    {/* Card Header/Actions */}
                    <div className="p-8 pb-4 flex justify-between items-start">
                      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-inner">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSelectedTerrain(t_node); setView("form"); }}
                          className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                          title={t('terrains.modify')}
                        >
                          <Edit3 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t_node.id)}
                          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title={t('terrains.delete')}
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="px-8 pb-8 flex-grow">
                      <h3 className="font-black text-2xl text-slate-800 mb-1 group-hover:text-emerald-900 transition-colors">
                        {t_node.nom}
                      </h3>
                      <div className="flex items-center gap-1.5 text-slate-400 text-sm font-bold tracking-tight">
                        <MapPin className="w-3.5 h-3.5" />
                        {t_node.ville}, <span className="text-slate-300 font-medium">{t_node.quartier}</span>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center group-hover:bg-emerald-50/30 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('terrains.superficie')}</span>
                        <span className="text-[#1A4D2E] font-black text-xl">
                          {(t_node.superficie || t_node.superficie_totale).toLocaleString()} <span className="text-xs font-bold text-slate-300">m²</span>
                        </span>
                      </div>
                      <div className="h-6 w-px bg-slate-200"></div>
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Type</span>
                        <span className="text-slate-600 font-black text-sm uppercase">
                          {t_node.type_terrain || 'Mixte'}
                        </span>
                      </div>
                    </div>
                  </div>
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