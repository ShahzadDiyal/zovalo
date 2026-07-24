// src/components/ui/WelcomePopup.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Gift,
  Sparkles,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatCurrency } from "../../lib/utils";

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  images: string[];
  category?: string;
}

interface WelcomePopupProps {
  products: Product[];
}

export default function WelcomePopup({ products }: WelcomePopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const hasShownRef = useRef(false);

  useEffect(() => {
    // Only show on homepage and only once per session
    if (pathname === "/" && !hasShownRef.current) {
      // Check if already shown in this session
      const hasShown = sessionStorage.getItem("welcomePopupShown");
      if (!hasShown) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          hasShownRef.current = true;
          sessionStorage.setItem("welcomePopupShown", "true");
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 260;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!isOpen) return null;

  const diningProduct = products.find(
    (p) =>
      p.title?.toLowerCase().includes("dining") ||
      p.category === "Dining Tables",
  );
  const sofaProduct = products.find(
    (p) =>
      p.title?.toLowerCase().includes("sofa") || p.category === "Sofa Sets",
  );
  const bedProduct = products.find(
    (p) => p.title?.toLowerCase().includes("bed") || p.category === "Beds",
  );

  const featuredProducts = [sofaProduct, diningProduct, bedProduct]
    .filter(Boolean)
    .concat(
      products.filter(
        (p) =>
          p.id !== sofaProduct?.id &&
          p.id !== diningProduct?.id &&
          p.id !== bedProduct?.id,
      ),
    )
    .slice(0, 6);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-4">
      <div
        className={`absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity duration-500 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      <div
        className={`relative bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-100 transform transition-all duration-500 ${
          isClosing
            ? "scale-95 opacity-0 translate-y-4"
            : "scale-100 opacity-100 translate-y-0"
        } animate-slide-up scrollbar-thin scrollbar-thumb-neutral-200`}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 p-2 text-neutral-400 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 rounded-full transition-all duration-200 shadow-sm border border-neutral-200/60"
          aria-label="Close popup"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="p-5 sm:p-7 md:p-8">
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full mb-2.5">
              <Sparkles className="w-3 h-3 text-amber-600 animate-pulse" />
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-amber-700">
                Welcome to Royal Furniture
              </span>
              <Sparkles className="w-3 h-3 text-amber-600 animate-pulse" />
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 mb-1.5">
              Experience True{" "}
              <span className="text-amber-600 relative inline-block font-extrabold">
                Luxury Living
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-500 to-amber-600 rounded-full opacity-40" />
              </span>
            </h2>

            <p className="text-neutral-500 text-[11px] sm:text-xs max-w-md mx-auto leading-relaxed">
              Discover premium furniture collections meticulously designed for
              modern elegance.
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-neutral-900 via-neutral-850 to-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-5 mb-5 text-center sm:text-left overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -translate-y-8 translate-x-8 blur-xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-[9px] font-extrabold uppercase tracking-widest text-amber-500 flex items-center justify-center sm:justify-start gap-1">
                  <Gift className="w-2.5 h-2.5" /> Special Invitation
                </p>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Enjoy{" "}
                  <span className="text-amber-500 font-extrabold">26% OFF</span>{" "}
                  Your First Order
                </h3>
                <p className="text-neutral-400 text-[11px] font-light">
                  Limited time presentation value applied automatically at
                  checkout.
                </p>
              </div>
              <Link
                href="/shop"
                onClick={handleClose}
                className="inline-flex items-center gap-1.5 bg-amber-500 text-neutral-900 px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-amber-400 active:scale-98 transition-all duration-200 group whitespace-nowrap shadow-md"
              >
                Shop Now
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          <div className="mt-4 relative group/carousel">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-800 flex items-center gap-1.5">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                Curated Favorites
              </h3>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => scrollCarousel("left")}
                  className="p-1 rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 transition shadow-sm"
                  aria-label="Previous items"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => scrollCarousel("right")}
                  className="p-1 rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 transition shadow-sm"
                  aria-label="Next items"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div
              ref={carouselRef}
              className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 scroll-smooth"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {featuredProducts.map((product, index) => (
                <Link
                  key={product?.id || index}
                  href={`/product/${product?.slug}`}
                  onClick={handleClose}
                  className="group block flex-shrink-0 w-[190px] sm:w-[220px] snap-start"
                >
                  <div className="bg-neutral-50/50 border border-neutral-200/60 rounded-xl overflow-hidden transition-all duration-300 group-hover:shadow-sm group-hover:border-neutral-300 group-hover:bg-white">
                    <div className="aspect-[4/3] overflow-hidden bg-neutral-100 relative">
                      {product?.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-neutral-400 text-[10px] font-medium tracking-wide uppercase">
                            Preview
                          </span>
                        </div>
                      )}
                      <div className="absolute top-1.5 left-1.5 bg-white/95 backdrop-blur-sm border border-neutral-200 text-neutral-900 text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-sm">
                        -26%
                      </div>
                    </div>
                    <div className="p-2.5 space-y-0.5">
                      <h4 className="text-[11px] font-semibold text-neutral-800 line-clamp-1 transition-colors group-hover:text-amber-600">
                        {product?.title || "Premium Furniture Piece"}
                      </h4>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-bold text-neutral-900">
                          {product?.price
                            ? formatCurrency(product.price)
                            : "Inquire"}
                        </span>
                        {product?.price && (
                          <span className="text-[10px] text-neutral-400 line-through font-light">
                            {formatCurrency(product.price * 1.35)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100">
            <div className="flex flex-wrap justify-center items-center gap-y-2 gap-x-6">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <svg
                    className="w-2.5 h-2.5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider">
                  Free UK Delivery
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <svg
                    className="w-2.5 h-2.5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider">
                  Cash on Delivery
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <svg
                    className="w-2.5 h-2.5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider">
                  Purchase Protection
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUpAnimation {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-up {
          animation: slideUpAnimation 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
