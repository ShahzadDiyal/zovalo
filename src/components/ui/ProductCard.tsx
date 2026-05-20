"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import { Product } from "../../types";
import { useCart } from "../../context/CartContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isOrderNow, setIsOrderNow] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) return;

    setIsAddingToCart(true);
    const success = addToCart(product, 1);

    if (success) {
      const btn = e.currentTarget;
      btn.classList.add("bg-green-500");
      setTimeout(() => btn.classList.remove("bg-green-500"), 500);
    }

    setIsAddingToCart(false);
  };

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) return;

    setIsOrderNow(true);
    const success = addToCart(product, 1);

    if (success && typeof window !== "undefined") {
      window.location.href = "/cart";
    }

    setIsOrderNow(false);
  };

  const handleContactUs = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      window.location.href = "/contact";
    }
  };

  // Don't render until mounted (client-side only)
  if (!mounted) {
    return null;
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block bg-white border border-warm-beige overflow-hidden transition-all duration-300 hover:shadow-lg rounded-lg"
    >
      {/* Product Image */}
      <div className="aspect-square bg-cream overflow-hidden relative">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Stock Badge */}
        {product.stock === 0 ? (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
            Out of Stock
          </div>
        ) : product.stock < 5 ? (
          <div className="absolute top-2 right-2 bg-gold text-near-black text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
            Only {product.stock} left
          </div>
        ) : null}

        {/* Low Stock Warning Bar */}
        {product.stock > 0 && product.stock < 5 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gold/90 text-near-black text-[8px] font-bold uppercase tracking-wider py-1 text-center">
            Hurry! Only {product.stock} left in stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        <p className="text-[9px] sm:text-[10px] font-bold text-gray-a0 uppercase tracking-widest mb-1">
          {product.category}
        </p>
        <h3 className="text-sm sm:text-base font-display text-near-black group-hover:text-gold transition-colors line-clamp-1 mb-2">
          {product.title}
        </h3>
        <p className="text-base sm:text-lg font-light text-near-black mb-3">
          {formatCurrency(product.price)}
        </p>

        {/* Action Buttons */}
        {product.stock === 0 ? (
          <button
            onClick={handleContactUs}
            className="w-full bg-gray-200 text-gray-600 py-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest rounded transition-colors"
          >
            Contact Us
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 bg-cream border border-warm-beige cursor-pointer text-near-black py-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest hover:bg-gold hover:text-near-black hover:border-gold transition-all duration-300 flex items-center justify-center gap-1.5 rounded"
            >
              <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={handleOrderNow}
              disabled={isOrderNow}
              className="flex-1 bg-near-black text-white py-2 text-[10px] cursor-pointer sm:text-[11px] font-bold uppercase tracking-widest hover:bg-gold hover:text-near-black transition-all duration-300 flex items-center justify-center gap-1.5 rounded"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {isOrderNow ? "Processing..." : "Order Now"}
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
