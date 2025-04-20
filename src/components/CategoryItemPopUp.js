// CategoryItemPopUp
import PopupWrapperGeneric from "../reuseables/PopupWrapperGeneric";
import { useState, useEffect } from "react";

const CategoryItemPopUp = ({
  variantGroups = [],
  onClose,
  addons = [],
  pricingModels = []
}) => {


 const [stepIndex, setStepIndex] = useState(0)
 const [selections, setSelections] = useState({
  variantSelections: { }, // groupId: Id
  addonSelections: { }, // groupId: [id, id, id, id]
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


 const handleVariantChange = (groupId, variationId) => {
  setSelections(prev => ({
    ...prev,
    variantSelections:{
      ...prev.variantSelections,
      [groupId]: variationId
    }
  }))
 }

 const handleAddonToggle = (groupId, choiceId) => {
  setSelections(prev => {
    const current = prev.addonSelections[groupId] || [];
    const updated = current.includes(choiceId) 
    ? current.filter(id => id !== choiceId) 
    : [...current, choiceId];

    return{
      ...prev,
      addonSelections: {
        ...prev.addonSelections,
        [groupId] : updated
      }
    };
  });
 };

// for Vaiations
 const currentGroup = variantGroups[stepIndex];
 const selectedId = currentGroup
   ? selections.variantSelections[currentGroup.groupId]
   : null;
 
 const selectedVariation = currentGroup && selectedId
   ? currentGroup.variations.find((v) => v.id === selectedId)
   : null;
 
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
                                variation.id
                              )
                            }
                          />
                        </label>
                    ))}
                  </ul>
                </div>
              )}
             {stepIndex === variantGroups?.length && addons?.length > 0 &&
              addons.map((addongroup, index) => (
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
                          onChange={() => {
                            handleAddonToggle(addongroup.groupId, choice.id);
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
            <span></span>
            <button>Add item to cart</button>
          </div>
        )}
      </div>
    </PopupWrapperGeneric>
  );
};

export default CategoryItemPopUp;
