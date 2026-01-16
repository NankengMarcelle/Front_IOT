"use client";
import { useState, useEffect, useMemo } from "react";
import DashboardHeader from '@/components/layout/Header';
import DashboardFooter from '@/components/layout/Footer';
import TerrainForm from "@/features/terrains/components/TerrainForm";
import { TerrainsService } from "@/lib/services/TerrainsService";
import { useTranslation } from "@/providers/TranslationProvider";
import { 
  MapPin, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  Edit2,
  Trash2,
  Search,
  AlertCircle,
  Leaf,
  Droplets,
  Zap
} from "lucide-react";

export default function TerrainsPage() {
  const { t } = useTranslation();
  const [view, setView] = useState("list");
  const [terrains, setTerrains] = useState<any[]>([]);
  const [selectedTerrain, setSelectedTerrain] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTerrainId, setExpandedTerrainId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await TerrainsService.getAllTerrainsApiV1TerrainsTerrainsGet();
      setTerrains(data);
      setView("list");
    } catch (error) {
      console.error("Error loading terrains:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const stats = useMemo(() => {
    const totalSurface = terrains.reduce((acc, t) => acc + Number(t.superficie_totale || t.superficie || 0), 0);
    return { count: terrains.length, surface: totalSurface };
  }, [terrains]);

  // Filter terrains based on search query
  const filteredTerrains = useMemo(() => {
    if (!searchQuery.trim()) return terrains;
    return terrains.filter(t => 
      t.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.superficie?.toString() || "").includes(searchQuery)
    );
  }, [terrains, searchQuery]);

  const handleDelete = async (id: string) => {
    try {
      await TerrainsService.deleteTerrainApiV1TerrainsTerrainsTerrainIdDelete(id);
      setDeleteConfirmId(null);
      loadData();
    } catch (error) {
      console.error("Error deleting terrain:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FFFFFF" }}>
      <DashboardHeader />

      <main className="flex-grow w-full">
        {view === "form" ? (
          <div className="p-6 lg:p-12 max-w-7xl mx-auto w-full">
            <TerrainForm
              initialData={selectedTerrain}
              onSuccess={loadData}
              onCancel={() => setView("list")}
            />
          </div>
        ) : (
          <>
            {/* Top Bar Header */}
            <div className="sticky top-[60px] z-40 bg-white border-b border-gray-200 px-6 lg:px-12 py-4 shadow-sm">
              <div className="max-w-7xl mx-auto flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-[#2E7D32]">Mes Terrains</h1>
                    <p className="text-[#757575] text-sm mt-1">
                      Total : <span className="font-semibold text-[#2E7D32]">{stats.count}</span> | 
                      Surface : <span className="font-semibold text-[#2E7D32]">{stats.surface} m²</span>
                    </p>
                  </div>
                  <button
                    onClick={() => { setSelectedTerrain(null); setView("form"); }}
                    className="flex items-center gap-2 bg-[#4CAF50] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition-all duration-300 transform hover:scale-105 shadow-md"
                    aria-label="Ajouter un terrain"
                  >
                    <Plus className="w-5 h-5" />
                    Ajouter
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-[#757575]" />
                  <input
                    type="text"
                    placeholder="Rechercher un terrain par nom ou superficie..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#E8F5E9] text-gray-700 text-sm rounded-lg border border-[#4CAF50]/20 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all"
                    aria-label="Rechercher terrains"
                  />
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6 lg:p-12 max-w-7xl mx-auto w-full">
              {/* Empty State */}
              {terrains.length === 0 && !loading ? (
                <div className="text-center py-24">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                      <Leaf className="w-10 h-10 text-[#4CAF50]" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#2E7D32] mb-2">Aucun terrain ajouté</h3>
                  <p className="text-[#757575] mb-6">Cliquez sur "+ Ajouter" pour commencer à gérer vos terrains.</p>
                  <button
                    onClick={() => { setSelectedTerrain(null); setView("form"); }}
                    className="inline-flex items-center gap-2 bg-[#4CAF50] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2E7D32] transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Ajouter un premier terrain
                  </button>
                </div>
              ) : filteredTerrains.length === 0 ? (
                <div className="text-center py-16">
                  <AlertCircle className="w-12 h-12 text-[#757575] mx-auto mb-4 opacity-50" />
                  <p className="text-[#757575]">Aucun résultat pour "{searchQuery}"</p>
                </div>
              ) : (
                /* Terrain Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTerrains.map((terrain) => (
                    <TerrainCard
                      key={terrain.id}
                      terrain={terrain}
                      isExpanded={expandedTerrainId === terrain.id}
                      onToggleExpand={() => setExpandedTerrainId(expandedTerrainId === terrain.id ? null : terrain.id)}
                      onEdit={() => { setSelectedTerrain(terrain); setView("form"); }}
                      onDelete={() => setDeleteConfirmId(terrain.id)}
                      isDeleteConfirming={deleteConfirmId === terrain.id}
                      onConfirmDelete={() => handleDelete(terrain.id)}
                      onCancelDelete={() => setDeleteConfirmId(null)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <DashboardFooter />
    </div>
  );
}

interface TerrainCardProps {
  terrain: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleteConfirming: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

function TerrainCard({
  terrain,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  isDeleteConfirming,
  onConfirmDelete,
  onCancelDelete,
}: TerrainCardProps) {
  // Mock data for soil health and predictions
  const mockSoilHealth = {
    N: Math.floor(Math.random() * 60) + 20,
    P: Math.floor(Math.random() * 40) + 10,
    K: Math.floor(Math.random() * 50) + 15
  };

  const mockPrediction = "Maïs";

  const getSoilIndicatorColor = (value: number) => {
    if (value >= 50) return "bg-[#4CAF50]";
    if (value >= 30) return "bg-[#FFEB3B]";
    return "bg-[#FF6B6B]";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center">
            <MapPin className="w-6 h-6 text-[#4CAF50]" />
          </div>
          <button
            onClick={onToggleExpand}
            className="text-[#757575] hover:text-[#4CAF50] transition-colors"
            aria-label={isExpanded ? "Réduire" : "Développer"}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>

        <h3 className="text-lg font-bold text-[#2E7D32] mb-2">{terrain.nom}</h3>
        {(terrain.ville || terrain.quartier) && (
          <p className="text-xs text-[#757575] mb-4">
            {[terrain.ville, terrain.quartier].filter(Boolean).join(", ")}
          </p>
        )}

        {/* Superficie Display */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm font-medium text-[#757575]">Superficie</span>
          <span className="text-lg font-bold text-[#4CAF50]">{terrain.superficie} m²</span>
        </div>
      </div>

      {/* Expandable Section */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-[#F1F8F6] p-6 space-y-4">
          {/* Soil Status */}
          <div>
            <p className="text-sm font-semibold text-[#2E7D32] mb-3 flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              Statut du Sol
            </p>
            <div className="space-y-2">
              {Object.entries(mockSoilHealth).map(([nutrient, value]) => (
                <div key={nutrient}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#757575]">{nutrient}</span>
                    <span className="text-xs font-bold text-[#2E7D32]">{value}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${getSoilIndicatorColor(value)}`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Prediction */}
          <div>
            <p className="text-sm font-semibold text-[#2E7D32] mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Dernière Prédiction
            </p>
            <p className="text-sm bg-white rounded-lg p-3 text-[#2E7D32] font-medium border border-[#4CAF50]/20">
              Culture optimale: <span className="font-bold">{mockPrediction}</span>
            </p>
          </div>

          {/* Sensor Count */}
          <div>
            <p className="text-sm font-semibold text-[#2E7D32] mb-2 flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Capteurs LoRaWAN
            </p>
            <p className="text-sm text-[#757575]">
              <span className="font-bold text-[#4CAF50]">3</span> capteurs actifs • Signal bon
            </p>
          </div>
        </div>
      )}

      {/* Card Footer - Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
        {isDeleteConfirming ? (
          <>
            <p className="text-sm text-[#757575] mr-auto pt-1">Confirmer la suppression?</p>
            <button
              onClick={onCancelDelete}
              className="px-4 py-2 text-sm font-medium text-[#2E7D32] hover:bg-[#E8F5E9] rounded-lg transition-colors"
              aria-label="Annuler la suppression"
            >
              Annuler
            </button>
            <button
              onClick={onConfirmDelete}
              className="px-4 py-2 text-sm font-bold text-white bg-[#FF6B6B] hover:bg-red-600 rounded-lg transition-colors"
              aria-label="Confirmer la suppression"
            >
              Supprimer
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onEdit}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#4CAF50] hover:text-[#2E7D32] hover:bg-[#E8F5E9] rounded-lg transition-colors"
              title="Modifier ce terrain"
              aria-label="Modifier"
            >
              <Edit2 className="w-4 h-4" />
              Modifier
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#FF6B6B] hover:bg-red-50 rounded-lg transition-colors"
              title="Supprimer ce terrain"
              aria-label="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </>
        )}
      </div>
    </div>
  );
}