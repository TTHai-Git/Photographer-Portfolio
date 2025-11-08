import cors from "cors";

const corsInit = () =>
  cors({
    origin: [
      process.env.REACT_APP_PUBLIC_URL_VERCEL_CLIENT,
      "http://localhost:3000",
      "http://localhost:8080",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  });

export default corsInit;
