// src/app/(user)/locations/page.tsx
"use client";

import React, { useState, useEffect } from "react";
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
import { LoadingSpinner } from "../../../components/ui/Loading";
import { UKMap } from "../../../components/locations/UKMap";

export default function LocationsPage() {
  const [cities, setCities] = useState<CityPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cityPageService.getPublishedCities();
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setError("Failed to load locations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchCities();
      return;
    }

    setLoading(true);
    try {
      const results = await cityPageService.searchCities(searchTerm);
      setCities(results);
    } catch (error) {
      console.error("Error searching cities:", error);
      setError("Failed to search locations.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.nearbyAreas?.some((area) =>
        area.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Search & View Toggle */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search for your city..."
                className="w-full bg-neutral-50 border border-neutral-200/80 py-2.5 pl-10 pr-4 text-sm focus:border-amber-500 outline-none rounded-xl"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="px-6 py-2.5 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors rounded-xl"
              >
                Search
              </button>
              <div className="flex rounded-xl border border-neutral-200/80 overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 text-[10px] font-bold transition-colors ${
                    viewMode === "grid"
                      ? "bg-amber-500 text-white"
                      : "bg-white text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-3 py-2 text-[10px] font-bold transition-colors ${
                    viewMode === "map"
                      ? "bg-amber-500 text-white"
                      : "bg-white text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  <MapIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-2xl mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Map View */}
        {viewMode === "map" && filteredCities.length > 0 && (
          <div className="mb-8">
            <UKMap cities={filteredCities} />
          </div>
        )}

        {/* Cities Grid */}
        {viewMode === "grid" &&
          (filteredCities.length === 0 ? (
            <div className="text-center py-16 bg-white border border-neutral-200/80 rounded-2xl">
              <div className="text-6xl mb-4">📍</div>
              <h3 className="text-xl font-serif text-neutral-900 mb-2">
                {searchTerm ? "No cities found" : "No cities available yet"}
              </h3>
              <p className="text-neutral-500">
                {searchTerm
                  ? `No results found for "${searchTerm}"`
                  : "Check back soon as we expand our delivery network"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCities.map((city) => (
                <LocationCard key={city.id} city={city} />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

// Location Card Component
function LocationCard({ city }: { city: CityPage }) {
  return (
    <Link href={`/locations/${city.slug}`} className="group">
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-serif text-neutral-900 group-hover:text-amber-600 transition-colors">
              {city.name}
            </h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 group-hover:text-neutral-900 transition-colors flex items-center gap-1">
            View <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        {/* Nearby Areas */}
        {city.nearbyAreas && city.nearbyAreas.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {city.nearbyAreas.slice(0, 4).map((area) => (
              <span
                key={area}
                className="text-[8px] text-neutral-500 bg-neutral-50 px-2 py-0.5 rounded-full"
              >
                {area}
              </span>
            ))}
            {city.nearbyAreas.length > 4 && (
              <span className="text-[8px] text-neutral-400">
                +{city.nearbyAreas.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Trust Signals */}
        <div className="mt-auto pt-3 border-t border-neutral-100">
          <div className="flex flex-wrap gap-3 text-[10px] text-neutral-500">
            <span className="flex items-center gap-1">Free UK Delivery</span>
            <span className="flex items-center gap-1">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
