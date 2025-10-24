/**
 * Store untuk mengelola state autentikasi
 */

import { create } from 'zustand';
import { User } from '../types';
import { api, adminApi } from '../lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { name: string; email: string }) => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/login', { email, password });
      const { user, token } = response.data;

      // ✅ Simpan ke localStorage biar tidak hilang setelah refresh
      localStorage.setItem('auth_token', token);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.email?.[0] ||
        'Login gagal';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  adminLogin: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminApi.post('/admin/login', { email, password });
      const { user, token } = response.data;

      // ✅ Simpan token admin juga ke localStorage
      localStorage.setItem('admin_auth_token', token);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.email?.[0] ||
        'Login admin gagal';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: password,
      });
      const { user, token } = response.data;

      localStorage.setItem('auth_token', token);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        Object.values(error.response?.data?.errors || {})
          .flat()
          .join(', ') ||
        'Registrasi gagal';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // Coba logout dengan API yang sesuai
      const adminToken = localStorage.getItem('admin_auth_token');
      if (adminToken) {
        await adminApi.post('/admin/logout');
      } else {
        await api.post('/logout');
      }
    } catch (error) {
      console.warn('Logout API error:', error);
    } finally {
      // ✅ Bersihkan semua token
      localStorage.removeItem('auth_token');
      localStorage.removeItem('admin_auth_token');

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  updateProfile: (data) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },

  checkAuth: async () => {
    const token = localStorage.getItem('auth_token');
    const adminToken = localStorage.getItem('admin_auth_token');

    if (!token && !adminToken) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });
    try {
      // Cek admin dulu
      if (adminToken) {
        const res = await adminApi.get('/user');
        set({
          user: res.data,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }

      // Kalau bukan admin, cek user biasa
      if (token) {
        const res = await api.get('/user');
        set({
          user: res.data,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('admin_auth_token');
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
