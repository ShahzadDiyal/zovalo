
import { MapPin, Phone, Mail, Clock, Award, Users, Truck, Shield, CheckCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Royal Furniture",
  description: "Learn about Royal Furniture - premium furniture crafted for the modern home. Quality pieces with Cash on Delivery across UK.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/about/",
  },
  openGraph: {
    title: "About Us | Royal Furniture",
    description: "Learn about Royal Furniture - premium furniture crafted for the modern home.",
    url: "https://royalfurnitures.store/about/",
  },
};


export default function AboutPage() {
    
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
      {/* Header */}
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-near-black mb-4">
          About Royal Furniture
        </h1>
        <div className="w-20 h-0.5 bg-gold mx-auto" />
        <p className="text-gray-500 mt-4 text-sm sm:text-base max-w-2xl mx-auto">
          Crafting premium furniture for the modern home since 2024
        </p>
      </div>

      {/* Our Story */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-display text-near-black mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Royal Furniture was born from a passion for quality craftsmanship and timeless design. 
            We believe that furniture should not only be functional but also a reflection of your 
            personal style.
          </p>
          <p className="text-gray-600 leading-relaxed">
            From our showroom in Manchester, we source and create pieces that blend traditional 
            joinery with contemporary silhouettes, bringing elegance to homes across the United Kingdom.
          </p>
        </div>
        <div className="bg-cream/30 rounded-lg p-6 border border-warm-beige">
          <h3 className="font-bold text-near-black mb-4">Why Choose Us</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Premium Quality</h4>
                <p className="text-sm text-gray-500">Every piece is crafted with premium materials</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Free UK Delivery</h4>
                <p className="text-sm text-gray-500">Fast and reliable delivery across the UK</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Customer Trust</h4>
                <p className="text-sm text-gray-500">4.9/5 from 12,000+ happy customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-cream/20 p-6 rounded-lg border border-warm-beige">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-gold flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Address</p>
            <p className="text-sm font-medium">Barton Aerodrome, Liverpool Rd, Eccles, Manchester, M30 7SA</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-gold flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="text-sm font-medium">+44 7529 661726</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-gold flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm font-medium">sales@royalfurnitures.store</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gold flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Hours</p>
            <p className="text-sm font-medium">Always Open</p>
          </div>
        </div>
      </div>
    </div>
  );
}