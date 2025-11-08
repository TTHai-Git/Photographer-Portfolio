import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: process.env.PORT || 8080,
  CLIENT_URLS: [
    process.env.REACT_APP_PUBLIC_URL_VERCEL_CLIENT,
    "http://localhost:3000",
    "http://localhost:8080",
  ],
};
