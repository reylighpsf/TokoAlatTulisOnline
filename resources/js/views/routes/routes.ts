/**
 * Route configuration untuk aplikasi TokoAlatTulisOnline
 */

import Home from '../pages/Home';
import Products from '../pages/Products';
import PrintingServices from '../pages/PrintingServices';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Profile from '../pages/Profile';
import OrderHistory from '../pages/OrderHistory';
import OrderDetails from '../pages/OrderDetails';
import Checkout from '../pages/Checkout';
import Dashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/kelolaproducts';
import OrderManagement from '../pages/admin/OrderManagement';
import PrintOrderManagement from '../pages/admin/PrintOrderManagement';

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
  {
    path: "/orders",
    name: "order-history",
    component: OrderHistory,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/orders/:id",
    name: "order-details",
    component: OrderDetails,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/checkout",
    name: "checkout",
    component: Checkout,
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
  {
    path: "/admin/orders",
    name: "admin-orders",
    component: OrderManagement,
    meta: {
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/print-orders",
    name: "admin-prints",
    component: PrintOrderManagement,
    meta: {
      requiresAdmin: true,
    },
  },
];

export const allRoutes = [...userRoutes, ...adminRoutes];
