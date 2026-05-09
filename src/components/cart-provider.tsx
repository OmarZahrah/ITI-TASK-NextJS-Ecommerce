"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { product: string; name: string; price: number; image?: string; stock: number; quantity: number };
type CartContextType = { items: CartItem[]; addItem: (item: Omit<CartItem, "quantity">) => void; removeItem: (product: string) => void; updateQuantity: (product: string, quantity: number) => void; clearCart: () => void; total: number };
const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => { const savedCart = window.localStorage.getItem("cart"); if (savedCart) setItems(JSON.parse(savedCart)); }, []);
  useEffect(() => { window.localStorage.setItem("cart", JSON.stringify(items)); }, [items]);
  const value = useMemo<CartContextType>(() => ({
    items,
    addItem: (item) => setItems((current) => { const existing = current.find((cartItem) => cartItem.product === item.product); return existing ? current.map((cartItem) => cartItem.product === item.product ? { ...cartItem, quantity: Math.min(cartItem.quantity + 1, item.stock) } : cartItem) : [...current, { ...item, quantity: 1 }]; }),
    removeItem: (product) => setItems((current) => current.filter((item) => item.product !== product)),
    updateQuantity: (product, quantity) => setItems((current) => current.map((item) => item.product === product ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) } : item)),
    clearCart: () => setItems([]),
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const context = useContext(CartContext); if (!context) throw new Error("useCart must be used within CartProvider"); return context; }
