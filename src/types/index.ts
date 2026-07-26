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
  featuresStyle?: "bullet" | "number";
  faqs?: { question: string; answer: string }[];
  featured?: boolean;
  createdAt?: any;
  updatedAt?: any;
  enableColorSelection?: boolean; // true = show color button, false = hide
  selectedColor?: string;
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

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category: string; // category ID
  categoryName: string;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  status: "draft" | "published";
  views: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  publishedAt?: any;
  createdAt: any;
  updatedAt: any;
}

export interface CityPage {
  id: string;
  name: string; // e.g., "London"
  slug: string; // e.g., "london"

  // SEO Fields
  metaTitle: string;
  metaDescription: string;
  h1Heading: string;

  // Content Fields
  uniqueIntro: string; // 2-3 sentence custom opening
  nearbyAreas: string[]; // e.g., ["Salford", "Stockport", "Bolton", "Oldham"]
  localTrustSignals: string[]; // e.g., ["1-3 Day Delivery across Greater London", "Pay Cash on Delivery after inspecting in your home"]

  // Additional Content
  deliveryInfo: string;
  whyChooseUs: string[];
  popularProducts: string[]; // Product IDs or names
  faqs: {
    question: string;
    answer: string;
  }[];

  // SEO Stats
  views: number;
  orderCount: number;

  status: "draft" | "published";
  featured: boolean;

  // Add this line for images
  image?: string; // Optional image URL for the city page
  featuredImage?: string; // Alternative name if you prefer

  createdAt: any;
  updatedAt: any;
}

// For API response
export interface CityPageWithCount extends CityPage {
  totalOrders?: number;
}

export interface Color {
  id: string;
  name: string;
  hex: string;
  fabric: string; // e.g., "Plush Velvet", "Crushed Velvet", etc.
  image?: string; // Optional image URL for fabric swatch
  isActive: boolean;
  sortOrder: number;
  createdAt?: any;
  updatedAt?: any;
}
