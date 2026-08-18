"use client";
import React, { useState } from "react";
import Link from "next/link";

import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Search,
  Bell,
  MessageCircle,
  FileText,
  FolderTree,
  MapPin,
  Globe,
  PlusCircle,
  Palette,
  Star,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    blog: true,
    locations: true,
  });
  const pathname = usePathname();
  const router = useRouter();
  const { profile, logout } = useAuth();

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-near-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-near-black text-white z-50 transition-transform duration-300 transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-3 sm:p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="text-xl font-display tracking-tighter hover:text-gold transition-colors"
            >
              Royal Furniture{" "}
              <span className="text-[10px] tracking-widest font-bold bg-gold px-2 py-0.5 rounded ml-2">
                ADMIN
              </span>
            </Link>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto space-y-1">
            {/* Dashboard */}
            <Link
              href="/admin"
              className={`
                flex items-center justify-between px-4 py-3 rounded text-sm transition-all duration-200
                ${
                  isActive("/admin")
                    ? "bg-gold text-near-black font-bold"
                    : "text-gray-400 hover:text-white hover:bg-near-black/50"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </div>
              {isActive("/admin") && <ChevronRight className="w-4 h-4" />}
            </Link>

            {/* Categories */}
            <Link
              href="/admin/categories"
              className={`
                flex items-center justify-between px-4 py-3 rounded text-sm transition-all duration-200
                ${
                  isActive("/admin/categories")
                    ? "bg-gold text-near-black font-bold"
                    : "text-gray-400 hover:text-white hover:bg-near-black/50"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Tags className="w-5 h-5" />
                Categories
              </div>
              {isActive("/admin/categories") && (
                <ChevronRight className="w-4 h-4" />
              )}
            </Link>

            {/* Products */}
            <Link
              href="/admin/products"
              className={`
                flex items-center justify-between px-4 py-3 rounded text-sm transition-all duration-200
                ${
                  isActive("/admin/products")
                    ? "bg-gold text-near-black font-bold"
                    : "text-gray-400 hover:text-white hover:bg-near-black/50"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5" />
                Products
              </div>
              {isActive("/admin/products") && (
                <ChevronRight className="w-4 h-4" />
              )}
            </Link>

            {/* Orders */}
            <Link
              href="/admin/orders"
              className={`
                flex items-center justify-between px-4 py-3 rounded text-sm transition-all duration-200
                ${
                  isActive("/admin/orders")
                    ? "bg-gold text-near-black font-bold"
                    : "text-gray-400 hover:text-white hover:bg-near-black/50"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                Orders
              </div>
              {isActive("/admin/orders") && (
                <ChevronRight className="w-4 h-4" />
              )}
            </Link>

            {/* Users/Customers */}
            <Link
              href="/admin/users"
              className={`
                flex items-center justify-between px-4 py-3 rounded text-sm transition-all duration-200
                ${
                  isActive("/admin/users")
                    ? "bg-gold text-near-black font-bold"
                    : "text-gray-400 hover:text-white hover:bg-near-black/50"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                Customers
              </div>
              {isActive("/admin/users") && <ChevronRight className="w-4 h-4" />}
            </Link>

            {/* Messages */}
            <Link
              href="/admin/messages"
              className={`
                flex items-center justify-between px-4 py-3 rounded text-sm transition-all duration-200
                ${
                  isActive("/admin/messages")
                    ? "bg-gold text-near-black font-bold"
                    : "text-gray-400 hover:text-white hover:bg-near-black/50"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5" />
                Messages
              </div>
              {isActive("/admin/messages") && (
                <ChevronRight className="w-4 h-4" />
              )}
            </Link>
            <Link
  href="/admin/colors"
  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-cream hover:text-near-black rounded transition-colors"
>
  <Palette className="w-4 h-4" />
  Colors
</Link>

            {/* Reviews */}
            <Link
              href="/admin/reviews"
              className={`
                flex items-center justify-between px-4 py-3 rounded text-sm transition-all duration-200
                ${
                  isActive("/admin/reviews")
                    ? "bg-gold text-near-black font-bold"
                    : "text-gray-400 hover:text-white hover:bg-near-black/50"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5" />
                Reviews
              </div>
              {isActive("/admin/reviews") && (
                <ChevronRight className="w-4 h-4" />
              )}
            </Link>

            {/* Blog Section */}
            <div className="mt-4">
              <button
                onClick={() => toggleSection("blog")}
                className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Blog
                </span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${expandedSections.blog ? "rotate-90" : ""}`}
                />
              </button>

              {expandedSections.blog && (
                <div className="ml-2 space-y-0.5 border-l border-gray-700 pl-2">
                  <Link
                    href="/admin/blogs"
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded text-sm transition-all duration-200
                      ${
                        isActive("/admin/blogs") &&
                        !isActive("/admin/blogs/categories") &&
                        !isActive("/admin/blogs/create")
                          ? "bg-gold text-near-black font-bold"
                          : "text-gray-400 hover:text-white hover:bg-near-black/50"
                      }
                    `}
                  >
                    <FileText className="w-4 h-4" />
                    All Posts
                  </Link>
                  <Link
                    href="/admin/blogs/create"
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded text-sm transition-all duration-200
                      ${
                        isActive("/admin/blogs/create")
                          ? "bg-gold text-near-black font-bold"
                          : "text-gray-400 hover:text-white hover:bg-near-black/50"
                      }
                    `}
                  >
                    <PlusCircle className="w-4 h-4" />
                    Create Post
                  </Link>
                  <Link
                    href="/admin/blogs/categories"
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded text-sm transition-all duration-200
                      ${
                        isActive("/admin/blogs/categories")
                          ? "bg-gold text-near-black font-bold"
                          : "text-gray-400 hover:text-white hover:bg-near-black/50"
                      }
                    `}
                  >
                    <FolderTree className="w-4 h-4" />
                    Categories
                  </Link>
                </div>
              )}
            </div>

            {/* Locations Section */}
            <div className="mt-2">
              <button
                onClick={() => toggleSection("locations")}
                className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Locations
                </span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${expandedSections.locations ? "rotate-90" : ""}`}
                />
              </button>

              {expandedSections.locations && (
                <div className="ml-2 space-y-0.5 border-l border-gray-700 pl-2">
                  <Link
                    href="/admin/cities"
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded text-sm transition-all duration-200
                      ${
                        isActive("/admin/cities") &&
                        !isActive("/admin/cities/create") &&
                        !isActive("/admin/cities/edit")
                          ? "bg-gold text-near-black font-bold"
                          : "text-gray-400 hover:text-white hover:bg-near-black/50"
                      }
                    `}
                  >
                    <Globe className="w-4 h-4" />
                    All Cities
                  </Link>
                  <Link
                    href="/admin/cities/create"
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded text-sm transition-all duration-200
                      ${
                        isActive("/admin/cities/create")
                          ? "bg-gold text-near-black font-bold"
                          : "text-gray-400 hover:text-white hover:bg-near-black/50"
                      }
                    `}
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add New City
                  </Link>
                </div>
              )}
            </div>
          </nav>

          <div className="mt-auto pt-8 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 mb-6">
              <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-near-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">
                  {profile?.displayName || "Admin"}
                </p>
                <p className="text-[10px] text-gray-400 truncate">
                  {profile?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-400 hover:text-gold transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white h-20 border-b border-warm-beige px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-near-black"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search analytics, products, users..."
                className="bg-cream border-none py-2 pl-10 pr-4 text-xs w-64 focus:ring-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-near-black hover:text-gold transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-px h-8 bg-warm-beige hidden sm:block" />
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                Session ID
              </p>
              <p className="text-xs font-mono text-walnut font-bold">
                #ADM-8234-91
              </p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
