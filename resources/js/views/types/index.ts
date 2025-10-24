
/**
 * Type definitions for Stationery & Printing Shop
 */

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image?: string;
  stock: number;
  createdAt: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PrintFile {
  id: string;
  name: string;
  url: string;
  copies: number;
  paperSize: 'A4' | 'A3' | 'Letter';
  color: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  printFiles: PrintFile[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}
