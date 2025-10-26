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

export interface PrintOrder {
  id: string | number;
  user_id: number;
  file_name: string;
  file_url: string;
  print_type: 'color' | 'bw' | 'photo';
  paper_size: 'A4' | 'A3' | 'Letter' | '4x6' | '5x7' | '8x10';
  copies: number;
  total_pages: number;
  price_per_page: number;
  total_amount: number;
  payment_method: 'cod' | 'bank_transfer';
  payment_status: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Order {
  id: string | number;
  order_number: string;
  user_id: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  payment_method: string;
  payment_status: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  user?: User;
}

export interface OrderItem {
  id: string | number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  quantity: number;
  price: number;
  total: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
}
