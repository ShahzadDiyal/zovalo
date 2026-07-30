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
  ChevronRight,
  Upload,
  Trash2,
  Palette,
  Sofa,
  DollarSign,
  Filter,
  List,
  ListOrdered,
  HelpCircle,
  Code,
  Type,
} from "lucide-react";
import { Product, Category } from "../../../../types";
import { productApi } from "../../../../services/productApi";
import { categoryApi } from "../../../../services/categoryApi";
import { LoadingSpinner } from "../../../../components/ui/Loading";
import { useRouter } from "next/navigation";

interface SeaterPrice {
  seater: string;
  price: number;
  compareAtPrice?: number;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function AdminProductForm() {
  const params = useParams();
  const productId = params.productId;
  const router = useRouter();
  const isEdit = !!productId;

  const [loading, setLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuresText, setFeaturesText] = useState("");
  const [descriptionMode, setDescriptionMode] = useState<"text" | "html">(
    "text",
  );

  const [newSeater, setNewSeater] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");

  const [formData, setFormData] = useState<Partial<Product>>({
    title: "",
    slug: "",
    description: "",
    price: 0,
    compareAtPrice: 0,
    category: "",
    images: [],
    imageAltTexts: [],
    stock: 0,
    seaterCount: [],
    seaterPrices: [],
    colors: [],
    tags: [],
    features: [],
    featuresStyle: "bullet",
    faqs: [],
    featured: false,
    enableColorSelection: false,
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
          if (!product.seaterPrices && product.seaterCount?.length) {
            product.seaterPrices = product.seaterCount.map((seater) => ({
              seater,
              price: product.price || 0,
              compareAtPrice: product.compareAtPrice || 0,
            }));
          }
          setFormData(product);
          if (product.features && product.features.length > 0) {
            setFeaturesText(product.features.join("\n"));
          }
        } else {
          alert("Product not found");
          router.push("/admin/products");
        }
        setLoading(false);
      }
    }
    fetchData();
  }, [productId, isEdit, router]);

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

  const handleFeaturesTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const text = e.target.value;
    setFeaturesText(text);
    const features = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    setFormData((prev) => ({ ...prev, features }));
  };

  const toggleFeaturesStyle = () => {
    setFormData((prev) => ({
      ...prev,
      featuresStyle: prev.featuresStyle === "bullet" ? "number" : "bullet",
    }));
  };

  const toggleDescriptionMode = () => {
    setDescriptionMode((prev) => (prev === "text" ? "html" : "text"));
  };

  const handleAddSeater = () => {
    if (newSeater.trim() && !formData.seaterCount?.includes(newSeater.trim())) {
      const seater = newSeater.trim();
      setFormData((prev) => ({
        ...prev,
        seaterCount: [...(prev.seaterCount || []), seater],
        seaterPrices: [
          ...(prev.seaterPrices || []),
          {
            seater,
            price: prev.price || 0,
            compareAtPrice: prev.compareAtPrice || 0,
          },
        ],
      }));
      setNewSeater("");
    }
  };

  const handleRemoveSeater = (seater: string) => {
    setFormData((prev) => ({
      ...prev,
      seaterCount: (prev.seaterCount || []).filter((s) => s !== seater),
      seaterPrices: (prev.seaterPrices || []).filter(
        (sp) => sp.seater !== seater,
      ),
    }));
  };

  const handleSeaterPriceChange = (
    seater: string,
    field: "price" | "compareAtPrice",
    value: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      seaterPrices: (prev.seaterPrices || []).map((sp) =>
        sp.seater === seater ? { ...sp, [field]: value } : sp,
      ),
    }));
  };

  const handleAddColor = () => {
    if (newColor.trim()) {
      // Split by comma and trim each color
      const colors = newColor
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
      const existingColors = formData.colors || [];
      const newColors = colors.filter(
        (color) => !existingColors.includes(color),
      );

      if (newColors.length > 0) {
        setFormData((prev) => ({
          ...prev,
          colors: [...(prev.colors || []), ...newColors],
        }));
      }
      setNewColor("");
    }
  };

  const handleRemoveColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: (prev.colors || []).filter((c) => c !== color),
    }));
  };

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

  const handleAddFaq = () => {
    if (newFaqQuestion.trim() && newFaqAnswer.trim()) {
      setFormData((prev) => ({
        ...prev,
        faqs: [
          ...(prev.faqs || []),
          { question: newFaqQuestion.trim(), answer: newFaqAnswer.trim() },
        ],
      }));
      setNewFaqQuestion("");
      setNewFaqAnswer("");
    }
  };

  const handleRemoveFaq = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, i) => i !== index),
    }));
  };

  const compressImage = (
    file: File,
    maxWidth: number = 1600,
    quality: number = 0.92,
  ): Promise<File> => {
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

          // Only resize if image is larger than maxWidth
          const maxDimension = 1600;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height * maxDimension) / width;
              width = maxDimension;
            } else {
              width = (width * maxDimension) / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          // Use high-quality image rendering - FIXED: check ctx first
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);
          }

          // Determine best format based on original file type
          let mimeType = file.type;
          let outputQuality = quality;

          // If it's a PNG with transparency, keep as PNG
          if (file.type === "image/png") {
            mimeType = "image/png";
            canvas.toBlob((blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/png",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error("Failed to compress image"));
              }
            }, "image/png");
            return;
          }

          // For JPEG, use high quality (0.92)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                if (blob.size <= 5 * 1024 * 1024) {
                  const compressedFile = new File(
                    [blob],
                    file.name.replace(/\.[^/.]+$/, ".jpg"),
                    {
                      type: "image/jpeg",
                      lastModified: Date.now(),
                    },
                  );
                  resolve(compressedFile);
                } else {
                  // If still too large, try reducing quality slightly
                  const qualityLevels = [0.85, 0.8, 0.7];
                  let compressed = false;

                  for (const q of qualityLevels) {
                    canvas.toBlob(
                      (retryBlob) => {
                        if (retryBlob && retryBlob.size <= 5 * 1024 * 1024) {
                          const finalFile = new File(
                            [retryBlob],
                            file.name.replace(/\.[^/.]+$/, ".jpg"),
                            {
                              type: "image/jpeg",
                              lastModified: Date.now(),
                            },
                          );
                          resolve(finalFile);
                          compressed = true;
                        }
                      },
                      "image/jpeg",
                      q,
                    );
                    if (compressed) break;
                  }

                  // If still not compressed, resolve with best effort
                  if (!compressed) {
                    canvas.toBlob(
                      (finalBlob) => {
                        if (finalBlob) {
                          const finalFile = new File(
                            [finalBlob],
                            file.name.replace(/\.[^/.]+$/, ".jpg"),
                            {
                              type: "image/jpeg",
                              lastModified: Date.now(),
                            },
                          );
                          resolve(finalFile);
                        } else {
                          reject(new Error("Failed to compress image"));
                        }
                      },
                      "image/jpeg",
                      0.7,
                    );
                  }
                }
              } else {
                reject(new Error("Failed to compress image"));
              }
            },
            "image/jpeg",
            outputQuality,
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
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

    // Check file sizes before processing
    const oversizedFiles = filesArray.filter(
      (file) => file.size > 5 * 1024 * 1024,
    );
    if (oversizedFiles.length > 0) {
      const names = oversizedFiles.map((f) => f.name).join(", ");
      alert(
        `The following image(s) are larger than 5MB: ${names}. Please compress them first or use smaller images.`,
      );
      return;
    }

    setUploadingImages(true);
    setUploadProgress(0);

    const newImages: string[] = [];
    const newImageAltTexts: string[] = [];
    let processed = 0;

    for (const file of filesArray) {
      try {
        if (!file.type.startsWith("image/")) {
          alert(`${file.name} is not an image file. Skipping.`);
          continue;
        }

        // Compress the image with high quality preservation
        const compressedFile = await compressImage(file, 1600, 0.92);

        // Convert to base64
        const base64String = await convertToBase64(compressedFile);
        newImages.push(base64String);

        // Use filename without extension as default alt text
        const altText = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ");
        newImageAltTexts.push(altText);

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
        imageAltTexts: [...(prev.imageAltTexts || []), ...newImageAltTexts],
      }));
    }

    setUploadingImages(false);
    setUploadProgress(0);
  };

  // Also update the handleSubmit validation:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validImages = (formData.images || []).filter(
      (img) => img && img.trim() !== "",
    );
    if (validImages.length === 0) {
      alert("Please add at least one product image");
      return;
    }

    // Allow up to 5MB per image * 5 images = 25MB total
    const totalSize = validImages.reduce(
      (sum, img) => sum + (img.length || 0),
      0,
    );
    if (totalSize > 25 * 1024 * 1024) {
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
        imageAltTexts: formData.imageAltTexts || [],
        colors: formData.colors || [],
        price:
          formData.seaterPrices && formData.seaterPrices.length > 0
            ? Math.min(...formData.seaterPrices.map((sp) => sp.price))
            : formData.price,
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

  const removeImage = (index: number) => {
    const newImages = (formData.images || []).filter((_, i) => i !== index);
    const newAltTexts = (formData.imageAltTexts || []).filter(
      (_, i) => i !== index,
    );
    setFormData((prev) => ({
      ...prev,
      images: newImages,
      imageAltTexts: newAltTexts,
    }));
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...(formData.images || [])];
    const newAltTexts = [...(formData.imageAltTexts || [])];
    const [movedImage] = newImages.splice(fromIndex, 1);
    const [movedAlt] = newAltTexts.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    newAltTexts.splice(toIndex, 0, movedAlt);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
      imageAltTexts: newAltTexts,
    }));
  };

  const handleAltTextChange = (index: number, value: string) => {
    const newAltTexts = [...(formData.imageAltTexts || [])];
    newAltTexts[index] = value;
    setFormData((prev) => ({ ...prev, imageAltTexts: newAltTexts }));
  };

  //  const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const validImages = (formData.images || []).filter((img) => img && img.trim() !== "");
  //   if (validImages.length === 0) {
  //     alert("Please add at least one product image");
  //     return;
  //   }

  //   // Increase max total size to accommodate high-quality images
  //   const totalSize = validImages.reduce((sum, img) => sum + (img.length || 0), 0);
  //   // Allow up to 5MB per image * 5 images = 25MB total
  //   if (totalSize > 25 * 1024 * 1024) {
  //     alert("Total image size is too large. Please use smaller images or reduce number of images.");
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     const productData = {
  //       ...formData,
  //       images: validImages,
  //       imageAltTexts: formData.imageAltTexts || [],
  //       colors: formData.colors || [],
  //       price:
  //         formData.seaterPrices && formData.seaterPrices.length > 0
  //           ? Math.min(...formData.seaterPrices.map((sp) => sp.price))
  //           : formData.price,
  //     };
  //     if (isEdit && productId) {
  //       await productApi.update(productId as string, productData);
  //     } else {
  //       await productApi.create(productData as Omit<Product, "id">);
  //     }
  //     router.push("/admin/products");
  //   } catch (error) {
  //     console.error("Error saving product:", error);
  //     alert("Failed to save product");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

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

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-5 lg:px-0 space-y-5 sm:space-y-6 md:space-y-8 lg:space-y-12">
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
              {isEdit ? "Edit Product" : "Create New Product"}
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

      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 xl:gap-12"
      >
        <div className="flex-1 space-y-5 sm:space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12">
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
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="description"
                    className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block"
                  >
                    Physical Narrative *
                  </label>
                  <button
                    type="button"
                    onClick={toggleDescriptionMode}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider bg-cream hover:bg-warm-beige transition-colors rounded"
                  >
                    {descriptionMode === "text" ? (
                      <>
                        <Code className="w-3 h-3" />
                        Switch to HTML
                      </>
                    ) : (
                      <>
                        <Type className="w-3 h-3" />
                        Switch to Text
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  {descriptionMode === "text" ? (
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
                  ) : (
                    <textarea
                      id="description"
                      required
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={8}
                      className="w-full bg-cream border border-warm-beige py-2.5 sm:py-3 md:py-4 px-4 sm:px-5 md:px-6 text-xs sm:text-sm font-mono leading-relaxed focus:border-gold outline-none resize-none transition-colors rounded"
                      placeholder="<p>Enter HTML description here...</p><ul><li>Feature 1</li><li>Feature 2</li></ul>"
                    />
                  )}
                  {descriptionMode === "html" && (
                    <div className="absolute bottom-2 right-3 text-[7px] text-amber-600 font-mono">
                      HTML mode
                    </div>
                  )}
                </div>
                {descriptionMode === "html" && (
                  <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-[8px] sm:text-[9px] text-amber-700">
                    <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    <span>
                      HTML mode: Enter your HTML code directly. This will be
                      rendered as-is on the product page.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white border border-warm-beige p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 md:space-y-8 shadow-sm rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3 border-l-4 border-gold pl-3 sm:pl-4">
              <Sofa className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gold" />
              <h2 className="text-sm sm:text-base md:text-lg font-display text-near-black uppercase">
                Seater Options & Pricing
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 items-end">
                <div className="flex-1 min-w-[150px]">
                  <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1">
                    Seater Option
                  </label>
                  <input
                    type="text"
                    value={newSeater}
                    onChange={(e) => setNewSeater(e.target.value)}
                    placeholder="e.g., 2 Seater, 3 Seater"
                    className="w-full bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSeater}
                  className="bg-gold text-near-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition rounded"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" /> Add Seater
                </button>
              </div>

              {(formData.seaterCount || []).length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[400px]">
                    <thead>
                      <tr className="border-b border-warm-beige">
                        <th className="text-left py-2 text-[10px] font-bold uppercase text-gray-400">
                          Seater
                        </th>
                        <th className="text-left py-2 text-[10px] font-bold uppercase text-gray-400">
                          Price (GBP)
                        </th>
                        <th className="text-left py-2 text-[10px] font-bold uppercase text-gray-400">
                          Compare at Price (Optional)
                        </th>
                        <th className="text-center py-2 text-[10px] font-bold uppercase text-gray-400">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(formData.seaterCount || []).map((seater, idx) => {
                        const seaterPrice = formData.seaterPrices?.find(
                          (sp) => sp.seater === seater,
                        );
                        return (
                          <tr key={idx} className="border-b border-warm-beige">
                            <td className="py-2 text-sm font-medium">
                              {seater}
                            </td>
                            <td className="py-2">
                              <div className="relative w-32">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gold font-bold text-xs">
                                  £
                                </span>
                                <input
                                  type="number"
                                  value={seaterPrice?.price || 0}
                                  onChange={(e) =>
                                    handleSeaterPriceChange(
                                      seater,
                                      "price",
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                  className="w-full bg-cream border border-warm-beige py-1.5 pl-6 pr-2 text-sm focus:border-gold outline-none rounded"
                                  step="0.01"
                                  min="0"
                                />
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="relative w-32">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                                  £
                                </span>
                                <input
                                  type="number"
                                  value={seaterPrice?.compareAtPrice || 0}
                                  onChange={(e) =>
                                    handleSeaterPriceChange(
                                      seater,
                                      "compareAtPrice",
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                  className="w-full bg-cream border border-warm-beige py-1.5 pl-6 pr-2 text-sm focus:border-gold outline-none rounded"
                                  step="0.01"
                                  min="0"
                                />
                              </div>
                            </td>
                            <td className="py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveSeater(seater)}
                                className="text-red-500 hover:text-red-700 transition"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {(formData.seaterCount || []).length === 0 && (
                <p className="text-[10px] text-gray-400 text-center py-4">
                  No seater options added. Add seaters above with their
                  respective prices.
                </p>
              )}
            </div>
          </section>

          <section className="bg-white border border-warm-beige p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 md:space-y-8 shadow-sm rounded-lg">
            <div className="flex items-center justify-between border-l-4 border-gold pl-3 sm:pl-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <List className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gold" />
                <h2 className="text-sm sm:text-base md:text-lg font-display text-near-black uppercase">
                  Features
                </h2>
              </div>
              <button
                type="button"
                onClick={toggleFeaturesStyle}
                className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gold transition-colors"
              >
                {formData.featuresStyle === "bullet" ? (
                  <>
                    <ListOrdered className="w-3.5 h-3.5" /> Switch to Numbered
                  </>
                ) : (
                  <>
                    <List className="w-3.5 h-3.5" /> Switch to Bullet
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1.5">
                  Features List (one per line)
                </label>
                <div className="space-y-2">
                  <textarea
                    value={featuresText}
                    onChange={handleFeaturesTextChange}
                    rows={6}
                    className="w-full bg-cream border border-warm-beige py-2.5 sm:py-3 px-4 text-sm leading-relaxed focus:border-gold outline-none resize-y transition-colors rounded"
                    placeholder="Solid oak construction&#10;Hand-finished walnut veneer&#10;Durable scratch-resistant surface&#10;Available in 5 colors&#10;2-year warranty"
                  />
                  <p className="text-[8px] sm:text-[9px] text-gray-400 italic">
                    Enter each feature on a new line. They will be displayed as
                    a{" "}
                    {formData.featuresStyle === "bullet"
                      ? "bullet"
                      : "numbered"}{" "}
                    list on the frontend.
                  </p>
                </div>
              </div>

              {(formData.features || []).length > 0 && (
                <div className="bg-cream p-3 sm:p-4 rounded border border-warm-beige">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Preview ({formData.features?.length || 0} features)
                    </span>
                  </div>
                  <ul
                    className={`space-y-1.5 ${
                      formData.featuresStyle === "bullet"
                        ? "list-disc list-inside"
                        : "list-decimal list-inside"
                    }`}
                  >
                    {(formData.features || []).map((feature, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(formData.features || []).length === 0 && (
                <p className="text-[10px] text-gray-400 text-center py-2">
                  No features added. Enter features above, one per line.
                </p>
              )}
            </div>
          </section>

          <section className="bg-white border border-warm-beige p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 md:space-y-8 shadow-sm rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3 border-l-4 border-gold pl-3 sm:pl-4">
              <HelpCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gold" />
              <h2 className="text-sm sm:text-base md:text-lg font-display text-near-black uppercase">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block mb-1.5">
                  FAQs (Question: Answer format)
                </label>
                <div className="space-y-2">
                  <textarea
                    rows={8}
                    className="w-full bg-cream border border-warm-beige py-2.5 sm:py-3 px-4 text-sm leading-relaxed focus:border-gold outline-none resize-y transition-colors rounded"
                    placeholder="Question: Are the colored accent scatter cushions included?&#10;Answer: Yes! The complete set comes with all shown scatter cushions.&#10;Question: Is the linen-blend upholstery easy to clean?&#10;Answer: Yes, the woven linen blend is treated for stain resistance."
                    onChange={(e) => {
                      const text = e.target.value;
                      const lines = text
                        .split("\n")
                        .filter((line) => line.trim());

                      const newFaqs: Array<{
                        question: string;
                        answer: string;
                      }> = [];

                      let currentQuestion = "";
                      let currentAnswer = "";

                      for (const line of lines) {
                        const trimmedLine = line.trim();

                        if (trimmedLine.toLowerCase().startsWith("question:")) {
                          if (currentQuestion && currentAnswer) {
                            newFaqs.push({
                              question: currentQuestion,
                              answer: currentAnswer,
                            });
                            currentAnswer = "";
                          }
                          currentQuestion = trimmedLine.substring(9).trim();
                        } else if (
                          trimmedLine.toLowerCase().startsWith("answer:")
                        ) {
                          currentAnswer = trimmedLine.substring(7).trim();
                          if (currentQuestion && currentAnswer) {
                            newFaqs.push({
                              question: currentQuestion,
                              answer: currentAnswer,
                            });
                            currentQuestion = "";
                            currentAnswer = "";
                          }
                        }
                      }

                      if (currentQuestion && currentAnswer) {
                        newFaqs.push({
                          question: currentQuestion,
                          answer: currentAnswer,
                        });
                      }

                      if (newFaqs.length > 0) {
                        setFormData((prev) => ({
                          ...prev,
                          faqs: [...(prev.faqs || []), ...newFaqs],
                        }));
                        e.target.value = "";
                      }
                    }}
                  />
                  <p className="text-[8px] sm:text-[9px] text-gray-400 italic">
                    Enter each FAQ using format: <strong>Question: ...</strong>{" "}
                    and <strong>Answer: ...</strong> (one per line)
                  </p>
                </div>
              </div>

              {(formData.faqs || []).length > 0 && (
                <div className="bg-cream p-3 sm:p-4 rounded border border-warm-beige">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Preview ({formData.faqs?.length || 0} FAQs)
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {(formData.faqs || []).map((faq, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 group border-b border-warm-beige pb-3 last:border-0 last:pb-0"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-near-black">
                            {faq.question}
                          </p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {faq.answer}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(index)}
                          className="text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(formData.faqs || []).length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-warm-beige rounded-lg">
                  <HelpCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-[10px] text-gray-400">
                    No FAQs added. Enter FAQs above using format:{" "}
                    <strong>Question: ...</strong> and{" "}
                    <strong>Answer: ...</strong>
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Updated Filterable Attributes section with Color Input */}
          <section className="bg-white border border-warm-beige p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 md:space-y-8 shadow-sm rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3 border-l-4 border-gold pl-3 sm:pl-4">
              <Filter className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gold" />
              <h2 className="text-sm sm:text-base md:text-lg font-display text-near-black uppercase">
                Filterable Attributes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Color Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 sm:p-4 bg-cream/30 border border-warm-beige rounded">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-600">
                    Enable Color Selection
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        enableColorSelection: !prev.enableColorSelection,
                      }))
                    }
                    className={`w-10 sm:w-11 md:w-12 h-5 sm:h-5.5 md:h-6 rounded-full p-1 transition-colors duration-300 ${
                      formData.enableColorSelection ? "bg-gold" : "bg-gray-400"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-white rounded-full transition-transform duration-300 ${
                        formData.enableColorSelection
                          ? "translate-x-5 sm:translate-x-5.5 md:translate-x-6"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-walnut block flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5" /> Available Colors
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddColor();
                        }
                      }}
                      placeholder="e.g., Black, Walnut, Navy Blue (comma separated)"
                      className="flex-1 bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="bg-gold text-near-black px-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition rounded whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5 inline" />
                    </button>
                  </div>
                  <p className="text-[8px] text-gray-400 italic">
                    Add multiple colors at once separated by commas
                  </p>

                  {/* Display added colors with color preview */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(formData.colors || []).map((color) => (
                      <span
                        key={color}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border border-gray-200"
                        style={{ backgroundColor: "#f5f5f2", color: "#1a1a1a" }}
                      >
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-gray-300 flex-shrink-0"
                          style={{ backgroundColor: color.toLowerCase() }}
                        />
                        {color}
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(color)}
                          className="hover:text-red-500 transition-colors ml-0.5"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {(formData.colors || []).length === 0 && (
                    <p className="text-[10px] text-gray-400">
                      No colors added. Add colors above.
                    </p>
                  )}

                  {formData.enableColorSelection &&
                    (formData.colors || []).length === 0 && (
                      <p className="text-[9px] text-amber-600">
                        ⚠️ Color selection is enabled but no colors are added.
                        Please add colors above.
                      </p>
                    )}
                </div>
              </div>

              {/* Tags Section */}
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
                    placeholder="e.g., New, Best Seller, Limited Edition (comma separated)"
                    className="flex-1 bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-gold text-near-black px-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-near-black hover:text-white transition rounded whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5 inline" />
                  </button>
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
            </div>
          </section>

          <section className="bg-white border border-warm-beige p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 md:space-y-8 shadow-sm rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-gold pl-3 sm:pl-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <ImageIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gold" />
                <h2 className="text-sm sm:text-base md:text-lg font-display text-near-black uppercase">
                  Images & SEO
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
                    className={`w-full border-2 border-dashed border-warm-beige py-6 sm:py-7 md:py-8 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:border-gold hover:text-gold transition-all flex flex-col items-center justify-center gap-2 sm:gap-3 cursor-pointer rounded-lg ${
                      uploadingImages ? "opacity-50 cursor-not-allowed" : ""
                    }`}
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
                              alt={
                                formData.imageAltTexts?.[idx] ||
                                `Product image ${idx + 1}`
                              }
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
                          {/* Alt Text Input */}
                          <div className="mt-1.5">
                            <input
                              type="text"
                              value={formData.imageAltTexts?.[idx] || ""}
                              onChange={(e) =>
                                handleAltTextChange(idx, e.target.value)
                              }
                              placeholder="Alt text for SEO"
                              className="w-full bg-cream border border-warm-beige py-1 px-2 text-[8px] sm:text-[9px] focus:border-gold outline-none transition-colors rounded"
                            />
                          </div>
                        </div>
                      ),
                  )}
                </div>
              )}

              {imageCount > 1 && (
                <div className="text-center text-[7px] sm:text-[8px] text-gray-400">
                  Hover over images to reorder or delete. First image is the
                  main product image. Add alt text for better SEO.
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="lg:w-80 xl:w-96 space-y-5 sm:space-y-6 md:space-y-8">
          <div className="bg-near-black text-white p-5 sm:p-6 md:p-7 lg:p-8 xl:p-10 space-y-5 sm:space-y-6 md:space-y-8 sticky top-20 md:top-32 lg:top-44 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3 border-l-4 border-gold pl-3 sm:pl-4">
              <DollarSign className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gold" />
              <h2 className="text-sm sm:text-base md:text-lg font-display uppercase">
                Total Stock
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
                  className={`w-10 sm:w-11 md:w-12 h-5 sm:h-5.5 md:h-6 rounded-full p-1 transition-colors duration-300 ${
                    formData.featured ? "bg-gold" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-white rounded-full transition-transform duration-300 ${
                      formData.featured
                        ? "translate-x-5 sm:translate-x-5.5 md:translate-x-6"
                        : "translate-x-0"
                    }`}
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
                    ? "Update Changes"
                    : "Publish Entry"}
              </button>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
