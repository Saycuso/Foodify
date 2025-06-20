export const hasCustomizations = (itemInfo) => {
  return (
    itemInfo?.variantsV2?.variantGroups?.length > 0 ||
    itemInfo?.addons?.length > 0 ||
    itemInfo?.variants?.variantGroups?.length > 0
  );
};
