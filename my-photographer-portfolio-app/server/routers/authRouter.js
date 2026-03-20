import express from "express";
import {
  createAcount,
  login,
  logout,
  refreshToken
} from "../controllers/authController.js";
import { isAdmin } from "../middlewares/authMiddleware.js";
import { ipRateCheck } from "../controllers/redisCloudControllers.js";

const authRouters = express.Router();
authRouters.post(
  "/register",
  ipRateCheck({
    maxAttempts: 5,
    windowSeconds: 60,
    blockSeconds: 300
  }),
  isAdmin,
  createAcount
);
authRouters.post(
  "/login",
  ipRateCheck({
    maxAttempts: 5,
    windowSeconds: 60,
    blockSeconds: 300
  }),
  login
);
authRouters.post("/logout", isAdmin, logout);
authRouters.post("/refresh-token", refreshToken);

export default authRouters;
