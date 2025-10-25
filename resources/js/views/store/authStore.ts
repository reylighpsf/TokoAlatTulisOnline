import { create } from "zustand";
import { User } from "../types";
import { api, adminApi } from "../lib/api";

interface AuthState {
  user: User | null;
  admin: User | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<{ user: User; token: string }>;
  adminLogin: (email: string, password: string) => Promise<{ user: User; token: string }>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  logoutAdmin: () => Promise<void>;
  updateProfile: (data: { name: string; email: string }) => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  admin: null,
  isAuthenticated: false,
  isAdminAuthenticated: false,
  isLoading: false,
  error: null,

  // USER LOGIN
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/login", { email, password });
      const { user, token } = res.data;

      sessionStorage.setItem("auth_token", token);
      localStorage.setItem("auth_token", token);
      sessionStorage.setItem("role", "user");

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      set({ user, isAuthenticated: true, isLoading: false });
      return { user, token };
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        "Login gagal";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  // ADMIN LOGIN
  adminLogin: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.get("/sanctum/csrf-cookie");
      const res = await adminApi.post("/admin/login", { email, password });
      const { user, token } = res.data;

      sessionStorage.setItem("admin_auth_token", token);
      localStorage.setItem("admin_auth_token", token);
      sessionStorage.setItem("role", "admin");

      adminApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      set({ admin: user, isAdminAuthenticated: true, isLoading: false });
      return { user, token };
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        "Login admin gagal";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: password,
      });
      const { user, token } = res.data;

      sessionStorage.setItem("auth_token", token);
      localStorage.setItem("auth_token", token);
      sessionStorage.setItem("role", "user");

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat().join(", ") ||
        "Registrasi gagal";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  logoutUser: async () => {
    try {
      await api.post("/logout");
    } catch {}
    sessionStorage.clear();
    localStorage.removeItem("auth_token");
    set({ user: null, isAuthenticated: false });
  },

  logoutAdmin: async () => {
    try {
      await adminApi.post("/admin/logout");
    } catch {}
    sessionStorage.clear();
    localStorage.removeItem("admin_auth_token");
    set({ admin: null, isAdminAuthenticated: false });
  },

  updateProfile: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),

checkAuth: async () => {
  set({ isLoading: true });

  const role = sessionStorage.getItem("role");
  const userToken =
    sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token");
  const adminToken =
    sessionStorage.getItem("admin_auth_token") ||
    localStorage.getItem("admin_auth_token");

  try {
    if (role === "admin" && adminToken) {
      adminApi.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
      const res = await adminApi.get("/admin");
      set({
        admin: res.data,
        isAdminAuthenticated: true,
        isAuthenticated: false,
        user: null,
      });
    } else if (role === "user" && userToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
      const res = await api.get("/user");
      set({
        user: res.data,
        isAuthenticated: true,
        isAdminAuthenticated: false,
        admin: null,
      });
    } else {
      // Tidak ada sesi valid
      set({
        user: null,
        admin: null,
        isAuthenticated: false,
        isAdminAuthenticated: false,
      });
    }
  } catch (error) {
    console.warn("Auth check failed:", error);
    sessionStorage.clear();
    localStorage.removeItem("auth_token");
    localStorage.removeItem("admin_auth_token");
    set({
      user: null,
      admin: null,
      isAuthenticated: false,
      isAdminAuthenticated: false,
    });
  } finally {
    set({ isLoading: false });
  }
},

  clearError: () => set({ error: null }),
}));
