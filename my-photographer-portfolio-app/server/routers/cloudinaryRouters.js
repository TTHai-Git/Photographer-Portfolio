import express from "express";
import {
  getAllFolders,
  getImagesOnCloudinary,
  uploadImagesOnToCloudinary,
} from "../controllers/cloudinaryController.js";
import { upload } from "../middlewares/multerHandle.js";
import { ipRateCheck } from "../controllers/redisCloudControllers.js";
const cloudinaryRouters = express.Router();

cloudinaryRouters.get(
  "/",
  ipRateCheck({
    maxAttempts: 60,
    windowSeconds: 60,
    blockSeconds: 300,
  }),
  getImagesOnCloudinary
);
cloudinaryRouters.get(
  "/get-folders",
  ipRateCheck({
    maxAttempts: 60,
    windowSeconds: 60,
    blockSeconds: 300,
  }),
  getAllFolders
);
cloudinaryRouters.post(
  "/upload",
  ipRateCheck({
    maxAttempts: 10,
    windowSeconds: 60,
    blockSeconds: 600,
  }),
  upload.array("images", 20),
  uploadImagesOnToCloudinary
);

export default cloudinaryRouters;
