import cors from "cors";

const corsInit = () =>
  cors({
    origin: [
      process.env.REACT_APP_PUBLIC_URL_VERCEL_CLIENT,
      "http://localhost:3000",
      "http://localhost:8080",
      "http://localhost:5000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    // ✅ Thêm các header được phép cho iOS/Safari
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
    ],
    exposedHeaders: ["Content-Length", "X-Content-Type"],
    maxAge: 86400, // Cache preflight requests trong 24 giờ
  });

export default corsInit;
