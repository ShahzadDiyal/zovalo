"use client";
import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-near-black text-white hover:bg-gold",
      secondary: "bg-gold text-white hover:bg-near-black",
      outline:
        "border border-warm-beige text-near-black hover:bg-near-black hover:text-white",
      ghost: "text-gray-666 hover:text-near-black hover:bg-cream",
    };

    const sizes = {
      sm: "px-4 py-2 text-[10px]",
      md: "px-6 py-3 text-[11px]",
      lg: "px-8 py-4 text-[12px]",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-none",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
