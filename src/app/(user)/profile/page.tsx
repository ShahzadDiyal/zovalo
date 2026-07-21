"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "../../../context/AuthContext";
import { userApi } from "../../../services/userApi";
import { orderApi } from "../../../services/orderApi";
import { Order } from "../../../types";
import { formatCurrency } from "../../../lib/utils";
import { SEO } from "../../../components/SEO";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  ShoppingBag,
  Edit2,
  Save,
  X,
  Camera,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  Calendar,
  LogOut,
  Eye,
  Download,
  Printer,
  XCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { updateProfile } from "firebase/auth";
import { auth, storage } from "../../../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { User as UserProfileType } from "../../../types";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

interface UserProfileData {
  displayName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  avatar?: string;
}

function ProfileContent() {
  const { user, profile, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [formData, setFormData] = useState<UserProfileData>({
    displayName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United Kingdom",
    avatar: "",
  });

  useEffect(() => {
    setIsClient(true);
    if (user) {
      loadUserData();
      loadUserOrders();
    }
  }, [user]);

  const loadUserData = async () => {
    const userProfile = profile as UserProfileType | null;
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || user?.displayName || "",
        email: user?.email || "",
        phone: userProfile.phone || "",
        address: userProfile.address || "",
        city: userProfile.city || "",
        postalCode: userProfile.postalCode || "",
        country: userProfile.country || "United Kingdom",
        avatar: userProfile.avatar || "",
      });
    } else if (user) {
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "United Kingdom",
        avatar: "",
      });
    }
  };

  const loadUserOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userOrders = await orderApi.getUserOrders(user.uid);
      setOrders(userOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB");
      return;
    }

    setUploadingAvatar(true);
    try {
      const fileName = `avatars/${user.uid}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload error:", error);
          alert("Failed to upload avatar");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(user, { photoURL: downloadURL });
          await userApi.updateUserProfile(user.uid, {
            avatar: downloadURL,
          } as any);
          setFormData((prev) => ({ ...prev, avatar: downloadURL }));
          alert("Avatar updated successfully!");
        },
      );
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user, { displayName: formData.displayName });
      await userApi.updateUserProfile(user.uid, {
        displayName: formData.displayName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      } as any);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />;
      case "pending":
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />;
      case "processing":
        return <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />;
      case "shipped":
        return <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />;
      default:
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "processing":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "shipped":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-neutral-50 text-neutral-500 border-neutral-200";
    }
  };

  const printOrder = () => {
    if (!selectedOrder) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to print the invoice");
      return;
    }

    const printContent = getInvoiceHTML();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  };

  const downloadOrderAsPDF = async () => {
    if (!selectedOrder) return;

    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.createElement("div");
    element.innerHTML = getInvoiceHTML();
    element.style.padding = "20px";
    element.style.backgroundColor = "white";
    element.style.fontFamily = "Arial, sans-serif";

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `Order_${selectedOrder.id.slice(-8).toUpperCase()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt as any)
      .from(element)
      .save();
  };

  const getInvoiceHTML = () => {
    if (!selectedOrder) return "";
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #d4af37; margin-bottom: 20px; padding-bottom: 10px; }
          .logo { font-size: 24px; font-weight: bold; }
          .logo span { color: #d4af37; }
          .info-section { display: flex; justify-content: space-between; margin-bottom: 20px; background: #f5f5f2; padding: 15px; flex-wrap: wrap; gap: 15px; }
          .info-box { flex: 1; min-width: 200px; }
          .info-box h3 { font-size: 11px; color: #d4af37; margin-bottom: 8px; }
          .info-box p { font-size: 11px; margin: 3px 0; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #f5f5f2; padding: 10px; text-align: left; font-size: 10px; border-bottom: 1px solid #ddd; }
          td { padding: 10px; font-size: 11px; border-bottom: 1px solid #eee; vertical-align: middle; }
          .product-img { width: 50px; height: 50px; object-fit: cover; border: 1px solid #ddd; }
          .totals { text-align: right; margin-top: 15px; padding-top: 15px; border-top: 2px solid #d4af37; }
          .grand-total { font-size: 16px; font-weight: bold; color: #d4af37; margin-top: 8px; }
          .footer { text-align: center; margin-top: 30px; font-size: 9px; color: #999; border-top: 1px solid #ddd; padding-top: 15px; }
          @media print {
            body { margin: 0; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header"><div class="logo">Royal Furniture<span>.</span></div><div>TAX INVOICE</div></div>
        <div class="info-section">
          <div class="info-box"><h3>ORDER DETAILS</h3><p><strong>Order #:</strong> ${selectedOrder.id.slice(-8).toUpperCase()}</p><p><strong>Date:</strong> ${selectedOrder.createdAt?.toDate().toLocaleDateString()}</p><p><strong>Status:</strong> ${selectedOrder.orderStatus}</p></div>
          <div class="info-box"><h3>CUSTOMER</h3><p><strong>${selectedOrder.customerInfo.fullName}</strong></p><p>${selectedOrder.customerInfo.email}</p><p>${selectedOrder.customerInfo.phone}</p></div>
          <div class="info-box"><h3>SHIPPING ADDRESS</h3><p>${selectedOrder.customerInfo.address}</p><p>${selectedOrder.customerInfo.city}, ${selectedOrder.customerInfo.postalCode}</p><p>${selectedOrder.customerInfo.country}</p></div>
        </div>
        <table><thead><tr><th>Product</th><th>Title</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>
          ${selectedOrder.products.map((p) => `<tr><td><img src="${p.image}" class="product-img" onerror="this.style.display='none'" /></td><td><strong>${p.title}</strong></td><td>${p.quantity}</td><td>${formatCurrency(p.price)}</td><td>${formatCurrency(p.price * p.quantity)}</td></tr>`).join("")}
        </tbody></table>
        <div class="totals"><p><strong>Subtotal:</strong> ${formatCurrency(selectedOrder.totalPrice)}</p><p><strong>Delivery:</strong> FREE</p><div class="grand-total"><strong>GRAND TOTAL:</strong> ${formatCurrency(selectedOrder.totalPrice)}</div></div>
        <div class="footer"><p>Payment: Cash on Delivery | Thank you for shopping with Royal Furniture!</p></div>
      </body>
      </html>
    `;
  };

  if (!user) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-3 sm:space-y-4 bg-white p-8 sm:p-12 rounded-2xl border border-neutral-200/80 shadow-sm max-w-md">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-300 mx-auto" />
          <h2 className="text-xl sm:text-2xl font-serif text-neutral-900">
            Please Login
          </h2>
          <p className="text-neutral-500 text-sm sm:text-base">
            You need to be logged in to view your profile
          </p>
          <Link
            href="/auth"
            className="inline-block bg-neutral-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors rounded-xl"
          >
            Login to Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-neutral-900 text-white py-12 sm:py-16 md:py-20 mb-8 sm:mb-12">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              My Profile
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight">
            Account Dashboard
          </h1>
          <p className="text-neutral-400 font-light text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Manage your orders, update your profile, and track deliveries
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80 w-full space-y-5 md:space-y-6">
            {/* Profile Card */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 text-center shadow-sm">
              <div className="relative inline-block">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-neutral-50 rounded-full overflow-hidden border-4 border-amber-500/30">
                  {formData.avatar || user.photoURL ? (
                    <img
                      src={formData.avatar || user.photoURL || ""}
                      alt={formData.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-amber-50">
                      <User className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-1.5 bg-neutral-900 rounded-full cursor-pointer hover:bg-amber-600 transition-colors"
                >
                  <Camera className="w-3 h-3 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="hidden"
                  />
                </label>
              </div>
              {uploadingAvatar && (
                <p className="text-[10px] text-amber-600 mt-2">Uploading...</p>
              )}
              <h3 className="text-base sm:text-lg font-serif text-neutral-900 mt-3 sm:mt-4">
                {formData.displayName || "User"}
              </h3>
              <p className="text-xs text-neutral-500 break-all">{formData.email}</p>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-neutral-200/80">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-3 h-3" /> Logout
                </button>
              </div>
            </div>

            {/* Account Summary */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 mb-3 sm:mb-4">
                Account Summary
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Total Orders</span>
                  <span className="font-bold text-neutral-900">
                    {orders.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Member Since</span>
                  <span className="font-bold text-neutral-900 text-xs sm:text-sm">
                    {user.metadata.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString(
                          "en-GB",
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex gap-1 sm:gap-2 border-b border-neutral-200/80 mb-4 sm:mb-6">
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeTab === "orders"
                    ? "text-amber-600 border-b-2 border-amber-600"
                    : "text-neutral-400 hover:text-neutral-900"
                }`}
              >
                <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />{" "}
                My Orders
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeTab === "profile"
                    ? "text-amber-600 border-b-2 border-amber-600"
                    : "text-neutral-400 hover:text-neutral-900"
                }`}
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />{" "}
                Profile Settings
              </button>
            </div>

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-3 sm:space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
                        Loading orders...
                      </p>
                    </div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 bg-white border border-neutral-200/80 rounded-2xl shadow-sm">
                    <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-serif text-neutral-900 mb-2">
                      No Orders Yet
                    </h3>
                    <p className="text-neutral-500 mb-6 text-sm">
                      You haven't placed any orders yet.
                    </p>
                    <Link
                      href="/shop"
                      className="inline-block bg-neutral-900 text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors rounded-xl"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-neutral-200/80">
                        <div>
                          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                            <span className="flex items-center gap-1 text-[9px] sm:text-[10px] text-neutral-500">
                              <Calendar className="w-3 h-3" />
                              {order.createdAt
                                ?.toDate()
                                .toLocaleDateString("en-GB")}
                            </span>
                            <span className="text-sm font-bold text-neutral-900">
                              {formatCurrency(order.totalPrice)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <div
                            className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-widest ${getOrderStatusColor(order.orderStatus)}`}
                          >
                            {getOrderStatusIcon(order.orderStatus)}
                            <span className="hidden xs:inline">
                              {order.orderStatus}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                            }}
                            className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-amber-600 hover:text-neutral-900 transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> View Details
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        {order.products.slice(0, 2).map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 sm:gap-4"
                          >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-50 border border-neutral-200/80 rounded-xl overflow-hidden shrink-0">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-neutral-900 truncate">
                                {item.title}
                              </p>
                              <p className="text-[9px] sm:text-[10px] text-neutral-500">
                                Qty: {item.quantity} ×{" "}
                                {formatCurrency(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.products.length > 2 && (
                          <p className="text-[9px] sm:text-[10px] text-neutral-400">
                            +{order.products.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-neutral-200/80">
                  <h3 className="text-base sm:text-lg font-serif text-neutral-900">
                    Personal Information
                  </h3>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-600 hover:text-neutral-900 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditing(false)}
                        className="p-1.5 sm:p-2 text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <Save className="w-3 h-3" />{" "}
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 block mb-1">
                        Full Name
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="displayName"
                          value={formData.displayName}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-neutral-200/80 py-2 px-3 sm:px-4 text-sm focus:border-amber-500 outline-none transition-all rounded-xl"
                        />
                      ) : (
                        <p className="text-sm text-neutral-900 py-2 break-words">
                          {formData.displayName || "Not set"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 block mb-1">
                        Email Address
                      </label>
                      <p className="text-sm text-neutral-900 py-2 break-all">
                        {formData.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 block mb-1">
                        Phone Number
                      </label>
                      {editing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+44 7123 456789"
                          className="w-full bg-white border border-neutral-200/80 py-2 px-3 sm:px-4 text-sm focus:border-amber-500 outline-none transition-all rounded-xl"
                        />
                      ) : (
                        <p className="text-sm text-neutral-900 py-2">
                          {formData.phone || "Not set"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 block mb-1">
                        Country
                      </label>
                      {editing ? (
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-neutral-200/80 py-2 px-3 sm:px-4 text-sm focus:border-amber-500 outline-none transition-all rounded-xl"
                        >
                          <option>United Kingdom</option>
                          <option>Ireland</option>
                          <option>France</option>
                          <option>Germany</option>
                          <option>United States</option>
                        </select>
                      ) : (
                        <p className="text-sm text-neutral-900 py-2">
                          {formData.country}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 block mb-1">
                        City
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="London"
                          className="w-full bg-white border border-neutral-200/80 py-2 px-3 sm:px-4 text-sm focus:border-amber-500 outline-none transition-all rounded-xl"
                        />
                      ) : (
                        <p className="text-sm text-neutral-900 py-2">
                          {formData.city || "Not set"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 block mb-1">
                        Postal Code
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="SW1A 1AA"
                          className="w-full bg-white border border-neutral-200/80 py-2 px-3 sm:px-4 text-sm focus:border-amber-500 outline-none transition-all rounded-xl"
                        />
                      ) : (
                        <p className="text-sm text-neutral-900 py-2">
                          {formData.postalCode || "Not set"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 block mb-1">
                      Address
                    </label>
                    {editing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Your full street address"
                        className="w-full bg-white border border-neutral-200/80 py-2 px-3 sm:px-4 text-sm focus:border-amber-500 outline-none transition-all rounded-xl resize-none"
                      />
                    ) : (
                      <p className="text-sm text-neutral-900 py-2 break-words">
                        {formData.address || "Not set"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-3 sm:px-4 py-4 sm:py-6">
          <div
            className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm"
            onClick={() => setShowOrderModal(false)}
          />
          <div className="bg-white max-w-3xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto relative z-10 shadow-2xl border border-neutral-200/80 rounded-2xl">
            <div className="sticky top-0 bg-white border-b border-neutral-200/80 p-4 sm:p-5 flex flex-wrap justify-between items-center gap-3 rounded-t-2xl">
              <h3 className="text-lg sm:text-xl font-serif text-neutral-900">
                Order Details
              </h3>
              <div className="flex gap-1 sm:gap-2">
                {isClient && (
                  <>
                    <button
                      onClick={downloadOrderAsPDF}
                      className="p-1.5 sm:p-2 text-neutral-500 hover:text-amber-600 transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={printOrder}
                      className="p-1.5 sm:p-2 text-neutral-500 hover:text-amber-600 transition-colors"
                      title="Print"
                    >
                      <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-1.5 sm:p-2 text-neutral-500 hover:text-red-500 transition-colors"
                >
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Order Header */}
              <div className="bg-neutral-50 p-4 sm:p-5 rounded-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                      Order Reference
                    </p>
                    <p className="text-base sm:text-lg font-mono font-bold text-neutral-900 break-all">
                      #{selectedOrder.id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                      Order Date
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-neutral-900">
                      {selectedOrder.createdAt
                        ?.toDate()
                        .toLocaleDateString("en-GB")}{" "}
                      at{" "}
                      {selectedOrder.createdAt
                        ?.toDate()
                        .toLocaleTimeString("en-GB")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                      Order Status
                    </p>
                    <div
                      className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold ${getOrderStatusColor(selectedOrder.orderStatus)}`}
                    >
                      {getOrderStatusIcon(selectedOrder.orderStatus)}
                      {selectedOrder.orderStatus}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 mb-2 sm:mb-3">
                    Customer Information
                  </h4>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-neutral-600">
                    <p>
                      <span className="font-bold text-neutral-900">Name:</span>{" "}
                      {selectedOrder.customerInfo.fullName}
                    </p>
                    <p>
                      <span className="font-bold text-neutral-900">Email:</span>{" "}
                      {selectedOrder.customerInfo.email}
                    </p>
                    <p>
                      <span className="font-bold text-neutral-900">Phone:</span>{" "}
                      {selectedOrder.customerInfo.phone}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 mb-2 sm:mb-3">
                    Shipping Address
                  </h4>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-neutral-600">
                    <p>{selectedOrder.customerInfo.address}</p>
                    <p>
                      {selectedOrder.customerInfo.city},{" "}
                      {selectedOrder.customerInfo.postalCode}
                    </p>
                    <p>{selectedOrder.customerInfo.country}</p>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 mb-3 sm:mb-4">
                  Order Items
                </h4>
                <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                  <table className="w-full min-w-[500px] sm:min-w-0">
                    <thead>
                      <tr className="border-b border-neutral-200/80">
                        <th className="text-left py-2 sm:py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                          Product
                        </th>
                        <th className="text-left py-2 sm:py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                          Title
                        </th>
                        <th className="text-center py-2 sm:py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                          Qty
                        </th>
                        <th className="text-right py-2 sm:py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                          Price
                        </th>
                        <th className="text-right py-2 sm:py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.products.map((item, idx) => (
                        <tr key={idx} className="border-b border-neutral-200/80">
                          <td className="py-2 sm:py-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-50 border border-neutral-200/80 rounded-xl overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="py-2 sm:py-3">
                            <p className="text-xs sm:text-sm font-medium text-neutral-900">
                              {item.title}
                            </p>
                          </td>
                          <td className="py-2 sm:py-3 text-center text-xs sm:text-sm text-neutral-600">
                            {item.quantity}
                          </td>
                          <td className="py-2 sm:py-3 text-right text-xs sm:text-sm text-neutral-600">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-neutral-900">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-neutral-200/80 pt-4">
                <div className="space-y-2 text-right">
                  <div className="flex justify-end gap-4 sm:gap-8">
                    <span className="text-neutral-500 text-sm">Subtotal:</span>
                    <span className="font-medium text-neutral-900 text-sm">
                      {formatCurrency(selectedOrder.totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-end gap-4 sm:gap-8">
                    <span className="text-neutral-500 text-sm">Delivery:</span>
                    <span className="text-emerald-600 font-bold text-sm">
                      FREE
                    </span>
                  </div>
                  <div className="flex justify-end gap-4 sm:gap-8 pt-2 border-t border-neutral-200/80">
                    <span className="text-base sm:text-lg font-bold text-neutral-900">
                      Grand Total:
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-amber-600">
                      {formatCurrency(selectedOrder.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-emerald-50/60 p-3 sm:p-4 rounded-xl text-center border border-emerald-200/80">
                <p className="text-xs sm:text-sm font-medium text-emerald-700">
                  ✓ Cash on Delivery (COD) - Pay when your order arrives
                </p>
              </div>
            </div>
            <div className="sticky bottom-0 bg-neutral-50 border-t border-neutral-200/80 p-4 sm:p-5 flex flex-wrap gap-2 sm:gap-3 justify-end rounded-b-2xl">
              {isClient && (
                <>
                  <button
                    onClick={downloadOrderAsPDF}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 border border-neutral-200/80 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors rounded-xl"
                  >
                    <Download className="w-3 h-3" /> Download PDF
                  </button>
                  <button
                    onClick={printOrder}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 bg-neutral-900 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors rounded-xl"
                  >
                    <Printer className="w-3 h-3" /> Print Invoice
                  </button>
                </>
              )}
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-3 sm:px-5 py-1.5 sm:py-2 border-2 border-neutral-900 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-colors rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserProfile() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FAF8F5] min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}