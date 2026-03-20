import { DonnEsDeCapteursService } from "@/lib";

const PREDICTION_API_URL = process.env.NEXT_PUBLIC_PREDICTION_API_URL;

export const predictionService = {
  /**
   * Envoie une requête au backend pour analyser une parcelle avec le modèle réel
   * Utilise le nouvel endpoint qui nécessite uniquement l'ID de la parcelle
   */
  getPrediction: async (parcelId: string) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

      // Récupérer le token pour l'authentification
      const token = typeof window !== 'undefined' ? localStorage.getItem('smartagro_token') : '';

      // Appeler le nouvel endpoint qui utilise automatiquement les dernières mesures
      const response = await fetch(`${API_BASE_URL}/api/v1/recommendations/parcelle/${parcelId}/predict-crop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          region: "Centre",
          query: "Quelle culture recommandez-vous pour cette parcelle ?"
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Erreur lors de la prédiction IA");
      }

      const result = await response.json();
      console.log(result);
      const responseData = result.data || result;
      // L'API retourne un objet avec recommended_crop, confidence_score, justification, etc.
      const predictedCrop = responseData.recommended_crop || "Non déterminé";
      const confidence = responseData.confidence_score ? Math.round(responseData.confidence_score) : null;
      const justification = responseData.justification || responseData.expert_details?.final_response || "";

      return {
        culture: predictedCrop,
        raison: justification || `Culture recommandée basée sur l'analyse des données de capteurs.`,
        rendement: confidence ? `${confidence}% de confiance` : "Calculé par IA",
        mlDetails: responseData.ml_details,
        expertDetails: responseData.expert_details,
        detailedJustifications: responseData.detailed_justifications
      };
    } catch (error: any) {
      console.error("Prediction Error:", error);

      // Message d'erreur plus explicite
      if (error.message.includes('404')) {
        throw new Error("Aucune donnée de capteur disponible pour cette parcelle. Veuillez d'abord assigner un capteur et attendre les premières mesures.");
      }

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