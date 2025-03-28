import React, {lazy} from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import Body from "./components/Body";
import { createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import About from "./components/About";
import Contact from "./components/Contact";
import Error from "./components/Error";
import RestaurantMenu from "./components/RestaurantMenu";


const Grocery = lazy(()=> import("./components/Grocery"))

const AppLayout = () => {
  return (
    <div className="app">
      <Header />
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
