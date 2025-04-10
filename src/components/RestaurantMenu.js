// RestaurantMenu.js
import Shimmer from "./Shimmer";
import { useParams } from "react-router-dom";
import useRestaurantMenu from "../utils/useRestaurantMenu";
import { useState } from "react";
import RestaurantCategory from "./RestaurantCategory";

const RestaurantMenu = () => {
  const [ExpandedCategories, setExpandedCategories] = useState([]);
  const [ExpandedSubCategories, setExpandedSubCategories] = useState([]);
  const [Filters, setFilters] = useState({
    isVeg: false,
    nonVeg: false,
    bestseller: false,
  });

  const { resId } = useParams();
  const resInfo = useRestaurantMenu(resId);

  if (resInfo == null) return <Shimmer />;

  const {
    name,
    cuisines,
    avgRatingString,
    costForTwoMessage,
    totalRatingsString,
    hasBestsellerItems,
    hasGuiltfreeItems
  } = resInfo?.cards[2]?.card?.card?.info || {};

  const isPureVeg = resInfo?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards[0].card.card.isPureVeg == true;

  const { cards = [] } =
    resInfo?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR || {};

  const filteredCards = cards.filter(
    (maincard) =>
      maincard?.card?.card?.["@type"] ===
        "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory" ||
      maincard?.card?.card?.["@type"] ===
        "type.googleapis.com/swiggy.presentation.food.v2.NestedItemCategory"
  );

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className="flex justify-center">
      <div className="w-[850px] max-w-[100%]">
        <div className="px-6">
          <h1>{name}</h1>
          <p>
            {avgRatingString} ({totalRatingsString})
          </p>
          <p>
            {cuisines?.join(", ")} - {costForTwoMessage}
          </p>
        </div>

        {/* FILTER SECTION */}
        <div className="px-6 py-4 flex gap-4">
        {!isPureVeg && (
             <>
             <label className="flex items-center gap-2">
             <input
               type="checkbox"
               name="isVeg"
               checked={Filters.isVeg}
               onChange={handleFilterChange}
             />
             Veg
           </label>
           <label className="flex items-center gap-2">
             <input
               type="checkbox"
               name="nonVeg"
               checked={Filters.nonVeg}
               onChange={handleFilterChange}
             />
             Non-Veg
           </label>
           </>
           )}
           
           {(hasBestsellerItems === true) && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="bestseller"
              checked={Filters.bestseller}
              onChange={handleFilterChange}
            />
            Bestseller
          </label>
           )}
           {(hasGuiltfreeItems === true) && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="Guiltfree"
              checked={Filters.isGuiltfree              }
              onChange={handleFilterChange}
            />
            Guiltfree
          </label>
           )}
        </div>

        {/* CATEGORY LIST */}
        <div className="px-6">
          <ul>
            {filteredCards.map((cardcat, index) => (
              <RestaurantCategory
                key={`category-${cardcat.card.card.categoryId || cardcat.card.card.title || index}`}
                data={cardcat.card.card}
                Filters={Filters}
                ExpandedCategories={ExpandedCategories}
                setExpandedCategories={setExpandedCategories}
                ExpandedSubCategories={ExpandedSubCategories}
                setExpandedSubCategories={setExpandedSubCategories}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu;
