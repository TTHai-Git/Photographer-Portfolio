import express from "express";
import {
  // AddFieldsToImage,
  // createImages,
  getEachImageOfEachFolder,
  getImages,
} from "../controllers/imageController.js";

const imageRouters = express.Router();

imageRouters.get("/", getImages);
imageRouters.get("/get-each-image-of-each-folder", getEachImageOfEachFolder);

export default imageRouters;
