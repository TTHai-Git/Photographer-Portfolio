import express from "express";
import routers from "./routers/index.js";
import "./config/dotenv.config.js"; // ✅ loads environment variables once
import { testRedisCloud } from "./utils/testRedisCloud.js";
import initMiddlewares from "./middlewares/index.js";

const app = express();
app.set("trust proxy", 1);

// Test Connect Redis Cloud
testRedisCloud();

// Initialize middlewares
initMiddlewares(app);

// Mount routes
app.use("/", routers);

export default app;
