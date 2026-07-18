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
  Layers,
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
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Fetch real data
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

  // Set category from slug
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

  // Sync search from URL
  useEffect(() => {
    if (searchParams) {
      const query = searchParams.get("search");
      if (query && query !== searchQuery) {
        setSearchQuery(query);
      }
    }
  }, [searchParams]);

  // Extract all available options from products
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

  const availableMaterials = useMemo(() => {
    const materials = new Set<string>();
    products.forEach((product) => {
      if (product.material) {
        materials.add(product.material);
      }
    });
    return Array.from(materials).sort();
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

  // Toggle filter functions
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

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material],
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
    setSelectedMaterials([]);
    setSelectedTags([]);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter - THIS IS THE KEY PART
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search Filter
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Price Range Filter
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    // Color Filter
    if (selectedColors.length > 0) {
      result = result.filter(
        (p) =>
          p.colors && p.colors.some((color) => selectedColors.includes(color)),
      );
    }

    // Seater Filter
    if (selectedSeaters.length > 0) {
      result = result.filter(
        (p) =>
          p.seaterCount &&
          p.seaterCount.some((seater) => selectedSeaters.includes(seater)),
      );
    }

    // Material Filter
    if (selectedMaterials.length > 0) {
      result = result.filter(
        (p) => p.material && selectedMaterials.includes(p.material),
      );
    }

    // Tags Filter
    if (selectedTags.length > 0) {
      result = result.filter(
        (p) => p.tags && p.tags.some((tag) => selectedTags.includes(tag)),
      );
    }

    // Sorting
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
    selectedMaterials,
    selectedTags,
  ]);

  // Reset price range max based on products
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 5000;
    return Math.max(...products.map((p) => p.price), 5000);
  }, [products]);

  const hasActiveFilters =
    selectedColors.length > 0 ||
    selectedSeaters.length > 0 ||
    selectedMaterials.length > 0 ||
    selectedTags.length > 0 ||
    searchQuery !== "" ||
    priceRange[1] < maxPrice;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] sm:min-h-[600px]">
        <LoadingSpinner />
        <span className="ml-3 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-gold">
          Loading Collection...
        </span>
      </div>
    );
  }

  const categoryNames = ["All", ...categories.map((c) => c.name)];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12 space-y-6 sm:space-y-8 pt-10 md:pt-18">
      <SEO
        title={categoryName || "Category"}
        description={`Explore our ${categoryName?.toLowerCase() || ""} collection. Premium furniture designed for comfort and crafted to last.`}
      />

      {/* Page Header */}
      <div className="text-center space-y-2 sm:space-y-3 md:space-y-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display text-near-black tracking-tight px-2">
          {categoryName || "Shop All"}
        </h1>
        <p className="text-gray-666 font-light text-sm sm:text-base max-w-2xl mx-auto px-4">
          Discover our curated selection of {categoryName?.toLowerCase() || ""}{" "}
          pieces, designed for comfort and crafted to last.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Filters Sidebar (Desktop) */}
        <aside className="hidden lg:block w-72 space-y-6 md:space-y-8 flex-shrink-0">
          <div className="space-y-5 md:space-y-6">
            {/* Search */}
            <div className="space-y-2 md:space-y-3">
              <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-walnut">
                Search
              </h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-a0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Keyword..."
                  className="w-full bg-cream border border-warm-beige py-2 pl-9 md:pl-10 pr-3 md:pr-4 text-xs outline-none focus:border-gold rounded"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2 md:space-y-3">
              <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-walnut">
                Categories
              </h4>
              <div className="space-y-0.5 md:space-y-1 max-h-[200px] overflow-y-auto">
                {categoryNames.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left text-[11px] md:text-[12px] py-1.5 px-2 md:px-3 transition-colors rounded ${
                      selectedCategory === cat
                        ? "bg-near-black text-white"
                        : "hover:bg-cream text-gray-666"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            {availableColors.length > 0 && (
              <div className="space-y-2 md:space-y-3">
                <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-walnut flex items-center gap-2">
                  <Palette className="w-3 h-3" /> Color
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleColor(color)}
                      className={`px-2 py-1 text-[10px] rounded-full transition-all flex items-center gap-1 ${
                        selectedColors.includes(color)
                          ? "bg-gold text-near-black font-bold"
                          : "bg-cream text-gray-600 hover:bg-gold/20"
                      }`}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Seater Filter */}
            {availableSeaters.length > 0 && (
              <div className="space-y-2 md:space-y-3">
                <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-walnut flex items-center gap-2">
                  <Sofa className="w-3 h-3" /> Seater
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {availableSeaters.map((seater) => (
                    <button
                      key={seater}
                      onClick={() => toggleSeater(seater)}
                      className={`px-2 py-1 text-[10px] rounded-full transition-all ${
                        selectedSeaters.includes(seater)
                          ? "bg-gold text-near-black font-bold"
                          : "bg-cream text-gray-600 hover:bg-gold/20"
                      }`}
                    >
                      {seater}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Material Filter */}
            {availableMaterials.length > 0 && (
              <div className="space-y-2 md:space-y-3">
                <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-walnut flex items-center gap-2">
                  <Layers className="w-3 h-3" /> Material
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {availableMaterials.map((material) => (
                    <button
                      key={material}
                      onClick={() => toggleMaterial(material)}
                      className={`px-2 py-1 text-[10px] rounded-full transition-all ${
                        selectedMaterials.includes(material)
                          ? "bg-gold text-near-black font-bold"
                          : "bg-cream text-gray-600 hover:bg-gold/20"
                      }`}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Filter */}
            {availableTags.length > 0 && (
              <div className="space-y-2 md:space-y-3">
                <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-walnut flex items-center gap-2">
                  <Tag className="w-3 h-3" /> Tags
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2 py-1 text-[10px] rounded-full transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-near-black text-white font-bold"
                          : "bg-cream text-gray-600 hover:bg-gold/20"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div className="space-y-3 md:space-y-4">
              <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-walnut">
                Price Range
              </h4>
              <div className="space-y-3 md:space-y-4">
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-walnut h-1.5"
                />
                <div className="flex justify-between text-[10px] md:text-[11px] font-bold text-gray-666">
                  <span>£0</span>
                  <span>£{priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="w-full mt-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gold border border-gold rounded hover:bg-gold hover:text-near-black transition-all"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-6 md:space-y-8">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-white border border-warm-beige py-3 sm:py-4 px-3 sm:px-4 gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 w-full xs:w-auto justify-between xs:justify-start">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-1.5 sm:gap-2 border border-warm-beige px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-near-black hover:bg-cream transition-colors rounded"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="ml-1 w-2 h-2 bg-gold rounded-full"></span>
                )}
              </button>
              <p className="text-[10px] sm:text-[11px] font-bold text-gray-a0 uppercase tracking-widest">
                {filteredProducts.length} Result
                {filteredProducts.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full xs:w-auto justify-end">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-a0 uppercase tracking-widest hidden sm:inline">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-cream border border-warm-beige px-3 sm:px-4 py-1.5 sm:py-2  w-full md:w-fit text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-near-black outline-none focus:border-gold cursor-pointer rounded"
              >
                <option value="latest">Latest Arrivals</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-warm-beige">
              <span className="text-[9px] text-gray-400">Active filters:</span>
              {selectedCategory !== "All" && (
                <span className="px-2 py-0.5 bg-cream text-[9px] rounded-full flex items-center gap-1">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory("All")}>
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
              {selectedColors.map((color) => (
                <span
                  key={color}
                  className="px-2 py-0.5 bg-cream text-[9px] rounded-full flex items-center gap-1"
                >
                  Color: {color}
                  <button onClick={() => toggleColor(color)}>
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              {selectedSeaters.map((seater) => (
                <span
                  key={seater}
                  className="px-2 py-0.5 bg-cream text-[9px] rounded-full flex items-center gap-1"
                >
                  {seater}
                  <button onClick={() => toggleSeater(seater)}>
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              {searchQuery && (
                <span className="px-2 py-0.5 bg-cream text-[9px] rounded-full flex items-center gap-1">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery("")}>
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-[9px] text-gold hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-12 sm:py-16 md:py-20 border border-dashed border-warm-beige rounded-lg">
              <EmptyState
                icon={PackageOpen}
                title="No matches found"
                description="We couldn't find any products matching your current filters. Try adjusting your search or clearing the filters."
                actionText="Clear all filters"
                onAction={clearAllFilters}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-[320px] bg-white shadow-2xl p-5 sm:p-6 space-y-6 sm:space-y-8 overflow-y-auto animate-slide-in">
            <div className="flex justify-between items-center border-b border-warm-beige pb-3 sm:pb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest">
                Filter & Sort
              </h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1 hover:bg-cream rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {/* Search */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-walnut">
                  Search
                </h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-a0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-cream border border-warm-beige py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gold rounded"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-walnut">
                  Categories
                </h4>
                <div className="grid grid-cols-1 gap-1.5 max-h-[200px] overflow-y-auto">
                  {categoryNames.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowMobileFilters(false);
                      }}
                      className={`text-left text-[12px] py-2.5 px-3 border rounded transition-all ${
                        selectedCategory === cat
                          ? "bg-near-black text-white border-near-black"
                          : "bg-cream text-gray-666 border-warm-beige"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors - Mobile */}
              {availableColors.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-walnut flex items-center gap-2">
                    <Palette className="w-3 h-3" /> Color
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`px-2 py-1 text-[10px] rounded-full transition-all ${
                          selectedColors.includes(color)
                            ? "bg-gold text-near-black"
                            : "bg-cream text-gray-600"
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
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-walnut flex items-center gap-2">
                    <Sofa className="w-3 h-3" /> Seater
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {availableSeaters.map((seater) => (
                      <button
                        key={seater}
                        onClick={() => toggleSeater(seater)}
                        className={`px-2 py-1 text-[10px] rounded-full transition-all ${
                          selectedSeaters.includes(seater)
                            ? "bg-gold text-near-black"
                            : "bg-cream text-gray-600"
                        }`}
                      >
                        {seater}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range - Mobile */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-walnut">
                  Max Price: £{priceRange[1]}
                </h4>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-walnut h-2"
                />
              </div>

              {/* Sort Options - Mobile */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-walnut">
                  Sort By
                </h4>
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
                      className={`text-left text-[12px] py-2.5 px-3 border rounded transition-all ${
                        sortBy === option.value
                          ? "bg-near-black text-white"
                          : "bg-cream text-gray-666"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={clearAllFilters}
              className="w-full bg-warm-beige text-near-black py-3 text-[11px] font-bold uppercase tracking-widest rounded hover:bg-gold transition-colors mt-4"
            >
              Reset All Filters
            </button>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full bg-near-black text-white py-3 text-[11px] font-bold uppercase tracking-widest rounded hover:bg-gold transition-colors"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
