import { useMemo } from "react";

export const usePricing = ({
  pricingModels = [],
  variantSelections = {},
  addonSelections = {},
  addons = [],
  totalAddonPrice = 0,
  totalVariantPrice = 0,
  baseprice = 0,
  isV2 = false,
}) => {
  const matchedPrice = useMemo(() => {
    if (!pricingModels || pricingModels.length === 0) {
      if (!isV2 && addons.length > 0) {
        console.log("Adding addon price:", totalAddonPrice);
        return totalAddonPrice + totalVariantPrice;
      } else if (addons.length > 0) {
        console.log("newAddontotalPrice:", totalAddonPrice);
        console.log("Base price + addon price:", totalAddonPrice + baseprice);
        return totalAddonPrice + baseprice;
      }
    }

    const hasSelectedAddons = Object.values(addonSelections).some(
      (arr) => arr && arr.length > 0
    );

    for (const model of pricingModels) {
      const variantMatch = model.variations.every(
        ({ groupId, variationId }) =>
          variantSelections[groupId]?.toString() === variationId.toString()
      );

      if (model.addonCombinations?.length > 0 && hasSelectedAddons) {
        const selectedAddonPrice = Object.entries(addonSelections).reduce(
          (total, [groupId, selectedAddons]) => {
            selectedAddons.forEach((addon) => {
              const match = model.addonCombinations.find(
                (combo) =>
                  combo.groupId.toString() === groupId.toString() &&
                  combo.addonId.toString() === addon.id.toString()
              );
              if (match) {
                total += addon?.price || 0;
              }
            });
            return total;
          },
          0
        );

        if (variantMatch) {
          const totalPrice = model.price + selectedAddonPrice;
          console.log("🎯 Variant & addon match found in pricingModel");
          return totalPrice;
        }
      } else if (variantMatch) {
        console.log("💰 Returning price (variant only match)");
        return model.price;
      }
    }

    return 0; // default fallback if no match
  }, [
    pricingModels,
    variantSelections,
    addonSelections,
    addons,
    totalAddonPrice,
    totalVariantPrice,
    baseprice,
    isV2,
  ]);

  return matchedPrice;
};

