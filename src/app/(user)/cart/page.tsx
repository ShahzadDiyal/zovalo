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
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12">
        {/* Cart Items List */}
        <div className="flex-1 space-y-5 sm:space-y-6 md:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-warm-beige pb-4 sm:pb-6">
            <h1 className="text-2xl sm:text-3xl font-display text-near-black">
              Shopping Cart
            </h1>
            <Link
              href="/shop"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-walnut hover:text-near-black transition-colors group w-fit"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </Link>
          </div>

          {/* Cart Items */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 p-4 sm:p-5 md:p-6 bg-white border border-warm-beige group transition-all hover:shadow-md rounded-lg"
              >
                {/* Product Image */}
                <Link
                  href={`/product/${item.id}`}
                  className="w-50 h-40 sm:w-28 sm:h-28 md:w-32 md:h-32 aspect-square bg-cream overflow-hidden flex-shrink-0 mx-auto sm:mx-0 rounded-lg"
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between py-0 sm:py-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-[9px] sm:text-[10px] font-bold text-gray-a0 uppercase tracking-widest mb-1">
                        {item.category}
                      </p>
                      <Link href={`/product/${item.id}`}>
                        <h3 className="text-base sm:text-lg font-display text-near-black hover:text-gold transition-colors break-words">
                          {item.title}
                        </h3>
                      </Link>
                    </div>
                    <p className="text-base sm:text-lg font-light text-near-black text-center sm:text-right">
                      {formatCurrency(item.price)}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-warm-beige h-9 sm:h-10 rounded">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 sm:w-10 h-full flex items-center justify-center hover:bg-cream transition-colors border-r border-warm-beige rounded-l"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 sm:w-12 h-full flex items-center justify-center text-xs font-bold bg-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 sm:w-10 h-full flex items-center justify-center hover:bg-cream transition-colors border-l border-warm-beige rounded-r"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Sidebar - Responsive */}
        <aside className="w-full lg:w-[380px] space-y-5 sm:space-y-6">
          <div className="bg-cream/30 border border-warm-beige p-5 sm:p-6 md:p-7 lg:p-8 sticky top-20 md:top-32 lg:top-44 rounded-lg">
            <h2 className="text-lg sm:text-xl font-display text-near-black mb-4 sm:mb-5 md:mb-6">
              Order Summary
            </h2>

            {/* Totals */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-7 md:mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-666">Subtotal</span>
                <span className="font-medium text-near-black">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-666">Delivery</span>
                <span className="text-mint-700 font-bold text-[10px] sm:text-[11px] uppercase tracking-wider">
                  FREE
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-666">Estimated Tax</span>
                <span className="font-medium text-near-black">£0.00</span>
              </div>
              <div className="pt-3 sm:pt-4 border-t border-warm-beige flex justify-between items-baseline">
                <span className="text-base sm:text-lg font-display text-near-black">
                  Total
                </span>
                <span className="text-xl sm:text-2xl font-light text-walnut">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="space-y-3 sm:space-y-4">
              <Link
                href="/checkout"
                className="block w-full bg-near-black text-white py-3 sm:py-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-center hover:bg-gold transition-all duration-300 rounded"
              >
                Proceed to Checkout
              </Link>

              {/* Security & Delivery Info */}
              <div className="flex flex-col gap-3 sm:gap-4 py-4 sm:py-5 md:py-6 border-t border-warm-beige mt-4 sm:mt-5 md:mt-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-mint-700 flex-shrink-0" />
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-666">
                    Secure Checkout Guaranteed
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-mint-700 flex-shrink-0" />
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-666">
                    White Glove Delivery available
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
