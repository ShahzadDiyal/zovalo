"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { WhatsAppProductButton } from "../../../../components/ui/WhatsAppProductButton";
import { ColorSelection } from "../../../../components/products/ColorSelection";

import Link from "next/link";
import {
  Minus,
  Plus,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  ShoppingCart,
  ShoppingBag,
  Sofa,
  X,
  ZoomIn,
  Mail,
  MessageCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  List,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { useCart } from "../../../../context/CartContext";
import { Product } from "../../../../types";
import { formatCurrency } from "../../../../lib/utils";
import { useRouter } from "next/navigation";
import { RelatedProducts } from "../../../../components/products/RelatedProducts";

interface ProductClientProps {
  product: Product;
}

export function ProductClient({ product: initialProduct }: ProductClientProps) {
  const router = useRouter();
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [orderingNow, setOrderingNow] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "faqs">(
    "description",
  );
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);

  const [selectedColorName, setSelectedColorName] = useState<string>("");
  const [selectedColorHex, setSelectedColorHex] = useState<string>("");

  const [selectedSeater, setSelectedSeater] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentCompareAtPrice, setCurrentCompareAtPrice] = useState<number>(0);

  const { addToCart } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomModalOpen(false);
    };
    if (isZoomModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isZoomModalOpen]);

  const getHighResUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("unsplash.com"))
      return `${url}&q=100&auto=format&fit=crop&w=2000`;
    if (url.includes("cloudinary.com"))
      return url.replace("/upload/", "/upload/q_auto:best,f_auto/");
    return url;
  };

  useEffect(() => {
    if (product) {
      setQuantity(1);
      if (product.colors && product.colors.length > 0) {
        setSelectedColorName(product.colors[0]);
      }
      if (product.seaterCount && product.seaterCount.length > 0) {
        setSelectedSeater(product.seaterCount[0]);
        updatePriceForSeater(product.seaterCount[0], product);
      } else {
        setCurrentPrice(product.price);
        setCurrentCompareAtPrice(product.compareAtPrice || 0);
      }
    }
  }, [product]);

  const handleColorSelection = (
    colorName: string,
    fabricName: string,
    colorHex: string,
    combinedName: string,
  ) => {
    setSelectedColorName(combinedName);
    setSelectedColorHex(colorHex);
  };

  const updatePriceForSeater = (seater: string, productData: Product) => {
    if (productData.seaterPrices && productData.seaterPrices.length > 0) {
      const seaterPrice = productData.seaterPrices.find(
        (sp) => sp.seater === seater,
      );
      if (seaterPrice) {
        setCurrentPrice(seaterPrice.price);
        setCurrentCompareAtPrice(seaterPrice.compareAtPrice || 0);
      } else {
        setCurrentPrice(productData.price);
        setCurrentCompareAtPrice(productData.compareAtPrice || 0);
      }
    } else {
      setCurrentPrice(productData.price);
      setCurrentCompareAtPrice(productData.compareAtPrice || 0);
    }
  };

  const handleSeaterChange = (seater: string) => {
    setSelectedSeater(seater);
    if (product) {
      updatePriceForSeater(seater, product);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleAddToCartOnly = async () => {
    if (!product) return;

    if (product.stock === 0) {
      alert("This product is out of stock.");
      return;
    }

    if (quantity > product.stock) {
      alert(`Sorry, only ${product.stock} items available in stock.`);
      return;
    }

    if (product.enableColorSelection && !selectedColorName) {
      alert("Please select a color");
      return;
    }

    if (
      product.seaterCount &&
      product.seaterCount.length > 0 &&
      !selectedSeater
    ) {
      alert("Please select a seater option");
      return;
    }

    setAddingToCart(true);

    try {
      await addToCart(
        {
          ...product,
          price: currentPrice,
          compareAtPrice: currentCompareAtPrice,
        },
        quantity,
        {
          color: selectedColorName,
          colorHex: selectedColorHex,
          seater: selectedSeater,
        },
      );

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleOrderNow = async () => {
    if (!product) return;

    if (product.stock === 0) {
      alert("This product is out of stock.");
      return;
    }

    if (quantity > product.stock) {
      alert(`Sorry, only ${product.stock} items available in stock.`);
      return;
    }

    if (product.enableColorSelection && !selectedColorName) {
      alert("Please select a color");
      return;
    }

    if (
      product.seaterCount &&
      product.seaterCount.length > 0 &&
      !selectedSeater
    ) {
      alert("Please select a seater option");
      return;
    }

    setOrderingNow(true);

    try {
      await addToCart(
        {
          ...product,
          price: currentPrice,
          compareAtPrice: currentCompareAtPrice,
        },
        quantity,
        {
          color: selectedColorName,
          colorHex: selectedColorHex,
          seater: selectedSeater,
        },
      );

      setTimeout(() => {
        router.push("/cart");
      }, 300);
    } catch (error) {
      console.error("Error ordering:", error);
      alert("Failed to process order. Please try again.");
      setOrderingNow(false);
    }
  };

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (!product) return;

    if (type === "increase") {
      if (quantity + 1 <= product.stock) {
        setQuantity((prev) => prev + 1);
      } else {
        alert(`Only ${product.stock} items available in stock.`);
      }
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleContactUs = () => {
    router.push("/contact");
  };

  const handleAddToWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (!wishlist.includes(product?.id)) {
      wishlist.push(product?.id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert("✓ Product added to your wishlist!");
    } else {
      alert("This product is already in your wishlist.");
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = product?.title;
    const shareText = `Check out ${product?.title} at Royal Furniture!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setShowShareOptions(true);
    }
  };

  const shareToPlatform = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(product?.title || "");
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${title}&body=Check out this product: ${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
    setShowShareOptions(false);
  };

  const discountPercent =
    currentCompareAtPrice &&
    currentPrice &&
    currentCompareAtPrice > currentPrice
      ? Math.round(
          ((currentCompareAtPrice - currentPrice) / currentCompareAtPrice) *
            100,
        )
      : 0;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 md:py-32 text-center space-y-4 sm:space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-amber-50 rounded-full mb-4">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif text-neutral-900">
          Product Not Found
        </h2>
        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto px-4">
          The product you're looking for doesn't exist or has been removed from
          our collection.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-neutral-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors rounded-xl"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const hasOptions =
    (product.colors && product.colors.length > 0) ||
    (product.seaterCount && product.seaterCount.length > 0);

  // Get custom colors from product.colors if they exist
  const customColors = product.colors || [];

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <section className="relative bg-neutral-900 text-white py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              Premium Collection
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight mb-3">
            {product.title}
          </h1>

          <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl mx-auto font-light">
            {product.category} • {product.featured && "Featured Piece"}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-10 pb-16 sm:pb-24">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-12">
          {/* Image Gallery */}
          <div className="lg:w-1/2 space-y-3 sm:space-y-4">
            <div
              onClick={() => setIsZoomModalOpen(true)}
              className="group aspect-square bg-white border border-neutral-200/80 overflow-hidden rounded-2xl relative cursor-zoom-in"
            >
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-2xl pointer-events-none">
                  <span className="bg-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl">
                    Out of Stock
                  </span>
                </div>
              )}
              <div className="absolute top-3 right-3 z-10 bg-black/40 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ZoomIn className="w-5 h-5" />
              </div>
              <img
                src={getHighResUrl(product.images[selectedImage])}
                alt={product.title}
                loading="eager"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-2">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-white border-2 transition-all rounded-xl overflow-hidden ${
                      selectedImage === idx
                        ? "border-amber-500 ring-1 ring-amber-500/20"
                        : "border-neutral-200/80 hover:border-amber-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            <div className="pt-4 pb-2">
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      Looking for a different color or seater?
                    </p>
                    <p className="text-xs text-neutral-500">
                      Contact us directly on WhatsApp and we'll customize it for
                      you!
                    </p>
                  </div>
                </div>
                <WhatsAppProductButton
                  product={product}
                  selectedSeater={selectedSeater}
                  selectedColor={selectedColorName}
                  currentPrice={currentPrice}
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 space-y-4 sm:space-y-5 md:space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200/50 px-2 sm:px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.featured && (
                <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-amber-700 border border-amber-600 px-2 sm:px-3 py-1 rounded-full bg-amber-50/50">
                  Featured
                </span>
              )}
              {!isOutOfStock && product.stock < 10 && (
                <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200/50 px-2 sm:px-3 py-1 rounded-full">
                  Only {product.stock} left!
                </span>
              )}
              {product.tags &&
                product.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest bg-neutral-900 text-white px-2 sm:px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 flex-wrap pt-4">
              <p className="text-2xl md:text-3xl sm:text-3xl font-bold text-neutral-900">
                {formatCurrency(currentPrice)}
              </p>
              {currentCompareAtPrice &&
                currentCompareAtPrice > currentPrice && (
                  <>
                    <p className="text-lg sm:text-xl text-gray-400 italic line-through">
                      {formatCurrency(currentCompareAtPrice)}
                    </p>
                    <span className="bg-red-500 text-white text-[12px] px-2 py-1 rounded-full">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
            </div>

            {/* Stock Alert */}
            {!isOutOfStock && product.stock < 5 && (
              <div className="bg-amber-50/80 border border-amber-200/80 p-3 rounded-xl">
                <p className="text-center text-amber-700 text-sm font-bold">
                  ⚠️ Only {product.stock} items left! Order soon.
                </p>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="border border-neutral-200/80 rounded-2xl p-4 sm:p-5 bg-white">
                <div className="flex items-center gap-2 mb-3">
                  <List className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-700">
                    Key Features
                  </h3>
                </div>
                <ul
                  className={`space-y-1.5 ${
                    product.featuresStyle === "bullet"
                      ? "list-disc list-inside"
                      : "list-decimal list-inside"
                  }`}
                >
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-sm text-neutral-600">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Color Selection - Shows both palette and custom colors */}
            {product.enableColorSelection && (
              <div className="border-t border-neutral-200/80 pt-4 mt-4 z-[9999]">
                <ColorSelection
                  productId={product.id}
                  onColorSelect={handleColorSelection}
                />
                {selectedColorName && (
                  <p className="text-xs text-neutral-500 mt-2">
                    Selected:{" "}
                    <span className="font-bold text-neutral-900">
                      {selectedColorName}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Custom Colors from product.colors */}
            {customColors.length > 0 && !product.enableColorSelection && (
              <div className="border-t border-neutral-200/80 pt-4 mt-4">
                <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-neutral-700 block mb-3">
                  Available Colors
                </label>
                <div className="flex flex-wrap gap-2">
                  {customColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColorName(color);
                        setSelectedColorHex(color.toLowerCase());
                      }}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-all flex items-center gap-1.5 ${
                        selectedColorName === color
                          ? "border-amber-500 bg-amber-50 text-amber-700 font-medium"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-amber-300"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      {color}
                    </button>
                  ))}
                </div>
                {selectedColorName &&
                  customColors.includes(selectedColorName) && (
                    <p className="text-xs text-neutral-500 mt-2">
                      Selected:{" "}
                      <span className="font-bold text-neutral-900">
                        {selectedColorName}
                      </span>
                    </p>
                  )}
              </div>
            )}

            {/* Seater Selection */}
            {product.seaterCount && product.seaterCount.length > 0 && (
              <div className="space-y-2">
                <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-neutral-700 block">
                  Select Seater <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.seaterCount.map((seater) => (
                    <button
                      key={seater}
                      onClick={() => handleSeaterChange(seater)}
                      className={`px-2 md:px-4 py-1 md:py-2 text-sm rounded-[6px] cursor-pointer transition-all flex items-center gap-2 ${
                        selectedSeater === seater
                          ? "bg-amber-700 text-white font-bold"
                          : "bg-white text-neutral-700 hover:bg-amber-50"
                      }`}
                    >
                      <Sofa className="w-3.5 h-3.5" />
                      <span>{seater}</span>
                    </button>
                  ))}
                </div>
                {selectedSeater && (
                  <p className="text-xs text-neutral-500 mt-1">
                    Selected:{" "}
                    <span className="font-bold text-neutral-900">
                      {selectedSeater}
                    </span>{" "}
                    - Price:{" "}
                    <span className="font-bold text-amber-600">
                      {formatCurrency(currentPrice)}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Quantity & Action Buttons */}
            <div className="space-y-4 pt-2">
              {!isOutOfStock ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-neutral-200/80 bg-white h-10 rounded-xl">
                      <button
                        onClick={() => handleQuantityChange("decrease")}
                        disabled={quantity <= 1}
                        className="w-10 h-full flex items-center justify-center cursor-pointer hover:bg-amber-50 transition-colors disabled:opacity-50 rounded-l-xl"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-12 text-center text-sm font-bold text-neutral-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange("increase")}
                        disabled={quantity >= product.stock}
                        className="w-10 h-full flex items-center justify-center cursor-pointer hover:bg-amber-50 transition-colors disabled:opacity-50 rounded-r-xl"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500">
                      {product.stock} items available
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAddToCartOnly}
                      disabled={
                        addingToCart ||
                        (hasOptions &&
                          (!selectedColorName ||
                            (product.seaterCount &&
                              product.seaterCount.length > 0 &&
                              !selectedSeater)))
                      }
                      className="flex-1 bg-white border-2 cursor-pointer border-neutral-900 text-neutral-900 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-amber-600 hover:border-amber-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 rounded-xl disabled:opacity-50"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {addingToCart ? "Adding..." : "Add to Cart"}
                    </button>
                    <button
                      onClick={handleOrderNow}
                      disabled={
                        orderingNow ||
                        (hasOptions &&
                          (!selectedColorName ||
                            (product.seaterCount &&
                              product.seaterCount.length > 0 &&
                              !selectedSeater)))
                      }
                      className="flex-1 bg-neutral-900 text-white py-3 cursor-pointer text-[11px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-all duration-300 flex items-center justify-center gap-2 rounded-xl disabled:opacity-50"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {orderingNow ? "Processing..." : "Order Now"}
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleContactUs}
                  className="w-full bg-neutral-200 text-neutral-600 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all duration-300 rounded-xl"
                >
                  Contact Us for Availability
                </button>
              )}

              {/* Success Message */}
              {showSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-slide-in-right">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">
                    ✓ Added to cart successfully!
                  </span>
                </div>
              )}

              {/* Wishlist & Share */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToWishlist}
                  className="flex-1 border border-neutral-200/80 bg-white py-2.5 cursor-pointer text-[10px] font-bold uppercase tracking-widest hover:bg-amber-50 transition-colors flex items-center justify-center gap-2 rounded-xl"
                >
                  <Heart className="w-3.5 h-3.5" /> Add to Wishlist
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 border border-neutral-200/80 bg-white py-2.5 cursor-pointer text-[10px] font-bold uppercase tracking-widest hover:bg-amber-50 transition-colors flex items-center justify-center gap-2 rounded-xl"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>

              {/* Delivery Info */}
              <div className="space-y-3 p-4 bg-white border border-neutral-200/80 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-900">
                      Free UK Delivery
                    </p>
                    <p className="text-[9px] text-neutral-500">
                      Estimated delivery: 1-3 business days
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-900">
                      Cash on Delivery
                    </p>
                    <p className="text-[9px] text-neutral-500">
                      Pay when your furniture arrives
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Description & FAQs */}
        <div className="mt-12 sm:mt-16 md:mt-20 border-t border-neutral-200/80 pt-8 sm:pt-10 md:pt-12">
          <div className="flex border-b border-neutral-200/80 mb-6 sm:mb-8">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 relative ${
                activeTab === "description"
                  ? "text-amber-600 border-b-2 border-amber-600"
                  : "text-neutral-400 hover:text-neutral-900"
              }`}
            >
              Product Description
            </button>
            {product.faqs && product.faqs.length > 0 && (
              <button
                onClick={() => setActiveTab("faqs")}
                className={`px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 relative ${
                  activeTab === "faqs"
                    ? "text-amber-600 border-b-2 border-amber-600"
                    : "text-neutral-400 hover:text-neutral-900"
                }`}
              >
                FAQs ({product.faqs.length})
              </button>
            )}
          </div>

          <div className="py-2 sm:py-4">
            {activeTab === "description" && (
              <div className="prose prose-sm sm:prose-base max-w-none">
                {/* Render HTML content properly */}
                <div
                  className="text-neutral-600 text-sm sm:text-base leading-relaxed space-y-3 sm:space-y-4"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {activeTab === "faqs" &&
              product.faqs &&
              product.faqs.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  {product.faqs.map((faq, index) => {
                    const isOpen = openFaqs.includes(index);
                    return (
                      <div
                        key={index}
                        className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden transition-all duration-200"
                      >
                        <button
                          onClick={() => toggleFaq(index)}
                          className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-amber-50/50 transition-colors text-left"
                        >
                          <span className="text-sm sm:text-base font-semibold text-neutral-900 pr-4">
                            {faq.question}
                          </span>
                          <span className="flex-shrink-0 ml-2">
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-amber-600" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-neutral-400" />
                            )}
                          </span>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isOpen
                              ? "max-h-[500px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
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
              )}
          </div>
        </div>

        <RelatedProducts
          currentProduct={product}
          limit={4}
          title="You May Also Like"
          subtitle="Discover more pieces that complement your style"
        />
      </div>

      {/* Zoom Modal */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <button
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white p-2 rounded-full bg-black/40 hover:bg-black/80 transition-colors z-50"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getHighResUrl(product.images[selectedImage])}
              alt={product.title}
              className="max-w-full max-h-[75vh] object-contain drop-shadow-2xl rounded-md"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev === 0 ? product.images.length - 1 : prev - 1,
                    )
                  }
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/80 p-2 sm:p-3 rounded-full transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev === product.images.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/80 p-2 sm:p-3 rounded-full transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto max-w-full p-2 bg-black/40 rounded-full">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === idx
                        ? "border-amber-500 scale-110"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Options Modal */}
      {showShareOptions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm"
            onClick={() => setShowShareOptions(false)}
          />
          <div className="bg-white max-w-sm w-full relative z-10 shadow-2xl border border-neutral-200/80 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-neutral-200/80 flex justify-between items-center">
              <h3 className="text-lg font-serif text-neutral-900">
                Share this product
              </h3>
              <button
                onClick={() => setShowShareOptions(false)}
                className="text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => shareToPlatform("facebook")}
                  className="flex items-center gap-2 p-2 bg-[#1877f2] text-white rounded-xl text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Facebook
                </button>
                <button
                  onClick={() => shareToPlatform("twitter")}
                  className="flex items-center gap-2 p-2 bg-[#1da1f2] text-white rounded-xl text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Twitter
                </button>
                <button
                  onClick={() => shareToPlatform("whatsapp")}
                  className="flex items-center gap-2 p-2 bg-[#25d366] text-white rounded-xl text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </button>
                <button
                  onClick={() => shareToPlatform("email")}
                  className="flex items-center gap-2 p-2 bg-neutral-600 text-white rounded-xl text-sm"
                >
                  <Mail className="w-4 h-4" /> Email
                </button>
              </div>
              <div className="pt-2">
                <p className="text-xs text-neutral-500 mb-1">Or copy link:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== "undefined" ? window.location.href : ""}
                    className="flex-1 bg-neutral-50 border border-neutral-200/80 py-1.5 px-2 text-xs rounded-xl"
                  />
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(window.location.href);
                      alert("Link copied!");
                      setShowShareOptions(false);
                    }}
                    className="px-3 py-1.5 bg-neutral-900 text-white text-[10px] font-bold rounded-xl"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
      `}</style>
    </div>
  );
}
