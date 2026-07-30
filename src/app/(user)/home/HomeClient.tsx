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
} from "lucide-react";
import { SEO } from "../../../components/SEO";
import { Product, Category } from "../../../types";
import { HomeBlogSection } from "../../../components/blog/HomeBlogSection";

interface HomeClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
  initialFeaturedProducts: Product[];
  initialRecentProducts: Product[];
}

// Hero Section - Static (no loading)
function HeroSection() {
  const heroSlides = [
    {
      image: "/images/sofa-bad-design.jpg",
      title: "Luxury Beds & Upholstered Frames",
      // subtitle: "Premium Bedroom Furniture",
      // description:
      //   "Upgrade your sleep sanctuary. Shop premium divan beds, gas-lift ottoman storage beds, and luxury velvet sleigh beds engineered for long-lasting comfort.",
      // buttonText: "Shop Beds & Mattresses",
      // buttonLink: "/shop",
    },
    {
      image: "/images/dining-tables.jpg",
      title: "Modern Dining Tables & Sets",
      // subtitle: "Designed for Entertaining",
      // description:
      //   "Find the perfect centerpiece. Browse luxury marble dining tables, space-saving extending tables, and solid oak sets tailored for any home layout.",
      // buttonText: "Shop Dining Tables",
      // buttonLink: "/shop",
    },
    {
      image: "/images/sofa-bad-interior-desing.jpg",
      title: "Luxury Sofas & Smart Sofa Beds",
      // subtitle: "Contemporary Living Spaces",
      // description:
      //   "Discover deep lounging comfort. Explore classic Chesterfield couches, spacious family U-shape sectionals, and modern click-clack guest sofa beds.",
      // buttonText: "Shop The Sofa Collection",
      // buttonLink: "/shop",
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
    <section className="relative h-[75vh] sm:h-[80vh] lg:h-[85vh] overflow-hidden bg-neutral-900">
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

            {/* <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-neutral-900/20" /> */}

            <div className="relative z-10 h-full flex items-center px-6 sm:px-12 lg:px-20 xl:px-32">
              <div className="space-y-4 sm:space-y-6 md:space-y-4 max-w-xl md:max-w-2xl border-l-2 border-amber-500 pl-6 sm:pl-8 md:pl-10">
                {/* <span className="text-[9px] sm:text-[11px] font-bold text-amber-400 uppercase tracking-[0.35em] block animate-fadeIn">
                  {slide.subtitle}
                </span> */}
                {/* 
                {isActive ? (
                  <h1 className="text-2xl md:text-4xl lg:text-5xl text-white font-serif font-light leading-[1.15] tracking-wide">
                    {slide.title}
                  </h1>
                ) : (
                  <h2 className="text-2xl md:text-4xl lg:text-5xl text-white font-serif font-light leading-[1.15] tracking-wide">
                    {slide.title}
                  </h2>
                )} */}
                {/* 
                <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-md lg:max-w-xl font-light leading-relaxed">
                  {slide.description}
                </p> */}

                {/* <div className="flex flex-wrap gap-3 pt-2">
                  <Link href={slide.buttonLink}>
                    <Button
                      size="lg"
                      className="bg-transparent border-2 border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-neutral-900 px-8 sm:px-12 py-3 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] shadow-2xl rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      {slide.buttonText}
                    </Button>
                  </Link>
                </div> */}
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

  const getCategorySubtitle = (categoryName: string): string => {
    const subtitles: Record<string, string> = {
      "Sofa Sets": "Living Area",
      "Dining Tables": "The Feast",
      Beds: "Nightly Rest",
      Mattresses: "Sleep",
      "Acoustic Wall Panels": "Acoustics",
      "Coffee Tables": "Centerpiece",
      "Office Chairs": "Workspace",
      Wardrobes: "Storage",
    };
    return subtitles[categoryName] || "Collection";
  };

  if (categories.length === 0) return null;

  return (
    <section className="bg-white border-t border-b border-neutral-200/80 py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 md:space-y-16">
        <div className="text-center space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/50">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600">
              Shop by Category
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-neutral-900 tracking-tight">
            Explore Our Collections
          </h2>
          <p className="text-neutral-500 font-light text-sm sm:text-base">
            Curated categories for every space in your home
          </p>
          <Link href="/collections" className="text-amber-500 underline">View all Collections</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
          {categories.slice(0, 5).map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="relative aspect-[3/4] group overflow-hidden bg-neutral-800 block rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={getCategoryImage(category)}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                fetchPriority="high"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-1 sm:space-y-2 p-3 sm:p-4 bg-black/10 group-hover:bg-black/40 transition-colors rounded-2xl">
                <span className="text-[7px] sm:text-[8px] md:text-[14px] mb-4 font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] transform translate-y-3 sm:translate-y-4 group-hover:translate-y-0 transition-all duration-500 text-amber-400">
                  {getCategorySubtitle(category.name)}
                </span>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-[30px] text-white font-serif font-medium tracking-tight text-center px-1 sm:px-2 line-clamp-2">
                  {category.name}
                </h3>
                <span className="w-0 group-hover:w-6 sm:group-hover:w-8 h-px bg-amber-500 transition-all duration-500 ease-out" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseUsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 text-center">
        <div className="space-y-3 sm:space-y-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-amber-50 border border-amber-200/50 flex items-center justify-center mx-auto rounded-xl">
            <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-amber-600" />
          </div>
          <h4 className="text-[10px] sm:text-[11px] md:text-[12px] font-bold uppercase tracking-widest text-neutral-900">
            Premium Quality
          </h4>
          <p className="text-[11px] sm:text-[12px] md:text-[13px] text-neutral-500 font-light leading-relaxed px-2">
            Hand-selected materials for lasting elegance.
          </p>
        </div>
        <div className="space-y-3 sm:space-y-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-amber-50 border border-amber-200/50 flex items-center justify-center mx-auto rounded-xl">
            <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-amber-600" />
          </div>
          <h4 className="text-[10px] sm:text-[11px] md:text-[12px] font-bold uppercase tracking-widest text-neutral-900">
            Cash On Delivery
          </h4>
          <p className="text-[11px] sm:text-[12px] md:text-[13px] text-neutral-500 font-light leading-relaxed px-2">
            Secure payment upon your satisfaction.
          </p>
        </div>
        <div className="space-y-3 sm:space-y-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-amber-50 border border-amber-200/50 flex items-center justify-center mx-auto rounded-xl">
            <Truck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-amber-600" />
          </div>
          <h4 className="text-[10px] sm:text-[11px] md:text-[12px] font-bold uppercase tracking-widest text-neutral-900">
            Fast Delivery
          </h4>
          <p className="text-[11px] sm:text-[12px] md:text-[13px] text-neutral-500 font-light leading-relaxed px-2">
            UK-wide logistics to your doorstep.
          </p>
        </div>
        <div className="space-y-3 sm:space-y-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-amber-50 border border-amber-200/50 flex items-center justify-center mx-auto rounded-xl">
            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-amber-600" />
          </div>
          <h4 className="text-[10px] sm:text-[11px] md:text-[12px] font-bold uppercase tracking-widest text-neutral-900">
            Secure Checkout
          </h4>
          <p className="text-[11px] sm:text-[12px] md:text-[13px] text-neutral-500 font-light leading-relaxed px-2">
            Your data protected by industry standards.
          </p>
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
  initialProducts,
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
