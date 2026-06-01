// src/types/index.ts

export interface SeaterPrice {
  seater: string;
  price: number;
  compareAtPrice?: number;
  images?: string[];  // Add this line for per-seater images
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  reviews: string;
  images: string[];
  stock: number;
  seaterCount?: string[];
  seaterPrices?: SeaterPrice[];  // Use the SeaterPrice interface instead of inline type
  colors?: string[];
  material?: string;
  dimensions?: string;
  weight?: number;
  warrantyYears?: number;
  deliveryCountries?: string[];
  estimatedDelivery?: string;
  tags?: string[];
  specifications?: {
    Material?: string;
    Dimensions?: string;
    Weight?: string;
    Warranty?: string;
    Color?: string;
    CareInstructions?: string;
  };
  featured?: boolean;
  createdAt?: any;
  updatedAt?: any;
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