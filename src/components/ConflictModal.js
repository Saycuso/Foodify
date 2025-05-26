import { useState } from "react";

const ConflictModal = ({ onConfirm, onCancel }) => {
    // const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="fixed inset-0 bg-opacity-5 flex items-center justify-center p-4 font-sans z-50">
            {/* Using arbitrary value for box-shadow directly in className */}
            {/* Increased the opacity of the shadow color from 0.15 to 0.3 to make it darker */}
            <div className="bg-white p-[30px] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] max-w-[520px] w-full text-center">
                {/* Modal Title - bold and slightly larger */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Items already in cart
                </h2>
                {/* Modal Message - clear and concise */}
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    Your cart contains items from other restaurant. Would you like to reset
                    your cart for adding items from this restaurant ?
                </p>

                {/* `flex-col sm:flex-row` makes buttons stack vertically on small screens
                    and align horizontally on larger ones.
                    `justify-end` aligns them to the right, similar to the image. */}
                <div className="flex flex-col sm:flex-row justify-end gap-35">
                    <button
                        onClick={onCancel}
                        className="flex-1 sm:flex-none px-6 py-3 rounded-lg border border-green-500 text-green-500 font-semibold hover:bg-green-100 transition-colors duration-200"
                    >
                        NO
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 sm:flex-none px-6 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors duration-200"
                    >
                        YES, START AFRESH
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConflictModal;
