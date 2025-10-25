/**
 * API utilities for making HTTP requests
 */

import axios from "axios";

// Base API URL
const BASE_URL = "http://127.0.0.1:8000/api";

// Create axios instance for user API
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Create axios instance for admin API
const adminApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Helper: Add CSRF token (if needed for POST requests)
 */
const addCsrfToken = (config: any) => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
  if (token) {
    config.headers["X-CSRF-TOKEN"] = token;
  }
  return config;
};

/**
 * ✅ Request interceptors (auto inject Bearer token)
 */
api.interceptors.request.use((config) => {
  addCsrfToken(config);

  const authToken =
    sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token");
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

adminApi.interceptors.request.use((config) => {
  addCsrfToken(config);

  const adminToken =
    sessionStorage.getItem("admin_auth_token") ||
    localStorage.getItem("admin_auth_token");
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  return config;
});

/**
 * ✅ Response interceptors (auto handle 401 errors)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("auth_token");
      localStorage.removeItem("auth_token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("admin_auth_token");
      localStorage.removeItem("admin_auth_token");
      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export { api, adminApi };
export default api;
