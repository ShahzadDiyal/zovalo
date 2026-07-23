// src/app/admin/cities/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  Globe,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cityPageApi } from "../../../services/cityPageApi";
import { CityPage } from "../../../types";
import { LoadingSpinner } from "../../../components/ui/Loading";
import { Skeleton } from "../../../components/ui/Loading";

export default function AdminCityPages() {
  const [pages, setPages] = useState<CityPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft"
  >("all");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cityPageApi.getAll();
      setPages(data);
    } catch (error) {
      console.error("Error fetching city pages:", error);
      setError("Failed to load city pages. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this city page?"))
      return;

    try {
      await cityPageApi.delete(id);
      setSuccessMessage("City page deleted successfully!");
      await fetchPages();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error deleting city page:", error);
      setError("Failed to delete city page");
    }
  };

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || page.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === "published") {
      return (
        <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-[8px] font-bold uppercase">
          <CheckCircle className="w-3 h-3" /> Published
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-[8px] font-bold uppercase">
        <XCircle className="w-3 h-3" /> Draft
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display text-near-black uppercase tracking-tight">
            City Pages
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your SEO-optimized location pages
          </p>
        </div>
        <Link
          href="/admin/cities/create"
          className="bg-near-black text-white px-4 sm:px-6 py-2.5 sm:py-3 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gold transition-all duration-300 w-full sm:w-auto justify-center rounded"
        >
          <Plus className="w-4 h-4" /> New City Page
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-warm-beige p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cream border border-warm-beige py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-gold outline-none rounded"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-colors ${
                filterStatus === "all"
                  ? "bg-near-black text-white"
                  : "bg-cream text-gray-600 hover:bg-gold/20"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("published")}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-colors ${
                filterStatus === "published"
                  ? "bg-emerald-600 text-white"
                  : "bg-cream text-gray-600 hover:bg-gold/20"
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilterStatus("draft")}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-colors ${
                filterStatus === "draft"
                  ? "bg-amber-600 text-white"
                  : "bg-cream text-gray-600 hover:bg-gold/20"
              }`}
            >
              Drafts
            </button>
          </div>
        </div>
      </div>

      {/* Pages Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white border border-warm-beige rounded-lg p-4"
            >
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="text-center py-12 bg-white border border-warm-beige rounded-lg">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">
            {searchQuery
              ? "No cities match your search"
              : "No city pages created yet"}
          </p>
          {!searchQuery && (
            <Link
              href="/admin/cities/create"
              className="inline-block mt-4 text-gold hover:underline text-sm font-medium"
            >
              Create your first city page
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPages.map((page) => (
            <div
              key={page.id}
              className="bg-white border border-warm-beige rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-display text-near-black text-lg">
                      {page.name}
                    </h3>
                    <p className="text-[10px] font-mono text-walnut font-bold uppercase tracking-widest">
                      /{page.slug}
                    </p>
                  </div>
                  {getStatusBadge(page.status)}
                </div>

                <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                  {page.metaDescription || "No description"}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {page.views || 0} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {page.createdAt?.toDate?.().toLocaleDateString() || "N/A"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-warm-beige">
                  <Link
                    href={`/locations/${page.slug}`}
                    target="_blank"
                    className="text-[9px] font-bold uppercase tracking-widest text-gold hover:text-near-black transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> View
                  </Link>
                  <Link
                    href={`/admin/cities/edit/${page.id}`}
                    className="text-[9px] font-bold uppercase tracking-widest text-walnut hover:text-gold transition-colors flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="text-[9px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
