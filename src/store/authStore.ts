import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth.service';
import { User } from '../types/auth';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOAuthLogin: (provider?: string) => Promise<void>;
  restoreSession: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (message: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      login: async (email, password) => {
        set({ loading: true, error: null });

        try {
          const response = await authService.login(email, password);
          set({
            user: response.user,
            accessToken: response.accessToken,
            isAuthenticated: true,
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Login failed.';
          set({ error: message });
          throw new Error(message);
        } finally {
          set({ loading: false });
        }
      },
      register: async (name, email, password) => {
        set({ loading: true, error: null });

        try {
          const response = await authService.register(name, email, password);
          set({
            user: response.user,
            accessToken: response.accessToken,
            isAuthenticated: true,
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Registration failed.';
          set({ error: message });
          throw new Error(message);
        } finally {
          set({ loading: false });
        }
      },
      logout: async () => {
        set({ user: null, accessToken: null, isAuthenticated: false, error: null });
        await authService.logout();
      },
      completeOAuthLogin: async (provider = 'google') => {
        set({ loading: true, error: null });

        try {
          const response = await authService.completeOAuthLogin(provider);
          set({
            user: response.user,
            accessToken: response.accessToken,
            isAuthenticated: true,
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : 'OAuth login failed.';
          set({ error: message });
          throw new Error(message);
        } finally {
          set({ loading: false });
        }
      },
      restoreSession: async () => {
        set({ loading: true, error: null });

        try {
          const currentUser = await authService.me();
          set({
            user: currentUser,
            isAuthenticated: true,
          });
        } catch {
          set({ user: null, accessToken: null, isAuthenticated: false });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'fullstack-auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
