//cartSection.js
import { RESIMG_URL } from "../utils/constants";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

const CartSection = ({
  cartRestaurantInfo,
  cartItems,
  setCustomizingItem,
  addItem,
  resData,
  onAddToCart,
}) => {
  //console.log("resdata is", resData)
  const { cloudinaryImageId } = cartRestaurantInfo || {};

  return (
    <div className="bg-white h-[800px]">
      {/* Title Container */}
      <div className="flex">
        <img
          alt="res-logo"
          className="h-15 w-15"
          src={RESIMG_URL + cloudinaryImageId}
        />
        <div>
          {!cartRestaurantInfo?.name ? (
            <h2>Please select a restaurant first</h2>
          ) : (
            <h1>{cartRestaurantInfo?.name}</h1>
          )}
          <span>{cartRestaurantInfo?.areaName}</span>
        </div>
      </div>
      <div>
        <ul>
          {cartItems.length > 0
            ? cartItems.map((item) => {
                return (
                  <li
                    key={`item-${item.id}-${JSON.stringify(item.variants || [])}-${JSON.stringify(item.addons || [])}`}
                    className="flex justify-between items-center py-4 p-4"
                  >
                    {/* Left: Item info */}
                    <div className="flex flex-col">
                      <div className="font-semibold text-base">{item.name}</div>
                      <button className="text-[12px] opacity-85 font-semibold flex items-center">
                        Customize{" "}
                        <ChevronRightIcon className="h-4 w-4 mt-0.5 -ml-0.5 text-orange-500" />
                      </button>
                    </div>

                    {/* Middle: Counter */}
                    <div
                      className="flex items-center border border-black px-2 py-1 rounded gap-3"
                      style={{ borderColor: "rgba(0, 0, 0, 0.3)" }}
                    >
                      <button className="text-xl font-bold">−</button>
                      <span className="font-semibold text-green-600">
                        {item.count}
                      </span>
                      <button
                        className="text-xl font-bold text-green-600 hover:cursor-pointer"                      
                        onClick={() => {
                       // Prevent parent div's onClick
                          if (item.OriginalMenuItemInfo?.variantsV2?.length > 0 ||
                            item.OriginalMenuItemInfo?.addons?.length > 0 ||
                            item.OriginalMenuItemInfo?.variants?.length > 0
                          ) {
                            console.log("BRUHHHH")
                            setCustomizingItem(item);
                          } else {
                            addItem(item, resData?.id, resData);
                          }
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Right: Price */}
                    <div className="text-lg font-semibold text-gray-800">
                      ₹{(item.count * item.price) / 100}
                    </div>
                  </li>
                );
              })
            : 0}
        </ul>
      </div>
    </div>
  );
};

export default CartSection;
