import express from "express";
import { createFolders, getFolders } from "../controllers/folderController.js";

const folderRouters = express.Router();

folderRouters.get("/", getFolders);
folderRouters.post("/", createFolders);

export default folderRouters;
