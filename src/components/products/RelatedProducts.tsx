// src/components/products/RelatedProducts.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "../../types";
import { ProductCard } from "../../components/ui/ProductCard";
import { relatedProductsService } from "../../services/relatedProductsService";
import { Sparkles, ChevronRight, Loader2 } from "lucide-react";

interface RelatedProductsProps {
  currentProduct: Product;
  limit?: number;
  title?: string;
  subtitle?: string;
}

export function RelatedProducts({
  currentProduct,
  limit = 4,
  title = "You May Also Like",
  subtitle = "Discover more pieces that complement your style",
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRelatedProducts();
  }, [currentProduct.id]);

  const loadRelatedProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const related = await relatedProductsService.getRelatedProducts(
        currentProduct,
        limit,
      );
      setProducts(related);
    } catch (error) {
      console.error("Error loading related products:", error);
      setError("Failed to load related products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-8 sm:py-12">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
              <p className="mt-3 text-sm text-neutral-500">
                Finding perfect matches...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12 border-t border-neutral-200/80">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/50 mb-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600">
                Complete Your Look
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900">
              {title}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-neutral-900 transition-colors whitespace-nowrap"
          >
            View All Products
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
