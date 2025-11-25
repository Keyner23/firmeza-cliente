// src/stores/auth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/api/auth';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(null);

  // Computed
  const isAuthenticated = computed(() => !!token.value);

  // Cargar usuario desde el token
  const loadUserFromToken = () => {
    if (token.value) {
      try {
        const decoded = jwtDecode(token.value);
        user.value = {
          id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
          email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
          name: decoded.name
        };
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      token.value = response.token;
      localStorage.setItem('token', response.token);
      loadUserFromToken();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Error al iniciar sesión' 
      };
    }
  };

  // Logout
  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  };

  // Inicializar
  loadUserFromToken();

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout
  };
});