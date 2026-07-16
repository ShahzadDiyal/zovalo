import Head from "next/head";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export function SEO({ title, description, image, url }: SEOProps) {
  const siteTitle = `${title} | Royal Furniture Furniture`;
  const siteUrl = url || "https://Royal Furniture.com";
  const siteImage = image || "https://Royal Furniture.com/og-image.jpg";

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
