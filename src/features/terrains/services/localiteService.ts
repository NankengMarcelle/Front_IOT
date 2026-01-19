export const localiteService = {
    getAllLocalites: async () => {
        return new Promise<any[]>((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: "1", pays: "Cameroun", ville: "Yaoundé", quartier: "Melen" },
                    { id: "2", pays: "Cameroun", ville: "Douala", quartier: "Akwa" },
                    { id: "3", pays: "Cameroun", ville: "Bafoussam", quartier: "Tam-Tam" },
                ]);
            }, 300);
        });
    }
};
