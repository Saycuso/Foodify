import Shimmer from "./Shimmer";
import { useParams } from "react-router-dom";
import useRestaurantMenu from "../utils/useRestaurantMenu";

const RestaurantMenu = () => {
  const { resId } = useParams();
  const resInfo = useRestaurantMenu(resId)
 
  if (resInfo == null) return <Shimmer />;

  const {
    name,
    cuisines,
    avgRatingString,
    costForTwoMessage,
    totalRatingsString,
  } = resInfo?.cards[2]?.card?.card?.info || {};
  
  const { itemCards } =
    resInfo?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards[2]?.card?.card || [];
  
     if (!itemCards || !Array.isArray(itemCards) || itemCards.length === 0) {
       console.log("itemCards is empty or undefined");
       return <p>Menu data not available. Please try again later.</p>;
     }
    
  return (
    <div className="menu">
      <h1>{name}</h1>
      <p>
        {avgRatingString} ({totalRatingsString}){" "}
      </p>
      <p>
        {cuisines.join(", ")} - {costForTwoMessage}{" "}
      </p>
      <ul>
        {itemCards.map((item) => (
          <li key={item.card.info.id}>
            {item.card.info.name} - ₹{item.card.info.price/100}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantMenu;
