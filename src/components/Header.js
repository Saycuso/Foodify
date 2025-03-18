import { LOGO_URL } from "../utils/constants";
import {useState, useEffect} from "react";

const Header = () => { console.log("Render")
const [btnNameReact, SetbtnNameReact] = useState("Login");


  useEffect(()=>{
     console.log("useEffect called")
  }, [btnNameReact])

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
            <li>Home</li>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Cart</li>
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