// src/app/(user)/HomeClient.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
import { Product, Category } from "../../../types";
import { HomeBlogSection } from "../../../components/blog/HomeBlogSection";
import { ReviewsCarouselClient } from "@/src/components/reviews/ReviewsCarouselClient";
import { HomeReviewsSection } from "@/src/components/reviews/HomeReviewsSection";

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
      subtitle: "Experience unparalleled comfort with our premium collection",
      cta: "Explore Beds",
      link: "/category/beds",
    },
    {
      image: "/images/dining-tables.jpg",
      title: "Modern Dining Tables & Sets",
      subtitle: "Elevate your dining experience with elegant designs",
      cta: "Shop Dining",
      link: "/category/dining-tables",
    },
    {
      image: "/images/sofa-bad-design-hero.jpg",
      title: "Luxury Sofas & Smart Sofa Beds",
      subtitle: "Transform your living space with timeless elegance",
      cta: "View Sofas",
      link: "/category/sofa-sets",
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
      h-[300px]
      sm:h-[350px]
      md:h-[75vh]
      lg:h-[80vh]
      xl:h-[85vh]
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
            <Image
              src={slide.image}
              alt={`${slide.title} - Luxury Home Furniture`}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-cover transition-transform duration-[10000ms] ease-out ${
                isActive ? "scale-105" : "scale-100"
              }`}
            />

            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40 z-10" />

            {/* Content - Left on mobile, Centered on md and up */}
            <div className="relative z-20 h-full flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
              <div
                className={`
                max-w-2xl lg:max-w-3xl xl:max-w-4xl
                space-y-3 sm:space-y-4 md:space-y-6
                // Left aligned on mobile (below md)
                text-left
                // Centered on md and up
                md:text-center md:mx-auto
              `}
              >
                {/* H1 - Main heading */}
                <h1 className="text-white  text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl max-w-md md:max-w-3xl font-bold leading-tight">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed max-w-xl md:max-w-2xl mx-auto">
                  {slide.subtitle}
                </p>

                {/* CTA Button */}
                <div className="pt-1 sm:pt-2 md:pt-3">
                  <Link
                    href={slide.link}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs sm:text-sm md:text-base rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    {slide.cta}
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="hidden md:flex absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 bg-neutral-900/40 hover:bg-amber-500 text-white hover:text-neutral-900 p-2 sm:p-3 rounded-xl border border-white/10 backdrop-blur-md transition-all duration-300 group items-center justify-center"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="hidden md:flex absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 bg-neutral-900/40 hover:bg-amber-500 text-white hover:text-neutral-900 p-2 sm:p-3 rounded-xl border border-white/10 backdrop-blur-md transition-all duration-300 group items-center justify-center"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1 transition-all duration-500 ease-out ${
              currentSlide === index
                ? "w-8 sm:w-10 md:w-12 bg-amber-500"
                : "w-4 sm:w-5 bg-white/30 hover:bg-white/60"
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl  text-neutral-900">
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl  text-neutral-900">
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
  const getCategoryImage = (category: Category): string | null => {
    // Only return image if it's valid
    if (category.image && category.image.startsWith("data:image"))
      return category.image;
    if (category.image && category.image.startsWith("http"))
      return category.image;

    // Return null if no valid image
    return null;
  };

  if (categories.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="px-2 md:px-10 mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/50 mb-3">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600">
              Shop by Category
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl  text-neutral-900">
            Explore Our Collections
          </h2>
          <p className="text-neutral-500 text-sm mt-2">
            Find the perfect piece for every room
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {categories.slice(0, 8).map((category) => {
            const imageSrc = getCategoryImage(category);
            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden bg-neutral-800 aspect-square hover:shadow-lg transition-shadow duration-300"
              >
                {/* Image - only render if exists */}
                {imageSrc && (
                  <Image
                    src={imageSrc}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-300" />

                {/* Content - Centered */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <h3 className="text-white  text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-center leading-tight">
                    {category.name}
                  </h3>
                  <span className="mt-2 w-8 h-0.5 bg-amber-400 group-hover:w-12 transition-all duration-300" />
                  <span className="mt-3 text-white/80 text-xs font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Shop Now →
                  </span>
                </div>
              </Link>
            );
          })}
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
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
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

const aggregate = {
  count: 42,
  average: 4.8,
};

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
      {/* Hero Section - Always visible instantly */}
      <HeroSection />

      {/* Categories */}
      <CategoriesSection categories={categories} />
      {/* Featured Products */}
      <FeaturedProductsSection products={featuredProducts} />

      {/* Recent Products */}
      <RecentProductsSection products={recentProducts} />

      {/* <HomeReviewsSection
  title="Loved by Our Customers"
  subtitle="Real reviews from real Royal Furniture customers across the UK"
/> */}

      {/* Newsletter Section - Static */}

      {/* <HomeBlogSection /> */}
    </div>
  );
}
