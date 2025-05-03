import { Home } from "lucide-react";
import { MapPinPlus } from "lucide-react";
import { useState } from "react";
import MapPanel from "./MapPanel";


const AddressSection = () => {
  const [isMapOpen, setisMapOpen] = useState(false);
  return (
    <div className="w-[320px] h-[220px] hover:shadow-lg border-1 border-gray-500/20">
      <div className="flex mx-5">
        <div>
          <MapPinPlus className="w-6 h-6 text-black mt-5 " />
        </div>
        <div className="ml-10 mt-5 ">
          <h3 className="font-semibold">Add New Address</h3>
          <span className="text-sm opacity-85">
            Sector 9, Khanda Colony, Panvel, Navi Mumbai, Maharashtra 410206,
            India (Satyam CHS)
          </span>
          <div>time</div>
          <div>
            <button
              className="px-7 py-2 bg-[#1BA672] mt-5 text-white"
              onClick={()=>setisMapOpen(true)}
            >
              ADD NEW
            </button>
            {isMapOpen && (
                <MapPanel
                 isMapOpen = {isMapOpen}
                 setisMapOpen = {setisMapOpen}
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
