// RestaurantCategory.js
import { ChevronDown, ChevronUp } from "lucide-react";
import { CATEGORY_IMG_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import CategoryItemPopUp from "./CategoryItemPopUp";
import CustomizationPopUp from "./CustomizationPopUp";

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
  showCartFooter,
  setShowCartFooter,
  cartItems,
  showCustomizationPopup,
  setShowCustomizationPopup,
}) => {
  const { title, itemCards = [], categories, categoryId } = data;
  const isExpanded = ExpandedCategories.includes(categoryId);
  const hasSubCategories = categories?.length > 0;
  const hasItemsOnly = itemCards?.length > 0 && !hasSubCategories;
  const [lastCustomisationMap, setLastCustomisationMap] = useState({});
  const [selections, setSelections] = useState({
    variantSelections: { }, // groupId: Id
    addonSelections: { }, // groupId: [id, id, id, id]
    totalAddonPrice: 0,
    totalVariantPrice: 0
   })

   const { variantSelections, addonSelections, totalAddonPrice, totalVariantPrice } = selections;


  const handleAddItem = (itemwithCustomisation) => {
    // Deep clone the item to prevent reference issues
    const clonedItem = JSON.parse(JSON.stringify(itemwithCustomisation));

    addItem(itemwithCustomisation);

    setLastCustomisationMap((prev)=> ({
      ...prev,
      [itemwithCustomisation.id] : itemwithCustomisation
    }));
    console.log("Storing customization for", itemwithCustomisation.id, {
      id:itemwithCustomisation.id,
      name:itemwithCustomisation.name,
   
      variants: itemwithCustomisation.variants,
      addons: itemwithCustomisation.addons,
    })
  };

  const resetSelections = () => {
    setSelections({
      variantSelections: {},
      addonSelections: {},
      totalAddonPrice: 0,
      totalVariantPrice: 0,
    })
  }

  const handleCategoryClick = () => {
    if (isExpanded) {
      setExpandedCategories(
        ExpandedCategories.filter((id) => id !== categoryId)
      );
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
    console.log("Popup triggered with item:", item
    );
      setPopupItemId(item)
      setIsVarAddPopUpVisible(true)
      setShowCustomizationPopup(false)
  }

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
        //////////////////////////////////////////////////////////////////////////////////
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
                        const matchedItem = cartItems.find((i) => i.id === item.card.info.id);
                        const count = matchedItem?.count || 0;
                        const previous = lastCustomisationMap[item.card.info.id]
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
                                    CATEGORY_IMG_URL + item?.card?.info?.imageId
                                  }
                                />
                                <div
                                  className={`absolute left-1/2 -translate-x-1/2 bottom-0 bg-white border border-gray-300 text-green-600 font-semibold px-4 py-1 rounded-md shadow hover:shadow-md ${
                                    count === 0
                                      ? `hover:cursor-pointer`
                                      : `cursor-default`
                                  }`}
                                  onClick={() => {
                                    if (count === 0) {
                                      setIsVarAddPopUpVisible(true);
                                      setPopupItemId(item.card.info.id);
                                    }
                                  }}>
                                  {count > 0 ? (
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() =>
                                          removeItem(item.card.info)
                                        }>-</button>
                                      <div>{count}</div>
                                      <button
                                        onClick={() => {addItem(item.card.info) }}
                                      >+</button>
                                    </div>) : (<div>Add</div>)}
                                </div>

                                {popupItemId === item.card.info.id &&
                                  isvaraddPopupVisible && (
                                    <CategoryItemPopUp
                                      item={item?.card?.info}
                                      variantGroups={
                                        item.card.info.variantsV2.variantGroups
                                          ?.length > 0
                                          ? item.card.info.variantsV2
                                              .variantGroups
                                          : item.card.info.variants
                                              .variantGroups || []
                                      }
                                      pricingModels={
                                        item.card.info.variantsV2
                                          .pricingModels || []
                                      }
                                      addons={item.card.info.addons || []}
                                      baseprice={
                                        item.card.info.price ??
                                        item.card.info.defaultPrice ??
                                        0
                                      }
                                      onClose={() => setPopupItemId(null)}
                                      onAddToCart={() => {
                                        setIsVarAddPopUpVisible(false);
                                      }}
                                      isV2={!!item?.card?.info?.variantsV2}
                                      totalItems={totalItems}
                                      addItem={addItem}
                                      removeItem={removeItem}
                                      cartItems={cartItems}
                                      setShowCartFooter={setShowCartFooter}
                                      addonSelections={addonSelections}
                                      variantSelections={variantSelections}
                                      totalAddonPrice={totalAddonPrice}
                                      totalVariantPrice={totalVariantPrice}
                                      setSelections = {setSelections}
                                      selections = {selections}
                                      resetSelections = {resetSelections}
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
              const matchedItem = cartItems.find((i) => i.id === item.card.info.id);
              const count = matchedItem?.count || 0;
              const previous = lastCustomisationMap[item.card.info.id]      
    
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
                        className={`absolute left-1/2 -translate-x-1/2 bottom-0 bg-white border border-gray-300 text-green-600 font-semibold px-4 py-1 rounded-md shadow hover:shadow-md ${count === 0
                            ? `hover:cursor-pointer`
                            : `cursor-default`
                          }`}
                        onClick={() => {
                          if (count === 0) {
                            setIsVarAddPopUpVisible(true);
                            setPopupItemId(item.card.info.id);
                          }
                        }}>
                        {count > 0 ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                console.log("hello")
                              }>-</button>
                            <div>{count}</div>
                            <button
                              onClick={() => {
                                setShowCustomizationPopup(true)  
                              }}
                            >+</button>
                          </div>) : (<div>Add</div>)}
                      </div>

                      {(item.card.info.variantsV2?.variantGroups ||
                        item.card.info.addons ||
                        item.card.info.variants?.variantGroups) &&
                        popupItemId === item.card.info.id &&
                        isvaraddPopupVisible && (
                          <CategoryItemPopUp
                            item={item.card.info}
                            variantGroups={ 
                              item.card.info.variantsV2.variantGroups?.length >
                                0
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
                            cartItems={cartItems}
                            setShowCartFooter={setShowCartFooter}
                            addonSelections={addonSelections}
                            variantSelections={variantSelections}
                            totalAddonPrice={totalAddonPrice}
                            totalVariantPrice={totalVariantPrice}
                            setSelections = {setSelections}
                            selections = {selections}
                            handleAddItem = {handleAddItem} 
                            resetSelections = {resetSelections}
                          />
                        )}
                        { (showCustomizationPopup && count > 0) &&
                         (
                          <CustomizationPopUp
                          item={item.card.info}
                          onClose={() => setShowCustomizationPopup(false)}  
                          addonSelections={addonSelections}
                          variantSelections={variantSelections}
                          handleAddItem = {handleAddItem}   
                          previous = {previous}       
                          setShowCustomizationPopup = {setShowCustomizationPopup}        
                          handlePopup = {handlePopup}         
                          />
                         )
                        }
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
