import Shimmer from "./Shimmer";
import { useParams } from "react-router-dom";
import useRestaurantMenu from "../utils/useRestaurantMenu";
import { useState } from "react";

const RestaurantMenu = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);

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
    console.log("Clicked Category:", categoryId);
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const handleSubCategoryClick = (subCategoryId) => {
    setExpandedSubCategory((prev) =>
      prev === subCategoryId ? null : subCategoryId
    );
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
        {cards.map((cardcat) => {
          const categoryData = cardcat?.card?.card;
          const {
            title,
            itemCards = [],
            categories,
            categoryId,
          } = categoryData;

          return (
            <li key={categoryId} className="font-bold text-[20px] text-b">
              <div
                className=" border-s-black pb-2 w-full hover:cursor-pointer flex mx-95 gap-2"
                onClick={() => handleCategoryClick(categoryId)}
              >
                <span className="">{title}</span>
                {(itemCards.length > 0 || categories?.length > 0) && (
                  <>
                    ({itemCards.length || categories?.length})
                    <span>{expandedCategory === categoryId ? "▲" : "▼"}</span>
                  </>
                )}
              </div>

              {expandedCategory === categoryId && (
                <ul className="font-medium mt-2 pl-0">
                  {categories?.length > 0
                    ? categories.map((sub) => (
                        <li key={sub.categoryId}>
                          <div
                            onClick={() =>
                              handleSubCategoryClick(sub.categoryId)
                            }
                            className=" border-s-black pb-2 w-full hover:cursor-pointer flex mx-95 gap-2 className= opacity-80 font-bold"
                          >
                            {sub.title} ({sub.itemCards.length})
                            <span>
                              {expandedSubCategory === sub.categoryId
                                ? "▲"
                                : "▼"}
                            </span>
                          </div>
                          {expandedSubCategory === sub.categoryId && (
                            <ul>
                              {sub.itemCards.map((item) => (
                                <li
                                  key={item.card.info.id}
                                  className="py-4 border-b border-gray-400 opacity-70 w-200 mx-95 text-[18px] font-bold "
                                >
                                  {item.card.info.name} - ₹
                                  {item.card.info.price / 100 ||
                                    item.card.info.defaultPrice / 100}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))
                    : itemCards.map((item) => (
                        <li
                          key={item.card.info.id}
                          className="py-4 border-b border-gray-400 opacity-70 w-200 mx-95 text-[18px] font-bold "
                        >
                          <span>
                            {item.card.info.name}
                            <br /> ₹
                            {item.card.info.price / 100 ||
                              item.card.info.defaultPrice / 100}
                          </span>
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
