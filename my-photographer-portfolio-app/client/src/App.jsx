import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import ShowCase from "./Pages/ShowCase";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import About from "./Pages/About";
import VideoGallery from "./Pages/VideoGallery";

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
          path: "login",
          element: <Login/>
        },
        {
          path: "dashboard",
          element: <Dashboard/>
        },
        {
          path: "my-project",
          element: <ShowCase />,      
        },
        {
          path: "animation",
          element: <VideoGallery />,      
        },
        {
          path: "about",
          element: <About />
        }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
