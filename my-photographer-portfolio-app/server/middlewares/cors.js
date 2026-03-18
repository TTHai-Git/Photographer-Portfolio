import cors from "cors";

const corsInit = () =>
  cors({
    origin: [
      `${process.env.REACT_APP_PUBLIC_URL_VERCEL_CLIENT}`,
      "http://localhost:3000",
      "http://localhost:8080",
      "http://localhost:5000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length", "X-Content-Type"],

    maxAge: 86400,
    optionsSuccessStatus: 200,
  });

export default corsInit;
