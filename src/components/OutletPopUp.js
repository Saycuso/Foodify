// OutletPopUp.js
import { useState } from "react";
import useRestaurantOutletHook from "../utils/useRestaurantOutletHook";
import Shimmer from "./Shimmer";
import { Outlet } from "react-router-dom";
import PopupWrapper from "../reuseables/PopupWrapper";

const OutletPopUp = ({ onClose, outletData, currentInfo }) => {
  const {
    resId,
    locality: currentLocality,
    areaName: currentAreaName,
    avgRatingString: currentAvgRatingString,
    minDeliveryTime: currentMinDeliveryTime,
    maxDeliveryTime: currentMaxDeliveryTime,
    lastMileTravelString: currentLastMileTravelString,
  } = currentInfo;

  const siblingOutletCard = outletData.cards.find((card) =>
    card?.card?.["@type"]?.includes("SiblingOutletsSection")
  );

  const siblingOutlets = siblingOutletCard?.card.siblingOutlets || [];

  return (    
       <PopupWrapper onClose={onClose}>  
        <h2>Current Outlet</h2>
        <div>
          <h1>
            {currentLocality}, {currentAreaName}
          </h1>
          <span>
            {currentAvgRatingString}•{currentMinDeliveryTime} -{" "}
            {currentMaxDeliveryTime} • {currentLastMileTravelString}
          </span>
        </div>

        <h1>Other Outlets Around You</h1>

        <ul>
          {siblingOutlets.map((Outlet, i) => (
            <li key={i}>
              {Outlet.siblingOutlet.name}-{Outlet.siblingOutlet.areaName}
            </li>
          ))}
        </ul>
        </PopupWrapper>
  );
};

export default OutletPopUp;
