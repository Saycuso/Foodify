// RestaurantMenu.js
import Shimmer from "./Shimmer";
import { useParams } from "react-router-dom";
import useRestaurantMenu from "../utils/useRestaurantMenu";
import { useState } from "react";
import RestaurantCategory from "./RestaurantCategory";

const RestaurantMenu = () => {
  const [ExpandedCategories, setExpandedCategories] = useState([]);
  const [ExpandedSubCategories, setExpandedSubCategories] = useState([]);
  const { resId } = useParams();
  const resInfo = useRestaurantMenu(resId);

  if (resInfo == null) return <Shimmer />;

  const {
    name,
    cuisines,
    avgRatingString,
    costForTwoMessage,
    totalRatingsString,
  } = resInfo?.cards[2]?.card?.card?.info || {};

  const { cards = [] } =
    resInfo?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR || {} ;

  const filteredCards = cards.filter(
    (maincard) => 
      maincard?.card?.card?.["@type"] === 
    "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory" ||
      maincard?.card?.card?.["@type"] ===
    "type.googleapis.com/swiggy.presentation.food.v2.NestedItemCategory"
  );
    

  return (
    <div className="menu">
      <h1>{name}</h1>
      <p>
        {avgRatingString} ({totalRatingsString})
      </p>
      <p>
        {cuisines?.join(", ")} - {costForTwoMessage}
      </p>
      <ul>
        {filteredCards.map((cardcat, index) => (
          <RestaurantCategory
            key={`category-${cardcat.card.card.categoryId || cardcat.card.card.title || index}`}
            data={cardcat.card.card}
            ExpandedCategories={ExpandedCategories}
            setExpandedCategories={setExpandedCategories}
            ExpandedSubCategories={ExpandedSubCategories}
            setExpandedSubCategories={setExpandedSubCategories}
          />
        ))}
      </ul>
    </div>
  );
};

export default RestaurantMenu;


