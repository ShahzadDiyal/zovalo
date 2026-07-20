import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  Users,
  Truck,
  Shield,
  CheckCircle,
  Crown,
  Star,
  Heart,
  Sparkles,
  Globe,
  Package,
  RefreshCw,
  Headphones,
  Building2,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us | Royal Furniture - Premium Furniture Store UK",
  description:
    "Discover Royal Furniture - premium quality furniture crafted for modern homes. Learn about our story, craftsmanship, and commitment to excellence in the UK furniture industry.",
  keywords:
    "about royal furniture, premium furniture UK, furniture store Manchester, luxury furniture, quality craftsmanship",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/about/",
  },
  openGraph: {
    title: "About Royal Furniture | Premium Quality Furniture UK",
    description:
      "Learn about Royal Furniture - premium furniture crafted for the modern home. Quality pieces with Cash on Delivery across UK.",
    url: "https://royalfurnitures.store/about/",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
      {/* Header Section */}
      <div className="text-center mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 bg-gold/10 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gold">
            Welcome to Royal Furniture
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-near-black mb-4">
          About <span className="text-gold">Royal Furniture</span>
        </h1>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
        <p className="text-gray-500 mt-4 text-sm sm:text-base max-w-2xl mx-auto">
          Crafting premium furniture for the modern home with timeless elegance
          and quality craftsmanship
        </p>
      </div>

      {/* Parent Company & Trust Statement */}
      <div className="bg-gradient-to-r from-amber-50/50 via-white to-amber-50/50 border border-gold/20 rounded-xl p-6 md:p-8 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-6 h-6 text-gold" />
          <h2 className="text-xl font-display text-near-black">
            Parent Company
          </h2>
        </div>
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            <strong>Royal Furniture</strong> is a proud subsidiary of{" "}
            <strong>Royal Home Living Group</strong>, a UK-based company
            dedicated to bringing premium quality furniture to homes across the
            United Kingdom. With over 12 years of combined industry experience,
            our parent company ensures that every piece meets the highest
            standards of craftsmanship, durability, and design excellence.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="text-center p-3 bg-white rounded-lg border border-warm-beige">
              <span className="block text-2xl font-bold text-gold">12+</span>
              <span className="text-xs text-gray-500">Years of Excellence</span>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-warm-beige">
              <span className="block text-2xl font-bold text-gold">12K+</span>
              <span className="text-xs text-gray-500">Happy Customers</span>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-warm-beige">
              <span className="block text-2xl font-bold text-gold">4.9★</span>
              <span className="text-xs text-gray-500">Customer Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
        <div>
          <h2 className="text-2xl font-display text-near-black mb-4">
            Our Story
          </h2>
          <div className="w-12 h-0.5 bg-gold mb-4" />
          <p className="text-gray-600 leading-relaxed mb-4">
            <strong>Royal Furniture</strong> was founded in{" "}
            <strong>2024</strong> with a singular vision: to create furniture
            that transforms houses into homes. Born from a passion for quality
            craftsmanship and timeless design, we believe that furniture should
            not only be functional but also a reflection of your personal style
            and aspirations.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            From our showroom in <strong>Manchester</strong>, we source and
            create pieces that blend traditional joinery with contemporary
            silhouettes, bringing elegance to homes across the United Kingdom.
            Every piece in our collection is carefully curated to ensure it
            meets our exacting standards of quality, durability, and aesthetic
            appeal.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our journey is driven by a commitment to{" "}
            <strong>customer satisfaction</strong>, sustainable practices, and
            the belief that everyone deserves to live in a space that inspires
            them.
          </p>
        </div>
        <div className="relative">
          <div className="bg-cream/30 rounded-xl p-6 border-2 border-gold/20 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/5 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gold/5 rounded-full" />
            <div className="relative">
              <h3 className="font-bold text-near-black mb-4 text-center text-lg">
                Why Royal Furniture?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <Award className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Premium Quality</h4>
                    <p className="text-sm text-gray-500">
                      Every piece crafted with premium materials and attention
                      to detail
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <Truck className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Free UK Delivery</h4>
                    <p className="text-sm text-gray-500">
                      Fast, reliable, and free delivery across the United
                      Kingdom
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <Shield className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Trusted Brand</h4>
                    <p className="text-sm text-gray-500">
                      4.9/5 rating from 12,000+ satisfied customers
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <RefreshCw className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Easy Returns</h4>
                    <p className="text-sm text-gray-500">
                      30-day return policy for peace of mind
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Who We Are Section */}
      <div className="bg-cream/20 rounded-xl p-8 mb-16 border border-warm-beige">
        <h2 className="text-2xl font-display text-near-black mb-4 text-center">
          Who We Are
        </h2>
        <div className="w-12 h-0.5 bg-gold mx-auto mb-6" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gold" />
            </div>
            <h3 className="font-bold text-near-black mb-2">Industry Experts</h3>
            <p className="text-sm text-gray-600">
              Our team brings together decades of experience in furniture
              design, craftsmanship, and customer service.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gold" />
            </div>
            <h3 className="font-bold text-near-black mb-2">
              Passionate Craftsmanship
            </h3>
            <p className="text-sm text-gray-600">
              We are passionate about creating furniture that stands the test of
              time, both in quality and style.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-gold" />
            </div>
            <h3 className="font-bold text-near-black mb-2">
              Global Inspiration
            </h3>
            <p className="text-sm text-gray-600">
              Drawing inspiration from global design trends, we bring you
              furniture that's both timeless and contemporary.
            </p>
          </div>
        </div>
      </div>

      {/* What We Do Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-display text-near-black mb-4 text-center">
          What We Do
        </h2>
        <div className="w-12 h-0.5 bg-gold mx-auto mb-8" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-warm-beige text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-bold text-near-black mb-2">
              Premium Furniture
            </h3>
            <p className="text-sm text-gray-500">
              Curating and creating high-quality furniture for every room in
              your home.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-warm-beige text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-bold text-near-black mb-2">
              Nationwide Delivery
            </h3>
            <p className="text-sm text-gray-500">
              Fast and free delivery across the UK with careful handling and
              setup.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-warm-beige text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-bold text-near-black mb-2">Customer Support</h3>
            <p className="text-sm text-gray-500">
              Dedicated support team ready to help you find the perfect pieces.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-warm-beige text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BadgeCheck className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-bold text-near-black mb-2">
              Quality Assurance
            </h3>
            <p className="text-sm text-gray-500">
              Rigorous quality checks ensure every piece meets our high
              standards.
            </p>
          </div>
        </div>
      </div>

      {/* Trusted Source Statement */}
      <div className="bg-gradient-to-br from-gold/5 via-white to-gold/5 border-2 border-gold/20 rounded-xl p-8 mb-16 text-center">
        <BadgeCheck className="w-12 h-12 text-gold mx-auto mb-4" />
        <h2 className="text-2xl font-display text-near-black mb-3">
          Your Trusted Source for Premium Furniture
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          <strong>Royal Furniture</strong> is committed to providing{" "}
          <strong>authentic, high-quality furniture</strong>
          that you can trust. As a <strong>UK-based company</strong>, we adhere
          to strict quality standards and consumer protection regulations. Our{" "}
          <strong>4.9-star rating</strong> from over 12,000 customers reflects
          our dedication to{" "}
          <strong>excellence, transparency, and customer satisfaction</strong>.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <Shield className="w-4 h-4 text-gold" />
            <span className="text-xs font-medium">Secure Shopping</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="text-xs font-medium">4.9★ Rating</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <Truck className="w-4 h-4 text-gold" />
            <span className="text-xs font-medium">Free Delivery</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <RefreshCw className="w-4 h-4 text-gold" />
            <span className="text-xs font-medium">30-Day Returns</span>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-cream/20 p-6 rounded-xl border border-warm-beige">
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
          <MapPin className="w-5 h-5 text-gold flex-shrink-0" />
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
              Address
            </p>
            <p className="text-sm font-medium text-near-black">
              Barton Aerodrome, Liverpool Rd, Eccles, Manchester, M30 7SA
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
          <Phone className="w-5 h-5 text-gold flex-shrink-0" />
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
              Phone
            </p>
            <p className="text-sm font-medium text-near-black">
              +44 7529 661726
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
          <Mail className="w-5 h-5 text-gold flex-shrink-0" />
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
              Email
            </p>
            <p className="text-sm font-medium text-near-black">
              sales@royalfurnitures.store
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
          <Clock className="w-5 h-5 text-gold flex-shrink-0" />
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
              Hours
            </p>
            <p className="text-sm font-medium text-near-black">
              24/7 Online Support
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-near-black px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
        >
          Explore Our Collection
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
