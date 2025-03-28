import { useState, useEffect } from "react"

const useBody = () => {
const [ListOfRestaurants, setListOfRestaurants] = useState([]);

useEffect (()=>{
    fetchData()
}, [])

const fetchData = async () =>{
const data = await fetch( "https://www.swiggy.com/dapi/restaurants/list/v5?lat=19.0073741&lng=73.1125136&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING");
const json = await data.json();
setListOfRestaurants(json.data)
}
return ListOfRestaurants;
}

export default useBody