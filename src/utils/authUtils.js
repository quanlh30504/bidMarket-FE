import { authService} from "../services/authService";
export const authUtils = {
    getCurrentUserId: () => {
        const token = localStorage.getItem(authService.tokenKey);
        return token ? authService.decodeToken(token).sub : null;
    },

    isAuthenticated: () => {
        const token = localStorage.getItem(authService.tokenKey);
        return token && !authService.isTokenExpired(token);
    }
};