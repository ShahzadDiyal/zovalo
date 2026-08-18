// src/app/(user)/collections/CollectionsClient.tsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Grid3x3, Search, ChevronRight } from "lucide-react";
import { Category } from "../../../types";

interface CollectionsClientProps {
  categories: Category[];
  totalProducts: number;
}

export function CollectionsClient({
  categories,
  totalProducts,
}: CollectionsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.description?.toLowerCase().includes(query) ||
        category.slug?.toLowerCase().includes(query),
    );
  }, [categories, searchQuery]);

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-neutral-900 text-white py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full">
            <Grid3x3 className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              {totalProducts} Products Available
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl  text-white tracking-tight">
            All Collections
          </h1>
          <p className="text-neutral-400 font-light text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Explore our complete range of premium furniture collections, crafted
            for comfort and designed to last.
          </p>
        </div>
      </section>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-10 pb-16 sm:pb-24">
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8 sm:mb-12">
          <div className="bg-white border border-neutral-200/80 p-1 sm:p-1.5 shadow-sm">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collections by name..."
                className="w-full bg-transparent py-3 pl-11 pr-4 text-sm text-neutral-900 outline-none rounded-xl placeholder:text-neutral-400"
              />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-white border border-neutral-200/80 rounded-2xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl  text-neutral-900 mb-2">
              No collections found
            </h3>
            <p className="text-neutral-500 text-sm">
              We couldn't find any collections matching "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-amber-600 hover:text-amber-700 text-sm font-medium"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredCategories.map((category) => {
              // Use category image or fallback to placeholder
              const categoryImage =
                category.image || (category.featuredImage as any) || "";
              const hasImage = categoryImage && categoryImage.length > 0;

              return (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group bg-white border border-neutral-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                    {hasImage ? (
                      <img
                        src={categoryImage}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-neutral-100">
                        <span className="text-5xl opacity-30">🪑</span>
                      </div>
                    )}

                    {/* Dark Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category name overlay on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-white text-sm font-bold uppercase tracking-widest">
                        View Collection
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 flex flex-col">
                    {/* Category Name */}
                    <h3 className="text-base sm:text-lg  text-neutral-900 group-hover:text-amber-600 transition-colors mb-1">
                      {category.name}
                    </h3>

                    {/* Description */}
                    {category.description && (
                      <p className="text-xs sm:text-sm text-neutral-500 line-clamp-2 flex-1">
                        {category.description}
                      </p>
                    )}

                    {/* Product Count & Action */}
                    <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                        {category.productCount || 0} Products
                      </span>
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest group-hover:text-neutral-900 transition-colors flex items-center gap-1">
                        Browse <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 text-center">
          <h3 className="text-xl sm:text-2xl  mb-2">
            Can't find what you're looking for?
          </h3>
          <p className="text-neutral-400 text-sm mb-4">
            Contact our team for personalized assistance or custom orders.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-neutral-900 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors rounded-xl"
            >
              Contact Us
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors rounded-xl"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
