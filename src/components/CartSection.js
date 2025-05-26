import { useRestaurant } from "./RestaurantContext";
import { RESIMG_URL } from "../utils/constants";

const CartSection = () => {
  const { restaurantName, restaurantareaName, resData } = useRestaurant();
  //console.log("resdata is", resData)
  const {cloudinaryImageId} = resData

  return (
    <div className="bg-white h-[800px]">
    {/* Title Container */}
      <div className="flex">
        <img
         alt="res-logo"
         className="h-15 w-15"
         src={RESIMG_URL+cloudinaryImageId}
        />
        <div>
          {!restaurantName ? (
            <h2>Please select a restaurant first</h2>
          ) : (
            <h1>{restaurantName}</h1>
          )}
          <span>{restaurantareaName}</span>
        </div>
      </div>
    </div>
  );
};

export default CartSection;