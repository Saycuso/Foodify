// CategoryItemPopUp
import PopupWrapperGeneric from "../reuseables/PopupWrapperGeneric";
import { useState } from "react";

const CategoryItemPopUp = ({ variantGroups = [], onClose, addons = [] , baseprice}) => {
  const [SelectedItems, setSelectedItems] = useState([]);
  const [showSecondPopup, setShowSecondPopup] = useState(false)
  const [firstVariantSelection, setFirstVariantSelection] = useState(null);


  const handleCheckBoxChange = (choice) => {
    setSelectedItems(prev =>{
      if(prev.find(item=>item.id === choice.id)){
         return prev.filter(item=> item.id !== choice.id)
      } else {
        return [...prev, choice]
      }
    })
  }
  
const totalPriceChoice = (baseprice || 0) + (SelectedItems.reduce((sum,item)=>sum+item.price,0)/100);


  return (
    <PopupWrapperGeneric onClose={onClose}>
      <div className="flex flex-col h-full">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Variant Groups */}
          {variantGroups.length > 0 && (
            <div key={variantGroups[0].groupId || 0}>
              <h3 className="font-semibold text-lg px-3 py-2">
                {variantGroups[0].name}
              </h3>
              <ul>
                {variantGroups[0].variations.map((variation, id) => (
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
                      name={`variant-${variantGroups[0].groupId || index}`}
                      id={`variant-${variation.id}`}
                      className="accent-green-600"
                      checked={firstVariantSelection?.id === variation.id}
                      onChange={() => setFirstVariantSelection(variation)}
                    />
                  </label>
                ))}
              </ul>
            </div>
          )}
          {showSecondPopup &&
            variantGroups.slice(1).map((group, index) => (
              <div key={group.groupId || index}>
                <h3 className="font-semibold text-lg px-3 py-2">
                  {group.name}
                </h3>
                <ul>
                  {group.variations.map((variation) => (
                    <label
                      key={variation.id}
                      className="flex items-center w-full gap-3 px-3 py-2 cursor-pointer"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="flex gap-2 items-center">
                          <span>{variation.isVeg === 1 ? "🟢" : "🔴"}</span>
                          <span className="opacity-90 text-[16px]">
                            {variation.name}
                          </span>
                        </span>
                        {variation.price && (
                          <span className="opacity-70 text-[16px]">
                            + ₹ {variation.price / 100}
                          </span>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="accent-green-600"
                        checked={SelectedItems.some(
                          (item) => item.id === variation.id
                        )}
                        onChange={() => handleCheckBoxChange(variation)}
                      />
                    </label>
                  ))}
                </ul>
              </div>
            ))}

          {/* Addons */}
          {addons.length > 0 &&
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
                        checked={SelectedItems.some(
                          (item) => item.id == choice.id
                        )}
                        onChange={() => {
                          handleCheckBoxChange(choice);
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
        {addons.length > 0 ? (
          <div className="p-5 border-t shadow-md bg-white sticky bottom-0 z-10">
            <span>Total: ₹ {totalPriceChoice}</span>
          </div>
        ) : variantGroups.length === 1 ? (
          <div className="p-5 border-t shadow-md bg-white sticky bottom-0 z-10">
            <span>Step 1/1</span>
            <button disabled={!firstVariantSelection}>Add Item</button>
          </div>
        ) : !showSecondPopup ? (
          <div className="p-5 border-t shadow-md bg-white sticky bottom-0 z-10">
            <span>Step 1/2</span>
            <button
              disabled={!firstVariantSelection}
              onClick={() => setShowSecondPopup(true)}
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="p-5 border-t shadow-md bg-white sticky bottom-0 z-10">
            <span>Step 2/2</span>
            <button>Add Item</button>
          </div>
        )}
      </div>
    </PopupWrapperGeneric>
  );
};

export default CategoryItemPopUp;
