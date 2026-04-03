import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import ShowCase from "./Pages/ShowCase";
import ProtectedRoute from "./Components/ProtectedRoute";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import About from "./Pages/About";
import VideoGallery from "./Pages/VideoGallery";
import Portrait from "./Pages/Portrait";
import Error400 from "./Pages/Error400";
import Error401 from "./Pages/Error401";
import Error404 from "./Pages/Error404";

function App() {
  const router = createBrowserRouter([
    {
      path: "/", // parent route
      element: <Layout />, // layout with header/footer
      children: [
        {
          index: true, // default child route
          element: <Home />,
        },
        {
          path: "login",
          element: <Login />,
        },
        // {
        //   path: "dashboard",
        //   element: <Dashboard />,
        // },
        // Nhóm trang CHỈ ADMIN mới vào được
        {
          element: <ProtectedRoute allowedRoles={["admin"]} />,
          children: [{ path: "dashboard", element: <Dashboard /> }],
        },
        {
          path: "my-project",
          element: <ShowCase />,
        },
        {
          path: "portrait",
          element: <Portrait />,
        },
        // {
        //   path: "animation",
        //   element: <VideoGallery />
        // },
        {
          path: "about",
          element: <About />,
        },
        {
          path: "error-400",
          element: <Error400 />,
        },
        {
          path: "error-401",
          element: <Error401 />,
        },
        {
          path: "error-404",
          element: <Error404 />,
        },
        // Wildcard route - bắt tất cả routes không tồn tại
        {
          path: "*",
          element: <Error404 />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
