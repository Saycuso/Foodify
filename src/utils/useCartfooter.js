// useCartFooter.js
import { isEqual } from "lodash";
import { useRestaurant } from "../components/RestaurantContext";
import { useEffect, useState, useCallback } from "react"; // <--- ADDED useCallback
import _ from "lodash";

export function useCartfooter({onCrossRestaurantAttempt}={}) {
  const getInitCart = () => {
    const stored = localStorage.getItem("cartState");
    return stored ? JSON.parse(stored) : { restaurantId: null, restaurantInfo: null, items: [] };
  };
  const [cartState, setCartState] = useState(getInitCart);
  const {setShowCartFooter, setLastCustomisationMap} = useRestaurant();
  // Persist to localStorage on every cart change
  useEffect(() => {
    console.log("📦 Saving cartState to localStorage:", cartState);
    console.log("📦 useEffect: cartState value received by useEffect dependency array:", cartState); // This should confirm what useEffect sees
    localStorage.setItem("cartState", JSON.stringify(cartState));
    
    // --- MOVE THIS LOGIC HERE ---
    if (cartState.items.length > 0) {
      setShowCartFooter(true);
    } else {
      setShowCartFooter(false);
    }
    // --- END MOVED LOGIC ---

  }, [cartState, setShowCartFooter]);

  // 🔴 IMPORTANT CHANGE 1: Wrap clearCart in useCallback
  const clearCart = useCallback(() => {
    console.log("🛒 Clearing cart...");
    setCartState({
      restaurantId: null,
      restaurantInfo: null,
      items: [],
    });
    localStorage.removeItem("cartState");
  }, []); // Empty dependency array, as it doesn't depend on props/state

  // 🟢 IMPORTANT CHANGE 2: Wrap addItem in useCallback and modify cross-restaurant logic
  const addItem = useCallback((item, currentRestaurantId, currentRestaurantInfo) => {
    console.log("addItem: Received item:", item); // Keep this log
    console.log("addItem: Current restaurant ID passed:", currentRestaurantId); // Keep this log
    console.log("addItem: Type of setCartState:", typeof setCartState); // Keep this log

    // The entire logic, including the conflict check, is now inside the setCartState updater
    setCartState((prev) => { // <--- All the logic now resides here
        console.log("setCartState updater: Previous state (prev):", prev); // IMPORTANT: Check prev.restaurantId here!
        console.log("setCartState updater: Item being processed:", item);

        // This check now uses the GUARANTEED latest `prev` state
        if (
            prev.restaurantId && // Is prev.restaurantId NOT null?
            prev.restaurantId !== currentRestaurantId // AND is it different from the new restaurant?
        ) {
            console.warn("addItem: Conflict detected INSIDE setCartState updater. Returning prev state.");
            if (onCrossRestaurantAttempt) {
                onCrossRestaurantAttempt(item, clearCart);
            }
            return prev; // Return the previous state, do not modify the cart.
        }

        // --- If we reach here, it means we're clear to add the item ---

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

        const newState = {
            restaurantId: prev.restaurantId || currentRestaurantId,
            restaurantInfo: prev.restaurantInfo || currentRestaurantInfo,
            items: newItems,
        };
        console.log("setCartState updater: Returning new state:", newState);
        return newState;
    });
      // 🟩 ADD THIS HERE OUTSIDE setCartState
    if (setLastCustomisationMap && typeof setLastCustomisationMap === "function") {
      setLastCustomisationMap((prev) => ({
        ...prev,
        [item.id]: item, // Store the full item, including its variants and addons
      }));
      console.log("🧠 Stored last customization in map for", item.id,item. item);
    }
  }, [onCrossRestaurantAttempt, clearCart, setLastCustomisationMap]); // Dependency array: Removed `cartState.restaurantId`

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
      const newRestaurantInfo = updatedItems.length === 0 ? null : prev.restaurantInfo; // <--- FIX HERE!

      return {
        ...prev,
        restaurantId: newRestaurantId, // <--- ADDED/MODIFIED
        restaurantInfo: newRestaurantInfo,
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
    cartRestaurantInfo: cartState.restaurantInfo,
    addItem,
    removeItem,
    clearCart,
    totalItems,
  };
}