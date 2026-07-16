"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Printer,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Clock,
  AlertCircle,
  Ruler,
  Weight,
  Palette,
  Sofa,
  Wrench,
  Tag,
} from "lucide-react";
import { formatCurrency } from "../../../../lib/utils";
import { Order } from "../../../../types";
import { orderApi } from "../../../../services/orderApi";
import { useRouter } from "next/navigation";

export default function AdminOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getById(orderId!);
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: Order["orderStatus"]) => {
    if (!order) return;
    setUpdating(true);
    try {
      await orderApi.updateOrderStatus(order.id, newStatus);
      setOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const printInvoice = () => {
    if (!order) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to print the invoice");
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${order.id.slice(-8).toUpperCase()}</title>
        <style>
          @media print { body { margin: 0; padding: 20px; } }
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #c1a57b; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: bold; }
          .logo span { color: #c1a57b; }
          .info-section { display: flex; justify-content: space-between; background: #f5f5f2; padding: 15px; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
          .info-box { flex: 1; min-width: 200px; }
          .info-box h3 { font-size: 12px; color: #8b6b3d; margin-bottom: 8px; }
          .info-box p { font-size: 11px; margin: 3px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #f5f5f2; padding: 10px; text-align: left; font-size: 10px; border-bottom: 1px solid #ddd; }
          td { padding: 10px; font-size: 11px; border-bottom: 1px solid #eee; }
          .totals { text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #c1a57b; }
          .grand-total { font-size: 18px; font-weight: bold; color: #c1a57b; margin-top: 10px; }
          .footer { text-align: center; margin-top: 40px; font-size: 9px; border-top: 1px solid #ddd; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Royal Furniture<span>.</span></div>
          <h2>TAX INVOICE</h2>
        </div>
        <div class="info-section">
          <div class="info-box">
            <h3>ORDER DETAILS</h3>
            <p><strong>Order #:</strong> ${order.id.slice(-8).toUpperCase()}</p>
            <p><strong>Date:</strong> ${order.createdAt?.toDate().toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${order.orderStatus}</p>
          </div>
          <div class="info-box">
            <h3>CUSTOMER</h3>
            <p><strong>${order.customerInfo.fullName}</strong></p>
            <p>${order.customerInfo.email}</p>
            <p>${order.customerInfo.phone}</p>
            ${order.customerInfo.alternativePhone ? `<p>Alt: ${order.customerInfo.alternativePhone}</p>` : ""}
          </div>
          <div class="info-box">
            <h3>SHIPPING ADDRESS</h3>
            <p>${order.customerInfo.address}</p>
            <p>${order.customerInfo.city}, ${order.customerInfo.postalCode}</p>
            <p>${order.customerInfo.country}</p>
          </div>
        </div>
        <table>
          <thead><tr><th>Product</th><th>Title</th><th>Options</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
          <tbody>
            ${order.products
              .map(
                (p) => `
              <tr>
                <td><img src="${p.image}" width="50" height="50" style="object-fit:cover" /></td>
                <td><strong>${p.title}</strong></td>
                <td>
                  ${p.selectedOptions?.color ? `<div>Color: ${p.selectedOptions.color}</div>` : ""}
                  ${p.selectedOptions?.seater ? `<div>Seater: ${p.selectedOptions.seater}</div>` : ""}
                  ${p.dimensions ? `<div>Dimensions: ${p.dimensions}</div>` : ""}
                </td>
                <td>${p.quantity}</td>
                <td>${formatCurrency(p.price)}</td>
                <td>${formatCurrency(p.price * p.quantity)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        <div class="totals">
          <p><strong>Subtotal:</strong> ${formatCurrency(order.totalPrice)}</p>
          <p><strong>Delivery:</strong> FREE</p>
          <div class="grand-total"><strong>GRAND TOTAL:</strong> ${formatCurrency(order.totalPrice)}</div>
        </div>
        <div class="footer">
          <p>Payment: Cash on Delivery | Thank you for shopping with Royal Furniture!</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
        <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-gold animate-pulse">
          Accessing Secure Records...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px] md:min-h-[600px] space-y-3 sm:space-y-4 px-4">
        <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300" />
        <p className="text-gray-400 font-medium text-sm sm:text-base">
          Order not found in our database.
        </p>
        <Link
          href="/admin/orders"
          className="text-gold font-bold uppercase tracking-widest text-[9px] sm:text-[10px] hover:underline"
        >
          Return to Ledger
        </Link>
      </div>
    );
  }

  const statusColors = {
    pending: "bg-gold/10 text-walnut border-gold/20",
    processing: "bg-near-black/5 text-near-black border-near-black/10",
    shipped: "bg-blue-50 text-blue-600 border-blue-100",
    delivered: "bg-mint-50 text-mint-700 border-mint-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-5 lg:px-6 space-y-6 sm:space-y-8 md:space-y-10 pb-12 sm:pb-16 md:pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5 md:gap-6">
        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={() => router.push("/admin/orders")}
            className="flex items-center gap-1.5 sm:gap-2 text-gray-400 hover:text-near-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
              Back to Ledger
            </span>
          </button>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display text-near-black uppercase tracking-tight">
              Order #{order.id.slice(-8).toUpperCase()}
            </h1>
            <span
              className={`px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-sm border text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] ${statusColors[order.orderStatus]}`}
            >
              {order.orderStatus}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-gray-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {order.createdAt?.toDate().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {order.createdAt?.toDate().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={printInvoice}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 bg-white border border-warm-beige text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-near-black hover:bg-cream transition-colors rounded"
          >
            <Printer className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />{" "}
            Print Invoice
          </button>
          <div className="relative group">
            <button
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 bg-near-black text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-colors disabled:opacity-50 rounded"
              disabled={updating}
            >
              Update Status {updating && "..."}
            </button>
            <div className="absolute right-0 top-full mt-2 w-44 sm:w-48 bg-white border border-warm-beige shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 rounded">
              {(
                [
                  "pending",
                  "processing",
                  "shipped",
                  "delivered",
                  "cancelled",
                ] as Order["orderStatus"][]
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(status)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-cream transition-colors disabled:opacity-50"
                  disabled={order.orderStatus === status}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8 md:space-y-10">
          {/* Products Table with Specifications */}
          <section className="bg-white border border-warm-beige overflow-hidden rounded-lg">
            <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 border-b border-warm-beige flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-cream/30">
              <h2 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-near-black">
                Order Contents
              </h2>
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {order.products.length} Items
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-cream/50">
                    <th className="px-3 py-2 text-left text-[9px] font-bold uppercase">
                      Product
                    </th>
                    <th className="px-3 py-2 text-left text-[9px] font-bold uppercase">
                      Details
                    </th>
                    <th className="px-3 py-2 text-center text-[9px] font-bold uppercase">
                      Qty
                    </th>
                    <th className="px-3 py-2 text-right text-[9px] font-bold uppercase">
                      Price
                    </th>
                    <th className="px-3 py-2 text-right text-[9px] font-bold uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-beige">
                  {order.products.map((p, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-4 w-20">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-cream border border-warm-beige rounded overflow-hidden">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <p className="text-sm font-bold text-near-black">
                          {p.title}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                          ID: {p.productId.slice(-8).toUpperCase()}
                        </p>

                        {/* Selected Options */}
                        {p.selectedOptions && (
                          <div className="mt-2 space-y-1">
                            {p.selectedOptions.color && (
                              <p className="text-[9px] text-gray-500 flex items-center gap-1">
                                <Palette className="w-2.5 h-2.5" /> Color:{" "}
                                {p.selectedOptions.color}
                              </p>
                            )}
                            {p.selectedOptions.seater && (
                              <p className="text-[9px] text-gray-500 flex items-center gap-1">
                                <Sofa className="w-2.5 h-2.5" /> Seater:{" "}
                                {p.selectedOptions.seater}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Specifications */}
                        {p.specifications &&
                          Object.keys(p.specifications).length > 0 && (
                            <div className="mt-2 pt-2 border-t border-dashed border-warm-beige">
                              <p className="text-[8px] font-bold text-walnut mb-1">
                                Specifications:
                              </p>
                              <div className="space-y-0.5">
                                {p.specifications.Material && (
                                  <p className="text-[9px] text-gray-500">
                                    Material: {p.specifications.Material}
                                  </p>
                                )}
                                {p.dimensions && (
                                  <p className="text-[9px] text-gray-500 flex items-center gap-1">
                                    <Ruler className="w-2.5 h-2.5" />{" "}
                                    Dimensions: {p.dimensions}
                                  </p>
                                )}
                                {p.weight && (
                                  <p className="text-[9px] text-gray-500 flex items-center gap-1">
                                    <Weight className="w-2.5 h-2.5" /> Weight:{" "}
                                    {p.weight} kg
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                      </td>
                      <td className="px-3 py-4 text-center">
                        <p className="text-sm font-medium">{p.quantity}</p>
                      </td>
                      <td className="px-3 py-4 text-right">
                        <p className="text-sm">{formatCurrency(p.price)}</p>
                      </td>
                      <td className="px-3 py-4 text-right">
                        <p className="text-sm font-bold">
                          {formatCurrency(p.price * p.quantity)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 sm:p-5 md:p-6 lg:p-8 bg-near-black text-white">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                <div>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">
                    Settlement Total
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium italic">
                    Includes all applicable duties and carriage fees.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-display font-bold leading-none">
                    {formatCurrency(order.totalPrice)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Details */}
          <section className="bg-white border border-warm-beige p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-lg">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-mint-50 flex items-center justify-center rounded-full">
                <CreditCard className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-mint-700" />
              </div>
              <div>
                <h3 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-near-black mb-0.5 sm:mb-1">
                  Payment Method
                </h3>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Cash on Delivery (COD)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-mint-700 bg-mint-50 px-3 sm:px-4 py-1.5 sm:py-2 border border-mint-100 rounded">
              <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Transaction
              Verified
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 sm:space-y-8 md:space-y-10">
          {/* Customer Intelligence */}
          <section className="bg-white border border-warm-beige rounded-lg overflow-hidden">
            <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 border-b border-warm-beige bg-cream/30">
              <h2 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-near-black">
                Customer Profile
              </h2>
            </div>
            <div className="p-4 sm:p-5 md:p-6 lg:p-8 space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gold/10 text-gold flex items-center justify-center rounded-full text-base sm:text-lg md:text-xl font-display font-bold">
                  {order.customerInfo.fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-near-black">
                    {order.customerInfo.fullName}
                  </p>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">
                    UID: {order.userId.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-walnut mt-0.5" />
                  <div>
                    <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      Comms Endpoint
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-near-black break-words">
                      {order.customerInfo.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-walnut mt-0.5" />
                  <div>
                    <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      Primary Contact
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-near-black">
                      {order.customerInfo.phone}
                    </p>
                  </div>
                </div>
                {order.customerInfo.alternativePhone && (
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-walnut mt-0.5" />
                    <div>
                      <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                        Alternative Contact
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-near-black">
                        {order.customerInfo.alternativePhone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Shipping Coordinates */}
          <section className="bg-white border border-warm-beige rounded-lg overflow-hidden">
            <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 border-b border-warm-beige bg-cream/30">
              <h2 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-near-black">
                Shipping Coordinates
              </h2>
            </div>
            <div className="p-4 sm:p-5 md:p-6 lg:p-8 space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8">
              <div className="flex items-start gap-3 sm:gap-4">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-walnut mt-0.5 flex-shrink-0" />
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      Physical Address
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-near-black leading-relaxed">
                      {order.customerInfo.address}
                    </p>
                    <p className="text-[10px] sm:text-xs font-medium text-gray-500 mt-1 uppercase tracking-widest">
                      {order.customerInfo.city}, {order.customerInfo.postalCode}
                    </p>
                    <p className="text-[10px] sm:text-xs font-medium text-gold mt-0.5 uppercase tracking-widest">
                      {order.customerInfo.country}
                    </p>
                  </div>
                  {order.customerInfo.notes && (
                    <div className="p-3 sm:p-4 bg-gold/5 border border-gold/10 italic rounded">
                      <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-walnut mb-1 sm:mb-2">
                        Delivery Directives
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-walnut leading-relaxed">
                        "{order.customerInfo.notes}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-4 sm:pt-5 md:pt-6 border-t border-warm-beige space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-walnut" />
                  <div>
                    <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      Fulfillment Mode
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-near-black uppercase tracking-widest">
                      Standard Carrier
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-walnut" />
                  <div>
                    <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      Packaging Status
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-near-black uppercase tracking-widest">
                      Ready for Despatch
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
