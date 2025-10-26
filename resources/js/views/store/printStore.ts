/**
 * Store untuk mengelola state print orders
 */

import { create } from 'zustand';
import { PrintOrder } from '../types';
import { api } from '../lib/api';

interface PrintStore {
  printOrders: PrintOrder[];
  currentPrintOrder: PrintOrder | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchPrintOrders: () => Promise<void>;
  createPrintOrder: (printData: any) => Promise<PrintOrder | null>;
  getPrintOrder: (id: string) => Promise<PrintOrder | null>;
  updatePaymentStatus: (id: string, status: string) => Promise<boolean>;
  clearError: () => void;
}

const usePrintStore = create<PrintStore>((set, get) => ({
  printOrders: [],
  currentPrintOrder: null,
  loading: false,
  error: null,

  // 🔹 Ambil daftar pesanan print pengguna
  fetchPrintOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/v1/print-orders');
      set({ printOrders: response.data.data?.data || response.data.data || [], loading: false });
    } catch (error: any) {
      // If user token is invalid, handle gracefully
      if (error.response?.status === 401) {
        // Clear invalid user token
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
        set({
          error: 'Sesi telah berakhir. Silakan login kembali.',
          loading: false,
        });
      } else {
        set({
          error: error.response?.data?.message || 'Gagal mengambil pesanan print.',
          loading: false,
        });
      }
    }
  },

  // 🔹 Buat pesanan print baru
  createPrintOrder: async (printData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/v1/print-orders', printData);
      set({ loading: false });
      return response.data.data || response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Gagal membuat pesanan print.',
        loading: false,
      });
      return null;
    }
  },

  // 🔹 Ambil detail pesanan print berdasarkan ID
  getPrintOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/v1/print-orders/${id}`);
      set({ currentPrintOrder: response.data.data, loading: false });
      return response.data.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Gagal mengambil detail pesanan print.',
        loading: false,
      });
      return null;
    }
  },

  // 🔹 Update status pembayaran
  updatePaymentStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/v1/print-orders/${id}/payment`, { payment_status: status });

      const { printOrders } = get();
      const updatedOrders = printOrders.map((order) =>
        order.id === id ? response.data.data : order
      );

      set({ printOrders: updatedOrders, loading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Gagal mengupdate status pembayaran.',
        loading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export { usePrintStore };
