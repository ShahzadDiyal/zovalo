"use client";
import  { useState, useEffect } from "react";
import {
  Search,
  Package,
  Eye,
} from "lucide-react";
import { formatCurrency } from "../../../lib/utils";
import { Order } from "../../../types";
import { orderApi } from "../../../services/orderApi";
import { LoadingSpinner } from "../../../components/ui/Loading";
import { EmptyState } from "../../../components/ui/EmptyState";
import { useRouter } from "next/navigation";

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      statusFilter === "All" || o.orderStatus === statusFilter.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(query) ||
      o.customerInfo.fullName.toLowerCase().includes(query) ||
      o.customerInfo.email.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const stats = [
    {
      label: "Pending",
      count: orders.filter((o) => o.orderStatus === "pending").length,
      color: "text-gold",
    },
    {
      label: "Processing",
      count: orders.filter((o) => o.orderStatus === "processing").length,
      color: "text-near-black",
    },
    {
      label: "Shipped",
      count: orders.filter((o) => o.orderStatus === "shipped").length,
      color: "text-blue-500",
    },
    {
      label: "Delivered",
      count: orders.filter((o) => o.orderStatus === "delivered").length,
      color: "text-mint-700",
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 md:space-y-8 lg:space-y-10 px-3 sm:px-4 md:px-5 lg:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 md:gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display text-near-black uppercase tracking-tight">
            Order Fulfilment
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Manage deliveries and customer satisfaction.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 sm:gap-5 md:gap-6">
          {stats.map((s, idx) => (
            <div key={idx} className="text-right">
              <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5 sm:mb-1">
                {s.label}
              </p>
              <p
                className={`text-base sm:text-lg md:text-xl font-display font-bold ${s.color}`}
              >
                {s.count}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
        {/* Orders List */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white border border-warm-beige p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 rounded-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders (ID, Customer, Email)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-cream border-none py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm focus:ring-1 focus:ring-gold outline-none rounded"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-cream border-none py-2 sm:py-2.5 px-3 sm:px-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest outline-none rounded"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* Orders Table */}
          <div className="bg-white border border-warm-beige overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] sm:min-w-[600px]">
                <thead>
                  <tr className="bg-cream/50">
                    <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Order Ref
                    </th>
                    <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Customer
                    </th>
                    <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Date
                    </th>
                    <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Total
                    </th>
                    <th className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4 text-right text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-beige">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 sm:px-4 md:px-5 lg:px-6 py-12 sm:py-16 md:py-20 lg:py-24"
                      >
                        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
                          <LoadingSpinner />
                          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-gold text-center">
                            Scanning ledger...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 sm:px-4 md:px-5 lg:px-6 py-12 sm:py-16 md:py-20"
                      >
                        <EmptyState
                          icon={Package}
                          title="No Orders Found"
                          description="We couldn't find any orders matching your current filters."
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-cream/20 transition-colors cursor-pointer"
                        onClick={() => handleViewDetails(order.id)}
                      >
                        <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6">
                          <span className="font-mono text-[10px] sm:text-xs font-bold">
                            #{order.id.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6">
                          <span className="text-xs sm:text-sm font-bold text-near-black line-clamp-1">
                            {order.customerInfo.fullName}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6">
                          <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            {order.createdAt
                              ?.toDate()
                              .toLocaleDateString("en-GB")}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6">
                          <span className="text-xs sm:text-sm font-medium">
                            {formatCurrency(order.totalPrice)}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(order.id);
                            }}
                            className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gold hover:bg-gold/10 rounded transition-colors"
                          >
                            <Eye className="w-3 h-3" /> View
                          </button>
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
    </div>
  );
}
