"use client";
import { useState, useEffect } from "react";
import { terrainService } from "../../terrains/services/terrainService";
import { parcelService } from "../services/parcelService";
import { sensorService } from "../../sensors/services/sensorService";
import { TypeSol, StatutParcelle, Parcelle, Terrain } from "@/types/user";
import { Info, Calendar, Tag, Activity, MapPin, Ruler, X, ChevronDown, RadioTower } from "lucide-react";

export default function ParcelForm({ initialData, onSuccess, onCancel }: any) {
  const [loading, setLoading] = useState(false);
  const [terrainsExistants, setTerrainsExistants] = useState<any[]>([]);
  const [parcellesExistantes, setParcellesExistantes] = useState<any[]>([]);
  const [capteursDisponibles, setCapteursDisponibles] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialData ? {
    nom: initialData.nom,
    superficie: initialData.superficie,
    terrain_id: initialData.terrain_id || initialData.terrainId,
    type_sol: initialData.type_sol || TypeSol.NON_SP_CIFI_,
    code: initialData.code || "",
    description: initialData.description || "",
    culture_actuelle: initialData.culture_actuelle || "",
    date_plantation: initialData.date_plantation ? new Date(initialData.date_plantation).toISOString().split('T')[0] : "",
    statut: initialData.statut || StatutParcelle.ACTIVE,
    sensor_id: initialData.sensor_id || ""
  } : {
    nom: "",
    superficie: "",
    terrain_id: "",
    type_sol: TypeSol.NON_SP_CIFI_,
    code: "",
    description: "",
    culture_actuelle: "",
    date_plantation: "",
    statut: StatutParcelle.ACTIVE,
    sensor_id: ""
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const terrainsData: any = await terrainService.getTerrains();
        setTerrainsExistants(terrainsData);

        const parcellesData: any = await parcelService.getParcelles();
        setParcellesExistantes(parcellesData);

        const capteursData: any = await sensorService.getSensors();
        setCapteursDisponibles(capteursData);
      } catch (error) {
        console.error("Error loading form data:", error);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const superficieSaisie = Number(formData.superficie);

    if (superficieSaisie <= 0) {
      setError("La superficie doit être un nombre positif.");
      return;
    }

    const terrainSelectionne = terrainsExistants.find(t => String(t.id) === String(formData.terrain_id));
    if (terrainSelectionne) {
      const surfaceOccupee = parcellesExistantes
        .filter(p => String(p.terrainId || p.terrain_id) === String(formData.terrain_id) && p.id !== initialData?.id)
        .reduce((acc, p) => acc + Number(p.superficie), 0);

      const surfaceDisponible = Number(terrainSelectionne.superficie_totale || terrainSelectionne.superficie) - surfaceOccupee;

      if (superficieSaisie > surfaceDisponible) {
        setError(surfaceDisponible <= 0
          ? "Plus d'espace disponible sur ce terrain."
          : `Espace insuffisant. Il ne reste que ${surfaceDisponible} ha disponibles.`);
        return;
      }
    }

    setLoading(true);
    try {
      const parcelData: any = {
        nom: formData.nom,
        description: formData.description || null,
        statut: formData.statut,
        superficie: Number(formData.superficie),
        culture_actuelle: formData.culture_actuelle || null,
        date_plantation: formData.date_plantation || null,
        code: formData.code || null,
        terrainId: Number(formData.terrain_id),
        type_sol: formData.type_sol,
        sensor_id: formData.sensor_id ? Number(formData.sensor_id) : null,
      };

      if (initialData?.id) {
        parcelData.id = initialData.id;
      }

      await parcelService.saveParcelle(parcelData);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la sauvegarde.");
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
              {initialData ? "Édition Parcelle" : "Nouvelle Parcelle"}
            </h2>
            <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-widest">
              Division et planification des cultures
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-3">
            <Info className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Nom */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nom de la parcelle</label>
              <div className="relative group">
                <input
                  placeholder="Ex: Secteur Nord B1"
                  className="w-full bg-slate-50 border border-slate-100 rounded-[20px] px-6 py-4.5 text-slate-800 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all text-lg shadow-inner"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Code */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Code Identification</label>
              <div className="relative group">
                <input
                  placeholder="Ex: PN-01"
                  className="w-full bg-slate-50 border border-slate-100 rounded-[24px] pl-14 pr-6 py-4.5 text-slate-800 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Superficie */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Surface (ha)</label>
              <div className="relative group">
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.0"
                  className="w-full bg-slate-50 border border-slate-100 rounded-[20px] pl-12 pr-4 py-3.5 text-slate-800 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                  value={formData.superficie}
                  onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
                  required
                />
                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              </div>
            </div>

            {/* Terrain Associé */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Domaine Parent</label>
              <div className="relative group">
                <select
                  disabled={!!initialData}
                  className={`w-full border border-slate-100 rounded-[20px] pl-12 pr-10 py-3.5 text-slate-800 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all appearance-none shadow-inner ${initialData ? 'bg-slate-200 cursor-not-allowed text-slate-500' : 'bg-slate-50 cursor-pointer'}`}
                  value={formData.terrain_id}
                  onChange={(e) => setFormData({ ...formData, terrain_id: e.target.value })}
                  required
                >
                  <option value="">Sélectionner domaine</option>
                  {terrainsExistants.map(t => (
                    <option key={t.id} value={t.id}>{t.nom}</option>
                  ))}
                </select>
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                {!initialData && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />}
              </div>
            </div>

            {/* Type de Sol */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Profil du Sol</label>
              <div className="relative group">
                <select
                  className="w-full bg-slate-50 border border-slate-100 rounded-[20px] px-4 py-3.5 text-slate-800 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer shadow-inner"
                  value={formData.type_sol}
                  onChange={(e) => setFormData({ ...formData, type_sol: e.target.value as TypeSol })}
                  required
                >
                  {Object.values(TypeSol).map(ts => (
                    <option key={ts} value={ts}>{ts.replace(/_/g, ' ')}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Capteur Assigné */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Capteur IoT (Optionnel)</label>
            <div className="relative group">
              <select
                className="w-full bg-slate-50 border border-slate-100 rounded-[20px] pl-12 pr-10 py-3.5 text-slate-800 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer shadow-inner"
                value={formData.sensor_id}
                onChange={(e) => setFormData({ ...formData, sensor_id: e.target.value })}
              >
                <option value="">Aucun capteur</option>
                {capteursDisponibles.map(capteur => (
                  <option key={capteur.id} value={capteur.id}>
                    {capteur.nom} - {capteur.type}
                  </option>
                ))}
              </select>
              <RadioTower className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
            </div>
          </div>

          {(initialData || formData.terrain_id) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-50/50 rounded-[32px] border border-slate-100">
              {/* Culture Actuelle */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Culture en cours</label>
                <input
                  placeholder="Ex: Maïs Doux"
                  className="w-full bg-white border border-slate-200 rounded-[20px] px-6 py-3.5 text-slate-800 font-bold outline-none focus:border-emerald-500 transition-all shadow-sm"
                  value={formData.culture_actuelle}
                  onChange={(e) => setFormData({ ...formData, culture_actuelle: e.target.value })}
                />
              </div>

              {/* Date Plantation */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Début Plantation</label>
                <div className="relative group">
                  <input
                    type="date"
                    className="w-full bg-white border border-slate-200 rounded-[20px] pl-12 pr-4 py-3.5 text-slate-800 font-bold outline-none focus:border-emerald-500 transition-all shadow-sm"
                    value={formData.date_plantation}
                    onChange={(e) => setFormData({ ...formData, date_plantation: e.target.value })}
                  />
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Observations Techniques</label>
            <textarea
              placeholder="Antécédents Culturaux, fumure de fond, ou contraintes spécifiques..."
              className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-6 py-5 text-slate-800 font-medium outline-none focus:border-emerald-500 focus:bg-white transition-all min-h-[100px] shadow-inner"
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
                "Confirmer la mise à jour"
              ) : (
                "Finaliser la création"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}