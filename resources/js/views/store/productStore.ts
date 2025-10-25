// src/store/productStore.ts
import { create } from 'zustand';
import { api, adminApi } from '../lib/api';

export interface Product {
  created_at: string;
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  is_active: boolean;
  image?: string;
}

interface ProductPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface ProductState {
  products: Product[];
  pagination?: ProductPagination;
  loading: boolean;
  error: string | null;

  fetchProducts: (params?: { page?: number; search?: string; category?: string }) => Promise<void>;
  createProduct: (data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    category?: string;
    is_active: boolean;
    image?: File;
  }) => Promise<void>;
  updateProduct: (id: number, data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    category?: string;
    is_active: boolean;
    image?: File;
  }) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  pagination: undefined,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await adminApi.get('/v1/products', { params });
      set({
        products: res.data.data || [],
        pagination: res.data.meta || undefined,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error:
          err.response?.data?.message ||
          'Gagal mengambil produk',
      });
    }
  },

  createProduct: async (data) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', String(data.price));
      formData.append('stock', String(data.stock));
      formData.append('is_active', data.is_active ? '1' : '0');
      if (data.description) formData.append('description', data.description);
      if (data.category) formData.append('category', data.category);
      if (data.image) formData.append('image', data.image);

      await adminApi.post('/v1/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await get().fetchProducts(); // refresh list
      set({ loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error:
          err.response?.data?.message ||
          Object.values(err.response?.data?.errors || {}).flat().join(', ') ||
          'Gagal menambahkan produk',
      });
      throw err;
    }
  },

  updateProduct: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', String(data.price));
      formData.append('stock', String(data.stock));
      formData.append('is_active', data.is_active ? '1' : '0');
      if (data.description) formData.append('description', data.description);
      if (data.category) formData.append('category', data.category);
      if (data.image) formData.append('image', data.image);

      await adminApi.post(`/v1/products/${id}?_method=PUT`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await get().fetchProducts(); // refresh list
      set({ loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error:
          err.response?.data?.message ||
          Object.values(err.response?.data?.errors || {}).flat().join(', ') ||
          'Gagal mengupdate produk',
      });
      throw err;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await adminApi.delete(`/v1/products/${id}`);
      await get().fetchProducts(); // refresh list
      set({ loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error:
          err.response?.data?.message ||
          'Gagal menghapus produk',
      });
      throw err;
    }
  },
}));
