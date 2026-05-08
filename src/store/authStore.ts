import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../api/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  serverUrl: string | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  login: (user: User, accessToken: string, serverUrl: string) => void;
  loginStart: () => void;
  loginError: (error: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      serverUrl: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      login: (user, accessToken, serverUrl) =>
        set({ user, accessToken, serverUrl, isAuthenticated: true, error: null, isLoading: false }),
      loginStart: () => set({ isLoading: true, error: null }),
      loginError: (error) => set({ isLoading: false, error }),
      logout: () =>
        set({ user: null, accessToken: null, serverUrl: null, isAuthenticated: false, error: null }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        }))
    }),
    {
      name: 'emby-auth'
    }
  )
);
