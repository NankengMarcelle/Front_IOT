"use client";
import { useState, useEffect } from "react";
import { terrainService } from "../services/terrainService";
import { localiteService } from "../services/localiteService";
import { ChevronDown, MapPin, AlignLeft, TreePine, X, Sprout } from "lucide-react";
import { toast } from "sonner";

export default function TerrainForm({ initialData, onSuccess, onCancel }: any) {
  const [loading, setLoading] = useState(false);
  const [localites, setLocalites] = useState<any[]>([]);

  const [formData, setFormData] = useState(initialData ? {
    nom: initialData.nom,
    localite_id: initialData.localite_id || "",
    description: initialData.description || "",
  } : {
    nom: "",
    localite_id: "",
    description: "",
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

    if (!formData.localite_id) {
      const msg = "Veuillez sélectionner une localité.";
      toast.error(msg);
      return;
    }

    setLoading(true);
    const toastId = toast.loading(initialData ? "Mise à jour du terrain..." : "Création du terrain...");
    try {
      const terrainData: any = {
        nom: formData.nom,
        localite_id: formData.localite_id,
        description: formData.description || null,
      };

      if (initialData?.id) {
        terrainData.id = initialData.id;
      }

      await terrainService.saveTerrain(terrainData);
      toast.success(initialData ? "Terrain mis à jour !" : "Terrain créé avec succès !", { id: toastId });
      onSuccess();
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement:", error);
      const errorMsg = error.message || "Erreur lors de la sauvegarde.";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] p-8 sm:p-12 shadow-2xl border border-emerald-100 relative overflow-hidden max-w-2xl mx-auto w-full">
      {/* Decorative background element - Refined */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-2xl -ml-20 -mb-20 opacity-40 pointer-events-none" />

      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-700">
                <Sprout className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                {initialData ? "Modifier Terrain" : "Nouveau Terrain"}
              </h2>
            </div>
            <p className="text-slate-400 text-sm font-bold pl-1 uppercase tracking-widest">
              Identité de l'exploitation
            </p>
          </div>

          <button
            onClick={onCancel}
            className="group p-3 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all duration-300 transform hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Identifier Fields */}
          <div className="grid grid-cols-1 gap-8">
            {/* Nom */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <TreePine className="w-3 h-3" /> Nom du domaine
              </label>
              <div className="relative group">
                <input
                  placeholder="Ex: Plantation de la Vallée"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] px-6 py-5 text-slate-800 font-bold outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50/50 transition-all text-lg placeholder:text-slate-300"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Localité */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Localisation
              </label>
              <div className="relative group">
                <select
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] pl-6 pr-12 py-5 text-slate-800 font-bold outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50/50 transition-all appearance-none cursor-pointer text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  value={formData.localite_id}
                  onChange={(e) => setFormData({ ...formData, localite_id: e.target.value })}
                  required
                  disabled={!!initialData}
                >
                  <option value="">Sélectionner une zone</option>
                  {localites.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.nom} - {l.ville}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none group-hover:text-emerald-500 transition-colors" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <AlignLeft className="w-3 h-3" /> Description
              </label>
              <textarea
                placeholder="Détails supplémentaires sur ce terrain..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] px-6 py-5 text-slate-700 font-medium outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50/50 transition-all min-h-[140px] resize-none text-base placeholder:text-slate-300"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Info Box - Explaining Missing Fields */}
          <div className="bg-emerald-50/50 rounded-[24px] p-6 border border-emerald-100/50">
            <h4 className="text-emerald-800 font-bold text-sm mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Note Automatique
            </h4>
            <p className="text-emerald-600/80 text-xs leading-relaxed">
              La superficie, la pente et les caractéristiques du sol seront calculées automatiquement via les données des capteurs et la cartographie satellite une fois le terrain créé.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-5 bg-slate-100 text-slate-500 rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-slate-200 hover:text-slate-800 transition-all duration-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-grow px-10 py-5 bg-gradient-to-r from-[#1A4D2E] to-[#256e41] text-white rounded-[24px] font-black uppercase tracking-widest text-xs hover:shadow-xl hover:shadow-emerald-900/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>{initialData ? "Sauvegarder" : "Créer le Terrain"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}