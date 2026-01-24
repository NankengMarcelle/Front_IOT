import { DonnEsDeCapteursService } from "@/lib";

const PREDICTION_API_URL = process.env.NEXT_PUBLIC_PREDICTION_API_URL || 'https://crops-predictions.onrender.com';

export const predictionService = {
  /**
   * Envoie une requête au backend pour analyser une parcelle avec le modèle réel
   */
  getPrediction: async (parcelId: string) => {
    try {
      // 1. Récupérer les dernières mesures de la parcelle
      const measurementsRaw = await DonnEsDeCapteursService.getMeasurementsByParcelleApiV1SensorDataSensorDataParcelleParcelleIdGet(
        parcelId,
        0,
        1
      ) as any;
      const measurements = Array.isArray(measurementsRaw) ? measurementsRaw : (measurementsRaw.data || []);

      if (!measurements || measurements.length === 0) {
        throw new Error("Aucune donnée de capteur disponible pour cette parcelle. Veuillez d'abord assigner un capteur et attendre les premières mesures.");
      }

      const lastData = measurements[0];

      // 2. Préparer le payload pour l'API de prédiction
      // L'API attend : N, P, K, temperature, humidity, ph
      const sample = {
        N: lastData.azote || 0,
        P: lastData.phosphore || 0,
        K: lastData.potassium || 0,
        temperature: lastData.temperature || 0,
        humidity: lastData.humidity || 0,
        ph: lastData.ph || 6.5 // Valeur par défaut si non disponible
      };

      // 3. Appeler l'API réelle via proxy (/api/predict)
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ samples: [sample] })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erreur lors de la prédiction IA");
      }

      const result = await response.json();

      // L'API retourne un objet avec recommended_crop, confidence, etc.
      // Format: { recommended_crop: 'haricot', confidence: 1, ... }
      const predictedCrop = result.recommended_crop || result[0] || "Non déterminé";
      const confidence = result.confidence ? Math.round(result.confidence * 100) : null;

      return {
        culture: predictedCrop,
        raison: `Basé sur les niveaux de NPK (${sample.N}-${sample.P}-${sample.K}), la température (${sample.temperature}°C) et l'humidité (${sample.humidity}%) détectés.`,
        rendement: confidence ? `${confidence}% de confiance` : "Calculé par IA"
      };
    } catch (error: any) {
      console.error("Prediction Error:", error);
      throw error;
    }
  },

  /**
   * Enregistre la culture choisie (simulé pour l'instant via localStorage ou API backend si disponible)
   */
  applyCulture: async (parcelId: string, culture: string) => {
    const stock = JSON.parse(localStorage.getItem('simulated_predictions') || '{}');
    stock[parcelId] = culture;
    localStorage.setItem('simulated_predictions', JSON.stringify(stock));
    return true;
  }
};