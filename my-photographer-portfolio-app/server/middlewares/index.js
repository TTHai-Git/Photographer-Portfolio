import express from "express";
import corsInit from "./cors.js";
import cookieParser from "cookie-parser";
export default function initMiddlewares(app) {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(corsInit());
}
