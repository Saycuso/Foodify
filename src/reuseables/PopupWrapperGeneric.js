const PopupWrapper = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="relative bg-white w-[600px] h-[620px] rounded-2xl shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-2xl font-bold text-gray-500 hover:text-black"
        >
          ×
        </button>

        {/* Content wrapper */}
        <div className="h-full flex flex-col">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 pt-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupWrapper