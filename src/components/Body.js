import RestaurantCard, { withDiscountLabel } from "./RestaurantCard";
import { useState, useEffect } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";

const RestaurantCardDiscounted = withDiscountLabel(RestaurantCard);

const Body = () => {
  const [ListOfRestaurants, setListOfRestaurants] = useState([]);
  const [SearchText, setSearchText] = useState("");
  const [filteredRestaurants, setfilteredRestaurants] = useState([]);

  console.log("Body rendered!", ListOfRestaurants);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await fetch(
      "https://www.swiggy.com/dapi/restaurants/list/v5?lat=19.0073741&lng=73.1125136&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
    );

    const json = await data.json();

    // Find the card which contains restaurants
    const restaurantsData = json?.data?.cards?.find(
      (c) => c?.card?.card?.gridElements?.infoWithStyle?.restaurants
    )?.card?.card?.gridElements?.infoWithStyle?.restaurants;

    setListOfRestaurants(restaurantsData || []);
    setfilteredRestaurants(restaurantsData || []);
  };

  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return (
      <h1>Looks like you are offline, Please check your Internet connection</h1>
    );
  }

  // Conditional Rendering
  return !ListOfRestaurants || ListOfRestaurants.length === 0 ? (
    <Shimmer />
  ) : (
    <div className="body p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-center items-center gap-y-4 md:gap-x-4 mb-8 md:mb-12">
        {/* Search Bar */}
        <div className="search w-full md:w-[500px] flex h-10 border border-gray-900 rounded-full overflow-hidden">
          <input
            type="text"
            className="outline-none flex-grow pl-4 md:pl-6 text-gray-800"
            value={SearchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <button
            className="bg-orange-200 px-4 rounded-r-full hover:cursor-pointer border-l border-gray-900 font-semibold text-gray-800"
            onClick={() => {
              const filteredData = ListOfRestaurants.filter((res) =>
                res.info.name.toLowerCase().includes(SearchText.toLowerCase())
              );
              setfilteredRestaurants(filteredData);
            }}
          >
            Search
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-4 w-full md:w-auto">
          {/* Button 1 */}
          <button
            className="all-btn bg-orange-200 px-6 py-2 rounded-full hover:cursor-pointer border border-gray-500 font-semibold"
            onClick={() => setfilteredRestaurants(ListOfRestaurants)}
          >
            All
          </button>

          {/* Button 2 */}
          <button
            className="rating-btn bg-orange-200 px-6 py-2 rounded-full hover:cursor-pointer border border-gray-500 font-semibold"
            onClick={() => {
              const filteredList = ListOfRestaurants.filter(
                (res) => res.info?.avgRating > 4
              );
              setfilteredRestaurants(filteredList);
            }}
          >
            Top Rated Restaurants
          </button>
        </div>
      </div>

      {/* Restaurant container */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 mt-5">
        {filteredRestaurants.map((restaurant) => {
          const hasDiscount =
            restaurant?.info?.aggregatedDiscountInfoV3?.subHeader?.trim();
          const CardtoRender = hasDiscount
            ? RestaurantCardDiscounted
            : RestaurantCard;

          return (
            <Link
              key={restaurant.info.id}
              to={"/restaurants/" + restaurant.info.id}
            >
              <div className="relative group p-4 w-[280px] sm:w-[300px] h-[320px] bg-orange-200 rounded-xl shadow-md shadow-amber-500 transition-transform duration-150 hover:scale-95 hover:opacity-95">
                {hasDiscount && (
                  <label className="absolute text-white bg-gray-800 bottom-32 left-4 p-2 rounded-bl-xl">
                    {hasDiscount}
                  </label>
                )}
                <CardtoRender resData={restaurant.info} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Body;
