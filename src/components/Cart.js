// Cart.js

import { Link } from "react-router-dom";
import AddressSection from "./AddressSection";
import CartSection from "./CartSection";
import { useState } from "react";

const Cart = () => {

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
        <h2 className="mt-10 font-bold text-xl">Choose a delivery address</h2>
        <span className="opacity-65 font-semibold">
          Multiple addresses in this location
        </span>
        <div className="my-10">
          <AddressSection/>
        </div>
      </div>
    </div>
        </div>

        {/* Cart Section */}
        <div className="w-1/3 bg-white p-5 shadow-md ">
          <CartSection />
        </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


// 1. If you switch the restaurant you will have to reset your cart -> adding reset logic to cart
// 2. A little footer padding which shows up upon adding some item in cart (but only for that restaurant) -> add a lil footer which shows up
// 3. Upon adding some Item in the cart, cart index will be appended in the navbar
// 4. Name of the items added in the cart are visible if you hover over the cart element in the navbar along with image of restaurant.
// 5. Clicking the footer/cart element in the navbar will redirect you to cart window.
// 6. Cart window will be divided into 2 sections by ratio 2:3 and 1:3. on the 2:3 ratio user can store their addresses
// 7. The selected items in the cart will be shown on the 1:3 ratio side, with estaurant name and items selected.
// 8. You click on the little name "Customize" text below the item name which will open up the popup letting you edit your selections.
// 9. You can proceed to pay once you click the address box. it shows a button proceed to pay once u click on it
// 10. Can design dummy paying system with upi, cash on delivery and creditcard.
