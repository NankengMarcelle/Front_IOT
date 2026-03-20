import { DonnEsDeCapteursService } from "@/lib";

export const sensorDataService = {
    getMeasurementsByParcelle: async (parcelleId: string) => {
        try {
            const measurementsRaw = await DonnEsDeCapteursService.getMeasurementsByParcelleApiV1SensorDataSensorDataParcelleParcelleIdGet(
                parcelleId,
                0,
                1
            ) as any;
            return Array.isArray(measurementsRaw) ? measurementsRaw : (measurementsRaw.data || []);
        } catch (error) {
            console.error("Error in sensorDataService:", error);
            return [];
        }
    }
};
