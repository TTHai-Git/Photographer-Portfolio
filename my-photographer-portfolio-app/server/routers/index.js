import express from "express";
import cloudinaryRouters from "./cloudinaryRouter.js";
import redisCloudRouters from "./redisCloudRouter.js";
import baseRoutes from "./baseRouter.js";
import authRouters from "./authRouter.js";
import folderRouters from "./folderRouter.js";
import imageRouters from "./imageRouter.js";
import roleRouters from "./roleRouter.js";
const routers = express.Router();

routers.use("/", baseRoutes);
routers.use("/v1/cloudinaries", cloudinaryRouters);
routers.use("/v1/redisCloud", redisCloudRouters);
routers.use("/v1/auth", authRouters);
routers.use("/v1/folders", folderRouters);
routers.use("/v1/images", imageRouters);
routers.use("/v1/roles", roleRouters);

export default routers;
