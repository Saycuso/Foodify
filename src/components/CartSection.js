import { useRestaurant } from "./RestaurantContext";

const CartSection = () => {
    const {restaurantName} = useRestaurant();
    return(
    <div className="bg-white h-[800px]">

        {!restaurantName ? 
             <p>Please select a restaurant first</p>    
            :
            <h2>{restaurantName}</h2>
            }
   
        </div>
    )
}

export default CartSection