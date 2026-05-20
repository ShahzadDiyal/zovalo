"use client";
import React from "react";
import { SEO } from "../../../components/SEO";
import {
  Truck,
  MapPin,
  Clock,
  Globe,
  Package,
  CheckCircle,
} from "lucide-react";

const ShippingPolicy = () => {
  return (
    <>
      <SEO
        title="Shipping Policy | Free UK Delivery | LUXWOOD Furniture"
        description="Fast and reliable furniture delivery across UK, Europe, and Canada. Free UK delivery on all orders. Cash on Delivery available. Track your order in real-time."
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-near-black mb-4">
            Shipping Policy
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto"></div>
          <p className="text-gray-500 mt-4 text-sm sm:text-base">
            Fast, reliable, and transparent delivery for your premium furniture
          </p>
        </div>

        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {/* Free UK Delivery Banner */}
          <div className="bg-gold/10 border border-gold/20 p-6 sm:p-8 text-center rounded-lg">
            <Truck className="w-12 h-12 text-gold mx-auto mb-3" />
            <h2 className="text-2xl sm:text-3xl font-display text-near-black mb-2">
              Free UK Delivery
            </h2>
            <p className="text-gray-666">
              On all orders across the United Kingdom. No minimum purchase
              required.
            </p>
          </div>

          {/* UK Delivery */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-gold" />
              <h2 className="text-xl sm:text-2xl font-display text-near-black">
                United Kingdom Delivery
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-cream/30 p-5 rounded-lg">
                <Clock className="w-8 h-8 text-mint-700 mb-3" />
                <h3 className="font-bold text-near-black mb-2">
                  Standard Delivery
                </h3>
                <p className="text-gray-666 text-sm">1-3 business days</p>
                <p className="text-gold font-bold mt-2">FREE</p>
              </div>
              <div className="bg-cream/30 p-5 rounded-lg">
                <Package className="w-8 h-8 text-mint-700 mb-3" />
                <h3 className="font-bold text-near-black mb-2">
                  Same-Day Delivery
                </h3>
                <p className="text-gray-666 text-sm">
                  Orders before 12 PM in select areas
                </p>
                <p className="text-gold font-bold mt-2">£29.99</p>
              </div>
            </div>
          </section>

          {/* International Delivery */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-gold" />
              <h2 className="text-xl sm:text-2xl font-display text-near-black">
                International Delivery
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border border-warm-beige rounded-lg">
                <p className="font-bold text-near-black">France</p>
                <p className="text-sm text-gray-500">3-5 days</p>
                <p className="text-gold text-sm mt-1">£49.99</p>
              </div>
              <div className="text-center p-4 border border-warm-beige rounded-lg">
                <p className="font-bold text-near-black">Germany</p>
                <p className="text-sm text-gray-500">3-5 days</p>
                <p className="text-gold text-sm mt-1">£49.99</p>
              </div>
              <div className="text-center p-4 border border-warm-beige rounded-lg">
                <p className="font-bold text-near-black">Belgium</p>
                <p className="text-sm text-gray-500">3-5 days</p>
                <p className="text-gold text-sm mt-1">£49.99</p>
              </div>
              <div className="text-center p-4 border border-warm-beige rounded-lg">
                <p className="font-bold text-near-black">Canada</p>
                <p className="text-sm text-gray-500">5-7 days</p>
                <p className="text-gold text-sm mt-1">£99.99</p>
              </div>
            </div>
          </section>

          {/* Delivery Process */}
          <section>
            <h2 className="text-xl sm:text-2xl font-display text-near-black mb-4">
              Our Delivery Process
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <CheckCircle className="w-5 h-5 text-mint-700 mt-0.5" />
                <div>
                  <h3 className="font-bold text-near-black">
                    Order Confirmation
                  </h3>
                  <p className="text-gray-666 text-sm">
                    You'll receive an email confirmation immediately after
                    placing your order.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle className="w-5 h-5 text-mint-700 mt-0.5" />
                <div>
                  <h3 className="font-bold text-near-black">Processing</h3>
                  <p className="text-gray-666 text-sm">
                    Orders are processed within 24 hours. You'll receive a
                    tracking number once shipped.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle className="w-5 h-5 text-mint-700 mt-0.5" />
                <div>
                  <h3 className="font-bold text-near-black">
                    White-Glove Delivery
                  </h3>
                  <p className="text-gray-666 text-sm">
                    Our team will place your furniture in your desired room and
                    remove all packaging.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Cash on Delivery */}
          <section className="bg-mint-50 p-6 sm:p-8 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xl sm:text-2xl font-display text-near-black">
                Pay After Inspection
              </h2>
            </div>
            <p className="text-gray-666 mb-2">
              With our <strong>Cash on Delivery (COD)</strong> option, you can
              inspect your furniture before making payment.
            </p>
            <p className="text-sm text-mint-700">
              ✓ No hidden fees | ✓ Pay only when satisfied | ✓ Secure
              transaction
            </p>
          </section>

          {/* Tracking */}
          <section>
            <h2 className="text-xl sm:text-2xl font-display text-near-black mb-4">
              Track Your Order
            </h2>
            <p className="text-gray-666 mb-3">
              Once your order ships, you'll receive a tracking number via email
              and SMS. You can track your delivery status in real-time through
              our website.
            </p>
            <div className="bg-cream/30 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">
                Questions about your delivery? Contact our support team at{" "}
                <strong className="text-near-black">support@luxwood.com</strong>{" "}
                or call{" "}
                <strong className="text-near-black">+44 20 1234 5678</strong>
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ShippingPolicy;
