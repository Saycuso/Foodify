// CustomizationPopUp.js

import PopupWrapper from "../reuseables/PopupWrapperGeneric"
import { useRestaurant } from "./RestaurantContext";

const CustomizationPopUp = ({
  item,
  previous,
  addItem,
  onClose,
  baseprice,
  handlePopup
}) => {
  const previousaddons = previous?.addons || {};
  const previousvariant = previous?.variants || {};
  const previousprice = previous?.price || 0;
  const {resData} = useRestaurant();
  //  for totalprice
  return (
    <PopupWrapper onClose={onClose}>
      <div className="flex flex-col h-full">
        <div>
          <h3 className="opacity-80 text-[14px]">{item.name}</h3>
          <h2 className="opacity-85 font-bold text-[24px]">
            Repeat previous customisation?
          </h2>
        </div>
        {/* Scrollable part */}
        <div className="mx-5 mt-8 flex gap-2">
          {Object.values(previousvariant)
              .flat()
              .map((variant, index)=>(
                <span className="text-[14px]" key={index}>
               {variant.name}
                </span>
              ))
            }
          {Object.values(previousaddons)
            .flat()
            .map((addon, index) => (
              <span className="text-[14px]" key={index}>
                {addon.name} 
              </span>
            ))}
        </div>
        <div className="flex justify-between mt-30">
          <button className="border-2 p-2" onClick={()=>{handlePopup(item.id)}}>I'll choose</button>
          <button
            className="border-2 p-2"
            onClick={() => {
              const itemToAdd = {
              id: item.id,
              price: previousprice || baseprice,
              name: item.name,
              variants: previousvariant || [],
              addons: previousaddons || [],
              }  
               addItem(itemToAdd, resData.id, resData)
               onClose();
            }}
          >
            Repeat
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
};

export default CustomizationPopUp