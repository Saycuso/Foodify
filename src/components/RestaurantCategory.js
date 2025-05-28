// RestaurantCategory.js
import { ChevronDown, ChevronUp } from "lucide-react";
import { CATEGORY_IMG_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import CategoryItemPopUp from "./CategoryItemPopUp";
import CustomizationPopUp from "./CustomizationPopUp";
import { useRestaurant } from "./RestaurantContext";

const RestaurantCategory = ({
  data,
  Filters,
  ExpandedCategories,
  setExpandedCategories,
  ExpandedSubCategories,
  setExpandedSubCategories,
  popupItemId,
  setPopupItemId,
  isvaraddPopupVisible,
  totalItems,
  addItem,
  removeItem,
  setIsVarAddPopUpVisible,
  setShowCartFooter,
  cartItems,
  clearCart,
  cartRestaurantId,
  customizingItem,
  setCustomizingItem,
  setPendingItem,
  setClearCartAndContinue,
  setShowConflictModal
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
    const { resData, lastCustomisationMap, setLastCustomisationMap } = useRestaurant();
 

  // Add Item Logic
  const handleAddItem = (itemwithCustomisation) => {
    if(!resData?.id){
     /// console.warn("No Restaurant ID found in context API")
      return;
    }
    addItem(itemwithCustomisation, resData.id);

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
  };

// For the middle counter logic
  const getItemCount = (id) =>{
    return cartItems
    .filter((item) => item.id === id)
    .reduce((sum, item) => sum + item.count, 0)
  }
// Remove Item Logic
  const getCustomizationsForId = (id) =>{
    return cartItems.filter((i)=> i.id === id)
  }

  const handleRemoveItem = (itemwithCustomisation) => {
    const itemwithSameId = getCustomizationsForId(itemwithCustomisation.id);
    //  console.log("🔍 itemWithCustomisation:", itemwithCustomisation);
    //  console.log("🧩 All items with same ID:", itemwithSameId);
     
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
  };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const resetSelections = () => {
    setSelections({
      variantSelections: {},
      addonSelections: {},
      totalAddonPrice: 0,
      totalVariantPrice: 0,
    });
  };

  const handleCategoryClick = () => {
    if (isExpanded) {
      setExpandedCategories(
        ExpandedCategories.filter((id) => id !== categoryId)
      )
    } else {
      setExpandedCategories([...ExpandedCategories, categoryId]);
    }
  };

  const handleSubCategoryClick = (subCategoryId) => {
    if (ExpandedSubCategories.includes(subCategoryId)) {
      setExpandedSubCategories(
        ExpandedSubCategories.filter((id) => id !== subCategoryId)
      );
    } else {
      setExpandedSubCategories([...ExpandedSubCategories, subCategoryId]);
    }
  };

  const handlePopup = (item) => {
    //console.log("Popup triggered with item:", item);
    setPopupItemId(item);
    setIsVarAddPopUpVisible(true);
    setCustomizingItem(null);
  };

   const handleAddItemWithConflictCheck = (itemInfo, currentCount) => {
    // Check if the item has variants/addons
    const hasVariantsOrAddons =
        itemInfo.variantsV2?.variantGroups?.length > 0 ||
        itemInfo.addons?.length > 0 ||
        itemInfo.variants?.variantGroups?.length > 0;

    // Cross-restaurant conflict check
    if (!cartRestaurantId || cartRestaurantId === resData?.id) {
        // If no conflict, or same restaurant
        if (hasVariantsOrAddons) {
            // If item has customizations, always open CustomizationPopUp
            setCustomizingItem(itemInfo.id);
            // The actual addItem call will happen from within the CustomizationPopUp
        } else {
            // If no customizations, add directly.
            // Crucial: Pass a complete item object, not just the ID.
            const itemToAdd = {
                id: itemInfo.id,
                name: itemInfo.name,
                price: itemInfo.price ?? itemInfo.defaultPrice,
                variants: [], // Ensure these are always arrays
                addons: []    // Ensure these are always arrays
            };
            addItem(itemToAdd, resData?.id);
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
  };


  // 🧠 FILTER FUNCTION
  const filterItems = (items = []) => {
    return items.filter((item) => {
      const info = item.card?.info || {};
      const isVeg = info.isVeg === 1;
      const isBestseller = info.isBestseller === true;
      const isGuiltfree = info.isGuiltfree == true;

      if (Filters.isVeg && !isVeg) return false;
      if (Filters.nonVeg && isVeg) return false;
      if (Filters.bestseller && !isBestseller) return false;
      if (Filters.Guiltfree && !isGuiltfree) return false;
      return true;
    });
  };

  const filteredItemCards = filterItems(itemCards);

  // if we want to fetch items in subcategories beforhand lol
  const subCategoriesWithFilteredItems = (categories || []).map((sub) => ({
    ...sub,
    filtereditemCardsofSub: filterItems(sub.itemCards),
  }));

  const totalfilteredSubItems = subCategoriesWithFilteredItems.reduce(
    (sum, sub) => sum + sub.filtereditemCardsofSub.length,
    0
  );

  return (
    <li className="font-semibold text-lg">
      {(filteredItemCards.length > 0 || totalfilteredSubItems > 0) && (
        <div
          className="flex justify-between items-center py-3 hover:bg-gray-100 transition cursor-pointer"
          onClick={hasItemsOnly ? handleCategoryClick : undefined}
        >
          <span className="flex items-center gap-2">
            <div>{title}</div>
            {hasItemsOnly && (
              <span className="text-lg text-gray-500">
                ({filteredItemCards.length})
              </span>
            )}
          </span>
          {hasItemsOnly && (
            <span>
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </span>
          )}
        </div> 
      )}
      {(hasSubCategories || isExpanded) && (
        <ul className="mt-2 space-y-2">
          {categories?.length > 0
            ? categories.map((sub) => {
                const subExpanded = ExpandedSubCategories.includes(
                  sub.categoryId
                );
                const filteredSubItems = filterItems(sub.itemCards);

                return (
                  <li key={`sub-${sub.categoryId}-${sub.title}`}>
                    {filteredSubItems.length > 0 && (
                      <div
                        onClick={() => handleSubCategoryClick(sub.categoryId)}
                        className="flex justify-between items-center py-2 bg-gray-50 cursor-pointer hover:bg-gray-100"
                      >
                        <span className="flex items-center gap-2 text-base">
                          {sub.title}
                          <span className="text-sm text-gray-500">
                            ({filteredSubItems.length})
                          </span>
                        </span>
                        <span>
                          {subExpanded ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </span>
                      </div>
                    )}

                    {subExpanded && (
                      <ul className="mt-1 space-y-1">
                        {filteredSubItems.map((item) => {
                          const matchedItem = cartItems.find(
                            (i) => i.id === item.card.info.id
                          );
                          const count = matchedItem?.count || 0;
                          const previous =
                            lastCustomisationMap[item.card.info.id];

                          return (
                            <li
                              key={`item-${
                                item.card.info.id || item.card.info.name
                              }`}
                              className="text-[18px] text-gray-700 border-b border-gray-200 pb-1"
                            >
                              <div className="flex justify-between">
                                <span>
                                  {item.card.info.name}
                                  <br />₹
                                  {item.card.info.price / 100 ||
                                    item.card.info.defaultPrice / 100}
                                </span>
             
                                <div className="relative w-[156px]">
                                  <img
                                    className="w-full h-[144px] rounded-xl object-cover shadow"
                                    alt="res-logo"
                                    src={
                                      CATEGORY_IMG_URL +
                                      item?.card?.info?.imageId
                                    }
                                  />
                                  <div
                                    className={`absolute left-1/2 -translate-x-1/2 bottom-0 bg-white border border-gray-300 text-green-600 font-semibold px-4 py-1 rounded-md shadow hover:shadow-md ${
                                      count === 0
                                        ? `hover:cursor-pointer`
                                        : `cursor-default`
                                    }`}
                                    onClick={() => {
                                      // For the initial "Add" button click (count is 0)
                                    handleAddItemWithConflictCheck(item.card.info, count);
                                      // If count > 0, the div itself is clickable, but the + button has its own specific onClick.
                                      // This ensures clicks on the counter area also behave correctly for 0 count.
                                    }}
                                  >
                                    {count > 0 ? (
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => 
                                            {
                                            //console.log("- triggered")
                                            handleRemoveItem(lastCustomisationMap[item.card.info.id])}}
                                        >
                                          -
                                        </button>
                                        <div>{getItemCount(item.card.info.id)}</div>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation(); // Prevent parent div's onClick
                                            // The '+' button directly triggers CustomizationPopUp
                                            setCustomizingItem(item.card.info.id);
                                          }}
                                        >
                                          +
                                        </button>
                                      </div>
                                    ) : (
                                      <div>Add</div>
                                    )}
                                  </div>
                                  {(item.card.info.variantsV2?.variantGroups ||
                                    item.card.info.addons ||
                                    item.card.info.variants?.variantGroups) &&
                                    popupItemId === item.card.info.id &&
                                    isvaraddPopupVisible && (
                                      <CategoryItemPopUp
                                        item={item.card.info}
                                        variantGroups={
                                          item.card.info.variantsV2
                                            .variantGroups?.length > 0
                                            ? item.card.info.variantsV2
                                                .variantGroups
                                            : item.card.info.variants
                                                .variantGroups || []
                                        }
                                        baseprice={
                                          item.card.info.price ??
                                          item.card.info.defaultPrice ??
                                          0
                                        }
                                        addons={item.card.info.addons || []}
                                        onClose={() => setPopupItemId(null)}
                                        pricingModels={
                                          item.card.info.variantsV2
                                            .pricingModels || []
                                        }
                                        onAddToCart={() => {
                                          setIsVarAddPopUpVisible(false);
                                        }}
                                        isV2={!!item?.card?.info?.variantsV2}
                                        totalItems={totalItems}
                                        setShowCartFooter={setShowCartFooter}
                                        addonSelections={addonSelections}
                                        variantSelections={variantSelections}
                                        totalAddonPrice={totalAddonPrice}
                                        totalVariantPrice={totalVariantPrice}
                                        setSelections={setSelections}
                                        selections={selections}
                                        handleAddItem={handleAddItem}
                                        resetSelections={resetSelections}
                                        setCurrentPopupMatchedPrice = {setCurrentPopupMatchedPrice}
                                      />
                                    )}
                                  {customizingItem === item.card.info.id && (
                                    console.log("Opening Customization for:", item.card.info.id, item.card.info.name),
                                    <CustomizationPopUp
                                      key={item.card.info.id} // <-- 🔥 THIS forces remount on item change
                                      item={item.card.info}
                                      onClose={() =>
                                        setCustomizingItem(null)
                                      }
                                      baseprice={
                                          item.card.info.price ??
                                          item.card.info.defaultPrice ??
                                          0
                                        }
                                      addonSelections={addonSelections}
                                      variantSelections={variantSelections}
                                      handleAddItem={handleAddItem}
                                      previous={previous}
                                      setCustomizingItem = {setCustomizingItem}
                                      handlePopup={handlePopup}
                                    />
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })
            : filteredItemCards.map((item) => {
                const matchedItem = cartItems.find(
                  (i) => i.id === item.card.info.id
                );
                const count = matchedItem?.count || 0;
                const previous = lastCustomisationMap[item.card.info.id];

                return (
                  <li
                    key={item?.card?.info?.id || item?.card?.info?.name}
                    className="text-lg text-gray-700 border-b border-gray-200 py-2"
                  >
                    <div className="flex justify-between">
                      <span>
                        {item.card.info.name}
                        <br />₹
                        {item.card.info.price / 100 ||
                          item.card.info.defaultPrice / 100}
                      </span>
                      <div className="relative w-[156px]">
                        <img
                          className="w-full h-[144px] rounded-xl object-cover shadow"
                          alt="res-logo"
                          src={CATEGORY_IMG_URL + item?.card?.info?.imageId}
                        />
                        <div
                          className={`absolute left-1/2 -translate-x-1/2 bottom-0 bg-white border border-gray-300 text-green-600 font-semibold px-4 py-1 rounded-md shadow hover:shadow-md ${
                            count === 0
                              ? `hover:cursor-pointer`
                              : `cursor-default`
                          }`}
                          onClick={() => {
                                      // For the initial "Add" button click (count is 0)
                                      if (count === 0) {
                                          handleAddItemWithConflictCheck(item.card.info, count);
                                      }
                                      // If count > 0, the div itself is clickable, but the + button has its own specific onClick.
                                      // This ensures clicks on the counter area also behave correctly for 0 count.
                                    }}
                        >
                          {count > 0 ? (
                            <div className="flex items-center gap-2">
                              <button 
                              onClick={() =>{ 
                              handleRemoveItem(lastCustomisationMap[item.card.info.id])} }
                                      >
                                -
                              </button>
                              <div>{getItemCount(item.card.info.id)}</div>
                              <button
                                onClick={(e) => {
                                            e.stopPropagation(); // Prevent parent div's onClick
                                            // The '+' button directly triggers CustomizationPopUp
                                            setCustomizingItem(item.card.info.id);
                                          }}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <div>Add</div>
                          )}
                        </div>

                        {(item.card.info.variantsV2?.variantGroups ||
                          item.card.info.addons ||
                          item.card.info.variants?.variantGroups) &&
                          popupItemId === item.card.info.id &&
                          isvaraddPopupVisible && (
                            <CategoryItemPopUp
                              item={item.card.info}
                              variantGroups={
                                item.card.info.variantsV2.variantGroups
                                  ?.length > 0
                                  ? item.card.info.variantsV2.variantGroups
                                  : item.card.info.variants.variantGroups || []
                              }
                              baseprice={
                                item.card.info.price ??
                                item.card.info.defaultPrice ??
                                0
                              }
                              addons={item.card.info.addons || []}
                              onClose={() => setPopupItemId(null)}
                              pricingModels={
                                item.card.info.variantsV2.pricingModels || []
                              }
                              onAddToCart={() => {
                                setIsVarAddPopUpVisible(false);
                              }}
                              isV2={!!item?.card?.info?.variantsV2}
                              totalItems={totalItems}
                              setShowCartFooter={setShowCartFooter}
                              addonSelections={addonSelections}
                              variantSelections={variantSelections}
                              totalAddonPrice={totalAddonPrice}
                              totalVariantPrice={totalVariantPrice}
                              setSelections={setSelections}
                              selections={selections}
                              handleAddItem={handleAddItem}
                              resetSelections={resetSelections}
                              setCurrentPopupMatchedPrice = {setCurrentPopupMatchedPrice}
                            />
                          )}
                        {customizingItem === item.card.info.id && (
                         console.log("Opening Customization for:", item.card.info.id, item.card.info.name),
                          <CustomizationPopUp
                            key={item.card.info.id} // <-- 🔥 THIS forces remount on item change
                            item={item.card.info}
                            onClose={() => setCustomizingItem(null)}
                            addonSelections={addonSelections}
                            variantSelections={variantSelections}
                            handleAddItem={handleAddItem}
                            baseprice={
                                          item.card.info.price ??
                                          item.card.info.defaultPrice ??
                                          0
                                        }
                            previous={previous}
                            setCustomizingItem = {setCustomizingItem}
                            handlePopup={handlePopup}
                          />
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
        </ul>
      )}
    </li>
  );
};

export default RestaurantCategory;
