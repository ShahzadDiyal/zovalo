"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { ProductCard } from "../../../components/ui/ProductCard";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  CreditCard,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  Clock,
  Star,
  Gem,
  ArrowRight,
  Lock,
  CheckCircle,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Product, Category } from "../../../types";

export interface HomeClientProps {
  initialCategories?: Category[];
  initialFeaturedProducts?: Product[];
  initialRecentProducts?: Product[];
  aggregate?: { count: number; average: number };
}

// ---------- Intersection Observer Hook with Trigger State ----------
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px", threshold: 0.05, ...options }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}

// ---------- Lazy Wrapper with Skeleton Support ----------
function LazySection({
  children,
  skeleton,
  onFetch,
}: {
  children: React.ReactNode;
  skeleton: React.ReactNode;
  onFetch?: () => Promise<void> | void;
}) {
  const { ref, inView } = useInView();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (inView && !isLoaded) {
      if (onFetch) {
        Promise.resolve(onFetch()).then(() => setIsLoaded(true));
      } else {
        setIsLoaded(true);
      }
    }
  }, [inView, isLoaded, onFetch]);

  return (
    <div ref={ref} className="min-h-[150px]">
      {isLoaded ? children : skeleton}
    </div>
  );
}

// ---------- Skeletons ----------
function GridSkeleton({ count = 4, cols = "grid-cols-2 md:grid-cols-4" }: { count?: number; cols?: string }) {
  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-8 bg-neutral-200/80 rounded w-48 mb-6"></div>
      <div className={`grid ${cols} gap-4 sm:gap-6`}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-white border border-neutral-200/60 rounded-xl p-4 space-y-3">
            <div className="bg-neutral-200/70 h-44 sm:h-52 rounded-lg w-full"></div>
            <div className="h-4 bg-neutral-200/70 rounded w-3/4"></div>
            <div className="h-4 bg-neutral-200/70 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextBlockSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-4 text-center">
      <div className="h-6 bg-neutral-200/80 rounded w-32 mx-auto"></div>
      <div className="h-8 bg-neutral-200/80 rounded w-2/3 mx-auto"></div>
      <div className="h-4 bg-neutral-200/70 rounded w-5/6 mx-auto"></div>
      <div className="h-4 bg-neutral-200/70 rounded w-4/6 mx-auto"></div>
    </div>
  );
}

function FaqSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse space-y-4">
      <div className="h-8 bg-neutral-200/80 rounded w-48 mx-auto mb-6"></div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-14 bg-neutral-200/60 rounded-xl w-full"></div>
      ))}
    </div>
  );
}

// ---------- Hero (Static - Renders Immediately) ----------
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
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section className="relative overflow-hidden bg-neutral-900 h-[300px] sm:h-[350px] md:h-[75vh] lg:h-[80vh] xl:h-[85vh]">
      {heroSlides.map((slide, index) => {
        const isActive = currentSlide === index;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${isActive ? "opacity-100 z-10 visible" : "opacity-0 z-0 invisible"
              }`}
          >
            <Image
              src={slide.image}
              alt={`${slide.title} - Luxury Home Furniture`}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-cover transition-transform duration-[10000ms] ease-out ${isActive ? "scale-105" : "scale-100"
                }`}
            />
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div className="relative z-20 h-full flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
              <div className="max-w-2xl lg:max-w-3xl xl:max-w-4xl space-y-3 sm:space-y-4 md:space-y-6 text-left md:text-center md:mx-auto">
                <h1 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl max-w-md md:max-w-3xl font-bold leading-tight">
                  {slide.title}
                </h1>
                <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed max-w-xl md:max-w-2xl mx-auto">
                  {slide.subtitle}
                </p>
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

      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1 transition-all duration-500 ease-out ${currentSlide === index ? "w-8 sm:w-10 md:w-12 bg-amber-500" : "w-4 sm:w-5 bg-white/30 hover:bg-white/60"
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900">
            Featured Products
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
    <section className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 md:space-y-16">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            Just Arrived
          </h3>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900">
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
    if (category.image && category.image.startsWith("data:image")) return category.image;
    if (category.image && category.image.startsWith("http")) return category.image;
    return null;
  };

  const shuffledCategories = useMemo(() => {
    const shuffled = [...categories];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [categories]);

  const displayCategories = shuffledCategories.slice(0, 8);

  if (categories.length === 0) return null;

  return (
    <section>
      <div className="px-2 md:px-10 mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/50 mb-3">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600">
              Shop by Category
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900">
            Explore Our Collections
          </h2>
          <p className="text-neutral-500 text-sm mt-2">
            Find the perfect piece for every room
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {displayCategories.map((category) => {
            const imageSrc = getCategoryImage(category);
            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden bg-neutral-800 aspect-square hover:shadow-lg transition-shadow duration-300"
              >
                {imageSrc && (
                  <Image
                    src={imageSrc}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <h3 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-center leading-tight">
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

function WhyChooseUsSection({ aggregate }: { aggregate: { count: number; average: number } }) {
  const features = [
    { icon: Gem, title: "Premium Quality", description: "Hand-selected materials for lasting elegance." },
    { icon: CreditCard, title: "Cash On Delivery", description: "Secure payment upon your satisfaction." },
    { icon: Truck, title: "Fast Delivery", description: "UK-wide logistics to your doorstep." },
    { icon: ShieldCheck, title: "Secure Checkout", description: "Your data protected by industry standards." },
  ];

  const customers = [
    { name: "Sarah J.", image: "/images/reviewimg01.png" },
    { name: "Michael R.", image: "/images/reviewimg02.png" },
    { name: "Emma W.", image: "/images/reviewimg03.png" },
    { name: "James C.", image: "/images/reviewimg04.png" },
    { name: "Olivia P.", image: "/images/reviewimg05.png" },
  ];

  const avg = aggregate.average || 0;
  const count = aggregate.count || 0;
  const avgDisplay = avg > 0 ? avg.toFixed(1) : "—";
  const countDisplay = count > 0 ? count.toLocaleString() : "0";

  return (
    <section className="relative bg-neutral-900 text-white py-16 sm:py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 px-4 py-1.5 rounded-full mb-4">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-amber-300">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl  font-bold text-white mb-3">
            Experience the{" "}
            <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
              Difference
            </span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto font-light">
            We're committed to providing you with the best shopping experience possible
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm transition-all duration-500 hover:border-amber-500/50 hover:bg-white/10 hover:shadow-[0_0_30px_-10px_rgba(212,175,55,0.3)]"
              >
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-amber-500 group-hover:w-3/4 transition-all duration-500" />
              </div>
            );
          })}
        </div>

        <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {customers.slice(0, 4).map((customer, idx) => (
                  <div key={idx} className="relative group/tooltip">
                    <img
                      src={customer.image}
                      alt={customer.name}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-amber-500 shadow-md hover:scale-110 transition-transform duration-200 cursor-pointer"
                      loading="lazy"
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white text-neutral-900 text-[10px] rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      {customer.name}
                    </div>
                  </div>
                ))}
                {customers.length > 4 && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-500 border-2 border-amber-500 flex items-center justify-center text-[9px] font-bold text-neutral-900">
                    +{customers.length - 4}
                  </div>
                )}
              </div>
              <span className="text-xs text-neutral-400 font-medium">
                <span className="text-white font-bold">{countDisplay}+</span> happy customers
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs text-neutral-400 font-medium">
                <span className="text-white font-bold">{avgDisplay}</span>/5 Average Rating
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-neutral-400 font-medium">
                <span className="text-white">24/7</span> Support
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-neutral-400 font-medium">
                <span className="text-white">Good</span> Satisfaction
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBadgesSection() {
  const badges = [
    { icon: Lock, label: "Secure SSL" },
    { icon: ShieldCheck, label: "Fraud Protection" },
    { icon: CheckCircle, label: "Verified Merchant" },
  ];

  return (
    <section className="py-8 sm:py-12 bg-white border-y border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {badges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-neutral-600">
              <badge.icon className="w-5 h-5 text-amber-600" />
              <span className="font-medium">{badge.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <MessageCircle className="w-5 h-5 text-amber-600" />
            <span className="font-medium">WhatsApp Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="py-12 sm:py-16 bg-cream/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100/80 px-4 py-1.5 rounded-full mb-4">
          <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-amber-800">
            Our Story
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl  font-bold text-neutral-900 mb-4">
          Crafting Furniture for Modern Homes
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl mx-auto">
          <strong>Royal Furniture</strong> was founded in 2024 with a singular vision: to create furniture that transforms houses into homes. Based in <strong>Manchester</strong>, we blend traditional joinery with contemporary design, delivering premium quality with <strong>Cash on Delivery</strong> and <strong>free UK shipping</strong>. Every piece is crafted to inspire.
        </p>
        <Link
          href="/about"
          className="inline-flex items-center gap-2 mt-6 text-sm font-bold text-amber-600 hover:text-amber-800 transition-colors group"
        >
          Learn more about us
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

function FaqSection() {
  const faqs = [
    { question: "Do you offer free delivery across the UK?", answer: "Yes! We offer 100% free standard UK delivery on all orders – no hidden fees." },
    { question: "Can I inspect the furniture before paying?", answer: "Absolutely. With our Cash on Delivery service, you can thoroughly inspect your furniture upon arrival before paying a single penny." },
    { question: "What is your return policy?", answer: "We offer a hassle‑free 14‑day return policy. If you aren't completely satisfied, simply reach out to our support team." },
    { question: "How do I track my order?", answer: "Once dispatched, you’ll receive a tracking link via email and SMS. You can also check your order status in your account." },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-100/80 px-4 py-1.5 rounded-full mb-4">
            <MessageCircle className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-amber-800">
              Got Questions?
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl  font-bold text-neutral-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="border border-neutral-200/80 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-amber-50/50 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-neutral-900 pr-4">
                    {faq.question}
                  </span>
                  <span className="flex-shrink-0 ml-2">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-amber-600" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="p-4 sm:p-5 pt-0 sm:pt-0 border-t border-neutral-100">
                    <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <Link href="/faq" className="text-sm font-bold text-amber-600 hover:text-amber-800 transition-colors">
            View all FAQs →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------- Main Client Component ----------
export function HomeClient({
  initialCategories = [],
  initialFeaturedProducts = [],
  initialRecentProducts = [],
  aggregate = { count: 0, average: 0 },
}: HomeClientProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(initialFeaturedProducts);
  const [recentProducts, setRecentProducts] = useState<Product[]>(initialRecentProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Lazy API fetchers (called only when scrolled into view if data wasn't initially passed)
  const fetchCategories = useCallback(async () => {
    if (categories.length === 0) {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    }
  }, [categories.length]);

  const fetchFeatured = useCallback(async () => {
    if (featuredProducts.length === 0) {
      const res = await fetch("/api/products?featured=true");
      if (res.ok) {
        const data = await res.json();
        setFeaturedProducts(data);
      }
    }
  }, [featuredProducts.length]);

  const fetchRecent = useCallback(async () => {
    if (recentProducts.length === 0) {
      const res = await fetch("/api/products?recent=true");
      if (res.ok) {
        const data = await res.json();
        setRecentProducts(data);
      }
    }
  }, [recentProducts.length]);

  return (
    <div className="bg-[#FAF8F5] min-h-screen space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24">
      {/* Hero – Always rendered instantly */}
      <HeroSection />

      {/* Lazy-loaded sections with customized skeleton loaders */}
      <LazySection onFetch={fetchCategories} skeleton={<GridSkeleton count={8} cols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" />}>
        <CategoriesSection categories={categories} />
      </LazySection>

      <LazySection onFetch={fetchFeatured} skeleton={<GridSkeleton count={4} />}>
        <FeaturedProductsSection products={featuredProducts} />
      </LazySection>

      <LazySection onFetch={fetchRecent} skeleton={<GridSkeleton count={4} />}>
        <RecentProductsSection products={recentProducts} />
      </LazySection>

      <LazySection skeleton={<div className="h-20 bg-neutral-100 animate-pulse my-6"></div>}>
        <TrustBadgesSection />
      </LazySection>

      <LazySection skeleton={<TextBlockSkeleton />}>
        <AboutSection />
      </LazySection>

      <LazySection skeleton={<FaqSkeleton />}>
        <FaqSection />
      </LazySection>

      <LazySection skeleton={<GridSkeleton count={4} />}>
        <WhyChooseUsSection aggregate={aggregate} />
      </LazySection>
    </div>
  );
}