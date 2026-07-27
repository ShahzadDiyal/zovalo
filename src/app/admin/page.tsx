"use client";
import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "../../lib/utils";
import { Order } from "../../types";
import { dashboardApi } from "../../services/dashboardApi";
import { orderApi } from "../../services/orderApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, recentOrdersData] = await Promise.all([
        dashboardApi.getStats(),
        orderApi.getRecentOrders(5),
      ]);

      setStats(statsData);
      setRecentOrders(recentOrdersData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const cards = [
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      color: "bg-mint-50 text-mint-700",
      growth: "+12.5%",
      isUp: true,
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: "bg-gold/10 text-near-black",
      growth: "+8.2%",
      isUp: true,
    },
    {
      label: "Total Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "bg-near-black text-white",
      growth: "3 New",
      isUp: true,
    },
    {
      label: "Total Customers",
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: "bg-warm-beige text-walnut",
      growth: "-2.4%",
      isUp: false,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] sm:min-h-[60vh] md:min-h-[400px]">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 sm:border-3 border-gold border-t-transparent rounded-full animate-spin"></div>
          <div className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-gold animate-pulse">
            Loading Analytics...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6 md:space-y-8 lg:space-y-10 px-3 sm:px-4 md:px-5 lg:px-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 md:gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display text-near-black uppercase tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-400 text-[11px] sm:text-xs md:text-sm mt-1">
            Real-time overview of your furniture boutique.
          </p>
        </div>

        {/* Action Buttons - Responsive */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white border border-warm-beige px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 hover:bg-cream transition-colors disabled:opacity-50 rounded"
          >
            <RefreshCw
              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden xs:inline">Refresh</span>
          </button>
          <button className="bg-white border border-warm-beige px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 hover:bg-cream transition-colors rounded">
            <Filter className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">Filter</span>
          </button>
          <button className="bg-near-black text-white px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 hover:bg-gold transition-colors rounded">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">This Month</span>
          </button>
        </div>
      </div>

      {/* Stat Cards - Responsive Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white border border-warm-beige p-3 sm:p-4 md:p-5 lg:p-6 relative overflow-hidden group hover:shadow-lg transition-shadow duration-300 rounded-lg"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className={`p-1.5 sm:p-2 md:p-3 rounded-lg ${card.color}`}>
                <card.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
              <div
                className={`flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[9px] md:text-[10px] font-bold ${card.isUp ? "text-mint-700" : "text-red-500"}`}
              >
                {card.growth}
                {card.isUp ? (
                  <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                ) : (
                  <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                )}
              </div>
            </div>
            <div className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 relative z-10">
              <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5 sm:mb-1">
                {card.label}
              </p>
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-display font-bold text-near-black break-words">
                {card.value}
              </h3>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-cream/30 rounded-full translate-x-12 md:translate-x-16 -translate-y-12 md:-translate-y-16 group-hover:scale-110 transition-transform duration-500" />
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="flex flex-col gap-5 sm:gap-6 md:gap-8">
        {/* Recent Orders Table */}
        <div className="bg-white border border-warm-beige overflow-hidden rounded-lg">
          {/* Table Header */}
          <div className="p-3 sm:p-4 md:p-5 lg:p-6 border-b border-warm-beige flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 sm:gap-3">
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-widest text-near-black">
              Recent Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gold hover:underline"
            >
              View All →
            </Link>
          </div>

          {/* Responsive Table - Horizontal Scroll on Mobile */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] sm:min-w-[600px] md:min-w-full">
              <thead>
                <tr className="bg-cream/50">
                  <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Order ID
                  </th>
                  <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Customer
                  </th>
                  <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Total
                  </th>
                  <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Status
                  </th>
                  <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4 text-right text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-beige">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 sm:px-4 md:px-5 lg:px-6 py-8 sm:py-10 md:py-12 text-center text-gray-400 text-xs sm:text-sm"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-cream/20 transition-colors"
                    >
                      <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4">
                        <span className="font-mono text-[10px] sm:text-xs font-bold">
                          #{order.id?.slice(-6).toUpperCase() || "N/A"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4">
                        <div className="flex flex-col">
                          <span className="text-xs sm:text-sm font-bold text-near-black truncate max-w-[120px] sm:max-w-[150px] md:max-w-none">
                            {order.customerInfo?.fullName || "Unknown"}
                          </span>
                          <span className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-400 uppercase tracking-tighter">
                            {order.customerInfo?.city || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4">
                        <span className="text-xs sm:text-sm font-medium">
                          {formatCurrency(order.totalPrice || 0)}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4">
                        <span
                          className={`inline-block px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 text-[7px] sm:text-[8px] md:text-[9px] font-bold uppercase tracking-widest rounded-full whitespace-nowrap ${
                            order.orderStatus === "delivered"
                              ? "bg-mint-50 text-mint-700"
                              : order.orderStatus === "pending"
                                ? "bg-gold/10 text-walnut"
                                : order.orderStatus === "processing"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {order.orderStatus || "pending"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-near-black hover:text-gold transition-colors"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
