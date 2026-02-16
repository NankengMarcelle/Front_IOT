"use client";
import { useState, useEffect, useMemo } from "react";
import { terrainService } from "../../terrains/services/terrainService";
import { parcelService } from "../services/parcelService";
import { Tag, MapPin, Ruler, X, ChevronDown, AlignLeft, Sprout } from "lucide-react";
import { toast } from "sonner";

export default function ParcelForm({ initialData, onSuccess, onCancel }: any) {
  const [loading, setLoading] = useState(false);
  const [terrainsExistants, setTerrainsExistants] = useState<any[]>([]);
  const [existingParcels, setExistingParcels] = useState<any[]>([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(initialData ? {
    nom: initialData.nom,
    superficie: initialData.superficie,
    terrain_id: initialData.terrain_id || initialData.terrainId,
    description: initialData.description || "",
  } : {
    nom: "",
    superficie: "",
    terrain_id: "",
    description: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const terrainsData: any = await terrainService.getTerrains();
        setTerrainsExistants(terrainsData);
      } catch (error) {
        console.error("Error loading form data:", error);
      }
    };
    loadData();
  }, []);

  // Fetch existing parcels when a terrain is selected to calculate remaining surface
  useEffect(() => {
    const fetchParcels = async () => {
      if (!formData.terrain_id) {
        setExistingParcels([]);
        return;
      }
      try {
        const parcels = await parcelService.getParcelsByTerrain(formData.terrain_id);
        setExistingParcels(Array.isArray(parcels) ? parcels : (parcels as any).data || []);
      } catch (err) {
        console.error("Error fetching parcels for terrain:", err);
      }
    };
    fetchParcels();
  }, [formData.terrain_id]);

  const terrainStats = useMemo(() => {
    if (!formData.terrain_id) return null;
    const terrain = terrainsExistants.find(t => t.id === formData.terrain_id);
    if (!terrain) return null;

    const terrainSurface = Number(terrain.superficie || 0);
    // Sum of existing parcels EXCEPT the one currently being edited (if editing)
    const existingOccupied = existingParcels
      .filter(p => !initialData || p.id !== initialData.id)
      .reduce((sum, p) => sum + Number(p.superficie || 0), 0);

    const remaining = Math.max(0, terrainSurface - existingOccupied);

    return {
      total: terrainSurface,
      occupied: existingOccupied,
      remaining: remaining
    };
  }, [formData.terrain_id, terrainsExistants, existingParcels, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const superficieSaisie = Number(formData.superficie);

    if (superficieSaisie <= 0) {
      setError("La superficie doit être un nombre positif.");
      return;
    }

    if (terrainStats && superficieSaisie > terrainStats.remaining) {
      setError(`La superficie dépasse l'espace disponible (${terrainStats.remaining.toFixed(2)} Ha restants sur ${terrainStats.total} Ha).`);
      return;
    }

    setLoading(true);
    const toastId = toast.loading(initialData?.id ? "Mise à jour de la parcelle..." : "Création de la parcelle...");
    try {
      const parcelData: any = {
        nom: formData.nom,
        description: formData.description || null,
        superficie: Number(formData.superficie),
        terrainId: String(formData.terrain_id),
      };

      if (initialData?.id) {
        parcelData.id = initialData.id;
      }
      console.log("Données de la parcelle à sauvegarder:", parcelData);
      await parcelService.saveParcelle(parcelData);
      console.log("Parcelle sauvegardée avec succès.");
      toast.success(initialData?.id ? "Parcelle mise à jour !" : "Parcelle créée !", { id: toastId });
      onSuccess();
    } catch (err: any) {
      console.error("Erreur saveParcelle", err);
      const errorMsg = err.message || "Une erreur est survenue lors de la sauvegarde.";
      setError(errorMsg);
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-12 shadow-2xl border border-emerald-100 relative overflow-hidden max-w-2xl mx-auto w-full">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-50 to-lime-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-2xl -ml-20 -mb-20 opacity-40 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-700">
                <Sprout className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                {initialData ? "Modifier Parcelle" : "Nouvelle Parcelle"}
              </h2>
            </div>
            <p className="text-slate-400 text-sm font-bold pl-1 uppercase tracking-widest">
              Division et planification
            </p>
          </div>
          <button
            onClick={onCancel}
            className="group p-3 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all duration-300 transform hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-3 animate-pulse">
            <div className="w-2 h-2 bg-rose-500 rounded-full" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8">

            {/* Terrain Associé */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Domaine Parent
              </label>
              <div className="relative group">
                <select
                  disabled={!!initialData}
                  className={`w-full border-2 border-slate-100 rounded-[24px] pl-6 pr-12 py-5 text-slate-800 font-bold outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50/50 transition-all appearance-none text-lg ${initialData ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'bg-slate-50 cursor-pointer'}`}
                  value={formData.terrain_id}
                  onChange={(e) => setFormData({ ...formData, terrain_id: e.target.value })}
                  required
                >
                  <option value="">Sélectionner domaine</option>
                  {terrainsExistants.map(t => (
                    <option key={t.id} value={t.id}>{t.nom}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none group-hover:text-emerald-500 transition-colors" />
              </div>

              {/* Surface info feedback */}
              {formData.terrain_id && terrainStats && (
                <div className="ml-2 flex items-center gap-2 text-xs font-bold">
                  <span className="text-slate-400">Surface Terrain: {terrainStats.total} Ha</span>
                  <span className="text-slate-300">•</span>
                  <span className={terrainStats.remaining < 1 ? "text-amber-500" : "text-emerald-500"}>
                    Disponible: {terrainStats.remaining.toFixed(2)} Ha
                  </span>
                </div>
              )}
            </div>

            {/* Nom */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nom de la parcelle</label>
              <div className="relative group">
                <input
                  placeholder="Ex: Secteur Nord B1"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] px-6 py-5 text-slate-800 font-bold outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50/50 transition-all text-lg"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Superficie */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <Ruler className="w-3 h-3" /> Surface (ha)
              </label>
              <div className="relative group">
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.0"
                  className={`w-full bg-slate-50 border-2 rounded-[24px] px-6 py-5 text-slate-800 font-bold outline-none focus:bg-white focus:ring-4 transition-all text-lg ${terrainStats && Number(formData.superficie) > terrainStats.remaining
                    ? 'border-rose-200 focus:border-rose-500 focus:ring-rose-50/50 text-rose-600'
                    : 'border-slate-100 focus:border-emerald-500 focus:ring-emerald-50/50'
                    }`}
                  value={formData.superficie}
                  onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
                  required
                />
              </div>
              {terrainStats && Number(formData.superficie) > terrainStats.remaining && (
                <p className="text-rose-500 text-xs font-bold ml-2 mt-1">
                  Attention : Dépasse la surface disponible ({terrainStats.remaining.toFixed(2)} Ha)
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <AlignLeft className="w-3 h-3" /> Observations
              </label>
              <textarea
                placeholder="Notes techniques..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] px-6 py-5 text-slate-700 font-medium outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50/50 transition-all min-h-[120px] resize-none text-base"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Info Box */}
            <div className="bg-emerald-50/50 rounded-[24px] p-6 border border-emerald-100/50">
              <h4 className="text-emerald-800 font-bold text-sm mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Données Agronomiques
              </h4>
              <p className="text-emerald-600/80 text-xs leading-relaxed">
                Les informations sur les cultures, le type de sol et les dates de plantation sont gérées via le module "Suivi de Culture" et les capteurs IoT connectés.
              </p>
            </div>

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
                <span>{initialData ? "Sauvegarder" : "Créer la Parcelle"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}