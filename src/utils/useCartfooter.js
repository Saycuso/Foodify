// useCartFooter.js
import { isEqual } from "lodash";
import { useEffect, useState, useCallback } from "react"; // <--- ADDED useCallback
import _ from "lodash";

export function useCartfooter({ onCrossRestaurantAttempt }) {
  const getInitCart = () => {
    const stored = localStorage.getItem("cartState");
    return stored ? JSON.parse(stored) : { restaurantId: null, items: [] };
  };
  const [cartState, setCartState] = useState(getInitCart);
  // Persist to localStorage on every cart change
  useEffect(() => {
    console.log("📦 Saving cartState to localStorage:", cartState);
    localStorage.setItem("cartState", JSON.stringify(cartState));
  }, [cartState]);

  // 🔴 IMPORTANT CHANGE 1: Wrap clearCart in useCallback
  const clearCart = useCallback(() => {
    console.log("🛒 Clearing cart...");
    setCartState({
      restaurantId: null,
      items: [],
    });
    localStorage.removeItem("cartState");
  }, []); // Empty dependency array, as it doesn't depend on props/state

  // 🟢 IMPORTANT CHANGE 2: Wrap addItem in useCallback and modify cross-restaurant logic
  const addItem = useCallback((item, currentRestaurantId) => {
    console.log("addItem called", item);

    if (
      cartState.restaurantId &&
      cartState.restaurantId !== currentRestaurantId
    ) {
      if (onCrossRestaurantAttempt) {
        // We now pass the actual clearCart function and the item to the parent.
        // The parent (RestaurantMenu) will handle showing the modal, calling clearCart,
        // and then re-adding the item if confirmed.
        onCrossRestaurantAttempt(item, clearCart); // <--- MODIFIED: No nested setTimeout/addItem here
      }
      return; // Stop processing addItem in this hook, wait for user confirmation
    }

    // ✅ Proceed to add item normally
    setCartState((prev) => {
      console.log("setCartState running", prev, item);

      const updatedItems = prev.items.map((i) => {
        if (
          i.id === item.id &&
          _.isEqual(i.variants || [], item.variants || []) &&
          _.isEqual(i.addons || [], item.addons || [])
        ) {
          return { ...i, count: i.count + 1 };
        }
        return i;
      });

      const exists = prev.items.some(
        (i) =>
          i.id === item.id &&
          _.isEqual(i.variants || [], item.variants || []) &&
          _.isEqual(i.addons || [], item.addons || [])
      );

      const newItems = exists
        ? updatedItems
        : [...prev.items, { ...item, count: 1 }];

      return {
        restaurantId: prev.restaurantId || currentRestaurantId,
        items: newItems,
      };
    });
  }, [cartState.restaurantId, onCrossRestaurantAttempt, clearCart]); // Add clearCart to dependencies

  // 🔻 IMPORTANT CHANGE 3: Wrap removeItem in useCallback and reset restaurantId if cart becomes empty
  const removeItem = useCallback((item) => {
    setCartState((prev) => {
      const updatedItems = prev.items
        .map((i) => {
          if (
            i.id === item.id &&
            _.isEqual(i.variants || [], item.variants || []) &&
            _.isEqual(i.addons || [], item.addons || [])
          ) {
            console.log("Match found, reducing count");
            return { ...i, count: i.count - 1 };
          }
          return i;
        })
        .filter((i) => i.count > 0);

      // 🔴 Reset restaurantId to null if the cart becomes empty after removal
      const newRestaurantId = updatedItems.length === 0 ? null : prev.restaurantId;

      return {
        ...prev,
        restaurantId: newRestaurantId, // <--- ADDED/MODIFIED
        items: updatedItems,
      };
    });
  }, []);

  const uniqueCustomisations = new Set(
    cartState.items.map((item) =>
      JSON.stringify({
        id: item.id,
        variants: item.variants || [],
        addons: item.addons || [],
      })
    )
  );
  const totalItems = uniqueCustomisations.size;

  return {
    cartItems: cartState.items,
    cartRestaurantId: cartState.restaurantId,
    addItem,
    removeItem,
    clearCart,
    totalItems,
  };
}