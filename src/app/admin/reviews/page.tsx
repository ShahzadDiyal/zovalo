"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Star,
  MessageCircle,
  ThumbsUp,
  Camera,
  Globe,
  BadgeCheck,
  ImageIcon,
} from "lucide-react";
import { Review, Product } from "../../../types/index";
import { reviewApi } from "../../../services/reviewApi";
import { productApi } from "../../../services/productApi";
import { Skeleton } from "../../../components/ui/Loading";

const SOURCE_META: Record<
  Review["source"],
  { label: string; icon: React.ElementType; color: string }
> = {
  whatsapp: { label: "WhatsApp", icon: MessageCircle, color: "text-[#25d366]" },
  facebook: { label: "Facebook", icon: ThumbsUp, color: "text-[#1877f2]" },
  instagram: { label: "Instagram", icon: Camera, color: "text-[#E1306C]" },
  google: { label: "Google", icon: Globe, color: "text-[#4285F4]" },
  website: { label: "Website", icon: Globe, color: "text-walnut" },
};

const emptyReview: Partial<Review> = {
  productId: "",
  customerName: "",
  rating: 5,
  title: "",
  comment: "",
  source: "whatsapp",
  verifiedPurchase: true,
  status: "published",
  reviewDate: new Date().toISOString().slice(0, 10),
};

function StarRow({
  value,
  onChange,
  size = "w-5 h-5",
}: {
  value: number;
  onChange?: (n: number) => void;
  size?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className={`${size} ${
              n <= value ? "fill-gold text-gold" : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState<Partial<Review> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "published">("all");
  const [productFilter, setProductFilter] = useState<string>("all");

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reviewResult, productResult] = await Promise.allSettled([
        reviewApi.getAllReviews(),
        productApi.getAll(),
      ]);

      if (reviewResult.status === "fulfilled") {
        setReviews(reviewResult.value);
      } else {
        console.error("Error fetching reviews:", reviewResult.reason);
      }

      if (productResult.status === "fulfilled") {
        setProducts(productResult.value);
      } else {
        console.error("Error fetching products:", productResult.reason);
      }
    } finally {
      setLoading(false);
    }
  };

  const productMap = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  );

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    const base64 = await convertToBase64(file);
    setCurrent((prev) => ({ ...prev, customerImage: base64 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current?.productId || !current?.customerName || !current?.comment) {
      alert("Please fill in product, customer name and the review text.");
      return;
    }
    setIsSubmitting(true);
    try {
      const product = productMap.get(current.productId);
      const payload = {
        ...current,
        productTitle: product?.title || current.productTitle || "",
      } as Omit<Review, "id">;

      if (current.id) {
        await reviewApi.updateReview(current.id, payload);
      } else {
        await reviewApi.createReview(payload);
      }
      setIsModalOpen(false);
      setCurrent(null);
      await fetchData();
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Failed to save review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this review? This will also update the product's rating."))
      return;
    try {
      await reviewApi.deleteReview(id);
      await fetchData();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    }
  };

  const toggleStatus = async (review: Review) => {
    try {
      await reviewApi.updateReview(review.id, {
        status: review.status === "published" ? "pending" : "published",
      });
      await fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleEdit = (review: Review) => {
    setCurrent(review);
    setIsModalOpen(true);
  };

  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.productTitle || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesProduct = productFilter === "all" || r.productId === productFilter;
    return matchesSearch && matchesStatus && matchesProduct;
  });

  return (
    <div className="space-y-5 sm:space-y-6 md:space-y-8 px-3 sm:px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 md:gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display text-near-black uppercase tracking-tight">
            Customer Reviews
          </h1>
          <p className="text-gray-400 text-[11px] sm:text-xs md:text-sm mt-1">
            Add reviews your customers send over WhatsApp or Facebook. Published
            reviews appear on the product page and in Google's rich results.
          </p>
        </div>
        <button
          onClick={() => {
            setCurrent(emptyReview);
            setIsModalOpen(true);
          }}
          className="bg-near-black text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gold transition-all duration-300 w-full sm:w-auto justify-center rounded"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Add Review
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-warm-beige p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center rounded-lg">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer, product or text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream border border-warm-beige py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 sm:pr-4 text-sm focus:ring-1 focus:ring-gold outline-none rounded"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="w-full sm:w-auto bg-cream border border-warm-beige py-2 sm:py-2.5 px-3 text-sm rounded outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="pending">Pending</option>
        </select>
        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="w-full sm:w-auto bg-cream border border-warm-beige py-2 sm:py-2.5 px-3 text-sm rounded outline-none"
        >
          <option value="all">All Products</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 sm:py-16 md:py-20 border border-dashed border-warm-beige rounded-lg">
          <Star className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-400 text-xs sm:text-sm">
            No reviews yet. Add the first one your customer sent on WhatsApp!
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filtered.map((review) => {
            const Source = SOURCE_META[review.source] ?? SOURCE_META.website;
            const SourceIcon = Source.icon;
            return (
              <div
                key={review.id}
                className="bg-white border border-warm-beige p-4 sm:p-5 rounded-lg flex flex-col sm:flex-row gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-cream flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {review.customerImage ? (
                    <img
                      src={review.customerImage}
                      alt={review.customerName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-walnut font-bold text-sm">
                      {review.customerName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-near-black text-sm">
                      {review.customerName}
                    </span>
                    {review.verifiedPurchase && (
                      <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        <BadgeCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                    <span
                      className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest ${Source.color}`}
                    >
                      <SourceIcon className="w-3 h-3" /> {Source.label}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        review.status === "published"
                          ? "bg-gold/20 text-walnut"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>
                  <StarRow value={review.rating} size="w-3.5 h-3.5" />
                  <p className="text-[10px] text-walnut font-bold uppercase tracking-widest mt-1 truncate">
                    {review.productTitle || productMap.get(review.productId)?.title}
                  </p>
                  {review.title && (
                    <p className="text-sm font-semibold text-near-black mt-1">
                      {review.title}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                    {review.comment}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-2">
                    {new Date(review.reviewDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex sm:flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleStatus(review)}
                    className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-warm-beige rounded hover:bg-cream transition-colors"
                  >
                    {review.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => handleEdit(review)}
                    className="p-2 bg-white border border-warm-beige text-near-black hover:bg-gold transition-colors rounded flex items-center justify-center"
                    aria-label="Edit review"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 bg-near-black text-white hover:bg-red-500 transition-colors rounded flex items-center justify-center"
                    aria-label="Delete review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && current && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-3 sm:px-4">
          <div
            className="absolute inset-0 bg-near-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="bg-white w-full max-w-lg relative z-10 shadow-2xl border border-warm-beige p-5 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-lg">
            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-near-black transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-5 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-display text-near-black uppercase tracking-tight">
                {current.id ? "Edit Review" : "Add Customer Review"}
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                Transcribe what the customer sent you on WhatsApp / Facebook.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">
                  Product *
                </label>
                <select
                  required
                  value={current.productId}
                  onChange={(e) =>
                    setCurrent((prev) => ({ ...prev, productId: e.target.value }))
                  }
                  className="w-full bg-cream border border-warm-beige py-2.5 px-3 text-sm rounded outline-none focus:border-gold"
                >
                  <option value="">-- Select product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">
                    Customer Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={current.customerName || ""}
                    onChange={(e) =>
                      setCurrent((prev) => ({ ...prev, customerName: e.target.value }))
                    }
                    placeholder="e.g. Sarah M."
                    className="w-full bg-cream border border-warm-beige py-2.5 px-3 text-sm rounded outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">
                    Where it came from *
                  </label>
                  <select
                    value={current.source}
                    onChange={(e) =>
                      setCurrent((prev) => ({
                        ...prev,
                        source: e.target.value as Review["source"],
                      }))
                    }
                    className="w-full bg-cream border border-warm-beige py-2.5 px-3 text-sm rounded outline-none focus:border-gold"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="google">Google</option>
                    <option value="website">Website</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">
                  Rating *
                </label>
                <StarRow
                  value={current.rating || 5}
                  onChange={(n) => setCurrent((prev) => ({ ...prev, rating: n }))}
                  size="w-6 h-6"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">
                  Headline (optional)
                </label>
                <input
                  type="text"
                  value={current.title || ""}
                  onChange={(e) =>
                    setCurrent((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g. Beautiful quality, fast delivery!"
                  className="w-full bg-cream border border-warm-beige py-2.5 px-3 text-sm rounded outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">
                  Review Text *
                </label>
                <textarea
                  required
                  rows={4}
                  value={current.comment || ""}
                  onChange={(e) =>
                    setCurrent((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  placeholder="Paste or type what the customer sent..."
                  className="w-full bg-cream border border-warm-beige py-2.5 px-3 text-sm rounded outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">
                    Review Date
                  </label>
                  <input
                    type="date"
                    value={current.reviewDate || ""}
                    onChange={(e) =>
                      setCurrent((prev) => ({ ...prev, reviewDate: e.target.value }))
                    }
                    className="w-full bg-cream border border-warm-beige py-2.5 px-3 text-sm rounded outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">
                    Status
                  </label>
                  <select
                    value={current.status}
                    onChange={(e) =>
                      setCurrent((prev) => ({
                        ...prev,
                        status: e.target.value as Review["status"],
                      }))
                    }
                    className="w-full bg-cream border border-warm-beige py-2.5 px-3 text-sm rounded outline-none focus:border-gold"
                  >
                    <option value="published">Published</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-walnut">
                <input
                  type="checkbox"
                  checked={!!current.verifiedPurchase}
                  onChange={(e) =>
                    setCurrent((prev) => ({
                      ...prev,
                      verifiedPurchase: e.target.checked,
                    }))
                  }
                />
                Mark as verified purchase
              </label>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut block">
                  Customer Photo (optional)
                </label>
                <div className="flex items-center gap-3">
                  {current.customerImage ? (
                    <img
                      src={current.customerImage}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-warm-beige py-2.5 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-cream transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-near-black text-white py-2.5 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-gold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : current.id ? "Save Changes" : "Add Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
