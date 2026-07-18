import express from "express";
import {
  addMoreTagsForAssets,
  // AddFieldsToImage,
  // createImages,
  getEachImageOfEachFolder,
  getImages,
  removeTagsForAssets,
  replaceAllTagsForAssets
} from "../controllers/imageController.js";
import { isAdmin } from "../middlewares/authMiddleware.js";

const imageRouters = express.Router();

imageRouters.get("/", getImages);
imageRouters.get("/get-each-image-of-each-folder", getEachImageOfEachFolder);

imageRouters.put("/:assetId/tags", isAdmin, replaceAllTagsForAssets);
imageRouters.patch("/:assetId/tags", isAdmin, addMoreTagsForAssets);
imageRouters.delete("/:assetId/tags", isAdmin, removeTagsForAssets);

export default imageRouters;
