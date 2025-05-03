import MapComponent from './MapComponent';

const MapPanel = ({isMapOpen, setisMapOpen}) => {

    return(
        <div className={`fixed top-0 left-0 w-[575px] 
            h-full bg-white shadow-lg`}>

            <div className="mt-5 text-center">
            <div className="">
              <h2 className="font-bold text-xl">Save delivery address</h2>
            </div>
            <div className="mt-10 ">
            <MapComponent />
            </div>
            <div>
            </div>
            </div>
        </div>

    )
}

export default MapPanel