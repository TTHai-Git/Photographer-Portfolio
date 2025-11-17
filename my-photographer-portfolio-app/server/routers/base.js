import { Router } from "express";
import {
  welcomeToAPIsOfServer,
  welcomeToServer,
} from "../controllers/baseController.js";

const baseRoutes = new Router();

baseRoutes.get("/healthz", welcomeToServer);
baseRoutes.get("/v1/healthz", welcomeToAPIsOfServer);

export default baseRoutes;
