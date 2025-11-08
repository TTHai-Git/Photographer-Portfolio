import { Router } from "express";
import { flushAll, flushDb } from "../controllers/redisCloudControllers.js";

const redisCloudRouters = Router();

if (process.env.REACT_APP_NODE_ENV === "development") {
  redisCloudRouters.get("/flush-db", flushDb);
  redisCloudRouters.get("/flush-all", flushAll);
}

export default redisCloudRouters;
