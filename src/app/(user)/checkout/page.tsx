"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { formatCurrency } from "../../../lib/utils";
import { Order } from "../../../types";
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

  // reCAPTCHA states
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

  // Load order count from localStorage on mount
  useEffect(() => {
    const savedOrderCount = parseInt(
      localStorage.getItem("userOrderCount") || "0",
    );
    setOrderCount(savedOrderCount);

    // Require captcha after 2 orders
    if (savedOrderCount >= 2) {
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

    // Enable captcha for next order after 2 orders
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

    // Check if captcha is required and not verified
    if (requireCaptcha && !captchaVerified) {
      setValidationError("Please complete the verification to continue");
      setShowWarning(true);
      return;
    }

    if (!user) {
      setValidationError("Please login to continue");
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
          specifications: item.specifications || {},
          dimensions: item.dimensions || "",
          color: item.selectedOptions?.color || "",
          seater: item.selectedOptions?.seater || "",
        })),
        totalPrice: subtotal || 0,
        orderStatus: "pending",
        paymentMethod: "COD",
      };

      const docRef = await addDoc(collection(db, "orders"), {
        ...orderData,
        createdAt: serverTimestamp(),
      });

      // Increment order count after successful order
      incrementOrderCount();

      setOrderId(docRef.id);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      setValidationError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-32 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-mint-50 rounded-full">
          <CheckCircle2 className="w-10 h-10 text-mint-700" />
        </div>
        <h1 className="text-3xl font-display text-near-black">
          Thank You For Your Order!
        </h1>
        <p className="text-gray-600">
          Order #{orderId?.slice(-8).toUpperCase()}
        </p>
        <p className="text-gray-500">
          We'll contact you shortly for delivery confirmation.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/shop"
            className="bg-near-black text-white px-6 py-2 text-sm hover:bg-gold transition rounded"
          >
            Continue Shopping
          </Link>
          <Link
            href="/profile"
            className="border border-near-black px-6 py-2 text-sm hover:bg-near-black hover:text-white transition rounded"
          >
            View Orders
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-32">
        <h2 className="text-xl">No items to checkout</h2>
        <Link href="/shop" className="text-gold underline">
          Go to Shop
        </Link>
      </div>
    );
  }

  const RECAPTCHA_SITE_KEY = "6Lfr4ActAAAAAMH7eumd7twNYfKopUrlfWZRzT7t";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-24 lg:pt-6">
      <SEO
        title="Secure Checkout"
        description="Complete your order with Cash on Delivery"
      />

      {/* Warning Banner */}
      {showWarning && validationError && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-bounce max-w-[90%] sm:max-w-md">
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

      {/* reCAPTCHA Info Banner - Shows when captcha is required */}
      {requireCaptcha && !captchaVerified && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
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

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="flex-1">
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h1 className="text-2xl font-display">Shipping Details</h1>
            <Link href="/cart" className="text-sm text-walnut hover:text-gold">
              ← Return to Cart
            </Link>
          </div>

          {validationError && !showWarning && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{validationError}</span>
            </div>
          )}

          <form onSubmit={handleProceedToConfirmation} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="text-xs font-bold uppercase text-walnut block mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-cream border border-warm-beige py-2 pl-10 pr-3 text-sm focus:border-gold outline-none rounded"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold uppercase text-walnut block mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-cream border border-warm-beige py-2 pl-10 pr-3 text-sm focus:border-gold outline-none rounded"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="text-xs font-bold uppercase text-walnut block mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleCountryChange}
                  className="w-full bg-cream border border-warm-beige py-2 px-3 text-sm rounded"
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
                <label className="text-xs font-bold uppercase text-walnut block mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative w-28">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                      className="w-full bg-cream border border-warm-beige py-2 pl-9 pr-2 text-sm rounded"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={selectedCountryCode.example}
                      className="w-full bg-cream border border-warm-beige py-2 pl-10 pr-3 text-sm focus:border-gold outline-none rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Alternative Phone Number */}
              <div>
                <label className="text-xs font-bold uppercase text-walnut block mb-1">
                  Alternative Phone Number{" "}
                  <span className="text-gray-400 text-[8px]">(Optional)</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative w-28">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={selectedCountryCode.code}
                      className="w-full bg-cream border border-warm-beige py-2 pl-9 pr-2 text-sm rounded"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="alternativePhone"
                      type="tel"
                      value={formData.alternativePhone}
                      onChange={handleChange}
                      placeholder={selectedCountryCode.example}
                      className="w-full bg-cream border border-warm-beige py-2 pl-10 pr-3 text-sm focus:border-gold outline-none rounded"
                    />
                  </div>
                </div>
                <p className="text-[8px] text-gray-400 mt-1">
                  We'll use this if we can't reach you on your primary number
                </p>
              </div>

              {/* City */}
              <div>
                <label className="text-xs font-bold uppercase text-walnut block mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                  placeholder="London"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="text-xs font-bold uppercase text-walnut block mb-1">
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full bg-cream border border-warm-beige py-2 px-3 text-sm focus:border-gold outline-none rounded"
                  placeholder="SW1A 1AA"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold uppercase text-walnut block mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <textarea
                    name="address"
                    required
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-cream border border-warm-beige py-2 pl-10 pr-3 text-sm focus:border-gold outline-none rounded"
                    placeholder="123 Main Street, Apartment 4B"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold uppercase text-walnut block mb-1">
                  Order Notes (Optional)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="E.g., Gate code, floor number, special instructions..."
                    className="w-full bg-cream border border-warm-beige py-2 pl-10 pr-3 text-sm focus:border-gold outline-none rounded"
                  />
                </div>
              </div>
            </div>

            {/* reCAPTCHA - Only shows after 2 orders */}
            {requireCaptcha && (
              <div className="flex justify-center my-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
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
                  <p className="text-[10px] text-gray-500 mt-3">
                    This helps us protect against automated orders
                  </p>
                </div>
              </div>
            )}

            {/* Order Count Info */}
            <div className="text-center text-[10px] text-gray-400">
              {orderCount === 0 ? (
                <p>First order? No verification needed.</p>
              ) : orderCount === 1 ? (
                <p>⚠️ Next order will require security verification.</p>
              ) : (
                <p className="text-amber-600">
                  ✓ Security verification completed for this order
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-mint-50 border border-mint-200 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="w-5 h-5 text-mint-700" />
                <span className="font-bold text-near-black">
                  Cash Upon Delivery
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Pay only when your furniture arrives at your doorstep. No
                advance payment required.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
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
              className="w-full bg-near-black text-white py-3 text-sm font-bold uppercase tracking-wider hover:bg-gold transition rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : requireCaptcha && !captchaVerified
                  ? "Complete Verification First"
                  : "Review Order"}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="lg:w-[420px]">
          <div className="bg-cream/30 border border-warm-beige p-5 rounded-lg sticky top-24">
            <h2 className="text-lg font-display mb-4">Review Order</h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="border-b border-warm-beige pb-4">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-white border rounded overflow-hidden">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.title}</h4>
                      <p className="text-xs text-gray-500">
                        QTY: {item.quantity}
                      </p>
                      <p className="text-sm font-bold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery</span>
                <span className="text-mint-700 font-bold">FREE</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-walnut">{formatCurrency(subtotal)}</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Truck className="w-4 h-4 text-mint-700" />
                <span>Free delivery within 1-3 days (UK)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <ShieldCheck className="w-4 h-4 text-mint-700" />
                <span>14-day returns policy</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <ShoppingBag className="w-4 h-4 text-mint-700" />
                <span>White glove placement included</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowConfirmModal(false)}
          />
          <div className="bg-white max-w-md w-full rounded-lg overflow-hidden relative z-10">
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="text-lg font-display">Confirm Order</h3>
              <button onClick={() => setShowConfirmModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold uppercase text-walnut mb-2">
                  Delivery Details
                </h4>
                <p className="text-sm">
                  <strong>Name:</strong> {formData.fullName}
                </p>
                <p className="text-sm">
                  <strong>Phone:</strong> {selectedCountryCode.code}{" "}
                  {formData.phone}
                </p>
                {formData.alternativePhone && (
                  <p className="text-sm">
                    <strong>Alt Phone:</strong> {selectedCountryCode.code}{" "}
                    {formData.alternativePhone}
                  </p>
                )}
                <p className="text-sm">
                  <strong>Address:</strong> {formData.address}, {formData.city},{" "}
                  {formData.postalCode}, {formData.country}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase text-walnut mb-2">
                  Order Summary
                </h4>
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm mb-1">
                    <span>
                      {item.title} x{item.quantity}
                    </span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>
              <div className="bg-mint-50 p-3 rounded text-center text-sm text-mint-700">
                ✓ Pay when your furniture arrives
              </div>
            </div>
            <div className="p-5 border-t flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 border py-2 text-sm hover:bg-gray-50 rounded"
              >
                Edit
              </button>
              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className="flex-1 bg-near-black text-white py-2 text-sm hover:bg-gold transition rounded"
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
