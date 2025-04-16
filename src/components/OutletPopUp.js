// OutletPopUp.js
import PopupWrapperGeneric from "../reuseables/PopupWrapperGeneric";

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
       <PopupWrapperGeneric onClose={onClose}>  
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
        </PopupWrapperGeneric>
  );
};

export default OutletPopUp;
