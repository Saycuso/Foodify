import Shimmer from "./Shimmer";
import { useParams } from "react-router-dom";
import useRestaurantMenu from "../utils/useRestaurantMenu";
import { useState } from "react";

const RestaurantMenu = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
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
    resInfo?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR || {};

  const handleCategoryClick = (categoryId) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  return (
    <div className="menu">
      <h1>{name}</h1>
      <p>
        {avgRatingString} ({totalRatingsString}){" "}
      </p>
      <p>
        {cuisines?.join(", ")} - {costForTwoMessage}{" "}
      </p>
      <ul>
        {cards.map((cardcat, index) => {
          const categoryData = cardcat?.card?.card || {};
          const { title, itemCards = [] } = categoryData;
          const categoryId = categoryData.categoryId || `category-${index}`; // Fallback for missing ID

          return (
            <li key={categoryId} className="font-bold text-2xl">
              <div
                className=" border-s-black pb-2 w-full"
                onClick={() => handleCategoryClick(categoryId)}
              >
                <span>{title}</span>
                {itemCards.length > 0 && (
                  <>
                    ({itemCards.length})
                    <span>{expandedCategory === categoryId ? "▲" : "▼"}</span>
                  </>
                )}
              </div>
              {expandedCategory === categoryId && (
                <ul className="font-medium mt-2 pl-0">
                  {itemCards.map((item) => (
                    <li key={item.card.info.id} className="py-3 pl-2 border-b border-gray-400 opacity-100 w-200">
                      {item.card.info.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RestaurantMenu;
