// CategoryItemPopUp
import PopupWrapperGeneric from "../reuseables/PopupWrapperGeneric";
import { useState, useEffect } from "react";

const CategoryItemPopUp = ({
  item,
  variantGroups = [],
  onClose,
  baseprice,
  addons = [],
  pricingModels = [],
  onAddToCart,
  isV2,
  totalItems,
  addItem,
  cartItems,
  setShowCartFooter
}) => {


 const [stepIndex, setStepIndex] = useState(0)
 const [selections, setSelections] = useState({
  variantSelections: { }, // groupId: Id
  addonSelections: { }, // groupId: [id, id, id, id]
  totalAddonPrice: 0,
  totalVariantPrice: 0
 })

 useEffect(()=> { 
  const currentGroup = variantGroups[stepIndex];
  if(!currentGroup) return;
  const groupId = currentGroup.groupId;
  const defaultVar = currentGroup.variations.find(v=> v.default === 1);
  if(defaultVar && !selections.variantSelections[groupId]){
    setSelections(prev => ({
     ...prev,
     variantSelections: {
      ...prev.variantSelections,
      [groupId]: defaultVar.id
    }
    }))
  }
 }, [stepIndex,variantGroups])


 useEffect(() => {
  console.log("🔥 pricingModels just got updated", pricingModels);
  const price = getMatchedPrice(); // maybe conditionally only if pricingModels.length > 0
}, [pricingModels]);


 const handleVariantChange = (groupId, variationId, price) => {
  setSelections((prev) => {
    let newVarianttotalPrice = prev.totalVariantPrice ;

    const prevSelectionId = prev.variantSelections[groupId];
    const prevSelection = prevSelectionId
    ? variantGroups.find(group => group.groupId === groupId) 
    ?. variations.find(v=> v.id === prevSelectionId)
    : null;
        
    const prevprice = prevSelection?.price ?? 0;

    const safePrice = price ?? 0;

    newVarianttotalPrice = newVarianttotalPrice - prevprice + safePrice;
    return{  ...prev,
      variantSelections:{
        ...prev.variantSelections,
        [groupId]: variationId,
      },
      totalVariantPrice: newVarianttotalPrice,
    }
  })
 }


 const handleAddonToggle = (groupId, choiceId, price, maxAddons) => {
   setSelections((prev) => {
     const current = prev.addonSelections[groupId] || [];
     const isAlreadySelected = current.some((item)=> item.id === choiceId)
     if (!isAlreadySelected && current.length >= maxAddons) {
       alert(`You can only select up to ${maxAddons} addons.`);
       return prev; // Don't update
     }
     let updated;
     let newAddontotalPrice = prev.totalAddonPrice || 0;

     if (isAlreadySelected){
      updated = current.filter((item)=> item.id !== choiceId)
      newAddontotalPrice -= price;
     }else{
      updated = [...current, {id: choiceId, price}]
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


//  for totalprice

const getMatchedPrice = () => {
  const {
    addonSelections,
    variantSelections,
    totalAddonPrice,
    totalVariantPrice,
  } = selections;

  // Avoid matching if pricingModels are empty
  if (!pricingModels || pricingModels.length === 0) {
    if (!isV2 && addons.length > 0) {
      console.log("Adding addon price:", totalAddonPrice);
      return totalAddonPrice + totalVariantPrice;
    } else if (addons.length > 0) {
      console.log("newAddontotalPrice:", totalAddonPrice);
      console.log("Base price + addon price:", (totalAddonPrice) + (baseprice || 0));
      return (totalAddonPrice) + (baseprice || 0);
    }
  }
  // Guard to ensure at least one addon is selected before matching addons
  const hasSelectedAddons = Object.values(addonSelections).some(
    (arr) => arr && arr.length > 0
  );

  for (const model of pricingModels) {
    const variantMatch = model.variations.every(
      ({ groupId, variationId }) =>
        variantSelections[groupId]?.toString() === variationId.toString()
    );

    if (model.addonCombinations?.length > 0 && hasSelectedAddons) {
      const selectedAddonPrice = Object.entries(addonSelections).reduce(
        (total, [groupId, selectedAddons]) => {
          selectedAddons.forEach((addon) => {
            const match = model.addonCombinations.find(
              (combo) =>
                combo.groupId.toString() === groupId.toString() &&
                combo.addonId.toString() === addon.id.toString()
            );
            if (match) {
              const addonprice = addon?.price;

              total += addonprice;
            }
          });
          console.log(`🧮 Running total after group ${groupId}:`, total); // 👈 log each step
          return total;
        },
     0
      );
       console.log("variant price",model.price)
      if (variantMatch) {
        const totalPrice = model.price + selectedAddonPrice;
        console.log("🎯 Variant & addon match found in pricingModel");
        return totalPrice
      }
    } else if (variantMatch) {
      console.log("💰 Returning price (variant only match)");
      return model.price;
    }
  }
};



const getFilteredAddons = () =>{
  if(!pricingModels || pricingModels.length===0) 
    return addons

  const matchedmodel = pricingModels.find((model) =>
    model.variations.every(({groupId, variationId})=> 
    selections.variantSelections[groupId].toString() === variationId.toString()
    )
  );

  return matchedmodel?.addonCombinations.length
  ? addons.filter((addongroup)=>
  addongroup.choices.some((choice)=>
    matchedmodel.addonCombinations.some((combo)=>
    combo.groupId.toString() === addongroup.groupId.toString() &&
    combo.addonId.toString()=== choice.id.toString()
    )
  
  )
  ) : addons
}
  
// for Vaiations 
 const currentGroup = variantGroups[stepIndex];
 const selectedId = currentGroup
   ? selections.variantSelections[currentGroup.groupId]
   : null;
  const matchedPrice = getMatchedPrice();
  const previousGroup = stepIndex > 0 ? variantGroups[stepIndex - 1 ] : null;
  const previousId = previousGroup ? selections.variantSelections[previousGroup.groupId] : null;
  const previousvariation = previousGroup?.variations.find((v)=> v.id === previousId)
 
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
                            name="`group-${currentGroup.groupId}`"
                            id={`variant-${variation.id}`}
                            className="accent-green-600"
                            checked={selectedId === variation.id}
                            onChange={() =>
                              handleVariantChange(
                                currentGroup.groupId,
                                variation.id,
                                variation.price
                              )
                            }
                          />
                        </label>
                    ))}
                  </ul>
                </div>
              )}
             {stepIndex === variantGroups?.length && addons?.length > 0 &&
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
                          checked={selections.addonSelections[addongroup.groupId]?.some((item)=> item.id === choice.id) || false}
                          onChange={() => {
                            handleAddonToggle(addongroup.groupId, choice.id, choice.price || 0, addongroup.maxAddons);
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
            <span>₹{Number((matchedPrice || 0)/100)}</span>
            <button onClick={()=>{
              console.log("Add clicked");
              addItem({
                id:item.id,
                name: item.name,
                price: matchedPrice || baseprice,   
                variants: selections.variantSelections,
                addons: selections.addonSelections
              });
              if(onAddToCart) onAddToCart();
              setShowCartFooter(true);         
            }}>Add item to cart</button>
          </div>
        )}
      </div>
    </PopupWrapperGeneric>
  );
};

export default CategoryItemPopUp;
