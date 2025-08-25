// Cart.js
import AddressSection from "./AddressSection";
import CartSection from "./CartSection";
import { useRestaurant } from "./RestaurantContext";
import { useLocation } from "react-router-dom";
import { useCartfooter } from "../utils/useCartfooter";
import { hasCustomizations } from "../utils/hasCustomizations";
import { useCallback } from "react";
import CustomizationPopUp from "./CustomizationPopUp";
import CategoryItemPopUp from "./CategoryItemPopUp";

const Cart = () => {
  const {
    cartItems,
    cartRestaurantId,
    totalItems,
    cartRestaurantInfo,
    addItem,
    removeItem,
  } = useCartfooter({ onCrossRestaurantAttempt: null });
  console.log("🛒 Cart.js: addItem from useCartfooter:", addItem);
  const {
    resData,
    customizingItem,
    setCustomizingItem,
    isvaraddPopupVisible,
    setIsVarAddPopUpVisible,
    popupItemId,
    setPopupItemId,
  } = useRestaurant();

  const itemToCustomizeFromCart = customizingItem;

  const itemForCategoryPopup = cartItems.find(i => i.id === popupItemId)?.OriginalMenuItemInfo;

  const handlePopupInCart = useCallback((itemId)=> {
    setPopupItemId(itemId)
    setIsVarAddPopUpVisible(true)
    setCustomizingItem(null)
  },[setPopupItemId, setIsVarAddPopUpVisible, setCustomizingItem])

  return (
    <div className="flex flex-col w-[1515px] bg-gray-200 overflow-x-hidden">
      {/* Header */}
      <div className="h-[120px] bg-orange-100 flex items-center justify-center text-2xl font-bold">
        Header
      </div>
      {/* Body */}
      <div className="flex flex-1 justify-center">
        <div className="flex w-[1400px] gap-10 px-4 md:px-10 py-10">
          {/* Address Section */}
          <div className="w-2/3 bg-white p-5 shadow-md ">
            <div className="bg-white h-[800px]">
              <div className="mx-15 flex flex-col">
                <h2 className="mt-10 font-bold text-xl">
                  Choose a delivery address
                </h2>
                <span className="opacity-65 font-semibold">
                  Multiple addresses in this location
                </span>
                <div className="my-10">
                  <AddressSection />
                </div>
              </div>
            </div>
          </div>

          {/* Cart Section */}
          <div className="w-1/3 bg-white p-5 shadow-md ">
            <CartSection
              setIsVarAddPopUpVisible={setIsVarAddPopUpVisible}
              setCustomizingItem={setCustomizingItem}
              totalItems={totalItems}
              addItem={addItem}
              removeItem={removeItem}
              cartItems={cartItems}
              cartRestaurantId={cartRestaurantId}
              resData={resData}
              cartRestaurantInfo={cartRestaurantInfo}
            />
          </div>
        </div>
      </div>
      {itemToCustomizeFromCart && // Simplified
        (console.log("Rendering CustomizationPopUp for:", itemToCustomizeFromCart.name),
        (
          <CustomizationPopUp
            key={itemToCustomizeFromCart.id}
            item={itemToCustomizeFromCart.OriginalMenuItemInfo || itemToCustomizeFromCart}
            previous={itemToCustomizeFromCart}
            addItem={addItem}
            onClose={() => {
              setCustomizingItem(null);
            }} 
            baseprice={
              itemToCustomizeFromCart.price ??
              itemToCustomizeFromCart.OriginalMenuItemInfo?.price ??
              itemToCustomizeFromCart.OriginalMenuItemInfo?.defaultPrice ??
              0
            }
            handlePopup={handlePopupInCart}
          />
        ))}
      {isvaraddPopupVisible && popupItemId && itemForCategoryPopup ? (
        <CategoryItemPopUp
          item={itemForCategoryPopup}
          variantGroups={
            itemForCategoryPopup.variantsV2?.variantGroups?.length > 0
              ? itemForCategoryPopup.variantsV2.variantGroups
              : itemForCategoryPopup.variants?.variantGroups || []
          }
          onClose={() => {
            setIsVarAddPopUpVisible(false);
          }}
          baseprice={
            itemForCategoryPopup.price ?? itemForCategoryPopup.defaultPrice ?? 0
          }
          addons={itemForCategoryPopup.addons}
          pricingModels={itemForCategoryPopup.variantsV2?.pricingModels}
          onAddToCart={() => {
            setIsVarAddPopUpVisible(false);
          }}
          isV2={!!itemForCategoryPopup?.variantsV2}
          addItem={addItem}
        />
      ) : null}
    </div>
  );
};

export default Cart;

