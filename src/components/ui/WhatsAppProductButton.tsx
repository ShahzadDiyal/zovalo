// src/components/ui/WhatsAppProductButton.tsx
"use client";

import React, { useState } from "react";
import { MessageCircle, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Product } from "./../../types";

interface WhatsAppProductButtonProps {
  product: Product;
  selectedSeater?: string;
  selectedColor?: string;
  currentPrice?: number;
  quantity?: number;
}

export function WhatsAppProductButton({
  product,
  selectedSeater,
  selectedColor,
  currentPrice,
  quantity = 1,
}: WhatsAppProductButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customQuery, setCustomQuery] = useState("");

  const handleWhatsAppClick = () => {
    const productName = product.title || "Product";
    const productUrl = `https://royalfurnitures.store/product/${product.slug}`;
    const price = currentPrice || product.price || 0;
    const seater = selectedSeater || "Not specified";
    const color = selectedColor || "Not specified";
    const qty = quantity || 1;

    // Shorter, cleaner message to avoid URL length issues
    let message = `Hi Royal Furniture,\n\n`;
    message += `I'm interested in:\n`;
    message += `Product: ${productName}\n`;
    message += `Price: £${price.toFixed(2)}\n`;
    message += `Seater: ${seater}\n`;
    message += `Color: ${color}\n`;
    message += `Qty: ${qty}\n`;
    message += `Link: ${productUrl}\n\n`;

    if (customQuery.trim()) {
      message += `Question: ${customQuery.trim()}\n\n`;
    }

    message += `Please let me know if this is available.`;

    // Use a shorter encoded message
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/447529661726?text=${encodedMessage}`;

    // Open WhatsApp with a slight delay to prevent connection issues
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
    }, 100);
  };

  return (
    <div className="w-full">
      <button
        onClick={handleWhatsAppClick}
        className="w-full bg-[#00491b] hover:bg-[#000000] cursor-pointer text-white py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
      >
        <MessageCircle className="w-5 h-5" />
        Customize & Order on WhatsApp
        <Sparkles className="w-3.5 h-3.5 opacity-75" />
      </button>

      <p className="text-[12px] text-center text-gray-400 mt-1.5">
        Get a personalized quote for your custom requirements
      </p>

      <div className="mt-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-amber-600 transition-colors py-1"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3 h-3" />
              Hide custom message
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              Add custom message
            </>
          )}
        </button>

        {isExpanded && (
          <div className="mt-2 animate-fadeIn">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 block mb-1">
              Your Question
            </label>
            <textarea
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="e.g., Can I get this in a different color? Do you offer this in 4 seater?"
              rows={3}
              className="w-full bg-cream border border-warm-beige py-2.5 px-3 text-sm focus:border-gold outline-none rounded-xl resize-none"
            />
            <p className="text-[12px] text-gray-400 mt-1">
              This will be sent with your inquiry on WhatsApp.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
