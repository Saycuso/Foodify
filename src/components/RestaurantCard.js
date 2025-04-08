import { RESIMG_URL } from "../utils/constants";
import { truncateText } from "../utils/constants";
const RestaurantCard = (props) => {
  const { resData } = props;
  const {
    cloudinaryImageId = "",
    name = "Restaurant Name Unavailable",
    cuisines = [],
    costForTwo = "Cost Unavailable",
    avgRating = "Delivery Time Unavailable",
  } = resData;
  console.log(props);
  return (
    <div className="w-full h-full">
      <img
        alt="res-logo"
        className="rounded-xl w-150 h-50 "
        src={RESIMG_URL + cloudinaryImageId}
      />
      <div className="ms-1.5 mt-1">
        <h3 className="font-bold">{truncateText(name, 30)}</h3>
        <h4>{truncateText(cuisines.join(", "), 30)}</h4>
        <h4>{avgRating}</h4>
      </div>
    </div>
  );
};


// Higher Order Component

// input - RestaurantCard = RestaurantCardDiscounted

export const withDiscountLabel = (RestaurantCard) => {
  return (props) => {
    const { resData } = props;
    const {aggregatedDiscountInfoV3} = resData;
    return (
         <>
         <RestaurantCard {...props} />
         </>    
    );
  };
};

export default RestaurantCard;
