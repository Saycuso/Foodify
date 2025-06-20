import { useState, useEffect, useCallback } from "react";
import { useRestaurant } from "../components/RestaurantContext";
import { hasCustomizations } from "./hasCustomizations";

const useRestaurantCategoryLogic = ({
  data,
  Filters,
  ExpandedCategories,
  setExpandedCategories,
  ExpandedSubCategories,
  setExpandedSubCategories,
  setPopupItemId,
  setIsVarAddPopUpVisible,
  addItem,
  removeItem,
  cartItems,
  clearCart,
  cartRestaurantId,
  setCustomizingItem,
  setPendingItem,
  setClearCartAndContinue,
  setShowConflictModal,
  setShowCartFooter,
}) => {
  const { title, itemCards = [], categories, categoryId } = data;
  const isExpanded = ExpandedCategories.includes(categoryId);
  const hasSubCategories = categories?.length > 0;
  const hasItemsOnly = itemCards?.length > 0 && !hasSubCategories;

  const [currentPopupMatchedPrice, setCurrentPopupMatchedPrice] = useState(null);
  const [selections, setSelections] = useState({
    variantSelections: {}, // groupId: Id
    addonSelections: {}, // groupId: [id, id, id, id]
    totalAddonPrice: 0,
    totalVariantPrice: 0,
  });

    const {
    variantSelections,
    addonSelections,
    totalAddonPrice,
    totalVariantPrice,
  } = selections;

  const { resData, lastCustomisationMap, setLastCustomisationMap} = useRestaurant();

  // Add Item Logic
  const handleAddItem = useCallback((itemwithCustomisation) => {
    if (!resData?.id) {
      // console.warn("No Restaurant ID found in context API")
      return;
    }
    addItem(itemwithCustomisation, resData.id, resData);

    setLastCustomisationMap((prev) => ({
      ...prev,
      [itemwithCustomisation.id]: itemwithCustomisation,
    }));
    console.log("Storing customization for", itemwithCustomisation.id, {
      id: itemwithCustomisation.id,
      name: itemwithCustomisation.name,
      price: itemwithCustomisation.price,
      variants: itemwithCustomisation.variants,
      addons: itemwithCustomisation.addons,
    });
  }, [addItem, resData, setLastCustomisationMap]);

  // For the middle counter logic
  const getItemCount = useCallback((id) => {
    return cartItems
      .filter((item) => item.id === id)
      .reduce((sum, item) => sum + item.count, 0);
  }, [cartItems]);

  // Remove Item Logic
  const getCustomizationsForId = useCallback((id) => {
    return cartItems.filter((i) => i.id === id);
  }, [cartItems]);

  const handleRemoveItem = useCallback((itemwithCustomisation) => {
    const itemwithSameId = getCustomizationsForId(itemwithCustomisation.id);
    // console.log("🔍 itemWithCustomisation:", itemwithCustomisation);
    // console.log("🧩 All items with same ID:", itemwithSameId);

    const uniqueSet = new Set(
      itemwithSameId.map((i) =>
        JSON.stringify({ variants: i.variants, addons: i.addons })
      )
    );
    //console.log("🧠 Unique customizations count:", uniqueSet.size);
    if (uniqueSet.size > 1) {
      alert(
        `This item has multiple customizations added. Remove the correct item from the cart`
      );
      return;
    }
    removeItem(itemwithCustomisation);
  }, [getCustomizationsForId, removeItem]);

  const resetSelections = useCallback(() => {
    setSelections({
      variantSelections: {},
      addonSelections: {},
      totalAddonPrice: 0,
      totalVariantPrice: 0,
    });
  }, []);

  const handleCategoryClick = useCallback(() => {
    if (isExpanded) {
      setExpandedCategories(
        ExpandedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setExpandedCategories([...ExpandedCategories, categoryId]);
    }
  }, [isExpanded, ExpandedCategories, categoryId, setExpandedCategories]);

  const handleSubCategoryClick = useCallback((subCategoryId) => {
    if (ExpandedSubCategories.includes(subCategoryId)) {
      setExpandedSubCategories(
        ExpandedSubCategories.filter((id) => id !== subCategoryId)
      );
    } else {
      setExpandedSubCategories([...ExpandedSubCategories, subCategoryId]);
    }
  }, [ExpandedSubCategories, setExpandedSubCategories]);

  const handlePopup = useCallback((itemId) => {
    //console.log("Popup triggered with item:", item);
    setPopupItemId(itemId);
    setIsVarAddPopUpVisible(true);
    setCustomizingItem(null);
  }, [setPopupItemId, setIsVarAddPopUpVisible, setCustomizingItem]);

  const handleAddItemWithConflictCheck = useCallback((itemInfo, currentCount) => {
    // Check if the item has variants/addons
    const hasVariantsOrAddons = hasCustomizations(itemInfo);
    // Cross-restaurant conflict check
    if (!cartRestaurantId || cartRestaurantId === resData?.id) {
      // If no conflict, or same restaurant
      if (hasVariantsOrAddons) {
        // If item has customizations, always open CustomizationPopUp
        if (currentCount > 0) {
          // If item is ALREADY IN CART (count > 0), open CustomizationPopUp
          // This allows "Repeat previous customization" or "I'll choose"
          setCustomizingItem(itemInfo.id); // This triggers CustomizationPopUp
        } else {
          // If item is NOT YET IN CART (count === 0), open CategoryItemPopUp
          // This is for initial selection of variants/addons
          setPopupItemId(itemInfo.id); // Set the ID for CategoryItemPopUp
          setIsVarAddPopUpVisible(true); // Show CategoryItemPopUp
        }
        // The actual addItem call will happen from within the CustomizationPopUp
      } else {
        // If no customizations, add directly.
        // Crucial: Pass a complete item object, not just the ID.
        const itemToAdd = {
          id: itemInfo.id,
          price: itemInfo.price ?? itemInfo.defaultPrice,
          name: itemInfo.name,
          variants: [], // Ensure these are always arrays
          addons: []    // Ensure these are always arrays
        };
        addItem(itemToAdd, resData?.id, resData);
      }
    } else {
      // !!! DIFFERENT RESTAURANT - CONFLICT DETECTED !!!
      // DO NOT ADD ITEM YET. INSTEAD, STORE IT AS PENDING AND SHOW THE MODAL.
      console.log("Cross-restaurant conflict detected. Storing pending item and showing modal.");
      // Store the item (which includes its current customizations)
      setPendingItem(itemInfo);
      // Set the function to clear the cart, to be called if user confirms
      setClearCartAndContinue(() => async () => await clearCart()); // clearCart should come from useCartFooter
      // Show the conflict modal
      setShowConflictModal(true);
    }
  }, [addItem, cartRestaurantId, resData, setCustomizingItem, setPopupItemId, setIsVarAddPopUpVisible, setPendingItem, setClearCartAndContinue, clearCart, setShowConflictModal]);

  // FILTER FUNCTION
  const filterItems = useCallback((items = []) => {
    return items.filter((item) => {
      const info = item.card?.info || {};
      const isVeg = info.isVeg === 1;
      const isBestseller = info.isBestseller === true;
      const isGuiltfree = info.isGuiltfree === true;

      if (Filters.isVeg && !isVeg) return false;
      if (Filters.nonVeg && isVeg) return false;
      if (Filters.bestseller && !isBestseller) return false;
      if (Filters.Guiltfree && !isGuiltfree) return false;
      return true;
    });
  }, [Filters]);

  const filteredItemCards = filterItems(itemCards);

  // if we want to fetch items in subcategories beforehand lol
  const subCategoriesWithFilteredItems = (categories || []).map((sub) => ({
    ...sub,
    filtereditemCardsofSub: filterItems(sub.itemCards),
  }));

  const totalfilteredSubItems = subCategoriesWithFilteredItems.reduce(
    (sum, sub) => sum + sub.filtereditemCardsofSub.length,
    0
  );

  return {
    title,
    categoryId,
    isExpanded,
    hasSubCategories,
    hasItemsOnly,
    currentPopupMatchedPrice,
    setCurrentPopupMatchedPrice,
    selections,
    setSelections,
    variantSelections,
    addonSelections,
    totalAddonPrice,
    totalVariantPrice,
    resData,
    lastCustomisationMap,
    handleAddItem,
    getItemCount,
    handleRemoveItem,
    resetSelections,
    handleCategoryClick,
    handleSubCategoryClick,
    handlePopup,
    handleAddItemWithConflictCheck,
    filterItems,
    filteredItemCards,
    subCategoriesWithFilteredItems,
    totalfilteredSubItems,
    setShowCartFooter,
  };
};

export default useRestaurantCategoryLogic;