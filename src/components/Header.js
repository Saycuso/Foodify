import { LOGO_URL } from "../utils/constants";
import {useState} from "react";
import { Link } from "react-router-dom";

const Header = () => { console.log("Render")
const [btnNameReact, ] = useState("Login");


    return (
      <div className="header">
        <div className="logo-container">
          <img
            className="logo"
            src = {LOGO_URL}
            alt="logo"
          />
        </div>
        <div className="nav_items">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><a href="">Cart</a></li>
            <button className="login" 
            onClick={()=>{
              btnNameReact == "Login"? SetbtnNameReact("Logout") : SetbtnNameReact("Login")
              console.log(btnNameReact)
              }}>
                {btnNameReact}
                </button>
          </ul>
        </div>
      </div>
    );
  };

  export default Header;