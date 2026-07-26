// src/app/(user)/shop/page.tsx
import { Suspense } from "react";
import { fetchShopData } from "./ShopData";
import { ShopClient } from "./ShopClient";

export default async function ShopPage() {
  const { products, categories } = await fetchShopData();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      }
    >
      <ShopClient initialProducts={products} initialCategories={categories} />
    </Suspense>
  );
}
