import express from "express";
import { getImagesOnCloudinary } from "../controllers/cloudinaryController.js";
const cloudinaryRouters = express.Router();

cloudinaryRouters.get("/", getImagesOnCloudinary);

export default cloudinaryRouters;
