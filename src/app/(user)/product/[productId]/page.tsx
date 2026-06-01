"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Minus,
  Plus,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  ShoppingCart,
  ShoppingBag,
  Ruler,
  Weight,
  Palette,
  Sofa,
  Wrench,
  Shield,
  Globe,
  Clock,
  Tag,
  X,
  Mail,
  MessageCircle,
  Check,
} from "lucide-react";
import { useCart } from "../../../../context/CartContext";
import { productApi } from "../../../../services/productApi";
import { Product } from "../../../../types";
import { formatCurrency } from "../../../../lib/utils";
import { LoadingSpinner } from "../../../../components/ui/Loading";
import { SEO } from "../../../../components/SEO";
import { useRouter } from "next/navigation";

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [orderingNow, setOrderingNow] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Selected options for the product
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSeater, setSelectedSeater] = useState<string>("");

  // Current price based on selected seater
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentCompareAtPrice, setCurrentCompareAtPrice] = useState<number>(0);

  const { addToCart } = useCart();

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      let productData = await productApi.getById(productId!);
      if (!productData) {
        productData = await productApi.getProductBySlug(productId!);
      }
      if (productData) {
        setProduct(productData);
        setQuantity(1);
        // Set default selections
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        if (productData.seaterCount && productData.seaterCount.length > 0) {
          setSelectedSeater(productData.seaterCount[0]);
          // Set price based on first seater
          updatePriceForSeater(productData.seaterCount[0], productData);
        } else {
          setCurrentPrice(productData.price);
          setCurrentCompareAtPrice(productData.compareAtPrice || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update price when seater changes
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

  const handleAddToCartOnly = () => {
    if (!product) return;

    if (product.stock === 0) {
      alert("This product is out of stock.");
      return;
    }

    if (quantity > product.stock) {
      alert(`Sorry, only ${product.stock} items available in stock.`);
      return;
    }

    // Validate required selections
    if (product.colors && product.colors.length > 0 && !selectedColor) {
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

    // Add to cart with selected options and current price
    addToCart(
      {
        ...product,
        price: currentPrice,
        compareAtPrice: currentCompareAtPrice,
      },
      quantity,
      {
        color: selectedColor,
        seater: selectedSeater,
      },
    );

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    setAddingToCart(false);
  };

  const handleOrderNow = () => {
    if (!product) return;

    if (product.stock === 0) {
      alert("This product is out of stock.");
      return;
    }

    if (quantity > product.stock) {
      alert(`Sorry, only ${product.stock} items available in stock.`);
      return;
    }

    // Validate required selections
    if (product.colors && product.colors.length > 0 && !selectedColor) {
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

    // Add to cart with selected options and current price
    addToCart(
      {
        ...product,
        price: currentPrice,
        compareAtPrice: currentCompareAtPrice,
      },
      quantity,
      {
        color: selectedColor,
        seater: selectedSeater,
      },
    );

    setTimeout(() => {
      router.push("/cart");
    }, 100);
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
    const shareText = `Check out ${product?.title} at Zovallo!`;

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] sm:min-h-[600px]">
        <LoadingSpinner />
        <span className="ml-3 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-gold">
          Loading Masterpiece...
        </span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 md:py-32 text-center space-y-4 sm:space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-cream rounded-full mb-4">
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
        <h2 className="text-xl sm:text-2xl font-display text-near-black">
          Product Not Found
        </h2>
        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto px-4">
          The product you're looking for doesn't exist or has been removed from
          our collection.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-near-black text-white px-6 sm:px-8 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest hover:bg-gold transition-colors rounded"
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

  return (
    <>
      <SEO
        title={product.title}
        description={product.description.substring(0, 160)}
      />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 pt-24 sm:py-8 md:py-12">
        {/* Success Toast Message */}
        {showSuccess && (
          <div className="fixed top-24 right-4 z-50 bg-mint-50 border border-mint-200 text-mint-700 px-4 py-2 rounded-lg shadow-lg animate-slide-in-right">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm font-medium">
                Added to cart successfully!
              </span>
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        <div className="mb-2 sm:mb-8 overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-gold transition-colors">
              Shop
            </Link>
            <span>/</span>
            <Link
              href={`/category/${product.category.toLowerCase().replace(/ /g, "-")}`}
              className="hover:text-gold transition-colors"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gold truncate max-w-[120px] sm:max-w-none">
              {product.title}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-12">
          {/* Image Gallery */}
          <div className="lg:w-1/2 space-y-3 sm:space-y-4">
            <div className="aspect-square bg-cream border border-warm-beige overflow-hidden rounded-lg relative">
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
                  <span className="bg-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold uppercase tracking-widest rounded">
                    Out of Stock
                  </span>
                </div>
              )}
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-cream border transition-all rounded-lg overflow-hidden ${
                      selectedImage === idx
                        ? "border-gold ring-2 ring-gold/20"
                        : "border-warm-beige hover:border-gold"
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
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 space-y-4 sm:space-y-5 md:space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut bg-cream px-2 sm:px-3 py-1 rounded">
                {product.category}
              </span>
              {product.featured && (
                <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-gold border border-gold px-2 sm:px-3 py-1 rounded">
                  Featured
                </span>
              )}
              {!isOutOfStock && product.stock < 10 && (
                <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/10 px-2 sm:px-3 py-1 rounded">
                  Only {product.stock} left!
                </span>
              )}
              {product.tags &&
                product.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest bg-near-black text-white px-2 sm:px-3 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display text-near-black tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Price with Discount - Dynamically updates based on seater */}
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-2xl sm:text-3xl font-light text-near-black">
                {formatCurrency(currentPrice)}
              </p>
              {currentCompareAtPrice &&
                currentCompareAtPrice > currentPrice && (
                  <>
                    <p className="text-lg sm:text-xl text-gray-400 line-through">
                      {formatCurrency(currentCompareAtPrice)}
                    </p>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
            </div>

            {/* Stock Status Bar */}
            {!isOutOfStock && product.stock < 5 && (
              <div className="bg-gold/10 border border-gold/20 p-3 rounded-lg">
                <p className="text-center text-walnut text-sm font-bold">
                  ⚠️ Only {product.stock} items left! Order soon.
                </p>
              </div>
            )}

            {/* Product Specifications Grid */}
            <div className="border border-warm-beige rounded-lg p-4 bg-cream/20">
              <h3 className="text-xs font-bold uppercase tracking-widest text-walnut mb-3">
                Product Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                {/* Material */}
                {product.material && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-gold" />
                    <span className="text-xs text-gray-600">Material:</span>
                    <span className="text-xs font-medium text-near-black truncate">
                      {product.material}
                    </span>
                  </div>
                )}

                {/* Dimensions */}
                {product.dimensions && (
                  <div className="flex items-center gap-2">
                    <Ruler className="w-3.5 h-3.5 text-gold" />
                    <span className="text-xs text-gray-600">Dimensions:</span>
                    <span className="text-xs font-medium text-near-black truncate">
                      {product.dimensions}
                    </span>
                  </div>
                )}

                {/* Weight - RESTORED */}
                {product.weight && product.weight > 0 && (
                  <div className="flex items-center gap-2">
                    <Weight className="w-3.5 h-3.5 text-gold" />
                    <span className="text-xs text-gray-600">Weight:</span>
                    <span className="text-xs font-medium text-near-black">
                      {product.weight} kg
                    </span>
                  </div>
                )}

                {/* Warranty - RESTORED */}
                {product.warrantyYears && product.warrantyYears > 0 && (
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-gold" />
                    <span className="text-xs text-gray-600">Warranty:</span>
                    <span className="text-xs font-medium text-near-black">
                      {product.warrantyYears} years
                    </span>
                  </div>
                )}

                {/* Delivery */}
                {product.estimatedDelivery && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gold" />
                    <span className="text-xs text-gray-600">Delivery:</span>
                    <span className="text-xs font-medium text-near-black">
                      {product.estimatedDelivery}
                    </span>
                  </div>
                )}

                {/* Ships to */}
                {product.deliveryCountries &&
                  product.deliveryCountries.length > 0 && (
                    <div className="flex items-center gap-2 col-span-2">
                      <Globe className="w-3.5 h-3.5 text-gold" />
                      <span className="text-xs text-gray-600">Ships to:</span>
                      <span className="text-xs font-medium text-near-black truncate">
                        {product.deliveryCountries.join(", ")}
                      </span>
                    </div>
                  )}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-walnut block">
                  Select Color <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-sm rounded-full transition-all flex items-center gap-2 ${
                        selectedColor === color
                          ? "bg-gold text-near-black font-bold ring-2 ring-gold/50"
                          : "bg-cream text-gray-700 hover:bg-gold/20"
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      {color}
                      {selectedColor === color && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Seater Selection - Shows price for each seater */}
            {product.seaterCount && product.seaterCount.length > 0 && (
              <div className="space-y-2">
                <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-walnut block">
                  Select Seater <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.seaterCount.map((seater) => {
                    const seaterPrice = product.seaterPrices?.find(
                      (sp) => sp.seater === seater,
                    );
                    return (
                      <button
                        key={seater}
                        onClick={() => handleSeaterChange(seater)}
                        className={`px-4 py-2 text-sm rounded-full transition-all flex items-center gap-2 ${
                          selectedSeater === seater
                            ? "bg-gold text-near-black font-bold ring-2 ring-gold/50"
                            : "bg-cream text-gray-700 hover:bg-gold/20"
                        }`}
                      >
                        <Sofa className="w-3.5 h-3.5" />
                        <span>{seater}</span>
                        {/* {seaterPrice && (
                          <span className="text-xs font-bold ml-1">
                            {formatCurrency(seaterPrice.price)}
                          </span>
                        )} */}
                        {selectedSeater === seater && (
                          <Check className="w-3 h-3" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedSeater && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected:{" "}
                    <span className="font-bold">{selectedSeater}</span> - Price:{" "}
                    <span className="font-bold text-gold">
                      {formatCurrency(currentPrice)}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            <div className="border-t border-warm-beige pt-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-walnut mb-2">
                Description
              </h3>
              <div className="text-gray-666 text-sm leading-relaxed space-y-2">
                {product.description.split("\n").map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Quantity & Action Buttons */}
            <div className="space-y-4 pt-2">
              {!isOutOfStock ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-warm-beige h-10 rounded">
                      <button
                        onClick={() => handleQuantityChange("decrease")}
                        disabled={quantity <= 1}
                        className="w-10 h-full flex items-center justify-center hover:bg-cream transition-colors disabled:opacity-50 rounded-l"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-12 text-center text-sm font-bold">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange("increase")}
                        disabled={quantity >= product.stock}
                        className="w-10 h-full flex items-center justify-center hover:bg-cream transition-colors disabled:opacity-50 rounded-r"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      {product.stock} items available
                    </p>
                  </div>

{/* Custom Order Request Section - Static */}
<div className="mt-6 pt-6 border-t border-warm-beige">
  <div className="bg-cream/50 rounded-lg p-5 border border-warm-beige">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-near-black mb-1">Custom Order Request</h4>
        <p className="text-xs text-gray-500 mb-3">
          Looking for a different color, seater option, or customization? Let us know and we'll create it just for you.
        </p>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => {
              const message = encodeURIComponent(`Hi! I'm interested in customizing the ${product?.title || 'product'}. Can you help with special requirements?`);
              window.open(`https://wa.me/447123456789?text=${message}`, '_blank');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-[#128C7E] transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.032 2.002c-5.52 0-10 4.48-10 10 0 1.78.47 3.54 1.36 5.08l-1.37 4.22 4.37-1.33c1.48.84 3.16 1.3 4.9 1.3 5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18c-1.66 0-3.28-.46-4.68-1.32l-.34-.2-2.8.86.9-2.72-.22-.35c-.92-1.44-1.42-3.12-1.42-4.86 0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9z"/>
              <path d="M16.74 13.96c-.22-.11-1.3-.64-1.5-.71-.2-.07-.35-.11-.5.11-.15.22-.58.71-.71.86-.13.15-.26.17-.48.06-.22-.11-.93-.34-1.77-1.09-.66-.6-1.1-1.33-1.23-1.56-.13-.23-.01-.35.1-.47.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.5-1.21-.69-1.66-.18-.44-.37-.38-.5-.38-.13 0-.28-.01-.43-.01-.15 0-.39.06-.6.28-.21.22-.8.78-.8 1.91 0 1.13.82 2.22.94 2.37.12.15 1.62 2.48 3.93 3.48.55.24.98.38 1.32.48.55.17 1.05.15 1.45.09.44-.07 1.3-.53 1.48-1.04.18-.51.18-.95.13-1.04-.05-.09-.18-.15-.4-.26z"/>
            </svg>
            WhatsApp Now
          </button>
          {/* <button 
            onClick={() => {
              const subject = encodeURIComponent(`Custom Order Request: ${product?.title || 'Product'}`);
              const body = encodeURIComponent(`Hi Team,\n\nI'm interested in customizing the product:\n\nProduct: ${product?.title}\n\nMy requirements:\n- Color: \n- Seater: \n- Other specifications:\n\nPlease let me know if this is possible.\n\nThank you!`);
              window.location.href = `mailto:support@zovallo.com?subject=${subject}&body=${body}`;
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-gray-700 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Us
          </button> */}
        </div>
      </div>
    </div>
  </div>
</div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAddToCartOnly}
                      disabled={
                        addingToCart ||
                        (hasOptions &&
                          (!selectedColor ||
                            (product.seaterCount &&
                              product.seaterCount.length > 0 &&
                              !selectedSeater)))
                      }
                      className="flex-1 bg-cream border-2 cursor-pointer border-near-black text-near-black py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gold hover:border-gold transition-all duration-300 flex items-center justify-center gap-2 rounded"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {addingToCart ? "Adding..." : "Add to Cart"}
                    </button>
                    <button
                      onClick={handleOrderNow}
                      disabled={
                        orderingNow ||
                        (hasOptions &&
                          (!selectedColor ||
                            (product.seaterCount &&
                              product.seaterCount.length > 0 &&
                              !selectedSeater)))
                      }
                      className="flex-1 bg-near-black text-white py-3 cursor-pointer text-[11px] font-bold uppercase tracking-widest hover:bg-gold hover:text-near-black transition-all duration-300 flex items-center justify-center gap-2 rounded"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {orderingNow ? "Processing..." : "Order Now"}
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleContactUs}
                  className="w-full bg-gray-200 text-gray-600 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gold hover:text-near-black transition-all duration-300 rounded"
                >
                  Contact Us for Availability
                </button>
              )}

              {/* Wishlist & Share */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToWishlist}
                  className="flex-1 border border-warm-beige py-2.5 cursor-pointer text-[10px] font-bold uppercase tracking-widest hover:bg-cream transition-colors flex items-center justify-center gap-2 rounded"
                >
                  <Heart className="w-3.5 h-3.5" />
                  Add to Wishlist
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 border border-warm-beige py-2.5 cursor-pointer text-[10px] font-bold uppercase tracking-widest hover:bg-cream transition-colors flex items-center justify-center gap-2 rounded"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </button>
              </div>

              {/* Delivery Info */}
              <div className="space-y-3 p-4 bg-cream/30 border border-warm-beige rounded-lg">
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-gold" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-near-black">
                      Free UK Delivery
                    </p>
                    <p className="text-[9px] text-gray-500">
                      Estimated delivery: 1-3 business days
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-near-black">
                      Cash on Delivery
                    </p>
                    <p className="text-[9px] text-gray-500">
                      Pay when your furniture arrives
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-4 h-4 text-gold" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-near-black">
                      14-Day Returns
                    </p>
                    <p className="text-[9px] text-gray-500">
                      Hassle-free returns policy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section - FULLY RESTORED */}
        {/* {product.reviews && product.reviews.length > 0 && (
          <div className="mt-12 pt-8 border-t border-warm-beige">
            <h3 className="text-lg font-display text-near-black mb-6">
              Customer Reviews ({product.reviews.length})
            </h3>
            <div className="space-y-4">
              {product.reviews?.map((review: any) => (
                <div
                  key={review.id}
                  className="border-b border-warm-beige pb-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <p className="font-bold text-near-black text-sm">
                        {review.userName}
                      </p>
                      <p className="text-[8px] text-gray-400">{review.date}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-2.5 h-2.5 ${
                            star <= review.rating
                              ? "fill-gold text-gold"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-666">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>

      {/* Share Options Modal */}
      {showShareOptions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-near-black/80 backdrop-blur-sm"
            onClick={() => setShowShareOptions(false)}
          />
          <div className="bg-white max-w-sm w-full relative z-10 shadow-2xl border border-warm-beige rounded-lg overflow-hidden">
            <div className="p-4 border-b border-warm-beige flex justify-between items-center">
              <h3 className="text-lg font-display text-near-black">
                Share this product
              </h3>
              <button
                onClick={() => setShowShareOptions(false)}
                className="text-gray-400 hover:text-near-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => shareToPlatform("facebook")}
                  className="flex items-center gap-2 p-2 bg-[#1877f2] text-white rounded-lg text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Facebook
                </button>
                <button
                  onClick={() => shareToPlatform("twitter")}
                  className="flex items-center gap-2 p-2 bg-[#1da1f2] text-white rounded-lg text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Twitter
                </button>
                <button
                  onClick={() => shareToPlatform("whatsapp")}
                  className="flex items-center gap-2 p-2 bg-[#25d366] text-white rounded-lg text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </button>
                <button
                  onClick={() => shareToPlatform("email")}
                  className="flex items-center gap-2 p-2 bg-gray-600 text-white rounded-lg text-sm"
                >
                  <Mail className="w-4 h-4" /> Email
                </button>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-1">Or copy link:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="flex-1 bg-cream border border-warm-beige py-1.5 px-2 text-xs rounded"
                  />
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(window.location.href);
                      alert("Link copied!");
                      setShowShareOptions(false);
                    }}
                    className="px-3 py-1.5 bg-near-black text-white text-[10px] font-bold rounded"
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
    </>
  );
}
