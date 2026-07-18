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
} from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { formatCurrency } from "../../../lib/utils";
import { EmptyState } from "../../../components/ui/EmptyState";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your Cart is Empty"
          description="Looks like you haven't added any premium furniture to your cart yet. Explore our masterfully crafted autumnal collection."
          actionText="Explore Collections"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
        {/* Cart Items List */}
        <div className="flex-1 space-y-4 sm:space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 gap-2 sm:gap-3 border-b border-warm-beige pb-3 sm:pb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display text-near-black">
              Shopping Cart
            </h1>
            <Link
              href="/shop"
              className="flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut hover:text-near-black transition-colors group w-fit"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </Link>
          </div>

          {/* Cart Items */}
          <div className="space-y-3 sm:space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-white border border-warm-beige group transition-all hover:shadow-md rounded-lg"
              >
                {/* Product Image */}
                <Link
                  href={`/product/${item.slug}`}
                  className="w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 aspect-square bg-cream overflow-hidden flex-shrink-0 mx-auto sm:mx-0 rounded-lg"
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
                      <p className="text-[8px] sm:text-[9px] font-bold text-gray-a0 uppercase tracking-widest mb-0.5">
                        {item.category}
                      </p>
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="text-sm sm:text-base md:text-lg font-display text-near-black hover:text-gold transition-colors break-words line-clamp-1">
                          {item.title}
                        </h3>
                      </Link>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg font-light text-near-black md:text-center sm:text-right">
                      {formatCurrency(item.price)}
                    </p>
                  </div>

                  <div className="flex flex-row justify-between items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-warm-beige h-8 sm:h-9 rounded">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-7 sm:w-8 h-full flex items-center justify-center hover:bg-cream transition-colors border-r border-warm-beige rounded-l"
                      >
                        <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                      <span className="w-8 sm:w-10 h-full flex items-center justify-center text-xs font-bold bg-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-7 sm:w-8 h-full flex items-center justify-center hover:bg-cream transition-colors border-l border-warm-beige rounded-r"
                      >
                        <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
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
        <aside className="w-full lg:w-[340px] space-y-4 sm:space-y-5">
          <div className="bg-cream/30 border border-warm-beige p-4 sm:p-5 md:p-6 sticky top-20 md:top-32 lg:top-44 rounded-lg">
            <h2 className="text-lg sm:text-xl font-display text-near-black mb-3 sm:mb-4">
              Order Summary
            </h2>

            {/* Totals */}
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-666">Subtotal</span>
                <span className="font-medium text-near-black">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-666">Delivery</span>
                <span className="text-mint-700 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider">
                  FREE
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-666">Estimated Tax</span>
                <span className="font-medium text-near-black">£0.00</span>
              </div>
              <div className="pt-2 sm:pt-3 border-t border-warm-beige flex justify-between items-baseline">
                <span className="text-base sm:text-lg font-display text-near-black">
                  Total
                </span>
                <span className="text-lg sm:text-xl md:text-2xl font-light text-walnut">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="space-y-2 sm:space-y-3">
              <Link
                href="/checkout"
                className="block w-full bg-near-black text-white py-2.5 sm:py-3 text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-center hover:bg-gold transition-all duration-300 rounded"
              >
                Proceed to Checkout
              </Link>

              {/* Security & Delivery Info */}
              <div className="flex flex-col gap-2 sm:gap-3 py-3 sm:py-4 border-t border-warm-beige mt-3 sm:mt-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-mint-700 flex-shrink-0" />
                  <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-gray-666">
                    Secure Checkout
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-mint-700 flex-shrink-0" />
                  <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-gray-666">
                    White Glove Delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
