import { RESIMG_URL } from "../utils/constants";
import { truncateText } from "../utils/constants";
const RestaurantCard = (props) => {
    const {resData} = props
    const {
      cloudinaryImageId = "",
      name = "Restaurant Name Unavailable",
      cuisines = [],
      costForTwo = "Cost Unavailable",
      avgRating = "Delivery Time Unavailable"} = resData
    console.log(props)
    return (
      <div className="m-4 p-4 w-[300px] h-[320px] bg-orange-200 rounded-xl shadow-md shadow-amber-500 transition-transform duration-150 hover:scale-95 hover:opacity-95">
        <img
          alt="res-logo"
          className="rounded-xl w-150 h-50"
          src={ RESIMG_URL + 
            cloudinaryImageId}
        />
        <div className="ms-1.5 mt-1">
        <h3 className="font-bold">{truncateText(name, 30)}</h3>
        <h4 >{truncateText(cuisines.join(", "),30)}</h4>
        <h4>{costForTwo}</h4>
        <h4>{avgRating}</h4>
        </div>
      </div>
    );
  };

export default RestaurantCard;