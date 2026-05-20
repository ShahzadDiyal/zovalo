"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  Image as ImageIcon,
  Tag,
  Info,
  Layers,
  ChevronRight,
  Upload,
  Trash2,
  AlertCircle,
  Ruler,
  Weight,
  Palette,
  Sofa,
  Truck,
  Shield,
  Wrench,
  DollarSign,
  Globe,
  Clock,
  Filter,
  PlusCircle,
} from "lucide-react";
import { Product, Category } from "../../../../../types";
import { productApi } from "../../../../../services/productApi";
import { categoryApi } from "../../../../../services/categoryApi";
import { LoadingSpinner } from "../../../../../components/ui/Loading";
import { useRouter } from "next/navigation";

export default function AdminProductForm() {
  const params = useParams();
  const productId = params?.productId
    ? Array.isArray(params.productId)
      ? params.productId[0]
      : params.productId
    : null;
  const productIdStr = typeof productId === "string" ? productId : "";

  const router = useRouter();
  const isEdit = !!productId;

  const [loading, setLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);

  // Dynamic input states
  const [newSeater, setNewSeater] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newCountry, setNewCountry] = useState("");

  const [formData, setFormData] = useState<Partial<Product>>({
    title: "",
    slug: "",
    description: "",
    price: 0,
    compareAtPrice: 0,
    category: "",
    images: [],
    stock: 0,
    seaterCount: [] as string[],
    colors: [] as string[],
    material: "",
    dimensions: "",
    weight: 0,
    warrantyYears: 0,
    deliveryCountries: [] as string[],
    estimatedDelivery: "",
    tags: [] as string[],
    specifications: {
      Material: "",
      Dimensions: "",
      Weight: "",
      Warranty: "",
      CareInstructions: "",
    },
    featured: false,
  });

  useEffect(() => {
    async function fetchData() {
      const catsData = await categoryApi.getAllCategories();
      setCategories(catsData);

      if (isEdit && productId) {
        const productIdValue = Array.isArray(productId)
          ? productId[0]
          : productId;
        const product = await productApi.getById(productIdValue);
        if (product) {
          setFormData(product);
        } else {
          alert("Product not found");
          router.push("/admin/products");
        }
        setLoading(false);
      }
    }
    fetchData();
  }, [productId, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSpecChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...(prev.specifications || {}),
        [key]: value,
      },
    }));
  };

  // Dynamic add for Seater Count
  const handleAddSeater = () => {
    if (newSeater.trim() && !formData.seaterCount?.includes(newSeater.trim())) {
      setFormData((prev) => ({
        ...prev,
        seaterCount: [...(prev.seaterCount || []), newSeater.trim()],
      }));
      setNewSeater("");
    }
  };

  const handleRemoveSeater = (seater: string) => {
    setFormData((prev) => ({
      ...prev,
      seaterCount: (prev.seaterCount || []).filter((s) => s !== seater),
    }));
  };

  // Dynamic add for Colors
  const handleAddColor = () => {
    if (newColor.trim() && !formData.colors?.includes(newColor.trim())) {
      setFormData((prev) => ({
        ...prev,
        colors: [...(prev.colors || []), newColor.trim()],
      }));
      setNewColor("");
    }
  };

  const handleRemoveColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: (prev.colors || []).filter((c) => c !== color),
    }));
  };

  // Dynamic add for Tags
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tag),
    }));
  };

  // Dynamic add for Delivery Countries
  const handleAddCountry = () => {
    if (
      newCountry.trim() &&
      !formData.deliveryCountries?.includes(newCountry.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        deliveryCountries: [
          ...(prev.deliveryCountries || []),
          newCountry.trim(),
        ],
      }));
      setNewCountry("");
    }
  };

  const handleRemoveCountry = (country: string) => {
    setFormData((prev) => ({
      ...prev,
      deliveryCountries: (prev.deliveryCountries || []).filter(
        (c) => c !== country,
      ),
    }));
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const compressImage = (file: File, maxWidth: number = 800): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                });
                resolve(compressedFile);
              } else {
                reject(new Error("Failed to compress image"));
              }
            },
            file.type,
            0.7,
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleMultipleFilesUpload = async (files: FileList) => {
    const filesArray = Array.from(files);
    const currentImages = formData.images || [];
    const remainingSlots = 5 - currentImages.length;

    if (filesArray.length > remainingSlots) {
      alert(
        `You can only add ${remainingSlots} more image(s). Maximum 5 images allowed.`,
      );
      return;
    }

    setUploadingImages(true);
    setUploadProgress(0);

    const newImages: string[] = [];
    let processed = 0;

    for (const file of filesArray) {
      try {
        if (!file.type.startsWith("image/")) {
          alert(`${file.name} is not an image file. Skipping.`);
          continue;
        }
        if (file.size > 500 * 1024) {
          alert(`${file.name} is larger than 500KB. Please compress it first.`);
          continue;
        }
        const compressedFile = await compressImage(file, 600);
        const base64String = await convertToBase64(compressedFile);
        newImages.push(base64String);
        processed++;
        setUploadProgress((processed / filesArray.length) * 100);
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        alert(`Failed to process ${file.name}`);
      }
    }

    if (newImages.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newImages],
      }));
    }

    setUploadingImages(false);
    setUploadProgress(0);
  };

  const removeImage = (index: number) => {
    const newImages = (formData.images || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...(formData.images || [])];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validImages = (formData.images || []).filter(
      (img) => img && img.trim() !== "",
    );
    if (validImages.length === 0) {
      alert("Please add at least one product image");
      return;
    }

    const totalSize = validImages.reduce(
      (sum, img) => sum + (img.length || 0),
      0,
    );
    if (totalSize > 900 * 1024) {
      alert(
        "Total image size is too large. Please use smaller images or reduce number of images.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        images: validImages,
      };
      if (isEdit && productId) {
        await productApi.update(productId as string, productData);
      } else {
        await productApi.create(productData as Omit<Product, "id">);
      }
      router.push("/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] space-y-3 sm:space-y-4">
        <LoadingSpinner />
        <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gold animate-pulse">
          Syncing Specifications...
        </div>
      </div>
    );
  }

  const imageCount = (formData.images || []).filter(
    (img) => img && img.trim() !== "",
  ).length;

  const discountPercent =
    formData.compareAtPrice &&
    formData.price &&
    formData.compareAtPrice > formData.price
      ? Math.round(
          ((formData.compareAtPrice - formData.price) /
            formData.compareAtPrice) *
            100,
        )
      : 0;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-5 lg:px-0 space-y-5 sm:space-y-6 md:space-y-8 lg:space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-warm-beige pb-4 sm:pb-6 md:pb-8 gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          <Link
            href="/admin/products"
            className="p-2 sm:p-2.5 md:p-3 bg-white border border-warm-beige hover:bg-gold hover:text-white transition-colors block shrink-0 rounded"
          >
            <ArrowLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display text-near-black uppercase tracking-tight">
              {isEdit ? "Curate Artpiece" : "Introduce Masterpiece"}
            </h1>
            <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1">
              Refining the physical essence of your collection.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Admin <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Inventory{" "}
          <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{" "}
          {isEdit ? "Edit" : "New"}
        </div>
      </div>

      {/* Form Grid */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 xl:gap-12"
      >
        {/* Left Column - Main Form Fields */}
        <div className="flex-1 space-y-5 sm:space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12">
          {/* Core Identity */}
          <section className="bg-white border border-warm-beige p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 md:space-y-8 shadow-sm rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3 border-l-4 border-gold pl-3 sm:pl-4">
              <Info className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gold" />
              <h2 className="text-sm sm:text-base md:text-lg font-display text-near-black uppercase">
                Core Identity
              </h2>
            </div>

            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label
                  htmlFor="title"
                  className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block"
                >
                  Master Title *
                </label>
                <input
                  id="title"
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-cream border border-warm-beige py-2.5 sm:py-3 md:py-4 px-4 sm:px-5 md:px-6 text-base sm:text-lg md:text-xl lg:text-2xl font-display focus:border-gold outline-none transition-colors rounded"
                  placeholder="e.g. Royal Oak Dining Table"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <label
                    htmlFor="slug"
                    className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block"
                  >
                    Internal Slug
                  </label>
                  <input
                    id="slug"
                    required
                    name="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      }))
                    }
                    className="w-full bg-cream border border-warm-beige py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 text-xs sm:text-sm font-mono focus:border-gold outline-none transition-colors rounded"
                    placeholder="royal-oak-table"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label
                    htmlFor="category"
                    className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block"
                  >
                    Collection Hierarchy *
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      required
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-cream border border-warm-beige py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 text-xs sm:text-sm focus:border-gold outline-none appearance-none transition-colors rounded"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-90 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label
                  htmlFor="description"
                  className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block"
                >
                  Physical Narrative *
                </label>
                <textarea
                  id="description"
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-cream border border-warm-beige py-2.5 sm:py-3 md:py-4 px-4 sm:px-5 md:px-6 text-xs sm:text-sm leading-relaxed focus:border-gold outline-none resize-none transition-colors rounded"
                  placeholder="Describe the craftsmanship, material, and soul of this piece..."
                />
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="bg-white border border-warm-beige p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 md:space-y-8 shadow-sm rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3 border-l-4 border-gold pl-3 sm:pl-4">
              <DollarSign className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gold" />
              <h2 className="text-sm sm:text-base md:text-lg font-display text-near-black uppercase">
                Pricing
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block">
                  Sale Price (GBP) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold font-bold">
                    £
                  </span>
                  <input
                    required
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-cream border border-warm-beige py-2.5 pl-7 pr-3 text-sm focus:border-gold outline-none rounded"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block">
                  Compare at Price (Original Price)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    £
                  </span>
                  <input
                    type="number"
                    name="compareAtPrice"
                    value={formData.compareAtPrice || ""}
                    onChange={handleChange}
                    className="w-full bg-cream border border-warm-beige py-2.5 pl-7 pr-3 text-sm focus:border-gold outline-none rounded"
                    step="0.01"
                    min="0"
                  />
                </div>
                {discountPercent > 0 && (
                  <p className="text-[10px] text-mint-700 mt-1">
                    Save {discountPercent}%
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Filterable Attributes Section - Dynamic */}
          <section className="bg-white border border-warm-beige p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 md:space-y-8 shadow-sm rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3 border-l-4 border-gold pl-3 sm:pl-4">
              <Filter className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gold" />
              <h2 className="text-sm sm:text-base md:text-lg font-display text-near-black uppercase">
                Filterable Attributes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Seater Count - Dynamic */}
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block flex items-center gap-2">
                  <Sofa className="w-3.5 h-3.5" /> Seater Options
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSeater}
                    onChange={(e) => {
                      setNewSeater(e.target.value);
                      if (e.target.value.includes(",")) {
                        const seaters = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter((s) => s);
                        seaters.forEach((seater) => {
                          if (
                            seater &&
                            !formData.seaterCount?.includes(seater)
                          ) {
                            setFormData((prev) => ({
                              ...prev,
                              seaterCount: [
                                ...(prev.seaterCount || []),
                                seater,
                              ],
                            }));
                          }
                        });
                        setNewSeater("");
                      }
                    }}
                    placeholder="e.g., 2 Seater, L-Shape, Recliner (separate with commas)"
                    className="flex-1 bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.seaterCount || []).map((seater) => (
                    <span
                      key={seater}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-cream text-gray-700 rounded-full text-xs"
                    >
                      {seater}
                      <button
                        type="button"
                        onClick={() => handleRemoveSeater(seater)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {(formData.seaterCount || []).length === 0 && (
                  <p className="text-[10px] text-gray-400">
                    No seater options added. Add above.
                  </p>
                )}
              </div>

              {/* Colors - Dynamic */}
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5" /> Available Colors
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => {
                      setNewColor(e.target.value);
                      if (e.target.value.includes(",")) {
                        const colors = e.target.value
                          .split(",")
                          .map((c) => c.trim())
                          .filter((c) => c);
                        colors.forEach((color) => {
                          if (color && !formData.colors?.includes(color)) {
                            setFormData((prev) => ({
                              ...prev,
                              colors: [...(prev.colors || []), color],
                            }));
                          }
                        });
                        setNewColor("");
                      }
                    }}
                    placeholder="e.g., Black, Walnut, Navy Blue (separate with commas)"
                    className="flex-1 bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.colors || []).map((color) => (
                    <span
                      key={color}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                      style={{ backgroundColor: "#f5f5f2", color: "#1a1a1a" }}
                    >
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      {color}
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        className="hover:text-red-500 transition-colors ml-1"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
                {(formData.colors || []).length === 0 && (
                  <p className="text-[10px] text-gray-400">
                    No colors added. Add above.
                  </p>
                )}
              </div>

              {/* Tags - Dynamic */}
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" /> Product Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => {
                      setNewTag(e.target.value);
                      if (e.target.value.includes(",")) {
                        const tags = e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter((t) => t);
                        tags.forEach((tag) => {
                          if (tag && !formData.tags?.includes(tag)) {
                            setFormData((prev) => ({
                              ...prev,
                              tags: [...(prev.tags || []), tag],
                            }));
                          }
                        });
                        setNewTag("");
                      }
                    }}
                    placeholder="e.g., New, Best Seller, Limited Edition (separate with commas)"
                    className="flex-1 bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-near-black text-white rounded-full text-xs"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
                {(formData.tags || []).length === 0 && (
                  <p className="text-[10px] text-gray-400">
                    No tags added. Add above.
                  </p>
                )}
              </div>

              {/* Delivery Countries - Dynamic */}
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> Delivery Countries
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCountry}
                    onChange={(e) => {
                      setNewCountry(e.target.value);
                      if (e.target.value.includes(",")) {
                        const countries = e.target.value
                          .split(",")
                          .map((c) => c.trim())
                          .filter((c) => c);
                        countries.forEach((country) => {
                          if (
                            country &&
                            !formData.deliveryCountries?.includes(country)
                          ) {
                            setFormData((prev) => ({
                              ...prev,
                              deliveryCountries: [
                                ...(prev.deliveryCountries || []),
                                country,
                              ],
                            }));
                          }
                        });
                        setNewCountry("");
                      }
                    }}
                    placeholder="e.g., United Kingdom, France, Germany (separate with commas)"
                    className="flex-1 bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.deliveryCountries || []).map((country) => (
                    <span
                      key={country}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-cream text-gray-700 rounded-full text-xs"
                    >
                      {country}
                      <button
                        type="button"
                        onClick={() => handleRemoveCountry(country)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
                {(formData.deliveryCountries || []).length === 0 && (
                  <p className="text-[10px] text-gray-400">
                    No delivery countries added. Add above.
                  </p>
                )}
              </div>

              {/* Material */}
              <div className="space-y-1.5">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" /> Material
                </label>
                <input
                  name="material"
                  value={formData.material || ""}
                  onChange={handleChange}
                  placeholder="e.g., Solid Oak, Velvet, Marble"
                  className="w-full bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                />
              </div>
            </div>
          </section>

          {/* Dimensions & Weight Section */}
          <section className="bg-white border border-warm-beige p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 md:space-y-8 shadow-sm rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3 border-l-4 border-gold pl-3 sm:pl-4">
              <Ruler className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gold" />
              <h2 className="text-sm sm:text-base md:text-lg font-display text-near-black uppercase">
                Dimensions & Weight
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block">
                  Dimensions (L x W x H)
                </label>
                <input
                  name="dimensions"
                  value={formData.dimensions || ""}
                  onChange={handleChange}
                  placeholder="e.g., 180cm x 90cm x 85cm"
                  className="w-full bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block flex items-center gap-2">
                  <Weight className="w-3.5 h-3.5" /> Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight || ""}
                  onChange={handleChange}
                  placeholder="e.g., 25.5"
                  step="0.1"
                  min="0"
                  className="w-full bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                />
              </div>
            </div>
          </section>

          {/* Shipping Section */}
          <section className="bg-white border border-warm-beige p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 md:space-y-8 shadow-sm rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3 border-l-4 border-gold pl-3 sm:pl-4">
              <Truck className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gold" />
              <h2 className="text-sm sm:text-base md:text-lg font-display text-near-black uppercase">
                Shipping & Delivery
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Estimated Delivery
                </label>
                <select
                  name="estimatedDelivery"
                  value={formData.estimatedDelivery || ""}
                  onChange={handleChange}
                  className="w-full bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                >
                  <option value="">Select delivery time</option>
                  <option value="1-3 days">1-3 days (UK Express)</option>
                  <option value="3-5 days">3-5 days (Standard UK)</option>
                  <option value="5-7 days">5-7 days (International)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" /> Warranty (Years)
                </label>
                <input
                  type="number"
                  name="warrantyYears"
                  value={formData.warrantyYears || ""}
                  onChange={handleChange}
                  placeholder="e.g., 2"
                  min="0"
                  className="w-full bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                />
              </div>
            </div>
          </section>

          {/* Visual Assets */}
          <section className="bg-white border border-warm-beige p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 md:space-y-8 shadow-sm rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-gold pl-3 sm:pl-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <ImageIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gold" />
                <h2 className="text-sm sm:text-base md:text-lg font-display text-near-black uppercase">
                  Visual Assets
                </h2>
              </div>
              <div className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {imageCount} / 5 Images
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="p-2.5 sm:p-3 bg-mint-50 border border-mint-200 text-[9px] sm:text-[10px] text-mint-700 rounded">
                <strong>Tip:</strong> Select multiple images at once (Ctrl+Click
                or Shift+Click). First image will be the main product image. Max
                5 images, each under 500KB.
              </div>

              {imageCount < 5 && (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      e.target.files &&
                      handleMultipleFilesUpload(e.target.files)
                    }
                    className="hidden"
                    id="multi-file-upload"
                    disabled={uploadingImages}
                  />
                  <label
                    htmlFor="multi-file-upload"
                    className={`w-full border-2 border-dashed border-warm-beige py-6 sm:py-7 md:py-8 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:border-gold hover:text-gold transition-all flex flex-col items-center justify-center gap-2 sm:gap-3 cursor-pointer rounded-lg ${uploadingImages ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Upload className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                    <span>
                      {uploadingImages
                        ? "Uploading Images..."
                        : "Click or Drag & Drop Multiple Images"}
                    </span>
                    <span className="text-[7px] sm:text-[8px] text-gray-300">
                      (Max 5 images, 500KB each)
                    </span>
                  </label>
                </div>
              )}

              {uploadingImages && uploadProgress > 0 && (
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="w-full h-1 bg-warm-beige rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[7px] sm:text-[8px] text-gray-400 text-center">
                    Processing images... {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}

              {(formData.images || []).length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {(formData.images || []).map(
                    (img, idx) =>
                      img &&
                      img.trim() !== "" && (
                        <div key={idx} className="relative group">
                          <div className="aspect-square bg-cream border border-warm-beige overflow-hidden rounded">
                            <img
                              src={img}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-near-black/70 text-white text-[7px] sm:text-[8px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                            #{idx + 1}
                          </div>
                          <div className="absolute inset-0 bg-near-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 sm:gap-2">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => reorderImages(idx, idx - 1)}
                                className="p-1.5 sm:p-2 bg-white text-near-black hover:bg-gold transition-colors rounded-full"
                                title="Move Left"
                              >
                                ←
                              </button>
                            )}
                            {idx < imageCount - 1 && (
                              <button
                                type="button"
                                onClick={() => reorderImages(idx, idx + 1)}
                                className="p-1.5 sm:p-2 bg-white text-near-black hover:bg-gold transition-colors rounded-full"
                                title="Move Right"
                              >
                                →
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="p-1.5 sm:p-2 bg-red-500 text-white hover:bg-red-600 transition-colors rounded-full"
                              title="Remove Image"
                            >
                              <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                          </div>
                          {idx === 0 && (
                            <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-gold text-near-black text-[6px] sm:text-[7px] md:text-[8px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                              Main
                            </div>
                          )}
                        </div>
                      ),
                  )}
                </div>
              )}

              {imageCount > 1 && (
                <div className="text-center text-[7px] sm:text-[8px] text-gray-400">
                  Hover over images to reorder or delete. First image is the
                  main product image.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Commercial Intel Sidebar */}
        <aside className="lg:w-80 xl:w-96 space-y-5 sm:space-y-6 md:space-y-8">
          <div className="bg-near-black text-white p-5 sm:p-6 md:p-7 lg:p-8 xl:p-10 space-y-5 sm:space-y-6 md:space-y-8 sticky top-20 md:top-32 lg:top-44 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3 border-l-4 border-gold pl-3 sm:pl-4">
              <Tag className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gold" />
              <h2 className="text-sm sm:text-base md:text-lg font-display uppercase">
                Commercial Intel
              </h2>
            </div>

            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="space-y-1">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Inventory Stock *
                </label>
                <input
                  required
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 py-3 sm:py-3.5 md:py-4 px-4 sm:px-5 md:px-6 text-base sm:text-lg md:text-xl font-display outline-none focus:border-gold rounded"
                  min="0"
                />
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 border border-white/10 rounded">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Feature Highlight
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      featured: !prev.featured,
                    }))
                  }
                  className={`w-10 sm:w-11 md:w-12 h-5 sm:h-5.5 md:h-6 rounded-full p-1 transition-colors duration-300 ${formData.featured ? "bg-gold" : "bg-gray-600"}`}
                >
                  <div
                    className={`w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-white rounded-full transition-transform duration-300 ${formData.featured ? "translate-x-5 sm:translate-x-5.5 md:translate-x-6" : "translate-x-0"}`}
                  />
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold text-near-black py-3.5 sm:py-4 md:py-5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 rounded"
              >
                <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {isSubmitting
                  ? "Authenticating..."
                  : isEdit
                    ? "Archive Changes"
                    : "Publish Entry"}
              </button>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
