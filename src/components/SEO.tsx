// src/components/SEO/index.tsx
import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  canonical?: string;
  type?: string;
  keywords?: string[];
  noIndex?: boolean;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
  schema?: {
    type:
      | "Organization"
      | "WebSite"
      | "FAQ"
      | "SiteNavigationElement"
      | "BlogCategory"
      | "BlogPost";
    data?: any;
  };
}

export function SEO({ 
  title, 
  description, 
  image, 
  url,
  canonical,
  type = 'website'
}: SEOProps) {
  const siteTitle = title ? `${title} | Royal Furniture` : 'Royal Furniture';
  const siteUrl = url || "https://royalfurnitures.store";
  const siteImage = image || "https://royalfurnitures.store/og-image.jpg";
  const siteDescription = description || "Premium furniture store offering quality pieces for the modern home. Cash on Delivery available across UK.";

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      
      {/* Open Graph - Critical for sharing */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content={type === 'product' ? 'product' : 'website'} />
      <meta property="og:site_name" content="Royal Furniture" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
    </Head>
  );
}