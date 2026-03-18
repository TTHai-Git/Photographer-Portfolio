import express from "express";
import routers from "./routers/index.js";
import "./config/dotenv.config.js"; // ✅ loads environment variables once
import { testRedisCloud } from "./utils/testRedisCloud.js";
import initMiddlewares from "./middlewares/index.js";
import handleConnectToMongoDB from "./config/mongodb.config.js";

const app = express();
app.set("trust proxy", 1);

// Connect DB
handleConnectToMongoDB();

// Test Connect Redis Cloud
testRedisCloud();

// Initialize middlewares
initMiddlewares(app);

// Mount routes
app.use("/", routers);

// ✅ Global error handler - phải đặt ở cuối cùng
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  // Nếu response đã được gửi, không gửi lại
  if (res.headersSent) {
    return next(err);
  }

  // Mặc định lỗi 500
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { error: err.toString() }),
  });
});

export default app;
