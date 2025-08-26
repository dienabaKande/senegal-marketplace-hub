export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'tissus' | 'artisanat' | 'epices' | 'bijoux';
  stock: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}