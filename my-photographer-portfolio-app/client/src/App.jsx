import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout";
import ProtectedRoute from "./Components/ProtectedRoute";

const Home = lazy(() => import("./Pages/Home"));
const ShowCase = lazy(() => import("./Pages/ShowCase"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Login = lazy(() => import("./Pages/Login"));
const About = lazy(() => import("./Pages/About"));
const Portrait = lazy(() => import("./Pages/Portrait"));
const Error400 = lazy(() => import("./Pages/Error400"));
const Error401 = lazy(() => import("./Pages/Error401"));
const Error404 = lazy(() => import("./Pages/Error404"));

const withSuspense = (component) => (
  <Suspense fallback={<div className="route-skeleton">Loading...</div>}>
    {component}
  </Suspense>
);

function App() {
  const router = createBrowserRouter([
    {
      path: "/", // parent route
      element: <Layout />, // layout with header/footer
      children: [
        {
          index: true, // default child route
          element: withSuspense(<Home />),
        },
        {
          path: "login",
          element: withSuspense(<Login />),
        },
        // {
        //   path: "dashboard",
        //   element: <Dashboard />,
        // },
        // Nhóm trang CHỈ ADMIN mới vào được
        {
          element: <ProtectedRoute allowedRoles={["admin"]} />,
          children: [{ path: "dashboard", element: withSuspense(<Dashboard />) }],
        },
        {
          path: "my-project",
          element: withSuspense(<ShowCase />),
        },
        {
          path: "portrait",
          element: withSuspense(<Portrait />),
        },
        // {
        //   path: "animation",
        //   element: <VideoGallery />
        // },
        {
          path: "about",
          element: withSuspense(<About />),
        },
        {
          path: "error-400",
          element: withSuspense(<Error400 />),
        },
        {
          path: "error-401",
          element: withSuspense(<Error401 />),
        },
        {
          path: "error-404",
          element: withSuspense(<Error404 />),
        },
        // Wildcard route - bắt tất cả routes không tồn tại
        {
          path: "*",
          element: withSuspense(<Error404 />),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
