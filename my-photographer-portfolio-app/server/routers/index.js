import express from "express";
import cloudinaryRouters from "./cloudinaryRouters.js";
import redisCloudRouters from "./redisCloudRouter.js";
import baseRoutes from "./base.js";
import authRouters from "./auth.js";
const routers = express.Router();

routers.use("/", baseRoutes);
routers.use("/v1/cloudinaries", cloudinaryRouters);
routers.use("/v1/redisCloud", redisCloudRouters);
routers.use("/v1/auth", authRouters);

export default routers;
