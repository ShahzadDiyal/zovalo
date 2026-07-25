// src/app/(user)/product/[productId]/page.tsx
import { notFound } from "next/navigation";
import { productApi } from "../../../../services/productApi";
import { ProductClient } from "./ProductClient";
import { SEO } from "../../../../components/SEO";
import { Schema } from "../../../../components/SEO/Schema";

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

  const productImage =
    productData.images?.[0] || "https://royalfurnitures.store/og-image.jpg";

  // Prepare breadcrumb items for schema
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

  // Pass the data to the client component
  return (
    <>
      <SEO
        title={productData.title}
        description={productData.description?.substring(0, 160) || ""}
        image={productImage}
        type="product"
        // REMOVED: product prop - not supported by SEO component
      />
      <Schema type="BreadcrumbList" data={{ items: breadcrumbItems }} />
      <Schema type="Product" data={{ product: productData }} />
      <ProductClient product={productData} />
    </>
  );
}
