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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { profile, logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Tags, label: "Categories", path: "/admin/categories" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
    { icon: Users, label: "Customers", path: "/admin/users" },
    { icon: MessageCircle, label: "Messages", path: "/admin/messages" },
    // { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

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
          <div className="flex items-center justify-between mb-12">
            <Link
              href="/"
              className="text-xl font-display tracking-tighter hover:text-gold transition-colors"
            >
              Royal Furniture{" "}
              <span className="text-[10px] tracking-widest font-sans font-bold bg-gold px-2 py-0.5 rounded ml-2">
                ADMIN
              </span>
            </Link>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded text-sm transition-all duration-200
                    ${
                      isActive
                        ? "bg-gold text-near-black font-bold"
                        : "text-gray-400 hover:text-white hover:bg-near-black/50"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              );
            })}
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
                <p className="text-[10px] text-gray-400 truncateCapitalize">
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
