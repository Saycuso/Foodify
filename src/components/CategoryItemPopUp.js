// Updated CategoryItemPopUp
import PopupWrapperGeneric from "../reuseables/PopupWrapperGeneric";
import { useState, useEffect } from "react";
import { usePricing } from "../utils/usePricing";
import { useRestaurant } from "./RestaurantContext";
import { useCartfooter } from "../utils/useCartfooter";

const CategoryItemPopUp = ({
  item,
  variantGroups = [],
  onClose,
  baseprice,
  addons = [],
  pricingModels = [],
  onAddToCart,
  isV2,
  addItem,
  clearCart,
  PendingItem,
  setPendingItem,
  setClearCartAndContinue,
  pendingItem
}) => {
  const {
    selections,
    setSelections,
    resData,
    resetSelections,
    setCurrentPopupMatchedPrice,
  } = useRestaurant();
  const {
    addonSelections,
    variantSelections,
    totalAddonPrice,
    totalVariantPrice,
  } = selections;
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const currentGroup = variantGroups[stepIndex];
    if (!currentGroup) return;
    const groupId = currentGroup.groupId;
    const defaultVar = currentGroup.variations.find((v) => v.default === 1);
    if (defaultVar && !variantSelections[groupId]) {
      const fullVar = currentGroup.variations.find(
        (v) => v.id === defaultVar.id
      );
      // console.log("VARIANT SELECTIONS",variantSelections)
      setSelections((prev) => ({
        ...prev,
        variantSelections: {
          ...prev.variantSelections,
          [groupId]: {
            id: fullVar.id,
            price: fullVar.price ?? 0,
            name: fullVar.name ?? 0,
          },
        },
      }));
    }
  }, [stepIndex, variantGroups]);

  const handleVariantChange = (groupId, variationId, price, name) => {
    setSelections((prev) => {
      let newVarianttotalPrice = prev.totalVariantPrice;
      const prevSelectionId = prev.variantSelections[groupId].id;
      const prevSelection = prevSelectionId
        ? variantGroups
            .find((group) => group.groupId === groupId)
            ?.variations.find((v) => v.id === prevSelectionId)
        : null;

      const prevprice = prevSelection?.price ?? 0;
      const safePrice = price ?? 0;

      newVarianttotalPrice = newVarianttotalPrice - prevprice + safePrice;
      return {
        ...prev,
        variantSelections: {
          ...prev.variantSelections,
          [groupId]: {
            id: variationId,
            price: price,
            name: name,
          },
        },
        totalVariantPrice: newVarianttotalPrice,
      };
    });
  };

  const handleAddonToggle = (groupId, choiceId, price, maxAddons, name) => {
    setSelections((prev) => {
      const current = prev.addonSelections[groupId] || [];
      const isAlreadySelected = current.some((item) => item.id === choiceId);
      if (!isAlreadySelected && current.length >= maxAddons) {
        alert(`You can only select up to ${maxAddons} addons.`);
        return prev; // Don't update
      }
      let updated;
      let newAddontotalPrice = prev.totalAddonPrice || 0;

      if (isAlreadySelected) {
        updated = current.filter((item) => item.id !== choiceId);
        newAddontotalPrice -= price;
      } else {
        updated = [...current, { id: choiceId, price, name }];
        newAddontotalPrice += price;
      }
      //  console.log("🧾 newAddontotalPrice:", newAddontotalPrice); // RIGHT HERE
      return {
        ...prev,
        addonSelections: {
          ...prev.addonSelections,
          [groupId]: updated,
        },
        totalAddonPrice: newAddontotalPrice,
      };
    });
  };

  const handleMinChoicesValidation = () => {
    const matchingmodel = pricingModels.find((model) =>
      model.variations.every(
        ({ groupId, variationId }) =>
          variantSelections[groupId]?.id.toString() === variationId.toString()
      )
    );
    // ✅ CASE 1: No pricingModels or model without variations — validate all addon groups
    if (!matchingmodel || matchingmodel.variations.length === 0) {
      for (const group of addons) {
        const selectedChoices = addonSelections[group.groupId] || [];
        if (group.minAddons > 0 && selectedChoices.length < group.minAddons) {
          alert(
            `You must select at least ${group.minAddons} ${group.groupName}`
          );
          return false;
        }
      }
      return true;
    }
    const validAddonGroups = new Set(
      matchingmodel.addonCombinations?.map((combo) => combo.groupId?.toString())
    );
    for (const group of addons) {
      if (!validAddonGroups.has(group.groupId.toString())) continue;

      const selectedChoices = addonSelections[group.groupId] || [];
      if (group.minAddons > 0 && selectedChoices.length < group.minAddons) {
        alert(`You must select at least ${group.minAddons} ${group.groupName}`);
        return false;
      }
    }
    return true;
  };

  //  for totalprice
  const matchedPrice = usePricing({
    pricingModels,
    variantSelections,
    addonSelections,
    addons,
    totalAddonPrice,
    totalVariantPrice,
    baseprice,
    isV2,
  });

  useEffect(() => {
    if (setCurrentPopupMatchedPrice) {
      setCurrentPopupMatchedPrice(matchedPrice);
    }
  }, [matchedPrice, setCurrentPopupMatchedPrice]);

  const getFilteredAddons = () => {
    if (!pricingModels || pricingModels.length === 0) return addons;

    const matchedmodel = pricingModels.find((model) =>
      model.variations.every(
        ({ groupId, variationId }) =>
          variantSelections[groupId]?.id?.toString() === variationId.toString()
      )
    );

    return matchedmodel?.addonCombinations.length
      ? addons.filter((addongroup) =>
          addongroup.choices.some((choice) =>
            matchedmodel.addonCombinations.some(
              (combo) =>
                combo.groupId.toString() === addongroup.groupId.toString() &&
                combo.addonId.toString() === choice.id.toString()
            )
          )
        )
      : addons;
  };

  // for Vaiations
  const currentGroup = variantGroups[stepIndex];
  const previousGroup = stepIndex > 0 ? variantGroups[stepIndex - 1] : null;
  const previousId = previousGroup
    ? variantSelections[previousGroup.groupId].id
    : null;
  const previousvariation = previousGroup?.variations.find(
    (v) => v.id === previousId
  );

  // for Addons
  const totalSteps = variantGroups.length + (addons.length > 0 ? 1 : 0);

  return (
    <PopupWrapperGeneric onClose={onClose}>
      <div className="flex flex-col h-full">
        {stepIndex > 0 && previousvariation && (
          <div className="text-sm text-gray-400 flex justify-between">
            <span>Previously selected:{previousvariation.name}</span>
            <button
              className="hover:cursor-pointer"
              onClick={() => setStepIndex(0)}
            >
              change
            </button>
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {stepIndex < variantGroups.length && (
            <div key={currentGroup.groupId || 0}>
              <h3 className="font-semibold text-lg px-3 py-2">
                {currentGroup.name}
              </h3>
              {(() => {
                const selected = variantSelections[currentGroup.groupId];
                const selectedId = selected?.id;
                return (
                  <ul>
                    {currentGroup.variations.map((variation, id) => (
                      <label
                        key={variation.id || id}
                        htmlFor={`variant-${variation.id}`}
                        className="flex items-center w-full gap-3 px-3 py-2 cursor-pointer"
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="flex gap-2 items-center">
                            <span>{variation.isVeg === 1 ? "🟢" : "🔴"}</span>
                            <span className="opacity-90 text-[16px]">
                              {variation.name}
                            </span>
                          </span>
                        </div>
                        <input
                          type="radio"
                          name={`group-${currentGroup.groupId}`}
                          id={`variant-${variation.id}`}
                          className="accent-green-600"
                          checked={selectedId === variation.id}
                          onChange={() =>
                            handleVariantChange(
                              currentGroup.groupId,
                              variation.id,
                              variation.price,
                              variation.name
                            )
                          }
                        />
                      </label>
                    ))}
                  </ul>
                );
              })()}
            </div>
          )}
          {stepIndex === variantGroups?.length &&
            addons?.length > 0 &&
            getFilteredAddons().map((addongroup, index) => (
              <div key={addongroup.groupId || index}>
                <h3 className="font-semibold text-lg px-3 py-2">
                  {addongroup.groupName}
                </h3>
                <ul>
                  {addongroup.choices.map((choice, id) => (
                    <label
                      key={choice.id || id}
                      htmlFor={`addon-${choice.id}`}
                      className="flex items-center w-full gap-3 px-3 py-2 cursor-pointer"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="flex gap-2 items-center">
                          <span>{choice.isVeg === 1 ? "🟢" : "🔴"}</span>
                          <span className="opacity-90 text-[16px]">
                            {choice.name}
                          </span>
                        </span>
                        {choice.price && (
                          <span className="opacity-70 text-[16px]">
                            + ₹ {choice.price / 100}
                          </span>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        id={`addon-${choice.id}`}
                        className="accent-green-600"
                        checked={
                          addonSelections[addongroup.groupId]?.some(
                            (item) => item.id === choice.id
                          ) || false
                        }
                        onChange={() => {
                          handleAddonToggle(
                            addongroup.groupId,
                            choice.id,
                            choice.price || 0,
                            addongroup.maxAddons,
                            choice.name
                          );
                        }}
                      />
                    </label>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        {/* Non-scrollable Footer */}
        {/* Footer */}
        {stepIndex < totalSteps - 1 ? (
          <div className="p-5 border-t shadow-md bg-white sticky bottom-0 z-10 flex justify-between">
            <span>
              {stepIndex + 1}/{variantGroups.length}
            </span>
            <button onClick={() => setStepIndex((prev) => prev + 1)}>
              Continue
            </button>
          </div>
        ) : (
          <div className="p-5 border-t shadow-md bg-white sticky bottom-0 z-10 flex justify-between">
            <span>₹{Number((matchedPrice || 0) / 100)}</span>
            <button
              onClick={() => {
                if (!handleMinChoicesValidation()) return;
                // 1. Clear the old cart BEFORE adding the new item
                // The `clearCartAndContinue` function is already set in RestaurantMenu.
                // So, we just need to call it here.
                if(pendingItem){
                if (clearCart) {
                  clearCart();
                }}
                // console.log("Add clicked");
                const itemToAdd = {
                  id: item.id,
                  price: matchedPrice || baseprice,
                  name: item.name,
                  variants: variantSelections || [],
                  addons: addonSelections || [],
                  OriginalMenuItemInfo: item,
                };
                addItem(itemToAdd, resData.id, resData);
                if (onAddToCart) {
                  onAddToCart();
                }
                setTimeout(() => {
                  resetSelections();
                }, 0);

                if (pendingItem) {
                  setPendingItem(null);
                  setClearCartAndContinue(null);
                }
              }}
            >
              Add item to cart
            </button>
          </div>
        )}
      </div>
    </PopupWrapperGeneric>
  );
};

export default CategoryItemPopUp;
