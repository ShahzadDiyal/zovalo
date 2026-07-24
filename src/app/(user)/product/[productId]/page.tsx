// src/app/(user)/product/[productId]/page.tsx
import { notFound } from "next/navigation";
import { productApi } from "../../../../services/productApi";
import { ProductClient } from "./ProductClient";
import { SEO } from "../../../../components/SEO";

// Next.js 16 requires params to be awaited
export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  // Await the params promise
  const { productId } = await params;

  // Fetch product data on the server
  let productData = await productApi.getById(productId);
  if (!productData) {
    productData = await productApi.getProductBySlug(productId);
  }

  if (!productData) {
    notFound();
  }

  // Pass the data to the client component
  return (
    <>
      <SEO
        title={productData.title}
        description={productData.description?.substring(0, 160) || ""}
        image={productData.images?.[0]}
        type="product"
      />
      <ProductClient product={productData} />
    </>
  );
}
