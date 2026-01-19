import { LocalitSService, LocaliteResponse } from "@/lib";

export const localiteService = {
    getAllLocalites: async (): Promise<LocaliteResponse[]> => {
        try {
            const response = await LocalitSService.getAllLocalitesApiV1LocalitesLocalitesGet() as any;
            const data = Array.isArray(response) ? response : (response.data || []);
            return data;
        } catch (error) {
            console.error("Erreur getAllLocalites:", error);
            throw error;
        }
    }
};
