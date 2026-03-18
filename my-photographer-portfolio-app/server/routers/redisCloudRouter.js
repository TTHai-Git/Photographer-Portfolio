import { Router } from "express";
import { flushAll, flushDb } from "../controllers/redisCloudControllers.js";
import { isAdmin } from "../middlewares/authMiddleware.js";

const redisCloudRouters = Router();

redisCloudRouters.get("/flush-db", isAdmin, flushDb);
redisCloudRouters.get("/flush-all", isAdmin, flushAll);

export default redisCloudRouters;
