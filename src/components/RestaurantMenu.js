// RestaurantMenu.js
import Shimmer from "./Shimmer";
import { useParams } from "react-router-dom";
import useRestaurantMenu from "../utils/useRestaurantMenu";
import { useState, useEffect} from "react";
import RestaurantCategory from "./RestaurantCategory";
import OutletPopUp from "./OutletPopUp";
import useRestaurantOutletHook from "../utils/useRestaurantOutletHook";
import { useCartfooter } from "../utils/useCartfooter";
import { useNavigate } from "react-router-dom";
import { useRestaurant } from "./RestaurantContext";
import ConflictModal from "./ConflictModal";

const RestaurantMenu = () => {
  // --- All State Hooks First ---
  // These must be called unconditionally at the top level
  const [ExpandedCategories, setExpandedCategories] = useState([]);
  const [ExpandedSubCategories, setExpandedSubCategories] = useState([]);
  const [showPopupOutlet, setshowPopupOutlet] = useState(false);
  const [showCartFooter, setShowCartFooter] = useState(false);
  const [showConflictModal,setShowConflictModal] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [clearCartAndContinue, setClearCartAndContinue] = useState(null);
  const [Filters, setFilters] = useState({
    isVeg: false,
    nonVeg: false,
    bestseller: false,
  });

  // --- All Other Hooks ---
  // These must also be called unconditionally at the top level
  const {
    setRestaurantName,
    setRestaurantAreaName,
    setResData,
    resData,
    customizingItem,
    setCustomizingItem,
    isvaraddPopupVisible,
    setIsVarAddPopUpVisible,
    popupItemId,
    setPopupItemId,
  } = useRestaurant();
  const { cartState, cartItems, cartRestaurantId, addItem, removeItem, totalItems, clearCart } =
    useCartfooter({
      onCrossRestaurantAttempt: (item, clearCartFn) => {
        setPendingItem(item);   
        setShowConflictModal(true);
        setClearCartAndContinue(()=>clearCartFn)
      },
    }); 
  const { resId } = useParams();
  const resInfo = useRestaurantMenu(resId); // Custom hook
  const outletData = useRestaurantOutletHook(resId); // Custom hook
  const navigate = useNavigate(); // Hook from react-router-dom

  // --- Effects ---
  // These must be called unconditionally at the top level
  useEffect(() => {
    if (cartItems.length > 0) {
      setShowCartFooter(true);
    } else {
      setShowCartFooter(false);
    }
  }, [cartItems]); // Dependency array ensures this runs when cartItems changes

  useEffect(()=> {
    // This effect is now called unconditionally in every render,
    // but the logic inside only runs if resInfo and its name property exist.
    if(resInfo?.cards[2]?.card?.card?.info?.name){
      setRestaurantName(resInfo.cards[2].card.card.info.name);
      setRestaurantAreaName(resInfo.cards[2].card.card.info.areaName)
      setResData(resInfo.cards[2].card.card.info)
    }
  }, [resInfo, setRestaurantName]); // Depend on resInfo and setRestaurantNamwe

  // --- Early Returns (after all hooks have been called) ---
  // Now we check for loading state *after* all hooks have been called.
  // We can combine the checks since both are needed to render the menu.
  if (resInfo == null || outletData == null) {
      return <Shimmer />;
  }

  // --- Destructuring and other logic (after early returns) ---
  // It's now safe to destructure from resInfo and outletData
  // because we've returned early if they are null.
  const {
    name,
    cuisines,
    avgRatingString,
    costForTwoMessage,
    totalRatingsString,
    hasBestsellerItems,
    hasGuiltfreeItems,
    areaName,
    multiOutlet,
    locality
  } = resInfo?.cards[2]?.card?.card?.info || {}; // Using optional chaining as a safeguard

  const isPureVeg = resInfo?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards[0].card.card.isPureVeg === true;

  const {sla = {}} =  resInfo?.cards[2]?.card?.card?.info || {}; // Initialize sla as an empty object if null
  const {minDeliveryTime, maxDeliveryTime, lastMileTravelString } = sla;

  const { cards = [] } =
    resInfo?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR || {};

  const currentInfo = {
    resId,
    locality,
    areaName,
    avgRatingString,
    minDeliveryTime,
    maxDeliveryTime,
    lastMileTravelString,
  };

  const filteredCards = cards.filter(
    (maincard) =>
      maincard?.card?.card?.["@type"] ===
        "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory" ||
      maincard?.card?.card?.["@type"] ===
        "type.googleapis.com/swiggy.presentation.food.v2.NestedItemCategory"
  );

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // --- JSX Rendering ---
  return (
    <div className="flex justify-center">
      <div className="w-[850px] max-w-[100%]">
        <div className="px-6">
          <h1>{name}</h1>
          <p>
            {avgRatingString} ({totalRatingsString}) - {costForTwoMessage}
          </p>
          <p>{cuisines?.join(", ")}</p>
          <div className="flex gap-0.5">
            <span>Outlet - {areaName}</span>
            {multiOutlet === true && (
              <span
                className="hover hover:cursor-pointer"
                onClick={() => setshowPopupOutlet(true)}
              >
                ▾
              </span>
            )}
            {showPopupOutlet && (
              <OutletPopUp
                outletData={outletData}
                currentInfo={currentInfo}
                onClose={() => setshowPopupOutlet(false)}
                navigate={navigate}
              />
            )}
          </div>
        </div>

        {/* FILTER SECTION */}
        <div className="px-6 py-4 flex gap-4">
          {!isPureVeg && (
            <>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isVeg"
                  checked={Filters.isVeg}
                  onChange={handleFilterChange}
                />
                Veg
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="nonVeg"
                  checked={Filters.nonVeg}
                  onChange={handleFilterChange}
                />
                Non-Veg
              </label>
            </>
          )}

          {hasBestsellerItems === true && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="bestseller"
                checked={Filters.bestseller}
                onChange={handleFilterChange}
              />
              Bestseller
            </label>
          )}
          {hasGuiltfreeItems === true && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="Guiltfree"
                checked={Filters.isGuiltfree}
                onChange={handleFilterChange}
              />
              Guiltfree
            </label>
          )}
        </div>

        {/* CATEGORY LIST */}
        <div className="px-6">
          <ul>
            {filteredCards.map((cardcat, index) => {
              // console.log(
              //   `categoryId: ${cardcat.card.card.categoryId}, title: ${cardcat.card.card.title}, index: ${index}`
              // );
              return (
                <RestaurantCategory
                  key={`category-${cardcat.card.card.categoryId}-${
                       cardcat.card.card.title || index
                  }`}
                  data={cardcat.card.card}
                  Filters={Filters}
                  ExpandedCategories={ExpandedCategories}
                  setExpandedCategories={setExpandedCategories}
                  ExpandedSubCategories={ExpandedSubCategories}
                  setExpandedSubCategories={setExpandedSubCategories}
                  popupItemId={popupItemId}
                  setPopupItemId={setPopupItemId}
                  isvaraddPopupVisible={isvaraddPopupVisible}
                  setIsVarAddPopUpVisible={setIsVarAddPopUpVisible}
                  addItem={addItem}
                  removeItem={removeItem}
                  totalItems={totalItems}
                  showCartFooter={showCartFooter}
                  setShowCartFooter={setShowCartFooter}
                  cartItems = {cartItems}
                  clearCart = {clearCart}
                  cartRestaurantId = {cartRestaurantId}
                  customizingItem = {customizingItem}
                  setCustomizingItem = {setCustomizingItem}
                  setPendingItem = {setPendingItem}
                  setClearCartAndContinue = {setClearCartAndContinue}
                  setShowConflictModal = {setShowConflictModal}
                />
              );
            })}
          </ul>
        <div>
          {showConflictModal && (
            <ConflictModal
              onConfirm = {
                async()=>{
                console.log("Confirmed! Clearing cart and re-adding item...");
                if(clearCartAndContinue){
                  // 1. Execute the clearCart function obtained from useCartfooter
                  await clearCartAndContinue();
                 setTimeout(() => {
                    if(pendingItem){
                      console.log("Pending item:",pendingItem);
                      const hasVariantsorAddonsForPending =
                          pendingItem.variantsV2?.variantGroups?.length > 0 ||
                          pendingItem.addons?.length > 0 ||
                          pendingItem.variants?.variantGroups?.length >0;
                      
                      if(hasVariantsorAddonsForPending){
                         // If it has customizations, open CategoryItemPopUp for re-selection
                        setPopupItemId(pendingItem.id); // Pass the full pendingItem object
                        setIsVarAddPopUpVisible(true) // Show the popup
                        setShowConflictModal(false);
                        // The actual addItem will occur from within the popup's handleAddToCartFinal
                      }
                      else{
                           const itemToAdd = {
                             id: pendingItem.id,
                             price: pendingItem.price ?? pendingItem.defaultPrice,
                             name: pendingItem.name,
                             variants: [], // Ensure these are always arrays
                             addons: [], // Ensure these are always arrays
                           };
                        // If no customizations, add directly to the now empty cart
                        addItem(itemToAdd, resData.id, resData); // <--- Re-add the item to the current restaurant         
                        setShowConflictModal(false);
                        setPendingItem(null);
                        setClearCartAndContinue(null); // It's safe to clear now for this path.
                      } 
                    } else {
                        console.log("🟡 No pending item. Closing modal.");
                        setShowConflictModal(false);
                        setPendingItem(null);
                        setClearCartAndContinue(null); 
                    }    
                  }, 50);
                }
              }}
              onCancel = {()=>{
                // If user cancels, just close modal and clear pending state
                setShowConflictModal(false);
                setPendingItem(null);
                setClearCartAndContinue(null);
              }}
            />
          )}
        </div>
        </div>
        {totalItems > 0 && showCartFooter && (
          <div className="fixed bottom-0 left-0 right-0 bg-green-600 text-white flex justify-between items-center px-4 py-3 shadow-md z-40">
            <span>{totalItems} items added</span>
            <button
              className="bg-white text-green-600 px-4 py-1 rounded font-bold"
              onClick={() => { navigate("/Cart")}}
            >
              VIEW CART
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenu;
