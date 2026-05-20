"use client";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { SEO } from "../../../components/SEO";
import { useRouter } from "next/navigation";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Check if email is admin
  const isAdminEmail = (email: string): boolean => {
    return (
      email === "admin@zovallo.com" || email.toLowerCase().startsWith("admin")
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Update auth profile
      await updateProfile(user, { displayName: name });

      // Create Firestore document with proper role
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: isAdminEmail(email) ? "admin" : "user",
        createdAt: serverTimestamp(),
      });

      // Redirect based on role
      if (isAdminEmail(email)) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error(err);
      let message = "Failed to create account. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        message = "This email is already registered.";
      } else if (err.code === "auth/invalid-email") {
        message = "Please provide a valid email address.";
      } else if (err.code === "auth/weak-password") {
        message = "Password is too weak. Please use at least 6 characters.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-cream/20">
      <SEO
        title="Create Account"
        description="Join the Zovallo community to manage your curated furniture orders and preferences."
      />
      <div className="max-w-md w-full space-y-8 bg-white border border-warm-beige p-6 sm:p-8 md:p-12 shadow-sm rounded-sm">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <UserPlus className="w-10 h-10 text-walnut" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display text-near-black">
            Join Zovallo
          </h1>
          <p className="text-gray-666 font-light text-sm">
            Create an account for a seamless experience
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 flex items-center gap-3 text-sm rounded"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-[10px] font-bold uppercase tracking-widest text-walnut block"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-a0" />
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-cream border border-warm-beige py-3 pl-10 pr-4 text-sm outline-none focus:border-gold transition-colors rounded"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  minLength={6}
                  className="w-full bg-cream border border-warm-beige py-3 pl-10 pr-4 text-sm outline-none focus:border-gold transition-colors rounded"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-[10px] font-bold uppercase tracking-widest text-walnut block"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-a0" />
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
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
            {loading ? "Creating Account..." : "Register"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-warm-beige space-y-4">
          <p className="text-xs text-gray-666 font-light">
            Already have an account?{" "}
            <Link
              href="/auth"
              className="text-walnut font-bold hover:underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
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

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
