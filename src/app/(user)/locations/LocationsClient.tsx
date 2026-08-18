// src/app/(user)/locations/LocationsClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Search,
  ChevronRight,
  Grid3x3,
  Map as MapIcon,
  AlertCircle,
} from "lucide-react";
import { CityPage } from "../../../types";
import { cityPageService } from "../../../services/cityPageService";
import { UKMap } from "../../../components/locations/UKMap";

interface LocationsClientProps {
  initialCities: CityPage[];
}

export function LocationsClient({ initialCities }: LocationsClientProps) {
  const [cities, setCities] = useState<CityPage[]>(initialCities);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setCities(initialCities);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const results = await cityPageService.searchCities(searchTerm);
      setCities(results);
    } catch (error) {
      console.error("Error searching cities:", error);
      setError("Failed to search locations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCities(initialCities);
  };

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.nearbyAreas?.some((area) =>
        area.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
              disabled={loading}
              className="px-6 py-2.5 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors rounded-xl disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2.5 border border-neutral-200 text-neutral-600 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors rounded-xl"
              >
                Clear
              </button>
            )}
            <div className="flex rounded-xl border border-neutral-200/80 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 text-[10px] font-bold transition-colors ${
                  viewMode === "grid"
                    ? "bg-amber-500 text-white"
                    : "bg-white text-neutral-600 hover:bg-neutral-50"
                }`}
                aria-label="Grid view"
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
                aria-label="Map view"
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
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="mt-4 text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCities.map((city) => (
              <LocationCard key={city.id} city={city} />
            ))}
          </div>
        ))}
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
