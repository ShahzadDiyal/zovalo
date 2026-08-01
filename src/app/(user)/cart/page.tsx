"use client";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  Truck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { formatCurrency } from "../../../lib/utils";
import { EmptyState } from "../../../components/ui/EmptyState";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            icon={ShoppingBag}
            title="Your Cart is Empty"
            description="Looks like you haven't added any premium furniture to your cart yet. Explore our masterfully crafted autumnal collection."
            actionText="Explore Collections"
            actionLink="/shop"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-4 sm:py-0">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-neutral-900 text-white py-12 sm:py-16 md:py-20 mb-8 sm:mb-12">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              Your Cart
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-neutral-400 font-light text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Review your selected pieces before checkout
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10">
          {/* Cart Items List */}
          <div className="flex-1 space-y-4 sm:space-y-5">
            {/* Continue Shopping Link */}
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-neutral-600 hover:text-amber-600 transition-colors group w-fit"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </Link>

            {/* Cart Items */}
            <div className="space-y-3 sm:space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-white border border-neutral-200/80 group transition-all hover:shadow-md rounded-2xl"
                >
                  {/* Product Image */}
                  <Link
                    href={`/product/${item.slug}`}
                    className="w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 aspect-square bg-neutral-50 overflow-hidden flex-shrink-0 mx-auto sm:mx-0 rounded-xl"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between py-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
                      <div className="text-left">
                        <p className="text-[12px] sm:text-[14px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">
                          {item.category}
                        </p>
                        <Link href={`/product/${item.slug}`}>
                          <h3 className="text-sm sm:text-base md:text-lg font-serif text-neutral-900 hover:text-amber-600 transition-colors break-words">
                            {item.title}
                            {item.quantity > 1 && (
                              <span className="text-xs font-sans text-neutral-500 font-normal normal-case tracking-normal ml-2">
                                ({formatCurrency(item.price)} each)
                              </span>
                            )}
                          </h3>
                        </Link>

                        {(item.selectedOptions?.color ||
                          item.selectedOptions?.seater) && (
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {item.selectedOptions?.color && (
                              <span className="inline-flex items-center gap-1 text-[12px] text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-gray-300"
                                  style={{
                                    backgroundColor:
                                      item.selectedOptions.color.toLowerCase(),
                                  }}
                                />
                                {item.selectedOptions.color}
                              </span>
                            )}
                            {item.selectedOptions?.seater && (
                              <span className="inline-flex items-center gap-1 text-[12px] text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
                                {item.selectedOptions.seater}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-sm sm:text-base md:text-lg font-light text-neutral-900 md:text-center sm:text-right whitespace-nowrap">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>

                    <div className="flex flex-row justify-between items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-neutral-200/80 bg-white h-8 sm:h-9 rounded-xl">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-7 sm:w-8 h-full flex items-center justify-center hover:bg-amber-50 transition-colors rounded-l-xl"
                        >
                          <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutral-600" />
                        </button>
                        <span className="w-8 sm:w-10 h-full flex items-center justify-center text-xs font-bold text-neutral-900 bg-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-7 sm:w-8 h-full flex items-center justify-center hover:bg-amber-50 transition-colors rounded-r-xl"
                        >
                          <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutral-600" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[12px] sm:text-[14px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="w-full lg:w-[360px] space-y-4 sm:space-y-5 mb-6">
            <div className="bg-white border border-neutral-200/80 p-5 sm:p-6 md:p-8 sticky top-24 md:top-32 lg:top-44 rounded-2xl">
              <h2 className="text-xl sm:text-2xl font-serif text-neutral-900 mb-4 sm:mb-5">
                Order Summary
              </h2>

              {/* Totals */}
              <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-medium text-neutral-900">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-neutral-500">Delivery</span>
                  <span className="text-emerald-600 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider">
                    FREE
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-neutral-500">Estimated Tax</span>
                  <span className="font-medium text-neutral-900">£0.00</span>
                </div>
                <div className="pt-3 sm:pt-4 border-t border-neutral-200/80 flex justify-between items-baseline">
                  <span className="text-base sm:text-lg font-serif text-neutral-900">
                    Total
                  </span>
                  <span className="text-xl sm:text-2xl md:text-3xl font-light text-amber-600">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="space-y-3 sm:space-y-4">
                <Link
                  href="/checkout"
                  className="block w-full bg-neutral-900 text-white py-3 sm:py-3.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-center hover:bg-amber-600 transition-all duration-300 rounded-xl"
                >
                  Proceed to Checkout
                </Link>

                {/* Security & Delivery Info */}
                <div className="flex flex-col gap-3 sm:gap-4 py-3 sm:py-4 border-t border-neutral-200/80">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-emerald-50 rounded-lg">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-neutral-700">
                      Cash on Delivery (Zero Upfront Payment)
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-emerald-50 rounded-lg">
                      <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-neutral-700">
                      White Glove Delivery Service
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-amber-50 rounded-lg">
                      <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-neutral-700">
                      14-Day Hassle-Free Returns
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
