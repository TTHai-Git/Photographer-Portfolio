import { Router } from "express";
import {
  getTags,
  createTag,
  deleteTag,
  updateTag
} from "../controllers/tagController.js";
import { isAdmin } from "../middlewares/authMiddleware.js";

const tagRouters = new Router();
tagRouters.get("/", getTags);
tagRouters.post("/", isAdmin, createTag);
tagRouters.delete("/:tagId", isAdmin, deleteTag);
tagRouters.put("/:tagId", isAdmin, updateTag);

export default tagRouters;
