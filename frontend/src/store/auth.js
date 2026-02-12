import { defineStore } from 'pinia';
import { authService } from '../services/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authService.getUser(),
    token: authService.getToken(),
    isAuthenticated: authService.isAuthenticated()
  }),

  actions: {
    async register(userData) {
      try {
        const response = await authService.register(userData);
        this.user = response.data.user;
        this.token = response.data.token;
        this.isAuthenticated = true;
        return response;
      } catch (error) {
        throw error;
      }
    },

    async login(credentials) {
      try {
        const response = await authService.login(credentials);
        this.user = response.data.user;
        this.token = response.data.token;
        this.isAuthenticated = true;
        return response;
      } catch (error) {
        throw error;
      }
    },

    logout() {
      authService.logout();
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
    }
  }
});
