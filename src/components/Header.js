import { LOGO_URL } from "../utils/constants";
import { useState } from "react";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [btnNameReact, SetbtnNameReact] = useState("Login");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const onlineStatus = useOnlineStatus();

  return (
    <div className=" flex justify-between items-center bg-orange-100 shadow-lg px-4 py-2">
      {/*Logo*/}
      <div className="flex-1 logo-container">
        <img className="w-30" src={LOGO_URL} alt="logo" />
      </div>
      {/* Desktop Nav */}
      <div className="flex-1 hidden md:flex items-center">
        <ul className="flex gap-x-9 text-xl items-center">
          <li>Online {onlineStatus ? "🟢" : "🔴"}</li>
          <li className="hover:text-orange-600">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-orange-600">
            <Link to="/about">About Us</Link>
          </li>
          <li className="hover:text-orange-600">
            <Link to="/contact">Contact Us</Link>
          </li>
          <li className="hover:text-orange-600">
            <Link to="/grocery">Grocery</Link>
          </li>
          <li className="hover:text-orange-600">
            <Link to="/Cart">Cart</Link>
          </li>
          <li>
            <button
              onClick={() => {
                btnNameReact == "Login"
                  ? SetbtnNameReact("Logout")
                  : SetbtnNameReact("Login");
              }}
              className="hover:text-orange-600"
            >
              {btnNameReact}
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-orange-100 shadow-lg md:hidden">
          <ul className="flex flex-col items-center gap-4 py-4 text-lg">
            <li>Online {onlineStatus ? "🟢" : "🔴"}</li>
            <li>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/grocery" onClick={() => setIsMenuOpen(false)}>
                Grocery
              </Link>
            </li>
            <li>
              <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                Cart
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  btnNameReact === "Login"
                    ? SetbtnNameReact("Logout")
                    : SetbtnNameReact("Login");
                  setIsMenuOpen(false);
                }}
              >
                {btnNameReact}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
