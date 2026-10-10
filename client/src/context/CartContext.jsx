import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

function readSavedCart() {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
}

// The cart is a list of { item, quantity }
export function CartProvider({ children }) {
  const [lines, setLines] = useState(readSavedCart);

  // Keep the cart after a page refresh
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(lines));
  }, [lines]);

  function add(item) {
    setLines((prev) => {
      const found = prev.find((l) => l.item._id === item._id);
      if (found) {
        return prev.map((l) =>
          l.item._id === item._id ? { ...l, quantity: Math.min(l.quantity + 1, 20) } : l
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  }

  function decrease(id) {
    setLines((prev) =>
      prev
        .map((l) => (l.item._id === id ? { ...l, quantity: l.quantity - 1 } : l))
        .filter((l) => l.quantity > 0)
    );
  }

  function remove(id) {
    setLines((prev) => prev.filter((l) => l.item._id !== id));
  }

  function clear() {
    setLines([]);
  }

  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const total = lines.reduce((sum, l) => sum + l.item.price * l.quantity, 0);

  return (
    <CartContext.Provider value={{ lines, add, decrease, remove, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
