import { Children, createContext, useContext, useState } from "react";

export const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
    const [restaurantName, setRestaurantName] = useState("");
    console.log("restaurantName in component:", restaurantName);

    return(
        <RestaurantContext.Provider value={{ restaurantName, setRestaurantName}}>
            {children}
        </RestaurantContext.Provider>
    )
}

export const useRestaurant = () => useContext(RestaurantContext);