import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import ShowCase from "./Pages/ShowCase";
import About from "./Pages/About";
import BoBai from "./Pages/BoBai";
import Cocktail from "./Pages/Cocktail";
import NguyenSac from "./Pages/NguyenSac";
import Social from "./Pages/Social";
import Motion from "./Pages/Motion";
import FruitMacro from "./Pages/FruitMacro";
import KinhBoi from "./Pages/KinhBoi";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",          // parent route
      element: <Layout />, // layout with header/footer
      children: [
        {
          index: true,     // default child route
          element: <Home />,
        },
        {
          path: "show-case",
          element: <ShowCase />,      
        },
        {
          path: "/show-case/cocktail",
          element: <Cocktail/>
        },
        {
          path: "/show-case/nguyen-sac",
          element: <NguyenSac/>
        },
        {
          path: "/show-case/bo-bai",
          element: <BoBai/>
        },
        {
          path: "/show-case/fruit-macro",
          element: <FruitMacro/>
        },
        {
          path: "/show-case/kinh-boi",
          element: <KinhBoi/>
        },
        {
          path: "social",
          element: <Social />,
        },
        {
          path: "motion",
          element: <Motion />,
        },
        {
          path: "about",
          element: <About />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
