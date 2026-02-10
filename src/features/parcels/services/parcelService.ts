import { Parcelle } from "@/types/user";
import { ParcellesService, TerrainsService, DonnEsDeCapteursService, CapteursService, ParcelleCreate, ParcelleUpdate, SensorMeasurementsResponse } from "@/lib";

export const parcelService = {

    /**
     * RÉCUPÉRER TOUTES LES PARCELLES
     * Stratégie : Récupérer les terrains, puis pour chaque terrain récupérer ses parcelles
     */
    getParcelles: async (): Promise<Parcelle[]> => {
        try {
            console.log("Fetching parcelles: Step 1 - Get Terrains");
            // 1. Récupérer les terrains
            const terrainsResponse = await TerrainsService.getAllTerrainsApiV1TerrainsTerrainsGet() as any;
            const terrains = Array.isArray(terrainsResponse) ? terrainsResponse : (terrainsResponse.data || []);
            console.log(`Fetching parcelles: Found ${terrains.length} terrains`);

            let allParcels: Parcelle[] = [];

            // 2. Pour chaque terrain, récupérer les parcelles
            for (const terrain of terrains) {
                try {
                    console.log(`Fetching parcels for terrain: ${terrain.nom} (${terrain.id})`);
                    const parcellesRaw = await ParcellesService.getParcellesByTerrainApiV1ParcellesParcellesTerrainTerrainIdGet(terrain.id) as any;
                    const parcellesResponse = Array.isArray(parcellesRaw) ? parcellesRaw : (parcellesRaw.data || []);

                    const enrichedParcels = await Promise.all(parcellesResponse.map(async (p: any) => {
                        // 3. Enrichir avec les données de capteurs (Dernière mesure)
                        let stats: Partial<SensorMeasurementsResponse> = {};
                        try {
                            const measurementsRaw = await DonnEsDeCapteursService.getMeasurementsByParcelleApiV1SensorDataSensorDataParcelleParcelleIdGet(
                                p.id,
                                0,
                                1
                            ) as any;
                            const measurements = Array.isArray(measurementsRaw) ? measurementsRaw : (measurementsRaw.data || []);

                            if (measurements && measurements.length > 0) {
                                stats = measurements[0];
                            }
                        } catch (e) {
                            // Pas de mesure ou 403, on ignore
                        }

                        // 4. Capteurs: On n'affiche plus l'ID du capteur, mais un statut si des données remonte
                        const capteursListe = stats.id ? "Monitoring Actif" : "";

                        // 5. Récupérer la culture éventuellement enregistrée localement
                        const savedPredictions = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem('simulated_predictions') || '{}' : '{}');
                        const savedCulture = savedPredictions[p.id];

                        return {
                            id: p.id,
                            nom: p.nom,
                            superficie: p.superficie,
                            terrainId: terrain.id,
                            code: p.code || 'N/A',
                            description: p.description,
                            azote: stats.azote || 0,
                            phosphore: stats.phosphore || 0,
                            potassium: stats.potassium || 0,
                            humidite: stats.humidity || 0,
                            temperature: stats.temperature || 0,
                            ph: stats.ph || 0,
                            culturePredite: savedCulture || "Non définie",
                            hasMeasurements: !!(stats.id),
                            capteursListe: capteursListe
                        };
                    }));

                    allParcels = [...allParcels, ...enrichedParcels];
                } catch (err) {
                    console.error(`Erreur lors de la récupération des parcelles pour terrain ${terrain.id} (${terrain.nom}):`, err);
                    // On continue vers le prochain terrain sans crasher
                }
            }

            return allParcels;

        } catch (error) {
            console.error("Erreur getParcelles:", error);
            throw error;
        }
    },

    /**
     * ENREGISTRER OU MODIFIER UNE PARCELLE
     */
    saveParcelle: async (parcelle: Parcelle) => {
        try {
            if (parcelle.id && typeof parcelle.id === 'string' && parcelle.id.length > 10) {
                // Update: Seulement nom, description, superficie supportés par ParcelleUpdate
                return await ParcellesService.updateParcelleApiV1ParcellesParcellesParcelleIdPut(
                    String(parcelle.id),
                    {
                        nom: parcelle.nom,
                        description: parcelle.description || "Mis à jour via Frontend",
                        superficie: parcelle.superficie
                    }
                );
            } else {
                // Create
                return await ParcellesService.createParcelleApiV1ParcellesParcellesPost({
                    nom: parcelle.nom,
                    terrain_id: String(parcelle.terrainId),
                    superficie: parcelle.superficie,
                    description: parcelle.description || "Créé via Frontend",
                    code: parcelle.code || null
                });
            }
        } catch (error) {
            console.error("Erreur saveParcelle:", error);
            throw error;
        }
    },

    /**
     * SUPPRIMER UNE PARCELLE
     */
    deleteParcelle: async (id: number | string) => {
        try {
            await ParcellesService.deleteParcelleApiV1ParcellesParcellesParcelleIdDelete(String(id));
            return true;
        } catch (error) {
            console.error("Erreur deleteParcelle:", error);
            throw error;
        }
    },

    /**
     * MISE À JOUR PARTIELLE (PATCH)
     */
    updateParcel: async (id: string | number, data: Partial<Parcelle>) => {
        try {
            // On utilise Update qui est un PUT dans ce SDK, donc il faut envoyer l'objet partiel
            // Si l'API supporte le PATCH partiel. Le SDK a `ParcelleUpdate` ou `ParcelleCreate`.
            // `ParcelleUpdate` a les champs optionnels (nullable) dans le modèle.
            return await ParcellesService.updateParcelleApiV1ParcellesParcellesParcelleIdPut(
                String(id),
                {
                    nom: data.nom,
                    superficie: data.superficie
                    // Autres champs si nécessaire
                }
            );
        } catch (error) {
            console.error("Erreur updateParcel:", error);
            throw error;
        }
    },

    /**
     * RÉCUPÉRER PARCELLES PAR TERRAIN
     */
    getParcelsByTerrain: async (terrainId: string) => {
        try {
            return await ParcellesService.getParcellesByTerrainApiV1ParcellesParcellesTerrainTerrainIdGet(terrainId);
        } catch (error) {
            console.error("Erreur getParcelsByTerrain:", error);
            throw error;
        }
    }
};