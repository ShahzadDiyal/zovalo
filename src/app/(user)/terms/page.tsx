"use client";
import React from "react";
import { SEO } from "../../../components/SEO";
import {
  Shield,
  FileText,
  Clock,
  CreditCard,
  Truck,
  AlertCircle,
} from "lucide-react";

const TermsConditions = () => {
  return (
    <>
      <SEO
        title="Terms & Conditions | Royal Furniture"
        description="Read our terms and conditions for purchasing premium furniture. Learn about our policies on orders, payments, and customer obligations at royalfurniture."
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-near-black mb-4">
            Terms & Conditions
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto"></div>
          <p className="text-gray-500 mt-4 text-sm sm:text-base">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {/* Introduction */}
          <section className="bg-cream/30 p-6 sm:p-8 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-gold" />
              <h2 className="text-xl sm:text-2xl font-display text-near-black">
                1. Introduction
              </h2>
            </div>
            <p className="text-gray-666 leading-relaxed">
              Welcome to Royal Furniture. By accessing or using our website and
              purchasing our premium furniture products, you agree to be bound
              by these Terms & Conditions. Please read them carefully before
              placing any order. Royal Furniture reserves the right to modify these
              terms at any time without prior notice.
            </p>
          </section>

          {/* Orders */}
          <section>
            <h2 className="text-xl sm:text-2xl font-display text-near-black mb-4">
              2. Order Acceptance
            </h2>
            <div className="space-y-3 text-gray-666">
              <p>• All orders are subject to acceptance and availability.</p>
              <p>
                • We reserve the right to refuse or cancel any order for any
                reason including product availability, pricing errors, or
                suspected fraudulent activity.
              </p>
              <p>
                • Once your order is confirmed, you will receive an email
                confirmation with your order details.
              </p>
              <p>
                • Royal Furniture reserves the right to limit quantities purchased per
                customer.
              </p>
            </div>
          </section>

          {/* Pricing */}
          <section>
            <h2 className="text-xl sm:text-2xl font-display text-near-black mb-4">
              3. Pricing & Payment
            </h2>
            <div className="space-y-3 text-gray-666">
              <p>
                • All prices are listed in GBP (£) and include applicable taxes
                unless stated otherwise.
              </p>
              <p>
                • We offer{" "}
                <strong className="text-near-black">
                  Cash on Delivery (COD)
                </strong>{" "}
                - Pay only when your furniture arrives at your doorstep.
              </p>
              <p>
                • You have the right to inspect the product before making
                payment.
              </p>
              <p>
                • Prices are subject to change without notice, but confirmed
                orders will be honored at the price at the time of order.
              </p>
            </div>
          </section>

          {/* Delivery */}
          <section className="bg-mint-50 p-6 sm:p-8 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-mint-700" />
              <h2 className="text-xl sm:text-2xl font-display text-near-black">
                4. Delivery Information
              </h2>
            </div>
            <div className="space-y-4 text-gray-666">
              <p>
                <strong className="text-near-black">United Kingdom:</strong>{" "}
                Delivery within 1-3 business days. Same-day delivery available
                in select areas for orders placed before 12 PM.
              </p>
              <p>
                <strong className="text-near-black">European Union:</strong>{" "}
                Delivery to France, Germany, Belgium within 3-5 business days.
              </p>
              <p>
                <strong className="text-near-black">Canada:</strong> Delivery
                within 5-7 business days.
              </p>
              <p className="text-sm text-mint-700 mt-2">
                * All deliveries include white-glove placement service
                (furniture placed in your desired room).
              </p>
            </div>
          </section>

          {/* Returns */}
          <section>
            <h2 className="text-xl sm:text-2xl font-display text-near-black mb-4">
              5. Returns & Refunds
            </h2>
            <div className="space-y-3 text-gray-666">
              <p>
                • You have <strong>14 days</strong> from the date of delivery to
                request a return.
              </p>
              <p>
                • Items must be unused, in original packaging, and in resellable
                condition.
              </p>
              <p>
                • Free returns are available for defective or damaged products.
              </p>
              <p>
                • Refunds will be processed within 7-10 business days after we
                receive and inspect the returned item.
              </p>
              <p>
                • Custom-made furniture cannot be returned unless defective.
              </p>
            </div>
          </section>

          {/* Customer Obligations */}
          <section>
            <h2 className="text-xl sm:text-2xl font-display text-near-black mb-4">
              6. Customer Obligations
            </h2>
            <div className="space-y-3 text-gray-666">
              <p>
                • You must provide accurate and complete information when
                placing an order.
              </p>
              <p>
                • You are responsible for ensuring that the ordered furniture
                will fit through doorways and into your desired space.
              </p>
              <p>
                • You must be at least 18 years old to purchase from royalfurniture.
              </p>
              <p>
                • You agree not to use our website for any unlawful purpose.
              </p>
            </div>
          </section>

          {/* Product Information */}
          <section>
            <h2 className="text-xl sm:text-2xl font-display text-near-black mb-4">
              7. Product Information
            </h2>
            <div className="space-y-3 text-gray-666">
              <p>
                • We make every effort to display product colors and images
                accurately, but variations may occur due to monitor settings.
              </p>
              <p>• All measurements are approximate and may vary slightly.</p>
              <p>
                • Product specifications including materials and dimensions are
                subject to change without notice.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-xl sm:text-2xl font-display text-near-black mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-gray-666 leading-relaxed">
              Royal Furniture shall not be liable for any indirect, incidental, or
              consequential damages arising from the use of our products or
              website. Our total liability shall not exceed the purchase price
              of the product you purchased.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-cream/30 p-6 sm:p-8 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-gold" />
              <h2 className="text-xl sm:text-2xl font-display text-near-black">
                9. Contact Us
              </h2>
            </div>
            <p className="text-gray-666 mb-3">
              If you have any questions about these Terms & Conditions, please
              contact us:
            </p>
            <div className="space-y-1 text-sm text-gray-666">
              <p>📧 Email: support@royalfurniture.com</p>
              <p>📞 Phone: +44 7526 661726</p>
              <p>
                📍 Address: Royal Furniture, 123 Design Street, London, UK,
                SW1A 1AA
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default TermsConditions;
