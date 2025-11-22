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
import UploadForm from "./Components/UploadForm"


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
          path: "/show-case/verdant-cocktail-bar",
          element: <Cocktail/>
        },
        {
          path: "/show-case/nguyen-sac-candle",
          element: <NguyenSac/>
        },
        {
          path: "/show-case/ghien-mysteri-deep-connection-card",
          element: <BoBai/>
        },
        {
          path: "/show-case/macro",
          element: <FruitMacro/>
        },
        {
          path: "/show-case/swimming-equipment",
          element: <KinhBoi/>
        },
        {
          path:"upload",
          element: <UploadForm/>
        }
        // {
        //   path: "social",
        //   element: <Social />,
        // },
        // {
        //   path: "motion",
        //   element: <Motion />,
        // },
        // {
        //   path: "about",
        //   element: <About />,
        // },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
