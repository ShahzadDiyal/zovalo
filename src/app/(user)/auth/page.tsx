// src/app/(auth)/login/page.tsx
"use client";
import React, { useState, Suspense, useEffect } from "react";
import {
  useRouter,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";
import {
  LogIn,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { SEO } from "../../../components/SEO";

// Move the main login logic to a separate component that uses useSearchParams
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if user came from checkout
  const from = searchParams.get("from") || "/";
  const isFromCheckout =
    from === "/checkout" ||
    sessionStorage.getItem("redirectAfterLogin") === "/checkout";

  // Show message if coming from checkout
  useEffect(() => {
    if (isFromCheckout) {
      setRedirectMessage(
        "Please log in to complete your order. You'll be redirected to checkout after logging in.",
      );
    }
  }, [isFromCheckout]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Check if user is admin by fetching role from Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const userData = userDoc.data();
      const isAdmin =
        userData?.role === "admin" ||
        email === "admin@zovallo.com" ||
        email.toLowerCase().startsWith("admin");

      // Check if we have a redirect path stored
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");

      // Clear the stored redirect
      sessionStorage.removeItem("redirectAfterLogin");

      // Redirect based on role and stored path
      if (isAdmin && !redirectPath) {
        router.push("/admin");
      } else if (redirectPath) {
        // Redirect to the stored path (checkout or other)
        router.push(redirectPath);
      } else if (isAdmin && from === "/") {
        router.push("/admin");
      } else {
        // Normal redirect
        router.replace(from);
      }
    } catch (err: any) {
      console.error(err);
      let message = "Failed to sign in. Please check your credentials.";
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        message = "Invalid email or password.";
      } else if (err.code === "auth/too-many-requests") {
        message = "Too many failed login attempts. Please try again later.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-cream/20">
      <SEO
        title="Sign In"
        description="Access your Royal Furniture account to manage your orders and curated furniture collection."
      />
      <div className="max-w-md w-full space-y-8 bg-white border border-warm-beige p-6 sm:p-8 md:p-12 shadow-sm rounded-sm">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <LogIn className="w-10 h-10 text-walnut" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display text-near-black">
            Welcome Back
          </h1>
          <p className="text-gray-666 font-light text-sm">
            Access your curated furniture collection
          </p>
        </div>

        {/* Redirect Message from Checkout */}
        {redirectMessage && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <ShoppingBag className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800">
                  Complete Your Order
                </p>
                <p className="text-sm text-amber-700">{redirectMessage}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 flex items-center gap-3 text-sm rounded"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-[10px] font-bold uppercase tracking-widest text-walnut block"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-a0" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-cream border border-warm-beige py-3 pl-10 pr-4 text-sm outline-none focus:border-gold transition-colors rounded"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-[10px] font-bold uppercase tracking-widest text-walnut block"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-a0" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cream border border-warm-beige py-3 pl-10 pr-4 text-sm outline-none focus:border-gold transition-colors rounded"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-near-black text-white py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-gold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm active:scale-[0.98] rounded"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-warm-beige space-y-4">
          <p className="text-xs text-gray-666 font-light">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-walnut font-bold hover:underline underline-offset-4"
            >
              Register Now
            </Link>
          </p>

          {/* Back to Checkout link (only show if from checkout) */}
          {isFromCheckout && (
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-600 hover:text-amber-700 transition-colors group"
            >
              <ArrowRight className="w-3 h-3 -rotate-180 group-hover:-translate-x-1 transition-transform" />
              Back to Checkout
            </Link>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-a0 hover:text-near-black transition-colors group"
          >
            <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
