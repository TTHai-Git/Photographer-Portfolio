import express from "express";
import { createImages, getImages } from "../controllers/imageController.js";

const imageRouters = express.Router();

imageRouters.get("/", getImages);
imageRouters.post("/", createImages);

export default imageRouters;
