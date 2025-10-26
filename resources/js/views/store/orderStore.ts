/**
 * Store untuk mengelola state order dan checkout (Laravel Sanctum ready)
 */

import { create } from 'zustand';
import { Order } from '../types';
import { api } from '../lib/api';

interface OrderStore {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchOrders: () => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  createOrder: (orderData: any) => Promise<Order | null>;
  getOrder: (id: string) => Promise<Order | null>;
  cancelOrder: (id: string) => Promise<boolean>;
  clearError: () => void;
}

const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  // 🔹 Ambil daftar pesanan pengguna
  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/v1/orders');
      set({ orders: response.data.data?.data || response.data.data || [], loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Gagal mengambil pesanan.',
        loading: false,
      });
    }
  },

  // 🔹 Ambil semua pesanan untuk admin
  fetchAllOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/v1/admin/orders');
      set({ orders: response.data.data?.data || response.data.data || [], loading: false });
    } catch (error: any) {
      // If admin token is invalid, try to refresh or handle gracefully
      if (error.response?.status === 401) {
        // Clear invalid admin token
        localStorage.removeItem('admin_auth_token');
        sessionStorage.removeItem('admin_auth_token');
        set({
          error: 'Sesi admin telah berakhir. Silakan login kembali.',
          loading: false,
        });
      } else {
        set({
          error: error.response?.data?.message || 'Gagal mengambil semua pesanan.',
          loading: false,
        });
      }
    }
  },

  // 🔹 Buat pesanan baru
  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/v1/orders', {
        ...orderData,
        items: orderData.items.map((item: any) => ({
          ...item,
          product_id: parseInt(item.product_id) // Ensure product_id is integer
        }))
      });

      set({ loading: false });
      return response.data.data || response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Gagal membuat pesanan.',
        loading: false,
      });
      return null;
    }
  },

  // 🔹 Ambil detail pesanan berdasarkan ID
  getOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/v1/orders/${id}`);
      set({ currentOrder: response.data.data, loading: false });
      return response.data.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Gagal mengambil detail pesanan.',
        loading: false,
      });
      return null;
    }
  },

  // 🔹 Batalkan pesanan
  cancelOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/v1/orders/${id}/cancel`, { status: 'cancelled' });

      const { orders } = get();
      const updatedOrders = orders.map((order) =>
        order.id === id ? response.data.data : order
      );

      set({ orders: updatedOrders, loading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Gagal membatalkan pesanan.',
        loading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export { useOrderStore };
