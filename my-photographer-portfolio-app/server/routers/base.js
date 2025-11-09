import { Router } from "express";
import {
  welcomeToAPIsOfServer,
  welcomeToServer,
} from "../controllers/baseController.js";

const baseRoutes = new Router();

baseRoutes.get("/", welcomeToServer);
baseRoutes.get("/v1", welcomeToAPIsOfServer);

export default baseRoutes;
