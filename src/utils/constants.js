// constant.js

export const RESIMG_URL = 
    "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/";

export const CATEGORY_IMG_URL = 
    "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/";


export const LOGO_URL = 
    "https://static.vecteezy.com/system/resources/previews/011/468/885/non_2x/food-logo-spoon-fork-icon-illustration-symbol-for-fast-delivery-app-restaurant-template-free-vector.jpg";

export const truncateText = (text, maxlength) => {
    return text.length > maxlength ? text.slice(0, maxlength) + "..." : text
  }
  
export const MENU_URL = 
    "https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=19.0073741&lng=73.1125136&restaurantId="

export const OUTLET_URL =
    "https://www.swiggy.com/dapi/menu/api/v1/json/layout-section/MENU_MULTI_OUTLET"

