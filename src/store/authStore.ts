import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '@/services/api/client';
import type { AuthStore } from '@/types/auth';

/**
 * Authentication Store
 *
 * Manages authentication state including API URL and API Key
 * Persists data to localStorage
 */

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      apiUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8082',
      apiKey: '',
      isAuthenticated: false,

      // Login method - validates connection and stores credentials
      login: async (apiUrl: string, apiKey: string) => {
        try {
          // Remove trailing slash from URL
          const cleanUrl = apiUrl.replace(/\/$/, '');

          // Test connection to Evolution GO API using /server/ok endpoint
          const response = await apiClient.get('/server/ok', {
            baseURL: cleanUrl,
            headers: {
              apikey: apiKey,
            },
          });

          // If successful, store credentials
          if (response.status === 200 && response.data?.status === 'ok') {
            set({
              apiUrl: cleanUrl,
              apiKey,
              isAuthenticated: true,
            });
          } else {
            throw new Error('Falha ao conectar com a API');
          }
        } catch (error) {
          console.error('Login error:', error);
          throw new Error(
            'Não foi possível conectar. Verifique a URL e API Key.'
          );
        }
      },

      // Logout method - clears credentials and localStorage
      logout: () => {
        // Reset state
        set({
          apiUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8082',
          apiKey: '',
          isAuthenticated: false,
        });
        // The redirect will be handled by the protected route logic in App.tsx
      },

      // Update API URL
      setApiUrl: (apiUrl: string) => {
        set({ apiUrl: apiUrl.replace(/\/$/, '') });
      },

      // Update API Key
      setApiKey: (apiKey: string) => {
        set({ apiKey });
      },
    }),
    {
      name: 'evolution-auth', // localStorage key
      partialize: (state) => ({
        apiUrl: state.apiUrl,
        apiKey: state.apiKey,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
