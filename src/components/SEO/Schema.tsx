"use client";

interface SchemaProps {
  type: "Organization" | "WebSite" | "FAQ" | "SiteNavigationElement";
  data?: any;
}

export function Schema({ type, data }: SchemaProps) {
  const getSchema = () => {
    switch (type) {
      case "Organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Royal Furniture",
          url: "https://royalfurnitures.store",
          logo: "https://royalfurnitures.store/logo.png",
          description:
            "Premium furniture store offering quality pieces for the modern home. Cash on Delivery available across UK.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Barton Aerodrome, Liverpool Rd, Eccles",
            addressLocality: "Manchester",
            addressRegion: "Greater Manchester",
            postalCode: "M30 7SA",
            addressCountry: "GB",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+44-7529-661726",
            contactType: "Sales",
            availableLanguage: ["English"],
            areaServed: "GB",
          },
          sameAs: ["https://www.facebook.com/profile.php?id=61591759840955"],
        };

      case "WebSite":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Royal Furniture",
          url: "https://royalfurnitures.store",
          potentialAction: {
            "@type": "SearchAction",
            target:
              "https://royalfurnitures.store/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        };

      default:
        return null;
    }
  };

  const schema = getSchema();
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
