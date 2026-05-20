"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "../../../lib/utils";
import { Product } from "../../../types";
import { productApi } from "../../../services/productApi";
import { LoadingSpinner } from "../../../components/ui/Loading";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportDetailedToCSV = () => {
    const productsToExport = products.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (productsToExport.length === 0) {
      alert("No products to export");
      return;
    }

    const headers = [
      "Product ID",
      "SKU",
      "Title",
      "Slug",
      "Description",
      "Price (£)",
      "Category",
      "Stock Quantity",
      "Featured",
      "Main Image URL",
      "All Image URLs",
      "Material",
      "Dimensions",
      "Weight",
      "Color",
      "Warranty",
      "Created Date",
      "Last Updated",
    ];

    const rows = productsToExport.map((product) => {
      const specs = product.specifications || {};
      return [
        product.id,
        product.id.slice(0, 8).toUpperCase(),
        `"${product.title.replace(/"/g, '""')}"`,
        product.slug,
        `"${product.description.replace(/"/g, '""').replace(/\n/g, " ")}"`,
        product.price,
        product.category,
        product.stock,
        product.featured ? "Yes" : "No",
        product.images[0] || "",
        `"${product.images.join("; ")}"`,
        `"${(specs.Material || "").replace(/"/g, '""')}"`,
        `"${(specs.Dimensions || "").replace(/"/g, '""')}"`,
        `"${(specs.Weight || "").replace(/"/g, '""')}"`,
        `"${(specs.Color || "").replace(/"/g, '""')}"`,
        `"${(specs.Warranty || "").replace(/"/g, '""')}"`,
        product.createdAt?.toDate?.().toLocaleDateString("en-GB") || "N/A",
        product.updatedAt?.toDate?.().toLocaleDateString("en-GB") || "N/A",
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const fileName = `Zovallo_products_${new Date().toISOString().split("T")[0]}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone.",
      )
    )
      return;
    try {
      await productApi.delete(id);
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-5 sm:space-y-6 md:space-y-8 lg:space-y-10 px-3 sm:px-4 md:px-5 lg:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display text-near-black uppercase tracking-tight">
            Product Inventory
          </h1>
          <p className="text-gray-400 text-[11px] sm:text-xs md:text-sm mt-1">
            Total volume: {products.length} active pieces
          </p>
        </div>
        <Link
          href="/admin/products/edit"
          className="bg-near-black text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gold transition-all duration-300 shadow-lg w-full sm:w-auto rounded"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Add Masterpiece
        </Link>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-warm-beige p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-6 rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, category, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream border-none py-2 sm:py-2.5 md:py-3 pl-9 sm:pl-10 md:pl-12 pr-3 sm:pr-4 text-xs sm:text-sm focus:ring-1 focus:ring-gold outline-none rounded"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-walnut" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-cream border-none py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-gold rounded"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={exportDetailedToCSV}
            className="bg-white border border-warm-beige px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-cream transition-colors rounded"
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-warm-beige overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] sm:min-w-[700px] md:min-w-[800px]">
            <thead>
              <tr className="bg-cream/50">
                <th className="px-3 sm:px-4 md:px-5 lg:px-8 py-2 sm:py-3 md:py-4 lg:py-5 text-left text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Product
                </th>
                <th className="px-3 sm:px-4 md:px-5 lg:px-8 py-2 sm:py-3 md:py-4 lg:py-5 text-left text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Category
                </th>
                <th className="px-3 sm:px-4 md:px-5 lg:px-8 py-2 sm:py-3 md:py-4 lg:py-5 text-left text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Pricing
                </th>
                <th className="px-3 sm:px-4 md:px-5 lg:px-8 py-2 sm:py-3 md:py-4 lg:py-5 text-left text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Stock Status
                </th>
                <th className="px-3 sm:px-4 md:px-5 lg:px-8 py-2 sm:py-3 md:py-4 lg:py-5 text-right text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Management
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-beige">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 sm:px-4 md:px-5 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24"
                  >
                    <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
                      <LoadingSpinner />
                      <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                        Synchronizing Inventory...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 sm:px-4 md:px-5 lg:px-8 py-10 sm:py-12 md:py-16 text-center text-gray-400 text-xs sm:text-sm"
                  >
                    No products matched your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-cream/20 transition-colors"
                  >
                    <td className="px-3 sm:px-4 md:px-5 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6">
                      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-cream border border-warm-beige overflow-hidden rounded">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs sm:text-sm font-bold text-near-black line-clamp-1">
                            {p.title}
                          </span>
                          <span className="text-[8px] sm:text-[9px] md:text-[10px] font-mono text-gray-400">
                            SKU: {p.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-5 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold" />
                        <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-walnut">
                          {p.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-5 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6">
                      <span className="text-xs sm:text-sm font-light text-near-black">
                        {formatCurrency(p.price)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-5 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6">
                      <div className="flex flex-col gap-1 sm:gap-1.5">
                        <div className="w-16 sm:w-20 md:w-24 h-1 bg-cream rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${p.stock < 5 ? "bg-red-500" : "bg-mint-700"}`}
                            style={{
                              width: `${Math.min((p.stock / 20) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <span
                          className={`text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-bold uppercase ${p.stock < 5 ? "text-red-500" : "text-mint-700"}`}
                        >
                          {p.stock} Available
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-5 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-1.5 md:gap-2">
                        <Link
                          href={`/product/${p.id}`}
                          target="_blank"
                          className="p-1 sm:p-1.5 md:p-2 text-gray-400 hover:text-gold transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/edit/${p.id}`}
                          className="p-1 sm:p-1.5 md:p-2 text-near-black hover:text-gold transition-colors"
                        >
                          <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1 sm:p-1.5 md:p-2 text-near-black hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        <div className="p-3 sm:p-4 md:p-5 lg:p-8 bg-cream/30 border-t border-warm-beige flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center sm:text-left">
            Showing{" "}
            {Math.min(
              filteredProducts.length,
              (currentPage - 1) * itemsPerPage + 1,
            )}
            -{Math.min(filteredProducts.length, currentPage * itemsPerPage)} of{" "}
            {filteredProducts.length} masterpieces
          </p>
          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 sm:p-2 bg-white border border-warm-beige text-gray-400 disabled:opacity-50 hover:bg-cream transition-colors rounded"
            >
              <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            </button>
            <div className="flex items-center px-2 sm:px-3 md:px-4 text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest border border-warm-beige bg-white rounded">
              Page {currentPage} of {totalPages || 1}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 sm:p-2 bg-white border border-warm-beige text-near-black hover:bg-gold transition-colors disabled:opacity-50 rounded"
            >
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
