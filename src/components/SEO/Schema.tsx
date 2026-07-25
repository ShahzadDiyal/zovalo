// src/components/SEO/Schema.tsx
"use client";

interface SchemaProps {
  type:
    | "Organization"
    | "WebSite"
    | "FAQ"
    | "SiteNavigationElement"
    | "BlogCategory"
    | "BlogPost"
    | "Product"
    | "BreadcrumbList"
    | "LocalBusiness"
    | "Article"
    | "CollectionPage"
    | "SearchAction";
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
          sameAs: [
            "https://www.facebook.com/profile.php?id=61591759840955",
            "https://www.instagram.com/royalfurnitures/",
            "https://www.pinterest.com/royalfurnitures/",
          ],
        };

      case "LocalBusiness":
        return {
          "@context": "https://schema.org",
          "@type": "FurnitureStore",
          name: "Royal Furniture",
          image: "https://royalfurnitures.store/logo.png",
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
          geo: {
            "@type": "GeoCoordinates",
            latitude: 53.4839,
            longitude: -2.3336,
          },
          openingHours: "Mo-Fr 09:00-18:00",
          priceRange: "££",
          telephone: "+44-7529-661726",
          url: "https://royalfurnitures.store",
          paymentAccepted: ["Cash", "Credit Card", "Debit Card"],
          currenciesAccepted: "GBP",
          areaServed: {
            "@type": "Country",
            name: "United Kingdom",
          },
          hasDeliveryService: {
            "@type": "DeliveryService",
            name: "UK Delivery",
            description: "Free UK Delivery on all orders",
            deliveryTime: {
              "@type": "QuantitativeValue",
              unitCode: "DAY",
              value: 3,
            },
            areaServed: {
              "@type": "Country",
              name: "United Kingdom",
            },
          },
        };

      case "WebSite":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Royal Furniture",
          url: "https://royalfurnitures.store",
          description:
            "Premium furniture store offering quality pieces for the modern home. Cash on Delivery available across UK.",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://royalfurnitures.store/shop?search?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        };

      case "SearchAction":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          url: "https://royalfurnitures.store",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://royalfurnitures.store/shop?search?q={search_term_string}",
            },
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
            {
              "@type": "SiteNavigationElement",
              name: "Locations",
              url: "https://royalfurnitures.store/locations",
            },
          ],
        };

      case "Product":
        if (!data?.product) return null;
        const product = data.product;
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          description: product.description?.substring(0, 200) || "",
          image: product.images?.[0] || "",
          sku: product.id,
          brand: {
            "@type": "Brand",
            name: "Royal Furniture",
          },
          offers: {
            "@type": "Offer",
            price: product.price || 0,
            priceCurrency: "GBP",
            availability:
              product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            url: `https://royalfurnitures.store/product/${product.slug}`,
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingRate: {
                "@type": "MonetaryAmount",
                value: 0,
                currency: "GBP",
              },
              deliveryTime: {
                "@type": "ShippingDeliveryTime",
                businessDays: {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                },
                deliveryWindow: {
                  "@type": "QuantitativeValue",
                  minValue: 1,
                  maxValue: 3,
                  unitCode: "DAY",
                },
              },
              shippingDestination: [
                {
                  "@type": "DefinedRegion",
                  addressCountry: "GB",
                },
              ],
            },
            acceptedPaymentMethod: [
              {
                "@type": "PaymentMethod",
                name: "Cash on Delivery",
              },
              {
                "@type": "PaymentMethod",
                name: "Credit Card",
              },
            ],
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating || 4.9,
            reviewCount: product.reviewCount || 49,
          },
        };

      case "BreadcrumbList":
        if (!data?.items || data.items.length === 0) return null;
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: data.items.map((item: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
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

      case "BlogPost":
      case "Article":
        if (!data?.post) return null;
        const post = data.post;
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description:
            post.excerpt ||
            post.seoDescription ||
            post.content?.substring(0, 160) ||
            "",
          image: post.featuredImage || "",
          datePublished:
            post.publishedAt?.toDate?.()?.toISOString() ||
            new Date().toISOString(),
          dateModified:
            post.updatedAt?.toDate?.()?.toISOString() ||
            new Date().toISOString(),
          author: {
            "@type": "Person",
            name: post.author?.name || "Royal Furniture",
            url: "https://royalfurnitures.store/about",
          },
          publisher: {
            "@type": "Organization",
            name: "Royal Furniture",
            logo: {
              "@type": "ImageObject",
              url: "https://royalfurnitures.store/logo.png",
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://royalfurnitures.store/blog/${post.slug}`,
          },
          keywords: post.tags?.join(", ") || "",
          articleSection: post.categoryName || "Blog",
          inLanguage: "en-GB",
          isAccessibleForFree: true,
        };

      case "CollectionPage":
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

      case "BreadcrumbList":
        if (!data?.items || data.items.length === 0) return null;
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: data.items.map((item: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
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
