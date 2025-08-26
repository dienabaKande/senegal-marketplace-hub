export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string;
  stock: number;
  featured: boolean;
  status: 'active' | 'inactive' | 'draft';
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'wave' | 'orange_money' | 'cash_on_delivery';
  payment_status: 'pending' | 'paid' | 'failed';
  shipping_address: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  product?: Product;
}