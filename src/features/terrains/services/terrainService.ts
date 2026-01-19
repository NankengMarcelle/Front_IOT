import { Terrain } from "@/types/user";
import { TerrainsService, TerrainResponse, TerrainCreate } from "@/lib";
import { localiteService } from "./localiteService";

export const terrainService = {

  // ==========================================
  // LOGIQUE BACKEND RÉELLE (API)
  // ==========================================
  getTerrains: async (): Promise<Terrain[]> => {
    try {
      const [terrainsResponse, localites] = await Promise.all([
        TerrainsService.getAllTerrainsApiV1TerrainsTerrainsGet() as any,
        localiteService.getAllLocalites()
      ]);

      const terrainsData = Array.isArray(terrainsResponse) ? terrainsResponse : (terrainsResponse.data || []);

      // MAPPING: Adapter TerrainResponse vers le type Terrain du frontend
      return terrainsData.map((t: any) => {
        const localite = localites.find((l: any) => l.id === t.localite_id);

        return {
          id: t.id,
          localite_id: t.localite_id,
          description: t.description,
          nom: t.nom,
          superficie: 0, // Pas disponible dans TerrainResponse
          pays: localite?.pays || "Non défini",
          ville: localite?.ville || "Non défini",
          quartier: localite?.nom || "Non défini", // On utilise le nom de la localité comme quartier/zone
          nombre_parcelles: t.nombre_parcelles || 0,
          created_at: t.created_at
        };
      });
    } catch (error) {
      console.error("Erreur getTerrains:", error);
      throw error;
    }
  },

  saveTerrain: async (terrain: any) => {
    try {
      if (terrain.id) {
        // Update
        return await TerrainsService.updateTerrainApiV1TerrainsTerrainsTerrainIdPut(
          String(terrain.id),
          {
            nom: terrain.nom,
            description: terrain.description,
            // Autres champs update
          }
        );
      } else {
        // Create
        return await TerrainsService.createTerrainApiV1TerrainsTerrainsPost({
          nom: terrain.nom,
          description: terrain.description || "Nouveau terrain",
          localite_id: terrain.localite_id,
        });
      }
    } catch (error) {
      console.error("Erreur saveTerrain:", error);
      throw error;
    }
  },

  deleteTerrain: async (id: number | string) => {
    try {
      await TerrainsService.deleteTerrainApiV1TerrainsTerrainsTerrainIdDelete(String(id));
      return true;
    } catch (error) {
      console.error("Erreur deleteTerrain:", error);
      throw error;
    }
  }
};