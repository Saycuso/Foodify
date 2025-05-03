import {
  MapContainer,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import debounce from "lodash.debounce"; // Import debounce

const CenterMarker = ({ setCenter }) => {
  const map = useMapEvents({
    move: () => {
      const center = map.getCenter();
      setCenter([center.lat, center.lng]);
    },
  });
  return null;
};

const MapComponent = () => {
  const [center, setCenter] = useState([19.033, 73.0297]);
  const [address, setAddress] = useState("Address hhaha");
 // const apikey = "1c240b3ee72141698cd3bdc9d048e668";
  const apikey = "d7e2abeb8db14de4ab88c00e8a3d8565";

const updateAddress = debounce((lat,lng) => {
  fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=1c240b3ee72141698cd3bdc9d048e668`)
  .then((response)=> {
    console.log('Response:', response);
    if(!response.ok){
      throw new Error(`Network response was not ok: ${response.statusText}`)
    }
    return response.json()
  })
  .then((data)=> {
    console.log('Data:', data); // Log the data object to see what we're receiving
    console.log(data.results[0].formatted);
    if(data.result && data.results.length>0){
      setAddress(data.results[0].formatted)
     } else {
      setAddress("Address not found")
     }
  })
  .catch((error)=> {
    console.error("Error fetching address:", error);
    setAddress("Error fetching address");
  });
}, 1000);

useEffect(()=>{
  updateAddress(center[0], center[1]); 
}, [center]);


  return (
    <div className="relative w-full h-[300px]">
      <MapContainer
        center={[19.033, 73.0297]} // Panvel Navi Mumbai area as example
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "300px", width: "80%", margin: "0 auto"  }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CenterMarker setCenter={setCenter} />
      </MapContainer>
      {/* Center Pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100%] z-[999]">
        <img
          src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
          alt="pin"
          className="w-8 h-8"
        />
      </div>
      {/* Address Field */}
      <div className="mt-2">
        <input 
        type="text"
        value={address}
        readOnly
        className="w-full p-2 border-gray border-gray-400 rounded"/> 
      </div>
    </div>
  );
};

export default MapComponent;
