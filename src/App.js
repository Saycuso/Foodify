import React, {lazy} from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import Body from "./components/Body";
import { createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import About from "./components/About";
import Contact from "./components/Contact";
import Error from "./components/Error";
import Cart from "./components/Cart";
import RestaurantMenu from "./components/RestaurantMenu";
import { useLocation } from "react-router-dom";
import 'leaflet/dist/leaflet.css';



const Grocery = lazy(()=> import("./components/Grocery"))

const AppLayout = () => {
  const location = useLocation();
  const isCartPage = location.pathname === "/Cart"
  return (
    <div className="app">
      {!isCartPage && <Header />}
      <Outlet />  {/* 👈 This tells React where to render child routes */}
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout/>,
    errorElement:<Error/>,
    children:[
      {
        path:"/",
        element: <Body />

      },
      {
        path: "/about",
        element: <About />,
        
      },
      {
        path: "/contact",
        element: <Contact/>
      },
      {
        path: "/grocery",
        element: <Grocery/>
      },
      {
        path: "/restaurants/:resId",
        element: <RestaurantMenu/>
      },
      {
        path: "/Cart",
        element: <Cart/>
      }
    ]
  }, 
  
],
{
  future: {
    v7_relativeSplatPath: true,  // 👈 Add this to remove the warning
  },
}
)

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={appRouter} />);
