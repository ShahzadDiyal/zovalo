import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  canonical?: string;
  website?: string;
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
    type: "Organization" | "WebSite" | "FAQ" | "SiteNavigationElement" | "BlogCategory" | "BlogPost";
    data?: any;
  };
}

export function SEO({ title, description, image, url }: SEOProps) {
  const siteTitle = `${title} | Royal FurnitureFurniture`;
  const siteUrl = url || "https://zovallo.com";
  const siteImage = image || "https://zovallo.com/og-image.jpg";

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:url" content={siteUrl} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
