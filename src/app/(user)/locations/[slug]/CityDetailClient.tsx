// src/app/(user)/locations/[slug]/CityDetailClient.tsx
"use client";

import { useEffect } from "react";
import { cityPageService } from "../../../../services/cityPageService";

interface CityDetailClientProps {
  cityId: string;
}

export function CityDetailClient({ cityId }: CityDetailClientProps) {
  // Increment views on client-side
  useEffect(() => {
    if (cityId) {
      cityPageService.incrementViews(cityId).catch(console.error);
    }
  }, [cityId]);

  // This component doesn't render anything visible
  return null;
}
