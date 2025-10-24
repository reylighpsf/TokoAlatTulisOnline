import { create } from 'zustand';
import { adminApi } from '../lib/api';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;

  // Actions
  fetchProducts: (params?: {
    page?: number;
    search?: string;
    category?: string;
    is_active?: boolean;
    per_page?: number;
  }) => Promise<void>;

  createProduct: (productData: FormData) => Promise<Product>;
  updateProduct: (id: number, productData: FormData) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
  getProduct: (id: number) => Promise<Product>;

  // UI state
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  pagination: null,

  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append('page', params.page.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
      if (params.per_page) queryParams.append('per_page', params.per_page.toString());

      const response = await adminApi.get(`/products?${queryParams.toString()}`);

      set({
        products: response.data.data,
        pagination: {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
        },
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch products',
        loading: false,
      });
      throw error;
    }
  },

  createProduct: async (productData: FormData) => {
    set({ loading: true, error: null });

    try {
      const response = await adminApi.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      set({ loading: false });
      return response.data.product;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create product';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  updateProduct: async (id: number, productData: FormData) => {
    set({ loading: true, error: null });

    try {
      const response = await adminApi.post(`/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: { _method: 'PUT' }, // Laravel requires this for file uploads
      });

      set({ loading: false });
      return response.data.product;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update product';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  deleteProduct: async (id: number) => {
    set({ loading: true, error: null });

    try {
      await adminApi.delete(`/products/${id}`);
      set({ loading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete product';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  getProduct: async (id: number) => {
    set({ loading: true, error: null });

    try {
      const response = await adminApi.get(`/products/${id}`);
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch product';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
}));
