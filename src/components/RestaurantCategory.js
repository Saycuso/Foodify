import { ChevronDown, ChevronUp } from "lucide-react";
import { CATEGORY_IMG_URL } from "../utils/constants";
import { useState } from "react";
import CategoryItemPopUp from "./CategoryItemPopUp";

const RestaurantCategory = ({
  data,
  Filters,
  ExpandedCategories,
  setExpandedCategories,
  ExpandedSubCategories,
  setExpandedSubCategories,
}) => {
  const [popupItemId,setPopupItemId] = useState(null)
  const { title, itemCards = [], categories, categoryId } = data;
  const isExpanded = ExpandedCategories.includes(categoryId);
  const hasSubCategories = categories?.length > 0;
  const hasItemsOnly = itemCards?.length > 0 && !hasSubCategories;

  const handleCategoryClick = () => {
    if (isExpanded) {
      setExpandedCategories(
        ExpandedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setExpandedCategories([...ExpandedCategories, categoryId]);
    }
  };

  const handleSubCategoryClick = (subCategoryId) => {
    if (ExpandedSubCategories.includes(subCategoryId)) {
      setExpandedSubCategories(
        ExpandedSubCategories.filter((id) => id !== subCategoryId)
      );
    } else {
      setExpandedSubCategories([...ExpandedSubCategories, subCategoryId]);
    }
  };

  // 🧠 FILTER FUNCTION
  const filterItems = (items = []) => {
    return items.filter((item) => {
      const info = item.card?.info || {};
      const isVeg = info.isVeg === 1;
      const isBestseller = info.isBestseller === true;
      const isGuiltfree = info.isGuiltfree == true;

      if (Filters.isVeg && !isVeg) return false;
      if (Filters.nonVeg && isVeg) return false;
      if (Filters.bestseller && !isBestseller) return false;
      if (Filters.Guiltfree && !isGuiltfree) return false;
      return true;
    });
  };

  const filteredItemCards = filterItems(itemCards);

  // if we want to fetch items in subcategories beforhand lol
  const subCategoriesWithFilteredItems = (categories || []).map((sub) => ({
    ...sub,
    filtereditemCardsofSub: filterItems(sub.itemCards),
  }));

  const totalfilteredSubItems = subCategoriesWithFilteredItems.reduce(
    (sum, sub) => sum + sub.filtereditemCardsofSub.length,
    0
  );

  return (
    <li className="font-semibold text-lg">
      {(filteredItemCards.length > 0 || totalfilteredSubItems > 0) && (
        <div
          className="flex justify-between items-center py-3 hover:bg-gray-100 transition cursor-pointer"
          onClick={hasItemsOnly ? handleCategoryClick : undefined}
        >
          <span className="flex items-center gap-2">
            <div>{title}</div>
            {hasItemsOnly && (
              <span className="text-lg text-gray-500">
                ({filteredItemCards.length})
              </span>
            )}
          </span>
          {hasItemsOnly && (
            <span>
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </span>
          )}
        </div>
        //////////////////////////////////////////////////////////////////////////////////
      )}
      {(hasSubCategories || isExpanded) && (
        <ul className="mt-2 space-y-2">
          {categories?.length > 0
            ? categories.map((sub) => {
                const subExpanded = ExpandedSubCategories.includes(
                  sub.categoryId
                );
                const filteredSubItems = filterItems(sub.itemCards);

                return (
                  <li key={`sub-${sub.categoryId}-${sub.title}`}>
                    {filteredSubItems.length > 0 && (
                      <div
                        onClick={() => handleSubCategoryClick(sub.categoryId)}
                        className="flex justify-between items-center py-2 bg-gray-50 cursor-pointer hover:bg-gray-100"
                      >
                        <span className="flex items-center gap-2 text-base">
                          {sub.title}
                          <span className="text-sm text-gray-500">
                            ({filteredSubItems.length})
                          </span>
                        </span>
                        <span>
                          {subExpanded ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </span>
                      </div>
                    )}

                    {subExpanded && (
                      <ul className="mt-1 space-y-1">
                        {filteredSubItems.map((item) => (
                          <li
                            key={`item-${
                              item.card.info.id || item.card.info.name
                            }`}
                            className="text-[18px] text-gray-700 border-b border-gray-200 pb-1"
                          >
                            
                            <div className="flex justify-between">
                    <span>
                      {item.card.info.name}
                      <br />₹
                      {item.card.info.price / 100 ||
                        item.card.info.defaultPrice / 100}
                    </span>
                    <div className="relative w-[156px]">
                    <img    
                      className="w-full h-[144px] rounded-xl object-cover shadow"
                      alt="res-logo"
                      src={CATEGORY_IMG_URL + item?.card?.info?.imageId}
                    />
                    <button className="absolute left-1/2 -translate-x-1/2 bottom-0 bg-white border border-gray-300 text-green-600 font-semibold px-4 py-1 rounded-md shadow hover:shadow-md"
                     onClick={() => setPopupItemId(item.card.info.id)}
                    >
                      Add
                    </button>
                    {(item.card.info.variantsV2?.variantGroups || item.card.info.addons) && popupItemId === item.card.info.id &&  (
                      <CategoryItemPopUp
                       variantGroups = { item.card.info.variantsV2.variantGroups || []}
                       baseprice = {item.card.info.price / 100 ||
                        item.card.info.defaultPrice / 100 || {}}
                       addons = {item.card.info.addons || []}
                       onClose={()=>setPopupItemId(null)} 
                      />
                    )}
                    </div>
                  </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })
            : filteredItemCards.map((item) => (
                <li
                  key={item?.card?.info?.id || item?.card?.info?.name}
                  className="text-lg text-gray-700 border-b border-gray-200 py-2"
                >
                  <div className="flex justify-between">
                    <span>
                      {item.card.info.name}
                      <br />₹
                      {item.card.info.price / 100 ||
                        item.card.info.defaultPrice / 100}
                    </span>
                    <div className="relative w-[156px]">
                    <img    
                      className="w-full h-[144px] rounded-xl object-cover shadow"
                      alt="res-logo"
                      src={CATEGORY_IMG_URL + item?.card?.info?.imageId}
                    />
                    <button className="absolute left-1/2 -translate-x-1/2 bottom-0 bg-white border border-gray-300 text-green-600 font-semibold px-4 py-1 rounded-md shadow hover:shadow-md"
                     onClick={() => setPopupItemId(item.card.info.id)}
                    >
                      Add
                    </button>
                    {(item.card.info.variantsV2?.variantGroups || item.card.info.addons) && popupItemId === item.card.info.id &&  (
                      <CategoryItemPopUp
                       variantGroups = { item.card.info.variantsV2.variantGroups}
                       addons = {item.card.info.addons || []}
                       onClose={()=>setPopupItemId(null)} 
                      />
                    )}
                    </div>
                  </div>
                </li>
              ))}
        </ul>
      )}
    </li>
  );
};

export default RestaurantCategory;
