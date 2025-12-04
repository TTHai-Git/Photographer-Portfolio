import express from "express";
import cloudinaryRouters from "./cloudinaryRouters.js";
import redisCloudRouters from "./redisCloudRouter.js";
import baseRoutes from "./base.js";
import authRouters from "./auth.js";
import folderRouters from "./folderRouter.js";
import imageRouters from "./imageRouter.js";
const routers = express.Router();

routers.use("/", baseRoutes);
routers.use("/v1/cloudinaries", cloudinaryRouters);
routers.use("/v1/redisCloud", redisCloudRouters);
routers.use("/v1/auth", authRouters);
routers.use("/v1/folders", folderRouters);
routers.use("/v1/images", imageRouters);

export default routers;
