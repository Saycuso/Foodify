// RestaurantCategory.js
import { ChevronDown, ChevronUp } from "lucide-react";
import { CATEGORY_IMG_URL } from "../utils/constants";
import { hasCustomizations } from "../utils/hasCustomizations";
import CategoryItemPopUp from "./CategoryItemPopUp";
import CustomizationPopUp from "./CustomizationPopUp";
import useRestaurantCategoryLogic from "../utils/useRestaurantCategoryLogic"; // Import the logic hook
import useRestaurantMenu from "../utils/useRestaurantMenu";
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
  addItem,
  removeItem,
  setIsVarAddPopUpVisible,
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
    isExpanded,
    hasSubCategories,
    hasItemsOnly,
    variantSelections,
    addonSelections,
    lastCustomisationMap,
    getItemCount,
    handleRemoveItem,
    handleCategoryClick,
    handleSubCategoryClick,
    handlePopup,
    handleAddItemWithConflictCheck,
    filteredItemCards,
    subCategoriesWithFilteredItems,
    totalfilteredSubItems,
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
  });
  const { resData } = useRestaurant();

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
                              className="text-[18px] text-gray-700 border-b border-gray-200 pb-4 pt-2" // Added pb-4 and pt-2 for spacing
                            >
                              <div className="flex justify-between items-start"> {/* Changed items-center to items-start */}
                                <div className="flex-1 pr-4"> {/* Added flex-1 and pr-4 for spacing */}
                                  <h3 className="text-xl font-bold text-gray-900 mb-1"> {/* Fancier item name */}
                                    {item.card.info.name}
                                  </h3>
                                  <p className="text-lg font-semibold text-gray-800 mb-2"> {/* Fancier price */}
                                    ₹
                                    {item.card.info.price / 100 ||
                                      item.card.info.defaultPrice / 100}
                                  </p>
                                  {item.card.info.ratings?.aggregatedRating?.rating && ( // Added rating display
                                    <div className="flex items-center text-sm text-gray-600 mb-2">
                                      <span className="bg-green-500 text-white px-2 py-0.5 rounded-full mr-1">
                                        {item.card.info.ratings.aggregatedRating.rating}
                                      </span>
                                      ({item.card.info.ratings.aggregatedRating.ratingCountV2 || "0"} ratings)
                                    </div>
                                  )}
                                  <p className="text-sm text-gray-500 leading-relaxed"> {/* Item description */}
                                    {item.card.info.description}
                                  </p>
                                </div>

                                <div className="relative w-40 h-36 flex-shrink-0"> {/* Increased size and added flex-shrink-0 */}
                                  <img
                                    className="w-full h-full rounded-xl object-cover shadow-lg transform transition-transform duration-300 hover:scale-105" // Added shadow-lg, transform, transition, hover:scale-105
                                    alt={item.card.info.name} // Added alt attribute for accessibility
                                    src={
                                      CATEGORY_IMG_URL +
                                      item?.card?.info?.imageId
                                    }
                                  />
                                  <div
                                    className={`absolute left-1/2 -translate-x-1/2 bottom-0 bg-white border border-gray-300 text-green-600 font-bold px-5 py-2 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 ease-in-out transform hover:-translate-y-1 ${ // Enhanced button styles
                                      count === 0
                                        ? `hover:cursor-pointer`
                                        : `cursor-default`
                                    }`}
                                    onClick={() => {
                                      handleAddItemWithConflictCheck(item.card.info, count);
                                    }}
                                  >
                                    {count > 0 ? (
                                      <div className="flex items-center gap-3"> {/* Increased gap */}
                                        <button
                                          className="text-xl font-bold" // Larger button text
                                          onClick={(e) => {
                                            e.stopPropagation(); // Prevent parent div's onClick
                                            handleRemoveItem(lastCustomisationMap[item.card.info.id])
                                          }}
                                        >
                                          −
                                        </button>
                                        <div className="text-lg">{count}</div> {/* Larger count text */}
                                        <button
                                          className="text-xl font-bold" // Larger button text
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
                                              addItem(itemToAdd, resData.id, resData)
                                            }
                                          }}
                                        >
                                          +
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="text-base uppercase">Add</div> // Uppercase for "Add"
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
                                        onClose={() => setPopupItemId(null)}
                                        baseprice={
                                          item.card.info.price ??
                                          item.card.info.defaultPrice ??
                                          0
                                        }
                                        addons={item.card.info.addons || []}
                                        pricingModels={
                                          item.card.info.variantsV2?.pricingModels || []
                                        }
                                        onAddToCart={() => {
                                          setIsVarAddPopUpVisible(false);
                                        }}
                                        isV2={!!item?.card?.info?.variantsV2}
                                        addItem={addItem}
                                      />
                                    )}
                                  {customizingItem === item.card.info.id && (
                                    console.log("Opening Customization for:", item.card.info.id, item.card.info.name),
                                    <CustomizationPopUp
                                      key={item.card.info.id}
                                      item={item.card.info}
                                      addItem={addItem}
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
                    className="text-lg text-gray-700 border-b border-gray-200 py-4" // Increased vertical padding
                  >
                    <div className="flex justify-between items-start"> {/* Changed items-center to items-start */}
                      <div className="flex-1 pr-4"> {/* Added flex-1 and pr-4 for spacing */}
                        <h3 className="text-xl font-bold text-gray-900 mb-1"> {/* Fancier item name */}
                          {item.card.info.name}
                        </h3>
                        <p className="text-lg font-semibold text-gray-800 mb-2"> {/* Fancier price */}
                          ₹
                          {item.card.info.price / 100 ||
                            item.card.info.defaultPrice / 100}
                        </p>
                        {item.card.info.ratings?.aggregatedRating?.rating && ( // Added rating display
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <span className="bg-green-500 text-white px-2 py-0.5 rounded-full mr-1">
                              {item.card.info.ratings.aggregatedRating.rating}
                            </span>
                            ({item.card.info.ratings.aggregatedRating.ratingCountV2 || "0"} ratings)
                          </div>
                        )}
                        <p className="text-sm text-gray-500 leading-relaxed"> {/* Item description */}
                          {item.card.info.description}
                        </p>
                      </div>
                      <div className="relative w-40 h-36 flex-shrink-0"> {/* Increased size and added flex-shrink-0 */}
                        <img
                          className="w-full h-full rounded-xl object-cover shadow-lg transform transition-transform duration-300 hover:scale-105" // Added shadow-lg, transform, transition, hover:scale-105
                          alt={item.card.info.name} // Added alt attribute for accessibility
                          src={CATEGORY_IMG_URL + item?.card?.info?.imageId}
                        />
                        <div
                          className={`absolute left-1/2 -translate-x-1/2 bottom-0 bg-white border border-gray-300 text-green-600 font-bold px-5 py-2 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 ease-in-out transform hover:-translate-y-1 ${ // Enhanced button styles
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
                            <div className="flex items-center gap-3"> {/* Increased gap */}
                              <button
                                className="text-xl font-bold" // Larger button text
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent parent div's onClick
                                  handleRemoveItem(lastCustomisationMap[item.card.info.id])
                                }}
                              >
                                −
                              </button>
                              <div className="text-lg">{count}</div> {/* Larger count text */}
                              <button
                                className="text-xl font-bold" // Larger button text
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
                                    addItem(itemToAdd, resData.id, resData)
                                  }
                                }}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <div className="text-base uppercase">Add</div> // Uppercase for "Add"
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
                              addItem={addItem}
                            />
                          )}
                        {customizingItem === item.card.info.id && (
                          console.log("Opening Customization for:", item.card.info.id, item.card.info.name),
                          <CustomizationPopUp
                            key={item.card.info.id}
                            item={item.card.info}
                            addItem={addItem}
                            onClose={() => setCustomizingItem(null)}
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