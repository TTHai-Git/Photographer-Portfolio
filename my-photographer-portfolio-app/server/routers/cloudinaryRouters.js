import express from "express";
import {
  getAllFolders,
  getImagesOnCloudinary,
  handleCreateFolder,
  handleDeleteFolders,
  handleDeleteImages,
  handleMoveImages,
  uploadImagesOnToCloudinary,
} from "../controllers/cloudinaryController.js";
import { upload } from "../middlewares/multerHandle.js";
import { ipRateCheck } from "../controllers/redisCloudControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
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
  authMiddleware,
  ipRateCheck({
    maxAttempts: 10,
    windowSeconds: 60,
    blockSeconds: 600,
  }),
  upload.array("images", 20),
  uploadImagesOnToCloudinary
);
cloudinaryRouters.delete(
  "/images/del",
  authMiddleware,
  ipRateCheck({
    maxAttempts: 10,
    windowSeconds: 60,
    blockSeconds: 600,
  }),
  handleDeleteImages
);
cloudinaryRouters.post(
  "/images/mov",
  authMiddleware,
  ipRateCheck({
    maxAttempts: 10,
    windowSeconds: 60,
    blockSeconds: 600,
  }),
  handleMoveImages
);
cloudinaryRouters.post(
  "/folders/cre",
  authMiddleware,
  ipRateCheck({
    maxAttempts: 10,
    windowSeconds: 60,
    blockSeconds: 600,
  }),
  handleCreateFolder
);
cloudinaryRouters.delete(
  "/folders/del",
  authMiddleware,
  ipRateCheck({
    maxAttempts: 10,
    windowSeconds: 60,
    blockSeconds: 600,
  }),
  handleDeleteFolders
);

export default cloudinaryRouters;
