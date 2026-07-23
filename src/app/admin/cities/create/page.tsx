// src/app/admin/cities/create/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  AlertCircle,
  Globe,
  MapPin,
  Sparkles,
  TrendingUp,
  Check,
  ChevronRight,
} from "lucide-react";
import { cityPageApi } from "../../../../services/cityPageApi";
import { SEO } from "../../../../components/SEO";
import { LoadingSpinner } from "../../../../components/ui/Loading";

export default function CreateCityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Dynamic input states
  const [nearbyAreaInput, setNearbyAreaInput] = useState("");
  const [trustSignalInput, setTrustSignalInput] = useState("");
  const [faqQuestionInput, setFaqQuestionInput] = useState("");
  const [faqAnswerInput, setFaqAnswerInput] = useState("");
  const [seoKeywordsInput, setSeoKeywordsInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    h1Heading: "",
    uniqueIntro: "",
    nearbyAreas: [] as string[],
    localTrustSignals: [] as string[],
    deliveryInfo: "",
    whyChooseUs: [] as string[],
    popularProducts: [] as string[],
    faqs: [] as { question: string; answer: string }[],
    status: "draft" as "draft" | "published",
    featured: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "name" && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setFormData((prev) => ({ ...prev, [name]: value, slug }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  // Nearby Areas
  const handleAddNearbyArea = () => {
    if (
      nearbyAreaInput.trim() &&
      !formData.nearbyAreas.includes(nearbyAreaInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        nearbyAreas: [...prev.nearbyAreas, nearbyAreaInput.trim()],
      }));
      setNearbyAreaInput("");
    }
  };

  const handleRemoveNearbyArea = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      nearbyAreas: prev.nearbyAreas.filter((a) => a !== area),
    }));
  };

  // Trust Signals
  const handleAddTrustSignal = () => {
    if (
      trustSignalInput.trim() &&
      !formData.localTrustSignals.includes(trustSignalInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        localTrustSignals: [...prev.localTrustSignals, trustSignalInput.trim()],
      }));
      setTrustSignalInput("");
    }
  };

  const handleRemoveTrustSignal = (signal: string) => {
    setFormData((prev) => ({
      ...prev,
      localTrustSignals: prev.localTrustSignals.filter((s) => s !== signal),
    }));
  };

  // FAQs
  const handleAddFaq = () => {
    if (faqQuestionInput.trim() && faqAnswerInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        faqs: [
          ...prev.faqs,
          {
            question: faqQuestionInput.trim(),
            answer: faqAnswerInput.trim(),
          },
        ],
      }));
      setFaqQuestionInput("");
      setFaqAnswerInput("");
    }
  };

  const handleRemoveFaq = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  // Why Choose Us
  const handleAddWhyChoose = () => {
    // This is handled via textarea with new lines
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.slug ||
      !formData.metaTitle ||
      !formData.metaDescription
    ) {
      setError(
        "Please fill in all required fields (Name, Slug, Meta Title, Meta Description)",
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Process whyChooseUs from textarea
      const whyChooseUs = formData.whyChooseUs
        ? (formData.whyChooseUs as any)
            .split("\n")
            .filter((item: string) => item.trim())
        : [];

      const dataToSave = {
        ...formData,
        whyChooseUs: whyChooseUs,
        popularProducts: formData.popularProducts || [],
      };

      await cityPageApi.create(dataToSave as any);

      setSuccessMessage("City page created successfully!");
      setTimeout(() => {
        router.push("/admin/cities");
      }, 1500);
    } catch (error: any) {
      console.error("Error creating city page:", error);
      setError(error.message || "Failed to create city page");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate SEO suggestions
  const generateSEOSuggestions = () => {
    if (!formData.name) return;

    const city = formData.name;
    setFormData((prev) => ({
      ...prev,
      metaTitle: `Premium Furniture & Sofas in ${city} | Cash on Delivery | Royal Furniture`,
      h1Heading: `Premium Furniture & Sofas in ${city}`,
      metaDescription: `Order high-quality sofas, corner sets, and divan beds delivered directly to ${city}. Inspect your furniture before paying cash on delivery. Free UK delivery.`,
    }));
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SEO
          title="Create City Page"
          description="Create a new SEO-optimized city page"
        />

        {/* Success Message */}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/cities"
              className="p-2 bg-white border border-warm-beige hover:bg-gold hover:text-white transition-colors rounded"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display text-near-black uppercase tracking-tight">
                Create City Page
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                SEO-optimized location page for better local rankings
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={generateSEOSuggestions}
              className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-100 transition-colors rounded"
            >
              <Sparkles className="w-3 h-3 inline mr-1" /> Generate SEO
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-near-black text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gold transition-all rounded"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Saving..." : "Create Page"}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4 border-l-4 border-amber-500 pl-3">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <h2 className="text-sm font-display text-near-black uppercase">
                    Basic Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                      City Name *
                    </label>
                    <input
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm focus:border-gold outline-none rounded"
                      placeholder="e.g., London"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                      URL Slug *
                    </label>
                    <input
                      name="slug"
                      required
                      value={formData.slug}
                      onChange={handleSlugChange}
                      className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm font-mono focus:border-gold outline-none rounded"
                      placeholder="london"
                    />
                    <p className="text-[8px] text-gray-400 mt-1">
                      URL: /locations/{formData.slug || "city-name"}
                    </p>
                  </div>
                </div>
              </div>

              {/* SEO Content */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4 border-l-4 border-amber-500 pl-3">
                  <Globe className="w-4 h-4 text-amber-500" />
                  <h2 className="text-sm font-display text-near-black uppercase">
                    SEO Content
                  </h2>
                  <button
                    type="button"
                    onClick={generateSEOSuggestions}
                    className="ml-auto text-[8px] font-bold uppercase tracking-widest text-amber-600 hover:text-amber-700"
                  >
                    Generate Suggestions
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                      H1 Heading *
                    </label>
                    <input
                      name="h1Heading"
                      required
                      value={formData.h1Heading}
                      onChange={handleChange}
                      className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm focus:border-gold outline-none rounded"
                      placeholder="e.g., Premium Furniture & Sofas in London"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                      Meta Title *
                    </label>
                    <input
                      name="metaTitle"
                      required
                      value={formData.metaTitle}
                      onChange={handleChange}
                      className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm focus:border-gold outline-none rounded"
                      placeholder="e.g., Chesterfield Sofas & Beds Delivered to London | Cash on Delivery"
                    />
                    <p className="text-[8px] text-gray-400 mt-1">
                      Recommended: 50-60 characters
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                      Meta Description *
                    </label>
                    <textarea
                      name="metaDescription"
                      required
                      rows={2}
                      value={formData.metaDescription}
                      onChange={handleChange}
                      className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm focus:border-gold outline-none rounded resize-none"
                      placeholder="Order high-quality sofas, corner sets, and divan beds delivered directly to London. Inspect your furniture before paying cash on delivery."
                    />
                    <p className="text-[8px] text-gray-400 mt-1">
                      Recommended: 150-160 characters
                    </p>
                  </div>
                </div>
              </div>

              {/* Unique Content */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4 border-l-4 border-amber-500 pl-3">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h2 className="text-sm font-display text-near-black uppercase">
                    Unique Content
                  </h2>
                  <span className="ml-auto text-[8px] text-gray-400">
                    * Required for SEO
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                      Unique Introduction *
                    </label>
                    <textarea
                      name="uniqueIntro"
                      required
                      rows={3}
                      value={formData.uniqueIntro}
                      onChange={handleChange}
                      className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm focus:border-gold outline-none rounded resize-none"
                      placeholder="Write 2-3 sentences custom for this city. Do NOT copy-paste from other cities!"
                    />
                    <p className="text-[8px] text-amber-600 mt-1">
                      ⚠️ Must be unique - Google penalizes duplicate content
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                      Delivery Information
                    </label>
                    <textarea
                      name="deliveryInfo"
                      rows={2}
                      value={formData.deliveryInfo}
                      onChange={handleChange}
                      className="w-full bg-cream border border-warm-beige py-2.5 px-4 text-sm focus:border-gold outline-none rounded resize-none"
                      placeholder="e.g., 1-3 Day Delivery across Greater London & M25"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4 border-l-4 border-amber-500 pl-3">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <h2 className="text-sm font-display text-near-black uppercase">
                    Nearby Areas / Suburbs
                  </h2>
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={nearbyAreaInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNearbyAreaInput(value);
                      // Check if comma is entered
                      if (value.includes(",")) {
                        const items = value
                          .split(",")
                          .map((item) => item.trim())
                          .filter((item) => item);
                        items.forEach((item) => {
                          if (item && !formData.nearbyAreas?.includes(item)) {
                            setFormData((prev) => ({
                              ...prev,
                              nearbyAreas: [...(prev.nearbyAreas || []), item],
                            }));
                          }
                        });
                        setNearbyAreaInput("");
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && nearbyAreaInput.trim()) {
                        e.preventDefault();
                        handleAddNearbyArea();
                      }
                    }}
                    placeholder="e.g., Salford, Stockport, Bolton (separate with commas)"
                    className="flex-1 bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                  />
                  <button
                    type="button"
                    onClick={handleAddNearbyArea}
                    className="bg-gold text-near-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition rounded"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(formData.nearbyAreas || []).map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-cream text-xs rounded-full border border-warm-beige"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => handleRemoveNearbyArea(area)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <p className="text-[8px] text-gray-400 mt-1">
                  List real surrounding towns. Separate with commas for multiple
                  entries.
                </p>
              </div>

              {/* FAQs */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4 border-l-4 border-amber-500 pl-3">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                  <h2 className="text-sm font-display text-near-black uppercase">
                    FAQs
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-[8px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      value={faqQuestionInput}
                      onChange={(e) => setFaqQuestionInput(e.target.value)}
                      placeholder="e.g., Do you deliver to my area?"
                      className="w-full bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[8px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                        Answer
                      </label>
                      <input
                        type="text"
                        value={faqAnswerInput}
                        onChange={(e) => setFaqAnswerInput(e.target.value)}
                        placeholder="e.g., Yes, we deliver across Greater London"
                        className="w-full bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="self-end bg-gold text-near-black px-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition rounded"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {formData.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="bg-cream p-3 rounded flex justify-between items-start gap-2"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-near-black">
                          Q: {faq.question}
                        </p>
                        <p className="text-sm text-gray-600">A: {faq.answer}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-walnut mb-4">
                  Page Status
                </h3>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        status:
                          prev.status === "published" ? "draft" : "published",
                      }))
                    }
                    className={`w-full py-2.5 text-[10px] font-bold uppercase tracking-widest rounded transition-colors ${
                      formData.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {formData.status === "published"
                      ? "✓ Published"
                      : "📝 Draft"}
                  </button>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span className="text-xs font-medium text-gray-600">
                      Feature this city page
                    </span>
                  </label>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-walnut mb-4">
                  Local Trust Signals
                </h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={trustSignalInput}
                    onChange={(e) => setTrustSignalInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddTrustSignal())
                    }
                    placeholder="e.g., Pay Cash on Delivery"
                    className="flex-1 bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                  />
                  <button
                    type="button"
                    onClick={handleAddTrustSignal}
                    className="bg-gold text-near-black px-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition rounded"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {formData.localTrustSignals.map((signal) => (
                    <div
                      key={signal}
                      className="flex items-center justify-between bg-cream px-3 py-1.5 rounded"
                    >
                      <span className="text-xs text-gray-600">{signal}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTrustSignal(signal)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-[8px] text-gray-400 mt-1">
                  Include delivery promises, payment options, etc.
                </p>
              </div>

              {/* Why Choose Us */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-walnut mb-4">
                  Why Choose Us (Bullet Points)
                </h3>
                <textarea
                  name="whyChooseUs"
                  rows={5}
                  value={
                    Array.isArray(formData.whyChooseUs)
                      ? formData.whyChooseUs.join("\n")
                      : formData.whyChooseUs || ""
                  }
                  onChange={(e) => {
                    const value = e.target.value
                      .split("\n")
                      .filter((line) => line.trim());
                    setFormData((prev) => ({ ...prev, whyChooseUs: value }));
                  }}
                  className="w-full bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded resize-none"
                  placeholder="Premium Quality&#10;Free UK Delivery&#10;Cash on Delivery&#10;14-Day Returns"
                />
                <p className="text-[8px] text-gray-400 mt-1">One per line</p>
              </div>

              {/* Popular Products */}
              {/* Popular Products */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-walnut mb-4">
                  Popular Products
                </h3>
                <textarea
                  name="popularProducts"
                  rows={3}
                  value={
                    Array.isArray(formData.popularProducts)
                      ? formData.popularProducts.join("\n")
                      : formData.popularProducts || ""
                  }
                  onChange={(e) => {
                    const value = e.target.value
                      .split("\n")
                      .filter((line) => line.trim());
                    setFormData((prev) => ({
                      ...prev,
                      popularProducts: value,
                    }));
                  }}
                  className="w-full bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded resize-none"
                  placeholder="Sofa Sets&#10;Dining Tables&#10;Beds"
                />
                <p className="text-[8px] text-gray-400 mt-1">
                  One per line - Product names or IDs
                </p>
              </div>

              {/* SEO Preview */}
              <div className="bg-white border border-warm-beige p-6 rounded-lg">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-walnut mb-4">
                  SEO Preview
                </h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-[8px] text-gray-400">Title</p>
                    <p className="text-near-black font-medium">
                      {formData.metaTitle || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[8px] text-gray-400">Description</p>
                    <p className="text-gray-600">
                      {formData.metaDescription || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[8px] text-gray-400">URL</p>
                    <p className="text-amber-600 font-mono">
                      /locations/{formData.slug || "city-name"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
