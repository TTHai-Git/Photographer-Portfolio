import express from "express";
import {
  // getFoldersOnCloudinary,
  // getImagesOnCloudinary,
  handleCreateFolder,
  handleDeleteFolders,
  handleDeleteImages,
  handleMoveImages,
  uploadImagesOnToCloudinary,
} from "../controllers/cloudinaryController.js";
import { upload } from "../middlewares/multerHandle.js";
import { ipRateCheck } from "../controllers/redisCloudControllers.js";
import { isAdmin } from "../middlewares/authMiddleware.js";
const cloudinaryRouters = express.Router();

// cloudinaryRouters.get(
//   "/",
//   ipRateCheck({
//     maxAttempts: 60,
//     windowSeconds: 60,
//     blockSeconds: 300,
//   }),
//   getImagesOnCloudinary
// );
// cloudinaryRouters.get(
//   "/get-folders",
//   ipRateCheck({
//     maxAttempts: 60,
//     windowSeconds: 60,
//     blockSeconds: 300,
//   }),
//   getFoldersOnCloudinary
// );
cloudinaryRouters.post(
  "/upload",
  isAdmin,
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
  isAdmin,
  ipRateCheck({
    maxAttempts: 10,
    windowSeconds: 60,
    blockSeconds: 600,
  }),
  handleDeleteImages
);
cloudinaryRouters.post(
  "/images/mov",
  isAdmin,
  ipRateCheck({
    maxAttempts: 10,
    windowSeconds: 60,
    blockSeconds: 600,
  }),
  handleMoveImages
);
cloudinaryRouters.post(
  "/folders/cre",
  isAdmin,
  ipRateCheck({
    maxAttempts: 10,
    windowSeconds: 60,
    blockSeconds: 600,
  }),
  handleCreateFolder
);
cloudinaryRouters.delete(
  "/folders/del",
  isAdmin,
  ipRateCheck({
    maxAttempts: 10,
    windowSeconds: 60,
    blockSeconds: 600,
  }),
  handleDeleteFolders
);

export default cloudinaryRouters;
