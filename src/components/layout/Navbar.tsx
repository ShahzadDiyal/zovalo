"use client";

import {
  ShoppingBag,
  User,
  Menu,
  X,
  Search,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { categoryApi } from "../../services/categoryApi";
import { Category } from "../../types";
import { LoadingSpinner } from "../ui/Loading";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { totalItems, subtotal } = useCart();
  const { user, profile, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>(
    {},
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch real categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Build category hierarchy
  const getTopLevelCategories = () => {
    return categories.filter((cat) => !cat.parentId);
  };

  const getChildCategories = (parentId: string) => {
    return categories.filter((cat) => cat.parentId === parentId);
  };

  const toggleSubmenu = (categoryId: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
      setShowUserMenu(false);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q") as string;
    if (query && query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  if (!mounted) return null;

  // Recursive component for category tree
  const CategoryTreeItem = ({
    category,
    level = 0,
  }: {
    category: Category;
    level?: number;
  }) => {
    const childCategories = getChildCategories(category.id);
    const hasChildren = childCategories.length > 0;
    const isOpen = openSubmenus[category.id];

    return (
      <div className="relative">
        <Link
          href={`/category/${category.slug}`}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              toggleSubmenu(category.id);
            } else {
              setIsOpen(false);
            }
          }}
          className={`flex items-center justify-between text-[11px] font-bold text-gray-666 hover:text-near-black uppercase tracking-widest transition-colors relative group py-2 px-3 rounded-lg ${
            level > 0 ? "ml-4" : ""
          }`}
          style={{ marginLeft: level * 12 }}
        >
          <span>{category.name}</span>
          {hasChildren && (
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          )}
        </Link>

        {hasChildren && isOpen && (
          <div className="absolute left-0 top-full mt-1 bg-white border border-warm-beige shadow-lg rounded-lg py-2 min-w-[200px] z-50">
            {childCategories.map((child) => (
              <Link
                key={child.id}
                href={`/category/${child.slug}`}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-[11px] font-bold text-gray-666 hover:text-near-black hover:bg-cream uppercase tracking-widest transition-colors"
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Recursive component for mobile menu
  const MobileCategoryItem = ({
    category,
    level = 0,
  }: {
    category: Category;
    level?: number;
  }) => {
    const childCategories = getChildCategories(category.id);
    const hasChildren = childCategories.length > 0;
    const isOpen = openSubmenus[category.id];

    return (
      <div>
        <div
          onClick={() => {
            if (hasChildren) {
              toggleSubmenu(category.id);
            } else {
              router.push(`/category/${category.slug}`);
              setIsOpen(false);
            }
          }}
          className={`flex items-center justify-between py-2 px-3 cursor-pointer rounded-lg ${level > 0 ? "ml-4" : ""}`}
          style={{ marginLeft: level * 16 }}
        >
          <span className="text-sm font-medium text-near-black hover:text-gold transition-colors">
            {category.name}
          </span>
          {hasChildren && (
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          )}
        </div>

        {hasChildren && isOpen && (
          <div className="mt-1 space-y-1">
            {childCategories.map((child) => (
              <MobileCategoryItem
                key={child.id}
                category={child}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const topLevelCategories = getTopLevelCategories();

  return (
    <nav className="fixed top-0 w-full z-50 shadow-sm">
      {/* Header 01: Announcement Bar */}
      <div className="bg-amber-800 text-cream text-[10px] sm:text-[11px] py-2 text-center tracking-[0.15em] font-medium uppercase px-4 flex justify-center items-center gap-4 flex-wrap">
        <p>
          Free Delivery Across UK | Cash On Delivery Available{" "}
          <span className=" italic underline font-bold">
            {" "}
            (No Upfront Required){" "}
          </span>
          | Premium Furniture Collection
        </p>
        {isAdmin && (
          <Link
            href="/admin"
            className="hidden md:block bg-gold text-near-black px-2 py-0.5 rounded text-[9px] font-bold hover:bg-white transition-colors ml-4"
          >
            GO TO ADMIN PANEL
          </Link>
        )}
      </div>

      {/* Header 02: Main Header */}
      <div className="bg-white border-b border-warm-beige px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tighter text-near-black">
              Royal Furniture<span className="text-gold">.</span>
            </h1>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-2xl hidden md:block">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-a0 group-focus-within:text-gold transition-colors" />
            <input
              name="q"
              type="text"
              placeholder="Search for sofas, beds, dining tables..."
              className="w-full bg-[#F5F5F2] border border-transparent rounded-full py-2.5 pl-11 pr-4 text-[13px] focus:bg-white focus:border-gold focus:ring-4 focus:ring-gold/5 outline-none transition-all placeholder:text-gray-a0/70"
            />
          </form>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          {/* User Menu - Desktop */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-near-black hover:text-gold transition-colors group"
              >
                <div className="w-8 h-8 bg-cream border border-warm-beige rounded-full flex items-center justify-center overflow-hidden">
                  {profile?.avatar || user.photoURL ? (
                    <img
                      src={profile?.avatar || user.photoURL || ""}
                      alt={user.displayName || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-near-black" />
                  )}
                </div>
                <span className="hidden lg:inline">My Account</span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-warm-beige shadow-lg z-50 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-warm-beige bg-cream/30">
                      <p className="text-sm font-bold text-near-black truncate">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-near-black hover:bg-cream transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-near-black hover:bg-cream transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-warm-beige mt-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-near-black hover:text-gold transition-colors group"
            >
              <User className="w-5 h-5" />
              <span className="hidden lg:inline">Sign In</span>
            </Link>
          )}

          <div className="w-px h-6 bg-warm-beige hidden sm:block"></div>

          <Link
            href="/cart"
            className="relative flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-near-black hover:text-gold transition-colors group"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-white text-[9px] font-bold px-1 rounded-full min-w-[15px] h-[15px] flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden lg:inline">
              Cart (£
              {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              )
            </span>
          </Link>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <X className="w-6 h-6 text-walnut" />
            ) : (
              <Menu className="w-6 h-6 text-walnut" />
            )}
          </button>
        </div>
      </div>

      {/* Header 03: Navigation Menu Bar with Dropdowns */}
      <div className="bg-white border-b border-warm-beige hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          {loadingCategories ? (
            <div className="flex items-center justify-center h-12">
              <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-6 h-12">
              {topLevelCategories.map((cat) => {
                const childCategories = getChildCategories(cat.id);
                const hasChildren = childCategories.length > 0;

                return (
                  <div key={cat.id} className="relative group">
                    <Link
                      href={`/category/${cat.slug}`}
                      className="text-[11px] font-bold text-gray-666 hover:text-near-black uppercase tracking-widest transition-colors relative py-2 flex items-center gap-1"
                    >
                      {cat.name}
                      {hasChildren && <ChevronDown className="w-3 h-3" />}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
                    </Link>

                    {/* Dropdown for child categories */}
                    {hasChildren && (
                      <div className="absolute left-0 top-full mt-1 bg-white border border-warm-beige shadow-lg rounded-lg py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        {childCategories.map((child) => (
                          <Link
                            key={child.id}
                            href={`/category/${child.slug}`}
                            className="block px-4 py-2 text-[11px] font-bold text-gray-666 hover:text-near-black hover:bg-cream uppercase tracking-widest transition-colors whitespace-nowrap"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu with Hierarchy */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-warm-beige py-3 md:py-6 px-2 md:px-6 space-y-4 md:space-y-8 shadow-2xl overflow-y-auto max-h-[80vh]">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-a0" />
            <input
              name="q"
              type="text"
              placeholder="Search collections..."
              className="w-full bg-cream border border-warm-beige rounded-none py-3 pl-11 pr-4 text-sm outline-none focus:border-gold"
            />
          </form>

          <div className="space-y-6">
            {/* User Info - Mobile */}
            {user && (
              <div className="flex items-center gap-3 p-4 bg-cream/30 border border-warm-beige rounded-lg">
                <div className="w-12 h-12 bg-cream border border-warm-beige rounded-full flex items-center justify-center overflow-hidden">
                  {profile?.avatar || user.photoURL ? (
                    <img
                      src={profile?.avatar || user.photoURL || ""}
                      alt={user.displayName || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-near-black" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-near-black">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-[10px] text-gray-500">{user.email}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-a0 uppercase tracking-[0.25em] border-b border-warm-beige pb-2">
                Collections
              </p>
              {loadingCategories ? (
                <div className="flex justify-center py-4">
                  <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-1">
                  {topLevelCategories.map((cat) => (
                    <MobileCategoryItem key={cat.id} category={cat} />
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-warm-beige">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="bg-near-black text-white py-3 text-[11px] font-bold uppercase tracking-widest text-center rounded"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white py-3 text-[11px] font-bold uppercase tracking-widest text-center rounded hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    onClick={() => setIsOpen(false)}
                    className="bg-near-black text-white py-3 text-[11px] font-bold uppercase tracking-widest text-center rounded"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="bg-warm-beige text-near-black py-3 text-[11px] font-bold uppercase tracking-widest text-center rounded"
                  >
                    Register
                  </Link>
                </>
              )}
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="bg-warm-beige text-near-black py-3 text-[11px] font-bold uppercase tracking-widest text-center rounded col-span-2"
              >
                Cart ({totalItems}) - £
                {subtotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
