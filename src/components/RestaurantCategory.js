import { ChevronDown, ChevronUp } from "lucide-react";

const RestaurantCategory = ({
  data,
  ExpandedCategories,
  setExpandedCategories,
  ExpandedSubCategories,
  setExpandedSubCategories,
}) => {
  const {
    title,
    itemCards = [],
    categories,
    categoryId,
  } = data;

  const isExpanded = ExpandedCategories.includes(categoryId);
  const hasSubCategories = categories?.length > 0;
  const hasItemsOnly = itemCards?.length > 0 && !hasSubCategories;

  const handleCategoryClick = () => {
    if (isExpanded) {
      setExpandedCategories(ExpandedCategories.filter((id) => id !== categoryId));
    } else {
      setExpandedCategories([...ExpandedCategories, categoryId]);
    }
  };

  const handleSubCategoryClick = (subCategoryId) => {
    if (ExpandedSubCategories.includes(subCategoryId)) {
      setExpandedSubCategories(ExpandedSubCategories.filter((id) => id !== subCategoryId));
    } else {
      setExpandedSubCategories([...ExpandedSubCategories, subCategoryId]);
    }
  };

  return (
    <li className="font-bold text-[20px] text-b">
      <div
        className="border-s-black hover:cursor-pointer flex justify-between items-center mx-95 bg-cyan-300 mb-8"
        onClick={hasItemsOnly ? handleCategoryClick : undefined}
      >
        <span className="text-[20px] flex items-center gap-1">
          <span>{title}</span>
          {(itemCards.length > 0 || hasSubCategories) && (
            <span className="text-[18px] opacity-70">
              ({itemCards.length || categories?.length})
            </span>
          )}
        </span>
        {(hasItemsOnly) && (
          <span className="flex items-center">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </span>
        )}
      </div>

      {(hasSubCategories || isExpanded) && (
        <ul className="font-medium -mt-4 mb-4">
          {categories?.length > 0
            ? categories.map((sub) => {
                const subExpanded = ExpandedSubCategories.includes(sub.categoryId);

                return (
                  <li key={`sub-${sub.categoryId}-${sub.title}`}>
                    <div
                      onClick={() => handleSubCategoryClick(sub.categoryId)}
                      className="border-s-black hover:cursor-pointer flex justify-between items-center mx-95 opacity-80 font-bold text-[18px] bg-green-300 mb-2"
                    >
                      <span className="text-[20px] flex items-center gap-1">
                        {sub.title}
                        <span className="text-[18px] opacity-70">
                          ({sub.itemCards.length})
                        </span>
                      </span>
                      <span className="flex items-center">
                        {subExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </span>
                    </div>

                    {subExpanded && (
                      <ul className="mb-2">
                        {sub.itemCards.map((item) => (
                          <li
                            key={`item-${item.card.info.id || item.card.info.name}`}
                            className="border-b border-gray-400 opacity-70 mx-95 text-[18px] font-bold bg-orange-400"
                          >
                            <span>
                              {item.card.info.name}
                              <br />₹
                              {item.card.info.price / 100 ||
                                item.card.info.defaultPrice / 100}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })
            : itemCards.map((item) => (
                <li
                  key={item?.card?.info?.id || item?.card?.info?.name}
                  className="border-b border-gray-400 opacity-70 mx-95 text-[18px] font-bold bg-blue-600 mb-2"
                >
                  <span>
                    {item.card.info.name}
                    <br /> ₹
                    {item.card.info.price / 100 ||
                      item.card.info.defaultPrice / 100}
                  </span>
                </li>
              ))}
        </ul>
      )}
    </li>
  );
};

export default RestaurantCategory;
