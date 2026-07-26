// src/app/(user)/locations/page.tsx
import React from "react";
import Link from "next/link";
import {
  MapPin,
  Search,
  Sparkles,
  ChevronRight,
  Truck,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  AlertCircle,
  Grid3x3,
  Map as MapIcon,
} from "lucide-react";
import { cityPageService } from "../../../services/cityPageService";
import { CityPage } from "../../../types";
import { SEO } from "../../../components/SEO";
import { UKMap } from "../../../components/locations/UKMap";
import { LocationsClient } from "./LocationsClient";

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
export async function generateMetadata() {
  return {
    title: "Furniture Delivery Locations | Royal Furniture",
    description:
      "Discover Royal Furniture delivery locations across the UK. Find premium furniture and sofas delivered to your city with Cash on Delivery.",
    openGraph: {
      title: "Furniture Delivery Locations | Royal Furniture",
      description:
        "Discover Royal Furniture delivery locations across the UK. Find premium furniture and sofas delivered to your city with Cash on Delivery.",
      type: "website",
      url: "https://royalfurniture.co.uk/locations",
    },
  };
}

// Server Component
export default async function LocationsPage() {
  try {
    // Fetch cities on the server
    const cities = await cityPageService.getPublishedCities();

    return (
      <div className="bg-[#FAF8F5] min-h-screen">
        <SEO
          title="Furniture Delivery Locations | Royal Furniture"
          description="Discover Royal Furniture delivery locations across the UK. Find premium furniture and sofas delivered to your city with Cash on Delivery."
        />

        {/* Hero Header */}
        <section className="relative overflow-hidden bg-neutral-900 text-white py-16 sm:py-20 md:py-24">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                Delivery Locations
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white tracking-tight">
              We Deliver to Cities Across the UK
            </h1>
            <p className="text-neutral-400 font-light text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Find premium furniture and sofas delivered directly to your city.
              Inspect before you pay with our Cash on Delivery service.
            </p>
          </div>
        </section>

        {/* Pass data to client component for interactivity */}
        <LocationsClient initialCities={cities} />
      </div>
    );
  } catch (error) {
    console.error("Error in locations page:", error);
    return (
      <div className="bg-[#FAF8F5] min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📍</div>
          <h2 className="text-2xl font-serif text-neutral-900 mb-2">
            Unable to Load Locations
          </h2>
          <p className="text-neutral-500">
            We're having trouble loading our delivery locations. Please try
            again later.
          </p>
        </div>
      </div>
    );
  }
}
