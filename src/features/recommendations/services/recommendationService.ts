const EXPERT_API_URL = process.env.NEXT_PUBLIC_EXPERT_SYSTEM_API_URL || 'http://10.179.122.83:5000';

export const recommendationService = {
  /**
   * Récupère les recommandations initiales des agents IA via le système expert
   */
  getRecommendations: async (parcelId: string, culture: string) => {
    try {
      // Utiliser la culture fournie ou demander des recommandations générales
      const cultureName = culture && culture !== "Non définie" ? culture : "cultures maraîchères";
      const query = `Donne-moi des recommandations agronomiques pour une parcelle de ${cultureName}.`;

      const response = await fetch('/api/expert-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur ${response.status} lors de la récupération des conseils`);
      }

      const data = await response.json();

      // On retourne un tableau formaté pour l'UI, avec la réponse du système expert
      return [
        {
          agent: "Système Expert",
          role: "Agronome",
          message: data.final_response || "Aucune recommandation disponible pour le moment.",
          status: "success",
          type: "bot"
        }
      ];
    } catch (error: any) {
      // Retourner un message d'erreur convivial au lieu de throw
      return [
        {
          agent: "Système",
          role: "Info",
          message: "Le système expert est temporairement indisponible. Vous pouvez toujours poser vos questions dans le chat ci-dessous.",
          status: "warning",
          type: "bot"
        }
      ];
    }
  },

  /**
   * Envoie une question spécifique de l'utilisateur au chat IA (Système Expert)
   * Utilise une route API proxy pour éviter les problèmes CORS
   */
  askQuestion: async (parcelId: string, question: string, culturePredite?: string) => {
    try {
      // Enrichir la question avec le contexte de la culture si disponible
      let enrichedQuery = question;
      if (culturePredite && culturePredite !== "Non définie" && culturePredite !== "À analyser") {
        enrichedQuery = `Pour une parcelle cultivant du ${culturePredite}: ${question}`;
      }

      const response = await fetch('/api/expert-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: enrichedQuery })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur ${response.status}: Impossible de contacter le système expert`);
      }

      const data = await response.json();

      return {
        agent: "Système Expert",
        message: data.final_response || "Je n'ai pas pu générer de réponse spécifique.",
        status: "info"
      };
    } catch (error: any) {

      // Gestion d'erreur plus détaillée
      if (error.message?.includes('Failed to fetch')) {
        throw new Error("Impossible de contacter le serveur. Vérifiez votre connexion internet.");
      }

      throw error;
    }
  },

  /**
   * Récupère l'historique des recommandations (Simulé)
   */
  getRecommendationsHistory: async () => {
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 500);
    });
  }
};
