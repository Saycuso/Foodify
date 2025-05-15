// useCartFooter.js
import { isEqual } from "lodash";
import { useState } from "react";
import _ from "lodash";

export function useCartfooter() {
  const [cartItems, setCartItems] = useState([]);

  const addItem = (item) => {
    setCartItems((prev) => {
      const updated = prev.map((i) => {
        if (
          i.id === item.id &&
          _.isEqual(i.variants, item.variants) &&
          _.isEqual(i.addons, item.addons)
        ) {
          return { ...i, count: i.count + 1 };
        }
        return i;
      });
      const exists = prev.some(
        (i) =>
          i.id === item.id &&
          _.isEqual(i.variants, item.variants) &&
          _.isEqual(i.addons, item.addons)
      );
      if (exists) return updated;
      return [...prev, { ...item, count: 1 }];
    });
  };

  const removeItem = (item) => {
    setCartItems((prev) => {
      return prev
        .map((i) => {
          if (
            i.id === item.id &&
            _.isEqual(i.variants, item.variants) &&
            _.isEqual(i.addons, item.addons)
          ) {
             console.log("Match found, reducing count");
            return { ...i, count: i.count - 1 };
          }
          return i;
        })
        .filter((i) => i.count > 0);
    });
  };

  const uniqueCustomisations = new Set(
    cartItems.map((item) =>
      JSON.stringify({
        id: item.id,
        variants: item.variants,
        addons: item.addons,
      })
    )
  );
  const totalItems = uniqueCustomisations.size;


  const clearCart = () => {
    setCartItems([]);
  };

  return {
    cartItems,
    addItem,
    removeItem,
    clearCart,
    totalItems,
  }

}