// src/app/(user)/HomeClient.tsx
"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "../../../components/ui/ProductCard";
import { Button } from "../../../components/ui/Button";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  CreditCard,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  Clock,
  Star,
  Gem,
  ArrowRight,
} from "lucide-react";
import { SEO } from "../../../components/SEO";
import { Product, Category } from "../../../types";
import { HomeBlogSection } from "../../../components/blog/HomeBlogSection";

interface HomeClientProps {
  initialCategories: Category[];
  initialFeaturedProducts: Product[];
  initialRecentProducts: Product[];
}

// Hero Section - Static (no loading)
function HeroSection() {
  const heroSlides = [
    {
      image: "/images/sofa-bad-design-hero_.jpg",
      title: "Luxury Beds & Upholstered Frames",
    },
    {
      image: "/images/dining-tables.jpg",
      title: "Modern Dining Tables & Sets",
    },
    {
      image: "/images/sofa-bad-design-hero.jpg",
      title: "Luxury Sofas & Smart Sofa Beds",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );

  return (
    <section
      className={`
      relative overflow-hidden bg-neutral-900
      h-[300px]                    // 👈 Mobile: 300px
      sm:h-[300px]                 // 👈 Small screens: 300px
      md:h-[75vh]                  // 👈 md and up: 75% viewport height
      lg:h-[80vh]                  // 👈 lg and up: 80% viewport height
      xl:h-[85vh]                  // 👈 xl and up: 85% viewport height
    `}
    >
      {heroSlides.map((slide, index) => {
        const isActive = currentSlide === index;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10 visible" : "opacity-0 z-0 invisible"
            }`}
          >
            <img
              src={slide.image}
              alt={`${slide.title} - Luxury Home Furniture`}
              fetchPriority="high"
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] ease-out ${
                isActive ? "scale-105" : "scale-100"
              }`}
              decoding="async"
            />

            <div className="relative z-10 h-full flex items-center px-6 sm:px-12 lg:px-20 xl:px-32">
              <div className="space-y-4 sm:space-y-6 md:space-y-4 max-w-xl md:max-w-2xl border-l-2 border-amber-500 pl-6 sm:pl-8 md:pl-10">
                {/* Content commented out */}
              </div>
            </div>
          </div>
        );
      })}

      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-neutral-900/40 hover:bg-amber-500 text-white hover:text-neutral-900 p-3 rounded-xl border border-white/10 backdrop-blur-md transition-all duration-300 group"
      >
        <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-neutral-900/40 hover:bg-amber-500 text-white hover:text-neutral-900 p-3 rounded-xl border border-white/10 backdrop-blur-md transition-all duration-300 group"
      >
        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1 transition-all duration-500 ease-out ${
              currentSlide === index
                ? "w-12 bg-amber-500"
                : "w-5 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function FeaturedProductsSection({ products }: { products: Product[] }) {
  return (
    <section className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 md:space-y-16">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <div className="space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/50">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600">
              Premium Selection
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-neutral-900">
            Featured Collection
          </h2>
          <div className="w-12 sm:w-16 h-0.5 bg-amber-500 mx-auto sm:mx-0" />
        </div>
        <Link
          href="/shop"
          className="text-[10px] sm:text-[12px] font-bold uppercase tracking-widest text-neutral-600 hover:text-amber-600 transition-colors underline underline-offset-4"
        >
          Shop All →
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-neutral-400 text-sm sm:text-base">
            No products found. Add some products in the admin panel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

function RecentProductsSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 md:space-y-16 sm:space-y-12 md:space-y-16">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            Just Arrived
          </h3>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-neutral-900">
            Newest Additions
          </h2>
          <div className="w-12 sm:w-16 h-0.5 bg-amber-500 mx-auto sm:mx-0" />
        </div>
        <Link
          href="/shop?sort=latest"
          className="text-[10px] sm:text-[12px] font-bold uppercase tracking-widest text-neutral-600 hover:text-amber-600 transition-colors underline underline-offset-4"
        >
          View All New →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function CategoriesSection({ categories }: { categories: Category[] }) {
  const getCategoryImage = (category: Category): string => {
    if (category.image && category.image.startsWith("data:image"))
      return category.image;
    if (category.image && category.image.startsWith("http"))
      return category.image;
    const fallbackImages: Record<string, string> = {
      "Sofa Sets":
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
      "Dining Tables":
        "https://images.unsplash.com/photo-1577146333359-39f99d73010b?auto=format&fit=crop&q=80&w=800",
      Beds: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800",
      Mattresses:
        "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=800",
      "Acoustic Wall Panels":
        "https://images.unsplash.com/photo-1615876234586-44c13824bba3?auto=format&fit=crop&q=80&w=800",
      "Coffee Tables":
        "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800",
      "Office Chairs":
        "https://images.unsplash.com/photo-1505797149-43b00fe1eeac?auto=format&fit=crop&q=80&w=800",
      Wardrobes:
        "https://images.unsplash.com/photo-1595428774223-ef52624120ec?auto=format&fit=crop&q=80&w=800",
    };
    return (
      fallbackImages[category.name] ||
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800"
    );
  };

  if (categories.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/50 mb-3">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600">
              Shop by Category
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-neutral-900">
            Explore Our Collections
          </h2>
          <p className="text-neutral-500 text-sm mt-2">
            Find the perfect piece for every room
          </p>
        </div>

        {/* Category Grid - 2 columns on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {categories.slice(0, 5).map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-xl bg-neutral-800 aspect-square hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <img
                src={getCategoryImage(category)}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-300" />

              {/* Content - Centered */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <h3 className="text-white font-serif text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-center leading-tight">
                  {category.name}
                </h3>
                <span className="mt-2 w-8 h-0.5 bg-amber-400 group-hover:w-12 transition-all duration-300" />
                <span className="mt-3 text-white/80 text-xs font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8 sm:mt-10">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-amber-600 transition-colors group"
          >
            View All Collections
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUsSection() {
  const features = [
    {
      icon: Gem,
      title: "Premium Quality",
      description: "Hand-selected materials for lasting elegance.",
      color: "from-amber-400 to-orange-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-600",
    },
    {
      icon: CreditCard,
      title: "Cash On Delivery",
      description: "Secure payment upon your satisfaction.",
      color: "from-emerald-400 to-teal-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconColor: "text-emerald-600",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "UK-wide logistics to your doorstep.",
      color: "from-blue-400 to-indigo-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      icon: ShieldCheck,
      title: "Secure Checkout",
      description: "Your data protected by industry standards.",
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      iconColor: "text-purple-600",
    },
  ];

  // Customer profile images (using UI Avatars API for consistent styling)
  const customers = [
    {
      name: "Sarah J.",
      image: "/images/reviewimg01.png",
      initial: "SJ",
    },
    {
      name: "Michael R.",
      image: "/images/reviewimg02.png",
      initial: "MR",
    },
    {
      name: "Emma W.",
      image: "/images/reviewimg03.png",
      initial: "EW",
    },
    {
      name: "James C.",
      image: "/images/reviewimg04.png",
      initial: "JC",
    },
    {
      name: "Olivia P.",
      image: "/images/reviewimg05.png",
      initial: "OP",
    },
  ];

  // Alternative: Use randomuser.me for real diverse faces
  // const customerImages = [
  //   "https://randomuser.me/api/portraits/women/44.jpg",
  //   "https://randomuser.me/api/portraits/men/32.jpg",
  //   "https://randomuser.me/api/portraits/women/68.jpg",
  //   "https://randomuser.me/api/portraits/men/75.jpg",
  //   "https://randomuser.me/api/portraits/women/90.jpg"
  // ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-amber-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-amber-100/80 px-4 py-1.5 rounded-full mb-4">
            <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-amber-800">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-3">
            Experience the{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Difference
            </span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 max-w-2xl mx-auto font-light">
            We're committed to providing you with the best shopping experience
            possible
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:border-transparent overflow-hidden"
              >
                {/* Animated Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                {/* Decorative Circle */}
                <div
                  className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Icon Container */}
                <div
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon
                    className={`w-7 h-7 sm:w-8 sm:h-8 ${feature.iconColor} transition-transform duration-300`}
                  />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 uppercase tracking-wider mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Underline Effect */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                />
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-neutral-200/50">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {/* Customer Avatars */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {customers.slice(0, 4).map((customer, idx) => (
                  <div key={idx} className="relative group/tooltip">
                    <img
                      src={customer.image}
                      alt={customer.name}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform duration-200 cursor-pointer"
                      loading="lazy"
                    />
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-800 text-white text-[10px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      {customer.name}
                    </div>
                  </div>
                ))}
                {/* Extra customers count */}
                {customers.length > 4 && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-amber-700">
                    +{customers.length - 4}
                  </div>
                )}
              </div>
              <span className="text-xs text-neutral-500 font-medium">
                <span className="text-neutral-900 font-bold">2,000+</span> happy
                customers
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <span className="text-xs text-neutral-500 font-medium">
                4.9/5 Average Rating
              </span>
            </div>

            {/* Support */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-neutral-500 font-medium">
                24/7 Customer Support
              </span>
            </div>

            {/* Satisfaction */}
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-neutral-500 font-medium">
                98% Satisfaction Rate
              </span>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-500 font-light italic">
              "Best shopping experience! The quality exceeded my expectations."
              <span className="block text-xs text-neutral-400 mt-1">
                — Sarah Johnson, London
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("Newsletter signup:", email);
      setNewsletterSuccess(true);
      setEmail("");
      setTimeout(() => setNewsletterSuccess(false), 3000);
    }
  };

  return (
    <section className="bg-neutral-900 text-white py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-7 md:space-y-8">
        <div className="space-y-2 sm:space-y-3">
          <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-amber-400">
            Join the Collective
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-tight">
            Signature Style, Delivered.
          </h2>
          <p className="text-neutral-400 font-light text-sm sm:text-base max-w-lg mx-auto px-4">
            Subscribe for exclusive design inspiration, seasonal collection
            reveals, and artisanal insights.
          </p>
        </div>

        {newsletterSuccess && (
          <div className="bg-emerald-50/10 text-emerald-400 py-2 px-4 rounded-xl text-sm border border-emerald-500/20">
            ✓ Thank you for subscribing! Check your inbox soon.
          </div>
        )}

        <form
          onSubmit={handleNewsletterSubmit}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 focus:bg-white/20 transition-all placeholder:text-white/40"
          />
          <button
            type="submit"
            className="bg-amber-500 text-neutral-900 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors rounded-xl whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>

        <p className="text-[10px] text-white/40">
          No spam, just beautiful furniture inspiration. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

export function HomeClient({
  initialCategories,
  initialFeaturedProducts,
  initialRecentProducts,
}: HomeClientProps) {
  const [featuredProducts] = useState<Product[]>(initialFeaturedProducts);
  const [recentProducts] = useState<Product[]>(initialRecentProducts);
  const [categories] = useState<Category[]>(initialCategories);

  return (
    <div className="bg-[#FAF8F5] min-h-screen space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
      <SEO
        title="Home"
        description="Discover our masterfully crafted autumnal collection, blending traditional joinery with modern silhouettes for the contemporary home."
      />

      {/* Hero Section - Always visible instantly */}
      <HeroSection />

      {/* Featured Products */}
      <FeaturedProductsSection products={featuredProducts} />

      {/* Recent Products */}
      <RecentProductsSection products={recentProducts} />

      {/* Why Choose Us - Static */}
      <WhyChooseUsSection />

      {/* Categories */}
      <CategoriesSection categories={categories} />

      {/* Newsletter Section - Static */}
      <NewsletterSection />
    </div>
  );
}
