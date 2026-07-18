import express from "express";
import {
  // createFolders,
  getFolders,
  getFoldersForCombobox,
  reorderFolders
} from "../controllers/folderController.js";
import { isAdmin } from "../middlewares/authMiddleware.js";

const folderRouters = express.Router();

folderRouters.get("/", getFolders);
folderRouters.get("/all", getFoldersForCombobox);
folderRouters.put("/reorder", isAdmin, reorderFolders);
// folderRouters.post("/", createFolders);

export default folderRouters;
