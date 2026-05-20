"use client";
import React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

export const LoadingSpinner = ({
  className,
  size = 24,
}: LoadingSpinnerProps) => {
  return (
    <Loader2 className={cn("animate-spin text-gold", className)} size={size} />
  );
};

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn("bg-warm-beige/50 animate-pulse rounded-sm", className)}
    />
  );
};

export const ProductSkeleton = () => {
  return (
    <div className="bg-white border border-warm-beige p-4 space-y-4">
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-5 w-3/4" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="space-y-2 pt-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};
