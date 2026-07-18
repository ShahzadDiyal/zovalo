"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  Gift,
  Sparkles,
  ArrowRight,
  Star,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
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

  const featuredProducts = [sofaProduct, diningProduct, bedProduct].filter(
    Boolean,
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6">
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      <div
        className={`relative bg-gradient-to-br from-white via-cream/95 to-white rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-y-auto shadow-2xl transform transition-all duration-500 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        } animate-slide-up`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-red-500 hover:text-white rounded-full transition-all duration-300 shadow-md group"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 md:p-10">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-gold/10 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-gold animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gold">
                Welcome to Royal Furniture
              </span>
              <Sparkles className="w-4 h-4 text-gold animate-pulse" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-near-black mb-3">
              Welcome to{" "}
              <span className="text-gold relative inline-block">
                Royal Furniture
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="4"
                  viewBox="0 0 100 4"
                  fill="none"
                >
                  <path
                    d="M0 2 L100 2"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="6 6"
                  />
                </svg>
              </span>
            </h2>

            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
              Discover luxury furniture crafted for the modern home. Enjoy
              exclusive welcome offers on your first purchase.
            </p>
          </div>

          <div className="bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border border-gold/30 rounded-xl p-4 sm:p-6 mb-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full -translate-y-12 translate-x-12" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold/10 rounded-full translate-y-12 -translate-x-12" />

            <div className="relative z-10">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gold mb-2">
                🎁 Special Offer
              </p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-display text-near-black mb-2">
                Get 26% OFF Your First Order
              </h3>
              <Link
                href="/shop"
                onClick={handleClose}
                className="inline-flex items-center gap-2 bg-near-black text-white px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-gold transition-all duration-300 group"
              >
                Shop Now
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-widest text-near-black flex items-center gap-2">
                <Star className="w-4 h-4 text-gold fill-gold" />
                Popular Picks
              </h3>
              <Link
                href="/shop"
                onClick={handleClose}
                className="text-[10px] font-bold uppercase tracking-widest text-gold hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {featuredProducts.map((product, index) => (
                <Link
                  key={product?.id || index}
                  href={`/product/${product?.slug}`}
                  onClick={handleClose}
                  className="group cursor-pointer block"
                >
                  <div className="bg-cream border border-warm-beige rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                    <div className="aspect-square overflow-hidden">
                      {product?.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-cream flex items-center justify-center">
                          <span className="text-gray-300 text-sm">
                            Coming Soon
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-bold text-near-black line-clamp-1 mb-1">
                        {product?.title || "Premium Furniture"}
                      </h4>
                      <p className="text-sm font-light text-near-black">
                        {product?.price
                          ? formatCurrency(product.price)
                          : "Call for price"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-warm-beige">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-mint-50 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-mint-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider">
                  Free UK Delivery
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-mint-50 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-mint-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider">
                  Cash on Delivery
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-mint-50 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-mint-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider">
                  Secure Shopping
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}