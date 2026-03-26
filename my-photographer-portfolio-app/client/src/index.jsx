import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./Assets/CSS/Style.css";
import { AuthProvider } from "./Context/AuthContext";
import { NotificationProvider } from "./Context/NotificationContext";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NotificationProvider>
      <AuthProvider>
        <App />
        <SpeedInsights />
        <Analytics />
      </AuthProvider>
    </NotificationProvider>
  </React.StrictMode>
);
