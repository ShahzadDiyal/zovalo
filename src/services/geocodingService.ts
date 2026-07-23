// src/services/geocodingService.ts
export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
  boundingBox?: [number, number, number, number];
}

class GeocodingService {
  private cache: Map<string, GeocodeResult> = new Map();

  async geocodeCity(
    cityName: string,
    country: string = "UK",
  ): Promise<GeocodeResult | null> {
    // Check cache first
    const cacheKey = `${cityName},${country}`.toLowerCase();
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Use Nominatim API (OpenStreetMap's geocoding service)
      const query = encodeURIComponent(`${cityName}, ${country}`);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&addressdetails=1&accept-language=en`,
      );

      if (!response.ok) {
        throw new Error("Geocoding request failed");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const result: GeocodeResult = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          displayName: data[0].display_name,
          boundingBox: data[0].boundingbox
            ? [
                parseFloat(data[0].boundingbox[0]),
                parseFloat(data[0].boundingbox[1]),
                parseFloat(data[0].boundingbox[2]),
                parseFloat(data[0].boundingbox[3]),
              ]
            : undefined,
        };

        // Cache the result
        this.cache.set(cacheKey, result);
        return result;
      }

      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  }

  // Batch geocode multiple cities
  async geocodeCities(
    cityNames: string[],
  ): Promise<Map<string, GeocodeResult | null>> {
    const results = new Map();
    const promises = cityNames.map(async (city) => {
      const result = await this.geocodeCity(city);
      results.set(city, result);
    });
    await Promise.all(promises);
    return results;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

export const geocodingService = new GeocodingService();
