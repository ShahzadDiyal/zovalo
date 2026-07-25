// src/components/ui/Breadcrumb.tsx
"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      className={`flex items-center gap-1 text-xs text-neutral-500 overflow-x-auto whitespace-nowrap py-2 ${className}`}
    >
      <Link
        href="/"
        className="hover:text-amber-600 transition-colors flex items-center gap-1 flex-shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-1 flex-shrink-0">
            <ChevronRight className="w-3 h-3 text-neutral-300" />
            {isLast ? (
              <span className="text-near-black font-medium truncate max-w-[150px] sm:max-w-[300px]">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.url}
                className="hover:text-amber-600 transition-colors truncate max-w-[100px] sm:max-w-[200px]"
              >
                {item.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
