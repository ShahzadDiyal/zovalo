// src/components/SEO/Schema.tsx
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
  | "SearchAction"
  | "SiteReviews";
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
          paymentAccepted: ["Cash on Delivery"],
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
                "https://royalfurnitures.store/shop?search={search_term_string}",
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
                "https://royalfurnitures.store/shop?search={search_term_string}",
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

      // case "Product": {
      //   if (!data?.product) return null;
      //   const product = data.product;
      //   const productImages = (product.images || []).filter(Boolean);
      //   const productReviews = (data.reviews || []).filter(Boolean);

      //   const hasReviews = product.reviewCount && product.reviewCount > 0 && product.rating;

      //   return {
      //     "@context": "https://schema.org",
      //     "@type": "Product",
      //     name: product.title,
      //     description: product.description?.substring(0, 200) || "",
      //     image: productImages.length ? productImages : undefined,
      //     sku: product.id || product.slug,
      //     brand: {
      //       "@type": "Brand",
      //       name: "Royal Furniture",
      //     },
      //     offers: {
      //       "@type": "Offer",
      //       price: String(product.price ?? "0.00"),
      //       priceCurrency: "GBP",
      //       availability:
      //         product.stock > 0
      //           ? "https://schema.org/InStock"
      //           : "https://schema.org/OutOfStock",
      //       url: `https://royalfurnitures.store/product/${product.slug}`,
      //       hasMerchantReturnPolicy: {
      //         "@type": "MerchantReturnPolicy",
      //         applicableCountry: "GB",
      //         returnPolicyCategory:
      //           "https://schema.org/MerchantReturnFiniteReturnWindow",
      //         merchantReturnDays: 14,
      //         returnMethod: "https://schema.org/ReturnByMail",
      //         returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
      //       },
      //       shippingDetails: {
      //         "@type": "OfferShippingDetails",
      //         shippingRate: {
      //           "@type": "MonetaryAmount",
      //           value: 0,
      //           currency: "GBP",
      //         },
      //         deliveryTime: {
      //           "@type": "ShippingDeliveryTime",
      //           businessDays: {
      //             "@type": "OpeningHoursSpecification",
      //             dayOfWeek: [
      //               "Monday",
      //               "Tuesday",
      //               "Wednesday",
      //               "Thursday",
      //               "Friday",
      //             ],
      //           },
      //           deliveryWindow: {
      //             "@type": "QuantitativeValue",
      //             minValue: 1,
      //             maxValue: 3,
      //             unitCode: "DAY",
      //           },
      //         },
      //         shippingDestination: [
      //           {
      //             "@type": "DefinedRegion",
      //             addressCountry: "GB",
      //           },
      //         ],
      //       },
      //       acceptedPaymentMethod: [
      //         {
      //           "@type": "PaymentMethod",
      //           name: "Cash on Delivery",
      //         },
      //         {
      //           "@type": "PaymentMethod",
      //           name: "Credit Card",
      //         },
      //       ],
      //     },
      //     // Only includes aggregateRating if real rating data exists
      //     aggregateRating: hasReviews
      //       ? {
      //         "@type": "AggregateRating",
      //         ratingValue: product.rating,
      //         reviewCount: product.reviewCount,
      //         bestRating: 5,
      //         worstRating: 1,
      //       }
      //       : undefined,
      //     // Only includes reviews if real review array is non-empty
      //     review:
      //       productReviews.length > 0
      //         ? productReviews.slice(0, 10).map((r: any) => ({
      //           "@type": "Review",
      //           reviewRating: {
      //             "@type": "Rating",
      //             ratingValue: r.rating || 5,
      //             bestRating: 5,
      //             worstRating: 1,
      //           },
      //           author: {
      //             "@type": "Person",
      //             name: r.customerName || "Verified Buyer",
      //           },
      //           reviewBody: r.comment || "",
      //           name: r.title || undefined,
      //           datePublished: r.reviewDate || new Date().toISOString(),
      //         }))
      //         : undefined,
      //   };
      // }

      case "Product": {
        if (!data?.product) return null;
        const product = data.product;

        // Ensure absolute image URLs and fallback image array
        const productImages = (product.images || [])
          .filter(Boolean)
          .map((img: string) => img.startsWith("http") ? img : `https://royalfurnitures.store${img}`);

        if (productImages.length === 0) {
          productImages.push("https://royalfurnitures.store/logo.png");
        }

        const productReviews = (data.reviews || []).filter(Boolean);
        const hasReviews = product.reviewCount && product.reviewCount > 0 && product.rating;

        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.title,
          "description": product.description?.replace(/<[^>]*>?/gm, '').substring(0, 200) || product.title,
          "image": productImages,
          "sku": String(product.id || product.slug),
          "mpn": String(product.id || product.slug),
          "brand": {
            "@type": "Brand",
            "name": "Royal Furniture",
          },
          "offers": {
            "@type": "Offer",
            "price": String(product.price && product.price > 0 ? product.price : "1.00"),
            "priceCurrency": "GBP",
            "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            "availability": product.stock > 0 || product.inStock !== false
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            "url": `https://royalfurnitures.store/product/${product.slug}`,
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "applicableCountry": "GB",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 14,
              "returnMethod": "https://schema.org/ReturnByMail",
              "returnFees": "https://schema.org/ReturnFeesCustomerResponsibility",
            },
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": 0,
                "currency": "GBP",
              },
              "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 0,
                  "maxValue": 1,
                  "unitCode": "DAY"
                },
                "transitTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 1,
                  "maxValue": 3,
                  "unitCode": "DAY"
                }
              },
              "shippingDestination": [
                {
                  "@type": "DefinedRegion",
                  "addressCountry": "GB",
                },
              ],
            },
          },
          ...(hasReviews ? {
            aggregateRating: {
              "@type": "AggregateRating",
              "ratingValue": product.rating,
              "reviewCount": product.reviewCount,
              "bestRating": 5,
              "worstRating": 1,
            }
          } : {}),
        };
      }

      case "SiteReviews": {
        // Site-wide reviews (across all products) - used by ReviewsBadge,
        // HomeReviewsSection and the /reviews page so search engines and AI
        // agents (ChatGPT, Perplexity, Gemini, etc.) can see real review
        // text and an accurate total, not just a claimed star rating.
        // Note: Google's rich-result guidelines restrict *self-published*
        // Organization/LocalBusiness review stars from showing in search -
        // this markup is still fully valid schema.org data that AI crawlers
        // and answer engines can read and cite.
        const siteAggregate = data?.aggregate as
          | { count: number; average: number }
          | undefined;
        const siteReviews = (data?.reviews || []).filter(Boolean);
        if (
          (!siteAggregate || !siteAggregate.count) &&
          siteReviews.length === 0
        ) {
          return null;
        }
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://royalfurnitures.store/#organization",
          name: "Royal Furniture",
          url: "https://royalfurnitures.store",
          ...(siteAggregate && siteAggregate.count > 0
            ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: siteAggregate.average,
                reviewCount: siteAggregate.count,
                bestRating: 5,
                worstRating: 1,
              },
            }
            : {}),
          ...(siteReviews.length > 0
            ? {
              review: siteReviews.slice(0, 50).map((r: any) => ({
                "@type": "Review",
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: r.rating,
                  bestRating: 5,
                  worstRating: 1,
                },
                author: {
                  "@type": "Person",
                  name: r.customerName,
                },
                reviewBody: r.comment,
                name: r.title || undefined,
                datePublished: r.reviewDate,
                itemReviewed: {
                  "@type": "Product",
                  name: r.productTitle || "Royal Furniture",
                },
              })),
            }
            : {}),
        };
      }

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
          image: post.featuredImage || undefined,
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
