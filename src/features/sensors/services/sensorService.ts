import { Sensor } from "@/types/user";
import { CapteursService, CapteurCreate, CapteurUpdate } from "@/lib";

export const sensorService = {
  /**
   * RÉCUPÉRER TOUS LES CAPTEURS
   */
  getSensors: async (): Promise<Sensor[]> => {
    try {
      // Note: Endpoint Admin uniquement selon la doc, mais on tente.
      // Si l'utilisateur n'est pas admin, cela peut échouer.
      // Il faudrait peut-être une route "mes capteurs".
      const response = await CapteursService.readCapteursApiV1CapteursGet() as any;
      const data = Array.isArray(response) ? response : (response.data || []);

      return data.map((c: any) => ({
        id: c.id,
        nom: c.nom,
        typeMesure: "Multi-parameter", // Défaut, car non présent dans Capteur
        parcelleId: undefined, // Non présent dans Capteur, il faudrait une autre requête pour savoir où il est assigné
        // code: c.code,
        // dev_eui: c.dev_eui
      }));
    } catch (error: any) {
      if (error?.status === 403 || error?.body?.status === 403) {
        console.warn("Accès aux capteurs refusé (403). Liste vide retournée.");
        return [];
      }
      console.error("Erreur getSensors:", error);
      return [];
    }
  },

  /**
   * ENREGISTRER OU MODIFIER UN CAPTEUR
   */
  saveSensor: async (sensor: any) => {
    try {
      if (sensor.id) {
        // Update
        return await CapteursService.updateCapteurApiV1CapteursCapteurIdPut(
          String(sensor.id),
          {
            nom: sensor.nom,
            // dev_eui et code ne sont pas modifiables facilement ici sans interface dédiée
          }
        );
      } else {
        // Create
        return await CapteursService.createCapteurApiV1CapteursPost({
          nom: sensor.nom,
          dev_eui: sensor.dev_eui || "0000000000000000", // Valeur par défaut si non fournie
          code: sensor.code || `SENSOR-${Date.now()}`,
          date_installation: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Erreur saveSensor:", error);
      throw error;
    }
  },

  /**
   * SUPPRIMER UN CAPTEUR
   */
  deleteSensor: async (id: number | string) => {
    try {
      await CapteursService.deleteCapteurApiV1CapteursCapteurIdDelete(String(id));
      return true;
    } catch (error) {
      console.error("Erreur deleteSensor:", error);
      throw error;
    }
  }
};