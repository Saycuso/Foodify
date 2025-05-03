import RestaurantCard, {withDiscountLabel} from "./RestaurantCard";
import { useState, useEffect } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";
const VegIcon = () => <CheckCircleIcon className="text-green-500 w-5 h-5" />;
const NonVegIcon = () => <XCircleIcon className="text-red-500 w-5 h-5" />;

const RestaurantCardDiscounted = withDiscountLabel(RestaurantCard);

const Body = () => {
  const [ListOfRestaurants, setListOfRestaurants] = useState([]);
  const [SearchText, setSearchText] = useState("");
  const [filteredRestaurants, setfilteredRestaurants] = useState([]);


  // Whenever state variable updates, react triggers a reconciliation cycle(re-renders the component)
  console.log("Body rendered!", ListOfRestaurants);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await fetch(
      "https://www.swiggy.com/dapi/restaurants/list/v5?lat=19.0073741&lng=73.1125136&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING"
    );

    const json = await data.json();
    // console.log(json);

    setListOfRestaurants(json?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants);  //unchanged
    setfilteredRestaurants((json?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants))
  };
   
  const isOnline = useOnlineStatus();

  if(isOnline == false){
    return <h1> Looks like you are offline, Please check your Internet connection</h1>
  }
  // Conditional Rendering
  return ListOfRestaurants.length === 0 ? (
    <Shimmer />
  ) : (
    <div className="body">
      <div className="">
        <div className="flex mt-10 ms-28 items-center gap-x-4">
          {/* Search Bar */}
          <div className="search w-[500px] h-10 flex border border-gray-900 rounded-full overflow-hidden ">
            <input
              type="text"
              className="outline-none flex-grow"
              value={SearchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}  
            />
            <button
              className=" bg-orange-200 px-4 rounded-r-lg hover:cursor-pointer border-gray-900"
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

          <div className="flex gap-x-4">
            {/* Button 1 */}
            <button
              className="all-btn bg-orange-200 px-6 py-2 rounded-3xl hover:cursor-pointer border border-gray-500"
              onClick={() => setfilteredRestaurants(ListOfRestaurants)} // Reload from API instead of mock data
            >
              All
            </button>

            {/* Button 2 */}
            <button
              className="rating-btn bg-orange-200 px-6 py-2 rounded-3xl hover:cursor-pointer border border-gray-500"
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
      </div>

      {/* Restaurant container */}
      <div className="flex flex-wrap justify-center items-center mt-5">
        {filteredRestaurants.map((restaurant) => {

          const hasDiscount = restaurant?.info?.aggregatedDiscountInfoV3?.subHeader?.trim();

          const CardtoRender = hasDiscount? RestaurantCardDiscounted : RestaurantCard;

          return(
          <Link
            key={restaurant.info.id}
            to={"/restaurants/" + restaurant.info.id}
          >
          <div className="relative group m-4 p-4 w-[300px] h-[320px] bg-orange-200 rounded-xl shadow-md shadow-amber-500 transition-transform duration-150 hover:scale-95 hover:opacity-95">
            {hasDiscount && (
              <label className="absolute text-white bg-gray-800 bottom-26 left-4 p-2 rounded-bl-xl">
              {hasDiscount}
            </label>
            )}
            <CardtoRender resData = {restaurant.info}/>
          </div>
          </Link>
          )
        })}
      </div>
    </div>
  );
};

export default Body;
