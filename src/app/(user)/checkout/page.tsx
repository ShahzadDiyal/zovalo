// src/app/(user)/checkout/page.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { formatCurrency } from "../../../lib/utils";
import { SEO } from "../../../components/SEO";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  User,
  MessageSquare,
  AlertCircle,
  X,
  Globe,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";

// Country codes with validation patterns
const countryCodes = [
  {
    code: "+44",
    country: "United Kingdom",
    pattern: "^[0-9]{10,11}$",
    example: "7123456789",
  },
  {
    code: "+353",
    country: "Ireland",
    pattern: "^[0-9]{9,10}$",
    example: "851234567",
  },
  {
    code: "+33",
    country: "France",
    pattern: "^[0-9]{9}$",
    example: "612345678",
  },
  {
    code: "+49",
    country: "Germany",
    pattern: "^[0-9]{10,11}$",
    example: "15123456789",
  },
  {
    code: "+1",
    country: "United States",
    pattern: "^[0-9]{10}$",
    example: "2125551234",
  },
  {
    code: "+61",
    country: "Australia",
    pattern: "^[0-9]{9,10}$",
    example: "412345678",
  },
];

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    countryCodes[0],
  );
  const [showWarning, setShowWarning] = useState(false);
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const recaptchaRef = useRef<any>(null);
  const [requireCaptcha, setRequireCaptcha] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [orderCount, setOrderCount] = useState(0);

  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    alternativePhone: "",
    country: "United Kingdom",
    city: "",
    address: "",
    postalCode: "",
    notes: "",
  });

  useEffect(() => {
    const savedOrderCount = parseInt(
      localStorage.getItem("userOrderCount") || "0",
    );
    setOrderCount(savedOrderCount);

    if (savedOrderCount >= 0) {
      setRequireCaptcha(true);
    }
  }, []);

  const onCaptchaChange = (token: string | null) => {
    if (token) {
      setCaptchaVerified(true);
      setRequireCaptcha(false);
    }
  };

  const incrementOrderCount = () => {
    const newCount = orderCount + 1;
    setOrderCount(newCount);
    localStorage.setItem("userOrderCount", newCount.toString());

    if (newCount >= 2) {
      setRequireCaptcha(true);
      setCaptchaVerified(false);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (validationError) setValidationError(null);
    if (showWarning) setShowWarning(false);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    const countryCodeData = countryCodes.find((c) => c.country === countryName);
    if (countryCodeData) {
      setSelectedCountryCode(countryCodeData);
    }
    setFormData((prev) => ({ ...prev, country: countryName }));
  };

  const validatePhoneNumber = (
    phone: string,
    countryData: typeof selectedCountryCode,
  ) => {
    const phoneRegex = new RegExp(countryData.pattern);
    const phoneNumber = phone.replace(/\s/g, "");
    if (!phoneNumber) return false;
    return phoneRegex.test(phoneNumber);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setValidationError("Please enter your full name");
      setShowWarning(true);
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setValidationError("Please enter a valid email address");
      setShowWarning(true);
      return false;
    }
    if (!validatePhoneNumber(formData.phone, selectedCountryCode)) {
      setValidationError(
        `Please enter a valid ${selectedCountryCode.country} phone number`,
      );
      setShowWarning(true);
      return false;
    }
    if (
      formData.alternativePhone &&
      !validatePhoneNumber(formData.alternativePhone, selectedCountryCode)
    ) {
      setValidationError(`Please enter a valid alternative phone number`);
      setShowWarning(true);
      return false;
    }
    if (formData.address.length < 10) {
      setValidationError(
        "Please provide a complete street address (at least 10 characters)",
      );
      setShowWarning(true);
      return false;
    }
    if (!formData.city.trim()) {
      setValidationError("Please enter your city");
      setShowWarning(true);
      return false;
    }
    if (!formData.postalCode.trim()) {
      setValidationError("Please enter your postal code");
      setShowWarning(true);
      return false;
    }
    return true;
  };

  const handleProceedToConfirmation = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user) {
      // Save current path to session storage before redirecting
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      router.push("/login");
      return;
    }

    if (requireCaptcha && !captchaVerified) {
      setValidationError("Please complete the verification to continue");
      setShowWarning(true);
      return;
    }

    if (cart.length === 0) {
      setValidationError("Your cart is empty");
      setShowWarning(true);
      return;
    }
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmOrder = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setEmailStatus("sending");

    try {
      const fullPhoneNumber = `${selectedCountryCode.code} ${formData.phone}`;
      const fullAlternativePhone = formData.alternativePhone
        ? `${selectedCountryCode.code} ${formData.alternativePhone}`
        : "";

      const orderData = {
        userId: user!.uid,
        customerInfo: {
          fullName: formData.fullName || "",
          email: formData.email || "",
          phone: fullPhoneNumber || "",
          alternativePhone: fullAlternativePhone || "",
          country: formData.country || "",
          city: formData.city || "",
          address: formData.address || "",
          postalCode: formData.postalCode || "",
          notes: formData.notes || "",
        },
        products: cart.map((item) => ({
          productId: item.id || "",
          title: item.title || "",
          price: item.price || 0,
          quantity: item.quantity || 1,
          image: item.images?.[0] || "",
          selectedOptions: item.selectedOptions || {},
          color: item.selectedOptions?.color || "",
          seater: item.selectedOptions?.seater || "",
        })),
        totalPrice: subtotal || 0,
        orderStatus: "pending",
        paymentMethod: "COD",
      };

      // Save order to Firestore
      const docRef = await addDoc(collection(db, "orders"), {
        ...orderData,
        createdAt: serverTimestamp(),
      });

      const orderIdValue = docRef.id;
      setOrderId(orderIdValue);
      setOrderComplete(true);
      clearCart();

      // Prepare email data
      const emailData = {
        orderId: orderIdValue,
        customerName: formData.fullName || "",
        customerEmail: formData.email || "",
        customerPhone: fullPhoneNumber || "",
        customerAddress: formData.address || "",
        customerCity: formData.city || "",
        customerPostalCode: formData.postalCode || "",
        customerCountry: formData.country || "",
        products: cart.map((item) => ({
          title: item.title || "",
          price: item.price || 0,
          quantity: item.quantity || 1,
          image: item.images?.[0] || "",
          color: item.selectedOptions?.color || "",
          seater: item.selectedOptions?.seater || "",
        })),
        totalPrice: subtotal || 0,
        orderDate: new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        deliveryNotes: formData.notes || "",
      };

      // Send emails via API
      try {
        const emailResponse = await fetch("/api/order-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderData: emailData }),
        });

        const emailResult = await emailResponse.json();

        if (emailResponse.ok && emailResult.success) {
          setEmailStatus("sent");
          console.log("Order emails sent successfully");
        } else {
          setEmailStatus("error");
          console.error("Failed to send order emails:", emailResult.message);
        }
      } catch (emailError) {
        setEmailStatus("error");
        console.error("Error sending order emails:", emailError);
      }

      // Increment order count after successful order
      incrementOrderCount();
    } catch (error) {
      console.error("Error placing order:", error);
      setValidationError("Failed to place order. Please try again.");
      setEmailStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-neutral-900">
            Thank You For Your Order!
          </h1>
          <p className="text-neutral-600">
            Order #{orderId?.slice(-8).toUpperCase()}
          </p>
          {emailStatus === "sent" && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl max-w-md mx-auto">
              <p className="text-sm font-medium">
                📧 Order confirmation sent to {formData.email}
              </p>
            </div>
          )}
          {emailStatus === "error" && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-xl max-w-md mx-auto">
              <p className="text-sm font-medium">
                ⚠️ We'll send your confirmation email shortly
              </p>
            </div>
          )}
          <p className="text-neutral-500 max-w-md mx-auto">
            We'll contact you shortly for delivery confirmation. Our team will
            call you within 24 hours to confirm your delivery slot.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/shop"
              className="bg-neutral-900 text-white px-6 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-amber-600 transition rounded-xl"
            >
              Continue Shopping
            </Link>
            <Link
              href="/profile"
              className="border-2 border-neutral-900 px-6 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition rounded-xl"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-16 md:py-20">
        <div className="text-center py-12 sm:py-16">
          <h2 className="text-xl font-serif text-neutral-900">
            No items to checkout
          </h2>
          <Link
            href="/shop"
            className="text-amber-600 hover:text-amber-700 underline mt-2 inline-block"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  const RECAPTCHA_SITE_KEY =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
    "6LfwWVQtAAAAACmScZEoGpi1Sx5IXEVY-84SAbMT";

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <SEO
        title="Secure Checkout"
        description="Complete your order with Cash on Delivery"
      />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-neutral-900 text-white py-12 sm:py-16 md:py-20 mb-8 sm:mb-12">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              Secure Checkout
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight">
            Complete Your Order
          </h1>
          <p className="text-neutral-400 font-light text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Enter your shipping details to confirm your purchase
          </p>
        </div>
      </section>

      {/* Warning Banner */}
      {showWarning && validationError && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-bounce max-w-[90%] sm:max-w-md">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Please check your details</p>
            <p className="text-xs">{validationError}</p>
          </div>
          <button onClick={() => setShowWarning(false)} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-200/80 pb-4 mb-6 gap-2">
              <h2 className="text-xl sm:text-2xl font-serif text-neutral-900">
                Shipping Details
              </h2>
              <Link
                href="/cart"
                className="text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-500 hover:text-amber-600 transition-colors"
              >
                ← Return to Cart
              </Link>
            </div>

            {validationError && !showWarning && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{validationError}</span>
              </div>
            )}

            {/* Login Required Message */}
            {!user && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-800">
                      Login Required
                    </p>
                    <p className="text-sm text-amber-700">
                      Please log in to complete your order. You'll be redirected
                      back to checkout after logging in.
                    </p>
                    <Link
                      href="/auth"
                      className="inline-block mt-2 bg-amber-600 text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-amber-700 transition rounded-lg"
                    >
                      Login Now
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* reCAPTCHA Info Banner */}
            {requireCaptcha && !captchaVerified && user && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm font-bold text-amber-800">
                      Security Verification Required
                    </p>
                    <p className="text-xs text-amber-700">
                      You've placed {orderCount} orders. Please complete the
                      verification below to continue.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleProceedToConfirmation} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 block mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-white border border-neutral-200/80 py-2.5 pl-10 pr-3 text-sm focus:border-amber-500 focus:bg-white outline-none transition-all rounded-xl"
                      placeholder="Royal Furnitures"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 block mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white border border-neutral-200/80 py-2.5 pl-10 pr-3 text-sm focus:border-amber-500 focus:bg-white outline-none transition-all rounded-xl"
                      placeholder="george@gmail.com"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 block mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleCountryChange}
                    className="w-full bg-white border border-neutral-200/80 py-2.5 px-3 text-sm focus:border-amber-500 outline-none transition-all rounded-xl"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.country} value={c.country}>
                        {c.country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 block mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative w-28">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <select
                        value={selectedCountryCode.code}
                        onChange={(e) => {
                          const countryData = countryCodes.find(
                            (c) => c.code === e.target.value,
                          );
                          if (countryData) {
                            setSelectedCountryCode(countryData);
                            setFormData((prev) => ({
                              ...prev,
                              country: countryData.country,
                            }));
                          }
                        }}
                        className="w-full bg-white border border-neutral-200/80 py-2.5 pl-9 pr-2 text-sm focus:border-amber-500 outline-none transition-all rounded-xl"
                      >
                        {countryCodes.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={selectedCountryCode.example}
                        className="w-full bg-white border border-neutral-200/80 py-2.5 pl-10 pr-3 text-sm focus:border-amber-500 focus:bg-white outline-none transition-all rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Alternative Phone Number */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 block mb-1">
                    Whatsapp Number{" "}<span className="text-red-500">*</span>
                    
                  </label>
                  <div className="flex gap-2">
                    <div className="relative w-28">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <select
                        value={selectedCountryCode.code}
                        className="w-full bg-white border border-neutral-200/80 py-2.5 pl-9 pr-2 text-sm focus:border-amber-500 outline-none transition-all rounded-xl"
                      >
                        {countryCodes.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        name="alternativePhone"
                        type="tel"
                        required
                        value={formData.alternativePhone}
                        onChange={handleChange}
                        placeholder={selectedCountryCode.example}
                        className="w-full bg-white border border-neutral-200/80 py-2.5 pl-10 pr-3 text-sm focus:border-amber-500 focus:bg-white outline-none transition-all rounded-xl"
                      />
                    </div>
                  </div>
                  <p className="text-[8px] text-neutral-400 mt-1">
                    We'll use this if we can't reach you on your primary number
                  </p>
                </div>

                {/* City */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 block mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-white border border-neutral-200/80 py-2.5 px-3 text-sm focus:border-amber-500 focus:bg-white outline-none transition-all rounded-xl"
                    placeholder="London"
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 block mb-1">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full bg-white border border-neutral-200/80 py-2.5 px-3 text-sm focus:border-amber-500 focus:bg-white outline-none transition-all rounded-xl"
                    placeholder="SW1A 1AA"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 block mb-1">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                    <textarea
                      name="address"
                      required
                      rows={2}
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-white border border-neutral-200/80 py-2.5 pl-10 pr-3 text-sm focus:border-amber-500 focus:bg-white outline-none transition-all rounded-xl resize-none"
                      placeholder="123 Main Street, Apartment 4B"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 block mb-1">
                    Order Notes (Optional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                    <textarea
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="E.g., Gate code, floor number, special instructions..."
                      className="w-full bg-white border border-neutral-200/80 py-2.5 pl-10 pr-3 text-sm focus:border-amber-500 focus:bg-white outline-none transition-all rounded-xl resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* reCAPTCHA */}
              {requireCaptcha && user && (
                <div className="flex justify-center my-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="text-center">
                    <p className="text-xs text-amber-800 mb-3 font-medium">
                      🔒 Security Check Required
                    </p>
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={RECAPTCHA_SITE_KEY}
                      onChange={onCaptchaChange}
                      theme="light"
                    />
                    <p className="text-[10px] text-neutral-500 mt-3">
                      This helps us protect against automated orders
                    </p>
                  </div>
                </div>
              )}

              {/* Order Count Info */}
              <div className="text-center text-[10px] text-neutral-400">
                {orderCount === 0 ? (
                  <p className="text-[15px] text-amber-700 italic">
                    🚚 Our team will call you within 24 hours to confirm your
                    delivery slot.
                  </p>
                ) : orderCount === 1 ? (
                  <p>⚠️ Next order will require security verification.</p>
                ) : (
                  <p className="text-amber-600">
                    ✓ Security verification completed for this order
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-emerald-50/60 border border-emerald-200/80 p-4 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-neutral-900">
                    Cash Upon Delivery
                  </span>
                </div>
                <p className="text-sm text-neutral-600 mb-3">
                  Pay only when your furniture arrives at your doorstep. No
                  advance payment required.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    ✓ Inspect before payment
                  </span>
                  <span className="flex items-center gap-1">
                    ✓ No hidden charges
                  </span>
                  <span className="flex items-center gap-1">
                    ✓ Secure delivery
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || (requireCaptcha && !captchaVerified)}
                className="w-full bg-neutral-900 cursor-pointer text-white py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-amber-600 transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {!user
                  ? "Login to Continue"
                  : loading
                    ? "Processing..."
                    : requireCaptcha && !captchaVerified
                      ? "Complete Verification First"
                      : "Confirm Order (Pay After Delivery)"}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:w-[420px]">
            <div className="bg-white p-6 rounded-2xl sticky top-24 ">
              <h2 className="text-xl font-serif text-neutral-900 mb-4">
                Review Order
              </h2>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-neutral-200/80 pb-4"
                  >
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-neutral-50 border border-neutral-200/80 rounded-xl overflow-hidden">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-neutral-900">
                          {item.title}
                        </h4>
                        {(item.selectedOptions?.color ||
                          item.selectedOptions?.seater) && (
                          <div className="flex flex-wrap items-center gap-1 mt-0.5">
                            {item.selectedOptions?.color && (
                              <span className="inline-flex items-center gap-1 text-[12px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-full">
                                <span
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{
                                    backgroundColor:
                                      item.selectedOptions.color.toLowerCase(),
                                  }}
                                />
                                {item.selectedOptions.color}
                              </span>
                            )}
                            {item.selectedOptions?.seater && (
                              <span className="text-[12px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-full">
                                {item.selectedOptions.seater}
                              </span>
                            )}
                            <p className="text-[12px] text-neutral-500">
                              QTY:{" "}
                              <span className="font-bold">
                                {" "}
                                {item.quantity}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-neutral-200/80 pt-3 mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="text-neutral-900">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Delivery</span>
                  <span className="text-emerald-600 font-bold">
                    FREE (Cash On Delivery)
                  </span>
                </div>
                <div className="border-t border-neutral-200/80 pt-2 flex justify-between font-bold text-lg">
                  <span className="text-neutral-900">Total</span>
                  <span className="text-amber-600">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Free delivery within 1-3 days (UK)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>White glove placement included</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          />
          <div className="bg-white max-w-md w-full rounded-2xl overflow-hidden relative z-10 shadow-2xl">
            <div className="p-5 border-b border-neutral-200/80 flex justify-between items-center">
              <h3 className="text-lg font-serif text-neutral-900">
                Confirm Order
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="hover:text-amber-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 mb-2">
                  Delivery Details
                </h4>
                <p className="text-sm text-neutral-600">
                  <strong className="text-neutral-900">Name:</strong>{" "}
                  {formData.fullName}
                </p>
                <p className="text-sm text-neutral-600">
                  <strong className="text-neutral-900">Phone:</strong>{" "}
                  {selectedCountryCode.code} {formData.phone}
                </p>
                {formData.alternativePhone && (
                  <p className="text-sm text-neutral-600">
                    <strong className="text-neutral-900">Alt Phone:</strong>{" "}
                    {selectedCountryCode.code} {formData.alternativePhone}
                  </p>
                )}
                <p className="text-sm text-neutral-600">
                  <strong className="text-neutral-900">Address:</strong>{" "}
                  {formData.address}, {formData.city}, {formData.postalCode},{" "}
                  {formData.country}
                </p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 mb-2">
                  Order Summary
                </h4>
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-sm mb-1 text-neutral-600"
                  >
                    <span>
                      {item.title} x{item.quantity}
                    </span>
                    {(item.selectedOptions?.color ||
                      item.selectedOptions?.seater) && (
                      <div className="flex flex-wrap items-center gap-1 mt-0.5">
                        {item.selectedOptions?.color && (
                          <span className="inline-flex items-center gap-1 text-[12px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-full">
                            <span
                              className="w-3 h-3 rounded-full border border-gray-300"
                              style={{
                                backgroundColor:
                                  item.selectedOptions.color.toLowerCase(),
                              }}
                            />
                            {item.selectedOptions.color}
                          </span>
                        )}
                        {item.selectedOptions?.seater && (
                          <span className="text-[12px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-full">
                            {item.selectedOptions.seater}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div className="border-t border-neutral-200/80 pt-2 mt-2 flex justify-between font-bold">
                  <span className="text-neutral-900">Total</span>
                  <span className="text-amber-600">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              </div>
              <div className="bg-emerald-50/60 p-3 rounded-xl text-center text-sm text-emerald-700 border border-emerald-200/80">
                ✓ Pay when your furniture arrives
              </div>
            </div>
            <div className="p-5 border-t border-neutral-200/80 flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 border-2 border-neutral-200 py-2.5 text-sm font-bold uppercase tracking-widest text-neutral-700 hover:bg-neutral-50 transition-all rounded-xl"
              >
                Edit
              </button>
              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className="flex-1 bg-neutral-900 text-white py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-amber-600 transition-all rounded-xl"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-10px); } }
        .animate-bounce { animation: bounce 0.5s ease-out; }
      `}</style>
    </div>
  );
}
