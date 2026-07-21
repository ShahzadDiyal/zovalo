"use client";
import { ProductCard } from "../../../../components/ui/ProductCard";
import { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  PackageOpen,
  Palette,
  Sofa,
  Tag,
  Sparkles,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { EmptyState } from "../../../../components/ui/EmptyState";
import { SEO } from "../../../../components/SEO";
import { productApi } from "../../../../services/productApi";
import { categoryApi } from "../../../../services/categoryApi";
import { Product, Category } from "../../../../types";
import { LoadingSpinner } from "../../../../components/ui/Loading";

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug
    ? Array.isArray(params.slug)
      ? params.slug[0]
      : params.slug
    : null;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categoryName, setCategoryName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState("latest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSeaters, setSelectedSeaters] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAllCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug && categories.length > 0) {
      const matchedCategory = categories.find((c) => c.slug === slug);
      if (matchedCategory) {
        setSelectedCategory(matchedCategory.name);
        setCategoryName(matchedCategory.name);
      } else {
        const formattedName = slug
          .split("-")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        setSelectedCategory(formattedName);
        setCategoryName(formattedName);
      }
    }
  }, [slug, categories]);

  useEffect(() => {
    if (searchParams) {
      const query = searchParams.get("search");
      if (query && query !== searchQuery) {
        setSearchQuery(query);
      }
    }
  }, [searchParams]);

  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((product) => {
      if (product.colors && product.colors.length > 0) {
        product.colors.forEach((color) => colors.add(color));
      }
    });
    return Array.from(colors).sort();
  }, [products]);

  const availableSeaters = useMemo(() => {
    const seaters = new Set<string>();
    products.forEach((product) => {
      if (product.seaterCount && product.seaterCount.length > 0) {
        product.seaterCount.forEach((seater) => seaters.add(seater));
      }
    });
    return Array.from(seaters).sort();
  }, [products]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((product) => {
      if (product.tags && product.tags.length > 0) {
        product.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [products]);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const toggleSeater = (seater: string) => {
    setSelectedSeaters((prev) =>
      prev.includes(seater)
        ? prev.filter((s) => s !== seater)
        : [...prev, seater],
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setPriceRange([0, maxPrice]);
    setSortBy("latest");
    setSelectedColors([]);
    setSelectedSeaters([]);
    setSelectedTags([]);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    if (selectedColors.length > 0) {
      result = result.filter(
        (p) =>
          p.colors && p.colors.some((color) => selectedColors.includes(color)),
      );
    }

    if (selectedSeaters.length > 0) {
      result = result.filter(
        (p) =>
          p.seaterCount &&
          p.seaterCount.some((seater) => selectedSeaters.includes(seater)),
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter(
        (p) => p.tags && p.tags.some((tag) => selectedTags.includes(tag)),
      );
    }

    switch (sortBy) {
      case "low-to-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "high-to-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "latest":
        result.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        break;
    }

    return result;
  }, [
    products,
    selectedCategory,
    searchQuery,
    priceRange,
    sortBy,
    selectedColors,
    selectedSeaters,
    selectedTags,
  ]);

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 5000;
    return Math.max(...products.map((p) => p.price), 5000);
  }, [products]);

  const hasActiveFilters =
    selectedColors.length > 0 ||
    selectedSeaters.length > 0 ||
    selectedTags.length > 0 ||
    searchQuery !== "" ||
    priceRange[1] < maxPrice;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] sm:min-h-[600px]">
        <LoadingSpinner />
        <span className="ml-3 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-amber-600">
          Loading Collection...
        </span>
      </div>
    );
  }

  const categoryNames = ["All", ...categories.map((c) => c.name)];

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-16 pt-6 sm:pt-0">
      <SEO
        title={categoryName || "Category"}
        description={`Explore our ${categoryName?.toLowerCase() || ""} collection. Premium furniture designed for comfort and crafted to last.`}
      />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-neutral-900 text-white py-12 sm:py-16 md:py-20 mb-8 sm:mb-12">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              {categoryName || "Collection"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-tight">
            {categoryName || "Shop All"}
          </h1>
          <p className="text-neutral-400 font-light text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Discover our curated selection of {categoryName?.toLowerCase() || ""} pieces, designed for comfort and crafted to last.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Filters Sidebar (Desktop) */}
          <aside className="hidden lg:block w-72 space-y-6 flex-shrink-0 sticky top-24 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200/80">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                Filter Catalog
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[10px] font-bold uppercase tracking-wider text-amber-600 hover:text-neutral-900 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search catalog..."
                    className="w-full bg-neutral-50 border border-neutral-200/80 py-2.5 pl-9 pr-3 text-xs text-neutral-900 outline-none focus:border-amber-500 focus:bg-white transition-all rounded-xl"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700">
                  Categories
                </label>
                <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                  {categoryNames.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left text-xs py-2 px-3 transition-all rounded-xl ${
                        selectedCategory === cat
                          ? "bg-neutral-900 text-white font-medium shadow-sm"
                          : "hover:bg-amber-50/60 text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              {availableColors.length > 0 && (
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-600" /> Color
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableColors.map((color) => {
                      const isSelected = selectedColors.includes(color);
                      return (
                        <button
                          key={color}
                          onClick={() => toggleColor(color)}
                          className={`px-2.5 py-1 text-[11px] rounded-full transition-all flex items-center gap-1.5 border ${
                            isSelected
                              ? "bg-neutral-900 text-white border-neutral-900 font-medium shadow-sm"
                              : "bg-neutral-50 text-neutral-600 border-neutral-200/80 hover:border-amber-400"
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: color.toLowerCase() }}
                          />
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Seater Filter */}
              {availableSeaters.length > 0 && (
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 flex items-center gap-1.5">
                    <Sofa className="w-3.5 h-3.5 text-amber-600" /> Seater
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableSeaters.map((seater) => {
                      const isSelected = selectedSeaters.includes(seater);
                      return (
                        <button
                          key={seater}
                          onClick={() => toggleSeater(seater)}
                          className={`px-2.5 py-1 text-[11px] rounded-full transition-all border ${
                            isSelected
                              ? "bg-neutral-900 text-white border-neutral-900 font-medium shadow-sm"
                              : "bg-neutral-50 text-neutral-600 border-neutral-200/80 hover:border-amber-400"
                          }`}
                        >
                          {seater}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tags Filter */}
              {availableTags.length > 0 && (
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-600" /> Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableTags.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-2.5 py-1 text-[11px] rounded-full transition-all border ${
                            isSelected
                              ? "bg-amber-500 text-white border-amber-500 font-medium shadow-sm"
                              : "bg-neutral-50 text-neutral-600 border-neutral-200/80 hover:border-amber-400"
                          }`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div className="space-y-3 pt-2 border-t border-neutral-200/60">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700">
                  <span>Price Range</span>
                  <span className="text-amber-600 font-semibold">Max: £{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-amber-500 h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-medium text-neutral-400">
                  <span>£0</span>
                  <span>£{maxPrice}</span>
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="w-full mt-2 py-2.5 text-[10px] font-bold uppercase tracking-widest text-neutral-900 bg-amber-50/80 border border-neutral-200/80 rounded-xl hover:bg-neutral-900 hover:text-white transition-all shadow-sm"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6 w-full">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-neutral-200/80 rounded-2xl p-3 sm:p-4 gap-4 shadow-sm">
              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 border border-neutral-200/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-900 bg-neutral-50 hover:bg-amber-50 rounded-xl transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-amber-500 rounded-full" />
                  )}
                </button>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                  Showing <span className="text-neutral-900 font-extrabold">{filteredProducts.length}</span> {filteredProducts.length === 1 ? "Product" : "Products"}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider hidden sm:inline">
                  Sort:
                </span>
                <div className="relative w-full sm:w-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto appearance-none bg-neutral-50 border border-neutral-200/80 py-2 pl-4 pr-10 text-xs font-bold uppercase tracking-wider text-neutral-900 outline-none focus:border-amber-500 cursor-pointer rounded-xl transition-all"
                  >
                    <option value="latest">Latest Arrivals</option>
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-neutral-200/80 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mr-1">
                  Active:
                </span>
                {selectedCategory !== "All" && (
                  <span className="px-2.5 py-1 bg-amber-50 text-[11px] text-neutral-900 font-medium rounded-md border border-amber-200/50 flex items-center gap-1.5">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory("All")} className="hover:text-amber-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedColors.map((color) => (
                  <span
                    key={color}
                    className="px-2.5 py-1 bg-amber-50 text-[11px] text-neutral-900 font-medium rounded-md border border-amber-200/50 flex items-center gap-1.5"
                  >
                    Color: {color}
                    <button onClick={() => toggleColor(color)} className="hover:text-amber-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedSeaters.map((seater) => (
                  <span
                    key={seater}
                    className="px-2.5 py-1 bg-amber-50 text-[11px] text-neutral-900 font-medium rounded-md border border-amber-200/50 flex items-center gap-1.5"
                  >
                    {seater}
                    <button onClick={() => toggleSeater(seater)} className="hover:text-amber-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-amber-50 text-[11px] text-neutral-900 font-medium rounded-md border border-amber-200/50 flex items-center gap-1.5"
                  >
                    #{tag}
                    <button onClick={() => toggleTag(tag)} className="hover:text-amber-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {searchQuery && (
                  <span className="px-2.5 py-1 bg-amber-50 text-[11px] text-neutral-900 font-medium rounded-md border border-amber-200/50 flex items-center gap-1.5">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="hover:text-amber-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-bold text-amber-600 hover:underline ml-auto pr-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 bg-white border border-dashed border-neutral-200/80 rounded-2xl text-center">
                <EmptyState
                  icon={PackageOpen}
                  title="No matches found"
                  description="We couldn't find any products matching your current filters. Try adjusting your search or clearing the filters."
                  actionText="Clear all filters"
                  onAction={clearAllFilters}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl p-6 space-y-6 overflow-y-auto animate-slide-in flex flex-col justify-between rounded-r-2xl">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-200/80">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                  Refine Collection
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-neutral-50 border border-neutral-200/80 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-amber-500 rounded-xl"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700">
                  Categories
                </label>
                <div className="grid grid-cols-1 gap-1 max-h-[160px] overflow-y-auto pr-1">
                  {categoryNames.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowMobileFilters(false);
                      }}
                      className={`text-left text-xs py-2 px-3 rounded-xl border transition-all ${
                        selectedCategory === cat
                          ? "bg-neutral-900 text-white border-neutral-900 font-medium"
                          : "bg-neutral-50 text-neutral-600 border-neutral-200/80"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors - Mobile */}
              {availableColors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-600" /> Color
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`px-2.5 py-1 text-[10px] rounded-full transition-all border ${
                          selectedColors.includes(color)
                            ? "bg-neutral-900 text-white border-neutral-900 font-medium"
                            : "bg-neutral-50 text-neutral-600 border-neutral-200/80"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Seaters - Mobile */}
              {availableSeaters.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 flex items-center gap-1.5">
                    <Sofa className="w-3.5 h-3.5 text-amber-600" /> Seater
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableSeaters.map((seater) => (
                      <button
                        key={seater}
                        onClick={() => toggleSeater(seater)}
                        className={`px-2.5 py-1 text-[10px] rounded-full transition-all border ${
                          selectedSeaters.includes(seater)
                            ? "bg-neutral-900 text-white border-neutral-900 font-medium"
                            : "bg-neutral-50 text-neutral-600 border-neutral-200/80"
                        }`}
                      >
                        {seater}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range - Mobile */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700">
                  <span>Price Range</span>
                  <span className="text-amber-600 font-semibold">Max: £{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-amber-500 h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Sort Options - Mobile */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700">
                  Sort By
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { value: "latest", label: "Latest Arrivals" },
                    { value: "low-to-high", label: "Price: Low to High" },
                    { value: "high-to-low", label: "Price: High to Low" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowMobileFilters(false);
                      }}
                      className={`text-left text-xs py-2.5 px-3 rounded-xl border transition-all ${
                        sortBy === option.value
                          ? "bg-neutral-900 text-white border-neutral-900 font-medium"
                          : "bg-neutral-50 text-neutral-600 border-neutral-200/80"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-neutral-200/80">
              <button
                onClick={clearAllFilters}
                className="w-full bg-neutral-100 text-neutral-900 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-neutral-900 text-white py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-amber-600 hover:text-white transition-colors shadow-sm"
              >
                View {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in { animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}