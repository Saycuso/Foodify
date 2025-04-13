// useRestaurantOutletHook.js

import { useState, useEffect } from "react";
import { OUTLET_URL } from "./constants";
import { mockOutletData } from "../mockdata/mockOutletData";

const useRestaurantOutletHook = (resId) => {
  const [outletData, setOutletData] = useState(null);

  useEffect(() => {
    if (resId) {
      setTimeout(() => {
        setOutletData(mockOutletData);
      }, 100);
    }
  }, [resId]);
  return outletData;
};

export default useRestaurantOutletHook;
