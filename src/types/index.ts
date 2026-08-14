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
  imageAltTexts: string[];
  // Aggregate review stats (auto-calculated from approved reviews - see reviewApi.recalcProductRating)
  rating?: number; // average rating, e.g. 4.8
  reviewCount?: number; // count of approved reviews
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

// Customer review captured for a specific product. Most reviews come in via
// WhatsApp or Facebook DM/comments, so an admin transcribes them here rather
// than the customer submitting a form directly.
export interface Review {
  id: string;
  productId: string; // Product.id this review belongs to
  productTitle?: string; // denormalized for easy display in admin list
  customerName: string;
  rating: number; // 1-5
  title?: string; // optional short headline, e.g. "Great quality sofa!"
  comment: string;
  source: "whatsapp" | "facebook" | "instagram" | "website" | "google";
  customerImage?: string; // optional avatar/photo (base64 or URL)
  reviewImages?: string[]; // optional photos the customer shared of the product
  verifiedPurchase?: boolean;
  status: "pending" | "published"; // only "published" reviews are shown on the site / schema
  reviewDate: string; // ISO date the review was actually given (may differ from createdAt)
  createdAt?: any;
  updatedAt?: any;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  featuredImage: string;
  parentId?: string | null;
  createdAt?: any;
  productCount: string;
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
