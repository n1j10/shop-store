import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { api, parseApiError } from "@/lib/api";

const CartContext = createContext(null);

const emptyCart = {
  items: [],
  subtotal: 0,
  itemCount: 0,
};

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(emptyCart);
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.get("/cart");
      setCart(data);
    } catch {
      setCart(emptyCart);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const addItem = async (productId, quantity = 1) => {
    try {
      const { data } = await api.post("/cart/items", { productId, quantity });
      setCart(data);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: parseApiError(error, "Failed to add item.") };
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      const { data } = await api.patch(`/cart/items/${productId}`, { quantity });
      setCart(data);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: parseApiError(error, "Failed to update item.") };
    }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/items/${productId}`);
      setCart(data);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: parseApiError(error, "Failed to remove item.") };
    }
  };

  const clearCart = async () => {
    try {
      const { data } = await api.delete("/cart");
      setCart(data);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: parseApiError(error, "Failed to clear cart.") };
    }
  };

  const value = useMemo(
    () => ({
      cart,
      loading,
      fetchCart,
      addItem,
      updateItem,
      removeItem,
      clearCart,
    }),
    [cart, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}