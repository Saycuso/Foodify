import { LOGO_URL } from "../utils/constants";
import { useState } from "react";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";


const Header = () => {
  const [btnNameReact, SetbtnNameReact] = useState("Login");

  return (
    <div className="flex justify-between bg-orange-100 shadow-lg">
      <div className="logo-container">
        <img className="w-30" src={LOGO_URL} alt="logo" />
      </div>
      <div className="flex items-center">
        <ul className="flex gap-x-5 mr-5 text-lg">
          <li className="px-2">
            Online {useOnlineStatus()?"🟢":"🔴"}
          </li>
          <li className="px-2 hover:text-orange-600">
            <Link to="/">Home</Link>
          </li>
          <li className="px-2 hover:text-orange-600">
            <Link to="/about">About Us</Link>
          </li>
          <li className="px-2 hover:text-orange-600">
            <Link to="/contact">Contact Us</Link>
          </li>
          <li className="px-2 hover:text-orange-600">
            <Link to="/grocery">Grocery</Link>
          </li>
          <li className="px-2 hover:text-orange-600">
            <a href="">Cart</a>
          </li>
          <li> 
            <button
            className="w-10"
            onClick={() => {
              btnNameReact == "Login"
                ? SetbtnNameReact("Logout")
                : SetbtnNameReact("Login");
              console.log(btnNameReact);
            }}
          >
            {btnNameReact}
          </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
