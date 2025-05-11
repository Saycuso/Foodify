// useCartFooter.js 
import { isEqual } from "lodash";
import { useState } from "react";
import _ from "lodash";

export function useCartfooter(){
  const [cartItems, setCartItems] = useState([]);


  const addItem = (item) => {
    setCartItems((prev) => {
      const exists = prev.find(
        (i) => 
          i.id === item.id &&
          _.isEqual(i.variants,item.variants) &&
          _.isEqual(i.addons,item.addons) 
      );
      if (exists) {
        return prev
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

