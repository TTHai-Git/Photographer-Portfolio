import express from "express";
import { getMe, login, logout, refreshToken } from "../controllers/auth.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { ipRateCheck } from "../controllers/redisCloudControllers.js";

const authRouters = express.Router();
authRouters.post(
  "/login",
  ipRateCheck({
    maxAttempts: 5,
    windowSeconds: 60,
    blockSeconds: 300,
  }),
  login
);
authRouters.post("/logout", authMiddleware, logout);
authRouters.get(
  "/me",
  ipRateCheck({
    maxAttempts: 10,
    windowSeconds: 60,
    blockSeconds: 600,
  }),
  authMiddleware,
  getMe
);
authRouters.post(
  "/refresh-token",
  ipRateCheck({
    maxAttempts: 10,
    windowSeconds: 60,
    blockSeconds: 600,
  }),
  authMiddleware,
  refreshToken
);

export default authRouters;
