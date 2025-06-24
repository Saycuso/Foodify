//Updated RestaurantContext.js
import { children, createContext, useContext, useEffect, useState, useCallback} from "react";

export const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantareaName, setRestaurantAreaName] = useState("");
  const [customizingItem, setCustomizingItem] = useState(null);
  const [popupItemId,setPopupItemId] = useState(null);
  const [showCartFooter, setShowCartFooter] = useState(false);
  const [isvaraddPopupVisible, setIsVarAddPopUpVisible] = useState(false);
  const [resData, setResData] = useState(() => {
    const stored = localStorage.getItem("resData");
    return stored ? JSON.parse(stored) : {};
  });
  const [selections, setSelections] = useState({
    variantSelections: {}, // groupId: Id
    addonSelections: {}, // groupId: [id, id, id, id]
    totalAddonPrice: 0,
    totalVariantPrice: 0,
  });
  const [lastCustomisationMap, setLastCustomisationMap] = useState(()=>{
    const storedMap = localStorage.getItem("lastCustomizationMap");
    return storedMap ? JSON.parse(storedMap) : {};
  });
  const [currentPopupMatchedPrice, setCurrentPopupMatchedPrice] = useState(null)

  useEffect(() => {
    localStorage.setItem("resData", JSON.stringify(resData));
  }, [resData]);

  useEffect(() => {
    localStorage.setItem("lastCustomizationMap", JSON.stringify(lastCustomisationMap));
  }, [lastCustomisationMap]);

    const resetSelections = useCallback(() => {
      setSelections({
        variantSelections: {},
        addonSelections: {},
        totalAddonPrice: 0,
        totalVariantPrice: 0,
      });
    }, []);

  return (
    <RestaurantContext.Provider
      value={{
        restaurantName,
        restaurantareaName,
        setRestaurantName,
        setRestaurantAreaName,
        popupItemId,
        setPopupItemId,
        resData,
        setResData,
        lastCustomisationMap,
        setLastCustomisationMap,
        customizingItem,
        setCustomizingItem,
        isvaraddPopupVisible,
        setIsVarAddPopUpVisible,
        selections,
        setSelections,
        currentPopupMatchedPrice,
        setCurrentPopupMatchedPrice,
        resetSelections,
        showCartFooter,
        setShowCartFooter,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export const useRestaurant = () => useContext(RestaurantContext);