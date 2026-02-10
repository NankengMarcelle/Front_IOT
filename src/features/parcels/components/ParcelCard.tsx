import { useState } from "react";
import {
  Edit3,
  Trash2,
  Thermometer,
  Droplets,
  FlaskConical,
  Activity,
  Cpu,
  MapPin,
  TrendingUp,
  Sparkles,
  Loader2,
  RefreshCw,
  Signal
} from "lucide-react";
import { predictionService } from "@/features/predictions/services/predictionService";
import { toast } from "sonner";
import { useConfirmDialog } from "@/components/ConfirmDialog";

export default function ParcelCard({ parcel, terrainName, onEdit, onDelete, onRefresh }: any) {
  const { confirm } = useConfirmDialog();
  const [localPrediction, setLocalPrediction] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const handleQuickPredict = async () => {
    setIsPredicting(true);
    try {
      const result: any = await predictionService.getPrediction(parcel.id);
      setLocalPrediction(result.culture);

      // Sauvegarder la prédiction dans localStorage pour persistance
      const savedPredictions = JSON.parse(localStorage.getItem('simulated_predictions') || '{}');
      savedPredictions[parcel.id] = result.culture;
      localStorage.setItem('simulated_predictions', JSON.stringify(savedPredictions));

      toast.success(`Analyse terminée : ${result.culture}`);

      // Rafraîchir les parcelles pour mettre à jour l'affichage
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la prédiction");
    } finally {
      setIsPredicting(false);
    }
  };

  const stats = {
    azote: parcel.azote || 0,
    phosphore: parcel.phosphore || 0,
    potassium: parcel.potassium || 0,
    humidite: parcel.humidite || 0,
    temperature: parcel.temperature || 0,
    ph: parcel.ph || 0
  };

  const getProgress = (value: number, max: number = 20) => {
    return `${Math.min((value / max) * 100, 100)}%`;
  };

  return (
    <div className="group bg-white rounded-[32px] md:rounded-[48px] border border-emerald-50 shadow-sm md:hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.08)] md:hover:-translate-y-4 transition-all duration-700 flex flex-col overflow-hidden relative">

      {/* Visual Header with Overlay */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#052E16] to-[#1A4D2E] z-10 opacity-90 group-hover:opacity-100 transition-opacity"></div>
        <img
          src="/strawberry-field.jpg"
          className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-[4s]"
          alt="Parcel"
        />

        <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/90">
              {parcel.code || 'Unit-Ref'}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all"
                title="Modifier"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-rose-500/50 transition-all font-black"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-black text-white tracking-tighter mb-1">{parcel.nom}</h3>
            <div className="flex items-center gap-2 text-white/60 text-[9px] font-black uppercase tracking-widest">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {terrainName} • {parcel.superficie}ha
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8 flex-grow flex flex-col">
        {parcel.hasMeasurements ? (
          <>
            {/* NPK Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { l: 'Azote', v: stats.azote, c: 'bg-emerald-500', max: 20 },
                { l: 'Phos.', v: stats.phosphore, c: 'bg-orange-500', max: 20 },
                { l: 'Potas.', v: stats.potassium, c: 'bg-purple-500', max: 20 }
              ].map((item, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-[#052E16]/40 uppercase tracking-widest italic font-serif ">{item.l}</span>
                    <span className="text-[10px] font-black text-[#052E16]">{item.v}</span>
                  </div>
                  <div className="w-full bg-slate-50 h-1 rounded-full overflow-hidden">
                    <div
                      className={`${item.c} h-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
                      style={{ width: getProgress(item.v, item.max) }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sensor Matrix */}
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {[
                { l: 'Temp Sol', v: `${stats.temperature}°C`, i: <Thermometer className="w-4 h-4" />, c: 'text-rose-500' },
                { l: 'Humidité', v: `${stats.humidite}%`, i: <Droplets className="w-4 h-4" />, c: 'text-sky-500' },
                { l: 'pH Sol', v: stats.ph, i: <FlaskConical className="w-4 h-4" />, c: 'text-amber-500' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-2.5 md:p-3 bg-emerald-50/40 rounded-2xl border border-emerald-100/50 hover:bg-white transition-colors">
                  <div className={`p-1.5 bg-white rounded-lg shadow-sm ${item.c} mb-1.5`}>
                    {item.i}
                  </div>
                  <p className="text-[7px] md:text-[8px] text-[#052E16]/40 font-black uppercase tracking-widest text-center whitespace-nowrap">{item.l}</p>
                  <p className="text-[10px] md:text-xs font-black text-[#052E16] tracking-tighter">{item.v}</p>
                </div>
              ))}
            </div>

            {/* AI Prediction Hub - Direct ML Integration */}
            <div className="relative group/pred p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-[#F8FAF9] border border-emerald-50 text-center overflow-hidden transition-all hover:bg-emerald-50 hover:border-emerald-200 shadow-sm">
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl transition-transform group-hover/pred:scale-150"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <p className="text-[9px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">IA de Recommandation</p>
                </div>

                <p className="text-3xl md:text-4xl font-black text-[#052E16] tracking-tighter drop-shadow-sm leading-none mb-4">
                  {localPrediction || parcel.culturePredite || "À analyser"}
                </p>

                {isPredicting ? (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                    <p className="text-[8px] font-black text-emerald-900/40 uppercase tracking-widest">Analyse en cours...</p>
                  </div>
                ) : (localPrediction || (parcel.culturePredite && parcel.culturePredite !== "Non définie")) ? (
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                      Prediction Optimale
                    </span>
                    <div className="flex gap-4">
                      <button
                        onClick={handleQuickPredict}
                        className="text-[8px] font-black text-emerald-900/30 uppercase tracking-widest hover:text-emerald-600 transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        Refaire l'analyse
                      </button>
                      <button
                        onClick={() => window.location.href = `/dashboard/predictions?parcelId=${parcel.id}`}
                        className="text-[8px] font-black text-emerald-900/30 uppercase tracking-widest hover:text-emerald-600 transition-colors"
                      >
                        Détails →
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleQuickPredict}
                    className="w-full bg-[#052E16] text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-emerald-900/5"
                  >
                    <Sparkles className="w-3 h-3 text-lime-400" />
                    Prédire la Culture
                  </button>
                )}
              </div>
            </div>

            {/* Hardware Status */}
            <div className="flex items-center gap-4 px-2 mt-auto">
              {parcel.capteursListe ? (
                <div className="flex items-center gap-2 w-full">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 animate-pulse">
                    <Signal className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1 bg-white border border-emerald-50 pl-3 pr-3 py-2 rounded-xl flex-grow">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
                    <span className="text-[9px] font-black text-[#052E16]/60 uppercase tracking-widest">
                      {parcel.capteursListe}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full opacity-50">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Pas de signal
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center space-y-4 min-h-[300px]">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
              <Activity className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-slate-700">Aucune mesure</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[200px]">
              Aucune donnée télémétrique reçue pour cette parcelle.
            </p>
            {parcel.capteursListe ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{parcel.capteursListe}</span>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}