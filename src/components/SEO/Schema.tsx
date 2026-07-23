// src/components/SEO/Schema.tsx
"use client";

interface SchemaProps {
  type:
    | "Organization"
    | "WebSite"
    | "FAQ"
    | "SiteNavigationElement"
    | "BlogCategory"
    | "BlogPost";
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

      case "SiteNavigationElement":
        return {
          "@context": "https://schema.org",
          "@type": "SiteNavigationElement",
          name: "Main Navigation",
          url: "https://royalfurnitures.store",
          hasPart: [
            {
              "@type": "SiteNavigationElement",
              name: "Home",
              url: "https://royalfurnitures.store/",
            },
            {
              "@type": "SiteNavigationElement",
              name: "Shop",
              url: "https://royalfurnitures.store/shop",
            },
            {
              "@type": "SiteNavigationElement",
              name: "Blog",
              url: "https://royalfurnitures.store/blog",
            },
            {
              "@type": "SiteNavigationElement",
              name: "About",
              url: "https://royalfurnitures.store/about",
            },
            {
              "@type": "SiteNavigationElement",
              name: "Contact",
              url: "https://royalfurnitures.store/contact",
            },
          ],
        };

      case "FAQ":
        if (!data?.faqs || data.faqs.length === 0) return null;
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: data.faqs.map((faq: any) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        };

      case "BlogCategory":
        if (!data?.category) return null;
        return {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: data.category.name,
          description:
            data.category.description ||
            `Explore our ${data.category.name} articles`,
          url: `https://royalfurnitures.store/blog/category/${data.category.slug}`,
          about: {
            "@type": "Thing",
            name: data.category.name,
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
