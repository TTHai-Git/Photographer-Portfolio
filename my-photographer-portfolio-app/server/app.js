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

// ✅ DEBUG: Log request headers (kiểm tra cookies trước khi đi vào routes)
app.use((req, res, next) => {
  console.log(`\n📨 Request: ${req.method} ${req.path}`);
  console.log(`   Origin: ${req.headers.origin || "❌ Missing"}`);
  console.log(`   Cookie header: ${req.headers.cookie || "❌ Missing"}`);
  console.log(`   Parsed cookies:`, req.cookies);
  next();
});

// Mount routes
app.use("/", routers);

export default app;
