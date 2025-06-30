// cartSection.js
import { RESIMG_URL } from "../utils/constants";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

const CartSection = ({
  cartRestaurantInfo,
  cartItems,
  setCustomizingItem,
  addItem,
  removeItem, // Added removeItem prop
  resData,
  onAddToCart,
}) => {
  const { cloudinaryImageId } = cartRestaurantInfo || {};

  // You might want to calculate total bill here
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.count * item.price), 0) / 100;
  };

  const totalItemPrice = calculateTotal();
  const deliveryFee = 50; // Example fixed fee

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Restaurant Header */}
      <div className="flex items-center gap-4 p-6 border-b border-gray-200">
        <img
          alt="Restaurant Logo"
          className="h-16 w-16 rounded-full object-cover shadow-sm"
          src={RESIMG_URL + cloudinaryImageId}
        />
        <div className="flex flex-col">
          {!cartRestaurantInfo?.name ? (
            <h2 className="text-xl font-bold text-gray-800">Please add items from a restaurant</h2>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">{cartRestaurantInfo?.name}</h1>
              <span className="text-sm text-gray-500 font-medium">{cartRestaurantInfo?.areaName}</span>
            </>
          )}
        </div>
      </div>
      
      {/* Cart Items List - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
        <ul className="divide-y divide-gray-100">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => {
              const itemKey = `${item.id}-${JSON.stringify(item.variants || [])}-${JSON.stringify(item.addons || [])}-${index}`;

              return (
                <li
                  key={itemKey}
                  className="flex justify-between items-center py-4"
                >
                  {/* Left: Item info */}
                  <div className="flex flex-col max-w-[40%]">
                    <div className="font-bold text-base text-gray-800">{item.name}</div>
                    {/* Only show "Customize" if it's a customizable item */}
                    {(item.OriginalMenuItemInfo?.variantsV2?.length > 0 ||
                      item.OriginalMenuItemInfo?.addons?.length > 0 ||
                      item.OriginalMenuItemInfo?.variants?.length > 0) && (
                        <button
                          className="text-xs text-orange-500 font-semibold flex items-center mt-1 transition-colors duration-200 hover:text-orange-600"
                          onClick={() => setCustomizingItem(item)} // Pass the full item object
                        >
                          Customize
                          <ChevronRightIcon className="h-4 w-4 ml-0.5" />
                        </button>
                    )}
                  </div>

                  {/* Middle: Counter */}
                  <div
                    className="flex items-center border border-gray-300 rounded-md overflow-hidden text-sm font-semibold text-green-600 shadow-sm"
                  >
                    <button
                      className="px-2 py-1 transition-colors duration-200 hover:bg-gray-100"
                      onClick={() => removeItem(item)}
                    >
                      −
                    </button>
                    <span className="px-3 py-1 border-x border-gray-300 bg-gray-50 text-gray-900">
                      {item.count}
                    </span>
                    <button
                      className="px-2 py-1 transition-colors duration-200 hover:bg-gray-100"
                      onClick={() => {
                        // If it's a customizable item, open popup; otherwise, just add
                        if (item.OriginalMenuItemInfo?.variantsV2?.length > 0 || item.OriginalMenuItemInfo?.addons?.length > 0 || item.OriginalMenuItemInfo?.variants?.length > 0) {
                          setCustomizingItem(item); // Correct: Pass the full item object
                        } else {
                          addItem(item, resData?.id, resData);
                        }
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Right: Price */}
                  <div className="text-sm font-bold text-gray-800 w-24 text-right">
                    ₹{((item.count * item.price) / 100).toFixed(2)}
                  </div>
                </li>
              );
            })
          ) : (
            <div className="text-center text-gray-500 py-10 font-medium">Your cart is empty.</div>
          )}
        </ul>
      </div>
      
      {/* Bill Details & Actions - Sticky Footer */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Bill details</h2>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between items-center text-gray-600">
            <span className="font-medium">Item Total</span>
            <span className="font-semibold">₹{totalItemPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span className="font-medium">Delivery Fee</span>
            <span className="font-semibold">₹{deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-3 border-t border-dashed border-gray-300 mt-2">
            <span>TO PAY</span>
            <span>₹{(totalItemPrice + deliveryFee).toFixed(2)}</span>
          </div>
        </div>
        
        {/* Checkout Button */}
        {cartItems.length > 0 && (
          <button className="w-full mt-6 py-4 bg-orange-500 text-white font-bold text-lg rounded-lg shadow-lg transition-transform duration-200 hover:bg-orange-600 hover:scale-[1.01] active:scale-95">
            Proceed to Checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default CartSection;