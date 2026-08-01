import React from "react";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Mail,
  Cookie,
  ShieldCheck,
  Package,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Royal Furniture",
  description:
    "Read our Privacy Policy to understand how Royal Furniture protects your personal information and data.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Royal Furniture",
    description:
      "Read our Privacy Policy to understand how Royal Furniture protects your data.",
    url: "https://royalfurnitures.store/privacy",
  },
};

const PrivacyPolicy = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-near-black mb-4">
            Privacy Policy
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto"></div>
          <p className="text-gray-500 mt-4 text-sm sm:text-base">
            Your privacy matters — how we protect your information
          </p>
        </div>

        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {/* Introduction */}
          <section className="bg-cream/30 p-6 sm:p-8 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-gold" />
              <h2 className="text-xl sm:text-2xl font-display text-near-black">
                Our Commitment to Privacy
              </h2>
            </div>
            <p className="text-gray-666 leading-relaxed">
              At Royal Furniture, we are committed to protecting your personal
              information and your right to privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you visit our website or make a purchase.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-xl sm:text-2xl font-display text-near-black mb-4">
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-near-black mb-2">
                  Personal Information
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-666 text-sm">
                  <li>
                    Name and contact information (email, phone number, shipping
                    address)
                  </li>
                  <li>
                    Payment information (processed securely via encrypted
                    payment gateways)
                  </li>
                  <li>Order history and preferences</li>
                  <li>Communications with our support team</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-near-black mb-2">
                  Automatically Collected Information
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-666 text-sm">
                  <li>IP address and browser type</li>
                  <li>Device information</li>
                  <li>Pages visited and time spent on our website</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-xl sm:text-2xl font-display text-near-black mb-4">
              How We Use Your Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex gap-3 items-start p-4 border border-warm-beige rounded-lg">
                <Package className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <h3 className="font-bold text-near-black text-sm">
                    Process Orders
                  </h3>
                  <p className="text-gray-666 text-xs">
                    Manage your purchases and deliveries
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-4 border border-warm-beige rounded-lg">
                <Mail className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <h3 className="font-bold text-near-black text-sm">
                    Send Updates
                  </h3>
                  <p className="text-gray-666 text-xs">
                    Order confirmations and shipping notifications
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-4 border border-warm-beige rounded-lg">
                <ShieldCheck className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <h3 className="font-bold text-near-black text-sm">
                    Prevent Fraud
                  </h3>
                  <p className="text-gray-666 text-xs">
                    Protect against unauthorized transactions
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-4 border border-warm-beige rounded-lg">
                <Eye className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <h3 className="font-bold text-near-black text-sm">
                    Improve Experience
                  </h3>
                  <p className="text-gray-666 text-xs">
                    Personalize your shopping experience
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="bg-mint-50 p-6 sm:p-8 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-mint-700" />
              <h2 className="text-xl sm:text-2xl font-display text-near-black">
                Data Security
              </h2>
            </div>
            <div className="space-y-3 text-gray-666">
              <p>✓ All transactions are encrypted using SSL/TLS technology</p>
              <p>✓ We do not store full payment information on our servers</p>
              <p>✓ Regular security audits and updates</p>
              <p>
                ✓ Access to personal data is restricted to authorized personnel
                only
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="w-6 h-6 text-gold" />
              <h2 className="text-xl sm:text-2xl font-display text-near-black">
                Cookies
              </h2>
            </div>
            <p className="text-gray-666 mb-3">
              We use cookies to enhance your browsing experience, analyze site
              traffic, and personalize content. You can control cookie
              preferences through your browser settings.
            </p>
            <div className="bg-cream/30 p-4 rounded-lg text-sm text-gray-600">
              <strong>Types of cookies we use:</strong> Essential cookies
              (required for website functionality), Analytics cookies (to
              understand how visitors use our site), and Preference cookies (to
              remember your settings).
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-xl sm:text-2xl font-display text-near-black mb-4">
              Your Privacy Rights
            </h2>
            <div className="space-y-2 text-gray-666">
              <p>• Access and receive a copy of your personal data</p>
              <p>• Request correction of inaccurate information</p>
              <p>
                • Request deletion of your data (subject to legal obligations)
              </p>
              <p>• Opt-out of marketing communications at any time</p>
              <p>• Withdraw consent for data processing</p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-cream/30 p-6 sm:p-8 rounded-lg">
            <h2 className="text-xl sm:text-2xl font-display text-near-black mb-4">
              Contact Us
            </h2>
            <p className="text-gray-666 mb-3">
              If you have questions about this Privacy Policy or wish to
              exercise your privacy rights:
            </p>
            <div className="space-y-1 text-sm text-gray-666">
              <p>📧 Email: sales@royalfurnitures.store</p>
              <p>📞 Phone: +44 7529 661726</p>
              {/* <p>📍 Data Protection Officer: dpo@royalfurniture.com</p> */}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
