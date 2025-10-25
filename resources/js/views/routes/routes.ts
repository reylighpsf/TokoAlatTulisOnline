/**
 * Route configuration untuk aplikasi TokoAlatTulisOnline
 */

import Home from '../pages/Home';
import Products from '../pages/Products';
import PrintingServices from '../pages/PrintingServices';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Profile from '../pages/Profile';
import Dashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/kelolaproducts';

export interface RouteConfig {
  path: string;
  name: string;
  component: React.ComponentType;
  meta?: {
    guest?: boolean;
    requiresAuth?: boolean;
    requiresAdmin?: boolean;
  };
}

export const userRoutes: RouteConfig[] = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/produk",
    name: "products",
    component: Products,
  },
  {
    path: "/percetakan",
    name: "printing-services",
    component: PrintingServices,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      guest: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: {
      guest: true,
    },
  },
  {
    path: "/profil",
    name: "profile",
    component: Profile,
    meta: {
      requiresAuth: true,
    },
  },
];

export const adminRoutes: RouteConfig[] = [
  {
    path: "/admin",
    name: "admin-dashboard",
    component: Dashboard,
    meta: {
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/kelolaproducts",
    name: "admin-products",
    component: AdminProducts,
    meta: {
      requiresAdmin: true,
    },
  },
];

export const allRoutes = [...userRoutes, ...adminRoutes];
