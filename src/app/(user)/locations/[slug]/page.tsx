// src/app/(user)/locations/[slug]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import {
  MapPin,
  Truck,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  ShoppingBag,
  Star,
  Award,
  Clock,
  ThumbsUp,
} from "lucide-react";
import { cityPageService } from "../../../../services/cityPageService";
import { productApi } from "../../../../services/productApi";
import { CityPage, Product } from "../../../../types";
import { ProductCard } from "../../../../components/ui/ProductCard";
import { CityMap } from "../../../../components/locations/CityMap";
import { CityDetailClient } from "./CityDetailClient";
import { serializeFirestoreData } from "../../../../lib/serialize";

const getCityForPage = (slug: string) =>
  unstable_cache(
    () => cityPageService.getCityBySlug(slug),
    ["location-page", slug],
    { revalidate: 120 },
  )();

// Generate static params for all city pages
export async function generateStaticParams() {
  try {
    const cities = await cityPageService.getPublishedCities();
    return cities.map((city: CityPage) => ({
      slug: city.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const cityPage = await getCityForPage(slug);

    if (!cityPage) {
      return {
        title: "Location Not Found",
        description: "The requested location could not be found.",
      };
    }

    const serializedCity = serializeFirestoreData(cityPage);

    const title =
      serializedCity.metaTitle || `${serializedCity.name} - Furniture Delivery`;
    const rawDescription =
      serializedCity.metaDescription || serializedCity.uniqueIntro || "";
    // Meta descriptions should stay under ~155 chars; long-form intro copy
    // was being used verbatim, which is what was tripping the "too long" check.
    const description =
      rawDescription.length > 155
        ? `${rawDescription.slice(0, 152).trimEnd()}...`
        : rawDescription;
    const canonicalUrl = `https://royalfurnitures.store/locations/${serializedCity.slug}`;

    return {
      title,
      description,
      alternates: {
        canonical: `/locations/${serializedCity.slug}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        url: canonicalUrl,
        images: serializedCity.featuredImage
          ? [serializedCity.featuredImage]
          : [],
      },
      keywords: [serializedCity.name, "furniture", "sofas", "beds", "delivery"],
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Location",
      description: "Furniture delivery location",
    };
  }
}

// Server Component
export default async function CityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;

    const cityPage = await getCityForPage(slug);

    if (!cityPage) {
      notFound();
    }

    let products: Product[] = [];
    try {
      const featuredProducts = await productApi.getFeaturedProducts(4);
      products =
        featuredProducts.length > 0
          ? featuredProducts
          : await productApi.getRecentProducts(4);
    } catch (error) {
      console.error("Error fetching products:", error);
      products = [];
    }

    const serializedCity = serializeFirestoreData(cityPage);
    const serializedProducts = serializeFirestoreData(products);

    return (
      <div className="bg-[#FAF8F5] min-h-screen">
        {/* Hero Header - Simplified */}
        <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-800 text-white py-12 sm:py-16 md:py-20">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                {serializedCity.name}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight">
              {serializedCity.h1Heading ||
                `Premium Furniture & Sofas in ${serializedCity.name}`}
            </h1>
            <p className="text-neutral-400 font-light text-sm sm:text-base max-w-6xl mx-auto leading-relaxed">
              {serializedCity.uniqueIntro}
            </p>
          </div>
        </section>

        {/* Map Section - Smaller and Less Distracting */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
          <div className="bg-white rounded-xl  overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-neutral-700">
                  {serializedCity.name} Location
                </span>
              </div>
              <span className="text-[10px] text-neutral-400">
                We deliver here
              </span>
            </div>
            <div className="h-[180px] sm:h-[200px] md:h-[220px]">
              <CityMap cityName={serializedCity.name} />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {/* Trust Signals - Clean Card Design */}
          {serializedCity.localTrustSignals &&
            serializedCity.localTrustSignals.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                {serializedCity.localTrustSignals
                  .slice(0, 5)
                  .map((signal: string, index: number) => {
                    // Determine icon based on content
                    let Icon = ShieldCheck;
                    let iconColor = "text-amber-500";
                    if (
                      signal.toLowerCase().includes("delivery") ||
                      signal.toLowerCase().includes("deliver")
                    ) {
                      Icon = Truck;
                      iconColor = "text-blue-500";
                    } else if (
                      signal.toLowerCase().includes("cash") ||
                      signal.toLowerCase().includes("cod") ||
                      signal.toLowerCase().includes("pay")
                    ) {
                      Icon = CreditCard;
                      iconColor = "text-emerald-500";
                    } else if (
                      signal.toLowerCase().includes("fire") ||
                      signal.toLowerCase().includes("safety") ||
                      signal.toLowerCase().includes("certified")
                    ) {
                      Icon = Award;
                      iconColor = "text-amber-600";
                    } else if (
                      signal.toLowerCase().includes("eco") ||
                      signal.toLowerCase().includes("sustain") ||
                      signal.toLowerCase().includes("fsc")
                    ) {
                      Icon = ShieldCheck;
                      iconColor = "text-green-500";
                    } else if (
                      signal.toLowerCase().includes("inspect") ||
                      signal.toLowerCase().includes("check")
                    ) {
                      Icon = CheckCircle;
                      iconColor = "text-purple-500";
                    }
                    return (
                      <div
                        key={index}
                        className="bg-white  rounded-xl p-3 text-center hover:shadow-md transition-shadow"
                      >
                        <Icon
                          className={`w-5 h-5 ${iconColor} mx-auto mb-1.5`}
                        />
                        <p className="text-[10px] sm:text-xs font-medium text-neutral-700 leading-tight">
                          {signal}
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}

          {/* Nearby Areas */}
          {serializedCity.nearbyAreas &&
            serializedCity.nearbyAreas.length > 0 && (
              <div className="bg-white border border-neutral-200/60 rounded-xl p-4 mb-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  We Also Serve These Nearby Areas
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {serializedCity.nearbyAreas.map((area: string) => (
                    <span
                      key={area}
                      className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] sm:text-xs rounded-full border border-amber-200/50"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Delivery Info - Compact */}
          {serializedCity.deliveryInfo && (
            <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3 mb-6 text-center">
              <Truck className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <p className="text-xs sm:text-sm text-neutral-700 font-medium">
                {serializedCity.deliveryInfo}
              </p>
            </div>
          )}

          {/* Popular Products */}
          {serializedProducts.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-serif text-neutral-900">
                  Popular Furniture in {serializedCity.name}
                </h2>
                <Link
                  href="/shop"
                  className="text-[10px] font-bold uppercase tracking-widest text-amber-600 hover:text-neutral-900 transition-colors flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {serializedProducts.slice(0, 4).map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Why Choose Us - Clean */}
          {serializedCity.whyChooseUs &&
            serializedCity.whyChooseUs.length > 0 && (
              <div className="bg-white border border-neutral-200/60 rounded-xl p-5 mb-6">
                <h2 className="text-lg sm:text-xl font-serif text-neutral-900 mb-3">
                  Why Choose Royal Furniture in {serializedCity.name}
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {serializedCity.whyChooseUs.map(
                    (item: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-xs sm:text-sm text-neutral-600"
                      >
                        <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}

          {/* FAQs - Clean Accordion Style */}
          {serializedCity.faqs && serializedCity.faqs.length > 0 && (
            <div className="bg-white border border-neutral-200/60 rounded-xl p-5">
              <h2 className="text-lg sm:text-xl font-serif text-neutral-900 mb-3">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {serializedCity.faqs.map(
                  (
                    faq: { question: string; answer: string },
                    index: number,
                  ) => (
                    <div
                      key={index}
                      className="border-b border-neutral-100 pb-3 last:border-0 last:pb-0"
                    >
                      <h3 className="text-sm font-semibold text-neutral-900 mb-0.5 flex items-start gap-2">
                        <span className="text-amber-500 font-bold">Q:</span>
                        {faq.question}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 pl-5">
                        <span className="text-neutral-400 font-medium">A:</span>{" "}
                        {faq.answer}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-6 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-xl p-5 sm:p-6 text-center">
            <h3 className="text-lg sm:text-xl font-serif mb-1">
              Ready to Furnish Your Home in {serializedCity.name}?
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm mb-3">
              Contact us today for personalized assistance
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-500 text-neutral-900 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors rounded-lg"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Contact Us
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 px-5 py-2 border border-white/20 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors rounded-lg"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Browse Products
              </Link>
            </div>
          </div>
        </div>

        <CityDetailClient cityId={serializedCity.id} />
      </div>
    );
  } catch (error) {
    console.error("Error in city detail page:", error);
    notFound();
  }
}
