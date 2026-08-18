// src/components/locations/CityPageTemplate.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Truck,
  ShieldCheck,
  CreditCard,
  Award,
  Sparkles,
  ChevronRight,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { CityPage } from "../../types";
import { SEO } from "../../components/SEO";
import { ProductCard } from "../../components/ui/ProductCard";
import { Product } from "../../types";

interface CityPageTemplateProps {
  cityPage: CityPage;
  products?: Product[];
}

export function CityPageTemplate({
  cityPage,
  products = [],
}: CityPageTemplateProps) {
  return (
    <>
      <SEO
        title={cityPage.metaTitle}
        description={cityPage.metaDescription}
        url={`https://royalfurnitures.store/locations/${cityPage.slug}`}
        type="website"
        keywords={[cityPage.name, "furniture", "sofas", "beds", "delivery"]}
      />

      <div className="bg-[#FAF8F5] min-h-screen">
        {/* Hero Header */}
        <section className="relative overflow-hidden bg-neutral-900 text-white py-16 sm:py-20 md:py-24">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                {cityPage.name}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl  text-white tracking-tight">
              {cityPage.h1Heading ||
                `Premium Furniture & Sofas in ${cityPage.name}`}
            </h1>
            <p className="text-neutral-400 font-light text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {cityPage.uniqueIntro}
            </p>
          </div>
        </section>

        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Trust Signals */}
          {cityPage.localTrustSignals &&
            cityPage.localTrustSignals.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {cityPage.localTrustSignals.map((signal, index) => (
                  <div
                    key={index}
                    className="bg-white border border-neutral-200/80 rounded-2xl p-4 text-center shadow-sm"
                  >
                    {signal.toLowerCase().includes("delivery") && (
                      <Truck className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                    )}
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

          {/* Popular Products */}
          {products.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl  text-neutral-900 mb-6">
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
              <h2 className="text-xl sm:text-2xl  text-neutral-900 mb-4">
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
              <h2 className="text-xl sm:text-2xl  text-neutral-900 mb-4">
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
        </div>
      </div>
    </>
  );
}
