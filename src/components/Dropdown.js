import { useState } from "react";

const Dropdown = ({title, children}) => {
    const[isOpen, setisOpen] = useState(false);

    return (
        <div className="dropdown">
            <h3 onClick={()=> setisOpen(!isOpen)}>
                {title} {isOpen ? "▲" : "▼" }
            </h3>
            {isOpen && <div className="dropdown-content">{children}</div>
            }
        </div>
    )

}

export default Dropdown;