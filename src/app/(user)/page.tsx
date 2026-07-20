"use client";
import { useEffect, useState } from "react";
import { ProductCard } from "../../components/ui/ProductCard";
import { Button } from "../../components/ui/Button";
import WelcomePopup from "../../components/ui/WelcomePopup";

import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  CreditCard,
  Award,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SEO } from "../../components/SEO";
import { productApi } from "../../services/productApi";
import { categoryApi } from "../../services/categoryApi";
import { Product, Category } from "../../types";
import { LoadingSpinner } from "../../components/ui/Loading";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Hero carousel slides
  const heroSlides = [
    {
      image: "/images/sofa-bad-design.jpg",
      title: "Luxury Beds & Upholstered Frames",
      subtitle: "Premium Bedroom Furniture",
      description:
        "Upgrade your sleep sanctuary. Shop premium divan beds, gas-lift ottoman storage beds, and luxury velvet sleigh beds engineered for long-lasting comfort.",
      buttonText: "Shop Beds & Mattresses",
      buttonLink: "/beds",
    },
    {
      image: "/images/dining-tables.jpg",
      title: "Modern Dining Tables & Sets",
      subtitle: "Designed for Entertaining",
      description:
        "Find the perfect centerpiece. Browse luxury marble dining tables, space-saving extending tables, and solid oak sets tailored for any home layout.",
      buttonText: "Shop Dining Tables",
      buttonLink: "/dining-tables",
    },
    {
      image: "/images/sofa-bad-interior-desing.jpg",
      title: "Luxury Sofas & Smart Sofa Beds",
      subtitle: "Contemporary Living Spaces",
      description:
        "Discover deep lounging comfort. Explore classic Chesterfield couches, spacious family U-shape sectionals, and modern click-clack guest sofa beds.",
      buttonText: "Shop The Sofa Collection",
      buttonLink: "/sofa",
    },
  ];
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAllCategories(),
      ]);

      setProducts(productsData);
      // Get featured products
      const featured = productsData.filter((p) => p.featured === true);
      setFeaturedProducts(
        featured.length > 0 ? featured.slice(0, 4) : productsData.slice(0, 4),
      );

      // Get recent products (last 4 added)
      const recent = [...productsData].sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      setRecentProducts(recent.slice(0, 4));

      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you can add API call to save email
      console.log("Newsletter signup:", email);
      setNewsletterSuccess(true);
      setEmail("");
      setTimeout(() => setNewsletterSuccess(false), 3000);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
  };

  const getCategoryImage = (category: Category): string => {
    if (category.image && category.image.startsWith("data:image")) {
      return category.image;
    }
    if (category.image && category.image.startsWith("http")) {
      return category.image;
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] sm:min-h-[600px]">
        <LoadingSpinner />
        <span className="ml-3 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-gold">
          Loading Experience...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
      <SEO
        title="Home"
        description="Discover our masterfully crafted autumnal collection, blending traditional joinery with modern silhouettes for the contemporary home."
      />

      {/* Hero Carousel Section - Dark, Dramatic & Premium */}
      <section className="relative h-[75vh] sm:h-[80vh] lg:h-[85vh] overflow-hidden bg-near-black">
        {heroSlides.map((slide, index) => {
          const isActive = currentSlide === index;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive
                  ? "opacity-100 z-10 visible"
                  : "opacity-0 z-0 invisible"
              }`}
            >
              {/* Animated Background Image with Alt Optimization */}
              <img
                src={slide.image}
                alt={`${slide.title} - Luxury Home Furniture`}
                fetchPriority={index === 0 ? "high" : "low"}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
                decoding="async"
              />

              {/* Dynamic Dark Gradients for Crisp Content Contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-near-black via-near-black/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-near-black/60 via-transparent to-near-black/20" />

              {/* Content Box */}
              <div className="relative z-10 h-full flex items-center px-6 sm:px-12 lg:px-20 xl:px-32">
                <div className="space-y-4 sm:space-y-6 md:space-y-4 max-w-xl md:max-w-2xl border-l-2 border-gold pl-6 sm:pl-8 md:pl-10">
                  {/* Subtitle Accent */}
                  <span className="text-[9px] sm:text-[11px] font-bold text-gold uppercase tracking-[0.35em] block animate-fadeIn">
                    {slide.subtitle}
                  </span>

                  {/* Conditional Semantic Heading for Clean SEO Hierarchy */}
                  {isActive ? (
                    <h1 className="text-2xl md:text-4xl lg:text-5xl text-white font-display font-light leading-[1.15] tracking-wide">
                      {slide.title}
                    </h1>
                  ) : (
                    <h2 className="text-2xl md:text-4xl lg:text-5xl text-white font-display font-light leading-[1.15] tracking-wide">
                      {slide.title}
                    </h2>
                  )}

                  {/* Wider Description block to fit the SEO copy elegantly */}
                  <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-md lg:max-w-xl font-light leading-relaxed">
                    {slide.description}
                  </p>

                  {/* Call to Action Button */}
                  <div className="flex flex-wrap gap-3 pt-2 ">
                    <Link
                      href={slide.buttonLink}
                      aria-label={`Explore our collection of ${slide.title}`}
                    >
                      <Button
                        size="lg"
                        className="bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-near-black px-8 sm:px-12 py-3 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] shadow-2xl rounded-none transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        {slide.buttonText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Custom Sleek Slider Navigation Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-near-black/40 hover:bg-gold text-white hover:text-near-black p-3 rounded-none border border-white/10 backdrop-blur-md transition-all duration-300 group"
        >
          <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-near-black/40 hover:bg-gold text-white hover:text-near-black p-3 rounded-none border border-white/10 backdrop-blur-md transition-all duration-300 group"
        >
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Progress-style Bar Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1 transition-all duration-500 ease-out ${
                currentSlide === index
                  ? "w-12 bg-gold"
                  : "w-5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="2xl:w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 md:space-y-16">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-near-black">
              Featured Collection
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-gold mx-auto sm:mx-0" />
          </div>
          <Link
            href="/shop"
            className="text-[10px] sm:text-[12px] font-bold uppercase tracking-widest text-walnut hover:text-gold transition-colors underline underline-offset-4"
          >
            Shop All →
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400 text-sm sm:text-base">
              No products found. Add some products in the admin panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Recently Added Section */}
      {recentProducts.length > 0 && (
        <section className="2xl:w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 md:space-y-16">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-gray-a0">
                Just Arrived
              </h3>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-near-black">
                Newest Additions
              </h2>
              <div className="w-12 sm:w-16 h-0.5 bg-gold mx-auto sm:mx-0" />
            </div>
            <Link
              href="/shop?sort=latest"
              className="text-[10px] sm:text-[12px] font-bold uppercase tracking-widest text-walnut hover:text-gold transition-colors underline underline-offset-4"
            >
              View All New →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 text-center">
          <div className="space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-cream border border-warm-beige flex items-center justify-center mx-auto rounded-lg">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-walnut" />
            </div>
            <h4 className="text-[10px] sm:text-[11px] md:text-[12px] font-bold uppercase tracking-widest text-near-black">
              Premium Quality
            </h4>
            <p className="text-[11px] sm:text-[12px] md:text-[13px] text-gray-666 font-light leading-relaxed px-2">
              Hand-selected materials for lasting elegance.
            </p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-cream border border-warm-beige flex items-center justify-center mx-auto rounded-lg">
              <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-walnut" />
            </div>
            <h4 className="text-[10px] sm:text-[11px] md:text-[12px] font-bold uppercase tracking-widest text-near-black">
              Cash On Delivery
            </h4>
            <p className="text-[11px] sm:text-[12px] md:text-[13px] text-gray-666 font-light leading-relaxed px-2">
              Secure payment upon your satisfaction.
            </p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-cream border border-warm-beige flex items-center justify-center mx-auto rounded-lg">
              <Truck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-walnut" />
            </div>
            <h4 className="text-[10px] sm:text-[11px] md:text-[12px] font-bold uppercase tracking-widest text-near-black">
              Fast Delivery
            </h4>
            <p className="text-[11px] sm:text-[12px] md:text-[13px] text-gray-666 font-light leading-relaxed px-2">
              UK-wide logistics to your doorstep.
            </p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-cream border border-warm-beige flex items-center justify-center mx-auto rounded-lg">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-walnut" />
            </div>
            <h4 className="text-[10px] sm:text-[11px] md:text-[12px] font-bold uppercase tracking-widest text-near-black">
              Secure Checkout
            </h4>
            <p className="text-[11px] sm:text-[12px] md:text-[13px] text-gray-666 font-light leading-relaxed px-2">
              Your data protected by industry standards.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-warm-beige/30 py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-y border-warm-beige">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 md:space-y-16">
          <div className="text-center space-y-2 sm:space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-near-black tracking-tight">
              Shop by Category
            </h2>
            <p className="text-gray-666 font-light text-sm sm:text-base">
              Explore our curated collections
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-400 text-sm sm:text-base">
                No categories found. Add some categories in the admin panel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
              {categories.slice(0, 5).map((category) => (
                <CategoryCard
                  key={category.id}
                  title={category.name}
                  image={getCategoryImage(category)}
                  link={`/category/${category.slug}`}
                  subtitle={getCategorySubtitle(category.name)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-near-black text-white py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-7 md:space-y-8">
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gold">
              Join the Collective
            </h3>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-medium tracking-tight">
              Signature Style, Delivered.
            </h2>
            <p className="text-cream/60 font-light text-sm sm:text-base max-w-lg mx-auto px-4">
              Subscribe for exclusive design inspiration, seasonal collection
              reveals, and artisanal insights.
            </p>
          </div>

          {newsletterSuccess && (
            <div className="bg-mint-50 text-mint-700 py-2 px-4 rounded-lg text-sm">
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
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm outline-none focus:border-gold focus:bg-white/20 transition-all placeholder:text-white/40"
            />
            <button
              type="submit"
              className="bg-gold text-near-black px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors rounded-lg whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>

          <p className="text-[10px] text-white/40">
            No spam, just beautiful furniture inspiration. Unsubscribe anytime.
          </p>
        </div>
      </section>
      <WelcomePopup products={products} />
    </div>
  );
}

// Responsive Category Card Component
function CategoryCard({
  title,
  image,
  link,
  subtitle,
}: {
  title: string;
  image: string;
  link: string;
  subtitle: string;
}) {
  return (
    <Link
      href={link}
      className="relative aspect-[3/4] group overflow-hidden bg-walnut block rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
        fetchPriority="high"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-1 sm:space-y-2 p-3 sm:p-4 bg-black/10 group-hover:bg-black/40 transition-colors">
        <span className="text-[7px] sm:text-[8px] md:text-[14px] mb-4 font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] transform translate-y-3 sm:translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          {subtitle}
        </span>
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-[30px] text-white font-display font-medium tracking-tight text-center px-1 sm:px-2 line-clamp-2">
          {title}
        </h3>
        <span className="w-0 group-hover:w-6 sm:group-hover:w-8 h-px bg-white transition-all duration-500 ease-out" />
      </div>
    </Link>
  );
}
