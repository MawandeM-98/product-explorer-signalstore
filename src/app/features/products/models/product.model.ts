export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: number;
}

export interface ProductFormData {
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: number;
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';