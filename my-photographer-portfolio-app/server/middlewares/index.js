import express from "express";
import corsInit from "./cors.js";

export default function initMiddlewares(app) {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(corsInit());
}
