import express from "express";
import {
  // createFolders,
  getFolders,
  getFoldersForCombobox,
} from "../controllers/folderController.js";

const folderRouters = express.Router();

folderRouters.get("/", getFolders);
folderRouters.get("/all", getFoldersForCombobox);
// folderRouters.post("/", createFolders);

export default folderRouters;
