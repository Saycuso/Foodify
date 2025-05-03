import { useState } from "react";

const useCartfooter = () => {
  const [cartItems, setCartItems] = useState([]);

  const addItem = (item) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, count: i.count + 1 } : i
        );
      }
      return [...prev, { ...item, count: 1 }];
    });
  };

  const removeItem = (item) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === item.id ? { ...i, count: i.count - 1 } : i))
        .filter((i) => i.count > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return {
    cartItems,
    addItem,
    removeItem,
    clearCart,
    totalItems: cartItems.reduce((sum, item) => sum + item.count, 0)
  };
};

export default useCartfooter;
