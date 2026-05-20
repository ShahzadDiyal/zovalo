"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "./Button";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionLink,
  onAction,
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
