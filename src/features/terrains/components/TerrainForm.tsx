"use client";
import { useState, useRef, useEffect } from "react";
import { terrainService } from "../services/terrainService";
import { localiteService } from "../services/localiteService";
import { TypeTerrain, StatutTerrain, Terrain } from "@/types/user";
import { ChevronDown, MapPin, Ruler, Mountain, Calendar, Info, X } from "lucide-react";

export default function TerrainForm({ initialData, onSuccess, onCancel }: any) {
  const [loading, setLoading] = useState(false);
  const [localites, setLocalites] = useState<any[]>([]);

  const [formData, setFormData] = useState(initialData ? {
    nom: initialData.nom,
    superficie: initialData.superficie_totale || initialData.superficie,
    type_terrain: initialData.type_terrain || TypeTerrain.AGRICOLE,
    localite_id: initialData.localite_id || "",
    description: initialData.description || "",
    perimetre: initialData.perimetre || "",
    pente: initialData.pente || "",
    date_acquisition: initialData.date_acquisition ? new Date(initialData.date_acquisition).toISOString().split('T')[0] : "",
    statut: initialData.statut || StatutTerrain.ACTIF
  } : {
    nom: "",
    superficie: "",
    type_terrain: TypeTerrain.AGRICOLE,
    localite_id: "",
    description: "",
    perimetre: "",
    pente: "",
    date_acquisition: "",
    statut: StatutTerrain.ACTIF
  });

  useEffect(() => {
    const fetchLocalites = async () => {
      try {
        const data = await localiteService.getAllLocalites();
        setLocalites(data);
      } catch (error) {
        console.error("Error fetching localites:", error);
      }
    };
    fetchLocalites();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const localiteId = formData.localite_id;
      if (!localiteId) {
        throw new Error("Veuillez sélectionner une localité.");
      }

      const terrainData: any = {
        nom: formData.nom,
        superficie_totale: Number(formData.superficie),
        type_terrain: formData.type_terrain,
        localite_id: localiteId,
        latitude: 0,
        longitude: 0,
        description: formData.description || null,
        perimetre: formData.perimetre ? Number(formData.perimetre) : null,
        pente: formData.pente ? Number(formData.pente) : null,
        date_acquisition: formData.date_acquisition || null,
        statut: formData.statut,
      };

      if (initialData?.id) {
        terrainData.id = initialData.id;
      }

      await terrainService.saveTerrain(terrainData);
      onSuccess();
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert(error.message || "Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] p-8 sm:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-bl-[200px] -mr-32 -mt-32 opacity-40 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-[#1A4D2E] tracking-tight">
              {initialData ? "Édition du Terrain" : "Nouveau Domaine"}
            </h2>
            <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-widest">
              Configuration de votre espace agricole
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Name Field */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nom de l'exploitation</label>
            <div className="relative group">
              <input
                placeholder="Ex: Plantation de la Vallée"
                className="w-full bg-slate-50 border border-slate-100 rounded-[20px] px-6 py-4.5 text-slate-800 font-bold outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50 transition-all text-lg"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Superficie */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Superficie (m²)</label>
              <div className="relative group">
                <input
                  type="number"
                  placeholder="Ex: 5000"
                  className="w-full bg-slate-50 border border-slate-100 rounded-[24px] pl-14 pr-6 py-4 text-slate-800 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                  value={formData.superficie}
                  onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
                  required
                />
                <Ruler className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              </div>
            </div>

            {/* Localité Custom Dropdown */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Emplacement</label>
              <div className="relative group">
                <select
                  className="w-full bg-slate-50 border border-slate-100 rounded-[24px] pl-14 pr-12 py-4 text-slate-800 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer shadow-inner"
                  value={formData.localite_id}
                  onChange={(e) => setFormData({ ...formData, localite_id: e.target.value })}
                  required
                >
                  <option value="">Sélectionner localité</option>
                  {localites.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.ville} ({l.quartier})
                    </option>
                  ))}
                </select>
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pente */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Pente (%)</label>
              <div className="relative group">
                <input
                  type="number"
                  placeholder="0"
                  className="w-full bg-slate-50 border border-slate-100 rounded-[20px] pl-12 pr-4 py-3.5 text-slate-800 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                  value={formData.pente}
                  onChange={(e) => setFormData({ ...formData, pente: e.target.value })}
                />
                <Mountain className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              </div>
            </div>

            {/* Type de Terrain */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Type</label>
              <select
                className="w-full bg-slate-50 border border-slate-100 rounded-[20px] px-4 py-3.5 text-slate-800 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer shadow-inner"
                value={formData.type_terrain}
                onChange={(e) => setFormData({ ...formData, type_terrain: e.target.value as TypeTerrain })}
              >
                {Object.values(TypeTerrain).map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Date Acquisition */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Acquisition</label>
              <div className="relative group">
                <input
                  type="date"
                  className="w-full bg-slate-50 border border-slate-100 rounded-[20px] pl-12 pr-4 py-3.5 text-slate-800 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                  value={formData.date_acquisition}
                  onChange={(e) => setFormData({ ...formData, date_acquisition: e.target.value })}
                />
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              </div>
            </div>
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Observations</label>
            <textarea
              placeholder="Précisez les particularités du sol, l'ensoleillement ou l'historique de cette terre..."
              className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-6 py-5 text-slate-800 font-medium outline-none focus:border-emerald-500 focus:bg-white transition-all min-h-[120px] shadow-inner"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-5 bg-slate-100 text-slate-500 rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-slate-200 hover:text-slate-800 transition-all"
            >
              Ignorer
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-grow px-10 py-5 bg-[#1A4D2E] text-white rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-[#0d2a19] shadow-2xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : initialData ? (
                "Valider les modifications"
              ) : (
                "Confirmer la création"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}