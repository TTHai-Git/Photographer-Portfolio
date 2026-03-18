import express from "express";
import corsInit from "./cors.js";
import cookieParser from "cookie-parser";

export default function initMiddlewares(app) {
  // ✅ Tăng JSON body limit từ 100KB lên 50MB để hỗ trợ iOS/Safari
  app.use(express.json({ limit: "50mb" }));

  // ✅ Tăng URL-encoded limit từ 16KB lên 50MB
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  app.use(cookieParser());
  app.use(corsInit());

  // ✅ Thêm error handler middleware cho parsing errors
  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).json({
        message: "Invalid JSON format",
        error: err.message,
      });
    }
    next(err);
  });
}
