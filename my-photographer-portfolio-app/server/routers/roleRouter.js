import { Router } from "express";
import {
  createRole,
  deleteRole,
  getRoles,
  updateRole,
} from "../controllers/roleController.js";
import { isAdmin } from "../middlewares/authMiddleware.js";

const roleRouters = new Router();
roleRouters.get("/", isAdmin, getRoles);
roleRouters.post("/", isAdmin, createRole);
roleRouters.delete("/:id", isAdmin, deleteRole);
roleRouters.put("/:id", isAdmin, updateRole);
export default roleRouters;
