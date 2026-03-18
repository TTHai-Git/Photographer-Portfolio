import { Router } from "express";
import { flushAll, flushDb } from "../controllers/redisCloudControllers.js";
import { isAdmin } from "../middlewares/authMiddleware.js";

const redisCloudRouters = Router();

redisCloudRouters.get("/flush-db", flushDb);
redisCloudRouters.get("/flush-all", flushAll);

export default redisCloudRouters;
