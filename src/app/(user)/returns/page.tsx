import React from "react";
import { Metadata } from "next";
import {
  RotateCcw,
  Calendar,
  Package,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Return Policy | 14-Day Returns",
  description:
    "Hassle-free returns within 14 days. Free returns for defective items. Cash on Delivery orders can be returned easily. Customer satisfaction guaranteed.",
  alternates: {
    canonical: "/returns",
  },
};

const ReturnPolicy = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-near-black mb-4">
            Return Policy
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto"></div>
          <p className="text-gray-500 mt-4 text-sm sm:text-base">
            Your satisfaction is our priority — hassle-free returns guaranteed
          </p>
        </div>

        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {/* 14-Day Guarantee Banner */}
          <div className="bg-gold/10 border border-gold/20 p-6 sm:p-8 text-center rounded-lg">
            <RotateCcw className="w-12 h-12 text-gold mx-auto mb-3" />
            <h2 className="text-2xl sm:text-3xl font-display text-near-black mb-2">
              14-Day Return Guarantee
            </h2>
            <p className="text-gray-666">
              Not completely satisfied? You have 14 days to request a return
            </p>
          </div>

          {/* Return Conditions */}
          <section>
            <h2 className="text-xl sm:text-2xl font-display text-near-black mb-4">
              Return Conditions
            </h2>
            <div className="space-y-3 text-gray-666">
              <div className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-mint-700 mt-0.5" />
                <p>Items must be unused and in original condition</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-mint-700 mt-0.5" />
                <p>Original packaging must be intact</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-mint-700 mt-0.5" />
                <p>
                  Return request must be initiated within 14 days of delivery
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-mint-700 mt-0.5" />
                <p>Proof of purchase is required</p>
              </div>
            </div>
          </section>

          {/* How to Return */}
          <section>
            <h2 className="text-xl sm:text-2xl font-display text-near-black mb-4">
              How to Return an Item
            </h2>
            <div className="space-y-5">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-gold/10 text-gold rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-near-black">
                    Contact Our Support Team
                  </h3>
                  <p className="text-gray-666 text-sm">
                    Email us at sales@royalfurnitures.store or call +44 7526
                    661726 within 14 days of delivery.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-gold/10 text-gold rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-near-black">
                    Provide Order Details
                  </h3>
                  <p className="text-gray-666 text-sm">
                    Share your order number, item name, and reason for return.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-gold/10 text-gold rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-near-black">
                    Pack the Item Securely
                  </h3>
                  <p className="text-gray-666 text-sm">
                    Use the original packaging to ensure safe transport.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-gold/10 text-gold rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-near-black">Schedule Pickup</h3>
                  <p className="text-gray-666 text-sm">
                    We'll arrange a free pickup for defective items. For other
                    returns, you may ship at your cost.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Process */}
          <section className="bg-mint-50 p-6 sm:p-8 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-mint-700" />
              <h2 className="text-xl sm:text-2xl font-display text-near-black">
                Refund Process
              </h2>
            </div>
            <div className="space-y-3 text-gray-666">
              <p>
                • <strong>Cash on Delivery orders:</strong> Refund will be
                processed via bank transfer within 7-10 business days after
                inspection.
              </p>
              <p>
                • <strong>Defective items:</strong> Full refund including
                original shipping costs.
              </p>
              <p>
                • <strong>Change of mind:</strong> Refund for product value only
                (shipping fees are non-refundable).
              </p>
              <p>
                • You will receive email confirmation once your refund is
                processed.
              </p>
            </div>
          </section>

          {/* Non-Returnable Items */}
          <section>
            <h2 className="text-xl sm:text-2xl font-display text-near-black mb-4">
              Non-Returnable Items
            </h2>
            <div className="space-y-2 text-gray-666">
              <p>• Custom-made or bespoke furniture</p>
              <p>• Items damaged due to misuse or improper care</p>
              <p>• Items missing original packaging or tags</p>
              <p>• Clearance or final sale items</p>
            </div>
          </section>

          {/* Damaged or Defective Items */}
          <section className="bg-red-50 p-6 sm:p-8 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h2 className="text-xl sm:text-2xl font-display text-near-black">
                Damaged or Defective Items
              </h2>
            </div>
            <p className="text-gray-666 mb-3">
              If your furniture arrives damaged or defective, please:
            </p>
            <ul className="space-y-2 text-gray-666 list-disc list-inside">
              <li>
                Document the damage with photos within 48 hours of delivery
              </li>
              <li>Contact us immediately at sales@royalfurnitures.store</li>
              <li>We will arrange a free replacement or full refund</li>
              <li>No return shipping costs for defective items</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="bg-cream/30 p-6 sm:p-8 rounded-lg">
            <h2 className="text-xl sm:text-2xl font-display text-near-black mb-4">
              Need Help?
            </h2>
            <p className="text-gray-666 mb-3">
              Our customer service team is here to assist you with any
              return-related questions.
            </p>
            <div className="space-y-1 text-sm text-gray-666">
              <p>📧 Email: sales@royalfurnitures.store</p>
              <p>📞 Phone: +44 7526 661726</p>
              <p>⏰ Hours: Always Open</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ReturnPolicy;
