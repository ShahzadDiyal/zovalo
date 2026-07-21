// src/types/index.ts

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string; // Keep as string for backward compatibility
  reviews: string;
  images: string[];
  stock: number;
  seaterCount?: string[];
  seaterPrices?: SeaterPrice[];
  colors?: string[];
  tags?: string[];
  features?: string[];
  featuresStyle?: 'bullet' | 'number';
  faqs?: { question: string; answer: string }[];
  featured?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface SeaterPrice {
  seater: string;
  price: number;
  compareAtPrice?: number;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  avatar?: string;
  role?: "admin" | "user";
  createdAt?: Date | any;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  createdAt?: any;
}

export interface Order {
  id: string;
  userId: string;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    alternativePhone?: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    notes?: string;
  };
  products: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
    selectedOptions?: {
      color?: string;
      seater?: string;
    };
    specifications?: Record<string, string>;
    dimensions?: string;
    weight?: number;
  }>;
  totalPrice: number;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  createdAt?: any;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: any;
  repliedAt?: any;
  replyMessage?: string;
}