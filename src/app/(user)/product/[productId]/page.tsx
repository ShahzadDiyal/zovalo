// src/app/(user)/product/[productId]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { productApi } from "../../../../services/productApi";
import { ProductClient } from "./ProductClient";
import { Schema } from "../../../../components/SEO/Schema";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

const getProductForPage = (productId: string) =>
  unstable_cache(
    async () =>
      (await productApi.getById(productId)) ||
      (await productApi.getProductBySlug(productId)),
    ["product-page", productId],
    { revalidate: 120 },
  )();

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = await getProductForPage(productId);

  if (!product) return {};

  const title = product.title;
  const description =
    product.description?.substring(0, 160) ||
    `Buy ${product.title} at Royal Furniture. Cash on Delivery available across the UK.`;
  const image =
    product.images?.[0] || "https://royalfurnitures.store/og-image.jpg";

  return {
    title,
    description,
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website", // Next's OG type union doesn't include "product"
      images: [{ url: image, width: 1200, height: 630 }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const productData = await getProductForPage(productId);
  if (!productData) notFound();

  const breadcrumbItems = [
    { name: "Home", url: "https://royalfurnitures.store/" },
    { name: "Shop", url: "https://royalfurnitures.store/shop" },
    {
      name: productData.category || "Products",
      url: `https://royalfurnitures.store/category/${productData.category?.toLowerCase().replace(/ /g, "-") || "products"}`,
    },
    {
      name: productData.title,
      url: `https://royalfurnitures.store/product/${productData.slug}`,
    },
  ];

  return (
    <>
      <Schema type="BreadcrumbList" data={{ items: breadcrumbItems }} />
      <Schema type="Product" data={{ product: productData }} />
      <ProductClient product={productData} />
    </>
  );
}