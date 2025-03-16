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
      <div className="res-card" >
        <img
          alt="res-logo"
          className="res-logo"
          src={ RESIMG_URL + 
            cloudinaryImageId}
        />
        <h3 className="overlay-text">{truncateText(name, 25)}</h3>
        <h4 >{truncateText(cuisines.join(", "),20)}</h4>
        <h4>{costForTwo}</h4>
        <h4>{avgRating}</h4>
      </div>
    );
  };

export default RestaurantCard;