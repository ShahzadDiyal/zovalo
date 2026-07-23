// src/components/locations/CityMap.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { geocodingService } from "../../services/geocodingService";

interface CityMapProps {
  cityName: string;
  lat?: number;
  lng?: number;
  zoom?: number;
}

export function CityMap({ cityName, lat, lng, zoom = 13 }: CityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    lat && lng ? { lat, lng } : null,
  );

  // Auto-geocode if coordinates not provided
  useEffect(() => {
    if (!lat && !lng && cityName) {
      const fetchCoordinates = async () => {
        try {
          const result = await geocodingService.geocodeCity(cityName);
          if (result) {
            setCoords({ lat: result.lat, lng: result.lng });
          } else {
            // Fallback to London if geocoding fails
            setCoords({ lat: 51.5074, lng: -0.1278 });
            console.warn(
              `Could not geocode ${cityName}, using London as fallback`,
            );
          }
        } catch (error) {
          console.error("Error geocoding city:", error);
          setCoords({ lat: 51.5074, lng: -0.1278 });
        }
      };
      fetchCoordinates();
    }
  }, [cityName, lat, lng]);

  useEffect(() => {
    setIsClient(true);

    // Dynamically import Leaflet
    import("leaflet")
      .then((leaflet) => {
        setL(leaflet);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load Leaflet:", err);
        setMapError(true);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    // Don't proceed if not ready
    if (!isClient || !L || !mapRef.current || !coords || mapError) return;

    // Clean up previous map instance
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    try {
      // Initialize map
      leafletMapRef.current = L.map(mapRef.current, {
        center: [coords.lat, coords.lng],
        zoom: zoom,
        zoomControl: false,
      });

      // Add tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(leafletMapRef.current);

      // Create custom icon
      const icon = L.divIcon({
        className: "city-marker",
        html: `
          <div class="relative">
            <div class="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white ring-4 ring-amber-300/50">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-amber-500"></div>
          </div>
        `,
        iconSize: [56, 56],
        iconAnchor: [28, 56],
        popupAnchor: [0, -56],
      });

      // Add marker
      const marker = L.marker([coords.lat, coords.lng], { icon })
        .addTo(leafletMapRef.current)
        .bindPopup(
          `
          <div class="text-center p-3">
            <h3 class="font-bold text-near-black text-lg">${cityName}</h3>
            <p class="text-sm text-gray-500 mb-2">📍 Premium furniture delivered here!</p>
            <a href="/shop" class="inline-block bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-amber-600 transition-colors">
              Shop Now
            </a>
          </div>
        `,
          {
            className: "city-popup",
            maxWidth: 250,
          },
        );

      // Open popup by default
      setTimeout(() => {
        marker.openPopup();
      }, 600);

      // Add zoom controls
      const zoomControl = L.control.zoom({
        position: "topright",
      });
      zoomControl.addTo(leafletMapRef.current);
    } catch (err) {
      console.error("Error initializing map:", err);
      setMapError(true);
    }
  }, [L, isClient, coords, cityName, zoom, mapError]);

  // Show loading state
  if (!isClient || isLoading || !coords) {
    return (
      <div className="w-full h-[400px] bg-neutral-100 rounded-2xl flex items-center justify-center border border-neutral-200/80">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-xs text-neutral-500">
            {!coords ? "Finding location..." : "Loading map..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (mapError) {
    return (
      <div className="w-full h-[400px] bg-neutral-100 rounded-2xl flex items-center justify-center border border-neutral-200/80">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm text-neutral-500">
            Map is currently unavailable
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            {cityName} - We deliver premium furniture here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-2xl overflow-hidden shadow-sm border border-neutral-200/80"
      />

      {/* Map Attribution */}
      <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-[8px] text-neutral-400">
        © OpenStreetMap
      </div>

      <style>{`
        .city-marker {
          background: none;
          border: none;
        }
        .city-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          padding: 4px;
        }
        .leaflet-popup-content {
          margin: 8px 12px;
        }
        .leaflet-container {
          font-family: inherit;
          z-index: 1;
        }
        .leaflet-control-zoom {
          z-index: 10;
        }
        .leaflet-control-zoom a {
          background: white !important;
          color: #1a1a1a !important;
          border: 1px solid #e5e5e5 !important;
          width: 34px !important;
          height: 34px !important;
          line-height: 34px !important;
          font-size: 18px !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f5f5f5 !important;
        }
      `}</style>
    </div>
  );
}
