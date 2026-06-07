export type Category = "men" | "women" | "kids" | "zeng";

export interface Product {
  id: string;
  category: Category;
  brand: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  badge: string;
  emoji: string;
  isNew: boolean;
  tags: string[];
  sizes: string[];
  description: string;
}

export interface CartItem {
  id: string;
  product: Product;
  size: string;
  qty: number;
}

export interface BodyScan {
  bodyType: string;
  bestSize: string;
  fitStyle: string;
  aiScore: number;
  recommendations: string[];
  summary: string;
}
