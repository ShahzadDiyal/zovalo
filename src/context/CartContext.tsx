// src/context/CartContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../types";

interface CartItem extends Product {
  quantity: number;
  selectedOptions?: {
    color?: string;
    colorHex?: string;
    seater?: string;
    fabric?: string;
  };
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    options?: {
      color?: string;
      colorHex?: string;
      seater?: string;
      fabric?: string;
    },
  ) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => boolean;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    options?: {
      color?: string;
      colorHex?: string;
      seater?: string;
      fabric?: string;
    },
  ): boolean => {
    if (product.stock < quantity) {
      alert(`Sorry, only ${product.stock} items available in stock.`);
      return false;
    }

    setCart((prevCart) => {
      // Check if same product with same options already exists
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.id === product.id &&
          JSON.stringify(item.selectedOptions) === JSON.stringify(options),
      );

      if (existingItemIndex !== -1) {
        const newQuantity = prevCart[existingItemIndex].quantity + quantity;
        if (product.stock < newQuantity) {
          alert(`Sorry, only ${product.stock} items available.`);
          return prevCart;
        }
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: newQuantity,
        };
        return updatedCart;
      }

      return [...prevCart, { ...product, quantity, selectedOptions: options }];
    });
    return true;
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number): boolean => {
    const product = cart.find((item) => item.id === productId);
    if (product && product.stock < quantity) {
      alert(`Sorry, only ${product.stock} items available in stock.`);
      return false;
    }

    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    }
    return true;
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
