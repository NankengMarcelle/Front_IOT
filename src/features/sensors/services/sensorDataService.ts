export const sensorDataService = {
    getMeasurementsByParcelle: async (parcelleId: number) => {
        return new Promise<any[]>((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        azote: 15,
                        phosphore: 10,
                        potassium: 20,
                        temperature: 24,
                        humidity: 60,
                        ph: 6.5,
                        timestamp: new Date().toISOString()
                    }
                ]);
            }, 500);
        });
    }
};
