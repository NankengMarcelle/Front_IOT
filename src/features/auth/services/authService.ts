import { AuthenticationService, LoginRequest, UsersService } from "@/lib";
import { OpenAPI } from "@/lib/core/OpenAPI";

const TOKEN_KEY = 'smartagro_token';
const USER_KEY = 'smartagro_user';

export const authService = {
    login: async (email: string, password: string) => {
        try {


            // 1. Appel au backend
            const response = await AuthenticationService.loginApiV1AuthLoginPost({
                email: email,
                password: password,
            }) as any; // Cast en any car la réponse réelle est wrappée (success, data, etc.)

            console.log("Login response:", response);

            // 2. Stockage du token
            // La réponse est sous la forme { data: { access_token: "...", ... } }
            const token = response.data?.access_token || response.access_token;

            if (token) {
                localStorage.setItem(TOKEN_KEY, token);
            } else {
                throw new Error("Token non reçu");
            }

            // 3. Récupération du profil utilisateur
            // On essaie d'abord via l'endpoint /me
            let user;
            try {
                // Petit délai pour assurer que le storage est prêt (parfois nécessaire avec des frameworks réactifs)
                await new Promise(r => setTimeout(r, 100));
                user = await UsersService.getMyProfileApiV1UsersMeGet();
            } catch (e) {
                console.warn("Impossible de récupérer le profil via /me, utilisation des données de connexion", e);
                // Si échec, on regarde si les infos user sont dans la réponse login
                user = response.data?.user || { email, role: 'AGRICULTEUR', name: 'Utilisateur' };
            }

            const userDetails = {
                ...user,
                token
            };

            localStorage.setItem(USER_KEY, JSON.stringify(userDetails));

            return userDetails;

        } catch (error: any) {
            console.error("Login Error:", error.body);
            throw new Error(error.body?.detail || "Échec de la connexion");
        }
    },

    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        window.location.href = '/login';
    },

    getToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(TOKEN_KEY);
        }
        return null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem(TOKEN_KEY);
    },

    getProfile: async () => {
        try {
            const response = await UsersService.getMyProfileApiV1UsersMeGet() as any;
            // Gérer le wrapping si nécessaire
            const user = response.data || response;
            localStorage.setItem(USER_KEY, JSON.stringify({ ...user, token: localStorage.getItem(TOKEN_KEY) }));
            return user;
        } catch (error) {
            console.error("GetProfile Error:", error);
            throw error;
        }
    },

    updateProfile: async (data: { nom?: string, prenom?: string, telephone?: string, avatar?: string }) => {
        try {
            const response = await UsersService.updateMyProfileApiV1UsersMePut({
                nom: data.nom,
                prenom: data.prenom,
                telephone: data.telephone,
                avatar: data.avatar
            }) as any;
            const user = response.data || response;
            localStorage.setItem(USER_KEY, JSON.stringify({ ...user, token: localStorage.getItem(TOKEN_KEY) }));
            return user;
        } catch (error) {
            console.error("UpdateProfile Error:", error);
            throw error;
        }
    },

    changePassword: async (oldPassword: string, newPassword: string) => {
        try {
            return await AuthenticationService.changePasswordApiV1AuthChangePasswordPost({
                old_password: oldPassword,
                new_password: newPassword
            });
        } catch (error) {
            console.error("ChangePassword Error:", error);
            throw error;
        }
    }
};
