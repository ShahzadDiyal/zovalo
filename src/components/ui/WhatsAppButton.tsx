"use client";
import React from "react";
import { MessageCircle } from "lucide-react";
import useLocation from "next/link";
import { usePathname } from "next/navigation";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

export default function WhatsAppButton({
  phoneNumber,
  message = "Hello! I'm interested in your furniture collection. Can you help me?",
}: WhatsAppButtonProps) {
  const location = usePathname();

  // Check if current path is admin route
  const isAdminRoute = location.startsWith("/admin");

  // Don't show on admin pages
  if (isAdminRoute) {
    return null;
  }

  const handleClick = () => {
    const formattedNumber = phoneNumber.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      {/* Main Button */}
      <div className="relative">
        {/* Pulse animation ring */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>

        {/* Button background */}
        <div className="relative bg-green-500 hover:bg-green-600 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-300 hover:scale-110">
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
      </div>

      {/* Tooltip on hover */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        Chat with us on WhatsApp
        <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
      </div>
    </button>
  );
}
