import RestaurantCard from "./RestaurantCard";
import { useState, useEffect } from "react";
import Shimmer from "./Shimmer";

const Body = () => {
  const [ListOfRestaurants, setListOfRestaurants] = useState([]);
  const [SearchText, setSearchText] = useState("");
  const [filteredRestaurants, setfilteredRestaurants] = useState([]);

  // Whenever state variable updates, react triggers a reconciliation cycle(re-renders the component)
  console.log("Body rendered!");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await fetch(
      "https://www.swiggy.com/dapi/restaurants/list/v5?lat=19.0073741&lng=73.1125136&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
    );

    const json = await data.json();
    console.log(json);

    setListOfRestaurants(json?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants);  //unchanged
    setfilteredRestaurants((json?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants))
  };

  // Conditional Rendering
  return ListOfRestaurants.length == 0 ? (
    <Shimmer />
  ) : (
    <div className="body">
      <div className="Filter">
        {/* Search Bar */}
        <div className="search">
          <input
            type="text"
            className="search-box"
            value={SearchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <button
            onClick={() => {
              // Filter the restaurant card and update
              // searchText
              console.log(SearchText);

              const filteredData = ListOfRestaurants.filter((res) =>
                res.info.name.toLowerCase().includes(SearchText.toLowerCase())
              );

              setfilteredRestaurants(filteredData);
            }}
          >
            Search
          </button>
        </div>

        {/* Button 1 */}
        <button
          className="all-btn"
          onClick={() => setfilteredRestaurants(ListOfRestaurants)} // Reload from API instead of mock data
        >
          All
        </button>

        {/* Button 2 */}
        <button
          className="rating-btn"
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

      {/* Restaurant container */}
      <div className="res-container">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant?.info?.id}
            resData={restaurant.info}
          />
        ))}
      </div>
    </div>
  );
};

export default Body;
