const PopupWrapper = ({children, onClose}) => {
    return(
        
            <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
              <div className="relative bg-white w-[90%] max-w-md rounded-2xl shadow-xl p-6">
                <button
                  onClick={onClose}
                  className="absolute top-2 right-3 text-2xl font-bold text-gray-500 hover:text-black"
                >
                  ×
                </button>
                {children}
              </div>
            </div>
          
    
    )
}

export default PopupWrapper