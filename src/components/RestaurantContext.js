import { children, createContext, useContext, useEffect, useState } from "react";

export const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantareaName, setRestaurantAreaName] = useState("");
  const [resData, setResData] = useState(() => {
    const stored = localStorage.getItem("resData");
    return stored ? JSON.parse(stored) : {};
  });
  const [lastCustomisationMap, setLastCustomisationMap] = useState(()=>{
    const storedMap = localStorage.getItem("lastCustomizationMap");
    return storedMap ? JSON.parse(storedMap) : {};
  });

  useEffect(() => {
    localStorage.setItem("resData", JSON.stringify(resData));
  }, [resData]);

  useEffect(() => {
    localStorage.setItem("lastCustomizationMap", JSON.stringify(lastCustomisationMap));
  }, [lastCustomisationMap]);

  return (
    <RestaurantContext.Provider
      value={{
        restaurantName,
        restaurantareaName,
        setRestaurantName,
        setRestaurantAreaName,
        resData,
        setResData,
        lastCustomisationMap,
        setLastCustomisationMap,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export const useRestaurant = () => useContext(RestaurantContext);