import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("maarishop_cart")) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("maarishop_cart", JSON.stringify(items));
  }, [items]);

  function addItem(product, qty = 1) {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, emoji: product.emoji, color: product.color, qty }];
    });
  }

  function removeItem(id) { setItems(prev => prev.filter(i => i.id !== id)); }

  function updateQty(id, qty) {
    if (qty <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }

  function clearCart() { setItems([]); }

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() { return useContext(CartContext); }
