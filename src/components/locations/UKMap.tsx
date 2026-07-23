// src/components/locations/UKMap.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MapPin, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { CityPage } from "../../types";
import { geocodingService } from "../../services/geocodingService";

interface UKMapProps {
  cities: CityPage[];
  onCitySelect?: (city: CityPage) => void;
  selectedCity?: string;
}

export function UKMap({ cities, onCitySelect, selectedCity }: UKMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);
  const [cityCoordinates, setCityCoordinates] = useState<
    Map<string, { lat: number; lng: number }>
  >(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  // Auto-geocode all cities
  useEffect(() => {
    const geocodeCities = async () => {
      setIsLoading(true);
      const coordsMap = new Map();

      for (const city of cities) {
        try {
          const result = await geocodingService.geocodeCity(city.name);
          if (result) {
            coordsMap.set(city.id, { lat: result.lat, lng: result.lng });
          }
        } catch (error) {
          console.error(`Error geocoding ${city.name}:`, error);
        }
      }

      setCityCoordinates(coordsMap);
      setIsLoading(false);
    };

    if (cities.length > 0) {
      geocodeCities();
    } else {
      setIsLoading(false);
    }
  }, [cities]);

  useEffect(() => {
    setIsClient(true);

    import("leaflet")
      .then((leaflet) => {
        setL(leaflet);
      })
      .catch((err) => {
        console.error("Failed to load Leaflet:", err);
        setMapError(true);
      });
  }, []);

  useEffect(() => {
    if (!isClient || !L || !mapRef.current || isLoading || mapError) return;

    // Initialize map if not already initialized
    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current, {
        center: [54.5, -3.5],
        zoom: 6,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(leafletMapRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      if (leafletMapRef.current) {
        leafletMapRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Add markers for each city with coordinates
    cities.forEach((city) => {
      const coords = cityCoordinates.get(city.id);
      if (!coords) return;

      // Create custom icon
      const icon = L.divIcon({
        className: "custom-marker",
        html: `
          <div class="relative">
            <div class="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${selectedCity === city.id ? "ring-4 ring-amber-300" : ""}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-amber-500"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([coords.lat, coords.lng], { icon })
        .addTo(leafletMapRef.current)
        .bindPopup(
          `
          <div class="text-center p-1">
            <h3 class="font-bold text-near-black text-sm">${city.name}</h3>
            <p class="text-xs text-gray-500 mb-2">${city.nearbyAreas?.slice(0, 3).join(", ") || ""}</p>
            <a href="/locations/${city.slug}" class="inline-block bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full hover:bg-amber-600 transition-colors">
              View Details
            </a>
          </div>
        `,
          {
            className: "custom-popup",
          },
        );

      // Click handler
      marker.on("click", () => {
        if (onCitySelect) {
          onCitySelect(city);
        }
        if (typeof window !== "undefined") {
          window.location.href = `/locations/${city.slug}`;
        }
      });

      markersRef.current.push(marker);

      // If this is the selected city, zoom to it
      if (selectedCity === city.id) {
        leafletMapRef.current.setView([coords.lat, coords.lng], 10);
      }
    });

    // Fit bounds if there are markers
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      leafletMapRef.current.fitBounds(group.getBounds(), {
        padding: [50, 50],
        maxZoom: 8,
      });
    }

    // Cleanup
    return () => {
      markersRef.current.forEach((marker) => {
        if (leafletMapRef.current) {
          leafletMapRef.current.removeLayer(marker);
        }
      });
      markersRef.current = [];
    };
  }, [
    cities,
    cityCoordinates,
    selectedCity,
    L,
    isClient,
    isLoading,
    mapError,
    onCitySelect,
  ]);

  // Zoom controls
  const handleZoomIn = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
  };

  const handleFitBounds = () => {
    if (leafletMapRef.current && markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      leafletMapRef.current.fitBounds(group.getBounds(), {
        padding: [50, 50],
        maxZoom: 8,
      });
    }
  };

  if (!isClient || isLoading) {
    return (
      <div className="w-full h-[500px] bg-neutral-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-xs text-neutral-500">
            {isLoading ? "Finding city locations..." : "Loading map..."}
          </p>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="w-full h-[500px] bg-neutral-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm text-neutral-500">
            Map is currently unavailable
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div
        ref={mapRef}
        className="w-full h-[500px] rounded-2xl overflow-hidden shadow-sm border border-neutral-200/80"
      />

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white rounded-xl shadow-md hover:bg-neutral-50 transition-colors flex items-center justify-center border border-neutral-200"
        >
          <ZoomIn className="w-4 h-4 text-neutral-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white rounded-xl shadow-md hover:bg-neutral-50 transition-colors flex items-center justify-center border border-neutral-200"
        >
          <ZoomOut className="w-4 h-4 text-neutral-700" />
        </button>
        <button
          onClick={handleFitBounds}
          className="w-10 h-10 bg-white rounded-xl shadow-md hover:bg-neutral-50 transition-colors flex items-center justify-center border border-neutral-200"
        >
          <Maximize className="w-4 h-4 text-neutral-700" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm border border-neutral-200/80">
        <div className="flex items-center gap-2 text-xs text-neutral-600">
          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          <span>Available Cities</span>
        </div>
      </div>

      <style>{`
        .custom-marker {
          background: none;
          border: none;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .leaflet-popup-content {
          margin: 8px 12px;
        }
        .leaflet-container {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}
