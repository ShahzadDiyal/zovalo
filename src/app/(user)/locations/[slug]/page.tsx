// src/app/(user)/locations/[slug]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Truck,
  ShieldCheck,
  CreditCard,
  Sparkles,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { cityPageService } from "../../../../services/cityPageService";
import { productApi } from "../../../../services/productApi";
import { CityPage, Product } from "../../../../types";
import { SEO } from "../../../../components/SEO";
import { LoadingSpinner } from "../../../../components/ui/Loading";
import { ProductCard } from "../../../../components/ui/ProductCard";
import { CityMap } from "../../../../components/locations/CityMap";

export default function CityDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [cityPage, setCityPage] = useState<CityPage | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchCityPage();
    }
  }, [slug]);

  const fetchCityPage = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cityPageService.getCityBySlug(slug);
      if (data) {
        setCityPage(data);
        await cityPageService.incrementViews(data.id);

        const allProducts = await productApi.getAll();
        const featuredProducts = allProducts
          .filter((p) => p.featured)
          .slice(0, 4);
        setProducts(
          featuredProducts.length > 0
            ? featuredProducts
            : allProducts.slice(0, 4),
        );
      } else {
        setError("Location not found");
      }
    } catch (error) {
      console.error("Error fetching city page:", error);
      setError("Failed to load location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error || !cityPage) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📍</div>
          <h2 className="text-2xl font-serif text-neutral-900 mb-2">
            {error || "Location Not Found"}
          </h2>
          <p className="text-neutral-500 mb-6">
            The location you're looking for doesn't exist or hasn't been
            published yet.
          </p>
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors rounded-xl"
          >
            <ArrowRight className="w-4 h-4" /> Back to Locations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <SEO
        title={cityPage.metaTitle || `${cityPage.name} - Furniture Delivery`}
        description={cityPage.metaDescription || cityPage.uniqueIntro}
        url={`https://royalfurnitures.store/locations/${cityPage.slug}`}
        type="website"
        keywords={[cityPage.name, "furniture", "sofas", "beds", "delivery"]}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-neutral-900 text-white py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              {cityPage.name}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white tracking-tight">
            {cityPage.h1Heading ||
              `Premium Furniture & Sofas in ${cityPage.name}`}
          </h1>
          <p className="text-neutral-400 font-light text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {cityPage.uniqueIntro}
          </p>
        </div>
      </section>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-neutral-200/80">
            <h2 className="text-xl sm:text-2xl font-serif text-neutral-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              Where is {cityPage.name}?
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              We deliver premium furniture to {cityPage.name} and surrounding
              areas
            </p>
          </div>
          <CityMap cityName={cityPage.name} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Trust Signals */}
        {cityPage.localTrustSignals &&
          cityPage.localTrustSignals.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {cityPage.localTrustSignals.map((signal, index) => (
                <div
                  key={index}
                  className="bg-white border border-neutral-200/80 rounded-2xl p-4 text-center shadow-sm"
                >
                  {signal.toLowerCase().includes("delivery")}
                  {signal.toLowerCase().includes("cash") && (
                    <CreditCard className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                  )}
                  {signal.toLowerCase().includes("inspect") && (
                    <ShieldCheck className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                  )}
                  {!signal.toLowerCase().includes("delivery") &&
                    !signal.toLowerCase().includes("cash") &&
                    !signal.toLowerCase().includes("inspect") && (
                      <CheckCircle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                    )}
                  <p className="text-sm font-medium text-neutral-900">
                    {signal}
                  </p>
                </div>
              ))}
            </div>
          )}

        {/* Nearby Areas */}
        {cityPage.nearbyAreas && cityPage.nearbyAreas.length > 0 && (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 mb-8 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-amber-600 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              We Also Serve These Nearby Areas
            </h2>
            <div className="flex flex-wrap gap-2">
              {cityPage.nearbyAreas.map((area) => (
                <span
                  key={area}
                  className="px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-full border border-amber-200/50"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Info */}
        {cityPage.deliveryInfo && (
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-6 mb-8 text-center">
            <Truck className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm text-neutral-700 font-medium">
              {cityPage.deliveryInfo}
            </p>
          </div>
        )}

        {/* Popular Products */}
        {products.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900 mb-6">
              Popular Furniture in {cityPage.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-neutral-900 transition-colors"
              >
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Why Choose Us */}
        {cityPage.whyChooseUs && cityPage.whyChooseUs.length > 0 && (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 mb-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-serif text-neutral-900 mb-4">
              Why Choose Royal Furniture in {cityPage.name}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cityPage.whyChooseUs.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-neutral-600"
                >
                  <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* FAQs */}
        {cityPage.faqs && cityPage.faqs.length > 0 && (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-serif text-neutral-900 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {cityPage.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-neutral-100 pb-4 last:border-0 last:pb-0"
                >
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-neutral-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact / CTA Section */}
        <div className="mt-8 bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-serif mb-2">
            Ready to Furnish Your Home in {cityPage.name}?
          </h3>
          <p className="text-neutral-400 text-sm mb-4">
            Contact us today for personalized assistance or visit our showroom.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-neutral-900 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors rounded-xl"
            >
              <MessageCircle className="w-4 h-4" /> Contact Us
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors rounded-xl"
            >
              <ShoppingBag className="w-4 h-4" /> Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
