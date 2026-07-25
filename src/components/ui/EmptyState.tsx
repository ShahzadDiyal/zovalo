"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "./Button";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
  showWhatsApp?: boolean;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionLink,
  onAction,
  showWhatsApp = false,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 space-y-6 max-w-md mx-auto">
      <div className="w-20 h-20 bg-cream border border-warm-beige rounded-full flex items-center justify-center">
        <Icon className="w-10 h-10 text-gray-a0" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-display text-near-black uppercase tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-666 font-light leading-relaxed">
          {description}
        </p>
      </div>
      {showWhatsApp && (
        <a
          href="https://wa.me/447529661726?text=Hi%20Royal%20Furniture!%20I'm%20looking%20for%20a%20product%20that%20I%20couldn't%20find%20on%20your%20website.%20Can%20you%20help%20me%20find%20it%3F"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-semibold text-sm hover:bg-[#128C7E] transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <MessageCircle className="w-5 h-5" />
          Contact Us on WhatsApp
        </a>
      )}
      {actionLink && actionText && (
        <Link href={actionLink}>
          <Button variant="outline" size="md">
            {actionText}
          </Button>
        </Link>
      )}
      {onAction && actionText && (
        <Button variant="outline" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
