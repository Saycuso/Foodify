// RestaurantCategory.js
import { ChevronDown, ChevronUp } from "lucide-react";
import { CATEGORY_IMG_URL } from "../utils/constants";
import { hasCustomizations } from "../utils/hasCustomizations";
import CategoryItemPopUp from "./CategoryItemPopUp";
import CustomizationPopUp from "./CustomizationPopUp";
import useRestaurantCategoryLogic from "../utils/useRestaurantCategoryLogic"; // Import the logic hook

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
  setShowConflictModal,
}) => {
  const {
    title,
    categoryId,
    isExpanded,
    hasSubCategories,
    hasItemsOnly,
    selections,
    setSelections,
    variantSelections,
    addonSelections,
    totalAddonPrice,
    totalVariantPrice,
    lastCustomisationMap,
    handleAddItem,
    getItemCount,
    handleRemoveItem,
    resetSelections,
    handleCategoryClick,
    handleSubCategoryClick,
    handlePopup,
    handleAddItemWithConflictCheck,
    filteredItemCards,
    subCategoriesWithFilteredItems,
    totalfilteredSubItems,
    setCurrentPopupMatchedPrice,
  } = useRestaurantCategoryLogic({
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
  });

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
          {data.categories?.length > 0
            ? subCategoriesWithFilteredItems.map((sub) => {
                const subExpanded = ExpandedSubCategories.includes(
                  sub.categoryId
                );
                const filteredSubItems = sub.filtereditemCardsofSub;

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
                          const count = getItemCount(item.card.info.id);
                          const previous = lastCustomisationMap[item.card.info.id];
                          const itemwithCustomisation = hasCustomizations(item.card.info);
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
                                      handleAddItemWithConflictCheck(item.card.info, count);
                                    }}
                                  >
                                    {count > 0 ? (
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() =>
                                            handleRemoveItem(lastCustomisationMap[item.card.info.id])
                                          }
                                        >
                                          -
                                        </button>
                                        <div>{count}</div>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation(); // Prevent parent div's onClick
                                            if (itemwithCustomisation) {
                                              setCustomizingItem(item.card.info.id);
                                            } else {
                                              const itemToAdd = {
                                                id: item.card.info.id,
                                                price:
                                                  item.card.info.price ??
                                                  item.card.info.defaultPrice,
                                                name: item.card.info.name,
                                                variants: [],
                                                addons: [],
                                                OriginalMenuItemInfo: item.card.info
                                              };
                                              handleAddItem(itemToAdd);
                                            }
                                          }}
                                        >
                                          +
                                        </button>
                                      </div>
                                    ) : (
                                      <div>Add</div>
                                    )}
                                  </div>
                                  {itemwithCustomisation &&
                                    popupItemId === item.card.info.id &&
                                    isvaraddPopupVisible && (
                                      <CategoryItemPopUp
                                        item={item.card.info}
                                        variantGroups={
                                          item.card.info.variantsV2?.variantGroups?.length > 0
                                            ? item.card.info.variantsV2.variantGroups
                                            : item.card.info.variants?.variantGroups || []
                                        }
                                        baseprice={
                                          item.card.info.price ??
                                          item.card.info.defaultPrice ??
                                          0
                                        }
                                        addons={item.card.info.addons || []}
                                        onClose={() => setPopupItemId(null)}
                                        pricingModels={
                                          item.card.info.variantsV2?.pricingModels || []
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
                                        setCurrentPopupMatchedPrice={setCurrentPopupMatchedPrice}
                                      />
                                    )}
                                  {customizingItem === item.card.info.id && (
                                    console.log("Opening Customization for:", item.card.info.id, item.card.info.name),
                                    <CustomizationPopUp
                                      key={item.card.info.id}
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
                                      setCustomizingItem={setCustomizingItem}
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
                const count = getItemCount(item.card.info.id);
                const previous = lastCustomisationMap[item.card.info.id];
                const itemwithCustomisation = hasCustomizations(item.card.info);
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
                            if (count === 0) {
                              handleAddItemWithConflictCheck(item.card.info, count);
                            }
                          }}
                        >
                          {count > 0 ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleRemoveItem(lastCustomisationMap[item.card.info.id])
                                }
                              >
                                -
                              </button>
                              <div>{count}</div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent parent div's onClick
                                  if (itemwithCustomisation) {
                                    setCustomizingItem(item.card.info.id);
                                  } else {
                                    const itemToAdd = {
                                      id: item.card.info.id,
                                      price:
                                        item.card.info.price ??
                                        item.card.info.defaultPrice,
                                      name: item.card.info.name,
                                      variants: [],
                                      addons: [],
                                    };
                                    handleAddItem(itemToAdd);
                                  }
                                }}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <div>Add</div>
                          )}
                        </div>

                        {itemwithCustomisation &&
                          popupItemId === item.card.info.id &&
                          isvaraddPopupVisible && (
                            <CategoryItemPopUp
                              item={item.card.info}
                              variantGroups={
                                item.card.info.variantsV2?.variantGroups?.length > 0
                                  ? item.card.info.variantsV2.variantGroups
                                  : item.card.info.variants?.variantGroups || []
                              }
                              baseprice={
                                item.card.info.price ??
                                item.card.info.defaultPrice ??
                                0
                              }
                              addons={item.card.info.addons || []}
                              onClose={() => setPopupItemId(null)}
                              pricingModels={
                                item.card.info.variantsV2?.pricingModels || []
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
                              setCurrentPopupMatchedPrice={setCurrentPopupMatchedPrice}
                              itemwithCustomisation = {itemwithCustomisation}
                            />
                          )}
                        {customizingItem === item.card.info.id && (
                          console.log("Opening Customization for:", item.card.info.id, item.card.info.name),
                          <CustomizationPopUp
                            key={item.card.info.id}
                            item={item.card.info}
                            onClose={() => setCustomizingItem(null)}
                            addItem = {addItem}
                            baseprice={item.card.info.price ?? item.card.info.defaultPrice ?? 0}
                            previous={previous}
                            setCustomizingItem={setCustomizingItem}
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