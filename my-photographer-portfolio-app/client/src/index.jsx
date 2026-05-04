import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./Assets/CSS/Style.css";
import { AuthProvider } from "./Context/AuthContext";
import { NotificationProvider } from "./Context/NotificationContext";
import { lazy, Suspense } from "react";

const SpeedInsights = lazy(() =>
  import("@vercel/speed-insights/react").then((module) => ({
    default: module.SpeedInsights
  }))
);
const Analytics = lazy(() =>
  import("@vercel/analytics/react").then((module) => ({
    default: module.Analytics
  }))
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NotificationProvider>
      <AuthProvider>
        <App />
        <Suspense fallback={null}>
          <SpeedInsights />
          <Analytics />
        </Suspense>
      </AuthProvider>
    </NotificationProvider>
  </React.StrictMode>
);
