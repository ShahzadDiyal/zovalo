"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { categoryApi } from "../../services/categoryApi";
import { Category } from "../../types";

export function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (!mounted) return null;

  return (
    <footer className="bg-white border-t border-warm-beige pt-20 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-near-black">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center">
              <h2 className="text-2xl font-bold tracking-tighter text-near-black">
                Royal Furniture<span className="text-gold">.</span>
              </h2>
            </Link>
            <p className="text-[13px] text-gray-666 leading-relaxed max-w-xs font-light">
              Crafting premium furniture for the modern home. Our pieces blend
              traditional joinery with timeless silhouettes.
            </p>
          </div>

          {/* Shop Collections - Dynamic Categories */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-walnut">
              Shop Collections
            </h4>
            {loading ? (
              <div className="space-y-2">
                <div className="h-3 bg-cream animate-pulse rounded w-24"></div>
                <div className="h-3 bg-cream animate-pulse rounded w-28"></div>
                <div className="h-3 bg-cream animate-pulse rounded w-20"></div>
              </div>
            ) : (
              <ul className="space-y-3 text-[13px] text-gray-666 font-light">
                {categories.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="hover:text-gold transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-walnut">
              Client Services
            </h4>
            <ul className="space-y-3 text-[13px] text-gray-666 font-light">
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-gold transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="hover:text-gold transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-gold transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-gold transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-gold transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-walnut">
              Journal
            </h4>
            <p className="text-[13px] text-gray-666 font-light">
              Subscribe for design inspiration and early access to our seasonal
              edits.
            </p>
            <div className="flex border-b border-warm-beige pb-1 focus-within:border-gold transition-colors">
              <input
                type="email"
                placeholder="Email address"
                className="bg-transparent px-0 py-2 text-[13px] text-near-black outline-none w-full placeholder:text-gray-a0 font-light"
              />
              <button className="text-[11px] font-bold uppercase tracking-widest text-walnut hover:text-gold ml-2">
                JOIN
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Utility Bar */}
        <div className="border-t border-warm-beige pt-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-a0">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-olive" />
              <span>Cash on Delivery Only</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span>Secure Fulfillment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-walnut" />
              <span>UK Wide Logistics</span>
            </div>
          </div>

          <p className="text-[10px] text-gray-a0 font-bold uppercase tracking-[0.15em]">
            © {new Date().getFullYear()} Royal FurnitureFURNITURE LTD
          </p>
        </div>
      </div>
    </footer>
  );
}
